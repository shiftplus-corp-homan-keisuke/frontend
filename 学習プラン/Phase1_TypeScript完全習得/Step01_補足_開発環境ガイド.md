# Step01 開発環境ガイド

> 💡 **このファイルについて**: TypeScript開発環境の構築と設定方法の詳細ガイドです。

## 📋 目次
1. [Node.js LTS版について](#nodejs-lts版について)
2. [パッケージマネージャーの比較](#パッケージマネージャーの比較)
3. [VS Code拡張機能の推奨設定](#vs-code拡張機能の推奨設定)
4. [ターミナル/コマンドプロンプトの基本操作](#ターミナルコマンドプロンプトの基本操作)

---

## Node.js LTS版について

### LTS (Long Term Support)とは
**LTS (Long Term Support)**: 長期サポート版
- **安定性重視**: 本番環境での使用に適している
- **サポート期間**: 約30ヶ月間のサポート
- **バージョン**: 偶数バージョン（18.x, 20.x など）

### インストール方法
1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. LTSバージョンをダウンロード
3. インストーラーを実行
4. インストール確認: `node --version`

### バージョン管理ツール
```bash
# nvm (Node Version Manager) の使用
# インストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 使用可能なバージョン確認
nvm list-remote

# LTS版のインストール
nvm install --lts

# バージョン切り替え
nvm use 18.17.0
```

---

## パッケージマネージャーの比較

### npm (Node Package Manager)
```bash
# プロジェクト初期化
npm init -y

# パッケージインストール
npm install typescript
npm install -D @types/node

# スクリプト実行
npm run build
npm start
```

### yarn
```bash
# プロジェクト初期化
yarn init -y

# パッケージインストール
yarn add typescript
yarn add -D @types/node

# スクリプト実行
yarn build
yarn start
```

### pnpm
```bash
# プロジェクト初期化
pnpm init

# パッケージインストール
pnpm add typescript
pnpm add -D @types/node

# スクリプト実行
pnpm build
pnpm start
```

### 選択の指針
- **npm**: 標準、最も広く使用されている
- **yarn**: 高速、yarn.lockファイル
- **pnpm**: 最も高速、ディスク容量節約

---

## VS Code拡張機能の推奨設定

### 必須拡張機能
1. **TypeScript Importer**: 自動インポート
2. **ESLint**: コード品質チェック
3. **Prettier**: コードフォーマット
4. **TypeScript Hero**: TypeScript支援

### settings.json設定例
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### 推奨設定の詳細

#### TypeScript関連設定
- `typescript.preferences.importModuleSpecifier`: インポートパスの形式を指定
- `typescript.suggest.autoImports`: 自動インポート提案を有効化
- `typescript.updateImportsOnFileMove.enabled`: ファイル移動時のインポート自動更新

#### エディタ設定
- `editor.formatOnSave`: 保存時の自動フォーマット
- `editor.codeActionsOnSave`: 保存時のコードアクション実行

---

## ターミナル/コマンドプロンプトの基本操作

### 基本コマンド
```bash
# ディレクトリ移動
cd typescript-learning
cd ..  # 親ディレクトリに移動
cd ~   # ホームディレクトリに移動

# ディレクトリ作成
mkdir src
mkdir -p src/components  # 親ディレクトリも同時作成

# ファイル作成
touch index.ts  # Unix/Mac
echo. > index.ts  # Windows

# ファイル・ディレクトリ一覧
ls     # Unix/Mac
dir    # Windows
ls -la # 詳細表示

# ファイル削除
rm index.ts      # Unix/Mac
del index.ts     # Windows

# ディレクトリ削除
rm -rf node_modules  # Unix/Mac
rmdir /s node_modules  # Windows
```

### TypeScript開発でよく使うコマンド
```bash
# TypeScriptコンパイル
npx tsc

# ファイル監視モード
npx tsc --watch

# 特定ファイルのコンパイル
npx tsc index.ts

# 型チェックのみ（ファイル出力なし）
npx tsc --noEmit

# ts-nodeで直接実行
npx ts-node index.ts

# プロジェクト初期化
npm init -y
npx tsc --init
```

### 便利なショートカット

#### Windows
- `Ctrl + C`: 実行中のプロセスを停止
- `Ctrl + L`: 画面クリア
- `Tab`: ファイル名・ディレクトリ名の補完
- `↑/↓`: コマンド履歴の参照

#### Mac/Linux
- `Cmd + C` / `Ctrl + C`: 実行中のプロセスを停止
- `Cmd + K` / `Ctrl + L`: 画面クリア
- `Tab`: ファイル名・ディレクトリ名の補完
- `↑/↓`: コマンド履歴の参照

### プロジェクト構造の例
```
typescript-learning/
├── src/
│   ├── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── types/
│       └── user.ts
├── dist/
├── node_modules/
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── .gitignore
```

### 開発ワークフローの例
```bash
# 1. プロジェクト作成
mkdir my-typescript-project
cd my-typescript-project

# 2. 初期化
npm init -y
npx tsc --init

# 3. 依存関係インストール
npm install -D typescript @types/node ts-node nodemon

# 4. 開発用スクリプト設定（package.jsonに追加）
# "scripts": {
#   "build": "tsc",
#   "dev": "ts-node src/index.ts",
#   "dev:watch": "nodemon --exec ts-node src/index.ts"
# }

# 5. 開発開始
npm run dev:watch
```

---

## 🚨 よくある問題と解決方法

### "command not found" エラー
**原因**: コマンドがインストールされていない、またはPATHが通っていない
**解決方法**:
```bash
# グローバルインストール
npm install -g typescript

# または、npxを使用
npx tsc --version
```

### 権限エラー（Mac/Linux）
**原因**: 管理者権限が必要
**解決方法**:
```bash
# sudoを使用（注意して使用）
sudo npm install -g typescript

# または、nvmを使用してNode.jsを管理
```

### パッケージインストールエラー
**原因**: ネットワーク問題、キャッシュ問題
**解決方法**:
```bash
# キャッシュクリア
npm cache clean --force

# node_modulesとpackage-lock.jsonを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 参考リンク

- [Node.js公式サイト](https://nodejs.org/)
- [npm公式ドキュメント](https://docs.npmjs.com/)
- [Visual Studio Code公式サイト](https://code.visualstudio.com/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)

---

**📌 重要**: 開発環境の構築は一度設定すれば長期間使用できます。時間をかけて丁寧に設定し、快適な開発環境を整えましょう。