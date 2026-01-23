# Session 2: Tanstack Query - 商品カタログアプリを作ろう（商品一覧編）

## はじめに：このセッションで作るもの

前回の Session 1 では、Zustand を使ってカート機能を実装しました。このセッションでは、**React Query** を使って API から商品データを取得し、カートと連携させます。

### 完成イメージ

```
┌─────────────────────────────────────────────────────┐
│  🛍️ Shop Catalog                                    │
├─────────────────────────────────────────────────────┤
│  カテゴリ: [すべて ▼]                                │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐              │
│  │ 📱      │  │ 💻      │  │ 🎧      │              │
│  │ iPhone  │  │ MacBook │  │ AirPods │              │
│  │ $999    │  │ $1999   │  │ $249    │              │
│  │[カートへ]│  │[カートへ]│  │[カートへ]│              │
│  └─────────┘  └─────────┘  └─────────┘              │
├─────────────────────────────────────────────────────┤
│  🛒 カート (3) - 合計: $4,997                        │
└─────────────────────────────────────────────────────┘
```

### 実装する機能

1. **商品一覧を API から取得**
2. **ローディング・エラー表示**
3. **カテゴリでフィルター**
4. **カートに商品を追加**（Zustand と連携）

### 使用する API

[DummyJSON](https://dummyjson.com/) - 無料の商品データ API

- 商品一覧: `https://dummyjson.com/products`
- カテゴリ別: `https://dummyjson.com/products/category/カテゴリ名`

---

## 1. React Query のセットアップ

### インストール

Session 1 で作成したプロジェクトに追加します。

```bash
npm install @tanstack/react-query
```

### QueryClientProvider を設定

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

// QueryClient を作成
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

**コード解説:**

```tsx
const queryClient = new QueryClient();
```

- キャッシュやクエリの設定を管理するオブジェクト

```tsx
<QueryClientProvider client={queryClient}>
```

- アプリ全体をラップして、React Query を使えるようにする

---

## 2. useQuery で商品一覧を取得

### API 関数を作成

```tsx
// src/api/products.ts
const API_URL = "https://dummyjson.com/products";

export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("商品の取得に失敗しました");
  }

  const data = await response.json();
  return data.products;
}
```

### 商品一覧コンポーネント

```tsx
// src/components/ProductList.tsx
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, Product } from "../api/products";
import useCartStore from "../stores/useCartStore";

function ProductList() {
  // useQuery でデータを取得
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // カートに追加するアクション
  const addItem = useCartStore((state) => state.addItem);

  // ローディング中
  if (isLoading) {
    return <p>商品を読み込み中...</p>;
  }

  // エラー発生時
  if (error) {
    return <p>エラー: {error.message}</p>;
  }

  // 商品一覧を表示
  return (
    <div className="product-grid">
      {products?.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.thumbnail} alt={product.title} />
          <h3>{product.title}</h3>
          <p>${product.price}</p>
          <button onClick={() => addItem(product)}>カートに追加</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
```

**コード解説:**

```tsx
const {
  data: products,
  isLoading,
  error,
} = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});
```

| プロパティ  | 説明                       |
| ----------- | -------------------------- |
| `queryKey`  | キャッシュを識別するキー   |
| `queryFn`   | データを取得する関数       |
| `data`      | 取得したデータ             |
| `isLoading` | 初回ローディング中かどうか |
| `error`     | エラーオブジェクト         |

---

## 3. ローディングとエラーの UI を改善

### ローディングスピナーコンポーネント

```tsx
// src/components/Loading.tsx
function Loading() {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>読み込み中...</p>
    </div>
  );
}

export default Loading;
```

### エラーコンポーネント

```tsx
// src/components/Error.tsx
type ErrorProps = {
  message: string;
};

function Error({ message }: ErrorProps) {
  return (
    <div className="error">
      <p>⚠️ エラーが発生しました</p>
      <p>{message}</p>
    </div>
  );
}

export default Error;
```

### ProductList を更新

```tsx
// src/components/ProductList.tsx
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, Product } from "../api/products";
import useCartStore from "../stores/useCartStore";
import Loading from "./Loading";
import ErrorComponent from "./Error";

function ProductList() {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent message={error.message} />;

  return (
    <div className="product-grid">
      {products?.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.thumbnail} alt={product.title} />
          <h3>{product.title}</h3>
          <p>${product.price}</p>
          <button onClick={() => addItem(product)}>カートに追加</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
```

---

## 4. カテゴリでフィルター（queryKey の活用）

`queryKey` にパラメータを含めると、パラメータが変わったときに自動で再取得されます。

### API 関数を拡張

```tsx
// src/api/products.js
const API_URL = "https://dummyjson.com/products";

export async function fetchProducts(
  category: string | null = null
): Promise<Product[]> {
  let url = API_URL;

  // カテゴリが指定されていれば、カテゴリ別のURLを使う
  if (category) {
    url = `${API_URL}/category/${category}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("商品の取得に失敗しました");
  }

  const data = await response.json();
  return data.products;
}

// カテゴリ一覧を取得
export type Category = {
  slug: string,
  name: string,
  url: string,
};

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("カテゴリの取得に失敗しました");
  }

  return response.json();
}
```

### カテゴリフィルター付き商品一覧

```tsx
// src/components/ProductList.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchCategories,
  Product,
  Category,
} from "../api/products";
import useCartStore from "../stores/useCartStore";
import Loading from "./Loading";
import ErrorComponent from "./Error";

function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // カテゴリ一覧を取得
  const { data: categories } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // 商品一覧を取得（カテゴリをキーに含める）
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products", selectedCategory], // ← カテゴリをキーに含める
    queryFn: () => fetchProducts(selectedCategory),
  });

  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent message={error.message} />;

  return (
    <div>
      {/* カテゴリ選択 */}
      <div className="category-filter">
        <label>カテゴリ: </label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
        >
          <option value="">すべて</option>
          {categories?.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 商品一覧 */}
      <div className="product-grid">
        {products?.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.thumbnail} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <button onClick={() => addItem(product)}>カートに追加</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
```

**コード解説:**

```tsx
queryKey: ['products', selectedCategory],
```

- `selectedCategory` が変わると、**自動的に新しいデータを取得**
- 例: `['products', null]` → `['products', 'smartphones']`

```tsx
queryFn: () => fetchProducts(selectedCategory),
```

- アロー関数でラップして、引数を渡す

---

## 5. App.jsx を更新

Session 1 で作った仮データを削除し、API から取得した商品を表示します。

```tsx
// src/App.tsx
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
  return (
    <div className="app">
      <h1>🛍️ Shop Catalog</h1>

      {/* 商品一覧（APIから取得） */}
      <section className="products">
        <h2>商品一覧</h2>
        <ProductList />
      </section>

      {/* カート（Session 1で作成） */}
      <Cart />
    </div>
  );
}

export default App;
```

---

## 6. スタイルを追加

```css
/* src/index.css に追加 */

/* カテゴリフィルター */
.category-filter {
  margin-bottom: 20px;
}

.category-filter select {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 商品画像 */
.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 12px;
}

/* ローディング */
.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066ff;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* エラー */
.error {
  background: #fee;
  color: #c00;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
```

---

## まとめ

| 概念        | 説明                                                       |
| ----------- | ---------------------------------------------------------- |
| `useQuery`  | データを取得するフック                                     |
| `queryKey`  | キャッシュを識別するキー（パラメータを含めると自動再取得） |
| `queryFn`   | データ取得関数                                             |
| `isLoading` | 初回ローディング中                                         |
| `error`     | エラーオブジェクト                                         |

### 作成したもの

- ✅ API から商品一覧を取得
- ✅ ローディング・エラー表示
- ✅ カテゴリフィルター
- ✅ Zustand カートとの連携

### Zustand と React Query の使い分け

| ライブラリ      | 担当する状態                           |
| --------------- | -------------------------------------- |
| **Zustand**     | クライアント状態（カート、UI の状態）  |
| **React Query** | サーバー状態（API から取得したデータ） |

---

## 完成！🎉

これで商品カタログアプリが完成しました！

```
src/
├── api/
│   └── products.ts         ← API関数
├── stores/
│   └── useCartStore.ts     ← カート状態（Zustand）
├── components/
│   ├── ProductList.tsx     ← 商品一覧（React Query）
│   ├── Cart.tsx            ← カート表示
│   ├── CartItem.tsx
│   ├── Loading.tsx
│   └── Error.tsx
├── App.tsx
├── main.tsx
└── index.css
```

### 次のステップ

- 商品検索機能の追加
- ページネーション / 無限スクロール
- カートの永続化（`persist` ミドルウェア）
- 楽観的更新
