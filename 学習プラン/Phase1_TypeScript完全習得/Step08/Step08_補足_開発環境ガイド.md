# Step08 補足資料：開発環境ガイド

> 💡 **目的**: SOLID 原則学習に最適化された開発環境の構築手順
> 🎯 **対象**: TypeScript 上級者・効率的な学習環境を求める開発者
> 🛠️ **活用方法**: 学習開始前の環境準備・開発効率最大化のセットアップガイド

---

## 🏗️ 環境構築の全体フロー

### 📋 構築ステップ概要

1. **基本環境準備** - Node.js, TypeScript, エディタ設定
2. **プロジェクト初期化** - 新規 TypeScript プロジェクト作成
3. **開発ツール導入** - Linter, Formatter, テストツール
4. **SOLID 原則特化設定** - 専用ルール・拡張機能
5. **学習効率化ツール** - デバッグ・ドキュメント・可視化ツール

---

## 🔧 基本環境準備

### Node.js & npm 環境セットアップ

#### **1. Node.js インストール（最新 LTS 推奨）**

```bash
# Node.js バージョン確認
node --version  # v18.0.0 以上推奨
npm --version   # v8.0.0 以上推奨

# Node.js が未インストールの場合
# https://nodejs.org/ja/ からLTS版をダウンロード

# または nodenv/nvm を使用（推奨）
# nodenv を使った Node.js 管理
nodenv install 18.19.0
nodenv local 18.19.0

# nvm を使った Node.js 管理 (Windows/Linux/Mac)
nvm install 18.19.0
nvm use 18.19.0
```

#### **2. TypeScript グローバルインストール**

```bash
# TypeScript コンパイラのグローバルインストール
npm install -g typescript@latest

# インストール確認
tsc --version  # Version 5.3.0 以上推奨

# TypeScript Language Server（VS Code用）
npm install -g typescript-language-server
```

#### **3. 必須グローバルツール**

```bash
# ts-node: TypeScript を直接実行
npm install -g ts-node

# create-typescript-app: プロジェクト雛形作成
npm install -g create-typescript-app

# 型定義検索ツール
npm install -g typesync

# パッケージ脆弱性チェック
npm install -g npm-audit-resolver
```

---

## 📦 プロジェクト初期化

### SOLID 原則学習用プロジェクト作成

#### **1. プロジェクトディレクトリ作成**

```bash
# Step08学習用ディレクトリ作成
mkdir step08-solid-principles
cd step08-solid-principles

# Git 初期化（学習履歴管理用）
git init
echo "node_modules/" > .gitignore
echo "dist/" >> .gitignore
echo "*.log" >> .gitignore
echo ".DS_Store" >> .gitignore
echo ".vscode/settings.json" >> .gitignore
```

#### **2. package.json 初期化**

```bash
# package.json 作成
npm init -y

# 基本的な修正
npm pkg set name="step08-solid-principles"
npm pkg set description="SOLID原則学習用TypeScriptプロジェクト"
npm pkg set main="dist/index.js"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.dev="ts-node src/index.ts"
npm pkg set scripts.watch="tsc --watch"
npm pkg set scripts.clean="rm -rf dist"
```

#### **3. TypeScript 設定ファイル作成**

```bash
# tsconfig.json 作成
tsc --init
```

**推奨 tsconfig.json 設定:**

```json
{
  "compilerOptions": {
    /* 基本設定 */
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",

    /* 厳密な型チェック */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,

    /* 追加チェック */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,

    /* モジュール解決 */
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@solid/*": ["src/solid/*"],
      "@examples/*": ["src/examples/*"],
      "@utils/*": ["src/utils/*"]
    },
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,

    /* 出力設定 */
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,

    /* デバッグ支援 */
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

#### **4. プロジェクト構造作成**

```bash
# ディレクトリ構造作成
mkdir -p src/{solid,examples,utils,tests}
mkdir -p src/solid/{srp,ocp,lsp,isp,dip}
mkdir -p src/examples/{basic,intermediate,advanced}
mkdir -p docs
mkdir -p tools

# 基本ファイル作成
touch src/index.ts
touch src/solid/index.ts
touch README.md
```

**推奨ディレクトリ構造:**

```
step08-solid-principles/
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
├── src/
│   ├── index.ts                    # メインエントリーポイント
│   ├── solid/
│   │   ├── index.ts               # SOLID原則エクスポート
│   │   ├── srp/                   # 単一責任の原則
│   │   │   ├── good-examples.ts
│   │   │   ├── bad-examples.ts
│   │   │   └── refactoring.ts
│   │   ├── ocp/                   # オープン・クローズドの原則
│   │   │   ├── strategy-pattern.ts
│   │   │   ├── template-method.ts
│   │   │   └── plugins.ts
│   │   ├── lsp/                   # リスコフの置換原則
│   │   │   ├── inheritance.ts
│   │   │   └── substitution.ts
│   │   ├── isp/                   # インターフェース分離の原則
│   │   │   ├── segregated.ts
│   │   │   └── adapters.ts
│   │   └── dip/                   # 依存性逆転の原則
│   │       ├── dependency-injection.ts
│   │       └── containers.ts
│   ├── examples/
│   │   ├── basic/                 # 基本実装例
│   │   ├── intermediate/          # 中級実装例
│   │   └── advanced/              # 上級実装例
│   ├── utils/
│   │   ├── logger.ts              # ログ出力
│   │   ├── validator.ts           # バリデーション
│   │   └── helpers.ts             # ヘルパー関数
│   └── tests/                     # テストファイル
├── docs/                          # ドキュメント
├── tools/                         # 開発ツール
└── dist/                          # ビルド出力
```

---

## 🔧 開発ツール導入

### ESLint & Prettier セットアップ

#### **1. ESLint インストール・設定**

```bash
# ESLint と TypeScript 対応プラグインをインストール
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# ESLint 設定ファイル生成
npx eslint --init
```

**推奨 .eslintrc.json 設定:**

```json
{
  "env": {
    "es2022": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    /* SOLID原則支援ルール */
    "max-lines-per-function": ["warn", 50],
    "max-params": ["warn", 4],
    "complexity": ["warn", 10],
    "max-depth": ["warn", 4],
    "max-classes-per-file": ["warn", 1],

    /* TypeScript 固有 */
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/explicit-member-accessibility": "error",

    /* 設計品質向上 */
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-arrow-callback": "error"
  },
  "ignorePatterns": ["dist/", "node_modules/", "*.js"]
}
```

#### **2. Prettier インストール・設定**

```bash
# Prettier インストール
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Prettier 設定ファイル作成
echo '{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}' > .prettierrc.json

# Prettier 無視ファイル作成
echo "dist/
node_modules/
*.log" > .prettierignore
```

#### **3. package.json スクリプト追加**

```bash
# Lint & Format スクリプト追加
npm pkg set scripts.lint="eslint src --ext .ts"
npm pkg set scripts.lint:fix="eslint src --ext .ts --fix"
npm pkg set scripts.format="prettier --write src/**/*.ts"
npm pkg set scripts.format:check="prettier --check src/**/*.ts"
npm pkg set scripts.type-check="tsc --noEmit"
npm pkg set scripts.check="npm run type-check && npm run lint && npm run format:check"
```

### テスト環境セットアップ

#### **1. Jest インストール**

```bash
# Jest と TypeScript 対応モジュールをインストール
npm install --save-dev jest @types/jest ts-jest

# Jest 設定ファイル生成
npx ts-jest config:init
```

**jest.config.js 設定:**

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@solid/(.*)$": "<rootDir>/src/solid/$1",
    "^@examples/(.*)$": "<rootDir>/src/examples/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
  },
};
```

#### **2. テスト関連スクリプト追加**

```bash
npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:coverage="jest --coverage"
npm pkg set scripts.test:verbose="jest --verbose"
```

### 開発用ユーティリティ

#### **1. nodemon（自動再実行）**

```bash
# nodemon インストール
npm install --save-dev nodemon

# nodemon 設定ファイル作成
echo '{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.test.ts"],
  "exec": "ts-node src/index.ts"
}' > nodemon.json

# 開発サーバースクリプト追加
npm pkg set scripts.dev:watch="nodemon"
```

#### **2. 型チェック高速化**

```bash
# TypeScript コンパイラの高速化
npm install --save-dev typescript@beta  # 最新beta版（高速）

# 並列型チェック
npm install --save-dev tsc-watch

npm pkg set scripts.dev:typecheck="tsc-watch --onSuccess \"echo 'Type check passed'\" --onFailure \"echo 'Type check failed'\""
```

---

## 🎯 SOLID 原則特化設定

### 専用 ESLint ルール

#### **1. SOLID 原則支援ルール追加**

```bash
# 追加プラグインインストール
npm install --save-dev eslint-plugin-sonarjs eslint-plugin-unicorn
```

**.eslintrc.json に追加設定:**

```json
{
  "plugins": ["@typescript-eslint", "sonarjs", "unicorn"],
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended"
  ],
  "rules": {
    /* SRP（単一責任の原則）支援 */
    "max-lines": ["warn", 300],
    "max-lines-per-function": ["warn", 50],
    "sonarjs/cognitive-complexity": ["warn", 15],

    /* OCP（オープン・クローズドの原則）支援 */
    "sonarjs/no-duplicate-string": "warn",
    "sonarjs/prefer-immediate-return": "error",

    /* LSP（リスコフの置換原則）支援 */
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/consistent-return": "error",

    /* ISP（インターフェース分離の原則）支援 */
    "sonarjs/no-unused-collection": "warn",
    "unicorn/no-unused-properties": "warn",

    /* DIP（依存性逆転の原則）支援 */
    "@typescript-eslint/prefer-composition-over-inheritance": "warn",
    "sonarjs/no-hardcoded-credentials": "error"
  }
}
```

### カスタム型チェックルール

#### **custom-rules.ts ファイル作成:**

```typescript
// src/utils/custom-rules.ts

// SOLID原則チェック用のヘルパー関数
export class SOLIDAnalyzer {
  // SRP: クラスの責任数をカウント
  public static countClassResponsibilities(classCode: string): number {
    const methodMatches = classCode.match(
      /^\s+(public|private|protected)?\s+\w+\s*\(/gm
    );
    return methodMatches ? methodMatches.length : 0;
  }

  // OCP: Switch文の検出
  public static detectSwitchStatements(code: string): boolean {
    return /switch\s*\(/.test(code);
  }

  // LSP: 例外投出の検出
  public static detectThrowInOverride(code: string): boolean {
    return /throw\s+new\s+Error/.test(code) && /override|extends/.test(code);
  }

  // ISP: インターフェースのメソッド数カウント
  public static countInterfaceMethods(interfaceCode: string): number {
    const methodMatches = interfaceCode.match(/^\s+\w+\s*\(/gm);
    return methodMatches ? methodMatches.length : 0;
  }

  // DIP: 具象クラスへの依存検出
  public static detectConcreteClassDependency(code: string): boolean {
    return /new\s+[A-Z]\w+\s*\(/.test(code);
  }
}
```

---

## 🛠️ VS Code 設定最適化

### 必須拡張機能

#### **1. SOLID 原則学習に最適な拡張機能**

```json
// .vscode/extensions.json
{
  "recommendations": [
    // TypeScript 基本
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",

    // Lint & Format
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",

    // デバッグ・テスト
    "ms-vscode.vscode-jest",
    "hbenl.vscode-test-explorer",

    // 設計支援
    "pkief.material-icon-theme",
    "oderwat.indent-rainbow",
    "streetsidesoftware.code-spell-checker",

    // SOLID原則特化
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "mermaid-js.mermaid-markdown-syntax-highlighting",

    // 生産性向上
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json"
  ]
}
```

#### **2. VS Code ワークスペース設定**

```json
// .vscode/settings.json
{
  // TypeScript 設定
  "typescript.preferences.noSemicolons": "off",
  "typescript.preferences.quoteStyle": "single",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.suggest.autoImports": true,
  "typescript.preferences.includePackageJsonAutoImports": "on",

  // ESLint & Prettier
  "eslint.validate": ["typescript"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // SOLID原則学習支援
  "files.associations": {
    "*.solid.ts": "typescript"
  },
  "emmet.includeLanguages": {
    "typescript": "html"
  },

  // 表示設定
  "editor.minimap.enabled": true,
  "editor.rulers": [80, 100],
  "editor.wordWrap": "bounded",
  "editor.wordWrapColumn": 100,
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.expand": false,
  "explorer.fileNesting.patterns": {
    "*.ts": "${capture}.js,${capture}.d.ts,${capture}.js.map",
    "*.test.ts": "${capture}.test.js,${capture}.spec.ts",
    "tsconfig.json": "tsconfig.*.json"
  },

  // Git 設定
  "git.enableSmartCommit": true,
  "git.autofetch": true,

  // 検索・置換
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/*.log": true
  }
}
```

### デバッグ設定

#### **launch.json 設定:**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "TS Node Debug",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Current Test File",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["${relativeFile}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "CI": "true"
      }
    }
  ]
}
```

### タスク自動化

#### **tasks.json 設定:**

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "TypeScript Build",
      "type": "typescript",
      "tsconfig": "tsconfig.json",
      "problemMatcher": ["$tsc"],
      "group": "build"
    },
    {
      "label": "Watch TypeScript",
      "type": "typescript",
      "tsconfig": "tsconfig.json",
      "option": "watch",
      "problemMatcher": ["$tsc-watch"],
      "group": "build"
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "npm",
      "args": ["test"],
      "group": "test",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Lint Fix",
      "type": "shell",
      "command": "npm",
      "args": ["run", "lint:fix"],
      "group": "build",
      "presentation": {
        "reveal": "silent"
      }
    },
    {
      "label": "SOLID Check",
      "type": "shell",
      "command": "npm",
      "args": ["run", "check"],
      "group": "test",
      "dependsOn": ["TypeScript Build"],
      "presentation": {
        "reveal": "always"
      }
    }
  ]
}
```

---

## 📚 学習効率化ツール

### ドキュメント生成

#### **1. TypeDoc セットアップ**

```bash
# TypeDoc インストール
npm install --save-dev typedoc typedoc-plugin-markdown

# TypeDoc 設定ファイル作成
echo '{
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "theme": "default",
  "includeVersion": true,
  "excludeExternals": true,
  "readme": "README.md",
  "categorizeByGroup": true,
  "defaultCategory": "Other",
  "categoryOrder": [
    "SOLID Principles",
    "Examples",
    "Utilities",
    "*"
  ]
}' > typedoc.json

# ドキュメント生成スクリプト追加
npm pkg set scripts.docs="typedoc"
npm pkg set scripts.docs:serve="npx http-server docs/api -p 8080"
```

#### **2. README.md テンプレート**

```markdown
# SOLID 原則学習プロジェクト

> TypeScript で SOLID 原則を実践的に学習するためのプロジェクトです。

## 🎯 学習目標

- [ ] SRP（単一責任の原則）の理解と実践
- [ ] OCP（オープン・クローズドの原則）の理解と実践
- [ ] LSP（リスコフの置換原則）の理解と実践
- [ ] ISP（インターフェース分離の原則）の理解と実践
- [ ] DIP（依存性逆転の原則）の理解と実践

## 🏗️ セットアップ

\`\`\`bash

# 依存関係インストール

npm install

# 開発サーバー起動

npm run dev:watch

# テスト実行

npm test

# 型チェック

npm run type-check

# Lint & Format

npm run check
\`\`\`

## 📁 プロジェクト構造

- `src/solid/` - SOLID 原則の実装例
- `src/examples/` - 段階別学習例
- `src/tests/` - テストコード
- `docs/` - 生成ドキュメント

## 🧪 テストの実行

\`\`\`bash

# 全テスト実行

npm test

# 特定ファイルのテスト

npm test -- srp

# カバレッジ付きテスト

npm run test:coverage
\`\`\`

## 📚 学習順序

1. SRP: `src/solid/srp/`
2. OCP: `src/solid/ocp/`
3. LSP: `src/solid/lsp/`
4. ISP: `src/solid/isp/`
5. DIP: `src/solid/dip/`
```

### コード品質監視

#### **1. SonarQube ローカルセットアップ（オプション）**

```bash
# SonarQube コミュニティ版（Docker）
docker run -d --name sonarqube -p 9000:9000 sonarqube:community

# SonarScanner CLI インストール
npm install --save-dev sonarqube-scanner

# sonar-project.properties 作成
echo "sonar.projectKey=step08-solid-principles
sonar.projectName=Step08 SOLID Principles
sonar.projectVersion=1.0
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.ts,**/*.spec.ts
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts" > sonar-project.properties
```

#### **2. 品質ゲート設定**

```bash
# 品質チェックスクリプト追加
npm pkg set scripts.quality="npm run test:coverage && npm run lint && npm run type-check"
npm pkg set scripts.pre-commit="npm run quality"
```

### 学習進捗管理

#### **progress-tracker.ts 作成:**

```typescript
// tools/progress-tracker.ts
interface LearningProgress {
  principle: "SRP" | "OCP" | "LSP" | "ISP" | "DIP";
  completed: boolean;
  completionDate?: Date;
  notes: string[];
}

export class ProgressTracker {
  private progress: LearningProgress[] = [
    { principle: "SRP", completed: false, notes: [] },
    { principle: "OCP", completed: false, notes: [] },
    { principle: "LSP", completed: false, notes: [] },
    { principle: "ISP", completed: false, notes: [] },
    { principle: "DIP", completed: false, notes: [] },
  ];

  public markCompleted(
    principle: LearningProgress["principle"],
    note?: string
  ): void {
    const item = this.progress.find((p) => p.principle === principle);
    if (item) {
      item.completed = true;
      item.completionDate = new Date();
      if (note) item.notes.push(note);
    }
  }

  public getProgress(): LearningProgress[] {
    return [...this.progress];
  }

  public getCompletionRate(): number {
    const completed = this.progress.filter((p) => p.completed).length;
    return (completed / this.progress.length) * 100;
  }
}
```

---

## 🔍 トラブルシューティング

### よくある環境問題

#### **1. TypeScript パスエイリアス解決エラー**

```bash
# tsconfig-paths 追加
npm install --save-dev tsconfig-paths

# package.json の dev スクリプト修正
npm pkg set scripts.dev="ts-node -r tsconfig-paths/register src/index.ts"
```

#### **2. ESLint ルール競合**

```bash
# ESLint 設定確認
npx eslint --print-config src/index.ts

# ルール無効化（個別ファイル）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

#### **3. Jest モジュール解決エラー**

```javascript
// jest.config.js に moduleNameMapping 追加
module.exports = {
  // ... 他の設定
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
```

### パフォーマンス最適化

#### **1. TypeScript コンパイル高速化**

```json
// tsconfig.json に追加
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  },
  "ts-node": {
    "transpileOnly": true,
    "files": true
  }
}
```

#### **2. ESLint 高速化**

```json
// .eslintrc.json に追加
{
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname
  },
  "settings": {
    "@typescript-eslint/parser": {
      "cacheLifetime": {
        "glob": "Infinity"
      }
    }
  }
}
```

---

## 📋 環境確認チェックリスト

### セットアップ完了確認

```bash
# 基本環境チェック
node --version    # ✓ v18.0.0+
npm --version     # ✓ v8.0.0+
tsc --version     # ✓ v5.0.0+

# プロジェクトファイル存在確認
ls -la tsconfig.json      # ✓ 存在
ls -la .eslintrc.json     # ✓ 存在
ls -la jest.config.js     # ✓ 存在
ls -la .prettierrc.json   # ✓ 存在

# コマンド実行確認
npm run build     # ✓ 成功
npm run lint      # ✓ エラーなし
npm test          # ✓ テスト通過
npm run format    # ✓ 成功

# VS Code 拡張確認
code --list-extensions | grep eslint     # ✓ インストール済み
code --list-extensions | grep prettier   # ✓ インストール済み
```

### 学習開始前の最終確認

- [ ] プロジェクトがビルドできる
- [ ] テストが実行できる
- [ ] Lint・Format が正常動作
- [ ] VS Code で TypeScript 補完が効く
- [ ] デバッガーが起動する
- [ ] Git でコミットできる

---

**🚀 環境構築完了！** これで SOLID 原則の効率的な学習を始められます！

**💡 ヒント**: 学習中に問題が発生したら、まずは `npm run check` でプロジェクト全体の健全性を確認してください。
