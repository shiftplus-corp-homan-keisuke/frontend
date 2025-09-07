# Session7: コンポーネント設計とファイル構造

## セクション概要

このセッションでは、これまで一つのファイルに書いてきたコンポーネントを、実際の開発現場で使われる形に整理していきます。つまり、各コンポーネントを個別のファイルに分離し、適切なファイル構造を構築する方法を学習します。

実際の React 開発では、すべてのコンポーネントを一つのファイルに書き続けることはありません。プロジェクトが大きくなるにつれて、コードの管理が困難になり、チーム開発においても効率が悪くなってしまいます。

そこで、このセッションでは「Far Away」アプリケーションを例に、コンポーネントの分離方法、ES6 の import/export 構文の使い方、そして実践的なファイル構造の整理方法を学んでいきます。

これは、プロフェッショナルな React 開発者として必須のスキルです。単にコードを動かすだけでなく、保守性と拡張性を考慮した、美しいコード構造を作り上げる方法を習得しましょう。

## コンポーネント分離の実践的アプローチ

### App.js ファイルの複数コンポーネントファイルへの分割

現在、私たちの「Far Away」アプリケーションは、すべてのコンポーネントが一つの App.js ファイルに含まれています。これを実際の開発現場で使われる形に分割していきましょう。

この作業は、各コンポーネントを独立したファイルに分離するという、非常にシンプルな作業です。ご希望であれば、ご自身で挑戦してみることもできます。

### コンポーネント分離の実装手順

それでは、実際にコンポーネントを分離していきましょう。まず最初に、Logo コンポーネントから始めます。

#### ステップ 1: Logo コンポーネントの分離

現在の App.js ファイルから Logo コンポーネントのコードを取得します：

```jsx
function Logo() {
  return <h1>🌴 Far Away 💼</h1>;
}
```

このコードをカットして、新しいファイルを作成します。

**新しいファイルの作成手順**：

1. `src` フォルダ内に Logo.js という名前の新しいファイルを作成
2. カットしたコードを貼り付け
3. **重要**: この関数をこのファイルからエクスポートする必要があります

### JavaScript のエクスポート方法の理解

JavaScript では、モジュールから関数やオブジェクトをエクスポートする方法が 2 つあります。

#### 1. 名前付きエクスポート（Named Export）

```jsx
export function Logo() {
  return <h1>🌴 Far Away 💼</h1>;
}
```

この方法を使用すると、Logo という名前のエクスポートが作成されます。この場合、他のファイルでインポートする際には、正確にその名前を使用する必要があります：

```jsx
import { Logo } from "./Logo";
```

#### 2. デフォルトエクスポート（Default Export）

```jsx
function Logo() {
  return <h1>🌴 Far Away 💼</h1>;
}

export default Logo;
```

通常、React アプリケーションでは、デフォルトエクスポートを使用します。これにより、インポート時により柔軟性が得られます。

### インポートの実装とエラーの確認

Logo.js ファイルを作成し、デフォルトエクスポートを追加した後、アプリケーションをリロードしてみると、エラーが発生します：

```
Logo is not defined
```

これは正常な動作です。Logo コンポーネントが別のファイルに移動したため、App.js で認識されなくなったからです。

この問題を解決するために、App.js でインポートする必要があります：

```jsx
import Logo from "./Logo";
```

**インポートパスについて**：

- デフォルトエクスポートを使用しているため、インポート時に任意の名前を使用できます
- しかし、もちろん、ここでも Logo と呼ぶのが適切です
- パスは単純にそのファイルへのパスです

**名前の変更テスト**：
実際に、インポート名を変更してテストすることもできます：

```jsx
import X from "./Logo";
```

そして、コンポーネントの使用箇所も変更します：

```jsx
<X />
```

保存すると、アプリケーションは正常に動作します。これは、デフォルトエクスポートと名前付きエクスポートの動作の違いを示しています。ただし、このような名前の変更は推奨されません。これは単に、名前付きエクスポートとデフォルトエクスポートの動作を理解するためのデモンストレーションです。

#### ステップ 2: Form コンポーネントの分離

次に、Form コンポーネントを分離しましょう。

最初のコンポーネント（App）は、このファイルに残します。なぜなら、それは App と呼ばれ、このファイルも既に App.js と呼ばれているからです。

次のコンポーネントを取得しましょう：

```jsx
function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now() };

    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
```

このコードをカットして、新しい Form.js ファイルを作成し、貼り付けます。

そして、再びデフォルトエクスポートを追加します：

```jsx
export default Form;
```

App.js に戻って、Form をインポートする必要があります：

```jsx
import Form from "./Form";
```

**重要な注意点**：
ここでエラーが発生します。なぜなら、Form コンポーネントで useState を使用しているのに、その他のコンポーネントでそのフックをインポートしていないからです。

App.js からこの行を取得する必要があります：

```jsx
import { useState } from "react";
```

そして、Form.js ファイルに移動します。useState 関数を使用しているのはこのファイルだからです。

**重要な原則**：
コード内のどこか一箇所に React の一部を含めるだけでは十分ではありません。実際に、必要な React の部分を各個別のコンポーネントファイルに含める必要があります。

### VS Code の自動リファクタリング機能の活用

これまで 2 つのコンポーネントを手動で分離しましたが、実際には自動的に行う時が来ました。

VS Code の便利な機能を使用して、残りのコンポーネントを効率的に分離できます。

#### PackingList コンポーネントの自動分離

PackingList コンポーネント全体を選択します。関数の横にある三角形をクリックして関数を折りたたむこともできます。これにより、全体を選択しやすくなります。

全体を選択した後、右クリックして「リファクタリング」を選択します。

ここで、「新しいファイルに移動」というオプションが表示されます。これをクリックします。

VS Code が自動的に以下を行います：

- packing list という名前の新しいファイルを作成
- この関数をそのファイルに配置
- 必要なインポートを自動的に追加

VS Code は、この関数内で必要なすべての部分を自動的にインポートしました。useState と item が含まれています。

実際には、item がここにあることはあまり意味がありません。なぜなら、item はまだここにあるからです。しかし、これは一瞬で修正されます。

重要なのは、VS Code が自動的にこの新しいファイルを作成し、この新しいコンポーネントをここに配置し、それをエクスポートしたことです。

**エクスポート方式の違い**：
VS Code は名前付きエクスポートを使用しています：

```jsx
export function PackingList({ items, onDeleteItem, onToggleItem }) {
  // ...
}
```

そして、インポートも名前付きインポートの方式で行っています：

```jsx
import { PackingList } from "./PackingList";
```

これは名前付きインポートの方法です。しかし、通常、React 開発ではデフォルトエクスポートを使用します。もちろん、他の方法も完全に問題ありません。

一貫性のために、デフォルトエクスポートに変更しましょう：

```jsx
function PackingList({ items, onDeleteItem, onToggleItem }) {
  // ...
}

export default PackingList;
```

そして、インポート方式も変更します：

```jsx
import PackingList from "./PackingList";
```

中括弧を削除することで、デフォルトインポートになります。

#### Item コンポーネントの自動分離

次に、Item コンポーネントも同様に分離しましょう。

このエクスポートを削除して、すべてを選択し、リファクタリングして、新しいファイルに移動します。

再び、item が作成され、ここでデフォルトエクスポートを書く必要があります：

```jsx
export default Item;
```

保存します。

そして、packing list に戻る必要があります。なぜなら、このコンポーネントはもはや app 内にはなく、Item.js 内にあるからです。そして、それは再びデフォルトエクスポートです。

したがって、デフォルトインポートとして、基本的にインポートする必要があります：

```jsx
import Item from "./Item";
```

**依存関係の整理**：
この小さな問題が発生したのは、最初に item に依存する packing list をエクスポートしたからです。しかし、いずれにせよ、通常、アプリを構築する際には、新しいコンポーネントが必要になったときに、すぐに新しいファイルを作成します。

#### Stats コンポーネントの分離

最後のコンポーネント、stats も同様に処理しましょう。

デフォルトエクスポートに変更します：

```jsx
export default Stats;
```

そして、インポートも修正します：

```jsx
import Stats from "./Stats";
```

### 分離完了後の状況確認

これで、各コンポーネントが独自のファイルに配置され、コンポーネントの管理が少し簡単になりました。

**利点**：

- 上下にスクロールする必要が少なくなりました
- 代わりに、基本的に各コンポーネントを独立したファイルで開発できます

## プロジェクト構造の整理と components フォルダの作成

### components フォルダへの移動

さらに一歩進んで、各コンポーネントを新しい components フォルダに移動することもできます。

**手順**：

1. components フォルダを作成
2. すべてのコンポーネントファイルを選択（index.js は除く - これはコンポーネントではありません）
3. CSS ファイルも除外
4. すべてのコンポーネントファイルを components フォルダにドラッグ

### インポートパスの修正

ファイルを移動した後、一つだけ問題があります。index.js で app ファイルが見つからないということです。

index.js でパスを修正する必要があります：

```jsx
// 修正前
import App from "./App";

// 修正後
import App from "./components/App";
```

### 相対パスの動作確認

他のファイルについては、インポートは引き続き機能します。なぜなら、すべてのコンポーネントが同じフォルダ内の App.js と同じフォルダにあるからです。

**最終的なファイル構造**：

```
src/
├── components/
│   ├── App.js
│   ├── Logo.js
│   ├── Form.js
│   ├── PackingList.js
│   ├── Item.js
│   └── Stats.js
├── index.js
└── index.css
```

## プロジェクト完了とお疲れ様のメッセージ

これで、このプロジェクトは完了しました。

**お疲れ様でした！**
最初の、より実践的な React プロジェクトを完了したことを、改めてお祝いします。実際に何かを実現するプロジェクトです。

**プロジェクトの価値**：
これは本当に素晴らしい練習プロジェクトだったと思います。非常に分かりやすく、この段階で知っておく必要がある最も重要な基礎をすべて含んでいました。

**実世界への応用**：
もちろん、これは実世界のアプリケーションではありませんが、大規模なアプリでは、実際にこれらのスキルが必要な多くの小さな部分があります。

したがって、ここで学んでいることはすべて、本当に、本当に重要です。これは基礎を築くものであり、後により大きく、実世界のアプリケーションを構築できるようになります。

## ES6 の import/export 構文の詳細説明

### エクスポートの種類

**1. デフォルトエクスポート**

```jsx
// 関数の場合
function MyComponent() {
  return <div>Hello</div>;
}
export default MyComponent;

// または一行で
export default function MyComponent() {
  return <div>Hello</div>;
}
```

**2. 名前付きエクスポート**

```jsx
// 複数の要素をエクスポート
export function ComponentA() {
  /* ... */
}
export function ComponentB() {
  /* ... */
}
export const CONSTANT_VALUE = 42;

// または一括エクスポート
function ComponentA() {
  /* ... */
}
function ComponentB() {
  /* ... */
}
const CONSTANT_VALUE = 42;

export { ComponentA, ComponentB, CONSTANT_VALUE };
```

### インポートの種類

**1. デフォルトインポート**

```jsx
import MyComponent from "./MyComponent";
import AnyName from "./MyComponent"; // 任意の名前を使用可能
```

**2. 名前付きインポート**

```jsx
import { ComponentA, ComponentB } from "./Components";
import { ComponentA as CompA } from "./Components"; // 別名を使用
```

**3. 混合インポート**

```jsx
import DefaultComponent, { namedExport1, namedExport2 } from "./Module";
```

**4. 全体インポート**

```jsx
import * as Utils from "./utils";
// Utils.functionA(), Utils.functionB() として使用
```

### React 開発でのベストプラクティス

**1. コンポーネントはデフォルトエクスポートを使用**

```jsx
// 推奨
export default function Button() {
  return <button>Click me</button>;
}
```

**2. ユーティリティ関数は名前付きエクスポートを使用**

```jsx
// utils.js
export function formatDate(date) {
  /* ... */
}
export function validateEmail(email) {
  /* ... */
}
```

**3. 定数は名前付きエクスポートを使用**

```jsx
// constants.js
export const API_URL = "https://api.example.com";
export const MAX_ITEMS = 100;
```

## 実際の開発プロセスでの注意点

### 1. 段階的な分離

実際のプロジェクトでは、すべてのコンポーネントを一度に分離する必要はありません。以下のような段階的なアプローチが効果的です：

**段階 1**: 再利用可能なコンポーネントから分離
**段階 2**: 大きくなったコンポーネントを分離
**段階 3**: 機能別にコンポーネントを整理

### 2. 依存関係の管理

コンポーネントを分離する際は、依存関係に注意が必要です：

- 親コンポーネントに依存する子コンポーネント
- 共通のユーティリティ関数を使用するコンポーネント
- 同じ状態を共有するコンポーネント

### 3. 各ファイルでの独立したインポート

重要な原則として、各コンポーネントファイルで使用する React の機能は、そのファイル内で個別にインポートする必要があります：

```jsx
// Form.js
import { useState } from "react";

function Form() {
  const [description, setDescription] = useState("");
  // ...
}
```

一度だけインポートすれば十分というわけではありません。各コンポーネントファイルは独立している必要があります。

### 4. テストの考慮

コンポーネントを分離すると、個別にテストしやすくなります：

```jsx
// Logo.test.js
import { render, screen } from "@testing-library/react";
import Logo from "./Logo";

test("renders logo text", () => {
  render(<Logo />);
  const logoElement = screen.getByText(/Far Away/i);
  expect(logoElement).toBeInTheDocument();
});
```

### 5. パフォーマンスの考慮

適切なコンポーネント分離は、以下のパフォーマンス向上をもたらします：

- **コード分割**: 必要なコンポーネントのみをロード
- **再レンダリングの最適化**: 変更されたコンポーネントのみが再レンダリング
- **メモ化の活用**: React.memo を使用した最適化が容易

## 高度なファイル構造パターン

### 機能別フォルダ構造

大規模なアプリケーションでは、機能別にフォルダを整理することがあります：

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.js
│   │   │   ├── Button.css
│   │   │   └── Button.test.js
│   │   └── Modal/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginForm.js
│   │   │   └── SignupForm.js
│   │   └── travel/
│   │       ├── PackingList.js
│   │       └── TravelStats.js
│   └── layout/
│       ├── Header.js
│       └── Footer.js
```

### コンポーネントフォルダパターン

各コンポーネントを独自のフォルダに配置するパターン：

```
src/
├── components/
│   ├── Logo/
│   │   ├── index.js      // メインコンポーネント
│   │   ├── Logo.css      // スタイル
│   │   └── Logo.test.js  // テスト
│   └── Form/
│       ├── index.js
│       ├── Form.css
│       └── Form.test.js
```

この場合、インポートは以下のようになります：

```jsx
import Logo from "./components/Logo";
import Form from "./components/Form";
```

## 次のステップへの展望

### セクションの次の内容

このセクションの次では、素晴らしい演習があります。一緒にアコーディオンコンポーネントを構築します。

そして、React の他の非常に重要な部分をお見せしたいと思います。それは children prop です。

### 継続的な学習

今回学んだ知識は、以下のような実際の開発シーンで活用できます：

- **新規プロジェクトの立ち上げ**: 最初から適切な構造で開発を開始
- **既存プロジェクトのリファクタリング**: 保守性を向上させるための構造改善
- **チーム開発**: 複数の開発者が効率的に協力できる環境の構築

## まとめ

このセッションでは、React アプリケーションにおけるコンポーネント設計とファイル構造について学習しました。

### 学習した主要なポイント

**1. コンポーネント分離の実践的手順**

- 手動でのコンポーネント分離方法
- VS Code の自動リファクタリング機能の活用
- 各ファイルでの独立したインポートの重要性

**2. ES6 の import/export 構文の完全理解**

- デフォルトエクスポートと名前付きエクスポートの違い
- React 開発でのベストプラクティス
- 相対パスの使用方法

**3. 実践的なファイル構造の構築**

- components フォルダの活用
- 機能別の整理方法
- スケーラブルな構造の設計

**4. 開発ツールの効果的活用**

- VS Code の自動リファクタリング機能
- 効率的なコンポーネント分離の手順

### 実際の開発での応用

今回学んだ知識は、実世界のアプリケーション開発において、多くの小さな部分で必要となるスキルです。ここで学んだことはすべて、本当に重要な基礎となります。これにより、後により大きく、実世界のアプリケーションを構築できるようになります。

### 継続的な改善

良いファイル構造は一度作って終わりではありません。プロジェクトの成長に合わせて継続的に改善していくことが重要です：

- 定期的なコードレビューでの構造確認
- 新機能追加時の適切な配置検討
- チームメンバーとの構造に関する議論

これで、プロフェッショナルな React 開発者として必要なコンポーネント設計とファイル構造の基礎を習得できました。これらの知識を活用して、保守性が高く、拡張しやすい React アプリケーションを構築していきましょう。

実際の開発では、今回学んだ原則を基に、プロジェクトの要件やチームの慣習に合わせて柔軟に適用することが大切です。常に「なぜこの構造にするのか」を考えながら、最適な設計を追求していってください。
