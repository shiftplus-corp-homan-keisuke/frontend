# STEP02 Session 3: 全てのピザの表示と条件付きレンダリング

> ⏰ **セッション時間**: 90 分
> 🎯 **目標**: `Menu` コンポーネントで全てのピザデータを表示し、売り切れのピザを条件付きレンダリングで表現する。
> 📋 **前提**: Session2 で学習したピザデータ構造、`Menu` および `Pizza` コンポーネントの作成。

## 📅 セッション構成

| 時間     | 内容                               | 形式 | 成果物                         |
| :------- | :--------------------------------- | :--- | :----------------------------- |
| 0-15 分  | 導入: 条件付きレンダリングの重要性 | 講義 | 条件付きレンダリングの概念理解 |
| 15-45 分 | 売り切れピザの条件付きスタイリング | 実践 | 売り切れピザの視覚的表現       |
| 45-75 分 | ピザがない場合のメッセージ表示     | 実践 | 動的なメニュー表示             |
| 75-90 分 | まとめ・振り返り                   | 討論 | 条件付きレンダリングの理解確認 |

## 🎯 学習目標の詳細

### 💡 このセッションで身につけること

- [ ] React で条件付きレンダリングを実装する様々な方法を理解し、使い分けられる
- [ ] `props` の値に基づいてコンポーネントの見た目や動作を動的に変更できる
- [ ] 売り切れなどの状態を UI に反映させるロジックを実装できる
- [ ] リストが空の場合に代替コンテンツを表示するロジックを実装できる

### 📝 成果物

- 売り切れのピザが視覚的に区別される `Pizza` コンポーネント
- メニューにピザがない場合に「ピザがありません」と表示される `Menu` コンポーネント
- 全てのピザデータが正しく表示され、売り切れ状態が反映されたピザメニューアプリケーション

## 📚 レクチャー 17-24: 全てのピザの表示と条件付きレンダリング

### 🔍 なぜこの技術が重要なのか

💡 **実務での価値**:

- 実際のアプリケーションでは、データの状態やユーザーの操作に応じて UI を動的に変更する必要があります。条件付きレンダリングは、このような動的な UI を実現するための基本的な手法です。
- 売り切れ商品や在庫切れの表示、ログイン状態に応じたメニューの切り替えなど、ユーザー体験を向上させる上で不可欠な機能です。
- コードの可読性と保守性を高めながら、複雑な UI ロジックを効率的に実装できます。

🎯 **解決する課題**:

- データの状態変化に合わせた UI の自動更新。
- ユーザーに現在の状況（例: 売り切れ、データなし）を明確に伝える。
- 不要な要素のレンダリングを避け、パフォーマンスを最適化する。

### 📝 実装の詳細解説

#### Level 1: 基礎実装 - 売り切れピザの条件付きレンダリング

`src/components/Pizza.tsx` を修正します。

```typescript
// 💡 基本的な実装例
// src/components/Pizza.tsx
import React from "react";
import { Pizza as PizzaType } from "../data/pizzaData";

interface PizzaProps {
  pizzaObj: PizzaType;
}

const Pizza: React.FC<PizzaProps> = ({ pizzaObj }) => {
  // 売り切れの場合、特別なCSSクラスを適用
  const pizzaClassName = pizzaObj.soldOut ? "pizza sold-out" : "pizza";

  return (
    <li className={pizzaClassName}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        {/* 売り切れの場合は「SOLD OUT」と表示、そうでなければ価格を表示 */}
        <span>{pizzaObj.soldOut ? "SOLD OUT" : `$${pizzaObj.price}`}</span>
      </div>
    </li>
  );
};

export default Pizza;
```

**🔍 解説ポイント**:

- `pizzaObj.soldOut` の真偽値に基づいて、`pizzaClassName` を動的に決定しています。
- 三項演算子 (`condition ? valueIfTrue : valueIfFalse`) を使って、`soldOut` の状態に応じて価格表示を切り替えています。

#### Level 2: 型安全な実装 - ピザがない場合のメッセージ表示

`src/components/Menu.tsx` を修正します。

```typescript
// 🎯 型安全性を高めた実装
// src/components/Menu.tsx
import React from "react";
import Pizza from "./Pizza";
import { pizzaData } from "../data/pizzaData";

const Menu: React.FC = () => {
  const numPizzas = pizzaData.length; // ピザの数を取得

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {/* ピザがある場合のみリストをレンダリング、そうでなければメッセージを表示 */}
      {numPizzas > 0 ? (
        <ul className="pizzas">
          {pizzaData.map((pizza) => (
            <Pizza pizzaObj={pizza} key={pizza.id} />
          ))}
        </ul>
      ) : (
        <p>現在、ピザの準備中です。しばらくお待ちください 😊</p>
      )}
    </main>
  );
};

export default Menu;
```

**⚠️ 注意点**:

- `numPizzas > 0` という条件で、ピザが存在するかどうかをチェックしています。
- 論理 AND 演算子 (`&&`) を使うこともできますが、`if/else` のように完全に異なる要素をレンダリングする場合は三項演算子の方が適しています。
- `pizzaData` が空の配列の場合、`Pizza` コンポーネントは一つもレンダリングされず、代わりに「ピザの準備中です」というメッセージが表示されます。

#### Level 3: 実践的実装 - 売り切れピザのスタイリング

`src/App.css` に以下のスタイルを追加します。

```css
/* 🚀 実務レベルの実装 */
/* src/App.css */

/* ... 既存のスタイル ... */

.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}

.pizzas {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.pizza {
  display: flex;
  gap: 3.2rem;
  align-items: center;
}

.pizza img {
  width: 10rem;
  aspect-ratio: 1;
  align-self: flex-start;
}

.pizza div {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.pizza h3 {
  font-size: 2rem;
  font-weight: 300;
}

.pizza p {
  font-size: 1.4rem;
  font-weight: 300;
}

.pizza span {
  display: block;
  font-size: 1.6rem;
  font-weight: bold;
}

/* 売り切れピザのスタイル */
.pizza.sold-out {
  color: #888; /* 文字色をグレーに */
}

.pizza.sold-out img {
  filter: grayscale(100%); /* 画像をモノクロに */
  opacity: 0.8; /* 透明度を下げる */
}
```

**📝 実装のコツ**:

- CSS クラスを動的に追加することで、JavaScript（React）のロジックと CSS のスタイリングを分離できます。
- `filter: grayscale(100%);` や `opacity` を使うことで、売り切れ商品を視覚的に分かりやすく表現できます。
- `grid` や `flexbox` を使って、レスポンシブで柔軟なレイアウトを構築しましょう。

### 💻 実践演習

#### 演習 3-1: ピザの価格を条件付きで表示する

**🎯 演習目的**: 条件付きレンダリングの応用力を高める。

**📋 要件**:

- `Pizza` コンポーネントで、`pizzaObj.soldOut` が `true` の場合、価格の代わりに「SOLD OUT」と表示する。
- `pizzaObj.soldOut` が `false` の場合、通常の価格（例: `$10`）を表示する。

**💡 ヒント**:

- `<span>` タグ内のテキストコンテンツを三項演算子で切り替えます。

**✅ 期待される結果**:

- 売り切れのピザには「SOLD OUT」と表示され、それ以外のピザには価格が表示される。

### 🔍 理解度チェック

以下の質問に答えられるかチェックしてみましょう：

1. **基礎理解**: React で条件付きレンダリングを行う主な方法を 3 つ挙げてください。
2. **応用理解**: `props` の値に基づいてコンポーネントの CSS クラスを動的に変更する方法を説明してください。
3. **実践理解**: `pizzaData` が空の場合に表示されるメッセージは、ユーザー体験の観点からどのようなメリットがありますか？

## 🗒️ セッションまとめ

### ✅ 今回学んだこと

- React で条件付きレンダリングを実装する様々なパターン（三項演算子、論理 AND 演算子）
- `props` の値に基づいてコンポーネントの見た目（CSS クラス）を動的に変更する方法
- リストが空の場合に代替コンテンツを表示するロジック
- 売り切れピザの視覚的な表現方法

### 📝 次回への準備

- 今回作成したピザメニューアプリケーションをベースに、アプリケーション全体のスタイリングを完成させます。
- 開店/閉店メッセージや注文ボタンなど、よりインタラクティブな要素を追加します。

### 🔄 復習推奨項目

- JavaScript の条件演算子（三項演算子、論理 AND 演算子）
- CSS の基本的なセレクタとプロパティ
- React のコンポーネントの再利用性

---

**次のセッション**: [Session4](./STEP02_Session4_アプリケーションのスタイリングと開店_閉店メッセージ.md)
