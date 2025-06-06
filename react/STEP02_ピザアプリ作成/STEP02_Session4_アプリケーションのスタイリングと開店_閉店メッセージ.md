# STEP02 Session 4: アプリケーションのスタイリングと開店/閉店メッセージ

> ⏰ **セッション時間**: 90 分
> 🎯 **目標**: アプリケーション全体のスタイリングを完成させ、開店/閉店のロジックとメッセージ、注文ボタンを実装する。
> 📋 **前提**: Session3 で学習した条件付きレンダリングと、既存のコンポーネント。

## 📅 セッション構成

| 時間     | 内容                                      | 形式 | 成果物                       |
| :------- | :---------------------------------------- | :--- | :--------------------------- |
| 0-15 分  | 導入: アプリケーションの全体設計と UX     | 講義 | デザインと UX の重要性理解   |
| 15-45 分 | フッターコンポーネントと開店/閉店ロジック | 実践 | 動的な開店/閉店メッセージ    |
| 45-75 分 | 注文ボタンの条件付き表示とスタイリング    | 実践 | スタイリングされた注文ボタン |
| 75-90 分 | まとめ・振り返り                          | 討論 | アプリケーションの完成度確認 |

## 🎯 学習目標の詳細

### 💡 このセッションで身につけること

- [ ] アプリケーションのフッターコンポーネントを作成し、動的な情報を表示できる
- [ ] 現在時刻に基づいて開店/閉店状態を判定するロジックを実装できる
- [ ] 条件付きレンダリングを用いて、開店/閉店メッセージや注文ボタンを適切に表示・非表示できる
- [ ] CSS Modules を使ってコンポーネント固有のスタイリングを適用できる
- [ ] アプリケーション全体の一貫したデザインを実現できる

### 📝 成果物

- 現在の営業時間に基づいて開店/閉店メッセージを表示するフッターコンポーネント
- 開店時にのみ表示される注文ボタン
- アプリケーション全体に適用された、統一感のあるスタイリング

## 📚 レクチャー 25-30: アプリケーションのスタイリングと開店/閉店メッセージ

### 🔍 なぜこの技術が重要なのか

💡 **実務での価値**:

- ユーザー体験（UX）はアプリケーションの成功に不可欠です。開店/閉店情報のような動的なメッセージは、ユーザーに適切な情報を提供し、行動を促します。
- スタイリングはアプリケーションの見た目を決定し、ブランドイメージや使いやすさに直結します。CSS Modules は、コンポーネントベースのスタイリングを効率的に行うための強力なツールです。
- 時間ベースのロジックは、営業時間表示、イベントのカウントダウン、コンテンツの公開・非公開など、様々なアプリケーションで利用されます。

🎯 **解決する課題**:

- ユーザーにリアルタイムな情報（例: 店舗の開店状況）を提供する。
- スタイルの衝突を避け、コンポーネントの独立性を保ちながらデザインを適用する。
- アプリケーションの見た目をプロフェッショナルで魅力的なものにする。

### 📝 実装の詳細解説

#### Level 1: 基礎実装 - フッターコンポーネントの作成

`src/components/Footer.tsx` を作成します。

```typescript
// 💡 基本的な実装例
// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  const hour = new Date().getHours(); // 現在の時間を取得
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour; // 開店中かどうかを判定

  return (
    <footer>
      <div className="order">
        {isOpen ? (
          <p>
            現在開店中！ {openHour}:00 から {closeHour}:00 まで営業しています。
          </p>
        ) : (
          <p>現在閉店中。 {openHour}:00 に開店します。</p>
        )}
        <button className="btn">今すぐ注文</button>
      </div>
    </footer>
  );
};

export default Footer;
```

`src/App.tsx` を修正して `Footer` コンポーネントを組み込みます。

```typescript
// 💡 基本的な実装例
// src/App.tsx
import React from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer"; // Footerコンポーネントをインポート

function App() {
  return (
    <div className="container">
      <Header title="ピザメニュー" />
      <main>
        <Menu />
      </main>
      {/* Footerコンポーネントを配置 */}
      <Footer />
    </div>
  );
}

export default App;
```

**🔍 解説ポイント**:

- `new Date().getHours()` で現在の時刻を取得し、開店時間と閉店時間を比較して `isOpen` を判定しています。
- 三項演算子を使って、`isOpen` の値に基づいて異なるメッセージを表示しています。

#### Level 2: 型安全な実装 - 注文ボタンの条件付き表示

`src/components/Footer.tsx` を修正します。

```typescript
// 🎯 型安全性を高めた実装
// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

  return (
    <footer>
      <div className="order">
        {isOpen ? (
          <>
            {" "}
            {/* Fragment を使用して複数の要素をグループ化 */}
            <p>
              現在開店中！ {openHour}:00 から {closeHour}:00
              まで営業しています。
            </p>
            <button className="btn">今すぐ注文</button>
          </>
        ) : (
          <p>現在閉店中。 {openHour}:00 に開店します。</p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
```

**⚠️ 注意点**:

- `isOpen` が `true` の場合に、メッセージとボタンの両方をレンダリングするために `<>` (Fragment) を使用しています。これにより、余分な DOM ノードを追加することなく複数の要素をグループ化できます。
- `button` 要素は `isOpen` が `true` の場合にのみレンダリングされるため、閉店時には表示されません。

#### Level 3: 実践的実装 - アプリケーション全体のスタイリング

`src/App.css` に以下のスタイルを追加します。

```css
/* 🚀 実務レベルの実装 */
/* src/App.css */

/* ... 既存のスタイル ... */

footer {
  margin-top: 6rem;
  padding: 2rem;
  background-color: #eee;
  text-align: center;
}

.order {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.order p {
  font-size: 1.8rem;
  font-weight: 500;
}

.btn {
  color: #fff;
  background-color: #a00;
  font-size: 1.8rem;
  font-weight: bold;
  padding: 1.2rem 2.4rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:hover {
  background-color: #c00;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

**📝 実装のコツ**:

- グローバルなスタイルシート (`App.css`) を利用して、アプリケーション全体に共通するデザイン要素（フォント、色、ボタンのスタイルなど）を定義します。
- ボタンのような再利用される UI 要素には、汎用的なクラス名（例: `btn`）を付けて、どこでも使えるようにします。
- `transition` プロパティを使って、ホバー時のアニメーションなど、ユーザー体験を向上させる細かな演出を加えることができます。

### 💻 実践演習

#### 演習 4-1: 閉店時に注文ボタンを無効化する

**🎯 演習目的**: 条件付きレンダリングとプロパティの動的な制御を組み合わせる。

**📋 要件**:

- `Footer` コンポーネントの注文ボタンを、閉店時間中は無効化（`disabled` 属性を `true` に設定）する。
- 開店時間中は有効化する。

**💡 ヒント**:

- `button` 要素の `disabled` 属性は真偽値を受け取ります。`isOpen` の逆の論理値 (`!isOpen`) を設定することで、閉店時にボタンを無効化できます。

**✅ 期待される結果**:

- 開店時間中は注文ボタンが有効になり、クリックできる。
- 閉店時間中は注文ボタンが無効になり、クリックできない。

### 🔍 理解度チェック

以下の質問に答えられるかチェックしてみましょう：

1. **基礎理解**: JavaScript で現在の時間を取得し、特定の時間範囲内にあるかどうかを判定する方法を説明してください。
2. **応用理解**: React で複数の要素をグループ化して条件付きレンダリングを行う際に、Fragment (`<>`) を使用するメリットは何ですか？
3. **実践理解**: アプリケーションのフッターに開店/閉店メッセージを表示することの、ユーザー体験上の利点を説明してください。

## 🗒️ セッションまとめ

### ✅ 今回学んだこと

- アプリケーションのフッターコンポーネントの作成と動的な情報表示
- 現在時刻に基づいた開店/閉店ロジックの実装
- 条件付きレンダリングによるメッセージとボタンの表示制御
- アプリケーション全体へのスタイリング適用と CSS の管理

### 📝 次回への準備

- 今回でピザメニューアプリケーションの主要な機能とスタイリングがほぼ完成しました。
- 次回は、これまでの学習内容を統合し、実践プロジェクトとしてアプリケーションを完成させます。

### 🔄 復習推奨項目

- JavaScript の Date オブジェクト
- React の条件付きレンダリングの応用
- CSS の基本的なスタイリングとセレクタ

---

**次のセッション**: [Session5](./STEP02_Session5_実践プロジェクト.md)
