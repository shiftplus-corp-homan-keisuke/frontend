import { Injectable } from '@angular/core';
import { Template } from '../models/template.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateStorageService {
  private readonly STORAGE_KEY = 'template-system-templates';

  /**
   * テンプレート保存
   */
  saveTemplate(template: Template): void {
    const templates = this.getAllTemplates();
    const existingIndex = templates.findIndex((t) => t.id === template.id);

    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }

    this.saveToStorage(templates);
  }

  /**
   * 全テンプレート取得
   */
  getAllTemplates(): Template[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return [];
    }

    try {
      const templates = JSON.parse(data);
      // Date型に変換
      return templates.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to parse templates from storage:', error);
      return [];
    }
  }

  /**
   * ID指定でテンプレート取得
   */
  getTemplateById(id: string): Template | null {
    const templates = this.getAllTemplates();
    return templates.find((t) => t.id === id) || null;
  }

  /**
   * テンプレート更新
   */
  updateTemplate(id: string, updates: Partial<Template>): void {
    const template = this.getTemplateById(id);
    if (!template) {
      return;
    }

    const updatedTemplate: Template = {
      ...template,
      ...updates,
      id: template.id, // IDは変更しない
      updatedAt: new Date(),
    };

    this.saveTemplate(updatedTemplate);
  }

  /**
   * テンプレート削除
   */
  deleteTemplate(id: string): void {
    const templates = this.getAllTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    this.saveToStorage(filtered);
  }

  /**
   * LocalStorageに保存
   */
  private saveToStorage(templates: Template[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save templates to storage:', error);
    }
  }
}
