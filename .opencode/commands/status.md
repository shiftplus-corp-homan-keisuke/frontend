---
description: プロジェクトとエージェントの状態を表示
---

現在のプロジェクトとエージェントの状態を表示します。

## 表示内容

1. **プロジェクト情報**
   - プロジェクト名とパス
   - プロジェクト種別（自動検出）
   - 技術スタック
   - 現在の機能

2. **ファイル統計**
   - 作成ファイル数
   - 更新ファイル数

3. **プレビュー状態**
   - サーバー起動中か
   - URL（あれば）
   - ヘルスチェック

## 手順

1. **プロジェクト情報の収集**
   - package.json/requirements.txt/go.mod などを確認
   - React/Next.js/Python/Node.js などの種別を特定
   - 主要ディレクトリを列挙

2. **プレビューサーバー確認**
   - Run: !`ps aux | grep -E "(npm|node|next|vite|python|uvicorn)" | grep -v grep`
   - 起動中なら URL/port を特定

3. **ファイル分析**
   - ファイル種別カウント
   - 直近の変更を表示

## 出力形式

```
=== Project Status ===

📁 Project: [project-name]
📂 Path: [current-path]
🏷️ Type: [project-type]
📊 Status: [active/development/production]

🔧 Tech Stack:
   Framework: [detected-framework]
   Language: [detected-language]
   Package Manager: [npm/yarn/pip/cargo]

✅ Features:
   • [feature-1]
   • [feature-2]

📄 Files: [X] created, [Y] modified

=== Preview Status ===

🌐 URL: [url-or-not-running]
💚 Health: [OK/Not Running]
```

現在のワークスペースに基づき包括的なステータスレポートを提供してください。
