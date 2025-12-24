import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskStateService } from '../../../core/services/task-state.service';
import { TaskItemComponent } from '../../task-item/task-item.component';
import { TaskStatus } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent],
  template: `
    <div class="task-page">
      <header class="page-header">
        <h2>My Tasks</h2>
        
        <div class="controls">
          <input 
            #titleInput
            type="text" 
            placeholder="New Task Title" 
            (keyup.enter)="addTask(titleInput.value); titleInput.value = ''"
          >
          <button class="primary" (click)="addTask(titleInput.value); titleInput.value = ''">Add</button>
          
          <select [ngModel]="currentFilter" (ngModelChange)="onFilterChange($event)">
            <option value="ALL">All</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </header>

      <div class="loading-bar" *ngIf="state.loading$ | async">
        <div class="indeterminate"></div>
      </div>

      <!-- [Deliberate] Async Pipe handles subscription management -->
      <div class="task-grid" *ngIf="state.tasks$ | async as tasks">
        <app-task-item
          *ngFor="let task of tasks"
          [task]="task"
          (complete)="onComplete(task.id)"
          (delete)="onDelete(task.id)"
        ></app-task-item>
        
        <p *ngIf="tasks.length === 0" class="empty-state">
          No tasks found.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .task-page { max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 20px; }
    .controls { display: flex; gap: 10px; margin-top: 10px; }
    input { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    .loading-bar { height: 4px; background: #e0e0e0; overflow: hidden; margin-bottom: 10px; border-radius: 2px; }
    .indeterminate { width: 50%; height: 100%; background: var(--primary-color); animation: indeterminate 1.5s infinite linear; }
    @keyframes indeterminate { 0% { transform: translateX(-100%); width: 20%; } 100% { transform: translateX(200%); width: 20%; } }
    .empty-state { text-align: center; color: #999; margin-top: 40px; }
    button.primary { background: var(--primary-color); color: white; }
  `]
})
export class TaskListComponent {
  // [Orthogonality] Inject State Service, not Data Service directly
  state = inject(TaskStateService);
  currentFilter: TaskStatus | 'ALL' = 'ALL';

  addTask(title: string) {
    if (!title) return;
    this.state.addTask(title, 'MEDIUM'); // Default priority
  }

  onFilterChange(status: TaskStatus | 'ALL') {
    this.currentFilter = status;
    this.state.setFilter(status);
  }

  onComplete(taskId: string) {
    this.state.updateStatus(taskId, 'DONE');
  }

  // Not implemented in Service yet, but assuming it exists or adding later
  onDelete(taskId: string) {
    console.warn('Delete not implemented in state yet.');
    // Ideally: this.state.deleteTask(taskId);
  }
}
