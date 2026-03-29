---
description: 対話形式で新規アプリを作成
agent: general
subtask: true
---

新規アプリケーションを構築する CREATE モード。

## Task
$ARGUMENTS

## Process

### Phase 1: Request Analysis

ユーザーが何を作りたいか理解する。

情報が不足している場合は `question` で確認:
- どのタイプのアプリ? (web/mobile/API など)
- コア機能は?
- 誰が使う?
- 好みの技術スタックは?

### Phase 2: Project Planning

1. **技術スタックの決定** (要件とデフォルト)
2. **ファイル構造を計画** (適切なパターン)
3. **既存ファイルを確認** (`Glob`)

### Phase 3: Implementation

要件確認後:

1. **プロジェクト構造の作成**
   - `Write` で必要なファイルを作成
   - 選定したスタックのベストプラクティスに従う
   - `Glob` で競合確認

2. **コア機能の実装**
   - 新規ファイルは `Write`
   - 既存ファイル更新は `Edit`
   - 変更前に `Read`

3. **開発セットアップ**
   - package.json 等の設定
   - 基本設定ファイル作成
   - 初期テンプレート/コンポーネント作成

### Phase 4: Preview

1. `/preview` で起動確認
2. 起動していなければ起動を提案
3. URL を提示

## Key Principles

- **Start simple**: まず MVP
- **Follow conventions**: 既存パターンに合わせる
- **Verify before writing**: `Read`/`Glob` で確認
- **Test as you go**: 基本動作を確認
- **Document**: 複雑なロジックにコメント

## Usage Examples

- `/create blog site` → シンプルなブログ
- `/create todo app` → タスク管理
- `/create REST API` → バックエンド API
- `/create portfolio` → ポートフォリオサイト

## Output

完了時に以下を提示:

```
✅ Application created successfully!

📁 Project: [project-name]
🔧 Tech Stack: [stack]
🌐 Features: [list of features]

📦 Next Steps:
1. Review the implementation
2. Run: npm install (if applicable)
3. Start development with: /preview start

Any modifications needed?
```

品質を担保しつつ段階的に構築する。
