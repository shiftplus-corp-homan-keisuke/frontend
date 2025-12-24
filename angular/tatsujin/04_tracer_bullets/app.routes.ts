import { Routes } from '@angular/router';
import { FeatureShellComponent } from './feature-shell.component';

/**
 * [Routes] (曳光弾) ルーティング定義
 * 
 * アプリケーションの「地図」を最初に作ります。
 * まだ実装されていないコンポーネントがあっても、とりあえずパスだけ定義し、
 * Shell コンポーネントを表示するようにしておくことで、
 * 「ここをクリックしたらあそこに行く」という体験（全体像）を即座に検証できます。
 */
export const routes: Routes = [
  {
    path: '',
    component: FeatureShellComponent,
    children: [
      {
        path: 'dashboard',
        // 本来は DashboardComponent だが、まだないので一旦 Shell を代用したり、
        // 簡易的なインラインコンポーネントを使うことも「曳光弾」としてはアリ。
        // loadComponent: () => import('./dashboard/dashboard.component')...
        children: [] 
      },
      {
        path: 'settings',
        children: []
      }
    ]
  }
];
