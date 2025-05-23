# Phase 4: TypeScript × 開発体験 詳細学習プラン（4-6 ヶ月）

## 🎯 学習目標

TypeScript を活用した開発ツール・ライブラリ作成による開発体験向上とエコシステム構築

## 📅 8 週間学習スケジュール

### Week 1-2: TypeScript Compiler API・AST 操作基礎

#### 📖 学習内容

- TypeScript Compiler API の深掘り
- AST（抽象構文木）の理解と操作
- コード解析・変換の基礎

#### 🎯 週次目標

**Week 1:**

- [ ] TypeScript Compiler API の基本理解
- [ ] AST 構造の解析とナビゲーション
- [ ] シンプルなコード解析ツールの作成

**Week 2:**

- [ ] AST Visitor パターンの実装
- [ ] コード変換の基礎実装
- [ ] TypeChecker API の活用

#### 📝 実践演習

**演習 4-1: AST 解析・操作ツール**

```typescript
// TypeScript Compiler APIを使ったコード解析ツールを実装せよ

import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

// 1. コード統計ツール - TypeScriptプロジェクトの統計情報を収集
interface CodeStatistics {
  totalFiles: number;
  totalLines: number;
  totalClasses: number;
  totalInterfaces: number;
  totalFunctions: number;
  totalVariables: number;
  anyTypeUsage: number;
  typeAnnotationCoverage: number;
  complexityScore: number;
  dependencies: Map<string, number>;
}

class TypeScriptCodeAnalyzer {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  private statistics: CodeStatistics;

  constructor(private configPath: string) {
    this.initializeProgram();
    this.statistics = this.createEmptyStatistics();
  }

  private initializeProgram(): void {
    const configFile = ts.readConfigFile(this.configPath, ts.sys.readFile);
    const configParseResult = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      path.dirname(this.configPath)
    );

    this.program = ts.createProgram({
      rootNames: configParseResult.fileNames,
      options: configParseResult.options,
    });

    this.checker = this.program.getTypeChecker();
  }

  private createEmptyStatistics(): CodeStatistics {
    return {
      totalFiles: 0,
      totalLines: 0,
      totalClasses: 0,
      totalInterfaces: 0,
      totalFunctions: 0,
      totalVariables: 0,
      anyTypeUsage: 0,
      typeAnnotationCoverage: 0,
      complexityScore: 0,
      dependencies: new Map(),
    };
  }

  analyze(): CodeStatistics {
    const sourceFiles = this.program
      .getSourceFiles()
      .filter(
        (file) =>
          !file.isDeclarationFile && !file.fileName.includes("node_modules")
      );

    for (const sourceFile of sourceFiles) {
      this.analyzeSourceFile(sourceFile);
    }

    this.calculateTypeAnnotationCoverage();
    return this.statistics;
  }

  private analyzeSourceFile(sourceFile: ts.SourceFile): void {
    this.statistics.totalFiles++;
    this.statistics.totalLines +=
      sourceFile.getLineAndCharacterOfPosition(sourceFile.end).line + 1;

    // AST走査
    const visit = (node: ts.Node) => {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          this.statistics.totalClasses++;
          this.analyzeClassDeclaration(node as ts.ClassDeclaration);
          break;

        case ts.SyntaxKind.InterfaceDeclaration:
          this.statistics.totalInterfaces++;
          break;

        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
          this.statistics.totalFunctions++;
          this.analyzeFunctionDeclaration(
            node as ts.FunctionDeclaration | ts.MethodDeclaration
          );
          break;

        case ts.SyntaxKind.VariableDeclaration:
          this.statistics.totalVariables++;
          this.analyzeVariableDeclaration(node as ts.VariableDeclaration);
          break;

        case ts.SyntaxKind.ImportDeclaration:
          this.analyzeImportDeclaration(node as ts.ImportDeclaration);
          break;

        case ts.SyntaxKind.TypeReference:
          this.analyzeTypeReference(node as ts.TypeReferenceNode);
          break;
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  private analyzeClassDeclaration(node: ts.ClassDeclaration): void {
    // クラスの複雑度計算
    let complexity = 1; // 基本複雑度

    const visit = (childNode: ts.Node) => {
      switch (childNode.kind) {
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.SwitchStatement:
        case ts.SyntaxKind.ConditionalExpression:
          complexity++;
          break;
      }
      ts.forEachChild(childNode, visit);
    };

    visit(node);
    this.statistics.complexityScore += complexity;
  }

  private analyzeFunctionDeclaration(
    node: ts.FunctionDeclaration | ts.MethodDeclaration
  ): void {
    // 戻り値型の注釈チェック
    if (!node.type) {
      // 型注釈なしの関数
      this.recordMissingTypeAnnotation("function");
    }

    // パラメータの型注釈チェック
    if (node.parameters) {
      for (const param of node.parameters) {
        if (!param.type) {
          this.recordMissingTypeAnnotation("parameter");
        }
      }
    }
  }

  private analyzeVariableDeclaration(node: ts.VariableDeclaration): void {
    if (!node.type) {
      // 型推論に依存している変数
      const type = this.checker.getTypeAtLocation(node);
      const typeString = this.checker.typeToString(type);

      if (typeString === "any") {
        this.statistics.anyTypeUsage++;
      }
    }
  }

  private analyzeImportDeclaration(node: ts.ImportDeclaration): void {
    const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
    const currentCount = this.statistics.dependencies.get(moduleSpecifier) || 0;
    this.statistics.dependencies.set(moduleSpecifier, currentCount + 1);
  }

  private analyzeTypeReference(node: ts.TypeReferenceNode): void {
    const typeName = node.typeName.getText();
    if (typeName === "any") {
      this.statistics.anyTypeUsage++;
    }
  }

  private recordMissingTypeAnnotation(type: "function" | "parameter"): void {
    // 型注釈カバレッジの計算用
  }

  private calculateTypeAnnotationCoverage(): void {
    // 型注釈カバレッジの計算ロジック
    const totalDeclarations =
      this.statistics.totalFunctions + this.statistics.totalVariables;
    const annotatedDeclarations =
      totalDeclarations - this.statistics.anyTypeUsage;
    this.statistics.typeAnnotationCoverage =
      totalDeclarations > 0
        ? (annotatedDeclarations / totalDeclarations) * 100
        : 100;
  }

  generateReport(): string {
    const stats = this.statistics;
    return `
# TypeScript Code Analysis Report

## 📊 General Statistics
- Total Files: ${stats.totalFiles}
- Total Lines: ${stats.totalLines.toLocaleString()}
- Total Classes: ${stats.totalClasses}
- Total Interfaces: ${stats.totalInterfaces}
- Total Functions: ${stats.totalFunctions}
- Total Variables: ${stats.totalVariables}

## 🎯 Type Safety Metrics
- Any Type Usage: ${stats.anyTypeUsage}
- Type Annotation Coverage: ${stats.typeAnnotationCoverage.toFixed(2)}%
- Complexity Score: ${stats.complexityScore}

## 📦 Dependencies
${Array.from(stats.dependencies.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([dep, count]) => `- ${dep}: ${count} imports`)
  .join("\n")}
    `;
  }
}

// 使用例
const analyzer = new TypeScriptCodeAnalyzer("./tsconfig.json");
const statistics = analyzer.analyze();
const report = analyzer.generateReport();
console.log(report);
```

**演習 4-2: コード変換ツール（AST Transformer）**

```typescript
// TypeScript ASTを変換してコードを自動生成・修正するツールを実装せよ

import * as ts from "typescript";

// 1. Decorator を使った自動プロパティ初期化 Transformer
interface AutoInitOptions {
  defaultValues?: Record<string, any>;
  skipPrivate?: boolean;
  enableValidation?: boolean;
}

class AutoInitTransformer {
  constructor(private options: AutoInitOptions = {}) {}

  createTransformer(): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => {
      return (sourceFile: ts.SourceFile) => {
        const visit = (node: ts.Node): ts.Node => {
          if (ts.isClassDeclaration(node)) {
            return this.transformClass(node, context);
          }
          return ts.visitEachChild(node, visit, context);
        };

        return ts.visitNode(sourceFile, visit);
      };
    };
  }

  private transformClass(
    classDecl: ts.ClassDeclaration,
    context: ts.TransformationContext
  ): ts.ClassDeclaration {
    const transformedMembers = classDecl.members.map((member) => {
      if (
        ts.isPropertyDeclaration(member) &&
        this.hasAutoInitDecorator(member)
      ) {
        return this.transformProperty(member, context);
      }
      return member;
    });

    return ts.factory.updateClassDeclaration(
      classDecl,
      classDecl.decorators,
      classDecl.modifiers,
      classDecl.name,
      classDecl.typeParameters,
      classDecl.heritageClauses,
      transformedMembers
    );
  }

  private hasAutoInitDecorator(property: ts.PropertyDeclaration): boolean {
    return (
      property.decorators?.some((decorator) => {
        const expression = decorator.expression;
        if (ts.isIdentifier(expression)) {
          return expression.text === "AutoInit";
        }
        if (
          ts.isCallExpression(expression) &&
          ts.isIdentifier(expression.expression)
        ) {
          return expression.expression.text === "AutoInit";
        }
        return false;
      }) || false
    );
  }

  private transformProperty(
    property: ts.PropertyDeclaration,
    context: ts.TransformationContext
  ): ts.PropertyDeclaration {
    // @AutoInit デコレータを削除
    const decoratorsWithoutAutoInit = property.decorators?.filter(
      (decorator) => !this.isAutoInitDecorator(decorator)
    );

    // デフォルト値を取得
    const defaultValue = this.getDefaultValue(property);

    // 初期化子を追加
    return ts.factory.updatePropertyDeclaration(
      property,
      decoratorsWithoutAutoInit,
      property.modifiers,
      property.name,
      property.questionToken,
      property.type,
      defaultValue
    );
  }

  private isAutoInitDecorator(decorator: ts.Decorator): boolean {
    const expression = decorator.expression;
    if (ts.isIdentifier(expression)) {
      return expression.text === "AutoInit";
    }
    if (
      ts.isCallExpression(expression) &&
      ts.isIdentifier(expression.expression)
    ) {
      return expression.expression.text === "AutoInit";
    }
    return false;
  }

  private getDefaultValue(property: ts.PropertyDeclaration): ts.Expression {
    // @AutoInit(value) から値を取得
    const autoInitDecorator = property.decorators?.find((decorator) =>
      this.isAutoInitDecorator(decorator)
    );

    if (
      autoInitDecorator &&
      ts.isCallExpression(autoInitDecorator.expression)
    ) {
      const args = autoInitDecorator.expression.arguments;
      if (args.length > 0) {
        return args[0] as ts.Expression;
      }
    }

    // 型から推測してデフォルト値を生成
    return this.generateDefaultValueFromType(property.type);
  }

  private generateDefaultValueFromType(type?: ts.TypeNode): ts.Expression {
    if (!type) {
      return ts.factory.createIdentifier("undefined");
    }

    switch (type.kind) {
      case ts.SyntaxKind.StringKeyword:
        return ts.factory.createStringLiteral("");
      case ts.SyntaxKind.NumberKeyword:
        return ts.factory.createNumericLiteral("0");
      case ts.SyntaxKind.BooleanKeyword:
        return ts.factory.createFalse();
      case ts.SyntaxKind.ArrayType:
        return ts.factory.createArrayLiteralExpression([]);
      default:
        return ts.factory.createNull();
    }
  }
}

// 2. API Client Generator Transformer
class ApiClientTransformer {
  createTransformer(): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => {
      return (sourceFile: ts.SourceFile) => {
        // APIインターフェースを見つけてクライアント実装を生成
        const visit = (node: ts.Node): ts.Node => {
          if (ts.isInterfaceDeclaration(node) && this.isApiInterface(node)) {
            return this.generateApiClient(node, context);
          }
          return ts.visitEachChild(node, visit, context);
        };

        return ts.visitNode(sourceFile, visit);
      };
    };
  }

  private isApiInterface(interfaceDecl: ts.InterfaceDeclaration): boolean {
    // @ApiClient デコレータまたは命名規則で判定
    return (
      interfaceDecl.name.text.endsWith("Api") ||
      interfaceDecl.name.text.endsWith("Client")
    );
  }

  private generateApiClient(
    interfaceDecl: ts.InterfaceDeclaration,
    context: ts.TransformationContext
  ): ts.ClassDeclaration {
    const className = `${interfaceDecl.name.text}Impl`;

    const methods = interfaceDecl.members
      .filter(ts.isMethodSignature)
      .map((method) => this.generateClientMethod(method, context));

    return ts.factory.createClassDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(className),
      undefined,
      [
        ts.factory.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [
          ts.factory.createExpressionWithTypeArguments(
            interfaceDecl.name,
            undefined
          ),
        ]),
      ],
      [this.generateConstructor(), ...methods]
    );
  }

  private generateConstructor(): ts.ConstructorDeclaration {
    return ts.factory.createConstructorDeclaration(
      undefined,
      undefined,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
          undefined,
          ts.factory.createIdentifier("baseUrl"),
          undefined,
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          undefined
        ),
        ts.factory.createParameterDeclaration(
          undefined,
          [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
          undefined,
          ts.factory.createIdentifier("httpClient"),
          undefined,
          ts.factory.createTypeReferenceNode("HttpClient"),
          undefined
        ),
      ],
      ts.factory.createBlock([], true)
    );
  }

  private generateClientMethod(
    method: ts.MethodSignature,
    context: ts.TransformationContext
  ): ts.MethodDeclaration {
    const methodName = (method.name as ts.Identifier).text;

    return ts.factory.createMethodDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
      undefined,
      ts.factory.createIdentifier(methodName),
      undefined,
      undefined,
      method.parameters || [],
      method.type,
      ts.factory.createBlock(
        [
          // HTTP リクエストの実装を生成
          this.generateHttpRequest(methodName, method),
        ],
        true
      )
    );
  }

  private generateHttpRequest(
    methodName: string,
    method: ts.MethodSignature
  ): ts.Statement {
    // 簡単な例：GETリクエストの生成
    return ts.factory.createReturnStatement(
      ts.factory.createAwaitExpression(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createThis(),
            ts.factory.createIdentifier("httpClient")
          ),
          undefined,
          [
            ts.factory.createTemplateExpression(
              ts.factory.createTemplateHead("${this.baseUrl}/"),
              [
                ts.factory.createTemplateSpan(
                  ts.factory.createStringLiteral(methodName.toLowerCase()),
                  ts.factory.createTemplateTail("")
                ),
              ]
            ),
          ]
        )
      )
    );
  }
}

// 3. 使用例とテスト
function compileWithTransformers(
  sourceCode: string,
  transformers: ts.TransformerFactory<ts.SourceFile>[]
): string {
  const sourceFile = ts.createSourceFile(
    "test.ts",
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const result = ts.transform(sourceFile, transformers);
  const printer = ts.createPrinter();

  return printer.printFile(result.transformed[0]);
}

// テスト用のソースコード
const testCode = `
class User {
  @AutoInit
  name: string;

  @AutoInit(42)
  age: number;

  @AutoInit
  active: boolean;

  @AutoInit
  hobbies: string[];
}

interface UserApi {
  getUser(id: string): Promise<User>;
  createUser(user: CreateUserRequest): Promise<User>;
  updateUser(id: string, updates: UpdateUserRequest): Promise<User>;
}
`;

// 変換実行
const autoInitTransformer = new AutoInitTransformer();
const apiClientTransformer = new ApiClientTransformer();

const transformedCode = compileWithTransformers(testCode, [
  autoInitTransformer.createTransformer(),
  apiClientTransformer.createTransformer(),
]);

console.log(transformedCode);
```

### Week 3-4: ESLint Plugin 開発・静的解析ツール

#### 📖 学習内容

- ESLint 架構と TypeScript 統合
- カスタムルールの実装パターン
- 静的解析による品質向上

#### 🎯 週次目標

**Week 3:**

- [ ] ESLint Plugin アーキテクチャ理解
- [ ] TypeScript ESLint 統合の詳細
- [ ] 基本的なカスタムルール実装

**Week 4:**

- [ ] 高度なルール実装パターン
- [ ] 自動修正機能の実装
- [ ] プラグイン配布・メンテナンス

#### 📝 実践演習

**演習 4-3: 包括的 ESLint プラグイン開発**

```typescript
// プロダクション品質のESLintプラグインを実装せよ

import { ESLintUtils, TSESTree, TSESLint } from "@typescript-eslint/utils";
import * as ts from "typescript";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://your-company.com/eslint-rules/${name}`
);

// 1. no-unused-css-classes: 使われていないCSS classを検出
export const noUnusedCssClasses = createRule<
  [{ cssFiles: string[]; exclude?: string[]; includeModules?: boolean }],
  "unusedClass" | "suggestion"
>({
  name: "no-unused-css-classes",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow unused CSS classes",
      recommended: "warn",
    },
    fixable: "code",
    messages: {
      unusedClass: 'CSS class "{{className}}" is defined but never used',
      suggestion: 'Consider removing unused CSS class "{{className}}"',
    },
    schema: [
      {
        type: "object",
        properties: {
          cssFiles: {
            type: "array",
            items: { type: "string" },
            description: "List of CSS files to analyze",
          },
          exclude: {
            type: "array",
            items: { type: "string" },
            description: "Class patterns to exclude from analysis",
          },
          includeModules: {
            type: "boolean",
            description: "Include CSS modules in analysis",
            default: true,
          },
        },
        required: ["cssFiles"],
        additionalProperties: false,
      },
    ],
    hasSuggestions: true,
  },
  defaultOptions: [{ cssFiles: [] }],
  create(context, [options]) {
    const usedClasses = new Set<string>();
    const definedClasses = new Map<string, { file: string; line: number }>();
    const sourceCode = context.getSourceCode();

    // CSS ファイルを解析して定義されたクラスを収集
    function analyzeCssFiles(): void {
      const fs = require("fs");
      const path = require("path");

      for (const cssFile of options.cssFiles) {
        const fullPath = path.resolve(cssFile);
        if (!fs.existsSync(fullPath)) {
          continue;
        }

        const content = fs.readFileSync(fullPath, "utf8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          // CSS クラスセレクタを抽出
          const classMatches = line.match(/\.([a-zA-Z][\w-]*)/g);
          if (classMatches) {
            classMatches.forEach((match) => {
              const className = match.slice(1); // '.' を除去
              if (
                !options.exclude?.some((pattern) =>
                  new RegExp(pattern).test(className)
                )
              ) {
                definedClasses.set(className, {
                  file: cssFile,
                  line: index + 1,
                });
              }
            });
          }
        });
      }
    }

    // 初期化時にCSS ファイルを解析
    analyzeCssFiles();

    return {
      // className prop を追跡
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name === "className" &&
          node.value
        ) {
          if (
            node.value.type === "Literal" &&
            typeof node.value.value === "string"
          ) {
            const classes = node.value.value.split(/\s+/).filter(Boolean);
            classes.forEach((className) => usedClasses.add(className));
          } else if (node.value.type === "JSXExpressionContainer") {
            // テンプレートリテラルや変数を解析
            this.analyzeJSXExpression(node.value.expression);
          }
        }
      },

      // CSS Modules のインポートを追跡
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (
          options.includeModules &&
          node.source.value &&
          typeof node.source.value === "string" &&
          /\.(css|scss|less)$/.test(node.source.value)
        ) {
          // CSS Modules の使用を記録
          this.trackCssModuleUsage(node);
        }
      },

      // styled-components やemotion を追跡
      TaggedTemplateExpression(node: TSESTree.TaggedTemplateExpression) {
        if (this.isStyledComponent(node)) {
          this.analyzeStyledComponentClasses(node);
        }
      },

      "Program:exit"() {
        // 未使用のクラスを報告
        for (const [className, location] of definedClasses) {
          if (!usedClasses.has(className)) {
            // 擬似的な報告（実際の位置情報は別途計算が必要）
            context.report({
              loc: { line: 1, column: 0 },
              messageId: "unusedClass",
              data: { className },
              suggest: [
                {
                  messageId: "suggestion",
                  data: { className },
                  fix: (fixer) => {
                    // 自動修正は複雑なため、単純な例を示す
                    return fixer.insertTextAfter(
                      sourceCode.ast,
                      `\n// TODO: Remove unused CSS class: ${className}`
                    );
                  },
                },
              ],
            });
          }
        }
      },

      analyzeJSXExpression(expression: TSESTree.Expression) {
        if (expression.type === "TemplateLiteral") {
          expression.quasis.forEach((quasi) => {
            if (quasi.value.raw) {
              const classes = quasi.value.raw.match(/\b[\w-]+\b/g) || [];
              classes.forEach((className) => {
                if (definedClasses.has(className)) {
                  usedClasses.add(className);
                }
              });
            }
          });
        } else if (expression.type === "CallExpression") {
          // clsx(), classnames() などの呼び出しを解析
          this.analyzeClassnameFunction(expression);
        }
      },

      trackCssModuleUsage(node: TSESTree.ImportDeclaration) {
        // CSS Modules の使用パターンを追跡
        if (node.specifiers && node.specifiers.length > 0) {
          const specifier = node.specifiers[0];
          if (specifier.type === "ImportDefaultSpecifier") {
            // import styles from './Component.module.css'
            // styles.className の使用を追跡する必要がある
          }
        }
      },

      isStyledComponent(node: TSESTree.TaggedTemplateExpression): boolean {
        // styled-components の判定ロジック
        return (
          node.tag.type === "MemberExpression" &&
          node.tag.object.type === "Identifier" &&
          node.tag.object.name === "styled"
        );
      },

      analyzeStyledComponentClasses(node: TSESTree.TaggedTemplateExpression) {
        // styled-components のテンプレート内でのクラス使用を解析
        if (node.quasi.type === "TemplateLiteral") {
          node.quasi.quasis.forEach((quasi) => {
            const classMatches = quasi.value.raw.match(/\.([a-zA-Z][\w-]*)/g);
            if (classMatches) {
              classMatches.forEach((match) => {
                const className = match.slice(1);
                usedClasses.add(className);
              });
            }
          });
        }
      },

      analyzeClassnameFunction(node: TSESTree.CallExpression) {
        // clsx(), classnames() などの引数を解析
        node.arguments.forEach((arg) => {
          if (arg.type === "Literal" && typeof arg.value === "string") {
            const classes = arg.value.split(/\s+/).filter(Boolean);
            classes.forEach((className) => usedClasses.add(className));
          } else if (arg.type === "ObjectExpression") {
            // { 'class-name': condition } 形式
            arg.properties.forEach((prop) => {
              if (
                prop.type === "Property" &&
                prop.key.type === "Literal" &&
                typeof prop.key.value === "string"
              ) {
                usedClasses.add(prop.key.value);
              }
            });
          }
        });
      },
    };
  },
});

// 2. prefer-immutable-state: React状態の不変性を強制
export const preferImmutableState = createRule<
  [{ enforceDeepImmutability?: boolean; allowedMutationMethods?: string[] }],
  "directMutation" | "useImmutableUpdate"
>({
  name: "prefer-immutable-state",
  meta: {
    type: "problem",
    docs: {
      description: "Enforce immutable state updates in React",
      recommended: "error",
    },
    fixable: "code",
    messages: {
      directMutation:
        "Direct mutation of state is not allowed. Use immutable update patterns.",
      useImmutableUpdate: "Use immutable update pattern: {{suggestion}}",
    },
    schema: [
      {
        type: "object",
        properties: {
          enforceDeepImmutability: {
            type: "boolean",
            description: "Enforce deep immutability checks",
            default: true,
          },
          allowedMutationMethods: {
            type: "array",
            items: { type: "string" },
            description: "Methods that are allowed for mutation",
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [options = {}]) {
    const sourceCode = context.getSourceCode();
    const stateVariables = new Set<string>();

    return {
      // useState フックの変数を追跡
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "useState" &&
          node.parent?.type === "VariableDeclarator" &&
          node.parent.id.type === "ArrayPattern"
        ) {
          const [stateVar, setterVar] = node.parent.id.elements;
          if (stateVar?.type === "Identifier") {
            stateVariables.add(stateVar.name);
          }
        }
      },

      // 状態変数への直接的な変更を検出
      AssignmentExpression(node: TSESTree.AssignmentExpression) {
        if (this.isStateMutation(node.left)) {
          context.report({
            node,
            messageId: "directMutation",
            fix: (fixer) => {
              // 簡単な修正例（実際はより複雑な変換が必要）
              const suggestion = this.generateImmutableUpdateSuggestion(node);
              return fixer.replaceText(node, suggestion);
            },
          });
        }
      },

      // push, pop, sort などの変更メソッドを検出
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type === "MemberExpression" &&
          this.isStateMutation(node.callee.object)
        ) {
          const methodName =
            node.callee.property.type === "Identifier"
              ? node.callee.property.name
              : "";

          const mutatingMethods = [
            "push",
            "pop",
            "shift",
            "unshift",
            "splice",
            "sort",
            "reverse",
          ];

          if (
            mutatingMethods.includes(methodName) &&
            !options.allowedMutationMethods?.includes(methodName)
          ) {
            context.report({
              node,
              messageId: "directMutation",
              data: {
                suggestion: this.generateImmutableMethodSuggestion(
                  methodName,
                  node
                ),
              },
            });
          }
        }
      },

      isStateMutation(node: TSESTree.Node): boolean {
        if (node.type === "Identifier") {
          return stateVariables.has(node.name);
        }
        if (node.type === "MemberExpression") {
          return this.isStateMutation(node.object);
        }
        return false;
      },

      generateImmutableUpdateSuggestion(
        node: TSESTree.AssignmentExpression
      ): string {
        // 簡単な例: object spread を使った更新
        return `setState(prev => ({ ...prev, /* update logic */ }))`;
      },

      generateImmutableMethodSuggestion(
        methodName: string,
        node: TSESTree.CallExpression
      ): string {
        switch (methodName) {
          case "push":
            return "setState(prev => [...prev, newItem])";
          case "pop":
            return "setState(prev => prev.slice(0, -1))";
          case "sort":
            return "setState(prev => [...prev].sort())";
          default:
            return "Use immutable update pattern";
        }
      },
    };
  },
});

// 3. no-complex-types: 複雑すぎる型定義を警告
export const noComplexTypes = createRule<
  [
    {
      maxDepth?: number;
      maxUnionMembers?: number;
      maxIntersectionMembers?: number;
    }
  ],
  "typeTooDeeep" | "tooManyUnionMembers" | "tooManyIntersectionMembers"
>({
  name: "no-complex-types",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow overly complex type definitions",
      recommended: "warn",
    },
    messages: {
      typeTooDeeep:
        "Type definition is too deep ({{depth}} levels). Consider breaking it down.",
      tooManyUnionMembers:
        "Union type has too many members ({{count}}). Consider using an enum or breaking it down.",
      tooManyIntersectionMembers:
        "Intersection type has too many members ({{count}}). Consider using interfaces.",
    },
    schema: [
      {
        type: "object",
        properties: {
          maxDepth: {
            type: "integer",
            minimum: 1,
            default: 4,
          },
          maxUnionMembers: {
            type: "integer",
            minimum: 1,
            default: 5,
          },
          maxIntersectionMembers: {
            type: "integer",
            minimum: 1,
            default: 3,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [options = {}]) {
    const maxDepth = options.maxDepth ?? 4;
    const maxUnionMembers = options.maxUnionMembers ?? 5;
    const maxIntersectionMembers = options.maxIntersectionMembers ?? 3;

    function calculateTypeDepth(node: TSESTree.TypeNode): number {
      switch (node.type) {
        case "TSTypeLiteral":
          if (node.members.length === 0) return 1;
          return (
            1 +
            Math.max(
              ...node.members.map((member) => {
                if (
                  member.type === "TSPropertySignature" &&
                  member.typeAnnotation
                ) {
                  return calculateTypeDepth(
                    member.typeAnnotation.typeAnnotation
                  );
                }
                return 0;
              })
            )
          );

        case "TSArrayType":
          return 1 + calculateTypeDepth(node.elementType);

        case "TSUnionType":
        case "TSIntersectionType":
          return 1 + Math.max(...node.types.map(calculateTypeDepth));

        case "TSTypeReference":
          if (node.typeParameters) {
            return (
              1 +
              Math.max(...node.typeParameters.params.map(calculateTypeDepth))
            );
          }
          return 1;

        default:
          return 1;
      }
    }

    return {
      TSUnionType(node: TSESTree.TSUnionType) {
        if (node.types.length > maxUnionMembers) {
          context.report({
            node,
            messageId: "tooManyUnionMembers",
            data: { count: node.types.length },
          });
        }
      },

      TSIntersectionType(node: TSESTree.TSIntersectionType) {
        if (node.types.length > maxIntersectionMembers) {
          context.report({
            node,
            messageId: "tooManyIntersectionMembers",
            data: { count: node.types.length },
          });
        }
      },

      TSTypeAliasDeclaration(node: TSESTree.TSTypeAliasDeclaration) {
        const depth = calculateTypeDepth(node.typeAnnotation);
        if (depth > maxDepth) {
          context.report({
            node,
            messageId: "typeTooDeeep",
            data: { depth },
          });
        }
      },

      TSInterfaceDeclaration(node: TSESTree.TSInterfaceDeclaration) {
        // インターフェースの複雑度チェック
        let maxPropertyDepth = 0;
        for (const member of node.body.body) {
          if (member.type === "TSPropertySignature" && member.typeAnnotation) {
            const depth = calculateTypeDepth(
              member.typeAnnotation.typeAnnotation
            );
            maxPropertyDepth = Math.max(maxPropertyDepth, depth);
          }
        }

        if (maxPropertyDepth > maxDepth) {
          context.report({
            node,
            messageId: "typeTooDeeep",
            data: { depth: maxPropertyDepth },
          });
        }
      },
    };
  },
});

// プラグインエクスポート
export = {
  rules: {
    "no-unused-css-classes": noUnusedCssClasses,
    "prefer-immutable-state": preferImmutableState,
    "no-complex-types": noComplexTypes,
  },
  configs: {
    recommended: {
      rules: {
        "your-plugin/no-unused-css-classes": "warn",
        "your-plugin/prefer-immutable-state": "error",
        "your-plugin/no-complex-types": "warn",
      },
    },
  },
};
```

### Week 5-6: コードジェネレータ・API 統合ツール

#### 📖 学習内容

- OpenAPI/GraphQL からの型自動生成
- コードジェネレータアーキテクチャ
- テンプレートエンジンとの統合

#### 🎯 週次目標

**Week 5:**

- [ ] OpenAPI 仕様からの TypeScript 型生成
- [ ] GraphQL Schema からの型生成
- [ ] コードテンプレートシステム構築

**Week 6:**

- [ ] CLI ツールとしての統合
- [ ] 既存プロジェクトとの統合
- [ ] 増分更新・監視機能

#### 📝 実践演習

**演習 6-1: 統合 API 型生成システム**

```typescript
// OpenAPI・GraphQL両対応の型安全APIクライアント生成ツールを実装せよ

import { OpenAPIV3 } from "openapi-types";
import { GraphQLSchema, buildSchema, printSchema } from "graphql";
import * as fs from "fs/promises";
import * as path from "path";

interface GeneratorConfig {
  input: {
    type: "openapi" | "graphql";
    source: string; // ファイルパスまたはURL
    auth?: {
      type: "bearer" | "apikey";
      token: string;
    };
  };
  output: {
    directory: string;
    typescript: {
      types: boolean;
      client: boolean;
      hooks: boolean; // React hooks
      tests: boolean;
    };
    naming: {
      prefix?: string;
      suffix?: string;
      caseStyle: "camelCase" | "PascalCase" | "snake_case";
    };
  };
  features: {
    validation: boolean;
    serialization: boolean;
    mocking: boolean;
    documentation: boolean;
  };
}

abstract class TypeScriptGenerator {
  constructor(protected config: GeneratorConfig) {}

  abstract generate(): Promise<GenerationResult>;

  protected async writeFile(
    relativePath: string,
    content: string
  ): Promise<void> {
    const fullPath = path.join(this.config.output.directory, relativePath);
    const directory = path.dirname(fullPath);

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(fullPath, content, "utf8");
  }

  protected formatTypeName(name: string): string {
    const { prefix = "", suffix = "", caseStyle } = this.config.output.naming;

    let formatted = name;
    switch (caseStyle) {
      case "camelCase":
        formatted = this.toCamelCase(name);
        break;
      case "PascalCase":
        formatted = this.toPascalCase(name);
        break;
      case "snake_case":
        formatted = this.toSnakeCase(name);
        break;
    }

    return `${prefix}${formatted}${suffix}`;
  }

  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private toPascalCase(str: string): string {
    return this.toCamelCase(str).replace(/^[a-z]/, (char) =>
      char.toUpperCase()
    );
  }

  private toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  protected generateFileHeader(): string {
    return `/**
 * Auto-generated TypeScript definitions
 * Generated at: ${new Date().toISOString()}
 * Generator: TypeScript API Client Generator
 * 
 * DO NOT EDIT MANUALLY
 */

/* eslint-disable */
/* tslint:disable */

`;
  }
}

// OpenAPI Generator
class OpenAPITypeScriptGenerator extends TypeScriptGenerator {
  private schema: OpenAPIV3.Document;

  async generate(): Promise<GenerationResult> {
    await this.loadSchema();

    const results: GenerationResult = {
      types: "",
      client: "",
      hooks: "",
      tests: "",
      files: [],
    };

    if (this.config.output.typescript.types) {
      results.types = await this.generateTypes();
      await this.writeFile("types.ts", results.types);
      results.files.push("types.ts");
    }

    if (this.config.output.typescript.client) {
      results.client = await this.generateClient();
      await this.writeFile("client.ts", results.client);
      results.files.push("client.ts");
    }

    if (this.config.output.typescript.hooks) {
      results.hooks = await this.generateReactHooks();
      await this.writeFile("hooks.ts", results.hooks);
      results.files.push("hooks.ts");
    }

    if (this.config.output.typescript.tests) {
      results.tests = await this.generateTests();
      await this.writeFile("client.test.ts", results.tests);
      results.files.push("client.test.ts");
    }

    return results;
  }

  private async loadSchema(): Promise<void> {
    if (this.config.input.source.startsWith("http")) {
      // URL から読み込み
      const response = await fetch(this.config.input.source, {
        headers: this.getAuthHeaders(),
      });
      this.schema = await response.json();
    } else {
      // ファイルから読み込み
      const content = await fs.readFile(this.config.input.source, "utf8");
      this.schema = JSON.parse(content);
    }
  }

  private getAuthHeaders(): Record<string, string> {
    if (!this.config.input.auth) return {};

    switch (this.config.input.auth.type) {
      case "bearer":
        return { Authorization: `Bearer ${this.config.input.auth.token}` };
      case "apikey":
        return { "X-API-Key": this.config.input.auth.token };
      default:
        return {};
    }
  }

  private async generateTypes(): Promise<string> {
    let output = this.generateFileHeader();

    // Base types
    output += this.generateBaseTypes();

    // Schema components
    if (this.schema.components?.schemas) {
      output += "\n// Schema Types\n\n";

      for (const [name, schema] of Object.entries(
        this.schema.components.schemas
      )) {
        output += this.generateSchemaType(
          name,
          schema as OpenAPIV3.SchemaObject
        );
        output += "\n\n";
      }
    }

    // Request/Response types
    output += "\n// API Types\n\n";
    output += this.generateApiTypes();

    return output;
  }

  private generateBaseTypes(): string {
    return `
// Base API Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}
`;
  }

  private generateSchemaType(
    name: string,
    schema: OpenAPIV3.SchemaObject
  ): string {
    const typeName = this.formatTypeName(name);

    if (schema.enum) {
      // Enum type
      const enumValues = schema.enum
        .map((value) => `  ${JSON.stringify(value)}`)
        .join(" |\n");
      return `export type ${typeName} =\n${enumValues};`;
    }

    if (schema.type === "object" || schema.properties) {
      // Object type
      return this.generateInterfaceType(typeName, schema);
    }

    if (schema.allOf) {
      // Intersection type
      const types = schema.allOf
        .map((s) => this.getTypeReference(s as OpenAPIV3.SchemaObject))
        .join(" & ");
      return `export type ${typeName} = ${types};`;
    }

    if (schema.oneOf || schema.anyOf) {
      // Union type
      const schemas = schema.oneOf || schema.anyOf || [];
      const types = schemas
        .map((s) => this.getTypeReference(s as OpenAPIV3.SchemaObject))
        .join(" | ");
      return `export type ${typeName} = ${types};`;
    }

    // Primitive type alias
    const tsType = this.mapOpenApiTypeToTypeScript(schema);
    return `export type ${typeName} = ${tsType};`;
  }

  private generateInterfaceType(
    name: string,
    schema: OpenAPIV3.SchemaObject
  ): string {
    let output = `export interface ${name} {\n`;

    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const optional = !schema.required?.includes(propName);
        const propType = this.getTypeReference(
          propSchema as OpenAPIV3.SchemaObject
        );

        output += `  ${propName}${optional ? "?" : ""}: ${propType};\n`;
      }
    }

    output += "}";
    return output;
  }

  private mapOpenApiTypeToTypeScript(schema: OpenAPIV3.SchemaObject): string {
    switch (schema.type) {
      case "string":
        if (schema.format === "date" || schema.format === "date-time") {
          return "Date";
        }
        return "string";
      case "number":
      case "integer":
        return "number";
      case "boolean":
        return "boolean";
      case "array":
        const itemType = schema.items
          ? this.getTypeReference(schema.items as OpenAPIV3.SchemaObject)
          : "any";
        return `${itemType}[]`;
      case "object":
        return "Record<string, any>";
      default:
        return "any";
    }
  }

  private getTypeReference(
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  ): string {
    if ("$ref" in schema) {
      // Reference object
      const refName = schema.$ref.split("/").pop() || "Unknown";
      return this.formatTypeName(refName);
    }

    return this.mapOpenApiTypeToTypeScript(schema);
  }

  private generateApiTypes(): string {
    let output = "";

    if (this.schema.paths) {
      for (const [pathPattern, pathItem] of Object.entries(this.schema.paths)) {
        if (!pathItem) continue;

        for (const [method, operation] of Object.entries(pathItem)) {
          if (
            !operation ||
            typeof operation !== "object" ||
            !("operationId" in operation)
          ) {
            continue;
          }

          const opId = operation.operationId || `${method}${pathPattern}`;
          output += this.generateOperationTypes(
            opId,
            method,
            operation as OpenAPIV3.OperationObject
          );
          output += "\n\n";
        }
      }
    }

    return output;
  }

  private generateOperationTypes(
    operationId: string,
    method: string,
    operation: OpenAPIV3.OperationObject
  ): string {
    const opName = this.formatTypeName(operationId);
    let output = "";

    // Request type
    const hasRequestBody =
      operation.requestBody && "content" in operation.requestBody;
    const hasParameters =
      operation.parameters && operation.parameters.length > 0;

    if (hasRequestBody || hasParameters) {
      output += `export interface ${opName}Request {\n`;

      // Parameters
      if (hasParameters) {
        for (const param of operation.parameters || []) {
          if ("$ref" in param) continue;

          const paramSchema = param.schema as OpenAPIV3.SchemaObject;
          const paramType = this.mapOpenApiTypeToTypeScript(paramSchema);
          const optional = !param.required;

          output += `  ${param.name}${optional ? "?" : ""}: ${paramType};\n`;
        }
      }

      // Request body
      if (hasRequestBody) {
        const requestBody =
          operation.requestBody as OpenAPIV3.RequestBodyObject;
        const jsonContent = requestBody.content?.["application/json"];
        if (jsonContent?.schema) {
          const bodyType = this.getTypeReference(jsonContent.schema);
          output += `  body: ${bodyType};\n`;
        }
      }

      output += "}\n\n";
    }

    // Response type
    const successResponse =
      operation.responses?.["200"] || operation.responses?.["201"];
    if (successResponse && "content" in successResponse) {
      const jsonContent = successResponse.content?.["application/json"];
      if (jsonContent?.schema) {
        const responseType = this.getTypeReference(jsonContent.schema);
        output += `export type ${opName}Response = ${responseType};\n`;
      }
    }

    return output;
  }

  private async generateClient(): Promise<string> {
    let output = this.generateFileHeader();

    output += `
import { ApiResponse, ApiError, RequestConfig } from './types';

export class ApiClient {
  constructor(
    private baseUrl: string,
    private defaultConfig: RequestConfig = {}
  ) {}

  private async request<T>(
    endpoint: string,
    options: RequestInit & { config?: RequestConfig } = {}
  ): Promise<ApiResponse<T>> {
    const { config, ...fetchOptions } = options;
    const mergedConfig = { ...this.defaultConfig, ...config };

    const url = \`\${this.baseUrl}\${endpoint}\`;
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
          ...mergedConfig.headers,
        },
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error) {
      throw new ApiError({
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      });
    }
  }
`;

    // Generate method for each operation
    if (this.schema.paths) {
      for (const [pathPattern, pathItem] of Object.entries(this.schema.paths)) {
        if (!pathItem) continue;

        for (const [method, operation] of Object.entries(pathItem)) {
          if (
            !operation ||
            typeof operation !== "object" ||
            !("operationId" in operation)
          ) {
            continue;
          }

          output += this.generateClientMethod(
            pathPattern,
            method,
            operation as OpenAPIV3.OperationObject
          );
          output += "\n";
        }
      }
    }

    output += "}\n";
    return output;
  }

  private generateClientMethod(
    pathPattern: string,
    method: string,
    operation: OpenAPIV3.OperationObject
  ): string {
    const opId = operation.operationId || `${method}${pathPattern}`;
    const methodName = this.toCamelCase(opId);
    const opName = this.formatTypeName(opId);

    const hasRequest = operation.requestBody || operation.parameters?.length;
    const requestType = hasRequest ? `${opName}Request` : "void";
    const responseType = `${opName}Response`;

    let output = `
  async ${methodName}(`;

    if (hasRequest) {
      output += `request: ${requestType}, `;
    }

    output += `config?: RequestConfig): Promise<ApiResponse<${responseType}>> {`;

    // Build endpoint URL
    let endpoint = pathPattern;
    if (operation.parameters) {
      for (const param of operation.parameters) {
        if ("$ref" in param || param.in !== "path") continue;
        endpoint = endpoint.replace(
          `{${param.name}}`,
          `\${request.${param.name}}`
        );
      }
    }

    output += `
    return this.request<${responseType}>('${endpoint}', {
      method: '${method.toUpperCase()}',`;

    if (operation.requestBody) {
      output += `
      body: JSON.stringify(request.body),`;
    }

    output += `
      config,
    });
  }`;

    return output;
  }

  private async generateReactHooks(): Promise<string> {
    let output = this.generateFileHeader();

    output += `
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiClient } from './client';
import type * as Types from './types';

export function createApiHooks(client: ApiClient) {
  const queryKeys = {
`;

    // Generate query keys
    if (this.schema.paths) {
      for (const [pathPattern, pathItem] of Object.entries(this.schema.paths)) {
        if (!pathItem) continue;

        for (const [method, operation] of Object.entries(pathItem)) {
          if (
            !operation ||
            typeof operation !== "object" ||
            !("operationId" in operation)
          ) {
            continue;
          }

          const opId = operation.operationId || `${method}${pathPattern}`;
          const methodName = this.toCamelCase(opId);

          if (method.toLowerCase() === "get") {
            output += `    ${methodName}: (params?: any) => ['${methodName}', params] as const,\n`;
          }
        }
      }
    }

    output += `  };\n\n`;

    // Generate hooks
    if (this.schema.paths) {
      for (const [pathPattern, pathItem] of Object.entries(this.schema.paths)) {
        if (!pathItem) continue;

        for (const [method, operation] of Object.entries(pathItem)) {
          if (
            !operation ||
            typeof operation !== "object" ||
            !("operationId" in operation)
          ) {
            continue;
          }

          const opId = operation.operationId || `${method}${pathPattern}`;
          const methodName = this.toCamelCase(opId);
          const hookName =
            method.toLowerCase() === "get"
              ? `use${this.toPascalCase(opId)}`
              : `use${this.toPascalCase(opId)}Mutation`;

          if (method.toLowerCase() === "get") {
            output += this.generateQueryHook(methodName, opId, hookName);
          } else {
            output += this.generateMutationHook(methodName, opId, hookName);
          }

          output += "\n";
        }
      }
    }

    output += `
  return {
    queryKeys,`;

    // Export all hooks
    if (this.schema.paths) {
      for (const [pathPattern, pathItem] of Object.entries(this.schema.paths)) {
        if (!pathItem) continue;

        for (const [method, operation] of Object.entries(pathItem)) {
          if (
            !operation ||
            typeof operation !== "object" ||
            !("operationId" in operation)
          ) {
            continue;
          }

          const opId = operation.operationId || `${method}${pathPattern}`;
          const hookName =
            method.toLowerCase() === "get"
              ? `use${this.toPascalCase(opId)}`
              : `use${this.toPascalCase(opId)}Mutation`;

          output += `\n    ${hookName},`;
        }
      }
    }

    output += `
  };
}
`;

    return output;
  }

  private generateQueryHook(
    methodName: string,
    opId: string,
    hookName: string
  ): string {
    const opName = this.formatTypeName(opId);

    return `
  function ${hookName}(
    request?: ${opName}Request,
    options?: Omit<UseQueryOptions<Types.${opName}Response>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey: queryKeys.${methodName}(request),
      queryFn: () => client.${methodName}(request).then(res => res.data),
      ...options,
    });
  }`;
  }

  private generateMutationHook(
    methodName: string,
    opId: string,
    hookName: string
  ): string {
    const opName = this.formatTypeName(opId);

    return `
  function ${hookName}(
    options?: UseMutationOptions<Types.${opName}Response, Error, ${opName}Request>
  ) {
    return useMutation({
      mutationFn: (request: ${opName}Request) => client.${methodName}(request).then(res => res.data),
      ...options,
    });
  }`;
  }

  private async generateTests(): Promise<string> {
    let output = this.generateFileHeader();

    output += `
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiClient } from './client';

// Mock fetch
global.fetch = vi.fn();

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient('https://api.example.com');
    vi.clearAllMocks();
  });

  it('should create client instance', () => {
    expect(client).toBeInstanceOf(ApiClient);
  });
`;

    // Generate test for each operation
    if (this.schema.paths) {
      for (const [pathPattern, pathItem] of Object.entries(this.schema.paths)) {
        if (!pathItem) continue;

        for (const [method, operation] of Object.entries(pathItem)) {
          if (
            !operation ||
            typeof operation !== "object" ||
            !("operationId" in operation)
          ) {
            continue;
          }

          const opId = operation.operationId || `${method}${pathPattern}`;
          const methodName = this.toCamelCase(opId);

          output += this.generateMethodTest(
            methodName,
            method,
            operation as OpenAPIV3.OperationObject
          );
        }
      }
    }

    output += `
});
`;

    return output;
  }

  private generateMethodTest(
    methodName: string,
    method: string,
    operation: OpenAPIV3.OperationObject
  ): string {
    return `
  it('should call ${methodName}', async () => {
    const mockResponse = { data: {} };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Map(),
      json: () => Promise.resolve(mockResponse.data),
    });

    const result = await client.${methodName}(${
      operation.requestBody ? "{}" : ""
    });
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.example.com'),
      expect.objectContaining({
        method: '${method.toUpperCase()}',
      })
    );
    expect(result.data).toEqual(mockResponse.data);
  });`;
  }
}

interface GenerationResult {
  types: string;
  client: string;
  hooks: string;
  tests: string;
  files: string[];
}

// CLI インターフェース
export class ApiGeneratorCLI {
  async run(configPath: string): Promise<void> {
    const config = await this.loadConfig(configPath);
    const generator = this.createGenerator(config);

    console.log("Generating TypeScript API client...");
    const result = await generator.generate();

    console.log(`Generated ${result.files.length} files:`);
    result.files.forEach((file) => console.log(`  - ${file}`));

    if (config.features.documentation) {
      await this.generateDocumentation(config, result);
    }
  }

  private async loadConfig(configPath: string): Promise<GeneratorConfig> {
    const content = await fs.readFile(configPath, "utf8");
    return JSON.parse(content);
  }

  private createGenerator(config: GeneratorConfig): TypeScriptGenerator {
    switch (config.input.type) {
      case "openapi":
        return new OpenAPITypeScriptGenerator(config);
      case "graphql":
        // TODO: Implement GraphQLTypeScriptGenerator
        throw new Error("GraphQL generator not implemented yet");
      default:
        throw new Error(`Unsupported input type: ${config.input.type}`);
    }
  }

  private async generateDocumentation(
    config: GeneratorConfig,
    result: GenerationResult
  ): Promise<void> {
    const docContent = `
# Generated API Client

This client was generated from ${config.input.type} schema.

## Files

${result.files.map((file) => `- \`${file}\``).join("\n")}

## Usage

\`\`\`typescript
import { ApiClient } from './client';
import { createApiHooks } from './hooks';

const client = new ApiClient('https://api.example.com');
const hooks = createApiHooks(client);
\`\`\`
`;

    await fs.writeFile(
      path.join(config.output.directory, "README.md"),
      docContent,
      "utf8"
    );
  }
}
```

### Week 7-8: 開発環境統合・実践プロジェクト

#### 📖 学習内容

- 統合開発環境の構築
- CI/CD パイプラインとの統合
- エコシステム全体の最適化

#### 🎯 週次目標

**Week 7:**

- [ ] 開発ツールチェーンの統合
- [ ] パフォーマンス最適化
- [ ] デバッグ・監視機能

**Week 8:**

- [ ] 実践プロジェクト完成
- [ ] ドキュメンテーション作成
- [ ] オープンソース化準備

#### 📝 最終プロジェクト: 統合開発ツールスイート

```typescript
// TypeScript プロジェクト用の統合開発ツールスイートを構築

interface ToolSuiteConfig {
  project: {
    name: string;
    version: string;
    typescript: {
      configPath: string;
      strict: boolean;
    };
  };
  tools: {
    linting: {
      enabled: boolean;
      customRules: string[];
    };
    generation: {
      api: boolean;
      components: boolean;
      tests: boolean;
    };
    optimization: {
      bundleAnalysis: boolean;
      typeChecking: boolean;
      deadCodeElimination: boolean;
    };
  };
  integrations: {
    vscode: boolean;
    github: boolean;
    cicd: boolean;
  };
}

class TypeScriptToolSuite {
  constructor(private config: ToolSuiteConfig) {}

  async init(): Promise<void> {
    await this.setupLinting();
    await this.setupGeneration();
    await this.setupOptimization();
    await this.setupIntegrations();
  }

  private async setupLinting(): Promise<void> {
    // ESLint設定とカスタムルールのセットアップ
  }

  private async setupGeneration(): Promise<void> {
    // コードジェネレータの設定
  }

  private async setupOptimization(): Promise<void> {
    // 最適化ツールの設定
  }

  private async setupIntegrations(): Promise<void> {
    // エディタ・CI/CD統合
  }
}
```

## 📊 学習成果評価基準

### 📈 成果物チェックリスト

- [ ] **TypeScript ESLint Plugin（5 ルール以上）**
- [ ] **TypeScript Transformer（3 種類以上）**
- [ ] **API クライアント自動生成ツール**
- [ ] **コードジェネレータツール**
- [ ] **型安全なスキーマバリデーター**
- [ ] **統合開発ツールスイート**

### 🏆 最終評価項目

| 項目              | 重み | 評価基準             |
| ----------------- | ---- | -------------------- |
| ツール設計・実装  | 30%  | 実用性と技術的完成度 |
| TypeScript 活用度 | 25%  | 高度な型機能の活用   |
| 開発体験向上      | 20%  | 効率化と使いやすさ   |
| 拡張性・保守性    | 15%  | アーキテクチャの品質 |
| エコシステム統合  | 10%  | 既存ツールとの連携   |

**合格基準: 各項目 80%以上、総合 85%以上**

---

**📌 重要**: この Phase では、単にツールを作るだけでなく、実際の開発現場で使われることを想定した実用性と品質の確保が最重要です。
