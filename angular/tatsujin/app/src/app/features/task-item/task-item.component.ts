import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';
import { StatusColorDirective } from '../../../shared/directives/status-color.directive';
import { AppDatePipe } from '../../../shared/pipes/app-date.pipe';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, StatusColorDirective, AppDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="task-card" *ngIf="task" [appStatusColor]="task.status">
      <div class="header">
        <span class="status-badge">{{ task.status }}</span>
        <span class="priority-badge" [class]="task.priority">{{ task.priority }}</span>
      </div>
      
      <h3>{{ task.title }}</h3>
      <p class="meta">Created: {{ task.createdAt | appDate }}</p>

      <div class="actions">
        <!-- Actions are just emitted events. This component decides NOTHING. -->
        <button *ngIf="task.status !== 'DONE'" (click)="onComplete()">Mark Done</button>
        <button class="delete-btn" (click)="onDelete()">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      background: white;
      padding: 16px;
      margin-bottom: 12px;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .task-card:hover { transform: translateY(-2px); }
    .header { display: flex; gap: 8px; font-size: 0.8rem; margin-bottom: 8px; }
    .status-badge { font-weight: bold; color: #555; }
    .priority-badge { padding: 2px 6px; border-radius: 4px; color: white; font-size: 0.7rem; }
    .priority-badge.HIGH { background: #e53935; }
    .priority-badge.MEDIUM { background: #fb8c00; }
    .priority-badge.LOW { background: #7cb342; }
    h3 { margin: 0 0 8px 0; font-size: 1.1rem; }
    .meta { color: #999; font-size: 0.8rem; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
    .delete-btn { background: #ffebee; color: #c62828; }
  `]
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() complete = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onComplete() { this.complete.emit(); }
  onDelete() { this.delete.emit(); }
}
