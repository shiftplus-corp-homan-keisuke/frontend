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

ここまでで、React コンポーネントには CSS スタイルも含められることが分かりました。ここでは、React アプリケーションに CSS を適用する基本的な方法を学びましょう。

React では、コンポーネントのスタイリング方法が豊富に用意されており、React 自体は特定の方法を強制しません。

これは、React がフレームワークというよりライブラリであるためです。つまり、コンポーネントのスタイリング方法について厳格なルールがなく、開発者が自由に選択できます。

### React で利用可能なスタイリング手法

たとえば、以下のような方法があります：

- **インラインスタイル**：JSX の`style`属性を使用
- **外部 CSS ファイル**：従来の CSS/Sass ファイルをインポート
- **CSS モジュール**：スコープ化された CSS
- **Styled Components**：CSS-in-JS ライブラリ
- **Tailwind CSS**：ユーティリティファースト CSS

この講義ですべての方法を網羅するわけではありませんが、後ほど主要な手法について学んでいきます。

まずはインラインスタイルから始め、その後外部 CSS ファイルの使い方も学びます。

### インラインスタイルの実装

#### HTML と JSX の違い

ご存知のように、HTML では style 属性を使用して要素をスタイリングできます。

```html
<!-- HTML -->
<h1 style="color: red; font-size: 48px;">Fast React Pizza Co.</h1>
```

HTML では、このようにスタイルを文字列として記述します。

しかし、JSX では同じようには動作しません。JSX では、JavaScript オブジェクトを使用してインラインスタイルを定義する必要があります。

JavaScript オブジェクトを記述するには、まず波括弧`{}`で JavaScript モードに入ります。その中で、さらに波括弧`{}`を使ってオブジェクトを作成します。つまり、二重の波括弧が必要になります。

```jsx
// JSX
function Header() {
  return (
    <h1 style={{ color: "red", fontSize: "48px" }}>Fast React Pizza Co.</h1>
  );
}
```

このように、オブジェクトのプロパティとして複数のスタイルを定義できます。例えば、H1 テキストを赤色にする場合などです。

保存すると、変更がすぐに反映されます。

これが、JSX でコンポーネントにスタイルを適用する最も基本的な方法です。HTML と同様に style 属性を使用します。

### より詳細なスタイリング例

通常の HTML 開発では、インラインスタイルはあまり使用しません。前の講義で説明した「関心の分離」という原則に基づき、CSS は別ファイルに分けるのが一般的でした。

しかし、React では、インラインスタイルを使用することも十分に許容されます。

別のプロパティも試してみましょう。`fontSize`について、CSS では`font-size`と書きますが、JavaScript ではハイフンを含むプロパティ名は使用できません。

そのため、JSX ではすべての CSS プロパティ名をキャメルケース記法に変換する必要があります。`font-size`は`fontSize`と書きます。

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

値は`"48px"`のように指定します。JavaScript オブジェクトとして記述しているため、値は必ず文字列で囲む必要があります。

他のプロパティも試してみましょう。`textTransform`と入力すると、VS Code が利用可能なオプションを自動的に表示してくれます。

これらのプロパティ値は必ず文字列として記述してください。最終的には JavaScript オブジェクトとして扱われるためです。

また、スタイルオブジェクトを変数として分離することもできます。コンポーネント内で`style`変数を作成し、そこにスタイル定義をまとめることができます（変数名は任意です）。

これが、個々のコンポーネントにスタイルを追加する最も基本的な方法です。

ただし、アプリケーションが大規模になると、すべてのコンポーネントにインラインスタイルを記述するのは管理が大変になります。実際の開発現場ではあまり推奨されません。

そこで、外部 CSS ファイルを使用する方法があります。これは従来の Web 開発と同じアプローチです。

React アプリケーションで最も一般的なスタイリング方法は、外部 CSS ファイルを使用することです。通常の Web ページと同じ手法が使えます。

この方法では CSS と JavaScript/HTML が同じファイルで扱われることになりますが、React の世界では特に問題ありません。

後ほど「styled components」という、より高度な手法についても学習します。

それでは、この STEP の冒頭で用意した CSS ファイルを見てみましょう。

これは、複数のクラスが定義された標準的な CSS ファイルです。

これらのクラスを使用するには、JSX 要素にクラス名を指定します。

その前に、まず CSS ファイルをインポートする必要があります。

```jsx
import "./index.css"; // CSSファイルをインポート
```

React アプリケーションは CSS ファイルの存在を自動的には認識しません。そのため、明示的にインポート文を記述する必要があります。

このインポートにより、Webpack（または使用しているバンドラー）が CSS ファイルのスタイルをアプリケーションに適用します。

#### JSX でのクラス名指定

インポート後、すでに見た目が変化していることが分かります。背景色が変わり、フォントファミリーも変更されました。ページ下部には黄色いボーダーも表示されています。

これは、Webpack がスタイルをすぐにアプリケーションに反映させた証拠です。

それでは、実際にクラスを追加してみましょう。CSS ファイルには`container`、`header`、`menu`、そして`footer`などのクラスが定義されています。

まず、`container`クラスを追加してみます。あえて間違った方法から試してみましょう。

```jsx
// ❌ 間違い（警告が表示される）
<div class="container">
```

HTML のように`class`と書くと、React は警告を表示します。

コンソールに「Invalid DOM property class did you mean className?」というメッセージが表示されます。

これは JSX の重要なルールの一つです。JSX では`class`は使用できず、代わりに`className`を使用する必要があります。

```jsx
// ✅ 正しい
<div className="container">
```

これは React 初心者がよくする間違いです。一見動作しているように見えても、JSX で`class`を使用することは推奨されていません。

なぜなら、`class`はすでに JavaScript の予約語だからです。

#### セマンティックな HTML 要素の使用

次に、`header`クラスを追加してみましょう。

```jsx
function Header() {
  return (
    <header className="header">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
}
```

見た目はあまり変わりませんでした。これは、インラインスタイルがまだ適用されているためです。

本来は、`<header>`要素を使用し、そこにクラスを指定するべきです。

単純に`<h1>`だけを使うよりも、`<header>`要素を使う方が適切なセマンティック HTML（意味のあるマークアップ）になります。

続いて、`menu`クラスも追加しましょう。こちらも同様に`className`を使用します。

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

セマンティックマークアップの観点から、`<main>`タグ（メインコンテンツを表す HTML 要素）を使用しています。

これで、メニューに適切なスタイリングが適用されました。

最後に、フッター部分のクラス名を追加します。こちらは`footer`クラスになります。

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

これで、アプリケーション全体にスタイリングが適用されました。前述の通り、外部 CSS スタイルシートからスタイルを読み込んでいます。import 構文を使用してインポートすることで、Webpack がスタイルをアプリケーションに適用してくれます。

重要なポイントとして、JSX では`class`ではなく`className`を使用することを覚えておきましょう。これは`class`が JavaScript の予約語であるためです。

このような JSX 特有のルールは他にもいくつかあり、このセクションの後半で詳しく説明します。

ここで注意すべき点は、インポートしたスタイルが**グローバルスタイル**であることです。つまり、特定のコンポーネントにスコープ（範囲限定）されていません。これは簡単に確認できます。

例えば、任意の要素に`header`クラスを追加できます。見た目はあまり変わりませんが、別のクラスも試してみましょう。

ヘッダー要素に`footer`クラスも追加してみます。やはり大きな変化はありませんが、開発者ツールで要素を検査すると、両方のクラスが適用されていることが確認できます。

つまり、これらのスタイルはどの要素にも適用でき、結果的にどのコンポーネントにも適用できるということです。

各コンポーネントは独自のスタイルを持っているわけではなく、`index.css`に定義されたグローバルスタイルを共有して使用しています。

小規模なアプリケーションではこの方法で十分ですが、後ほど styled components などの手法を学ぶことで、コンポーネントごとに専用のスタイルを持つ方法についても理解を深めます。

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

ここからは、React のもう一つの基本概念である「Props」について学びます。Props は、コンポーネント間でデータを受け渡すための仕組みです。

具体的には、親コンポーネントから子コンポーネントへデータを渡す際に使用します。Props は親子間のコミュニケーション手段と考えると分かりやすいでしょう。

これまで同じ Pizza コンポーネントを 3 回使用してきましたが、すべて同じデータを表示していました。実際の開発では、各コンポーネントに異なるデータを渡して、それぞれを個別にカスタマイズしたいことがほとんどです。

Props を使用することで、これが実現できます。

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

書き方は HTML の属性に非常に似ていますが、React ではこれらを Props と呼びます。

次に、2 番目のステップとして、子コンポーネント側で Props を受け取る処理を実装します。

### Props の受け取りと使用

現状では、Pizza コンポーネントは 4 つの Props が渡されたことを認識できていません。

そのため、子コンポーネント側で`props`パラメータを受け取る必要があります。

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

まず、`props`をコンソールに出力して、中身を確認してみましょう。

`props`はオブジェクト形式で渡され、`name`や`ingredients`などのプロパティと、それぞれの値が含まれています。

React は関数コンポーネントを呼び出す際、props オブジェクトを引数として自動的に渡します。このオブジェクトには、親コンポーネントから渡された 4 つの props が格納されています。

この props オブジェクトから各プロパティの値を取り出して、表示に使用できます。

### Props の威力を実感する

別のピザコンポーネントも作成してみましょう。ここで Props の真価が分かります。

例えば、フンギピザを作成します。Props を渡す順番は自由で、どの順番でも正しく受け取ることができます。

```jsx
<Pizza
  price={1800}
  name="フンギピザ"
  ingredients="トマト、モッツァレラ、マッシュルーム、玉ねぎ"
  photoName="pizzas/funghi.jpg"
/>
```

すると、正しくフンギピザが表示されました。素晴らしいですね！

### Props のデータ型

Props には様々な種類のデータを渡すことができます。文字列・数値・真偽値・配列・オブジェクト、さらには他の React コンポーネントまで、あらゆる JavaScript の値を渡せます。

### Props の重要性

これで Props の役割と使い方が理解できました。Props は親コンポーネントから子コンポーネントへデータを渡すための仕組みです。つまり、コンポーネントツリーを下方向（親 → 子）に情報を伝達する手段となります。

親子コンポーネント間のコミュニケーションには、必ず Props を使用します。

Props は、コンポーネントを設定・カスタマイズするための React の中核的な仕組みです。親コンポーネントが子コンポーネントの見た目や動作を制御する「設定値」のようなものと考えると分かりやすいでしょう。

Props の性質は、通常の JavaScript 関数の引数とよく似ています。関数にあらゆる値を引数として渡せるのと同様に、Props にもあらゆる値を渡すことができます。

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

### Props をより深く理解する

これまで Props の基本的な使い方を学びましたが、ここでは Props のより深い側面や React の設計思想について掘り下げていきます。

### Props の本質的な役割

改めて、Props とは何かを確認しましょう。Props は、親コンポーネントが子コンポーネントに設定値を渡すための仕組みです。親が子をカスタマイズする手段と考えることができます。

Props は通常の JavaScript 関数の引数と非常に似た性質を持っています。関数が引数を受け取って処理を行うのと同じように、React コンポーネントも Props を受け取り、それを使って JSX を生成して返します。

### React におけるデータの分類

React コンポーネントが扱うデータは主に 2 種類に分類されます。

1 つ目は **Props**（親コンポーネントから渡される外部データ）、2 つ目は **State**（コンポーネント自身が保持する内部データ）です。

Props は外部から渡されるため、コンポーネント自身では変更できません。一方、State はコンポーネントが所有しており、時間の経過とともに更新することができます。

### Props の不変性（Immutability）の重要性

ここで覚えておくべき重要なルールがあります。**Props は不変（immutable）** です。つまり、Props は読み取り専用であり、決して変更してはいけません。

なぜこのようなルールが存在するのでしょうか？Props を変更すると、予期しない副作用が発生するためです。JavaScript ではオブジェクトは参照によって渡されます。そのため、子コンポーネントで Props オブジェクトを変更すると、親コンポーネント内の元のオブジェクトも変更されてしまいます。これは明らかに望ましくない動作です。

### 純粋関数としてのコンポーネント

さらに重要な点として、React コンポーネントは**純粋関数**として動作する必要があります。純粋関数とは、同じ入力に対して常に同じ出力を返し、副作用を持たない関数のことです。

純粋関数は、外部の変数を書き換えたり、API を呼び出したり、タイマーを開始したりしません。同じ引数で呼び出された場合、必ず同じ結果を返します。

React コンポーネントも同様に、同じ Props を受け取った場合は常に同じ JSX を返すべきです。この原則により、React アプリケーションは予測可能で信頼性の高いものになります。

### 一方向データフロー（One-Way Data Flow）の理解

React において重要な概念がもう一つあります。それが**一方向データフロー**です。これは、データが親コンポーネントから子コンポーネントへと一方向にのみ流れるという原則です。

つまり、データは常にコンポーネントツリーを下方向（親 → 子 → 孫...）に流れていきます。

### 一方向データフローの利点

この一方向データフローの仕組みにより、アプリケーションは予測しやすく、理解しやすく、そしてデバッグもしやすくなります。

データの出所が常に明確なので、子コンポーネントで問題が発生した場合でも、それが親コンポーネントから渡されたデータに起因することがすぐに分かります。

### 子から親へのデータ送信

しかし、子コンポーネントから親コンポーネントへ情報を伝えたい場面もあります。これはどのように実現するのでしょうか？

実際には、子から親へ直接データを送ることはできません。代わりに、親コンポーネントが関数を Props として子コンポーネントに渡し、子がその関数を呼び出すことで親に通知するという仕組みを使います。

この場合、子コンポーネントは親から受け取った関数を実行するだけです。その関数は親コンポーネント内で実行され、通常は親の State を更新します。

### まとめ：React の設計思想

Props の不変性、純粋関数としてのコンポーネント、一方向データフロー——これらは React の設計思想の核心をなす概念です。これらの原則が存在することで、React アプリケーションは予測しやすく、理解しやすく、そしてデバッグもしやすいものになります。

このような制約があるからこそ、React は大規模で複雑なアプリケーション開発にも適したライブラリとなっているのです。

### Props の不変性（Immutability）

#### 不変性の重要なルール

React で必ず守るべき重要なルールの一つが「**Props は不変（immutable）**」という原則です。

Props は読み取り専用であり、決して変更してはいけません。コンポーネントは受け取った Props を一切変更しないよう注意しましょう。

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

第一の理由は、Props を変更すると予期しない副作用が発生するためです。JavaScript では、オブジェクトは参照渡しされます。つまり、子コンポーネントで Props オブジェクトを変更すると、元のオブジェクト（親コンポーネント内のオブジェクト）も同時に変更されてしまいます。これは明らかに望ましくない動作です。

```javascript
// JavaScriptオブジェクトの参照の例
const originalPizza = { name: "Margherita", price: 1500 };
const pizzaCopy = originalPizza;

pizzaCopy.price = 2250;
console.log(originalPizza.price); // 2250（元のオブジェクトも変更される！）
```

##### 2. **純粋関数の維持**

さらに重要な理由として、React コンポーネントは純粋関数として動作しなければならないという原則があります。純粋関数とは、同じ入力に対して常に同じ出力を返し、副作用を一切持たない関数のことです。

純粋関数は、外部変数の変更、API の呼び出し、タイマーの開始などを行いません。同じ引数で呼び出された場合、必ず同じ結果を返します。

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

React コンポーネントも同様に、同じ Props を受け取った場合は常に同じ JSX を返すべきです。この原則により、React アプリケーションの動作が予測可能になります。

##### 3. **最適化とバグ防止**

Props の不変性により、React は効率的なパフォーマンス最適化を実現でき、予期しないバグの発生も防ぐことができます。これが、React が大規模アプリケーション開発に適している理由の一つです。

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

React におけるもう一つの重要な概念が「**一方向データフロー**」です。これは、データが親コンポーネントから子コンポーネントへと一方向にのみ流れるという原則です。

つまり、データは常にコンポーネントツリーを下方向（親 → 子 → 孫...）に流れていきます。

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

一方向データフローの仕組みにより、アプリケーションはより予測可能になり、コードの理解が容易になり、デバッグも効率的に行えるようになります。

データの出所が常に明確なため、子コンポーネントで問題が発生した場合でも、それが親コンポーネントから来ていることがすぐに判断できます。

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

しかし、子コンポーネントから親コンポーネントへ情報を伝えたい場合もあります。これはどのように実現するのでしょうか？

実際には、子から親へ直接データを送信することはできません。その代わりに、親コンポーネントが関数を Props として子コンポーネントに渡し、子コンポーネントがその関数を呼び出すことで親に通知する、という仕組みを使います。

この仕組みでは、子コンポーネントは親から受け取った関数を実行するだけです。その関数は親コンポーネント内で実行され、通常は親の State を更新する処理を行います。

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

この一方向データフローは、React アプリケーションを予測しやすく、理解しやすく、デバッグしやすくする重要な特徴の一つです。

### まとめ：React の設計思想

1. **Props の不変性**：子コンポーネントでの変更は不可
2. **一方向データフロー**：データは親から子へのみ流れる
3. **純粋関数の原則**：同じ入力に対して常に同じ出力を返す
4. **予測可能性**：データの流れが明確で理解しやすい

これらの原則・制約があることで、React アプリケーションは以下のような特性を持つことができます。

- **保守性が高い**
- **デバッグが容易**
- **スケーラブル（拡張可能）**

---

## 📋 JSX のルール

### JSX を正しく使うための重要な規則

ここでは、JSX の動作ルールを確認していきましょう。

JSX には一般的なルールと、JSX と HTML の違いに関するルールがあります。

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

これらのルールは、JSX が JavaScript の拡張であり、HTML とは異なる部分があることを示しています。ただし、一度慣れてしまえば JSX は非常に自然に使えるようになります。

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

この Session3 では、React アプリケーション開発における重要な概念を学習しました：

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

Session3 で学んだ知識を基に、次のセッションでは以下の内容を学習する予定です：

- **State（状態）の管理**：コンポーネント内部データの取り扱い方法
- **イベントハンドリング**：ユーザーの操作への対応方法
- **子から親へのデータ送信**：コールバック関数を活用した通信
- **より複雑なアプリケーション構造**：実践的なプロジェクト開発

### 実践課題

学習内容を定着させるために、以下の課題に取り組んでみましょう：

1. **スタイリング練習**：既存の Pizza コンポーネントに独自のスタイルを適用する
2. **Props の活用**：新しいプロパティ（評価、調理時間など）を追加する
3. **条件付きレンダリング**：営業時間や在庫状況に応じて表示を切り替える
4. **JSX ルールの確認**：意図的にルールを破り、表示されるエラーメッセージを確認する

### 開発のコツ

- **React Developer Tools**：ブラウザ拡張機能を使って Props と State を確認する
- **console.log**：Props の内容を出力してデバッグする
- **段階的な実装**：小さな変更から始め、徐々に複雑な実装に進む
- **エラーメッセージの活用**：React が表示する分かりやすいエラーメッセージをしっかり読む習慣をつける

---

**Session2 から Session3 への学習の流れ**：

- Session2：JSX とコンポーネントの基礎 → **静的なコンポーネント**の作成
- Session3：スタイリングと Props → **再利用可能なコンポーネント**の実装
- 次回：State とイベントハンドリング → **インタラクティブなコンポーネント**の開発

この段階的な学習プロセスを通じて、React の核心概念をしっかりと理解し、実践的なアプリケーション開発スキルを身につけることができます。

**最終プロジェクト**：[`react/STEP01_基礎/session2_project/final`](react/STEP01_基礎/session2_project/final) では、これらの概念がすべて統合された完成形を確認できます。
<button className="order-btn">
