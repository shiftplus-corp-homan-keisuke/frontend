import { Injectable } from '@angular/core';
import { Placeholder, PlaceholderType } from '../models/template.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateParserService {
  private readonly PLACEHOLDER_REGEX = /#{([^}]+)}/g;

  /**
   * テンプレートからプレースホルダーを抽出
   * 形式: #{type:name:options} または #{name}
   */
  extractPlaceholders(content: string): Placeholder[] {
    const placeholders: Placeholder[] = [];
    let idCounter = 0;

    // 全てのプレースホルダーを抽出
    const matches = [...content.matchAll(this.PLACEHOLDER_REGEX)];
    for (const match of matches) {
      const contentStr = match[1];
      const parts = contentStr.split(':').map((part) => part.trim());

      let type: PlaceholderType = PlaceholderType.TEXT;
      let name = '';
      let options: string[] | undefined = undefined;

      if (parts.length === 1) {
        // 省略形: #{name} → テキスト型
        type = PlaceholderType.TEXT;
        name = parts[0];
      } else if (parts.length >= 2) {
        // 完全形: #{type:name} または #{type:name:options}
        const specifiedType = parts[0].toLowerCase();
        name = parts[1];

        if (specifiedType === 'text') {
          type = PlaceholderType.TEXT;
        } else if (specifiedType === 'select') {
          type = PlaceholderType.SELECT;
          // コロン以降をオプションとして取得し、パイプで分割
          const optionsStr = parts.slice(2).join(':');
          options = optionsStr
            .split('|')
            .map((opt) => opt.trim())
            .filter((opt) => opt.length > 0);
        } else if (specifiedType === 'checkbox') {
          // チェックボックスは選択型として扱う
          type = PlaceholderType.SELECT;
          const optionsStr = parts.slice(2).join(':');
          options = optionsStr
            .split('|')
            .map((opt) => opt.trim())
            .filter((opt) => opt.length > 0);
        } else {
          // 未知のタイプはテキストとして扱う
          type = PlaceholderType.TEXT;
          name = contentStr;
        }
      }

      placeholders.push({
        id: `placeholder-${idCounter++}`,
        type,
        name,
        options,
        position: match.index!,
        originalText: match[0],
      });
    }

    // 位置でソート
    return placeholders.sort((a, b) => a.position - b.position);
  }

  /**
   * プレースホルダーを値で置換
   */
  replacePlaceholders(content: string, values: Map<string, string>): string {
    let result = content;

    // 全てのプレースホルダーを置換
    result = result.replace(this.PLACEHOLDER_REGEX, (match, group) => {
      const parts = group.split(':').map((part: string) => part.trim());

      // 名前を取得（省略形は parts[0]、完全形は parts[1]）
      const name = parts.length === 1 ? parts[0] : parts[1];
      return values.get(name) || '';
    });

    return result;
  }

  /**
   * プレビュー用HTML生成
   */
  generatePreviewHtml(content: string): string {
    let result = content;

    // 全てのプレースホルダーをバッジ化
    result = result.replace(this.PLACEHOLDER_REGEX, (match, group) => {
      const parts = group.split(':').map((part: string) => part.trim());

      if (parts.length === 1) {
        // 省略形: #{name} → テキスト型
        return `<span class="placeholder-badge-text">${parts[0]}</span>`;
      } else {
        // 完全形: #{type:name:...}
        const type = parts[0].toLowerCase();
        const name = parts[1];

        if (type === 'text') {
          return `<span class="placeholder-badge-text">${name}</span>`;
        } else {
          // select, checkbox など
          return `<span class="placeholder-badge-select">${name}</span>`;
        }
      }
    });

    // 改行を<br>に変換
    result = result.replace(/\n/g, '<br>');

    return result;
  }
}
