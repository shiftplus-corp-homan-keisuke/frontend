# 技術スタック

## コアフレームワーク & ランタイム

- **Next.js 15.4.6**: SSR/SSG機能を持つApp RouterベースのReactフレームワーク
- **React 19.1.0**: 最新の並行機能を備えたUIライブラリ
- **TypeScript 5**: 高度な設定による厳密な型チェック
- **Node.js**: ランタイム環境

## 状態管理 & データフェッチング

- **Zustand 5.0.7**: クライアントサイド状態管理のための軽量ライブラリ
- **TanStack Query 5.84.1**: サーバー状態管理、キャッシュ、同期
- **JSON Server 1.0.0-beta.3**: 開発用モックREST API

## UI & スタイリング

- **Tailwind CSS 4**: ユーティリティファーストCSSフレームワーク
- **Lucide React 0.537.0**: アイコンライブラリ
- **Class Variance Authority 0.7.1**: コンポーネントバリアント管理
- **clsx 2.1.1**: 条件付きclassNameユーティリティ

## データ可視化 & ユーティリティ

- **Recharts 3.1.2**: 進捗可視化のためのチャートライブラリ
- **date-fns 4.1.0**: 日付操作ユーティリティ

## 開発ツール

- **ESLint 9**: Next.jsとTypeScriptルールによるコードリンティング
- **Prettier 3.6.2**: Tailwindプラグイン付きコードフォーマッター
- **Concurrently 9.2.0**: 複数コマンドの同時実行

## TypeScript設定

厳密なTypeScript設定:
- `noUncheckedIndexedAccess`: undefined アクセスエラーの防止
- `noImplicitReturns`: すべてのコードパスで戻り値を保証
- `exactOptionalPropertyTypes`: 厳密なオプショナルプロパティ処理
- クリーンなインポートのためのパスエイリアス (`@/*`, `@/components/*`, など)

## よく使うコマンド

```bash
# 開発
npm run dev              # 開発サーバー起動
npm run dev:full         # 開発サーバー + JSON サーバーを同時起動
npm run json-server      # モックAPIサーバー起動 (ポート 3001)

# ビルド & 本番
npm run build            # 本番用ビルド
npm run start            # 本番サーバー起動

# コード品質
npm run lint             # ESLint実行
npm run lint:fix         # ESLintの問題を自動修正
npm run format           # Prettierでコードフォーマット
npm run format:check     # コードフォーマットをチェック
npm run type-check       # 出力なしでTypeScript型チェック
```

## アーキテクチャパターン

- **コンポーネントベースアーキテクチャ**: モジュラーなReactコンポーネント
- **カスタムフック**: 再利用可能なロジックの抽出
- **ストアパターン**: 予測可能な状態管理のためのZustand
- **APIレイヤー分離**: 専用のAPIクライアント関数
- **型ファースト開発**: 包括的なTypeScriptインターフェース