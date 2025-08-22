````markdown
# Session2: オープン・クローズドの原則（OCP）マスター（45 分）

> 💡 **対象**: Session1 完了者（単一責任の原則理解済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 45 分（実習中心）

## 📅 セッション概要

**学習目標**:

- [ ] オープン・クローズドの原則の深い理解と実践的適用
- [ ] 拡張に開いて修正に閉じた設計の実装技法習得
- [ ] TypeScript における OCP のベストプラクティス
- [ ] 戦略パターン・テンプレートメソッドパターンと OCP の組み合わせ

**前提知識**:

- Session0-1 の内容（SOLID 原則全体像、単一責任の原則）
- TypeScript のインターフェース、抽象クラス、継承の理解
- デザインパターンの基本的な知識

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                             | 講師の役割             | 学習者の活動   | 成果物                 |
| ------------ | -------------------------------- | ---------------------- | -------------- | ---------------------- |
| **0-5 分**   | OCP 基本概念の復習と深堀り       | 導入・実例説明         | 聞く・質問     | 概念理解確認           |
| **5-20 分**  | 戦略パターンと OCP 実習          | 実演・個別指導         | ハンズオン     | 拡張可能設計実装       |
| **20-35 分** | テンプレートメソッドパターン実習 | コードレビュー         | 問題解決・実装 | 柔軟なアルゴリズム設計 |
| **35-40 分** | 応用練習問題                     | 巡回サポート           | 個人作業       | OCP 適用実践           |
| **40-45 分** | 振り返りと次回予告               | まとめ・フィードバック | 質問・確認     | 学習成果確認           |

---

## 📚 学習内容

### Section 1: オープン・クローズドの原則の深い理解

> 📚 **関連資料**: [専門用語集 - OCP 詳細](./Step08_補足_専門用語集.md#OCP詳細) | [実践コード例 - OCP 設計パターン](./Step08_補足_実践コード例.md#OCP設計パターン)

#### 🔍 「拡張に開いて、修正に閉じる」とは？

**💡 身近な例で深く理解しよう**

スマートフォンのアプリストアを考えてみましょう：

📱 **悪い例：スマートフォン本体にアプリが組み込まれている**

```
新しいゲームを追加したい
→ スマートフォンの工場に持ち込み
→ 基盤を改造してゲームを組み込み
→ 既存の電話機能やカメラ機能が動かなくなるリスク ❌
→ 他のユーザーも同じ改造が必要 ❌
```

📱 **良い例：アプリストア方式**

```
新しいゲームを追加したい
→ アプリストアから新しいアプリをダウンロード ✅
→ スマートフォン本体は一切変更しない ✅
→ 既存の機能は影響を受けない ✅
→ 他のユーザーも同じアプリを簡単にインストール可能 ✅
```

**🔍 プログラムでの「オープン・クローズド」の定義**

ベルトラン・メイヤーによる元の定義（1988 年）：

> **「ソフトウェアの構成要素（クラス、モジュール、関数など）は、拡張に対しては開かれていて、修正に対しては閉じられているべきである」**

ロバート・C・マーティンの解釈（1996 年）：

> **「抽象化を使用して、既存のコードを変更することなく新しい機能を追加できるべきである」**

```typescript
// ❌ OCP違反：新機能追加のたびに既存コードを修正
class PaymentProcessor {
  processPayment(amount: number, type: string): string {
    if (type === "creditcard") {
      return this.processCreditCard(amount);
    } else if (type === "paypal") {
      return this.processPayPal(amount);
    } else if (type === "bitcoin") {
      // 新機能追加で既存コードを修正 ❌
      return this.processBitcoin(amount);
    } else if (type === "applepay") {
      // また修正が必要 ❌
      return this.processApplePay(amount);
    }
    throw new Error("Unsupported payment type");
  }

  // 問題：新しい支払い方法を追加するたびに
  // 1. processPaymentメソッドにif文を追加
  // 2. 新しい処理メソッドを追加
  // 3. 既存のテストが影響を受ける
  // 4. 他の開発者のコードと衝突する可能性
}

// ✅ OCP準拠：拡張に開いて修正に閉じている
interface PaymentMethod {
  process(amount: number): string;
}

class CreditCardPayment implements PaymentMethod {
  process(amount: number): string {
    return `Credit card payment of ${amount} processed`;
  }
}

class PayPalPayment implements PaymentMethod {
  process(amount: number): string {
    return `PayPal payment of ${amount} processed`;
  }
}

class PaymentProcessor {
  constructor(private paymentMethod: PaymentMethod) {}

  processPayment(amount: number): string {
    return this.paymentMethod.process(amount); // 既存コードは一切変更しない ✅
  }
}

// 新機能追加：既存コードに一切手を加えない
class BitcoinPayment implements PaymentMethod {
  process(amount: number): string {
    return `Bitcoin payment of ${amount} processed`;
  }
}

class ApplePayPayment implements PaymentMethod {
  process(amount: number): string {
    return `Apple Pay payment of ${amount} processed`;
  }
}

// 使用例：既存のPaymentProcessorを一切変更せずに新機能を利用
const processor1 = new PaymentProcessor(new BitcoinPayment());
const processor2 = new PaymentProcessor(new ApplePayPayment());
```

#### 1. OCP を実現する設計原理

**🎓 学習のポイント**: OCP を実現するための具体的な設計手法を理解しましょう

**📊 抽象化による拡張性**

```typescript
// 抽象化レベル1: 基本的なインターフェース分離
interface Shape {
  calculateArea(): number;
  calculatePerimeter(): number;
}

// 抽象化レベル2: より詳細な責任分離
interface AreaCalculable {
  calculateArea(): number;
}

interface PerimeterCalculable {
  calculatePerimeter(): number;
}

interface Drawable {
  draw(context: DrawingContext): void;
}

// 抽象化レベル3: 動作の抽象化
interface ShapeTransformation {
  translate(x: number, y: number): Shape;
  rotate(angle: number): Shape;
  scale(factor: number): Shape;
}

// 具体的な実装：各レベルの抽象化を実装
class Circle
  implements AreaCalculable, PerimeterCalculable, Drawable, ShapeTransformation
{
  constructor(private radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  draw(context: DrawingContext): void {
    context.drawCircle(0, 0, this.radius);
  }

  translate(x: number, y: number): Shape {
    // 新しいCircleインスタンスを返す
    return new TranslatedCircle(this.radius, x, y);
  }

  rotate(angle: number): Shape {
    // 円は回転しても変わらない
    return this;
  }

  scale(factor: number): Shape {
    return new Circle(this.radius * factor);
  }
}

// 新しい図形の追加：既存コードを一切変更しない
class Rectangle
  implements AreaCalculable, PerimeterCalculable, Drawable, ShapeTransformation
{
  constructor(private width: number, private height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }

  calculatePerimeter(): number {
    return 2 * (this.width + this.height);
  }

  draw(context: DrawingContext): void {
    context.drawRectangle(0, 0, this.width, this.height);
  }

  translate(x: number, y: number): Shape {
    return new TranslatedRectangle(this.width, this.height, x, y);
  }

  rotate(angle: number): Shape {
    // 90度の倍数でない場合は複雑な変換が必要
    return new RotatedRectangle(this.width, this.height, angle);
  }

  scale(factor: number): Shape {
    return new Rectangle(this.width * factor, this.height * factor);
  }
}
```

**🔍 拡張ポイントの設計**

```typescript
// 拡張ポイント1: データ処理のパイプライン
interface DataProcessor<T, R> {
  process(input: T): R;
}

interface DataValidator<T> {
  validate(data: T): ValidationResult;
}

interface DataTransformer<T, R> {
  transform(data: T): R;
}

// 基本処理パイプライン（変更に対してクローズド）
class ProcessingPipeline<T, R> {
  constructor(
    private validator: DataValidator<T>,
    private transformer: DataTransformer<T, R>,
    private processor: DataProcessor<R, R>
  ) {}

  execute(input: T): ProcessingResult<R> {
    // 1. バリデーション
    const validation = this.validator.validate(input);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // 2. 変換
    const transformed = this.transformer.transform(input);

    // 3. 処理
    const result = this.processor.process(transformed);

    return { success: true, data: result };
  }
}

// 拡張例1: ユーザーデータ処理（既存パイプラインを使用）
class UserDataValidator implements DataValidator<UserInput> {
  validate(data: UserInput): ValidationResult {
    if (!data.email || !data.email.includes("@")) {
      return { isValid: false, error: "Invalid email" };
    }
    return { isValid: true };
  }
}

class UserDataTransformer implements DataTransformer<UserInput, User> {
  transform(data: UserInput): User {
    return {
      id: crypto.randomUUID(),
      email: data.email.toLowerCase(),
      name: data.name.trim(),
      createdAt: new Date(),
    };
  }
}

class UserDataProcessor implements DataProcessor<User, User> {
  process(input: User): User {
    // ユーザー固有の処理（例：重複チェック、役割設定など）
    return { ...input, role: "user" };
  }
}

// 拡張例2: 商品データ処理（同じパイプラインを再利用）
class ProductDataValidator implements DataValidator<ProductInput> {
  validate(data: ProductInput): ValidationResult {
    if (!data.name || data.price <= 0) {
      return { isValid: false, error: "Invalid product data" };
    }
    return { isValid: true };
  }
}

class ProductDataTransformer implements DataTransformer<ProductInput, Product> {
  transform(data: ProductInput): Product {
    return {
      id: crypto.randomUUID(),
      name: data.name,
      price: data.price,
      category: data.category,
      createdAt: new Date(),
    };
  }
}

class ProductDataProcessor implements DataProcessor<Product, Product> {
  process(input: Product): Product {
    // 商品固有の処理（例：在庫設定、SEO最適化など）
    return { ...input, stock: 0, slug: this.generateSlug(input.name) };
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-");
  }
}

// 使用例：既存のパイプラインコードを変更せずに新機能を追加
const userPipeline = new ProcessingPipeline(
  new UserDataValidator(),
  new UserDataTransformer(),
  new UserDataProcessor()
);

const productPipeline = new ProcessingPipeline(
  new ProductDataValidator(),
  new ProductDataTransformer(),
  new ProductDataProcessor()
);
```

### Section 2: 戦略パターンによる OCP 実践

#### 🔍 戦略パターンの深い理解

**🎓 学習のポイント**: 戦略パターンを使ってアルゴリズムを交換可能にする方法を学びましょう

```typescript
// 実例：ECサイトの配送料計算システム

// ❌ OCP違反：新しい配送方法を追加するたびに既存コードを修正
class ShippingCalculator {
  calculateShipping(weight: number, distance: number, method: string): number {
    if (method === "standard") {
      return weight * 0.5 + distance * 0.1;
    } else if (method === "express") {
      return weight * 1.0 + distance * 0.2;
    } else if (method === "overnight") {
      // 新機能追加で修正 ❌
      return weight * 2.0 + distance * 0.5;
    } else if (method === "drone") {
      // さらに修正 ❌
      return weight * 3.0 + Math.min(distance, 10) * 1.0;
    }
    throw new Error("Unknown shipping method");
  }

  getDeliveryTime(method: string): string {
    if (method === "standard") {
      return "5-7 business days";
    } else if (method === "express") {
      return "2-3 business days";
    } else if (method === "overnight") {
      // ここも修正 ❌
      return "Next business day";
    } else if (method === "drone") {
      // ここも修正 ❌
      return "Same day (within 10km)";
    }
    throw new Error("Unknown shipping method");
  }
}
```

**✅ 戦略パターンによる OCP 準拠設計**

```typescript
// Step 1: 戦略インターフェースの定義
interface ShippingStrategy {
  calculateCost(weight: number, distance: number): number;
  getDeliveryTime(): string;
  getDescription(): string;
  isAvailable(weight: number, distance: number): boolean;
}

// Step 2: 各戦略の具体実装
class StandardShippingStrategy implements ShippingStrategy {
  calculateCost(weight: number, distance: number): number {
    return weight * 0.5 + distance * 0.1;
  }

  getDeliveryTime(): string {
    return "5-7 business days";
  }

  getDescription(): string {
    return "Standard shipping - economical option";
  }

  isAvailable(weight: number, distance: number): boolean {
    return weight <= 50 && distance <= 1000; // 50kg以下、1000km以下
  }
}

class ExpressShippingStrategy implements ShippingStrategy {
  calculateCost(weight: number, distance: number): number {
    return weight * 1.0 + distance * 0.2;
  }

  getDeliveryTime(): string {
    return "2-3 business days";
  }

  getDescription(): string {
    return "Express shipping - faster delivery";
  }

  isAvailable(weight: number, distance: number): boolean {
    return weight <= 30 && distance <= 2000; // 重量・距離制限
  }
}

class OvernightShippingStrategy implements ShippingStrategy {
  calculateCost(weight: number, distance: number): number {
    return weight * 2.0 + distance * 0.5;
  }

  getDeliveryTime(): string {
    return "Next business day";
  }

  getDescription(): string {
    return "Overnight shipping - next day delivery";
  }

  isAvailable(weight: number, distance: number): boolean {
    return weight <= 20 && distance <= 500; // より厳しい制限
  }
}

// Step 3: 新戦略の追加（既存コードを一切変更しない）
class DroneShippingStrategy implements ShippingStrategy {
  calculateCost(weight: number, distance: number): number {
    const baseCost = weight * 3.0;
    const distanceCost = Math.min(distance, 10) * 1.0; // 10km以内のみ
    const urgencyFee = 5.0; // ドローン利用料
    return baseCost + distanceCost + urgencyFee;
  }

  getDeliveryTime(): string {
    return "Same day delivery (within 2 hours)";
  }

  getDescription(): string {
    return "Drone delivery - ultra-fast same-day delivery";
  }

  isAvailable(weight: number, distance: number): boolean {
    return weight <= 2 && distance <= 10; // 2kg以下、10km以内のみ
  }
}

class SatelliteShippingStrategy implements ShippingStrategy {
  calculateCost(weight: number, distance: number): number {
    return weight * 10.0 + 100; // 固定料金 + 重量料金
  }

  getDeliveryTime(): string {
    return "Instant teleportation";
  }

  getDescription(): string {
    return "Satellite teleportation - science fiction delivery";
  }

  isAvailable(weight: number, distance: number): boolean {
    return weight <= 0.5; // 0.5kg以下の小物のみ
  }
}

// Step 4: コンテキストクラス（既存コードを変更しない）
class ShippingService {
  private strategies: Map<string, ShippingStrategy> = new Map();

  registerStrategy(name: string, strategy: ShippingStrategy): void {
    this.strategies.set(name, strategy);
  }

  calculateShipping(
    weight: number,
    distance: number,
    method: string
  ): ShippingResult {
    const strategy = this.strategies.get(method);
    if (!strategy) {
      return { success: false, error: `Unknown shipping method: ${method}` };
    }

    if (!strategy.isAvailable(weight, distance)) {
      return {
        success: false,
        error: `${method} shipping not available for these parameters`,
      };
    }

    const cost = strategy.calculateCost(weight, distance);
    const deliveryTime = strategy.getDeliveryTime();
    const description = strategy.getDescription();

    return {
      success: true,
      data: {
        method,
        cost,
        deliveryTime,
        description,
      },
    };
  }

  getAvailableOptions(weight: number, distance: number): ShippingOption[] {
    const options: ShippingOption[] = [];

    for (const [name, strategy] of this.strategies) {
      if (strategy.isAvailable(weight, distance)) {
        options.push({
          name,
          cost: strategy.calculateCost(weight, distance),
          deliveryTime: strategy.getDeliveryTime(),
          description: strategy.getDescription(),
        });
      }
    }

    return options.sort((a, b) => a.cost - b.cost); // 料金順でソート
  }
}

// Step 5: 利用例（新戦略を追加しても既存コードは変更不要）
const shippingService = new ShippingService();

// 基本戦略を登録
shippingService.registerStrategy("standard", new StandardShippingStrategy());
shippingService.registerStrategy("express", new ExpressShippingStrategy());
shippingService.registerStrategy("overnight", new OvernightShippingStrategy());

// 新戦略を追加（既存コードを一切変更しない）
shippingService.registerStrategy("drone", new DroneShippingStrategy());
shippingService.registerStrategy("satellite", new SatelliteShippingStrategy());

// 使用例
const weight = 1.5; // 1.5kg
const distance = 5; // 5km

console.log("Available shipping options:");
const options = shippingService.getAvailableOptions(weight, distance);
options.forEach((option) => {
  console.log(`${option.name}: $${option.cost} - ${option.deliveryTime}`);
});

// 特定の配送方法で計算
const result = shippingService.calculateShipping(weight, distance, "drone");
if (result.success) {
  console.log(
    `Drone shipping: $${result.data.cost} - ${result.data.deliveryTime}`
  );
}
```

### Section 3: テンプレートメソッドパターンによる OCP 実践

#### 🔍 テンプレートメソッドパターンの深い理解

**🎓 学習のポイント**: アルゴリズムの骨格を定義し、具体的な実装を子クラスに委ねる方法を学びましょう

```typescript
// 実例：データ分析レポート生成システム

// ❌ OCP違反：新しいレポートタイプを追加するたびに既存コードを修正
class ReportGenerator {
  generateReport(data: any[], type: string): string {
    let report = "";

    if (type === "sales") {
      // セールスレポートのヘッダー
      report += "=== SALES REPORT ===\n";
      report += `Generated: ${new Date().toISOString()}\n\n`;

      // セールスデータの処理
      let totalSales = 0;
      data.forEach((item) => (totalSales += item.amount));
      report += `Total Sales: $${totalSales}\n`;

      // セールスレポートのフッター
      report += "\n--- End of Sales Report ---\n";
    } else if (type === "inventory") {
      // インベントリレポートのヘッダー
      report += "=== INVENTORY REPORT ===\n";
      report += `Generated: ${new Date().toISOString()}\n\n`;

      // インベントリデータの処理
      let totalItems = 0;
      data.forEach((item) => (totalItems += item.quantity));
      report += `Total Items: ${totalItems}\n`;

      // インベントリレポートのフッター
      report += "\n--- End of Inventory Report ---\n";
    } else if (type === "user") {
      // 新機能追加で修正 ❌
      // ユーザーレポートのヘッダー
      report += "=== USER REPORT ===\n";
      report += `Generated: ${new Date().toISOString()}\n\n`;

      // ユーザーデータの処理
      report += `Total Users: ${data.length}\n`;

      // ユーザーレポートのフッター
      report += "\n--- End of User Report ---\n";
    }

    return report;
  }
}
```

**✅ テンプレートメソッドパターンによる OCP 準拠設計**

```typescript
// Step 1: テンプレートメソッドを定義する抽象クラス
abstract class ReportTemplate {
  // テンプレートメソッド：アルゴリズムの骨格を定義
  generateReport(data: any[]): string {
    let report = "";

    // Step 1: ヘッダー生成
    report += this.generateHeader();

    // Step 2: データ処理と本文生成
    report += this.generateBody(data);

    // Step 3: 統計情報生成（オプション）
    if (this.includeStatistics()) {
      report += this.generateStatistics(data);
    }

    // Step 4: フッター生成
    report += this.generateFooter();

    return report;
  }

  // 抽象メソッド：子クラスで必須実装
  protected abstract generateHeader(): string;
  protected abstract generateBody(data: any[]): string;
  protected abstract getReportTitle(): string;

  // フックメソッド：デフォルト実装あり、必要に応じてオーバーライド
  protected generateFooter(): string {
    return `\n--- End of ${this.getReportTitle()} ---\n`;
  }

  protected includeStatistics(): boolean {
    return true; // デフォルトは統計を含む
  }

  protected generateStatistics(data: any[]): string {
    return `\nTotal Records: ${data.length}\n`;
  }

  // 共通ユーティリティメソッド
  protected getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  protected formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }
}

// Step 2: 具体的なレポートクラスの実装
class SalesReportGenerator extends ReportTemplate {
  protected generateHeader(): string {
    return (
      `=== ${this.getReportTitle().toUpperCase()} ===\n` +
      `Generated: ${this.getCurrentTimestamp()}\n` +
      `Report Type: Sales Analysis\n\n`
    );
  }

  protected generateBody(data: SalesData[]): string {
    let body = "Sales Summary:\n";
    let totalSales = 0;
    let salesByProduct: { [key: string]: number } = {};

    data.forEach((sale) => {
      totalSales += sale.amount;
      salesByProduct[sale.product] =
        (salesByProduct[sale.product] || 0) + sale.amount;
    });

    body += `Total Sales Amount: ${this.formatCurrency(totalSales)}\n`;
    body += `Average Sale: ${this.formatCurrency(
      totalSales / data.length
    )}\n\n`;

    body += "Sales by Product:\n";
    Object.entries(salesByProduct)
      .sort(([, a], [, b]) => b - a)
      .forEach(([product, amount]) => {
        body += `  ${product}: ${this.formatCurrency(amount)}\n`;
      });

    return body;
  }

  protected getReportTitle(): string {
    return "Sales Report";
  }

  protected generateStatistics(data: SalesData[]): string {
    const baseStats = super.generateStatistics(data);
    const totalRevenue = data.reduce((sum, sale) => sum + sale.amount, 0);
    return baseStats + `Total Revenue: ${this.formatCurrency(totalRevenue)}\n`;
  }
}

class InventoryReportGenerator extends ReportTemplate {
  protected generateHeader(): string {
    return (
      `=== ${this.getReportTitle().toUpperCase()} ===\n` +
      `Generated: ${this.getCurrentTimestamp()}\n` +
      `Report Type: Inventory Status\n\n`
    );
  }

  protected generateBody(data: InventoryData[]): string {
    let body = "Inventory Summary:\n";
    let totalItems = 0;
    let lowStockItems: InventoryData[] = [];
    let outOfStockItems: InventoryData[] = [];

    data.forEach((item) => {
      totalItems += item.quantity;
      if (item.quantity === 0) {
        outOfStockItems.push(item);
      } else if (item.quantity < item.minimumStock) {
        lowStockItems.push(item);
      }
    });

    body += `Total Items in Stock: ${totalItems}\n`;
    body += `Total Product Lines: ${data.length}\n\n`;

    if (outOfStockItems.length > 0) {
      body += "⚠️  Out of Stock Items:\n";
      outOfStockItems.forEach((item) => {
        body += `  ${item.name} (SKU: ${item.sku})\n`;
      });
      body += "\n";
    }

    if (lowStockItems.length > 0) {
      body += "⚡ Low Stock Items:\n";
      lowStockItems.forEach((item) => {
        body += `  ${item.name}: ${item.quantity}/${item.minimumStock} (SKU: ${item.sku})\n`;
      });
    }

    return body;
  }

  protected getReportTitle(): string {
    return "Inventory Report";
  }
}

// Step 3: 新しいレポートタイプの追加（既存コードを変更しない）
class UserActivityReportGenerator extends ReportTemplate {
  protected generateHeader(): string {
    return (
      `=== ${this.getReportTitle().toUpperCase()} ===\n` +
      `Generated: ${this.getCurrentTimestamp()}\n` +
      `Report Type: User Activity Analysis\n\n`
    );
  }

  protected generateBody(data: UserData[]): string {
    let body = "User Activity Summary:\n";

    const activeUsers = data.filter((user) => user.lastLoginDays <= 7);
    const inactiveUsers = data.filter((user) => user.lastLoginDays > 30);

    body += `Total Users: ${data.length}\n`;
    body += `Active Users (last 7 days): ${activeUsers.length}\n`;
    body += `Inactive Users (30+ days): ${inactiveUsers.length}\n\n`;

    // 活動レベル別の分析
    const activityLevels = {
      "Very Active (daily)": data.filter((u) => u.lastLoginDays <= 1).length,
      "Active (weekly)": data.filter(
        (u) => u.lastLoginDays > 1 && u.lastLoginDays <= 7
      ).length,
      "Moderate (monthly)": data.filter(
        (u) => u.lastLoginDays > 7 && u.lastLoginDays <= 30
      ).length,
      "Inactive (30+ days)": inactiveUsers.length,
    };

    body += "Activity Breakdown:\n";
    Object.entries(activityLevels).forEach(([level, count]) => {
      const percentage = ((count / data.length) * 100).toFixed(1);
      body += `  ${level}: ${count} (${percentage}%)\n`;
    });

    return body;
  }

  protected getReportTitle(): string {
    return "User Activity Report";
  }

  // フックメソッドをオーバーライドして独自の統計を追加
  protected generateStatistics(data: UserData[]): string {
    const baseStats = super.generateStatistics(data);
    const avgLastLogin =
      data.reduce((sum, user) => sum + user.lastLoginDays, 0) / data.length;
    return (
      baseStats + `Average Days Since Last Login: ${avgLastLogin.toFixed(1)}\n`
    );
  }
}

// 高度な例：カスタマイズ可能なレポート
class CustomizableReportGenerator extends ReportTemplate {
  constructor(
    private title: string,
    private headerCustomizer?: (timestamp: string) => string,
    private footerCustomizer?: (title: string) => string,
    private includeStats: boolean = true
  ) {
    super();
  }

  protected generateHeader(): string {
    if (this.headerCustomizer) {
      return this.headerCustomizer(this.getCurrentTimestamp());
    }
    return (
      `=== ${this.title.toUpperCase()} ===\n` +
      `Generated: ${this.getCurrentTimestamp()}\n\n`
    );
  }

  protected generateBody(data: any[]): string {
    // 汎用的なデータ表示
    let body = "Data Summary:\n";
    body += `Record Count: ${data.length}\n`;

    if (data.length > 0) {
      body += "\nSample Records:\n";
      data.slice(0, 5).forEach((record, index) => {
        body += `${index + 1}. ${JSON.stringify(record)}\n`;
      });

      if (data.length > 5) {
        body += `... and ${data.length - 5} more records\n`;
      }
    }

    return body;
  }

  protected getReportTitle(): string {
    return this.title;
  }

  protected generateFooter(): string {
    if (this.footerCustomizer) {
      return this.footerCustomizer(this.title);
    }
    return super.generateFooter();
  }

  protected includeStatistics(): boolean {
    return this.includeStats;
  }
}

// Step 4: レポート管理システム（既存コードを変更しない）
class ReportManager {
  private generators: Map<string, ReportTemplate> = new Map();

  registerGenerator(name: string, generator: ReportTemplate): void {
    this.generators.set(name, generator);
  }

  generateReport(type: string, data: any[]): string {
    const generator = this.generators.get(type);
    if (!generator) {
      throw new Error(`Unknown report type: ${type}`);
    }
    return generator.generateReport(data);
  }

  getAvailableReportTypes(): string[] {
    return Array.from(this.generators.keys());
  }
}

// Step 5: 使用例
const reportManager = new ReportManager();

// 基本レポートを登録
reportManager.registerGenerator("sales", new SalesReportGenerator());
reportManager.registerGenerator("inventory", new InventoryReportGenerator());
reportManager.registerGenerator("users", new UserActivityReportGenerator());

// カスタムレポートも追加可能
reportManager.registerGenerator(
  "custom",
  new CustomizableReportGenerator(
    "Custom Analysis Report",
    (timestamp) => `🔍 CUSTOM ANALYSIS 🔍\nGenerated: ${timestamp}\n\n`,
    (title) => `\n📊 End of ${title} 📊\n`,
    false // 統計を含まない
  )
);

// 使用例
const salesData: SalesData[] = [
  { product: "Widget A", amount: 100.0, date: "2024-01-01" },
  { product: "Widget B", amount: 150.0, date: "2024-01-02" },
];

const inventoryData: InventoryData[] = [
  { name: "Widget A", sku: "WA001", quantity: 5, minimumStock: 10 },
  { name: "Widget B", sku: "WB001", quantity: 0, minimumStock: 5 },
];

console.log("=== SALES REPORT ===");
console.log(reportManager.generateReport("sales", salesData));

console.log("\n=== INVENTORY REPORT ===");
console.log(reportManager.generateReport("inventory", inventoryData));
```

---

## 🎯 実践練習問題（15 分）

**🎓 学習目標**: 学んだ OCP の概念を実際のコード例で適用する

### 練習問題 1: 通知システム（初級）

以下のコードを OCP に従ってリファクタリングしてください：

```typescript
class NotificationManager {
  sendNotification(message: string, type: string, recipient: string): void {
    if (type === "email") {
      console.log(`📧 Email sent to ${recipient}: ${message}`);
    } else if (type === "sms") {
      console.log(`📱 SMS sent to ${recipient}: ${message}`);
    } else if (type === "push") {
      console.log(`📳 Push notification sent to ${recipient}: ${message}`);
    } else if (type === "slack") {
      // 新機能追加で修正が必要 ❌
      console.log(`💬 Slack message sent to ${recipient}: ${message}`);
    }
  }
}
```

**解答例**:

```typescript
// Strategy Pattern implementation
interface NotificationStrategy {
  send(message: string, recipient: string): void;
  getType(): string;
  isAvailable(): boolean;
}

class EmailNotificationStrategy implements NotificationStrategy {
  send(message: string, recipient: string): void {
    console.log(`📧 Email sent to ${recipient}: ${message}`);
  }

  getType(): string {
    return "email";
  }

  isAvailable(): boolean {
    return true; // メールは常に利用可能
  }
}

class SMSNotificationStrategy implements NotificationStrategy {
  send(message: string, recipient: string): void {
    console.log(`📱 SMS sent to ${recipient}: ${message}`);
  }

  getType(): string {
    return "sms";
  }

  isAvailable(): boolean {
    // SMS サービスの状態チェック
    return true;
  }
}

class PushNotificationStrategy implements NotificationStrategy {
  send(message: string, recipient: string): void {
    console.log(`📳 Push notification sent to ${recipient}: ${message}`);
  }

  getType(): string {
    return "push";
  }

  isAvailable(): boolean {
    // Push サービスの状態チェック
    return true;
  }
}

// 新戦略の追加：既存コードを変更しない
class SlackNotificationStrategy implements NotificationStrategy {
  send(message: string, recipient: string): void {
    console.log(`💬 Slack message sent to ${recipient}: ${message}`);
  }

  getType(): string {
    return "slack";
  }

  isAvailable(): boolean {
    // Slack API の状態チェック
    return true;
  }
}

class DiscordNotificationStrategy implements NotificationStrategy {
  send(message: string, recipient: string): void {
    console.log(`🎮 Discord message sent to ${recipient}: ${message}`);
  }

  getType(): string {
    return "discord";
  }

  isAvailable(): boolean {
    return true;
  }
}

// コンテキストクラス
class NotificationManager {
  private strategies: Map<string, NotificationStrategy> = new Map();

  registerStrategy(strategy: NotificationStrategy): void {
    this.strategies.set(strategy.getType(), strategy);
  }

  sendNotification(message: string, type: string, recipient: string): boolean {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      console.error(`Unknown notification type: ${type}`);
      return false;
    }

    if (!strategy.isAvailable()) {
      console.error(`${type} notification service is not available`);
      return false;
    }

    strategy.send(message, recipient);
    return true;
  }

  sendToAll(message: string, recipient: string): void {
    for (const [type, strategy] of this.strategies) {
      if (strategy.isAvailable()) {
        strategy.send(message, recipient);
      }
    }
  }

  getAvailableTypes(): string[] {
    return Array.from(this.strategies.keys()).filter((type) =>
      this.strategies.get(type)!.isAvailable()
    );
  }
}

// 使用例
const notificationManager = new NotificationManager();
notificationManager.registerStrategy(new EmailNotificationStrategy());
notificationManager.registerStrategy(new SMSNotificationStrategy());
notificationManager.registerStrategy(new PushNotificationStrategy());
notificationManager.registerStrategy(new SlackNotificationStrategy());
notificationManager.registerStrategy(new DiscordNotificationStrategy());
```

### 練習問題 2: 価格計算システム（中級）

以下のコードをテンプレートメソッドパターンと OCP に従ってリファクタリングしてください：

```typescript
class PriceCalculator {
  calculatePrice(
    basePrice: number,
    customerType: string,
    quantity: number
  ): number {
    let finalPrice = basePrice;

    if (customerType === "regular") {
      // 通常価格
      if (quantity >= 100) {
        finalPrice = finalPrice * 0.95; // 5% 割引
      }
      finalPrice = finalPrice + finalPrice * 0.1; // 10% 税金
    } else if (customerType === "premium") {
      // プレミアム割引
      finalPrice = finalPrice * 0.9; // 10% 割引
      if (quantity >= 50) {
        finalPrice = finalPrice * 0.95; // 追加 5% 割引
      }
      finalPrice = finalPrice + finalPrice * 0.08; // 8% 税金
    } else if (customerType === "vip") {
      // 新機能追加で修正が必要 ❌
      // VIP 割引
      finalPrice = finalPrice * 0.8; // 20% 割引
      if (quantity >= 10) {
        finalPrice = finalPrice * 0.9; // 追加 10% 割引
      }
      // VIP は税金免除
    }

    return finalPrice;
  }
}
```

**🎓 チャレンジ**: このクラスを以下の観点でリファクタリングしてください：

1. テンプレートメソッドパターンで価格計算の流れを定義
2. 顧客タイプごとに異なる割引戦略を実装
3. 新しい顧客タイプを既存コードを変更せずに追加可能にする

---

## 👨‍🏫 学習ポイント

### 🔄 復習のための確認項目

**基本概念の理解**

- [ ] 「拡張に開いて修正に閉じる」の意味を具体例で説明できますか？
- [ ] OCP が解決する問題とその価値を理解していますか？
- [ ] 抽象化が OCP の実現にどう役立つかを理解していますか？

**設計パターンの理解**

- [ ] 戦略パターンを使った OCP 実装ができますか？
- [ ] テンプレートメソッドパターンを使った OCP 実装ができますか？
- [ ] どちらのパターンを使うべきかを判断できますか？

**実践的スキル**

- [ ] 既存の if-else チェーンを戦略パターンに変換できますか？
- [ ] アルゴリズムの骨格を抽象クラスで定義できますか？
- [ ] 新機能追加時に既存コードを変更しない設計ができますか？

### 🤔 よくある質問

**Q: 戦略パターンとテンプレートメソッドパターンの使い分けは？**
A: 戦略パターンはアルゴリズム全体を交換したい場合、テンプレートメソッドパターンはアルゴリズムの一部分のみ変更したい場合に適しています。

**Q: OCP を意識しすぎて設計が複雑になりませんか？**
A: 適切な抽象化レベルを保つことが重要です。YAGNI の原則（You Ain't Gonna Need It）も考慮し、実際に拡張が必要になったタイミングでリファクタリングすることも有効です。

**Q: 全ての変更に対して OCP を適用すべきですか？**
A: いいえ。重要で頻繁に変更される部分に集中して適用することが効果的です。すべてを OCP に対応させると過度に複雑になる可能性があります。

---

**📌 重要**: Session2 では OCP の実践的適用方法を学びました。戦略パターンとテンプレートメソッドパターンは、OCP を実現する強力な道具です。

**🌟 次回（Session3）は、リスコフの置換原則（LSP）について詳しく学習します！**

---

## 📋 Session2 完了チェックリスト（45 分版）

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 基本概念理解

- [ ] OCP の定義と重要性を説明できる
- [ ] 「拡張に開いて修正に閉じる」を具体例で説明できる
- [ ] OCP が解決する問題を理解している

### 💻 設計パターン実装

- [ ] 戦略パターンを使った OCP 実装ができる
- [ ] テンプレートメソッドパターンを使った OCP 実装ができる
- [ ] パターンの使い分けを理解している

### 🔧 実践能力

- [ ] if-else チェーンを戦略パターンに変換できる
- [ ] 抽象クラスでアルゴリズムの骨格を定義できる
- [ ] 新機能を既存コード変更なしで追加できる

### 🧪 問題解決力

- [ ] 提供された練習問題を解答できた
- [ ] 自分なりの OCP 適用戦略を説明できる
- [ ] リファクタリングのリスクを最小化する方法を理解している

### 📚 知識の統合

- [ ] OCP が SRP とどう関連するか理解している
- [ ] 次のステップ（Session3: LSP）への準備ができている

**🎉 すべてチェックできましたか？** それでは Session3 でお会いしましょう！

**⚠️ チェックできない項目がある場合**: 該当する学習内容を再度確認し、不明点は講師に質問しましょう。
````
