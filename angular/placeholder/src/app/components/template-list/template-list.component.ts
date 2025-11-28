import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TemplateStorageService } from '../../services/template-storage.service';
import { Template } from '../../models/template.model';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css',
})
export class TemplateListComponent implements OnInit {
  private storage = inject(TemplateStorageService);
  private router = inject(Router);

  templates = signal<Template[]>([]);

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    this.templates.set(this.storage.getAllTemplates());
  }

  executeTemplate(id: string) {
    this.router.navigate(['/execute', id]);
  }

  editTemplate(id: string) {
    this.router.navigate(['/edit', id]);
  }

  deleteTemplate(id: string, name: string) {
    if (confirm(`テンプレート「${name}」を削除しますか？`)) {
      this.storage.deleteTemplate(id);
      this.loadTemplates();
    }
  }

  getPreview(content: string): string {
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  }
}
