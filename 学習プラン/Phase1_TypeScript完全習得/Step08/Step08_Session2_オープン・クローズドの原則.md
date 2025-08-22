# Session2: オープン・クローズドの原則（OCP）をTypeScriptで理解する

オープン・クローズドの原則は、「**ソフトウェアのエンティティ（クラス、モジュール、関数など）は、拡張に対しては開いて（open）いるべきだが、修正に対しては閉じて（closed）いるべきである**」という設計原則です。

これを、もっと簡単な言葉で言うと、

- **拡張に開いている (Open for Extension):** 新しい機能を追加したり、システムの振る舞いを変更したりすることが容易にできる。
- **修正に閉じている (Closed for Modification):** 既存の動いているコードを、直接書き換える必要がない。

ということです。つまり、**「機能追加はOK、でも既存コードの修正はNG」**という考え方です。

## なぜオープン・クローズドの原則が重要なのか？

もし、新しい機能を追加するたびに既存のコードを修正していると、次のような問題が起こりがちです。

- **バグの発生（デグレード）:** 安定して動いていたはずの既存の機能に、予期せぬ不具合を生んでしまうリスクが高まります。
- **影響範囲の調査コスト:** 修正による影響がどこまで及ぶのか、毎回広範囲をテスト・確認する必要が出てきます。
- **コードの複雑化:** `if`文や`switch`文がどんどん増えていき、コードが複雑で読みにくく、メンテナンスが困難になります。

この原則を守ることで、システムの安定性を保ちながら、安全かつ効率的に新機能を追加できるようになります。

## TypeScriptでの具体例

ECサイトで、商品の割引価格を計算する機能を例に見ていきましょう。

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

このコードはシンプルで問題なく動きます。しかし、ある日「新しく**クーポン割引（500円引き）**を追加してほしい」という仕様変更が来たとします。

あなたはこの `PriceCalculator` クラスを次のように**修正**する必要があります。

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
        // 👇 新しい割引のために、既存のクラスを修正した
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

**ステップ1: 割引ルールの共通インターフェースを定義する**

```typescript
// 割引戦略のインターフェース
interface IDiscountStrategy {
    apply(price: number): number;
}
```
このインターフェースは、「価格を受け取り、割引後の価格を返す」という契約（ルール）を定めています。

**ステップ2: 具体的な割引ルールをクラスとして実装する**

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

**ステップ3: PriceCalculatorを修正し、インターフェースに依存させる**

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
この`PriceCalculator`は、もはや割引の種類が増えても修正する必要がありません。「修正に対して閉じた」状態になりました。

### 新機能の追加

さて、ここで「新しく**会員割引（20%オフ）**を追加してほしい」という要求が来たとします。

この場合、私たちは`PriceCalculator`を一切触ることなく、新しいクラスを**追加**するだけで対応できます。

```typescript
// ✨ 新しい会員割引クラスを追加するだけ ✨
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

// 新しく追加した会員割引も、既存のコードを変更せずに利用できる！
const memberStrategy = new MemberDiscount();
console.log(`会員価格: ${calculator.calculate(price, memberStrategy)}`); // 出力: 会員価格: 8000
```

このように、新しい割引ルールは新しいクラスとして**拡張**できます。そして、既存の`PriceCalculator`は一切**修正**する必要がありません。これこそが「拡張にはオープン、修正にはクローズ」な設計です。

## まとめ

オープン・クローズドの原則は、将来の変更を見越して、コードを柔軟に保つための重要な考え方です。

- **変更されそうな部分**（今回の例では「割引の計算方法」）を見つけ出す。
- その部分を**インターフェースとして抽象化**する。
- 具体的な処理は、そのインターフェースを実装した個別のクラスに担当させる。

このアプローチ（ストラテジーパターンとも呼ばれます）により、システムのコア部分の安定性を損なうことなく、安全に新しい機能を追加していくことが可能になります。
