import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

// データ型の定義 (契約)
// コンポーネントとサービスの共通言語として機能する
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

/**
 * [Service] ユーザーデータ管理サービス
 * 
 * 達人プログラマーの原則に従い、具体的なデータ保存の実装詳細を隠蔽します。
 * APIのエンドポイントURLや、LocalStorageのキー名などの知識は
 * このクラス内に閉じ込められ、利用側（Smart Component）には漏れません。
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // 簡易的なデータストア
  private users: User[] = [
    { id: '1', name: 'Alice Pragmatic', email: 'alice@example.com', role: 'admin', isActive: true },
    { id: '2', name: 'Bob Dry', email: 'bob@example.com', role: 'user', isActive: false },
  ];

  /**
   * ユーザー一覧を取得する
   * Async な操作であることを表現するために Observable を返す
   */
  getUsers(): Observable<User[]> {
    // 実際のHTTPリクエストを想定して遅延を入れる
    return of([...this.users]).pipe(delay(500));
  }

  /**
   * ユーザーの状態をトグルする
   * 実際のAPIコールを抽象化
   */
  toggleActive(userId: string): Observable<User> {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return throwError(() => new Error('User not found'));
    }
    
    // Immutable な更新を意識（副作用を減らす）
    user.isActive = !user.isActive;
    
    return of({ ...user }).pipe(delay(300));
  }

  /**
   * ユーザーを削除する
   */
  deleteUser(userId: string): Observable<void> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    this.users.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
