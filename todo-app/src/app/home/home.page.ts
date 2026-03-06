import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Task } from '../core/models/task.model';
import { TaskFacade } from '../presentation/state/task.facade';
import { Category } from '../core/models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
})
export class HomePage implements OnInit {
  tasks$!: Observable<Task[]>;
  filteredTasks$!: Observable<Task[]>;

  newTitle = '';
  newCategoryId: string | null = 'work';

  categories: Category[] = [
    { id: 'work', name: 'Trabajo' },
    { id: 'personal', name: 'Personal' },
    { id: 'study', name: 'Estudio' },
    { id: 'home', name: 'Hogar' },
  ];

  // null = "Todas"
  private selectedCategoryIdSubject = new BehaviorSubject<string | null>(null);

  constructor(private taskFacade: TaskFacade) {}

  async ngOnInit(): Promise<void> {
    await this.taskFacade.init();
    this.tasks$ = this.taskFacade.tasks$;

    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.selectedCategoryIdSubject.asObservable(),
    ]).pipe(
      map(([tasks, selectedCategoryId]) => {
        if (!selectedCategoryId) return tasks;
        return tasks.filter(t => t.categoryId === selectedCategoryId);
      })
    );
  }

  trackByTaskId(_: number, task: Task): string {
    return task.id;
  }

  async onAdd(): Promise<void> {
    const title = this.newTitle.trim();
    if (!title) return;

    await this.taskFacade.addTask(title, this.newCategoryId);
    this.newTitle = '';
  }

  onFilterCategoryChange(categoryId: string | null): void {
    this.selectedCategoryIdSubject.next(categoryId);
  }

  getCategoryName(categoryId: string | null): string {
    if (!categoryId) return 'Sin categoría';
    return this.categories.find(c => c.id === categoryId)?.name ?? 'Sin categoría';
  }

  async onToggle(taskId: string): Promise<void> {
    await this.taskFacade.toggleTask(taskId);
  }

  async onDelete(taskId: string): Promise<void> {
    await this.taskFacade.deleteTask(taskId);
  }
}