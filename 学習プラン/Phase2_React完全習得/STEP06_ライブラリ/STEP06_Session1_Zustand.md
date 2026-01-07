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
npm create vite@latest shop-catalog -- --template react
cd shop-catalog
npm install
```

### Zustand をインストール

```bash
npm install zustand
```

### ディレクトリ構造

```
src/
├── stores/
│   └── useCartStore.js    ← Zustandストア
├── components/
│   ├── Cart.jsx           ← カート表示
│   └── CartItem.jsx       ← カート内の商品
├── App.jsx
└── main.jsx
```

---

## 2. Zustand の基本：カートストアを作成する

### ストアとは？

ストアは、アプリケーション全体で共有される状態の置き場所です。Zustand では `create` 関数でストアを作成します。

### カートストアを作成

```jsx
// src/stores/useCartStore.js
import { create } from "zustand";

const useCartStore = create((set) => ({
  // =====================================
  // 状態（State）
  // =====================================
  items: [], // カート内の商品リスト

  // =====================================
  // アクション（Actions）
  // =====================================

  // 商品をカートに追加
  addItem: (product) =>
    set((state) => {
      // すでにカートにある商品かチェック
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // あれば数量を+1
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      // なければ新規追加（数量1で）
      return {
        items: [...state.items, { ...product, quantity: 1 }],
      };
    }),
}));

export default useCartStore;
```

**コード解説:**

```jsx
import { create } from "zustand";
```

- `create` は Zustand のストアを作成する関数

```jsx
const useCartStore = create((set) => ({
```

- `set` は状態を更新するための関数
- 戻り値のオブジェクトが初期状態になる

```jsx
items: [],
```

- カート内の商品を配列で管理
- 各商品は `{ id, title, price, quantity }` の形

```jsx
addItem: (product) => set((state) => { ... })
```

- `addItem` はアクション（状態を変更する関数）
- `set` に関数を渡すと、現在の `state` を受け取れる

---

## 3. セレクター：必要な状態だけを取得する

### コンポーネントでストアを使う

```jsx
// src/components/Cart.jsx
import useCartStore from "../stores/useCartStore";

function Cart() {
  // セレクターで items だけを取得
  const items = useCartStore((state) => state.items);

  return (
    <div className="cart">
      <h2>🛒 カート ({items.length})</h2>

      {items.length === 0 ? (
        <p>カートは空です</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.title} - ${item.price} × {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
```

**コード解説:**

```jsx
const items = useCartStore((state) => state.items);
```

- **セレクター**: `(state) => state.items` で必要な部分だけを選択
- `items` が変わったときだけ、このコンポーネントが再レンダリングされる

### なぜセレクターを使うのか？

```jsx
// ❌ ストア全体を取得（すべての変更で再レンダリング）
const store = useCartStore();

// ✅ 必要な部分だけ取得（その部分が変わったときだけ再レンダリング）
const items = useCartStore((state) => state.items);
```

---

## 4. アクションを追加：数量変更と削除

カートストアにさらにアクションを追加します。

```jsx
// src/stores/useCartStore.js
import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [],

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

  // 数量を減らす（1になったら削除）
  decreaseQuantity: (productId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0), // 0以下は削除
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

**コード解説:**

```jsx
decreaseQuantity: (productId) => set((state) => ({
  items: state.items
    .map(...)    // 数量を-1
    .filter(...) // 0以下を削除
})),
```

- `map` で数量を減らし、`filter` で 0 以下を削除
- メソッドチェーンで読みやすく

```jsx
clearCart: () => set({ items: [] }),
```

- シンプルな更新は、オブジェクトを直接渡せる
- 既存の状態とマージされる

---

## 5. カートアイテムコンポーネント

個別の商品表示コンポーネントを作成します。

```jsx
// src/components/CartItem.jsx
import useCartStore from "../stores/useCartStore";

function CartItem({ item }) {
  // アクションを取得
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

---

## 6. 派生状態：合計金額を計算する

カート内の商品から合計金額を計算します。

### 方法 1: セレクター内で計算（推奨）

```jsx
// src/components/Cart.jsx
import useCartStore from "../stores/useCartStore";
import CartItem from "./CartItem";

function Cart() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // セレクター内で合計金額を計算
  const totalPrice = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // 合計個数も同様に計算
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

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
            <button onClick={clearCart}>カートを空にする</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
```

**コード解説:**

```jsx
const totalPrice = useCartStore((state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
```

- `reduce` で合計を計算
- `items` が変わると自動的に再計算される

---

## 7. アプリを組み立てる

### App.jsx

まずは仮の商品データでテストします（次のセッションで API から取得）。

```jsx
// src/App.jsx
import Cart from "./components/Cart";
import useCartStore from "./stores/useCartStore";

// 仮の商品データ（次のセッションでAPIから取得）
const sampleProducts = [
  { id: 1, title: "iPhone 15", price: 999 },
  { id: 2, title: "MacBook Pro", price: 1999 },
  { id: 3, title: "AirPods Pro", price: 249 },
];

function App() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="app">
      <h1>🛍️ Shop Catalog</h1>

      {/* 商品一覧（仮） */}
      <section className="products">
        <h2>商品一覧</h2>
        <div className="product-grid">
          {sampleProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <button onClick={() => addItem(product)}>カートに追加</button>
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

---

## 8. スタイルを追加（オプション）

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

## まとめ

| 概念       | 説明                                               |
| ---------- | -------------------------------------------------- |
| `create`   | ストアを作成する関数                               |
| `set`      | 状態を更新する関数                                 |
| セレクター | 必要な状態だけを取得する関数                       |
| アクション | 状態を変更する関数（`addItem`, `removeItem` など） |
| 派生状態   | 既存の状態から計算される値（`totalPrice` など）    |

### 作成したもの

- ✅ カートストア（`useCartStore`）
- ✅ 商品の追加・削除・数量変更
- ✅ 合計金額の計算
- ✅ カート表示コンポーネント

### 次のセッション

**Session 2: React Query** では、DummyJSON API から商品データを取得して、このカートと連携させます！
