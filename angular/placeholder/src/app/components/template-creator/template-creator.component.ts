import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TemplateParserService } from '../../services/template-parser.service';
import { TemplateStorageService } from '../../services/template-storage.service';
import { Template } from '../../models/template.model';

@Component({
  selector: 'app-template-creator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-creator.component.html',
  styleUrl: './template-creator.component.css',
})
export class TemplateCreatorComponent implements OnInit, AfterViewInit, OnDestroy {
  private parser = inject(TemplateParserService);
  private storage = inject(TemplateStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  contentEditor = viewChild<ElementRef<HTMLDivElement>>('contentEditor');

  templateName = signal<string>('');
  templateContent = signal<string>('');
  editingId = signal<string | null>(null);

  isEditing = computed(() => this.editingId() !== null);

  private readonly TEXT_PLACEHOLDER_REGEX = /#{([^}]+)}/g;
  private readonly SELECT_PLACEHOLDER_REGEX = /#select\{([^}]+)\}/g;
  private isProcessing = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const template = this.storage.getTemplateById(id);
      if (template) {
        this.editingId.set(id);
        this.templateName.set(template.name);
        this.templateContent.set(template.content);
      }
    }
  }

  ngAfterViewInit() {
    const editor = this.contentEditor()?.nativeElement;
    if (editor) {
      // 初期コンテンツを設定
      if (this.templateContent()) {
        editor.textContent = this.templateContent();
        this.processContent(editor);
      }
    }
  }

  ngOnDestroy() {
    // クリーンアップ
  }

  onContentInput(event: Event) {
    if (this.isProcessing) return;

    const editor = event.target as HTMLDivElement;

    // プレーンテキストを取得
    const text = this.extractPlainText(editor);
    this.templateContent.set(text);

    // コンテンツを処理
    this.processContent(editor);
  }

  onContentKeyDown(event: KeyboardEvent) {
    const editor = event.target as HTMLDivElement;
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Backspaceキーでバッジを削除
    if (event.key === 'Backspace' && range.collapsed) {
      const badgeToDelete = this.findPreviousBadge(range);
      if (badgeToDelete) {
        event.preventDefault();
        badgeToDelete.remove();
        return;
      }
    }

    // Deleteキーでバッジを削除
    if (event.key === 'Delete' && range.collapsed) {
      const badgeToDelete = this.findNextBadge(range);
      if (badgeToDelete) {
        event.preventDefault();
        badgeToDelete.remove();
        return;
      }
    }

    // Enterキーで改行
    if (event.key === 'Enter') {
      event.preventDefault();
      document.execCommand('insertLineBreak');
    }
  }

  private findPreviousBadge(range: Range): HTMLElement | null {
    let node: Node | null = range.startContainer;
    let offset = range.startOffset;

    // テキストノードの場合
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent || '';
      const cleanText = textContent.replace(/\u200B/g, '');

      // カーソルがテキストノードの先頭にある場合、または
      // テキストノードが空（ゼロ幅スペースのみ）の場合
      if (offset === 0 || cleanText.length === 0) {
        // 前のノードを探す
        let prev = node.previousSibling;
        while (prev) {
          if (prev.nodeType === Node.ELEMENT_NODE) {
            const elem = prev as HTMLElement;
            if (
              elem.classList?.contains('placeholder-badge-text') ||
              elem.classList?.contains('placeholder-badge-select')
            ) {
              return elem;
            }
          }
          // ゼロ幅スペースやホワイトスペースだけのテキストノードはスキップ
          if (prev.nodeType === Node.TEXT_NODE) {
            const text = (prev.textContent || '').replace(/\u200B/g, '').trim();
            if (text.length > 0) {
              return null; // 実際のテキストがあるので終了
            }
          }
          prev = prev.previousSibling;
        }

        // 親ノードの前のノードを探す
        if (node.parentNode && node.parentNode !== this.contentEditor()?.nativeElement) {
          const parent = node.parentNode;
          let parentPrev = parent.previousSibling;
          while (parentPrev) {
            if (parentPrev.nodeType === Node.ELEMENT_NODE) {
              const elem = parentPrev as HTMLElement;
              if (
                elem.classList?.contains('placeholder-badge-text') ||
                elem.classList?.contains('placeholder-badge-select')
              ) {
                return elem;
              }
            }
            parentPrev = parentPrev.previousSibling;
          }
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // 要素ノードの場合、直前の子ノードを確認
      if (offset > 0) {
        const childNodes = Array.from(node.childNodes);
        const prevChild = childNodes[offset - 1];
        if (prevChild && prevChild.nodeType === Node.ELEMENT_NODE) {
          const elem = prevChild as HTMLElement;
          if (
            elem.classList?.contains('placeholder-badge-text') ||
            elem.classList?.contains('placeholder-badge-select')
          ) {
            return elem;
          }
        }
        // 前の子がテキストノードで空の場合、さらに前を探す
        if (prevChild && prevChild.nodeType === Node.TEXT_NODE) {
          const text = (prevChild.textContent || '').replace(/\u200B/g, '').trim();
          if (text.length === 0 && offset > 1) {
            const prevPrevChild = childNodes[offset - 2];
            if (prevPrevChild && prevPrevChild.nodeType === Node.ELEMENT_NODE) {
              const elem = prevPrevChild as HTMLElement;
              if (
                elem.classList?.contains('placeholder-badge-text') ||
                elem.classList?.contains('placeholder-badge-select')
              ) {
                return elem;
              }
            }
          }
        }
      }
    }

    return null;
  }

  private findNextBadge(range: Range): HTMLElement | null {
    let node: Node | null = range.startContainer;
    let offset = range.startOffset;

    // テキストノードの場合
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      // カーソルがテキストノードの末尾にある場合
      if (offset === text.length) {
        // 次のノードを探す
        let next = node.nextSibling;
        while (next) {
          if (next.nodeType === Node.ELEMENT_NODE) {
            const elem = next as HTMLElement;
            if (
              elem.classList?.contains('placeholder-badge-text') ||
              elem.classList?.contains('placeholder-badge-select')
            ) {
              return elem;
            }
          }
          // ゼロ幅スペースやホワイトスペースだけのテキストノードはスキップ
          if (next.nodeType === Node.TEXT_NODE) {
            const text = (next.textContent || '').replace(/\u200B/g, '').trim();
            if (text.length > 0) {
              return null;
            }
          }
          next = next.nextSibling;
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // 要素ノードの場合、直後の子ノードを確認
      const childNodes = Array.from(node.childNodes);
      const nextChild = childNodes[offset];
      if (nextChild && nextChild.nodeType === Node.ELEMENT_NODE) {
        const elem = nextChild as HTMLElement;
        if (
          elem.classList?.contains('placeholder-badge-text') ||
          elem.classList?.contains('placeholder-badge-select')
        ) {
          return elem;
        }
      }
    }

    return null;
  }

  onContentPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
  }

  private extractPlainText(element: HTMLElement): string {
    let text = '';

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // ゼロ幅スペースを除外
        const content = (node.textContent || '').replace(/\u200B/g, '');
        text += content;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as HTMLElement;

        if (elem.nodeName === 'BR') {
          text += '\n';
        } else if (
          elem.classList.contains('placeholder-badge-text') ||
          elem.classList.contains('placeholder-badge-select')
        ) {
          // バッジの場合は元の構文を復元
          const original = elem.getAttribute('data-placeholder');
          if (original) {
            text += original;
          } else {
            // フォールバック: バッジの内容から復元
            const content = elem.textContent || '';
            if (elem.classList.contains('placeholder-badge-text')) {
              text += `#{${content}}`;
            } else {
              text += `#select{${content}}`;
            }
          }
        } else {
          // 子ノードを処理
          for (const child of Array.from(elem.childNodes)) {
            processNode(child);
          }
        }
      }
    };

    for (const child of Array.from(element.childNodes)) {
      processNode(child);
    }

    return text;
  }

  private processContent(editor: HTMLDivElement) {
    this.isProcessing = true;

    // カーソル位置を保存
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const cursorPos = range ? this.getAbsoluteCursorPosition(editor, range) : null;

    // テキストノードを走査して置換
    this.processTextNodes(editor);

    // カーソル位置を復元
    if (cursorPos !== null) {
      this.restoreCursorPosition(editor, cursorPos);
    }

    this.isProcessing = false;
  }

  private processTextNodes(element: Node) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

    const nodesToProcess: { node: Text; parent: Node }[] = [];
    let node: Node | null;

    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
        // バッジ内のテキストは処理しない
        const parent = node.parentNode as HTMLElement;
        if (
          !parent.classList ||
          (!parent.classList.contains('placeholder-badge-text') &&
            !parent.classList.contains('placeholder-badge-select'))
        ) {
          nodesToProcess.push({ node: node as Text, parent: node.parentNode });
        }
      }
    }

    // 各テキストノードを処理
    for (const { node, parent } of nodesToProcess) {
      const text = node.textContent || '';
      const fragments = this.createFragmentsFromText(text);

      if (fragments.length > 1 || (fragments.length === 1 && fragments[0].type !== 'text')) {
        const tempDiv = document.createElement('div');
        fragments.forEach((frag) => {
          tempDiv.appendChild(frag.node);
        });

        while (tempDiv.firstChild) {
          parent.insertBefore(tempDiv.firstChild, node);
        }
        parent.removeChild(node);
      }
    }
  }

  private createFragmentsFromText(text: string): Array<{ type: string; node: Node }> {
    const fragments: Array<{ type: string; node: Node }> = [];
    let lastIndex = 0;

    // すべてのマッチを見つける
    const matches: Array<{ index: number; length: number; text: string; type: string }> = [];

    // テキスト型プレースホルダー
    let match;
    const textRegex = new RegExp(this.TEXT_PLACEHOLDER_REGEX.source, 'g');
    while ((match = textRegex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        text: match[0],
        type: 'text',
      });
    }

    // 選択型プレースホルダー
    const selectRegex = new RegExp(this.SELECT_PLACEHOLDER_REGEX.source, 'g');
    while ((match = selectRegex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        text: match[0],
        type: 'select',
      });
    }

    // インデックスでソート
    matches.sort((a, b) => a.index - b.index);

    // フラグメントを作成
    for (const m of matches) {
      // マッチ前のテキスト
      if (m.index > lastIndex) {
        const textNode = document.createTextNode(text.substring(lastIndex, m.index));
        fragments.push({ type: 'text', node: textNode });
      }

      // プレースホルダーバッジ
      const span = document.createElement('span');
      span.className = m.type === 'text' ? 'placeholder-badge-text' : 'placeholder-badge-select';
      span.contentEditable = 'false';
      span.setAttribute('data-placeholder', m.text); // 元のテキストを保存

      // バッジ内のテキストを抽出
      if (m.type === 'text') {
        // #{名前} -> 名前
        const textMatch = m.text.match(/^#\{(.+)\}$/);
        span.textContent = textMatch ? textMatch[1] : m.text;
      } else {
        // #select{赤|青|緑} -> 赤|青|緑
        const selectMatch = m.text.match(/^#select\{(.+)\}$/);
        span.textContent = selectMatch ? selectMatch[1] : m.text;
      }

      fragments.push({ type: m.type, node: span });

      // バッジの後にゼロ幅スペースを追加して入力しやすくする
      fragments.push({ type: 'space', node: document.createTextNode('\u200B') });

      lastIndex = m.index + m.length;
    }

    // 残りのテキスト
    if (lastIndex < text.length) {
      const textNode = document.createTextNode(text.substring(lastIndex));
      fragments.push({ type: 'text', node: textNode });
    }

    // マッチがない場合
    if (fragments.length === 0 && text.length > 0) {
      fragments.push({ type: 'text', node: document.createTextNode(text) });
    }

    return fragments;
  }

  private getAbsoluteCursorPosition(container: HTMLElement, range: Range): number {
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(container);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }

  private restoreCursorPosition(container: HTMLElement, position: number) {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    let charCount = 0;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);

    let node: Node | null;
    let found = false;

    while ((node = walker.nextNode())) {
      const nodeLength = node.textContent?.length || 0;
      if (charCount + nodeLength >= position) {
        range.setStart(node, position - charCount);
        range.collapse(true);
        found = true;
        break;
      }
      charCount += nodeLength;
    }

    if (!found) {
      range.selectNodeContents(container);
      range.collapse(false);
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }

  saveTemplate() {
    const name = this.templateName().trim();
    const content = this.templateContent().trim();

    if (!name || !content) {
      alert('テンプレート名と本文を入力してください。');
      return;
    }

    const placeholders = this.parser.extractPlaceholders(content);
    const now = new Date();

    const template: Template = {
      id: this.editingId() || crypto.randomUUID(),
      name,
      content,
      placeholders,
      createdAt: this.editingId()
        ? this.storage.getTemplateById(this.editingId()!)?.createdAt || now
        : now,
      updatedAt: now,
    };

    this.storage.saveTemplate(template);
    alert('テンプレートを保存しました。');
    this.router.navigate(['/templates']);
  }

  cancel() {
    this.router.navigate(['/templates']);
  }
}
