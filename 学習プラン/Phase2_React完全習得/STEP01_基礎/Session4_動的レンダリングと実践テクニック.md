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

リストレンダリングは、ほぼすべての React アプリケーションで使用される最も重要な技術の一つです。このコース全体を通じて何度も登場するでしょう。ここでは、React でリストをレンダリングする方法を学びます。

リストレンダリングとは、配列データの各要素に対して、それぞれ 1 つのコンポーネントを生成する技術です。

### 実践的な例で理解する

例として、ピザのデータを考えてみましょう。各オブジェクトが 1 つのピザを表す、オブジェクトの配列があります。

この配列を使って、各ピザオブジェクトに対応するピザコンポーネントを UI 上に自動的に生成したいと考えます。

つまり、ピザコンポーネントを手動で 1 つずつ記述するのではなく、配列データを基に動的にすべてを表示したいということです。

配列に 4 つのピザがあれば 4 つ、10 個あれば 10 個のコンポーネントが自動的に表示されるようにします。

### React の美しさ：JavaScript の知識の活用

React の優れた点の一つは、多くの場合、既存の JavaScript の知識だけで対応できることです。

例えば、リストレンダリングにおいて、React 特有の新しい知識は必要ありません。特別なリスト専用の要素が用意されているわけでもありません。

必要なのは、既に習得している JavaScript の知識のみです。今回の場合は`map`メソッドを使用します。

### 実践的な実装

それでは、実際の実装方法を見ていきましょう。

まず、新しい`div`要素を作成します。後でこれをリスト要素に変換しますが、最初はどんな要素でも問題ありません。
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

まず、JavaScript モード内で`pizzaData`を取得します。これは単純な配列データです。

次に、この配列を`map`メソッドで処理します。`map`は配列をループして新しい配列を生成します。

`pizzaData`の各要素が 1 つのピザオブジェクトです。`map`の結果として、各ピザオブジェクトに対応するピザコンポーネントを生成します。

### より効率的なアプローチ

実際の開発では、オブジェクト全体を子コンポーネント（この場合は Pizza コンポーネント）に渡し、コンポーネント内で必要な情報を取り出す方法が一般的です。

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

これで、`pizzaData`配列に基づいたすべてのピザのリストが表示されます。

### key 属性の重要性

ここで、コンソールに「リスト内の各子要素は一意の key プロパティを持つべきです」という警告が表示されることに気づくでしょう。

この警告は、`map`メソッドでリストをレンダリングする際、レンダリングされる各要素には一意の`key`プロパティが必要であることを意味しています。

`key`は React が内部的に使用する特別な prop で、パフォーマンス最適化のために必要です。現時点では詳細を理解する必要はありませんが、後のセクションで`key`プロパティの役割について詳しく学びます。

今知っておくべき重要なことは、各要素に一意の値を指定する必要があるということです。この例では、ピザの名前を使用します（各ピザの名前は一意であるため）。

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

これで警告が消えます。

### セマンティックマークアップの重要性

次に、この要素を単純な`div`から`ul`（順序なしリスト）に変更します。そして、各ピザは`li`（リストアイテム）要素であるべきです。

このようなセマンティック（意味のある）マークアップを記述することは非常に重要です。多くの学習教材では軽視されがちですが、アクセシビリティと保守性の観点から極めて大切な要素です。

### なぜ map メソッドを使うのか

`forEach`を使いたくなるかもしれませんが、それでは正しく動作しません。

```jsx
// ❌ これは動作しません
{
  pizzaData.forEach((pizza) => <Pizza pizzaObj={pizza} key={pizza.name} />);
}
```

実際、何も表示されません。これは、JSX 内では値を返す式が必要だからです。JSX 要素の配列を得るには、新しい配列を生成する必要があります。

これが`map`メソッドの役割です。`map`は新しい配列を生成し、この例では 6 つのピザコンポーネントを含む配列を返します。React はこの配列をレンダリングすることができます。

これは非常に重要な技術です。すぐに覚えられなくても心配する必要はありません。このコース全体を通じて繰り返し使用することで、自然と身につきます。

---

## ⚡ 条件付きレンダリング：&&演算子の活用

### 条件付きレンダリングの重要性

React 開発において常に使用するもう一つの重要な技術が、条件付きレンダリングです。

このセクションと次の 2 つのセクションで、条件付きレンダリングを実現する 3 つの異なる方法を学習します。最初の方法は`&&`演算子を使用するアプローチです。

### 条件付きレンダリングとは

条件付きレンダリングとは、特定の条件に基づいて UI の一部を表示または非表示にする技術です。例えば、レストランが現在営業中かどうかによって表示内容を変えるような場合に使います。

これが条件付きレンダリングの本質です。つまり、何らかの条件判定に基づいて、UI の一部を動的に制御することを指します。

### &&演算子を使った条件付きレンダリング

#### 基本的な使用方法

まず、以前にフッターで作成した`isOpen`変数を思い出してください。この変数は、現在レストランが営業中かどうかを示します。具体的には、現在時刻が 12 時から 22 時の間にある場合に`true`になります。

ここで実現したいのは、レストランが営業中の場合にのみ、フッター内に特定の内容を表示することです。

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

これは条件付きレンダリングの適切な使用例です。別の例も確認してみましょう。

### &&演算子使用時の注意点

#### 問題：数値 0 が画面に表示されるケース

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

なぜこのような現象が起こるのでしょうか？これは短絡評価（short-circuit evaluation）の仕組みによるものです。`&&`演算子が短絡すると、右側の式を評価せず、左側の値がそのまま結果となります。

つまり、左側が`0`の場合、結果も`0`となり、UI に`0`が表示されてしまいます。前述の例では問題になりませんでした。なぜなら、React は`true`や`false`の値はレンダリングしませんが、`0`は数値として表示してしまうからです。

**解決方法**：明示的に真偽値（boolean）を使用する

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

結論として、`&&`演算子の左側には数値を直接置くべきではありません。常に`true`または`false`を返す条件式を記述するようにしましょう。

---

## 🔀 条件付きレンダリング：三項演算子の活用

### 三項演算子による条件付きレンダリング

次に、三項演算子を使用して同じことを実現する方法を見ていきましょう。

先ほどの`&&`演算子の代わりに、三項演算子を使って条件付きレンダリングを実装します。

三項演算子に馴染みがない場合は、React に必要な JavaScript の基礎知識を復習するセクションを参照してください。

### 三項演算子の構造

三項演算子は 3 つの部分から構成されています。最初の部分は条件式で、この条件が`true`の場合、演算結果は 2 番目の部分（`?`の後）の値になります。

そして、三項演算子には 3 番目の部分（`:`の後）も必要です。これは基本的に`else`分岐に相当します。```jsx

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

以前と全く同じ結果が得られることが確認できます。

### 三項演算子の利点

三項演算子を使用する利点は、条件に合わない場合の代替表示を提供できることです。例えば「メニューを準備中です。後ほどお越しください」といったメッセージを表示できます。

このように代替メッセージを表示することで、状況によっては何も表示しないよりもユーザー体験が向上します。

### なぜ if-else 文は使えないのか

ここで「なぜ単純に`if-else`文を使用できないのか」と疑問に思うかもしれません。

その理由は、JSX のルールに関するセクションで学んだ内容に関係しています。JSX の波括弧`{}`内（JavaScript モード）では、任意の JavaScript コードを書けるわけではありません。

ここで記述する必要があるのは、**値を返す式**です。`if-else`文は値を返さないため、使用できません。

```jsx
// ❌ これは動作しません
{if (numPizzas > 0) {
  return <p>ピザがあります</p>;
} else {
  return <p>ピザがありません</p>;
}}
````

仮に`if (numPizzas > 0) { ... }`のように記述しようとすると、大きなエラーが表示されます。「予期しないトークン（Unexpected token）」というメッセージが出るでしょう。

この理由は、`if-else`文が値を生成しない（return しない）ためです。JSX 内では値を返す式のみが使用できます。

### 三項演算子の実用性

このように使用される三項演算子は非常に強力で、多くの場合`&&`演算子よりも優れた選択肢となります。

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

三項演算子は、React 開発において非常に重要なツールの一つです。

ここで重要なのは、単に JavaScript の機能を使用しているだけだということです。条件付きレンダリングを実現するために、React 固有の新しい概念を学ぶ必要はありません。

これらはすべて、既存の JavaScript 言語の一部です。波括弧`{}`で JavaScript モードに入り、通常の JavaScript と同じように演算子を使用するだけです。

---

## 🔄 条件付きレンダリング：複数 return の活用

### 複数 return とは

これまでのコンポーネントは 1 つの`return`文のみを持っていましたが、条件に応じて**異なる return 文を実行する**ことも可能です。特に、条件によって表示内容が大きく異なる場合に効果的な手法です。

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

ここで重要なポイントは、これら 2 つの`return`文が同時に実行されることはないということです。条件に応じてどちらか一方のみが実行されます。

この早期 return（early return）パターンは、JSX 内での条件分岐ではなく、コンポーネント全体を条件に応じて完全に切り替えたい場合により効果的です。

---

## 🧩 JSX の新しいコンポーネントへの抽出

### コンポーネント抽出とは

コンポーネントの概念と props の使用方法をさらに練習するために、フッターの一部を新しいコンポーネントに抽出してみましょう。

フッターコンポーネント内の JSX が少し長くなってきたため、一部を独立したコンポーネントとして分離することにします。

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

`className="order"`の部分を切り取り、新しいコンポーネントを作成します。

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

しかし、この段階でエラーが発生します。`Order`コンポーネント内で`openHour`と`closeHour`が未定義（undefined）となってしまうためです。

**解決方法：props を使って値を渡す**

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

これが、コンポーネント内の JSX が大きくなりすぎた際に、一部を独立したコンポーネントとして抽出する方法です。

抽出した JSX が親コンポーネントの値（この例では`closeHour`や`openHour`）に依存している場合は、それらを props として渡すだけです。

これは React アプリケーション開発における一般的なプロセスです。最初からすべてのコンポーネント構成が明確なわけではありません。開発を進めながら、コンポーネントが大きくなりすぎたと感じたら、適切に分割していくのが自然な流れです。

---

## 🎯 Props の分割代入（Destructuring Props）

### 分割代入とは

props の仕組みを理解したところで、props をより効率的に使用する方法を学びましょう。

既に学んだように、コンポーネントに props を渡すと、そのコンポーネントは自動的に props オブジェクトを受け取ります。このオブジェクトには、渡されたすべての props が含まれています。

実際、すべてのコンポーネントは props オブジェクトを受け取ります。props を明示的に渡していないコンポーネント（例えば Footer）でも、パラメータとして定義してコンソールに出力することができます。

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

これは非常に優れた手法です。なぜなら、コンポーネントがどの props を受け取るのかを知るために、この 1 行を見るだけで済むからです。

以前の方法では、汎用的な`props`パラメータしかありませんでした。そのため、実際にどの props を受け取っているかを知りたい場合は、親コンポーネントで props を渡している箇所まで確認する必要がありました。

しかし、分割代入を使えばその必要はありません。コンポーネント定義を見るだけで、`pizzaObj`を受け取っていることが一目で分かります。

これが、props を即座に分割代入することの 2 つ目の大きな利点です。

---

## 📦 React Fragments：不要な DOM 要素を避ける

### React Fragments とは

React Fragment とは何か、そしてどのような場合に必要となるのかを学びましょう。

実は、アプリケーションの最終バージョンを確認すると、まだ実装していない要素があることに気づきます。それは説明文の段落です。

この段落テキストを追加してみましょう。

### 問題：不要なラッパー要素の発生

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

しかし、すぐに React がエラーを表示します。「JSX 式には 1 つの親要素が必要です（JSX expressions must have one parent element）」と。

これは、JSX のルールに関するセクションで学んだ内容そのものです。JSX は、どこで定義されても、必ず 1 つのルート要素しか持てません。

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

React Fragment は、DOM に実際の要素として出力されることなく、複数の要素をグループ化できる仕組みです。

場合によっては、React Fragment に`key`属性を追加する必要があります。例えば、リストのレンダリングに使用している場合などです。その際は、完全な構文で記述する必要があります。

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

今回の場合は`key`は不要なので、短縮構文を使用できます。こちらの方がシンプルで優れています。

---

## 🎨 動的スタイリング：条件に応じたクラス名とテキストの設定

### 動的スタイリングとは

プロジェクトを完成させるために、要素内のテキストとクラス名を条件に応じて動的に設定する方法を学びましょう。

最終プロジェクトを確認すると、売り切れのピザは価格の代わりに「SOLD OUT」というテキストが表示され、要素全体が少しグレーアウトされています。これにより、利用できないことを視覚的に示しています。

### 条件付きテキストの設定

現在、売り切れピザを非表示にするコード行があります。まず、この行を削除することから始めましょう。

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

これで、条件に応じてテキストを動的に表示する準備ができました。以前のアプローチとの違いは、以前は要素全体を条件付きでレンダリングしていたことです。

しかし今回は異なります。`span`要素自体は常に表示したいのですが、その中身（テキスト）を条件に応じて変更したいのです。

これは非常に簡単に実装できます。再び三項演算子を使用します。

### 条件付きクラス名の設定

次に、クラス名の動的設定について見ていきましょう。ピザが売り切れの場合、`li`要素に`sold-out`クラスを追加することで、グレーアウト表示を実現できます。

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

これで求めていた動作が実現できました。なぜこれが機能するのかを整理しましょう。

テンプレートリテラル内で JavaScript 式を記述しています。三項演算子で`soldOut`の真偽値をチェックし、条件に応じて結果を返します。

`soldOut`が`true`の場合、演算子の結果は`"sold-out"`となります。そのため、最終的なクラス名は`"pizza sold-out"`になります。

一方、`soldOut`が`false`の場合、空文字列`""`を返します。そのため、クラス名は単に`"pizza"`となります。

素晴らしいですね。これが、要素に CSS クラスを条件付きで設定する方法です。

通常の JavaScript で必要な`classList`プロパティの操作は一切不要です。

また、通常の JavaScript では`textContent`や`innerHTML`などを使って DOM を直接操作する必要があることを思い出してください。

しかし、JSX と React の宣言的な性質により、すべてがよりシンプルで、開発しやすくなります。

### 最終的な仕上げ

最後の仕上げとして、`public`フォルダ内の`index.html`を編集しましょう。ドキュメントのタイトルを適切に設定します。

現在はデフォルトの「React App」と表示されていますが、これを「Fast React Pizza Co.」に変更しましょう。

これで完了です。アプリケーションと最初のプロジェクトが完成しました。

この長いセクションを最後まで学習されたこと、おめでとうございます！

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

これらの技術は、実際の Web アプリケーション開発において頻繁に使用される、基本的かつ重要なスキルです。継続的な実践を通じて、これらの概念をしっかりと自分のものにしていきましょう。
