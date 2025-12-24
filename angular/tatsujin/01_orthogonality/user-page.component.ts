import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User, UserService } from './user.service';
import { UserProfileComponent } from './user-profile.component';

/**
 * [Smart Component] ユーザー管理ページ
 * 
 * このコンポーネントは「オーケストレーター」です。
 * - サービスの呼び出し (Service)
 * - データの管理 (State)
 * - 子コンポーネントへのデータ受け渡し (Dumb Component)
 * 
 * これらをつなぎ合わせる役割を持ちますが、
 * "具体的なHTML構造" (View) や "APIの通信詳細" (Infrastructure)
 * からは直交（分離）しています。
 */
@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, UserProfileComponent],
  template: `
    <div class="page-container">
      <h1>ユーザー管理 (Smart Component)</h1>
      
      <p class="description">
        この親コンポーネントはロジックのみに集中し、
        実際の表示は <code>&lt;app-user-profile&gt;</code> に委譲しています。
      </p>

      <ng-container *ngIf="users$ | async as users; else loading">
        <div class="user-list">
          <!-- 
            Dumb Component を配置。
            [user] でデータを渡し、(activate)/(delete) でイベントを受け取る。
            この疎結合な接続が直交性の証です。
          -->
          <app-user-profile
            *ngFor="let user of users"
            [user]="user"
            (activate)="onToggleActive(user)"
            (delete)="onDelete(user)"
          ></app-user-profile>
          
          <p *ngIf="users.length === 0">ユーザーがいません。</p>
        </div>
      </ng-container>

      <ng-template #loading>
        <p>Loading users...</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
    .user-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .description {
      color: #666;
      margin-bottom: 20px;
      padding: 10px;
      background: #f5f5f5;
      border-left: 4px solid #00796b;
    }
  `]
})
export class UserPageComponent implements OnInit {
  // Angular 14+ inject() 関数による依存注入
  private userService = inject(UserService);

  users$: Observable<User[]> | null = null;

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.users$ = this.userService.getUsers();
  }

  // イベントハンドラ: 子コンポーネントからの通知を受けて実処理を行う
  onToggleActive(user: User) {
    this.userService.toggleActive(user.id).subscribe({
      next: (updatedUser) => {
        console.log(`Updated: ${updatedUser.name}`);
        this.refreshList(); // 簡易的なリロード
      },
      error: (err) => console.error(err)
    });
  }

  onDelete(user: User) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        console.log(`Deleted: ${user.name}`);
        this.refreshList();
      },
      error: (err) => console.error(err)
    });
  }
}
