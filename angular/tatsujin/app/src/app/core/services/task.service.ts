import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Task, TaskStatus } from '../models/task.model';

/**
 * [DbC] Task Data Service
 * 
 * Responsible for CRUD operations with strict contract enforcement.
 * "Garbage In, Error Out" - We do not accept invalid data.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Mock Database
  private tasks: Task[] = [
    { 
      id: '1', 
      title: 'Learn Angular Orthogonality', 
      status: 'DONE', 
      priority: 'HIGH', 
      createdAt: new Date() 
    },
    { 
      id: '2', 
      title: 'Implement Task Service with DbC', 
      status: 'IN_PROGRESS', 
      priority: 'HIGH', 
      createdAt: new Date() 
    }
  ];

  getTasks(): Observable<Task[]> {
    return of([...this.tasks]).pipe(delay(500));
  }

  createTask(title: string, priority: Task['priority']): Observable<Task> {
    // [Precondition] Title must not be empty
    if (!title || title.trim().length === 0) {
      return throwError(() => new Error('[Contract Violation] Title cannot be empty'));
    }

    const newTask: Task = {
      id: crypto.randomUUID(), // Modern browser API
      title: title.trim(),
      status: 'TODO',
      priority,
      createdAt: new Date()
    };

    this.tasks.push(newTask);
    return of(newTask).pipe(delay(400));
  }

  updateStatus(id: string, newStatus: TaskStatus): Observable<Task> {
    const task = this.tasks.find(t => t.id === id);
    
    // [Precondition] Task must exist
    if (!task) {
      return throwError(() => new Error('[Contract Violation] Task not found'));
    }

    // [Invariant Check] (Example) Cannot move from DONE back to TODO
    if (task.status === 'DONE' && newStatus === 'TODO') {
      return throwError(() => new Error('[Business Rule] Cannot reopen a done task'));
    }

    task.status = newStatus;
    return of({ ...task }).pipe(delay(300));
  }

  deleteTask(id: string): Observable<void> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return throwError(() => new Error('Task not found'));
    }
    
    this.tasks.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
