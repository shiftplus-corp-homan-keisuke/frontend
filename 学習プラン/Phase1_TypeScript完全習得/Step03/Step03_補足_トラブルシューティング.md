# Step03 トラブルシューティング

> 💡 **このファイルについて**: インターフェース、クラス設計、抽象クラスでよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [インターフェース関連のエラー](#インターフェース関連のエラー)
2. [クラス設計関連のエラー](#クラス設計関連のエラー)
3. [抽象クラス関連のエラー](#抽象クラス関連のエラー)
4. [アクセス修飾子関連のエラー](#アクセス修飾子関連のエラー)
5. [Storeシステム実装時のエラー](#storeシステム実装時のエラー)

---

## インターフェース関連のエラー

### "Property 'xxx' is missing in type"
**原因**: インターフェースで定義された必須プロパティが不足している

**エラー例**:
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Error: Property 'category' is missing in type
const product: Product = {
  id: "prod_001",
  name: "TypeScript入門書",
  price: 2980
  // category が不足
};
```

**解決方法**:
```typescript
// 解決方法1: 不足しているプロパティを追加
const product: Product = {
  id: "prod_001",
  name: "TypeScript入門書",
  price: 2980,
  category: "書籍" // 追加
};

// 解決方法2: オプショナルプロパティにする
interface Product {
  id: string;
  name: string;
  price: number;
  category?: string; // オプショナルにする
}

// 解決方法3: Partialユーティリティ型を使用
const partialProduct: Partial<Product> = {
  id: "prod_001",
  name: "TypeScript入門書"
  // price, categoryは省略可能
};
```

### "Index signature is missing in type"
**原因**: インデックスシグネチャが定義されていない型に動的プロパティアクセスを試行

**エラー例**:
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
}

function getProductProperty(product: Product, key: string): any {
  return product[key]; // Error: Element implicitly has an 'any' type
}
```

**解決方法**:
```typescript
// 解決方法1: インデックスシグネチャを追加
interface Product {
  id: string;
  name: string;
  price: number;
  [key: string]: any; // インデックスシグネチャ
}

// 解決方法2: keyof演算子を使用
function getProductProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 解決方法3: Record型を使用
interface Product extends Record<string, any> {
  id: string;
  name: string;
  price: number;
}

// 解決方法4: 型アサーションを使用（注意して使用）
function getProductProperty(product: Product, key: string): any {
  return (product as any)[key];
}
```

### "Cannot redeclare block-scoped variable"
**原因**: 同じスコープ内で同名のインターフェースまたは変数が重複宣言されている

**エラー例**:
```typescript
interface Product {
  name: string;
}

interface Product { // Error: Duplicate identifier 'Product'
  price: number;
}
```

**解決方法**:
```typescript
// 解決方法1: インターフェースマージを活用（意図的な場合）
interface Product {
  name: string;
}

interface Product {
  price: number; // 自動的にマージされる
}

// 解決方法2: 異なる名前を使用
interface Product {
  name: string;
}

interface ExtendedProduct {
  price: number;
}

// 解決方法3: 継承を使用
interface Product {
  name: string;
}

interface ProductWithPrice extends Product {
  price: number;
}
```

---

## クラス設計関連のエラー

### "Class 'xxx' incorrectly implements interface 'yyy'"
**原因**: クラスがインターフェースを正しく実装していない

**エラー例**:
```typescript
interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
}

// Error: Class 'InMemoryProductRepository' incorrectly implements interface 'ProductRepository'
class InMemoryProductRepository implements ProductRepository {
  save(product: Product): void { // 戻り値の型が違う
    console.log("Saving product");
  }
  // findById メソッドが不足
}
```

**解決方法**:
```typescript
// 解決方法1: 不足しているメンバーを追加し、型を修正
class InMemoryProductRepository implements ProductRepository {
  private products = new Map<string, Product>();

  async save(product: Product): Promise<void> { // 正しい戻り値の型
    this.products.set(product.id, product);
  }

  async findById(id: string): Promise<Product | null> { // 不足していたメソッドを追加
    return this.products.get(id) || null;
  }
}

// 解決方法2: インターフェースを修正（必要に応じて）
interface ProductRepository {
  save(product: Product): void; // 同期処理に変更
  findById(id: string): Product | null; // 同期処理に変更
}
```

### "Property 'xxx' has no initializer and is not definitely assigned"
**原因**: strictPropertyInitialization が有効で、プロパティが初期化されていない

**エラー例**:
```typescript
class Product {
  id: string; // Error: Property 'id' has no initializer
  name: string; // Error: Property 'name' has no initializer
  price: number; // Error: Property 'price' has no initializer
  
  constructor() {
    // プロパティが初期化されていない
  }
}
```

**解決方法**:
```typescript
// 解決方法1: コンストラクタで初期化
class Product {
  id: string;
  name: string;
  price: number;
  
  constructor(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// 解決方法2: プロパティ初期化子を使用
class Product {
  id: string = "";
  name: string = "";
  price: number = 0;
}

// 解決方法3: 確定代入アサーション（!）を使用
class Product {
  id!: string; // 後で確実に代入されることを保証
  name!: string;
  price!: number;
  
  initialize(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// 解決方法4: コンストラクタパラメータプロパティを使用
class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number
  ) {}
}
```

### "Type 'xxx' is missing the following properties from type 'yyy'"
**原因**: 継承時に親の型の要件を満たしていない

**エラー例**:
```typescript
interface BaseProduct {
  id: string;
  name: string;
  price: number;
  getInfo(): string;
}

interface DigitalProduct extends BaseProduct {
  downloadUrl: string;
  fileSize: number;
}

// Error: Type is missing properties 'price', 'getInfo'
const digitalProduct: DigitalProduct = {
  id: "dig_001",
  name: "TypeScript完全ガイド",
  downloadUrl: "https://example.com/download",
  fileSize: 1024
};
```

**解決方法**:
```typescript
// 解決方法1: 不足しているプロパティを追加
const digitalProduct: DigitalProduct = {
  id: "dig_001",
  name: "TypeScript完全ガイド",
  price: 2980, // 追加
  downloadUrl: "https://example.com/download",
  fileSize: 1024,
  getInfo() { // 追加
    return `${this.name} - ¥${this.price}`;
  }
};

// 解決方法2: 基底インターフェースを修正
interface BaseProduct {
  id: string;
  name: string;
  price?: number; // オプショナルにする
  getInfo?(): string; // オプショナルにする
}

// 解決方法3: Partialを使用
const partialDigitalProduct: Partial<DigitalProduct> = {
  id: "dig_001",
  name: "TypeScript完全ガイド",
  downloadUrl: "https://example.com/download"
};
```

---

## 抽象クラス関連のエラー

### "Cannot create an instance of an abstract class"
**原因**: 抽象クラスを直接インスタンス化しようとしている

**エラー例**:
```typescript
abstract class BaseProduct {
  constructor(public name: string, public price: number) {}
  
  abstract getProductType(): string;
  
  getInfo(): string {
    return `${this.getProductType()}: ${this.name} - ¥${this.price}`;
  }
}

// Error: Cannot create an instance of an abstract class
const product = new BaseProduct("商品", 1000);
```

**解決方法**:
```typescript
// 解決方法1: 具象クラスを作成してインスタンス化
class PhysicalProduct extends BaseProduct {
  constructor(name: string, price: number, public weight: number) {
    super(name, price);
  }
  
  getProductType(): string {
    return "物理商品";
  }
}

const product = new PhysicalProduct("TypeScript本", 2980, 0.5);

// 解決方法2: 抽象クラスではなく通常のクラスにする（必要に応じて）
class BaseProduct {
  constructor(public name: string, public price: number) {}
  
  getProductType(): string {
    return "基本商品"; // デフォルト実装を提供
  }
  
  getInfo(): string {
    return `${this.getProductType()}: ${this.name} - ¥${this.price}`;
  }
}
```

### "Non-abstract class 'xxx' does not implement inherited abstract member 'yyy'"
**原因**: 抽象クラスを継承したクラスで抽象メソッドが実装されていない

**エラー例**:
```typescript
abstract class BaseProduct {
  constructor(public name: string, public price: number) {}
  
  abstract calculateShippingCost(): number;
  abstract getProductType(): string;
}

// Error: Non-abstract class 'PhysicalProduct' does not implement inherited abstract member 'calculateShippingCost'
class PhysicalProduct extends BaseProduct {
  constructor(name: string, price: number, public weight: number) {
    super(name, price);
  }
  
  getProductType(): string {
    return "物理商品";
  }
  // calculateShippingCost メソッドが実装されていない
}
```

**解決方法**:
```typescript
// 解決方法1: 不足している抽象メソッドを実装
class PhysicalProduct extends BaseProduct {
  constructor(name: string, price: number, public weight: number) {
    super(name, price);
  }
  
  getProductType(): string {
    return "物理商品";
  }
  
  calculateShippingCost(): number { // 実装を追加
    return this.weight * 100;
  }
}

// 解決方法2: クラスも抽象クラスにする
abstract class PhysicalProduct extends BaseProduct {
  constructor(name: string, price: number, public weight: number) {
    super(name, price);
  }
  
  getProductType(): string {
    return "物理商品";
  }
  
  // calculateShippingCost は継承クラスで実装
}
```

### "Abstract method 'xxx' cannot have an implementation"
**原因**: 抽象メソッドに実装を提供しようとしている

**エラー例**:
```typescript
abstract class BaseProduct {
  constructor(public name: string, public price: number) {}
  
  // Error: Abstract method 'calculateShippingCost' cannot have an implementation
  abstract calculateShippingCost(): number {
    return 500; // 抽象メソッドに実装を提供
  }
}
```

**解決方法**:
```typescript
// 解決方法1: 抽象メソッドから実装を削除
abstract class BaseProduct {
  constructor(public name: string, public price: number) {}
  
  abstract calculateShippingCost(): number; // 実装を削除
}

// 解決方法2: 通常のメソッドにしてデフォルト実装を提供
abstract class BaseProduct {
  constructor(public name: string, public price: number) {}
  
  calculateShippingCost(): number { // abstractを削除
    return 500; // デフォルト実装
  }
  
  // 必要に応じて他の抽象メソッドを定義
  abstract getProductType(): string;
}

// 解決方法3: protectedメソッドとして共通実装を提供
abstract class BaseProduct {
  constructor(public name: string, public price: number) {}
  
  protected getBaseShippingCost(): number {
    return 500; // 共通実装
  }
  
  abstract calculateShippingCost(): number; // 抽象メソッド
}

class PhysicalProduct extends BaseProduct {
  calculateShippingCost(): number {
    return this.getBaseShippingCost() + 200; // 共通実装を利用
  }
}
```

---

## アクセス修飾子関連のエラー

### "Property 'xxx' is private and only accessible within class 'yyy'"
**原因**: privateプロパティにクラス外部からアクセスしようとしている

**エラー例**:
```typescript
class Product {
  private _id: string;
  
  constructor(id: string, public name: string) {
    this._id = id;
  }
}

const product = new Product("prod_001", "TypeScript本");
console.log(product._id); // Error: Property '_id' is private
```

**解決方法**:
```typescript
// 解決方法1: getterメソッドを提供
class Product {
  private _id: string;
  
  constructor(id: string, public name: string) {
    this._id = id;
  }
  
  get id(): string { // getter追加
    return this._id;
  }
}

const product = new Product("prod_001", "TypeScript本");
console.log(product.id); // OK

// 解決方法2: アクセス修飾子を変更
class Product {
  public readonly id: string; // publicかつ読み取り専用
  
  constructor(id: string, public name: string) {
    this.id = id;
  }
}

// 解決方法3: protectedにして継承クラスからアクセス可能にする
class Product {
  protected _id: string; // protectedに変更
  
  constructor(id: string, public name: string) {
    this._id = id;
  }
}

class ExtendedProduct extends Product {
  getProductId(): string {
    return this._id; // 継承クラスからアクセス可能
  }
}
```

### "Property 'xxx' is protected and only accessible within class 'yyy' and its subclasses"
**原因**: protectedプロパティにクラス外部からアクセスしようとしている

**エラー例**:
```typescript
class BaseProduct {
  protected price: number;
  
  constructor(price: number) {
    this.price = price;
  }
}

const product = new BaseProduct(1000);
console.log(product.price); // Error: Property 'price' is protected
```

**解決方法**:
```typescript
// 解決方法1: publicメソッドを提供
class BaseProduct {
  protected price: number;
  
  constructor(price: number) {
    this.price = price;
  }
  
  getPrice(): number { // publicメソッド追加
    return this.price;
  }
}

const product = new BaseProduct(1000);
console.log(product.getPrice()); // OK

// 解決方法2: アクセス修飾子を変更
class BaseProduct {
  public readonly price: number; // publicに変更
  
  constructor(price: number) {
    this.price = price;
  }
}

// 解決方法3: 継承クラス内でアクセス
class PhysicalProduct extends BaseProduct {
  constructor(price: number, public weight: number) {
    super(price);
  }
  
  getProductInfo(): string {
    return `価格: ¥${this.price}, 重量: ${this.weight}kg`; // 継承クラス内ではアクセス可能
  }
}
```

---

## Storeシステム実装時のエラー

### "Argument of type 'xxx' is not assignable to parameter of type 'yyy'"
**原因**: Storeシステムでの型の不一致

**エラー例**:
```typescript
enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped"
}

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
}

function updateOrderStatus(order: Order, status: string): void {
  order.status = status; // Error: Type 'string' is not assignable to type 'OrderStatus'
}
```

**解決方法**:
```typescript
// 解決方法1: 正しい型を使用
function updateOrderStatus(order: Order, status: OrderStatus): void {
  order.status = status; // OK
}

// 使用例
updateOrderStatus(order, OrderStatus.CONFIRMED);

// 解決方法2: 型ガードを使用
function updateOrderStatus(order: Order, status: string): void {
  if (Object.values(OrderStatus).includes(status as OrderStatus)) {
    order.status = status as OrderStatus;
  } else {
    throw new Error(`無効なステータス: ${status}`);
  }
}

// 解決方法3: ユニオン型を使用
type OrderStatusType = "pending" | "confirmed" | "shipped";

interface Order {
  id: string;
  status: OrderStatusType;
  totalAmount: number;
}

function updateOrderStatus(order: Order, status: OrderStatusType): void {
  order.status = status; // OK
}
```

### "Object is possibly 'null' or 'undefined'"
**原因**: null/undefinedチェックが不十分

**エラー例**:
```typescript
interface ProductRepository {
  findById(id: string): Promise<Product | null>;
}

async function getProductPrice(repository: ProductRepository, id: string): Promise<number> {
  const product = await repository.findById(id);
  return product.price; // Error: Object is possibly 'null'
}
```

**解決方法**:
```typescript
// 解決方法1: null チェックを追加
async function getProductPrice(repository: ProductRepository, id: string): Promise<number> {
  const product = await repository.findById(id);
  if (!product) {
    throw new Error(`商品が見つかりません: ${id}`);
  }
  return product.price; // OK
}

// 解決方法2: Optional Chaining と Nullish Coalescing を使用
async function getProductPrice(repository: ProductRepository, id: string): Promise<number> {
  const product = await repository.findById(id);
  return product?.price ?? 0; // 商品が見つからない場合は0を返す
}

// 解決方法3: 型アサーションを使用（注意して使用）
async function getProductPrice(repository: ProductRepository, id: string): Promise<number> {
  const product = await repository.findById(id);
  return (product as Product).price; // 商品が存在することを保証
}

// 解決方法4: 戻り値の型を変更
async function getProductPrice(repository: ProductRepository, id: string): Promise<number | null> {
  const product = await repository.findById(id);
  return product?.price ?? null;
}
```

### "This condition will always return 'false'"
**原因**: 型の範囲チェックが不適切

**エラー例**:
```typescript
enum MembershipLevel {
  REGULAR = "regular",
  PREMIUM = "premium",
  VIP = "vip"
}

function validateMembershipLevel(level: MembershipLevel): boolean {
  // Error: This condition will always return 'false'
  return level === "gold"; // "gold" は MembershipLevel に存在しない
}
```

**解決方法**:
```typescript
// 解決方法1: 正しい値を使用
function validateMembershipLevel(level: MembershipLevel): boolean {
  return level === MembershipLevel.VIP; // OK
}

// 解決方法2: 複数の値をチェック
function isPremiumOrVip(level: MembershipLevel): boolean {
  return level === MembershipLevel.PREMIUM || level === MembershipLevel.VIP;
}

// 解決方法3: switch文を使用
function getMembershipDiscount(level: MembershipLevel): number {
  switch (level) {
    case MembershipLevel.REGULAR:
      return 0;
    case MembershipLevel.PREMIUM:
      return 0.05;
    case MembershipLevel.VIP:
      return 0.1;
    default:
      // 網羅性チェック
      const _exhaustive: never = level;
      throw new Error(`未対応の会員レベル: ${_exhaustive}`);
  }
}

// 解決方法4: 型ガードを使用
function isValidMembershipLevel(value: string): value is MembershipLevel {
  return Object.values(MembershipLevel).includes(value as MembershipLevel);
}
```

---

## 🛠️ デバッグのコツ

### 1. 型情報の確認
```typescript
// 型情報を確認するためのヘルパー
type TypeOf<T> = T;

// 使用例
const product = { id: "1", name: "商品", price: 1000 };
type ProductType = TypeOf<typeof product>; // { id: string; name: string; price: number; }
```

### 2. 段階的な型チェック
```typescript
// 複雑な型を段階的に構築
type BaseEntity = {
  id: string;
  createdAt: Date;
};

type Product = BaseEntity & {
  name: string;
  price: number;
};

type DigitalProduct = Product & {
  downloadUrl: string;
  fileSize: number;
};
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

### TypeScript公式ドキュメント
- [Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Classes](https://www.typescriptlang.org/docs/handbook/classes.html)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)

### エラー解決リソース
- [TypeScript Error Translator](https://ts-error-translator.vercel.app/)
- [Stack Overflow - TypeScript](https://stackoverflow.com/questions/tagged/typescript)

---

**🌟 重要**: エラーが発生した際は、まず型の定義と使用方法を確認し、段階的にデバッグを行いましょう。Storeシステムの実装では、特にnull/undefinedチェックとビジネスルールの検証が重要です！