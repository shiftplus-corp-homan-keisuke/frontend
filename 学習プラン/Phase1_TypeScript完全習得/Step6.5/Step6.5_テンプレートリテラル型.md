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

テンプレートリテラル型とジェネリクスを組み合わせることで得られる大きな利点は、**「特定のパターンを持つ文字列リテラルしか受け付けないように制約をかけ、プログラムの安全性と開発者体験を向上させる」**点にあります。

```typescript
// 利用可能なAPIリソースの型を定義
type ApiResource = "users" | "posts" | "products";

// APIクライアントを作成する関数
function createApiClient() {
  const fetchData = async <T>(endpoint: string): Promise<T> => {
    // 実際のアプリケーションでは、ここでfetch APIなどを使ってデータを取得します
    console.log(`Fetching data from: ${endpoint}`);
    // 以下はダミーのレスポンスです
    return {} as T;
  };

  return {
    // GETリクエスト用のメソッド
    // Tはリソース名を受け取るジェネリック型
    get<T extends ApiResource>(resource: T) {
      // テンプレートリテラル型でエンドポイントの型を動的に生成
      const endpoint: `/api/${T}` = `/api/${resource}`;
      return fetchData<any[]>(endpoint);
    },
    
    // 特定のIDを持つリソースを取得するメソッド
    getById<T extends ApiResource>(resource: T, id: number) {
      // こちらも同様に、より複雑なエンドポイントの型を生成
      const endpoint: `/api/${T}/${number}` = `/api/${resource}/${id}`;
      return fetchData<any>(endpoint);
    }
  };
}

const apiClient = createApiClient();

// --- 正しい使い方 ---
// 引数 'users' からエンドポイントの型が `/api/users` と推論される
apiClient.get("users");      // OK: "Fetching data from: /api/users" と出力される

// 引数 'posts', 123 からエンドポイントの型が `/api/posts/123` と推論される
apiClient.getById("posts", 123); // OK: "Fetching data from: /api/posts/123" と出力される

// --- 間違った使い方（エディタがエラーを検知） ---
// apiClient.get("comments");      // 型エラー: Argument of type '"comments"' is not assignable to parameter of type 'ApiResource'.
// apiClient.getById("products");  // 型エラー: Expected 2 arguments, but got 1.
```
