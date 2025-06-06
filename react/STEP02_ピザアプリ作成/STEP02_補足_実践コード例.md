# STEP02 補足資料：実践コード例

このドキュメントでは、STEP02 で学習した「コンポーネント型設計とプロップの受け渡し」に関する実践的なコード例を、基礎から応用まで段階的に示します。

## 📚 目次

- [Level 1: 基礎実装 - シンプルなコンポーネントと Props](#level-1-基礎実装---シンプルなコンポーネントとprops)
- [Level 2: 型安全な実装 - Props の型定義と分割代入](#level-2-型安全な実装---propsの型定義と分割代入)
- [Level 3: 実践的実装 - 条件付きレンダリングと動的クラス](#level-3-実践的実装---条件付きレンダリングと動的クラス)
- [Level 4: 高度な実装 - 複雑なオブジェクトの Props とリストレンダリング](#level-4-高度な実装---複雑なオブジェクトのpropsとリストレンダリング)

---

### Level 1: 基礎実装 - シンプルなコンポーネントと Props

基本的な関数コンポーネントを作成し、親から子へ文字列の `props` を渡す例です。

**`src/components/Greeting.tsx`**

```typescript
// 💡 基本的な実装例
import React from "react";

// propsの型定義はまだ行わない
const Greeting = (props: any) => {
  // 型はanyで仮置き
  return (
    <div>
      <h2>こんにちは、{props.name}さん！</h2>
      <p>{props.message}</p>
    </div>
  );
};

export default Greeting;
```

**`src/App.tsx`**

```typescript
// 💡 基本的な実装例
import React from "react";
import Greeting from "./components/Greeting";

function App() {
  return (
    <div>
      <h1>React Propsの基礎</h1>
      <Greeting name="太郎" message="お元気ですか？" />
      <Greeting name="花子" message="良い一日を！" />
    </div>
  );
}

export default App;
```

### Level 2: 型安全な実装 - Props の型定義と分割代入

`interface` を使って `props` の型を厳密に定義し、分割代入で `props` を受け取ることで、コードの可読性と安全性を高めます。

**`src/components/UserCard.tsx`**

```typescript
// 🎯 型安全性を高めた実装
import React from "react";

// UserCardコンポーネントが受け取るpropsの型を定義
interface UserCardProps {
  userName: string;
  age: number;
  isActive?: boolean; // オプショナルなプロパティ
}

const UserCard: React.FC<UserCardProps> = ({
  userName,
  age,
  isActive = true,
}) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h3>名前: {userName}</h3>
      <p>年齢: {age}歳</p>
      <p>ステータス: {isActive ? "アクティブ" : "非アクティブ"}</p>
    </div>
  );
};

export default UserCard;
```

**`src/App.tsx`**

```typescript
// 🎯 型安全性を高めた実装
import React from "react";
import UserCard from "./components/UserCard";

function App() {
  return (
    <div>
      <h1>型安全なPropsの例</h1>
      <UserCard userName="山田" age={30} isActive={true} />
      <UserCard userName="佐藤" age={25} />{" "}
      {/* isActiveはデフォルト値が適用される */}
      <UserCard userName="田中" age={40} isActive={false} />
    </div>
  );
}

export default App;
```

### Level 3: 実践的実装 - 条件付きレンダリングと動的クラス

`props` の値や内部の状態に基づいて、要素の表示/非表示を切り替えたり、動的に CSS クラスを適用したりする例です。

**`src/components/StatusMessage.tsx`**

```typescript
// 🚀 実務レベルの実装
import React from "react";
import "./StatusMessage.css"; // CSS Modulesを使用する場合

interface StatusMessageProps {
  status: "success" | "error" | "info"; // 特定の文字列リテラル型
  message: string;
  isVisible: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  status,
  message,
  isVisible,
}) => {
  if (!isVisible) {
    return null; // isVisibleがfalseなら何もレンダリングしない
  }

  // 動的にクラス名を生成
  const messageClassName = `status-message ${status}`;

  return (
    <div className={messageClassName}>
      <p>{message}</p>
      {status === "error" && <p>エラーが発生しました。</p>} {/* 論理AND演算子 */}
    </div>
  );
};

export default StatusMessage;
```

**`src/components/StatusMessage.css`** (CSS Modules の例)

```css
/* src/components/StatusMessage.css */
.status-message {
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  font-weight: bold;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
```

**`src/App.tsx`**

```typescript
// 🚀 実務レベルの実装
import React, { useState } from "react";
import StatusMessage from "./components/StatusMessage";

function App() {
  const [showSuccess, setShowSuccess] = useState(true);
  const [showError, setShowError] = useState(false);

  return (
    <div>
      <h1>条件付きレンダリングの例</h1>
      <button onClick={() => setShowSuccess(!showSuccess)}>
        {showSuccess ? "成功メッセージを非表示" : "成功メッセージを表示"}
      </button>
      <button onClick={() => setShowError(!showError)}>
        {showError ? "エラーメッセージを非表示" : "エラーメッセージを表示"}
      </button>

      <StatusMessage
        status="success"
        message="操作が正常に完了しました！"
        isVisible={showSuccess}
      />
      <StatusMessage
        status="error"
        message="データの読み込みに失敗しました。"
        isVisible={showError}
      />
      <StatusMessage
        status="info"
        message="情報を確認してください。"
        isVisible={true}
      />
    </div>
  );
}

export default App;
```

### Level 4: 高度な実装 - 複雑なオブジェクトの Props とリストレンダリング

オブジェクトの配列を `props` として渡し、`map` メソッドを使ってリストをレンダリングする例です。`key` プロップの重要性も示します。

**`src/data/products.ts`**

```typescript
// ⚡ 高度な実装
export interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

export const products: Product[] = [
  { id: 1, name: "Laptop", price: 1200, inStock: true },
  { id: 2, name: "Mouse", price: 25, inStock: true },
  { id: 3, name: "Keyboard", price: 75, inStock: false },
  { id: 4, name: "Monitor", price: 300, inStock: true },
];
```

**`src/components/ProductItem.tsx`**

```typescript
// ⚡ 高度な実装
import React from "react";
import { Product } from "../data/products";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const itemClassName = product.inStock
    ? "product-item"
    : "product-item out-of-stock";

  return (
    <li className={itemClassName}>
      <h4>{product.name}</h4>
      <p>価格: ${product.price}</p>
      <span>{product.inStock ? "在庫あり" : "在庫切れ"}</span>
    </li>
  );
};

export default ProductItem;
```

**`src/components/ProductList.tsx`**

```typescript
// ⚡ 高度な実装
import React from "react";
import ProductItem from "./ProductItem";
import { products } from "../data/products"; // データをインポート

const ProductList: React.FC = () => {
  const hasProducts = products.length > 0;

  return (
    <div style={{ border: "1px solid #eee", padding: "20px", margin: "20px" }}>
      <h2>商品リスト</h2>
      {hasProducts ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </ul>
      ) : (
        <p>現在、商品はありません。</p>
      )}
    </div>
  );
};

export default ProductList;
```

**`src/App.tsx`**

```typescript
// ⚡ 高度な実装
import React from "react";
import ProductList from "./components/ProductList";

function App() {
  return (
    <div>
      <h1>商品管理アプリケーション</h1>
      <ProductList />
    </div>
  );
}

export default App;
```
