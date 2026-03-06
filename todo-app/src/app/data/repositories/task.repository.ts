import { Observable } from 'rxjs';
import { Task } from '../../core/models/task.model';

export interface TaskRepository {
  tasks$: Observable<Task[]>;

  init(): Promise<void>;

  add(title: string, categoryId: string | null): Promise<void>;
  toggle(taskId: string): Promise<void>;
  remove(taskId: string): Promise<void>;
  clear(): Promise<void>;
}