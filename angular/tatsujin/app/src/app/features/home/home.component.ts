import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero">
      <h2>Welcome to the Project</h2>
      <p>This is a Tracer Bullet.</p>
      <p>Please login to see tasks.</p>
    </div>
  `
})
export class HomeComponent {}
