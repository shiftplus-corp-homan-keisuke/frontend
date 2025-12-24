import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

/**
 * [Before] 肥大化したコンポーネント (The Fat Component)
 * 
 * 典型的なアンチパターンです。
 * 1. HTTP通信を直接行っている (密結合)
 * 2. データ変換ロジックが混ざっている (責務過多)
 * 3. エラーハンドリングが雑
 * 4. テンプレート内で複雑な計算をしている
 */
@Component({
  selector: 'app-fat-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>User List</h1>
      <div *ngIf="isLoading">Loading...</div>
      <div *ngIf="error" style="color: red">{{ error }}</div>
      
      <ul>
        <li *ngFor="let user of users">
          <!-- ロジックがテンプレートに漏れている -->
          {{ user.name.toUpperCase() }} 
          (AGE: {{ user.age ? user.age : 'Unknown' }})
          
          <!-- 複雑な条件分岐 -->
          <span *ngIf="user.role === 'admin' || user.role === 'superuser'" style="font-weight: bold">
            [ADMIN]
          </span>
        </li>
      </ul>
    </div>
  `
})
export class FatUserListComponent implements OnInit {
  users: any[] = []; // any型 (割れ窓)
  isLoading = false;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isLoading = true;
    // API呼び出しがハードコードされている
    this.http.get('https://api.example.com/users').subscribe({
      next: (data: any) => {
        this.isLoading = false;
        // 不必要なデータ加工ロジック
        this.users = data.map((u: any) => {
          if (!u.role) u.role = 'guest';
          return u;
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load';
        console.error(err);
      }
    });
  }
}
