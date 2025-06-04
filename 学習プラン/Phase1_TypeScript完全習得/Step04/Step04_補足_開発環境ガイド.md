# Step04 開発環境ガイド

> 💡 **このファイルについて**: ユニオン型と型ガードの学習を効率的に進めるための開発環境設定ガイドです。

## 📋 目次
1. [VSCode設定の最適化](#VSCode設定の最適化)
2. [TypeScript拡張機能](#TypeScript拡張機能)
3. [デバッグ環境の構築](#デバッグ環境の構築)
4. [型チェックの効率化](#型チェックの効率化)
5. [コード補完の活用](#コード補完の活用)
6. [エラー表示の最適化](#エラー表示の最適化)

---

## VSCode設定の最適化

### 基本設定

TypeScript開発に最適化されたVSCode設定を以下に示します：

```json
// settings.json
{
  "typescript.preferences.quoteStyle": "double",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll": true
  },
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "typescript.inlayHints.parameterNames.enabled": "all",
  "typescript.inlayHints.variableTypes.enabled": true,
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true
}
```

### ユニオン型・型ガード特化設定

```json
{
  "typescript.suggest.completeFunctionCalls": true,
  "typescript.suggest.includeCompletionsForImportStatements": true,
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "editor.parameterHints.enabled": true,
  "editor.hover.enabled": true,
  "editor.hover.delay": 300
}
```

---

## TypeScript拡張機能

### 必須拡張機能

#### 1. TypeScript Importer
- **ID**: `pmneo.tsimporter`
- **機能**: 自動インポート機能の強化
- **ユニオン型での活用**: 型定義の自動インポートでコード作成を効率化

#### 2. Error Lens
- **ID**: `usernamehw.errorlens`
- **機能**: エラーをインラインで表示
- **型ガードでの活用**: 型エラーを即座に確認可能

#### 3. TypeScript Hero
- **ID**: `rbbit.typescript-hero`
- **機能**: TypeScript開発支援
- **活用**: インターフェース・型定義の整理

### 推奨拡張機能

#### 4. Bracket Pair Colorizer 2
- **ID**: `CoenraadS.bracket-pair-colorizer-2`
- **機能**: 括弧の色分け
- **活用**: 複雑なユニオン型定義の可読性向上

#### 5. Auto Rename Tag
- **ID**: `formulahendry.auto-rename-tag`
- **機能**: タグの自動リネーム
- **活用**: JSX/TSXでの型安全な開発

---

## デバッグ環境の構築

### launch.json設定

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "TypeScript Debug",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "sourceMaps": true,
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Current TS File",
      "type": "node",
      "request": "launch",
      "program": "${file}",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "TS_NODE_PROJECT": "${workspaceFolder}/tsconfig.json"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### tasks.json設定

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "typescript",
      "tsconfig": "tsconfig.json",
      "problemMatcher": ["$tsc"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "label": "tsc: build - tsconfig.json"
    },
    {
      "type": "shell",
      "command": "npx ts-node ${file}",
      "group": "test",
      "label": "Run Current TypeScript File",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    }
  ]
}
```

---

## 型チェックの効率化

### tsconfig.json最適化

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "noEmitOnError": true,
    "incremental": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 型チェック用スクリプト

```json
// package.json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "build": "tsc",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "test:types": "tsc --noEmit && echo 'Type check passed!'"
  }
}
```

---

## コード補完の活用

### ユニオン型での補完活用

#### 1. 型の絞り込み補完
```typescript
// 型ガード後の補完を活用
function processValue(value: string | number) {
  if (typeof value === "string") {
    // ここでstring固有のメソッドが補完される
    value.toUpperCase(); // 補完で表示される
  }
}
```

#### 2. 判別可能なユニオンでの補完
```typescript
interface LoadingState {
  type: "loading";
  message: string;
}

interface SuccessState {
  type: "success";
  data: any[];
}

type AppState = LoadingState | SuccessState;

function handleState(state: AppState) {
  switch (state.type) {
    case "loading":
      // state.messageが補完される
      break;
    case "success":
      // state.dataが補完される
      break;
  }
}
```

### 補完の効率化設定

```json
{
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "editor.suggest.localityBonus": true,
  "editor.suggest.shareSuggestSelections": true,
  "editor.acceptSuggestionOnCommitCharacter": true,
  "editor.acceptSuggestionOnEnter": "on",
  "typescript.suggest.enabled": true,
  "typescript.suggest.paths": true,
  "typescript.suggest.autoImports": true
}
```

---

## エラー表示の最適化

### 問題パネルの活用

#### 1. エラーフィルタリング
- **TypeScriptエラーのみ表示**: `@ext:typescript`
- **現在のファイルのみ**: `@activeEditor`
- **エラーレベル別**: `@severity:error`

#### 2. エラーナビゲーション
- **次のエラーへ**: `F8`
- **前のエラーへ**: `Shift+F8`
- **エラー一覧表示**: `Ctrl+Shift+M`

### 型エラーの理解促進

#### エラーメッセージの読み方
```typescript
// よくあるユニオン型エラー
function example(value: string | number) {
  return value.toUpperCase(); 
  // Error: Property 'toUpperCase' does not exist on type 'string | number'.
  // Property 'toUpperCase' does not exist on type 'number'.
}

// 解決方法：型ガードを使用
function exampleFixed(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // OK
  }
  return value.toString();
}
```

---

## 実践的な開発フロー

### 1. 型定義ファーストアプローチ

```typescript
// 1. まず型を定義
type ApiResponse<T> = 
  | { status: "success"; data: T }
  | { status: "error"; message: string };

// 2. 型ガード関数を作成
function isSuccess<T>(response: ApiResponse<T>): response is { status: "success"; data: T } {
  return response.status === "success";
}

// 3. 実装
function processResponse<T>(response: ApiResponse<T>) {
  if (isSuccess(response)) {
    // response.dataが安全に使用可能
    return response.data;
  }
  throw new Error(response.message);
}
```

### 2. 段階的な型の厳密化

```typescript
// 段階1: 緩い型定義
type UserInput = any;

// 段階2: ユニオン型で可能性を限定
type UserInput = string | number | boolean;

// 段階3: より具体的な型定義
type UserInput = 
  | { type: "text"; value: string }
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean };
```

---

## トラブルシューティング

### よくある問題と解決方法

#### 1. 型チェックが遅い
**原因**: プロジェクトサイズが大きい
**解決**: 
- `skipLibCheck: true` を設定
- `incremental: true` を有効化
- 不要なファイルを `exclude` に追加

#### 2. 補完が効かない
**原因**: TypeScriptサービスの問題
**解決**:
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- VSCodeの再起動
- `node_modules` の再インストール

#### 3. エラーが表示されない
**原因**: 設定の問題
**解決**:
- `typescript.validate.enable: true` を確認
- 問題パネルの設定を確認
- ワークスペース設定を確認

---

## 学習効率化のコツ

### 1. ホットキーの活用
- **定義へジャンプ**: `F12`
- **型定義を表示**: `Ctrl+K Ctrl+I`
- **参照を検索**: `Shift+F12`
- **シンボルの名前変更**: `F2`

### 2. スニペットの活用
```json
// typescript.json (ユーザースニペット)
{
  "Type Guard Function": {
    "prefix": "tguard",
    "body": [
      "function is${1:Type}(value: ${2:any}): value is ${1:Type} {",
      "  return ${3:condition};",
      "}"
    ],
    "description": "Create a type guard function"
  },
  "Union Type": {
    "prefix": "tunion",
    "body": [
      "type ${1:TypeName} = ${2:Type1} | ${3:Type2};"
    ],
    "description": "Create a union type"
  }
}
```

### 3. 学習進捗の管理
- **TODO コメント**: 学習ポイントをマーク
- **型注釈の段階的削除**: 型推論の理解を深める
- **リファクタリング練習**: 型安全性を保ちながらコード改善

---

## まとめ

この開発環境ガイドを活用することで、Step04のユニオン型と型ガードの学習を効率的に進めることができます。

**重要なポイント**:
1. **型エラーの即座確認**: Error Lensで開発効率向上
2. **補完機能の最大活用**: 型情報を活用した効率的なコーディング
3. **デバッグ環境の整備**: 問題の早期発見と解決
4. **段階的な学習**: 簡単な型から複雑な型へのステップアップ

> 💡 **次のステップ**: この環境設定を完了したら、Session1の実践演習に取り組んでみましょう！