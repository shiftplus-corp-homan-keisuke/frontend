# Step 11: ツール開発入門

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step11_補足_専門用語集.md) - ツール開発・ESLint・Compiler API・自動化の重要な概念と用語の詳細解説
> - 💻 [実践コード例](./Step11_補足_実践コード例.md) - 段階的な学習用コード集
> - 🚨 [トラブルシューティング](./Step11_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step11_補足_参考リソース.md) - 学習に役立つリンク集
> - 📋 [補足資料](./Step11_補足資料.md) - その他の重要な補足情報

## 📅 学習期間・目標

**期間**: Step 11  
**総学習時間**: 6 時間  
**学習スタイル**: 理論 30% + 実践コード 50% + 演習 20%

### 🎯 Step 11 到達目標

- [ ] ESLint ルールの設定とカスタマイズ
- [ ] 簡単な開発ツールの作成
- [ ] TypeScript Compiler API の基礎理解
- [ ] 自動化スクリプトの実装
- [ ] 開発効率向上ツールの構築

## 📚 理論学習内容

### Section 1: ESLint 設定とカスタマイズ

#### 🔍 ESLint 設定の実践的価値

**💡 なぜ開発ツール・自動化が重要なのか**

開発ツールと自動化は、現代のソフトウェア開発において不可欠な要素です。開発効率向上とコード品質確保、実際のプロジェクトでの価値、チーム開発での効果を最大化します。特に ESLint、TypeScript Compiler API、AST 操作により、コード品質の自動チェック、繰り返し作業の自動化、開発者体験（DX）の向上を実現できます。

**🎯 どういう場面で使うのか**

- **コード品質管理**: ESLint による自動的なコード品質チェック
- **チーム開発**: コーディング規約の統一と品質基準の自動化
- **開発効率化**: 繰り返し作業の自動化とボイラープレート削減
- **CI/CD パイプライン**: 継続的な品質チェックと自動化
- **大規模プロジェクト**: スケーラブルな開発フロー構築
- **開発者体験向上**: DX 改善による生産性向上

##### 1. ESLint による実践的なコード品質管理

```typescript
// 💡 詳細解説: ESLint設定 → Step11_補足_専門用語集.md#eslint設定eslint-configuration

// .eslintrc.js - 実践的なプロジェクト設定
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    // 型安全性の確保
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",

    // コード品質の向上
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/require-await": "error",

    // 保守性の向上
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/prefer-readonly-parameter-types": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-non-null-assertion": "warn",

    // パフォーマンスの考慮
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/prefer-for-of": "error",
  },

  // 環境別設定
  overrides: [
    {
      files: ["*.test.ts", "*.spec.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
    {
      files: ["*.config.ts", "*.config.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};

// package.json - スクリプト設定
{
  "scripts": {
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "lint:ci": "eslint src/**/*.ts --format=json --output-file=eslint-report.json",
    "type-check": "tsc --noEmit",
    "quality-check": "npm run type-check && npm run lint"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}

// 実際のプロジェクトでの段階的導入戦略
// 1. 基本設定から開始
const basicConfig = {
  extends: ["@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn", // 最初は警告から
    "@typescript-eslint/no-unused-vars": "error",
  },
};

// 2. チーム合意後に厳格化
const strictConfig = {
  extends: ["@typescript-eslint/recommended-requiring-type-checking"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error", // 段階的にエラーに
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
  },
};

// 3. プロジェクト固有のルール追加
const projectSpecificConfig = {
  rules: {
    // プロジェクト固有の命名規則
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
        prefix: ["I"], // プロジェクト要件に応じて
      },
      {
        selector: "typeAlias",
        format: ["PascalCase"],
        suffix: ["Type"], // プロジェクト要件に応じて
      },
    ],

    // API 関連の特別なルール
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["../../../*"],
            message: "Deep relative imports are not allowed. Use absolute imports.",
          },
        ],
      },
    ],
  },
};

// CI/CD パイプラインでの活用
// .github/workflows/quality-check.yml
const ciConfig = `
name: Quality Check
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - name: Upload ESLint report
        uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: eslint-report
          path: eslint-report.json
`;
```

**📝 ツール開発の詳細解説**

- **段階的導入**: プロジェクトの成熟度に応じた ESLint ルールの段階的導入戦略
- **環境別設定**: テストファイル、設定ファイルなど環境に応じた柔軟なルール適用
- **CI/CD 統合**: 継続的な品質チェックによる自動化された品質管理
- **チーム開発支援**: pre-commit フック、lint-staged による開発フロー統合

**⚠️ よくある間違いと注意点**

```typescript
// ❌ 間違い: 一度に厳格すぎるルールを導入
const tooStrictConfig = {
  rules: {
    "@typescript-eslint/no-explicit-any": "error", // 既存コードで大量エラー
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    // 全て一度に導入すると開発が停止する
  },
};

// ❌ 間違い: プロジェクト要件を無視した設定
const genericConfig = {
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "interface", format: ["PascalCase"], prefix: ["I"] },
      // プロジェクトで I プレフィックスが不要な場合
    ],
  },
};

// ✅ 正解: 段階的で実用的な導入
const practicalConfig = {
  rules: {
    "@typescript-eslint/no-explicit-any": "warn", // 最初は警告
    "@typescript-eslint/no-unused-vars": "error", // 明確に有害なもののみエラー
  },
  overrides: [
    {
      files: ["*.test.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off", // テストでは柔軟に
      },
    },
  ],
};
```

**🚀 実際のプロジェクトでの活用例**

```typescript
// 大規模プロジェクトでの ESLint 設定管理
// eslint-config/base.js
module.exports = {
  extends: ["@typescript-eslint/recommended"],
  rules: {
    // 全プロジェクト共通のベースルール
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/prefer-const": "error",
  },
};

// eslint-config/strict.js
module.exports = {
  extends: ["./base.js"],
  rules: {
    // 新規プロジェクト用の厳格ルール
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
  },
};

// eslint-config/legacy.js
module.exports = {
  extends: ["./base.js"],
  rules: {
    // レガシープロジェクト用の緩いルール
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
  },
};

// プロジェクト固有の .eslintrc.js
module.exports = {
  extends: ["./eslint-config/strict.js"], // プロジェクトに応じて選択
  rules: {
    // プロジェクト固有のルール
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "lodash",
            message: "Use lodash-es for better tree shaking",
          },
        ],
      },
    ],
  },
};

// モノレポでの設定例
// packages/frontend/.eslintrc.js
module.exports = {
  extends: ["../../eslint-config/strict.js"],
  env: {
    browser: true,
  },
  rules: {
    // フロントエンド固有のルール
    "no-console": "warn",
  },
};

// packages/backend/.eslintrc.js
module.exports = {
  extends: ["../../eslint-config/strict.js"],
  env: {
    node: true,
  },
  rules: {
    // バックエンド固有のルール
    "no-console": "off", // サーバーサイドではログ出力OK
  },
};
```

##### 2. 命名規則の設定

```typescript
// 💡 詳細解説: 命名規則 → Step11_補足_専門用語集.md#命名規則naming-conventions
// .eslintrc.js の rules セクションに追加
"@typescript-eslint/naming-convention": [
  "error",
  {
    selector: "interface",
    format: ["PascalCase"],
  },
  {
    selector: "typeAlias",
    format: ["PascalCase"],
  },
  {
    selector: "variable",
    format: ["camelCase", "UPPER_CASE"],
  },
  {
    selector: "function",
    format: ["camelCase"],
  },
]
```

#### 🎯 カスタム ESLint ルールの作成

> 💡 **詳細解説**: カスタムESLintルールの作成について [Step11\_補足\_実践コード例.md#カスタムESLintルールの作成](./Step11_補足_実践コード例.md#カスタムESLintルールの作成) を見てね 🐰

##### 1. 基本的なカスタムルール

```typescript
// 💡 詳細解説: カスタムESLintルール → Step11_補足_専門用語集.md#カスタムeslintルールcustom-eslint-rules
// eslint-rules/no-any-type.js
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow usage of any type",
      category: "TypeScript",
      recommended: true,
    },
    messages: {
      noAnyType:
        'Using "any" type is not allowed. Please use a more specific type.',
    },
  },

  create(context) {
    return {
      // 💡 詳細解説: AST操作 → Step11_補足_専門用語集.md#ast操作ast-manipulation
      TSAnyKeyword(node) {
        context.report({
          node,
          messageId: "noAnyType",
        });
      },
    };
  },
};
```

##### 2. より複雑なカスタムルール

```typescript
// eslint-rules/prefer-readonly-array.js
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer readonly arrays when possible",
      category: "TypeScript",
    },
    fixable: "code",
    messages: {
      preferReadonly: "Use readonly array instead of mutable array",
    },
  },

  create(context) {
    return {
      TSArrayType(node) {
        context.report({
          node,
          messageId: "preferReadonly",
          fix(fixer) {
            return fixer.replaceText(
              node,
              `readonly ${context.getSourceCode().getText(node)}`
            );
          },
        });
      },
    };
  },
};
```

### Section 2: 開発ツールの作成

#### 🔧 型定義生成ツール

> 💡 **詳細解説**: 型定義生成ツールの実装について [Step11\_補足\_実践コード例.md#型定義生成ツール](./Step11_補足_実践コード例.md#型定義生成ツール) を見てね 🐰

##### 1. 基本的な型定義とインターフェース

```typescript
// 💡 詳細解説: 型定義生成ツール → Step11_補足_専門用語集.md#型定義生成ツールtype-definition-generator
// tools/type-generator.ts
import * as fs from "fs";
import * as path from "path";

interface ApiEndpoint {
  method: string;
  path: string;
  requestBody?: any;
  responseBody: any;
  description?: string;
}
```

##### 2. TypeScript ジェネレータークラス

```typescript
class TypeScriptGenerator {
  private output: string[] = [];

  generateTypes(spec: { endpoints: Record<string, ApiEndpoint> }): string {
    this.output = [];

    // ヘッダーコメント
    this.output.push("// Generated TypeScript types");
    this.output.push("// Do not edit this file manually");
    this.output.push("");

    // API型の生成
    this.output.push("export namespace API {");

    for (const [endpointName, endpoint] of Object.entries(spec.endpoints)) {
      this.generateEndpointTypes(endpointName, endpoint);
    }

    this.output.push("}");

    return this.output.join("\n");
  }

  private generateEndpointTypes(name: string, endpoint: ApiEndpoint): void {
    const capitalizedName = this.capitalize(name);

    this.output.push(`  export namespace ${capitalizedName} {`);

    if (endpoint.requestBody) {
      this.output.push("    export interface Request {");
      this.generateObjectProperties(endpoint.requestBody, 6);
      this.output.push("    }");
    }

    this.output.push("    export interface Response {");
    this.generateObjectProperties(endpoint.responseBody, 6);
    this.output.push("    }");
    this.output.push("  }");
  }
}
```

##### 3. ヘルパーメソッドと使用例

```typescript
class TypeScriptGenerator {
  // ... 前のメソッド

  private generateObjectProperties(obj: any, indent: number): void {
    const spaces = " ".repeat(indent);
    for (const [propName, propSpec] of Object.entries(obj.properties || {})) {
      const type = this.getTypeString(propSpec);
      this.output.push(`${spaces}${propName}: ${type};`);
    }
  }

  private getTypeString(spec: any): string {
    switch (spec.type) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "array":
        return `${this.getTypeString(spec.items)}[]`;
      default:
        return "unknown";
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// 使用例
const generator = new TypeScriptGenerator();
const spec = {
  endpoints: {
    getUser: {
      method: "GET",
      path: "/users/:id",
      responseBody: {
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          email: { type: "string" },
        },
      },
    },
  },
};

const types = generator.generateTypes(spec);
console.log(types);
```

### Section 3: TypeScript Compiler API

#### 🔧 AST 操作の基礎

> 💡 **詳細解説**: TypeScript Compiler APIとAST操作について [Step11\_補足\_専門用語集.md#ast操作](./Step11_補足_専門用語集.md#ast操作ast-manipulation) を見てね 🐰

```typescript
// tools/ast-transformer.ts
import * as ts from "typescript";

class ASTTransformer {
  transformFile(fileName: string): string {
    const program = ts.createProgram([fileName], {});
    const sourceFile = program.getSourceFile(fileName);

    if (!sourceFile) {
      throw new Error(`File not found: ${fileName}`);
    }

    const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
      return (sourceFile) => {
        const visitor = (node: ts.Node): ts.Node => {
          // console.log文を削除
          if (
            ts.isCallExpression(node) &&
            ts.isPropertyAccessExpression(node.expression) &&
            ts.isIdentifier(node.expression.expression) &&
            node.expression.expression.text === "console"
          ) {
            return ts.factory.createEmptyStatement();
          }

          return ts.visitEachChild(node, visitor, context);
        };

        return ts.visitNode(sourceFile, visitor);
      };
    };

    const result = ts.transform(sourceFile, [transformer]);
    const printer = ts.createPrinter();

    return printer.printFile(result.transformed[0]);
  }

  analyzeFile(fileName: string): {
    functions: string[];
    classes: string[];
    interfaces: string[];
  } {
    const program = ts.createProgram([fileName], {});
    const sourceFile = program.getSourceFile(fileName);

    if (!sourceFile) {
      throw new Error(`File not found: ${fileName}`);
    }

    const analysis = {
      functions: [] as string[],
      classes: [] as string[],
      interfaces: [] as string[],
    };

    const visit = (node: ts.Node): void => {
      if (ts.isFunctionDeclaration(node) && node.name) {
        analysis.functions.push(node.name.text);
      } else if (ts.isClassDeclaration(node) && node.name) {
        analysis.classes.push(node.name.text);
      } else if (ts.isInterfaceDeclaration(node)) {
        analysis.interfaces.push(node.name.text);
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return analysis;
  }
}

// 使用例
const transformer = new ASTTransformer();

// ファイル分析
const analysis = transformer.analyzeFile("./src/example.ts");
console.log("Functions:", analysis.functions);
console.log("Classes:", analysis.classes);
console.log("Interfaces:", analysis.interfaces);

// ファイル変換
const transformed = transformer.transformFile("./src/example.ts");
console.log("Transformed code:", transformed);
```

#### 🎯 自動化スクリプト

> 💡 **詳細解説**: プロジェクト自動化スクリプトについて [Step11\_補足\_実践コード例.md#自動化スクリプト](./Step11_補足_実践コード例.md#自動化スクリプト) を見てね 🐰

```typescript
// tools/project-automation.ts
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

class ProjectAutomation {
  // プロジェクト初期化
  initProject(
    projectName: string,
    template: "library" | "api" | "frontend"
  ): void {
    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      throw new Error(`Project ${projectName} already exists`);
    }

    fs.mkdirSync(projectPath, { recursive: true });
    process.chdir(projectPath);

    // package.json作成
    const packageJson = {
      name: projectName,
      version: "1.0.0",
      description: "",
      main: "dist/index.js",
      types: "dist/index.d.ts",
      scripts: this.getScripts(template),
      devDependencies: this.getDevDependencies(template),
      dependencies: this.getDependencies(template),
    };

    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

    // TypeScript設定
    this.createTsConfig(template);

    // ディレクトリ構造作成
    this.createDirectoryStructure(template);

    // 初期ファイル作成
    this.createInitialFiles(template);

    console.log(`✅ Project ${projectName} created successfully!`);
    console.log("Next steps:");
    console.log(`  cd ${projectName}`);
    console.log("  npm install");
    console.log("  npm run build");
  }

  private getScripts(template: string): Record<string, string> {
    const baseScripts = {
      build: "tsc",
      "build:watch": "tsc --watch",
      test: "jest",
      "test:watch": "jest --watch",
      lint: "eslint src/**/*.ts",
      "lint:fix": "eslint src/**/*.ts --fix",
    };

    if (template === "api") {
      return {
        ...baseScripts,
        start: "node dist/server.js",
        dev: "ts-node src/server.ts",
      };
    }

    return baseScripts;
  }

  private getDevDependencies(template: string): Record<string, string> {
    const base = {
      typescript: "^5.0.0",
      "@types/node": "^20.0.0",
      jest: "^29.0.0",
      "ts-jest": "^29.0.0",
      "@types/jest": "^29.0.0",
      eslint: "^8.0.0",
      "@typescript-eslint/parser": "^6.0.0",
      "@typescript-eslint/eslint-plugin": "^6.0.0",
    };

    if (template === "api") {
      return {
        ...base,
        "ts-node": "^10.0.0",
        nodemon: "^3.0.0",
        "@types/express": "^4.17.0",
        supertest: "^6.0.0",
        "@types/supertest": "^2.0.0",
      };
    }

    return base;
  }

  private getDependencies(template: string): Record<string, string> {
    if (template === "api") {
      return {
        express: "^4.18.0",
        cors: "^2.8.0",
        helmet: "^7.0.0",
      };
    }

    return {};
  }

  private createTsConfig(template: string): void {
    const tsConfig = {
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        lib: ["ES2020"],
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist", "tests"],
    };

    fs.writeFileSync("tsconfig.json", JSON.stringify(tsConfig, null, 2));
  }

  private createDirectoryStructure(template: string): void {
    const dirs = ["src", "tests", "dist"];

    if (template === "api") {
      dirs.push("src/routes", "src/controllers", "src/middleware", "src/types");
    } else if (template === "library") {
      dirs.push("src/lib", "src/types");
    }

    dirs.forEach((dir) => {
      fs.mkdirSync(dir, { recursive: true });
    });
  }

  private createInitialFiles(template: string): void {
    if (template === "library") {
      fs.writeFileSync(
        "src/index.ts",
        `// Library entry point
export * from './lib';
`
      );
      fs.writeFileSync(
        "src/lib/index.ts",
        `// Library implementation
export function hello(name: string): string {
  return \`Hello, \${name}!\`;
}
`
      );
    } else if (template === "api") {
      fs.writeFileSync(
        "src/server.ts",
        `import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, TypeScript API!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`
      );
    }

    // README作成
    fs.writeFileSync(
      "README.md",
      `# ${path.basename(process.cwd())}

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run build
npm test
\`\`\`
`
    );

    // .gitignore作成
    fs.writeFileSync(
      ".gitignore",
      `node_modules/
dist/
coverage/
*.log
.env
.DS_Store
`
    );
  }

  // コード品質チェック
  checkCodeQuality(directory: string = "./src"): void {
    console.log("🔍 Running code quality checks...");

    try {
      // TypeScript コンパイルチェック
      execSync("npx tsc --noEmit", { stdio: "inherit" });
      console.log("✅ TypeScript compilation check passed");

      // ESLint チェック
      execSync(`npx eslint ${directory}/**/*.ts`, { stdio: "inherit" });
      console.log("✅ ESLint check passed");

      // テスト実行
      execSync("npm test", { stdio: "inherit" });
      console.log("✅ Tests passed");
    } catch (error) {
      console.error("❌ Code quality check failed");
      process.exit(1);
    }
  }

  // 依存関係更新
  updateDependencies(): void {
    console.log("📦 Updating dependencies...");

    try {
      execSync("npm update", { stdio: "inherit" });
      execSync("npm audit fix", { stdio: "inherit" });
      console.log("✅ Dependencies updated successfully");
    } catch (error) {
      console.error("❌ Failed to update dependencies");
    }
  }
}

// CLI実行
if (require.main === module) {
  const automation = new ProjectAutomation();
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "init":
      const [projectName, template = "library"] = args;
      automation.initProject(projectName, template as any);
      break;
    case "check":
      automation.checkCodeQuality();
      break;
    case "update":
      automation.updateDependencies();
      break;
    default:
      console.log("Usage:");
      console.log("  init <project-name> [template]  - Initialize new project");
      console.log(
        "  check                           - Run code quality checks"
      );
      console.log("  update                          - Update dependencies");
  }
}

export { ProjectAutomation };
```

## 📊 Step 11 評価基準

> 💡 **詳細解説**: 学習の進め方とトラブルシューティングは [Step11\_補足\_トラブルシューティング.md](./Step11_補足_トラブルシューティング.md) にもまとめてあるよ 🐰

### 理解度チェックリスト

#### ESLint 設定 (25%)

- [ ] TypeScript 用 ESLint 設定を理解している
- [ ] カスタムルールを作成できる
- [ ] プロジェクトに適した設定ができる
- [ ] コード品質の自動チェックを実装できる

#### 開発ツール作成 (30%)

- [ ] 型定義生成ツールを作成できる
- [ ] コード分析ツールを実装できる
- [ ] 自動化スクリプトを作成できる
- [ ] 実用的なツールを設計できる

#### Compiler API (25%)

- [ ] TypeScript Compiler API の基礎を理解している
- [ ] AST 操作を実装できる
- [ ] コード変換を実装できる
- [ ] 静的解析ツールを作成できる

#### 自動化・効率化 (20%)

- [ ] プロジェクト初期化を自動化できる
- [ ] 品質チェックを自動化できる
- [ ] 開発ワークフローを改善できる
- [ ] 継続的な改善を実装できる

### 成果物チェックリスト

- [ ] **ESLint 設定**: プロジェクト用カスタム設定
- [ ] **型定義生成ツール**: API 仕様から型生成
- [ ] **コード品質チェッカー**: 静的解析ツール
- [ ] **プロジェクト自動化ツール**: 初期化・管理ツール

## 🔄 Step 12 への準備

> 💡 **詳細解説**: 次のステップでの学習内容について [Step11\_補足\_参考リソース.md](./Step11_補足_参考リソース.md) にもまとめてあるよ 🐰

### 次週学習内容の予習

```typescript
// Step 12で学習するポートフォリオ作成の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. プロジェクト統合
interface ProjectShowcase {
  title: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  sourceUrl: string;
}

// 2. ドキュメント生成
interface Documentation {
  overview: string;
  installation: string;
  usage: string;
  api: string;
}
```

---

**📌 重要**: Step 11 は TypeScript を使った開発ツール作成の基礎を学ぶ重要な週です。これらのスキルにより、開発効率を大幅に向上させるツールが作成できるようになります。

**🌟 次週は、学習の総仕上げとしてポートフォリオを完成させます！**
