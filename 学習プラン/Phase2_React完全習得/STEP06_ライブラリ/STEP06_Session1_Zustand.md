# Session 1: Zustand - 商品カタログアプリを作ろう（カート機能編）

## はじめに：このセッションで作るもの

このセッションでは、**商品カタログアプリ**のショッピングカート機能を Zustand で実装しながら、状態管理の基本を学びます。

### 完成イメージ

```
┌─────────────────────────────────────┐
│  🛒 カート (3)                       │
├─────────────────────────────────────┤
│  iPhone 15        $999  [-] 1 [+]   │
│  MacBook Pro      $1999 [-] 2 [+]   │
├─────────────────────────────────────┤
│  合計: $4,997                       │
│  [購入する]                          │
└─────────────────────────────────────┘
```

### 実装する機能

1. **カートに商品を追加**
2. **数量を増減**
3. **商品を削除**
4. **合計金額を計算**

> **💡 次のセッション（Session 2）**では、React Query を使って DummyJSON API から商品データを取得し、このカートと連携させます。

---

## 1. プロジェクトのセットアップ

### Vite で React プロジェクトを作成

```bash
npm create vite@latest shop-catalog -- --template react-ts
cd shop-catalog
npm install
```

### スタイルの適用

まずはアプリの見た目を整えるために、CSS を設定しておきましょう。

```css
/* src/index.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, sans-serif;
  background: #f5f5f5;
  padding: 20px;
}

.app {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 20px;
}

/* 商品一覧 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.product-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card h3 {
  margin-bottom: 8px;
}

.product-card p {
  color: #666;
  margin-bottom: 12px;
}

.product-card button {
  width: 100%;
  padding: 8px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.product-card button:hover {
  background: #0052cc;
}

/* カート */
.cart {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart h2 {
  margin-bottom: 16px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-item-actions button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.cart-item-quantity {
  min-width: 24px;
  text-align: center;
}

.cart-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #eee;
}

.cart-total {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 12px;
}
```

---

## 2. UI の作成（静的データ）

まずは Zustand を導入する前に、**静的なデータ**を使ってアプリケーションの UI を完成させます。
これにより、コンポーネントの構造とデザインを先に確定させます。

### 2.1 カートアイテムコンポーネント (Static)

`src/components/CartItem.tsx` を作成します。
ここではまだ props を受け取るだけで、ボタンを押しても動かない「見た目だけ」のコンポーネントを作ります。

```tsx
// src/components/CartItem.tsx
type CartItemProps = {
  item: {
    id: number;
    title: string;
    price: number;
    quantity: number;
  };
};

function CartItem({ item }: CartItemProps) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-title">{item.title}</span>
        <span className="cart-item-price">${item.price}</span>
      </div>

      <div className="cart-item-actions">
        <button>−</button>
        <span className="cart-item-quantity">{item.quantity}</span>
        <button>+</button>
        <button>🗑️</button>
      </div>
    </div>
  );
}

export default CartItem;
```

### 2.2 カートコンポーネント (Static)

`src/components/Cart.tsx` を作成します。
仮のデータを定義して表示を確認します。

```tsx
// src/components/Cart.tsx
import CartItem from "./CartItem";

// 仮のデータ（あとで Zustand ストアに置き換えます）
const dummyItems = [
  { id: 1, title: "iPhone 15", price: 999, quantity: 1 },
  { id: 2, title: "MacBook Pro", price: 1999, quantity: 2 },
];

function Cart() {
  // 仮の合計計算
  const totalItems = dummyItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = dummyItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      <h2>🛒 カート ({totalItems})</h2>

      {dummyItems.length === 0 ? (
        <p>カートは空です</p>
      ) : (
        <>
          <div className="cart-items">
            {dummyItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <p className="cart-total">合計: ${totalPrice.toFixed(2)}</p>
            <button>カートを空にする</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
```

### 2.3 メインアプリ (Static)

`src/App.tsx` を編集して、商品一覧とカートを表示します。

```tsx
// src/App.tsx
import Cart from "./components/Cart";

// 仮の商品データ
const sampleProducts = [
  { id: 1, title: "iPhone 15", price: 999 },
  { id: 2, title: "MacBook Pro", price: 1999 },
  { id: 3, title: "AirPods Pro", price: 249 },
];

function App() {
  return (
    <div className="app">
      <h1>🛍️ Shop Catalog</h1>

      {/* 商品一覧 */}
      <section className="products">
        <h2>商品一覧</h2>
        <div className="product-grid">
          {sampleProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <button>カートに追加</button>
            </div>
          ))}
        </div>
      </section>

      {/* カート */}
      <Cart />
    </div>
  );
}

export default App;
```

ここまでで、画面上には商品一覧と、ダミーデータが入ったカートが表示されているはずです。
しかし、ボタンを押してもまだ何も起こりません。ここから Zustand を使って「動く」アプリにしていきます。

---

## 3. Zustand の基本（オプション：簡単なカウンター）

いきなりカート機能を作るのが難しいと感じる場合は、最も基本的な「カウンター」で Zustand の仕組みを確認してみましょう。
（すでに理解している場合はこのセクションを飛ばして構いません）

### Zustand をインストール

```bash
npm install zustand
```

### 最もシンプルなストア

```tsx
import { create } from "zustand";

type CountState = {
  count: number;
  inc: () => void;
};

const useCountStore = create<CountState>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));
```

### コンポーネントでの使用

```tsx
function Counter() {
  const { count, inc } = useCountStore();
  return <button onClick={inc}>count: {count}</button>;
}
```

---

## 4. カートストアを作成する

では、本題のカート機能の状態管理を作成します。

### ストアの要件

1. `items`: カート内の商品リスト
2. `addItem`: 商品を追加（すでにあれば数量+1）
3. `decreaseQuantity`: 数量を減らす（0 になったら削除）
4. `removeItem`: 商品を削除
5. `clearCart`: カートを空にする

### 実装

`src/stores/useCartStore.ts` を作成します。

```tsx
// src/stores/useCartStore.ts
import { create } from "zustand";

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

type Product = {
  id: number;
  title: string;
  price: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: { id: number; title: string; price: number }) => void;
  decreaseQuantity: (productId: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const useCartStore = create<CartState>((set) => ({
  // 状態（State）
  items: [],

  // アクション（Actions）

  // 商品をカートに追加
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }],
      };
    }),

  // 数量を減らす
  decreaseQuantity: (productId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),

  // 商品を削除
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  // カートを空にする
  clearCart: () => set({ items: [] }),
}));

export default useCartStore;
```

---

## 5. コンポーネントを Zustand に接続する

作成した静的なコンポーネントを書き換えて、ストアの状態とアクションを紐付けます。

### 5.1 Cart.tsx の修正

ダミーデータを削除し、`useCartStore` から `items` を取得するように変更します。また、合計金額もストアの状態から計算します。

```tsx
// src/components/Cart.tsx
import useCartStore from "../stores/useCartStore"; // 追加
import CartItem from "./CartItem";

function Cart() {
  // ストアから items と clearCart を取得
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // 派生状態（Derived State）：合計金額を計算
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart">
      <h2>🛒 カート ({totalItems})</h2>

      {items.length === 0 ? (
        <p>カートは空です</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <p className="cart-total">合計: ${totalPrice.toFixed(2)}</p>
            {/* アクションを接続 */}
            <button onClick={clearCart}>カートを空にする</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
```

### 5.2 CartItem.tsx の修正

ボタンアクションをストアの関数に接続します。

```tsx
// src/components/CartItem.tsx
import useCartStore from "../stores/useCartStore"; // 追加

type CartItemProps = {
  item: {
    id: number;
    title: string;
    price: number;
    quantity: number;
  };
};

function CartItem({ item }: CartItemProps) {
  // ストアからアクションのみを取得
  const addItem = useCartStore((state) => state.addItem);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-title">{item.title}</span>
        <span className="cart-item-price">${item.price}</span>
      </div>

      <div className="cart-item-actions">
        {/* ボタンにイベントハンドラを設定 */}
        <button onClick={() => decreaseQuantity(item.id)}>−</button>
        <span className="cart-item-quantity">{item.quantity}</span>
        <button onClick={() => addItem(item)}>+</button>
        <button onClick={() => removeItem(item.id)}>🗑️</button>
      </div>
    </div>
  );
}

export default CartItem;
```

### 5.3 App.tsx の修正

「カートに追加」ボタンを機能させます。

```tsx
// src/App.tsx
import Cart from "./components/Cart";
import useCartStore from "./stores/useCartStore"; // 追加

const sampleProducts = [
  /* ...省略... */
];

function App() {
  const addItem = useCartStore((state) => state.addItem); // アクションを取得

  return (
    <div className="app">
      {/* ...省略... */}
      <div className="product-grid">
        {sampleProducts.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            {/* 商品クリックで addItem を実行 */}
            <button onClick={() => addItem(product)}>カートに追加</button>
          </div>
        ))}
      </div>
      {/* ...省略... */}
      <Cart />
    </div>
  );
}

export default App;
```

---

## 6. 実践演習：ユーザー認証状態を管理しよう

ここまでの内容を定着させるために、小さな演習に取り組んでみましょう。

**課題：**
Zustand を使って、擬似的な「ユーザー認証（ログイン／ログアウト）」を管理するストアを作成してください。

**要件：**

1. `src/stores/useAuthStore.ts` を作成する。
2. 状態として以下を持つ：
   - `user`: ユーザー名（string）または null（未ログイン時）
   - `isLoggedIn`: ログイン状態（boolean）
3. アクションとして以下を持つ：
   - `login(username: string)`: ユーザー名を受け取り、ログイン状態にする。
   - `logout()`: 初期状態に戻す。
4. `App.tsx`（または適当な場所）でストアを読み込み、ログイン前と後で表示を切り替える。

<details>
<summary>回答例を表示</summary>

**1. ストアの作成**

```tsx
// src/stores/useAuthStore.ts
import { create } from "zustand";

type AuthState = {
  user: string | null;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  login: (username) => set({ user: username, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));

export default useAuthStore;
```

**2. コンポーネントでの使用**

```tsx
// src/App.tsx (抜粋)
import { useState } from "react";
import useAuthStore from "./stores/useAuthStore";

function App() {
  const { user, isLoggedIn, login, logout } = useAuthStore();
  const [inputName, setInputName] = useState("");

  const handleLogin = () => {
    if (inputName.trim()) {
      login(inputName);
      setInputName("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Auth Exercise</h1>

      {isLoggedIn ? (
        <div>
          <p>ようこそ、{user} さん！</p>
          <button onClick={logout}>ログアウト</button>
        </div>
      ) : (
        <div>
          <p>ログインしてください</p>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="ユーザー名を入力"
          />
          <button onClick={handleLogin}>ログイン</button>
        </div>
      )}
    </div>
  );
}
```

</details>

---

## 7. まとめ

これで、静的な UI から始めて、徐々に Zustand の状態管理を組み込むリファクタリングが完了しました。

| ステップ      | 内容                                               |
| ------------- | -------------------------------------------------- |
| 1. UI 作成    | コンポーネントの見た目と構造を定義（静的データ）   |
| 2. ストア作成 | `create` で状態とアクションを定義                  |
| 3. 接続       | コンポーネントから `useCartStore` を呼び出して連携 |

この手順は、実際の開発現場でも**「まずは見た目を作る（マークアップ）→ ロジックを組み込む」**という一般的なフローに沿っており、スムーズに開発を進めることができます。

### 次のセッション

**Session 2: React Query** では、ここで使用した `sampleProducts` を API から取得する形に変更し、非同期データと Zustand の連携を学びます！
