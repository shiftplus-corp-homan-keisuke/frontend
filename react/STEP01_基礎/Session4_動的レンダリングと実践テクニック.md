
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

**最終プロジェクト参照**: [`react/STEP01_基礎/session2_project/final`](react/STEP01_基礎/session2_project/final)

---

## 📋 リストレンダリング：配列からコンポーネントを生成

### リストレンダリングとは何か

リストレンダリングは、基本的にすべてのReactアプリケーションで行う最も一般的なことの一つです。おそらくこのコース全体を通じて100回ほど行うことになるでしょう。そこで、Reactでリストをレンダリングする方法を学びましょう。

しかし、まず最初に、リストレンダリングとは実際に何を意味するのでしょうか？

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

新しいdivを作成しましょう。後でこれを実際のリスト要素に変換しますが、まずは任意の要素から始めましょう。どれでも構いません。

```jsx
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

### map()メソッドの威力

**従来の手動アプローチ**：
```jsx
// ❌ 手動でコンポーネントを複製（非効率）
function Menu() {
  return (
    <ul className="pizzas">
      <Pizza name="フォカッチャ" price={900} />
      <Pizza name="マルゲリータピザ" price={1500} />
      <Pizza name="スピナーチピザ" price={1800} />
      {/* データが増えるたびに手動で追加... */}
    </ul>
  );
}
```

**map()を使った動的アプローチ**：
```jsx
// ✅ データ駆動で自動生成（効率的）
function Menu() {
  return (
    <ul className="pizzas">
      {pizzaData.map((pizza) => (
        <Pizza pizzaObject={pizza} key={pizza.name} />
      ))}
    </ul>
  );
}
```

### key属性の重要性

リストレンダリングでは、各要素に**一意のkey属性**を指定する必要があります：

```jsx
{pizzaData.map((pizza) => (
  <Pizza 
    pizzaObject={pizza} 
    key={pizza.name}  // 一意の識別子が必要
  />
))}
```

**key属性の役割**：
- Reactが各要素を効率的に識別・更新するため
- パフォーマンス最適化に必要
- 警告を避けるため

**key属性の選び方**：
```jsx
// ✅ 良い例：一意の値を使用
key={pizza.name}        // 名前が一意の場合
key={pizza.id}          // IDが存在する場合

// ❌ 避けるべき：配列のインデックス
key={index}             // データの順序が変わる可能性がある場合
```

### リストレンダリングの利点

| 利点 | 説明 | 例 |
|------|------|-----|
| **動的性** | データが変更されると自動でUIが更新 | ピザが追加されると自動で表示 |
| **保守性** | コンポーネントの重複を避けられる | 1つのPizzaコンポーネントで全て対応 |
| **スケーラビリティ** | データ量に関係なく同じコードで対応 | 6個でも100個でも同じ実装 |
| **一貫性** | 全ての要素が同じ構造で表示される | デザインの統一性が保たれる |

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
              <Pizza pizzaObject={pizza} key={pizza.name} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
```

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

#### 条件判定のベストプラクティス

| 条件 | ❌ 避けるべき | ✅ 推奨 |
|------|-------------|--------|
| 数値チェック | `{count && <div/>}` | `{count > 0 && <div/>}` |
| 配列チェック | `{array && <div/>}` | `{array.length > 0 && <div/>}` |
| 文字列チェック | `{text && <div/>}` | `{text.length > 0 && <div/>}` |
| boolean | `{isOpen && <div/>}` | `{isOpen && <div/>}` ✅ |

### 複雑な条件の例

```jsx
function RestaurantStatus() {
  const hour = new Date().getHours();
  const isWeekend = [0, 6].includes(new Date().getDay());
  const isHoliday = checkHoliday(); // 仮想的な関数
  
  const isOpen = hour >= 12 && hour <= 22 && !isHoliday;
  const isSpecialHours = isWeekend && isOpen;
  
  return (
    <div className="status">
      {isOpen && (
        <p className="open-message">営業中です！</p>
      )}
      
      {isSpecialHours && (
        <p className="special-message">週末特別メニューをご用意しています</p>
      )}
      
      {!isOpen && !isHoliday && (
        <p className="closed-message">
          12:00から22:00の間にお越しください
        </p>
      )}
      
      {isHoliday && (
        <p className="holiday-message">本日は祝日のため休業いたします</p>
      )}
    </div>
  );
}
```

---

## 🔀 条件付きレンダリング：三項演算子の活用

### 三項演算子による条件付きレンダリング

三項演算子を使って同じことをどのように行うかを見てみましょう。

ここの&&演算子の代わりに、三項演算子を使って条件付きレンダリングを行いましょう。

この三項演算子に慣れていない場合は、Reactに必要なJavaScriptの復習の前のセクションをチェックしてください。

### 三項演算子の構造

三項演算子には3つの部分があります。最初の部分は条件で、この条件がtrueの場合、演算の結果はこの演算子の2番目の部分になります。

しかし、三項演算子には3番目の部分も必要で、これは基本的にelse分岐のようなものです。

```jsx
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

### 実践例：営業状態の表示

```jsx
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  
  return (
    <footer className="footer">
      {isOpen ? (
        // 営業中の場合
        <div className="order">
          <p>
            {openHour}:00から{closeHour}:00まで営業中です。
            ご来店またはオンラインでご注文ください。
          </p>
          <button className="btn">注文する</button>
        </div>
      ) : (
        // 営業時間外の場合
        <p>
          {openHour}:00から{closeHour}:00の間にお越しください。
        </p>
      )}
    </footer>
  );
}
```

### 三項演算子の利点

#### 1. **代替表示の提供**

```jsx
function ProductStatus({ product }) {
  return (
    <div className="product-status">
      {product.inStock ? (
        <span className="available">在庫あり</span>
      ) : (
        <span className="unavailable">在庫切れ</span>
      )}
    </div>
  );
}
```

#### 2. **ユーザーエクスペリエンスの向上**

```jsx
function LoadingState({ isLoading, data }) {
  return (
    <div>
      {isLoading ? (
        <div className="loading">
          <p>読み込み中...</p>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="content">
          {data.map(item => <Item key={item.id} data={item} />)}
        </div>
      )}
    </div>
  );
}
```

### なぜif-else文は使えないのか

JSXの波括弧内では**式（expression）**のみ使用可能で、**文（statement）**は使用できません：

```jsx
function Menu() {
  const numPizzas = pizzaData.length;
  
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      
      {/* ❌ エラー：if文は式ではない */}
      {if (numPizzas > 0) {
        return <p>ピザがあります</p>;
      } else {
        return <p>ピザがありません</p>;
      }}
      
      {/* ✅ 正しい：三項演算子は式 */}
      {numPizzas > 0 ? (
        <p>ピザがあります</p>
      ) : (
        <p>ピザがありません</p>
      )}
    </main>
  );
}
```

### 条件付きレンダリングの比較表

| 手法 | 使用場面 | 利点 | 注意点 |
|------|----------|------|--------|
| **&&演算子** | 表示/非表示の切り替え | シンプル、読みやすい | falsy値の表示に注意 |
| **三項演算子** | 2つの選択肢から選択 | 必ず何かを表示、UX向上 | ネストが深くなりがち |
| **複数return** | 大きく異なる表示 | 明確な分岐、保守しやすい | コンポーネント全体に影響 |

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
function Pizza({ pizzaObject }) {
  // 早期return：売り切れの場合は何も表示しない
  if (pizzaObject.soldOut) {
    return null;
  }
  
  // 通常のreturn：通常のピザ表示
  return (
    <li className="pizza">
      <img src={pizzaObject.photoName} alt={pizzaObject.name} />
      <div>
        <h3>{pizzaObject.name}</h3>
        <p>{pizzaObject.ingredients}</p>
        <span>¥{pizzaObject.price}</span>
      </div>
    </li>
  );
}
```

### 複数returnの利点

#### 1. **コードの可読性向上**

**三項演算子を使った場合（複雑）**：
```jsx
function UserProfile({ user, isLoading, error }) {
  return (
    <div>
      {error ? (
        <div className="error">
          <h2>エラーが発生しました</h2>
          <p>{error.message}</p>
          <button onClick={retry}>再試行</button>
        </div>
      ) : isLoading ? (
        <div className="loading">
          <h2>読み込み中...</h2>
          <div className="spinner"></div>
        </div>
      ) : user ? (
        <div className="profile">
          <img src={user.avatar} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <div className="stats">
            <span>投稿: {user.posts}</span>
            <span>フォロワー: {user.followers}</span>
          </div>
        </div>
      ) : (
        <div className="no-user">
          <h2>ユーザーが見つかりません</h2>
          <button onClick={goHome}>ホームに戻る</button>
        </div>
      )}
    </div>
  );
}
```

**複数returnを使った場合（明確）**：
```jsx
function UserProfile({ user, isLoading, error }) {
  // エラー状態
  if (error) {
    return (
      <div className="error">
        <h2>エラーが発生しました</h2>
        <p>{error.message}</p>
        <button onClick={retry}>再試行</button>
      </div>
    );
  }
  
  // ローディング状態
  if (isLoading) {
    return (
      <div className="loading">
        <h2>読み込み中...</h2>
        <div className="spinner"></div>
      </div>
    );
  }
  
  // ユーザーが存在しない場合
  if (!user) {
    return (
      <div className="no-user">
        <h2>ユーザーが見つかりません</h2>
        <button onClick={goHome}>ホームに戻る</button>
      </div>
    );
  }
  
  // 通常のユーザー表示
  return (
    <div className="profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <div className="stats">
        <span>投稿: {user.posts}</span>
        <span>フォロワー: {user.followers}</span>
      </div>
    </div>
  );
}
```

#### 2. **ガード節パターン**

```jsx
function OrderForm({ user, cart, isSubmitting }) {
  // ログインしていない場合
  if (!user) {
    return (
      <div className="login-required">
        <h2>ログインが必要です</h2>
        <button onClick={openLogin}>ログイン</button>
      </div>
    );
  }
  
  // カートが空の場合
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>カートが空です</h2>
        <button onClick={goToMenu}>メニューを見る</button>
      </div>
    );
  }
  
  // 送信中の場合
  if (isSubmitting) {
    return (
      <div className="submitting">
        <h2>注文を送信中...</h2>
        <div className="progress-bar"></div>
      </div>
    );
  }
  
  // 通常の注文フォーム
  return (
    <form className="order-form">
      <h2>注文内容の確認</h2>
      {/* フォームの内容 */}
    </form>
  );
}
```

### 使い分けのガイドライン

| 手法 | 適用場面 | 例 |
|------|----------|-----|
| **複数return** | 表示内容が大きく異なる | エラー画面、ローディング画面、空状態 |
| **三項演算子** | 小さな違いを切り替え | テキストの変更、ボタンの有効/無効 |
| **&&演算子** | 要素の表示/非表示 | 通知バナー、オプション機能 |

### 注意点：共通レイアウトの考慮

複数returnを使用する際は、共通のレイアウト要素（ヘッダー、フッターなど）が失われないよう注意が必要です：

```jsx
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ❌ 問題：ヘッダーとフッターが表示されない
  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }
  
  if (error) {
    return <div className="error">エラー: {error.message}</div>;
  }
  
  return (
    <div className="app">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
```

```jsx
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ 改善：共通レイアウトを保持
  return (
    <div className="app">
      <Header />
      
      {isLoading ? (
        <div className="loading">読み込み中...</div>
      ) : error ? (
        <div className="error">エラー: {error.message}</div>
      ) : (
        <Main />
      )}
      
      <Footer />
    </div>
  );
}
```

---

## 🧩 JSXの新しいコンポーネントへの抽出

### コンポーネント抽出とは

アプリケーションが成長するにつれて、コンポーネント内のJSXが複雑になることがあります。このような場合、**JSXの一部を新しいコンポーネントとして抽出**することで、コードの可読性と保守性を向上させることができます。

### 抽出が必要な場面

#### Before：複雑になったFooterコンポーネント

```jsx
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

### Step 1: 抽出するJSXの特定

注文部分のJSXが複雑になっているので、これを新しいコンポーネントとして抽出します：

```jsx
// 抽出対象のJSX
<div className="order">
  <p>
    {openHour}:00から{closeHour}:00まで営業中です。
    ご来店またはオンラインでご注文ください。
  </p>
  <button className="btn">注文する</button>
</div>
```

### Step 2: 新しいコンポーネントの作成

```jsx
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
```

### Step 3: 元のコンポーネントの更新

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

### 実践例：メニューコンポーネントの抽出

#### Before：複雑なMenuコンポーネント

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
              <Pizza pizzaObject={pizza} key={pizza.name} />
            ))}
          


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
function Pizza({ pizzaObject }) {
  // 早期return：売り切れの場合は何も表示しない
  if (pizzaObject.soldOut) {
    return null;
  }
  
  // 通常のreturn：通常のピザ表示
  return (
    <li className="pizza">
      <img src={pizzaObject.photoName} alt={pizzaObject.name} />
      <div>
        <h3>{pizzaObject.name}</h3>
        <p>{pizzaObject.ingredients}</p>
        <span>¥{pizzaObject.price}</span>
      </div>
    </li>
  );
}
```

### 複数returnの利点

#### 1. **コードの可読性向上**

**三項演算子を使った場合（複雑）**：
```jsx
function UserProfile({ user, isLoading, error }) {
  return (
    <div>
      {error ? (
        <div className="error">
          <h2>エラーが発生しました</h2>
          <p>{error.message}</p>
          <button onClick={retry}>再試行</button>
        </div>
      ) : isLoading ? (
        <div className="loading">
          <h2>読み込み中...</h2>
          <div className="spinner"></div>
        </div>
      ) : user ? (
        <div className="profile">
          <img src={user.avatar} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <div className="stats">
            <span>投稿: {user.posts}</span>
            <span>フォロワー: {user.followers}</span>
          </div>
        </div>
      ) : (
        <div className="no-user">
          <h2>ユーザーが見つかりません</h2>
          <button onClick={goHome}>ホームに戻る</button>
        </div>
      )}
    </div>
  );
}
```

**複数returnを使った場合（明確）**：
```jsx
function UserProfile({ user, isLoading, error }) {
  // エラー状態
  if (error) {
    return (
      <div className="error">
        <h2>エラーが発生しました</h2>
        <p>{error.message}</p>
        <button onClick={retry}>再試行</button>
      </div>
    );
  }
  
  // ローディング状態
  if (isLoading) {
    return (
      <div className="loading">
        <h2>読み込み中...</h2>
        <div className="spinner"></div>
      </div>
    );
  }
  
  // ユーザーが存在しない場合
  if (!user) {
    return (
      <div className="no-user">
        <h2>ユーザーが見つかりません</h2>
        <button onClick={goHome}>ホームに戻る</button>
      </div>
    );
  }
  
  // 通常のユーザー表示
  return (
    <div className="profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <div className="stats">
        <span>投稿: {user.posts}</span>
        <span>フォロワー: {user.followers}</span>
      </div>
    </div>
  );
}
```

#### 2. **ガード節パターン**

```jsx
function OrderForm({ user, cart, isSubmitting }) {
  // ログインしていない場合
  if (!user) {
    return (
      <div className="login-required">
        <h2>ログインが必要です</h2>
        <button onClick={openLogin}>ログイン</button>
      </div>
    );
  }
  
  // カートが空の場合
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>カートが空です</h2>
        <button onClick={goToMenu}>メニューを見る</button>
      </div>
    );
  }
  
  // 送信中の場合
  if (isSubmitting) {
    return (
      <div className="submitting">
        <h2>注文を送信中...</h2>
        <div className="progress-bar"></div>
      </div>
    );
  }
  
  // 通常の注文フォーム
  return (
    <form className="order-form">
      <h2>注文内容の確認</h2>
      {/* フォームの内容 */}
    </form>
  );
}
```

### 使い分けのガイドライン

| 手法 | 適用場面 | 例 |
|------|----------|-----|
| **複数return** | 表示内容が大きく異なる | エラー画面、ローディング画面、空状態 |
| **三項演算子** | 小さな違いを切り替え | テキストの変更、ボタンの有効/無効 |
| **&&演算子** | 要素の表示/非表示 | 通知バナー、オプション機能 |

### 注意点：共通レイアウトの考慮

複数returnを使用する際は、共通のレイアウト要素（ヘッダー、フッターなど）が失われないよう注意が必要です：

```jsx
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ❌ 問題：ヘッダーとフッターが表示されない
  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }
  
  if (error) {
    return <div className="error">エラー: {error.message}</div>;
  }
  
  return (
    <div className="app">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
```

```jsx
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ 改善：共通レイアウトを保持
  return (
    <div className="app">
      <Header />
      
      {isLoading ? (
        <div className="loading">読み込み中...</div>
      ) : error ? (
        <div className="error">エラー: {error.message}</div>
      ) : (
        <Main />
      )}
      
      <Footer />
    </div>
  );
}
```

---

## 🧩 JSXの新しいコンポーネントへの抽出

### コンポーネント抽出とは

アプリケーションが成長するにつれて、コンポーネント内のJSXが複雑になることがあります。このような場合、**JSXの一部を新しいコンポーネントとして抽出**することで、コードの可読性と保守性を向上させることができます。

### 抽出が必要な場面

#### Before：複雑になったFooterコンポーネント

```jsx
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

### Step 1: 抽出するJSXの特定

注文部分のJSXが複雑になっているので、これを新しいコンポーネントとして抽出します：

```jsx
// 抽出対象のJSX
<div className="order">
  <p>
    {openHour}:00から{closeHour}:00まで営業中です。
    ご来店またはオンラインでご注文ください。
  </p>
  <button className="btn">注文する</button>
</div>
```

### Step 2: 新しいコンポーネントの作成

```jsx
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
```

### Step 3: 元のコンポーネントの更新

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

### 実践例：メニューコンポーネントの抽出

#### Before：複雑なMenuコンポーネント

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
              <Pizza pizzaObject={pizza} key={pizza.name} />
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

#### After：PizzaListコンポーネントの抽出

```jsx
// 新しいPizzaListコンポーネント
function PizzaList({ pizzas }) {
  return (
    <>
      <p>
        本格的なイタリア料理。創造的な6つの料理からお選びください。
        すべて石窯で、すべてオーガニック、すべて美味しい。
      </p>
      
      <ul className="pizzas">
        {pizzas.map((pizza) => (
          <Pizza pizzaObject={pizza} key={pizza.name} />
        ))}
      </ul>
    </>
  );
}

// 簡潔になったMenuコンポーネント
function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;
  
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      
      {numPizzas > 0 ? (
        <PizzaList pizzas={pizzas} />
      ) : (
        <p>メニューを準備中です。後ほどお越しください :)</p>
      )}
    </main>
  );
}
```

### コンポーネント抽出のメリット

#### 1. **可読性の向上**

```jsx
// Before：長くて複雑
function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>ダッシュボード</h1>
        <div className="user-info">
          <img src={user.avatar} alt={user.name} />
          <span>{user.name}</span>
          <button onClick={logout}>ログアウト</button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="stats">
          <div className="stat-card">
            <h3>今日の売上</h3>
            <p>¥{todaySales.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>注文数</h3>
            <p>{orderCount}件</p>
          </div>
          <div className="stat-card">
            <h3>新規顧客</h3>
            <p>{newCustomers}人</p>
          </div>
        </div>
        
        <div className="recent-orders">
          <h2>最近の注文</h2>
          <ul>
            {recentOrders.map(order => (
              <li key={order.id}>
                <span>{order.customerName}</span>
                <span>¥{order.total}</span>
                <span>{order.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
```

```jsx
// After：抽出して整理
function Dashboard() {
  return (
    <div className="dashboard">
      <DashboardHeader user={user} onLogout={logout} />
      <DashboardMain 
        stats={{ todaySales, orderCount, newCustomers }}
        recentOrders={recentOrders}
      />
    </div>
  );
}

function DashboardHeader({ user, onLogout }) {
  return (
    <header className="dashboard-header">
      <h1>ダッシュボード</h1>
      <UserInfo user={user} onLogout={onLogout} />
    </header>
  );
}

function DashboardMain({ stats, recentOrders }) {
  return (
    <main className="dashboard-main">
      <StatsCards stats={stats} />
      <RecentOrders orders={recentOrders} />
    </main>
  );
}
```

#### 2. **再利用性の向上**

```jsx
// 抽出したコンポーネントは他の場所でも使用可能
function AdminPanel() {
  return (
    <div>
      <h1>管理パネル</h1>
      <StatsCards stats={adminStats} />  {/* 再利用 */}
    </div>
  );
}

function MobileApp() {
  return (
    <div>
      <UserInfo user={currentUser} onLogout={handleLogout} />  {/* 再利用 */}
    </div>
  );
}
```

#### 3. **テストの容易さ**

```jsx
// 小さなコンポーネントは個別にテストしやすい
describe('StatsCards', () => {
  it('売上を正しく表示する', () => {
    const stats = { todaySales: 50000, orderCount: 25, newCustomers: 5 };
    render(<StatsCards stats={stats} />);
    
    expect(screen.getByText('¥50,000')).toBeInTheDocument();
    expect(screen.getByText('25件')).toBeInTheDocument();
    expect(screen.getByText('5人')).toBeInTheDocument();
  });
});
```

### 抽出のタイミング

| 抽出すべき場面 | 例 |
|---------------|-----|
| **JSXが長くなった** | 50行を超えるJSX |
| **論理的なまとまり** | ユーザー情報、統計カード、フォーム |
| **再利用の可能性** | ボタン、モーダル、リストアイテム |
| **責任の分離** | データ取得とUI表示の分離 |

---

## 🎯 Propsの分割代入（Destructuring）

### 分割代入とは

これまでPropsを`props.propertyName`の形で受け取っていましたが、**分割代入（Destructuring）**を使用することで、より効率的で読みやすいコードを書くことができます。

### 従来の方法 vs 分割代入

#### Before：propsオブジェクトを使用

```jsx
function Pizza(props) {
  console.log(props); // デバッグ用
  
  return (
    <li className="pizza">
      <img src={props.pizzaObject.photoName} alt={props.pizzaObject.name} />
      <div>
        <h3>{props.pizzaObject.name}</h3>
        <p>{props.pizzaObject.ingredients}</p>
        <span>¥{props.pizzaObject.price}</span>
      </div>
    </li>
  );
}
```

#### After：分割代入を使用

```jsx
function Pizza({ pizzaObject }) {
  console.log(pizzaObject); // デバッグ用
  
  return (
    <li className="pizza">
      <img src={pizzaObject.photoName} alt={pizzaObject.name} />
      <div>
        <h3>{pizzaObject.name}</h3>
        <p>{pizzaObject.ingredients}</p>
        <span>¥{pizzaObject.price}</span>
      </div>
    </li>
  );
}
```

### 分割代入の利点

#### 1. **コードの簡潔性**

```jsx
// Before：冗長
function Order(props) {
  return (
    <div className="order">
      <p>
        {props.openHour}:00から{props.closeHour}:00まで営業中です。
      </p>
      <button className="btn">注文する</button>
    </div>
  );
}

// After：簡潔
function Order({ openHour, closeHour }) {
  return (
    <div className="order">
      <p>
        {openHour}:00から{closeHour}:00まで営業中です。
      </p>
      <button className="btn">注文する</button>
    </div>
  );
}
```

#### 2. **Props の可視性**

```jsx
// コンポーネントの定義を見るだけで、どのPropsを受け取るかが分かる
function UserCard({ name, email, avatar, isOnline, lastSeen }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <div className="user-info">
        <h3>{name}</h3>
        <p>{email}</p>
        <span className={isOnline ? 'online' : 'offline'}>
          {isOnline ? 'オンライン' : `最終ログイン: ${lastSeen}`}
        </span>
      </div>
    </div>
  );
}
```

#### 3. **デフォルト値の設定**

```jsx
function Button({ 
  children, 
  onClick, 
  type = "button",      // デフォルト値
  disabled = false,     // デフォルト値
  variant = "primary"   // デフォルト値
}) {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${disabled ? 'btn-disabled' : ''}`}
    >
      {children}
    </button>
  );
}

// 使用例
<Button onClick={handleSubmit}>送信</Button>  // デフォルト値が使用される
<Button onClick={handleCancel} variant="secondary">キャンセル</Button>
```

### 複雑な分割代入の例

#### ネストしたオブジェクトの分割代入

```jsx
function UserProfile({ user: { name, email, profile: { bio, location } } }) {
  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>{email}</p>
      <div className="profile-details">
        <p>{bio}</p>
        <span>{location}</span>
      </div>
    </div>
  );
}

// 使用例
const userData = {
  name: "田中太郎",
  email: "tanaka@example.com",
  profile: {
    bio: "フロントエンド開発者です",
    location: "東京"
  }
};

<UserProfile user={userData} />
```

#### 配列の分割代入

```jsx
function Coordinates({ position: [x, y, z] }) {
  return (
    <div className="coordinates">
      <span>X: {x}</span>
      <span>Y: {y}</span>
      <span>Z: {z}</span>
    </div>
  );
}

// 使用例
<Coordinates position={[10, 20, 30]} />
```

#### Rest演算子との組み合わせ

```jsx
function Card({ title, children, ...otherProps }) {
  return (
    <div className="card" {...otherProps}>
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// 使用例：otherPropsにid, className, onClickなどが含まれる
<Card 
  title="商品情報" 
  id="product-card"
  className="featured"
  onClick={handleClick}
>
  <p>商品の詳細情報...</p>
</Card>
```

### 注意点とベストプラクティス

#### 1. **波括弧を忘れない**

```jsx
// ❌ エラー：波括弧がない
function Pizza(pizzaObject) {
  return <div>{pizzaObject.name}</div>;
}

// ✅ 正しい：波括弧で分割代入
function Pizza({ pizzaObject }) {
  return <div>{pizzaObject.name}</div>;
}
```

#### 2. **適切な分割レベル**

```jsx
// ❌ 過度な分割：読みにくい
function Pizza({ 
  pizzaObject: { 
    name, 
    ingredients, 
    price, 
    photoName, 
    soldOut 
  } 
}) {
  // ...
}

// ✅ 適切な分割：バランスが良い
function Pizza({ pizzaObject }) {
  const { name, ingredients, price, photoName, soldOut } = pizzaObject;
  // ...
}
```

#### 3. **TypeScriptでの型定義**

```typescript
interface PizzaProps {
  pizzaObject: {
    name: string;
    ingredients: string;
    price: number;
    photoName: string;
    soldOut: boolean;
  };
}

function Pizza({ pizzaObject }: PizzaProps) {
  return (
    <li className="pizza">
      {/* ... */}
    </li>
  );
}
```

---

## 📦 React Fragments：不要なDOM要素の回避

### React Fragmentsとは

JSXでは、コンポーネントは**単一のルート要素**を返す必要があります。しかし、時には複数の要素をグループ化したいが、余分なDOM要素（`<div>`など）は追加したくない場合があります。このような場面で**React Fragments**が役立ちます。

### 問題：不要なラッパー要素

#### 問題のあるコード

```jsx
function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;
  
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      
      {numPizzas > 0 ? (
        // ❌ 問題：JSXは単一ルート要素が必要
        <p>本格的なイタリア料理をお楽しみください。</p>
        <ul className="pizzas">
          {pizzas.map((pizza) => (
            <Pizza pizzaObject={pizza} key={pizza.name} />
          ))}
        </ul>
      ) : (
        <p>メニューを準備中です。</p>
      )}
    </main>
  );
}
```

上記のコードは、`<p>`と`<ul>`の2つの要素を返そうとしているため、エラーになります。

#### 従来の解決方法：divでラップ

```jsx
function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;
  
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      
      {numPizzas > 0 ? (
        <div>  {/* 不要なdiv要素 */}
          <p>本格的なイタリア料理をお楽しみください。</p>
          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza pizzaObject={pizza} key={pizza.name} />
            ))}
          </ul>
        </div>
      ) : (
        <p>メニューを準備中です。</p>
      )}
    </main>
  );
}
```

この方法では、不要な`<div>`要素がDOMに追加され、CSSレイアウトに影響を与える可能性があります。

### React Fragmentsの解決方法

#### 短縮記法：空のタグ

```jsx
function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;
  
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      
      {numPizzas > 0 ? (
        <>  {/* React Fragment（短縮記法） */}
          <p>本格的なイタリア料理をお楽しみください。</p>
          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza pizzaObject={pizza} key={pizza.name} />
            ))}
          </ul>
        </>
      ) : (
        <p>メニューを準備中です。</p>
      )}
    </main>
  );
}
```

#### 完全記法：React.Fragment

```jsx
import React from 'react';

function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;
  
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      
      {numPizzas > 0 ? (
        <React.Fragment>  {/* React Fragment（完全記法） */}
          <p>本格的なイタリア料理をお楽しみください。</p>
          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza pizzaObject={pizza} key={pizza.name} />
            ))}
          </ul>
        </React.Fragment>
      ) : (
        <p>メニューを準備中です。</p>
      )}
    </main>
  );
}
```

### React Fragmentsの利点

#### 1. **クリーンなDOM構造**

```jsx
// Fragment使用前のDOM
<main class="menu">
  <h2>Our Menu</h2>
  <div>  <!-- 不要な要素 -->
    <p>本格的なイタリア料理をお楽しみください。</p>
    <ul class="pizzas">...</ul>
  </div>
</main>

// Fragment使用後のDOM
<main class="menu">
  <h2>Our Menu</h2>
  <p>本格的なイタリア料理をお楽しみください。</p>  <!-- 直接配置 -->
  <ul class="pizzas">...</ul>
</main>
```

#### 2. **CSSレイアウトへの影響なし**

```css
/* Flexboxレイアウトの例 */
.menu {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 不要なdivがあると、レイアウトが崩れる可能性 */
.menu > div {
  /* 予期しないスタイルが適用される */
}
```

#### 3. **セマンティックなHTML**

```jsx
function TableRow({ cells }) {
  return (
    <>
      {cells.map((cell, index) => (
        <td key={index}>{cell}</td>
      ))}
    </>
  );
}

function DataTable({ rows }) {
  return (
    <table>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <TableRow cells={row} />  {/* 不要なdivなしでtdを返す */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### key属性が必要な場合

リストレンダリングでFragmentを使用する場合は、完全記法を使用してkey属性を指定します：

```jsx
function DefinitionList({ terms }) {
  return (
    <dl>
      {terms.map((term) => (
        <React.Fragment key={term.id}>
          <dt>{term.title}</dt>
          <dd>{term.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

### 実践例：複雑なレイアウト

```jsx
function ProductCard({ product }) {
  const isOnSale = product.discount > 0;
  const isFeatured = product.featured;
  
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      
      {/* 条件付きで複数の要素を表示 */}
      {isOnSale && (
        <>
          <span className="sale-badge">SALE</span>
          <span className="discount">-{product.discount}%</span>
        </>
      )}
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        
        {isFeatured && (
          <>
            <span className="featured-badge">おすすめ</span>
            <p className="featured-description">
              {product.featuredReason}
            </p>
          </>
        )}
        
        <div className="price">
          {isOnSale ? (
            <>
              <span className="original-price">¥{product.originalPrice}</span>
              <span className="sale-price">¥{product.salePrice}</span>
            </>
          ) : (
            <span className="regular-price">¥{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 使い分けのガイドライン

| 記法 | 使用場面 | 例 |
|------|----------|-----|
| **`<>...</>`** | 一般的な用途、key不要 | 条件付きレンダリング |
| **`<React.Fragment>`** | key属性が必要 | リストレンダリング |
| **`<div>`** | スタイリングが必要 | レイアウト用コンテナ |

---

## 🎨 条件付きクラス名とテキストの設定

### 動的スタイリングの必要性

実際のWebアプリケーションでは、データの状態に応じてスタイルやテキストを動的に変更する必要があります。例えば：

- 売り切れ商品のグレーアウト表示
- アクティブなナビゲーションアイテムのハイライト
- エラー状態の赤色表示
- ローディング状態のアニメーション

### 条件付きテキストの設定

#### 基本的な三項演算子の使用

```jsx
function Pizza({ pizzaObject }) {
  return (
    <li className="pizza">
      <img src={pizzaObject.photoName} alt={pizzaObject.name} />
      <div>
        <h3>{pizzaObject.name}</h3>
        <p>{pizzaObject.ingredients}</p>
        
        {/* 条件に応じてテキストを変更 */}
        <span>
          {pizzaObject.soldOut ? "SOLD OUT" : `¥${pizzaObject.price}`}
        </span>
      </div>
    </li>
  );
}
```

#### より複雑な条件分岐

```jsx
function OrderStatus({ order }) {
  const getStatusText = () => {
    switch (order.status) {
      case 'pending':
        return '注文受付中';
      case 'preparing':
        return '調理中';
      case 'ready':
        return 'お受け取り準備完了';
      case 'delivered':
        return '配達完了';
      case 'cancelled':
        return 'キャンセル済み';
      default:
        return '状態不明';
    }
  };
  
  return (
    <div className="order-status">
      <h3>注文番号: {order.id}</h3>
      <p>状態: {getStatusText()}</p>
      
      {/* 配達時間の表示 */}
      <p>
        {order.status === 'delivered' 
          ? `配達完了時刻: ${order.deliveredAt}`
          : order.estimatedTime 
            ? `予定時刻: ${order.estimatedTime}`
            : '時刻未定'
        }
      </p>
    </div>
  );
}
```

### 条件付きクラス名の設定

#### テンプレートリテラルを使用した方法

```jsx
function Pizza({ pizzaObject }) {
  return (
    <li className={`pizza ${pizzaObject.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObject.photoName} alt={pizzaObject.name} />
      <div>
        <h3>{pizzaObject.name}</h3>
        <p>{pizzaObject.ingredients}</p>
        <span>
          {pizzaObject.soldOut ? "SOLD OUT" : `¥${pizzaObject.price}`}
        </span>
      </div>
    </li>
  );
}
```

#### 複数の条件を組み合わせる

```jsx
function Button({ 
  children, 
  variant = "primary", 
  size = "medium", 
  disabled = false, 
  loading = false,
  fullWidth = false 
}) {
  const buttonClass = `
    btn 
    btn-${variant} 
    btn-${size}
    ${disabled ? "btn-disabled" : ""}
    ${loading ? "btn-loading" : ""}
    ${fullWidth ? "btn-full-width" : ""}
  `.trim().replace(/\s+/g, ' '); // 余分な空白を除去
  
  return (
    <button 
      className={buttonClass}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          処理中...
        </>
      ) : (
        children
      )}
    </button>
  );
}
```

#### 関数を使った動的クラス生成

```jsx
function Card({ type, isActive, hasError, size }) {
  const getCardClasses = () => {
    const baseClasses = ['card'];
    
    // タイプに応じたクラス
    if (type) baseClasses.push(`card-${type}`);
    
    // サイズに応じたクラス
    if (size) baseClasses.push(`card-${size}`);
    
    // 状態に応じたクラス
    if (isActive) baseClasses.push('card-active');
    if (hasError) baseClasses.push('card-error');
    
    return baseClasses.join(' ');
  };
  
  return (
    <div className={getCardClasses()}>
      {/* カードの内容 */}
    </div>
  );
}
```

### 実践例：ナビゲーションメニュー

```jsx
function Navigation({ currentPage }) {
  const navItems = [
    { id: 'home', label: 'ホーム', path: '/' },
    { id: 'menu', label: 'メニュー', path: '/menu' },
    { id: 'about', label: '店舗情報', path: '/about' },
    { id: 'contact', label: 'お問い合わせ', path: '/contact' }
  ];
  
  return (
    <nav className="navigation">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <a 
              href={item.path}
              className={`nav-link ${
                currentPage === item.id ? 'nav-link-active' : ''
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <span className="active-indicator">●</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### 高度な動的スタイリング

#### CSS変数との組み合わせ

```jsx
function ProgressBar({ progress, color = "blue" }) {
  const progressStyle = {
    '--progress': `${progress}%`,
    '--color': color
  };
  
  return (
    <div className="progress-container">
      <div 
        className="progress-bar"
        style={progressStyle}
      >
        <span className="progress-text">
          {progress}%
        </span>
      </div>
    </div>
  );
}
```

```css
.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: var(--progress);
  background-color: var(--color);
  transition: width 0.3s ease;
}
```

#### データ属性を使った方法

```jsx
function StatusIndicator({ status, priority }) {
  return (
    <div 
      className="status-indicator"
      data-status={status}
      data-priority={priority}
    >
      <span className="status-text">
        {status === 'active' ? 'アクティブ' : 
         status === 'inactive' ? '非アクティブ' : 
         status === 'pending' ? '保留中' : '不明'}
      </span>
    </div>
  );
}
```

```css
.status-indicator[data-status="active"] {
  background-color: #4caf50;
  color: white;
}

.status-indicator[data-status="inactive"] {
  background-color: #f44336;
  color: white;
}

.status-indicator[data-status="pending"] {
  background-color: #ff9800;
  color: white;
}

.status-indicator[data-priority="high"] {
  border: 2px solid #d32f2f;
  box-shadow: 0 0 10px rgba(211, 47, 47, 0.3);
}
```

### 最終プロジェクトでの実装例

[`react/STEP01_基礎/session2_project/final`](react/STEP01_基礎/session2_project/final)の実装を参考に、実際のピザアプリケーションでの動的スタイリングを確認してみましょう：

```jsx
// 最終プロジェクトからの抜粋
function Pizza({ pizzaObj }) {
  return (
    <li className={`pizza ${pizzaObj.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>{pizzaObj.soldOut ? "SOLD OUT" : pizzaObj.price}</span>
      </div>
    </li>
  );
}
```

この実装では：
- **条件付きクラス名**：`sold-out`クラスで売り切れピザをグレーアウト
- **条件付きテキスト**：価格の代わりに"SOLD OUT"を表示

---

## 🎓 Session4のまとめ：動的UIの構築

### このセッションで習得したスキル

Session4では、Reactアプリケーションで動的なUIを構築するための重要なテクニックを学習しました：

#### 📋 **リストレンダリング**
- `map()`メソッドを使った配列からのコンポーネント生成
- `key`属性の重要性とパフォーマンス最適化
- データ駆動なUI構築の基礎

#### ⚡ **条件付きレンダリング**
- `&&`演算子：表示/非表示の切り替え
- 三項演算子：2つの選択肢からの選択
- 複数return：大きく異なる表示の分岐

#### 🧩 **コンポーネント設計**
- JSXの抽出による可読性向上
- Props分割代入による効率的なコード記述
- React FragmentsによるクリーンなDOM構造

#### 🎨 **動的スタイリング**
- 条件に応じたクラス名の設定
- テキストの動的変更
- CSS変数とデータ属性の活用

### 学習の統合：完成したピザアプリケーション

Session1-4を通じて、以下の機能を持つ完全なピザメニューアプリケーションを構築しました：

```jsx
// 完成したアプリケーションの構造
function App() {
  return (
    <div className="container">
      <Header />                    {/* Session2で学習 */}
      <Menu />                      {/* Session4で動的化 */}
      <Footer />                    {/* Session3-4で条件付きレンダリング */}
    </div>
  );
}

function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;
  
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      
      {numPizzas > 0 ? (
        <>
          <p>本格的なイタリア料理をお楽しみください。</p>
          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza pizzaObject={pizza} key={pizza.name} />
            ))}
          </ul>
        </>
      ) : (
        <p>メニューを準備中です。後ほどお越しください :)</p>
      )}
    </main>
  );
}

function Pizza({ pizzaObject }) {
  return (
    <li className={`pizza ${pizzaObject.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObject.photoName} alt={pizzaObject.name} />
      <div>
        <h3>{pizzaObject.name}</h3>
        <p>{pizzaObject.ingredients}</p>
        <span>
          {pizzaObject.soldOut ? "SOLD OUT" : `¥${pizzaObject.price}`}
        </span>
      </div>
    </li>
  );
}
```

### 実践的なReact開発パターン

このセッションで学んだパターンは、実際のWebアプリケーション開発で頻繁に使用されます：

#### 1. **データ駆動UI**
```jsx
// データが変更されると自動的にUIが更新
const products = fetchProducts(); // API呼び出し
return (
  <ul>
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </ul>
);
```

#### 2. **状態に応じた表示制御**
```jsx
// ユーザーの状態に応じて異なるUIを表示
function UserDashboard({ user, isLoading, error }) {
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <LoginPrompt />;
  
  return <Dashboard user={user} />;
}
```

#### 3. **コンポーネントの再利用**
```jsx
// 同じコンポーネントを異なるデータで再利用
<Button variant="primary" onClick={handleSave}>保存</Button>
<Button variant="secondary" onClick={handleCancel}>キャンセル</Button>
<Button variant="danger" onClick={handleDelete}>削除</Button>
```

### 次のステップ：より高度なReact開発

Session4で学んだ基礎を踏まえ、次のような高度なトピックに進むことができます：

#### 🔄 **State管理**
- `useState`フックによる状態管理
- イベントハンドリングとユーザーインタラクション
- フォームの処理と検証

#### 🌐 **副作用とAPI連携**
- `useEffect`フックによる副作用の処理
- APIからのデータ取得
- ローディング状態とエラーハンドリング

#### 🏗️ **アプリケーション設計**
- コンポーネント間の状態共有
- Context APIによるグローバル状態管理
- カスタムフックによるロジックの再利用

### 開発のベストプラクティス

Session4で学んだテクニックを効果的に活用するためのガイドライン：

#### ✅ **推奨事項**
- リストレンダリングでは必ず一意の`key`を指定
- 条件付きレンダリングは適切な手法を選択
- コンポーネントは単一責任の原則に従って設計
- Props分割代入で可読性を向上

#### ⚠️ **注意点**
- `&&`演算子使用時のfalsy値に注意
- 過度なコンポーネント分割は避ける
- パフォーマンスを考慮したkey属性の選択
- 適切なセマンティックHTMLの使用

### 継続学習のために

Reactの学習を継続するために：

1. **実践プロジェクト**：学んだ技術を使って独自のアプリケーションを構築
2. **公式ドキュメント**：React公式ドキュメントで詳細な仕様を確認
3. **コミュニティ**：React開発者コミュニティに参加して知識を共有
4. **最新動向**：React 18の新機能やベストプラクティスの変化を追跡

Session1-4を通じて、Reactの基礎から実践的な動的UI構築まで、現代的なWebアプリケーション開発に必要な核心的なスキルを習得しました。これらの知識を基盤として、より複雑で魅力的なReactアプリケーションの開発に挑戦していきましょう。

---

**🎉 Session4完了おめでとうございます！**

動的レンダリングと実践テクニックをマスターし、Reactの基礎学習が完了しました。次は実際のプロジェクトでこれらの技術を活用し、より高度なReact開発に進んでいきましょう。
--
-

## 🧩 JSXの新しいコンポーネントへの抽出

### コンポーネント抽出の実践

コンポーネントの概念とpropsの使用をもう少し練習するために、フッターの一部を新しいコンポーネントに抽出してみましょう。

フッターコンポーネント内のJSXが少し長くなりすぎているので、この部分を取り出して独自のコンポーネントに抽出するアイデアを得ました。

### 実践的な抽出プロセス

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

この部分をすべて取得して切り取り、新しいコンポーネントを作成します。

```jsx
// 新しいOrderコンポーネント
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

// 簡潔になったFooterコンポーネント
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

### Propsによるデータの受け渡し

以前にあったJSXの代わりに、今度は単純にOrderコンポーネントをレンダリングしたいのです。

しかし、closeHourはもちろんもはや定義されていません。それは理にかなっています。なぜなら、closeHourはここのFooterコンポーネント内でのみ定義されているからです。しかし、以前にここにあったJSXは消えて、Orderコンポーネントにあります。

では、このOrderコンポーネントにこの値へのアクセスを与えるにはどうすればよいでしょうか？

答えはpropsを使用することだと推測していただけたでしょうか。

ご覧のように、propsは実際に関数に引数を渡すことと非常に似ています。ここで行う必要があるのは、propを作成することだけです。

### コンポーネント抽出の利点

これが、JSXの一部を取り出す方法です。コンポーネント内のJSXが少し大きくなりすぎた場合に、単純にそれを独自のコンポーネントに抽出します。

そして、そのJSXが親コンポーネントにあった何らかの値に依存している場合、このcloseHourのように、単純にそれをpropとして渡します。

これは、Reactアプリケーションを構築するときに常に行うことです。最初からすべてのコンポーネントを把握しているわけではありませんが、代わりに構築を開始し、大きくなりすぎたときに、それらの一部を別のコンポーネントに抽出することを決定できます。

### 練習課題

これがこのプロジェクトで作成する最後のコンポーネントなので、ペンと紙を取って、ここで構築したコンポーネント全体を描き出すことをお勧めします。

これは、このアプリケーションのすべてのコンポーネントがどのように連携するかをよりよく理解し、この小さなプロジェクトで構築した構造を本当に理解するための良い小さな練習になると思います。

---

## 🎯 Propsの分割代入（Destructuring）

### Propsの効率的な受け取り方法

Propsが何であるかがわかったので、実際にpropsを扱う際に、私たちの生活を少し楽にしましょう。

すでに知っているように、コンポーネントにpropsを渡すたびに、そのコンポーネントは自動的にこのpropsオブジェクトを受け取り、渡したすべてのpropsが含まれます。

実際、すべてのコンポーネントはこのpropsオブジェクトを受け取ります。propsを渡さないFooterでも、それを定義してコンソールにログ出力できます。

```jsx
function Footer(props) {
  console.log(props); // 空のオブジェクトが表示される
  
  return (
    <footer className="footer">
      {/* フッターの内容 */}
    </footer>
  );
}
```

空になりますが、常に存在します。

### 分割代入の利点

今やりたいことは、コンポーネントで常に「props.何とか」と書くことを避けることです。

propsの代わりに、このpizzaObjectをコンポーネントに直接受け取ることができれば素晴らしいと思いませんか？

実際、分割代入でそれを行うことができます。分割代入が奇妙な概念である場合は、前の復習セクションに戻ってください。

### 実践的な分割代入の実装

```jsx
// 分割代入を使用する前
function Pizza(props) {
  console.log(props);
  
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

// 分割代入を使用した後
function Pizza({ pizzaObj }) {
  console.log(pizzaObj);
  
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

これらのpropsを直接受け取る代わりに、すぐに分割代入できます。ここで、渡されるpropの名前と正確に一致する必要があるpizzaObjectを書くことができます。

### 分割代入の大きな利点

これは本当に素晴らしいことです。なぜなら、今、このコンポーネントが実際に受け取るpropsを知るために、この行を見るだけでよいからです。

以前は、汎用的なpropsしかありませんでした。そして、最終的にここでどのようなpropsを受け取るかを知りたい場合は、propsが実際に渡される場所に行く必要がありました。

しかし、もうそうではありません。今、このコンポーネント定義で、pizzaObjectを受け取ることがすぐにわかります。

そして、それがpropsをすぐに分割代入することの2番目の本当に大きな利点です。

### 複数のPropsの分割代入

```jsx
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
```

複数のpropsを渡している場合、ここで行う必要があるのは、openHourを追加することだけです。

### 重要な注意点

今後、コースの残りの部分では、常にこのようにpropsを受け取ります。

波括弧を決して忘れないようにしてください。そうしないと、もちろんすべてが壊れます。これは一般的な初心者の間違いです。

波括弧があってこそ、実際に分割代入を行っているのです。

---

## 📦 React Fragments

### React Fragmentとは何か

React Fragmentとは何か、そして正確にいつ必要になるかを学びましょう。

実際に、アプリケーションの最終バージョンに来て、実際にまだ何かが不足していることを示しましょう。それはここの文章です。

ここに段落のテキストがあり、それをコピーして配置しましょう。

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

### React Fragmentが必要な理由

しかし、ピザがまったくない場合はどうでしょうか？その場合、実際にはこれを表示したくありません。つまり、ここの文章は、条件付きレンダリングから来るものだけが欲しいのです。

つまり、この段落とこのULをこの場合にレンダリングしたいのですが、すぐにReactが私たちに怒り始めます。

「JSX式は1つの親要素を持つ必要があります。」

これは、JSXのルールの講義で学んだことと正確に同じです。JSXの一部は、どこで定義されても、実際には1つのルート要素しか持つことができません。

### 従来の解決方法の問題

これまでは、すべてをdivや他のコンポーネントで単純にラップすることで、常にこれを解決していました。

```jsx
// ❌ 問題：不要なdivが追加される
{numPizzas > 0 ? (
  <div>
    <p>本格的なイタリア料理...</p>
    <ul className="pizzas">...</ul>
  </div>
) : (
  <p>メニューを準備中です...</p>
)}
```

しかし、これは実際にフォーマットを台無しにします。これは実際に私たちが望むものではありません。

これら2つを含む1つの要素をレンダリングしたいのではなく、これら2つの要素を別々にレンダリングしたいのです。これら2つの親として1つの要素を持つことなく。

### React Fragmentの使用

これがReact Fragmentが必要なケースです。React Fragmentは基本的に、HTMLツリー、つまりDOMに痕跡を残すことなく、いくつかの要素をグループ化できます。

```jsx
// ✅ React Fragmentを使用
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
```

React Fragmentが必要なようで、それは非常に簡単です。行う必要があるのは、基本的にここですべてを削除することだけです。これで、これはフラグメントになります。

### React Fragmentの効果

保存すると、以前の状態に戻ります。DOMツリーを検査してみましょう。私が言ったように、これは実際に新しい要素をまったく作成しなかったことを示すためです。

コンテナがあり、メニューがあり、h2があり、そして正確に、段落とULがありますが、別々に、何にもラップされていません。

これはここで完全に見えず、私たちが探していたものと正確に同じです。

### React Fragmentの完全な構文

時々、React Fragmentにkeyを追加する必要があります。たとえば、リストをレンダリングするために使用している場合などです。その場合、少し異なる方法で書く必要があります。

```jsx
// 完全な構文（keyが必要な場合）
<React.Fragment key="menu-content">
  <p>本格的なイタリア料理...</p>
  <ul className="pizzas">...</ul>
</React.Fragment>

// 短縮構文（通常の場合）
<>
  <p>本格的なイタリア料理...</p>
  <ul className="pizzas">...</ul>
</>
```

まず、Reactがインポートされていることを確認しましょう。そして、React.Fragmentと書くことができます。

keyは必要ないので、短縮バージョンを使用できます。これはもちろんずっと良いです。

### React Fragmentの本質

React Fragmentについて知っておく必要があることはこれですべてです。これは非常にシンプルな概念で、基本的にJSXの一部に1つ以上の要素を持つことを可能にします。

---

## 🎨 条件付きクラスとテキストの設定

### プロジェクトの仕上げ

このプロジェクトを完成させるために、要素内のテキストを条件付きで設定する方法と、クラス名を条件付きで設定する方法を学びましょう。

最終プロジェクトを最後に見ると、唯一の違いは、売り切れのこのピザが価格の代わりに「SOLD OUT」のテキストを持っていることです。そして、ここの要素全体がグレーアウトされています。利用できないことを示すためです。

### 条件付きテキストの設定

現在、売り切れのピザが表示されないようにするコード行があります。まず、それを取り除くことから始めましょう。

```jsx
function Pizza({ pizzaObj }) {
  // この行を削除
  // if (pizzaObj.soldOut) return null;
  
  return (
    <li className="pizza">
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>
          {pizzaObj.soldOut ? "SOLD OUT" : `¥${pizzaObj.price}`}
        </span>
      </div>
    </li>
  );
}
```

以前に行ったこととの違いは、以前はここのこの要素全体を条件付きでレンダリングしていたことです。しかし、今はそれが欲しいのではありません。

今、このspan要素が欲しいことはすでにわかっていますが、まだ内容は欲しくありません。そこで、それを条件付きで設定しましょう。それは非常に簡単です。

再び、三項演算子を使用します。pizzaObj.soldOutの場合、ここのテキストは文字列「SOLD OUT」であるべきです。そうでなければ、ピザの価格が欲しいです。

### 条件付きレンダリングとの違い

ここでの違いを評価しましょう。要素を条件付きで設定しているのではなく、もちろんそれもできます：

```jsx
// 要素全体を条件付きでレンダリング（可能だが推奨されない）
{pizzaObj.soldOut ? (
  <span>SOLD OUT</span>
) : (
  <span>¥{pizzaObj.price}</span>
)}

// テキスト内容のみを条件付きで設定（推奨）
<span>
  {pizzaObj.soldOut ? "SOLD OUT" : `¥${pizzaObj.price}`}
</span>
```

結果はまったく同じですが、行っていることは根本的に異なります。

ここでは、span要素が欲しいことはすでにわかっていて、内容がまだわからないだけです。一方、ここでは、どの要素が欲しいかもまだわからないようです。

要素のテキスト内容を条件付きで設定するには、このようにする方がずっとクリーンだと思います。

### 条件付きクラス名の設定

最後に、クラス名について、ピザが売り切れの場合はいつでも、LIにsold-outクラスを追加できます。これにより、グレーアウトされます。

```jsx
function Pizza({ pizzaObj }) {
  return (
    <li className={`pizza ${pizzaObj.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>
          {pizzaObj.soldOut ? "SOLD OUT" : `¥${pizzaObj.price}`}
        </span>
      </div>
    </li>
  );
}
```

これを行う方法は次のとおりです。通常の文字列の代わりに、テンプレートリテラルを使用します。

しかし、今、これは実際にJavaScriptです。テンプレートリテラルはJavaScriptなので、JavaScriptモードに入りましょう。

今のところ、以前とまったく同じです。しかし、今、このテンプレートリテラル内で、テンプレートリテラルのJavaScriptモードにも入ることができます。

```jsx
className={`pizza ${pizzaObj.soldOut ? "sold-out" : ""}`}
```

そして、ここで三項演算子を使用して、pizzaObj.soldOutの場合は「sold-out」クラスを追加し、そうでなければ空文字列を追加します。

これで、売り切れのピザは適切にグレーアウトされ、「SOLD OUT」テキストが表示されます。

### まとめ

これで、条件付きでテキストとクラス名を設定する方法を学びました。これらの技術は、動的で応答性の高いReactアプリケーションを構築するために不可欠です。

---

## 📚 Session4のまとめ

### このセッションで習得したスキル

| 概念 | 説明 | 実例 |
|------|------|------|
| **リストレンダリング** | 配列データからコンポーネントを動的生成 | `{pizzas.map(pizza => <Pizza key={pizza.name} />)}` |
| **条件付きレンダリング（&&）** | 条件に基づく表示/非表示の切り替え | `{isOpen && <Order />}` |
| **条件付きレンダリング（三項演算子）** | 2つの選択肢からの選択 | `{isOpen ? <Order /> : <ClosedMessage />}` |
| **複数return** | 条件に応じた異なるJSXの返却 | `if (soldOut) return null;` |
| **コンポーネント抽出** | JSXの一部を新しいコンポーネントに分離 | `<Order />` コンポーネントの抽出 |
| **Props分割代入** | より効率的なProps受け取り | `function Pizza({ pizzaObj })` |
| **React Fragments** | 不要なDOM要素を避ける技術 | `<>...</>` |
| **動的スタイリング** | 条件に応じたクラス名とテキスト設定 | `className={`pizza ${soldOut ? 'sold-out' : ''}`}` |

### 重要なポイント

#### リストレンダリング
- **map()メソッド**：配列をJSX要素の配列に変換
- **key属性**：Reactの効率的な更新のために必須
- **データ駆動UI**：データの変更に応じて自動更新

#### 条件付きレンダリング
- **&&演算子**：表示/非表示の切り替えに最適
- **三項演算子**：2つの選択肢から選択する場合に使用
- **複数return**：大きく異なる表示内容の場合に有効

#### 実践的テクニック
- **コンポーネント抽出**：コードの可読性と保守性向上
- **Props分割代入**：より明確で効率的なProps受け取り
- **React Fragments**：不要なDOM要素を避けてクリーンなHTML構造
- **動的スタイリング**：条件に応じた見た目の変更

### 次のステップ

Session4で学んだ動的レンダリングと実践テクニックにより、以下が可能になりました：

- **データ駆動**：配列データに基づく動的なUI生成
- **条件分岐**：様々な状況に応じた表示制御
- **コンポーネント設計**：保守しやすいコンポーネント構造
- **実践的技術**：実際の開発で必要となる高度なテクニック

これらのスキルを組み合わせることで、実用的で動的なReactアプリケーションを構築できるようになりました。STEP01の基礎学習が完了し、より高度なReact開発に進む準備が整いました！