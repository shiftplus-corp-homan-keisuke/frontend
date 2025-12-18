# Session 1: useEffect フック

## はじめに：副作用とは何か?

これまで学んできた `useState` は、コンポーネント内部の「状態」を管理するための仕組みでした。しかし、実際のアプリケーション開発では、状態を管理するだけでは不十分です。

例えば、以下のような場面を考えてみてください:

- **データの取得**: サーバーから映画のリストを取得したい
- **タイマー**: 一定時間後に何かを実行したい
- **ブラウザAPIとの連携**: ローカルストレージにデータを保存したい
- **イベントリスナー**: キーボード入力を監視したい

これらはReactの「レンダリング」の流れとは別に行われる処理で、**副作用（Side Effects）** と呼ばれます。`useEffect` は、こうした副作用を安全に、かつReactのライフサイクルに沿って実行するためのフックです。

---

## 1. useEffect の基本構文

`useEffect` の基本的な形は以下の通りです:

```jsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // ここに副作用のコードを書く
    console.log('コンポーネントがレンダリングされました！');
  });

  return <div>Hello, useEffect!</div>;
}
```

### 重要なポイント:

1. **第1引数**: 実行したい副作用の関数（エフェクト関数）
2. この関数は、**コンポーネントがレンダリングされるたびに実行されます**

---

## 2. 依存配列：いつエフェクトを実行するか制御する

毎回レンダリングのたびに実行されるのは非効率な場合があります。そこで、**依存配列（dependency array）** を使って、エフェクトの実行タイミングを制御できます。

### パターン1: 毎回実行（依存配列なし）

```jsx
useEffect(() => {
  console.log('毎回実行される');
});
```

### パターン2: 初回のみ実行（空の依存配列）

```jsx
useEffect(() => {
  console.log('初回レンダリング時のみ実行される');
}, []); // 空の配列 = 依存するものが何もない
```

**よくある使用例:**
- APIからデータを取得
- イベントリスナーの登録
- 初期化処理

### パターン3: 特定の値が変化したときのみ実行

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(`count が ${count} に変化しました`);
}, [count]); // count が変化したときのみ実行
```

---

## 3. 実践例1: データフェッチング

ユーザー情報をAPIから取得する例を見てみましょう。（無料で使える JSONPlaceholder API を使用）

```jsx
import { useState, useEffect } from 'react';

function UserSearch() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // 検索クエリが空の場合は何もしない
    if (query.length < 2) return;

    async function fetchUsers() {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      const data = await response.json();
      
      // クライアント側でフィルタリング
      const filtered = data.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filtered);
    }

    fetchUsers();
  }, [query]); // query が変化したときに再度フェッチ

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ユーザーを検索..."
      />
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 動作の流れ:

1. ユーザーが入力フィールドに文字を入力
2. `query` State が更新される
3. `useEffect` の依存配列に `query` があるため、エフェクトが実行される
4. JSONPlaceholder API からデータを取得し、検索クエリでフィルタリング
5. `users` State を更新してUIに表示

---

## 4. クリーンアップ関数：後片付けをする

副作用の中には、「後片付け」が必要なものがあります。例えば:

- タイマーの停止
- イベントリスナーの解除
- ネットワークリクエストのキャンセル

クリーンアップ関数は、エフェクト関数から **関数を return** することで定義します。

### 実践例2: タイマー

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // タイマーを開始
    const intervalId = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // クリーンアップ関数
    return () => {
      clearInterval(intervalId); // タイマーを停止
      console.log('タイマーがクリーンアップされました');
    };
  }, []); // 初回のみ実行

  return <div>経過時間: {seconds}秒</div>;
}
```

### クリーンアップのタイミング:

- コンポーネントがアンマウント（画面から消える）されるとき
- エフェクトが再実行される前（依存配列の値が変化したとき）

---

## 5. 実践例3: イベントリスナー

キーボードの Escape キーを監視する例:

```jsx
function Modal({ onClose }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    // イベントリスナーを追加
    document.addEventListener('keydown', handleEscape);

    // クリーンアップでイベントリスナーを削除
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]); // onClose が変化したら再設定

  return <div className="modal">モーダルウィンドウ（Escで閉じる）</div>;
}
```

**重要:** イベントリスナーを追加したら、必ずクリーンアップで削除してください。そうしないと、メモリリークの原因になります。

---

## 6. よくある間違いと解決策

### ❌ 間違い1: 依存配列の指定忘れ

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count);
}); // 依存配列を忘れている！
```

**問題点:** 毎回レンダリングされるたびに実行され、パフォーマンスに悪影響。

**解決策:** 依存配列を明示する:

```jsx
useEffect(() => {
  console.log(count);
}, [count]); // count が変化したときのみ実行
```

### ❌ 間違い2: 依存配列に必要な値を含めない

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults(query).then(setResults);
  }, []); // query が依存配列に含まれていない！
}
```

**問題点:** `query` が変化してもエフェクトが再実行されず、古いデータが表示される。

**解決策:** 使用している全ての値を依存配列に含める:

```jsx
useEffect(() => {
  fetchResults(query).then(setResults);
}, [query]); // query を含める
```

### ❌ 間違い3: エフェクト内で State を直接更新する無限ループ

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(count + 1); // 無限ループ！
}, [count]);
```

**問題点:** `count` が更新 → エフェクト実行 → `count` が更新 → ... の無限ループ。

**解決策:** 依存配列を見直すか、関数型の更新を使用:

```jsx
useEffect(() => {
  setCount((c) => c + 1);
}, []); // 初回のみ実行
```

---

## 7. useEffect のルール

1. **Reactコンポーネントのトップレベルで呼び出す**
   - 条件分岐やループの中で呼び出さない

2. **依存配列には、エフェクト内で使用する全ての値を含める**
   - ESLint の `react-hooks/exhaustive-deps` ルールを有効にすると自動チェックできます

3. **非同期関数を直接渡さない**

```jsx
// ❌ 間違い
useEffect(async () => {
  const data = await fetchData();
}, []);

// ✅ 正しい
useEffect(() => {
  async function loadData() {
    const data = await fetchData();
  }
  loadData();
}, []);
```

---

## 8. まとめ

`useEffect` は、React コンポーネントで副作用を扱うための強力なツールです。

### 覚えておくべきポイント:

- **副作用**: レンダリングとは別に行われる処理（データ取得、タイマー、イベントリスナーなど）
- **依存配列**: エフェクトの実行タイミングを制御
  - なし → 毎回実行
  - `[]` → 初回のみ
  - `[value]` → value が変化したときのみ
- **クリーンアップ関数**: 後片付けが必要な処理には必ず設定
- **ルールを守る**: トップレベルで呼び出し、依存配列を正しく指定

次のセッションでは、`useRef` について学びます。`useEffect` とは異なるアプローチで、レンダリングを発生させずに値を保持する方法を見ていきましょう！
