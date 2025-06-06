# STEP02 補足資料：開発環境ガイド

## 📚 目次

- [1. プロジェクト作成](#1-プロジェクト作成)
- [2. 必要なパッケージ追加](#2-必要なパッケージ追加)
- [3. 開発サーバーの起動](#3-開発サーバーの起動)
- [4. 推奨 VS Code 拡張機能](#4-推奨-vs-code-拡張機能)
- [5. トラブルシューティングのヒント](#5-トラブルシューティングのヒント)

---

### 1. プロジェクト作成

Vite を使用して React + TypeScript プロジェクトを新規作成します。

```bash
# プロジェクトを作成したいディレクトリに移動
# 例: cd ~/projects

# Vite を使って React + TypeScript プロジェクトを作成
npm create vite@latest pizza-menu -- --template react-ts

# 作成されたプロジェクトディレクトリに移動
cd pizza-menu

# 依存関係をインストール
npm install
```

**解説**:

- `npm create vite@latest` は、Vite の最新バージョンを使って新しいプロジェクトを生成するコマンドです。
- `-- --template react-ts` は、React と TypeScript のテンプレートを使用することを指定します。これにより、TypeScript の設定ファイル (`tsconfig.json`) や React のコンポーネントファイル (`.tsx`) が自動的に生成されます。
- `cd pizza-menu` でプロジェクトのルートディレクトリに移動します。
- `npm install` は、`package.json` に記述されているすべての依存関係（React, React DOM, TypeScript など）をインストールします。

### 2. 必要なパッケージ追加

このプロジェクトでは、特に追加のパッケージは必要ありませんが、将来的に必要になった場合の例を示します。

```bash
# 例: スタイリングライブラリをインストールする場合
# npm install styled-components

# 例: ルーティングライブラリをインストールする場合
# npm install react-router-dom
# npm install -D @types/react-router-dom # TypeScriptの型定義も忘れずに
```

**解説**:

- `npm install <package-name>` で新しいパッケージをプロジェクトに追加できます。
- TypeScript を使用している場合、JavaScript のライブラリには通常、型定義ファイルが必要です。型定義ファイルは `@types/<package-name>` の形式で提供され、`npm install -D` (開発依存関係として) インストールします。

### 3. 開発サーバーの起動

プロジェクトの準備ができたら、開発サーバーを起動してアプリケーションをブラウザで確認できます。

```bash
# 開発サーバーを起動
npm run dev
```

**解説**:

- このコマンドは、`package.json` の `scripts` セクションに定義されている `dev` スクリプトを実行します。
- Vite は非常に高速な開発サーバーを提供し、コードの変更をリアルタイムでブラウザに反映します（ホットリロード）。
- 通常、`http://localhost:5173` (または別のポート) でアプリケーションにアクセスできます。

### 4. 推奨 VS Code 拡張機能

開発効率を向上させるために、以下の VS Code 拡張機能の導入を推奨します。

- **ESLint**: JavaScript/TypeScript コードの静的解析を行い、コード品質と一貫性を保ちます。
- **Prettier - Code formatter**: コードを自動的にフォーマットし、チーム内でのコードスタイルの統一を助けます。
- **TypeScript and JavaScript Language Features**: VS Code に標準で組み込まれていますが、最新の TypeScript バージョンに対応しているか確認しましょう。
- **React Developer Tools**: ブラウザのデベロッパーツールに React コンポーネントツリーを表示し、`props` や `state` を検査できます。

### 5. トラブルシューティングのヒント

- **`npm install` が失敗する**:
  - インターネット接続を確認してください。
  - `npm cache clean --force` を実行してから再度 `npm install` を試してください。
  - Node.js と npm のバージョンがプロジェクトの要件を満たしているか確認してください。
- **`npm run dev` でエラーが発生する**:
  - エラーメッセージをよく読み、原因を特定してください。
  - 依存関係が正しくインストールされているか (`node_modules` フォルダが存在するか) 確認してください。
  - コードに構文エラーや型エラーがないか確認してください。VS Code の問題パネル (Problems panel) をチェックしましょう。
- **ブラウザで何も表示されない/エラーが表示される**:
  - ブラウザの開発者ツール (F12) を開き、コンソールにエラーメッセージが出ていないか確認してください。
  - ネットワークタブで、リソースが正しくロードされているか確認してください。
  - 開発サーバーが正しく起動しているか (`npm run dev` の出力) 確認してください。
- **TypeScript の型エラー**:
  - エラーメッセージに示されているファイルと行番号を確認し、型定義が正しいか、`props` の受け渡しが型に合致しているかを確認してください。
  - `tsconfig.json` の設定が正しいか確認してください。
  - `npm install` で `@types` パッケージが正しくインストールされているか確認してください。
