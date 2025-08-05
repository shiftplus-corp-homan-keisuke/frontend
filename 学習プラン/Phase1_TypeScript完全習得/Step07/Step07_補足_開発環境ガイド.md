# Step07 補足資料: 開発環境ガイド

> 🔧 **目的**: Zod・Angular 統合開発のための効率的な開発環境の構築と活用
> 🎯 **対象**: Step07 学習者および実践開発者
> 📚 **活用方法**: 開発環境のセットアップ・最適化・トラブルシューティング

---

## 📚 目次

1. [基本開発環境](#基本開発環境)
2. [エディタ設定](#エディタ設定)
3. [プロジェクト設定](#プロジェクト設定)
4. [デバッグ環境](#デバッグ環境)
5. [テスト環境](#テスト環境)
6. [CI/CD 設定](#CI/CD設定)
7. [パフォーマンス監視](#パフォーマンス監視)

---

## 🛠️ 基本開発環境

### 必要なソフトウェア

**📦 Node.js 環境**

```bash
# Node.js LTS版のインストール（推奨）
# https://nodejs.org/ からダウンロード

# バージョン確認
node --version  # v18.x.x 以上推奨
npm --version   # v9.x.x 以上推奨

# パッケージマネージャーの選択（推奨順）
# 1. pnpm（高速・効率的）
npm install -g pnpm
pnpm --version

# 2. yarn（安定・豊富な機能）
npm install -g yarn
yarn --version

# 3. npm（標準・互換性高）
# デフォルトでインストール済み
```

**🅰️ Angular CLI**

```bash
# Angular CLI のインストール
npm install -g @angular/cli@latest

# バージョン確認
ng version

# プロジェクトの作成（Zod統合版）
ng new my-zod-app --routing --style=scss --package-manager=pnpm
cd my-zod-app

# Zodと関連パッケージのインストール
pnpm add zod
pnpm add -D @types/node
```

### プロジェクト構造のベストプラクティス

```
src/
├── app/
│   ├── core/                 # コアモジュール
│   │   ├── models/           # Zodスキーマ・型定義
│   │   │   ├── user.schema.ts
│   │   │   ├── task.schema.ts
│   │   │   └── index.ts
│   │   ├── services/         # API・ビジネスロジック
│   │   │   ├── api.service.ts
│   │   │   ├── validation.service.ts
│   │   │   └── index.ts
│   │   └── validators/       # カスタムバリデーター
│   │       ├── zod-validator.ts
│   │       ├── async-validator.ts
│   │       └── index.ts
│   ├── shared/               # 共有モジュール
│   │   ├── components/       # 再利用可能コンポーネント
│   │   ├── pipes/           # カスタムパイプ
│   │   ├── directives/      # カスタムディレクティブ
│   │   └── utils/           # ユーティリティ関数
│   │       ├── schema-helpers.ts
│   │       └── form-helpers.ts
│   ├── features/            # 機能別モジュール
│   │   ├── user-management/
│   │   ├── task-management/
│   │   └── dashboard/
│   └── environments/        # 環境設定
├── assets/                  # 静的ファイル
└── styles/                  # グローバルスタイル
```

---

## 📝 エディタ設定

### Visual Studio Code 設定

**🔧 推奨拡張機能**

```json
// .vscode/extensions.json
{
  "recommendations": [
    // TypeScript・Angular
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "johnpapa.angular2",

    // Zod・バリデーション
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",

    // 開発効率化
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json",

    // デバッグ・テスト
    "hbenl.vscode-test-explorer",
    "rangav.vscode-thunder-client"
  ]
}
```

**⚙️ ワークスペース設定**

```json
// .vscode/settings.json
{
  // TypeScript設定
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",

  // エディタ設定
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },

  // Angular設定
  "html.suggest.angular1": false,
  "html.suggest.ionic": false,

  // ファイル除外
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.angular": true
  },

  // Zod関連設定
  "emmet.includeLanguages": {
    "typescript": "html"
  },

  // 自動保存
  "files.autoSave": "onFocusChange",

  // 検索設定
  "search.exclude": {
    "**/node_modules": true,
    "**/coverage": true,
    "**/dist": true
  }
}
```

**🎨 コードスニペット**

```json
// .vscode/snippets/typescript.json
{
  "Zod Object Schema": {
    "prefix": "zschema",
    "body": [
      "import { z } from 'zod';",
      "",
      "export const ${1:Schema}Schema = z.object({",
      "  id: z.string().uuid(),",
      "  ${2:name}: z.string().min(1),",
      "  createdAt: z.date(),",
      "  updatedAt: z.date()",
      "});",
      "",
      "export type ${1:Schema} = z.infer<typeof ${1:Schema}Schema>;"
    ],
    "description": "Create a Zod object schema with TypeScript types"
  },

  "Angular Zod Validator": {
    "prefix": "zodvalidator",
    "body": [
      "import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';",
      "import { z } from 'zod';",
      "",
      "export function ${1:validator}(schema: z.ZodSchema<any>): ValidatorFn {",
      "  return (control: AbstractControl): ValidationErrors | null => {",
      "    if (!control.value) return null;",
      "    ",
      "    const result = schema.safeParse(control.value);",
      "    return result.success ? null : { zodError: { message: result.error.errors[0]?.message } };",
      "  };",
      "}"
    ],
    "description": "Create Angular Zod validator function"
  }
}
```

### JetBrains IDE 設定（WebStorm・IntelliJ）

**🔧 プラグイン**

- Angular and AngularJS
- TypeScript
- Prettier
- ESLint
- Git Integration

**⚙️ 設定ファイル**

```xml
<!-- .idea/codeStyleSettings.xml -->
<code_scheme name="Default" version="173">
  <TypeScriptCodeStyleSettings>
    <option name="USE_SEMICOLON_AFTER_STATEMENT" value="true" />
    <option name="FORCE_SEMICOLON_STYLE" value="true" />
  </TypeScriptCodeStyleSettings>
</code_scheme>
```

---

## ⚙️ プロジェクト設定

### TypeScript 設定

**📁 tsconfig.json（厳密な設定）**

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom"],
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@env/*": ["src/environments/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

### ESLint 設定

**📁 .eslintrc.json**

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "@angular-eslint/recommended",
        "@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": "error",
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ],
        // Zod関連のルール
        "prefer-const": "error",
        "no-var": "error"
      }
    },
    {
      "files": ["*.html"],
      "extends": [
        "@angular-eslint/template/recommended",
        "@angular-eslint/template/accessibility"
      ],
      "rules": {}
    }
  ]
}
```

### Prettier 設定

**📁 .prettierrc**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

### Package.json Scripts

**📁 package.json（scripts 部分）**

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "start:dev": "ng serve --configuration development --open",
    "start:prod": "ng serve --configuration production",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:coverage": "ng test --code-coverage",
    "test:watch": "ng test --watch",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "format": "prettier --write \"src/**/*.{ts,html,scss}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,scss}\"",
    "e2e": "ng e2e",
    "analyze": "ng build --stats-json && npx webpack-bundle-analyzer dist/*/stats.json",
    "schema:validate": "node scripts/validate-schemas.js"
  }
}
```

---

## 🐛 デバッグ環境

### Chrome DevTools 設定

**🔧 拡張機能**

- Angular DevTools
- Redux DevTools（状態管理使用時）
- Vue.js devtools（比較用）

**⚙️ デバッグ設定**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true,
      "userDataDir": "${workspaceFolder}/.chrome-debug-profile"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Node.js",
      "program": "${workspaceFolder}/src/main.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

### Angular 開発サーバー設定

**📁 angular.json（serve 設定）**

```json
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "configurations": {
      "development": {
        "buildTarget": "app:build:development",
        "proxyConfig": "proxy.conf.json"
      },
      "production": {
        "buildTarget": "app:build:production"
      }
    },
    "defaultConfiguration": "development"
  }
}
```

**📁 proxy.conf.json（API プロキシ設定）**

```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### デバッグ用ヘルパー関数

**📁 src/app/shared/utils/debug-helpers.ts**

```typescript
import { z } from "zod";

// 開発環境でのみ動作するデバッグ関数
export class DebugHelpers {
  static logZodValidation<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    label = "Validation"
  ): void {
    if (!this.isDevelopment()) return;

    console.group(`🔍 ${label}`);
    console.log("Input:", data);

    const result = schema.safeParse(data);
    if (result.success) {
      console.log("✅ Valid:", result.data);
    } else {
      console.error("❌ Invalid:");
      result.error.errors.forEach((err) => {
        console.error(`  ${err.path.join(".")}: ${err.message}`);
      });
    }
    console.groupEnd();
  }

  static visualizeSchema(schema: z.ZodSchema<any>, name = "Schema"): void {
    if (!this.isDevelopment()) return;

    console.group(`📋 ${name} Structure`);
    console.log(this.describeSchema(schema));
    console.groupEnd();
  }

  private static isDevelopment(): boolean {
    return !environment.production;
  }

  private static describeSchema(schema: z.ZodSchema<any>, depth = 0): string {
    const indent = "  ".repeat(depth);

    if (schema instanceof z.ZodObject) {
      const shape = schema.shape;
      const fields = Object.keys(shape)
        .map(
          (key) =>
            `${indent}  ${key}: ${this.describeSchema(shape[key], depth + 1)}`
        )
        .join("\n");
      return `{\n${fields}\n${indent}}`;
    } else if (schema instanceof z.ZodArray) {
      return `Array<${this.describeSchema(schema.element, depth)}>`;
    } else if (schema instanceof z.ZodString) {
      return "string";
    } else if (schema instanceof z.ZodNumber) {
      return "number";
    } else if (schema instanceof z.ZodBoolean) {
      return "boolean";
    } else {
      return schema.constructor.name;
    }
  }
}
```

---

## 🧪 テスト環境

### Jest 設定（推奨）

**📁 jest.config.js**

```javascript
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  globalSetup: "jest-preset-angular/global-setup",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: "<rootDir>/",
  }),
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$|zod)"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(ts|js)",
    "<rootDir>/src/**/(*.)+(spec|test).(ts|js)",
  ],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/main.ts",
    "!src/polyfills.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text-summary", "lcov"],
  testEnvironment: "jsdom",
};
```

**📁 setup-jest.ts**

```typescript
import "jest-preset-angular/setup-jest";
import { z } from "zod";

// Zodのテスト用ヘルパー
expect.extend({
  toPassZodValidation(received: unknown, schema: z.ZodSchema<any>) {
    const result = schema.safeParse(received);

    if (result.success) {
      return {
        message: () => `Expected value not to pass Zod validation`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `Expected value to pass Zod validation, but got errors:\n${result.error.errors
            .map((err) => `  ${err.path.join(".")}: ${err.message}`)
            .join("\n")}`,
        pass: false,
      };
    }
  },
});

// 型定義の拡張
declare global {
  namespace jest {
    interface Matchers<R> {
      toPassZodValidation(schema: z.ZodSchema<any>): R;
    }
  }
}
```

### テストユーティリティ

**📁 src/app/testing/test-helpers.ts**

```typescript
import { ComponentFixture } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { z } from "zod";

export class TestHelpers {
  // フォーム要素の取得
  static getFormElement(
    fixture: ComponentFixture<any>,
    selector: string
  ): HTMLInputElement {
    const element = fixture.debugElement.query(By.css(selector));
    return element?.nativeElement;
  }

  // フォーム入力のシミュレーション
  static setInputValue(
    fixture: ComponentFixture<any>,
    selector: string,
    value: string
  ): void {
    const input = this.getFormElement(fixture, selector);
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();
    }
  }

  // Zodバリデーションのテスト
  static expectValidation<T>(
    schema: z.ZodSchema<T>,
    validData: unknown,
    invalidData: unknown
  ): void {
    expect(validData).toPassZodValidation(schema);
    expect(invalidData).not.toPassZodValidation(schema);
  }

  // エラーメッセージの確認
  static expectErrorMessage(
    fixture: ComponentFixture<any>,
    selector: string,
    expectedMessage: string
  ): void {
    const errorElement = fixture.debugElement.query(By.css(selector));
    expect(errorElement.nativeElement.textContent.trim()).toBe(expectedMessage);
  }
}
```

---

## 🚀 CI/CD 設定

### GitHub Actions

**📁 .github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "pnpm"

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Format check
        run: pnpm run format:check

      - name: Test
        run: pnpm run test:coverage

      - name: Build
        run: pnpm run build:prod

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  schema-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Validate schemas
        run: pnpm run schema:validate
```

### スキーマバリデーションスクリプト

**📁 scripts/validate-schemas.js**

```javascript
const fs = require("fs");
const path = require("path");
const { z } = require("zod");

// スキーマファイルを動的にインポートして検証
async function validateSchemas() {
  const schemaDir = path.join(__dirname, "../src/app/core/models");
  const schemaFiles = fs
    .readdirSync(schemaDir)
    .filter((file) => file.endsWith(".schema.ts"));

  console.log("🔍 Validating Zod schemas...");

  for (const file of schemaFiles) {
    try {
      const schemaModule = require(path.join(schemaDir, file));

      // スキーマのエクスポートを確認
      const schemas = Object.values(schemaModule).filter(
        (value) => value instanceof z.ZodType
      );

      if (schemas.length === 0) {
        console.warn(`⚠️  No Zod schemas found in ${file}`);
        continue;
      }

      console.log(`✅ ${file}: ${schemas.length} schemas validated`);
    } catch (error) {
      console.error(`❌ Error validating ${file}:`, error.message);
      process.exit(1);
    }
  }

  console.log("🎉 All schemas validated successfully!");
}

validateSchemas().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

---

## 📊 パフォーマンス監視

### Bundle Analyzer 設定

**📁 scripts/analyze-bundle.js**

```javascript
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-report.html",
      openAnalyzer: false,
    }),
  ],
};
```

### パフォーマンス測定スクリプト

**📁 src/app/shared/utils/performance.ts**

```typescript
export class PerformanceMonitor {
  private static measurements = new Map<string, number>();

  static start(label: string): void {
    if (environment.production) return;
    this.measurements.set(label, performance.now());
  }

  static end(label: string): number {
    if (environment.production) return 0;

    const startTime = this.measurements.get(label);
    if (!startTime) {
      console.warn(`Performance measurement '${label}' not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    this.measurements.delete(label);

    return duration;
  }

  static measureZodValidation<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    label = "Zod Validation"
  ): z.SafeParseReturnType<unknown, T> {
    this.start(label);
    const result = schema.safeParse(data);
    this.end(label);
    return result;
  }
}
```

### Lighthouse CI 設定

**📁 .lighthouserc.js**

```javascript
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:4200"],
      startServerCommand: "npm run start",
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
```

この開発環境ガイドを参考に、効率的で生産性の高い Zod・Angular 開発環境を構築してください。設定は必要に応じてプロジェクトの要件に合わせてカスタマイズしてください。
