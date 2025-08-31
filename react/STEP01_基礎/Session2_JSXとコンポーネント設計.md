# Session2: JSXとコンポーネント設計

## 🎯 このセッションで学ぶこと

Session1で学んだReactの基礎知識を発展させ、より深いコンポーネント設計の理解を目指します：

- **JSXの本質**：宣言的構文の理解と活用方法
- **コンポーネント設計**：再利用可能で保守性の高いコンポーネントの作成
- **JavaScriptロジック**：コンポーネント内でのロジック実装
- **関心の分離**：Reactにおける新しい設計思想の理解

Session1で構築したピザメニューアプリケーションをさらに発展させながら、これらの概念を実践的に学習していきます。

**最終プロジェクト参照**: [`react/STEP01_基礎/session2_project/final`](react/STEP01_基礎/session2_project/final)

---

## 🎨 JSXとは何か？

### JSXの本質的な理解

このコースでは既にいくつかのJSXを書いてきましたが、JSXとは実際に何なのか、そしてなぜReactにおいてこれほど重要なのかを深く理解しましょう。

コンポーネントについて最初に話したとき、コンポーネントには独自のデータ、ロジック、そして外観が含まれると説明しました。これは理にかなっています。なぜなら、コンポーネントがユーザーインターフェースの一部である場合、そのコンポーネントがどのように見えるかを正確に記述できる必要があるからです。

そして、ここでJSXが登場します。JSXは、データとロジックに基づいてコンポーネントがどのように見え、どのように動作するかを記述するために使用する宣言的構文です。つまり、これはすべてコンポーネントの外観に関するものです。

### JSXの実践的な理解

実際には、これは各コンポーネントが1つのJSXブロックを返さなければならないことを意味し、ReactはそれをUIにコンポーネントをレンダリングするために使用します。

このコードを見ると、このJSXはHTMLによく似ていますよね？しかし実際には、JSXはJavaScriptの拡張であり、HTML、CSS、JavaScriptの部分をすべて1つのコードブロックに組み合わせることができます。

基本的に、HTMLを書いて、必要に応じてJavaScriptの部分を埋め込むことができます。例えば、JavaScriptの変数を参照したり、他のReactコンポーネントを参照したりして、複数のコンポーネントを組み合わせ、ネストし、再利用することができます。

### JSXからJavaScriptへの変換プロセス

しかし、ここで疑問に思うかもしれません。ReactがJavaScriptフレームワークなら、どうやってこのHTMLのようなコードを理解するのでしょうか？

まあ、JSXはJavaScriptの拡張に過ぎないということを覚えておいてください。これは、JSXをJavaScriptに変換する簡単な方法があることを意味します。これは、Create React Appによって自動的にアプリケーションに含まれたBabelというツールによって行われます。

そして、この変換の結果は、右側のこのコードのようになります。各JSX要素がReact.createElement関数呼び出しに変換されました。

これは見覚えがありますか？そうであることを願います。なぜなら、これはまさに純粋なReactの講義でアプリコンポーネントから返したものだからです。つまり、Babelツールがなかったため、JSXを使用できなかった講義です。

### 変換の必要性と意義

とにかく、この変換が必要なのは、ブラウザがもちろんJSXを理解しないからです。ブラウザはHTMLしか理解しません。したがって、舞台裏では、私たちが書くすべてのJSXが多くのネストしたReact.createElement関数呼び出しに変換されます。そして、これらの関数呼び出しが最終的に画面に表示されるHTML要素を作成するのです。

これが意味することは、実際にはJSXなしでReactを使用することも可能だということです。つまり、JSXの代わりにこれらのcreateElement関数を手動で書くこともできますが、それはあまり楽しそうではありませんよね？また、コードを読んで理解するのが非常に困難になります。

そのため、実際には誰もがJSXを使用しています。

### 宣言的アプローチの理解

さて、JSXが何であるかがわかったので、JSXが宣言的であると言った最初の段落に戻りましょう。JSXが宣言的であるとはどういう意味でしょうか？

宣言的が何を意味するかを理解する前に、まず命令的が何を意味するかを確認する必要があります。

バニラJavaScriptを使用してUIを構築しようとするとき、デフォルトで命令的アプローチを使用することになります。これは、要素を手動で選択し、DOMを横断し、イベントハンドラーを要素にアタッチすることを意味します。そして、アプリで何かが起こるたび、例えばボタンのクリックなど、ブラウザに対して、望ましい更新されたUIに到達するまで、これらのDOM要素をどのように変更するかについて段階的な指示を与えます。

つまり、命令的アプローチでは、基本的にブラウザに対して物事をどのように行うかを正確に指示します。

### 宣言的アプローチの優位性

しかし、複雑なアプリでこれを行うことは、以前に学んだすべての理由により、完全に実行不可能です。そして、それがReactのようなフレームワークが最初に存在する理由であることを覚えておいてください。そして、それがReactがユーザーインターフェースを構築するための宣言的アプローチを使用することを選択した理由です。

したがって、宣言的アプローチは、コンポーネント内の現在のデータに基づいて、常にUIがどのように見えるべきかを単純に記述することです。そして、私たちがすぐに学ぶように、このデータはpropsとstateです。

そして、データが変化すると、Reactは自動的にUIを再レンダリングして、新しいデータを反映します。

したがって、私たちReact開発者は、propsとstateに基づいてUIがどのように見えるべきかを記述するだけで、Reactが舞台裏で実際の作業を行います。つまり、DOMを操作し、要素を作成し、削除し、属性やテキストコンテンツなどを変更します。

そして、これがJSXが宣言的である理由です。なぜなら、JSXを使用して、データに基づいてコンポーネントがどのように見えるべきかを記述するからです。そして、私たちは実際にDOMを触ることはありません。私たちはそれをReactに任せます。

### 命令的と宣言的の本質的な違い

本質的に、命令的と宣言的の違いは、宣言的アプローチでは、私たちは「何を」したいかを記述し、Reactが「どのように」それを行うかを理解することです。一方、命令的アプローチでは、私たちが「どのように」行うかを正確に指示する必要があります。

そして、これがJSXとReactを非常に強力にしている理由です。なぜなら、私たちは複雑なDOM操作について心配する必要がなく、単にUIがどのように見えるべきかを記述するだけでよいからです。

---

## 🏗️ より多くのコンポーネントの作成

### アプリケーションの完成形の確認

JSXに関する新しい知識を使って、アプリケーションの構築を続けるために、さらにいくつかのコンポーネントを作成しましょう。

しかし、その前に、このセクションを終了した後のアプリケーションがどのように見えるかを示すのに、おそらく完璧なタイミングです。

基本的に、ここにピザ屋の名前があるヘッダーがあります。そして、ここの下にメニューがあり、そして基本的にここに、レストランが現在営業中であることをユーザーに知らせるフッターと、このボタンがあります。もちろん、クリックしても何もしません。

そして、ここがこのアプリケーションの心臓部で、これら6つのピザの表示です。そして、ここで既にこのピザを表示していることに注目してください。

そして、ここで、これら6つのピザを印刷するために、このpizzaコンポーネントを6回再利用することがわかります。

### レイアウトコンポーネントの作成

しかし、今、この講義で私がやりたいことは、基本的にこれらのより大きなレイアウトコンポーネントにもっと焦点を当てることです。

そこで、これら3つの大きな部分のそれぞれに対して1つのコンポーネントを作成しましょう。

ヘッダー用に1つ。Headerというコンポーネントで、今のところこれを空にしておくことができます。ここで構造を構築しているだけです。

```jsx
function Header() {
  // 今のところ空
}

function Menu() {
  // 今のところ空
}

function Footer() {
  // 今のところ空
}
```

そして、メニュー用に1つ、そしてフッター用に1つ。

ちなみに、もちろんこれらの関数を関数式やアロー関数として書くこともできます。

```jsx
// 関数式
const Test = function() {
  return <div>Test</div>;
};

// アロー関数
const Test = () => {
  return <div>Test</div>;
};
```

これらのタイプの関数を好む場合は、自由に使用してください。しかし、私は常に、これまで使用してきたような通常の関数キーワードを使用するのが好きです。

### Headerコンポーネントの実装

とにかく、ここから何かを返しましょう。そして、ここでレストランの名前を書きます。それは「Fast React Pizza Company」です。

```jsx
function Header() {
  return <h1>Fast React Pizza Co.</h1>;
}
```

そして、ここで、このh1の代わりにこのコンポーネントを使用できます。

```jsx
function App() {
  return (
    <div>
      <Header />
      <Pizza />
      <Pizza />
      <Pizza />
    </div>
  );
}
```

そして、再び、他のHTML要素と同じようにここに含めます。そして、それがJSXの美しさです。

### Footerコンポーネントの実装とReact.createElement

次に、フッターを作成しましょう。そして、ここで実際にJSXとcreateElementを少し試してみましょう。

前の講義で得た知識を使って、すぐにJSXを返すのではなく、createElement呼び出しを返してみましょう。

```jsx
function Footer() {
  return React.createElement(
    'footer',
    null,
    "We're currently open!"
  );
}
```

React.createElement、JSXなしでこの方法でコンポーネントを書くことがどれほど悪いかを見ることができるように。

HTMLノート、つまりHTML要素を返したいので、footerという名前です。

次に、ここで、2番目の引数はnullです。なぜなら、それはpropsのためだからです。そして、ここに子要素があります。

ここでは、テキストが欲しいだけです。「We're currently open」と言いましょう。

そして、もちろん、アプリでコンポーネントを使用する必要があります。

```jsx
function App() {
  return (
    <div>
      <Header />
      <Pizza />
      <Pizza />
      <Pizza />
      <Footer />
    </div>
  );
}
```

そして、下でチェックしてみましょう。そう、そこにフッターがあります。

### JSXへの変換

しかし、とにかく、フッターに戻って、これをコメントアウトして、実際に返したいものを返しましょう。それは、今のところ、実際には同じですが、良い方法で書かれています。

```jsx
function Footer() {
  return (
    <footer>
      We're currently open! {new Date().toLocaleTimeString()}
    </footer>
  );
}
```

そして、今、実際にここでJavaScriptモードに入りましょう。なぜなら、ここでJavaScriptを少しやってみたいからです。現在の時刻を表示しましょう。

以前にもやったことがあります。新しい日付を作成して、.toLocaleTimeStringです。

そして、下で、現在この時刻であることがわかります。「We're currently open」。

素晴らしい。これが、JavaScriptを基本的にHTMLに直接組み合わせることができる力です。前の講義で学んだとおりです。

### Menuコンポーネントの実装

最後に、ここにメニューがあります。メニューで何が欲しいですか？

まず、ここにh2を追加して、「Our menu」と言いましょう。そして、実際にここにピザを配置しましょう。

```jsx
function Menu() {
  return (
    <main>
      <h2>Our Menu</h2>
      <Pizza />
      <Pizza />
      <Pizza />
    </main>
  );
}
```

これらのピザは実際にメニューの一部であるべきです。そうしましょう。

JSXの1つの部分を書くたびに、そのJSXは基本的に1つのルート要素しか持てないことを覚えておいてください。

すべてのピザを削除しましょう。それらを切り取って、ここに配置します。そして、メニューをまだ含めていないので、ここから消えています。

そこで、すぐにそれをやりましょう。

```jsx
function App() {
  return (
    <div>
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}
```

そして、そこに行きます。以前と同じ結果ですが、今度はコンポーネントがさらにネストされています。

### コンポーネントの階層構造

ここのすべてがappコンポーネントで、そしてapp内にmenuコンポーネントがネストされ、そしてmenu内にこれら4つのpizzaコンポーネントがあります。

そして、今、小さなコンポーネントをより大きなコンポーネントに組み合わせることで、複雑なユーザーインターフェースを構築するというアイデアを本当に見始めています。

つまり、これらの本当に小さなpizzaコンポーネントがあり、それらのいくつかを1つの少し大きなコンポーネント（メニュー）に組み合わせ、それをヘッダーとフッターと組み合わせて、全体的な大きなappコンポーネントを作成します。

---

## 💡 コンポーネント内のJavaScriptロジック

### コンポーネント内でのロジック実装

Reactコンポーネント内でロジックを書くことについて、簡単に最初に見てみましょう。

以前にもJavaScriptロジックを書いたことがありますが、常に返されるJSXの内部でのみ行っていました。ここのようにです。

しかし、コンポーネントは単なるJavaScript関数なので、もちろん、望むJavaScriptを何でも実行できます。そして、そのコードは、関数が呼び出されるとすぐに、つまりコンポーネントが初期化されるとすぐに実行されます。

```jsx
function Footer() {
  // コンポーネント内でのJavaScriptロジック
  const hour = new Date().getHours();
  console.log(hour);
  
  return (
    <footer>
      We're currently open! {new Date().toLocaleTimeString()}
    </footer>
  );
}
```

たとえば、ここで、望む新しい変数を作成できます。hourと言いましょう。ここで再び新しい日付を作成し、getHoursと言いましょう。そして、それをコンソールにログ出力できます。

### 条件付きロジックの実装

そして、コンソールをチェックしてみましょう。ここで、そう、数字の9があります。それが現在の時刻です。

そして今、ここでやりたいことは、基本的にレストランが現在営業中かどうかのアラートをアプリに表示することです。

そのために、いくつかの変数をもっと定義しましょう。

```jsx
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  
  // 条件付きロジック
  if (hour >= openHour && hour <= closeHour) {
    alert("We're currently open!");
  } else {
    alert("Sorry, we're closed");
  }
  
  return (
    <footer>
      We're currently open! {new Date().toLocaleTimeString()}
    </footer>
  );
}
```

openHourを定義しましょう。ピザ屋は実際に午後12時に開店し、午後10時に閉店するとしましょう。つまり、12と22です。

そして今、再び、ここで任意のJavaScriptを使用できます。そこで、時刻がopenHour以上で、時刻がcloseHour以下の場合、「We're currently open!」とアラートを出す簡単なif-else文を書きましょう。

alertは組み込みのJavaScript関数なので、慣れ親しんでいるはずです。ここでJavaScriptを書けることのデモンストレーションとして使用します。

そして、そこにあります。「sorry, we are closed」、そして、現在午前9時なので、それが2回起こったのがわかります。

そして、それは以前に話したstrictモードのためです。strictモードでは、コンポーネントは通常2回レンダリングされるので、そのためアラートも2回表示されました。

### より実用的なアプローチ

今、openHourをここで8に変更して再レンダリングすると、「We are currently open!」と言います。

さて、このalert関数は実際にJavaScriptをブロックしています。そのため、最初に実行されますが、他には何も起こりません。そして、もちろんこれは本当に理想的ではなく、実際のアプリでは使用しませんが、これはとにかくここでの短いデモでした。

そこで、これをすべてコメントアウトして、このコードを使用しましょう。後で実際に役立つからです。

```jsx
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  
  console.log(isOpen);
  
  return (
    <footer>
      We're currently open! {new Date().toLocaleTimeString()}
    </footer>
  );
}
```

ここでisOpenという変数を作成しましょう。これは、この条件がtrueかfalseかに応じて、単純にtrueまたはfalseの値になります。

それをコンソールにログ出力しましょう。そして、現在は営業中であることがわかります。12に戻すと、そこに行きます。

このように、コンポーネント内でJavaScriptロジックを書くことで、動的な動作を実装できます。

### 宣言的アプローチの威力

JSXが**宣言的**であるということの意味を理解しましょう。

#### 🆚 命令的 vs 宣言的アプローチ

| 観点 | 命令的（バニラJavaScript） | 宣言的（React JSX） |
|------|---------------------------|-------------------|
| 思考方法 | 「どうやって」実現するか | 「何を」表示するか |
| DOM操作 | 手動でDOM要素を選択・変更 | JSXで最終状態を記述 |
| 状態変化 | 各変更を逐次実行 | 状態に基づいて自動更新 |
| コード量 | 多くの手順が必要 | 簡潔で読みやすい |

#### 命令的アプローチの例（バニラJavaScript）

```javascript
// 命令的：手順を詳細に指示
const button = document.querySelector('#increment-btn');
const counter = document.querySelector('#counter');
let count = 0;

button.addEventListener('click', () => {
  count++;
  counter.textContent = count;
  
  // 条件に応じて手動でスタイルを変更
  if (count > 10) {
    counter.classList.add('warning');
  } else {
    counter.classList.remove('warning');
  }
});
```

#### 宣言的アプローチの例（React JSX）

```jsx
// 宣言的：最終状態を記述
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <span className={count > 10 ? 'warning' : ''}>{count}</span>
      <button onClick={() => setCount(count + 1)}>
        増加
      </button>
    </div>
  );
}
```

### JSXの利点

1. **DOM抽象化**：直接DOM操作が不要
2. **自動同期**：データが変更されると自動的にUIが更新
3. **可読性**：HTMLライクな構文で直感的
4. **保守性**：状態とUIの関係が明確

---

## 🧩 より多くのコンポーネントの作成

### アプリケーションの完成形を確認

Session1で作成したピザアプリケーションを発展させ、以下の構造を持つアプリケーションを構築します：

```
Fast React Pizza Co.
├── Header（ヘッダー）
├── Menu（メニュー）
│   └── Pizza × 6（個別のピザコンポーネント）
└── Footer（フッター）
```

### レイアウトコンポーネントの作成

大きなレイアウト部分ごとにコンポーネントを作成しましょう：

#### Headerコンポーネント

```jsx
function Header() {
  return (
    <header className="header">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
}
```

#### Footerコンポーネント

```jsx
function Footer() {
  return (
    <footer className="footer">
      <p>We're currently open! {new Date().toLocaleTimeString()}</p>
    </footer>
  );
}
```

**JSXの威力を実感**：
- HTMLとJavaScriptを自然に組み合わせ
- `{new Date().toLocaleTimeString()}`でリアルタイム表示
- 波括弧`{}`内でJavaScript式を実行

#### Menuコンポーネント

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

### コンポーネント関数の記述方法

Reactコンポーネントは複数の方法で記述できます：

```jsx
// 1. 関数宣言（推奨）
function Pizza() {
  return <h2>Pizza</h2>;
}

// 2. 関数式
const Pizza = function() {
  return <h2>Pizza</h2>;
};

// 3. アロー関数
const Pizza = () => {
  return <h2>Pizza</h2>;
};
```

**推奨事項**：関数宣言を使用することで、コードの一貫性と可読性を保ちます。

### React.createElementとの比較

JSXの価値を理解するために、JSXを使わない場合を見てみましょう：

```jsx
// JSXなしの場合（非推奨）
function Footer() {
  return React.createElement(
    'footer',
    null,
    'We\'re currently open!'
  );
}

// JSXを使用した場合（推奨）
function Footer() {
  return (
    <footer>
      We're currently open!
    </footer>
  );
}
```

**明らかな違い**：
- JSXは直感的で読みやすい
- HTMLライクな構文で学習コストが低い
- ネストした要素も自然に表現可能

### コンポーネントの階層構造

```jsx
function App() {
  return (
    <div className="container">
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}
```

**重要なルール**：
- 各コンポーネントは**1つのルート要素**のみを返す
- 複数の要素を返す場合は親要素でラップする
- コンポーネント名は**大文字で始める**

### コンポーネントのネスト構造

```
App
├── Header
├── Menu
│   ├── Pizza
│   ├── Pizza
│   └── Pizza
└── Footer
```

この階層構造により、複雑なUIを小さな再利用可能な部品の組み合わせとして構築できます。

---

## 💡 コンポーネント内のJavaScriptロジック

### コンポーネント内でのロジック実装

これまでJSXの返り値内でJavaScriptを使用してきましたが、コンポーネントは単なるJavaScript関数であるため、任意のJavaScriptコードを記述できます。

```jsx
function Footer() {
  // コンポーネント内でのJavaScriptロジック
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  
  console.log(`現在時刻: ${hour}時`);
  console.log(`営業中: ${isOpen}`);
  
  return (
    <footer className="footer">
      {isOpen ? (
        <div className="order">
          <p>
            {openHour}:00から{closeHour}:00まで営業中です。
            ご来店またはオンラインでご注文ください。
          </p>
          <button className="btn">注文する</button>
        </div>
      ) : (
        <p>
          {openHour}:00から{closeHour}:00の間にお越しください。
        </p>
      )}
    </footer>
  );
}
```

### ロジックの実行タイミング

**重要な理解**：コンポーネント内のJavaScriptコードは、コンポーネントが初期化される（呼び出される）たびに実行されます。

```jsx
function Pizza() {
  // このコードはコンポーネントがレンダリングされるたびに実行
  console.log('Pizzaコンポーネントがレンダリングされました');
  
  const pizzaName = "マルゲリータ";
  const price = 1500;
  
  return (
    <div className="pizza">
      <h3>{pizzaName}</h3>
      <p>価格: ¥{price}</p>
    </div>
  );
}
```

### 条件付きレンダリングの実装

```jsx
function Menu() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  
  if (!isOpen) {
    return (
      <main className="menu">
        <h2>申し訳ございません</h2>
        <p>
          {openHour}:00から{closeHour}:00の間にお越しください。
        </p>
      </main>
    );
  }
  
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      <p>本格的なイタリア料理をお楽しみください。</p>
      <Pizza />
      <Pizza />
      <Pizza />
    </main>
  );
}
```

### デバッグとコンソール出力

開発中は`console.log`を活用してデータの流れを確認しましょう：

```jsx
function Footer() {
  const hour = new Date().getHours();
  const isOpen = hour >= 12 && hour <= 22;
  
  // デバッグ用のログ出力
  console.log('現在時刻:', hour);
  console.log('営業状態:', isOpen);
  
  return (
    <footer>
      {/* JSX内容 */}
    </footer>
  );
}
```

**開発のコツ**：
- React StrictModeにより、開発環境ではコンポーネントが2回レンダリングされる
- そのため、console.logも2回表示される
- これは正常な動作で、バグではない

---

## 🏗️ 関心の分離：Reactの新しいパラダイム

### 従来の関心の分離の理解

Web開発を学び始めたとき、おそらく関心の分離について教わったでしょう。そして、関心の分離とは、HTML、CSS、JavaScriptを分離することだと教わったかもしれません。つまり、1つの技術につき1つのファイルということです。

これは長い間、関心の分離の正しい方法だと考えられていました。HTML、CSS、JavaScriptを分離することで、各技術の責任を明確に分けることができると考えられていたのです。

### 現代のWebアプリケーションにおける変化

しかし、ページがよりインタラクティブになり、シングルページアプリケーションが台頭すると、状況は変わりました。現代のWebアプリケーションでは、JavaScriptがHTMLの内容と表示を決定するようになったのです。

実際、現代のWebアプリケーションでは、JavaScriptがHTMLの内容を完全に制御しています。HTMLファイル自体は、基本的に空のコンテナに過ぎません。すべての内容は、JavaScriptによって動的に生成されます。

これは、ロジックとUIが実際には密接に結合していることを意味します。そして、HTMLファイルだけでは、アプリケーションが何をするのかを理解することはできません。

### Reactの革新的なアプローチ

この現実を受けて、Reactは関心の分離に対する新しいアプローチを提案しました。

Reactでは、技術ごとに分離するのではなく、コンポーネントごとに分離します。つまり、各コンポーネントが、そのコンポーネントに関連するすべてのHTML、CSS、JavaScriptを含むのです。

### なぜこのアプローチが優れているのか

この新しいアプローチが優れている理由は、コロケーション（co-location）という概念にあります。コロケーションとは、一緒に変更されるものは、一緒に配置されるべきだという考え方です。

例えば、ボタンコンポーネントを考えてみましょう。ボタンの見た目を変更したい場合、HTMLの構造、CSSのスタイル、そしてJavaScriptの動作をすべて変更する必要があるかもしれません。

従来のアプローチでは、これらの変更を3つの異なるファイルで行う必要がありました。しかし、Reactのアプローチでは、すべての変更を1つのコンポーネントファイルで行うことができます。

### 単一責任の原則の新しい解釈

Reactのアプローチは、単一責任の原則の新しい解釈でもあります。従来は、「HTMLは構造、CSSは見た目、JavaScriptは動作」という技術的な責任の分離でした。

しかし、Reactでは、「各コンポーネントは1つのUI要素に対してのみ責任を持つ」という機能的な責任の分離になります。

### 保守性の向上

この新しいアプローチにより、保守性が大幅に向上します。特定のUI要素に問題が発生した場合、その要素に関連するすべてのコードが1つの場所にあるため、問題を特定し、修正することが容易になります。

また、新しい機能を追加する場合も、関連するすべてのコードを1つの場所に書くことができるため、開発効率が向上します。

### 再利用性の向上

さらに、このアプローチにより、コンポーネントの再利用性も向上します。コンポーネントが自己完結型であるため、他のプロジェクトや他の部分で簡単に再利用することができます。

### まとめ：新しい関心の分離

Reactの関心の分離は、技術的な分離から機能的な分離への大きなパラダイムシフトです。これにより、より保守しやすく、理解しやすく、再利用しやすいコードを書くことができるようになりました。

そして、この新しいアプローチが、Reactが大規模で複雑なアプリケーションを構築するのに適している理由の一つでもあるのです。

#### Reactコンポーネントの例

```jsx
function ProductCard({ product }) {
  // JavaScript ロジック
  const isAvailable = product.stock > 0;
  const displayPrice = isAvailable ? `¥${product.price}` : 'SOLD OUT';
  
  // JSX（HTML + CSS + JavaScript の組み合わせ）
  return (
    <div className={`product-card ${!isAvailable ? 'sold-out' : ''}`}>
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span className="price">{displayPrice}</span>
        {isAvailable && (
          <button onClick={() => addToCart(product.id)}>
            カートに追加
          </button>
        )}
      </div>
    </div>
  );
}
```

### なぜこのアプローチが優れているのか

#### 1. **コロケーション（Co-location）**

> 一緒に変更されるものは、一緒に配置されるべき

```jsx
// 商品の表示ロジックと見た目が1箇所に集約
function ProductCard({ product }) {
  // 商品の状態判定ロジック
  const isOnSale = product.discount > 0;
  const finalPrice = isOnSale 
    ? product.price * (1 - product.discount)
    : product.price;
  
  // 商品の見た目（ロジックと密接に関連）
  return (
    <div className={`product ${isOnSale ? 'on-sale' : ''}`}>
      <h3>{product.name}</h3>
      {isOnSale && <span className="sale-badge">SALE!</span>}
      <p className="price">
        {isOnSale && <s>¥{product.price}</s>}
        ¥{finalPrice}
      </p>
    </div>
  );
}
```

#### 2. **単一責任の原則**

各コンポーネントは**1つのUI要素**に対してのみ責任を持ちます：

```jsx
// ❌ 悪い例：複数の責任を持つコンポーネント
function App() {
  return (
    <div>
      {/* ヘッダー */}
      <header><h1>ショップ</h1></header>
      
      {/* 商品リスト */}
      <main>
        {products.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </main>
      
      {/* フッター */}
      <footer><p>© 2024</p></footer>
    </div>
  );
}

// ✅ 良い例：責任が分離されたコンポーネント
function App() {
  return (
    <div>
      <Header />
      <ProductList products={products} />
      <Footer />
    </div>
  );
}

function Header() {
  return <header><h1>ショップ</h1></header>;
}

function ProductList({ products }) {
  return (
    <main>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  );
}
```

#### 3. **保守性の向上**

```jsx
// 商品カードの仕様変更が必要な場合
function ProductCard({ product }) {
  // 関連するロジックとUIが1箇所にあるため、
  // 変更が簡単で影響範囲が明確
  
  const handleAddToCart = () => {
    // カート追加ロジック
    addToCart(product.id);
    showNotification(`${product.name}をカートに追加しました`);
  };
  
  return (
    <div className="product-card">
      {/* 商品表示UI */}
      <button onClick={handleAddToCart}>
        カートに追加
      </button>
    </div>
  );
}
```

### 実際のプロジェクトでの適用

最終プロジェクトの構造を見てみましょう：

```jsx
// 各コンポーネントが明確な責任を持つ
function App() {
  return (
    <div className="container">
      <Header />      {/* レストラン名の表示 */}
      <Menu />        {/* メニューの管理と表示 */}
      <Footer />      {/* 営業時間と注文ボタン */}
    </div>
  );
}

function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;
  
  return (
    <main className="menu">
      <h2>Our menu</h2>
      {numPizzas > 0 ? (
        <>
          <p>本格的なイタリア料理。創作料理6品からお選びください。</p>
          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza pizzaObj={pizza} key={pizza.name} />
            ))}
          </ul>
        </>
      ) : (
        <p>メニューを準備中です。後ほどお越しください :)</p>
      )}
    </main>
  );
}
```

### まとめ：新しい関心の分離

**Reactの関心の分離は「技術ごと」から「コンポーネントごと」へのパラダイムシフト**

- **従来**：HTML、CSS、JavaScriptを分離
- **React**：機能的に関連するコードを1つのコンポーネントに集約
- **利点**：保守性、再利用性、理解しやすさの向上

この新しいアプローチにより、大規模なアプリケーションでも一貫性を保ちながら開発できるようになりました。

---

## 📚 学習のまとめ

### このセッションで習得したスキル

| 概念 | 説明 | 実例 |
|------|------|------|
| **JSXの本質** | 宣言的構文によるUI記述 | `<h1>{title}</h1>` |
| **コンポーネント設計** | 再利用可能な部品の作成 | `<Pizza />` × 複数 |
| **JavaScriptロジック** | コンポーネント内でのロジック実装 | 営業時間判定、条件分岐 |
| **関心の分離** | コンポーネント単位での責任分離 | Header, Menu, Footer |

### 重要なポイント

#### JSXについて
- **宣言的アプローチ**：「何を」表示するかに集中
- **自動変換**：BabelによりReact.createElementに変換
- **DOM抽象化**：直接的なDOM操作が不要

#### コンポーネント設計について
- **単一責任**：1つのコンポーネントは1つの明確な役割
- **再利用性**：同じコンポーネントを異なるデータで使用
- **階層構造**：小さなコンポーネントを組み合わせて大きなUIを構築

#### 関心の分離について
- **新しいパラダイム**：技術的分離から機能的分離へ
- **コロケーション**：関連するコードを近くに配置
- **保守性向上**：変更の影響範囲が明確

---

## 🎯 重要な開発原則

### Reactコンポーネント設計の原則

- **宣言的思考**：「どうやって」ではなく「何を」に集中
- **コンポーネント思考**：UIを再利用可能な部品として考える
- **単一責任**：各コンポーネントは明確な1つの役割を持つ
- **関心の集約**：関連するロジックとUIを1箇所にまとめる

### 開発効率を上げるコツ

- **JSXの威力を活用**：HTML、CSS、JavaScriptの自然な組み合わせ
- **コンソールログを活用**：データの流れを確認
- **小さく始める**：シンプルなコンポーネントから段階的に構築
- **再利用を意識**：同じパターンは共通コンポーネント化

このセッションで学んだJSXとコンポーネント設計の知識は、React開発の核となる概念です。次のセッションでより高度な機能を学ぶ準備が整いました！