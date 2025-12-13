# Session 4: Pure Components と State Update Batching

## 学習目標

このセッションでは、React コンポーネントが「純粋」であるべき理由と、State 更新がどのようにバッチ処理（一括処理）されるかを学びます。

- **Render Logic** と **Event Handler Logic** の違い
- **純粋関数**とサイドエフェクト
- なぜコンポーネントは純粋であるべきか
- **State 更新のバッチ処理**（React 18 の改善点を含む）
- **Stale State** の問題とコールバックによる解決

## 2種類のロジック

React コンポーネント内のコードは、大きく2種類に分けられます。

### Render Logic（レンダーロジック）

コンポーネント関数の**トップレベル**にあり、ビューの記述に関与するコードです。

```jsx
function Product({ name, price }) {
  // これはすべて Render Logic
  const discountedPrice = price * 0.9;
  const formattedPrice = `¥${discountedPrice.toFixed(0)}`;
  
  return (
    <div>
      <h2>{name}</h2>
      <p>{formattedPrice}</p>
    </div>
  );
}
```

### Event Handler Logic（イベントハンドラーロジック）

ユーザー操作などのイベントに応じて実行されるコードです。

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // これは Event Handler Logic
  function handleClick() {
    setCount(count + 1);
    console.log('Clicked!');
  }
  
  return <button onClick={handleClick}>{count}</button>;
}
```

**Event Handler** は「何かを起こす」コードです（State 更新、API 呼び出し、ナビゲーションなど）。

## 純粋関数とサイドエフェクト

### サイドエフェクトとは

関数が**外部世界とやり取り**すること、または**外部データを変更**することです。

```javascript
// ❌ サイドエフェクトあり：外部変数を変更
let total = 0;
function addToTotal(value) {
  total += value; // 外部変数を変更
}

// ❌ サイドエフェクトあり：外部リソースにアクセス
function logTime() {
  console.log(new Date()); // 毎回異なる結果
}
```

### 純粋関数とは

- 同じ入力には**常に同じ出力**を返す
- **サイドエフェクトがない**（外部を変更しない）

```javascript
// ✅ 純粋関数
function calculateArea(radius) {
  return Math.PI * radius * radius;
}
// radius = 5 なら常に同じ結果が返る
```

## コンポーネントが純粋であるべき理由

> **React のルール**: Render Logic は純粋でなければなりません。

### 禁止事項（Render Logic 内で）

1. **ネットワークリクエスト**を行わない
2. **タイマー** を設定しない
3. **DOM API** を直接操作しない
4. **外部の変数やオブジェクト** を変更しない
5. **State や Ref を更新しない**（無限ループになる！）

```jsx
// ❌ 悪い例
function BadComponent({ items }) {
  items.push('new item'); // Props を変更 → NG
  document.title = 'Hello'; // DOM を直接操作 → NG
  
  return <div>{items.length}</div>;
}
```

### サイドエフェクトはどこで行うか

1. **Event Handler** 内（推奨）
2. **`useEffect`** 内（コンポーネントマウント時など）

```jsx
// ✅ サイドエフェクトは Event Handler 内で
function GoodComponent() {
  function handleClick() {
    fetch('/api/data'); // ここならOK
  }
  
  return <button onClick={handleClick}>Load</button>;
}
```

## State Update Batching（バッチ処理）

### バッチ処理とは

複数の State 更新が**1回の再レンダリングにまとめられる**仕組みです。

```jsx
function handleReset() {
  setAnswer('');
  setBest('');
  setSolved(false);
  // React はこれらを「バッチ」し、1回だけ再レンダリングする
}
```

これにより：
- 無駄な再レンダリングが**減少**
- パフォーマンスが**向上**

### State 更新は非同期

```jsx
function handleReset() {
  setLikes(0);
  console.log(likes); // ⚠️ まだ古い値！（例: 5）
}
```

`setLikes(0)` を呼んでも、`likes` は**次のレンダリングまで更新されません**。

> これを **Stale State（古い State）** と呼びます。

### 問題例：同じ State を複数回更新

```jsx
function handleTripleClick() {
  setLikes(likes + 1);
  setLikes(likes + 1);
  setLikes(likes + 1);
  // 期待: 3 増加 → 実際: 1 しか増加しない！
}
```

なぜ？ → すべての行で `likes` は**同じ古い値**だからです。

### 解決策：コールバック関数を使う

```jsx
function handleTripleClick() {
  setLikes(prev => prev + 1);
  setLikes(prev => prev + 1);
  setLikes(prev => prev + 1);
  // ✅ 正しく 3 増加する
}
```

コールバック関数を使うと、**最新の State 値**を受け取れます。

> **ベストプラクティス**: State を前の値に基づいて更新する場合は、**常にコールバック関数を使う**。

### React 18 での改善

React 17 以前では、バッチ処理は**Event Handler 内のみ**で行われました。

`setTimeout` や Promise の `.then()` 内では、各 `setState` が**個別の再レンダリング**を引き起こしていました。

React 18 からは、**どこでも自動バッチ処理**が適用されます。

```jsx
// React 18: これも1回の再レンダリングにバッチされる
setTimeout(() => {
  setA(1);
  setB(2);
  setC(3);
}, 1000);
```

## まとめ

| 項目 | ポイント |
|------|----------|
| **Render Logic** | 純粋であるべき。サイドエフェクト禁止。 |
| **Event Handler** | サイドエフェクトはここで行う。 |
| **State 更新** | 非同期で処理される。即座には反映されない。 |
| **バッチ処理** | 複数の更新が1回の再レンダリングにまとめられる。 |
| **コールバック** | 前の State に基づく更新には `prev => ...` を使う。 |

次のセッションでは、イベント処理の仕組みと React エコシステムについて学びます。
