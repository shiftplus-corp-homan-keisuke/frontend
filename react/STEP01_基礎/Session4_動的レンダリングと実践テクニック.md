# Session4: 動的レンダリングと実践テクニック

## 🎯 このセッションで学ぶこと

Session1-3で学んだReactの基礎知識を統合し、より実践的で動的なアプリケーション開発を目指します：

- **📋 リストレンダリング**：配列データを使った動的なコンポーネント生成
- **⚡ 条件付きレンダリング**：&&演算子、三項演算子、複数returnの使い分け
- **🔀 コンポーネント抽出**：JSXの分割とコンポーネント設計の実践
- **🎯 Propsの分割代入**：より効率的なProps受け取り方法
- **📦 React Fragments**：不要なDOM要素を避ける技術
- **🎨 動的スタイリング**：条件に応じたクラス名とテキストの設定

これまでのセッションで構築したピザメニューアプリケーションを完成させ、実際のWebアプリケーションで必要となる動的な機能を実装していきます。

---

## 📋 リストレンダリング：配列からコンポーネントを生成

### リストレンダリングとは何か

リストレンダリングは、基本的にすべてのReactアプリケーションで行う最も一般的なことの一つです。おそらくこのコース全体を通じて100回ほど行うことになるでしょう。そこで、Reactでリストをレンダリングする方法を学びましょう。

基本的に、リストレンダリングとは、配列があり、その配列の各要素に対して1つのコンポーネントを作成したい場合のことです。

### 実践的な例での理解

たとえば、ここにすべてのスターターデータがありますよね？ここに、各オブジェクトが1つのピザであるオブジェクトの配列があります。

そして、想像できるように、今度は基本的にこのリストをレンダリングしたいのです。つまり、基本的にこの配列を取り、これらの各ピザオブジェクトに対して、ユーザーインターフェースで自動的に1つのピザコンポーネントを作成したいのです。

つまり、ここでピザコンポーネントを手動で1つずつ呼び出したり使用したりする代わりに、すべてを一度に動的に行いたいのです。

配列に4つのピザがある場合、4つのコンポーネントをレンダリングしたいのです。しかし、6つや10個ある場合は、アプリに10個のコンポーネントを表示したいのです。

### Reactの美しさ：JavaScriptの知識の活用

さて、Reactの美しさは、多くのことについて、私たちが本当に必要なのは、すでに持っているJavaScriptの知識だけだということです。

たとえば、リストレンダリングについては、Reactについて学ぶ必要がある新しいことは何もありません。使用できるリスト要素のようなものを提供してくれるわけではありません。

必要なのは、すでに持っているJavaScriptの知識だけです。そして、この場合、必要なのはmapメソッドだけです。

### 実践的な実装

これだけ話した後で、どのように行うかを示しましょう。

新しいdivを作成しましょう。後でこれを実際のリスト要素に変換しますが、まずは任意の要素から始めましょう。どれでも構いません。`
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
```

まず、JavaScriptモードに入って、pizzaDataを取得しましょう。これは単なる配列であることを覚えておいてください。

そして、それをmapしましょう。mapで、基本的にこの配列をループし、まったく新しい配列を作成します。

このpizzaDataでは、各要素がピザです。そして、この新しい配列（mapの結果となる新しい配列）で欲しいのは、各ピザに対してピザコンポーネントです。

### より効率的なアプローチ

通常、これは私たちが行う方法ではありません。通常行うのは、オブジェクト全体をより具体的なコンポーネント（この場合はピザ）に渡し、そのコンポーネント内で、オブジェクトから欲しい情報を取り出すことです。

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
```

そして、そこにあります。pizzaData配列に基づくすべてのピザのリストがあります。

### key属性の重要性

コンソールにエラーがあることに注目してください。「リスト内の各子要素は一意のkeyプロパティを持つべきです」という警告が表示されています。

基本的に、これが意味するのは、このようにmapメソッドでリストをレンダリングするたびに、レンダリングされる各アイテムが一意のkeyプロパティを必要とするということです。

keyは基本的にReactの内部的なpropで、いくつかのパフォーマンス最適化のために必要です。今のところ、それが何を意味するかはそれほど重要ではありません。後でこのkeyプロパティが正確に何であり、何をするかを学びます。

今重要なのは、各要素に一意の何かを渡すことです。この場合、各ピザに対して、それは名前です。この例では、名前は常に一意です。

```jsx
{pizzas.map((pizza) => (
  <Pizza 
    pizzaObj={pizza} 
    key={pizza.name}  // 一意のキー
  />
))}
```

そうすれば、ここの警告は消えます。

### セマンティックマークアップの重要性

次に、ここを単純なdivからUL（順序なしリスト）に変換したいと思います。そして、これらの各ピザ自体はリスト要素またはリストアイテム、つまりLIであるべきです。

このようなセマンティックマークアップを書くことは非常に重要で、多くのコースがなぜか見落としていますが、私はそれがかなり重要だと信じています。

### なぜmapメソッドなのか

forEachを使用するかもしれないと思ったかもしれません。それぞれに対して1つのピザをレンダリングしたいので、より論理的に聞こえるかもしれません。しかし、それは実際にはうまくいきません。

```jsx
// ❌ これは動作しません
{pizzaData.forEach((pizza) => (
  <Pizza pizzaObj={pizza} key={pizza.name} />
))}
```

そして、何も起こらないのがわかります。それは、このUL内で実際にJSXが必要だからです。そして、そのJSXを取得する唯一の方法は、新しい配列を作成することです。

そして、それがmapが行うことです。新しい配列を作成し、この場合、これら6つのピザを含みます。そして、ここでこれらすべてのピザを含む配列があり、Reactはそれをレンダリングする方法を知っています。

非常に重要な技術です。これを覚えるか、覚えたくない場合は心配しないでください。コース全体を通じて何十回も行うことになるからです。

---

## ⚡ 条件付きレンダリング：&&演算子の活用

### 条件付きレンダリングの重要性

React開発で常に使用する非常に重要な技術がもう一つあります。それが条件付きレンダリングです。

このビデオと次の2つのビデオで、条件付きレンダリングを行う3つの異なる方法を学習します。そして、最初の方法は&&演算子を使用することです。

### 条件付きレンダリングとは

条件付きレンダリングとは、基本的にUIの一部を、レストランが現在営業中かどうかなどの条件に基づいてレンダリングすることです。

そして、それが条件付きレンダリングのすべてです。つまり、基本的に、何らかの条件に基づいてUIの一部をレンダリングすることです。

### &&演算子を使った条件付きレンダリング

#### 基本的な使用方法

まず、以前にフッターで作成したisOpen変数を思い出してください。基本的に、この変数は現在レストランが営業中かどうかを教えてくれます。これは、現在の時刻が12時から22時の間にある場合に発生します。

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
{true && <div>表示される</div>}   // → <div>表示される</div>

// 条件がfalseの場合  
{false && <div>表示されない</div>} // → false（Reactは何も表示しない）
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

#### 問題：数値0が表示される場合

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

つまり、これは0であり、したがってUIで0を取得します。これは下では起こりませんでした。なぜなら、前述したように、Reactはtrueまたはfalseの値をレンダリングしませんが、0は喜んでレンダリングするからです。

**解決方法**：明示的にboolean値を使用

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

結論として、ここに数値を置くべきではありません。常にtrueまたはfalseの条件を持つようにするべきです。

---

## 🔀 条件付きレンダリング：三項演算子の活用

### 三項演算子による条件付きレンダリング

三項演算子を使って同じことをどのように行うかを見てみましょう。

ここの&&演算子の代わりに、三項演算子を使って条件付きレンダリングを行いましょう。

この三項演算子に慣れていない場合は、Reactに必要なJavaScriptの復習の前のセクションをチェックしてください。

### 三項演算子の構造

三項演算子には3つの部分があります。最初の部分は条件で、この条件がtrueの場合、演算の結果はこの演算子の2番目の部分になります。

しかし、三項演算子には3番目の部分も必要で、これは基本的にelse分岐のようなものです。```jsx

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
```

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
```

架空の実験をしてみましょう。「numPizzas > 0の場合、これを」と書いたとしましょう。しかし、それは実際には起こりません。

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

三項演算子は、Reactツールボックスの本当に重要なツールです。

そして、再び、ここでは単にJavaScriptを使用しているだけです。条件付きレンダリングを行うために学習したり記憶したりする必要があるReact固有のものは何もありません。

それはすべて既にJavaScript言語の一部です。これをどのように使用するかを知る必要があるだけです。つまり、基本的に、これらの波括弧内でJavaScriptモードに入り、そして、バニラJavaScriptで行うのと同じように演算子を使用するだけです。

---

## 🔄 条件付きレンダリング：複数returnの活用

### 複数returnとは

これまでのコンポーネントは1つの`return`文のみでしたが、条件に応じて**異なるreturn文を実行**することも可能です。特に、表示内容が大きく異なる場合に有効な手法です。

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

ここで重要なのは、これら2つのreturnが同時に発生することはできないということです。しかし、それは今のところ短いです。

この早期returnのようなものは、JSXの一部ではなく、コンポーネント全体を条件付きでレンダリングしたい場合により有用です。

---

## 🧩 JSXの新しいコンポーネントへの抽出

### コンポーネント抽出とは

コンポーネントの概念とpropsの使用をもう少し練習するために、フッターの一部を新しいコンポーネントに抽出しましょう。

フッターコンポーネント内のJSXが少し長くなりすぎているので、この部分を取り出して独自のコンポーネントに抽出するアイデアを得ました。

### 実践例：Footerコンポーネントの抽出

#### Step 1: JSXの抽出

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

#### Step 2: 新しいOrderコンポーネントの作成

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

#### Step 3: 元のFooterコンポーネントの更新

```jsx
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  
  return (
    <footer className="footer">
      {isOpen ? (
        <Order />  // 新しいコンポーネントを使用
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

**解決方法：propsを使用**

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

これは、JSXの一部をコンポーネント内のJSXが少し大きくなりすぎたときに、独自のコンポーネントに抽出する方法です。

そして、そのJSXが親コンポーネントにあった何らかの値（この場合はcloseHour）に依存している場合、単純にそれをpropとして渡します。

これは、Reactアプリケーションを構築するときに常に行うことです。最初からすべてのコンポーネントを把握しているわけではありませんが、代わりにそれらを構築し始め、大きくなりすぎたときに、それらの一部を別のコンポーネントに抽出することを決定できます。

---

## 🎯 Propsの分割代入（Destructuring Props）

### 分割代入とは

propsが何であるかを知ったので、propsを実際に使用する際に生活を少し楽にしましょう。

すでに知っているように、コンポーネントにpropsを渡すたびに、そのコンポーネントは自動的にこのpropsオブジェクトを受け取ります。これには、渡したすべてのpropsが含まれます。

実際、すべてのコンポーネントはこのpropsオブジェクトを受け取ります。propsを渡さないフッターでも、それを定義してコンソールにログできます。

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

### 複数propsの分割代入

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

これは本当に、本当に素晴らしいです。なぜなら、今、私たちがしなければならないのは、このコンポーネントが実際に受け取るpropsを知るために、この行を見るだけだからです。

以前は、一般的なpropsしかありませんでした。そして、最終的にここでどのようなpropsを受け取るかを知りたい場合は、propsが実際に渡される場所に行く必要がありました。

しかし、今はもうそうではありません。今、このコンポーネント定義で、pizzaObjectを受け取ることがすぐにわかります。

そして、それがpropsを即座に分割代入することの2番目の本当に大きな利点です。

---

## 📦 React Fragments：不要なDOM要素を避ける

### React Fragmentsとは

React Fragmentとは何か、そしていつ正確にそれが必要になるかを学びましょう。

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

しかし、すぐにReactが私たちに怒り始めます。「JSX式には1つの親要素が必要です」と。

これは、JSXのルール講義で学んだことと全く同じです。JSXの一部は、どこで定義されても、実際には1つのルート要素しか持てません。

### 解決方法：React Fragments

#### 1. **React.Fragment構文**

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

React Fragmentは基本的に、HTMLツリー、つまりDOMに痕跡を残すことなく、いくつかの要素をグループ化できます。

時々、React Fragmentにkeyを追加する必要があります。たとえば、リストをレンダリングするために使用している場合などです。その場合、少し異なる方法で書く必要があります。

```jsx
// keyが必要な場合
{items.map((item) => (
  <React.Fragment key={item.id}>
    <div>{item.name}</div>
    <div>{item.description}</div>
  </React.Fragment>
))}
```

しかし、keyは必要ないので、短いバージョンを使用できます。これはもちろんずっと良いです。

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

しかし、今はそれが欲しいわけではありません。今、私たちはすでにこのspan要素が欲しいことを知っていますが、まだ内容は欲しくありません。

そして、それを条件付きで設定しましょう。それは非常に簡単です。再び、三項演算子を使用します。

### 条件付きクラス名の設定

最後に、クラス名について、ピザが売り切れの場合はいつでも、LIにsold outクラスを追加できます。これにより、グレーアウトされます。

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

テンプレートリテラルがあり、ここで単純にJavaScript式を書きます。そして、三項演算子で、これが存在するかどうかをチェックし、もしそうなら。

つまり、これがtrueの場合、この演算子の結果はsold outになります。そして、この全体がsold outになります。そして、文字列は以前と全く同じになります。

しかし、これがfalseの場合、ここで何も返しません。そして、文字列は単にpizzaになります。これは、これらすべてのケースでここにあるものです。

素晴らしい。これが、要素にCSSクラスを条件付きで設定する方法です。

Vanilla JavaScriptで使用しなければならないclassListプロパティを使用することなく、すべて。

そして、ここでは、Vanilla JavaScriptでは、textContentプロパティやinnerHTMLなどでDOM操作を行う必要があることを覚えておいてください。

しかし、ここでJSXとReactの宣言的な性質により、すべてが少し簡単で、作業しやすくなります。

### 最終的な仕上げ

最後の詳細として、publicフォルダに来ましょう。そして、index.htmlで、ドキュメントのタイトルを設定したいと思います。

ここにFast React Pizza Co.がありますが、ここではデフォルトのReact Appと表示されており、少し醜いです。Fast React Pizza Co.と言いましょう。

それで終わりです。これで、実際にアプリケーションと最初のプロジェクトを完成させました。

この長いセクションの最後まで到達したことをおめでとうございます。

---

## 🎓 まとめ：Session4で習得した技術

### 学習した技術の総括

このセッションでは、Reactアプリケーション開発に必須の動的レンダリング技術を習得しました：

#### 📋 **リストレンダリング**
- `map()`メソッドを使った配列からのコンポーネント生成
- `key`属性の重要性とパフォーマンス最適化
- セマンティックなHTML構造の維持

#### ⚡ **条件付きレンダリング**
- `&&`演算子：シンプルな表示/非表示制御
- 三項演算子：2つの選択肢からの選択
- 複数return：大きく異なる表示パターン

#### 🧩 **コンポーネント設計**
- JSXの適切な抽出とコンポーネント分割
- 責任の分離と再利用性の向上
- 保守しやすいコード構造の実現

#### 🎯 **効率的なProps管理**
- 分割代入による可読性向上
- 複数propsの効率的な処理

#### 📦 **React Fragments**
- 不要なDOM要素の削除
- セマンティックHTMLの維持
- CSSレイアウトへの影響回避

#### 🎨 **動的スタイリング**
- 条件付きクラス名の設定
- 条件付きテキスト内容の設定
- テンプレートリテラルの活用

これらの技術は、実際のWebアプリケーション開発で頻繁に使用される基本的で重要なスキルです。継続的な実践を通じて、これらの概念を自分のものにしていきましょう。