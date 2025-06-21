# Session3: 抽象クラスと高度な設計パターン（60 分）

> 💡 **対象**: 他言語経験者（Session1-2 完了者）  
> 🎯 **形式**: 講師サポート付き学習  
> ⏰ **時間**: 60 分（集中学習）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./Step03_補足_専門用語集.md)** - 抽象クラス・継承・ポリモーフィズムの詳細解説
- 💻 **[実践コード例](./Step03_補足_実践コード例.md)** - 高度な設計パターンの実装例
- 🚨 **[トラブルシューティング](./Step03_補足_トラブルシューティング.md)** - 継承・抽象クラス関連のエラー解決ガイド
- 🌐 **[参考リソース](./Step03_補足_参考リソース.md)** - 設計パターン・SOLID原則の学習リソース
- 📋 **[補足資料](./Step03_補足資料.md)** - その他の重要な補足情報

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してね 🐰

## 📅 セッション概要

**学習目標**:

- [ ] 抽象クラス（abstract class）の概念と実装方法の理解
- [ ] インターフェース vs クラス vs 抽象クラスの使い分け習得
- [ ] 継承とポリモーフィズムの実践的な活用
- [ ] 高度な設計パターンの基礎理解

**前提知識**:

- Session1: インターフェース基本概念
- Session2: クラス設計と実装、アクセス修飾子、implements
- オブジェクト指向プログラミングの基本概念

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                           | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | ------------------------------ | -------------------------- | -------------- | ------------ |
| **0-5 分**   | 前回復習・今回目標             | 復習確認・目標提示         | 振り返り・質問 | 理解確認     |
| **5-35 分**  | 抽象クラスと継承の理論・実践   | 実演・個別指導             | ハンズオン     | 抽象クラス   |
| **35-55 分** | 高度な設計パターン実践演習     | コードレビュー・デザイン指導 | 設計・実装     | 設計パターン |
| **55-60 分** | 振り返り・総括                 | まとめ・フィードバック     | 質問・確認     | 学習成果     |

---

## 📚 学習内容

### Section 1: 前回復習（要点確認）

#### 🔍 Session2 の重要ポイント確認

```typescript
// Session2で学習したクラスとインターフェース
interface Drawable {
  draw(): void;
}

class Circle implements Drawable {
  private radius: number;
  
  constructor(radius: number) {
    this.radius = radius;
  }
  
  draw(): void {
    console.log(`円を描画: 半径${this.radius}`);
  }
}

// 今日はこれを抽象クラスと継承で発展させます
```

---

### Section 2: 抽象クラスの概念と実装

> 📚 **関連資料**: [専門用語集 - 抽象クラス基礎](./Step03_補足_専門用語集.md#抽象クラス基礎) | [実践コード例 - 抽象クラス設計](./Step03_補足_実践コード例.md#抽象クラス設計)

#### 🎯 抽象クラスとは何か

**💡 なぜ抽象クラスが重要なのか**

抽象クラスは、インターフェースとクラスの中間的な存在で、以下の価値を提供します：

- **共通実装の提供**:
  複数のクラスで共通する実装を抽象クラスに定義し、重複を避けながら一貫性を保てます。
- **強制的な実装**:
  抽象メソッドにより、継承先のクラスで必ず実装すべきメソッドを強制できます。
- **設計の明確化**:
  「何を共通化し、何を個別実装するか」を明確に表現でき、設計意図が伝わりやすくなります。
- **拡張性の確保**:
  新しい要件に対して、抽象クラスを継承した新しいクラスを追加することで対応できます。

#### 1. 基本的な抽象クラス

```typescript
// 抽象クラスの定義
abstract class Shape {
  // 共通プロパティ
  protected x: number;
  protected y: number;
  protected color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  // 共通メソッド（具体的な実装）
  move(newX: number, newY: number): void {
    this.x = newX;
    this.y = newY;
    console.log(`図形を (${this.x}, ${this.y}) に移動しました`);
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  // 抽象メソッド（継承先で必ず実装）
  abstract getArea(): number;
  abstract getPerimeter(): number;
  abstract draw(): void;
}

// 抽象クラスを継承した具体クラス
class Circle extends Shape {
  private radius: number;

  constructor(x: number, y: number, color: string, radius: number) {
    super(x, y, color); // 親クラスのコンストラクタを呼び出し
    this.radius = radius;
  }

  // 抽象メソッドの実装（必須）
  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  draw(): void {
    console.log(`${this.color}の円を (${this.x}, ${this.y}) に描画: 半径${this.radius}`);
  }

  // クラス独自のメソッド
  getRadius(): number {
    return this.radius;
  }
}

class Rectangle extends Shape {
  private width: number;
  private height: number;

  constructor(x: number, y: number, color: string, width: number, height: number) {
    super(x, y, color);
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  draw(): void {
    console.log(`${this.color}の長方形を (${this.x}, ${this.y}) に描画: ${this.width}×${this.height}`);
  }

  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}

// 使用例
const circle = new Circle(10, 20, "赤", 5);
const rectangle = new Rectangle(30, 40, "青", 10, 15);

circle.draw();
console.log(`円の面積: ${circle.getArea()}`);
circle.move(50, 60);

rectangle.draw();
console.log(`長方形の周囲: ${rectangle.getPerimeter()}`);
```

#### 2. インターフェース vs クラス vs 抽象クラスの使い分け

```typescript
// インターフェース: 契約の定義（実装なし）
interface Flyable {
  fly(): void;
  getAltitude(): number;
}

// 抽象クラス: 共通実装 + 強制実装
abstract class Animal {
  protected name: string;
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // 共通実装
  getName(): string {
    return this.name;
  }

  getAge(): number {
    return this.age;
  }

  // 抽象メソッド
  abstract makeSound(): void;
  abstract move(): void;
}

// 具体クラス: 抽象クラス継承 + インターフェース実装
class Bird extends Animal implements Flyable {
  private altitude: number = 0;

  constructor(name: string, age: number) {
    super(name, age);
  }

  // Animal の抽象メソッド実装
  makeSound(): void {
    console.log(`${this.name}が鳴いています: チュンチュン`);
  }

  move(): void {
    console.log(`${this.name}が歩いています`);
  }

  // Flyable インターフェース実装
  fly(): void {
    this.altitude = 100;
    console.log(`${this.name}が飛んでいます`);
  }

  getAltitude(): number {
    return this.altitude;
  }
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age);
  }

  makeSound(): void {
    console.log(`${this.name}が鳴いています: ワンワン`);
  }

  move(): void {
    console.log(`${this.name}が走っています`);
  }

  // Dog独自のメソッド
  fetch(): void {
    console.log(`${this.name}がボールを取ってきました`);
  }
}
```

#### 3. ポリモーフィズムの活用

```typescript
// ポリモーフィズム: 同じインターフェースで異なる実装を扱う
function processAnimals(animals: Animal[]): void {
  animals.forEach(animal => {
    console.log(`動物: ${animal.getName()}, 年齢: ${animal.getAge()}`);
    animal.makeSound(); // 各クラスの実装が呼ばれる
    animal.move();      // 各クラスの実装が呼ばれる
    console.log('---');
  });
}

function processShapes(shapes: Shape[]): void {
  let totalArea = 0;
  
  shapes.forEach(shape => {
    shape.draw();
    const area = shape.getArea();
    totalArea += area;
    console.log(`面積: ${area}`);
  });
  
  console.log(`総面積: ${totalArea}`);
}

// 使用例
const animals: Animal[] = [
  new Bird("スズメ", 2),
  new Dog("ポチ", 5)
];

const shapes: Shape[] = [
  new Circle(0, 0, "赤", 3),
  new Rectangle(10, 10, "青", 4, 6)
];

processAnimals(animals);
processShapes(shapes);
```

---

## 🎯 練習問題

> 💻 **実践サポート**: [実践コード例 - 練習問題の解法例](./Step03_補足_実践コード例.md#練習問題の解法例) | [トラブルシューティング - よくあるエラー](./Step03_補足_トラブルシューティング.md#よくあるエラー)

### 練習問題 1: 抽象クラス設計 🔰

**要件**:
車両管理システムの抽象クラスを設計してください。

```typescript
// TODO: 以下の要件を満たす抽象クラスVehicleを定義してください
// 共通プロパティ:
// - brand: 文字列（protected）
// - model: 文字列（protected）
// - year: 数値（protected）
// - fuelLevel: 数値（private、初期値100）

// 共通メソッド:
// - getBrand(): ブランド名を返す
// - getModel(): モデル名を返す
// - getYear(): 年式を返す
// - refuel(): 燃料を満タンにする
// - getFuelLevel(): 燃料レベルを返す

// 抽象メソッド:
// - start(): エンジン始動
// - stop(): エンジン停止
// - getMaxSpeed(): 最高速度を返す

// ここにVehicle抽象クラスを定義

// TODO: Vehicleを継承したCarクラスとMotorcycleクラスを実装してください
// Car: 4輪、最高速度180km/h
// Motorcycle: 2輪、最高速度250km/h

// 使用例
const car = new Car("Toyota", "Camry", 2023);
const motorcycle = new Motorcycle("Honda", "CBR", 2024);

car.start();
console.log(`最高速度: ${car.getMaxSpeed()}km/h`);
car.stop();

motorcycle.start();
console.log(`最高速度: ${motorcycle.getMaxSpeed()}km/h`);
motorcycle.stop();
```

### 練習問題 2: 高度な設計パターン 🔰

**要件**:
ファイル処理システムを設計してください。

```typescript
// インターフェース定義
interface Readable {
  read(): string;
}

interface Writable {
  write(content: string): boolean;
}

interface Compressible {
  compress(): boolean;
  decompress(): boolean;
}

// TODO: 以下の要件を満たす抽象クラスFileHandlerを定義してください
// 共通プロパティ:
// - fileName: 文字列（protected）
// - fileSize: 数値（protected）
// - lastModified: Date（protected）

// 共通メソッド:
// - getFileName(): ファイル名を返す
// - getFileSize(): ファイルサイズを返す
// - getLastModified(): 最終更新日を返す
// - updateLastModified(): 最終更新日を現在時刻に更新

// 抽象メソッド:
// - open(): ファイルを開く
// - close(): ファイルを閉じる
// - getFileType(): ファイルタイプを返す

// TODO: FileHandlerを継承し、適切なインターフェースを実装したクラスを作成
// - TextFile: Readable, Writable を実装
// - ImageFile: Readable を実装
// - ArchiveFile: Readable, Writable, Compressible を実装

// 使用例
const textFile = new TextFile("document.txt", 1024);
const imageFile = new ImageFile("photo.jpg", 2048);
const archiveFile = new ArchiveFile("backup.zip", 4096);

// ポリモーフィズムのテスト
const files: FileHandler[] = [textFile, imageFile, archiveFile];
files.forEach(file => {
  file.open();
  console.log(`${file.getFileName()} (${file.getFileType()}): ${file.getFileSize()}bytes`);
  file.close();
});
```

---

## 📝 解答例

### 練習問題 1 解答

```typescript
abstract class Vehicle {
  protected brand: string;
  protected model: string;
  protected year: number;
  private fuelLevel: number = 100;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getBrand(): string {
    return this.brand;
  }

  getModel(): string {
    return this.model;
  }

  getYear(): number {
    return this.year;
  }

  refuel(): void {
    this.fuelLevel = 100;
    console.log("燃料を満タンにしました");
  }

  getFuelLevel(): number {
    return this.fuelLevel;
  }

  abstract start(): void;
  abstract stop(): void;
  abstract getMaxSpeed(): number;
}

class Car extends Vehicle {
  constructor(brand: string, model: string, year: number) {
    super(brand, model, year);
  }

  start(): void {
    console.log(`${this.brand} ${this.model}のエンジンを始動しました（4輪車）`);
  }

  stop(): void {
    console.log(`${this.brand} ${this.model}のエンジンを停止しました`);
  }

  getMaxSpeed(): number {
    return 180;
  }
}

class Motorcycle extends Vehicle {
  constructor(brand: string, model: string, year: number) {
    super(brand, model, year);
  }

  start(): void {
    console.log(`${this.brand} ${this.model}のエンジンを始動しました（2輪車）`);
  }

  stop(): void {
    console.log(`${this.brand} ${this.model}のエンジンを停止しました`);
  }

  getMaxSpeed(): number {
    return 250;
  }
}
```

### 練習問題 2 解答

```typescript
abstract class FileHandler {
  protected fileName: string;
  protected fileSize: number;
  protected lastModified: Date;

  constructor(fileName: string, fileSize: number) {
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.lastModified = new Date();
  }

  getFileName(): string {
    return this.fileName;
  }

  getFileSize(): number {
    return this.fileSize;
  }

  getLastModified(): Date {
    return this.lastModified;
  }

  updateLastModified(): void {
    this.lastModified = new Date();
  }

  abstract open(): void;
  abstract close(): void;
  abstract getFileType(): string;
}

class TextFile extends FileHandler implements Readable, Writable {
  private content: string = "";

  constructor(fileName: string, fileSize: number) {
    super(fileName, fileSize);
  }

  open(): void {
    console.log(`テキストファイル ${this.fileName} を開きました`);
  }

  close(): void {
    console.log(`テキストファイル ${this.fileName} を閉じました`);
  }

  getFileType(): string {
    return "Text";
  }

  read(): string {
    return this.content;
  }

  write(content: string): boolean {
    this.content = content;
    this.updateLastModified();
    console.log(`テキストファイルに書き込みました: ${content.substring(0, 20)}...`);
    return true;
  }
}

class ImageFile extends FileHandler implements Readable {
  constructor(fileName: string, fileSize: number) {
    super(fileName, fileSize);
  }

  open(): void {
    console.log(`画像ファイル ${this.fileName} を開きました`);
  }

  close(): void {
    console.log(`画像ファイル ${this.fileName} を閉じました`);
  }

  getFileType(): string {
    return "Image";
  }

  read(): string {
    return `画像データ: ${this.fileName}`;
  }
}

class ArchiveFile extends FileHandler implements Readable, Writable, Compressible {
  private isCompressed: boolean = false;

  constructor(fileName: string, fileSize: number) {
    super(fileName, fileSize);
  }

  open(): void {
    console.log(`アーカイブファイル ${this.fileName} を開きました`);
  }

  close(): void {
    console.log(`アーカイブファイル ${this.fileName} を閉じました`);
  }

  getFileType(): string {
    return "Archive";
  }

  read(): string {
    return `アーカイブデータ: ${this.fileName}`;
  }

  write(content: string): boolean {
    console.log(`アーカイブファイルに追加しました: ${content}`);
    this.updateLastModified();
    return true;
  }

  compress(): boolean {
    if (!this.isCompressed) {
      this.isCompressed = true;
      console.log(`${this.fileName} を圧縮しました`);
      return true;
    }
    return false;
  }

  decompress(): boolean {
    if (this.isCompressed) {
      this.isCompressed = false;
      console.log(`${this.fileName} を展開しました`);
      return true;
    }
    return false;
  }
}
```

---

### 振り返り

**確認ポイント**:

- [ ] 抽象クラスの概念と実装方法を理解できた
- [ ] インターフェース、クラス、抽象クラスの使い分けを習得した
- [ ] 継承とポリモーフィズムを実践的に活用できた
- [ ] 高度な設計パターンの基礎を理解した

### 質疑応答

**よくある質問**:

- Q: 「抽象クラスとインターフェースはどう使い分けるべきですか？」
- A: 「共通実装がある場合は抽象クラス、純粋な契約定義のみの場合はインターフェースを使用します。抽象クラスは『is-a』関係、インターフェースは『can-do』関係を表現します」

- Q: 「継承の階層が深くなりすぎませんか？」
- A: 「適切な設計では3-4階層程度に留めるのが一般的です。過度な継承よりもコンポジション（組み合わせ）を検討することも重要です」

---

**❗ 重要**: Session3 で学習した抽象クラスと設計パターンは、実際のプロジェクトでの設計力向上に直結します。これらの概念をしっかりと理解して実践に活かしましょう！

**🌟 次のステップ**: これまでの学習を統合して、実践的なStoreシステムの設計と実装に挑戦します！**