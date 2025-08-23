# Session2: オープン・クローズドの原則（OCP）を TypeScript で理解する

オープン・クローズドの原則は、「**ソフトウェアのエンティティ（クラス、モジュール、関数など）は、拡張に対しては開いて（open）いるべきだが、修正に対しては閉じて（closed）いるべきである**」という設計原則です。

これを、もっと簡単な言葉で言うと、

- **拡張に開いている (Open for Extension):** 新しい機能を追加することが容易にできる。
- **修正に閉じている (Closed for Modification):** 既存の動いているコードを、直接書き換える必要がない。

ということです。

## なぜオープン・クローズドの原則が重要なのか？

もし、新しい機能を追加するたびに既存のコードを**修正する**と、次のような問題が起こりがちです。

- **バグの発生（デグレード）:** 安定して動いていたはずの既存の機能に、予期せぬ不具合を生んでしまうリスクが高まります。
- **影響範囲の調査コスト:** 修正による影響がどこまで及ぶのか、毎回広範囲をテスト・確認する必要が出てきます。
- **コードの複雑化:** `if`文や`switch`文がどんどん増えていき、コードが複雑で読みにくく、メンテナンスが困難になります。

この原則を守ることで、**既存コードの安定性を保ちながら**、安全かつ効率的に新機能を**追加（拡張）**できるようになります。

## TypeScript での具体例

EC サイトで、商品の割引価格を計算する機能を例に見ていきましょう。

### 違反している例：

最初は、セール割引（10%オフ）だけを考慮した価格計算クラスがありました。

```typescript
// 割引の種類をenumで定義
enum DiscountType {
  Sale,
}

class PriceCalculator {
  calculate(price: number, discountType: DiscountType): number {
    if (discountType === DiscountType.Sale) {
      return price * 0.9; // 10%オフ
    }
    return price;
  }
}
```

このコードはシンプルで問題なく動きます。しかし、ある日「新しく**クーポン割引（500 円引き）**を追加してほしい」という要求が来たとします。

従来のアプローチでは、この `PriceCalculator` クラスの**中身を直接修正する**必要があります。

```typescript
// 割引の種類を追加
enum DiscountType {
  Sale,
  Coupon, // ← 追加
}

class PriceCalculator {
  calculate(price: number, discountType: DiscountType): number {
    if (discountType === DiscountType.Sale) {
      return price * 0.9;
    }
    // 👇 新しい割引のために、既存のクラスの中身を修正した
    if (discountType === DiscountType.Coupon) {
      return price - 500;
    }
    return price;
  }
}
```

さらに「会員割引」「タイムセール割引」…と追加されるたびに、この`if`文はどんどん長くなっていきます。これは、新しい機能を追加するたびに既存の`PriceCalculator`クラスを**修正**しているので、「修正に対して閉じている」原則に違反しています。

### 準拠している例：

この問題を解決するために、**抽象化（インターフェース）**を利用します。「割引のルール」という共通の概念をインターフェースとして定義し、具体的な割引処理を別のクラスに任せます。

**ステップ 1: 割引ルールの共通インターフェースを定義する**

```typescript
// 割引戦略のインターフェース
interface IDiscountStrategy {
  apply(price: number): number;
}
```

このインターフェースは、「価格を受け取り、割引後の価格を返す」という契約（ルール）を定めています。

**ステップ 2: 具体的な割引ルールをクラスとして実装する**

```typescript
// セール割引
class SaleDiscount implements IDiscountStrategy {
  apply(price: number): number {
    return price * 0.9; // 10%オフ
  }
}

// クーポン割引
class CouponDiscount implements IDiscountStrategy {
  apply(price: number): number {
    return Math.max(0, price - 500); // 500円引き（マイナスにならないように）
  }
}
```

**ステップ 3: PriceCalculator を修正し、インターフェースに依存させる**

`PriceCalculator`は、具体的な割引方法を知る必要がなくなります。代わりに、`IDiscountStrategy`というルールに従うオブジェクト（インスタンス）を受け取るようにします。

```typescript
class PriceCalculator {
  // どんな割引ルール(戦略)が来るかは知らない。
  // IDiscountStrategyのルールを守ってさえいればOK。
  calculate(price: number, strategy: IDiscountStrategy): number {
    return strategy.apply(price);
  }
}
```

この`PriceCalculator`は、もはや割引の種類が増えても**修正する**必要がありません。「修正に対して閉じた」状態になりました。

### 新機能の追加（拡張）

さて、ここで「新しく**会員割引（20%オフ）**を追加してほしい」という要求が来たとします。

この場合、私たちは`PriceCalculator`を一切**修正する**ことなく、新しいクラスを**追加する（拡張する）**だけで対応できます。

```typescript
// ✨ 新しい会員割引クラスを追加するだけ（拡張） ✨
class MemberDiscount implements IDiscountStrategy {
  apply(price: number): number {
    return price * 0.8; // 20%オフ
  }
}

// --- 使用例 ---
const calculator = new PriceCalculator();
const price = 10000;

const saleStrategy = new SaleDiscount();
console.log(`セール価格: ${calculator.calculate(price, saleStrategy)}`); // 出力: セール価格: 9000

const couponStrategy = new CouponDiscount();
console.log(`クーポン適用価格: ${calculator.calculate(price, couponStrategy)}`); // 出力: クーポン適用価格: 9500

// 新しく追加した会員割引も、既存のコードを書き換えずに利用できる！
const memberStrategy = new MemberDiscount();
console.log(`会員価格: ${calculator.calculate(price, memberStrategy)}`); // 出力: 会員価格: 8000
```

このように、新しい割引ルールは新しいクラスとして**拡張**できます。そして、既存の`PriceCalculator`は一切**修正**する必要がありません。これこそが「拡張にはオープン、修正にはクローズ」な設計です。

## Angular での具体例

Angular アプリケーションでも、オープン・クローズドの原則は非常に重要です。シンプルなメッセージ表示機能を例に見てみましょう。

### 違反している例（Angular）：

ユーザーにメッセージを表示するサービスを作ります。最初は成功メッセージだけを表示する機能でした。

```typescript
// services/message.service.ts - 初期バージョン
import { Injectable } from "@angular/core";

export enum MessageType {
  SUCCESS = "success",
}

@Injectable({
  providedIn: "root",
})
export class MessageService {
  showMessage(message: string, type: MessageType): void {
    if (type === MessageType.SUCCESS) {
      // 成功メッセージの表示処理
      console.log(`✅ SUCCESS: ${message}`);
      alert(`成功: ${message}`);
    }
  }
}
```

しかし、新しい要求が来ました：

- 「エラーメッセージも表示したい」
- 「警告メッセージも追加してほしい」
- 「情報メッセージも欲しい」

従来のアプローチでは、毎回`MessageService`を**修正**する必要があります：

```typescript
// services/message.service.ts - 修正版（OCP違反）
import { Injectable } from "@angular/core";

// 新しい種類を追加するたびに修正が必要
export enum MessageType {
  SUCCESS = "success",
  ERROR = "error", // ← 追加
  WARNING = "warning", // ← 追加
  INFO = "info", // ← 追加
}

@Injectable({
  providedIn: "root",
})
export class MessageService {
  showMessage(message: string, type: MessageType): void {
    // 新しいメッセージタイプを追加するたびに、このメソッドを修正する必要がある
    if (type === MessageType.SUCCESS) {
      console.log(`✅ SUCCESS: ${message}`);
      alert(`成功: ${message}`);
    }

    // 👇 新しい機能のために既存のメソッドを修正（OCP違反）
    if (type === MessageType.ERROR) {
      console.log(`❌ ERROR: ${message}`);
      alert(`エラー: ${message}`);
    }

    if (type === MessageType.WARNING) {
      console.log(`⚠️ WARNING: ${message}`);
      alert(`警告: ${message}`);
    }

    if (type === MessageType.INFO) {
      console.log(`ℹ️ INFO: ${message}`);
      alert(`情報: ${message}`);
    }
  }
}
```

この設計の問題点：

- 新しいメッセージタイプが必要になるたびに`MessageService`を修正する必要がある
- `showMessage`メソッドがどんどん長くなり、複雑になる
- 一つのメッセージ処理の修正が他のメッセージ処理に影響を与えるリスク

### 準拠している例（Angular）：

オープン・クローズドの原則に従って、メッセージ表示戦略を抽象化します。

**ステップ 1: メッセージ戦略のインターフェースを定義**

```typescript
// interfaces/message-strategy.interface.ts
export interface IMessageStrategy {
  display(message: string): void;
  getIcon(): string;
}
```

**ステップ 2: 具体的なメッセージ戦略を個別のクラスとして実装**

```typescript
// strategies/success-message.strategy.ts
import { Injectable } from "@angular/core";
import { IMessageStrategy } from "../interfaces/message-strategy.interface";

@Injectable({
  providedIn: "root",
})
export class SuccessMessageStrategy implements IMessageStrategy {
  display(message: string): void {
    console.log(`✅ SUCCESS: ${message}`);
    // より洗練された表示（例: トースト通知）
    this.showToast(`成功: ${message}`, "success");
  }

  getIcon(): string {
    return "✅";
  }

  private showToast(message: string, type: string): void {
    // 実際のトースト表示ロジック
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // 3秒後に削除
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }
}

// strategies/error-message.strategy.ts
@Injectable({
  providedIn: "root",
})
export class ErrorMessageStrategy implements IMessageStrategy {
  display(message: string): void {
    console.log(`❌ ERROR: ${message}`);
    this.showToast(`エラー: ${message}`, "error");
  }

  getIcon(): string {
    return "❌";
  }

  private showToast(message: string, type: string): void {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 5000); // エラーは少し長く表示
  }
}

// strategies/warning-message.strategy.ts
@Injectable({
  providedIn: "root",
})
export class WarningMessageStrategy implements IMessageStrategy {
  display(message: string): void {
    console.log(`⚠️ WARNING: ${message}`);
    this.showToast(`警告: ${message}`, "warning");
  }

  getIcon(): string {
    return "⚠️";
  }

  private showToast(message: string, type: string): void {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 4000);
  }
}
```

**ステップ 3: メッセージサービスを更新**

```typescript
// services/message.service.ts - OCP準拠版
import { Injectable } from "@angular/core";
import { IMessageStrategy } from "../interfaces/message-strategy.interface";
import { SuccessMessageStrategy } from "../strategies/success-message.strategy";
import { ErrorMessageStrategy } from "../strategies/error-message.strategy";
import { WarningMessageStrategy } from "../strategies/warning-message.strategy";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private strategies = new Map<string, IMessageStrategy>();

  constructor(
    private successStrategy: SuccessMessageStrategy,
    private errorStrategy: ErrorMessageStrategy,
    private warningStrategy: WarningMessageStrategy
  ) {
    // 戦略を登録
    this.strategies.set("success", this.successStrategy);
    this.strategies.set("error", this.errorStrategy);
    this.strategies.set("warning", this.warningStrategy);
  }

  showMessage(message: string, type: string): void {
    const strategy = this.strategies.get(type);
    if (strategy) {
      strategy.display(message);
    } else {
      console.warn(`未知のメッセージタイプ: ${type}`);
    }
  }

  // 新しい戦略を追加する（拡張）
  addStrategy(type: string, strategy: IMessageStrategy): void {
    this.strategies.set(type, strategy);
  }

  getAvailableTypes(): string[] {
    return Array.from(this.strategies.keys());
  }

  getIcon(type: string): string {
    const strategy = this.strategies.get(type);
    return strategy ? strategy.getIcon() : "?";
  }
}
```

**ステップ 4: Angular コンポーネントでの使用**

```typescript
// components/demo.component.ts
import { Component } from "@angular/core";
import { MessageService } from "../services/message.service";

@Component({
  selector: "app-demo",
  template: `
    <div class="demo-container">
      <h2>メッセージデモ</h2>

      <div class="button-group">
        <button class="btn btn-success" (click)="showSuccess()">
          成功メッセージ {{ messageService.getIcon("success") }}
        </button>

        <button class="btn btn-danger" (click)="showError()">
          エラーメッセージ {{ messageService.getIcon("error") }}
        </button>

        <button class="btn btn-warning" (click)="showWarning()">
          警告メッセージ {{ messageService.getIcon("warning") }}
        </button>
      </div>

      <div class="info">
        <p>利用可能なメッセージタイプ: {{ getAvailableTypes() }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }

      .button-group {
        display: flex;
        gap: 10px;
        margin: 20px 0;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
      }

      .btn-success {
        background-color: #28a745;
        color: white;
      }
      .btn-danger {
        background-color: #dc3545;
        color: white;
      }
      .btn-warning {
        background-color: #ffc107;
        color: black;
      }

      .info {
        margin-top: 30px;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 5px;
      }
    `,
  ],
})
export class DemoComponent {
  constructor(public messageService: MessageService) {}

  showSuccess(): void {
    this.messageService.showMessage("操作が正常に完了しました！", "success");
  }

  showError(): void {
    this.messageService.showMessage("エラーが発生しました。", "error");
  }

  showWarning(): void {
    this.messageService.showMessage("注意が必要です。", "warning");
  }

  getAvailableTypes(): string {
    return this.messageService.getAvailableTypes().join(", ");
  }
}
```

### 新機能の追加（拡張）

新しく「情報メッセージ」が必要になった場合、既存のコードを一切修正せずに新しい戦略を追加できます：

```typescript
// strategies/info-message.strategy.ts - 新しい戦略を追加（拡張）
import { Injectable } from "@angular/core";
import { IMessageStrategy } from "../interfaces/message-strategy.interface";

@Injectable({
  providedIn: "root",
})
export class InfoMessageStrategy implements IMessageStrategy {
  display(message: string): void {
    console.log(`ℹ️ INFO: ${message}`);
    this.showToast(`情報: ${message}`, "info");
  }

  getIcon(): string {
    return "ℹ️";
  }

  private showToast(message: string, type: string): void {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3500);
  }
}

// コンポーネントで新しい戦略を使用
export class DemoComponent implements OnInit {
  constructor(
    public messageService: MessageService,
    private infoStrategy: InfoMessageStrategy // ← 新しい戦略を注入
  ) {}

  ngOnInit(): void {
    // 新しい戦略を追加（既存コードを修正せずに拡張）
    this.messageService.addStrategy("info", this.infoStrategy);
  }

  // 新しいメソッドを追加
  showInfo(): void {
    this.messageService.showMessage("参考情報です。", "info");
  }
}
```

### 分離後のメリット（Angular）：

1. **拡張性**: 新しいメッセージタイプを追加しても既存コードを修正する必要がない

2. **再利用性**: 各メッセージ戦略を他のコンポーネントでも独立して使用できる

3. **テスタビリティ**: 各戦略を個別にテストできる

```typescript
// success-message.strategy.spec.ts - 単体テスト例
describe("SuccessMessageStrategy", () => {
  let strategy: SuccessMessageStrategy;

  beforeEach(() => {
    strategy = new SuccessMessageStrategy();
  });

  it("正しいアイコンを返すこと", () => {
    expect(strategy.getIcon()).toBe("✅");
  });

  it("メッセージを正しく表示すること", () => {
    spyOn(console, "log");
    strategy.display("テストメッセージ");
    expect(console.log).toHaveBeenCalledWith("✅ SUCCESS: テストメッセージ");
  });
});
```

4. **保守性**: 一つのメッセージ処理の修正が他に影響しない

5. **設定の柔軟性**: 実行時に新しい戦略を追加したり、既存の戦略を置き換えたりできる

この設計により、Angular アプリケーションでもオープン・クローズドの原則が守られ、新機能の追加が安全かつ効率的に行えるようになります。

## まとめ

オープン・クローズドの原則は、将来の要求仕様を見越して、コードを柔軟に保つための重要な考え方です。

- **変わりやすい部分**（今回の例では「割引の計算方法」）を見つけ出す。
- その部分を**インターフェースとして抽象化**する。
- 具体的な処理は、そのインターフェースを実装した個別のクラスに担当させる。

このアプローチ（ストラテジーパターンとも呼ばれます）により、システムのコア部分の安定性を損なうことなく、**新しいクラスの追加（拡張）だけで**安全に新しい機能を追加していくことが可能になります。

### 🔑 重要なポイント

- **❌ 修正**: 既存のコードの中身を直接書き換えること
- **✅ 拡張**: 新しいクラスやモジュールを追加すること
- **目標**: 「拡張は歓迎、修正は避ける」設計を心がける
