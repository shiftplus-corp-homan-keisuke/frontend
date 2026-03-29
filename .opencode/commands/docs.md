---
description: プロジェクトドキュメントの自動生成/管理
agent: general
subtask: true
---

DOCS モードでドキュメントを自動生成する。

## Task
$ARGUMENTS

## Process

### Phase 1: コマンド解析

ユーザー依頼からアクションを判定:

**Available subcommands:**
- `generate` - すべて生成
- `generate --type [api|components|architecture]` - 特定種別
- `update` - 変更分のみ
- `serve` - ドキュメントプレビューサーバー
- `config init` - 設定ファイル作成

**Examples:**
- `/docs generate` → 全生成
- `/docs generate --type api` → API docs のみ
- `/docs update` → 差分のみ
- `/docs serve` → プレビュー
- `/docs config init` → .docsrc.json 作成

### Phase 2: 設定チェック

1. **`.docsrc.json` を確認**
   - `generate`/`update` で存在しない → `/docs config init` を促す
   - `config init` の場合は作成

2. **設定読み込み** (存在時):
   ```json
   {
     "outputDir": "docs",
     "include": ["src/**/*.{ts,tsx}"],
     "exclude": ["**/*.test.{ts,tsx}", "**/node_modules/**"],
     "generators": {
       "api": { "enabled": true, "format": ["markdown", "openapi"], "output": "docs/api" },
       "components": { "enabled": true, "format": ["markdown", "storybook"], "output": "docs/components" },
       "architecture": { "enabled": true, "format": ["mermaid"], "output": "docs/architecture" }
     }
   }
   ```

### Phase 3: ドキュメント生成

#### `generate`

1. **生成スクリプト実行**:
   ```bash
   python3 .opencode/scripts/docs_generator.py generate
   ```

2. **出力確認**
3. **結果報告**

#### `update`

1. **差分取得**:
   ```bash
   git diff --name-only HEAD~1
   ```

2. **差分生成**:
   ```bash
   python3 .opencode/scripts/docs_generator.py update --files [changed files]
   ```

#### `serve`

1. **プレビューサーバー起動**
   - docs ディレクトリ確認
   - 簡易 HTTP サーバー or 既存 preview
   - URL を表示

#### `config init`

1. **`.docsrc.json` 作成**
2. **プロジェクト種別を検出**
3. **適切な default config を生成**
4. **出力ディレクトリ作成**

### Phase 4: Quality Check

生成後:

1. **出力ファイル確認**
2. **エラー/警告チェック**
3. **検証スクリプト実行** (あれば)
4. **サマリー報告**

## Key Principles

- **Configuration first**: `.docsrc.json` を確認
- **Incremental updates**: 必要分のみ再生成
- **Clear feedback**: 成功/失敗/理由を明確化
- **Type safety**: TS 型解析
- **Standards compliance**: OpenAPI 3.0, Mermaid

## Output Format

成功時:

```
✅ Documentation generated successfully!

📁 Output Directory: docs/

📝 Generated Files:
   - docs/api/endpoints.md (12 endpoints)
   - docs/api/openapi.json
   - docs/components/Button.md
   - docs/architecture/file-tree.md

⏱️  Generation Time: 2.3s

💡 Next Steps:
   - Run: /docs serve to preview
   - Review: docs/ directory
```

失敗時:

```
❌ Documentation generation failed

🔴 Error: [error message]

💡 Solution: [suggested fix]
```

## Integration with Other Commands

- **After `/create`**: 初期ドキュメント生成を提案
- **After `/enhance`**: `/docs update` を提案
- **Before `/deploy`**: docs が最新か確認

## Technical Notes

- ジェネレーターは `.opencode/scripts/` の Python
- テンプレートは `.opencode/templates/docs/`
- TypeScript/JSDoc/コメントベース対応
- Markdown/OpenAPI JSON/YAML/Mermaid 出力
