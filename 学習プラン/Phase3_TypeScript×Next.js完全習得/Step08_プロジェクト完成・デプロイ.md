# Step 8: プロジェクト完成・デプロイ

## 📅 学習期間・目標

**期間**: Step 8
**総学習時間**: 6 時間
**学習スタイル**: プロジェクト統合 40% + テスト・品質管理 30% + デプロイ・運用 30%

### 🎯 Step 8 到達目標

- [ ] SaaS ダッシュボード「DataFlow」の完全統合
- [ ] 包括的なテスト実装（Unit・Integration・E2E）
- [ ] CI/CD パイプライン構築
- [ ] プロダクションデプロイメント
- [ ] 運用監視・保守体制の確立

## 📚 理論学習内容

### Day 50-52: プロジェクト統合・最終調整

#### 🎯 全機能の統合とブラッシュアップ

```typescript
// 1. 最終的なアプリケーション構成
// app/layout.tsx
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { WebVitals } from "@/components/web-vitals";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | DataFlow",
    default: "DataFlow - Modern SaaS Dashboard",
  },
  description: "DataFlowは現代的なSaaSダッシュボードアプリケーションです。",
  keywords: ["SaaS", "Dashboard", "Analytics", "Next.js", "TypeScript"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster />
              <WebVitals />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

// 2. 環境設定の最適化
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@heroicons/react", "chart.js"],
  },

  // 画像最適化
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // リダイレクト設定
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "auth-token",
          },
        ],
      },
    ];
  },

  // 環境変数の検証
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;

// 3. パフォーマンス最適化の最終調整
// lib/performance.ts
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  measureComponentRender(componentName: string, renderTime: number) {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }

    const times = this.metrics.get(componentName)!;
    times.push(renderTime);

    // 最新100回のみ保持
    if (times.length > 100) {
      times.shift();
    }

    // 閾値を超えた場合は警告
    if (renderTime > 100) {
      console.warn(
        `Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`
      );
    }
  }

  getAverageRenderTime(componentName: string): number {
    const times = this.metrics.get(componentName);
    if (!times || times.length === 0) return 0;

    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getPerformanceReport(): Record<string, { average: number; count: number }> {
    const report: Record<string, { average: number; count: number }> = {};

    this.metrics.forEach((times, componentName) => {
      report[componentName] = {
        average: this.getAverageRenderTime(componentName),
        count: times.length,
      };
    });

    return report;
  }
}

// 4. エラーハンドリングの統合
// lib/error-handler.ts
import * as Sentry from "@sentry/nextjs";
import { logger } from "@/lib/logger";

export class ErrorHandler {
  static handleError(error: Error, context?: Record<string, any>) {
    // ログ記録
    logger.error(error.message, {
      stack: error.stack,
      context,
    });

    // Sentryに送信
    Sentry.captureException(error, {
      extra: context,
    });

    // 開発環境では詳細表示
    if (process.env.NODE_ENV === "development") {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        context,
      });
    }
  }

  static handleApiError(error: Error, request: Request) {
    const context = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    };

    this.handleError(error, context);
  }

  static createErrorResponse(error: Error, status: number = 500) {
    const isDevelopment = process.env.NODE_ENV === "development";

    return Response.json(
      {
        error: isDevelopment ? error.message : "Internal Server Error",
        ...(isDevelopment && { stack: error.stack }),
      },
      { status }
    );
  }
}
```

### Day 53-54: テスト実装

#### 🎯 包括的なテスト戦略

```typescript
// 5. ユニットテスト
// __tests__/components/dashboard/stats-overview.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { StatsOverview } from "@/components/dashboard/stats-overview";

// モック
jest.mock("@/lib/api", () => ({
  getDashboardStats: jest.fn(),
}));

const mockStats = {
  activeProjects: 12,
  completedTasks: 45,
  teamMembers: 8,
  avgCompletionTime: 3.2,
};

describe("StatsOverview", () => {
  beforeEach(() => {
    (require("@/lib/api").getDashboardStats as jest.Mock).mockResolvedValue(
      mockStats
    );
  });

  it("統計データを正しく表示する", async () => {
    render(<StatsOverview />);

    await waitFor(() => {
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText("45")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("3.2日")).toBeInTheDocument();
    });
  });

  it("ローディング状態を表示する", () => {
    (require("@/lib/api").getDashboardStats as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // 永続的にpending
    );

    render(<StatsOverview />);
    expect(screen.getByTestId("stats-loading")).toBeInTheDocument();
  });

  it("エラー状態を適切に処理する", async () => {
    (require("@/lib/api").getDashboardStats as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    render(<StatsOverview />);

    await waitFor(() => {
      expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument();
    });
  });
});

// 6. 統合テスト
// __tests__/integration/auth-flow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthProvider } from "@/contexts/auth-context";

const MockedAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("認証フロー統合テスト", () => {
  it("ログインフローが正常に動作する", async () => {
    const user = userEvent.setup();

    render(
      <MockedAuthProvider>
        <AuthForm />
      </MockedAuthProvider>
    );

    // メールアドレス入力
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    // パスワード入力
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, "password123");

    // ログインボタンクリック
    const loginButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(loginButton);

    // ローディング状態の確認
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();

    // 成功後のリダイレクト確認
    await waitFor(() => {
      expect(window.location.pathname).toBe("/dashboard");
    });
  });

  it("バリデーションエラーを適切に表示する", async () => {
    const user = userEvent.setup();

    render(
      <MockedAuthProvider>
        <AuthForm />
      </MockedAuthProvider>
    );

    // 無効なメールアドレス
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");

    // 短すぎるパスワード
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, "123");

    const loginButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(loginButton);

    // バリデーションエラーの確認
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      expect(screen.getByText(/password too short/i)).toBeInTheDocument();
    });
  });
});

// 7. E2Eテスト（Playwright）
// e2e/dashboard.spec.ts
import { test, expect } from "@playwright/test";

test.describe("ダッシュボード E2E テスト", () => {
  test.beforeEach(async ({ page }) => {
    // ログイン状態をセットアップ
    await page.goto("/auth");
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "password123");
    await page.click('[data-testid="login-button"]');
    await page.waitForURL("/dashboard");
  });

  test("ダッシュボードが正常に表示される", async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/DataFlow/);

    // 主要な要素の確認
    await expect(page.locator('[data-testid="stats-overview"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="project-progress"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
  });

  test("プロジェクト作成フローが動作する", async ({ page }) => {
    // 新規プロジェクトボタンをクリック
    await page.click('[data-testid="new-project-button"]');

    // モーダルが開くことを確認
    await expect(page.locator('[data-testid="project-modal"]')).toBeVisible();

    // プロジェクト情報を入力
    await page.fill('[data-testid="project-name"]', "テストプロジェクト");
    await page.fill(
      '[data-testid="project-description"]',
      "E2Eテスト用のプロジェクト"
    );

    // 作成ボタンをクリック
    await page.click('[data-testid="create-project-button"]');

    // 成功メッセージの確認
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();

    // プロジェクトリストに追加されることを確認
    await expect(page.locator("text=テストプロジェクト")).toBeVisible();
  });

  test("レスポンシブデザインが正常に動作する", async ({ page }) => {
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });

    // サイドバーが折りたたまれることを確認
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible();

    // ハンバーガーメニューが表示されることを確認
    await expect(
      page.locator('[data-testid="mobile-menu-button"]')
    ).toBeVisible();

    // メニューを開く
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-sidebar"]')).toBeVisible();
  });
});

// 8. パフォーマンステスト
// __tests__/performance/lighthouse.test.ts
import { test, expect } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";

test.describe("Lighthouse パフォーマンステスト", () => {
  test("ダッシュボードページのパフォーマンス", async ({ page }) => {
    await page.goto("/dashboard");

    const audit = await playAudit({
      page,
      thresholds: {
        performance: 90,
        accessibility: 95,
        "best-practices": 90,
        seo: 85,
      },
    });

    expect(audit.lhr.categories.performance.score).toBeGreaterThan(0.9);
    expect(audit.lhr.categories.accessibility.score).toBeGreaterThan(0.95);
    expect(audit.lhr.categories["best-practices"].score).toBeGreaterThan(0.9);
    expect(audit.lhr.categories.seo.score).toBeGreaterThan(0.85);
  });
});
```

### Day 55-56: CI/CD・デプロイメント

#### 🎯 自動化パイプライン構築

```yaml
# 9. GitHub Actions CI/CD
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "18"
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm run test:unit

      - name: Build application
        run: npm run build

      - name: E2E tests
        run: npm run test:e2e

  security:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run security audit
        run: npm audit --audit-level high

      - name: Dependency vulnerability scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/develop'

    steps:
      - name: Deploy to staging
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: "--env ENVIRONMENT=staging"

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to production
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: "--prod"

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: "#deployments"
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

```typescript
// 10. デプロイメント設定
// scripts/deploy.ts
import { execSync } from "child_process";
import { readFileSync } from "fs";

interface DeploymentConfig {
  environment: "staging" | "production";
  branch: string;
  buildCommand: string;
  healthCheckUrl: string;
}

const configs: Record<string, DeploymentConfig> = {
  staging: {
    environment: "staging",
    branch: "develop",
    buildCommand: "npm run build",
    healthCheckUrl: "https://dataflow-staging.vercel.app/api/health",
  },
  production: {
    environment: "production",
    branch: "main",
    buildCommand: "npm run build",
    healthCheckUrl: "https://dataflow.vercel.app/api/health",
  },
};

class DeploymentManager {
  private config: DeploymentConfig;

  constructor(environment: string) {
    this.config = configs[environment];
    if (!this.config) {
      throw new Error(`Unknown environment: ${environment}`);
    }
  }

  async deploy() {
    console.log(`🚀 Deploying to ${this.config.environment}...`);

    try {
      // 1. ブランチ確認
      this.checkBranch();

      // 2. 依存関係インストール
      this.installDependencies();

      // 3. テスト実行
      await this.runTests();

      // 4. ビルド
      this.build();

      // 5. デプロイ
      await this.deployToVercel();

      // 6. ヘルスチェック
      await this.healthCheck();

      console.log("✅ Deployment successful!");
    } catch (error) {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    }
  }

  private checkBranch() {
    const currentBranch = execSync("git branch --show-current", {
      encoding: "utf8",
    }).trim();
    if (currentBranch !== this.config.branch) {
      throw new Error(
        `Expected branch ${this.config.branch}, but on ${currentBranch}`
      );
    }
  }

  private installDependencies() {
    console.log("📦 Installing dependencies...");
    execSync("npm ci", { stdio: "inherit" });
  }

  private async runTests() {
    console.log("🧪 Running tests...");
    execSync("npm run test:unit", { stdio: "inherit" });
    execSync("npm run type-check", { stdio: "inherit" });
    execSync("npm run lint", { stdio: "inherit" });
  }

  private build() {
    console.log("🔨 Building application...");
    execSync(this.config.buildCommand, { stdio: "inherit" });
  }

  private async deployToVercel() {
    console.log("🌐 Deploying to Vercel...");
    const deployCommand =
      this.config.environment === "production" ? "vercel --prod" : "vercel";

    execSync(deployCommand, { stdio: "inherit" });
  }

  private async healthCheck() {
    console.log("🏥 Performing health check...");

    const maxRetries = 5;
    const retryDelay = 10000; // 10秒

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(this.config.healthCheckUrl);
        if (response.ok) {
          console.log("✅ Health check passed");
          return;
        }
      } catch (error) {
        console.log(
          `⏳ Health check attempt ${i + 1}/${maxRetries} failed, retrying...`
        );
      }

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw new Error("Health check failed after maximum retries");
  }
}

// 実行
const environment = process.argv[2];
if (!environment) {
  console.error("Usage: npm run deploy <staging|production>");
  process.exit(1);
}

const deployment = new DeploymentManager(environment);
deployment.deploy().catch(console.error);
```

## 🎯 実践演習

### 演習 8-1: プロジェクト完全統合 🔶

**目標**: 全機能の統合とブラッシュアップ

```typescript
// 統合する機能
interface ProjectIntegration {
  authentication: "Supabase認証システム";
  dashboard: "SaaSダッシュボード";
  realtime: "リアルタイム機能";
  api: "API Routes・データ管理";
  monitoring: "監視・ログシステム";
}

// 品質要件
interface QualityRequirements {
  performance: "Core Web Vitals最適化";
  accessibility: "WCAG 2.1 AA準拠";
  security: "セキュリティベストプラクティス";
  seo: "SEO最適化";
}
```

### 演習 8-2: 運用体制構築 🔥

**目標**: プロダクション運用の準備

```typescript
// 運用要件
interface OperationalRequirements {
  cicd: "CI/CDパイプライン";
  monitoring: "監視・アラート";
  backup: "バックアップ・復旧";
  scaling: "スケーリング戦略";
  maintenance: "保守・更新プロセス";
}
```

## 📊 Step 8 評価基準

### 理解度チェックリスト

#### プロジェクト統合 (30%)

- [ ] 全機能を適切に統合できる
- [ ] パフォーマンスを最適化できる
- [ ] セキュリティを確保できる
- [ ] ユーザビリティを向上できる

#### テスト・品質管理 (35%)

- [ ] 包括的なテスト戦略を実装できる
- [ ] Unit・Integration・E2E テストを作成できる
- [ ] パフォーマンステストを実行できる
- [ ] 品質メトリクスを測定できる

#### デプロイ・運用 (25%)

- [ ] CI/CD パイプラインを構築できる
- [ ] プロダクションデプロイを実行できる
- [ ] 監視・ログシステムを運用できる
- [ ] インシデント対応を準備できる

#### 実践応用 (10%)

- [ ] プロダクションレベルの品質を実現できる
- [ ] 継続的改善プロセスを構築できる
- [ ] チーム開発に対応できる
- [ ] スケーラビリティを確保できる

### Phase 3 総合成果物

- [ ] **SaaS ダッシュボード「DataFlow」**: 完全に動作するプロダクション品質のアプリケーション
- [ ] **Next.js + TypeScript 統合**: 型安全なフルスタック開発
- [ ] **Supabase 統合**: 認証・データベース・リアルタイム機能
- [ ] **CI/CD パイプライン**: 自動化されたデプロイメント環境
- [ ] **監視・運用システム**: プロダクション運用体制

## 🎉 Phase 3 完了・次フェーズ準備

### Phase 3 達成確認

- [ ] 全ての週次目標達成
- [ ] 成果物の品質確認
- [ ] 自己評価の実施
- [ ] ポートフォリオ更新

### 継続学習・発展

- [ ] **コミュニティ貢献**: オープンソースプロジェクトへの参加
- [ ] **技術記事執筆**: 学習内容の発信・共有
- [ ] **メンタリング**: 他の学習者への支援
- [ ] **新技術習得**: 最新技術トレンドのキャッチアップ

---

**🌟 Phase 3 完了おめでとうございます！**

TypeScript × Next.js を活用したフルスタック開発の完全なスキルセットを習得できました。SaaS ダッシュボード「DataFlow」の開発を通じて、実践的なプロダクション開発経験を積むことができました。

**📌 重要**: Phase 3 で習得したフルスタック開発スキルは、現代的な Web 開発の核心技術です。継続的な実践と新技術の学習を通じて、さらなる成長を目指してください。

**🚀 あなたの TypeScript × Next.js Expert への旅は、ここから新たなステージへ！**
