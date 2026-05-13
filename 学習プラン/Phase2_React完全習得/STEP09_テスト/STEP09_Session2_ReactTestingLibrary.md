# Session 2: React Testing Library

## はじめに：コンポーネントをテストする

Session 1でVitestの基礎を学びました。このセッションでは、**React Testing Library**を使って実際のReactコンポーネントをテストする方法を学びます。

### React Testing Libraryの哲学

> **"The more your tests resemble the way your software is used, the more confidence they can give you."**
> （テストがソフトウェアの使われ方に近づくほど、自信を持てる）

**テストするのは「実装」ではなく「振る舞い」**:

```tsx
// ❌ 実装の詳細をテスト（避ける）
expect(wrapper.find('.button').length).toBe(1);

// ✅ ユーザーの視点でテスト（推奨）
expect(screen.getByRole('button')).toBeInTheDocument();
```

---

## 1. レンダリングとクエリ

### 基本的なレンダリング

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Greeting } from "./Greeting";

describe("Greeting", () => {
  it("名前を表示する", () => {
    render(<Greeting name="太郎" />);
    
    expect(screen.getByText("こんにちは、太郎さん！")).toBeInTheDocument();
  });
});
```

### クエリの種類

| クエリ | 0件 | 1件 | 複数件 | 使い方 |
|--------|-----|-----|--------|--------|
| `getBy...` | エラー | 要素 | エラー | 要素が存在することを確認 |
| `queryBy...` | null | 要素 | エラー | 要素が存在しないことを確認 |
| `findBy...` | エラー | 要素 | エラー | 非同期で現れる要素 |
| `getAllBy...` | エラー | [要素] | [要素, ...] | 複数要素 |
| `queryAllBy...` | [] | [要素] | [要素, ...] | 複数要素（存在しない可能性） |
| `findAllBy...` | エラー | [要素] | [要素, ...] | 非同期で現れる複数要素 |

### 優先順位の高いクエリ

```tsx
// 1. getByRole（最も推奨）
screen.getByRole("button", { name: /送信/i });
screen.getByRole("heading", { level: 1 });
screen.getByRole("textbox", { name: /メール/i });
screen.getByRole("checkbox", { checked: true });

// 2. getByLabelText
screen.getByLabelText("メールアドレス");

// 3. getByPlaceholderText
screen.getByPlaceholderText("名前を入力");

// 4. getByText
screen.getByText("ログイン");
screen.getByText(/部分一致/);

// 5. getByDisplayValue
screen.getByDisplayValue("現在の値");

// 6. getByAltText
screen.getByAltText("プロフィール画像");

// 7. getByTitle
screen.getByTitle("詳細を表示");

// 8. getByTestId（最後の手段）
screen.getByTestId("submit-button");
```

### 要素が存在しないことを確認

```tsx
it("ログアウト状態ではログインリンクが表示される", () => {
  render(<Header isLoggedIn={false} />);
  
  expect(screen.getByText("ログイン")).toBeInTheDocument();
  expect(screen.queryByText("ログアウト")).not.toBeInTheDocument();
});
```

---

## 2. ユーザーイベント

### fireEvent vs userEvent

```tsx
// ❌ fireEvent（低レベル、非推奨）
import { fireEvent } from "@testing-library/react";
fireEvent.click(button);
fireEvent.change(input, { target: { value: "test" } });

// ✅ userEvent（高レベル、推奨）
import userEvent from "@testing-library/user-event";
await userEvent.click(button);
await userEvent.type(input, "test");
```

`userEvent`は実際のユーザーの操作をシミュレートします:
- `click`: フォーカス → クリック
- `type`: キーボード入力を1文字ずつ
- `clear`: 選択して削除
- `selectOptions`: セレクトボックス

### userEventの使い方

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

describe("Form", () => {
  it("フォームを入力して送信", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<ContactForm onSubmit={onSubmit} />);
    
    // テキスト入力
    const nameInput = screen.getByLabelText("名前");
    await user.type(nameInput, "田中太郎");
    
    // メール入力
    const emailInput = screen.getByLabelText("メール");
    await user.type(emailInput, "taro@example.com");
    
    // セレクト
    const select = screen.getByLabelText("カテゴリ");
    await user.selectOptions(select, "質問");
    
    // チェックボックス
    const checkbox = screen.getByLabelText("同意する");
    await user.click(checkbox);
    
    // 送信
    const submitButton = screen.getByRole("button", { name: "送信" });
    await user.click(submitButton);
    
    // 検証
    expect(onSubmit).toHaveBeenCalledWith({
      name: "田中太郎",
      email: "taro@example.com",
      category: "質問",
      agree: true,
    });
  });
});
```

### よく使うuserEvent

```tsx
// クリック
await userEvent.click(button);
await userEvent.dblClick(button);
await userEvent.hover(element);
await userEvent.unhover(element);

// キーボード
await userEvent.type(input, "Hello World");
await userEvent.clear(input);
await userEvent.keyboard("{Enter}");
await userEvent.keyboard("{Control>}a{/Control}"); // Ctrl+A

// フォーカス
await userEvent.tab(); // Tabキー
await userEvent.click(input); // フォーカスを移動

// セレクト
await userEvent.selectOptions(select, "option1");
await userEvent.selectOptions(multiSelect, ["option1", "option2"]);

// ラジオボタン
await userEvent.click(radioButton);
```

---

## 3. コンポーネントテストのパターン

### Propsのテスト

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

// Button.test.tsx
describe("Button", () => {
  it("テキストを表示する", () => {
    render(<Button>クリック</Button>);
    expect(screen.getByRole("button", { name: "クリック" })).toBeInTheDocument();
  });
  
  it("クリックイベントを発火", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>クリック</Button>);
    await user.click(screen.getByRole("button"));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it("disabled時はクリックしない", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick} disabled>クリック</Button>);
    await user.click(screen.getByRole("button"));
    
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
  
  it("variantに応じたクラス", () => {
    const { rerender } = render(<Button variant="primary">B</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-primary");
    
    rerender(<Button variant="danger">B</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-danger");
  });
});
```

### 条件付きレンダリングのテスト

```tsx
// Alert.tsx
function Alert({ message, type = "info", onClose }: {
  message: string;
  type?: "info" | "warning" | "error";
  onClose?: () => void;
}) {
  if (!message) return null;
  
  return (
    <div role="alert" className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} aria-label="閉じる">×</button>
      )}
    </div>
  );
}

// Alert.test.tsx
describe("Alert", () => {
  it("メッセージがない場合は何も表示しない", () => {
    render(<Alert message="" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  
  it("メッセージを表示", () => {
    render(<Alert message="保存しました" />);
    expect(screen.getByRole("alert")).toHaveTextContent("保存しました");
  });
  
  it("タイプに応じたクラス", () => {
    const { rerender } = render(<Alert message="M" type="info" />);
    expect(screen.getByRole("alert")).toHaveClass("alert-info");
    
    rerender(<Alert message="M" type="error" />);
    expect(screen.getByRole("alert")).toHaveClass("alert-error");
  });
  
  it("閉じるボタンをクリック", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<Alert message="M" onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "閉じる" }));
    
    expect(onClose).toHaveBeenCalled();
  });
  
  it("onCloseがない場合は閉じるボタンを表示しない", () => {
    render(<Alert message="M" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
```

### リストのテスト

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

// UserList.test.tsx
describe("UserList", () => {
  const users = [
    { id: 1, name: "太郎" },
    { id: 2, name: "花子" },
  ];
  
  it("空の場合のメッセージ", () => {
    render(<UserList users={[]} />);
    expect(screen.getByText("ユーザーがいません")).toBeInTheDocument();
  });
  
  it("ユーザーリストを表示", () => {
    render(<UserList users={users} />);
    
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("太郎")).toBeInTheDocument();
    expect(screen.getByText("花子")).toBeInTheDocument();
  });
  
  it("ユーザーを選択", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    
    render(<UserList users={users} onSelect={onSelect} />);
    await user.click(screen.getByText("太郎"));
    
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
```

---

## 4. フォームのテスト

### React Hook Formのテスト

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

// LoginForm.test.tsx
describe("LoginForm", () => {
  it("正常に送信", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<LoginForm onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText("メール"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.click(screen.getByRole("button", { name: "ログイン" }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
  
  it("空の場合はバリデーションエラー", async () => {
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button"));
    
    expect(screen.getByText("必須")).toBeInTheDocument();
  });
  
  it("メール形式エラー", async () => {
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={vi.fn()} />);
    await user.type(screen.getByLabelText("メール"), "invalid");
    await user.click(screen.getByRole("button"));
    
    expect(screen.getByText("形式が不正")).toBeInTheDocument();
  });
});
```

---

## 5. アクセシビリティのテスト

```tsx
import { axe } from "jest-axe";

it("アクセシビリティ違反がない", async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 6. 実践演習

### 演習1: Counterコンポーネントのテスト

```tsx
// Counter.tsx
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

**テストケース**:
1. 初期値は0
2. +をクリックで増加
3. -をクリックで減少
4. Resetで0に戻る

### 演習2: Modalコンポーネントのテスト

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

**テストケース**:
1. isOpen=falseで非表示
2. isOpen=trueで表示
3. 閉じるボタンでonClose呼び出し
4. 内容が表示される

### 演習3: TodoListコンポーネントのテスト

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

**テストケース**:
1. Todoを追加
2. 空文字は追加されない
3. Todoを削除
4. 複数Todoの管理

---

## まとめ

### React Testing Libraryのポイント

| 概念 | 説明 |
|------|------|
| `render` | コンポーネントをレンダリング |
| `screen` | レンダリングされた要素にアクセス |
| `getByRole` | 最も推奨されるクエリ |
| `userEvent` | ユーザー操作のシミュレーション |
| `toBeInTheDocument` | 要素の存在確認 |
| `act` | 状態更新をラップ |

### 次のセッション

Session 3では、**MSW（Mock Service Worker）**を使ったAPIモックと統合テストを学びます。
