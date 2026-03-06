import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../core/models/task.model';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskStorage } from '../storage/task.storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class TaskRepositoryImpl implements TaskRepository {
  private readonly _tasks$ = new BehaviorSubject<Task[]>([]);
  readonly tasks$ = this._tasks$.asObservable();

  private _initialized = false;

  constructor(private taskStorage: TaskStorage) {}

  async init(): Promise<void> {
    if (this._initialized) return;
    const tasks = await this.taskStorage.loadTasks();
    this._tasks$.next(tasks);
    this._initialized = true;
  }

  async add(title: string, categoryId: string | null): Promise<void> {
    await this.init();

    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: uuidv4(),
      title: trimmed,
      completed: false,
      categoryId,
      createdAt: Date.now(),
    };

    const updated = [newTask, ...this._tasks$.value];
    this._tasks$.next(updated);
    await this.taskStorage.saveTasks(updated);
  }

  async toggle(taskId: string): Promise<void> {
    await this.init();

    const updated = this._tasks$.value.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    this._tasks$.next(updated);
    await this.taskStorage.saveTasks(updated);
  }

  async remove(taskId: string): Promise<void> {
    await this.init();

    const updated = this._tasks$.value.filter(t => t.id !== taskId);
    this._tasks$.next(updated);
    await this.taskStorage.saveTasks(updated);
  }

  async clear(): Promise<void> {
    await this.init();
    this._tasks$.next([]);
    await this.taskStorage.clear();
  }
}