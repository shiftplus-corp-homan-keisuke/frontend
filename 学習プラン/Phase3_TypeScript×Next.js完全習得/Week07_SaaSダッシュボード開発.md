# Week 7: SaaSダッシュボード開発

## 📅 学習期間・目標

**期間**: Week 7（7日間）
**総学習時間**: 12時間（平日1.5時間、週末3時間）
**学習スタイル**: ダッシュボード設計40% + データ可視化35% + 管理機能25%

### 🎯 Week 7 到達目標

- [ ] SaaSダッシュボード「DataFlow」の設計・実装
- [ ] リアルタイムデータ可視化システム
- [ ] 管理画面・ユーザー管理機能
- [ ] チャート・グラフライブラリの統合
- [ ] レスポンシブダッシュボードUI

## 📚 理論学習内容

### Day 43-45: ダッシュボード設計・実装

#### 🎯 SaaSダッシュボード「DataFlow」の構築

```typescript
// 1. ダッシュボードレイアウト設計
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopNavigation } from '@/components/dashboard/top-navigation';
import { BreadcrumbNavigation } from '@/components/dashboard/breadcrumb';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* サイドバー */}
        <Sidebar />
        
        {/* メインコンテンツエリア */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <BreadcrumbNavigation />
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// 2. メインダッシュボードページ
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ProjectProgress } from '@/components/dashboard/project-progress';
import { TeamPerformance } from '@/components/dashboard/team-performance';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600">プロジェクトの概要と最新の活動を確認できます</p>
        </div>
        <QuickActions />
      </div>

      {/* 統計概要 */}
      <Suspense fallback={<StatsOverviewSkeleton />}>
        <StatsOverview />
      </Suspense>

      {/* メインコンテンツグリッド */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム（2/3幅） */}
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<ProjectProgressSkeleton />}>
            <ProjectProgress />
          </Suspense>
          
          <Suspense fallback={<TeamPerformanceSkeleton />}>
            <TeamPerformance />
          </Suspense>
        </div>

        {/* 右カラム（1/3幅） */}
        <div className="space-y-6">
          <Suspense fallback={<RecentActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// 3. 統計概要コンポーネント
// components/dashboard/stats-overview.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUpIcon, TrendingDownIcon, UsersIcon, FolderIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface StatCard {
  title: string;
  value: string | number;
  change: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export async function StatsOverview() {
  const stats = await getDashboardStats();

  const statCards: StatCard[] = [
    {
      title: 'アクティブプロジェクト',
      value: stats.activeProjects,
      change: { value: 12, type: 'increase' },
      icon: FolderIcon,
      description: '先月比',
    },
    {
      title: '完了タスク',
      value: stats.completedTasks,
      change: { value: 8, type: 'increase' },
      icon: CheckCircleIcon,
      description: '今週',
    },
    {
      title: 'チームメンバー',
      value: stats.teamMembers,
      change: { value: 2, type: 'increase' },
      icon: UsersIcon,
      description: '新規参加',
    },
    {
      title: '平均完了時間',
      value: `${stats.avgCompletionTime}日`,
      change: { value: 15, type: 'decrease' },
      icon: ClockIcon,
      description: '改善',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="flex items-center text-xs text-gray-600 mt-1">
              {stat.change.type === 'increase' ? (
                <TrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600'}>
                {stat.change.value}%
              </span>
              <span className="ml-1">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Day 46-47: データ可視化システム

#### 🎯 チャート・グラフライブラリ統合

```typescript
// 4. チャートコンポーネント
// components/charts/line-chart.tsx
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
    }[];
  };
  title?: string;
  height?: number;
}

export function LineChart({ data, title, height = 300 }: LineChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}
```

## 🎯 実践演習

### 演習 7-1: SaaSダッシュボード完全実装 🔶

**目標**: 実用的なSaaSダッシュボードの構築

```typescript
// 実装するダッシュボード機能
interface DashboardFeatures {
  overview: '統計概要・KPI表示';
  charts: 'データ可視化・チャート';
  management: 'ユーザー・プロジェクト管理';
  realtime: 'リアルタイム更新';
  responsive: 'レスポンシブ対応';
}

// 技術要件
interface TechnicalRequirements {
  charts: 'Chart.js・Recharts統合';
  layout: 'グリッドレイアウト・レスポンシブ';
  data: 'リアルタイムデータ更新';
  performance: 'パフォーマンス最適化';
}
```

### 演習 7-2: 管理機能実装 🔥

**目標**: 包括的な管理システム

```typescript
// 実装する管理機能
interface AdminFeatures {
  userManagement: 'ユーザー管理・権限制御';
  projectManagement: 'プロジェクト管理・進捗追跡';
  analytics: 'アナリティクス・レポート';
  settings: 'システム設定・カスタマイズ';
}
```

## 📊 Week 7 評価基準

### 理解度チェックリスト

#### ダッシュボード設計 (40%)
- [ ] レイアウト設計を適切に行える
- [ ] コンポーネント構成を最適化できる
- [ ] レスポンシブ対応を実装できる
- [ ] ユーザビリティを考慮できる

#### データ可視化 (35%)
- [ ] チャートライブラリを統合できる
- [ ] 適切なグラフ種類を選択できる
- [ ] リアルタイム更新を実装できる
- [ ] インタラクティブな機能を追加できる

#### 管理機能 (15%)
- [ ] ユーザー管理を実装できる
- [ ] 権限制御を適切に行える
- [ ] データ管理機能を構築できる
- [ ] 設定画面を実装できる

#### 実践応用 (10%)
- [ ] パフォーマンスを最適化できる
- [ ] アクセシビリティを考慮できる
- [ ] セキュリティを確保できる
- [ ] 保守性を向上できる

### 成果物チェックリスト

- [ ] **SaaSダッシュボード**: 完全なダッシュボードアプリケーション
- [ ] **データ可視化**: チャート・グラフシステム
- [ ] **管理機能**: ユーザー・プロジェクト管理
- [ ] **レスポンシブUI**: モバイル対応インターフェース

## 🔄 Week 8 への準備

### 次週学習内容の予習

```typescript
// Week 8で学習するプロジェクト完成・デプロイの基礎概念

// 1. デプロイメント
import { NextConfig } from 'next';

// 2. CI/CD
interface DeploymentPipeline {
  build: 'ビルド・テスト';
  deploy: 'デプロイメント';
  monitoring: '監視・アラート';
}

// 3. 最終統合
interface ProjectCompletion {
  testing: '総合テスト';
  optimization: '最終最適化';
  documentation: 'ドキュメント完成';
}
```

---

**📌 重要**: Week 7ではSaaSダッシュボード「DataFlow」を完成させ、実用的なデータ可視化・管理システムを構築します。これまでの学習内容を統合した実践的なアプリケーションが完成します。