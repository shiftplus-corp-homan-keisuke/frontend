# プロジェクト構造

## リポジトリ構成

学習教材とメインアプリケーションを含むモノレポ構成:

```
/
├── learning-progress-tracker/    # メインNext.jsアプリケーション
├── angular/                     # Angular学習教材
├── react/                       # React学習教材  
├── typescript/                  # TypeScript学習教材
├── memo/                        # 一般的な開発メモ
├── playground/                  # コード実験
├── 学習プラン/                   # 構造化された学習プラン
├── 学習プラン草案/               # 学習プラン草案
└── .kiro/                       # Kiro設定とスペック
```

## メインアプリケーション構造 (`learning-progress-tracker/`)

### ソースコード構成 (`src/`)

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx              # ルートレイアウト
│   ├── page.tsx                # ホームページ
│   └── globals.css             # グローバルスタイル
├── components/                  # Reactコンポーネント
│   ├── artifacts/              # 成果物管理コンポーネント
│   ├── common/                 # 共有/再利用可能コンポーネント
│   ├── dashboard/              # ダッシュボード専用コンポーネント
│   ├── layout/                 # レイアウトコンポーネント
│   ├── progress/               # 進捗可視化コンポーネント
│   ├── tasks/                  # タスク管理コンポーネント
│   └── ui/                     # ベースUIコンポーネント
├── hooks/                      # カスタムReactフック
├── lib/                        # ユーティリティライブラリ
│   ├── api/                    # APIクライアント関数
│   ├── constants/              # アプリケーション定数
│   ├── validations/            # バリデーションスキーマ
│   └── providers.tsx           # コンテキストプロバイダー
├── stores/                     # Zustand状態ストア
│   ├── learning-store.ts       # メイン学習進捗ストア
│   ├── timer-store.ts          # 学習タイマーストア
│   ├── ui-store.ts             # UI状態ストア
│   └── index.ts                # ストアエクスポート
├── types/                      # TypeScript型定義
├── utils/                      # ユーティリティ関数
└── data/                       # モックデータとJSON serverデータベース
    └── db.json                 # JSON serverデータベース
```

## インポートパス規約

クリーンなインポートのためのTypeScriptパスエイリアス:

- `@/*` - ルートsrcディレクトリ
- `@/components/*` - コンポーネントインポート
- `@/lib/*` - ライブラリユーティリティ
- `@/hooks/*` - カスタムフック
- `@/stores/*` - 状態ストア
- `@/types/*` - 型定義
- `@/utils/*` - ユーティリティ関数

## コンポーネント構成原則

### コンポーネント階層
- **ページコンポーネント**: `app/`内のトップレベルルートコンポーネント
- **機能コンポーネント**: 機能フォルダ内のドメイン固有コンポーネント
- **共通コンポーネント**: `components/common/`内の再利用可能コンポーネント
- **UIコンポーネント**: `components/ui/`内のベースデザインシステムコンポーネント

### ファイル命名規約
- コンポーネント: PascalCase (例: `TaskManager.tsx`)
- フック: `use`プレフィックス付きcamelCase (例: `useProgress.ts`)
- ストア: サフィックス付きkebab-case (例: `learning-store.ts`)
- 型: PascalCaseインターフェース (例: `Task`, `Phase`)
- ユーティリティ: camelCase関数 (例: `formatTime.ts`)

## 状態管理アーキテクチャ

### ストア分離
- **learning-store.ts**: コア学習データ（フェーズ、タスク、進捗）
- **timer-store.ts**: 学習セッションタイミング機能
- **ui-store.ts**: UI状態（サイドバー、テーマ、通知）

### データフローパターン
1. コンポーネントはフック経由でストアを利用
2. API呼び出しはTanStack Query経由で処理
3. ローカル状態はZustandで管理
4. サーバー状態は自動的にキャッシュ・同期

## 開発ワークフロー

### 機能開発
1. `src/types/`で型を作成
2. `src/stores/`でストアロジックを実装
3. `src/lib/api/`でAPI関数を構築
4. `src/hooks/`でカスタムフックを作成
5. 適切な機能フォルダでコンポーネントを開発
6. `src/app/`でページルートに追加

### テスト構造
- 単体テスト: コンポーネントと同じ場所 (`.test.tsx`)
- 統合テスト: `__tests__/`ディレクトリ
- E2Eテスト: ルート`e2e/`ディレクトリ（追加時）

## 設定ファイル

- `tsconfig.json`: 厳密な設定のTypeScript設定
- `eslint.config.mjs`: TypeScriptとReactのESLintルール
- `.prettierrc`: Tailwindプラグイン付きコードフォーマットルール
- `next.config.ts`: Next.js設定
- `package.json`: 依存関係とスクリプト