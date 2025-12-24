import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MockAuthService } from './core/services/mock-auth.service';

/**
 * [Shell] App Component
 * 
 * Acts as the main container.
 * Subscribes to Auth State to toggle UI elements (Orthogonality).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="main-header">
        <div class="brand">
          <h1>Pragmatic Task Manager</h1>
        </div>
        
        <nav class="main-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <ng-container *ngIf="authService.isLoggedIn$ | async">
            <a routerLink="/tasks" routerLinkActive="active">Tasks</a>
          </ng-container>
        </nav>

        <div class="user-actions">
          <ng-container *ngIf="authService.isLoggedIn$ | async; else loginBtn">
            <span class="welcome">Welcome, User</span>
            <button (click)="logout()">Logout</button>
          </ng-container>
          <ng-template #loginBtn>
            <button class="primary" (click)="login()">Login (Mock)</button>
          </ng-template>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="main-footer">
        <p>Angular × The Pragmatic Programmer Learning Project</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-header {
      background: #fff;
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .brand h1 { font-size: 1.2rem; margin: 0; color: var(--primary-color); }
    .main-nav { display: flex; gap: 1rem; }
    .main-nav a { text-decoration: none; color: #666; font-weight: 500; }
    .main-nav a.active { color: var(--primary-color); border-bottom: 2px solid var(--primary-color); }
    .user-actions { display: flex; align-items: center; gap: 1rem; }
    .main-content { flex: 1; padding: 2rem; max-width: 900px; margin: 0 auto; width: 100%; }
    .main-footer { text-align: center; padding: 1rem; color: #999; font-size: 0.8rem; }
    button.primary { background: var(--primary-color); color: white; }
  `]
})
export class AppComponent {
  authService = inject(MockAuthService);

  login() {
    this.authService.login().subscribe();
  }

  logout() {
    this.authService.logout();
  }
}
