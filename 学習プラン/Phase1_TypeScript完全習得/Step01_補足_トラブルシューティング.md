# Step01 トラブルシューティング

> 💡 **このファイルについて**: よくあるエラーと解決方法をまとめたガイドです。エラーが発生した時の参考にしてください。

## 📋 目次
1. [TypeScriptコンパイルエラー](#typescriptコンパイルエラー)
2. [環境構築でよくある問題](#環境構築でよくある問題)
3. [エラーメッセージの読み方](#エラーメッセージの読み方)
4. [デバッグのコツ](#デバッグのコツ)

---

## TypeScriptコンパイルエラー

### "tsc: command not found"
**原因**: TypeScriptがインストールされていない

**解決方法**:
```bash
# グローバルインストール
npm install -g typescript

# または、プロジェクト内でnpxを使用
npx tsc --version

# プロジェクト内にローカルインストール
npm install -D typescript
```

**確認方法**:
```bash
# TypeScriptのバージョン確認
tsc --version
# または
npx tsc --version
```

### "Cannot find module '@types/node'"
**原因**: Node.jsの型定義がインストールされていない

**解決方法**:
```bash
# Node.jsの型定義をインストール
npm install -D @types/node

# 特定のバージョンをインストール
npm install -D @types/node@18
```

**確認方法**:
```bash
# インストール済みパッケージの確認
npm list @types/node
```

### "Property 'xxx' does not exist on type 'yyy'"
**原因**: 型定義が正しくない、またはプロパティが存在しない

**解決方法**:
```typescript
// 1. 型アサーションを使用（注意して使用）
const obj = someValue as SomeType;

// 2. 型ガードを使用
if ('property' in obj) {
  console.log(obj.property);
}

// 3. オプショナルチェーンを使用
console.log(obj?.property);

// 4. 正しい型定義を確認
interface User {
  name: string;
  age?: number; // オプショナルプロパティ
}
```

### "Argument of type 'string' is not assignable to parameter of type 'number'"
**原因**: 型が一致しない

**解決方法**:
```typescript
// 型変換を行う
const stringValue = "123";
const numberValue = parseInt(stringValue, 10);

// または、型ガードを使用
function isNumber(value: string | number): value is number {
  return typeof value === 'number';
}

if (isNumber(someValue)) {
  // ここではsomeValueはnumber型として扱われる
  console.log(someValue.toFixed(2));
}
```

### "Type 'null' is not assignable to type 'string'"
**原因**: strictNullChecksが有効で、null許容型の処理が不適切

**解決方法**:
```typescript
// 1. null チェックを追加
function processValue(value: string | null) {
  if (value !== null) {
    console.log(value.toUpperCase());
  }
}

// 2. Non-null assertion operator（!）を使用（確実にnullでない場合のみ）
const value: string | null = getValue();
console.log(value!.toUpperCase()); // 注意: valueがnullでないことが確実な場合のみ

// 3. オプショナルチェーンとnullish coalescing
const result = value?.toUpperCase() ?? "デフォルト値";
```

### "Cannot redeclare block-scoped variable"
**原因**: 同じ変数名が複数回宣言されている

**解決方法**:
```typescript
// 問題のあるコード
let userName = "Alice";
let userName = "Bob"; // エラー

// 解決方法1: 異なる変数名を使用
let userName = "Alice";
let userDisplayName = "Bob";

// 解決方法2: 再代入を使用
let userName = "Alice";
userName = "Bob"; // OK

// 解決方法3: ブロックスコープを使用
{
  let userName = "Alice";
  console.log(userName);
}
{
  let userName = "Bob";
  console.log(userName);
}
```

---

## 環境構築でよくある問題

### Node.jsのバージョン問題
**症状**: 古いNode.jsバージョンでTypeScriptが動作しない

**解決方法**:
```bash
# Node.jsバージョン確認
node --version

# LTS版にアップデート
# nvmを使用している場合
nvm install --lts
nvm use --lts

# 直接インストールの場合
# https://nodejs.org/ からLTS版をダウンロード
```

**推奨バージョン**:
- Node.js: 18.x以上（LTS版）
- npm: 8.x以上

### パッケージインストールの問題
**症状**: npm installでエラーが発生

**解決方法**:
```bash
# 1. キャッシュクリア
npm cache clean --force

# 2. node_modulesとpackage-lock.jsonを削除して再インストール
rm -rf node_modules package-lock.json
npm install

# 3. 権限問題の場合（Mac/Linux）
sudo npm install -g typescript

# 4. ネットワーク問題の場合
npm config set registry https://registry.npmjs.org/
npm install
```

### VS Codeの設定問題
**症状**: TypeScriptの支援機能が動作しない

**解決方法**:
```json
// settings.json に以下を追加
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

**確認事項**:
1. TypeScript拡張機能がインストールされているか
2. ワークスペースでTypeScriptが有効になっているか
3. tsconfig.jsonが正しく設定されているか

### ファイルパスの問題
**症状**: モジュールが見つからない

**解決方法**:
```typescript
// 相対パスを使用
import { helper } from './utils/helper';
import { User } from '../types/user';

// tsconfig.jsonでbaseUrlを設定
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/types/*": ["types/*"]
    }
  }
}

// 使用例
import { User } from '@/types/user';
```

---

## エラーメッセージの読み方

### TypeScriptエラーの構造
```
error TS2322: Type 'string' is not assignable to type 'number'.
```

**構成要素**:
- `error`: エラーレベル
- `TS2322`: エラーコード
- `Type 'string' is not assignable to type 'number'`: エラーメッセージ

### よくあるエラーコード

#### TS2322: Type Assignment Error
```typescript
// 問題
let num: number = "123"; // エラー

// 解決
let num: number = 123; // OK
let num: number = parseInt("123", 10); // OK
```

#### TS2339: Property does not exist
```typescript
// 問題
const user = { name: "Alice" };
console.log(user.age); // エラー

// 解決
interface User {
  name: string;
  age?: number;
}
const user: User = { name: "Alice" };
console.log(user.age); // OK（undefinedの可能性あり）
```

#### TS2345: Argument type mismatch
```typescript
// 問題
function greet(name: string) {
  return `Hello, ${name}!`;
}
greet(123); // エラー

// 解決
greet("Alice"); // OK
greet(String(123)); // OK
```

#### TS2304: Cannot find name
```typescript
// 問題
console.log(undefinedVariable); // エラー

// 解決
const definedVariable = "Hello";
console.log(definedVariable); // OK
```

### エラーメッセージの読み方のコツ

1. **エラーコードを確認**: TS番号でエラーの種類を特定
2. **ファイル名と行番号を確認**: エラーの発生場所を特定
3. **期待される型と実際の型を比較**: 型の不一致を理解
4. **文脈を理解**: 周辺のコードとの関係を確認

---

## デバッグのコツ

### 1. console.logを活用
```typescript
function calculateTotal(items: number[]): number {
  console.log("Input items:", items); // デバッグ出力
  
  const total = items.reduce((sum, item) => {
    console.log(`Adding ${item} to ${sum}`); // 処理の追跡
    return sum + item;
  }, 0);
  
  console.log("Final total:", total); // 結果の確認
  return total;
}
```

### 2. 型の確認
```typescript
// 型を確認するヘルパー関数
function logType<T>(value: T, label: string): T {
  console.log(`${label}:`, typeof value, value);
  return value;
}

// 使用例
const result = logType(calculateTotal([1, 2, 3]), "calculation result");
```

### 3. 段階的なデバッグ
```typescript
// 複雑な処理を段階的に分解
function processUserData(users: User[]): ProcessedUser[] {
  // ステップ1: 入力データの確認
  console.log("Step 1 - Input users:", users.length);
  
  // ステップ2: フィルタリング
  const activeUsers = users.filter(user => user.isActive);
  console.log("Step 2 - Active users:", activeUsers.length);
  
  // ステップ3: 変換
  const processedUsers = activeUsers.map(user => ({
    id: user.id,
    displayName: user.name.toUpperCase(),
    lastLogin: user.lastLogin
  }));
  console.log("Step 3 - Processed users:", processedUsers.length);
  
  return processedUsers;
}
```

### 4. TypeScriptの型チェックを活用
```bash
# 型チェックのみ実行（ファイル出力なし）
npx tsc --noEmit

# 特定のファイルのみチェック
npx tsc --noEmit filename.ts

# 詳細なエラー情報を表示
npx tsc --noEmit --pretty
```

### 5. ESLintとPrettierの活用
```bash
# ESLintでコード品質をチェック
npx eslint src/**/*.ts

# 自動修正
npx eslint src/**/*.ts --fix

# Prettierでフォーマット
npx prettier --write src/**/*.ts
```

---

## 🚨 緊急時の対処法

### プロジェクトが動かなくなった場合
```bash
# 1. 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# 2. TypeScriptを再インストール
npm uninstall typescript
npm install -D typescript

# 3. 設定ファイルを初期化
npx tsc --init

# 4. キャッシュをクリア
npm cache clean --force
```

### 型エラーが大量に発生した場合
```typescript
// 一時的にany型を使用（本番では推奨されない）
const data: any = complexApiResponse;

// 段階的に型を追加
interface PartialUser {
  name: string;
  // 他のプロパティは後で追加
}
```

---

## 📚 参考リンク

- [TypeScript Error Reference](https://www.typescriptlang.org/docs/handbook/error-reference.html)
- [TypeScript FAQ](https://github.com/Microsoft/TypeScript/wiki/FAQ)
- [Stack Overflow - TypeScript](https://stackoverflow.com/questions/tagged/typescript)
- [TypeScript GitHub Issues](https://github.com/microsoft/TypeScript/issues)

---

## 💡 予防策

### 1. 段階的な型の厳密化
```json
// tsconfig.json で段階的に厳しくする
{
  "compilerOptions": {
    "strict": false,        // 最初は緩く
    "noImplicitAny": true,  // 徐々に厳しく
    "strictNullChecks": false // 後で有効化
  }
}
```

### 2. 定期的なコードレビュー
- 型注釈の適切性をチェック
- any型の使用を最小限に抑える
- エラーハンドリングの確認

### 3. テストの作成
```typescript
// 型安全性を確保するテスト
describe('User functions', () => {
  test('should create user with correct types', () => {
    const user = createUser("Alice", 30);
    expect(typeof user.name).toBe('string');
    expect(typeof user.age).toBe('number');
  });
});
```

---

**📌 重要**: エラーが発生した時は慌てずに、エラーメッセージをよく読んで原因を特定しましょう。TypeScriptのエラーメッセージは非常に親切で、多くの場合解決のヒントが含まれています。