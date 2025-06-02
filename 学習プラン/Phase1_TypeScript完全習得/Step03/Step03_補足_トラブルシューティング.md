# Step03 トラブルシューティング

> 💡 **このファイルについて**: インターフェースとオブジェクト型でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [インターフェース関連のエラー](#インターフェース関連のエラー)
2. [型エイリアス関連のエラー](#型エイリアス関連のエラー)
3. [継承・実装関連のエラー](#継承実装関連のエラー)
4. [構造的型付け関連のエラー](#構造的型付け関連のエラー)
5. [デザインパターン実装時のエラー](#デザインパターン実装時のエラー)

---

## インターフェース関連のエラー

### "Property 'xxx' is missing in type"
**原因**: インターフェースで定義された必須プロパティが不足している

**エラー例**:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Error: Property 'email' is missing in type
const user: User = {
  id: 1,
  name: "Alice"
  // email が不足
};
```

**解決方法**:
```typescript
// 解決方法1: 不足しているプロパティを追加
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com" // 追加
};

// 解決方法2: オプショナルプロパティにする
interface User {
  id: number;
  name: string;
  email?: string; // オプショナルにする
}

// 解決方法3: Partialユーティリティ型を使用
const partialUser: {
  id?: number;
  name?: string;
  email?: string;
  age?: number;
} = {
  id: 1,
  name: "Alice"
  // emailは省略可能
};
```

### "Index signature is missing in type"
**原因**: インデックスシグネチャが定義されていない型に動的プロパティアクセスを試行

**エラー例**:
```typescript
interface User {
  id: number;
  name: string;
}

function getValue(user: User, key: string): any {
  return user[key]; // Error: Element implicitly has an 'any' type
}
```

**解決方法**:
```typescript
// 解決方法1: インデックスシグネチャを追加
interface User {
  id: number;
  name: string;
  [key: string]: any; // インデックスシグネチャ
}

// 解決方法2: keyof演算子を使用
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 解決方法3: Record型を使用
interface User extends Record<string, any> {
  id: number;
  name: string;
}

// 解決方法4: 型アサーションを使用（注意して使用）
function getValue(user: User, key: string): any {
  return (user as any)[key];
}
```

### "Cannot redeclare block-scoped variable"
**原因**: 同じスコープ内で同名のインターフェースまたは変数が重複宣言されている

**エラー例**:
```typescript
interface User {
  name: string;
}

interface User { // Error: Duplicate identifier 'User'
  age: number;
}
```

**解決方法**:
```typescript
// 解決方法1: インターフェースマージを活用（意図的な場合）
interface User {
  name: string;
}

interface User {
  age: number; // 自動的にマージされる
}

// 解決方法2: 異なる名前を使用
interface User {
  name: string;
}

interface ExtendedUser {
  age: number;
}

// 解決方法3: 継承を使用
interface User {
  name: string;
}

interface UserWithAge extends User {
  age: number;
}
```

---

## 型エイリアス関連のエラー

### "Type alias 'xxx' circularly references itself"
**原因**: 型エイリアスが自分自身を循環参照している

**エラー例**:
```typescript
// Error: Type alias 'Node' circularly references itself
type Node = {
  value: string;
  children: Node[]; // 直接的な循環参照
};
```

**解決方法**:
```typescript
// 解決方法1: インターフェースを使用
interface Node {
  value: string;
  children: Node[]; // インターフェースは循環参照可能
}

// 解決方法2: 間接的な参照を使用
type NodeChildren = Node[];
type Node = {
  value: string;
  children: NodeChildren;
};

// 解決方法3: 再帰的な型定義を明示的に行う
type UserTreeNode = {
  value: User;
  children?: UserTreeNode[];
};
```

### "A union type cannot be used here"
**原因**: ユニオン型が使用できない場所でユニオン型を使用している

**エラー例**:
```typescript
// Error: A computed property name must be of type 'string', 'number', 'symbol', or 'any'
type Keys = "name" | "age";
type User = {
  [K in Keys]: string; // 正しい構文ではない
};
```

**解決方法**:
```typescript
// 解決方法1: Mapped Typesを正しく使用
type Keys = "name" | "age";
type User = {
  [K in Keys]: string;
};

// 解決方法2: Record型を使用
type User = Record<Keys, string>;

// 解決方法3: 個別に定義
type User = {
  name: string;
  age: string;
};
```

### "Type 'xxx' is not assignable to type 'yyy'"
**原因**: ユニオン型の型ガードが不適切

**エラー例**:
```typescript
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
  // Error: Property 'radius' does not exist on type 'Shape'
  return Math.PI * shape.radius * shape.radius;
}
```

**解決方法**:
```typescript
// 解決方法1: 型ガードを使用
function getArea(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.width * shape.height;
  }
}

// 解決方法2: switch文を使用
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius * shape.radius;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // 網羅性チェック
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}

// 解決方法3: in演算子を使用
function getArea(shape: Shape): number {
  if ("radius" in shape) {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.width * shape.height;
  }
}
```

---

## 継承・実装関連のエラー

### "Class 'xxx' incorrectly implements interface 'yyy'"
**原因**: クラスがインターフェースを正しく実装していない

**エラー例**:
```typescript
interface Flyable {
  fly(): void;
  altitude: number;
}

// Error: Class 'Bird' incorrectly implements interface 'Flyable'
class Bird implements Flyable {
  fly() {
    console.log("Flying");
  }
  // altitude プロパティが不足
}
```

**解決方法**:
```typescript
// 解決方法1: 不足しているメンバーを追加
class Bird implements Flyable {
  altitude: number = 0;
  
  fly(): void {
    console.log("Flying");
    this.altitude = 100;
  }
}

// 解決方法2: コンストラクタで初期化
class Bird implements Flyable {
  constructor(public altitude: number = 0) {}
  
  fly(): void {
    console.log("Flying");
  }
}

// 解決方法3: インターフェースを修正（オプショナルにする）
interface Flyable {
  fly(): void;
  altitude?: number; // オプショナルにする
}
```

### "Property 'xxx' has no initializer and is not definitely assigned"
**原因**: strictPropertyInitialization が有効で、プロパティが初期化されていない

**エラー例**:
```typescript
class User {
  id: number; // Error: Property 'id' has no initializer
  name: string; // Error: Property 'name' has no initializer
  
  constructor() {
    // プロパティが初期化されていない
  }
}
```

**解決方法**:
```typescript
// 解決方法1: コンストラクタで初期化
class User {
  id: number;
  name: string;
  
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

// 解決方法2: プロパティ初期化子を使用
class User {
  id: number = 0;
  name: string = "";
}

// 解決方法3: 確定代入アサーション（!）を使用
class User {
  id!: number; // 後で確実に代入されることを保証
  name!: string;
  
  initialize(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

// 解決方法4: コンストラクタパラメータプロパティを使用
class User {
  constructor(
    public id: number,
    public name: string
  ) {}
}
```

### "Type 'xxx' is missing the following properties from type 'yyy'"
**原因**: 継承時に親の型の要件を満たしていない

**エラー例**:
```typescript
interface Animal {
  name: string;
  age: number;
  makeSound(): void;
}

interface Dog extends Animal {
  breed: string;
}

// Error: Type is missing properties 'age', 'makeSound'
const dog: Dog = {
  name: "Buddy",
  breed: "Golden Retriever"
};
```

**解決方法**:
```typescript
// 解決方法1: 不足しているプロパティを追加
const dog: Dog = {
  name: "Buddy",
  breed: "Golden Retriever",
  age: 3,
  makeSound() {
    console.log("Woof!");
  }
};

// 解決方法2: 基底インターフェースを修正
interface Animal {
  name: string;
  age?: number; // オプショナルにする
  makeSound?(): void; // オプショナルにする
}

// 解決方法3: Partialを使用
const partialDog: {
  name?: string;
  breed?: string;
  age?: number;
} = {
  name: "Buddy",
  breed: "Golden Retriever"
};
```

---

## 構造的型付け関連のエラー

### "Argument of type 'xxx' is not assignable to parameter of type 'yyy'"
**原因**: 構造的型付けの理解不足による型の不一致

**エラー例**:
```typescript
interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

function distance2D(p1: Point2D, p2: Point2D): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

const point3D: Point3D = { x: 1, y: 2, z: 3 };
const point2D: Point2D = { x: 4, y: 5 };

// これは実際にはOK（構造的型付け）
distance2D(point3D, point2D); // Point3DはPoint2Dの構造を含む
```

**理解すべきポイント**:
```typescript
// TypeScriptは構造的型付け
// より多くのプロパティを持つ型は、より少ないプロパティの型に代入可能

interface Minimal {
  name: string;
}

interface Extended {
  name: string;
  age: number;
  email: string;
}

function processMinimal(obj: Minimal): void {
  console.log(obj.name);
}

const extended: Extended = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

processMinimal(extended); // OK: ExtendedはMinimalの構造を含む

// 逆は不可
function processExtended(obj: Extended): void {
  console.log(obj.name, obj.age, obj.email);
}

const minimal: Minimal = { name: "Bob" };
// processExtended(minimal); // Error: age, emailが不足
```

### "Object literal may only specify known properties"
**原因**: 余剰プロパティチェックによるエラー

**エラー例**:
```typescript
interface User {
  name: string;
  age: number;
}

// Error: Object literal may only specify known properties
const user: User = {
  name: "Alice",
  age: 30,
  email: "alice@example.com" // 余剰プロパティ
};
```

**解決方法**:
```typescript
// 解決方法1: インターフェースにプロパティを追加
interface User {
  name: string;
  age: number;
  email?: string; // 追加
}

// 解決方法2: インデックスシグネチャを追加
interface User {
  name: string;
  age: number;
  [key: string]: any; // 任意のプロパティを許可
}

// 解決方法3: 型アサーションを使用
const user: User = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
} as User;

// 解決方法4: 変数を経由する
const userData = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};
const user: User = userData; // 余剰プロパティチェックが回避される
```

---

## デザインパターン実装時のエラー

### "This condition will always return 'false'"
**原因**: 型ガードの条件が不適切

**エラー例**:
```typescript
interface Cat {
  type: "cat";
  meow(): void;
}

interface Dog {
  type: "dog";
  bark(): void;
}

type Animal = Cat | Dog;

function makeSound(animal: Animal): void {
  if (animal.type === "cat") {
    animal.meow();
  } else if (animal.type === "dog") {
    animal.bark();
  } else if (animal.type === "bird") { // Error: This condition will always return 'false'
    // 'bird'はAnimal型に含まれていない
  }
}
```

**解決方法**:
```typescript
// 解決方法1: 型定義を修正
interface Bird {
  type: "bird";
  chirp(): void;
}

type Animal = Cat | Dog | Bird;

// 解決方法2: never型を使用した網羅性チェック
function makeSound(animal: Animal): void {
  switch (animal.type) {
    case "cat":
      animal.meow();
      break;
    case "dog":
      animal.bark();
      break;
    default:
      // 網羅性チェック
      const _exhaustive: never = animal;
      throw new Error(`Unhandled animal type: ${_exhaustive}`);
  }
}
```

### "Cannot invoke an object which is possibly 'undefined'"
**原因**: オプショナルメソッドの呼び出し時の null/undefined チェック不足

**エラー例**:
```typescript
interface EventHandler {
  onClick?(): void;
  onHover?(): void;
}

function triggerClick(handler: EventHandler): void {
  handler.onClick(); // Error: Cannot invoke an object which is possibly 'undefined'
}
```

**解決方法**:
```typescript
// 解決方法1: オプショナルチェーンを使用
function triggerClick(handler: EventHandler): void {
  handler.onClick?.();
}

// 解決方法2: 条件分岐を使用
function triggerClick(handler: EventHandler): void {
  if (handler.onClick) {
    handler.onClick();
  }
}

// 解決方法3: デフォルト実装を提供
function triggerClick(handler: EventHandler): void {
  const onClick = handler.onClick || (() => {});
  onClick();
}

// 解決方法4: 必須メソッドと分離
interface RequiredEventHandler {
  onClick(): void;
}

interface OptionalEventHandler {
  onHover?(): void;
}

type EventHandler = RequiredEventHandler & OptionalEventHandler;
```

---

## 🚨 緊急時の対処法

### 型エラーが大量に発生した場合
```typescript
// 一時的にany型を使用（本番では推奨されない）
const data: any = complexApiResponse;

// 段階的に型を追加
interface PartialResponse {
  status: string;
  // 他のプロパティは後で追加
}

// unknown型を使用してより安全に
const data: unknown = complexApiResponse;
if (typeof data === 'object' && data !== null) {
  // 型ガードを使用して安全にアクセス
}
```

### コンパイルエラーを一時的に無視
```typescript
// @ts-ignore を使用（最後の手段）
// @ts-ignore
const result = problematicCode();

// @ts-expect-error を使用（エラーが期待される場合）
// @ts-expect-error
const result = definitelyWrongCode();
```

---

## 📚 デバッグのコツ

### 1. 型情報の確認
```typescript
// 型を確認するヘルパー
// 型を確認するヘルパー（具体的な型で定義）
type UserType = User; // Userの型を確認

// コンパイラに型を表示させる
const user: User = {} as any;
// user. と入力してIDEで型情報を確認
```

### 2. 段階的な型チェック
```typescript
// 複雑な型を段階的に構築
type Step1 = { name: string };
type Step2 = Step1 & { age: number };
type Step3 = Step2 & { email: string };
type FinalType = Step3;
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

- [TypeScript Error Reference](https://www.typescriptlang.org/docs/handbook/error-reference.html)
- [TypeScript FAQ](https://github.com/Microsoft/TypeScript/wiki/FAQ)
- [TypeScript Deep Dive - Common Errors](https://basarat.gitbook.io/typescript/type-system)

---

**📌 重要**: エラーが発生した時は慌てずに、エラーメッセージをよく読んで原因を特定しましょう。TypeScriptの型システムは複雑ですが、理解すれば非常に強力なツールになります。