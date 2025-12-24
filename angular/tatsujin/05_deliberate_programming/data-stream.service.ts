import { Injectable, OnDestroy } from '@angular/core';
import { Subject, interval, takeUntil } from 'rxjs';

/**
 * [Service] データストリーム管理
 * 
 * 「なんとなく subscribe して、そのまま放置」は偶発的プログラミングの典型です。
 * メモリリークの原因になります。
 * 
 * コンポーネントやサービスの寿命（Lifecycle）に合わせて、
 * 意図的に購読を解除するパターンを実装します。
 */
@Injectable({
  // providedIn: 'root' の場合はアプリ終了まで生きるが、
  // 特定のModuleやComponentに provide された場合、ngOnDestroy が重要になる
  providedIn: 'root' 
})
export class DataStreamService implements OnDestroy {
  // 終了通知用の Subject
  private destroy$ = new Subject<void>();

  constructor() {
    this.startLongRunningProcess();
  }

  private startLongRunningProcess() {
    // 1秒ごとのストリーム
    interval(1000)
      .pipe(
        // 【重要】 destroy$ が発火したら、このストリームも自動で完了（unsubscribe）させる
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (val) => console.log(`Processing: ${val}`),
        complete: () => console.log('Process completed safely.')
      });
  }

  // サービスやコンポーネントが破棄される直前に呼ばれる
  ngOnDestroy() {
    console.log('Service destroying...');
    
    // 終了シグナルを送る
    this.destroy$.next();
    this.destroy$.complete();
  }
}
