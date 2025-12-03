import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateParserService } from '../../services/template-parser.service';
import { TemplateStorageService } from '../../services/template-storage.service';
import { Template, Placeholder, PlaceholderType } from '../../models/template.model';

interface ResultPart {
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

  // ユニークなプレースホルダーのリスト（フォーム表示用）
  uniquePlaceholders = computed(() => {
    const template = this.template();
    if (!template) return [];

    const seen = new Set<string>();
    const unique: Placeholder[] = [];

    for (const placeholder of template.placeholders) {
      const key =
        placeholder.type === PlaceholderType.TEXT ? placeholder.name : placeholder.originalText;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(placeholder);
      }
    }

    return unique;
  });

  // 結果を構造化されたパーツとして表示
  resultParts = computed(() => {
    const template = this.template();
    if (!template) return [];

    const parts: ResultPart[] = [];
    let lastIndex = 0;
    const content = template.content;
    const values = this.placeholderValues();

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

      // プレースホルダーの値を取得（テキスト/選択共通でnameをキーとする）
      const value = values.get(placeholder.name) || '';

      parts.push({
        type: 'placeholder',
        content: value,
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

    return parts;
  });

  // PlaceholderType を公開（テンプレートで使用）
  PlaceholderType = PlaceholderType;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const template = this.storage.getTemplateById(id);
      if (template) {
        this.template.set(template);
        this.initializePlaceholderValues(template);
      } else {
        alert('テンプレートが見つかりません。');
        this.router.navigate(['/templates']);
      }
    }
  }

  private initializePlaceholderValues(template: Template) {
    const values = new Map<string, string>();

    // テキスト型と選択型の両方で、nameをキーとして使用
    for (const placeholder of template.placeholders) {
      values.set(placeholder.name, '');
    }

    this.placeholderValues.set(values);
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
    // resultPartsから純粋なテキストを生成
    const text = this.resultParts()
      .map((part) => part.content)
      .join('');

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
