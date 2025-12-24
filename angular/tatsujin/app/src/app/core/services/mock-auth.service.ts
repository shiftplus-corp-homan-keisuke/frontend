import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

/**
 * [Tracer Bullet] Mock Authentication Service
 * 
 * "Authentication is needed for everything." 
 * Instead of waiting for a backend, we fire a tracer bullet:
 * A simple boolean switch that simulates login/logout.
 * This allows us to build and test:
 * - Guards
 * - Header UI (Show/Hide Login button)
 * - Protected Routes
 */
@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  // Expose as Observable for reactive UI updates
  isLoggedIn$ = this.loggedIn.asObservable();

  login(): Observable<boolean> {
    console.log('[Auth] Logging in...');
    return of(true).pipe(
      delay(800), // Simulate network latency
      tap(() => this.loggedIn.next(true))
    );
  }

  logout(): void {
    console.log('[Auth] Logging out...');
    this.loggedIn.next(false);
  }

  // Helper for Guards
  isAuthenticated(): boolean {
    return this.loggedIn.value;
  }
}
