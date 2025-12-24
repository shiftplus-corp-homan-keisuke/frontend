import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from './user-api.service';

/**
 * [After 2] スリム化されたコンポーネント
 * 
 * - 通信は Service に委譲
 * - Observable + AsyncPipe で購読管理
 * - 表示ロジック（Admin判定など）は本来なら Pipe かコンポーネントのメソッドに切り出す
 */
@Component({
  selector: 'app-clean-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>User List</h1>
      
      <!-- Async Pipe でローディング状態や購読解除を自動化 -->
      <ul *ngIf="users$ | async as users; else loading">
        <li *ngFor="let user of users">
          {{ user.name }} ({{ user.age ?? 'Unknown' }})
          
          <span *ngIf="isAdmin(user.role)" style="font-weight: bold">
            [ADMIN]
          </span>
        </li>
      </ul>
      
      <ng-template #loading>
        <div>Loading...</div>
      </ng-template>
    </div>
  `
})
export class CleanUserListComponent {
  private userApi = inject(UserApiService);
  
  // 宣言的なデータストリーム
  users$ = this.userApi.getUsers();

  // 表示ロジックの関数化（テスト容易性の向上）
  isAdmin(role: string): boolean {
    return role === 'admin' || role === 'superuser';
  }
}
