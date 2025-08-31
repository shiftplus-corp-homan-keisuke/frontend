# Session5: リスト操作機能の完全実装

## 学習目標
このセッションでは、Far Awayアプリケーションを完成させるために、残りの重要な機能を実装します。アイテムの削除、チェック機能、派生状態を使った統計計算、ソート機能、そしてリストのクリア機能を学習します。

### このセッションで学ぶこと
- 子から親への通信パターンの応用
- 配列の不変性を保った削除・更新操作
- 派生状態（Derived State）の概念と実装
- 複雑な配列操作（filter、map、sort）
- 条件付きレンダリングの高度な使用法
- ユーザビリティを考慮した機能実装

## アイテム削除機能の実装

### 削除機能の設計

アイテムの削除機能では、各アイテムの横にある「×」ボタンをクリックすることで、そのアイテムをリストから削除できるようにします。

**実装のポイント：**
- 削除ボタンのクリックはItemコンポーネントで発生
- 状態の更新はAppコンポーネントで実行
- 子から親への通信パターンを使用

### handleDeleteItem関数の実装

まず、Appコンポーネントに削除機能を実装します：

```javascript
function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems(items => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems(items => items.filter(item => item.id !== id));
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList 
        items={items} 
        onDeleteItem={handleDeleteItem}
      />
      <Stats items={items} />
    </div>
  );
}
```

**filter メソッドの動作解説：**
```javascript
// 削除前の配列: [
//   { id: 1, description: "靴下", packed: false },
//   { id: 2, description: "シャツ", packed: true },
//   { id: 3, description: "充電器", packed: false }
// ]

// id: 2 のアイテムを削除する場合
items.filter(item => item.id !== 2)

// 結果: [
//   { id: 1, description: "靴下", packed: false },
//   { id: 3, description: "充電器", packed: false }
// ]
```

### propsの受け渡し

削除機能をItemコンポーネントまで届けるために、PackingListコンポーネントを経由してpropsを渡します：

```javascript
function PackingList({ items, onDeleteItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item 
            item={item} 
            key={item.id}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

function Item({ item, onDeleteItem }) {
  return (
    <li>
      <input 
        type="checkbox" 
        value={item.packed} 
        onChange={() => {}} // 後で実装
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
```

**重要なポイント：**
- `onClick={() => onDeleteItem(item.id)}` の形式を使用
- `onClick={onDeleteItem(item.id)}` は間違い（即座に実行されてしまう）
- アロー関数を使って、クリック時にのみ関数が実行されるようにする

## アイテム更新機能（チェック機能）の実装

### チェックボックスの制御された要素化

各アイテムのチェックボックスを制御された要素にして、packed状態を切り替えられるようにします。

### handleToggleItem関数の実装

```javascript
function App() {
  const [items, setItems] = useState([]);

  // 既存の関数...

  function handleToggleItem(id) {
    setItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, packed: !item.packed }
          : item
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
        onToggleItem={handleToggleItem}
      />
      <Stats items={items} />
    </div>
  );
}
```

**map メソッドによる更新の仕組み：**
```javascript
// 更新前の配列
const items = [
  { id: 1, description: "靴下", packed: false },
  { id: 2, description: "シャツ", packed: false },
  { id: 3, description: "充電器", packed: false }
];

// id: 2 のアイテムのpacked状態を切り替える
items.map(item => 
  item.id === 2 
    ? { ...item, packed: !item.packed }  // 新しいオブジェクトを作成
    : item                               // 既存のオブジェクトをそのまま返す
);

// 結果: [
//   { id: 1, description: "靴下", packed: false },
//   { id: 2, description: "シャツ", packed: true },  // packed が true に変更
//   { id: 3, description: "充電器", packed: false }
// ]
```

### チェックボックスの完成

```javascript
function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input 
        type="checkbox" 
        value={item.packed} 
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

## 派生状態（Derived State）の概念と実装

### 派生状態とは

派生状態とは、既存の状態やpropsから計算できる値のことです。新しいuseStateを作成する代わりに、既存のデータから必要な値を計算します。

**派生状態の利点：**
1. **同期の問題を回避**：複数の状態を同期させる必要がない
2. **パフォーマンス向上**：不要な再レンダリングを防ぐ
3. **コードの簡潔性**：単一の情報源（Single Source of Truth）を維持

### 間違った実装例（避けるべき）

```javascript
// ❌ 間違った方法：複数の状態を作成
function Stats({ items }) {
  const [numItems, setNumItems] = useState(0);
  const [numPacked, setNumPacked] = useState(0);
  const [percentage, setPercentage] = useState(0);

  // アイテムが追加されるたびに、3つの状態を手動で更新する必要がある
  // これは同期の問題を引き起こし、バグの原因となる
}
```

### 正しい実装例（派生状態の使用）

```javascript
// ✅ 正しい方法：派生状態を使用
function Stats({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );
  }

  const numItems = items.length;
  const numPacked = items.filter(item => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100 
          ? "You got everything! Ready to go ✈️"
          : `💼 You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage}%)`
        }
      </em>
    </footer>
  );
}
```

### 早期リターン（Early Return）パターン

アイテムが存在しない場合の処理に早期リターンパターンを使用します：

```javascript
function Stats({ items }) {
  // 早期リターン：アイテムがない場合は専用メッセージを表示
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );
  }

  // 通常の処理：統計を計算して表示
  const numItems = items.length;
  // ... 残りの処理
}
```

**早期リターンの利点：**
- コードの可読性向上
- 不要な計算の回避
- 条件分岐の明確化

## ソート機能の実装

### ソート機能の設計

ユーザーが以下の3つの基準でアイテムをソートできるようにします：
1. **入力順**：アイテムが追加された順序
2. **説明順**：アルファベット順
3. **パック状態順**：未パックのアイテムを先に表示

### 制御された要素としてのセレクトボックス

```javascript
function PackingList({ items, onDeleteItem, onToggleItem }) {
  const [sortBy, setSortBy] = useState("input");

  return (
    <div className="list">
      <ul>
        {/* ソート済みアイテムを表示（後で実装） */}
      </ul>
      
      <div className="actions">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
      </div>
    </div>
  );
}
```

### 派生状態を使ったソート実装

```javascript
function PackingList({ items, onDeleteItem, onToggleItem }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") {
    sortedItems = items;
  }

  if (sortBy === "description") {
    sortedItems = items
      .slice()  // 元の配列をコピー（sortは破壊的メソッドのため）
      .sort((a, b) => a.description.localeCompare(b.description));
  }

  if (sortBy === "packed") {
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item 
            item={item} 
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>
      
      <div className="actions">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
      </div>
    </div>
  );
}
```

### ソートアルゴリズムの詳細解説

#### 1. 文字列のソート（アルファベット順）
```javascript
// localeCompare メソッドを使用
items.sort((a, b) => a.description.localeCompare(b.description));

// 例：
// ["Zebra", "Apple", "Banana"] → ["Apple", "Banana", "Zebra"]
```

#### 2. ブール値のソート（パック状態順）
```javascript
// ブール値を数値に変換してソート
items.sort((a, b) => Number(a.packed) - Number(b.packed));

// 変換の仕組み：
// false → 0, true → 1
// 結果：未パック（false）が先に、パック済み（true）が後に表示
```

#### 3. 配列のコピーが必要な理由
```javascript
// ❌ 間違った方法：元の配列を直接変更
items.sort(...) // 元のitems配列が変更されてしまう

// ✅ 正しい方法：コピーを作成してからソート
items.slice().sort(...) // 元の配列は変更されない
```

## リストクリア機能の実装

### 基本的なクリア機能

```javascript
function App() {
  const [items, setItems] = useState([]);

  // 既存の関数...

  function handleClearList() {
    setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList 
        items={items} 
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}
```

### 確認ダイアログ付きクリア機能

ユーザビリティを向上させるため、確認ダイアログを追加します：

```javascript
function handleClearList() {
  const confirmed = window.confirm(
    "Are you sure you want to delete all items?"
  );
  
  if (confirmed) setItems([]);
}
```

### PackingListコンポーネントでのボタン実装

```javascript
function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
  const [sortBy, setSortBy] = useState("input");

  // ソート処理...

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item 
            item={item} 
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>
      
      <div className="actions">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        
        <button onClick={onClearList}>Clear list</button>
      </div>
    </div>
  );
}
```

## 完成したアプリケーションの動作確認

### 期待される機能

1. **アイテム追加**：
   - フォームから新しいアイテムを追加
   - 数量と説明を指定可能

2. **アイテム削除**：
   - 各アイテムの×ボタンでアイテムを削除
   - 統計情報が自動更新

3. **パック状態の切り替え**：
   - チェックボックスでパック状態を変更
   - パック済みアイテムには取り消し線が表示

4. **統計表示**：
   - 総アイテム数、パック済み数、パーセンテージを表示
   - 100%完了時は特別メッセージを表示
   - アイテムがない場合は開始メッセージを表示

5. **ソート機能**：
   - 入力順、アルファベット順、パック状態順でソート
   - リアルタイムでソート結果が反映

6. **リストクリア**：
   - 確認ダイアログ付きで全アイテムを削除

### デバッグとテストのポイント

#### React DevToolsでの確認
1. **状態の確認**：
   - Appコンポーネントのitems状態
   - PackingListコンポーネントのsortBy状態

2. **propsの流れ**：
   - 各コンポーネントが正しいpropsを受け取っているか
   - 関数が正しく渡されているか

#### 一般的な問題と解決方法

1. **削除が動作しない**：
   ```javascript
   // ❌ 間違い
   <button onClick={onDeleteItem(item.id)}>❌</button>
   
   // ✅ 正しい
   <button onClick={() => onDeleteItem(item.id)}>❌</button>
   ```

2. **ソートが動作しない**：
   ```javascript
   // ❌ 間違い：元の配列を変更
   items.sort(...)
   
   // ✅ 正しい：コピーを作成
   items.slice().sort(...)
   ```

3. **統計が更新されない**：
   - 派生状態が正しく計算されているか確認
   - items propsが正しく渡されているか確認

## まとめ

このセッションでは、Reactアプリケーションの重要な概念を実践的に学習しました：

### 学習した重要な概念

1. **子から親への通信**：
   - 関数をpropsとして渡すパターン
   - イベントハンドラーの正しい書き方

2. **配列の不変性操作**：
   - filter による削除
   - map による更新
   - slice による安全なコピー

3. **派生状態**：
   - 既存の状態から値を計算
   - 単一の情報源の維持
   - パフォーマンスの最適化

4. **高度な配列操作**：
   - sort メソッドの使用
   - localeCompare による文字列比較
   - ブール値の数値変換

5. **ユーザビリティの向上**：
   - 確認ダイアログの実装
   - 条件付きメッセージの表示
   - 早期リターンパターン

### 次のステップ

このセッションでFar Awayアプリケーションが完成しました。学習した概念は、より大きなReactアプリケーションでも同様に適用できます。

**さらなる学習のために：**
1. **コンポーネントの分割**：より細かいコンポーネントに分割してみる
2. **カスタムフック**：ロジックを再利用可能なフックに抽出
3. **TypeScript**：型安全性を向上させる
4. **テスト**：ユニットテストとインテグレーションテストの追加

### 練習課題

理解を深めるために、以下の機能追加に挑戦してみてください：

1. **編集機能**：既存のアイテムの説明や数量を編集
2. **カテゴリ機能**：アイテムをカテゴリ別に分類
3. **検索機能**：アイテムを名前で検索
4. **ローカルストレージ**：データの永続化
5. **ドラッグ&ドロップ**：アイテムの順序変更

これらの概念をマスターすることで、Reactの状態管理とコンポーネント設計の基礎が身につき、より複雑なアプリケーション開発に進む準備が整います。