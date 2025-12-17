# Session 2: useRef フック

## はじめに：再レンダリングを引き起こさない値の保持

前のセッションで学んだ `useEffect` は副作用を扱うためのフックでした。このセッションでは、`useRef` という別の種類のフックを学びます。

`useRef` の主な用途は以下の2つです:

1. **DOM要素への直接アクセス**（フォーカス、スクロール位置など）
2. **再レンダリングを引き起こさない値の保持**（タイマーID、前回の値など）

まずは、`useState` との違いを理解することから始めましょう。

---

## 1. useRef と useState の違い

### useState の特徴:

```jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1); // State を更新
  // → コンポーネントが再レンダリングされる
}
```

- State が変化すると**コンポーネントが再レンダリング**される
- UIに表示する値を管理するのに適している

### useRef の特徴:

```jsx
const countRef = useRef(0);

function handleClick() {
  countRef.current += 1; // ref を更新
  // → 再レンダリングは発生しない
  console.log(countRef.current); // 値は更新されている
}
```

- ref の値が変化しても**再レンダリングは発生しない**
- レンダリング間で値を保持したいが、UIには表示しない値を管理するのに適している

---

## 2. useRef の基本構文

```jsx
import { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(initialValue);
  
  // myRef.current で値にアクセス
  console.log(myRef.current);
  
  // 値を更新
  myRef.current = newValue;
  
  return <div>Hello, useRef!</div>;
}
```

### 重要なポイント:

- `useRef` は **`{ current: initialValue }`** というオブジェクトを返す
- 値にアクセスするには `myRef.current` を使う
- `myRef.current` を更新しても再レンダリングは発生しない
- ref オブジェクト自体はレンダリング間で同じものが維持される

---

## 3. 実践例1: DOM要素へのアクセス

最も一般的な使用例は、DOM要素に直接アクセスすることです。

### フォーカスの制御

```jsx
import { useRef, useEffect } from 'react';

function SearchInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // コンポーネントがマウントされたら入力欄にフォーカス
    inputRef.current.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="検索..."
    />
  );
}
```

**動作の流れ:**

1. `useRef(null)` で ref を作成
2. JSXの `ref` 属性に渡す → React が自動的に `inputRef.current` に DOM要素を設定
3. `useEffect` 内で `inputRef.current.focus()` を呼び出してフォーカス

### スクロール位置の制御

```jsx
function ScrollToBottom() {
  const bottomRef = useRef(null);

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <button onClick={scrollToBottom}>一番下へスクロール</button>
      <div style={{ height: '200vh' }}>
        {/* 長いコンテンツ */}
        <div ref={bottomRef}>ここが一番下</div>
      </div>
    </div>
  );
}
```

---

## 4. 実践例2: 前回の値を記憶する

State の前回の値を保持したい場合に `useRef` が役立ちます。

```jsx
import { useState, useRef, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    // レンダリング後に前回の値を保存
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>現在のカウント: {count}</p>
      <p>前回のカウント: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>カウントアップ</button>
    </div>
  );
}
```

**動作の流れ:**

1. 初回レンダリング: `count = 0`, `prevCountRef.current = undefined`
2. ボタンをクリック: `count = 1` に更新 → 再レンダリング
3. レンダリング後に `useEffect` が実行され、`prevCountRef.current = 1` に設定
4. 次のクリック時: `count = 2`, `prevCountRef.current = 1` と表示される

---

## 5. 実践例3: タイマーIDの保持

タイマーを開始・停止する場合、タイマーIDを保持する必要があります。

```jsx
import { useState, useRef } from 'react';

function Stopwatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  function start() {
    if (intervalRef.current !== null) return; // 既に実行中なら何もしない
    
    intervalRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function reset() {
    stop();
    setTime(0);
  }

  return (
    <div>
      <p>経過時間: {time}秒</p>
      <button onClick={start}>スタート</button>
      <button onClick={stop}>ストップ</button>
      <button onClick={reset}>リセット</button>
    </div>
  );
}
```

**なぜ useState ではダメなのか？**

もし `intervalRef` を State にすると:
- タイマーIDを更新するたびに再レンダリングが発生
- 1秒ごとに2回の再レンダリング（`time` と `intervalId` の更新）が起こる
- 無駄なレンダリングでパフォーマンス低下

`useRef` を使えば、タイマーIDの更新では再レンダリングが起こらず、効率的です。

---

## 6. 実践例4: イベントハンドラで最新の値を参照する

```jsx
function Chat() {
  const [message, setMessage] = useState('');
  const latestMessageRef = useRef('');

  useEffect(() => {
    latestMessageRef.current = message;
  }, [message]);

  useEffect(() => {
    // 10秒後にメッセージを送信するタイマーを設定
    const timer = setTimeout(() => {
      console.log('送信:', latestMessageRef.current);
    }, 10000);

    return () => clearTimeout(timer);
  }, []); // 初回のみ実行

  return (
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="メッセージを入力..."
    />
  );
}
```

**ポイント:**
- `useEffect` の依存配列が `[]` なので、タイマーは初回のみ設定される
- しかし `latestMessageRef.current` は常に最新の `message` を参照できる
- これにより、古いクロージャの値を参照する問題を回避できる

---

## 7. よくある使用パターン

### パターン1: アンマウントされたコンポーネントでの State 更新を防ぐ

```jsx
function DataFetcher() {
  const [data, setData] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/data');
      const result = await response.json();
      
      // マウントされている場合のみ State を更新
      if (isMountedRef.current) {
        setData(result);
      }
    }

    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return <div>{data ? data.title : '読み込み中...'}</div>;
}
```

### パターン2: カスタムフックでの活用

```jsx
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// 使用例
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>現在: {count}, 前回: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

---

## 8. useRef 使用時の注意点

### ❌ 間違い1: レンダリング中に ref.current を更新

```jsx
function BadComponent() {
  const countRef = useRef(0);
  
  // ❌ レンダリング中に更新してはいけない
  countRef.current += 1;
  
  return <div>レンダリング回数: {countRef.current}</div>;
}
```

**問題点:** レンダリングは純粋であるべき。副作用はイベントハンドラや `useEffect` 内で行う。

**解決策:**

```jsx
function GoodComponent() {
  const countRef = useRef(0);
  
  useEffect(() => {
    countRef.current += 1;
  });
  
  return <div>レンダリング回数: {countRef.current}</div>;
}
```

### ❌ 間違い2: ref の変更を依存配列に含める

```jsx
function BadExample() {
  const countRef = useRef(0);
  
  useEffect(() => {
    console.log('実行されます');
  }, [countRef.current]); // ❌ 意味がない
}
```

**問題点:** ref が変更されても再レンダリングされないため、エフェクトは再実行されない。

---

## 9. useState vs useRef: いつどちらを使うか？

| 条件 | 使うべきもの |
|------|------------|
| UIに表示する値 | `useState` |
| 値の変更で再レンダリングが必要 | `useState` |
| DOM要素にアクセスしたい | `useRef` |
| タイマーID、インターバルIDを保持 | `useRef` |
| 前回の値を記憶したい | `useRef` |
| 再レンダリングを避けたい | `useRef` |

---

## 10. まとめ

`useRef` は、再レンダリングを引き起こさずに値を保持するための強力なツールです。

### 覚えておくべきポイント:

- **useRef の返り値**: `{ current: initialValue }` オブジェクト
- **主な用途**:
  1. DOM要素への直接アクセス
  2. 再レンダリングを引き起こさない値の保持
- **useStateとの違い**:
  - useState: 値の変更で再レンダリング発生
  - useRef: 値の変更で再レンダリングなし
- **注意点**:
  - レンダリング中に `ref.current` を更新しない
  - `ref.current` を依存配列に含めない

次のセッションでは、`useContext` について学びます。コンポーネント間でデータを共有する新しい方法を見ていきましょう！
