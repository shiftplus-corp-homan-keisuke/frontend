# Session2: 制御されたコンポーネントとフォーム管理

## 学習目標

このセッションでは、React におけるフォーム管理の核心的な概念である「制御されたコンポーネント」について学習し、以下のスキルを習得します：

- **制御されたコンポーネントの 3 つのステップ**
- **useState フックを使用したフォーム状態の管理**
- **イベントハンドラーによる状態更新の処理**
- **フォーム送信とデータの検証**
- **React における一方向データフローの理解**

これらの概念は、最終プロジェクトにおいて新しいアイテムの追加フォームを実装する際の重要な基盤となり、実用的な Web アプリケーションでのフォーム処理パターンを身につけることができます。

## 制御されたコンポーネントとは

React におけるフォーム管理の基本的で非常に重要な概念である「制御されたコンポーネント」について学習しましょう。この技術は、フォームデータの取得と管理を行う際に使用します。

### DOM vs React の状態管理

通常の HTML 要素では、input フィールドや select 要素は**DOM 内で独自の状態を維持**しています。つまり、HTML の要素そのものが、現在の値を記憶しているということです。

しかしこれは、値を読み取ることを困難にし、また状態が DOM 内に残されることになります。これは多くの理由で理想的ではありません。

React では、**すべての状態を一箇所（React アプリケーション内）に集約**することを好みます。DOM 内ではなく、React 内で状態管理を行いたいのです。

### 制御されたコンポーネントの実装手順

制御されたコンポーネント技術を実装するには、**3 つのステップ**を踏みます：

#### ステップ 1: 状態変数の作成

まず、入力フィールドのための state 変数を作成します：

```jsx
function Form() {
  const [description, setDescription] = useState("");

  // 他のコード...
}
```

この場合、アイテムの説明（description）を管理するための状態を作成しています。初期値は空文字列です。

#### ステップ 2: value プロパティの設定

次に、その状態を入力要素の値として使用します：

```jsx
<input
  type="text"
  placeholder="Item..."
  value={description} // 状態を値として使用
/>
```

これにより、React がこの要素を制御し、常に状態の値を表示するようになります。

#### ステップ 3: onChange イベントハンドラーの追加

最後に、入力が変更されたときに状態を更新するイベントハンドラーを追加します：

```jsx
<input
  type="text"
  placeholder="Item..."
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

**動作の流れ**：

1. ユーザーが何かを入力
2. change イベントが発生
3. イベントハンドラーが実行され、`e.target.value` で現在の値を取得
4. `setDescription` で状態を更新
5. コンポーネントが再レンダリングされ、新しい値が表示

### select 要素の制御

同じパターンを select 要素にも適用します：

```jsx
function Form() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>旅行に何が必要ですか？ 😍</h3>

      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="アイテム..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button>追加</button>
    </form>
  );
}
```

**重要なポイント**：

- `Number(e.target.value)`: select 要素の値は常に文字列なので、数値に変換が必要
- 両方の入力要素に `value` と `onChange` の両方が必要

### フォーム送信の処理

制御されたコンポーネントを使用して、フォーム送信時にデータを処理します：

```jsx
function handleSubmit(e) {
  e.preventDefault();

  // 入力検証
  if (!description) return;

  // 新しいアイテムオブジェクトの作成
  const newItem = {
    description,
    quantity,
    packed: false,
    id: Date.now(), // 簡易的なID生成
  };

  console.log(newItem);

  // フォームを初期状態にリセット
  setDescription("");
  setQuantity(1);
}
```

**処理の流れ**：

1. **入力検証**: 説明が空でないことを確認
2. **データ作成**: 状態から新しいアイテムオブジェクトを作成
3. **フォームリセット**: setter 関数を使用して初期状態に戻す

### 制御されたコンポーネントの利点

1. **React による状態管理**: DOM ではなく React が状態を管理
2. **簡単なリセット**: setter 関数で簡単にフォームをリセット可能
3. **状態の同期**: React が自動的にコンポーネント状態とフォーム要素を同期
4. **データアクセス**: どこからでも現在のフォーム値にアクセス可能

### 動作確認

React Dev Tools を使用して状態の変化を確認できます：

- 入力フィールドに何かを入力すると、Dev Tools で `description` 状態が更新されることを確認
- セレクトボックスを変更すると、`quantity` 状態が更新されることを確認
- フォーム送信後、両方の状態が初期値にリセットされることを確認

この制御されたコンポーネントのパターンは、React でフォームを扱う際の標準的な方法です。一度理解すれば、どのようなフォーム要素でも同じパターンを適用できるようになります。

## ステートの管理と親子間通信の課題

フォームが制御されたコンポーネントとして正常に動作するようになりましたが、ここで新たな課題が発生します。作成されたアイテムデータを、どのようにアプリケーションの他の部分で使用するかという問題です。

### 現在の状況と課題

現時点で、フォーム送信時に以下の処理が行われています：

```jsx
function handleSubmit(e) {
  e.preventDefault();

  if (!description) return;

  const newItem = {
    description,
    quantity,
    packed: false,
    id: Date.now(),
  };

  console.log(newItem); // コンソールに出力するだけ

  setDescription("");
  setQuantity(1);
}
```

**期待される出力例**：

```jsx
{
  description: "Shirts",
  quantity: 10,
  packed: false,
  id: 1703123456789
}
```

### データを保存する場所の検討

この新しいアイテムデータを保存し、他のコンポーネントで使用したいと考えています。適切な解決策を見つけましょう。

**フローチャートによる判断**：

1. **データは時間と共に変化するか？** → はい（新しいアイテムが追加されるたび）
2. **既存の state や props から計算できるか？** → いいえ
3. **状態更新時にコンポーネントを再レンダリングすべきか？** → はい（UI を更新したい）

→ **結論**: `useState` フックを使用して新しい state を作成する必要があります

### アイテムリスト用のステートの作成

Form コンポーネント内にアイテムリスト用の state を作成します：

```jsx
function Form() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]); // 新しいstate

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };

    handleAddItems(newItem); // アイテムを配列に追加

    setDescription("");
    setQuantity(1);
  }
}
```

**重要なポイント**：

- **イミュータブルな更新**: `[...items, item]` でスプレッド演算子を使用
- React では配列の直接変更（push 等）は禁止されています
- 新しい配列を作成して、既存のアイテム + 新しいアイテムを含める

### コンポーネント間でのデータ共有の問題

しかし、ここで重要な問題が発生します。`items` ステートは Form コンポーネント内にありますが、実際にアイテムを表示するのは PackingList コンポーネントです。

**現在のコンポーネント構造**：

```
App
├── Logo
├── Form (← items state はここ)
├── PackingList (← 表示はここで必要)
└── Stats
```

### React の一方向データフロー

React では、**データは親から子へのみ流れ**ます。兄弟コンポーネント間（Form と PackingList）では、直接データを共有することはできません。

**不可能な操作**：

- Form から PackingList への直接的な props 渡し
- 横向きまたは上向きのデータフロー

### 解決策：ステートのリフトアップ

この問題を解決するために、「**ステートのリフトアップ**」という技術を使用する必要があります。

次のセッションでは、以下について詳しく学習します：

- ステートを共通の親コンポーネントに移動する方法
- 親から子への props 渡しによるデータ共有
- 子から親への通信（関数を props として渡す）

この解決策により、Form で作成されたデータを PackingList で表示し、さらに Stats コンポーネントで統計情報を計算することが可能になります。

React の状態管理とコンポーネント間通信は、スケーラブルなアプリケーションを構築するための基盤となる重要な概念です。一度このパターンを理解すれば、どのような複雑なアプリケーションでも適用できるようになります。

## 🎯 実践演習：SessionA - State vs Props と Flashcards 演習

このセッションで学んだ制御されたコンポーネントの理解を深めるため、次に **SessionA** に取り組むことをお勧めします。

### SessionA で学習すること

1. **State vs Props の違いの体系的理解**

   - 内部データ（State）と外部データ（Props）の概念整理
   - 実際のコード例を通じた理解深化

2. **Flashcards 演習（実践プロジェクト）**

   - 一つの状態変数で複数の UI 要素を制御する方法
   - クリックイベントによる状態変更の実装
   - 条件付きレンダリングの活用法

3. **状態管理の実践パターン**
   - 排他制御（一度に一つだけ表示）の実装
   - ユーザーインタラクションに応じた動的 UI 変更

### 学習の流れ

```
Session2完了 → SessionA実施 → Session3継続
```

SessionA は独立した演習プロジェクトのため、いつでも取り組むことができます。制御されたコンポーネントの概念を実践で確認し、次のセッションでのステート管理をより効果的に学習できるようになります。

---

### 次のステップへの準備

次のセッションでは、今回特定した課題を解決します：

- **ステートのリフトアップ**: 共通の親コンポーネントへの状態移動
- **親子間通信**: 関数を props として渡すテクニック
- **データフローの設計**: スケーラブルなアプリケーション構造

これらの概念により、個別のコンポーネントが協調して動作する、完全に機能するアプリケーションを構築できるようになります。制御されたコンポーネントの理解は、これらの高度な概念を学ぶための重要な基盤となります。
