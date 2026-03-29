# OpenCode コマンド

OpenCode TUI のカスタムコマンド、`.agent/workflows/` システムから変換されました。

## 利用可能なコマンド

| コマンド | 説明 | エージェント | サブタスク |
|---------|-------------|-------|---------|
| `/status` | プロジェクトとエージェントの状態を表示 | - | - |
| `/preview` | プレビューサーバー管理 (start/stop/restart) | - | - |
| `/brainstorm` | プロジェクト向けの構造化されたブレインストーミング | - | - |
| `/plan` | タスク分解を含むプロジェクト計画の作成 | general | ✅ |
| `/create` | 新しいアプリケーションの作成 | general | ✅ |
| `/enhance` | 既存のアプリケーションに機能を追加 | general | ✅ |
| `/debug` | 体系的な問題調査 | - | - |
| `/test` | テストの生成と実行 | - | - |
| `/deploy` | 事前チェック付きの本番デプロイメント | - | - |
| `/orchestrate` | 複雑なタスクのための複数エージェントの調整 | general | ✅ |
| `/ui-ux-pro-max` | 50以上のスタイルを持つAI搭載デザインシステム | - | - |

## 使用方法

### 基本的な使用法

OpenCode TUI で `/` を入力し、コマンド名を続けて入力します：

```
/status
/preview start
/brainstorm authentication system
/create todo app
/debug API returns 500 error
/test src/services/auth.ts
/deploy
```

### 引数付きコマンド

多くのコマンドは `$ARGUMENTS` を使用して引数を受け取ります：

```
/plan e-commerce site with cart
/create blog site with markdown support
/enhance add dark mode
/debug login not working
/test user registration flow
/ui-ux-pro-max fintech dashboard modern
```

### サブコマンド

一部のコマンドはサブコマンドをサポートしています：

```
/preview [start|stop|restart|check]
/deploy [check|preview|production|rollback]
/test [coverage|watch]
```

## コマンド詳細

### `/status` - プロジェクトステータス

現在のプロジェクト情報を表示します：
- プロジェクト名と種類
- テックスタック
- 実行中のプレビューサーバー
- ファイル統計

### `/preview` - プレビューサーバー管理

開発プレビューサーバーを管理します：
- `/preview` - 現在のステータスを表示
- `/preview start` - サーバーを起動
- `/preview stop` - サーバーを停止
- `/preview restart` - サーバーを再起動
- `/preview check` - ヘルスチェック

自動検出：
- Next.js (npm run dev)
- Vite (npm run dev)
- Python/FastAPI (uvicorn)
- Python/Flask (flask run)

### `/brainstorm` - 構造化されたブレインストーミング

実装前に複数の選択肢を探求：
- 3つ以上のアプローチと長所/短所を提供
- 作業レベルを見積もり
- 最適なアプローチを推奨
- コードは書かず、アイデアのみ

### `/plan` - プロジェクト計画

詳細なプロジェクト計画を作成：
- 要件を分析
- 必要に応じて明確化のための質問
- `docs/PLAN-{slug}.md` を作成
- 段階的なタスク分解
- コードは書かず、計画のみ

### `/create` - アプリケーション作成

ゼロから新しいアプリケーションを構築：
- 対話的な要件収集
- テックスタック選択
- プロジェクト構造作成
- コア機能実装
- プレビュー設定

### `/enhance` - 機能追加

既存のアプリケーションを更新：
- 現在のコードベースを分析
- 変更を計画
- 新規ファイルを作成
- 既存のコードを更新
- 一貫性を維持

### `/debug` - デバッグ

体系的な問題調査：
- エラー文脈を収集
- 最近の変更を確認
- 仮説を形成
- 体系的テスト
- 修正を適用
- 予防策を追加

### `/test` - テスト

テストを生成・実行：
- `/test` - 全テストを実行
- `/test [file]` - ファイルのテストを生成
- `/test coverage` - カバレッジレポートを表示
- Jest, Vitest, pytest, Go test をサポート

### `/deploy` - デプロイ

安全な本番デプロイ：
- 事前チェック (lint, test, build, security)
- プラットフォーム検出 (Vercel, Railway, Fly, Docker)
- デプロイ実行
- ヘルス検証
- ロールバックサポート

### `/orchestrate` - マルチエージェント調整

複�雑なタスクのために複数エージェントを調整：
- 最低3つの並列タスク
- 2段階アプローチ (計画 → 実装)
- ユーザー承認ゲート
- 包括的なレポート

### `/ui-ux-pro-max` - デザインシステム

AI搭載デザイン推奨：
- 50以上のUIスタイル
- 97種のカラーパレット
- 57のフォントペアリング
- 99のUXガイドライン
- 25種のチャートタイプ
- 9つのテックスタック

## ツールマッピング

| 元のワークフロー | OpenCode ツール |
|------------------|----------------|
| Python スクリプト | ``!`command` `` (shell 出力) |
| エージェント呼出し | `task` ツール |
| ファイル検索 | `glob`, `grep` |
| ファイル読取 | `read` |
| ファイル書込 | `write` |
| ファイル編集 | `edit` |
| 質問 | `question` ツール |
| タスク追跡 | `todowrite` ツール |

## 機能

### シェルコマンド実行

コマンドはシェルコマンドを実行し、出力を含めることができます：

```bash
!`npm test`
!`ps aux | grep node`
!`git log --oneline -10`
```

### ファイル参照

ファイル内容を自動的に含める：

```markdown
@src/components/Button.tsx のコンポーネントをレビュー
```

### 位置引数

個別の引数にアクセス：

```markdown
$1 - 第1引数
$2 - 第2引数
$3 - 第3引数
```

## アーキテクチャ

```
.opencode/
└── commands/
    ├── brainstorm.md       # アイデア探索
    ├── create.md           # アプリ作成
    ├── debug.md            # 問題調査
    ├── deploy.md           # デプロイ
    ├── enhance.md          # 機能追加
    ├── orchestrate.md      # マルチエージェントタスク
    ├── plan.md             # プロジェクト計画
    ├── preview.md          # サーバー管理
    ├── status.md           # ステータス表示
    ├── test.md             # テスト
    └── ui-ux-pro-max.md    # デザインシステム
```

## ベストプラクティス

1. **複�雑な機能は `/plan` から開始**
2. **アプローチ決定前に `/brainstorm` を使用**
3. **現状理解のために `/status` を確認**
4. **`/deploy` 前に `/test` を実行**
5. **マルチドメインタスクは `/orchestrate` を使用**
6. **デザインガイダンスに `/ui-ux-pro-max` を適用**

## 移行ノート

これらのコマンドは `.agent/workflows/` システムから変換されました：

- ✅ 全ての元の機能を維持
- ✅ OpenCode のネイティブツールに適応
- ✅ OpenCode のコマンド構文を使用
- ✅ シェルコマンド実行をサポート
- ✅ ファイル参照と引数
- ⚠️  一部の Python スクリプトは維持 (例: ui-ux-pro-max)
- ⚠️  エージェントシステムは OpenCode モデルに簡素化

## サポート

問題や質問がある場合：
- OpenCode ドキュメントを確認: https://opencode.ai/docs/commands/
- 元のワークフローをレビュー: `.agent/workflows/`
- 最初にコマンドを個別にテスト
