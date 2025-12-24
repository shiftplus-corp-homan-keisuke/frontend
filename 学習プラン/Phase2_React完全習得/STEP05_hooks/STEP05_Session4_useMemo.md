# Session 4: useMemo と React Compiler

## はじめに：React における最適化の進化

これまで学んできたフックは、React アプリケーションの機能を実装するためのものでした。このセッションで学ぶ `useMemo` は、**パフォーマンスの最適化**を目的としたフックです。

しかし、React 19 からは大きな変化があります。**React Compiler**（コードネーム: React Forget）の導入により、これまで手動で行っていた多くの最適化が自動化されるようになりました。

このセッションでは、`useMemo` の仕組みを理解しつつ、最新の React がどのようにパフォーマンスを管理しているかを学びましょう。

---

## 1. React 19 と React Compiler

React 19 の最大の目玉の一つは、**React Compiler** です。

### これまでの問題（React 18以前）:
- 開発者は「どの値をメモ化すべきか」を常に考え、`useMemo` や `useCallback` を手動で記述する必要がありました。
- 指定を忘れると不要な再レンダリングが発生し、指定しすぎるとコードが複雑になるというジレンマがありました。

### React 19 の世界:
- コンパイラがコードを解析し、**自動的に値をメモ化**します。
- 開発者が `useMemo` を書かなくても、React が賢く「値が変わっていないなら再計算しない」という判断を下してくれます。

---

## 2. それでもなぜ `useMemo` を学ぶのか？

「自動化されるなら学ばなくていいのでは？」と思うかもしれません。しかし、以下の理由で `useMemo` の概念を理解することは依然として重要です。

1. **既存プロジェクトの保守**: 世の中の多くの React プロジェクトはまだ手動で `useMemo` を使っています。
2. **コンパイラが未導入の環境**: すべてのプロジェクトがすぐにコンパイラを導入できるわけではありません。
3. **最適化の仕組みを理解する**: React が内部でどのように「値の同一性」を判断しているかを知ることは、良いエンジニアになるために不可欠です。

---

## 3. メモ化とは？

**メモ化（Memoization）** とは、計算結果をキャッシュして、同じ入力に対しては保存された結果を再利用する技術です。

### 例: メモ化なしの状態

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
  // コンポーネントが再レンダリングされるたびに、この重い計算が走る
  const result = expensiveCalculation(number);
  
  return <div>結果: {result}</div>;
}
```

**問題点:** `number` が変わっていなくても、例えば別の State が更新されて再レンダリングが起こるたびに、10億回のループが再実行されてしまいます。

---

## 4. useMemo の基本構文（手動最適化）

`useMemo` を使うと、特定の計算結果をロック（保持）できます。

```jsx
import { useMemo } from 'react';

function MyComponent({ number }) {
  // number が変わったときだけ、第1引数の関数が実行される
  const result = useMemo(() => {
    return expensiveCalculation(number);
  }, [number]); 
  
  return <div>結果: {result}</div>;
}
```

### 構文のポイント:
- **第1引数**: 計算を行う関数。
- **第2引数（依存配列）**: 「この値が変わったら再計算してね」というトリガーのリスト。

**★ React 19 Compiler が有効な場合、上記のコードは `useMemo` を書かなくても自動的にこれと同じ（あるいはそれ以上の）最適化が行われます。**

---

## 5. 実践例：配列のフィルタリング

React Compiler が「どこを自動で最適化してくれるのか」を、`useMemo` を使った例で見てみましょう。

```jsx
import { useState, useMemo } from 'react';

function UserList({ users }) {
  const [query, setQuery] = useState('');

  // 以前はこうして手動でメモ化していた
  const filteredUsers = useMemo(() => {
    console.log('フィルタリング実行中...');
    return users.filter(user => user.name.includes(query));
  }, [users, query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>
        {filteredUsers.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}
```

### React 19 での変化:
React Compiler を導入している環境では、上記の `useMemo` を取り除いて単純な変数にしても、`query` や `users` が変わらない限り、フィルタリング処理は再実行されません。

```jsx
// React 19 (Compiler 有効時) ならこれで十分！
const filteredUsers = users.filter(user => user.name.includes(query));
```

---

## 6. オブジェクトの参照と再レンダリング

メモ化のもう一つの重要な役割は、**「オブジェクトの参照を同じに保つ」**ことです。

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // コンパイラがない場合、Parent がレンダリングされるたびに 
  // options は「新しいオブジェクト（別の住所）」として作られてしまう
  const options = { color: 'blue' };

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>再描画</button>
      <Child options={options} />
    </div>
  );
}

const Child = memo(({ options }) => {
  console.log('Child rendered');
  return <div style={{ color: options.color }}>Hello</div>;
});
```

### なぜこれが問題か？
JavaScript では `{ color: 'blue' } === { color: 'blue' }` は **false** です。そのため、中身が同じでも毎回「新しい Props が来た！」と React が勘違いして、`Child` を再描画してしまいます。

**React Compiler は、このような「見かけは同じだけど参照（住所）が違う」ために起こる無駄な再描画も、自動的に防いでくれます。**

---

## 7. まとめとこれからの向き合い方

`useMemo` は、React というライブラリが「手動最適化」から「自動最適化」へと進化する過程を象徴するフックです。

### 覚えておくべきポイント:
- **useMemo の本質**: 計算結果を保存し、値が変わらない限り再計算を避けること。
- **React 19 の理想**: 開発者は最適化を気にせず、プレーンな JavaScript を書けば React が勝手に速くしてくれる。
- **現状のベストプラクティス**:
    1. 新規プロジェクトであれば、まずは `useMemo` なしでシンプルに書く。
    2. パフォーマンスに問題を感じた場合のみ、Profiler で計測し、必要なら `useMemo` を足す（またはコンパイラの設定を確認する）。

---

## おめでとうございます！

これで STEP05 の主要な Hooks 学習を完了しました！

1. **useEffect**: コンポーネントの外の世界（API、DOM）との同期
2. **useRef**: 画面を書き換えない値の保持や DOM 操作
3. **useContext**: データのバケツリレー（Prop Drilling）の解消
4. **useMemo / Compiler**: 無駄な計算と描画の排除

これらの道具を使いこなせるようになると、どのような複雑な要件でも React で実装できるようになります。お疲れ様でした！
