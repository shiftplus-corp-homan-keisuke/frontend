# Phase 1: Week 7-8 TypeScript Compiler API・ツール開発

## 📅 学習期間・目標

**期間**: Week 7-8（2 週間）  
**総学習時間**: 40 時間（週 20 時間）

### 🎯 Week 7-8 到達目標

- [ ] TypeScript Compiler API の完全理解
- [ ] AST（抽象構文木）操作の習得
- [ ] ESLint カスタムルール作成能力
- [ ] TypeScript Transformer の実装
- [ ] コードジェネレータの基礎構築

## 📖 理論学習内容

### Day 43-46: TypeScript Compiler API 基礎

#### TypeScript AST の理解

```typescript
// 1. TypeScript Compiler API の基本
import * as ts from "typescript";
import * as path from "path";

// プログラムの作成
function createProgram(configPath: string): ts.Program {
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  const configParseResult = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  );

  return ts.createProgram({
    rootNames: configParseResult.fileNames,
    options: configParseResult.options,
  });
}

// 2. SourceFile の解析
function analyzeSourceFile(sourceFile: ts.SourceFile): void {
  function visit(node: ts.Node) {
    console.log(`Node kind: ${ts.SyntaxKind[node.kind]}`);
    console.log(`Node text: ${node.getText(sourceFile)}`);

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

// 3. 特定のノードタイプの検索
function findFunctionDeclarations(
  sourceFile: ts.SourceFile
): ts.FunctionDeclaration[] {
  const functions: ts.FunctionDeclaration[] = [];

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node)) {
      functions.push(node);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return functions;
}

// 4. TypeChecker の活用
function analyzeWithTypeChecker(program: ts.Program): void {
  const checker = program.getTypeChecker();

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      ts.forEachChild(sourceFile, visit);
    }
  }

  function visit(node: ts.Node) {
    // 変数宣言の型情報を取得
    if (ts.isVariableDeclaration(node) && node.name) {
      const symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        const type = checker.getTypeOfSymbolAtLocation(symbol, node);
        const typeString = checker.typeToString(type);
        console.log(`Variable ${symbol.name}: ${typeString}`);
      }
    }

    // 関数の戻り値型を取得
    if (ts.isFunctionDeclaration(node) && node.name) {
      const symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        const signature = checker.getSignatureFromDeclaration(node);
        if (signature) {
          const returnType = checker.getReturnTypeOfSignature(signature);
          const returnTypeString = checker.typeToString(returnType);
          console.log(`Function ${symbol.name} returns: ${returnTypeString}`);
        }
      }
    }

    ts.forEachChild(node, visit);
  }
}
```

### Day 47-49: ESLint プラグイン開発基礎

#### ESLint ルール作成の基本

```typescript
// ESLint ルールの基本構造
import { ESLintUtils, TSESTree, TSESLint } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://your-docs.com/rule/${name}`
);

// 基本的なルール実装例
export const noConsoleLog = createRule({
  name: "no-console-log",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow console.log statements",
      recommended: "warn",
    },
    fixable: "code",
    messages: {
      noConsoleLog: "Unexpected console.log statement",
      useLogger: "Use logger instead of console.log",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowInDevelopment: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ allowInDevelopment: false }],
  create(context, [options]) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "console" &&
          node.callee.property.type === "Identifier" &&
          node.callee.property.name === "log"
        ) {
          context.report({
            node,
            messageId: "noConsoleLog",
            fix(fixer) {
              return fixer.replaceText(node.callee, "logger.info");
            },
          });
        }
      },
    };
  },
});
```

### Day 50-56: TypeScript Transformer 基礎

#### 基本的な Transformer パターン

```typescript
// TypeScript Transformer の基本実装
export function createLoggerTransformer(): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      function visit(node: ts.Node): ts.Node {
        // console.log を logger.info に変換
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.text === "console" &&
          ts.isIdentifier(node.expression.name) &&
          node.expression.name.text === "log"
        ) {
          return ts.factory.updateCallExpression(
            node,
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("logger"),
              "info"
            ),
            node.typeArguments,
            node.arguments
          );
        }

        return ts.visitEachChild(node, visit, context);
      }

      return ts.visitNode(sourceFile, visit);
    };
  };
}
```

## 🎯 実践演習

### 演習 7-1: ESLint プラグイン開発 🔥

**目標**: 実用的な TypeScript 専用 ESLint プラグイン作成

**要件**:

- [ ] no-any-type: any 型の使用を禁止するルール
- [ ] prefer-readonly-array: readonly 配列を推奨するルール
- [ ] no-implicit-return-type: 戻り値型の明示を強制するルール
- [ ] 自動修正機能付き
- [ ] 包括的なテストケース

### 演習 7-2: TypeScript Transformer 実装 💎

**目標**: コード変換ツールの作成

**要件**:

- [ ] Decorator を使った自動プロパティ初期化
- [ ] API インターフェースからクライアント実装生成
- [ ] 型安全なコード変換
- [ ] エラーハンドリング

## 📊 Week 7-8 評価基準

### 理解度チェックリスト

#### Compiler API (40%)

- [ ] TypeScript AST を理解している
- [ ] TypeChecker を活用できる
- [ ] ノードの作成・変更ができる
- [ ] プログラム解析ができる

#### ESLint 開発 (35%)

- [ ] カスタムルールを作成できる
- [ ] 自動修正機能を実装できる
- [ ] TypeScript 型情報を活用できる
- [ ] 適切なテストを書ける

#### Transformer 実装 (25%)

- [ ] AST 変換を理解している
- [ ] 実用的な変換を実装できる
- [ ] エラーハンドリングができる
- [ ] パフォーマンスを考慮できる

### 成果物チェックリスト

- [ ] **ESLint カスタムルール 3 個以上**
- [ ] **TypeScript Transformer 実装**
- [ ] **コード解析ツール**
- [ ] **自動修正機能付きツール**

## 🔄 Week 9-10 への準備

### 次週学習内容の予習

- ライブラリ型定義作成
- 型安全な API 設計
- 実践プロジェクト開発

### 環境準備

- [ ] ライブラリ開発環境構築
- [ ] npm パッケージ公開準備
- [ ] ドキュメント作成環境

---

**📌 重要**: Week 7-8 は TypeScript の内部構造を理解し、実用的な開発ツールを作成する重要な期間です。これらの技術により、開発効率を大幅に向上させるツールを構築できるようになります。
