import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Task, TaskStatus } from '../models/task.model';
import { TaskService } from './task.service';

/**
 * [Orthogonality] Task State Service (Mini-Store)
 * 
 * Separates "State Management" from "Data Access".
 * - TaskService: Knows how to talk to the backend (or mock).
 * - TaskStateService: Knows how to hold data in memory and notify the UI.
 * 
 * UI Components listen to this service, NOT the raw data service.
 * This makes the UI orthogonal to the API implementation.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  private taskService = inject(TaskService);

  // Source of Truth
  private _tasks = new BehaviorSubject<Task[]>([]);
  private _loading = new BehaviorSubject<boolean>(false);
  private _filterStatus = new BehaviorSubject<TaskStatus | 'ALL'>('ALL');

  // Exposed Selectors
  readonly loading$ = this._loading.asObservable();
  
  // Computed State (Derived Stream)
  // [Deliberate Programming] explicit reactive flow
  readonly tasks$ = combineLatest([
    this._tasks.asObservable(),
    this._filterStatus.asObservable()
  ]).pipe(
    map(([tasks, status]) => {
      if (status === 'ALL') return tasks;
      return tasks.filter(t => t.status === status);
    }),
    shareReplay(1)
  );

  constructor() {
    this.loadAll();
  }

  loadAll() {
    this._loading.next(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this._tasks.next(tasks);
        this._loading.next(false);
      },
      error: (err) => {
        console.error(err);
        this._loading.next(false);
      }
    });
  }

  addTask(title: string, priority: Task['priority']) {
    this._loading.next(true);
    this.taskService.createTask(title, priority).subscribe({
      next: (newTask) => {
        const current = this._tasks.value;
        this._tasks.next([...current, newTask]);
        this._loading.next(false);
      },
      error: (err) => {
        console.error(err); // In real app, expose error stream
        this._loading.next(false);
      }
    });
  }

  updateStatus(taskId: string, status: TaskStatus) {
    // Optimistic Update (Optional) or Wait-and-Update
    this.taskService.updateStatus(taskId, status).subscribe({
      next: (updatedTask) => {
        const current = this._tasks.value;
        const index = current.findIndex(t => t.id === taskId);
        if (index !== -1) {
          // Immutable update
          const newTasks = [...current];
          newTasks[index] = updatedTask;
          this._tasks.next(newTasks);
        }
      }
    });
  }

  setFilter(status: TaskStatus | 'ALL') {
    this._filterStatus.next(status);
  }
}
