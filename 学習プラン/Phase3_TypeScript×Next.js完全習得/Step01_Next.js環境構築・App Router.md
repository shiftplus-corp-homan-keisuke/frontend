# Step 1: Next.js 環境構築・App Router

## 📅 学習期間・目標

**期間**: Step 1
**総学習時間**: 6 時間
**学習スタイル**: 環境構築 30% + App Router 理解 40% + 実装演習 30%

### 🎯 Step 1 到達目標

- [ ] Next.js 15 + TypeScript 開発環境の完全構築
- [ ] App Router の基本概念と実装パターンの理解
- [ ] Server Components vs Client Components の使い分け
- [ ] 基本的なページ・レイアウトシステムの実装
- [ ] Next.js 特有の型システムの習得

## 📚 理論学習内容

### Day 1-2: Next.js 15 環境構築

#### 🎯 Next.js 15 の新機能と特徴

```typescript
// 1. Next.js 15の主要な新機能
interface NextJS15Features {
  appRouter: {
    description: 'ファイルベースルーティングの進化版';
    benefits: ['Server Components', 'Streaming', 'Suspense統合'];
  };

  serverComponents: {
    description: 'サーバーサイドでレンダリングされるコンポーネント';
    advantages: ['バンドルサイズ削減', 'SEO向上', 'パフォーマンス最適化'];
  };

  turbopack: {
    description: 'Rustベースの高速バンドラー';
    performance: '従来のWebpackより最大10倍高速';
  };

  reactServer: {
    description: 'React Server Componentsの完全サポート';
    features: ['Async Components', 'データフェッチ統合'];
  };
}

// 2. プロジェクト初期化
// Next.js 15 + TypeScript + Tailwind CSS
npx create-next-app@latest dataflow-dashboard \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

// 3. 推奨ディレクトリ構造
interface ProjectStructure {
  src: {
    app: '新しいApp Router（pages/の代替）';
    components: '再利用可能なUIコンポーネント';
    lib: 'ユーティリティ関数・設定';
    types: 'TypeScript型定義';
    hooks: 'カスタムReactフック';
  };

  public: 'static assets（画像・アイコン等）';
  docs: 'プロジェクトドキュメント';
}
```

#### 🛠️ 開発環境の最適化

```typescript
// 4. TypeScript設定の最適化
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

// 5. ESLint設定の強化
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}

// 6. Prettier設定
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Day 3-5: App Router の理解と実装

#### 🎯 App Router の基本概念

```typescript
// 7. App Routerのファイル構造
interface AppRouterStructure {
  "app/": {
    "layout.tsx": "ルートレイアウト（必須）";
    "page.tsx": "ホームページ";
    "loading.tsx": "ローディングUI";
    "error.tsx": "エラーUI";
    "not-found.tsx": "404ページ";
  };

  "app/dashboard/": {
    "layout.tsx": "ダッシュボード専用レイアウト";
    "page.tsx": "ダッシュボードページ";
    "loading.tsx": "ダッシュボード用ローディング";
  };

  "app/users/[id]/": {
    "page.tsx": "動的ルート（/users/123）";
  };
}

// 8. ルートレイアウトの実装
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataFlow Dashboard",
  description: "Modern SaaS dashboard built with Next.js 15",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    DataFlow
                  </h1>
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

// 9. ホームページの実装
// app/page.tsx
import Link from "next/link";

export default function HomePage(): JSX.Element {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to DataFlow
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Modern SaaS dashboard built with Next.js 15, TypeScript, and
            Supabase
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 🎯 Server Components vs Client Components

```typescript
// 10. Server Componentsの実装
// app/dashboard/page.tsx（Server Component）
import { Suspense } from "react";
import { UserStats } from "@/components/UserStats";
import { RecentActivity } from "@/components/RecentActivity";

// Server Componentは async/await が使用可能
export default async function DashboardPage(): Promise<JSX.Element> {
  // サーバーサイドでデータフェッチ
  const stats = await fetchUserStats();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Server Componentでデータを渡す */}
          <UserStats stats={stats} />

          {/* Suspenseでローディング状態を管理 */}
          <Suspense fallback={<div>Loading recent activity...</div>}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// データフェッチ関数（Server Componentでのみ使用）
async function fetchUserStats(): Promise<UserStatsData> {
  // 実際のAPIコール
  const response = await fetch("https://api.example.com/stats", {
    next: { revalidate: 60 }, // 60秒でキャッシュを更新
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user stats");
  }

  return response.json() as UserStatsData;
}

// 11. Client Componentsの実装
// components/InteractiveChart.tsx（Client Component）
("use client"); // Client Componentの明示

import { useState, useEffect } from "react";
import { Chart } from "react-chartjs-2";

interface InteractiveChartProps {
  data: ChartData[];
}

export function InteractiveChart({ data }: InteractiveChartProps): JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">(
    "7d"
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Client Componentでのみ使用可能なReact Hooks
  useEffect(() => {
    const filteredData = filterDataByPeriod(data, selectedPeriod);
    setChartData(filteredData);
  }, [data, selectedPeriod]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Analytics</h3>

        {/* インタラクティブな要素 */}
        <select
          value={selectedPeriod}
          onChange={(e) =>
            setSelectedPeriod(e.target.value as "7d" | "30d" | "90d")
          }
          className="border border-gray-300 rounded-md px-3 py-1"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* チャートコンポーネント */}
      <Chart data={chartData} />
    </div>
  );
}

function filterDataByPeriod(data: ChartData[], period: string): ChartData[] {
  // データフィルタリングロジック
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return data.filter((item) => new Date(item.date) >= cutoffDate);
}
```

### Day 6-7: レイアウトとナビゲーション

#### 🎯 ネストしたレイアウトの実装

```typescript
// 12. ダッシュボード専用レイアウト
// app/dashboard/layout.tsx
import { Sidebar } from "@/components/Sidebar";
import { TopNavigation } from "@/components/TopNavigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

// 13. サイドバーコンポーネント
// components/Sidebar.tsx
("use client");

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Users", href: "/dashboard/users", icon: UsersIcon },
  { name: "Settings", href: "/dashboard/settings", icon: CogIcon },
];

export function Sidebar(): JSX.Element {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 bg-blue-600">
        <span className="text-white text-xl font-semibold">DataFlow</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// 14. 動的ルートの実装
// app/dashboard/users/[id]/page.tsx
interface UserPageProps {
  params: {
    id: string;
  };
}

export default async function UserPage({
  params,
}: UserPageProps): Promise<JSX.Element> {
  const user = await fetchUser(params.id);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        <p className="mt-2 text-gray-600">
          The user you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.role}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Joined</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`https://api.example.com/users/${id}`, {
      next: { revalidate: 300 }, // 5分でキャッシュを更新
    });

    if (!response.ok) {
      return null;
    }

    return response.json() as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
```

## 🎯 実践演習

### 演習 1-1: Next.js 15 プロジェクト構築 🔰

**目標**: 完全な開発環境の構築

```bash
# 1. プロジェクト作成
npx create-next-app@latest dataflow-dashboard \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# 2. 必要なパッケージのインストール
cd dataflow-dashboard
npm install @heroicons/react clsx tailwind-merge

# 3. 開発サーバー起動
npm run dev
```

**実装要件**:

- [ ] TypeScript 設定の最適化
- [ ] ESLint + Prettier 設定
- [ ] Tailwind CSS 設定
- [ ] パスエイリアス設定
- [ ] 基本的なディレクトリ構造

### 演習 1-2: App Router ページ実装 🔶

**目標**: App Router を使った基本ページの実装

```typescript
// 実装するページ構造
interface PageStructure {
  "/": "ホームページ（ランディング）";
  "/dashboard": "ダッシュボードメイン";
  "/dashboard/analytics": "アナリティクスページ";
  "/dashboard/users": "ユーザー一覧";
  "/dashboard/users/[id]": "ユーザー詳細";
  "/dashboard/settings": "設定ページ";
}

// 各ページの要件
interface PageRequirements {
  layout: "ネストしたレイアウト対応";
  navigation: "アクティブ状態の表示";
  loading: "ローディングUI実装";
  error: "エラーハンドリング";
  metadata: "SEO対応メタデータ";
}
```

**評価基準**:

- [ ] App Router の正しい使用
- [ ] Server/Client Components の適切な使い分け
- [ ] TypeScript の型安全性
- [ ] レスポンシブデザイン

### 演習 1-3: コンポーネント設計 🔥

**目標**: 再利用可能なコンポーネントの設計

```typescript
// 実装するコンポーネント
interface ComponentLibrary {
  layout: {
    Sidebar: "ナビゲーションサイドバー";
    TopNavigation: "ヘッダーナビゲーション";
    PageHeader: "ページヘッダー";
  };

  ui: {
    Button: "汎用ボタンコンポーネント";
    Card: "カードコンテナ";
    Badge: "ステータスバッジ";
    LoadingSpinner: "ローディング表示";
  };

  data: {
    UserCard: "ユーザー情報カード";
    StatsCard: "統計情報カード";
    DataTable: "データテーブル";
  };
}

// 型安全性の要件
interface TypeSafetyRequirements {
  props: "すべてのPropsに適切な型定義";
  events: "イベントハンドラーの型安全性";
  children: "children propsの適切な型";
  forwarding: "ref forwardingの実装";
}
```

## 📊 Step 1 評価基準

### 理解度チェックリスト

#### Next.js 基礎 (30%)

- [ ] Next.js 15 の新機能を理解している
- [ ] App Router の概念を説明できる
- [ ] プロジェクト構造を適切に設計できる
- [ ] 開発環境を最適化できる

#### App Router (35%)

- [ ] ファイルベースルーティングを実装できる
- [ ] レイアウトシステムを活用できる
- [ ] 動的ルートを実装できる
- [ ] ローディング・エラー UI を実装できる

#### Server/Client Components (25%)

- [ ] Server Components の特徴を理解している
- [ ] Client Components との使い分けができる
- [ ] 適切なデータフェッチを実装できる
- [ ] パフォーマンスを考慮した設計ができる

#### 実践応用 (10%)

- [ ] TypeScript の型安全性を確保できる
- [ ] 再利用可能なコンポーネントを設計できる
- [ ] レスポンシブデザインを実装できる
- [ ] 基本的な UX/UI を考慮できる

### 成果物チェックリスト

- [ ] **Next.js 15 プロジェクト**: 完全な開発環境構築
- [ ] **App Router ページ**: 6 つ以上のページ実装
- [ ] **レイアウトシステム**: ネストしたレイアウト実装
- [ ] **UI コンポーネント**: 10 個以上の再利用可能コンポーネント

## 🔄 Step 2 への準備

### 次週学習内容の予習

```typescript
// Step 2で学習する内容の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 動的ルーティングの高度な活用
interface AdvancedRouting {
  catchAll: "[...slug]";
  optional: "[[...slug]]";
  parallel: "@modal/(.)photo/[id]";
  intercepting: "(.)modal";
}

// 2. shadcn/ui統合
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 3. フォーム処理
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
```

### 環境準備

- [ ] shadcn/ui の導入準備
- [ ] React Hook Form + Zod の調査
- [ ] Heroicons の活用方法確認
- [ ] Tailwind CSS の高度な機能学習

### 学習継続のコツ

1. **毎日の実装**: 小さな機能を毎日実装
2. **公式ドキュメント**: Next.js 公式ドキュメントの定期確認
3. **コミュニティ**: Next.js コミュニティの情報収集
4. **実験**: 新機能の積極的な試行

---

**📌 重要**: Step 1 は Next.js 開発の基盤となる重要な期間です。App Router の概念と Server/Client Components の使い分けを確実に理解することで、後の高度な機能実装がスムーズに進みます。
