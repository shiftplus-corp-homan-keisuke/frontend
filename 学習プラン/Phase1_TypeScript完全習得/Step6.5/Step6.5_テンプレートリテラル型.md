# Step 6.5: テンプレートリテラル型

## 📚 理論学習内容

### Section 1: テンプレートリテラル型の基礎

#### 🔍 テンプレートリテラル型とは？

**💡 なぜテンプレートリテラル型が重要なのか**

テンプレートリテラル型は、JavaScript のテンプレートリテラル（バッククォート `` ` `` で囲まれた文字列）と同じ構文を使い、型レベルで文字列を操作する機能です。これにより、特定パターンの文字列しか受け付けない型を定義したり、既存の型を元に新しい文字列リテラル型を動的に生成したりできます。API のパス、イベント名、CSS クラス名など、特定のフォーマットを持つ文字列を扱う際に、コンパイル時に型安全性を保証できるため、非常に強力です。

**🎯 どういう場面で使うのか**

- **API エンドポイントの型定義**: `/users/{id}` のようなパスパラメータを型安全に扱う
- **イベント名の型付け**: `user:created`, `post:updated` のようなイベント名を厳密に定義
- **CSS in JS**: スタイルコンポーネントのバリアントや状態を型で管理
- **国際化 (i18n)**: `common.ok`, `page.title` のような翻訳キーを型安全にする
- **動的なキーを持つオブジェクト**: 特定のプレフィックスを持つプロパティキーを定義

##### 1. 基本的な使い方

JavaScript のテンプレートリテラルと同様の構文で、型を定義します。

```typescript
type World = "world";
type Greeting = `hello ${World}`;
// type Greeting = "hello world"

type Px = `${number}px`;
// type Px = "0px" | "1px" | "2px" | ... | "100px" | ...

function setWidth(width: Px) {
  console.log(`Setting width to ${width}`);
}
setWidth("100px"); // OK
setWidth("50px"); // OK
// setWidth("100em"); // エラー: Type '"100em"' is not assign
```

##### 2. ユニオン型との組み合わせ

テンプレートリテラル内のプレースホルダーにユニオン型を渡すと、それぞれのユニオンメンバーの組み合わせで新しいユニオン型が生成されます。

```typescript
// 色とサイズの組み合わせ例
type Color = "red" | "blue" | "green";
type Size = "small" | "large";

// "red-small", "blue-large" のような組み合わせを生成
type ColorSize = `${Color}-${Size}`;
// type ColorSize = "red-small" | "red-large" | "blue-small" | "blue-large" | "green-small" | "green-large"

// 使用例
const item1: ColorSize = "red-small"; // OK
const item2: ColorSize = "blue-large"; // OK
// const invalid: ColorSize = "yellow-small"; // エラー: yellowは定義されていない
```

**📝 型変換の詳細解説**

- プレースホルダー `${...}` に具体的なリテラル型やリテラル型のユニオンを埋め込めます。
- 複数のプレースホルダーがある場合、それぞれのユニオンがクロス積（直積）として展開され、すべての組み合わせが生成されます。

### Section 2: 型推論と組み込み型操作

#### 🔍 高度な使い方

ジェネリクスと組み合わせることで、テンプレートリテラル型はさらに強力になります。

##### 1. 型推論との連携

ジェネリックな関数内でテンプレートリテラル型を使うと、渡された引数から型を推論し、より具体的な型を導き出すことができます。

```typescript
// 型推論を使った動的なメッセージ生成
function createMessage<T extends string>(prefix: T): `message-${T}` {
  return `message-${prefix}`;
}

// TypeScriptが引数から型を推論し、戻り値の型を決定する
const errorMsg = createMessage("error"); // 型: "message-error"
const warningMsg = createMessage("warning"); // 型: "message-warning"
const infoMsg = createMessage("info"); // 型: "message-info"

// 型推論により、戻り値の型が具体的に決まる
function handleMessage(msg: "message-error" | "message-warning") {
  console.log(`Handling: ${msg}`);
}

handleMessage(errorMsg); // OK: errorMsgの型は "message-error"
handleMessage(warningMsg); // OK: warningMsgの型は "message-warning"
// handleMessage(infoMsg);    // エラー: "message-info" は受け付けられない
```
