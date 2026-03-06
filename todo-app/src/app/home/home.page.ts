import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonBadge,
  IonChip,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';

import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { Task } from '../core/models/task.model';
import { Category } from '../core/models/category.model';

import { TaskFacade } from '../presentation/state/task.facade';
import {
  RemoteConfigService,
  FeatureFlags,
} from '../data/firebase/remote-config.service';

import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';

type StatusFilter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonCard,
    IonCardContent,

    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,

    IonButtons,
    IonButton,
    IonBadge,
    IonIcon,
    IonChip,

    IonSegment,
    IonSegmentButton,

    IonList,
    IonCheckbox,

    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ],
})
export class HomePage implements OnInit {
  newTitle = '';
  newCategoryId: string | null = 'work';

  categories: Category[] = [
    { id: 'work', name: 'Trabajo' },
    { id: 'personal', name: 'Personal' },
    { id: 'study', name: 'Estudio' },
    { id: 'home', name: 'Hogar' },
  ];

  tasks$!: Observable<Task[]>;
  filteredTasks$!: Observable<Task[]>;
  flags$!: Observable<FeatureFlags>;

  private selectedCategoryIdSubject = new BehaviorSubject<string | null>(null);
  private statusFilterSubject = new BehaviorSubject<
    'all' | 'active' | 'completed'
  >('all');

  setStatusFilter(value: any): void {
    const v = String(value ?? 'all');
    const safe: StatusFilter = v === 'active' || v === 'completed' ? v : 'all';
    this.statusFilterSubject.next(safe);
  }

  constructor(
    private taskFacade: TaskFacade,
    private remoteConfig: RemoteConfigService,
  ) {
    addIcons({ addOutline, trashOutline });
  }

  async ngOnInit(): Promise<void> {
    this.flags$ = this.remoteConfig.flags$;

    await this.remoteConfig.init();

    await this.taskFacade.init();
    this.tasks$ = this.taskFacade.tasks$;

    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.selectedCategoryIdSubject.asObservable(),
      this.statusFilterSubject.asObservable(),
    ]).pipe(
      map(([tasks, selectedCategoryId, status]) => {
        let result = tasks;

        if (selectedCategoryId) {
          result = result.filter((t) => t.categoryId === selectedCategoryId);
        }

        if (status === 'active') {
          result = result.filter((t) => !t.completed);
        } else if (status === 'completed') {
          result = result.filter((t) => t.completed);
        }

        return result;
      }),
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

  onStatusFilterChange(value: StatusFilter): void {
    this.statusFilterSubject.next(value);
  }

  getCategoryName(categoryId: string | null): string {
    if (!categoryId) return 'Sin categoría';
    return (
      this.categories.find((c) => c.id === categoryId)?.name ?? 'Sin categoría'
    );
  }

  async onToggle(taskId: string): Promise<void> {
    await this.taskFacade.toggleTask(taskId);
  }

  async onDelete(taskId: string): Promise<void> {
    await this.taskFacade.deleteTask(taskId);
  }
}
