import { TaskItemComponent } from './task-item.component';
import { Task } from '../../../core/models/task.model';

describe('TaskItemComponent (Isolated)', () => {
  let component: TaskItemComponent;
  const mockTask: Task = {
    id: '123',
    title: 'Test Task',
    status: 'TODO',
    priority: 'MEDIUM',
    createdAt: new Date()
  };

  beforeEach(() => {
    // No TestBed. Plain class instantiation.
    component = new TaskItemComponent();
    component.task = mockTask;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit complete event when onComplete called', () => {
    let emitted = false;
    component.complete.subscribe(() => emitted = true);

    component.onComplete();
    
    expect(emitted).toBeTrue();
  });

  it('should emit delete event when onDelete called', () => {
    let emitted = false;
    component.delete.subscribe(() => emitted = true);

    component.onDelete();
    
    expect(emitted).toBeTrue();
  });
});
