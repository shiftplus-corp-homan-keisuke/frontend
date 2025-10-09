# Session3: スタイリングと Props

## 🎯 このセッションで学ぶこと

Session2 で学んだ JSX とコンポーネント設計の知識を発展させ、より実践的な React アプリケーション開発を目指します。

- **🎨 React スタイリング**：インラインスタイルと外部 CSS ファイルの活用方法
- **📦 Props の基礎**：コンポーネント間でのデータ受け渡しの仕組み
- **🔄 Props の不変性**：一方向データフローと React の設計思想
- **📋 JSX のルール**：JSX を正しく使うための重要な規則

Session2 で構築したピザメニューアプリケーションにスタイリングを適用し、Props を使ってコンポーネントを再利用可能にしていきます。

**最終プロジェクト参照**: [`react/STEP01_基礎/session2_project/final`](react/STEP01_基礎/session2_project/final)

---

## 🎨 React アプリケーションのスタイリング

### React におけるスタイリングの理解

この時点で、React コンポーネントには CSS スタイルも含めることができることが分かります。ここでは、React アプリケーションに CSS を適用する簡単な方法を学びましょう。

React では、コンポーネントのスタイリング方法がたくさんあり、React 自体はどの方法を使うかについて特にこだわりがありません。

これは、React がフレームワークというよりライブラリであるためです。つまり、コンポーネントのスタイリング方法に決まりがなく、さまざまな選択肢から自由に選べます。

### React で利用可能なスタイリング手法

たとえば、以下のような方法があります：

- **インラインスタイル**：JSX の`style`属性を使用
- **外部 CSS ファイル**：従来の CSS/Sass ファイルをインポート
- **CSS モジュール**：スコープ化された CSS
- **Styled Components**：CSS-in-JS ライブラリ
- **Tailwind CSS**：ユーティリティファースト CSS

この講義ですべての方法を解説するわけではありませんが、後ほどいくつかの手法についても触れます。

ここではまずインライン CSS を使い、その後外部 CSS ファイルも利用します。

### インラインスタイルの実装

#### HTML と JSX の違い

ご存知のように、HTML では、実際にこの style 属性を使用して要素をスタイリングできます。

```html
<!-- HTML -->
<h1 style="color: red; font-size: 48px;">Fast React Pizza Co.</h1>
```

そして、HTML では、これらのスタイルを文字列でこのように書きます。

しかし、JSX では、そのようには動作しません。JSX では、実際に JavaScript オブジェクトを使用してインラインスタイルを定義する必要があります。

JavaScript オブジェクトを書く必要がある場合、まず JavaScript モードに入る必要があります。それが波括弧の目的です。しかし、その後、別の波括弧のセットが必要です。そして、それは再び、今度はオブジェクトを作成するためです。

```jsx
// JSX
function Header() {
  return (
    <h1 style={{ color: "red", fontSize: "48px" }}>Fast React Pizza Co.</h1>
  );
}
```

このように、いくつかのプロパティを定義できます。例えば、この H1 テキストを赤色にしたい場合などです。

保存すると、すぐに反映されます。

これが、JSX でコンポーネントにスタイルを付ける最も簡単な方法です。HTML と同じく style 属性を使います。

### より詳細なスタイリング例

HTML では、基本的にこの方法は使いません。前の講義で説明した「関心の分離」の考え方から、CSS は別ファイルに分けていました。

しかし、React では、インラインスタイルを使うことも自然で問題ありません。

別のものを試してみましょう。fontSize、CSS ではこのように書きますよね？font-size ですが、JavaScript では、それは有効なプロパティ名ではありません。

したがって、すべての CSS プロパティ名は、基本的に JSX でこのキャメルケース記法に変換されています。そのため、fontSize をこのように書く必要があります。

```jsx
function Header() {
  const style = {
    color: "red",
    fontSize: "48px",
    textTransform: "uppercase",
  };

  return <h1 style={style}>Fast React Pizza Co.</h1>;
}
```

48 ピクセルと言いましょう。そして、JavaScript オブジェクトを書いているので、この値は常に文字列である必要があります。

別のものを試してみましょう。textTransform。そして、VS Code が常にここで利用可能なオプションを表示することがわかります。

これらのプロパティ値を常に文字列として書くようにしてください。なぜなら、これは最終的に単なる JavaScript オブジェクトだからです。

そして、これをここから抽出することもできます。これを切り取って、ここで変数を作成しましょう。const style、そしてもちろん任意の変数名にできます。

そして、それをここに配置します。そして、すべてまだ同じに見えます。

これが、個々のコンポーネントにスタイルを追加する最も簡単な方法です。

#### インラインスタイルの記述方法

```jsx
function Header() {
  // スタイルオブジェクトを変数として定義
  const headerStyle = {
    color: "red",
    fontSize: "48px",
    textTransform: "uppercase",
    textAlign: "center",
  };

  return (
    <header>
      <h1 style={headerStyle}>Fast React Pizza Co.</h1>
    </header>
  );
}
```

**重要なポイント**：

- **二重の波括弧**：`{{ }}`は外側が JavaScript モード、内側がオブジェクト
- **camelCase 記法**：`font-size` → `fontSize`、`text-transform` → `textTransform`
- **文字列値**：すべての CSS 値は文字列として記述（`"48px"`、`"red"`）

#### 動的スタイリングの例

```jsx
function Pizza({ soldOut }) {
  const pizzaStyle = {
    opacity: soldOut ? 0.6 : 1,
    filter: soldOut ? "grayscale(100%)" : "none",
  };

  return (
    <div className="pizza" style={pizzaStyle}>
      {/* ピザの内容 */}
    </div>
  );
}
```

### 外部 CSS ファイルの活用

#### より実用的なアプローチ

ただし、アプリケーションが大きくなると、すべてのコンポーネントにインラインスタイルを書くのは大変です。実際の現場ではあまり使われません。

そこで、外部 CSS ファイルを使う方法もあります。これは従来の Web 開発と同じです。

React アプリケーションで最も一般的なスタイリング方法は、外部 CSS ファイルを使うことです。他の Web ページと同じやり方です。

#### CSS ファイルのインポート

この場合、CSS と JavaScript/HTML の関心が混ざることになりますが、React では特に問題ありません。

また、後ほど「styled components」という手法も学びます。

しかし、今のところ、この講義の最初に含めた CSS ファイルを見てみましょう。

これは、いくつかのクラスが定義された一般的な CSS ファイルです。

これらのクラスを使うには、JSX 要素にクラス名を追加します。

その前に、CSS ファイルをインポートする必要があります。

```jsx
import "./index.css"; // CSSファイルをインポート
```

アプリケーションは CSS ファイルが存在することを自動で認識しません。なので、明示的にインポートします。

このインポートによって、Webpack が CSS ファイルのスタイルをアプリケーションに適用してくれます。

#### JSX でのクラス名指定

そして、すでに物事がここで変わったのがわかります。背景色が異なり、フォントファミリーが変わりました。そして、ページの下部にこの素敵な黄色いボーダーも表示されます。

そのため、Webpack がすぐにこれらのスタイルをアプリケーションに含めたことがわかります。

しかし、今度はクラスを追加しましょう。container があり、header、menu、そしておそらく footer があることがわかります。

ここで、container のクラスを追加しましょう。まず間違った方法でやってみます。

```jsx
// ❌ 間違い（警告が表示される）
<div class="container">
```

HTML で行うように class と書きますが、React は実際に警告します。

ここで、「Invalid DOM property class did you mean className?」と表示されます。

そして、これが JSX の重要なルールの一つです。JSX では、class を使用できませんが、代わりに className を使用します。

```jsx
// ✅ 正しい
<div className="container">
```

これは一般的な初心者の間違いですが、今警告されました。ここではまだ何らかの形で動作しますが、JSX で class を使用することは本当に想定されていません。

おそらく、class は既に JavaScript の予約キーワードだからです。

#### セマンティックな HTML 要素の使用

しかし、ここで続けましょう。再び、ここで header のクラス名を追加しましょう。

```jsx
function Header() {
  return (
    <header className="header">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
}
```

そして、これはあまり変わりませんでした。それは、まだここでこのスタイルが適用されているからです。おそらくそれは欲しくありません。

実際に、ここで最初に header 要素を持つことになっているからです。そして、そのクラスはそこに行くべきです。

これは、header 要素がここでは単純に H1 を持つよりも少し適しているセマンティック HTML またはセマンティックマークアップです。

次に、ここで menu のクラスを追加しましょう。そして、再び、それは className です。

```jsx
function Menu() {
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      <Pizza />
      <Pizza />
      <Pizza />
    </main>
  );
}
```

そして、セマンティックマークアップについて話していたので、実際に main タグ、つまり main HTML 要素を使用しましょう。

これで、メニューにきれいなスタイリングが適用されます。

次に、ここでこのクラス名があります。これは単純に footer になります。

```jsx
function Footer() {
  return (
    <footer className="footer">
      We're currently open! {new Date().toLocaleTimeString()}
    </footer>
  );
}
```

### グローバルスタイルの特徴

これで、実際にアプリケーションにスタイリングが適用されました。そして、述べたように、この外部 CSS スタイルシートからこれらのスタイルを取得しています。これは、この import 構文を使用して単純にここでインポートしたことを覚えておいてください。これにより、Webpack がスタイルをアプリケーションにインポートします。

そして、ここで、className を使用し、class は使用しないことを覚えておいてください。なぜなら、class は既に JavaScript の予約キーワードだからです。

ちなみに、このような JSX ルールは他にもいくつかあり、このセクションで少し後で話します。

今のところ、ここに含めたスタイルがグローバルスタイルであることに注意してください。つまり、各特定のコンポーネントにスコープされていません。それを示すのは非常に簡単です。

たとえば、ここでも header クラスを追加できます。そして、それは同じように見えますが、他のものを試してみましょう。

ヘッダーに footer クラスも追加してみましょう。そして、再び、あまり変わりませんが、ここで要素を検査すると、もちろんここでこれらのクラスの両方があります。

したがって、これらのスタイルはすべて同じ要素に適用され、最終的には同じコンポーネントに適用されます。

そして、再び、各コンポーネントは実際に独自のスタイルを含んでいませんが、index.CSS にあるグローバルスタイルを単純に使用しています。

小規模なアプリではこれで十分ですが、後ほど styled components を使うことで、コンポーネントごとに専用の CSS を持つ方法も学びます。

#### セマンティックな HTML 要素の使用

```jsx
function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Fast React Pizza Co.</h1>
      </header>

      <main className="menu">
        <h2>Our Menu</h2>
        <Pizza />
        <Pizza />
        <Pizza />
      </main>

      <footer className="footer">
        <p>We're currently open!</p>
      </footer>
    </div>
  );
}
```

#### CSS ファイルの例（index.css）

```css
.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 3.2rem;
}

.header {
  text-align: center;
  margin-bottom: 4.8rem;
}

.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4.8rem;
}

.pizza {
  display: flex;
  gap: 3.2rem;
}

.footer {
  font-size: 1.4rem;
}
```

### グローバルスタイルの特徴

外部 CSS ファイルでインポートしたスタイルは**グローバル**に適用されます：

```jsx
// 複数のコンポーネントで同じクラス名を使用可能
function Header() {
  return <header className="header">Header</header>;
}

function Footer() {
  return <footer className="header">Footer</footer>; // 同じスタイルが適用される
}
```

**メリット**：

- 従来の CSS 知識をそのまま活用
- 大きなスタイルシートの管理が容易

**注意点**：

- クラス名の衝突に注意
- 大規模アプリケーションでは管理が困難になる可能性

---

## 📦 Props の受け渡しと受け取り

### Props の基本概念の理解

ここからは、React のもう一つの基本概念「Props」について説明します。Props は、コンポーネント間でデータを渡す仕組みです。

具体的には、親コンポーネントから子コンポーネントへデータを渡すために使います。Props は親子間の通信チャンネルのようなものと考えてください。

これまで同じ Pizza コンポーネントを 3 回使ってきましたが、すべて同じデータでした。実際は、各コンポーネントに異なるデータを渡して個別にカスタマイズしたいですよね。

Props を使えば、それが可能になります。

### Props の実践的な実装

Props を使うには、2 つのステップがあります。

まず、親コンポーネントから子コンポーネントへ Props を渡します。次に、子コンポーネント側でその Props を受け取ります。

Props を渡す例は以下の通りです。

```jsx
function Menu() {
  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {/* Props を渡す */}
      <Pizza
        name="スピナーチピザ"
        ingredients="トマト、モッツァレラ、ほうれん草、リコッタチーズ"
        photoName="pizzas/spinaci.jpg"
        price={1800}
      />

      <Pizza
        name="フンギピザ"
        ingredients="トマト、モッツァレラ、マッシュルーム、玉ねぎ"
        photoName="pizzas/funghi.jpg"
        price={1800}
      />
    </main>
  );
}
```

これは、HTML の属性を書くのと非常に似ています。しかし、ここでは、これらを Props と呼びます。

そして今、2 番目のステップに進む必要があります。これは、実際にここの子コンポーネント内で Props を受け取ることです。

### Props の受け取りと使用

今のままでは、コンポーネントはこれら 4 つの Props が渡されたことを認識できません。

そこで、子コンポーネント側で props パラメータを受け取る必要があります。

```jsx
function Pizza(props) {
  // デバッグ用：propsの内容を確認
  console.log(props);

  return (
    <div className="pizza">
      <img src={props.photoName} alt={props.name} />
      <div>
        <h3>{props.name}</h3>
        <p>{props.ingredients}</p>
        <span>{props.price}</span>
      </div>
    </div>
  );
}
```

まず、props をコンソールに出力して中身を確認してみましょう。

props はオブジェクトとして渡され、name や pizza spinach などの値が含まれています。

React はこの関数を呼び出す際、props オブジェクトを渡します。このオブジェクトには、コンポーネントに渡した 4 つの props が含まれています。

この props オブジェクトを使って、各値を表示できます。

### Props の威力の実感

別のピザコンポーネントも作成してみましょう。ここで、props の便利さがよく分かります。

例えば、フンギピザを作成します。Props は渡す順番に関係なく、正しく受け取れます。

```jsx
<Pizza
  price={1800}
  name="フンギピザ"
  ingredients="トマト、モッツァレラ、マッシュルーム、玉ねぎ"
  photoName="pizzas/funghi.jpg"
/>
```

そして、そこにあります。素晴らしい！

### Props のデータ型

Props には、文字列・数値・ブール値・配列・オブジェクト、さらには他の React コンポーネントなど、さまざまな値を渡せます。

### Props の重要性

これで、Props の役割と使い方が分かりました。Props は親コンポーネントから子コンポーネントへデータを渡す仕組みです。つまり、コンポーネントツリーの下方向に情報を伝える手段です。

親子間のコミュニケーションには Props を使います。

Props は、コンポーネントを設定・カスタマイズするための重要な React の仕組みです。親コンポーネントが子コンポーネントの見た目や動作をコントロールする「設定」と考えてください。

Props は、通常の JavaScript 関数の引数と同じように、何でも渡すことができます。

そのため、どんな値でも props として渡すことができます。

### Props の重要な特徴

#### 1. Props はオブジェクト

React は渡された props を 1 つのオブジェクトにまとめます：

```javascript
// console.log(props) の出力例
{
  name: "スピナーチピザ",
  ingredients: "トマト、モッツァレラ、ほうれん草、リコッタチーズ",
  photoName: "pizzas/spinaci.jpg",
  price: 1800
}
```

#### 2. データ型の指定

```jsx
function Menu() {
  return (
    <div>
      {/* 文字列（デフォルト） */}
      <Pizza name="Margherita" />

      {/* 数値（JavaScript モード） */}
      <Pizza price={2250} />

      {/* 真偽値 */}
      <Pizza soldOut={true} />

      {/* 配列 */}
      <Pizza ingredients={["tomato", "mozzarella"]} />

      {/* オブジェクト */}
      <Pizza nutrition={{ calories: 300, protein: 12 }} />
    </div>
  );
}
```

**ポイント**：文字列以外のデータ型は波括弧`{}`で囲みます。

#### 3. Props の順番は関係ない

```jsx
// どちらも同じ結果
<Pizza name="Margherita" price={1500} />
<Pizza price={1500} name="Margherita" />
```

### 実践的な Pizza コンポーネントの実装

```jsx
function Pizza(props) {
  return (
    <li className="pizza">
      <img src={props.photoName} alt={props.name} />
      <div>
        <h3>{props.name}</h3>
        <p>{props.ingredients}</p>
        <span>¥{props.price + 450}</span> {/* 価格に450を加算 */}
      </div>
    </li>
  );
}
```

### 複数の Pizza コンポーネントの作成

```jsx
function Menu() {
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      <p>Authentic Italian cuisine. 6 creative dishes to choose from.</p>

      <ul className="pizzas">
        <Pizza
          name="スピナーチピザ"
          ingredients="トマト、モッツァレラ、ほうれん草、リコッタチーズ"
          price={1800}
          photoName="pizzas/spinaci.jpg"
        />

        <Pizza
          name="フンギピザ"
          ingredients="トマト、モッツァレラ、マッシュルーム、玉ねぎ"
          price={1800}
          photoName="pizzas/funghi.jpg"
        />

        <Pizza
          name="サラミーノピザ"
          ingredients="トマト、モッツァレラ、ペパロニ"
          price={2250}
          photoName="pizzas/salamino.jpg"
        />

        <Pizza
          name="プロシュート・ディ・パルマピザ"
          ingredients="トマト、モッツァレラ、ハム、ルッコラ、ブッラータチーズ"
          price={2700}
          photoName="pizzas/prosciutto.jpg"
        />
      </ul>
    </main>
  );
}
```

### Props のメリット

同じ`Pizza`コンポーネントを異なるデータで再利用することで、

- **コードの重複が減る**
- **保守性が高まる**
- **UI の一貫性が保てる**
- **開発効率の向上**

これが React のコンポーネントベース開発の真価です。

---

## 🔄 Props、不変性、一方向データフロー

### Props の深い理解

これまでのセッションで Props の基本的な使い方を学びましたが、ここでは Props のより深い考え方や React の設計思想について理解を深めます。

### Props の本質的な役割の理解

まず、Props が何かを改めて確認しましょう。Props は、親コンポーネントが子コンポーネントに設定を渡すための仕組みです。親が子をカスタマイズする方法と考えてください。

Props は通常の JavaScript 関数の引数とよく似ています。関数に引数を渡して処理するのと同じように、React コンポーネントも Props を受け取り、それを使って JSX を返します。

### React におけるデータの分類

React コンポーネントが扱うデータは主に 2 種類です。

1 つは Props（親から渡される外部データ）、もう 1 つは State（コンポーネント自身が持つ内部データ）です。

Props は外部から渡され、コンポーネント自身で変更できません。State はコンポーネントが所有し、時間とともに更新できます。

### Props の不変性（Immutability）の重要性

ここで重要なルールがあります。Props は不変（immutable）です。つまり、Props は読み取り専用で、変更してはいけません。

なぜこのルールがあるのでしょうか？Props を変更すると副作用が生じるからです。JavaScript ではオブジェクトは参照渡しなので、子コンポーネントで Props を変更すると親のデータも変わってしまいます。これは望ましくありません。

### 純粋関数としてのコンポーネント

さらに、React コンポーネントは純粋関数として動作する必要があります。純粋関数とは、同じ入力なら常に同じ出力を返し、副作用がない関数です。

純粋関数は外部の変数を変更したり、API を呼び出したり、タイマーを動かしたりしません。同じ引数なら必ず同じ結果を返します。

React コンポーネントも、同じ Props が与えられたら常に同じ JSX を返すべきです。これにより React アプリは予測可能になります。

### 一方向データフロー（One-Way Data Flow）の理解

React でもう一つ重要なのが「一方向データフロー」です。これは、データが親から子へ一方向に流れるという原則です。

つまり、データは常にコンポーネントツリーの下方向（親 → 子 → 孫）に流れます。

### 一方向データフローの利点

この一方向データフローのおかげで、アプリは予測しやすく、理解しやすく、デバッグもしやすくなります。

データの出どころが常に分かるので、子コンポーネントで問題が起きた場合も親から来ていることがすぐ分かります。

### 子から親へのデータ送信

ただし、時には子コンポーネントから親コンポーネントへデータを渡したい場面もあります。これはどうするのでしょうか？

実際には、子から親へ直接データを送ることはできません。代わりに、親が関数を Props として子に渡し、子がその関数を呼び出すことで親に通知します。

この場合、子は親から受け取った関数を呼び出すだけです。その関数は親の中で実行され、通常は親の State を更新します。

### まとめ：React の設計思想

Props の不変性、純粋関数としてのコンポーネント、一方向データフロー——これらは React の設計思想の中心です。これらの原則があることで、React アプリは予測しやすく、理解しやすく、デバッグもしやすくなります。

こうした制約があるからこそ、React は大規模で複雑なアプリ開発にも適しています。

### Props の不変性（Immutability）

#### 不変性の重要なルール

React で守るべき重要なルールのひとつが「Props は不変（immutable）」ということです。

Props は読み取り専用で、変更してはいけません。コンポーネントは受け取った Props を絶対に変更しないようにしましょう。

```jsx
function Pizza(props) {
  // ❌ 絶対にやってはいけない
  props.price = props.price + 15000; // エラー！
  props.name = "新しい名前"; // エラー！

  return <div>{props.name}</div>;
}
```

#### なぜ Props は不変なのか

##### 1. **副作用の防止**

まず、Props を変更すると副作用が生じるからです。JavaScript では、オブジェクトは参照によって渡されます。つまり、子コンポーネントで Props オブジェクトを変更すると、元のオブジェクト、つまり親コンポーネント内のオブジェクトも変更されてしまいます。これは明らかに望ましくありません。

```javascript
// JavaScriptオブジェクトの参照の例
const originalPizza = { name: "Margherita", price: 1500 };
const pizzaCopy = originalPizza;

pizzaCopy.price = 2250;
console.log(originalPizza.price); // 2250（元のオブジェクトも変更される！）
```

##### 2. **純粋関数の維持**

さらに重要なことは、React コンポーネントは純粋関数として動作する必要があるということです。純粋関数とは、同じ入力に対して常に同じ出力を返し、副作用を持たない関数のことです。

純粋関数は、外部の変数を変更したり、API を呼び出したり、タイマーを開始したりしません。そして、同じ引数で呼び出された場合、常に同じ結果を返します。

```jsx
// ✅ 純粋関数（推奨）
function Pizza(props) {
  // 外部データを変更せず、常に同じ入力に対して同じ出力
  return (
    <div>
      {props.name} - ¥{props.price}
    </div>
  );
}

// ❌ 不純な関数（非推奨）
function Pizza(props) {
  props.price = props.price * 1.1; // 外部データを変更
  return (
    <div>
      {props.name} - ¥{props.price}
    </div>
  );
}
```

React コンポーネントは、同じ Props が与えられた場合、常に同じ JSX を返すべきです。これにより React アプリは予測しやすくなります。

##### 3. **最適化とバグ防止**

不変性のおかげで、React は効率的な最適化ができ、予期しないバグも防げます。これが React が大規模開発に向いている理由のひとつです。

#### Props を変更したい場合の対処法

Props を変更したい場合は、**State**を使いましょう：

```jsx
function Pizza(props) {
  // props.price を直接変更する代わりに、state を使用
  const [currentPrice, setCurrentPrice] = useState(props.price);

  const increasePrice = () => {
    setCurrentPrice(currentPrice + 100); // state は変更可能
  };

  return (
    <div>
      <h3>{props.name}</h3>
      <p>¥{currentPrice}</p>
      <button onClick={increasePrice}>値上げ</button>
    </div>
  );
}
```

### 一方向データフロー（One-Way Data Flow）

#### 一方向データフローの理解

React でもう一つ重要なのが「一方向データフロー」です。これは、データが親から子へ一方向に流れるという原則です。

つまり、データは常にコンポーネントツリーの下方向（親 → 子 → 孫）に流れます。

```
App（親）
├── Header（子）
├── Menu（子）
│   ├── Pizza（孫）
│   ├── Pizza（孫）
│   └── Pizza（孫）
└── Footer（子）

データの流れ：App → Menu → Pizza（一方向のみ）
```

#### 一方向データフローの利点

この一方向データフローにより、アプリケーションはより予測可能になり、理解しやすくなり、デバッグしやすくなります。

データの出どころが常に分かるので、子コンポーネントで問題が起きた場合も親から来ていることがすぐ分かります。

```jsx
function App() {
  const [pizzas, setPizzas] = useState(pizzaData);

  return (
    <div>
      {/* データの流れが明確 */}
      <Menu pizzas={pizzas} />  {/* App → Menu */}
    </div>
  );
}

function Menu({ pizzas }) {
  return (
    <div>
      {pizzas.map(pizza => (
        <Pizza key={pizza.id} {...pizza} />  {/* Menu → Pizza */}
      ))}
    </div>
  );
}
```

#### 子から親へのデータ送信

ただし、時には子コンポーネントから親コンポーネントへデータを渡したい場面もあります。これはどうするのでしょうか？

実際には、子から親へ直接データを送ることはできません。代わりに、親が関数を Props として子に渡し、子がその関数を呼び出すことで親に通知します。

この場合、子は親から受け取った関数を呼び出すだけです。その関数は親の中で実行され、通常は親の State を更新します。

```jsx
function App() {
  const [selectedPizza, setSelectedPizza] = useState(null);

  return (
    <div>
      <Menu onPizzaSelect={setSelectedPizza} />  {/* 関数を渡す */}
      {selectedPizza && <p>選択: {selectedPizza.name}</p>}
    </div>
  );
}

function Menu({ onPizzaSelect }) {
  return (
    <div>
      <Pizza
        name="Margherita"
        onClick={() => onPizzaSelect({ name: "Margherita" })}  {/* 関数を呼び出す */}
      />
    </div>
  );
}
```

#### 他のフレームワークとの比較

| フレームワーク | データフロー         | 特徴                           |
| -------------- | -------------------- | ------------------------------ |
| **React**      | 一方向               | 予測しやすい、デバッグしやすい |
| **Angular**    | 双方向               | 便利だが複雑になりがち         |
| **Vue.js**     | 双方向（オプション） | 柔軟だが注意が必要             |

この一方向データフローは、React アプリを予測しやすく、理解しやすく、デバッグしやすくする重要な特徴です。

### まとめ：React の設計思想

1. **Props は不変**：子コンポーネントで変更不可
2. **一方向データフロー**：親から子へのみデータが流れる
3. **純粋関数**：同じ入力に対して同じ出力
4. **予測可能性**：データの流れが明確で理解しやすい

これらの制約があることで、React アプリは

- **保守しやすい**
- **デバッグしやすい**
- **スケールしやすい**

コードベースを作ることができます。

---

## 📋 JSX のルール

### JSX を正しく使うための重要な規則

JSX の動作ルールを簡単に確認しましょう。

一般的な JSX ルールと、JSX と HTML の違いに関するルールがあります。

### 一般的な JSX ルール

#### 1. **JSX は基本的に HTML と同じ構文**

JSX は基本的に HTML と同じように動作します。

```jsx
function Header() {
  return (
    <header>
      <h1>Fast React Pizza Co.</h1>
      <p>Welcome to our restaurant!</p>
    </header>
  );
}
```

#### 2. **波括弧で JavaScript モードに入る**

JSX の中で動的な値や式を使用する場合は、波括弧`{}`を使用して JavaScript モードに入ります：

```jsx
function Pizza({ name, price, ingredients }) {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="pizza">
      <h3>{name}</h3> {/* 変数 */}
      <p>{ingredients}</p> {/* 変数 */}
      <span>¥{price}</span> {/* 変数 */}
      <p>注文時刻: {currentTime}</p> {/* 関数呼び出し */}
      <p>税込価格: ¥{price * 1.1}</p> {/* 計算式 */}
    </div>
  );
}
```

#### 3. **JavaScript 式のみ使用可能**

波括弧内では**式（Expression）**のみ使え、**文（Statement）**は使えません：

```jsx
function Menu({ isOpen }) {
  return (
    <div>
      {/* ✅ 式（使用可能） */}
      <h2>{isOpen ? "営業中" : "閉店中"}</h2>
      <p>{new Date().getHours()}</p>
      <p>{[1, 2, 3].map((n) => n * 2)}</p>

      {/* ❌ 文（使用不可） */}
      {/* {if (isOpen) return "営業中"} */}
      {/* {for (let i = 0; i < 3; i++) console.log(i)} */}
      {/* {const message = "Hello"} */}
    </div>
  );
}
```

**式と文の違い**：

- **式**：値を返すもの（`2 + 3`、`isOpen ? "開店" : "閉店"`、`array.map()`）
- **文**：処理を実行するもの（`if`、`for`、`const`、`function`）

#### 4. **JSX 自体も JavaScript 式**

JSX は`React.createElement()`の呼び出しに変換されるため、JavaScript 式として扱えます：

```jsx
function Menu({ isOpen }) {
  // JSXを変数に代入
  const closedMessage = <p>申し訳ございません。現在閉店中です。</p>;

  // JSXをif文で使用
  if (!isOpen) {
    return (
      <div className="menu">
        <h2>Our Menu</h2>
        {closedMessage}
      </div>
    );
  }

  return renderOpenMenu();
}
```

// ...（重複部分を削除し、説明を簡潔にまとめます）
<h3>{name}</h3>

      {/* 条件付きレンダリング */}
      {soldOut && <span className="sold-out">SOLD OUT</span>}

      {/* 三項演算子でJSXを返す */}
      {soldOut ? (
        <p className="unavailable">現在品切れです</p>
      ) : (
        <button className="order-btn">注文する</button>
      )}
    </div>

);
}

````

### JSX と HTML の違い

JSX と HTML の違いに関するルールもいくつかあります。

#### 1. **`className` vs `class`**

最も重要な違いの一つは、HTML では`class`属性を使用しますが、JSX では`className`を使用することです。

```jsx
// ❌ HTML（JSXでは警告）
<div class="container">

// ✅ JSX
<div className="container">
````

**理由**：`class`は JavaScript の予約語のため、JSX では`className`を使用する必要があります。

ちなみに、このような JSX ルールは他にもいくつかありますが、このセクションで後ほど詳しく説明します。

#### 2. **`htmlFor` vs `for`**

```jsx
// ❌ HTML（JSXでは警告）
<label for="email">Email:</label>

// ✅ JSX
<label htmlFor="email">Email:</label>
```

#### 3. **イベントハンドラーの命名**

```jsx
// HTML
<button onclick="handleClick()">Click</button>

// JSX（camelCase）
<button onClick={handleClick}>Click</button>
```

#### 4. **自己終了タグ**

```jsx
// HTML（どちらでも可）
<img src="pizza.jpg">
<img src="pizza.jpg" />

// JSX（自己終了タグが必須）
<img src="pizza.jpg" />
<br />
<hr />
```

#### 5. **属性値の指定**

```jsx
// HTML
<input type="text" disabled>

// JSX
<input type="text" disabled={true} />
// または
<input type="text" disabled />
```

これらのルールは、JSX が JavaScript の拡張であり、HTML とは少し違うことを示しています。でも、慣れてしまえば JSX はとても自然に使えるようになります。

### JSX の構造ルール

#### 1. **単一のルート要素**

JSX は必ず 1 つのルート要素を返す必要があります：

```jsx
// ❌ 複数のルート要素（エラー）
function App() {
  return (
    <h1>Title</h1>
    <p>Content</p>
  );
}

// ✅ 単一のルート要素
function App() {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}

// ✅ React Fragment を使用
function App() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}
```

#### 2. **適切なネスト**

```jsx
// ✅ 正しいネスト
function Pizza() {
  return (
    <div className="pizza">
      <img src="pizza.jpg" alt="Pizza" />
      <div className="pizza-info">
        <h3>Pizza Name</h3>
        <p>Ingredients</p>
      </div>
    </div>
  );
}
```

### JSX の実践例

```jsx
function Menu() {
  const pizzas = [
    { id: 1, name: "マルゲリータピザ", price: 1800, soldOut: false },
    { id: 2, name: "フンギピザ", price: 2100, soldOut: true },
    {
      id: 3,
      name: "プロシュート・ディ・パルマピザ",
      price: 2400,
      soldOut: false,
    },
  ];

  const isOpen = new Date().getHours() >= 12 && new Date().getHours() <= 22;

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {/* 条件付きレンダリング */}
      {isOpen ? (
        <>
          <p>本格イタリア料理をお楽しみください。</p>

          {/* 配列のレンダリング */}
          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza
                key={pizza.id}
                name={pizza.name}
                price={pizza.price}
                soldOut={pizza.soldOut}
              />
            ))}
          </ul>
        </>
      ) : (
        <p>申し訳ありません。12:00〜22:00の間にお越しください。</p>
      )}
    </main>
  );
}

function Pizza({ name, price, soldOut }) {
  return (
    <li className={`pizza ${soldOut ? "sold-out" : ""}`}>
      <div className="pizza-info">
        <h3>{name}</h3>
        <p className="price">{soldOut ? "SOLD OUT" : `¥${price}`}</p>
      </div>
      {/* 条件付きレンダリング */}
      {!soldOut && <button className="order-btn">注文する</button>}
    </li>
  );
}
```

### JSX のベストプラクティス

#### 1. **読みやすい構造を意識する**

```jsx
// ✅ 読みやすい構造
function Menu({ pizzas, isOpen }) {
  if (!isOpen) {
    return (
      <div className="menu">
        <h2>申し訳ありません</h2>
        <p>12:00〜22:00の間にお越しください。</p>
      </div>
    );
  }

  return (
    <div className="menu">
      <h2>Our Menu</h2>
      <div className="pizzas">
        {pizzas.map((pizza) => (
          <Pizza key={pizza.id} {...pizza} />
        ))}
      </div>
    </div>
  );
}
```

#### 2. **適切な key 属性の使用**

```jsx
// ✅ 一意のkeyを使用
{
  pizzas.map((pizza) => <Pizza key={pizza.id} name={pizza.name} />);
}

// ❌ インデックスをkeyに使用（推奨されない）
{
  pizzas.map((pizza, index) => <Pizza key={index} name={pizza.name} />);
}
```

#### 3. **条件付きレンダリングの使い分け**

```jsx
function Pizza({ name, soldOut, price }) {
  return (
    <div className="pizza">
      <h3>{name}</h3>

      {/* 短い条件：&& 演算子 */}
      {soldOut && <span className="sold-out">SOLD OUT</span>}

      {/* 長い条件：三項演算子 */}
      {soldOut ? (
        <div className="unavailable">
          <p>申し訳ございません</p>
          <p>現在品切れ中です</p>
        </div>
      ) : (
        <div className="available">
          <p>¥{price}</p>
          <button>注文する</button>
        </div>
      )}
    </div>
  );
}
```

---

## 🎓 このセッションのまとめ

### 習得したスキル

この Session3 では、React アプリ開発における重要な概念を学びました：

#### 🎨 スタイリング

- **インラインスタイル**：JavaScript オブジェクトとしてのスタイル定義
- **外部 CSS ファイル**：従来の CSS 知識の活用方法
- **className 属性**：JSX でのクラス名指定の正しい方法
- **グローバルスタイル**：CSS ファイルインポートの仕組み

#### 📦 Props

- **Props の基本概念**：親から子へのデータ受け渡し
- **Props の受け渡し方法**：属性としてのデータ指定
- **Props の受け取り方法**：関数パラメータとしての props オブジェクト
- **データ型の指定**：文字列、数値、真偽値、配列、オブジェクトの渡し方

#### 🔄 React の設計思想

- **Props の不変性**：読み取り専用の重要性
- **一方向データフロー**：予測可能なデータの流れ
- **純粋関数**：副作用のないコンポーネント設計
- **State vs Props**：内部データと外部データの違い

#### 📋 JSX のルール

- **JavaScript 式の使用**：波括弧内での動的な値の表現
- **JSX と HTML の違い**：className、htmlFor、camelCase 記法
- **構造ルール**：単一ルート要素、適切なネスト
- **条件付きレンダリング**：&& 演算子と三項演算子の使い分け

### 次のステップ

Session3 で学んだ知識をもとに、次のセッションでは以下の内容を学ぶ予定です：

- **State（状態）の管理**：コンポーネント内部データの扱い方
- **イベントハンドリング**：ユーザーインタラクションへの対応
- **子から親へのデータ送信**：コールバック関数の活用
- **より複雑なアプリケーション構造**：実践的なプロジェクト開発

### 実践課題

学んだ内容を定着させるために、次の課題に挑戦してみましょう：

1. **スタイリング練習**：既存の Pizza コンポーネントに独自のスタイルを適用
2. **Props 活用**：新しいプロパティ（評価、調理時間など）を追加
3. **条件付きレンダリング**：営業時間や在庫状況に応じた表示切り替え
4. **JSX ルール確認**：意図的にルールを破ってエラーメッセージを確認

### 開発のコツ

- **React Developer Tools**：ブラウザ拡張機能で Props と State を確認
- **console.log**：Props の内容を確認してデバッグ
- **段階的な実装**：小さな変更から始めて徐々に複雑化
- **エラーメッセージの活用**：React の親切なエラーメッセージを読む習慣

---

**Session2 から Session3 への学習の流れ**：

- Session2：JSX とコンポーネントの基礎 → **静的なコンポーネント**
- Session3：スタイリングと Props → **再利用可能なコンポーネント**
- 次回：State とイベントハンドリング → **インタラクティブなコンポーネント**

この段階的な学習で、React の核心概念をしっかり理解し、実践的なアプリ開発スキルを身につけましょう。

**最終プロジェクト**：[`react/STEP01_基礎/session2_project/final`](react/STEP01_基礎/session2_project/final) では、これらの概念がすべて統合された完成形を確認できます。
<button className="order-btn">
