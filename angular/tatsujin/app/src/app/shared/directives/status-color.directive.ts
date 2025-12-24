import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { TaskStatus } from '../../../core/models/task.model';

/**
 * [DRY] Status Color Directive
 * 
 * Centralizes the knowledge: "Which color represents which status?"
 * Instead of repeating `[ngClass]="{'bg-red': s === 'TODO', ...}"` in every component,
 * we encapsulate this knowledge here.
 */
@Directive({
  selector: '[appStatusColor]',
  standalone: true
})
export class StatusColorDirective implements OnChanges {
  @Input('appStatusColor') status: TaskStatus | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.updateColor();
    }
  }

  private updateColor() {
    const color = this.getColor(this.status);
    this.renderer.setStyle(this.el.nativeElement, 'border-left', `5px solid ${color}`);
    this.renderer.setStyle(this.el.nativeElement, 'padding-left', '8px');
  }

  private getColor(status?: TaskStatus): string {
    switch (status) {
      case 'TODO': return '#ffca28'; // Amber
      case 'IN_PROGRESS': return '#42a5f5'; // Blue
      case 'DONE': return '#66bb6a'; // Green
      default: return '#ccc';
    }
  }
}
