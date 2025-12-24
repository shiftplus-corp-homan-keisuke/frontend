import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * [Tracer Bullet] Application Routing
 * 
 * We define the entire map of the application immediately.
 * We use 'loadComponent' (Lazy Loading) even for empty placeholders
 * to establish the architectural pattern early.
 */
export const routes: Routes = [
  {
    path: '',
    // Tracer Bullet: Simple Welcome Page
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    // This file doesn't exist yet, but we define the intention.
    // We will create it in the next step.
    loadComponent: () => import('./features/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
