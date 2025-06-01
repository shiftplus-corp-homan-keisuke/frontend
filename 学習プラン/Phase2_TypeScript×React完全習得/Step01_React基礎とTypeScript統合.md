# Step 1: React 基礎と TypeScript 統合（React 初心者・TypeScript 上級者向け）

> 💡 **補足資料**: 詳細な解説は以下の補足資料を見てね 🐰
>
> - 📖 [専門用語集](./Step01_補足_専門用語集.md) - React + TypeScript の重要な概念と用語の詳細解説
> - 🛠️ [開発環境ガイド](./Step01_補足_開発環境ガイド.md) - React 19 + TypeScript 環境構築と設定方法
> - ⚙️ [設定ファイル解説](./Step01_補足_設定ファイル解説.md) - tsconfig.json、vite.config.ts 等の詳細設定
> - 💻 [実践コード例](./Step01_補足_実践コード例.md) - 段階的なコンポーネント作成例集
> - 🚨 [トラブルシューティング](./Step01_補足_トラブルシューティング.md) - よくあるエラーと解決方法
> - 📚 [参考リソース](./Step01_補足_参考リソース.md) - 学習に役立つリンク集

## 📅 学習期間・目標

**期間**: Step 1
**総学習時間**: 5 時間
**学習スタイル**: 段階的理解重視 - 基礎概念 → 環境構築 → 実践 → 演習

### 🎯 Step 1 到達目標

- [ ] React の基本概念（仮想 DOM、コンポーネント思考）の理解
- [ ] React 19 + TypeScript 開発環境の構築
- [ ] JSX 記法と型システムの統合理解
- [ ] 段階的な型安全コンポーネント設計の習得
- [ ] 基礎から応用まで段階的な実践演習の完了

## 🗺️ 学習フローマップ

```
Phase 1: 基礎概念理解 (60分)
├── Step 0: React とは何か (25分)
└── Step 1: 開発環境構築 (35分)

Phase 2: JSX マスター (35分)
└── Step 2: JSX 基礎理解 (35分)

Phase 3: コンポーネント設計 (60分)
├── Step 3: 最初のコンポーネント (25分)
└── Step 4: Props の理解 (35分)

Phase 4: 動的機能 (75分)
├── Step 5: 状態管理入門 (35分)
└── Step 6: イベント処理 (40分)

Phase 5: 実践演習 (70分)
└── Step 7: 段階的演習 (70分)
```

## 📚 段階的学習内容

## Phase 1: 基礎概念理解（60 分）

### Step 0: React とは何か（25 分）

> 💡 **学習目標**: React の基本概念を理解し、従来の DOM 操作との違いを明確にする

#### 🤔 なぜ React を学ぶのか

**💡 React を使う 3 つの理由**

React は以下の 3 つの核心的なメリットにより、現代の Web 開発において必須の技術となっています：

**理由 1: 開発効率の劇的向上**

- 宣言的 UI：「どうなってほしいか」を記述するだけ
- コンポーネント再利用：一度作った部品を何度でも使用
- 型安全性：TypeScript との組み合わせでバグを事前に防止

**理由 2: 保守性・拡張性の確保**

- 単方向データフロー：データの流れが予測可能
- コンポーネント分割：責任が明確で変更影響範囲が限定的
- テスタビリティ：独立したコンポーネント単位でのテストが容易

**理由 3: パフォーマンスの最適化**

- 仮想 DOM：効率的な画面更新で高速レンダリング
- 自動最適化：不要な再描画を自動的に回避
- バッチ更新：複数の変更をまとめて処理

**従来の JavaScript 開発の課題**

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
  updateUserInterface();
  validateForm();
  syncWithServer();
  // → コードが絡み合い、バグの温床に
});

// 問題点:
// 1. 命令的プログラミング：「どうやって」を詳細に記述
// 2. 状態とUIの同期が手動：ヒューマンエラーが発生しやすい
// 3. コードの重複：似たような処理を何度も書く
// 4. テストが困難：DOM操作のモックが複雑
```

**React による解決**

```tsx
// ✅ React的アプローチ（宣言的で理解しやすい）
function Counter(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ color: count > 10 ? "red" : "black" }}>{count}</span>
      <button onClick={() => setCount(count + 1)} disabled={count > 20}>
        Increment
      </button>
    </div>
  );
}

// 解決されたポイント:
// 1. 宣言的プログラミング：「どうなってほしいか」を記述
// 2. 状態とUIの自動同期：Reactが自動的に画面を更新
// 3. 再利用可能：このCounterコンポーネントはどこでも使用可能
// 4. テストしやすい：純粋関数として単体テスト可能
```

**📊 具体的な開発効率の比較**

| 従来の DOM 操作  | React            |
| ---------------- | ---------------- |
| 100 行のコード   | 20 行のコード    |
| 手動での UI 同期 | 自動での UI 同期 |
| バグ発生率: 高   | バグ発生率: 低   |
| テスト工数: 大   | テスト工数: 小   |
| 新機能追加: 困難 | 新機能追加: 容易 |

#### 🎯 React の 3 つの核心概念

**1. 仮想 DOM（Virtual DOM）**

仮想 DOM は、実際の DOM を JavaScript オブジェクトとして表現したメモリ上の軽量なコピーです。React は仮想 DOM を使って効率的な画面更新を実現します。

```tsx
// React の仮想DOM活用例
function Counter(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span>{count}</span> {/* 変更時、ここだけが更新される */}
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
}
```

**メリット**: 高速な画面更新、自動最適化、予測可能な動作

**2. コンポーネント思考**

UI を独立した、再利用可能な部品（コンポーネント）として設計する考え方です。

```tsx
// ✅ コンポーネント思考による設計
// 再利用可能なボタンコンポーネント
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

function Button({ text, onClick, variant = "primary" }: ButtonProps): JSX.Element {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {text}
    </button>
  );
}
```

**メリット**: 再利用性、保守しやすさ、テストしやすさ、責任の明確化

**3. 単方向データフロー**

```tsx
// データは親から子へ一方向に流れる（TypeScript の型継承と同じ概念）
interface AppState {
  user: User;
  settings: Settings;
}

function App(): JSX.Element {
  const [appState, setAppState] = useState<AppState>({...});

  return (
    <div>
      {/* 親から子へデータを渡す */}
      <UserProfile user={appState.user} />
      <Settings settings={appState.settings} />
    </div>
  );
}
```

#### 💡 TypeScript 上級者向けの理解ポイント

React コンポーネントは、TypeScript の関数と同じ設計原則に従います：

```tsx
// 1. 純粋関数としてのコンポーネント
// 同じ Props なら常に同じ結果を返す（副作用なし）
function PureComponent({ name }: { name: string }): JSX.Element {
  return <h1>Hello, {name}!</h1>;
}

// 2. 型安全な合成（Composition）
// 小さなコンポーネントを組み合わせて大きなコンポーネントを作る
function UserCard({ user }: { user: User }): JSX.Element {
  return (
    <div>
      <Avatar src={user.avatar} />
      <UserName name={user.name} />
      <UserEmail email={user.email} />
    </div>
  );
}

// 3. 単一責任の原則（SRP）
// 各コンポーネントは一つの責任のみを持つ
function Avatar({ src }: { src: string }): JSX.Element {
  return <img src={src} alt="User avatar" />;
}
```

#### ✅ Step 0 理解度チェック

- [ ] 仮想 DOM の概念を自分の言葉で説明できる
- [ ] なぜ React を使うのかを 3 つの理由で答えられる
- [ ] コンポーネント思考とは何かを理解している
- [ ] 従来の DOM 操作と React の違いを説明できる

---

### Step 1: 開発環境構築（35 分）

> 💡 **学習目標**: React 19 + TypeScript の開発環境を構築し、基本的な開発フローを理解する

#### 🛠️ 段階的環境セットアップ

**Phase 1: 基本環境の構築（15 分）**

```bash
# 1. Node.js のバージョン確認（18.0.0 以上推奨）
node --version
npm --version

# 2. Vite を使った React + TypeScript プロジェクト作成
npm create vite@latest my-react-app -- --template react-ts

# 3. プロジェクトディレクトリに移動
cd my-react-app

# 4. 依存関係のインストール
npm install
```

**Phase 2: 開発ツールの追加（15 分）**

```bash
# TypeScript 上級者向けの開発体験向上ツール
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# React 開発者ツール用の型定義（既に含まれているが確認）
npm install -D @types/react @types/react-dom
```

**Phase 3: 開発サーバーの起動と確認（15 分）**

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
# React のロゴが回転していれば成功！
```

#### ⚙️ TypeScript 設定の理解

> 💡 **詳細解説**: tsconfig.json の各オプションの詳細は [Step01\_補足\_設定ファイル解説.md](./Step01_補足_設定ファイル解説.md) を見てね 🐰

**React 初心者向けの最小限設定**

```json
// tsconfig.json - 重要な設定のみ解説
{
  "compilerOptions": {
    // React 関連の重要設定
    "jsx": "react-jsx", // React 17+ の新しい JSX 変換
    "lib": ["ES2020", "DOM"], // ブラウザ環境で使用可能な API
    "target": "ES2020", // 出力する JavaScript のバージョン

    // 型チェック設定
    "strict": true, // 厳密な型チェック（推奨）
    "noImplicitAny": true, // any 型の暗黙的使用を禁止

    // 開発体験向上
    "esModuleInterop": true, // CommonJS との互換性
    "allowSyntheticDefaultImports": true,

    // パス解決（便利な機能）
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"] // src ディレクトリへのエイリアス
    }
  },
  "include": ["src"] // 型チェック対象ディレクトリ
}
```

#### 🎯 プロジェクト構造の理解

```
my-react-app/
├── src/
│   ├── App.tsx          # メインアプリケーションコンポーネント
│   ├── main.tsx         # アプリケーションのエントリーポイント
│   ├── index.css        # グローバルスタイル
│   └── App.css          # App コンポーネント用スタイル
├── public/              # 静的ファイル
├── index.html           # HTML テンプレート
├── package.json         # プロジェクト設定・依存関係
├── tsconfig.json        # TypeScript 設定
└── vite.config.ts       # Vite（ビルドツール）設定
```

#### 🔧 開発ツールの活用

**1. React Developer Tools（ブラウザ拡張機能）**

```tsx
// コンポーネントの状態やプロパティを確認できる
function MyComponent({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  // React DevTools でこの状態が確認できる
  return (
    <div>
      {name}: {count}
    </div>
  );
}
```

**2. TypeScript エラーの読み方**

```tsx
// ❌ よくあるエラー例
function Greeting({ name }) {
  // エラー: Parameter 'name' implicitly has an 'any' type
  return <h1>Hello {name}</h1>;
}

// ✅ 正しい修正
function Greeting({ name }: { name: string }): JSX.Element {
  return <h1>Hello, {name}!</h1>;
}
```

#### 🚨 よくあるトラブルと解決方法

**問題 1: ポートが既に使用されている**

```bash
# 解決方法: 別のポートを指定
npm run dev -- --port 3000
```

**問題 2: TypeScript エラーが表示される**

```tsx
// 問題: JSX.Element の戻り値型が不明
function MyComponent() {
  // ❌
  return <div>Hello</div>;
}

// 解決: 明示的な型注釈
function MyComponent(): JSX.Element {
  // ✅
  return <div>Hello</div>;
}
```

#### ✅ Step 1 理解度チェック

- [ ] React プロジェクトを作成できる
- [ ] 開発サーバーを起動できる
- [ ] tsconfig.json の基本設定を理解している
- [ ] React Developer Tools を使用できる
- [ ] 基本的な TypeScript エラーを解決できる

---

## Phase 2: JSX マスター（35 分）

### Step 2: JSX 基礎理解（35 分）

> 💡 **学習目標**: JSX の基本記法を理解し、TypeScript と組み合わせた型安全な記述ができるようになる

#### 📝 JSX 基本記法（段階的学習）

**💡 JSX = TypeScript + XML の融合**

**段階 1: 基本的な JSX（20 分）**

```tsx
// 1. 静的なJSX要素とFragment
function Welcome(): JSX.Element {
  return (
    <>
      <h1>Hello, World!</h1>
      <p>Welcome to React!</p>
    </>
  );
}

// 2. JavaScript式の埋め込み
function Greeting(): JSX.Element {
  const name = "React";
  const version = 19;

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Version: {version}</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
```

**段階 2: 条件付きレンダリング（15 分）**

```tsx
// 1. 論理AND演算子を使った条件付きレンダリング
function WelcomeMessage({ isLoggedIn }: { isLoggedIn: boolean }): JSX.Element {
  return (
    <div>
      <h1>Welcome!</h1>
      {isLoggedIn && <p>You are logged in.</p>}
      {!isLoggedIn && <p>Please log in.</p>}
    </div>
  );
}

// 2. 三項演算子を使った条件付きレンダリング
function StatusBadge({ isOnline }: { isOnline: boolean }): JSX.Element {
  return (
    <span className={isOnline ? "online" : "offline"}>
      {isOnline ? "🟢 Online" : "🔴 Offline"}
    </span>
  );
}

// 3. TypeScript の Union 型を活用した条件付きレンダリング
function AlertMessage({
  type,
}: {
  type: "success" | "warning" | "error";
}): JSX.Element {
  // TypeScript の型ガードと同じ考え方
  if (type === "success") {
    return <div style={{ color: "green" }}>✅ Success!</div>;
  }
  if (type === "warning") {
    return <div style={{ color: "orange" }}>⚠️ Warning!</div>;
  }
  if (type === "error") {
    return <div style={{ color: "red" }}>❌ Error!</div>;
  }

  // TypeScript の exhaustive check
  const _exhaustiveCheck: never = type;
  return _exhaustiveCheck;
}
```

#### 🎯 JSX のよくある間違いと解決方法

```tsx
// ❌ よくある間違い1: 閉じタグの忘れ
function BadExample1() {
  return <img src="image.jpg">  // エラー: 閉じタグがない
}

// ✅ 正しい書き方
function GoodExample1(): JSX.Element {
  return <img src="image.jpg" />;  // 自己閉じタグを使用
}

// ❌ よくある間違い2: 複数要素の返却
function BadExample2() {
  return (
    <h1>Title</h1>
    <p>Content</p>  // エラー: 複数の要素を返却
  );
}

// ✅ 正しい書き方
function GoodExample2(): JSX.Element {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}

// ❌ よくある間違い3: class属性の使用
function BadExample3() {
  return <div class="container">Content</div>;  // エラー: class は予約語
}

// ✅ 正しい書き方
function GoodExample3(): JSX.Element {
  return <div className="container">Content</div>;  // className を使用
}
```

#### ✅ Step 2 理解度チェック

- [ ] 基本的な JSX 要素を記述できる
- [ ] JavaScript 式を JSX に埋め込める
- [ ] 条件付きレンダリングを実装できる
- [ ] JSX の一般的な間違いを避けられる
- [ ] Fragment（<>）の使い方を理解している

---

## Phase 3: コンポーネント設計（60 分）

### Step 3: 最初のコンポーネント（25 分）

> 💡 **学習目標**: 静的なコンポーネントを作成し、コンポーネントの分割と再利用の概念を理解する

#### 🧩 Hello World から始める

**段階 1: 最もシンプルなコンポーネント（10 分）**

```tsx
// src/components/HelloWorld.tsx
function HelloWorld(): JSX.Element {
  return <h1>Hello, React World!</h1>;
}

export default HelloWorld;

// src/App.tsx で使用
import HelloWorld from "./components/HelloWorld";

function App(): JSX.Element {
  return (
    <div>
      <HelloWorld />
    </div>
  );
}

export default App;
```

**段階 2: 少し複雑なコンポーネント（10 分）**

```tsx
// src/components/UserCard.tsx
function UserCard(): JSX.Element {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        maxWidth: "300px",
      }}
    >
      <h2>John Doe</h2>
      <p>Software Engineer</p>
      <p>📧 john@example.com</p>
      <p>📍 Tokyo, Japan</p>
    </div>
  );
}

export default UserCard;
```

**段階 3: コンポーネントの分割（10 分）**

```tsx
// src/components/Avatar.tsx
function Avatar(): JSX.Element {
  return (
    <img
      src="https://via.placeholder.com/80"
      alt="User Avatar"
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
      }}
    />
  );
}

export default Avatar;

// src/components/UserInfo.tsx
function UserInfo(): JSX.Element {
  return (
    <div>
      <h2>John Doe</h2>
      <p>Software Engineer</p>
    </div>
  );
}

export default UserInfo;

// src/components/ContactInfo.tsx
function ContactInfo(): JSX.Element {
  return (
    <div>
      <p>📧 john@example.com</p>
      <p>📍 Tokyo, Japan</p>
    </div>
  );
}

export default ContactInfo;

// src/components/UserCard.tsx - 分割されたコンポーネントを組み合わせ
import Avatar from "./Avatar";
import UserInfo from "./UserInfo";
import ContactInfo from "./ContactInfo";

function UserCard(): JSX.Element {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        maxWidth: "300px",
      }}
    >
      <Avatar />
      <UserInfo />
      <ContactInfo />
    </div>
  );
}

export default UserCard;
```

#### 📁 コンポーネントファイルの整理

```
src/
├── components/
│   ├── Avatar.tsx
│   ├── UserInfo.tsx
│   ├── ContactInfo.tsx
│   └── UserCard.tsx
├── App.tsx
└── main.tsx
```

#### ✅ Step 3 理解度チェック

- [ ] 基本的なコンポーネントを作成できる
- [ ] コンポーネントをファイルに分割できる
- [ ] export/import を使ってコンポーネントを組み合わせられる
- [ ] コンポーネントの責任分離を理解している

---

### Step 4: Props の理解（35 分）

> 💡 **学習目標**: Props を使ってコンポーネントに外部からデータを渡し、再利用可能なコンポーネントを作成する

#### 🎯 Props の基本概念

**段階 1: 単一の Props（15 分）**

```tsx
// src/components/Greeting.tsx
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps): JSX.Element {
  return <h1>Hello, {name}!</h1>;
}

export default Greeting;

// src/App.tsx で使用
import Greeting from "./components/Greeting";

function App(): JSX.Element {
  return (
    <div>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
      <Greeting name="Charlie" />
    </div>
  );
}
```

**段階 2: 複数の Props（15 分）**

```tsx
// src/components/UserCard.tsx
interface UserCardProps {
  name: string;
  role: string;
  email: string;
  location: string;
}

function UserCard({ name, role, email, location }: UserCardProps): JSX.Element {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        maxWidth: "300px",
        margin: "8px",
      }}
    >
      <h2>{name}</h2>
      <p>{role}</p>
      <p>📧 {email}</p>
      <p>📍 {location}</p>
    </div>
  );
}

export default UserCard;

// src/App.tsx で使用
import UserCard from "./components/UserCard";

function App(): JSX.Element {
  return (
    <div>
      <UserCard
        name="Alice Johnson"
        role="Frontend Developer"
        email="alice@example.com"
        location="New York, USA"
      />
      <UserCard
        name="Bob Smith"
        role="Backend Developer"
        email="bob@example.com"
        location="London, UK"
      />
    </div>
  );
}
```

**段階 3: オプショナル Props（15 分）**

```tsx
// src/components/Button.tsx
interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "danger"; // オプショナル
  disabled?: boolean; // オプショナル
  size?: "small" | "medium" | "large"; // オプショナル
}

function Button({
  text,
  variant = "primary", // デフォルト値
  disabled = false, // デフォルト値
  size = "medium", // デフォルト値
}: ButtonProps): JSX.Element {
  const getButtonStyle = () => {
    const baseStyle = {
      padding:
        size === "small"
          ? "4px 8px"
          : size === "large"
          ? "12px 24px"
          : "8px 16px",
      border: "none",
      borderRadius: "4px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
    };

    const variantStyles = {
      primary: { backgroundColor: "#007bff", color: "white" },
      secondary: { backgroundColor: "#6c757d", color: "white" },
      danger: { backgroundColor: "#dc3545", color: "white" },
    };

    return { ...baseStyle, ...variantStyles[variant] };
  };

  return (
    <button style={getButtonStyle()} disabled={disabled}>
      {text}
    </button>
  );
}

export default Button;

// src/App.tsx で使用
import Button from "./components/Button";

function App(): JSX.Element {
  return (
    <div style={{ padding: "20px" }}>
      <Button text="Primary Button" />
      <Button text="Secondary Button" variant="secondary" />
      <Button text="Danger Button" variant="danger" size="large" />
      <Button text="Disabled Button" disabled />
    </div>
  );
}
```

#### 💡 TypeScript 上級者向けの Props 設計パターン

```typescript
// 1. Union型を活用したProps
interface AlertProps {
  type: "success" | "warning" | "error" | "info";
  message: string;
  dismissible?: boolean;
}

// 2. オブジェクト型のProps
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface UserProfileProps {
  user: User;
  showEmail?: boolean;
}

// 3. 関数型のProps（イベントハンドラー）
interface ClickableCardProps {
  title: string;
  content: string;
  onClick: () => void; // 関数型Props
}
```

#### ✅ Step 4 理解度チェック

- [ ] 基本的な Props を定義できる
- [ ] オプショナル Props とデフォルト値を使用できる
- [ ] Union 型を使った Props を設計できる
- [ ] 再利用可能なコンポーネントを作成できる
- [ ] TypeScript の型システムを活用した Props 設計ができる

---

## Phase 4: 動的機能（75 分）

### Step 5: 状態管理入門（35 分）

> 💡 **学習目標**: useState を使ってコンポーネントに状態を持たせ、動的な UI を作成する

#### 🔄 useState の基本概念

**段階 1: 最もシンプルな状態（15 分）**

```tsx
import { useState } from "react";

// src/components/SimpleCounter.tsx
function SimpleCounter(): JSX.Element {
  // useState の基本形：[状態値, 状態更新関数] = useState(初期値)
  const [count, setCount] = useState<number>(0);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Simple Counter</h2>
      <p style={{ fontSize: "24px" }}>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default SimpleCounter;
```

**段階 2: 複数の状態管理（15 分）**

```tsx
import { useState } from "react";

// src/components/UserForm.tsx
function UserForm(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<number>(0);

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>User Form</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <h3>Preview:</h3>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Age: {age}</p>
      </div>
    </div>
  );
}

export default UserForm;
```

**段階 3: オブジェクト状態の管理（15 分）**

```tsx
import { useState } from "react";

// src/components/UserProfile.tsx
interface UserData {
  name: string;
  email: string;
  age: number;
  bio: string;
}

function UserProfile(): JSX.Element {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    age: 0,
    bio: "",
  });

  // オブジェクトの一部を更新する関数
  const updateField = (field: keyof UserData, value: string | number): void => {
    setUserData((prev) => ({
      ...prev, // 既存のデータを展開
      [field]: value, // 指定されたフィールドのみ更新
    }));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>User Profile</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Name:</label>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => updateField("name", e.target.value)}
          style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Email:</label>
        <input
          type="email"
          value={userData.email}
          onChange={(e) => updateField("email", e.target.value)}
          style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Age:</label>
        <input
          type="number"
          value={userData.age}
          onChange={(e) => updateField("age", Number(e.target.value))}
          style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Bio:</label>
        <textarea
          value={userData.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "5px",
            width: "200px",
            height: "60px",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <h3>Profile Preview:</h3>
        <p>
          <strong>Name:</strong> {userData.name || "Not provided"}
        </p>
        <p>
          <strong>Email:</strong> {userData.email || "Not provided"}
        </p>
        <p>
          <strong>Age:</strong> {userData.age || "Not provided"}
        </p>
        <p>
          <strong>Bio:</strong> {userData.bio || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default UserProfile;
```

#### ✅ Step 5 理解度チェック

- [ ] useState の基本的な使い方を理解している
- [ ] 複数の状態を管理できる
- [ ] オブジェクト状態を適切に更新できる
- [ ] 状態の変更が UI に反映されることを理解している
- [ ] TypeScript と useState を組み合わせて使用できる

---

### Step 6: イベント処理（40 分）

> 💡 **学習目標**: React のイベントシステムを理解し、ユーザーの操作に応答する動的な UI を作成する

#### 🖱️ イベントハンドラーの基本

**段階 1: 基本的なクリックイベント（15 分）**

```tsx
import { useState } from "react";

// src/components/ClickCounter.tsx
function ClickCounter(): JSX.Element {
  const [clickCount, setClickCount] = useState<number>(0);

  // イベントハンドラー関数
  const handleClick = (): void => {
    setClickCount((prev) => prev + 1);
    console.log("Button clicked!");
  };

  const handleReset = (): void => {
    setClickCount(0);
    console.log("Counter reset!");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Click Counter</h2>
      <p style={{ fontSize: "24px" }}>Clicks: {clickCount}</p>

      <button
        onClick={handleClick}
        style={{
          padding: "10px 20px",
          margin: "5px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Click Me!
      </button>

      <button
        onClick={handleReset}
        style={{
          padding: "10px 20px",
          margin: "5px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default ClickCounter;
```

**段階 2: フォームイベントの処理（15 分）**

```tsx
import { useState } from "react";

// src/components/ContactForm.tsx
function ContactForm(): JSX.Element {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // フォーム送信イベント
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault(); // デフォルトの送信動作を防ぐ

    console.log("Form submitted:", formData);
    alert(`Thank you, ${formData.name}! Your message has been sent.`);

    // フォームをリセット
    setFormData({ name: "", email: "", message: "" });
  };

  // 入力変更イベント
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Contact Form</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
```

**段階 3: 高度なイベント処理（15 分）**

```tsx
import { useState } from "react";

// src/components/InteractiveCard.tsx
interface InteractiveCardProps {
  title: string;
  content: string;
}

function InteractiveCard({
  title,
  content,
}: InteractiveCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // マウスイベント
  const handleMouseEnter = (): void => {
    setIsHovered(true);
  };

  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  // クリックイベント（座標取得）
  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setIsClicked(!isClicked);

    // クリック位置を取得
    const rect = event.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  // キーボードイベント
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      setIsClicked(!isClicked);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0} // キーボードフォーカス可能にする
      style={{
        padding: "20px",
        margin: "10px",
        border: "2px solid #ccc",
        borderRadius: "8px",
        backgroundColor: isHovered
          ? "#f0f8ff"
          : isClicked
          ? "#e6ffe6"
          : "white",
        borderColor: isClicked ? "#28a745" : isHovered ? "#007bff" : "#ccc",
        cursor: "pointer",
        transition: "all 0.3s ease",
        outline: "none",
        maxWidth: "300px",
      }}
    >
      <h3>{title}</h3>
      <p>{content}</p>

      {isHovered && (
        <p style={{ fontSize: "12px", color: "#666" }}>
          💡 Click to toggle selection
        </p>
      )}

      {isClicked && (
        <div style={{ fontSize: "12px", color: "#28a745" }}>
          ✅ Selected
          {clickPosition && (
            <p>
              Click position: ({clickPosition.x.toFixed(0)},{" "}
              {clickPosition.y.toFixed(0)})
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default InteractiveCard;
```

#### 💡 React イベントシステムの重要ポイント

```tsx
// 1. React のイベント型（SyntheticEvent）
function EventExample(): JSX.Element {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log("Event target:", event.target);
    console.log("Current target:", event.currentTarget);
    console.log("Mouse position:", event.clientX, event.clientY);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("Input value:", event.target.value);
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <input onChange={handleChange} placeholder="Type something" />
    </div>
  );
}

// 2. イベントの伝播制御
function EventPropagationExample(): JSX.Element {
  const handleParentClick = (): void => {
    console.log("Parent clicked");
  };

  const handleChildClick = (event: React.MouseEvent): void => {
    event.stopPropagation(); // 親要素への伝播を停止
    console.log("Child clicked");
  };

  return (
    <div
      onClick={handleParentClick}
      style={{ padding: "20px", backgroundColor: "#f0f0f0" }}
    >
      Parent
      <button onClick={handleChildClick} style={{ margin: "10px" }}>
        Child (stops propagation)
      </button>
    </div>
  );
}
```

#### ✅ Step 6 理解度チェック

- [ ] 基本的なクリックイベントを処理できる
- [ ] フォームの送信とバリデーションを実装できる
- [ ] マウスイベント（hover、leave）を活用できる
- [ ] キーボードイベントを処理できる
- [ ] React のイベント型（SyntheticEvent）を理解している

---

## Phase 5: 実践演習（70 分）

### Step 7: 段階的演習（70 分）

> 💡 **学習目標**: これまで学んだ知識を統合して、実用的なアプリケーションを段階的に作成する

#### 🎯 演習 1: プロフィールカード作成（20 分）

**要件:**

- ユーザーの基本情報を表示するカードコンポーネント
- Props を使った再利用可能な設計
- TypeScript による型安全性

```tsx
// src/components/ProfileCard.tsx
interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  skills: string[];
}

interface ProfileCardProps {
  user: User;
  showEmail?: boolean;
  onContactClick?: (email: string) => void;
}

function ProfileCard({
  user,
  showEmail = true,
  onContactClick,
}: ProfileCardProps): JSX.Element {
  // 実装してください
  // ヒント:
  // - アバター画像の表示
  // - スキルリストの表示
  // - 条件付きでメール表示
  // - コンタクトボタンのクリックハンドラー
}

export default ProfileCard;
```

#### 🎯 演習 2: いいねボタン（25 分）

**要件:**

- いいねの数を表示・管理
- ボタンクリックでいいね数を増減
- いいね済み状態の視覚的表示
- TypeScript による型安全な状態管理

```tsx
// src/components/LikeButton.tsx
interface LikeButtonProps {
  initialLikes?: number;
  onLikeChange?: (likes: number, isLiked: boolean) => void;
}

function LikeButton({
  initialLikes = 0,
  onLikeChange,
}: LikeButtonProps): JSX.Element {
  // 実装してください
  // ヒント:
  // - useState でいいね数と状態を管理
  // - ボタンの色やアイコンを状態に応じて変更
  // - onLikeChange コールバックの呼び出し
}

export default LikeButton;
```

#### 🎯 演習 3: シンプルな Todo アプリ（25 分）

**要件:**

- Todo の追加・削除・完了切り替え
- フィルタリング機能（全て・未完了・完了済み）
- 残りタスク数の表示
- ローカルストレージへの保存（オプション）

```tsx
// src/components/TodoApp.tsx
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = "all" | "active" | "completed";

function TodoApp(): JSX.Element {
  // 実装してください
  // ヒント:
  // - useState で Todo リストと入力値を管理
  // - 追加・削除・切り替え関数の実装
  // - フィルタリング機能
  // - 統計情報の計算
}

export default TodoApp;
```

#### 📊 演習評価基準

**各演習の評価ポイント:**

1. **型安全性（25%）**

   - 適切な interface 定義
   - Props の型注釈
   - useState の型指定

2. **機能実装（35%）**

   - 要件通りの動作
   - エラーハンドリング
   - ユーザビリティ

3. **コード品質（25%）**

   - コンポーネントの分割
   - 関数の責任分離
   - 命名規則

4. **React パターン（15%）**
   - 適切な useState 使用
   - イベントハンドラーの実装
   - 条件付きレンダリング

#### ✅ Phase 5 完了チェック

- [ ] プロフィールカードを作成できた
- [ ] いいねボタンの状態管理ができた
- [ ] Todo アプリの基本機能を実装できた
- [ ] 全ての演習で TypeScript の型安全性を保てた

---

## 📊 Step 1 評価基準

### 理解度チェックリスト

#### React 基礎理解 (25%)

- [ ] React の基本概念（コンポーネント、Props、State）を理解している
- [ ] JSX の基本記法を習得している
- [ ] コンポーネント思考で UI を設計できる
- [ ] 宣言的 UI の概念を理解している

#### TypeScript 統合 (30%)

- [ ] 基本的な Props 型を定義できる
- [ ] イベントハンドラーを型安全に実装できる
- [ ] useState を型安全に使用できる
- [ ] 条件付きレンダリングを型安全に実装できる

#### 実践応用 (30%)

- [ ] カウンターアプリを作成できる
- [ ] 簡単な Todo リストを作成できる
- [ ] 基本的なフォーム処理を実装できる
- [ ] エラーハンドリングを適切に実装できる

#### 開発環境 (15%)

- [ ] React 19 + TypeScript 環境を構築できる
- [ ] 基本的な tsconfig.json を設定できる
- [ ] 開発サーバーを起動できる
- [ ] TypeScript エラーを理解し解決できる

### 成果物


## 🔄 Step 2 への準備

### 次週学習内容の予習

```tsx
// Step 2で学習するGeneric Componentsの基礎概念
// 以下のコードを読んで理解しておくこと

// 1. Generic Props
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

// 2. Generic Hooks
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // 実装
}

// 3. Conditional Types
type ButtonProps<T extends "button" | "link"> = T extends "button"
  ? React.ButtonHTMLAttributes<HTMLButtonElement>
  : React.AnchorHTMLAttributes<HTMLAnchorElement>;
```

### 環境準備

- [ ] Storybook の導入検討
- [ ] テスト環境の準備（Vitest + Testing Library）
- [ ] CSS-in-JS または CSS Modules の選択
- [ ] ESLint ルールの追加設定

### 学習継続のコツ

1. **毎日のコーディング**: 最低 30 分のコンポーネント作成
2. **型エラーの理解**: エラーメッセージを読み解く習慣
3. **React DevTools 活用**: コンポーネント構造の確認
4. **コードレビュー**: 自分のコードを客観視する

---

**📌 重要**: Step 1 は React 初心者（TypeScript 上級者）にとって React + TypeScript の基盤となる重要な期間です。React の基本概念を理解し、TypeScript の知識を活かした型安全なコンポーネント設計を習得することで、後の高度な機能学習がスムーズに進みます。段階的な学習アプローチにより、TypeScript の経験を活かしながら React を効率的に習得できます。
