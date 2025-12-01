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
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { PlaceholderInputHandler } from '../../extensions/placeholder-input-handler.extension';
import { TemplateParserService } from '../../services/template-parser.service';
import { TemplateStorageService } from '../../services/template-storage.service';
import { Template } from '../../models/template.model';

@Component({
  selector: 'app-template-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, TiptapEditorDirective],
  templateUrl: './template-creator.component.html',
  styleUrl: './template-creator.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TemplateCreatorComponent implements OnInit, AfterViewInit, OnDestroy {
  private parser = inject(TemplateParserService);
  private storage = inject(TemplateStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  editor!: Editor;

  templateName = signal<string>('');
  templateContent = signal<string>('');
  editingId = signal<string | null>(null);

  isEditing = computed(() => this.editingId() !== null);

  ngOnInit() {
    // Initialize Tiptap editor (plain text only, no markdown features)
    this.editor = new Editor({
      extensions: [
        StarterKit.configure({
          // Disable all markdown formatting features
          bold: false,
          italic: false,
          strike: false,
          code: false,
          heading: false,
          bulletList: false,
          orderedList: false,
          listItem: false,
          blockquote: false,
          codeBlock: false,
          horizontalRule: false,
          hardBreak: false,
          dropcursor: false,
          gapcursor: false,
        }),
        PlaceholderInputHandler,
      ],
      content: '',
      onUpdate: ({ editor }) => {
        // Update the template content when the editor changes
        const text = editor.getText();
        this.templateContent.set(text);
      },
    });

    // Load existing template if editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const template = this.storage.getTemplateById(id);
      if (template) {
        this.editingId.set(id);
        this.templateName.set(template.name);
        this.templateContent.set(template.content);
        this.editor.commands.setContent(template.content);
      }
    }
  }

  ngAfterViewInit() {
    // No longer needed with Tiptap
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  /**
   * プレースホルダーをカーソル位置に挿入
   * @param placeholderText 挿入するプレースホルダーテキスト（例: "#{sample}" または "#select{option1|option2}"）
   */
  insertPlaceholder(placeholderText: string): void {
    if (!this.editor) return;
    
    // Tiptapのコマンドを使用してテキストを挿入
    this.editor
      .chain()
      .focus() // エディタにフォーカス
      .insertContent(placeholderText) // カーソル位置にテキスト挿入
      .run();
  }

  /**
   * テキスト型プレースホルダーを挿入
   */
  insertTextPlaceholder(): void {
    this.insertPlaceholder('#{sample}');
  }

  /**
   * 選択型プレースホルダーを挿入
   */
  insertSelectPlaceholder(): void {
    this.insertPlaceholder('#select{option1|option2|option3}');
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
