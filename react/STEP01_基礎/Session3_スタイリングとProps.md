
# Session3: スタイリングとProps

## 🎯 このセッションで学ぶこと

Session2で学んだJSXとコンポーネント設計の知識を発展させ、より実践的なReactアプリケーション開発を目指します：

- **🎨 Reactスタイリング**：インラインスタイルと外部CSSファイルの活用方法
- **📦 Props の基礎**：コンポーネント間でのデータ受け渡しの仕組み
- **🔄 Props の不変性**：一方向データフローとReactの設計思想
- **📋 JSXのルール**：JSXを正しく使うための重要な規則

Session2で構築したピザメニューアプリケーションにスタイリングを適用し、Propsを使ってコンポーネントを再利用可能にしていきます。

**最終プロジェクト参照**: [`react/STEP01_基礎/session2_project/final`](react/STEP01_基礎/session2_project/final)

---

## 🎨 Reactアプリケーションのスタイリング

### Reactにおけるスタイリングの理解

この時点で、ReactコンポーネントにはCSSスタイルも含めることができることがわかります。そこで、ReactアプリケーションにCSSを適用するいくつかの簡単な方法について学びましょう。

Reactでは、コンポーネントをスタイリングする多くの異なる方法があり、Reactはそれをどのように行うかについて実際には気にしません。スタイリングについて意見を持っていません。

その理由は、最初に学んだように、Reactは実際にはフレームワークというよりもライブラリだからです。したがって、コンポーネントをスタイリングする好ましい方法がなく、最終的にはアプリケーションをスタイリングする方法がないため、多くの異なるオプションから選択できます。

### Reactで利用可能なスタイリング手法

たとえば、以下のような方法があります：

- **インラインスタイル**：JSXの`style`属性を使用
- **外部CSSファイル**：従来のCSS/Sassファイルをインポート
- **CSSモジュール**：スコープ化されたCSS
- **Styled Components**：CSS-in-JS ライブラリ
- **Tailwind CSS**：ユーティリティファーストCSS

この講義では、もちろんこれらすべてについて説明するわけではありませんが、後で多くについて話します。

今のところ、インラインCSSを使用し、その後外部CSSファイルも含めたいと思います。

### インラインスタイルの実装

#### HTMLとJSXの違い

ご存知のように、HTMLでは、実際にこのstyle属性を使用して要素をスタイリングできます。

```html
<!-- HTML -->
<h1 style="color: red; font-size: 48px;">Fast React Pizza Co.</h1>
```

そして、HTMLでは、これらのスタイルを文字列でこのように書きます。

しかし、JSXでは、そのようには動作しません。JSXでは、実際にJavaScriptオブジェクトを使用してインラインスタイルを定義する必要があります。

JavaScriptオブジェクトを書く必要がある場合、まずJavaScriptモードに入る必要があります。それが波括弧の目的です。しかし、その後、別の波括弧のセットが必要です。そして、それは再び、今度はオブジェクトを作成するためです。

```jsx
// JSX
function Header() {
  return (
    <h1 style={{ color: "red", fontSize: "48px" }}>
      Fast React Pizza Co.
    </h1>
  );
}
```

そして、ここで今、いくつかのプロパティを定義できます。このテキスト、つまりこのH1テキストを赤い色でスタイリングしたいとしましょう。

そして今、保存すると、そこにあります、変わりました。

そして、これで、JSXでコンポーネントをスタイリングする最も簡単な方法があります。つまり、HTMLでも利用可能なstyle属性を単純に使用することです。

### より詳細なスタイリング例

HTMLでは、基本的にこれを使用することはありません。それは、前の講義で話した関心の分離のためです。つまり、常にCSSを別のファイルに置き、マークアップと混合することはありませんでした。

しかし、ここReactでは、今発見したように、それを行うことは完全に問題なく、自然です。

別のものを試してみましょう。fontSize、CSSではこのように書きますよね？font-sizeですが、JavaScriptでは、それは有効なプロパティ名ではありません。

したがって、すべてのCSSプロパティ名は、基本的にJSXでこのキャメルケース記法に変換されています。そのため、fontSizeをこのように書く必要があります。

```jsx
function Header() {
  const style = {
    color: "red",
    fontSize: "48px",
    textTransform: "uppercase"
  };
  
  return (
    <h1 style={style}>
      Fast React Pizza Co.
    </h1>
  );
}
```

48ピクセルと言いましょう。そして、JavaScriptオブジェクトを書いているので、この値は常に文字列である必要があります。

別のものを試してみましょう。textTransform。そして、VS Codeが常にここで利用可能なオプションを表示することがわかります。

これらのプロパティ値を常に文字列として書くようにしてください。なぜなら、これは最終的に単なるJavaScriptオブジェクトだからです。

そして、これをここから抽出することもできます。これを切り取って、ここで変数を作成しましょう。const style、そしてもちろん任意の変数名にできます。

そして、それをここに配置します。そして、すべてまだ同じに見えます。

素晴らしい。これが、個々のコンポーネントにスタイリングを追加する最も簡単な方法です。

#### インラインスタイルの記述方法

```jsx
function Header() {
  // スタイルオブジェクトを変数として定義
  const headerStyle = {
    color: "red",
    fontSize: "48px",
    textTransform: "uppercase",
    textAlign: "center"
  };

  return (
    <header>
      <h1 style={headerStyle}>Fast React Pizza Co.</h1>
    </header>
  );
}
```

**重要なポイント**：
- **二重の波括弧**：`{{ }}`は外側がJavaScriptモード、内側がオブジェクト
- **camelCase記法**：`font-size` → `fontSize`、`text-transform` → `textTransform`
- **文字列値**：すべてのCSS値は文字列として記述（`"48px"`、`"red"`）

#### 動的スタイリングの例

```jsx
function Pizza({ soldOut }) {
  const pizzaStyle = {
    opacity: soldOut ? 0.6 : 1,
    filter: soldOut ? "grayscale(100%)" : "none"
  };

  return (
    <div className="pizza" style={pizzaStyle}>
      {/* ピザの内容 */}
    </div>
  );
}
```

### 外部CSSファイルの活用

#### より実用的なアプローチ

しかし、アプリケーションが少し大きくなると、手に負えなくなり、このようにスタイルを書くのは多くの作業になる可能性があります。つまり、これらの各コンポーネントに対してオブジェクトを作成することは、完全に実行可能ですが、実際の世界でそれを行う人はあまり見かけません。

今、私たちができることの一つは、実際に外部CSSファイルを含めることです。これまでアプリケーションで常に行ってきたのと同じです。

そして、それがReactアプリケーションをスタイリングする最も簡単な方法だと思います。これは基本的に他のWebページをスタイリングするのと同じです。

#### CSSファイルのインポート

その場合、前の講義で学んだ方法でCSS関心をJavaScriptとHTML関心と実際に混合しているわけではありませんが、もちろんそれは問題ではありません。

そして、styled componentsと呼ばれるものを使用して、少し後でそれを行う方法も学びます。

しかし、今のところ、この講義の最初に含めたCSSファイルを見てみましょう。

そして、これは、ここにいくつかのクラスがある非常に標準的なCSSファイルです。

そして今、これらのクラスが適用されるように、JSX要素にこれらのクラス名を追加する必要があります。

そこで、戻って、クラスを追加する前に、まずこのCSSファイルをインポートする必要があります。

```jsx
import './index.css'; // CSSファイルをインポート
```

現在、アプリケーションはCSSファイルがプロジェクトに存在することを知る方法がありません。そこで、ここで行う必要があることは、単純にそのファイルをインポートすることです。

そして、再び、実際にはWebpackが、CSSファイルからスタイルを取り出して、アプリケーションに注入することを処理します。

#### JSXでのクラス名指定

そして、すでに物事がここで変わったのがわかります。背景色が異なり、フォントファミリーが変わりました。そして、ページの下部にこの素敵な黄色いボーダーも表示されます。

そのため、Webpackがすぐにこれらのスタイルをアプリケーションに含めたことがわかります。

しかし、今度はクラスを追加しましょう。containerがあり、header、menu、そしておそらくfooterがあることがわかります。

ここで、containerのクラスを追加しましょう。まず間違った方法でやってみます。

```jsx
// ❌ 間違い（警告が表示される）
<div class="container">
```

HTMLで行うようにclassと書きますが、Reactは実際に警告します。

ここで、「Invalid DOM property class did you mean className?」と表示されます。

そして、これがJSXの重要なルールの一つです。JSXでは、classを使用できませんが、代わりにclassNameを使用します。

```jsx
// ✅ 正しい
<div className="container">
```

これは一般的な初心者の間違いですが、今警告されました。ここではまだ何らかの形で動作しますが、JSXでclassを使用することは本当に想定されていません。

おそらく、classは既にJavaScriptの予約キーワードだからです。

#### セマンティックなHTML要素の使用

しかし、ここで続けましょう。再び、ここでheaderのクラス名を追加しましょう。

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

実際に、ここで最初にheader要素を持つことになっているからです。そして、そのクラスはそこに行くべきです。

これは、header要素がここでは単純にH1を持つよりも少し適しているセマンティックHTMLまたはセマンティックマークアップです。

次に、ここでmenuのクラスを追加しましょう。そして、再び、それはclassNameです。

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

そして、セマンティックマークアップについて話していたので、実際にmainタグ、つまりmain HTML要素を使用しましょう。

美しい。そのため、メニューにこの素敵なスタイリングが適用されているのがわかります。

次に、ここでこのクラス名があります。これは単純にfooterになります。

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

これで、実際にアプリケーションにスタイリングが適用されました。そして、述べたように、この外部CSSスタイルシートからこれらのスタイルを取得しています。これは、このimport構文を使用して単純にここでインポートしたことを覚えておいてください。これにより、Webpackがスタイルをアプリケーションにインポートします。

そして、ここで、classNameを使用し、classは使用しないことを覚えておいてください。なぜなら、classは既にJavaScriptの予約キーワードだからです。

ちなみに、このようなJSXルールは他にもいくつかあり、このセクションで少し後で話します。

今のところ、ここに含めたスタイルがグローバルスタイルであることに注意してください。つまり、各特定のコンポーネントにスコープされていません。それを示すのは非常に簡単です。

たとえば、ここでもheaderクラスを追加できます。そして、それは同じように見えますが、他のものを試してみましょう。

ヘッダーにfooterクラスも追加してみましょう。そして、再び、あまり変わりませんが、ここで要素を検査すると、もちろんここでこれらのクラスの両方があります。

したがって、これらのスタイルはすべて同じ要素に適用され、最終的には同じコンポーネントに適用されます。

そして、再び、各コンポーネントは実際に独自のスタイルを含んでいませんが、index.CSSにあるグローバルスタイルを単純に使用しています。

これは小さなアプリでは問題なく動作しますが、後で別のプロジェクトでstyled componentsと呼ばれるものも使用します。そうすれば、本当に1つのコンポーネントにのみ属するCSSを持つことができます。

#### セマンティックなHTML要素の使用

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

#### CSSファイルの例（index.css）

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

外部CSSファイルでインポートしたスタイルは**グローバル**に適用されます：

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
- 従来のCSS知識をそのまま活用
- 大きなスタイルシートの管理が容易

**注意点**：
- クラス名の衝突に注意
- 大規模アプリケーションでは管理が困難になる可能性

---

## 📦 Propsの受け渡しと受け取り

### Propsの基本概念の理解

今度は、Reactのもう一つの基本的な概念であるPropsを紹介する時が来ました。Propsは本質的に、コンポーネント間でデータを渡す方法です。

より具体的には、Propsを使用して、親コンポーネントから子コンポーネントにデータを渡します。したがって、Propsを親と子コンポーネント間の通信チャンネルのようなものと想像することができます。

これまで、同じPizzaコンポーネントを3回使用してきましたが、すべて同じデータを表示していました。しかし、実際には、各コンポーネントに異なるデータを渡して、それぞれをカスタマイズしたいのです。

そして今、Propsについて学ぶことで、それができるようになります。

### Propsの実践的な実装

Propsを定義するには、2つのステップで行います。

まず、コンポーネントにPropsを渡し、次に、それらを渡したコンポーネント内でPropsを受け取ります。

ここで、これらのPropsを渡す場所です。そして、このように書きます。

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

これは、HTMLの属性を書くのと非常に似ています。しかし、ここでは、これらをPropsと呼びます。

そして今、2番目のステップに進む必要があります。これは、実際にここの子コンポーネント内でPropsを受け取ることです。

### Propsの受け取りと使用

現在、もちろん、コンポーネントはこれら4つのPropsが渡されたことを知る方法がありません。

そこで、その方法は、このコンポーネントでpropsパラメータを受け入れることです。

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

そして、まず始めに、このpropsをコンソールにログ出力して、何が起こっているかを見てみましょう。

すでにここで何かを見ることができます。このpropsは基本的にここにあるこのオブジェクトです。そして、それにはname、そしてpizza spinachがあり、これはまさにこれです。

基本的に、Reactはこの関数を呼び出し、このpropsオブジェクトを渡しました。そして、このpropsオブジェクトは、コンポーネントに渡したこれら4つのpropsで構成されています。

そして今、このpropsオブジェクトを使用して、ここのすべての値を置き換えることができます。

### Propsの威力の実感

別のピザコンポーネントを作成しましょう。そして、これがpropsがなぜそれほど有用であるかを見る場所です。

フンギピザを作成しましょう。そして、これは、Propsを渡す順序が完全に無関係であることを示すためです。

```jsx
<Pizza
  price={1800}
  name="フンギピザ"
  ingredients="トマト、モッツァレラ、マッシュルーム、玉ねぎ"
  photoName="pizzas/funghi.jpg"
/>
```

そして、そこにあります。素晴らしい！

### Propsのデータ型

Propsには、文字列、数値、ブール値、配列、オブジェクト、さらには他のReactコンポーネントなど、あらゆる種類の値を渡すことができます。

Propsは本当に本当に強力で、Reactで最も基本的なことの一つです。

### Propsの重要性

これで、Propsが何であるか、そして実際にそれらをどのように使用するかがわかりました。Propsは、親コンポーネントから子コンポーネントにデータを渡すために使用します。本質的に、コンポーネントツリーの下に情報を渡すためです。

これは、本質的に、親と子コンポーネント間でコミュニケーションを取るためにPropsを使用することを意味します。

したがって、Propsは、コンポーネントを設定し、カスタマイズするための重要なReactツールです。Propsを、親コンポーネントが子コンポーネントがどのように見え、どのように動作するかを制御するために使用できる設定として想像することができます。

その点で、Propsは通常のJavaScript関数に渡される引数と同じです。また、JavaScript関数には何でも渡すことができますよね？そして、実際にPropsについても同じことが言えます。

したがって、あらゆる種類の値をpropとして渡すことができます。

### Props の重要な特徴

#### 1. Props はオブジェクト

Reactは渡されたpropsを1つのオブジェクトにまとめます：

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

**重要**：文字列以外のデータ型は波括弧`{}`で囲む必要があります。

#### 3. Props の順序は無関係

```jsx
// どちらも同じ結果
<Pizza name="Margherita" price={1500} />
<Pizza price={1500} name="Margherita" />
```

### 実践的なPizza コンポーネントの実装

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

### 複数のPizza コンポーネントの作成

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

### Props の威力を実感

同じ`Pizza`コンポーネントを異なるデータで再利用することで：

- **コードの重複を削減**
- **保守性の向上**
- **一貫性のあるUI**
- **開発効率の向上**

これがReactのコンポーネントベース開発の真価です。

---

## 🔄 Props、不変性、一方向データフロー

### Props の深い理解

これまでのセッションでPropsの基本的な使用方法を学びましたが、ここではPropsのより深い概念と、Reactの設計思想について理解を深めましょう。

### Props の本質的な役割の理解

まず、Propsが実際に何であるかを理解することから始めましょう。Propsは、親コンポーネントが子コンポーネントに設定を渡すために使用されます。これは、親コンポーネントが子コンポーネントをカスタマイズする方法と考えることができます。

実際、Propsは通常のJavaScript関数の引数と非常に似ています。通常のJavaScript関数では、関数を呼び出すときに引数を渡し、関数はその引数を使用して何らかの処理を行います。Reactコンポーネントでも同様に、コンポーネントを使用するときにPropsを渡し、コンポーネントはそのPropsを使用してJSXを返します。

### React におけるデータの分類

Reactコンポーネントが扱うデータには、基本的に2つの種類があります。

まず、Propsがあります。これは、親コンポーネントから来る外部データです。そして、Stateがあります。これは、コンポーネントの内部データです。

Propsは、コンポーネントの外部から来るデータであり、コンポーネント自体によって変更することはできません。一方、Stateは、コンポーネントによって所有され、時間とともに更新できる内部データです。

### Props の不変性（Immutability）の重要性

ここで非常に重要なルールがあります。Propsは不変（immutable）です。つまり、Propsは読み取り専用であり、変更してはいけません。コンポーネントは、受け取ったPropsを決して変更してはいけません。

なぜこのルールが存在するのでしょうか？まず、Propsを変更すると副作用が生じるからです。JavaScriptでは、オブジェクトは参照によって渡されます。つまり、子コンポーネントでPropsオブジェクトを変更すると、元のオブジェクト、つまり親コンポーネント内のオブジェクトも変更されてしまいます。これは明らかに望ましくありません。

### 純粋関数としてのコンポーネント

さらに重要なことは、Reactコンポーネントは純粋関数として動作する必要があるということです。純粋関数とは、同じ入力に対して常に同じ出力を返し、副作用を持たない関数のことです。

純粋関数は、外部の変数を変更したり、APIを呼び出したり、タイマーを開始したりしません。そして、同じ引数で呼び出された場合、常に同じ結果を返します。

Reactコンポーネントに関しては、同じPropsが与えられた場合、コンポーネントは常に同じJSXを返す必要があります。これにより、Reactアプリケーションが予測可能になります。

### 一方向データフロー（One-Way Data Flow）の理解

Reactにおけるもう一つの重要な原則は、一方向データフローです。これは、Reactアプリケーションでは、データが親から子コンポーネントへと一方向にのみ流れることを意味します。

つまり、データは常にコンポーネントツリーを下に向かって流れます。親から子へ、そしてその子からさらにその子へと流れていきます。

### 一方向データフローの利点

この一方向データフローにより、アプリケーションはより予測可能になり、理解しやすくなり、デバッグしやすくなります。

データがどこから来ているかを常に知ることができるからです。子コンポーネントで何か問題が発生した場合、その問題は親コンポーネントから来ていることがわかります。

### 子から親へのデータ送信

しかし、時には子コンポーネントから親コンポーネントにデータを送信する必要があります。これはどのように行うのでしょうか？

実際には、子コンポーネントから親コンポーネントに直接データを送信することはできません。代わりに、親コンポーネントから子コンポーネントに関数をPropsとして渡し、子コンポーネントがその関数を呼び出すことで、親コンポーネントにデータを「送信」します。

しかし、これは実際にはデータを送信しているのではありません。子コンポーネントは単に親コンポーネントから受け取った関数を呼び出しているだけです。そして、その関数は親コンポーネント内で実行され、通常は親コンポーネントのStateを更新します。

### まとめ：Reactの設計思想

これらすべての概念、つまりPropsの不変性、純粋関数としてのコンポーネント、一方向データフローは、Reactの設計思想の核心部分です。これらの原則により、Reactアプリケーションは予測可能で、理解しやすく、デバッグしやすくなります。

そして、これらの制約があるからこそ、Reactは大規模で複雑なアプリケーションを構築するのに適したフレームワークとなっているのです。

### Props の不変性（Immutability）

#### 不変性の重要なルール

そして、これがReactが私たちに与える数少ない厳格なルールの一つをもたらします。それは、Propsは不変（immutable）であるということです。

これは、Propsは読み取り専用であり、変更してはいけないことを意味します。コンポーネントは、受け取ったPropsを決して変更してはいけません。

```jsx
function Pizza(props) {
  // ❌ 絶対にやってはいけない
  props.price = props.price + 15000;  // エラー！
  props.name = "新しい名前";        // エラー！
  
  return <div>{props.name}</div>;
}
```

#### なぜ Props は不変なのか

##### 1. **副作用の防止**

まず、Propsを変更すると副作用が生じるからです。JavaScriptでは、オブジェクトは参照によって渡されます。つまり、子コンポーネントでPropsオブジェクトを変更すると、元のオブジェクト、つまり親コンポーネント内のオブジェクトも変更されてしまいます。これは明らかに望ましくありません。

```javascript
// JavaScriptオブジェクトの参照の例
const originalPizza = { name: "Margherita", price: 1500 };
const pizzaCopy = originalPizza;

pizzaCopy.price = 2250;
console.log(originalPizza.price); // 2250（元のオブジェクトも変更される！）
```

##### 2. **純粋関数の維持**

さらに重要なことは、Reactコンポーネントは純粋関数として動作する必要があるということです。純粋関数とは、同じ入力に対して常に同じ出力を返し、副作用を持たない関数のことです。

純粋関数は、外部の変数を変更したり、APIを呼び出したり、タイマーを開始したりしません。そして、同じ引数で呼び出された場合、常に同じ結果を返します。

```jsx
// ✅ 純粋関数（推奨）
function Pizza(props) {
  // 外部データを変更せず、常に同じ入力に対して同じ出力
  return <div>{props.name} - ¥{props.price}</div>;
}

// ❌ 不純な関数（非推奨）
function Pizza(props) {
  props.price = props.price * 1.1;  // 外部データを変更
  return <div>{props.name} - ¥{props.price}</div>;
}
```

Reactコンポーネントに関しては、同じPropsが与えられた場合、コンポーネントは常に同じJSXを返す必要があります。これにより、Reactアプリケーションが予測可能になります。

##### 3. **最適化とバグ防止**

不変性により、Reactは効率的な最適化を行い、予期しないバグを防げます。これは、Reactが大規模で複雑なアプリケーションを構築するのに適したフレームワークとなっている理由の一つです。

#### Props を変更したい場合の対処法

Props を変更したい場合は、**State** を使用します：

```jsx
function Pizza(props) {
  // props.price を直接変更する代わりに、state を使用
  const [currentPrice, setCurrentPrice] = useState(props.price);
  
  const increasePrice = () => {
    setCurrentPrice(currentPrice + 100);  // state は変更可能
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

Reactにおけるもう一つの重要な原則は、一方向データフローです。これは、Reactアプリケーションでは、データが親から子コンポーネントへと一方向にのみ流れることを意味します。

つまり、データは常にコンポーネントツリーを下に向かって流れます。親から子へ、そしてその子からさらにその子へと流れていきます。

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

データがどこから来ているかを常に知ることができるからです。子コンポーネントで何か問題が発生した場合、その問題は親コンポーネントから来ていることがわかります。

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

しかし、時には子コンポーネントから親コンポーネントにデータを送信する必要があります。これはどのように行うのでしょうか？

実際には、子コンポーネントから親コンポーネントに直接データを送信することはできません。代わりに、親コンポーネントから子コンポーネントに関数をPropsとして渡し、子コンポーネントがその関数を呼び出すことで、親コンポーネントにデータを「送信」します。

しかし、これは実際にはデータを送信しているのではありません。子コンポーネントは単に親コンポーネントから受け取った関数を呼び出しているだけです。そして、その関数は親コンポーネント内で実行され、通常は親コンポーネントのStateを更新します。

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

| フレームワーク | データフロー | 特徴 |
|---------------|-------------|------|
| **React** | 一方向 | 予測しやすい、デバッグしやすい |
| **Angular** | 双方向 | 便利だが複雑になりがち |
| **Vue.js** | 双方向（オプション） | 柔軟だが注意が必要 |

この一方向データフローは、Reactアプリケーションを予測可能で理解しやすく、デバッグしやすくする重要な特徴の一つです。

### まとめ：Reactの設計思想

1. **Props は不変**：子コンポーネントで変更不可
2. **一方向データフロー**：親から子へのみデータが流れる
3. **純粋関数**：同じ入力に対して同じ出力
4. **予測可能性**：データの流れが明確で理解しやすい

これらの制約により、Reactアプリケーションは：
- **保守しやすく**
- **デバッグしやすく**
- **スケールしやすい**

コードベースを構築できます。

---

## 📋 JSXのルール

### JSXを正しく使うための重要な規則

JSXがどのように動作するかのルールを簡単に確認しましょう。

一般的なJSXルールと、JSXとHTMLの違いに関するルールがあります。

### 一般的なJSXルール

#### 1. **JSXは基本的にHTMLと同じ構文**

JSXは基本的にHTMLと同じように動作します。

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

#### 2. **波括弧でJavaScriptモードに入る**

JSXの中で動的な値や式を使用する場合は、波括弧`{}`を使用してJavaScriptモードに入ります：

```jsx
function Pizza({ name, price, ingredients }) {
  const currentTime = new Date().toLocaleTimeString();
  
  return (
    <div className="pizza">
      <h3>{name}</h3>                    {/* 変数 */}
      <p>{ingredients}</p>               {/* 変数 */}
      <span>¥{price}</span>              {/* 変数 */}
      <p>注文時刻: {currentTime}</p>      {/* 関数呼び出し */}
      <p>税込価格: ¥{price * 1.1}</p>    {/* 計算式 */}
    </div>
  );
}
```

#### 3. **JavaScript式のみ使用可能**

波括弧内では**式（Expression）**のみ使用でき、**文（Statement）**は使用できません：

```jsx
function Menu({ isOpen }) {
  return (
    <div>
      {/* ✅ 式（使用可能） */}
      <h2>{isOpen ? "営業中" : "閉店中"}</h2>
      <p>{new Date().getHours()}</p>
      <p>{[1, 2, 3].map(n => n * 2)}</p>
      
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

#### 4. **JSX自体もJavaScript式**

JSXは`React.createElement()`の呼び出しに変換されるため、JavaScript式として扱えます：

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

#### 5. **JSXは波括弧内でも使用可能**

```jsx
function Pizza({ name, soldOut }) {
  return (
    <div className="pizza">
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
```

#### 4. **JSX自体もJavaScript式**

JSXは`React.createElement()`の呼び出しに変換されるため、JavaScript式として扱えます：

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
  
  // JSXを関数に渡す
  return renderOpenMenu();
}

function renderOpenMenu() {
  return (
    <div className="menu">
      <h2>Our Menu</h2>
      <Pizza name="Margherita" price={1800} />
    </div>
  );
}
```

#### 5. **JSXは波括弧内でも使用可能**

```jsx
function Pizza({ name, soldOut }) {
  return (
    <div className="pizza">
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
```

### JSXとHTMLの違い

JSXとHTMLの違いに関するルールもいくつかあります。

#### 1. **`className` vs `class`**

最も重要な違いの一つは、HTMLでは`class`属性を使用しますが、JSXでは`className`を使用することです。

```jsx
// ❌ HTML（JSXでは警告）
<div class="container">

// ✅ JSX
<div className="container">
```

**理由**：`class`はJavaScriptの予約語のため、JSXでは`className`を使用する必要があります。

ちなみに、このようなJSXルールは他にもいくつかありますが、このセクションで後ほど詳しく説明します。

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

これらのルールは、JSXがJavaScriptの拡張であり、HTMLとは微妙に異なることを示しています。しかし、一度これらのルールに慣れれば、JSXを使用することは非常に自然に感じられるようになります。

### JSXの構造ルール

#### 1. **単一のルート要素**

JSXは必ず1つのルート要素を返す必要があります：

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

### 実践的なJSXの使用例

```jsx
function Menu() {
  const pizzas = [
    { id: 1, name: "マルゲリータピザ", price: 1800, soldOut: false },
    { id: 2, name: "フンギピザ", price: 2100, soldOut: true },
    { id: 3, name: "プロシュート・ディ・パルマピザ", price: 2400, soldOut: false }
  ];
  
  const isOpen = new Date().getHours() >= 12 && new Date().getHours() <= 22;
  
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      
      {/* 条件付きレンダリング */}
      {isOpen ? (
        <>
          <p>本格的なイタリア料理をお楽しみください。</p>
          
          {/* 配列のレンダリング */}
          <ul className="pizzas">
            {pizzas.map(pizza => (
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
        <p>申し訳ございません。12:00-22:00の間にお越しください。</p>
      )}
    </main>
  );
}

function Pizza({ name, price, soldOut }) {
  return (
    <li className={`pizza ${soldOut ? 'sold-out' : ''}`}>
      <div className="pizza-info">
        <h3>{name}</h3>
        <p className="price">
          {soldOut ? "SOLD OUT" : `¥${price}`}
        </p>
      </div>
      
      {/* 条件付きレンダリング */}
      {!soldOut && (
注文する</button>
      )}
    </li>
  );
}
```

### JSXのベストプラクティス

#### 1. **読みやすい構造を心がける**

```jsx
// ✅ 読みやすい構造
function Menu({ pizzas, isOpen }) {
  if (!isOpen) {
    return (
      <div className="menu">
        <h2>申し訳ございません</h2>
        <p>12:00-22:00の間にお越しください。</p>
      </div>
    );
  }

  return (
    <div className="menu">
      <h2>Our Menu</h2>
      <div className="pizzas">
        {pizzas.map(pizza => (
          <Pizza key={pizza.id} {...pizza} />
        ))}
      </div>
    </div>
  );
}
```

#### 2. **適切なkey属性の使用**

```jsx
// ✅ 一意のkeyを使用
{pizzas.map(pizza => (
  <Pizza key={pizza.id} name={pizza.name} />
))}

// ❌ インデックスをkeyに使用（推奨されない）
{pizzas.map((pizza, index) => (
  <Pizza key={index} name={pizza.name} />
))}
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

このSession3では、Reactアプリケーション開発における重要な概念を学習しました：

#### 🎨 スタイリングについて
- **インラインスタイル**：JavaScriptオブジェクトとしてのスタイル定義
- **外部CSSファイル**：従来のCSS知識の活用方法
- **className属性**：JSXでのクラス名指定の正しい方法
- **グローバルスタイル**：CSSファイルインポートの仕組み

#### 📦 Propsについて
- **Props の基本概念**：親から子へのデータ受け渡し
- **Props の受け渡し方法**：属性としてのデータ指定
- **Props の受け取り方法**：関数パラメータとしてのpropsオブジェクト
- **データ型の指定**：文字列、数値、真偽値、配列、オブジェクトの渡し方

#### 🔄 React の設計思想について
- **Props の不変性**：読み取り専用の重要性
- **一方向データフロー**：予測可能なデータの流れ
- **純粋関数**：副作用のないコンポーネント設計
- **State vs Props**：内部データと外部データの違い

#### 📋 JSXのルールについて
- **JavaScript式の使用**：波括弧内での動的な値の表現
- **JSXとHTMLの違い**：className、htmlFor、camelCase記法
- **構造ルール**：単一ルート要素、適切なネスト
- **条件付きレンダリング**：&& 演算子と三項演算子の使い分け

### 次のステップ

Session3で学んだ知識を基に、次のセッションでは以下の内容を学習予定です：

- **State（状態）の管理**：コンポーネント内部データの扱い方
- **イベントハンドリング**：ユーザーインタラクションへの対応
- **子から親へのデータ送信**：コールバック関数の活用
- **より複雑なアプリケーション構造**：実践的なプロジェクト開発

### 実践課題

学習内容を定着させるために、以下の課題に取り組んでみましょう：

1. **スタイリング練習**：既存のPizzaコンポーネントに独自のスタイルを適用
2. **Props活用**：新しいプロパティ（評価、調理時間など）を追加
3. **条件付きレンダリング**：営業時間や在庫状況に応じた表示切り替え
4. **JSXルール確認**：意図的にルールを破ってエラーメッセージを確認

### 開発のコツ

- **React Developer Tools**：ブラウザ拡張機能でPropsとStateを確認
- **console.log**：Props の内容を確認してデバッグ
- **段階的な実装**：小さな変更から始めて徐々に複雑化
- **エラーメッセージの活用**：Reactの親切なエラーメッセージを読む習慣

---

**Session2からSession3への学習の流れ**：
- Session2：JSXとコンポーネントの基礎 → **静的なコンポーネント**
- Session3：スタイリングとProps → **再利用可能なコンポーネント**
- 次回：Stateとイベントハンドリング → **インタラクティブなコンポーネント**

この段階的な学習により、Reactの核心概念を確実に理解し、実践的なアプリケーション開発スキルを身につけることができます。

**最終プロジェクト**：[`react/STEP01_基礎/session2_project/final`](react/STEP01_基礎/session2_project/final) では、これらの概念がすべて統合された完成形を確認できます。
        <button className="order-btn">