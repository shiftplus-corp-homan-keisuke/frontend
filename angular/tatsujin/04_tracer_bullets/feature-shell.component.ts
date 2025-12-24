import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

/**
 * [Component] (曳光弾) 機能シェルコンポーネント
 * 
 * アプリケーションの全体構造（ヘッダー、サイドバー、メインエリア）を定義する骨組みです。
 * 
 * 中身の細かい UI パーツ（ボタンの色や詳細なフォーム）はまだ作りません。
 * まず「画面遷移ができること」「レイアウトが崩れないこと」を確認するための
 * 最小限の実装（曳光弾）です。
 */
@Component({
  selector: 'app-feature-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="shell-layout">
      <nav class="sidebar">
        <h3>Menu</h3>
        <ul>
          <!-- ルーティングの疎通確認 -->
          <li><a routerLink="/dashboard">Dashboard</a></li>
          <li><a routerLink="/settings">Settings</a></li>
        </ul>
      </nav>

      <main class="content">
        <header class="top-bar">
          <h1>My App (Tracer Bullet)</h1>
        </header>
        
        <!-- コンテンツの埋め込み場所 -->
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .shell-layout {
      display: flex;
      height: 100vh;
    }
    .sidebar {
      width: 200px;
      background: #eee;
      padding: 20px;
    }
    .content {
      flex: 1;
      padding: 20px;
    }
  `]
})
export class FeatureShellComponent {}
