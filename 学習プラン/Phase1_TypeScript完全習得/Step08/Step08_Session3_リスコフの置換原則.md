# Session3: リスコフの置換原則（LSP）をTypeScriptで理解する

リスコフの置換原則は、「**派生型（子クラス）は、その基底型（親クラス）と置換可能でなければならない**」という原則です。

これを、もっとかみ砕いて言うと、

**「親クラスを使っている箇所を、何も気にせず子クラスに置き換えても、プログラムの振る舞いが変わらず、正しく動き続けなければならない」**

ということです。

子クラスは親クラスの機能を拡張したものであるべきで、親クラスが元々持っていた機能を勝手に変更したり、使えなくしたりしてはいけない、という「約束事」だと考えてください。

## なぜリスコフの置換原則が重要なのか？

この原則が破られると、一見正しいように見える継承関係が、実際には非常に扱いにくいものになってしまいます。

- **予期せぬバグの温床になる:** 親クラスのつもりで使っていたら、子クラスのせいで予期せぬ動作やエラーが発生します。
- **コードの信頼性が下がる:** 「この親クラスの型が指定されているけど、本当にどの子クラスが来ても大丈夫なんだろうか？」といちいち疑う必要が出てきます。
- **無駄な分岐処理が増える:** 結局、子クラスの種類を`if`文や`instanceof`で判別して処理を分ける、といったコードが必要になります。これは、前の原則である「オープン・クローズドの原則」にも違反します。

この原則を守ることで、継承とポリモーフィズム（多態性）が正しく機能し、安心してオブジェクトを扱えるようになります。

## TypeScriptでの具体例

最も有名で分かりやすい例が「長方形と正方形」の問題です。
数学的には「正方形は長方形の一種」ですが、プログラミングの世界では、この継承関係がLSP違反を引き起こすことがあります。

### 違反している例：

まず、親クラスとなる`Rectangle`（長方形）を定義します。長方形は「幅」と「高さ」を別々に設定できるのが特徴です。

```typescript
class Rectangle {
    protected width: number = 0;
    protected height: number = 0;

    public setWidth(width: number): void {
        this.width = width;
    }

    public setHeight(height: number): void {
        this.height = height;
    }

    public getArea(): number {
        return this.width * this.height;
    }
}
```

次に、この`Rectangle`を継承して`Square`（正方形）を作ります。正方形は「幅と高さが常に等しい」という性質を持っています。

```typescript
class Square extends Rectangle {
    // 幅を設定したら、高さも同じ値にしなければならない
    public setWidth(width: number): void {
        this.width = width;
        this.height = width; // 親の振る舞いを変更している！
    }

    // 高さを設定したら、幅も同じ値にしなければならない
    public setHeight(height: number): void {
        this.width = height;
        this.height = height; // 親の振る舞いを変更している！
    }
}
```

さて、この`Rectangle`と`Square`を使うクライアント側のコードを見てみましょう。この関数は、引数として「長方形」を受け取ることを期待しています。

```typescript
function printAreaDetails(rect: Rectangle) {
    console.log("--- 計算開始 ---");
    rect.setWidth(5);
    rect.setHeight(4);
    const area = rect.getArea();
    console.log(`期待する面積: 20`);
    console.log(`実際の面積: ${area}`);
    console.assert(area === 20, "面積が期待通りではありません！");
    console.log("--- 計算終了 ---\n");
}

// Rectangleを渡した場合 -> 期待通りに動く
const rect = new Rectangle();
printAreaDetails(rect);

// Squareを渡した場合 -> 期待通りに動かない！
const square = new Square();
printAreaDetails(square);
```

**実行結果:**

```
--- 計算開始 ---
期待する面積: 20
実際の面積: 20
--- 計算終了 ---

--- 計算開始 ---
期待する面積: 20
実際の面積: 16
Assertion failed: 面積が期待通りではありません！
--- 計算終了 ---
```

`printAreaDetails`関数は、引数に`Rectangle`型を期待しています。`Square`は`Rectangle`の子クラスなので、本来は問題なく渡せるはずです。

しかし、`Square`を渡すと、`rect.setHeight(4)`を呼び出した瞬間に、`setWidth(5)`で設定したはずの`width`も`4`に上書きされてしまいます。その結果、面積が `4 * 4 = 16` となり、クライアント側の期待（`5 * 4 = 20`）を裏切ってしまいました。

これが典型的な**リスコフの置換原則違反**です。子クラス`Square`は、親クラス`Rectangle`と**置換可能ではありませんでした**。

### 準拠するための考え方：

この問題を解決するには、そもそも「`Square`は`Rectangle`を継承すべきではない」と判断します。振る舞いが異なるからです。

代わりに、より抽象的なインターフェース（または抽象クラス）を定義します。

```typescript
// 「面積を計算できる図形」という共通のインターフェース
interface Shape {
    getArea(): number;
}

// Shapeインターフェースを実装したRectangleクラス
class Rectangle implements Shape {
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getArea(): number {
        return this.width * this.height;
    }
}

// Shapeインターフェースを実装したSquareクラス
class Square implements Shape {
    private side: number;

    constructor(side: number) {
        this.side = side;
    }

    getArea(): number {
        return this.side * this.side;
    }
}
```

このように継承関係をやめることで、`Square`が`Rectangle`の振る舞いを壊すという問題自体が発生しなくなります。それぞれのクラスが、自身の性質に合った形で正しく実装されています。

### 新しい設計での使用例：

新しい設計では、`printAreaDetails`関数の役割そのものを見直す必要があります。

新しい設計では、`Rectangle`や`Square`は**生成時（コンストラクタ）に寸法が決まり、後から変更されることは想定していません**。

そのため、`printAreaDetails`関数は、オブジェクトの状態を変更する責任を持つべきではありません。関数の新しい責任は、**「すでに完成している図形（Shape）を受け取り、その面積に関する情報を表示する」**ことになります。

```typescript
/**
 * Shapeを受け取り、その面積と期待値を比較して表示する関数
 * @param shape - RectangleやSquareなど、Shapeインターフェースを実装した任意のオブジェクト
 * @param expectedArea - 期待される面積
 */
function printAreaDetails(shape: Shape, shapeName: string, expectedArea: number) {
    console.log(`--- ${shapeName} の計算開始 ---`);
    const area = shape.getArea();
    console.log(`期待する面積: ${expectedArea}`);
    console.log(`実際の面積: ${area}`);
    console.assert(area === expectedArea, "面積が期待通りではありません！");
    console.log("--- 計算終了 ---\n");
}


// --- 使用例 ---

// 幅5、高さ4の長方形を作成
const rect = new Rectangle(5, 4);
// 長方形を渡して実行 -> 期待通りに動く
printAreaDetails(rect, "長方形", 20);


// 一辺が4の正方形を作成
const square = new Square(4);
// 正方形を渡して実行 -> こちらも期待通りに動く！
printAreaDetails(square, "正方形", 16);
```

**実行結果:**

```
--- 長方形 の計算開始 ---
期待する面積: 20
実際の面積: 20
--- 計算終了 ---

--- 正方形 の計算開始 ---
期待する面積: 16
実際の面積: 16
--- 計算終了 ---
```

この新しい設計では、`printAreaDetails`関数は、渡されたオブジェクトが`Rectangle`であろうと`Square`であろうと、全く同じように振る舞います。なぜなら、どちらも`Shape`インターフェースの「`getArea()`メソッドを持つ」という**契約**を守っているからです。

これが**リスコフの置換原則が守られた状態**です。親の型（この場合はインターフェース`Shape`）が使われている場所に、子の型（`Rectangle`や`Square`）を安心して「置換」することができるのです。

## まとめ

リスコフの置換原則は、**「継承を使うなら、親の『振る舞いの契約』を破るな」**というメッセージです。

子クラスは、親クラスのメソッドをオーバーライドする際に、

- 親クラスよりも厳しい事前条件（例: 引数の型を限定するなど）を課してはいけない。
- 親クラスよりも緩い事後条件（例: 親が返すべきだった結果を返さないなど）を返してはいけない。
- 親クラスで発生しなかった種類の例外を投げてはいけない。

といった、より詳細なルールも内包しています。

この原則を守ることで、継承がもたらすポリモーフィズムの恩恵を最大限に活かした、信頼性の高いコードを書くことができます。
