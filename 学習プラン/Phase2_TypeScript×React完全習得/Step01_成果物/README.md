# React 19 + TypeScript 学習用サンプルアプリ

Phase2 Step01「React基礎とTypeScript統合」の学習用サンプルアプリケーションです。

## 📋 概要

このアプリケーションは、React 19とTypeScriptの基礎を学習するためのソーシャルメディア風プロフィールアプリです。完成済みのUserProfileコンポーネントと、学習者が実装する課題コンポーネントで構成されています。

## 🎯 学習目標

- React 19 + TypeScript開発環境の理解
- JSX記法とTypeScriptの統合
- コンポーネント設計とProps型定義
- useState を使った状態管理
- イベントハンドリングの実装
- 型安全なコンポーネント開発

## 🚀 セットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

### その他のコマンド

```bash
# ビルド
npm run build

# リント
npm run lint

# プレビュー（ビルド後の確認）
npm run preview
```

## 📁 プロジェクト構成

```
src/
├── components/
│   ├── UserProfile.tsx      # 完成済み：ユーザープロフィール表示
│   ├── LikeButton.tsx       # 課題：いいねボタン（要実装）
│   └── CommentForm.tsx      # 課題：コメントフォーム（要実装）
├── types/
│   └── index.ts             # 型定義ファイル
├── App.tsx                  # メインアプリケーション
├── main.tsx                 # エントリーポイント
└── index.css                # グローバルスタイル
```

## 📝 課題内容

### 課題1: LikeButton コンポーネント

**ファイル**: `src/components/LikeButton.tsx`

**実装する機能**:
- いいね数の表示と管理
- ボタンクリックでいいね数を増減
- いいね済み状態の視覚的表示
- TypeScriptによる型安全な実装

**実装のヒント**:
- `useState` を使用していいね数と状態を管理
- ボタンの色やアイコンを状態に応じて変更
- `onLikeChange` コールバックの呼び出し

### 課題2: CommentForm コンポーネント

**ファイル**: `src/components/CommentForm.tsx`

**実装する機能**:
- コメント入力フィールド（投稿者名、コメント内容）
- 投稿ボタン
- フォーム送信時の処理
- 入力値の状態管理
- バリデーション（空文字チェック）

**実装のヒント**:
- `useState` を使用して入力値を管理
- フォーム送信時に `onSubmit` コールバックを呼び出し
- 送信後にフォームをリセット
- 適切なバリデーションとエラーハンドリング

## 🔧 技術スタック

- **React**: 19.0.0
- **TypeScript**: ~5.6.2
- **Vite**: ^6.0.1
- **ESLint**: ^9.13.0

## 📚 学習リソース

- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Vite公式ドキュメント](https://vite.dev/)

## 💡 実装例

### LikeButton の実装例

```tsx
function LikeButton({ initialLikes = 0, onLikeChange }: LikeButtonProps): JSX.Element {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleClick = (): void => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    const newIsLiked = !isLiked;
    
    setLikes(newLikes);
    setIsLiked(newIsLiked);
    
    onLikeChange?.(newLikes, newIsLiked);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: isLiked ? '#ff6b6b' : '#f8f9fa',
        color: isLiked ? 'white' : '#333',
        // その他のスタイル...
      }}
    >
      {isLiked ? '❤️' : '🤍'} {likes}
    </button>
  );
}
```

## 🎨 スタイリング

このプロジェクトでは、学習の簡素化のためインラインスタイルを使用しています。実際のプロジェクトでは、CSS ModulesやStyled Componentsなどの使用を検討してください。

## 🐛 トラブルシューティング

### TypeScriptエラーが表示される

依存関係がインストールされていない可能性があります：

```bash
npm install
```

### 開発サーバーが起動しない

ポートが使用中の場合は、別のポートを指定してください：

```bash
npm run dev -- --port 3000
```

## 📄 ライセンス

このプロジェクトは学習目的で作成されています。

## 🤝 貢献

学習用プロジェクトのため、プルリクエストは受け付けていませんが、質問や提案があればIssueでお知らせください。

---

**Phase2 Step01 - React基礎とTypeScript統合 学習用アプリ**