# Session 3: Diffing アルゴリズムと Key Prop

## 学習目標

このセッションでは、React がどのように2つの Virtual DOM を比較し、最小限の DOM 変更を特定するかを学びます。また、`key` prop がなぜ重要なのかを深く理解します。

- Diffing アルゴリズムの**2つの基本仮定**
- 同じ位置の**異なる要素** → State 破棄＆再構築
- 同じ位置の**同じ要素** → State 保持
- `key` prop の**2つの用途**: リスト最適化 / State リセット

## Diffing アルゴリズムの基本

リコンシリエーション（前後の Virtual DOM の比較）の核心は **Diffing** です。

### 2つの基本仮定

1. **異なるタイプの要素は異なるツリーを生成する**
2. **`key` prop が安定している要素は、レンダー間で同一とみなされる**

これらの仮定により、アルゴリズムは O(n³) → O(n) まで高速化されています。

## ルール 1: 同じ位置で異なる要素 → 破棄＆再構築

```jsx
// Before
<div>
  <SearchBar />
</div>

// After
<header>
  <SearchBar />
</header>
```

`div` → `header` に変わったため：
- `div` と**その子孫すべて**が DOM から削除されます。
- `header` と新しい `SearchBar` インスタンスが**ゼロから**作成されます。
- **State はリセット**されます。

> **重要**: 親要素のタイプが変わると、子の State も失われます。

### コンポーネントでも同様

```jsx
// Before
<SearchBar filter="all" />

// After
<ProfileMenu filter="all" />
```

`SearchBar` → `ProfileMenu` に変わったため、`SearchBar` の State は完全に失われます。

## ルール 2: 同じ位置で同じ要素 → State 保持

```jsx
// Before
<div className="old">
  <SearchBar weight={100} />
</div>

// After
<div className="new">
  <SearchBar weight={200} />
</div>
```

`div` も `SearchBar` も同じタイプ・同じ位置なので：
- DOM 要素は**再利用**されます（属性のみ更新）。
- コンポーネントは**同じインスタンス**のまま、Props だけが更新されます。
- **State は保持**されます。

### 実践での影響

タブ切り替えなどで、見た目は別のコンテンツが表示されていても「同じ位置の同じコンポーネント」であれば State は保持されます。

```jsx
// タブを切り替えても TabContent の State は保持される
{activeTab <= 2 ? (
  <TabContent item={content[activeTab]} />
) : (
  <DifferentContent />
)}
```

`TabContent` は常に同じ位置にあるため、タブ 0 → 1 → 2 と切り替えても State がリセットされません。ただし、タブ 3（`DifferentContent`）に移動すると、`TabContent` は破棄され、戻ったときに State はリセットされます。

## Key Prop の2つの用途

### 用途 1: リストでの最適化

```jsx
// ❌ key なし
{items.map(item => <Item name={item.name} />)}

// ✅ key あり
{items.map(item => <Item key={item.id} name={item.name} />)}
```

リストの先頭に要素を追加する場合：

**key なし**: 既存の要素も位置が変わったため、すべて再作成される。

**key あり**: React は key で要素を追跡できるため、既存要素は再利用され、新しい要素だけが追加される。

> **ルール**: 常に**安定した一意の key**（ID など）を使用してください。配列のインデックスは避けましょう（順序が変わると問題が発生します）。

### 用途 2: State のリセット

State を**意図的にリセット**したい場合、異なる `key` を渡します。

```jsx
// 質問が変わったら State をリセットしたい
<Question key={question.id} question={question} />
```

`question.id` が変われば、React はこれを**別のインスタンス**として扱い、古いインスタンスを破棄して新しいものを作成します。つまり、**State が完全にリセット**されます。

### 実践例：タブ切り替えで State をリセット

```jsx
// ❌ State が保持される（元の動作）
<TabContent item={content[activeTab]} />

// ✅ key を追加して State をリセット
<TabContent key={content[activeTab].summary} item={content[activeTab]} />
```

`key` がタブごとに変わるため、タブ切り替え時に State がリセットされます。

## まとめ

| シナリオ | 結果 |
|----------|------|
| 同じ位置、**異なる**要素タイプ | 要素と State を**破棄**＆再構築 |
| 同じ位置、**同じ**要素タイプ | 要素を再利用、State を**保持** |
| **同じ key** | 位置が変わっても要素を**再利用** |
| **異なる key** | 新しいインスタンスとして扱い、State を**リセット** |

次のセッションでは、コンポーネントが「純粋」であるべき理由と、State 更新がどのようにバッチ処理されるかを学びます。
