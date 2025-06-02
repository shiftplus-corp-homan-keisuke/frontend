# Step03 専門用語集

> 💡 **このファイルについて**: Step03で出てくる重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [インターフェース関連用語](#インターフェース関連用語)
2. [型エイリアス関連用語](#型エイリアス関連用語)
3. [継承・コンポジション関連用語](#継承コンポジション関連用語)
4. [オブジェクト指向設計関連用語](#オブジェクト指向設計関連用語)

---

## インターフェース関連用語

### インターフェース（Interface）
**定義**: オブジェクトの構造を定義する契約

**他言語との比較**:
- **Java/C#**: クラスが実装すべきメソッドの契約
- **TypeScript**: オブジェクトの形状（shape）を定義する構造的型付け

**コード例**:
```typescript
// TypeScript: 構造的型付け
interface User {
  id: number;
  name: string;
  email: string;
}

// Java風の実装（参考）
// interface UserService {
//   User findById(int id);
//   void save(User user);
// }

// TypeScriptでは関数インターフェースも可能
interface Calculator {
  (a: number, b: number): number;
}

const add: Calculator = (a, b) => a + b;
```

**実用場面**: データモデル定義、API契約、コンポーネント設計

### 構造的型付け（Structural Typing）
**定義**: 型の互換性を構造（プロパティとメソッド）で判断する仕組み

**名前的型付けとの違い**:
```typescript
// 構造的型付け（TypeScript）
interface Point2D {
  x: number;
  y: number;
}

interface Vector2D {
  x: number;
  y: number;
}

// 構造が同じなので互換性がある
let point: Point2D = { x: 1, y: 2 };
let vector: Vector2D = point; // OK

// 名前的型付け（Java/C#風）では不可
// class Point2D { x: number; y: number; }
// class Vector2D { x: number; y: number; }
// Point2D point = new Vector2D(); // Error
```

**なぜ重要か**: TypeScriptの柔軟性の源泉、ダックタイピングの型安全版

### インターフェース継承（Interface Inheritance）
**定義**: 既存のインターフェースを拡張して新しいインターフェースを作成

**コード例**:
```typescript
// 基本インターフェース
interface Entity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// 継承による拡張
interface User extends Entity {
  name: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
  lastLogin?: Date;
}

// 多重継承も可能
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Identifiable {
  id: number;
}

interface Product extends Identifiable, Timestamped {
  name: string;
  price: number;
}
```

**実用場面**: 共通プロパティの抽象化、階層的なデータモデル設計

### インターフェースマージ（Interface Merging）
**定義**: 同名のインターフェースが自動的に結合される機能

**コード例**:
```typescript
// 最初の定義
interface User {
  name: string;
  email: string;
}

// 同名インターフェースの追加定義
interface User {
  age: number;
  profile?: {
    bio: string;
    avatar: string;
  };
}

// 自動的にマージされる
const user: User = {
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  profile: {
    bio: "Developer",
    avatar: "avatar.jpg"
  }
};
```

**実用場面**: ライブラリの型拡張、モジュール拡張

---

## 型エイリアス関連用語

### 型エイリアス（Type Alias）
**定義**: 既存の型に新しい名前を付ける機能

**インターフェースとの違い**:
```typescript
// 型エイリアス
type UserType = {
  id: number;
  name: string;
  email: string;
};

// インターフェース
interface UserInterface {
  id: number;
  name: string;
  email: string;
}

// 型エイリアスの特徴
type StringOrNumber = string | number; // ユニオン型
type UserTuple = [string, number, boolean]; // タプル型
type UserMap = Record<string, UserType>; // マップ型

// インターフェースではできない表現
// interface StringOrNumber = string | number; // Error
```

**使い分けの指針**:
- **インターフェース**: オブジェクトの形状定義、継承が必要な場合
- **型エイリアス**: ユニオン型、プリミティブ型、複雑な型の組み合わせ

### ユニオン型（Union Types）
**定義**: 複数の型のうちいずれかを表現する型

**コード例**:
```typescript
// 基本的なユニオン型
type Status = "loading" | "success" | "error";
type ID = string | number;

// オブジェクトのユニオン型
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

// 判別ユニオン（Discriminated Union）
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}
```

**実用場面**: 状態管理、API レスポンス、エラーハンドリング

### インターセクション型（Intersection Types）
**定義**: 複数の型を組み合わせて新しい型を作成

**コード例**:
```typescript
// 基本的なインターセクション型
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Identifiable = {
  id: number;
};

type Entity = Timestamped & Identifiable;

// より複雑な例
type User = {
  name: string;
  email: string;
};

type AdminPermissions = {
  permissions: string[];
  role: "admin" | "super-admin";
};

type AdminUser = User & AdminPermissions;

const admin: AdminUser = {
  name: "Admin",
  email: "admin@example.com",
  permissions: ["read", "write", "delete"],
  role: "admin"
};
```

**実用場面**: ミックスイン、機能の組み合わせ、型の合成

---

## 継承・コンポジション関連用語

### 継承（Inheritance）
**定義**: 既存のクラスやインターフェースの機能を受け継いで拡張する仕組み

**コード例**:
```typescript
// インターフェース継承
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

// クラス継承
class Vehicle {
  constructor(public brand: string) {}
  
  start(): void {
    console.log(`${this.brand} is starting`);
  }
}

class Car extends Vehicle {
  constructor(brand: string, public model: string) {
    super(brand);
  }
  
  drive(): void {
    console.log(`${this.brand} ${this.model} is driving`);
  }
}
```

**メリット・デメリット**:
- **メリット**: コードの再利用、階層的な設計
- **デメリット**: 強い結合、複雑な継承階層

### コンポジション（Composition）
**定義**: 既存のオブジェクトを組み合わせて新しい機能を作る設計手法

**コード例**:
```typescript
// 継承ではなくコンポジションを使用
interface Logger {
  log(message: string): void;
}

interface Database {
  save(data: any): Promise<void>;
  find(id: string): Promise<any>;
}

class UserService {
  constructor(
    private logger: Logger,
    private database: Database
  ) {}
  
  async createUser(userData: any): Promise<void> {
    this.logger.log("Creating user");
    await this.database.save(userData);
    this.logger.log("User created successfully");
  }
}

// 具体的な実装
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class MemoryDatabase implements Database {
  private data = new Map();
  
  async save(data: any): Promise<void> {
    this.data.set(data.id, data);
  }
  
  async find(id: string): Promise<any> {
    return this.data.get(id);
  }
}
```

**継承 vs コンポジション**:
- **継承**: "is-a" 関係（犬は動物である）
- **コンポジション**: "has-a" 関係（車はエンジンを持つ）

### ミックスイン（Mixin）
**定義**: 複数のクラスの機能を組み合わせる手法

**コード例**:
```typescript
// ミックスイン用の型定義
type Constructor<T = {}> = new (...args: any[]) => T;

// ミックスイン関数
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();
    
    touch() {
      this.updatedAt = new Date();
    }
  };
}

function Identifiable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    id = Math.random().toString(36);
  };
}

// 基本クラス
class User {
  constructor(public name: string) {}
}

// ミックスインの適用
const TimestampedUser = Timestamped(User);
const IdentifiableTimestampedUser = Identifiable(TimestampedUser);

const user = new IdentifiableTimestampedUser("Alice");
console.log(user.id); // ランダムID
console.log(user.createdAt); // 作成日時
user.touch(); // 更新日時を変更
```

**実用場面**: 横断的関心事の実装、機能の組み合わせ

---

## オブジェクト指向設計関連用語

### SOLID原則
**定義**: オブジェクト指向設計の5つの基本原則

#### S - 単一責任原則（Single Responsibility Principle）
```typescript
// 悪い例：複数の責任を持つクラス
class UserManager {
  saveUser(user: User): void { /* DB保存 */ }
  sendEmail(user: User): void { /* メール送信 */ }
  validateUser(user: User): boolean { /* バリデーション */ }
}

// 良い例：責任を分離
class UserRepository {
  save(user: User): void { /* DB保存のみ */ }
}

class EmailService {
  send(user: User): void { /* メール送信のみ */ }
}

class UserValidator {
  validate(user: User): boolean { /* バリデーションのみ */ }
}
```

#### O - 開放閉鎖原則（Open/Closed Principle）
```typescript
// 拡張に開放、修正に閉鎖
interface PaymentProcessor {
  process(amount: number): void;
}

class CreditCardProcessor implements PaymentProcessor {
  process(amount: number): void {
    console.log(`Processing ${amount} via credit card`);
  }
}

class PayPalProcessor implements PaymentProcessor {
  process(amount: number): void {
    console.log(`Processing ${amount} via PayPal`);
  }
}

// 新しい支払い方法を追加する際、既存コードを変更しない
class BitcoinProcessor implements PaymentProcessor {
  process(amount: number): void {
    console.log(`Processing ${amount} via Bitcoin`);
  }
}
```

### デザインパターン

#### ファクトリーパターン（Factory Pattern）
```typescript
interface Animal {
  makeSound(): void;
}

class Dog implements Animal {
  makeSound(): void {
    console.log("Woof!");
  }
}

class Cat implements Animal {
  makeSound(): void {
    console.log("Meow!");
  }
}

class AnimalFactory {
  static create(type: "dog" | "cat"): Animal {
    switch (type) {
      case "dog":
        return new Dog();
      case "cat":
        return new Cat();
      default:
        throw new Error("Unknown animal type");
    }
  }
}

const dog = AnimalFactory.create("dog");
dog.makeSound(); // "Woof!"
```

#### オブザーバーパターン（Observer Pattern）
```typescript
interface UserObserver {
  update(data: User): void;
}

class UserSubject {
  private observers: UserObserver[] = [];
  
  subscribe(observer: UserObserver): void {
    this.observers.push(observer);
  }
  
  unsubscribe(observer: UserObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notify(data: User): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

class UserNotifier implements UserObserver {
  update(user: User): void {
    console.log(`User ${user.name} has been updated`);
  }
}

const userSubject = new UserSubject();
const notifier = new UserNotifier();
userSubject.subscribe(notifier);
```

---

## 📚 参考リンク

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [TypeScript Handbook - Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [Design Patterns in TypeScript](https://refactoring.guru/design-patterns/typescript)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**📌 重要**: これらの概念を理解することで、より保守性が高く、拡張しやすいTypeScriptコードを書けるようになります。実際にコードを書いて理解を深めましょう。