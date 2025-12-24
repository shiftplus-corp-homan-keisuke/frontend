/**
 * [DbC] Task Domain Model
 * 
 * Defines the strict contract for a Task entity.
 * - `readonly` identifiers imply immutability where appropriate.
 * - Union types restrict `status` to valid states only.
 */

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  readonly id: string;
  title: string;
  description?: string; // Optional
  status: TaskStatus;
  priority: TaskPriority;
  readonly createdAt: Date;
  dueDate?: Date;
}

// Type Guard for runtime checks
export function isTask(data: any): data is Task {
  return (
    typeof data?.id === 'string' &&
    typeof data?.title === 'string' &&
    ['TODO', 'IN_PROGRESS', 'DONE'].includes(data?.status)
  );
}
