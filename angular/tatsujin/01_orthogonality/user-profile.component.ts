import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './user.service'; // 型定義のみをインポート

/**
 * [Dumb Component] ユーザープロフィール表示コンポーネント
 * 
 * 達人プログラマーの「直交性」の原則に基づき、このコンポーネントは
 * "データをどう取得するか" (Service) や "変更をどう保存するか" (Business Logic)
 * について一切の知識を持ちません。
 * 
 * 外部との接点は @Input (データ受け取り) と @Output (イベント通知) 
 * のみであり、この高い独立性（直交性）が再利用性を保証します。
 */
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // パフォーマンスと予測可能性のためOnPush推奨
  template: `
    <div class="profile-card" *ngIf="user">
      <header>
        <h2>{{ user.name }}</h2>
        <span class="badge" [class.active]="user.isActive">
          {{ user.isActive ? 'Active' : 'Inactive' }}
        </span>
      </header>
      
      <div class="details">
        <p>Email: {{ user.email }}</p>
        <p>Role: {{ user.role }}</p>
      </div>

      <div class="actions">
        <!-- 
          重要: ここで直接 Service を呼んで削除してはいけない。
          あくまで「削除ボタンが押された」という事実のみを親に伝える。
        -->
        <button (click)="onActivate()">
          {{ user.isActive ? 'Deactivate' : 'Activate' }}
        </button>
        <button class="danger" (click)="onDelete()">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    .profile-card {
      border: 1px solid #ccc;
      padding: 16px;
      border-radius: 8px;
      max-width: 400px;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      background: #eee;
      color: #666;
    }
    .badge.active {
      background: #e6fffa;
      color: #00796b;
    }
    .actions {
      margin-top: 16px;
      gap: 8px;
      display: flex;
    }
    .danger {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class UserProfileComponent {
  /**
   * 必要なデータは全て親から受け取る。
   * 自分で取りに行かない。
   */
  @Input() user: User | null = null;

  /**
   * 親へのイベント通知。
   * 親が何をするか（APIを呼ぶか、ログを出すか）はこのコンポーネントは関知しない。
   */
  @Output() activate = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onActivate() {
    this.activate.emit();
  }

  onDelete() {
    // 確認ダイアログなども、本来は親か専用サービスに任せるのが理想だが
    // 簡易的なUIロジックはここで持っても直交性を大きく損ないはしない
    if (confirm('本当に削除しますか？')) {
      this.delete.emit();
    }
  }
}
