# Session4: 動的レンダリングと実践テクニック

## 🎯 このセッションで学ぶこと

Session1〜3 で学んだ React の基礎知識を統合し、より実践的で動的なアプリケーション開発を目指します。

- **📋 リストレンダリング**：配列データを使った動的なコンポーネント生成
- **⚡ 条件付きレンダリング**：&&演算子、三項演算子、複数 return の使い分け
- **🔀 コンポーネント抽出**：JSX の分割とコンポーネント設計の実践
- **🎯 Props の分割代入**：より効率的な Props 受け取り方法
- **📦 React Fragments**：不要な DOM 要素を避ける技術
- **🎨 動的スタイリング**：条件に応じたクラス名とテキストの設定

これまでのセッションで構築したピザメニューアプリケーションを完成させ、実際の Web アプリケーションで必要となる動的な機能を実装していきます。

---

## 📋 リストレンダリング：配列からコンポーネントを生成

### リストレンダリングとは何か

リストレンダリングは、ほぼすべての React アプリケーションで最もよく使われる技術の一つです。おそらくこのコース全体で何度も使うことになるでしょう。ここで、React でリストをレンダリングする方法を学びます。

リストレンダリングとは、配列があり、その配列の各要素ごとに 1 つのコンポーネントを作成したい場合に使います。

### 実践的な例での理解

例えば、ここにすべてのスターターデータがあります。各オブジェクトが 1 つのピザを表すオブジェクトの配列です。

そして、このリストをレンダリングしたいと考えます。つまり、この配列を使って、各ピザオブジェクトごとに自動的に 1 つのピザコンポーネントを UI 上に作成したいのです。

つまり、ピザコンポーネントを手動で 1 つずつ呼び出すのではなく、すべてを一度に動的に表示したいのです。

配列に 4 つのピザがあれば 4 つ、10 個あれば 10 個のコンポーネントを表示したい、ということです。

### React の美しさ：JavaScript の知識の活用

React の素晴らしい点は、多くの場合、すでに持っている JavaScript の知識だけで十分だということです。

例えば、リストレンダリングについては、React 独自の新しい知識は必要ありません。特別なリスト要素が用意されているわけでもありません。

必要なのは、すでに持っている JavaScript の知識だけです。この場合は map メソッドを使います。

### 実践的な実装

それでは、実際にどのように実装するかを見てみましょう。

まずは新しい div を作成します。後でこれをリスト要素に変換しますが、最初はどんな要素でも構いません。
``jsx
function Menu() {
const pizzas = pizzaData;

return (
<main className="menu">
<h2>Our Menu</h2>

      <div>
        {pizzaData.map((pizza) => (
          <Pizza
            name={pizza.name}
            ingredients={pizza.ingredients}
            price={pizza.price}
            photoName={pizza.photoName}
            key={pizza.name}
          />
        ))}
      </div>
    </main>

);
}

````

まず、JavaScriptのコード内でpizzaDataを取得します。これは単なる配列です。

そして、それをmapで処理します。mapは配列をループして新しい配列を作成します。

このpizzaDataの各要素がピザです。mapの結果として、各ピザに対してピザコンポーネントを作成します。

### より効率的なアプローチ

通常は、オブジェクト全体をより具体的なコンポーネント（この場合はピザ）に渡し、そのコンポーネント内で必要な情報を取り出します。

```jsx
function Menu() {
  const pizzas = pizzaData;

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      <ul className="pizzas">
        {pizzas.map((pizza) => (
          <Pizza
            pizzaObj={pizza}
            key={pizza.name}
          />
        ))}
      </ul>
    </main>
  );
}

function Pizza({ pizzaObj }) {
  return (
    <li className="pizza">
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>¥{pizzaObj.price}</span>
      </div>
    </li>
  );
}
````

これで、pizzaData 配列に基づいたすべてのピザのリストが表示されます。

### key 属性の重要性

コンソールに「リスト内の各子要素は一意の key プロパティを持つべきです」という警告が表示されることに注意してください。

基本的に、これが意味するのは、このように map メソッドでリストをレンダリングするたびに、レンダリングされる各アイテムが一意の key プロパティを必要とするということです。

key は React の内部的な prop で、パフォーマンス最適化のために必要です。今は深く理解しなくても大丈夫ですが、後で key プロパティの役割について学びます。

今重要なのは、各要素に一意の値を渡すことです。この場合はピザの名前です。この例では名前が一意です。

```jsx
{
  pizzas.map((pizza) => (
    <Pizza
      pizzaObj={pizza}
      key={pizza.name} // 一意のキー
    />
  ));
}
```

これで警告は消えます。

### セマンティックマークアップの重要性

次に、ここを単純な div から ul（順序なしリスト）に変換します。そして、各ピザは li（リストアイテム）であるべきです。

このようなセマンティックなマークアップを書くことはとても重要です。多くのコースでは見落とされがちですが、私は非常に大切だと考えています。

### なぜ map メソッドなのか

forEach を使いたくなるかもしれませんが、それではうまくいきません。

```jsx
// ❌ これは動作しません
{
  pizzaData.forEach((pizza) => <Pizza pizzaObj={pizza} key={pizza.name} />);
}
```

実際、何も表示されません。これは、ul 内で JSX が必要だからです。JSX を得るには新しい配列を作成する必要があります。

それが map の役割です。新しい配列を作成し、この場合は 6 つのピザを含みます。React はこの配列をレンダリングできます。

とても重要な技術です。覚えられなくても心配しなくて大丈夫です。コース全体で何度も使うことになります。

---

## ⚡ 条件付きレンダリング：&&演算子の活用

### 条件付きレンダリングの重要性

React 開発で常に使用する非常に重要な技術がもう一つあります。それが条件付きレンダリングです。

このビデオと次の 2 つのビデオで、条件付きレンダリングを行う 3 つの異なる方法を学習します。そして、最初の方法は&&演算子を使用することです。

### 条件付きレンダリングとは

条件付きレンダリングとは、基本的に UI の一部を、レストランが現在営業中かどうかなどの条件に基づいてレンダリングすることです。

そして、それが条件付きレンダリングのすべてです。つまり、基本的に、何らかの条件に基づいて UI の一部をレンダリングすることです。

### &&演算子を使った条件付きレンダリング

#### 基本的な使用方法

まず、以前にフッターで作成した isOpen 変数を思い出してください。基本的に、この変数は現在レストランが営業中かどうかを教えてくれます。これは、現在の時刻が 12 時から 22 時の間にある場合に発生します。

そして今、私たちがやりたいことは、レストランが現在営業中の場合にのみ、フッター内で何かをレンダリングすることです。

```jsx
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

  return (
    <footer className="footer">
      {isOpen && (
        <div className="order">
          <p>
            {openHour}:00から{closeHour}:00まで営業中です。
            ご来店またはオンラインでご注文ください。
          </p>
          <button className="btn">注文する</button>
        </div>
      )}
    </footer>
  );
}
```

#### &&演算子の動作原理

**短絡評価（Short-circuit evaluation）**の仕組み：

```jsx
// 条件がtrueの場合
{
  true && <div>表示される</div>;
} // → <div>表示される</div>

// 条件がfalseの場合
{
  false && <div>表示されない</div>;
} // → false（Reactは何も表示しない）
```

### 実践例：メニューの条件付き表示

```jsx
function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {numPizzas > 0 && (
        <>
          <p>
            本格的なイタリア料理。創造的な6つの料理からお選びください。
            すべて石窯で、すべてオーガニック、すべて美味しい。
          </p>

          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza pizzaObj={pizza} key={pizza.name} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
```

これは条件付きレンダリングの良い使用例です。別の例も見てみましょう。

### &&演算子使用時の注意点

#### 問題：数値 0 が表示される場合

```jsx
function Menu() {
  const numPizzas = 0; // ピザが0個の場合

  return (
    <div>
      {/* ❌ 問題：0が画面に表示される */}
      {numPizzas && <p>ピザがあります</p>}
    </div>
  );
}
```

なぜこれが起こるのでしょうか？それは短絡評価のためです。&&演算子が短絡する場合、この部分を評価しませんが、代わりに操作の結果がこれになります。

つまり、これは 0 であり、したがって UI で 0 を取得します。これは下では起こりませんでした。なぜなら、前述したように、React は true または false の値をレンダリングしませんが、0 は喜んでレンダリングするからです。

**解決方法**：明示的に boolean 値を使用

```jsx
function Menu() {
  const numPizzas = 0;

  return (
    <div>
      {/* ✅ 解決：boolean値で条件判定 */}
      {numPizzas > 0 && <p>ピザがあります</p>}
    </div>
  );
}
```

結論として、ここに数値を置くべきではありません。常に true または false の条件を持つようにするべきです。

---

## 🔀 条件付きレンダリング：三項演算子の活用

### 三項演算子による条件付きレンダリング

三項演算子を使って同じことをどのように行うかを見てみましょう。

ここの&&演算子の代わりに、三項演算子を使って条件付きレンダリングを行いましょう。

この三項演算子に慣れていない場合は、React に必要な JavaScript の復習の前のセクションをチェックしてください。

### 三項演算子の構造

三項演算子には 3 つの部分があります。最初の部分は条件で、この条件が true の場合、演算の結果はこの演算子の 2 番目の部分になります。

しかし、三項演算子には 3 番目の部分も必要で、これは基本的に else 分岐のようなものです。```jsx

function Menu() {
const numPizzas = pizzaData.length;

return (
<main className="menu">
<h2>Our Menu</h2>

      {numPizzas > 0 ? (
        // 条件がtrueの場合の表示
        <>
          <p>
            本格的なイタリア料理。創造的な6つの料理からお選びください。
            すべて石窯で、すべてオーガニック、すべて美味しい。
          </p>
          <ul className="pizzas">
            {pizzaData.map((pizza) => (
              <Pizza pizzaObj={pizza} key={pizza.name} />
            ))}
          </ul>
        </>
      ) : (
        // 条件がfalseの場合の表示
        <p>メニューを準備中です。後ほどお越しください :)</p>
      )}
    </main>

);
}

````

以前と全く同じ結果が得られることがわかります。

### 三項演算子の利点

三項演算子を使用する利点は、代替案を表示できることです。より多くのJSXをここに書きましょう。「メニューを準備中です。後ほどお越しください」などと言いましょう。

そうすると、これが表示されます。これは、状況によっては、単に何も表示しないよりも少し良いです。

### なぜif-else文は使えないのか

なぜここで単純にif-else文を使用できないのか疑問に思うかもしれません。

その理由は、再び、JSXのルールに関する講義で学んだことのためです。つまり、このJavaScriptモード内では、任意のJavaScriptを書くことはできません。

ここで行う必要があるのは、実際に値を生成する何かを書くことです。そして、if-else文は値を生成しません。

```jsx
// ❌ これは動作しません
{if (numPizzas > 0) {
  return <p>ピザがあります</p>;
} else {
  return <p>ピザがありません</p>;
}}
````

架空の実験をしてみましょう。「numPizzas > 0 の場合、これを」と書いたとしましょう。しかし、それは実際には起こりません。

ここで大きなエラーが表示され、単に「予期しないトークン」と言っています。そして、ここでの理由は、これを行うことが値を生成しないからです。

### 三項演算子の実用性

このように使用される三項演算子は本当に素晴らしく、私は使用していた&&演算子よりもそれを大いに好みます。

```jsx
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

  return (
    <footer className="footer">
      {isOpen ? (
        <Order closeHour={closeHour} openHour={openHour} />
      ) : (
        <p>
          {openHour}:00から{closeHour}:00の間にお越しください。
        </p>
      )}
    </footer>
  );
}
```

三項演算子は、React ツールボックスの本当に重要なツールです。

そして、再び、ここでは単に JavaScript を使用しているだけです。条件付きレンダリングを行うために学習したり記憶したりする必要がある React 固有のものは何もありません。

それはすべて既に JavaScript 言語の一部です。これをどのように使用するかを知る必要があるだけです。つまり、基本的に、これらの波括弧内で JavaScript モードに入り、そして、バニラ JavaScript で行うのと同じように演算子を使用するだけです。

---

## 🔄 条件付きレンダリング：複数 return の活用

### 複数 return とは

これまでのコンポーネントは 1 つの`return`文のみでしたが、条件に応じて**異なる return 文を実行**することも可能です。特に、表示内容が大きく異なる場合に有効な手法です。

### 基本的な使用方法

```jsx
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

  // 早期return：営業時間外の場合
  if (!isOpen) {
    return (
      <footer className="footer">
        <p>
          {openHour}:00から{closeHour}:00の間にお越しください。
        </p>
      </footer>
    );
  }

  // 通常のreturn：営業中の場合
  return (
    <footer className="footer">
      <div className="order">
        <p>
          {openHour}:00から{closeHour}:00まで営業中です。
          ご来店またはオンラインでご注文ください。
        </p>
        <button className="btn">注文する</button>
      </div>
    </footer>
  );
}
```

### 実践例：売り切れピザの非表示

```jsx
function Pizza({ pizzaObj }) {
  // 早期return：売り切れの場合は何も表示しない
  if (pizzaObj.soldOut) {
    return null;
  }

  // 通常のreturn：通常のピザ表示
  return (
    <li className="pizza">
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>¥{pizzaObj.price}</span>
      </div>
    </li>
  );
}
```

ここで重要なのは、これら 2 つの return が同時に発生することはできないということです。しかし、それは今のところ短いです。

この早期 return のようなものは、JSX の一部ではなく、コンポーネント全体を条件付きでレンダリングしたい場合により有用です。

---

## 🧩 JSX の新しいコンポーネントへの抽出

### コンポーネント抽出とは

コンポーネントの概念と props の使用をもう少し練習するために、フッターの一部を新しいコンポーネントに抽出しましょう。

フッターコンポーネント内の JSX が少し長くなりすぎているので、この部分を取り出して独自のコンポーネントに抽出するアイデアを得ました。

### 実践例：Footer コンポーネントの抽出

#### Step 1: JSX の抽出

```jsx
// 抽出前のFooterコンポーネント
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

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

`className="orfer"`の部分をカットして、新しいコンポーネントを作成します。

#### Step 2: 新しい Order コンポーネントの作成

```jsx
function Order() {
  return (
    <div className="order">
      <p>
        {openHour}:00から{closeHour}:00まで営業中です。
        ご来店またはオンラインでご注文ください。
      </p>
      <button className="btn">注文する</button>
    </div>
  );
}
```

#### Step 3: 元の Footer コンポーネントの更新

```jsx
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

  return (
    <footer className="footer">
      {isOpen ? (
        <Order /> // 新しいコンポーネントを使用
      ) : (
        <p>
          {openHour}:00から{closeHour}:00の間にお越しください。
        </p>
      )}
    </footer>
  );
}
```

#### Step 4: エラーの発生と解決

しかし、この時点でエラーが発生します。`Order`コンポーネント内で`openHour`と`closeHour`が未定義になってしまいます。

**解決方法：props を使用**

```jsx
// 修正されたOrderコンポーネント
function Order({ closeHour, openHour }) {
  return (
    <div className="order">
      <p>
        {openHour}:00から{closeHour}:00まで営業中です。
        ご来店またはオンラインでご注文ください。
      </p>
      <button className="btn">注文する</button>
    </div>
  );
}

// 修正されたFooterコンポーネント
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

  return (
    <footer className="footer">
      {isOpen ? (
        <Order closeHour={closeHour} openHour={openHour} />
      ) : (
        <p>
          {openHour}:00から{closeHour}:00の間にお越しください。
        </p>
      )}
    </footer>
  );
}
```

これは、JSX の一部をコンポーネント内の JSX が少し大きくなりすぎたときに、独自のコンポーネントに抽出する方法です。

そして、その JSX が親コンポーネントにあった何らかの値（この場合は closeHour）に依存している場合、単純にそれを prop として渡します。

これは、React アプリケーションを構築するときに常に行うことです。最初からすべてのコンポーネントを把握しているわけではありませんが、代わりにそれらを構築し始め、大きくなりすぎたときに、それらの一部を別のコンポーネントに抽出することを決定できます。

---

## 🎯 Props の分割代入（Destructuring Props）

### 分割代入とは

props が何であるかを知ったので、props を実際に使用する際に生活を少し楽にしましょう。

すでに知っているように、コンポーネントに props を渡すたびに、そのコンポーネントは自動的にこの props オブジェクトを受け取ります。これには、渡したすべての props が含まれます。

実際、すべてのコンポーネントはこの props オブジェクトを受け取ります。props を渡さないフッターでも、それを定義してコンソールにログできます。

### 従来の方法 vs 分割代入

#### Before：従来の方法

```jsx
function Pizza(props) {
  return (
    <li className="pizza">
      <img src={props.pizzaObj.photoName} alt={props.pizzaObj.name} />
      <div>
        <h3>{props.pizzaObj.name}</h3>
        <p>{props.pizzaObj.ingredients}</p>
        <span>¥{props.pizzaObj.price}</span>
      </div>
    </li>
  );
}
```

#### After：分割代入を使用

```jsx
function Pizza({ pizzaObj }) {
  return (
    <li className="pizza">
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>¥{pizzaObj.price}</span>
      </div>
    </li>
  );
}
```

### さらなる分割代入の活用

#### オブジェクトのプロパティも分割代入

```jsx
function Pizza({ pizzaObj }) {
  // pizzaObjectのプロパティをさらに分割代入
  const { name, ingredients, price, photoName, soldOut } = pizzaObj;

  return (
    <li className="pizza">
      <img src={photoName} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>{ingredients}</p>
        <span>¥{price}</span>
        {soldOut && <span className="sold-out">売り切れ</span>}
      </div>
    </li>
  );
}
```

### 複数 props の分割代入

```jsx
function Order({ openHour, closeHour }) {
  return (
    <div className="order">
      <p>
        {openHour}:00から{closeHour}:00まで営業中です。
        ご来店またはオンラインでご注文ください。
      </p>
      <button className="btn">注文する</button>
    </div>
  );
}
```

これは本当に、本当に素晴らしいです。なぜなら、今、私たちがしなければならないのは、このコンポーネントが実際に受け取る props を知るために、この行を見るだけだからです。

以前は、一般的な props しかありませんでした。そして、最終的にここでどのような props を受け取るかを知りたい場合は、props が実際に渡される場所に行く必要がありました。

しかし、今はもうそうではありません。今、このコンポーネント定義で、pizzaObject を受け取ることがすぐにわかります。

そして、それが props を即座に分割代入することの 2 番目の本当に大きな利点です。

---

## 📦 React Fragments：不要な DOM 要素を避ける

### React Fragments とは

React Fragment とは何か、そしていつ正確にそれが必要になるかを学びましょう。

実際に、アプリケーションの最終バージョンに来て、実際にまだ何かが欠けていることを示すことができます。それはこの文章です。

ここに段落のテキストがあり、それをコピーします。ビデオを一時停止してタイプするか、何か短いものをタイプできます。

### 問題：不要なラッパー要素

```jsx
function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {numPizzas > 0 ? (
        // ❌ 複数の要素を返そうとするとエラー
        <p>
          本格的なイタリア料理。創造的な6つの料理からお選びください。
          すべて石窯で、すべてオーガニック、すべて美味しい。
        </p>

        <ul className="pizzas">
          {pizzas.map((pizza) => (
            <Pizza pizzaObj={pizza} key={pizza.name} />
          ))}
        </ul>
      ) : (
        <p>メニューを準備中です。後ほどお越しください :)</p>
      )}
    </main>
  );
}
```

しかし、すぐに React が私たちに怒り始めます。「JSX 式には 1 つの親要素が必要です」と。

これは、JSX のルール講義で学んだことと全く同じです。JSX の一部は、どこで定義されても、実際には 1 つのルート要素しか持てません。

### 解決方法：React Fragments

#### 1. **React.Fragment 構文**

```jsx
function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {numPizzas > 0 ? (
        <React.Fragment>
          <p>
            本格的なイタリア料理。創造的な6つの料理からお選びください。
            すべて石窯で、すべてオーガニック、すべて美味しい。
          </p>

          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza pizzaObj={pizza} key={pizza.name} />
            ))}
          </ul>
        </React.Fragment>
      ) : (
        <p>メニューを準備中です。後ほどお越しください :)</p>
      )}
    </main>
  );
}
```

#### 2. **短縮構文（推奨）**

```jsx
function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {numPizzas > 0 ? (
        <>
          <p>
            本格的なイタリア料理。創造的な6つの料理からお選びください。
            すべて石窯で、すべてオーガニック、すべて美味しい。
          </p>

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

React Fragment は基本的に、HTML ツリー、つまり DOM に痕跡を残すことなく、いくつかの要素をグループ化できます。

時々、React Fragment に key を追加する必要があります。たとえば、リストをレンダリングするために使用している場合などです。その場合、少し異なる方法で書く必要があります。

```jsx
// keyが必要な場合
{
  items.map((item) => (
    <React.Fragment key={item.id}>
      <div>{item.name}</div>
      <div>{item.description}</div>
    </React.Fragment>
  ));
}
```

しかし、key は必要ないので、短いバージョンを使用できます。これはもちろんずっと良いです。

---

## 🎨 動的スタイリング：条件に応じたクラス名とテキストの設定

### 動的スタイリングとは

このプロジェクトを完成させるために、要素内でテキストを条件付きで設定する方法と、クラス名を条件付きで設定する方法を学びましょう。

最終プロジェクトを最後に見ると、唯一の違いは、売り切れのこのピザが価格の代わりに売り切れのテキストを持っていることです。そして、ここの要素全体が少しグレーアウトされています。利用できないことを示すためです。

### 条件付きテキストの設定

現在、売り切れピザが表示されないようにするコード行があります。まず、それを取り除くことから始めましょう。

```jsx
function Pizza({ pizzaObj }) {
  // この行を削除
  // if (pizzaObj.soldOut) return null;

  const { name, ingredients, price, photoName, soldOut } = pizzaObj;

  return (
    <li className="pizza">
      <img src={photoName} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>{ingredients}</p>
        <span>{soldOut ? "SOLD OUT" : `¥${price}`}</span>
      </div>
    </li>
  );
}
```

これで、条件付きでテキストを表示する準備ができました。以前に行ったこととの違いは、以前はこの要素全体を条件付きでレンダリングしていたことです。

しかし、今はそれが欲しいわけではありません。今、私たちはすでにこの span 要素が欲しいことを知っていますが、まだ内容は欲しくありません。

そして、それを条件付きで設定しましょう。それは非常に簡単です。再び、三項演算子を使用します。

### 条件付きクラス名の設定

最後に、クラス名について、ピザが売り切れの場合はいつでも、LI に sold out クラスを追加できます。これにより、グレーアウトされます。

```jsx
function Pizza({ pizzaObj }) {
  const { name, ingredients, price, photoName, soldOut } = pizzaObj;

  return (
    <li className={`pizza ${soldOut ? "sold-out" : ""}`}>
      <img src={photoName} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>{ingredients}</p>
        <span>{soldOut ? "SOLD OUT" : `¥${price}`}</span>
      </div>
    </li>
  );
}
```

これが私たちが求めていたものです。なぜこれが機能したかを要約しましょう。

テンプレートリテラルがあり、ここで単純に JavaScript 式を書きます。そして、三項演算子で、これが存在するかどうかをチェックし、もしそうなら。

つまり、これが true の場合、この演算子の結果は sold out になります。そして、この全体が sold out になります。そして、文字列は以前と全く同じになります。

しかし、これが false の場合、ここで何も返しません。そして、文字列は単に pizza になります。これは、これらすべてのケースでここにあるものです。

素晴らしい。これが、要素に CSS クラスを条件付きで設定する方法です。

Vanilla JavaScript で使用しなければならない classList プロパティを使用することなく、すべて。

そして、ここでは、Vanilla JavaScript では、textContent プロパティや innerHTML などで DOM 操作を行う必要があることを覚えておいてください。

しかし、ここで JSX と React の宣言的な性質により、すべてが少し簡単で、作業しやすくなります。

### 最終的な仕上げ

最後の詳細として、public フォルダに来ましょう。そして、index.html で、ドキュメントのタイトルを設定したいと思います。

ここに Fast React Pizza Co.がありますが、ここではデフォルトの React App と表示されており、少し醜いです。Fast React Pizza Co.と言いましょう。

それで終わりです。これで、実際にアプリケーションと最初のプロジェクトを完成させました。

この長いセクションの最後まで到達したことをおめでとうございます。

---

## 🎓 まとめ：Session4 で習得した技術

### 学習した技術の総括

このセッションでは、React アプリケーション開発に必須の動的レンダリング技術を習得しました：

#### 📋 **リストレンダリング**

- `map()`メソッドを使った配列からのコンポーネント生成
- `key`属性の重要性とパフォーマンス最適化
- セマンティックな HTML 構造の維持

#### ⚡ **条件付きレンダリング**

- `&&`演算子：シンプルな表示/非表示制御
- 三項演算子：2 つの選択肢からの選択
- 複数 return：大きく異なる表示パターン

#### 🧩 **コンポーネント設計**

- JSX の適切な抽出とコンポーネント分割
- 責任の分離と再利用性の向上
- 保守しやすいコード構造の実現

#### 🎯 **効率的な Props 管理**

- 分割代入による可読性向上
- 複数 props の効率的な処理

#### 📦 **React Fragments**

- 不要な DOM 要素の削除
- セマンティック HTML の維持
- CSS レイアウトへの影響回避

#### 🎨 **動的スタイリング**

- 条件付きクラス名の設定
- 条件付きテキスト内容の設定
- テンプレートリテラルの活用

これらの技術は、実際の Web アプリケーション開発で頻繁に使用される基本的で重要なスキルです。継続的な実践を通じて、これらの概念を自分のものにしていきましょう。
