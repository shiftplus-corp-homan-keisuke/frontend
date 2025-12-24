import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * [Service] (曳光弾) モック認証サービス
 * 
 * 本物のバックエンド認証（OAuth2やFirebaseなど）が完成するのを待っていたら
 * アプリケーション開発が進みません。
 * 
 * 曳光弾として、インターフェースだけ本物と同じで、中身は即座に動くモックを作成します。
 * これにより、ガード、ヘッダー表示、リダイレクト等のロジックを先行して実装・検証できます。
 */
@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  // ログイン状態を保持する Subject
  private loggedIn = new BehaviorSubject<boolean>(false);
  
  /**
   * ログイン状態のストリーム
   */
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /**
   * ログイン処理（ダミー）
   */
  login(username: string): Observable<boolean> {
    console.log(`[Tracer Bullet] Logging in as ${username}...`);
    
    // 擬似的な通信遅延
    return of(true).pipe(
      delay(500),
      // 成功副作用
      tap(() => this.loggedIn.next(true))
    );
  }

  /**
   * ログアウト処理
   */
  logout(): void {
    console.log('[Tracer Bullet] Logging out...');
    this.loggedIn.next(false);
  }
}

// RxJSのtapをインポートし忘れたときのための簡易定義（本来は import { tap } from 'rxjs/operators'）
import { tap } from 'rxjs/operators';
