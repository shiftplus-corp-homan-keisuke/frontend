# STEP02: ピザアプリ作成 - 実践プロジェクト

## 📋 プロジェクト概要

このプロジェクトでは、React + TypeScript + Vite + TailwindCSSを使用してピザメニューアプリを作成します。学習者は段階的に空のコンポーネントテンプレートから完全なピザアプリを構築していきます。

## 🎯 学習目標

- React 19.1.0の最新機能を理解する
- TypeScript 5.8.3での型安全なコンポーネント開発
- Vite 6.3.5による高速開発環境の活用
- TailwindCSS 4.1.8でのモダンスタイリング
- コンポーネント設計とpropsの受け渡し
- 条件分岐とリストレンダリング
- 時間に基づく動的な表示制御

## 🛠️ 技術スタック

- **React**: 19.1.0
- **TypeScript**: 5.8.3
- **Vite**: 6.3.5
- **TailwindCSS**: 4.1.8
- **ESLint**: 9.x (新形式設定)

## 📁 プロジェクト構造

```
STEP02_実践プロジェクト/
├── src/
│   ├── components/           # 完成形コンポーネント
│   │   ├── Header.tsx
│   │   ├── Menu.tsx
│   │   ├── Pizza.tsx
│   │   └── Footer.tsx
│   ├── components/templates/ # 学習者用テンプレート
│   │   ├── Header.template.tsx
│   │   ├── Menu.template.tsx
│   │   ├── Pizza.template.tsx
│   │   └── Footer.template.tsx
│   ├── types/               # 型定義
│   │   └── index.ts
│   ├── data/               # データ
│   │   └── pizzaData.ts
│   ├── App.tsx             # メインアプリケーション
│   ├── main.tsx           # エントリーポイント
│   ├── index.css          # グローバルスタイル
│   └── demo.html          # 完成形デモ
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
├── eslint.config.js
└── README.md
```

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

### 3. 完成形デモの確認

ブラウザで `src/demo.html` を開いて、最終的な完成形を確認してください。

## 📚 実装ガイド

### Phase 1: Headerコンポーネントの実装

**ファイル**: `src/components/templates/Header.template.tsx`

**タスク**:
1. `HeaderProps`インターフェースを使用してpropsを受け取る
2. `title`プロパティを表示する`h1`要素を含む`header`要素を返す
3. 適切なTypeScript型注釈を追加する

**実装例**:
```tsx
function Header({ title }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
}
```

### Phase 2: Pizzaコンポーネントの実装

**ファイル**: `src/components/templates/Pizza.template.tsx`

**タスク**:
1. `PizzaProps`インターフェースを使用してpropsを受け取る
2. `pizzaObj.soldOut`に基づいて条件付きクラス名を設定する
3. ピザの画像、名前、材料、価格を表示する
4. 売り切れの場合は"SOLD OUT"を表示し、そうでなければ価格を表示する

**実装例**:
```tsx
function Pizza({ pizzaObj }: PizzaProps) {
  const pizzaClassName = pizzaObj.soldOut ? "pizza sold-out" : "pizza";

  return (
    <li className={pizzaClassName}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>{pizzaObj.soldOut ? "SOLD OUT" : `$${pizzaObj.price}`}</span>
      </div>
    </li>
  );
}
```

### Phase 3: Menuコンポーネントの実装

**ファイル**: `src/components/templates/Menu.template.tsx`

**タスク**:
1. `pizzaData`の配列の長さを取得して`numPizzas`変数に格納する
2. 条件分岐でピザが存在する場合とない場合の表示を切り替える
3. `map`関数を使用してピザデータを`Pizza`コンポーネントにレンダリングする
4. 適切な`key`属性を設定する

**実装例**:
```tsx
function Menu() {
  const numPizzas = pizzaData.length;

  return (
    <main className="menu">
      <h2>Our Menu</h2>
      {numPizzas > 0 ? (
        <ul className="pizzas">
          {pizzaData.map((pizza) => (
            <Pizza pizzaObj={pizza} key={pizza.id} />
          ))}
        </ul>
      ) : (
        <p>現在、ピザの準備中です。しばらくお待ちください 😊</p>
      )}
    </main>
  );
}
```

### Phase 4: Footerコンポーネントの実装

**ファイル**: `src/components/templates/Footer.template.tsx`

**タスク**:
1. 現在の時刻を取得して`hour`変数に格納する
2. 営業時間の定数を設定する（`openHour: 12`, `closeHour: 22`）
3. 現在時刻が営業時間内かどうかを判定する`isOpen`変数を作成する
4. 条件分岐で営業中と閉店中の表示を切り替える
5. 営業中の場合は注文ボタンも表示する

**実装例**:
```tsx
function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

  return (
    <footer>
      <div className="order">
        {isOpen ? (
          <>
            <p>現在開店中！ {openHour}:00 から {closeHour}:00 まで営業しています。</p>
            <button className="btn">今すぐ注文</button>
          </>
        ) : (
          <p>現在閉店中。 {openHour}:00 に開店します。</p>
        )}
      </div>
    </footer>
  );
}
```

## 🔧 型定義について

### Pizza型
```tsx
export interface Pizza {
  id: number;
  name: string;
  ingredients: string;
  price: number;
  photoName: string;
  soldOut: boolean;
}
```

### HeaderProps型
```tsx
export interface HeaderProps {
  title: string;
}
```

### PizzaProps型
```tsx
export interface PizzaProps {
  pizzaObj: Pizza;
}
```

## 🎨 スタイリング

プロジェクトでは以下のCSSクラスが定義されています：

- `.container`: メインコンテナ
- `.menu`: メニューセクション
- `.pizzas`: ピザリストのグリッド
- `.pizza`: 個別のピザアイテム
- `.pizza.sold-out`: 売り切れピザのスタイル
- `.order`: 注文セクション
- `.btn`: ボタンスタイル

## 🧪 テスト手順

### 1. 基本表示の確認
- ヘッダーにタイトルが表示されているか
- ピザリストが正しく表示されているか
- フッターに営業状況が表示されているか

### 2. 動的機能の確認
- 売り切れピザが正しくグレーアウトされているか
- 営業時間に応じてフッターの表示が変わるか
- 注文ボタンが営業時間内のみ表示されるか

### 3. レスポンシブデザインの確認
- 異なる画面サイズで正しく表示されるか
- ピザリストのグリッドが適切に調整されるか

## 🐛 トラブルシューティング

### TypeScriptエラーが発生する場合
1. `npm install`で依存関係が正しくインストールされているか確認
2. `tsconfig.json`の設定が正しいか確認
3. 型定義ファイル（`src/types/index.ts`）が正しくインポートされているか確認

### スタイルが適用されない場合
1. `src/index.css`が正しくインポートされているか確認
2. CSSクラス名が正しく設定されているか確認
3. ブラウザのキャッシュをクリアしてみる

## 📖 参考資料

- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🎉 完成後の次のステップ

1. **機能拡張**: 注文機能の実装、カート機能の追加
2. **状態管理**: React Context APIやZustandの導入
3. **API連携**: バックエンドAPIとの連携
4. **テスト**: Jest + React Testing Libraryでのテスト実装
5. **デプロイ**: Vercel、Netlifyでのデプロイ

## 💡 学習のポイント

- **コンポーネント設計**: 単一責任の原則に従った小さなコンポーネント
- **型安全性**: TypeScriptを活用した堅牢なコード
- **再利用性**: propsを活用した柔軟なコンポーネント
- **保守性**: 読みやすく理解しやすいコード構造

頑張って実装してください！🚀