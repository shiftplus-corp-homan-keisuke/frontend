import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateParserService } from '../../services/template-parser.service';
import { TemplateStorageService } from '../../services/template-storage.service';
import { Template, Placeholder, PlaceholderType } from '../../models/template.model';

interface TemplatePart {
  type: 'text' | 'placeholder';
  content: string;
  placeholder?: Placeholder;
}

@Component({
  selector: 'app-template-executor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-executor.component.html',
  styleUrl: './template-executor.component.css',
})
export class TemplateExecutorComponent implements OnInit {
  private parser = inject(TemplateParserService);
  private storage = inject(TemplateStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  template = signal<Template | null>(null);
  placeholderValues = signal<Map<string, string>>(new Map());
  templateParts = signal<TemplatePart[]>([]);

  // リアルタイムプレビュー用の結果テキスト
  resultText = computed(() => {
    const template = this.template();
    if (!template) return '';

    return this.parser.replacePlaceholders(template.content, this.placeholderValues());
  });

  // PlaceholderType を公開（テンプレートで使用）
  PlaceholderType = PlaceholderType;
  Math = Math;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const template = this.storage.getTemplateById(id);
      if (template) {
        this.template.set(template);
        this.initializePlaceholderValues(template);
        this.parseTemplateParts(template);
      } else {
        alert('テンプレートが見つかりません。');
        this.router.navigate(['/templates']);
      }
    }
  }

  private initializePlaceholderValues(template: Template) {
    const values = new Map<string, string>();

    for (const placeholder of template.placeholders) {
      if (placeholder.type === PlaceholderType.TEXT) {
        values.set(placeholder.name, '');
      } else if (placeholder.type === PlaceholderType.SELECT) {
        values.set(placeholder.originalText, '');
      }
    }

    this.placeholderValues.set(values);
  }

  private parseTemplateParts(template: Template) {
    const parts: TemplatePart[] = [];
    let lastIndex = 0;
    const content = template.content;

    // プレースホルダーを位置順にソート
    const sortedPlaceholders = [...template.placeholders].sort((a, b) => a.position - b.position);

    for (const placeholder of sortedPlaceholders) {
      // プレースホルダー前のテキスト
      if (placeholder.position > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, placeholder.position),
        });
      }

      // プレースホルダー
      parts.push({
        type: 'placeholder',
        content: placeholder.originalText,
        placeholder,
      });

      lastIndex = placeholder.position + placeholder.originalText.length;
    }

    // 最後の残りテキスト
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex),
      });
    }

    this.templateParts.set(parts);
  }

  updateValue(key: string, value: string) {
    const newValues = new Map(this.placeholderValues());
    newValues.set(key, value);
    this.placeholderValues.set(newValues);
  }

  getValue(key: string): string {
    return this.placeholderValues().get(key) || '';
  }

  copyToClipboard() {
    const text = this.resultText();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('クリップボードにコピーしました。');
      })
      .catch((err) => {
        console.error('コピーに失敗しました:', err);
        alert('コピーに失敗しました。');
      });
  }

  back() {
    this.router.navigate(['/templates']);
  }
}
