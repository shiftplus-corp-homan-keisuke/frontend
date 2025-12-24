import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * [Component] 意図的なパフォーマンス制御
 * 
 * デフォルトの ChangeDetection は、アプリ内のどこかでイベントが起きるたびに
 * 全コンポーネントをチェックします（楽観的プログラミング）。
 * 
 * ここでは `OnPush` 戦略を採用し、
 * 「@Inputが変わった時」か「明示的にマークした時」だけ更新されるよう
 * 意図的に（Deliberate）制御します。
 */
@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule],
  // ここが重要: 変更検知のトリガーを絞る
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="box">
      <h3>Counter (Async Pipe): {{ count$ | async }}</h3>
      <p>Async Pipe は内部で markForCheck を呼ぶため、OnPush でも自動更新されます。</p>
      
      <hr>

      <h3>Internal State: {{ internalState }}</h3>
      <button (click)="updateState()">Update State</button>
      <p>イベントハンドラ内での変更も、Angularが検知して更新します。</p>

      <hr>

      <h3>Manual Trigger: {{ manualValue }}</h3>
      <button (click)="updateFromOutside()">Update Manual</button>
      <p>setTimeoutなどZone外からの更新は、detectChanges() で意図的に通知する必要があります。</p>
    </div>
  `,
  styles: [`
    .box { border: 2px solid #00796b; padding: 20px; border-radius: 8px; }
  `]
})
export class PerformanceComponent implements OnInit {
  // 1. Observable + AsyncPipe: 最も推奨されるリアクティブパターン
  count$: Observable<number> = interval(1000).pipe(map(i => i * 10));

  internalState = 0;
  manualValue = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // コンストラクタやInitでの設定は一度きり
  }

  // 2. イベントバインディング経由の変更
  updateState() {
    this.internalState++;
    // OnPushでも、テンプレート内のイベントリスナー発火時は自動で markForCheck される
  }

  // 3. 非同期/外部トリガーからの変更
  updateFromOutside() {
    // 例: Zone外や特殊なタイマーなど、Angularが検知できないタイミングを想定
    setTimeout(() => {
      this.manualValue++;
      console.log('Value updated to:', this.manualValue);
      
      // 明示的に教える: 「ここに変更があるから見に来てくれ」
      this.cdr.markForCheck(); 
      // または this.cdr.detectChanges();
    }, 500);
  }
}
