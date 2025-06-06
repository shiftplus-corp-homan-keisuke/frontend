# STEP02 Session 2: メニューとピザコンポーネント

> ⏰ **セッション時間**: 90 分
> 🎯 **目標**: ピザのデータ構造を定義し、`Menu` コンポーネントと `Pizza` コンポーネントを作成して、`props` を使ってデータを表示する。
> 📋 **前提**: Session1 で学習した React プロジェクト設定と基本的な Props の受け渡し。

## 📅 セッション構成

| 時間     | 内容                                      | 形式 | 成果物                                 |
| :------- | :---------------------------------------- | :--- | :------------------------------------- |
| 0-15 分  | 導入: ピザデータ構造の設計                | 講義 | データ構造の理解                       |
| 15-45 分 | `Menu` コンポーネントの作成とデータ連携   | 実践 | 空のメニューコンポーネント             |
| 45-75 分 | `Pizza` コンポーネントの作成と Props 表示 | 実践 | 個々のピザ情報表示コンポーネント       |
| 75-90 分 | まとめ・振り返り                          | 討論 | メニューとピザコンポーネントの理解確認 |

## 🎯 学習目標の詳細

### 💡 このセッションで身につけること

- [ ] アプリケーションで使用するデータの型を TypeScript で定義できる
- [ ] 複数の子コンポーネントを管理する親コンポーネント（`Menu`）を作成できる
- [ ] 個々のデータアイテムを表示する子コンポーネント（`Pizza`）を作成できる
- [ ] 親コンポーネントから子コンポーネントへ複雑なオブジェクトを `props` として渡せる
- [ ] `props` の分割代入を効果的に利用できる

### 📝 成果物

- ピザの情報を格納する `pizzaData` 配列（TypeScript で型定義済み）
- `Menu` コンポーネント（ピザリストのコンテナ）
- `Pizza` コンポーネント（個々のピザ情報を表示）
- `App.tsx` から `Menu` コンポーネントを呼び出し、`Menu` から `Pizza` コンポーネントへデータを渡して表示する基盤

## 📚 レクチャー 9-16: メニューとピザコンポーネント

### 🔍 なぜこの技術が重要なのか

💡 **実務での価値**:

- 実際のアプリケーションでは、多くの場合、サーバーから取得したデータやローカルで定義されたデータを表示します。データの型を事前に定義することで、開発中の予期せぬデータ形式によるエラーを防ぎます。
- コンポーネントを細かく分割することで、各コンポーネントの責任が明確になり、コードの再利用性、テスト容易性、保守性が向上します。
- `props` を使ってデータを下位コンポーネントに渡すパターンは、React の基本的なデータフローであり、複雑な UI を構築する上で不可欠です。

🎯 **解決する課題**:

- 大量のデータを効率的に管理し、表示する。
- UI の各部分を独立したコンポーネントとして開発し、チーム開発や機能追加を容易にする。
- コンポーネント間のデータ連携を明確にし、デバッグを容易にする。

### 📝 実装の詳細解説

#### Level 1: 基礎実装 - ピザデータの定義

`src/data/pizzaData.ts` を作成します。

```typescript
// 💡 基本的な実装例
// src/data/pizzaData.ts

// ピザの型定義
export interface Pizza {
  id: number;
  name: string;
  ingredients: string;
  price: number;
  photoName: string;
  soldOut: boolean;
}

// ピザデータの配列
export const pizzaData: Pizza[] = [
  {
    id: 1,
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    id: 2,
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    id: 3,
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    id: 4,
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    id: 5,
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true, // 売り切れ
  },
  {
    id: 6,
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];
```

**🔍 解説ポイント**:

- `interface Pizza` で個々のピザオブジェクトの構造を定義しています。これにより、ピザデータが常に一貫した形式であることを保証します。
- `export const pizzaData: Pizza[]` は、`Pizza` 型のオブジェクトの配列としてデータを定義し、他のファイルからインポートできるようにエクスポートしています。

#### Level 2: 型安全な実装 - `Pizza` コンポーネントの作成

`src/components/Pizza.tsx` を作成します。

```typescript
// 🎯 型安全性を高めた実装
// src/components/Pizza.tsx
import React from "react";
import { Pizza as PizzaType } from "../data/pizzaData"; // 型をインポート

// Pizzaコンポーネントが受け取るpropsの型を定義
interface PizzaProps {
  pizzaObj: PizzaType; // pizzaObjはPizzaType型
}

const Pizza: React.FC<PizzaProps> = ({ pizzaObj }) => {
  return (
    <li>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>{pizzaObj.price}</span>
      </div>
    </li>
  );
};

export default Pizza;
```

**⚠️ 注意点**:

- `PizzaType` は `pizzaData.ts` からインポートした `Pizza` インターフェースのエイリアスです。コンポーネント名と型名が衝突しないようにしています。
- `pizzaObj: PizzaType;` のように、`props` として受け取るオブジェクトの型を厳密に定義することで、コンポーネント内で安全にプロパティにアクセスできます。

#### Level 3: 実践的実装 - `Menu` コンポーネントの作成とデータ連携

`src/components/Menu.tsx` を作成します。

```typescript
// 🚀 実務レベルの実装
// src/components/Menu.tsx
import React from "react";
import Pizza from "./Pizza"; // Pizzaコンポーネントをインポート
import { pizzaData } from "../data/pizzaData"; // ピザデータをインポート

const Menu: React.FC = () => {
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      <ul className="pizzas">
        {/* pizzaData配列をマップして、各ピザに対してPizzaコンポーネントをレンダリング */}
        {pizzaData.map((pizza) => (
          <Pizza pizzaObj={pizza} key={pizza.id} />
        ))}
      </ul>
    </main>
  );
};

export default Menu;
```

`src/App.tsx` を修正して `Menu` コンポーネントを組み込みます。

```typescript
// 🚀 実務レベルの実装
// src/App.tsx
import React from "react";
import Header from "./components/Header";
import Menu from "./components/Menu"; // Menuコンポーネントをインポート

function App() {
  return (
    <div className="container">
      <Header title="ピザメニュー" />
      <main>
        {/* Menuコンポーネントを配置 */}
        <Menu />
      </main>
    </div>
  );
}

export default App;
```

**📝 実装のコツ**:

- `Array.prototype.map()` メソッドは、配列の各要素を変換して新しい配列を生成する際に非常に便利です。React では、データのリストをコンポーネントのリストに変換する際によく使用されます。
- `key` プロップは、React がリスト内のアイテムを識別するために必要です。リストのレンダリングパフォーマンスを最適化し、予期せぬ挙動を防ぐために、各リストアイテムに一意の `key` を設定することが重要です。通常はデータの ID を使用します。

### 💻 実践演習

#### 演習 2-1: ピザの画像と価格を表示する

**🎯 演習目的**: `Pizza` コンポーネントが `props` で受け取ったデータを正しく表示できることを確認する。

**📋 要件**:

- `Pizza.tsx` 内で、`pizzaObj` から `photoName` を使って画像を表示する `<img>` タグを追加する。
- `pizzaObj` から `price` を使って価格を表示する `<span>` タグを追加する。
- `public/pizzas` ディレクトリに、`pizzaData.ts` で指定されている画像ファイル（例: `focaccia.jpg`, `margherita.jpg` など）を配置する。（これは手動で行うか、後で実践プロジェクトのセクションで提供されるファイルを使用してください。）

**💡 ヒント**:

- `<img>` タグの `src` 属性に `pizzaObj.photoName` を設定します。
- `alt` 属性には `pizzaObj.name` を設定すると良いでしょう。
- 価格は `<span>` タグで囲み、必要に応じて通貨記号（例: `$` や `€`）を追加してください。

**✅ 期待される結果**:

- 各ピザの画像、名前、材料、価格がリスト形式で表示される。

### 🔍 理解度チェック

以下の質問に答えられるかチェックしてみましょう：

1. **基礎理解**: React でデータのリストを表示する際に、`Array.prototype.map()` メソッドと `key` プロップがどのように使われますか？
2. **応用理解**: `interface` を使ってデータの型を定義することのメリットは何ですか？
3. **実践理解**: `Menu` コンポーネントが `pizzaData` を直接インポートしているのはなぜですか？もしデータが API から取得される場合、どのような変更が必要になりますか？

## 🗒️ セッションまとめ

### ✅ 今回学んだこと

- アプリケーションで使用するデータの型を TypeScript で定義する方法
- 親コンポーネント（`Menu`）と子コンポーネント（`Pizza`）の役割分担と連携方法
- `props` を使って複雑なオブジェクトデータを子コンポーネントに渡す方法
- `Array.prototype.map()` を使ったリストレンダリングと `key` プロップの重要性

### 📝 次回への準備

- 今回作成した `Menu` と `Pizza` コンポーネントをベースに開発を進めます。
- 次回は、売り切れピザの条件付きレンダリングや、ピザがない場合のメッセージ表示など、より動的な UI の実装に取り組みます。

### 🔄 復習推奨項目

- TypeScript の `interface` によるオブジェクトの型定義
- React のコンポーネントの親子関係とデータフロー
- JavaScript の `Array.prototype.map()` メソッド

---

**次のセッション**: [Session3](./STEP02_Session3_全てのピザの表示と条件付きレンダリング.md)
