import { Injectable } from '@angular/core';
import { Placeholder, PlaceholderType } from '../models/template.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateParserService {
  private readonly TEXT_PLACEHOLDER_REGEX = /#{([^}]+)}/g;
  private readonly SELECT_PLACEHOLDER_REGEX = /#select{([^}]+)}/g;

  /**
   * テンプレートからプレースホルダーを抽出
   */
  extractPlaceholders(content: string): Placeholder[] {
    const placeholders: Placeholder[] = [];
    let idCounter = 0;

    // 選択型プレースホルダーを抽出
    const selectMatches = [...content.matchAll(this.SELECT_PLACEHOLDER_REGEX)];
    for (const match of selectMatches) {
      const options = match[1].split('|').map((opt) => opt.trim());
      placeholders.push({
        id: `placeholder-${idCounter++}`,
        type: PlaceholderType.SELECT,
        name: `選択肢-${idCounter}`,
        options,
        position: match.index!,
        originalText: match[0],
      });
    }

    // テキスト型プレースホルダーを抽出
    const textMatches = [...content.matchAll(this.TEXT_PLACEHOLDER_REGEX)];
    for (const match of textMatches) {
      placeholders.push({
        id: `placeholder-${idCounter++}`,
        type: PlaceholderType.TEXT,
        name: match[1].trim(),
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

    // 選択型プレースホルダーを置換
    result = result.replace(this.SELECT_PLACEHOLDER_REGEX, (match, group) => {
      const key = match;
      return values.get(key) || '';
    });

    // テキスト型プレースホルダーを置換
    result = result.replace(this.TEXT_PLACEHOLDER_REGEX, (match, group) => {
      const name = group.trim();
      return values.get(name) || '';
    });

    return result;
  }

  /**
   * プレビュー用HTML生成
   */
  generatePreviewHtml(content: string): string {
    let result = content;

    // 選択型プレースホルダーをバッジ化
    result = result.replace(this.SELECT_PLACEHOLDER_REGEX, (match, group) => {
      const options = group
        .split('|')
        .map((opt: string) => opt.trim())
        .join('|');
      return `<span class="placeholder-badge-select">${options}</span>`;
    });

    // テキスト型プレースホルダーをバッジ化
    result = result.replace(this.TEXT_PLACEHOLDER_REGEX, (match, group) => {
      return `<span class="placeholder-badge-text">${group.trim()}</span>`;
    });

    // 改行を<br>に変換
    result = result.replace(/\n/g, '<br>');

    return result;
  }
}
