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

### JSXの基本概念

Session1でJSXを使用してコンポーネントを作成しましたが、JSXとは実際に何なのか、そしてなぜReactにおいてこれほど重要なのかを深く理解しましょう。

コンポーネントについて最初に学んだとき、コンポーネントには独自のデータ、ロジック、そして外観が含まれると説明しました。これは理にかなっています。なぜなら、コンポーネントがユーザーインターフェースの一部である場合、そのコンポーネントがどのように見えるかを正確に記述できる必要があるからです。

**JSXは、データとロジックに基づいてコンポーネントがどのように見え、どのように動作するかを記述するために使用する宣言的構文です。**

### JSXの実際の姿

```jsx
// JSXで書かれたコンポーネント
function Pizza() {
  return (
    <div className="pizza">
      <img src="pizzas/margherita.jpg" alt="マルゲリータピザ" />
      <h3>マルゲリータピザ</h3>
      <p>トマトとモッツァレラチーズ</p>
    </div>
  );
}
```

このJSXコードはHTMLのように見えますが、実際には**JavaScriptの拡張**です。JSXを使用することで、HTML、CSS、JavaScriptの部分を1つのコードブロックに組み合わせることができます。

### JSXからJavaScriptへの変換

JSXは最終的にJavaScriptに変換される必要があります。この変換は**Babel**というツールによって自動的に行われます（Create React Appに含まれています）。

```jsx
// JSX（私たちが書くコード）
function Header() {
  return <h1>Fast React Pizza Co.</h1>;
}

// 変換後のJavaScript（Babelが生成）
function Header() {
  return React.createElement('h1', null, 'Fast React Pizza Co.');
}
```

**重要なポイント**：
- ブラウザはJSXを理解できないため、この変換が必要
- すべてのJSXは`React.createElement`関数呼び出しに変換される
- 理論的にはJSXなしでReactを使用できるが、コードが非常に読みにくくなる

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

### 従来の関心の分離

Web開発を学び始めたとき、おそらく以下のような分離を教わったでしょう：

```
従来のアプローチ
├── index.html（構造）
├── style.css（スタイル）
└── script.js（動作）
```

**従来の考え方**：
- 1つの技術につき1つのファイル
- HTML、CSS、JavaScriptを分離
- これが「関心の分離」だと考えられていた

### シングルページアプリケーションの登場

しかし、ページがよりインタラクティブになり、シングルページアプリケーションが台頭すると、**JavaScriptがHTMLの内容と表示を決定する**ようになりました。

```javascript
// 現代のWebアプリケーションの例
const productList = document.querySelector('#product-list');
const products = await fetchProducts();

products.forEach(product => {
  const productElement = document.createElement('div');
  productElement.className = product.available ? 'product' : 'product sold-out';
  productElement.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <span>${product.available ? `¥${product.price}` : 'SOLD OUT'}</span>
  `;
  productList.appendChild(productElement);
});
```

**重要な洞察**：
- JavaScriptがHTMLの内容を完全に制御
- ロジックとUIが密接に結合
- HTMLファイルだけでは意味をなさない

### Reactの関心の分離

この現実を受けて、Reactは新しい関心の分離を提案しました：

#### 🆚 従来 vs React の関心の分離

| 観点 | 従来のアプローチ | Reactのアプローチ |
|------|-----------------|------------------|
| 分離単位 | 技術ごと（HTML/CSS/JS） | コンポーネントごと |
| ファイル構成 | 3つの別ファイル | 1つのコンポーネントファイル |
| 責任範囲 | 技術的な分離 | 機能的な分離 |
| 保守性 | 関連コードが分散 | 関連コードが集約 |

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