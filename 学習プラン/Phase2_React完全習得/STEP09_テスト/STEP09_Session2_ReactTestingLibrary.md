# Session 2: React Testing Library

## はじめに：コンポーネントをテストする

Session 1でVitestの基礎を学びました。純粋関数やカスタムフックのテストはできるようになりました。しかし、React開発の大部分は**コンポーネント**です。

ボタンをクリックしたらカウントが増える、入力した文字が表示される、条件によって表示が変わる……。こうした「**ユーザーから見た振る舞い**」をどうテストするか。そのための道具が **React Testing Library** です。

### なぜコンポーネントのテストが難しいのか

単純な関数なら「入力→出力」が明確です。`add(1, 2)` は `3` を返せばOK。しかし、Reactコンポーネントは**HTMLを返し、状態を持ち、ユーザー操作に反応します**。

- 「button 要素が存在するか」どうやって確かめる？
- 「クリックしたら表示が変わった」をどう検証する？
- 「入力した文字が送信された」をどう確認する？

これらを解決するのが React Testing Library です。根本思想はこうです：

> **"The more your tests resemble the way your software is used, the more confidence they can give you."**
> （テストがソフトウェアの使われ方に近づくほど、自信を持てる）

ユーザーは「class属性が `btn-primary` か」を見て操作しません。**「送信ボタンがあって、クリックしたら送信される」** を見て操作します。だからテストもそう書きましょう：

```tsx
// ❌ 実装の詳細をテスト（避ける）
// クラス名はCSSの都合で変わりやすい。リファクタリングで壊れやすい
expect(wrapper.find('.button').length).toBe(1);

// ✅ ユーザーの視点でテスト（推奨）
// ユーザーは「ボタンがあるか」を見る。ロール(役割)で探す
expect(screen.getByRole('button')).toBeInTheDocument();
```

---

## 1. レンダリングとクエリ — 画面から要素を見つける

### 最初のコンポーネントテスト

まずは最もシンプルな例から。`name` を受け取って挨拶を表示するコンポーネントです：

```tsx
// Greeting.tsx
export function Greeting({ name }: { name: string }) {
  return <h1>こんにちは、{name}さん！</h1>;
}
```

このテストを書いてみましょう：

```tsx
// Greeting.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Greeting } from "./Greeting";

describe("Greeting", () => {
  it("名前を表示する", () => {
    // 1. render: コンポーネントを「仮想画面」に描画する
    //    これにより、仮想的なHTMLが生成され、screen 経由でアクセスできる
    render(<Greeting name="太郎" />);

    // 2. screen.getByText: 画面から指定の文字を含む要素を探す
    // 3. toBeInTheDocument: その要素が「画面に存在する」ことを検証
    expect(screen.getByText("こんにちは、太郎さん！")).toBeInTheDocument();
  });
});
```

1行ずつ解説します：

- **`render(<Greeting name="太郎" />)`**: コンポーネントを呼び出し、仮想画面（jsdom 上の DOM）に描画します。これをしないと要素は画面に存在しません。
- **`screen`**: 仮想画面にアクセスするためのオブジェクト。`render` した後に、画面上の要素を探すために使います。
- **`screen.getByText("...")`**: 指定した文字列を含む要素を1つ探します。見つからないと エラーを投げます（見つからないことをテストするには別の方法を使います。後述）。
- **`toBeInTheDocument()`**: その要素がDOM上に存在することを確認します。この Matcher は `@testing-library/jest-dom` （Session 1の setup.ts で import しました）が提供しています。

### クエリの種類 — 「見つけ方」のバリエーション

`getByText` 以外にも「画面から要素を探す」方法がいくつかあります。要素が「1つ見つかるか・0個か・複数か」「同期的に探すか・非同期的に待つか」で使い分けます。

最初は全部覚えなくて大丈夫です。よく使うものを把握したら、必要になった時に戻ってきて確認してください。

| クエリ | 0件のとき | 1件のとき | 2件以上のとき | 主な用途 |
|--------|----------|----------|--------------|---------|
| `getBy...` | **エラーを投げる** | 要素を返す | **エラーを投げる** | 「必ず存在する」と想定した確認 |
| `queryBy...` | `null` を返す | 要素を返す | **エラーを投げる** | 「存在しない」ことを確認したい時 |
| `findBy...` | エラーを投げる（非同期で待つ） | 要素を返す | **エラーを投げる** | 非同期で現れる要素（例: API後の表示） |
| `getAllBy...` | **エラーを投げる** | `[要素]` を返す | `[要素, ...]` | 複数要素を扱う時 |
| `queryAllBy...` | `[]` を返す | `[要素]` を返す | `[要素, ...]` | 「複数があるかも？」を確認する時 |
| `findAllBy...` | エラーを投げる（非同期で待つ） | `[要素]` を返す | `[要素, ...]` | 非同期で複数現れる要素 |

**初心者の覚え方**:
- 基本 = `getBy...`（見つからないとエラー。積極的に「見つかる」期待として使う）
- 「ないこと」を確認 = `queryBy...`（見つからないと null。これを not で検証）
- 非同期（API取得後など） = `findBy...`（出現するまで待つ）

### 「要素が存在しない」ことを確認する

`getBy...` は見つからないと**エラーを投げます**。つまり「存在しないことを確認」には使えません。代わりに `queryBy...` を使います：

```tsx
it("未ログイン時はログインリンクが表示され、ログアウトは表示されない", () => {
  render(<Header isLoggedIn={false} />);

  // 「ログイン」は存在する → getByText で OK
  expect(screen.getByText("ログイン")).toBeInTheDocument();

  // 「ログアウト」は存在しない → getByText はエラーになる
  // 代わりに queryByText を使い、見つからないと null を返す関数を使う
  // そして「画面にないこと」を .not.toBeInTheDocument() で検証
  expect(screen.queryByText("ログアウト")).not.toBeInTheDocument();
});
```

> **初心者のつまずきポイント**: なぜ `getByText` → `queryByText` に変えるの？
>
> `getByText` は対象が見つからないと**その時点で例外を投げてテストが止まる**からです。「存在しないこと」をテストするには、例外ではなく「nullを返す」`queryByText` を使って、nullを判定できるようにします。

### クエリの優先順位 — 何で探すか？

これまで `getByText` を使いましたが、React Testing Library は要素を**何で**探すかにもバリエーションがあります。重要な原則: **ユーザーが探す方法で探す**。

```tsx
// 1. getByRole — 最も推奨
// role(役割) はHTML要素のセマンティックな意味
// ユーザーは「ボタン」「見出し」で認識するので、これに近い
screen.getByRole("button", { name: /送信/i });  // 「送信」という名前のボタン
screen.getByRole("heading", { level: 1 });       // h1タグ（レベル1の見出し）
screen.getByRole("textbox", { name: /メール/i }); // 「メール」というラベルの入力欄
screen.getByRole("checkbox", { checked: true });  // チェックされたチェックボックス

// 2. getByLabelText — フォームで推奨
// ラベル紐付けされた入力欄。ユーザーはラベルを見て入力する
screen.getByLabelText("メールアドレス");

// 3. getByPlaceholderText — 補助的
screen.getByPlaceholderText("名前を入力");

// 4. getByText — 文字で探す（見出しやボタン以外に）
screen.getByText("ログイン");
screen.getByText(/部分一致/);

// 5. getByDisplayValue — 現在の値で探す
screen.getByDisplayValue("現在の値");

// 6. getByAltText — 画像のalt
screen.getByAltText("プロフィール画像");

// 7. getByTitle — title属性
screen.getByTitle("詳細を表示");

// 8. getByTestId — 最後の手段
// data-testid="..." という属性。ユーザーからは見えない
// 上記で探せない時だけ使う。どうしても壊れやすいクラス名に頼りたくない時に
screen.getByTestId("submit-button");
```

**なぜ優先順位があるのか？** ユーザーに**本当に見えている方法**で探すテストほど安全です。クラス名（`getByClassName` はそもそも存在しない）で探すと、CSSの都合で壊れやすいです。`role` で探せば、「ボタンとして何が見えているか」で確認できるので、リファクタリングに強くなります。

> **初心者の疑問**: 覚えきれない。何を使えばいい？
>
> 最初は **`getByRole` と `getByText` だけ** 覚えればOKです。
> - ボタン・見出し・入力欄など「役割」がある要素 → `getByRole`
> - それ以外（単純に文字が表示されているだけの要素）→ `getByText`
>
> フォームを書くときは `getByLabelText` もすぐ使えるようになりましょう。

---

## 2. ユーザーイベント — クリック・入力を再現する

### なぜ「イベント」が必要か

ユーザーは画面を見るだけではなく、**操作**します。ボタンをクリック、入力欄に文字を打つ、選択肢を選ぶ。こうした操作で画面がどう変わるかをテストするには、**「操作を模擬する」道具**が必要です。

```tsx
// ❌ fireEvent: 低レベル。イベント発火だけを再現
// 実際のユーザー操作より「素っ気ない」。フォーカス移動などは再現されない
import { fireEvent } from "@testing-library/react";
fireEvent.click(button);
fireEvent.change(input, { target: { value: "test" } });

// ✅ userEvent: 高レベル。本当のユーザー操作を再現
// クリックなら「フォーカス → クリック」まで再現してくれる
import userEvent from "@testing-library/user-event";
await userEvent.click(button);
await userEvent.type(input, "test");
```

> **初心者の疑問**: なぜ userEvent のほうがいいの？
>
> 実際のユーザーは「クリックする前に、その場所にフォーカスを合わせる」などの操作を意図せず行っています。`fireEvent` は「クリックのイベント」だけ発生させますが、`userEvent` はその周辺の動作（フォーカス・キーダウン等）もまとめて再現してくれます。結果、「本物のユーザー操作」に近いテストになり、見落としにくいバグも検出できます。

### userEventの使い方 — 1つずつ理解する

フォームを一通り入力して送信するシナリオで見てみましょう：

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

describe("ContactForm", () => {
  it("フォームを入力して送信", async () => {
    // userEvent.setup() = ユーザー操作を再現する準備
    // これで「1人のユーザー」オブジェクトが作られる
    const user = userEvent.setup();

    // onSubmit は本当に呼ばれるか監視したいのでモックにする
    // vi.fn() で「何もしないが呼ばれたことを記録する関数」を作る
    const onSubmit = vi.fn();

    render(<ContactForm onSubmit={onSubmit} />);

    // --- ここから実際のユーザー操作を再現 ---

    // 1. 名前入力: getByLabelText で入力欄を見つけ、ユーザーがタイプ
    // user.type は人間のように1文字ずつ入力する
    const nameInput = screen.getByLabelText("名前");
    await user.type(nameInput, "田中太郎");

    // 2. メール入力
    const emailInput = screen.getByLabelText("メール");
    await user.type(emailInput, "taro@example.com");

    // 3. カテゴリを選択（セレクトボックス）
    const select = screen.getByLabelText("カテゴリ");
    await user.selectOptions(select, "質問");

    // 4. チェックボックスをクリック
    const checkbox = screen.getByLabelText("同意する");
    await user.click(checkbox);

    // 5. 送信ボタンをクリック
    const submitButton = screen.getByRole("button", { name: "送信" });
    await user.click(submitButton);

    // --- 操作完了。ここから検証 ---

    // onSubmit が「期待する引数」で呼ばれたか確認
    expect(onSubmit).toHaveBeenCalledWith({
      name: "田中太郎",
      email: "taro@example.com",
      category: "質問",
      agree: true,
    });
  });
});
```

### よく使うuserEventの操作一覧

```tsx
// クリック系
await user.click(button);
await user.dblClick(button);           // ダブルクリック
await user.hover(element);             // ホバー
await user.unhover(element);           // ホバー解除

// キーボード入力系
await user.type(input, "Hello World"); // テキスト入力（1文字ずつ）
await user.clear(input);                // 全選択して削除
await user.keyboard("{Enter}");         // Enterキー
await user.keyboard("{Control>}a{/Control}"); // Ctrl+A（全選択）

// フォーカス系
await user.tab(); // Tabキーで次の要素にフォーカス（アクセシビリティ確認に便利）
await user.click(input); // クリックでフォーカス移動

// セレクト系
await user.selectOptions(select, "option1"); // 単一選択
await user.selectOptions(multiSelect, ["option1", "option2"]); // 複数選択

// ラジオ
await user.click(radioButton); // ラジオもクリックで選択
```

> **初心者のつまずきポイント**: なぜ `await` が必要？
>
> `userEvent` の操作は**非同期**です（内部でタイマーや状態更新を待つため）。`await` を忘れると操作が完了する前に検証に入ってしまいます。`it` 関数の前に `async` を付けるのも忘れずに！
>
> ```ts
> it("...", async () => {  // ← async を付ける
>   ...
>   await user.click(button); // ← await を付ける
> });
> ```

---

## 3. コンポーネントテストのパターン — よくある3つの型

### パターン1: Propsのテスト

Propsを受け取って表示するだけのコンポーネント。テストは「Propsを渡したとき、期待する表示になるか」を確認します：

```tsx
// Button.tsx
function Button({ 
  children, 
  onClick, 
  disabled = false,
  variant = "primary" 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

```tsx
// Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

describe("Button", () => {
  it("子要素のテキストを表示する", () => {
    // children として「クリック」を渡す
    render(<Button>クリック</Button>);

    // getByRole("button") = ボタン要素を探す
    // name オプション = アクセシブルネーム（ボタン内のテキスト）
    expect(screen.getByRole("button", { name: "クリック" })).toBeInTheDocument();
  });

  it("クリックでonClickが呼ばれる", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn(); // 呼ばれたか監視する

    render(<Button onClick={handleClick}>クリック</Button>);
    await user.click(screen.getByRole("button"));

    // 1回呼ばれたことを検証
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabledの時はクリックしてもonClickが呼ばれない", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    // disabled 属性を付与
    render(<Button onClick={handleClick} disabled>クリック</Button>);
    await user.click(screen.getByRole("button"));

    // 呼ばれていないことを確認
    expect(handleClick).not.toHaveBeenCalled();

    // さらにボタンが「無効化状態」であることも確認
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("variant に応じてクラス名が変わる", () => {
    // rerender = 同じコンポーネントを別Propsで再描画
    // 同じテスト内で複数のPropsバリエーションを確認する時に便利
    const { rerender } = render(<Button variant="primary">B</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-primary");

    // variant を danger に変更して再描画
    rerender(<Button variant="danger">B</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-danger");
  });
});
```

### パターン2: 条件付きレンダリングのテスト

Propsの条件によって表示が変わるコンポーネント。「表示される場合・されない場合」の両方をテストします：

```tsx
// Alert.tsx
function Alert({ message, type = "info", onClose }: {
  message: string;
  type?: "info" | "warning" | "error";
  onClose?: () => void;
}) {
  // メッセージが空なら何も描画しない
  if (!message) return null;

  return (
    <div role="alert" className={`alert alert-${type}`}>
      <span>{message}</span>
      {/* onClose が渡されたときだけ閉じるボタンを表示 */}
      {onClose && (
        <button onClick={onClose} aria-label="閉じる">×</button>
      )}
    </div>
  );
}
```

```tsx
// Alert.test.tsx
describe("Alert", () => {
  it("メッセージが空の場合は何も表示しない", () => {
    render(<Alert message="" />);

    // 表示されないことを確認するには queryBy を使う
    // null が返るのでtoBeInTheDocument は false になる
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("メッセージを表示する", () => {
    render(<Alert message="保存しました" />);

    // 「保存しました」というテキストを含む alert 要素があることを確認
    expect(screen.getByRole("alert")).toHaveTextContent("保存しました");
  });

  it("type に応じてクラス名が変わる", () => {
    const { rerender } = render(<Alert message="M" type="info" />);
    expect(screen.getByRole("alert")).toHaveClass("alert-info");

    rerender(<Alert message="M" type="error" />);
    expect(screen.getByRole("alert")).toHaveClass("alert-error");
  });

  it("閉じるボタンをクリックするとonCloseが呼ばれる", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<Alert message="M" onClose={onClose} />);

    // aria-label で探す（目に見えるテキストが「×」だけなので分かりにくい時）
    await user.click(screen.getByRole("button", { name: "閉じる" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("onCloseが渡されない場合は閉じるボタンが表示されない", () => {
    render(<Alert message="M" />);

    // onClose がないと button は描画されない
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
```

### パターン3: リストのテスト

配列を map してリストを描画するコンポーネント。「複数ある」ことを検証するには `getAllBy...` や `getAllByRole` を使います：

```tsx
// UserList.tsx
function UserList({ users, onSelect }: {
  users: { id: number; name: string }[];
  onSelect?: (id: number) => void;
}) {
  if (users.length === 0) {
    return <p>ユーザーがいません</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <button onClick={() => onSelect?.(user.id)}>
            {user.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```tsx
// UserList.test.tsx
describe("UserList", () => {
  const users = [
    { id: 1, name: "太郎" },
    { id: 2, name: "花子" },
  ];

  it("空配列の場合はメッセージを表示", () => {
    render(<UserList users={[]} />);

    // 空の場合の「メッセージ」を確認
    expect(screen.getByText("ユーザーがいません")).toBeInTheDocument();
  });

  it("ユーザーリストを表示する", () => {
    render(<UserList users={users} />);

    // 複数ある場合は getAllByRole を使う
    // listitem は <li> 要素（リストの項目）を指す
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    // 各ユーザー名が表示されていることも確認
    expect(screen.getByText("太郎")).toBeInTheDocument();
    expect(screen.getByText("花子")).toBeInTheDocument();
  });

  it("ユーザー名をクリックするとonSelectが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<UserList users={users} onSelect={onSelect} />);

    // 「太郎」というテキストを持つ要素（ボタン）をクリック
    await user.click(screen.getByText("太郎"));

    // 太郎の id である 1 を引数に呼ばれたことを確認
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
```

---

## 4. フォームのテスト — 入力・バリデーション・送信

フォームは「入力 → バリデーション → 送信」の流れがあるため、少し複雑です。React Hook Form を使ったログインフォームを例にしましょう：

```tsx
// LoginForm.tsx
import { useForm } from "react-hook-form";

function LoginForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">メール</label>
        <input
          id="email"
          {...register("email", { required: "必須", pattern: { value: /\S+@\S+\.\S+/, message: "形式が不正" } })}
        />
        {errors.email && <span role="alert">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "必須", minLength: { value: 8, message: "8文字以上" } })}
        />
        {errors.password && <span role="alert">{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "送信中..." : "ログイン"}
      </button>
    </form>
  );
}
```

```tsx
// LoginForm.test.tsx
describe("LoginForm", () => {
  it("正常に入力して送信できる", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    // 1. フォームに値を入力
    // getByLabelText は label と紐付いた入力欄を探す（一番フォームに適した方法）
    await user.type(screen.getByLabelText("メール"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");

    // 2. 送信ボタンをクリック
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    // 3. onSubmit が入力値を引数に呼ばれたか検証
    expect(onSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("未入力で送信するとバリデーションエラーが表示される", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={vi.fn()} />);

    // 何も入力せずに送信
    await user.click(screen.getByRole("button"));

    // required のエラーメッセージが表示される
    // role="alert" はエラーメッセージなどに使う
    expect(screen.getByText("必須")).toBeInTheDocument();
  });

  it("不正なメール形式だとエラーが表示される", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={vi.fn()} />);

    // メールだけ入力（形式不正）
    await user.type(screen.getByLabelText("メール"), "invalid");
    await user.click(screen.getByRole("button"));

    // 形式エラーのメッセージが表示される
    expect(screen.getByText("形式が不正")).toBeInTheDocument();
  });
});
```

> **初心者のつまずきポイント**: `getByText("必須")` でいいの？複数の「必須」が表示されたら？
>
> その場合は `getByText` はエラーを投げます（複数あるから）。複数の「必須」を確認したい時は `getAllByText("必須")` を使います。テストが失敗した時のエラーメッセージに「複数見つかった」と出るので、都度書き換えればOKです。

---

## 5. アクセシビリティのテスト — すべての人が使えるか

テストの中には「スクリーンリーダーを使う人にもアクセシブルか」を確認することもできます。これは初学者向けというより発展ですが、知っておくと品質が上がります：

```tsx
import { axe } from "jest-axe";

it("アクセシビリティ違反がない", async () => {
  // container = render が返す「仮想画面のDOM」
  const { container } = render(<MyComponent />);

  // axe = アクセシビリティを自動チェックするツール
  const results = await axe(container);

  // 違反が0件であることを検証
  expect(results).toHaveNoViolations();
});
```

> **初心者の疑問**: アクセシビリティって何？
>
> 身体が不自由な方や、スクリーンリーダー（音声読み上げ）を使う人にも使いやすいか、という概念です。`role` で要素を探すテストを書くこと自体、すでにアクセシブルな書き方の第一歩です。

---

## 6. 実践演習 — 自分で書いてみよう

### 演習1: Counterコンポーネント

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**書くべきテストケース**:
1. 初期状態で「Count: 0」と表示される
2. 「+」ボタンをクリックすると「Count: 1」になる
3. 「-」ボタンをクリックすると数が減る
4. 「Reset」ボタンをクリックすると「0」に戻る

<details>
<summary>ヒント</summary>

- テキストの確認には `getByText` を使う。「Count: 1」を完全一致で探すか、正規表現 `/Count: 1/` を使う
- 「+」「-」「Reset」は3つとも button role。`name` オプションで区別する
- `screen.getByRole("button", { name: "+" })` で「+」のボタンを取得
</details>

### 演習2: Modalコンポーネント

```tsx
function Modal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true">
      <button onClick={onClose} aria-label="閉じる">×</button>
      {children}
    </div>
  );
}
```

**書くべきテストケース**:
1. `isOpen={false}` では何も表示されない
2. `isOpen={true}` では dialog が表示される
3. 「閉じる」ボタンをクリックすると `onClose` が呼ばれる
4. `children` に渡した内容が表示される

### 演習3: TodoListコンポーネント

```tsx
function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input.trim()]);
      setInput("");
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="新しいTodo"
      />
      <button onClick={addTodo}>追加</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo}
            <button onClick={() => removeTodo(i)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**書くべきテストケース**:
1. 入力して「追加」をクリックすると Todo が表示される
2. 空文字のまま「追加」をクリックしても追加されない
3. 「削除」をクリックするとその Todo が消える
4. 複数の Todo を追加できる

<details>
<summary>回答例（演習1のみ）</summary>

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("初期状態でCount: 0と表示される", () => {
    render(<Counter />);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("+ボタンで増える", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });

  it("-ボタンで減る", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "-" }));
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });

  it("Resetで0に戻る", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });
});
```
</details>

---

## まとめ

### React Testing Libraryのポイント

| 概念 | 説明 | 初心者の理解 |
|------|------|-------------|
| `render` | コンポーネントを仮想画面に描画 | 画面にコンポーネントを登場させる |
| `screen` | 描画後の仮想画面にアクセス | 画面を見るための窓口 |
| `getBy...` | 要素を1つ探す（なければエラー） | 「必ずあるはず」の確認に |
| `queryBy...` | 要素を1つ探す（なければ null） | 「ないこと」の確認に |
| `findBy...` | 非同期で要素を待つ | API後の表示などに |
| `getByRole` | 役割で探す（最推奨） | ユーザー目線で探す |
| `userEvent` | ユーザー操作をシミュレート | 本物のクリック・入力を再現 |
| `toBeInTheDocument` | 画面に存在するか検証 | 「表示されているか」の確認 |

### 初心者が次に進む前に確認すること

- [ ] `render` でコンポーネントを描画できる
- [ ] `getByRole` / `getByText` で要素を探せる
- [ ] `getBy` と `queryBy` の違いを説明できる
- [ ] `userEvent.click` / `user.type` が使える
- [ ] `toBeInTheDocument` で存在確認ができる
- [ ] 演習1のCounterのテストを自分で書けた

### 次のセッション

Session 3では、コンポーネントが「APIからデータを取得する」場合のテストを学びます。APIを呼ぶコンポーネントは、そのままでは外部サーバーに依存してしまいテストが不安定になります。**MSW（Mock Service Worker）** という道具で「APIのふり」をさせる方法を学びます。