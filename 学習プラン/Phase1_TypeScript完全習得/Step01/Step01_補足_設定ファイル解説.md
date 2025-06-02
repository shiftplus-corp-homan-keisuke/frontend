# Step01 設定ファイル解説

> 💡 **このファイルについて**: TypeScriptプロジェクトの各種設定ファイルの詳細解説です。

## 📋 目次
1. [tsconfig.json設定詳細](#tsconfigjson設定詳細)
2. [package.json設定](#packagejson設定)
3. [ESLint設定（.eslintrc.json）](#eslint設定eslintrcjson)
4. [Prettier設定（.prettierrc）](#prettier設定prettierrc)
5. [.gitignore設定](#gitignore設定)

---

## tsconfig.json設定詳細

TypeScriptプロジェクトの設定ファイル`tsconfig.json`について、各オプションの詳細を解説します。

### 基本設定オプション

#### target
```json
"target": "ES2020"
```
- **意味**: 出力するJavaScriptのバージョンを指定
- **選択肢**: ES5, ES2015, ES2017, ES2018, ES2019, ES2020, ES2021, ES2022, ESNext
- **推奨**: ES2020（モダンブラウザ対応）
- **注意**: 古いブラウザをサポートする場合はES5を選択

#### module
```json
"module": "commonjs"
```
- **意味**: 出力するモジュールシステムを指定
- **選択肢**: commonjs, amd, es6, es2015, es2020, esnext, node16, nodenext
- **推奨**:
  - Node.js: commonjs
  - ブラウザ: es2020
  - モダンNode.js: node16

#### lib
```json
"lib": ["ES2020", "DOM"]
```
- **意味**: 使用可能なライブラリの型定義を指定
- **選択肢**: ES5, ES2015, ES2017, ES2018, ES2019, ES2020, DOM, WebWorker, ES2021, ES2022
- **推奨**:
  - Webアプリ: ["ES2020", "DOM"]
  - Node.js: ["ES2020"]
  - WebWorker: ["ES2020", "WebWorker"]

#### outDir
```json
"outDir": "./dist"
```
- **意味**: コンパイル後のJavaScriptファイルの出力先
- **推奨**: ./dist, ./build, ./out
- **注意**: gitignoreに追加することを推奨

#### rootDir
```json
"rootDir": "./src"
```
- **意味**: TypeScriptソースファイルのルートディレクトリ
- **推奨**: ./src
- **効果**: 出力ディレクトリの構造を制御

### 型チェック設定

#### strict
```json
"strict": true
```
- **意味**: 厳密な型チェックを有効化（複数のオプションをまとめて有効化）
- **含まれる設定**:
  - noImplicitAny
  - strictNullChecks
  - strictFunctionTypes
  - strictBindCallApply
  - strictPropertyInitialization
  - noImplicitReturns
  - noImplicitThis
- **推奨**: true（段階的に有効化することも可能）

#### noImplicitAny
```json
"noImplicitAny": true
```
- **意味**: any型の暗黙的使用を禁止
- **効果**: 型注釈の強制、型安全性向上
- **推奨**: true（初心者は段階的に有効化）

#### strictNullChecks
```json
"strictNullChecks": true
```
- **意味**: null/undefinedの厳密チェック
- **効果**: null/undefinedエラーの防止
- **推奨**: true（null安全性の向上）

#### strictFunctionTypes
```json
"strictFunctionTypes": true
```
- **意味**: 関数型の厳密チェック
- **効果**: 関数の引数の型安全性向上
- **推奨**: true

### モジュール解決設定

#### moduleResolution
```json
"moduleResolution": "node"
```
- **意味**: モジュール解決方法を指定
- **選択肢**: node, classic
- **推奨**: node（Node.jsスタイルの解決）

#### esModuleInterop
```json
"esModuleInterop": true
```
- **意味**: CommonJSとESモジュール間の相互運用性を向上
- **効果**: import文の使いやすさ向上
- **推奨**: true

#### allowSyntheticDefaultImports
```json
"allowSyntheticDefaultImports": true
```
- **意味**: デフォルトエクスポートがないモジュールからのデフォルトインポートを許可
- **効果**: import文の柔軟性向上
- **推奨**: true（esModuleInteropと併用）

### 開発支援設定

#### sourceMap
```json
"sourceMap": true
```
- **意味**: デバッグ用ソースマップファイルを生成
- **効果**: デバッグ時にTypeScriptコードを直接確認可能
- **推奨**: 開発時はtrue、本番環境では false

#### declaration
```json
"declaration": true
```
- **意味**: 型定義ファイル（.d.ts）を生成
- **効果**: ライブラリ作成時に型情報を提供
- **推奨**: ライブラリ開発時はtrue

#### removeComments
```json
"removeComments": false
```
- **意味**: 出力JavaScriptからコメントを削除
- **推奨**: 開発時はfalse、本番環境ではtrue

#### skipLibCheck
```json
"skipLibCheck": true
```
- **意味**: ライブラリの型定義ファイルの型チェックをスキップ
- **効果**: コンパイル速度の向上
- **推奨**: true（大規模プロジェクトで有効）

### プロジェクトタイプ別推奨設定

#### Node.jsプロジェクト
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

#### Webアプリプロジェクト
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "es2020",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "removeComments": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### ライブラリプロジェクト
```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

---

## package.json設定

TypeScriptプロジェクトの`package.json`設定について解説します。

### 基本構造
```json
{
  "name": "typescript-learning",
  "version": "1.0.0",
  "description": "TypeScript学習プロジェクト",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "dev:watch": "nodemon --exec ts-node src/index.ts",
    "clean": "rm -rf dist",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 重要なフィールド解説
- **main**: エントリーポイント（コンパイル後のJavaScriptファイル）
- **types**: 型定義ファイルのエントリーポイント
- **engines**: 対応Node.jsバージョンの指定
- **scripts**: よく使用するコマンドの定義

### 推奨スクリプト
- `build`: TypeScriptをコンパイル
- `build:watch`: ファイル変更を監視してコンパイル
- `dev`: 開発モードで実行（ts-node使用）
- `dev:watch`: ファイル変更を監視して再実行
- `type-check`: 型チェックのみ実行（ファイル出力なし）

---

## ESLint設定（.eslintrc.json）

TypeScript用のESLint設定例：

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-inferrable-types": "off"
  },
  "env": {
    "node": true,
    "es6": true
  }
}
```

### 主要ルールの説明
- `@typescript-eslint/no-unused-vars`: 未使用変数のエラー
- `@typescript-eslint/no-explicit-any`: any型の使用に警告
- `@typescript-eslint/explicit-function-return-type`: 関数の戻り値型の明示（オフ）

---

## Prettier設定（.prettierrc）

コードフォーマット設定例：

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 設定項目の説明
- `semi`: セミコロンの使用
- `trailingComma`: 末尾カンマの設定
- `singleQuote`: シングルクォートの使用
- `printWidth`: 1行の最大文字数
- `tabWidth`: タブの幅
- `useTabs`: タブ文字の使用（falseでスペース使用）

---

## .gitignore設定

TypeScriptプロジェクト用の.gitignore例：

```gitignore
# 依存関係
node_modules/

# ビルド出力
dist/
build/
*.tsbuildinfo

# ログファイル
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 環境設定
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# エディタ設定
.vscode/
.idea/
*.swp
*.swo

# OS生成ファイル
.DS_Store
Thumbs.db
```

### 重要なポイント
- `node_modules/`: 依存関係は必ず除外
- `dist/`, `build/`: ビルド出力は除外
- `*.tsbuildinfo`: TypeScriptの増分ビルド情報
- `.env*`: 環境変数ファイルは除外

---

## 🚨 設定ファイルのよくある問題

### tsconfig.jsonの問題
**症状**: コンパイルエラーが発生
**解決方法**:
```bash
# 設定ファイルの検証
npx tsc --showConfig

# 初期設定に戻す
npx tsc --init
```

### package.jsonの問題
**症状**: スクリプトが実行できない
**解決方法**:
```bash
# package.jsonの検証
npm run

# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install
```

### ESLintの問題
**症状**: 設定エラーが発生
**解決方法**:
```bash
# ESLint設定の検証
npx eslint --print-config src/index.ts

# 設定ファイルの初期化
npx eslint --init
```

---

## 📚 参考リンク

- [TypeScript tsconfig.json](https://www.typescriptlang.org/tsconfig)
- [npm package.json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

---

**📌 重要**: 設定ファイルはプロジェクトの基盤となります。各設定の意味を理解し、プロジェクトに適した設定を選択しましょう。