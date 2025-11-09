# Session4: 親子間通信とデータ操作の実践

## 学習目標

このセッションでは、React アプリケーションにおける実践的なデータ操作と親子間通信パターンについて学習し、以下のスキルを習得します：

- **親子間通信による削除機能の実装**
- **配列の不変（イミュータブル）な操作方法**
- **オブジェクトの不変な更新パターン**
- **複雑なステート変更のハンドリング**
- **コンポーネント階層を通じた関数の受け渡し**

これらの学習内容は、最終プロジェクトにおいてアイテムの削除・更新機能を実装する際の重要な基盤となり、実用的な Web アプリケーションでの動的データ操作パターンを身につけることができます。

## アイテム削除機能：親子間通信の実践

前回学習した親子間通信の概念を使用して、リストからアイテムを削除する機能を実装しましょう。この実装を通じて、より複雑な親子間通信のパターンを理解します。

### 削除機能の要件と設計

**機能要件**：

- 各アイテムの隣にあるバツボタン（❌）をクリック
- そのアイテムをリストから完全に削除
- UI から即座に消去され、以降表示されない

**技術的な課題**：

- **イベント発生場所**: Item コンポーネント内（最深レベル）
- **ステート所有者**: App コンポーネント（最上位レベル）
- **コンポーネント階層**: App → PackingList → Item

この 3 層構造での通信が必要になります。

### App コンポーネントでの削除ロジック作成

まず、ステートを所有する App コンポーネントで削除関数を定義します：

```jsx
function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem} // 新しいprop
      />
      <Stats items={items} />
    </div>
  );
}
```

**削除ロジックの解説**：

- **パラメータ**: 削除したいアイテムの`id`を受け取り
- **filter メソッド**: 指定された ID 以外のアイテムのみを含む新しい配列を作成
- **不変性**: 元の配列を変更せず、新しい配列を返す
- **条件**: `item.id !== id` の場合のみ新しい配列に含める

### PackingList コンポーネントでの props 中継

PackingList コンポーネントは、削除関数を受け取って各 Item コンポーネントに渡します：

```jsx
function PackingList({ items, onDeleteItem }) {
  return (
    <div>
      <ul className="list">
        {items.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem} // Itemに関数を渡す
          />
        ))}
      </ul>
    </div>
  );
}
```

**役割の理解**：

- PackingList 自体は削除機能を使用しない
- しかし、App から Item への「橋渡し」役を担う
- これは React の一方向データフローの制約による必要な設計

### Item コンポーネントでのイベントハンドリング

最終的に、実際のクリックイベントを処理する Item コンポーネント：

```jsx
function Item({ item, onDeleteItem }) {
  return (
    <li>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
```

**重要なポイント**：

- **アロー関数の必要性**: `onClick={() => onDeleteItem(item.id)}`
- **即座実行の回避**: `onClick={onDeleteItem(item.id)}` は間違い（関数が即座に実行される）
- **正しい関数渡し**: React に関数を渡し、イベント発生時の実行を委ねる

### 完全なデータフローの確認

削除操作の完全な流れ：

1. **ユーザーアクション**:

   ```
   ユーザーが❌ボタンをクリック
   ```

2. **イベント発生**:

   ```
   onClick イベント → () => onDeleteItem(item.id) 実行
   ```

3. **階層を上る通信**:

   ```
   Item → PackingList → App の onDeleteItem 関数
   ```

4. **ステート更新**:

   ```
   handleDeleteItem(id) → setItems(新しい配列)
   ```

5. **再レンダリング**:
   ```
   App re-render → PackingList re-render → 削除されたItemは表示されない
   ```

### 動作確認

実際にアプリケーションをテストして機能を確認します：

**テストシナリオ**：

1. フォームでいくつかのアイテムを追加
2. 各アイテムの削除ボタンをクリック
3. React Dev Tools で items ステートの変化を確認
4. UI から即座にアイテムが消えることを確認

**期待される結果**：

- クリックした瞬間にアイテムが消去
- 他のアイテムには影響なし
- ステートから完全に削除されている

### エラーハンドリングとデバッグ

**よくある間違い**：

1. **関数の即座実行**:

   ```jsx
   // ❌ 間違い：関数が即座に実行される
   <button onClick={onDeleteItem(item.id)}>❌</button>

   // ✅ 正しい：関数をReactに渡す
   <button onClick={() => onDeleteItem(item.id)}>❌</button>
   ```

2. **ID の不一致**:
   ```jsx
   // デバッグのためのログ出力
   function handleDeleteItem(id) {
     console.log("削除するID:", id);
     setItems((items) => items.filter((item) => item.id !== id));
   }
   ```

### 設計パターンの価値

この実装により、以下の重要なパターンを学習しました：

1. **関数の階層的受け渡し**: App → PackingList → Item
2. **関心の分離**: 各コンポーネントが適切な責任を持つ
3. **不変性の保持**: filter による新しい配列の作成
4. **イベントハンドリング**: 適切な関数渡しのパターン

このパターンは、他の CRUD 操作（作成、読み取り、更新、削除）にも応用可能な基本的な設計となります。

## アイテム更新：複雑な不変データ操作

次に、アイテムのパッキング状態を切り替える機能を実装します。これは配列内のオブジェクトを更新する、より複雑な不変データ操作のパターンを学習する絶好の機会です。

### チェックボックスの追加と制御

まず、Item コンポーネントにチェックボックスを追加します：

```jsx
function Item({ item, onDeleteItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => {
          /* 後で実装 */
        }}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
```

**注意点**：

- **value vs checked**: チェックボックスでは `checked` プロパティを使用
- **制御されたコンポーネント**: ステートによる値の制御とイベントハンドラーが必要

### App コンポーネントでの更新ロジック

App コンポーネントで、アイテムの更新を処理する関数を作成します：

```jsx
function App() {
  const [items, setItems] = useState([]);

  // 既存の関数...

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem} // 新しいprop
      />
      <Stats items={items} />
    </div>
  );
}
```

**複雑な更新ロジックの解説**：

1. **map メソッドの使用**:

   - 配列の全要素をイテレーション
   - 各要素に対して新しい値を返す
   - 結果として新しい配列を作成

2. **条件分岐**:

   ```jsx
   item.id === id ? 更新されたオブジェクト : 元のオブジェクト;
   ```

3. **オブジェクトのスプレッド**:

   ```jsx
   { ...item, packed: !item.packed }
   ```

   - 既存のプロパティを展開
   - `packed` プロパティのみを新しい値で上書き

4. **不変性の保持**:
   - 元の配列もオブジェクトも変更しない
   - 常に新しいデータ構造を作成

### PackingList での props 中継

更新関数も削除関数と同様に、PackingList 経由で Item に渡します：

```jsx
function PackingList({ items, onDeleteItem, onToggleItem }) {
  return (
    <div>
      <ul className="list">
        {items.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem} // 新しいprop
          />
        ))}
      </ul>
    </div>
  );
}
```

### Item コンポーネントの完成

最終的に、チェックボックスのイベントハンドラーを実装します：

```jsx
function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed} // value → checked に修正
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
```

### 不変データ操作パターンの理解

React で使用される主要な不変操作パターン：

#### 配列操作

```jsx
// 追加
[...array, newItem]

// 削除
array.filter(item => item.id !== deleteId)

// 更新
array.map(item =>
  item.id === updateId ? { ...item, newProperty: newValue } : item
)

// 並び替え
[...array].sort((a, b) => a.property - b.property)
```

#### オブジェクト操作

```jsx
// プロパティ更新
{ ...obj, property: newValue }

// ネストしたプロパティ更新
{
  ...obj,
  nested: {
    ...obj.nested,
    property: newValue
  }
}

// プロパティ削除
const { removeProperty, ...rest } = obj;
```

### 動作確認とテスト

**テストシナリオ**：

1. いくつかのアイテムを追加
2. チェックボックスをクリックして packed 状態を切り替え
3. 打ち消し線の表示/非表示を確認
4. React Dev Tools でステートの変化を確認

**期待される結果**：

- チェックしたアイテムに打ち消し線が表示
- チェックを外すと打ち消し線が消去
- 他のアイテムには影響なし
- ステートが正確に更新されている

### パフォーマンスの考慮

現在の実装では、一つのアイテムを更新するために全ての Item コンポーネントが再レンダリングされます。これは小規模なアプリケーションでは問題ありませんが、後のセクションで最適化技術を学習します：

- **React.memo**: 不要な再レンダリングの防止
- **useCallback**: 関数の最適化
- **useMemo**: 計算結果のメモ化

### 学習の価値

この実装により、以下の重要な概念を習得しました：

1. **複雑な状態更新**: 配列内オブジェクトの部分的更新
2. **不変性の重要性**: React の再レンダリング最適化の基盤
3. **関数型プログラミング**: map、filter、スプレッドオペレーターの活用
4. **制御されたコンポーネント**: チェックボックスの適切な制御方法

これらのパターンは、実際の Web アプリケーション開発において頻繁に使用される基本的で重要な技術です。

## 派生ステート（Derived State）の活用

アプリケーションの機能をさらに充実させるために、統計情報の表示機能を実装しましょう。ここで「派生ステート」という重要な概念を学習し、効率的なステート管理の方法を身につけます。

### 派生ステートとは

**派生ステート（Derived State）**は、既存のステートや props から計算できるデータのことです。新しいステート変数を作成する代わりに、既存のデータから必要な値を算出します。

### 問題のある実装例（やってはいけない方法）

まず、誤った実装方法を確認しましょう：

```jsx
// ❌ 避けるべき実装
function App() {
  const [items, setItems] = useState([]);
  const [numItems, setNumItems] = useState(0); // 不要なステート

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
    setNumItems((num) => num + 1); // 手動での同期
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
    setNumItems((num) => num - 1); // 手動での同期
  }

  // ...
}
```

**この実装の問題点**：

1. **重複する情報**: `items.length` で取得可能な情報を別途管理
2. **同期の困難**: 複数のステートを手動で同期する必要
3. **バグの温床**: 同期を忘れるとデータの不整合が発生
4. **複数回の再レンダリング**: 複数のステート更新による無駄な処理

### 正しい実装：派生ステートの使用

代わりに、既存のステートから値を算出します：

```jsx
function Stats({ items }) {
  // 派生ステート：既存のデータから計算
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage =
    numItems === 0 ? 0 : Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        リストに{numItems}個のアイテムがあり、すでに{numPacked}個({percentage}
        %)を荷造り済みです
      </em>
    </footer>
  );
}
```

### 早期リターンによる条件付きレンダリング

アイテムが無い場合の特別なメッセージを表示する実装：

```jsx
function Stats({ items }) {
  // 早期リターン：アイテムが無い場合
  if (!items.length) {
    return (
      <footer className="stats">
        <em>荷造りリストにアイテムを追加しましょう 🚀</em>
      </footer>
    );
  }

  // 通常の統計計算
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  // 100%完了時の特別メッセージ
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "すべて揃いました！出発の準備完了 ✈️"
          : `リストに${numItems}個のアイテムがあり、すでに${numPacked}個(${percentage}%)を荷造り済みです`}
      </em>
    </footer>
  );
}
```

### App コンポーネントからの props 渡し

Stats コンポーネントが items データにアクセスできるよう、App から渡します：

```jsx
function App() {
  const [items, setItems] = useState([]);

  // ハンドラー関数...

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
      />
      <Stats items={items} /> {/* props として渡す */}
    </div>
  );
}
```

### 派生ステートの動作原理

**再計算のタイミング**：

1. `items` ステートが更新される
2. App コンポーネントが再レンダリングされる
3. Stats コンポーネントも再レンダリングされる
4. Stats コンポーネント内で派生ステートが再計算される
5. 新しい統計値が UI に表示される

**効率性の理由**：

- **自動同期**: ステートの更新により自動的に再計算
- **単一の真実のソース**: `items` ステートのみが情報源
- **バグの防止**: 手動同期が不要なため、データ不整合が発生しない

### 実際の動作確認

**テストシナリオ**：

1. **初期状態**: 「荷造りリストにアイテムを追加しましょう...」メッセージを表示
2. **アイテム追加**: 統計情報の更新を確認
3. **パッキング状態変更**: パーセンテージの動的更新
4. **100%達成**: 特別なメッセージの表示
5. **アイテム削除**: 統計の再計算を確認

**期待される結果例**：

```
// 初期状態
"荷造りリストにアイテムを追加しましょう 🚀"

// 3個追加、1個パッキング
"リストに3個のアイテムがあり、すでに1個(33%)を荷造り済みです"

// 全てパッキング完了
"すべて揃いました！出発の準備完了 ✈️"
```

### 派生ステートの適用場面

派生ステートは以下の場合に有効です：

1. **計算可能なデータ**: 既存データから算出できる値
2. **集計情報**: 合計、平均、パーセンテージなど
3. **フィルタリング結果**: 特定条件に合致するアイテムの抽出
4. **変換データ**: 既存データの形式変更や加工

### パフォーマンスの考慮

**軽量な計算の場合**：
現在の実装のように計算が軽量（配列の length や filter）であれば、毎回の再計算でも問題ありません。

**重い計算の場合**：
計算が重い場合は、後で学習する `useMemo` フックでメモ化を検討します：

```jsx
const expensiveValue = useMemo(() => {
  return heavyCalculation(items);
}, [items]);
```

### 設計上の利点

派生ステートの使用により、以下の利点を得られます：

1. **シンプルなステート**: 最小限の実際のステートのみを管理
2. **自動的な一貫性**: データの不整合が構造的に防止される
3. **保守性の向上**: 変更点が一箇所に集約される
4. **テストの容易さ**: 予測可能な動作によるテストの簡略化

この実装により、堅牢で保守しやすいアプリケーションアーキテクチャの基盤が完成しました。

## まとめ

このセッションでは、React アプリケーションにおける実践的なデータ操作と親子間通信について、具体的な機能実装を通じて深く学習しました。

### 主要な学習成果

1. **親子間通信の実践パターン**

   - 3 層階層（App → PackingList → Item）での関数受け渡し
   - 削除機能による実践的な通信フローの理解
   - props の中継役としてのコンポーネントの役割

2. **不変データ操作の習得**

   - **削除**: `filter` メソッドによる新しい配列作成
   - **更新**: `map` とスプレッドオペレーターによるオブジェクト更新
   - **追加**: スプレッドオペレーターによる配列拡張
   - React の不変性原則の実践的理解

3. **派生ステートの効果的活用**

   - 既存データからの計算値生成
   - 手動同期の問題点と自動同期の利点
   - 条件付きレンダリングと早期リターンの組み合わせ

4. **イベントハンドリングのベストプラクティス**
   - 関数の適切な渡し方とアロー関数の使用
   - イベント発生源と状態管理者の分離
   - ID による特定アイテムの操作

### 最終プロジェクトでの統合実装

これらの学習内容は、完成版の「Far Away」アプリケーションで以下のように統合されています：

**完全な CRUD 操作**：

```jsx
// Create: アイテム追加
handleAddItems(newItem) → [...items, newItem]

// Read: アイテム表示
items.map(item => <Item key={item.id} {...item} />)

// Update: パッキング状態切り替え
handleToggleItem(id) → items.map(item =>
  item.id === id ? {...item, packed: !item.packed} : item
)

// Delete: アイテム削除
handleDeleteItem(id) → items.filter(item => item.id !== id)
```

**動的 UI 更新**：

- ユーザーアクションに対する即座のフィードバック
- 統計情報のリアルタイム更新
- 状態に基づく視覚的表現（打ち消し線、完了メッセージ）

### React の核心パターンの理解

1. **単一の真実のソース**

   - App コンポーネントが全てのアプリケーション状態を管理
   - 派生ステートによる一貫性の保証

2. **関心の分離**

   - **App**: 状態管理とビジネスロジック
   - **Form**: データ入力とバリデーション
   - **PackingList**: リスト表示とアイテム管理
   - **Item**: 個別アイテムの表示と操作
   - **Stats**: データ集計と統計表示

3. **予測可能なデータフロー**
   - 一方向データフロー（props による下向き通信）
   - 関数 props による上向き通信
   - イミュータブルな状態更新

### 実用的なスキルの習得

このセッションで習得したパターンは、以下のような実際の開発シナリオで直接応用できます：

- **EC サイト**: ショッピングカートの商品追加・削除・数量変更
- **タスク管理**: タスクの作成・完了・削除・フィルタリング
- **SNS**: 投稿の作成・編集・削除・いいね機能
- **管理画面**: データの一覧表示・編集・削除機能

### 次のステップへの準備

次のセッションでは、これらの基盤の上により高度な機能を実装します：

- **ソート機能**: 複数条件による動的並び替え
- **一括操作**: 全アイテムの一括削除とクリア機能
- **ファイル分割**: コンポーネントの個別ファイル化
- **コード組織化**: 保守しやすいプロジェクト構造

React の基本的なパターンをしっかりと理解した今、より複雑で実用的な機能の実装に挑戦する準備が整いました。不変データ操作と親子間通信のパターンは、これからの React 開発において何度も使用する重要な基盤となります。
