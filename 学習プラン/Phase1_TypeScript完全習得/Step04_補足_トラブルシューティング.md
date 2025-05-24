# Step04 トラブルシューティング

> 💡 **このファイルについて**: ユニオン型と型ガードでよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [ユニオン型関連のエラー](#ユニオン型関連のエラー)
2. [型ガード関連のエラー](#型ガード関連のエラー)
3. [型アサーション関連のエラー](#型アサーション関連のエラー)
4. [判別可能なユニオン関連のエラー](#判別可能なユニオン関連のエラー)
5. [パフォーマンス関連の問題](#パフォーマンス関連の問題)

---

## ユニオン型関連のエラー

### "Property 'xxx' does not exist on type 'A | B'"
**原因**: ユニオン型で共通でないプロパティにアクセスしようとしている

**エラー例**:
```typescript
type Cat = { name: string; meow(): void };
type Dog = { name: string; bark(): void };

function makeSound(animal: Cat | Dog) {
  animal.meow(); // Error: Property 'meow' does not exist on type 'Cat | Dog'
}
```

**解決方法**:
```typescript
// 解決方法1: 型ガードを使用
function makeSound(animal: Cat | Dog) {
  if ('meow' in animal) {
    animal.meow(); // Catとして認識
  } else {
    animal.bark(); // Dogとして認識
  }
}

// 解決方法2: 判別可能なユニオンを使用
type Cat = { type: 'cat'; name: string; meow(): void };
type Dog = { type: 'dog'; name: string; bark(): void };

function makeSound(animal: Cat | Dog) {
  switch (animal.type) {
    case 'cat':
      animal.meow(); // OK
      break;
    case 'dog':
      animal.bark(); // OK
      break;
  }
}

// 解決方法3: カスタム型ガードを使用
function isCat(animal: Cat | Dog): animal is Cat {
  return 'meow' in animal;
}

function makeSound(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow(); // OK
  } else {
    animal.bark(); // OK
  }
}
```

### "Argument of type 'A' is not assignable to parameter of type 'A | B'"
**原因**: ユニオン型の理解不足、または型の絞り込みが不適切

**エラー例**:
```typescript
type StringOrNumber = string | number;

function processValue(value: StringOrNumber): string {
  return value.toUpperCase(); // Error: Property 'toUpperCase' does not exist on type 'number'
}
```

**解決方法**:
```typescript
// 解決方法1: typeof型ガードを使用
function processValue(value: StringOrNumber): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else {
    return value.toString();
  }
}

// 解決方法2: 三項演算子を使用
function processValue(value: StringOrNumber): string {
  return typeof value === 'string' ? value.toUpperCase() : value.toString();
}

// 解決方法3: オーバーロードを使用
function processValue(value: string): string;
function processValue(value: number): string;
function processValue(value: StringOrNumber): string {
  return typeof value === 'string' ? value.toUpperCase() : value.toString();
}
```

### "Type 'never' is not assignable to type 'xxx'"
**原因**: 網羅性チェックで未処理のケースがある

**エラー例**:
```typescript
type Status = 'loading' | 'success' | 'error';

function getStatusMessage(status: Status): string {
  switch (status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return 'Success!';
    // 'error'ケースが不足
    default:
      const _exhaustive: never = status; // Error: Type 'string' is not assignable to type 'never'
      throw new Error(`Unhandled status: ${_exhaustive}`);
  }
}
```

**解決方法**:
```typescript
// 解決方法1: 不足しているケースを追加
function getStatusMessage(status: Status): string {
  switch (status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return 'Success!';
    case 'error':
      return 'Error occurred!';
    default:
      const _exhaustive: never = status; // OK
      throw new Error(`Unhandled status: ${_exhaustive}`);
  }
}

// 解決方法2: 型定義を確認して修正
type Status = 'loading' | 'success' | 'error' | 'idle'; // 新しいケースが追加された場合

function getStatusMessage(status: Status): string {
  switch (status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return 'Success!';
    case 'error':
      return 'Error occurred!';
    case 'idle':
      return 'Idle';
    default:
      const _exhaustive: never = status;
      throw new Error(`Unhandled status: ${_exhaustive}`);
  }
}
```

---

## 型ガード関連のエラー

### "A type predicate's type must be assignable to its parameter's type"
**原因**: 型述語の型がパラメータの型と一致しない

**エラー例**:
```typescript
function isString(value: number): value is string { // Error
  return typeof value === 'string';
}
```

**解決方法**:
```typescript
// 解決方法1: パラメータの型を修正
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// 解決方法2: より具体的な型ガード
function isString(value: string | number): value is string {
  return typeof value === 'string';
}

// 解決方法3: ジェネリクスを使用
function isString<T>(value: T): value is T & string {
  return typeof value === 'string';
}
```

### "This condition will always return 'true'/'false'"
**原因**: 型ガードの条件が常に同じ結果になる

**エラー例**:
```typescript
function processValue(value: string) {
  if (typeof value === 'string') { // Warning: This condition will always return 'true'
    return value.toUpperCase();
  }
  return value; // この行は到達不可能
}
```

**解決方法**:
```typescript
// 解決方法1: 型を修正
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toString();
}

// 解決方法2: 型ガードを削除
function processValue(value: string) {
  return value.toUpperCase(); // 型ガード不要
}

// 解決方法3: より適切な型ガード
function processValue(value: unknown) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return String(value);
}
```

### "Type guard is not working as expected"
**原因**: 型ガードの実装が不正確

**問題のあるコード**:
```typescript
interface User {
  name: string;
  email: string;
}

function isUser(obj: any): obj is User {
  return obj.name && obj.email; // 不十分なチェック
}

// 問題: 以下のオブジェクトもUserとして認識される
const fakeUser = { name: 123, email: true };
console.log(isUser(fakeUser)); // true（間違い）
```

**解決方法**:
```typescript
// 解決方法1: より厳密な型ガード
function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string'
  );
}

// 解決方法2: ライブラリを使用（例：zod）
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

function isUser(obj: unknown): obj is User {
  return UserSchema.safeParse(obj).success;
}

// 解決方法3: より詳細なバリデーション
function isUser(obj: any): obj is User {
  if (!obj || typeof obj !== 'object') return false;
  if (typeof obj.name !== 'string' || obj.name.length === 0) return false;
  if (typeof obj.email !== 'string' || !obj.email.includes('@')) return false;
  return true;
}
```

---

## 型アサーション関連のエラー

### "Conversion of type 'A' to type 'B' may be a mistake"
**原因**: 型アサーションが危険または不適切

**エラー例**:
```typescript
const value: string = "hello";
const num = value as number; // Error: Conversion of type 'string' to type 'number' may be a mistake
```

**解決方法**:
```typescript
// 解決方法1: 適切な型変換を使用
const value: string = "123";
const num = parseInt(value, 10); // 適切な変換

// 解決方法2: unknown経由でアサーション（注意して使用）
const value: string = "hello";
const num = (value as unknown) as number; // 強制的だが危険

// 解決方法3: 型ガードを使用
function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

const value: unknown = getValue();
if (isNumber(value)) {
  // valueはnumber型として安全に使用可能
  console.log(value.toFixed(2));
}

// 解決方法4: ユニオン型を使用
type StringOrNumber = string | number;
const value: StringOrNumber = getValue();
```

### "Object is possibly 'null' or 'undefined'"
**原因**: Non-null assertion operator（!）の誤用

**エラー例**:
```typescript
function getElement(id: string) {
  const element = document.getElementById(id)!; // 危険
  element.addEventListener('click', handler); // elementがnullの可能性
}
```

**解決方法**:
```typescript
// 解決方法1: null チェックを追加
function getElement(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener('click', handler);
  } else {
    console.error(`Element with id "${id}" not found`);
  }
}

// 解決方法2: オプショナルチェーンを使用
function getElement(id: string) {
  const element = document.getElementById(id);
  element?.addEventListener('click', handler);
}

// 解決方法3: エラーハンドリングを含む関数
function safeGetElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element;
}

// 解決方法4: Result型パターンを使用
type ElementResult = 
  | { success: true; element: HTMLElement }
  | { success: false; error: string };

function getElementSafe(id: string): ElementResult {
  const element = document.getElementById(id);
  if (element) {
    return { success: true, element };
  } else {
    return { success: false, error: `Element with id "${id}" not found` };
  }
}
```

---

## 判別可能なユニオン関連のエラー

### "Not all code paths return a value"
**原因**: switch文で全てのケースが処理されていない

**エラー例**:
```typescript
type Shape = 
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    // rectangleケースが不足
  }
} // Error: Not all code paths return a value
```

**解決方法**:
```typescript
// 解決方法1: 不足しているケースを追加
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
  }
}

// 解決方法2: default ケースを追加
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}

// 解決方法3: 関数型アプローチ
const getArea = (shape: Shape): number => {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
  }
};
```

### "Discriminant property is not consistent"
**原因**: 判別プロパティが一貫していない

**エラー例**:
```typescript
type ApiResponse = 
  | { status: 'success'; data: any }
  | { success: true; result: any }; // 判別プロパティが異なる

function handleResponse(response: ApiResponse) {
  switch (response.status) { // Error: Property 'status' does not exist
    case 'success':
      // ...
  }
}
```

**解決方法**:
```typescript
// 解決方法1: 判別プロパティを統一
type ApiResponse = 
  | { status: 'success'; data: any }
  | { status: 'error'; error: string };

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      console.log(response.data);
      break;
    case 'error':
      console.error(response.error);
      break;
  }
}

// 解決方法2: 複数の判別プロパティを使用
type ApiResponse = 
  | { type: 'success'; status: 'ok'; data: any }
  | { type: 'error'; status: 'failed'; error: string };

function handleResponse(response: ApiResponse) {
  if (response.type === 'success') {
    console.log(response.data);
  } else {
    console.error(response.error);
  }
}

// 解決方法3: インターフェースを使用
interface SuccessResponse {
  status: 'success';
  data: any;
}

interface ErrorResponse {
  status: 'error';
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;
```

---

## パフォーマンス関連の問題

### "Complex type checking causing slow compilation"
**原因**: 複雑なユニオン型による型チェックの遅延

**問題のあるコード**:
```typescript
// 非常に大きなユニオン型
type MassiveUnion = 
  | Type1 | Type2 | Type3 | /* ... 100個以上の型 ... */ | Type100;

function processValue(value: MassiveUnion) {
  // 複雑な型チェック
}
```

**解決方法**:
```typescript
// 解決方法1: 型を階層化
type Category1 = Type1 | Type2 | Type3;
type Category2 = Type4 | Type5 | Type6;
type Category3 = Type7 | Type8 | Type9;

type CategorizedUnion = Category1 | Category2 | Category3;

// 解決方法2: 判別可能なユニオンを使用
type ProcessableValue = 
  | { category: 'A'; value: Category1 }
  | { category: 'B'; value: Category2 }
  | { category: 'C'; value: Category3 };

function processValue(input: ProcessableValue) {
  switch (input.category) {
    case 'A':
      return processCategory1(input.value);
    case 'B':
      return processCategory2(input.value);
    case 'C':
      return processCategory3(input.value);
  }
}

// 解決方法3: ジェネリクスを使用
interface Processor<T> {
  process(value: T): string;
}

class ValueProcessor {
  private processors = new Map<string, Processor<any>>();
  
  register<T>(key: string, processor: Processor<T>) {
    this.processors.set(key, processor);
  }
  
  process<T>(key: string, value: T): string {
    const processor = this.processors.get(key);
    if (processor) {
      return processor.process(value);
    }
    throw new Error(`No processor found for key: ${key}`);
  }
}
```

### "Runtime performance issues with type guards"
**原因**: 実行時の型ガードが重い

**問題のあるコード**:
```typescript
// 重い型ガード
function isComplexObject(obj: unknown): obj is ComplexObject {
  return (
    obj &&
    typeof obj === 'object' &&
    // 多数の深いプロパティチェック
    deepPropertyCheck(obj) &&
    expensiveValidation(obj) &&
    networkValidation(obj) // ネットワーク呼び出し
  );
}

// 頻繁に呼び出される
function processArray(items: unknown[]) {
  return items.filter(isComplexObject).map(processComplexObject);
}
```

**解決方法**:
```typescript
// 解決方法1: 型ガードを軽量化
function isComplexObject(obj: unknown): obj is ComplexObject {
  // 最小限のチェックのみ
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'type' in obj
  );
}

// 解決方法2: キャッシュを使用
const typeCache = new WeakMap<object, boolean>();

function isComplexObjectCached(obj: unknown): obj is ComplexObject {
  if (typeof obj !== 'object' || !obj) return false;
  
  if (typeCache.has(obj)) {
    return typeCache.get(obj)!;
  }
  
  const result = expensiveTypeCheck(obj);
  typeCache.set(obj, result);
  return result;
}

// 解決方法3: 段階的な型チェック
function isComplexObject(obj: unknown): obj is ComplexObject {
  // 高速な基本チェック
  if (!obj || typeof obj !== 'object') return false;
  if (!('id' in obj) || !('type' in obj)) return false;
  
  // 必要な場合のみ詳細チェック
  return detailedTypeCheck(obj);
}

// 解決方法4: 型アサーションと実行時検証を分離
function assertComplexObject(obj: unknown): ComplexObject {
  if (!isBasicComplexObject(obj)) {
    throw new Error('Invalid object structure');
  }
  return obj; // 基本チェック後は型アサーション
}

function validateComplexObject(obj: ComplexObject): boolean {
  // 詳細な検証は別関数で
  return expensiveValidation(obj);
}
```

---

## 🚨 緊急時の対処法

### 型エラーが大量に発生した場合
```typescript
// 一時的にany型を使用（本番では推奨されない）
const data: any = complexUnionValue;

// 段階的に型を追加
type PartialUnion = TypeA | TypeB; // 一部の型のみ
// 後で完全なユニオン型に拡張

// unknown型を使用してより安全に
const data: unknown = complexValue;
if (isKnownType(data)) {
  // 型ガードを使用して安全にアクセス
}
```

### コンパイル時間が長すぎる場合
```typescript
// 型チェックを一時的に無効化
// @ts-nocheck

// または特定の行のみ無効化
// @ts-ignore
const result = complexTypeOperation();

// skipLibCheckを有効化（tsconfig.json）
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

---

## 📚 デバッグのコツ

### 1. 型情報の確認
```typescript
// 型を確認するヘルパー
type TypeOf<T> = T;

// 使用例
type UnionType = TypeOf<string | number>; // ユニオン型を確認

// コンパイラに型を表示させる
const value: string | number = getValue();
// value. と入力してIDEで型情報を確認
```

### 2. 段階的な型ガード
```typescript
// 複雑な型ガードを段階的に構築
function isValidUser(obj: unknown): obj is User {
  console.log('Step 1: Basic check', typeof obj);
  if (!obj || typeof obj !== 'object') return false;
  
  console.log('Step 2: Property check', 'name' in obj);
  if (!('name' in obj)) return false;
  
  console.log('Step 3: Type check', typeof (obj as any).name);
  if (typeof (obj as any).name !== 'string') return false;
  
  return true;
}
```

### 3. 型の互換性テスト
```typescript
// 型の互換性をテスト
type IsAssignable<T, U> = T extends U ? true : false;

type Test1 = IsAssignable<string, string | number>; // true
type Test2 = IsAssignable<string | number, string>; // false
```

---

## 📚 参考リンク

- [TypeScript Handbook - Union Types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)
- [TypeScript Handbook - Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)
- [TypeScript Performance](https://github.com/microsoft/TypeScript/wiki/Performance)

---

**📌 重要**: ユニオン型と型ガードは強力な機能ですが、適切に使用しないとパフォーマンスや保守性の問題を引き起こす可能性があります。段階的に学習し、実際のプロジェクトで経験を積むことが重要です。