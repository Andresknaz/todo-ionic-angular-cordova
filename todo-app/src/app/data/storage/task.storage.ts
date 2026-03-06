import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../../core/models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskStorage {
  private static readonly KEY = 'TASKS_V1';
  private _storageReady = false;

  constructor(private storage: Storage) {}

  private async ensureReady(): Promise<void> {
    if (this._storageReady) return;
    await this.storage.create();
    this._storageReady = true;
  }

  async loadTasks(): Promise<Task[]> {
    await this.ensureReady();
    const tasks = await this.storage.get(TaskStorage.KEY);
    return Array.isArray(tasks) ? (tasks as Task[]) : [];
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    await this.ensureReady();
    await this.storage.set(TaskStorage.KEY, tasks);
  }

  async clear(): Promise<void> {
    await this.ensureReady();
    await this.storage.remove(TaskStorage.KEY);
  }
}