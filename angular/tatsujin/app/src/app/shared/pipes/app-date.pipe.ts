import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'appDate',
  standalone: true
})
export class AppDatePipe implements PipeTransform {
  // Use composition: wrap Angular's DatePipe
  private datePipe = new DatePipe('en-US');

  transform(value: Date | string | undefined): string {
    if (!value) return '';
    return this.datePipe.transform(value, 'MMM d, y, h:mm a') || '';
  }
}
