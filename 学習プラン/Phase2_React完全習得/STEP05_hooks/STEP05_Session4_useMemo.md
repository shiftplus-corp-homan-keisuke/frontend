# Session 4: useMemo フック

## はじめに：パフォーマンス最適化の必要性

これまで学んできた Hooks は、React アプリケーションの機能を実装するためのものでした。このセッションで学ぶ `useMemo` は、**パフォーマンスの最適化**を目的としたフックです。

しかし、重要な原則があります:

> **「まず動くものを作り、必要になってから最適化する」**

`useMemo` は便利ですが、使いすぎると逆にコードが複雑になり、メンテナンスが困難になります。このセッションでは、「いつ使うべきか」「いつ使わないべきか」をしっかり理解しましょう。

---

## 1. メモ化とは？

**メモ化（Memoization）** とは、計算結果をキャッシュして、同じ入力に対しては保存された結果を再利用する技術です。

### 例: メモ化なし

```jsx
function expensiveCalculation(num) {
  console.log('計算実行中...');
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += num;
  }
  return result;
}

function MyComponent({ number }) {
  // コンポーネントが再レンダリングされるたびに計算が実行される
  const result = expensiveCalculation(number);
  
  return <div>結果: {result}</div>;
}
```

**問題点:** `number` が変わっていなくても、コンポーネントが再レンダリングされるたびに重い計算が実行されます。

---

## 2. useMemo の基本構文

`useMemo` を使うと、計算結果をキャッシュできます。

```jsx
import { useMemo } from 'react';

function MyComponent({ number }) {
  const result = useMemo(() => {
    console.log('計算実行中...');
    return expensiveCalculation(number);
  }, [number]); // number が変わったときのみ再計算
  
  return <div>結果: {result}</div>;
}
```

### 構文:

```jsx
const cachedValue = useMemo(() => {
  // 重い計算
  return computedValue;
}, [dependencies]);
```

- **第1引数**: 計算を行う関数（戻り値がキャッシュされる）
- **第2引数**: 依存配列（これらの値が変わったときのみ再計算）
- **戻り値**: 計算結果（キャッシュされた値）

---

## 3. useMemo と useEffect の違い

初学者が混乱しやすいポイントなので、明確にしておきましょう。

| | useMemo | useEffect |
|---|---------|-----------|
| **目的** | 値の計算とキャッシュ | 副作用の実行 |
| **戻り値** | 計算結果を返す | 何も返さない（またはクリーンアップ関数） |
| **実行タイミング** | レンダリング中 | レンダリング後 |
| **使用例** | フィルタリング、ソート、計算 | データ取得、イベントリスナー登録 |

```jsx
// useMemo: 値を計算して返す
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.price - b.price);
}, [items]);

// useEffect: 副作用を実行する
useEffect(() => {
  document.title = `${items.length} 個のアイテム`;
}, [items]);
```

---

## 4. 実践例1: 配列のフィルタリング

映画リストから検索結果をフィルタリングする例:

```jsx
import { useState, useMemo } from 'react';

function MovieList({ movies }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');

  // メモ化: 検索クエリとソート条件が変わったときのみ再計算
  const filteredAndSortedMovies = useMemo(() => {
    console.log('フィルタリング＆ソート実行中...');
    
    let result = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'year') return b.year - a.year;
      return 0;
    });
    
    return result;
  }, [movies, searchQuery, sortBy]);

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="映画を検索..."
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="title">タイトル順</option>
        <option value="year">年代順</option>
      </select>
      
      <ul>
        {filteredAndSortedMovies.map(movie => (
          <li key={movie.id}>{movie.title} ({movie.year})</li>
        ))}
      </ul>
    </div>
  );
}
```

### なぜ useMemo が必要か？

- `movies` の配列が大きい（数千件）場合、フィルタリングとソートは重い処理
- `useMemo` なしだと、親コンポーネントが再レンダリングされるたびに実行される
- `useMemo` ありだと、`movies`、`searchQuery`、`sortBy` が変わったときだけ実行される

---

## 5. 実践例2: オブジェクトの参照を安定させる

子コンポーネントに渡すオブジェクトの参照を安定させることで、不要な再レンダリングを防げます。

```jsx
import { useMemo } from 'react';
import { memo } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('太郎');

  // ❌ 毎回新しいオブジェクトが作られる
  // const config = { theme: 'dark', name: name };
  
  // ✅ name が変わったときのみ新しいオブジェクトを作る
  const config = useMemo(() => {
    return { theme: 'dark', name: name };
  }, [name]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        カウント: {count}
      </button>
      <Child config={config} />
    </div>
  );
}

// memo でラップすると、Props が変わらない限り再レンダリングされない
const Child = memo(function Child({ config }) {
  console.log('Child がレンダリングされました');
  return <div>テーマ: {config.theme}, 名前: {config.name}</div>;
});
```

**動作:**
- カウントボタンをクリックしても、`config` の参照は変わらない
- `Child` コンポーネントは再レンダリングされない
- `name` が変わったときだけ `Child` が再レンダリングされる

---

## 6. useCallback との違い

`useMemo` に似たフックとして `useCallback` があります。違いを理解しましょう。

### useMemo: 値をメモ化

```jsx
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a - b);
}, [items]);
```

### useCallback: 関数をメモ化

```jsx
const handleClick = useCallback(() => {
  console.log('クリック');
}, []);
```

**実は、useCallback は useMemo の特殊版:**

```jsx
// これらは同じ
const handleClick = useCallback(() => { ... }, []);
const handleClick = useMemo(() => () => { ... }, []);
```

---

## 7. いつ useMemo を使うべきか？

### ✅ useMemo を使うべき場面

1. **重い計算がある**
   - 大量のデータのフィルタリング、ソート
   - 複雑な数値計算

2. **参照の安定性が必要**
   - `memo` でラップされた子コンポーネントに渡すオブジェクトや配列
   - `useEffect` の依存配列に含まれるオブジェクト

3. **パフォーマンスのボトルネックを測定した後**
   - React DevTools の Profiler で問題を特定してから使う

### ❌ useMemo を使わないべき場面

1. **簡単な計算**
```jsx
// ❌ 不要
const total = useMemo(() => a + b, [a, b]);

// ✅ これで十分
const total = a + b;
```

2. **計算コストが小さい**
```jsx
// ❌ 不要（配列が小さい場合）
const filtered = useMemo(() => 
  [1, 2, 3].filter(x => x > 1),
  []
);

// ✅ これで十分
const filtered = [1, 2, 3].filter(x => x > 1);
```

3. **初回レンダリングのみの計算**
```jsx
// ❌ 不要
const initialValue = useMemo(() => 
  expensiveCalculation(),
  []
);

// ✅ useState の初期化関数を使う
const [value] = useState(() => expensiveCalculation());
```

---

## 8. パフォーマンス測定の重要性

**「推測するな、計測せよ」**

`useMemo` を使う前に、本当に必要か確認しましょう。

### React DevTools Profiler の使い方

1. React DevTools の Profiler タブを開く
2. 記録を開始
3. アプリを操作
4. 記録を停止
5. レンダリング時間を確認

**ルール:**
- 問題があることを確認してから最適化する
- 早すぎる最適化は悪の根源

---

## 9. よくある間違い

### ❌ 間違い1: すべてを useMemo でラップ

```jsx
function MyComponent() {
  const a = useMemo(() => 1 + 1, []);
  const b = useMemo(() => 'hello', []);
  const c = useMemo(() => true, []);
  // ...
}
```

**問題点:** `useMemo` 自体にもコスト（メモリとロジック）がかかる。簡単な計算には不要。

### ❌ 間違い2: 依存配列の指定漏れ

```jsx
const filtered = useMemo(() => {
  return items.filter(item => item.category === category);
}, [items]); // category が依存配列にない！
```

**問題点:** `category` が変わっても再計算されず、古いデータが表示される。

**解決策:**

```jsx
const filtered = useMemo(() => {
  return items.filter(item => item.category === category);
}, [items, category]); // category を追加
```

### ❌ 間違い3: 副作用を useMemo 内で実行

```jsx
// ❌ 間違い
const data = useMemo(() => {
  fetchData(); // 副作用！
  return someValue;
}, []);

// ✅ 正しい
useEffect(() => {
  fetchData(); // useEffect で副作用を実行
}, []);
```

---

## 10. useMemo の内部動作

理解を深めるために、`useMemo` の擬似的な実装を見てみましょう:

```jsx
let memoizedValue;
let prevDeps;

function useMemo(computeFn, deps) {
  // 依存配列が変わったかチェック
  const hasChanged = !prevDeps || deps.some((dep, i) => dep !== prevDeps[i]);
  
  if (hasChanged) {
    // 依存配列が変わった → 再計算
    memoizedValue = computeFn();
    prevDeps = deps;
  }
  
  // キャッシュされた値を返す
  return memoizedValue;
}
```

**ポイント:**
- 依存配列の各要素を `===` で比較
- 1つでも変わっていれば再計算
- すべて同じならキャッシュされた値を返す

---

## 11. 実践的なパターン

### パターン1: 複雑なデータ変換

```jsx
function DataTable({ rawData }) {
  const processedData = useMemo(() => {
    return rawData
      .filter(item => item.active)
      .map(item => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString(),
        total: item.price * item.quantity
      }))
      .sort((a, b) => b.total - a.total);
  }, [rawData]);

  return <Table data={processedData} />;
}
```

### パターン2: Context の値の安定化

```jsx
function MyProvider({ children }) {
  const [state, setState] = useState(initialState);
  
  const value = useMemo(() => ({
    state,
    actions: {
      increment: () => setState(s => s + 1),
      decrement: () => setState(s => s - 1),
    }
  }), [state]);
  
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

---

## 12. まとめ

`useMemo` は、パフォーマンス最適化のための強力なツールですが、慎重に使う必要があります。

### 覚えておくべきポイント:

- **目的**: 重い計算結果のキャッシュ、参照の安定化
- **使い方**: `useMemo(() => 計算, [依存配列])`
- **いつ使うか**:
  - 重い計算がある
  - 参照の安定性が必要
  - パフォーマンス問題を測定した後
- **いつ使わないか**:
  - 簡単な計算
  - デフォルトで使わない（必要になってから）
- **原則**: 「まず動くものを作り、必要になってから最適化する」

---

## おめでとうございます！

STEP05 の学習を完了しました！これまで学んだ4つの Hooks:

1. **useEffect**: 副作用の管理
2. **useRef**: DOM アクセスと値の保持
3. **useContext**: グローバルな State 管理
4. **useMemo**: パフォーマンス最適化

これらを組み合わせることで、React アプリケーションのほとんどの要件を実装できます。次のステップでは、これらの知識を実践的なプロジェクトで活用していきましょう！
