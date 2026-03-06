import { FormsModule } from '@angular/forms';
import { IonInput } from '@ionic/angular/standalone';

import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
} from '@ionic/angular/standalone';

import { Observable } from 'rxjs';
import { Task } from '../core/models/task.model';
import { TaskFacade } from '../presentation/state/task.facade';

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
  ],
})
export class HomePage implements OnInit {
  tasks$!: Observable<Task[]>;
  newTitle = '';

  constructor(private taskFacade: TaskFacade) {}

  async ngOnInit(): Promise<void> {
    await this.taskFacade.init();
    this.tasks$ = this.taskFacade.tasks$;
  }

  trackByTaskId(_: number, task: Task): string {
    return task.id;
  }
  
  async onAdd(): Promise<void> {
  const title = this.newTitle.trim();
  if (!title) return;

  await this.taskFacade.addTask(title, null);
  this.newTitle = '';
}

  async onToggle(taskId: string): Promise<void> {
    await this.taskFacade.toggleTask(taskId);
  }

  async onDelete(taskId: string): Promise<void> {
    await this.taskFacade.deleteTask(taskId);
  }
}
