import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { TaskStatus } from '../models/task.model';

describe('TaskService (Ruthless Testing)', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTask', () => {
    // [Happy Path]
    it('should create a valid task', (done) => {
      service.createTask('Buy Milk', 'MEDIUM').subscribe(task => {
        expect(task.title).toBe('Buy Milk');
        expect(task.id).toBeDefined();
        expect(task.status).toBe('TODO');
        done();
      });
    });

    // [Ruthless] Boundary: Empty Title
    it('should REJECT empty title (Contract Violation)', (done) => {
      service.createTask('', 'HIGH').subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err.message).toContain('Title cannot be empty');
          done();
        }
      });
    });

    // [Ruthless] Boundary: Whitespace Title
    it('should REJECT whitespace title', (done) => {
      service.createTask('   ', 'LOW').subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(err.message).toContain('Title cannot be empty');
          done();
        }
      });
    });
  });

  describe('updateStatus', () => {
    // [Ruthless] Business Rule: Cannot Reopen DONE task
    it('should prevent moving from DONE to TODO (Business Rule)', (done) => {
      // Setup: Create a task and move it to DONE
      service.createTask('Finished Task', 'LOW').subscribe(task => {
        service.updateStatus(task.id, 'DONE').subscribe(() => {
          
          // Act: Try to reuse it
          service.updateStatus(task.id, 'TODO').subscribe({
            next: () => fail('Should have prevented reopening'),
            error: (err) => {
              expect(err.message).toContain('Cannot reopen');
              done();
            }
          });
        });
      });
    });
  });
});
