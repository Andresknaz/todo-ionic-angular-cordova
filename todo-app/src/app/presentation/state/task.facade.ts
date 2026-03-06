import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../core/models/task.model';
import { TaskRepositoryImpl } from '../../data/repositories/task.repository.impl';

@Injectable({ providedIn: 'root' })
export class TaskFacade {
  constructor(private repo: TaskRepositoryImpl) {}

  get tasks$(): Observable<Task[]> {
    return this.repo.tasks$;
  }

  async init(): Promise<void> {
    await this.repo.init();
  }

  async addTask(title: string, categoryId: string | null): Promise<void> {
    await this.repo.add(title, categoryId);
  }

  async toggleTask(taskId: string): Promise<void> {
    await this.repo.toggle(taskId);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.repo.remove(taskId);
  }

  async clearAll(): Promise<void> {
    await this.repo.clear();
  }
}