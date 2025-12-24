import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

/**
 * [Directive] ハイライト機能
 * 
 * "要素にマウスが乗ったら背景色を変える" という振る舞い（知識）を
 * この Directive にカプセル化しています。
 * 
 * もしこのロジックを各コンポーネントの template や CSS :hover で
 * 個別に実装してしまうと、仕様変更（例: 色を黄色から水色に変える）
 * が発生した際に、全箇所を修正する「知識の散在」が起きてしまいます。
 * 
 * DRY原則に従い、共通の振る舞いは Directive として定義し、
 * 単一の「信頼できる情報源」とします。
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  // デフォルト色も定義することで、利用側は何も指定しなくても動く（CoC）
  @Input() appHighlight = '#e6fffa';

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter') 
  onMouseEnter() {
    this.highlight(this.appHighlight);
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.2s');
  }

  @HostListener('mouseleave') 
  onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string | null) {
    // Renderer2 を使うことで、WebWorker や Server Side Rendering (SSR) 
    // 環境でも動作する安全な DOM 操作を実現（プラットフォーム依存の知識を排除）
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}
