'use client';

import { MainLayout } from '@/components/layout';
import { TaskManager } from '@/components/tasks';

export default function TasksPage() {
  return (
    <MainLayout>
      <TaskManager />
    </MainLayout>
  );
}