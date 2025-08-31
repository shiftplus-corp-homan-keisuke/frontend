# Session3: 状態管理とデータの流れ

## セクション概要

前回のセッションでは、制御された要素の基本概念を学習しました。今回は、制御された要素を完成させ、フォームデータを実際に処理する方法を学習します。

また、コンポーネント間でのデータの流れについて理解を深め、状態とpropsの違いを明確にします。これらの概念は、Reactアプリケーション開発において最も重要な基礎知識です。

## 制御された要素の完成

前回、入力フィールドを制御された要素にする3つのステップを学習しました。今回は、その実装を完成させましょう。

### 制御された要素の3つのステップの復習

1. **状態の作成**: useStateを使用して状態変数を作成
2. **値の設定**: 入力要素のvalue属性に状態変数を設定
3. **変更の処理**: onChangeイベントハンドラーで状態を更新

### 入力フィールドの制御された要素化

まず、テキスト入力フィールドから始めましょう。

```javascript
import { useState } from 'react';

function Form() {
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      
      <select>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      
      <input 
        type="text" 
        placeholder="Item..." 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <button>Add</button>
    </form>
  );
}
```

ここで重要なのは、`value={description}`と`onChange`の両方が必要だということです。

### 制御された要素の動作原理の詳細理解

制御された要素がどのように動作するかを詳しく理解しましょう。

**ステップ1: 初期状態**
- `description`は空文字列""
- 入力フィールドの値も空

**ステップ2: ユーザーが入力**
- ユーザーが「test」と入力
- onChangeイベントが発生
- `e.target.value`は「test」
- `setDescription("test")`が実行される

**ステップ3: 再レンダリング**
- 状態が更新されたため、コンポーネントが再レンダリング
- 入力フィールドの`value`が新しい状態値「test」に設定される

この流れを視覚的に確認するために、React Developer Toolsを使用すると、状態の変化をリアルタイムで観察できます。

### select要素の制御された要素化

同じ原理をselect要素にも適用しましょう。

```javascript
import { useState } from 'react';

function Form() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      
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
        placeholder="Item..." 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <button>Add</button>
    </form>
  );
}
```

**重要なポイント**:
- `e.target.value`は常に文字列として返されるため、`Number()`を使用して数値に変換
- デフォルト値を1に設定（最も一般的な数量）

### データ型の注意点

React Developer Toolsを使用すると、状態の値が文字列か数値かを確認できます。

- 初期値が数値（例：`useState(1)`）の場合、状態は数値として表示
- onChangeで更新された値は、変換しない限り文字列として表示

```javascript
// ❌ 文字列として保存される
onChange={(e) => setQuantity(e.target.value)}

// ✅ 数値として保存される
onChange={(e) => setQuantity(Number(e.target.value))}
```

## フォームデータの処理

制御された要素が完成したので、フォームデータを実際に処理してみましょう。

### 新しいアイテムオブジェクトの作成

フォーム送信時に、入力されたデータから新しいアイテムオブジェクトを作成します。

```javascript
function Form() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!description) return;

    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now()
    };

    console.log(newItem);

    // フォームをリセット
    setDescription("");
    setQuantity(1);
  }

  // ... JSX
}
```

**コードの詳細説明**:

1. **バリデーション**: `if (!description) return;`
   - 説明が空の場合は処理を中断
   - ガード句パターンの使用

2. **オブジェクト作成**: 
   - `description`と`quantity`は制御された要素から取得
   - `packed`はデフォルトでfalse（未パッキング状態）
   - `id`は`Date.now()`で一意の値を生成（簡易的な方法）

3. **フォームリセット**:
   - 送信後、フォームを初期状態に戻す
   - 制御された要素の利点：状態を更新するだけでUIが自動更新

### 制御された要素の利点

制御された要素を使用することで、以下の利点があります：

1. **簡単なフォームリセット**: 状態を初期値に戻すだけ
2. **リアルタイムバリデーション**: 入力中に即座に検証可能
3. **データの一元管理**: すべてのフォームデータがReact状態で管理
4. **予測可能な動作**: UIは常に状態を反映

## コンポーネント間のデータの流れ

現在、フォームで作成したデータをコンソールに出力していますが、実際のアプリケーションでは、このデータをPackingListコンポーネントに表示したいと思います。

### 問題の特定

```
App
├── Logo
├── Form (データを作成)
├── PackingList (データを表示したい)
└── Stats
```

FormコンポーネントとPackingListコンポーネントは兄弟関係にあります。Reactでは、データは親から子へのみ流れるため、兄弟コンポーネント間で直接データを共有することはできません。

### 解決策：状態のリフトアップ

この問題を解決するには、**状態のリフトアップ**という技術を使用します。

1. 共有したい状態を共通の親コンポーネント（App）に移動
2. 親コンポーネントから子コンポーネントにpropsとしてデータを渡す
3. 子コンポーネントから親コンポーネントに関数を通じてデータを送信

この概念は次のセッションで詳しく実装します。

## 状態 vs Props

Reactを学習する上で最も重要な概念の一つが、状態（state）とprops（プロパティ）の違いです。

### 状態（State）の特徴

**内部データ**：
- コンポーネントが所有するデータ
- そのコンポーネント内で宣言される
- コンポーネントの「メモリ」として機能

**更新可能**：
- コンポーネント自身が更新できる
- 更新すると再レンダリングが発生
- インタラクティブ性を実現

**例**：
```javascript
function Counter() {
  const [count, setCount] = useState(0); // 内部状態
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        増加
      </button>
    </div>
  );
}
```

### Props の特徴

**外部データ**：
- 親コンポーネントから渡されるデータ
- 関数のパラメータのような役割
- 親子間のコミュニケーション手段

**読み取り専用**：
- 受け取ったコンポーネントは変更できない
- 親コンポーネントが更新すると子も再レンダリング
- 子コンポーネントの設定として機能

**例**：
```javascript
// 親コンポーネント
function App() {
  const [upVotes, setUpVotes] = useState(0);
  
  return (
    <Question 
      title="Reactとは何ですか？"
      upVotes={upVotes} // propsとして渡す
    />
  );
}

// 子コンポーネント
function Question({ title, upVotes }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>👍 {upVotes}</p>
    </div>
  );
}
```

### 状態とPropsの関係

重要な点は、状態とpropsが密接に関連していることです：

1. **状態がpropsとして渡される**：
   - 親コンポーネントの状態が子コンポーネントのpropsになる

2. **状態更新による連鎖的再レンダリング**：
   - 親の状態が更新されると、親コンポーネントが再レンダリング
   - その状態をpropsとして受け取る子コンポーネントも再レンダリング

3. **データの同期**：
   - この仕組みにより、アプリケーション全体でデータが同期される

### 比較表

| 特徴 | State | Props |
|------|-------|-------|
| データの所有者 | コンポーネント自身 | 親コンポーネント |
| 変更可能性 | 変更可能 | 読み取り専用 |
| 用途 | インタラクティブ性 | 設定・データ渡し |
| 更新時の動作 | 再レンダリング発生 | 新しい値で再レンダリング |
| 類似概念 | メモリ | 関数パラメータ |

## 実践演習：制御された要素の理解確認

制御された要素の理解を深めるために、以下の演習を行ってみましょう。

### 演習1: 基本的な制御された要素

```javascript
function NameForm() {
  const [name, setName] = useState("");
  
  return (
    <form>
      <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前を入力"
      />
      <p>入力された名前: {name}</p>
    </form>
  );
}
```

### 演習2: 複数の制御された要素

```javascript
function UserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: 18
  });
  
  function handleChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }
  
  return (
    <form>
      <input 
        type="text"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="名前"
      />
      <input 
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="メール"
      />
      <input 
        type="number"
        value={formData.age}
        onChange={(e) => handleChange('age', Number(e.target.value))}
        placeholder="年齢"
      />
    </form>
  );
}
```

## まとめ

このセッションでは、以下の重要な概念を学習しました：

1. **制御された要素の完成**：
   - 3つのステップ（状態作成、値設定、変更処理）の実装
   - データ型の適切な処理（文字列から数値への変換）

2. **フォームデータの処理**：
   - バリデーション機能の実装
   - オブジェクト作成とフォームリセット
   - 制御された要素の利点の活用

3. **コンポーネント間のデータの流れ**：
   - 兄弟コンポーネント間でのデータ共有の課題
   - 状態のリフトアップの必要性

4. **状態とPropsの違い**：
   - 内部データ vs 外部データ
   - 変更可能 vs 読み取り専用
   - インタラクティブ性 vs 設定

制御された要素は、Reactでフォームを扱う標準的な方法です。この技術により、フォームデータを完全にReactの制御下に置き、予測可能で保守しやすいコードを書くことができます。

次のセッションでは、状態のリフトアップを実装し、実際にフォームからPackingListにデータを渡す方法を学習します。