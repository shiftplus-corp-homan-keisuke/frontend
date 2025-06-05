# Session1: React基礎概念（90分）

> 💡 **対象**: TypeScript上級者・React初心者
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 90分（休憩含む）

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 📖 **[専門用語集](./STEP01_補足_専門用語集.md)** - React基礎概念の詳細解説
- 💻 **[実践コード例](./STEP01_補足_実践コード例.md)** - Hello Reactから始める段階的学習
- 🔧 **[開発環境ガイド](./STEP01_補足_開発環境ガイド.md)** - React + TypeScript環境構築
- 🚨 **[トラブルシューティング](./STEP01_補足_トラブルシューティング.md)** - 環境構築とReactエラー対処
- 🌐 **[参考リソース](./STEP01_補足_参考リソース.md)** - React学習リソース集

> 💡 **活用方法**: 学習中に疑問が生じた際や、より深く理解したい場合に参照してください

## 📅 セッション概要

**学習目標**:
- [ ] Reactの基本概念（仮想DOM、コンポーネント思考）の理解
- [ ] React vs. バニラJavaScriptの違いの理解
- [ ] JSXとTypeScriptの統合理解
- [ ] 最初のReactコンポーネントの作成

**前提知識**:
- TypeScript上級レベル（ジェネリクス、ユニオン型等）
- JavaScript ES6+の深い理解
- モダンフロントエンド開発の基礎

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                    | 講師の役割           | 学習者の活動     | 成果物       |
| ------------ | ----------------------- | -------------------- | ---------------- | ------------ |
| **0-10分**   | セッション概要・目標設定 | 説明・質疑応答       | 聞く・質問       | 理解確認     |
| **10-35分**  | React基礎概念理解       | 概念解説・デモ       | 個人学習・確認   | 概念整理     |
| **35-60分**  | JSX + TypeScript実践    | 実演・個別サポート   | ハンズオン       | 基本コード   |
| **60-80分**  | 最初のコンポーネント作成 | 巡回サポート・ヒント | 個人作業         | Helloコンポーネント |
| **80-90分**  | 振り返り・次回予告      | まとめ・予告         | 質問・確認       | 学習計画     |

---

## 📚 学習内容

### Section 1: Reactとは何か？（25分）

> 📚 **関連資料**: [専門用語集 - React基礎概念](./STEP01_補足_専門用語集.md#react基礎概念)

#### 🤔 なぜReactを学ぶのか

**💡 TypeScript上級者がReactを学ぶ3つの理由**

**理由1: 型安全性の最大化**
- TypeScriptの型システムとReactの組み合わせで、ランタイムエラーを大幅に削減
- Props、State、Eventの型安全性により、大規模アプリケーション開発が安全に
- 型推論とジェネリクスを活用した、保守性の高いコンポーネント設計

**理由2: 宣言的UI開発の効率性**
- 「どうなってほしいか」を記述するだけの直感的な開発
- 状態変化に応じた自動的なUI更新
- TypeScriptの型システムによる、予測可能なデータフロー

**理由3: エコシステムの豊富さ**
- TypeScript対応の豊富なライブラリとツール
- 型定義ファイルによる、安全なサードパーティライブラリ利用
- 企業レベルでの採用実績と安定性

#### 🔍 React vs. バニラJavaScript

**従来のDOM操作の課題**

```javascript
// ❌ 従来のDOM操作（複雑で保守困難）
const counter = document.getElementById("counter");
const button = document.getElementById("increment-btn");
let count = 0;

button.addEventListener("click", () => {
  count++;
  counter.textContent = count;
  
  // 状態が複雑になると管理が困難
  if (count > 10) {
    counter.style.color = "red";
  }
  if (count > 20) {
    button.disabled = true;
  }
  
  // さらに複雑な状態管理が必要になると...
  // - 複数の要素の同期
  // - イベントリスナーの管理
  // - メモリリークの防止
  // - 状態の一貫性保証
});
```

**Reactによる解決**

```tsx
// ✅ React + TypeScript（宣言的で保守しやすい）
interface CounterProps {
  initialCount?: number;
}

function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState<number>(initialCount);
  
  const handleIncrement = (): void => {
    setCount(prev => prev + 1);
  };
  
  return (
    <div>
      <span style={{ color: count > 10 ? 'red' : 'black' }}>
        {count}
      </span>
      <button
        onClick={handleIncrement}
        disabled={count > 20}
      >
        増加
      </button>
    </div>
  );
}
```

**TypeScript統合の利点**

```tsx
// 型安全性による開発効率向上
interface User {
  id: number;
  name: string;
  email: string;
}

// Props型定義により、使用方法が明確
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  // TypeScriptが型チェックを行い、バグを事前に防止
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>編集</button>
      <button onClick={() => onDelete(user.id)}>削除</button>
    </div>
  );
};
```

#### 🏗️ コンポーネントベースアーキテクチャ

**💡 なぜコンポーネント思考が重要なのか**

コンポーネントベースアーキテクチャは、UIを独立した再利用可能な部品として設計する手法です。TypeScript上級者にとって、これは以下の利点をもたらします：

**1. 型安全な責任分離**
- 各コンポーネントが明確な責任を持つ
- Props型定義により、コンポーネント間の契約が明確
- 変更影響範囲の限定化

**2. 再利用性とスケーラビリティ**
- ジェネリクスを活用した汎用コンポーネント
- 型制約による安全な再利用
- 大規模アプリケーションでの保守性確保

**3. テスタビリティ**
- 独立したコンポーネント単位でのテスト
- 型定義によるテストケースの明確化
- モックとスタブの型安全な作成

```tsx
// コンポーネント設計例
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Button({ 
  variant, 
  size, 
  disabled = false, 
  onClick, 
  children 
}: ButtonProps) {
  const className = `btn btn-${variant} btn-${size}`;
  
  return (
    <button 
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// 使用例（型安全）
<Button variant="primary" size="medium" onClick={() => console.log('clicked')}>
  送信
</Button>
```

---

### Section 2: JSXとTypeScriptの統合（35分）

> 📚 **関連資料**: [実践コード例 - JSX基礎](./STEP01_補足_実践コード例.md#jsx基礎)

#### 🎯 JSXの基本概念

**JSXとは何か**

JSX（JavaScript XML）は、JavaScriptの中でHTMLライクな記法を使用できる構文拡張です。TypeScriptと組み合わせることで、型安全なUI記述が可能になります。

**基本的なJSX記法**

```tsx
// 基本的なJSX
const element = <h1>Hello, React!</h1>;

// TypeScriptでの型注釈
const greeting: JSX.Element = <h1>Hello, TypeScript + React!</h1>;

// 式の埋め込み
const name: string = "太郎";
const element2: JSX.Element = <h1>こんにちは、{name}さん！</h1>;

// 属性の指定
const imageUrl: string = "/images/logo.png";
const image: JSX.Element = (
  <img 
    src={imageUrl} 
    alt="ロゴ" 
    width={100}
    height={50}
  />
);
```

**TypeScript特有のJSX型定義**

```tsx
// React.FCを使用したコンポーネント型定義
interface GreetingProps {
  name: string;
  age?: number;
}

// 方法1: React.FCを使用（型定義の学習用）
const Greeting: React.FC<GreetingProps> = ({ name, age }) => {
  return (
    <div>
      <h1>こんにちは、{name}さん！</h1>
      {age && <p>年齢: {age}歳</p>}
    </div>
  );
};

// 方法2: function宣言を使用（推奨）
function GreetingFunction({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>こんにちは、{name}さん！</h1>
      {age && <p>年齢: {age}歳</p>}
    </div>
  );
};

// JSX.Elementを明示的に返す関数
function createWelcomeMessage(name: string): JSX.Element {
  return <h2>ようこそ、{name}さん！</h2>;
}
```

#### 🔧 JSXの実践的な使用法

**条件付きレンダリング**

```tsx
interface UserStatusProps {
  isLoggedIn: boolean;
  username?: string;
}

function UserStatus({ isLoggedIn, username }: UserStatusProps) {
  return (
    <div>
      {isLoggedIn ? (
        <p>ようこそ、{username}さん！</p>
      ) : (
        <p>ログインしてください</p>
      )}
    </div>
  );
};

// 論理AND演算子を使用した条件付きレンダリング
function NotificationBadge({ count }: { count: number }) {
  return (
    <div>
      通知
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
};
```

**リストレンダリング**

```tsx
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: TodoItem[];
}

function TodoList({ todos }: TodoListProps) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
};
```

**イベントハンドリング**

```tsx
interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

function ClickableButton({ onClick, children }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
};

// 使用例
function App() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log('ボタンがクリックされました', event.currentTarget);
  };

  return <ClickableButton onClick={handleClick}>クリック</ClickableButton>;
}
```

---

### Section 3: 最初のReactコンポーネント（30分）

> 📚 **関連資料**: [実践コード例 - 最初のコンポーネント](./STEP01_補足_実践コード例.md#最初のコンポーネント)

#### 🎯 実践演習: Hello Reactコンポーネント

**ステップ1: 基本的なコンポーネント作成**

```tsx
// HelloWorld.tsx
import React from 'react';

// Props型定義
interface HelloWorldProps {
  name?: string;
  showTime?: boolean;
}

// 関数コンポーネントの定義
function HelloWorld({ 
  name = "World", 
  showTime = false 
}: HelloWorldProps) {
  const currentTime: string = new Date().toLocaleTimeString();
  
  return (
    <div className="hello-world">
      <h1>Hello, {name}!</h1>
      {showTime && <p>現在時刻: {currentTime}</p>}
    </div>
  );
};

export default HelloWorld;
```

**ステップ2: コンポーネントの使用**

```tsx
// App.tsx
import React from 'react';
import HelloWorld from './HelloWorld';

function App() {
  return (
    <div className="app">
      <HelloWorld />
      <HelloWorld name="React" />
      <HelloWorld name="TypeScript" showTime={true} />
    </div>
  );
}

export default App;
```

**ステップ3: 型安全性の確認**

```tsx
// 型エラーの例（学習用）
function App() {
  return (
    <div>
      {/* ✅ 正しい使用法 */}
      <HelloWorld name="太郎" showTime={true} />
      
      {/* ❌ 型エラー: nameは文字列である必要がある */}
      {/* <HelloWorld name={123} /> */}
      
      {/* ❌ 型エラー: showTimeはbooleanである必要がある */}
      {/* <HelloWorld showTime="yes" /> */}
      
      {/* ❌ 型エラー: 存在しないプロパティ */}
      {/* <HelloWorld invalidProp="test" /> */}
    </div>
  );
}
```

---

## 🎯 練習問題

### 練習問題1: 基本的なコンポーネント作成（15分）

以下の要件を満たすコンポーネントを作成してください：

```tsx
// 要件:
// 1. UserCardコンポーネントを作成
// 2. Props: name(string), age(number), email(string), isActive(boolean, optional)
// 3. isActiveがtrueの場合、「アクティブ」バッジを表示
// 4. 適切な型定義を行う

// ここに実装してください
```

### 練習問題2: 条件付きレンダリング（10分）

```tsx
// 要件:
// 1. WeatherDisplayコンポーネントを作成
// 2. Props: temperature(number), condition('sunny' | 'rainy' | 'cloudy')
// 3. 天気に応じて異なるアイコンと色を表示
// 4. 温度が30度以上の場合、警告メッセージを表示

// ここに実装してください
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問

**Q: React.FCとfunction宣言の違いは？**
A: React.FCは型安全性とchildren propsの自動提供がありますが、function宣言の方が柔軟性があります。プロジェクトの方針に合わせて選択しましょう。

**Q: JSXでTypeScriptの型チェックが効かない場合は？**
A: ファイル拡張子が`.tsx`になっているか、tsconfig.jsonの設定が正しいかを確認してください。

**Q: コンポーネントの命名規則は？**
A: PascalCaseを使用し、ファイル名とコンポーネント名を一致させることが推奨されます。

---

**📌 重要**: Session1ではReactの基本概念とTypeScriptとの統合を理解することが重要です。型安全性を活かした開発手法を身につけましょう。

**🌟 次回（Session2）は、より実践的なコンポーネント設計とPropsの活用について学習します！**