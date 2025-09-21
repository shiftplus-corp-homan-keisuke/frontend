# STEP03 総復習：インターフェースによる構造の定義とクラス設計

## 📋 概要

STEP03「インターフェースによる構造の定義とクラス設計」の理論学習内容を総復習するためのコンパクトなドキュメントです。

## 🎯 学習目標

- [ ] インターフェースによる構造の定義の習得
- [ ] オプショナルプロパティと読み取り専用プロパティの理解
- [ ] インターフェースの継承とマージの実践
- [ ] クラス設計とアクセス修飾子の活用
- [ ] 抽象クラスと高度な設計パターンの習得
- [ ] オブジェクト型の柔軟性の理解
- [ ] 実践での活用場面の把握

---

## 1. インターフェースによる構造の定義

### 1.1 基本的なインターフェースの定義

**概念**
インターフェースは、TypeScriptにおける「契約」の概念。オブジェクトの形状を定義し、型安全性を確保。

```typescript
// 基本的なインターフェース定義
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // オプショナル
  readonly createdAt: Date; // 読み取り専用
}

// 使用例
const user: User = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@example.com",
  createdAt: new Date()
};
```

### 1.2 インデックスシグネチャとメソッド定義

```typescript
// インデックスシグネチャ
interface Dictionary {
  [key: string]: string;
}

// メソッド定義
interface Calculator {
  add(a: number, b: number): number;
  multiply: (a: number, b: number) => number; // 関数プロパティ記法
}

const calc: Calculator = {
  add(a, b) { return a + b; },
  multiply: (a, b) => a * b
};
```

**活用場面**: データモデル定義、API契約、設定オブジェクト

---

## 2. インターフェースの高度な機能

### 2.1 インターフェースの継承（extends）

```typescript
// 基本インターフェース
interface Person {
  id: number;
  name: string;
  email: string;
}

// 継承
interface Employee extends Person {
  employeeId: string;
  department: string;
  salary: number;
}

// 複数継承
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface BlogPost extends Person, Timestamped {
  title: string;
  content: string;
}
```

### 2.2 インターフェースのマージ（Declaration Merging）

```typescript
// 同じ名前のインターフェースは自動的にマージされる
interface User {
  id: number;
  name: string;
}

interface User {
  email: string;
  age: number;
}

// 結果: User は id, name, email, age を持つ
```

**活用場面**: ライブラリの拡張、段階的な型定義

---

## 3. クラス設計と実装

### 3.1 クラスの基本構文とアクセス修飾子

```typescript
class BankAccount {
  // public: どこからでもアクセス可能（デフォルト）
  public readonly accountNumber: string;
  
  // private: クラス内部からのみアクセス可能
  private balance: number;
  private pin: string;
  
  // protected: クラス内部と継承先からアクセス可能
  protected accountType: string;

  constructor(accountNumber: string, initialBalance: number, pin: string) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.pin = pin;
    this.accountType = "savings";
  }

  public deposit(amount: number): boolean {
    if (amount > 0) {
      this.balance += amount;
      return true;
    }
    return false;
  }

  public getBalance(inputPin: string): number | null {
    return this.validatePin(inputPin) ? this.balance : null;
  }

  private validatePin(inputPin: string): boolean {
    return this.pin === inputPin;
  }
}
```

### 3.2 インターフェースの実装（implements）

```typescript
interface Drawable {
  draw(): void;
  getArea(): number;
}

interface Movable {
  x: number;
  y: number;
  move(newX: number, newY: number): void;
}

// 複数のインターフェースを実装
class Circle implements Drawable, Movable {
  constructor(
    public x: number,
    public y: number,
    private radius: number
  ) {}

  draw(): void {
    console.log(`円を (${this.x}, ${this.y}) に描画: 半径${this.radius}`);
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  move(newX: number, newY: number): void {
    this.x = newX;
    this.y = newY;
  }
}
```

**活用場面**: オブジェクト指向設計、ポリモーフィズム、契約の強制

---

## 4. 抽象クラス（abstract class）

### 4.1 抽象クラスの概念と実装

**概念**
抽象クラスは、インターフェースとクラスの中間的存在。共通実装の提供と強制的な実装を組み合わせ。

```typescript
// 抽象クラス
abstract class Shape {
  protected x: number;
  protected y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // 共通メソッド（具体的な実装）
  move(newX: number, newY: number): void {
    this.x = newX;
    this.y = newY;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  // 抽象メソッド（継承先で必ず実装）
  abstract getArea(): number;
  abstract draw(): void;
}

// 抽象クラスを継承
class ConcreteCircle extends Shape {
  constructor(x: number, y: number, private radius: number) {
    super(x, y);
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  draw(): void {
    console.log(`円を (${this.x}, ${this.y}) に描画`);
  }
}
```

### 4.2 使い分けの指針

- **インターフェース**: 純粋な契約定義（can-do関係）
- **抽象クラス**: 共通実装を含む基底クラス（is-a関係）
- **具象クラス**: 完全な実装を持つクラス

**活用場面**: フレームワーク設計、テンプレートメソッドパターン、共通機能の提供

---

## 5. オブジェクト型の柔軟性

### 5.1 型エイリアス（type）とインターフェースの使い分け

```typescript
// インターフェース: オブジェクトの形状定義に適している
interface UserInterface {
  id: number;
  name: string;
  email: string;
}

// 型エイリアス: より柔軟な型定義に適している
type Status = "pending" | "approved" | "rejected";
type ID = string | number;
type EventHandler = (event: Event) => void;

// 複雑な型の組み合わせ
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### 5.2 交差型（Intersection Types）

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

// 交差型による組み合わせ
type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "田中太郎",
  age: 30,
  employeeId: "EMP001",
  department: "開発部"
};
```

### 5.3 動的なプロパティの許可

```typescript
// インデックスシグネチャによる動的プロパティ
interface FlexibleConfig {
  name: string;
  version: string;
  [key: string]: string | number | boolean;
}

const config: FlexibleConfig = {
  name: "MyApp",
  version: "1.0.0",
  debug: true,
  port: 3000
};
```

**活用場面**: 設定オブジェクト、多言語対応、動的データ構造

---

## 6. 実践での活用場面

### 6.1 データモデルの定義

```typescript
// 基本エンティティ
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends BaseEntity {
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  roles: string[];
  isActive: boolean;
}

// データモデルクラス
class UserModel implements User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public profile: User['profile'],
    public roles: string[] = ["user"],
    public isActive: boolean = true,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  updateProfile(updates: Partial<User['profile']>): void {
    this.profile = { ...this.profile, ...updates };
    this.updatedAt = new Date();
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
```

### 6.2 API 契約の定義

```typescript
// 共通レスポンス型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// リクエスト・レスポンス型
interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// APIクライアント
class ApiClient {
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<UserResponse>> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
}
```

### 6.3 コンポーネント設計での活用

```typescript
// React コンポーネントの型定義
interface UserCardProps {
  user: UserResponse;
  showActions?: boolean;
  onEdit?: (user: UserResponse) => void;
  onDelete?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  showActions = true,
  onEdit,
  onDelete
}) => {
  return (
    <div className="user-card">
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      {showActions && (
        <div>
          <button onClick={() => onEdit?.(user)}>編集</button>
          <button onClick={() => onDelete?.(user.id)}>削除</button>
        </div>
      )}
    </div>
  );
};
```

**活用場面**: データモデル定義、API契約、コンポーネント設計、設定管理

---

## 📚 重要な概念の整理

### インターフェースの活用パターン
1. **基本的な構造定義**: オブジェクトの形状を明確に定義
2. **継承**: コードの再利用性と保守性の向上
3. **マージ**: ライブラリの拡張や段階的な型定義

### クラス設計の原則
1. **カプセル化**: アクセス修飾子による適切な情報隠蔽
2. **継承**: 共通機能の再利用と専門化
3. **ポリモーフィズム**: 統一されたインターフェースでの多様な実装

### 抽象クラスの使い分け
- **インターフェース**: 純粋な契約定義（can-do関係）
- **抽象クラス**: 共通実装を含む基底クラス（is-a関係）
- **具象クラス**: 完全な実装を持つクラス

### オブジェクト型の柔軟性
1. **型エイリアス vs インターフェース**: 用途に応じた適切な選択
2. **交差型**: 複数の型の組み合わせによる柔軟な型定義
3. **動的プロパティ**: インデックスシグネチャによる拡張性

### 実践での重要ポイント
1. **型安全性**: コンパイル時エラー検出による品質向上
2. **保守性**: 明確な型定義による理解しやすいコード
3. **拡張性**: 適切な抽象化による将来の変更への対応
4. **再利用性**: インターフェースと継承による効率的な開発

---

## 🔗 関連リソース

- [TypeScript公式ドキュメント - インターフェース](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [TypeScript公式ドキュメント - クラス](https://www.typescriptlang.org/docs/handbook/classes.html)
- [TypeScript公式ドキュメント - 高度な型](https://www.typescriptlang.org/docs/handbook/advanced-types.html)

---

**🎯 次のステップ**: STEP04では型ガードによる安全な型の絞り込みと、より高度な型システムの活用について学習します。STEP03で習得したインターフェースとクラス設計の知識を基盤として、さらに実践的なTypeScript開発スキルを身につけていきましょう！