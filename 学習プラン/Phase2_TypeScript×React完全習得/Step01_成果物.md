# Step01 成果物：ソーシャルメディア風プロフィールアプリ

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存の React アプリに TypeScript の型安全なコンポーネントを追加する

**なぜ作るのか**: Step01 で学習した React 基礎と TypeScript 統合を実際のコードに適用し、**React + TypeScript の基本パターンを習得する力**を身につけるため

**学習目標**:

- 既存の React アプリの構造を理解し、新しいコンポーネントを追加できる
- Props、State、イベントハンドラーを型安全に実装できる
- useState を使った状態管理を適切に行える
- React コンポーネントの基本パターンを習得できる

---

## 📋 必須提出物

以下の 2 つのファイルを提出してください：

```
📁 提出物/
├── LikeButton.tsx      # いいねボタンコンポーネント（必須）
└── CommentForm.tsx     # コメント投稿フォーム（必須）
```

---

## 🏗️ サンプルアプリの構成

### 📁 プロジェクト構造

提供されるサンプルアプリは以下の構成になっています：

```
Step01_成果物/
├── 📄 package.json          # プロジェクト設定・依存関係
├── 📄 tsconfig.json         # TypeScript設定
├── 📄 vite.config.ts        # Vite設定（開発サーバー）
├── 📄 index.html            # HTMLエントリーポイント
├── 📄 README.md             # プロジェクト説明
├── 📁 src/                  # ソースコードディレクトリ
│   ├── 📄 main.tsx          # アプリケーションエントリーポイント
│   ├── 📄 App.tsx           # メインアプリケーションコンポーネント
│   ├── 📄 index.css         # グローバルスタイル
│   ├── 📁 components/       # Reactコンポーネント
│   │   ├── 📄 UserProfile.tsx    # ユーザープロフィール（完成済み）
│   │   ├── 📄 LikeButton.tsx     # いいねボタン（課題対象）
│   │   └── 📄 CommentForm.tsx    # コメントフォーム（課題対象）
│   └── 📁 types/           # TypeScript型定義
│       └── 📄 index.ts      # 共通型定義
└── 📁 node_modules/        # 依存ライブラリ（npm install後）
```

### 🔧 技術スタック

| 技術           | バージョン | 用途                           |
| -------------- | ---------- | ------------------------------ |
| **React**      | 19.0.0     | UI ライブラリ                  |
| **TypeScript** | 5.6.2      | 型安全な JavaScript            |
| **Vite**       | 6.0.1      | 高速開発サーバー・ビルドツール |
| **ESLint**     | 9.13.0     | コード品質チェック             |

### 📋 既存コンポーネントの概要

#### 1. App.tsx（メインアプリケーション）

- **役割**: アプリケーション全体の構造とレイアウト
- **機能**:
  - ユーザーデータの管理
  - コメント一覧の状態管理
  - 各コンポーネントへのデータ受け渡し
- **重要なポイント**: 課題で作成するコンポーネントがここで使用される

#### 2. UserProfile.tsx（完成済み）

- **役割**: ユーザー情報の表示
- **機能**:
  - プロフィール画像、名前、メールアドレスの表示
  - 自己紹介文の表示
  - フォロワー数、フォロー数、投稿数の統計表示
- **学習ポイント**: TypeScript 型定義の実践例

#### 3. types/index.ts（型定義）

- **役割**: アプリケーション全体で使用する型の定義
- **定義済み型**:
  - `User`: ユーザー情報の型
  - `Comment`: コメント情報の型
- **学習ポイント**: インターフェースの設計パターン

### 🎯 課題対象コンポーネント

以下の 2 つのコンポーネントを実装することが課題です：

#### 📝 LikeButton.tsx（実装対象）

- **期待される機能**:
  - いいね数の表示と管理
  - クリックによるいいね状態の切り替え
  - 視覚的なフィードバック（色の変化、アイコン変更）
  - 親コンポーネントへのコールバック

#### 📝 CommentForm.tsx（実装対象）

- **期待される機能**:
  - テキストエリアでのコメント入力
  - フォーム送信処理
  - 入力値の検証（空文字チェック）
  - 送信後の入力フィールドクリア

### 🔄 データフロー

```
App.tsx (状態管理)
    ↓ props
UserProfile.tsx (表示)
    ↓ props
LikeButton.tsx (課題) → callback → App.tsx
    ↓ props
CommentForm.tsx (課題) → callback → App.tsx
    ↓ state update
コメント一覧表示
```

### 💡 学習のポイント

1. **型安全性**: すべてのコンポーネントで TypeScript の型定義を活用
2. **状態管理**: `useState`を使った適切な状態管理
3. **コンポーネント設計**: 再利用可能で保守しやすいコンポーネント設計
4. **イベント処理**: TypeScript での型安全なイベントハンドリング

---

## ⏰ 作成手順（推奨時間配分：合計 40 分）

### Phase 1: 既存アプリの理解（10 分）

#### ステップ 1-1: 提供された React アプリを理解する（10 分）

以下の手順でサンプルアプリを起動し、構造を理解してください：

1. **環境構築**

   ```bash
   cd Step01_成果物
   npm install
   npm run dev
   ```

2. **アプリの動作確認**

   - ブラウザで http://localhost:5173 にアクセス
   - 基本的なプロフィール表示を確認

3. **コード構造の理解**
   - `src/App.tsx` - メインアプリケーション
   - `src/components/UserProfile.tsx` - ユーザープロフィール（完成済み）
   - `src/types/index.ts` - 型定義

### Phase 2: コンポーネント実装（25 分）

#### ステップ 2-1: いいねボタンコンポーネントの作成（12 分）

`src/components/LikeButton.tsx` を作成してください：

**要件:**

- いいね数の表示と管理
- ボタンクリックでいいね数を増減
- いいね済み状態の視覚的表示
- TypeScript による型安全な実装

```tsx
// src/components/LikeButton.tsx
import { useState } from "react";

// TODO: 以下の型定義を完成させてください
interface LikeButtonProps {
  // 初期いいね数（オプショナル、デフォルト: 0）
  // いいね数変更時のコールバック（オプショナル）
}

function LikeButton(/* TODO: propsの型注釈を追加 */){
  // TODO: useState でいいね数と状態を管理
  // ヒント: いいね数(number)といいね済み状態(boolean)の2つの状態が必要

  // TODO: いいねボタンクリック時の処理
  const handleLikeClick = (): void => {
    // いいね済み状態を切り替え
    // いいね数を増減
    // コールバック関数があれば呼び出し
  };

  return (
    <button
      onClick={handleLikeClick}
      style={
        {
          // TODO: いいね済み状態に応じてスタイルを変更
          // ヒント: backgroundColor, color を状態に応じて変更
        }
      }
    >
      {/* TODO: いいね済み状態に応じてアイコンを変更 */}
      {/* いいね数を表示 */}
    </button>
  );
}

export default LikeButton;
```

#### ステップ 2-2: コメント投稿フォームの作成（13 分）

`src/components/CommentForm.tsx` を作成してください：

**要件:**

- コメント入力フィールド
- 投稿ボタン
- フォーム送信時の処理
- 入力値の状態管理

```tsx
// src/components/CommentForm.tsx
import { useState } from "react";

// TODO: 以下の型定義を完成させてください
interface CommentFormProps {
  // コメント投稿時のコールバック
}

function CommentForm(/* TODO: propsの型注釈を追加 */) {
  // TODO: useState でコメント入力値を管理

  // TODO: フォーム送信時の処理
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    // デフォルトの送信動作を防ぐ
    // 入力値が空でないかチェック
    // コールバック関数を呼び出し
    // 入力フィールドをクリア
  };

  // TODO: 入力値変更時の処理
  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    // 入力値を状態に反映
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="comment">コメント:</label>
        <textarea
          id="comment"
          // TODO: value, onChange, placeholder を設定
          rows={3}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            resize: "vertical",
          }}
        />
      </div>
      <button
        type="submit"
        // TODO: 入力値が空の場合はボタンを無効化
        style={{
          marginTop: "8px",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        投稿
      </button>
    </form>
  );
}

export default CommentForm;
```

### Phase 3: 動作確認（5 分）

#### ステップ 3-1: App.tsx での統合と動作確認

1. `src/App.tsx` に作成したコンポーネントをインポート
2. UserProfile コンポーネントの下に配置
3. ブラウザで動作確認
4. TypeScript エラーがないことを確認

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件

- [ ] TypeScript でコンパイルエラーが発生しない
- [ ] **必要な型定義（interface）を 2 つ以上作成している**
- [ ] すべての Props に適切な型注釈が付いている
- [ ] useState を型安全に使用している
- [ ] イベントハンドラーに適切な型注釈が付いている

### 🎯 機能要件

- [ ] いいねボタンが正しく動作する（クリックで数値が増減）
- [ ] いいね済み状態の視覚的表示ができている
- [ ] コメントフォームで入力・送信ができる
- [ ] 空のコメントは投稿できない仕様になっている
- [ ] フォーム送信後に入力フィールドがクリアされる

### 💭 React パターン要件

- [ ] useState を適切に使用している
- [ ] イベントハンドラーが正しく実装されている
- [ ] 条件付きレンダリングを活用している
- [ ] コンポーネントが再利用可能な設計になっている

---

## 📊 評価基準

| 項目               | 配点  | 評価ポイント                                   |
| ------------------ | ----- | ---------------------------------------------- |
| **型安全性**       | 40 点 | Props、State、イベントハンドラーの適切な型定義 |
| **React パターン** | 35 点 | useState、イベント処理、コンポーネント設計     |
| **機能実装**       | 25 点 | 要件通りの動作、ユーザビリティ                 |

**合格ライン**: 70 点以上

---

## 💡 実装のヒント

### 🤔 型を考える時の質問

1. **この Props には何が入る？**

   - `initialLikes` → 数値が入る → `number`
   - `onLikeChange` → 関数が入る → `(likes: number, isLiked: boolean) => void`

2. **この State は何を管理する？**

   - いいね数 → `number`
   - いいね済み状態 → `boolean`
   - コメント入力値 → `string`

3. **このイベントハンドラーは何を受け取る？**
   - ボタンクリック → `React.MouseEvent<HTMLButtonElement>`
   - フォーム送信 → `React.FormEvent<HTMLFormElement>`
   - 入力変更 → `React.ChangeEvent<HTMLTextAreaElement>`

### 📝 型注釈の例

```typescript
// Props の型定義
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean; // オプショナル
}

// State の型指定
const [count, setCount] = useState<number>(0);
const [isActive, setIsActive] = useState<boolean>(false);

// イベントハンドラーの型注釈
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  console.log("Button clicked");
};
```

### ⚠️ よくある間違い

1. **useState の型指定忘れ**

   ```typescript
   // ❌ 間違い
   const [likes, setLikes] = useState(0);

   // ✅ 正解
   const [likes, setLikes] = useState<number>(0);
   ```

2. **イベントハンドラーの型注釈忘れ**

   ```typescript
   // ❌ 間違い
   const handleSubmit = (event) => {
     event.preventDefault();
   };

   // ✅ 正解
   const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
     event.preventDefault();
   };
   ```

3. **オプショナルプロパティの見落とし**

   ```typescript
   // ❌ 間違い：onLikeChangeは常に必要ではない
   interface LikeButtonProps {
     initialLikes: number;
     onLikeChange: (likes: number, isLiked: boolean) => void;
   }
   
   // ✅ 正解：onLikeChangeは任意
   interface LikeButtonProps {
     initialLikes?: number;
     onLikeChange?: (likes: number, isLiked: boolean) => void;
   }
   ```

---

## 📚 参考：完成例（実装に困った場合）

```tsx
// LikeButton.tsx の完成例
import { useState } from "react";

interface LikeButtonProps {
  initialLikes?: number;
  onLikeChange?: (likes: number, isLiked: boolean) => void;
}

function LikeButton({
  initialLikes = 0,
  onLikeChange,
}: LikeButtonProps){
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleLikeClick = (): void => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;

    setIsLiked(newIsLiked);
    setLikes(newLikes);

    if (onLikeChange) {
      onLikeChange(newLikes, newIsLiked);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      style={{
        padding: "8px 16px",
        backgroundColor: isLiked ? "#ff6b6b" : "#f8f9fa",
        color: isLiked ? "white" : "#333",
        border: "1px solid #ddd",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {isLiked ? "❤️" : "🤍"} {likes}
    </button>
  );
}

export default LikeButton;
```

```tsx
// CommentForm.tsx の完成例
import { useState } from "react";

interface CommentFormProps {
  onCommentSubmit: (comment: string) => void;
}

function CommentForm({ onCommentSubmit }: CommentFormProps) {
  const [comment, setComment] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (comment.trim() === "") {
      return;
    }

    onCommentSubmit(comment);
    setComment("");
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setComment(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="comment">コメント:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={handleInputChange}
          placeholder="コメントを入力してください..."
          rows={3}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            resize: "vertical",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={comment.trim() === ""}
        style={{
          marginTop: "8px",
          padding: "8px 16px",
          backgroundColor: comment.trim() === "" ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: comment.trim() === "" ? "not-allowed" : "pointer",
        }}
      >
        投稿
      </button>
    </form>
  );
}

export default CommentForm;
```

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] いいねボタンにアニメーション効果を追加
- [ ] コメント一覧表示機能の実装
- [ ] ローカルストレージでの状態保存
- [ ] コンポーネントのテストコード作成

---

**📌 重要**: この課題の目的は**React + TypeScript の基本パターンを習得する力**を身につけることです。実際の開発現場でよく使用されるパターンを体験しましょう。

**🌟 次のステップ**: Step02 では、より高度なコンポーネント型設計について学習します！
