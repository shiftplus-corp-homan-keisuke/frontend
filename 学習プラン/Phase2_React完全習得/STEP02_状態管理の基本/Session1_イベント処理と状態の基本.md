# Session1: イベント処理と状態の基本

## セクション概要

ここでは、基本的なReactのトピックを引き続き探求し、最終的にコンポーネントをインタラクティブにします。そのためには、Reactでのイベント処理方法と、非常に重要な概念である状態（state）を使用してユーザーインターフェースを更新する方法を学習します。

また、次のプロジェクトの構築も開始します。ここでは、状態と制御された要素を使用してReactの流儀でフォームを構築することに焦点を当てます。セクションの終わりには、PropsとStateについて理論と実践の両方で学んだ内容を、優れた小さなフラッシュカードアプリケーションを構築することで習得します。

これは非常に重要で基礎的なセクションですので、早速進めていきましょう。

## ステップコンポーネントを構築しましょう

このセクションでは、イベントと状態について学習し、いくつかのステップをナビゲートできるシンプルなコンポーネントを構築します。この講義では、そのコンポーネントの静的な部分の構築から始めます。

startarディレクトリをコピーしてターミナルを開きましょう。以下のコマンドを実行してアプリを起動します

```
npm install
npm run dev
```

# React流でイベントを処理する

Reactでイベントを処理することは、実際には非常に簡単です。その方法を学びましょう。想像できるように、DOMを直接操作するaddEventListenerは使用しません。それはUIを構築する命令的な方法だからです。Reactでは、より宣言的なアプローチを使用します。

## イベントハンドリングの基本概念

### 従来のJavaScriptとReactの違い

```mermaid
graph TD
    A[従来のJavaScript] --> B[DOM要素を選択]
    B --> C[addEventListenerを使用]
    C --> D[命令的なアプローチ]
    
    E[React] --> F[JSXで直接イベントを指定]
    F --> G[onClickプロパティを使用]
    G --> H[宣言的なアプローチ]
```

### Reactのイベントハンドリング方法

DOM要素を直接選択しません。そのため、addEventListenerも使用しません。代わりに、HTMLのインラインイベントリスナーと似たものを使用します。

基本的に、イベントが発生する要素で直接イベントをリッスンします。例えば、ボタンでは、onClickプロパティを使用できます。

## 基本的なイベントハンドラーの実装

### インラインでのイベントハンドラー定義

```javascript
// 基本的なイベントハンドラーの例
function App() {
  return (
    <div className="steps">
      <div className="numbers">
        <div className="active">1</div>
        <div>2</div>
        <div>3</div>
      </div>

      <p className="message">Step 1: Learn React ⚛️</p>

      <div className="buttons">
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={() => alert("Previous")}
        >
          Previous
        </button>
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={() => alert("Next")}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### 重要なポイント：関数 vs 関数呼び出し

```javascript
// ❌ 間違った方法：関数を呼び出している
<button onClick={alert("TEST")}>
  Click me
</button>

// ✅ 正しい方法：関数を渡している
<button onClick={() => alert("TEST")}>
  Click me
</button>
```

**なぜ間違いなのか？**
- `alert("TEST")`は関数呼び出しで、コンポーネントがレンダリングされた瞬間に実行される
- `() => alert("TEST")`は関数で、ボタンがクリックされたときに実行される

## 分離されたイベントハンドラー関数

### handleで始まる関数の命名規則

通常、イベントハンドラー関数を直接onClickプロパティに定義するのではなく、代わりに別の関数を作成し、その関数をここに渡します。

```javascript
function App() {
  // イベントハンドラー関数をコンポーネント内で定義
  function handlePrevious() {
    alert("Previous");
  }
  
  function handleNext() {
    alert("Next");
  }
  
  return (
    <div className="steps">
      <div className="numbers">
        <div className="active">1</div>
        <div>2</div>
        <div>3</div>
      </div>

      <p className="message">Step 1: Learn React ⚛️</p>

      <div className="buttons">
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### 命名規則の重要性

- `handle`で始まる関数名は、React開発では非常に標準的
- この関数がイベントハンドラー関数であることが一目で分かる
- コンポーネントのJSXのどこかで使用されていることが推測できる

## その他のイベントタイプ

Reactでは、クリックイベント以外にも様々なイベントを処理できます：

```javascript
function EventExamples() {
  return (
    <div>
      <button
        onClick={() => console.log("クリックされました")}
        onMouseEnter={() => console.log("マウスが入りました")}
        onMouseLeave={() => console.log("マウスが出ました")}
      >
        イベントテスト
      </button>
      
      <input
        onChange={(e) => console.log("入力値:", e.target.value)}
        onFocus={() => console.log("フォーカスされました")}
        onBlur={() => console.log("フォーカスが外れました")}
      />
    </div>
  );
}
```

## 実践演習

### 演習1: 基本的なイベントハンドリング

以下のコンポーネントを作成してください：

```javascript
function ClickCounter() {
  // ここにイベントハンドラーを実装してください
  
  return (
    <div>
      <h2>クリックカウンター</h2>
      <button>クリックしてください</button>
      <p>まだクリックされていません</p>
    </div>
  );
}
```

**要件：**
- ボタンをクリックするとアラートが表示される
- 適切な命名規則を使用する
- 関数呼び出しではなく関数を渡す

### 演習2: 複数のイベントハンドラー

```javascript
function InteractiveButton() {
  return (
    <button>
      インタラクティブボタン
    </button>
  );
}
```

**要件：**
- クリック時：「ボタンがクリックされました」をコンソールに出力
- マウスエンター時：「マウスが入りました」をコンソールに出力
- マウスリーブ時：「マウスが出ました」をコンソールに出力

これで、イベントハンドリングの基本は理解できました。しかし、実際にUIを更新するためには、**状態（state）**が必要です。次のセクションで状態について学びましょう。

# ReactにおけるStateとは何か？

イベントハンドラーの使用方法を学びましたが、今度はそれらに実際に有用なことをさせたいと思います。コンポーネントをインタラクティブにしたいのです。そのためには、すでに述べたように、状態が必要です。

間違いなく、状態はReactで最も重要な概念です。基本的にReactではすべてが状態を中心に回っています。コース全体を通して状態について学び続けます。

このコースを進める間に状態について実際に学ぶことの概要から始めましょう。まず、状態が実際に何であるか、何をするか、そしてなぜそれが必要なのかを学びます。これがこのセクションの内容です。

次に、useStateまたはuseReducerフック、Context API、またはReduxなどの外部ツールを使用して、実際に状態を使用する方法を学ぶ必要があります。また、Reactで状態について考える方法を深く理解する必要があります。これらは将来のセクションのトピックです。

これで準備ができたので、状態が実際に何であるかを学ぶ準備ができました。

propsを使用してコンポーネントにデータを渡す方法を学びました。これは、コンポーネントの外部から来るデータであることを覚えています。しかし、コンポーネントが実際に独自のデータを保持し、時間の経過とともにそれを保持する必要がある場合はどうでしょうか？また、アクションの結果としてUIを変更して、アプリを実際にインタラクティブにしたい場合はどうでしょうか？

そこで状態が登場します。状態は基本的に、コンポーネントが時間の経過とともに保持できるデータです。コンポーネントがそのライフサイクル全体を通して覚えておく必要がある情報に使用します。

状態をコンポーネントのメモリと考えることができます。これはかなり役立つ類推だと思います。

状態の例は、通知カウント、入力フィールドのテキスト内容、またはタブコンポーネントのアクティブなタブなどの単純なものである可能性があります。また、ショッピングカートの内容など、もう少し複雑なデータである可能性もあります。

これらすべての状態の断片に共通しているのは、アプリケーションで、ユーザーがこれらの値を簡単に変更できることです。例えば、通知を読むと、カウントが1つ減ります。または、別のタブをクリックすると、そのタブがアクティブになります。

これらの各コンポーネントは、アプリケーションのライフサイクル全体にわたって、このデータを時間の経過とともに保持できる必要があります。その理由で、これらの各情報は状態の一部です。

ここで状態の一部という用語を使用していることに注意してください。状態という用語自体はより一般的な用語だからです。状態の一部、または状態変数は、コンポーネント内で定義できる単一の実際の変数です。

一方、状態という用語自体は、コンポーネントが置かれている全体的な状態についてです。つまり、特定の時点での全体的な条件です。基本的に、一般的な用語である状態は、すべての状態の断片を合わせたものです。

これが混乱に聞こえる場合は、心配しないでください。これらは用語の小さな違いです。実際には、通常、状態、状態の一部、および状態変数という用語をかなり互換的に使用します。

状態の最も重要な側面に移りましょう。それは、状態を更新するとReactがコンポーネントを再レンダリングするという事実です。

コンポーネント内の状態の一部を更新するたびに、これによりReactはユーザーインターフェースでそのコンポーネントを再レンダリングします。そのコンポーネントの新しい更新されたビューを作成します。コンポーネントのビューは、基本的に画面上で視覚的にレンダリングされたコンポーネントです。つまり、ユーザーインターフェースです。

この時点まで、一般的な用語であるユーザーインターフェースを使用してきました。しかし、今は実際に単一のコンポーネントについて話しています。単一のコンポーネントがレンダリングされるとき、それをビューと呼びます。すべてのビューが組み合わされて、最終的なユーザーインターフェースを構成します。

コースの最初にReactがデータをUIと同期させる方法について最初に話したときに見た小さな図を覚えていますか？状態はReactがそれを行う方法です。状態はReactがユーザーインターフェースをデータと同期させる方法です。

状態を変更すると、UIが変更されます。状態は開発者に2つの重要なことを可能にします。第一に、状態はコンポーネントのビューをコンポーネントを再レンダリングすることによって更新することを可能にします。UIの一部を変更する方法を提供します。

第二に、状態は開発者が複数のレンダリングおよび再レンダリングの間でローカル変数を永続化することを可能にします。これを考えると、状態は基本的にツールです。実際、それは私たちがReactの世界で持っている最も強力なツールです。

状態がどのように機能するか、そしてそれが何をするかを理解すること、つまり、状態の仕組みを理解することは、React開発の力を解き放つでしょう。しかし、状態の仕組みを理解する前に、まずコードに戻って、この強力なツールを実際に行動で初めて使用しましょう。

# useStateで状態変数を作成する

状態とは何かを知ったので、私たちの小さなプロジェクトに実装してみましょう。そして、簡単なリマインダーとして、私たちが望むことは、この次へボタンと前へボタンをクリックしたときに、ステップを変更したいということです。

## 状態を使用する3つのステップ

コンポーネントで実際の状態を使用するために、3つのステップで行います：

```mermaid
graph TD
    A[1. 新しい状態変数を作成] --> B[2. コード・JSXで使用]
    B --> C[3. イベントハンドラーで状態を更新]
    
    A1[useState関数を使用] --> A
    B1[JSXで状態変数を参照] --> B
    C1[setter関数で状態を更新] --> C
```

### ステップ1: 状態変数の作成

まず、静的な変数を削除して、useStateを使用します：

```javascript
import { useState } from 'react';

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑"
];

function App() {
  // ❌ 静的な変数（削除）
  // const step = 1;
  
  // ✅ useState関数を使用して状態変数を作成
  const [step, setStep] = useState(1);
  
  // ... 残りのコード
}
```

### useStateの仕組みを理解する

useStateが何を返すのかを、段階的に理解しましょう：

**ステップ1：useStateの戻り値を確認**
```javascript
function App() {
  const array = useState(1);
  console.log(array);
  // 出力: [1, function]
}
```

**配列の中身：**
- `array[0]`：現在の状態値（この場合は1）
- `array[1]`：状態を更新するための関数

**ステップ2：通常の配列アクセス方法**
```javascript
const array = useState(1);
const currentValue = array[0];  // 1
const updateFunction = array[1]; // function

// 使用例
updateFunction(2); // 状態を2に更新
```

**ステップ3：分割代入を使った簡潔な書き方**
```javascript
// 上記と同じ意味だが、より簡潔
const [currentValue, updateFunction] = useState(1);
//     ↑            ↑
//   状態値      更新関数
```

**命名規則：**
```javascript
const [step, setStep] = useState(1);
//     ↑     ↑
//   状態名  set + 状態名
```

この分割代入により、配列の要素に意味のある名前を付けて、コードを読みやすくしています。

### ステップ2: JSXでの状態使用

```javascript
function App() {
  const [step, setStep] = useState(1);
  
  return (
    <div className="steps">
      <div className="numbers">
        <div className={step >= 1 ? "active" : ""}>1</div>
        <div className={step >= 2 ? "active" : ""}>2</div>
        <div className={step >= 3 ? "active" : ""}>3</div>
      </div>

      <p className="message">
        Step {step}: {messages[step - 1]}
      </p>

      <div className="buttons">
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### ステップ3: イベントハンドラーでの状態更新

```javascript
function App() {
  const [step, setStep] = useState(1);
  
  function handlePrevious() {
    if (step > 1) {
      setStep(step - 1); // 状態を更新
    }
  }
  
  function handleNext() {
    if (step < 3) {
      setStep(step + 1); // 状態を更新
    }
  }
  
  // ... JSX
}
```

## 完全なStepsコンポーネント

```javascript
import { useState } from 'react';

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑"
];

function App() {
  const [step, setStep] = useState(1);
  
  function handlePrevious() {
    if (step > 1) setStep(step - 1);
  }
  
  function handleNext() {
    if (step < 3) setStep(step + 1);
  }
  
  return (
    <div className="steps">
      <div className="numbers">
        <div className={step >= 1 ? "active" : ""}>1</div>
        <div className={step >= 2 ? "active" : ""}>2</div>
        <div className={step >= 3 ? "active" : ""}>3</div>
      </div>

      <p className="message">
        Step {step}: {messages[step - 1]}
      </p>

      <div className="buttons">
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          style={{ backgroundColor: "#7950f2", color: "#fff" }}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
```

## 状態更新の流れ

ボタンをクリックしてから画面が更新されるまでの処理を、段階的に説明します：

**ステップ1：イベント発生**
- ユーザーが「Next」ボタンをクリック
- ブラウザがクリックイベントを検知

**ステップ2：イベントハンドラー実行**
- `handleNext`関数が呼び出される
- 関数内で`setStep(step + 1)`が実行される

**ステップ3：Reactの内部処理**
- Reactが状態変更を検知
- 「step」の値が1から2に変更されることを記録
- コンポーネントの再レンダリングをスケジュール

**ステップ4：再レンダリング実行**
- `App`関数が再度実行される
- 新しい状態値（step = 2）でJSXが生成される
- 仮想DOMで前回との差分を計算

**ステップ5：DOM更新**
- 実際に変更が必要な部分のみDOMを更新
- 例：「Step 1: Learn React」→「Step 2: Apply for jobs」
- 例：ステップ2の円の背景色が紫色に変更

**ステップ6：画面表示**
- ブラウザが更新されたDOMを画面に描画
- ユーザーに新しいUIが表示される

この一連の流れは、通常数ミリ秒で完了するため、ユーザーには瞬時に更新されているように見えます。

```mermaid
sequenceDiagram
    participant User
    participant Button
    participant Handler
    participant State
    participant React
    participant UI

    User->>Button: クリック
    Button->>Handler: handleNext実行
    Handler->>State: setStep(step + 1)
    State->>React: 状態変更を通知
    React->>UI: コンポーネント再レンダリング
    UI->>User: 更新されたUIを表示
```

## バグの修正：境界値チェック

最初の実装では、ボタンを連続でクリックすると問題が発生します：

```javascript
// ❌ 問題のあるコード
function handleNext() {
  setStep(step + 1); // step が 4, 5, 6... と無制限に増加
}

function handlePrevious() {
  setStep(step - 1); // step が 0, -1, -2... と減少
}
```

**修正版：**

```javascript
// ✅ 修正されたコード
function handleNext() {
  if (step < 3) {  // 最大値をチェック
    setStep(step + 1);
  }
}

function handlePrevious() {
  if (step > 1) {  // 最小値をチェック
    setStep(step - 1);
  }
}
```

## Reactフックのルール

useStateは**Reactフック**です。フックには重要なルールがあります：

### ✅ 正しい使用方法

```javascript
function App() {
  // ✅ コンポーネントのトップレベルで使用
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  
  // ... 残りのコード
}
```

### ❌ 間違った使用方法

```javascript
function App() {
  // ❌ 条件文の中で使用
  if (someCondition) {
    const [step, setStep] = useState(1); // エラー！
  }
  
  // ❌ ループの中で使用
  for (let i = 0; i < 3; i++) {
    const [count, setCount] = useState(0); // エラー！
  }
  
  // ❌ 関数の中で使用
  function handleClick() {
    const [temp, setTemp] = useState(0); // エラー！
  }
}
```

**なぜこのルールが重要なのか？**
- Reactは呼び出し順序でフックを識別している
- 条件やループで呼び出し順序が変わると、Reactが混乱する
- ESLintが自動的にこれらのエラーを検出してくれる

## 実践演習

### 演習1: 基本的なカウンター

以下のカウンターコンポーネントを完成させてください：

```javascript
import { useState } from 'react';

function Counter() {
  // ここにuseStateを実装してください
  
  return (
    <div>
      <h2>カウンター</h2>
      <p>現在の値: {/* ここに状態値を表示 */}</p>
      <button onClick={/* 増加ハンドラー */}>+1</button>
      <button onClick={/* 減少ハンドラー */}>-1</button>
      <button onClick={/* リセットハンドラー */}>リセット</button>
    </div>
  );
}
```

### 演習2: 表示/非表示の切り替え

```javascript
import { useState } from 'react';

function ToggleComponent() {
  // ここにuseStateを実装してください
  
  return (
    <div>
      <button onClick={/* 切り替えハンドラー */}>
        {/* 状態に応じてボタンテキストを変更 */}
      </button>
      
      {/* 条件付きレンダリングでメッセージを表示/非表示 */}
      <p>この文章は表示/非表示が切り替わります</p>
    </div>
  );
}
```

おめでとうございます！あなたは**状態の力とReactの力を解き放ちました**。これで、命令的なDOM操作なしで、動的なコンポーネントを作成できるようになりました。
