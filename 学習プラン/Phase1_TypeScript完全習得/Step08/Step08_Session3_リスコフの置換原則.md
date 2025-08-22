````markdown
# Session3: リスコフの置換原則（LSP）マスター（45 分）

> 💡 **対象**: Session2 完了者（オープン・クローズドの原則理解済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 45 分（実習中心）

## 📅 セッション概要

**学習目標**:

- [ ] リスコフの置換原則の深い理解と実践的適用
- [ ] 正しい継承設計とポリモーフィズムの活用
- [ ] LSP 違反の識別と修正技法の習得
- [ ] TypeScript における LSP のベストプラクティス

**前提知識**:

- Session0-2 の内容（SOLID 原則全体像、SRP、OCP）
- TypeScript の継承、ポリモーフィズム、抽象クラスの理解
- オブジェクト指向設計の継承関係

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割             | 学習者の活動   | 成果物         |
| ------------ | -------------------------- | ---------------------- | -------------- | -------------- |
| **0-5 分**   | LSP 基本概念の復習と深堀り | 導入・実例説明         | 聞く・質問     | 概念理解確認   |
| **5-20 分**  | LSP 違反の識別と修正実習   | 実演・個別指導         | ハンズオン     | 正しい継承設計 |
| **20-35 分** | コントラクトベース設計実習 | コードレビュー         | 問題解決・実装 | 堅牢な継承階層 |
| **35-40 分** | 複雑な継承問題の解決       | 巡回サポート           | 個人作業       | LSP 適用実践   |
| **40-45 分** | 振り返りと次回予告         | まとめ・フィードバック | 質問・確認     | 学習成果確認   |

---

## 📚 学習内容

### Section 1: リスコフの置換原則の深い理解

> 📚 **関連資料**: [専門用語集 - LSP 詳細](./Step08_補足_専門用語集.md#LSP詳細) | [実践コード例 - LSP 継承設計](./Step08_補足_実践コード例.md#LSP継承設計)

#### 🔍 「置換可能性」とは何か？

**💡 身近な例で深く理解しよう**

電池を使う懐中電灯を考えてみましょう：

🔦 **良い例：正しく動作する電池の置換**

```
単三電池の懐中電灯に...
- パナソニックの単三電池 → ✅ 正常に点灯
- エネループの単三電池 → ✅ 正常に点灯
- ダイソーの単三電池 → ✅ 正常に点灯

どの電池を使っても懐中電灯は期待通りに動作する
```

🔦 **悪い例：期待を裏切る「電池」**

```
単三電池の懐中電灯に...
- 形は単三だが電圧が違う電池 → ❌ 暗すぎる/明るすぎる
- 形は単三だが一瞬で切れる電池 → ❌ すぐに消える
- 形は単三だが水が漏れる電池 → ❌ 懐中電灯が壊れる

電池の「形」は同じだが、懐中電灯の期待を満たさない
```

**🔍 プログラムでの「置換可能性」の定義**

バーバラ・リスコフによる元の定義（1987 年）：

> **「型 S のオブジェクト o1 に対して、型 T のオブジェクト o2 が存在し、T によって定義されたプログラム P において、o1 を o2 で置換しても P の動作が変わらない場合、S は T のサブタイプである」**

ロバート・C・マーティンの実用的解釈：

> **「基底クラスへのポインタや参照を使っている関数は、それらの派生クラスのオブジェクトについて何も知らなくても、それらを使用できなければならない」**

```typescript
// ❌ LSP違反：子クラスが親クラスの期待を裏切る
class Rectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(side: number) {
    super(side, side);
  }

  // LSP違反：親クラスの期待と異なる動作
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // 正方形なので高さも変更してしまう
  }

  setHeight(height: number): void {
    this.width = height; // 正方形なので幅も変更してしまう
    this.height = height;
  }
}

// LSP違反を発見する関数
function testRectangle(rectangle: Rectangle): boolean {
  const originalWidth = 5;
  const originalHeight = 4;

  rectangle.setWidth(originalWidth);
  rectangle.setHeight(originalHeight);

  // Rectangle クラスなら 5 * 4 = 20 が期待される
  const expectedArea = originalWidth * originalHeight;
  const actualArea = rectangle.getArea();

  console.log(`Expected: ${expectedArea}, Actual: ${actualArea}`);
  return expectedArea === actualArea;
}

// テスト実行
const rectangle = new Rectangle(0, 0);
const square = new Square(0);

console.log("Rectangle test:", testRectangle(rectangle)); // true
console.log("Square test:", testRectangle(square)); // false ❌ LSP違反
```

#### 1. LSP の核心原理

**🎓 学習のポイント**: LSP が正しく機能するための条件を理解しましょう

**📊 前提条件と事後条件**

```typescript
// 正しい継承：前提条件を強化せず、事後条件を弱化しない

// 基底クラスの契約
abstract class FileProcessor {
  /**
   * ファイルを処理する
   * 前提条件：fileSize > 0
   * 事後条件：処理済みファイルが生成される
   */
  abstract processFile(fileSize: number): ProcessedFile;
}

// ✅ LSP準拠：前提条件を弱化（より寛容）、事後条件を強化（より厳格）
class ImageProcessor extends FileProcessor {
  processFile(fileSize: number): ProcessedFile {
    // 前提条件の弱化：親クラスは fileSize > 0 だが、子クラスは fileSize >= 0 も受け入れる
    if (fileSize === 0) {
      return { name: "empty.jpg", size: 0, processed: true };
    }

    if (fileSize <= 0) {
      throw new Error("Invalid file size"); // 親クラスと同じエラー
    }

    // 事後条件の強化：親クラスの要求に加えて、画像最適化も実行
    const processed = this.optimizeImage(fileSize);
    const compressed = this.compressImage(processed);
    return compressed; // より良い結果を返す
  }

  private optimizeImage(size: number): ProcessedFile {
    return { name: "optimized.jpg", size: size * 0.8, processed: true };
  }

  private compressImage(file: ProcessedFile): ProcessedFile {
    return { ...file, size: file.size * 0.6 };
  }
}

// ❌ LSP違反：前提条件を強化（より厳格）
class RestrictiveImageProcessor extends FileProcessor {
  processFile(fileSize: number): ProcessedFile {
    // 前提条件の強化：親クラスは fileSize > 0 だが、子クラスは fileSize > 1024 を要求 ❌
    if (fileSize <= 1024) {
      throw new Error("File too small for processing"); // 親クラスより厳格
    }

    return { name: "processed.jpg", size: fileSize, processed: true };
  }
}

// ❌ LSP違反：事後条件を弱化（より寛容）
class WeakImageProcessor extends FileProcessor {
  processFile(fileSize: number): ProcessedFile {
    if (fileSize <= 0) {
      throw new Error("Invalid file size");
    }

    // 事後条件の弱化：処理済みフラグを設定しない ❌
    return { name: "weak.jpg", size: fileSize, processed: false }; // 期待に反する
  }
}
```

**🔍 不変条件の維持**

```typescript
// 不変条件：クラスの状態に関する常に真でなければならない条件

class BankAccount {
  private balance: number;
  private readonly accountNumber: string;

  constructor(initialBalance: number, accountNumber: string) {
    if (initialBalance < 0) {
      throw new Error("Initial balance cannot be negative");
    }
    this.balance = initialBalance;
    this.accountNumber = accountNumber;
  }

  // 不変条件：残高は常に0以上
  withdraw(amount: number): boolean {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    if (this.balance >= amount) {
      this.balance -= amount;
      return true; // 不変条件を維持：残高 >= 0
    }

    return false; // 不変条件を維持：残高 >= 0
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this.balance += amount; // 不変条件を維持：残高はさらに増加
  }

  getBalance(): number {
    return this.balance; // 不変条件を満たす値を返す
  }
}

// ✅ LSP準拠：不変条件を維持
class SavingsAccount extends BankAccount {
  private readonly minimumBalance: number = 100;

  withdraw(amount: number): boolean {
    // 貯蓄口座の特別な制限があるが、基本の不変条件は維持
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    if (this.getBalance() - amount >= this.minimumBalance) {
      return super.withdraw(amount); // 不変条件を維持
    }

    return false; // 不変条件を維持（残高不足で拒否）
  }
}

// ❌ LSP違反：不変条件を破る
class OverdraftAccount extends BankAccount {
  private readonly overdraftLimit: number = 1000;

  withdraw(amount: number): boolean {
    // 不変条件違反：残高がマイナスになることを許可 ❌
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    const newBalance = this.getBalance() - amount;
    if (newBalance >= -this.overdraftLimit) {
      // 直接バランスを変更（不変条件を破る） ❌
      (this as any).balance = newBalance;
      return true;
    }

    return false;
  }
}
```

#### 2. LSP 違反の典型的パターンと対策

**🎓 学習のポイント**: よくある LSP 違反パターンを理解し、適切な対策を学びましょう

**パターン 1: 機能の除去・無効化**

```typescript
// ❌ LSP違反：子クラスで機能を無効化
class Bird {
  fly(): void {
    console.log("Flying...");
  }

  eat(): void {
    console.log("Eating...");
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error("Penguins can't fly!"); // ❌ 親クラスの契約を破る
  }
}

// 問題を発見する関数
function makeBirdFly(bird: Bird): void {
  bird.fly(); // Penguin を渡すと例外が発生
}

// ✅ LSP準拠の対策：適切な抽象化
interface Animal {
  eat(): void;
}

interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class Bird implements Animal {
  eat(): void {
    console.log("Bird eating...");
  }
}

class FlyingBird extends Bird implements Flyable {
  fly(): void {
    console.log("Flying bird is flying...");
  }
}

class SwimmingBird extends Bird implements Swimmable {
  swim(): void {
    console.log("Swimming bird is swimming...");
  }
}

class Eagle extends FlyingBird {
  fly(): void {
    console.log("Eagle soaring high...");
  }
}

class Penguin extends SwimmingBird {
  swim(): void {
    console.log("Penguin swimming gracefully...");
  }
}

// 使用例：型安全で期待通りに動作
function makeFlyableFly(flyable: Flyable): void {
  flyable.fly(); // 飛べる鳥のみが渡される
}

function makeSwimmableSwim(swimmable: Swimmable): void {
  swimmable.swim(); // 泳げる鳥のみが渡される
}
```

**パターン 2: 異常なパラメータ制限**

```typescript
// ❌ LSP違反：子クラスでより厳しい制限を課す
class Shape {
  calculateArea(width: number, height: number): number {
    if (width <= 0 || height <= 0) {
      throw new Error("Dimensions must be positive");
    }
    return width * height;
  }
}

class RestrictiveRectangle extends Shape {
  calculateArea(width: number, height: number): number {
    // より厳しい制限：親クラスより制限的 ❌
    if (width <= 0 || height <= 0 || width > 100 || height > 100) {
      throw new Error("Dimensions must be positive and not exceed 100");
    }
    return super.calculateArea(width, height);
  }
}

// 問題を発見する関数
function processShape(shape: Shape): void {
  const area = shape.calculateArea(150, 50); // Rectangle では OK、RestrictiveRectangle では NG
  console.log(`Area: ${area}`);
}

// ✅ LSP準拠の対策：制限を設計に組み込む
abstract class Shape {
  abstract calculateArea(): number;
  abstract isValidDimensions(width: number, height: number): boolean;
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
    if (!this.isValidDimensions(width, height)) {
      throw new Error("Invalid dimensions for rectangle");
    }
  }

  calculateArea(): number {
    return this.width * this.height;
  }

  isValidDimensions(width: number, height: number): boolean {
    return width > 0 && height > 0; // 基本的な制限
  }
}

class SmallRectangle extends Rectangle {
  constructor(width: number, height: number) {
    super(width, height); // 親のコンストラクタで基本検証
    if (width > 100 || height > 100) {
      throw new Error("SmallRectangle dimensions cannot exceed 100");
    }
  }

  isValidDimensions(width: number, height: number): boolean {
    // より厳しい制限だが、コンストラクタで事前チェック済み
    return (
      super.isValidDimensions(width, height) && width <= 100 && height <= 100
    );
  }
}

// ファクトリーパターンで適切なインスタンスを生成
class ShapeFactory {
  static createRectangle(width: number, height: number): Rectangle {
    if (width <= 100 && height <= 100) {
      return new SmallRectangle(width, height);
    }
    return new Rectangle(width, height);
  }
}
```

**パターン 3: 型の強化**

```typescript
// ❌ LSP違反：戻り値の型を制限する
class DataProcessor {
  process(data: string): any {
    return { processed: data, timestamp: new Date() };
  }
}

class StringProcessor extends DataProcessor {
  process(data: string): string {
    // ❌ 戻り値の型を制限
    return data.toUpperCase();
  }
}

// 問題を発見する関数
function handleProcessedData(processor: DataProcessor): void {
  const result = processor.process("test");
  console.log(result.timestamp); // StringProcessor では undefined
}

// ✅ LSP準拠の対策：共変性を利用した適切な設計
interface ProcessingResult {
  processed: string;
  timestamp: Date;
}

interface StringProcessingResult extends ProcessingResult {
  upperCase: string;
  originalLength: number;
}

class DataProcessor {
  process(data: string): ProcessingResult {
    return {
      processed: data,
      timestamp: new Date(),
    };
  }
}

class StringProcessor extends DataProcessor {
  process(data: string): StringProcessingResult {
    // ✅ 戻り値の型を拡張（共変）
    const processed = data.toUpperCase();
    return {
      processed,
      timestamp: new Date(),
      upperCase: processed,
      originalLength: data.length,
    };
  }
}

// 使用例：親クラスの期待を満たしつつ、追加情報も提供
function handleProcessedData(processor: DataProcessor): void {
  const result = processor.process("test");
  console.log(result.timestamp); // 常に利用可能
  console.log(result.processed); // 常に利用可能

  // 型ガードで追加機能を安全に使用
  if ("upperCase" in result) {
    console.log("Upper case:", result.upperCase);
  }
}
```

### Section 2: コントラクトベース設計

#### 🔍 Design by Contract の実践

**🎓 学習のポイント**: 契約によるプログラミングで LSP を確実に実現する方法を学びましょう

```typescript
// Design by Contract を TypeScript で実現

type ContractCondition<T> = (value: T) => boolean;
type ContractMessage = string | (() => string);

class Contract {
  static require<T>(
    condition: ContractCondition<T>,
    value: T,
    message: ContractMessage = "Precondition failed"
  ): void {
    if (!condition(value)) {
      const errorMessage = typeof message === "function" ? message() : message;
      throw new Error(`Precondition: ${errorMessage}`);
    }
  }

  static ensure<T>(
    condition: ContractCondition<T>,
    value: T,
    message: ContractMessage = "Postcondition failed"
  ): void {
    if (!condition(value)) {
      const errorMessage = typeof message === "function" ? message() : message;
      throw new Error(`Postcondition: ${errorMessage}`);
    }
  }

  static invariant<T>(
    condition: ContractCondition<T>,
    value: T,
    message: ContractMessage = "Invariant failed"
  ): void {
    if (!condition(value)) {
      const errorMessage = typeof message === "function" ? message() : message;
      throw new Error(`Invariant: ${errorMessage}`);
    }
  }
}

// 契約を使った基底クラス
abstract class Stack<T> {
  protected items: T[] = [];

  abstract push(item: T): void;
  abstract pop(): T | undefined;

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // 不変条件：スタックのサイズは常に0以上
  protected checkInvariant(): void {
    Contract.invariant(
      (stack) => stack.length >= 0,
      this.items,
      () => `Stack size must be non-negative, got ${this.items.length}`
    );
  }
}

// ✅ LSP準拠の実装：契約を強化
class SafeStack<T> extends Stack<T> {
  push(item: T): void {
    // 前提条件：アイテムは null/undefined でない
    Contract.require(
      (item) => item !== null && item !== undefined,
      item,
      "Item cannot be null or undefined"
    );

    const oldSize = this.size();

    this.items.push(item);

    // 事後条件：サイズが1増加している
    Contract.ensure(
      (newSize) => newSize === oldSize + 1,
      this.size(),
      () =>
        `Size should increase by 1, expected ${oldSize + 1}, got ${this.size()}`
    );

    this.checkInvariant();
  }

  pop(): T | undefined {
    // 前提条件：スタックが空でない場合のみ有効な値を返す
    const wasEmpty = this.isEmpty();
    const oldSize = this.size();

    const result = this.items.pop();

    // 事後条件：空でなかった場合、有効な値が返される
    if (!wasEmpty) {
      Contract.ensure(
        (result) => result !== undefined,
        result,
        "Non-empty stack should return valid item"
      );
    }

    // 事後条件：サイズが適切に減少
    const expectedNewSize = wasEmpty ? 0 : oldSize - 1;
    Contract.ensure(
      (newSize) => newSize === expectedNewSize,
      this.size(),
      () => `Size should be ${expectedNewSize}, got ${this.size()}`
    );

    this.checkInvariant();
    return result;
  }
}

// ✅ LSP準拠の拡張実装：契約を強化（より強い保証）
class BoundedStack<T> extends SafeStack<T> {
  constructor(private maxSize: number) {
    super();
    Contract.require((size) => size > 0, maxSize, "Max size must be positive");
  }

  push(item: T): void {
    // より強い前提条件：サイズ制限もチェック
    Contract.require(
      (stack) => stack.size() < this.maxSize,
      this,
      () => `Stack is full, cannot add more items (max: ${this.maxSize})`
    );

    // 親の契約を満たしつつ、追加の保証を提供
    super.push(item);

    // 追加の事後条件：サイズが最大値を超えない
    Contract.ensure(
      (size) => size <= this.maxSize,
      this.size(),
      () => `Stack size ${this.size()} exceeds maximum ${this.maxSize}`
    );
  }

  // 追加機能：容量に関する情報
  isFull(): boolean {
    return this.size() >= this.maxSize;
  }

  getRemainingCapacity(): number {
    return this.maxSize - this.size();
  }
}

// ❌ LSP違反の例：契約を弱化
class WeakStack<T> extends Stack<T> {
  push(item: T): void {
    // 前提条件を弱化：null も受け入れる（が、親の期待に反する） ❌
    this.items.push(item);

    // 事後条件が曖昧：必ずしもサイズが増加するとは限らない ❌
    // （この例では実際にはサイズが増加するが、契約で保証しない）

    // 不変条件チェックを省略 ❌
  }

  pop(): T | undefined {
    // 空のスタックから pop してもエラーを投げない（親の期待に反する） ❌
    return this.items.pop(); // undefined かもしれないが警告しない
  }
}
```

### Section 3: 高度な LSP 実践パターン

#### 🔍 ポリモーフィックな設計での LSP

**🎓 学習のポイント**: 複雑な継承階層で LSP を維持する実践的な方法を学びましょう

```typescript
// 実例：ゲームキャラクターシステム

interface Moveable {
  move(x: number, y: number): void;
  getPosition(): Position;
}

interface Attackable {
  attack(target: Character): AttackResult;
  getAttackPower(): number;
}

interface Defendable {
  takeDamage(damage: number): void;
  getHealth(): number;
  isAlive(): boolean;
}

// 基底キャラクタークラス：LSPを考慮した設計
abstract class Character implements Moveable, Defendable {
  protected position: Position;
  protected health: number;
  protected maxHealth: number;

  constructor(initialPosition: Position, maxHealth: number) {
    Contract.require(
      (health) => health > 0,
      maxHealth,
      "Max health must be positive"
    );

    this.position = { ...initialPosition };
    this.maxHealth = maxHealth;
    this.health = maxHealth;
  }

  // 基本移動：すべてのキャラクターで一貫した動作
  move(x: number, y: number): void {
    const oldPosition = { ...this.position };

    this.position.x = x;
    this.position.y = y;

    // 事後条件：位置が更新された
    Contract.ensure(
      (pos) => pos.x === x && pos.y === y,
      this.position,
      "Position should be updated to new coordinates"
    );

    this.onMove(oldPosition, this.position);
  }

  // フックメソッド：子クラスで特殊な移動処理を追加可能
  protected onMove(oldPosition: Position, newPosition: Position): void {
    // デフォルトは何もしない
  }

  getPosition(): Position {
    return { ...this.position }; // 不変性を保つためコピーを返す
  }

  takeDamage(damage: number): void {
    Contract.require((dmg) => dmg >= 0, damage, "Damage cannot be negative");

    const oldHealth = this.health;
    this.health = Math.max(0, this.health - damage);

    // 事後条件：ヘルスが適切に減少
    Contract.ensure(
      (newHealth) => newHealth >= 0 && newHealth <= oldHealth,
      this.health,
      "Health should decrease and remain non-negative"
    );

    this.onHealthChanged(oldHealth, this.health);
  }

  protected onHealthChanged(oldHealth: number, newHealth: number): void {
    // デフォルトは何もしない
  }

  getHealth(): number {
    return this.health;
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  // 不変条件チェック
  protected checkInvariant(): void {
    Contract.invariant(
      (char) => char.health >= 0 && char.health <= char.maxHealth,
      this,
      () => `Health ${this.health} must be between 0 and ${this.maxHealth}`
    );
  }
}

// ✅ LSP準拠：戦士キャラクター
class Warrior extends Character implements Attackable {
  private attackPower: number;
  private armor: number;

  constructor(position: Position, attackPower: number, armor: number = 0) {
    super(position, 100); // 戦士は高いHP
    this.attackPower = attackPower;
    this.armor = armor;
  }

  attack(target: Character): AttackResult {
    Contract.require(
      (target) => target.isAlive(),
      target,
      "Cannot attack dead target"
    );

    const damage = this.calculateDamage(target);
    target.takeDamage(damage);

    return {
      success: true,
      damage: damage,
      attackerName: "Warrior",
      targetName: target.constructor.name,
    };
  }

  getAttackPower(): number {
    return this.attackPower;
  }

  // 戦士特有の能力：アーマーによるダメージ軽減
  takeDamage(damage: number): void {
    const reducedDamage = Math.max(0, damage - this.armor);
    super.takeDamage(reducedDamage); // 親の契約を満たす
  }

  private calculateDamage(target: Character): number {
    return this.attackPower; // シンプルな計算
  }
}

// ✅ LSP準拠：魔法使いキャラクター
class Mage extends Character implements Attackable {
  private mana: number;
  private maxMana: number;
  private spellPower: number;

  constructor(position: Position, spellPower: number, mana: number = 50) {
    super(position, 60); // 魔法使いは低いHP
    this.spellPower = spellPower;
    this.maxMana = mana;
    this.mana = mana;
  }

  attack(target: Character): AttackResult {
    Contract.require(
      (target) => target.isAlive(),
      target,
      "Cannot attack dead target"
    );

    // 魔法使い特有の前提条件：マナが必要
    Contract.require(
      (mana) => mana >= 10,
      this.mana,
      "Not enough mana to cast spell"
    );

    this.mana -= 10;
    const damage = this.calculateMagicDamage(target);
    target.takeDamage(damage);

    return {
      success: true,
      damage: damage,
      attackerName: "Mage",
      targetName: target.constructor.name,
    };
  }

  getAttackPower(): number {
    return this.spellPower;
  }

  // 魔法使い特有の移動：テレポート
  teleport(x: number, y: number): void {
    if (this.mana >= 20) {
      this.mana -= 20;
      this.move(x, y); // 基本の move を使用（LSP維持）
    }
  }

  private calculateMagicDamage(target: Character): number {
    return this.spellPower + Math.random() * 10; // ランダム要素
  }
}

// ✅ LSP準拠：盗賊キャラクター
class Rogue extends Character implements Attackable {
  private stealth: boolean = false;
  private criticalChance: number;

  constructor(position: Position, criticalChance: number = 0.2) {
    super(position, 80); // 中程度のHP
    this.criticalChance = criticalChance;
  }

  attack(target: Character): AttackResult {
    Contract.require(
      (target) => target.isAlive(),
      target,
      "Cannot attack dead target"
    );

    const isCritical = Math.random() < this.criticalChance;
    const baseDamage = 25;
    const damage = isCritical ? baseDamage * 2 : baseDamage;

    target.takeDamage(damage);

    // ステルス状態から攻撃した場合、ステルス解除
    if (this.stealth) {
      this.stealth = false;
    }

    return {
      success: true,
      damage: damage,
      attackerName: `Rogue${isCritical ? " (Critical!)" : ""}`,
      targetName: target.constructor.name,
    };
  }

  getAttackPower(): number {
    return this.stealth ? 50 : 25; // ステルス時は攻撃力上昇
  }

  // 盗賊特有の能力：ステルス
  enterStealth(): void {
    this.stealth = true;
  }

  // 盗賊特有の移動：音を立てない
  protected onMove(oldPosition: Position, newPosition: Position): void {
    if (this.stealth) {
      // ステルス中の移動は特別な処理
      console.log("Rogue moves silently...");
    }
  }
}

// 使用例：LSPが正しく機能することを確認
class GameEngine {
  processCharacterActions(characters: Character[]): void {
    characters.forEach((character) => {
      if (character.isAlive()) {
        // すべてのキャラクターで一貫して動作
        character.move(
          character.getPosition().x + Math.random() * 10,
          character.getPosition().y + Math.random() * 10
        );

        // Attackable インターフェースを実装しているキャラクターの攻撃
        if (this.isAttackable(character)) {
          const targets = characters.filter(
            (c) => c !== character && c.isAlive()
          );
          if (targets.length > 0) {
            const target = targets[0];
            const result = character.attack(target);
            console.log(
              `${result.attackerName} attacked ${result.targetName} for ${result.damage} damage`
            );
          }
        }
      }
    });
  }

  private isAttackable(
    character: Character
  ): character is Character & Attackable {
    return "attack" in character;
  }
}

// テスト実行
const warrior = new Warrior({ x: 0, y: 0 }, 30, 5);
const mage = new Mage({ x: 10, y: 10 }, 25, 60);
const rogue = new Rogue({ x: 5, y: 5 }, 0.3);

const gameEngine = new GameEngine();
const characters: Character[] = [warrior, mage, rogue];

// LSPにより、すべてのキャラクターが一貫して動作
gameEngine.processCharacterActions(characters);
```

---

## 🎯 実践練習問題（15 分）

**🎓 学習目標**: 学んだ LSP の概念を実際のコード例で適用する

### 練習問題 1: 図形計算システム（初級）

以下のコードの LSP 違反を特定し、修正してください：

```typescript
class Shape {
  calculateArea(): number {
    return 0;
  }

  calculatePerimeter(): number {
    return 0;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
    if (width <= 0 || height <= 0) {
      throw new Error("Dimensions must be positive");
    }
  }

  calculateArea(): number {
    return this.width * this.height;
  }

  calculatePerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
    if (radius <= 0) {
      throw new Error("Radius must be positive");
    }
  }

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

// LSP違反の例
class InvalidShape extends Shape {
  calculateArea(): number {
    throw new Error("Cannot calculate area for invalid shape");
  }

  calculatePerimeter(): number {
    throw new Error("Cannot calculate perimeter for invalid shape");
  }
}

// テスト関数
function printShapeInfo(shape: Shape): void {
  console.log(`Area: ${shape.calculateArea()}`);
  console.log(`Perimeter: ${shape.calculatePerimeter()}`);
}
```

**解答例**:

```typescript
// LSP準拠の設計：適切な抽象化
abstract class Shape {
  abstract calculateArea(): number;
  abstract calculatePerimeter(): number;

  // 共通の事前条件を定義
  protected validatePositive(value: number, name: string): void {
    if (value <= 0) {
      throw new Error(`${name} must be positive`);
    }
  }

  // 共通の事後条件チェック
  protected validateResult(result: number, operation: string): number {
    if (result < 0 || !isFinite(result)) {
      throw new Error(`${operation} returned invalid result: ${result}`);
    }
    return result;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
    this.validatePositive(width, "Width");
    this.validatePositive(height, "Height");
  }

  calculateArea(): number {
    const area = this.width * this.height;
    return this.validateResult(area, "Area calculation");
  }

  calculatePerimeter(): number {
    const perimeter = 2 * (this.width + this.height);
    return this.validateResult(perimeter, "Perimeter calculation");
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
    this.validatePositive(radius, "Radius");
  }

  calculateArea(): number {
    const area = Math.PI * this.radius * this.radius;
    return this.validateResult(area, "Area calculation");
  }

  calculatePerimeter(): number {
    const perimeter = 2 * Math.PI * this.radius;
    return this.validateResult(perimeter, "Perimeter calculation");
  }
}

// InvalidShape を削除し、代わりに適切なファクトリーパターンを使用
class ShapeFactory {
  static createRectangle(width: number, height: number): Rectangle {
    return new Rectangle(width, height);
  }

  static createCircle(radius: number): Circle {
    return new Circle(radius);
  }
}

// 使用例
function printShapeInfo(shape: Shape): void {
  try {
    console.log(`Area: ${shape.calculateArea()}`);
    console.log(`Perimeter: ${shape.calculatePerimeter()}`);
  } catch (error) {
    console.error(`Error processing shape: ${error.message}`);
  }
}
```

### 練習問題 2: ファイル処理システム（中級）

以下のコードの LSP 違反を特定し、コントラクトベース設計で修正してください：

```typescript
class FileProcessor {
  processFile(content: string): string {
    return content.trim();
  }

  validateFile(content: string): boolean {
    return content.length > 0;
  }
}

class ImageProcessor extends FileProcessor {
  processFile(content: string): string {
    // 画像ファイルのみ処理可能
    if (!content.startsWith("IMAGE:")) {
      throw new Error("Only image files are supported");
    }
    return super.processFile(content);
  }

  validateFile(content: string): boolean {
    // より厳しい検証
    return super.validateFile(content) && content.startsWith("IMAGE:");
  }
}

class TextProcessor extends FileProcessor {
  processFile(content: string): string {
    // 常に大文字に変換
    return super.processFile(content).toUpperCase();
  }
}
```

**🎓 チャレンジ**: このコードを以下の観点でリファクタリングしてください：

1. 前提条件・事後条件・不変条件を明確に定義
2. 子クラスで前提条件を強化している部分を修正
3. すべてのサブクラスが親クラスと置換可能になるように設計

---

## 👨‍🏫 学習ポイント

### 🔄 復習のための確認項目

**基本概念の理解**

- [ ] LSP の定義と「置換可能性」の意味を理解していますか？
- [ ] 前提条件・事後条件・不変条件の概念を理解していますか？
- [ ] LSP 違反がなぜ問題となるかを説明できますか？

**違反パターンの識別**

- [ ] 機能の除去・無効化パターンを識別できますか？
- [ ] 異常なパラメータ制限パターンを識別できますか？
- [ ] 型の強化パターンを識別できますか？

**設計スキル**

- [ ] コントラクトベース設計を実践できますか？
- [ ] 適切な抽象化レベルで継承階層を設計できますか？
- [ ] LSP 準拠のポリモーフィックな設計ができますか？

### 🤔 よくある質問

**Q: 子クラスで機能を追加するのは LSP 違反ですか？**
A: いいえ。新しい機能の追加は問題ありません。問題なのは、親クラスが提供していた機能を削除・制限することです。

**Q: 例外をスローするのは LSP 違反ですか？**
A: 親クラスが同じ条件で例外をスローしない場合は違反の可能性があります。事前条件を強化して例外をスローするのは LSP 違反です。

**Q: LSP を完璧に守ることは現実的ですか？**
A: 100%完璧は困難な場合もありますが、主要な使用ケースで置換可能性を保つことが重要です。設計時にトレードオフを意識的に検討しましょう。

---

**📌 重要**: Session3 では LSP の実践的理解を深めました。正しい継承設計の原則を理解することで、保守性と拡張性の高いコードが書けるようになります。

**🌟 次回（Session4）は、インターフェース分離の原則（ISP）について詳しく学習します！**

---

## 📋 Session3 完了チェックリスト（45 分版）

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 基本概念理解

- [ ] LSP の定義と重要性を説明できる
- [ ] 「置換可能性」を具体例で説明できる
- [ ] 前提条件・事後条件・不変条件を理解している

### 💻 違反識別スキル

- [ ] LSP 違反の典型パターンを識別できる
- [ ] 機能除去・制限強化・型制限パターンを理解している
- [ ] 違反の修正方法を実践できる

### 🔧 設計能力

- [ ] コントラクトベース設計を実装できる
- [ ] 適切な継承階層を設計できる
- [ ] ポリモーフィックな設計で LSP を維持できる

### 🧪 実践力

- [ ] 提供された練習問題を解答できた
- [ ] 実際のコードで LSP 準拠度を評価できる
- [ ] LSP 違反の修正戦略を説明できる

### 📚 統合理解

- [ ] LSP が他の SOLID 原則とどう関連するか理解している
- [ ] 次のステップ（Session4: ISP）への準備ができている

**🎉 すべてチェックできましたか？** それでは Session4 でお会いしましょう！

**⚠️ チェックできない項目がある場合**: 該当する学習内容を再度確認し、不明点は講師に質問しましょう。
````
