
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

### Reactにおけるスタイリングの選択肢

Session2でコンポーネントの構造を学びましたが、実際のアプリケーションでは見た目も重要です。ReactはスタイリングについてOpinionated（意見を持った）フレームワークではないため、多様な選択肢があります。

**Reactで利用可能なスタイリング手法**：
- **インラインスタイル**：JSXの`style`属性を使用
- **外部CSSファイル**：従来のCSS/Sassファイルをインポート
- **CSSモジュール**：スコープ化されたCSS
- **Styled Components**：CSS-in-JS ライブラリ
- **Tailwind CSS**：ユーティリティファーストCSS

このセッションでは、基本となる**インラインスタイル**と**外部CSSファイル**の使用方法を学習します。

### インラインスタイルの実装

#### HTMLとJSXの違い

従来のHTMLでは、インラインスタイルは文字列として記述します：

```html
<!-- HTML -->
<h1 style="color: red; font-size: 48px;">Fast React Pizza Co.</h1>
```

しかし、JSXでは**JavaScriptオブジェクト**として記述する必要があります：

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

#### CSSファイルのインポート

より本格的なスタイリングには、外部CSSファイルを使用します：

```jsx
// App.js
import './index.css'; // CSSファイルをインポート

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

#### JSXでのクラス名指定

**重要な違い**：HTMLの`class`属性は、JSXでは`className`を使用します：

```jsx
// ❌ 間違い（警告が表示される）
<div class="container">

// ✅ 正しい
<div className="container">
```

**理由**：`class`はJavaScriptの予約語のため、JSXでは`className`を使用

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

### Propsとは何か

**Props**（プロパティの略）は、Reactにおけるコンポーネント間のデータ受け渡しの仕組みです。親コンポーネントから子コンポーネントへデータを渡すための「通信チャンネル」として機能します。

```
親コンポーネント（Menu）
    ↓ Props
子コンポーネント（Pizza）
```

### 基本的なProps の使用方法

#### Step 1: Props を渡す（親コンポーネント）

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

#### Step 2: Props を受け取る（子コンポーネント）

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

### Props の復習と深掘り

Session2とこれまでの内容で、Propsの基本的な使用方法を学びました。ここでは、Propsのより深い概念と、Reactの設計思想について理解を深めましょう。

### Props の本質的な役割

#### Props は設定パラメータ

Props は、親コンポーネントが子コンポーネントをカスタマイズするための「設定」として機能します：

```jsx
// 親コンポーネントが子コンポーネントを「設定」
function Menu() {
  return (
    <div>
      <Pizza 
        name="Margherita"
        price={1800}
        soldOut={false}  // この設定で子コンポーネントの見た目・動作が決まる
      />
    </div>
  );
}
```

#### JavaScript関数の引数との類似性

Props は、JavaScript関数の引数と非常に似ています：

```javascript
// 通常のJavaScript関数
function calculateTotal(price, tax, discount) {
  return price + tax - discount;
}

// React コンポーネント
function Pizza(props) {
  return <div>{props.name} - ¥{props.price}</div>;
}
```

**共通点**：
- どちらも外部からデータを受け取る
- 受け取ったデータを使って処理を行う
- 任意の型のデータを受け取れる

### React におけるデータの種類

Reactコンポーネントが扱うデータは主に2種類あります：

#### 1. Props（外部データ）
- **親コンポーネントから受け取るデータ**
- コンポーネント自身では変更不可
- 「設定」や「引数」のような役割

#### 2. State（内部データ）
- **コンポーネント内部で管理するデータ**
- コンポーネント自身で変更可能
- 時間とともに変化するデータ

```jsx
function Pizza(props) {  // props = 外部データ
  const [quantity, setQuantity] = useState(1);  // state = 内部データ
  
  return (
    <div>
      <h3>{props.name}</h3>  {/* 外部から受け取った名前 */}
      <p>数量: {quantity}</p>  {/* 内部で管理する数量 */}
      <button onClick={() => setQuantity(quantity + 1)}>
        追加
      </button>
    </div>
  );
}
```

### Props の不変性（Immutability）

#### 不変性とは

**Props は読み取り専用**であり、子コンポーネント内で変更してはいけません：

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

Props はオブジェクトなので、変更すると親コンポーネントにも影響します：

```javascript
// JavaScriptオブジェクトの参照の例
const originalPizza = { name: "Margherita", price: 1500 };
const pizzaCopy = originalPizza;

pizzaCopy.price = 2250;
console.log(originalPizza.price); // 2250（元のオブジェクトも変更される！）
```

##### 2. **純粋関数の維持**

Reactコンポーネントは**純粋関数**であるべきです：

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

##### 3. **最適化とバグ防止**

不変性により、Reactは効率的な最適化を行い、予期しないバグを防げます。

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

#### 一方向データフローとは

Reactでは、データは**親から子へ**の一方向にのみ流れます：

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

#### 他のフレームワークとの違い

| フレームワーク | データフロー | 特徴 |
|---------------|-------------|------|
| **React** | 一方向 | 予測しやすい、デバッグしやすい |
| **Angular** | 双方向 | 便利だが複雑になりがち |
| **Vue.js** | 双方向（オプション） | 柔軟だが注意が必要 |

#### 一方向データフローの利点

##### 1. **予測可能性**

データの流れが明確なので、アプリケーションの動作を理解しやすい：

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

##### 2. **デバッグの容易さ**

問題が発生した場合、データの流れを上流から追跡できます：

```jsx
// バグが Pizza コンポーネントで発生した場合
// 1. Pizza の props を確認
// 2. Menu から渡されるデータを確認  
// 3. App の state を確認
// → 原因を特定しやすい
```

##### 3. **パフォーマンス**

双方向バインディングよりも効率的な実装が可能です。

#### 子から親へのデータ送信

「一方向」と言っても、子から親へデータを送る方法はあります（次のセッションで詳しく学習）：

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

多くのReact初心者がJSXで混乱する理由は、HTMLに似ているものの、実際には**JavaScript**だからです。JSXを正しく使うための重要なルールを理解しましょう。

### 一般的なJSXルール

#### 1. **JSXは基本的にHTMLと同じ構文**

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

JSXの中で動的な値や式を使用する場合は、波括弧`{}`を使用します：

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

#### 1. **`className` vs `class`**

```jsx
// ❌ HTML（JSXでは警告）
<div class="container">

// ✅ JSX
<div className="container">
```

**理由**：`class`はJavaScriptの予約語のため

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