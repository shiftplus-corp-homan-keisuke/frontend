# Session 1: React Hook Form + Zod 基礎

## はじめに：なぜフォーム管理ライブラリが必要なのか？

STEP03で学んだように、Reactでフォームを管理するには「制御されたコンポーネント（Controlled Component）」を使います。しかし、フォームが複雑になると以下の問題が生じます。

### バニラReactでのフォーム管理の問題

```tsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // バリデーション
    if (!email.includes("@")) {
      setEmailError("正しいメールアドレスを入力してください");
      setIsSubmitting(false);
      return;
    }
    if (password.length < 8) {
      setPasswordError("パスワードは8文字以上必要です");
      setIsSubmitting(false);
      return;
    }
    
    // API送信...
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
        }}
      />
      {emailError && <span>{emailError}</span>}
      
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError("");
        }}
      />
      {passwordError && <span>{passwordError}</span>}
      
      <button disabled={isSubmitting}>送信</button>
    </form>
  );
}
```

**問題点**:
- Stateのボイラープレートが多い
- バリデーションロジックがフォームコンポーネントに散らばる
- エラーメッセージの管理が煩雑
- 型安全性が低い
- パフォーマンス（毎文字入力で再レンダリング）

### React Hook Formが解決すること

| 課題 | 解決策 |
|------|--------|
| 再レンダリング | アンコントロールドコンポーネントを活用 |
| バリデーション | 宣言的なバリデーション設定 |
| エラー管理 | 自動的なエラーオブジェクト管理 |
| 型安全性 | TypeScriptとの完璧な統合 |
| コード量 | ボイラープレートを大幅削減 |

---

## 1. 環境構築

### 必要なパッケージ

```bash
npm install react-hook-form zod @hookform/resolvers
```

| パッケージ | 役割 |
|-----------|------|
| `react-hook-form` | フォーム状態管理のコアライブラリ |
| `zod` | TypeScriptファーストのスキーマバリデーション |
| `@hookform/resolvers` | React Hook FormとZodを橋渡し |

### プロジェクトの準備

STEP07で使ったVite + React + TypeScriptプロジェクトを引き継ぎます。

```bash
cd step07-patterns  # 既存プロジェクト
npm install react-hook-form zod @hookform/resolvers
```

または新規作成:

```bash
npm create vite@latest step08-forms -- --template react-ts
cd step08-forms
npm install
npm install react-hook-form zod @hookform/resolvers
```

---

## 2. React Hook Form の基本構文

### 最もシンプルな使い方

```tsx
import { useForm } from "react-hook-form";

function SimpleForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="名前" />
      <input {...register("email")} placeholder="メール" />
      <button type="submit">送信</button>
    </form>
  );
}
```

### `useForm` の戻り値を理解する

const {
  register,        // ネイティブの非制御コンポーネント（input/select/textarea）を登録
  handleSubmit,    // 送信ハンドラーをラップ
  formState,       // フォームの状態（エラー、送信状態など）
  watch,           // 値の監視
  setValue,        // 値の手動設定
  reset,           // フォームをリセット
  control,         // 制御コンポーネント（外部UIライブラリ、カスタムコンポーネント）を管理
} = useForm();

// register と control の違い:
// register: 標準HTML要素を直接登録する。ref を使って非制御（Uncontrolled）アプローチで動作し、
//           入力のたびに再レンダリングが発生しないためパフォーマンスが高い。
// control:  制御コンポーネント（Controlled）を扱うためのオブジェクト。MUI や Chakra UI などの
//           外部ライブラリ、または独自のカスタムコンポーネントを使用する場合に必要。
//           内部的な value と onChange を React Hook Form と連携させるため、
//           Controller コンポーネントとセットで使用する。

### `register` の仕組み

`register`は、input要素に`name`、`onChange`、`onBlur`、`ref`を自動的に割り当てます。

```tsx
// この書き方...
<input {...register("email")} />

// 実際には以下と同じ:
<input
  name="email"
  onChange={...}      // React Hook Formが管理
  onBlur={...}        // React Hook Formが管理
  ref={...}           // React Hook Formが管理
/>
```

### `control` と `Controller` の使い方

外部ライブラリ（Material UI、Chakra UI など）や独自のカスタムコンポーネントを使う場合、`register` の代わりに `Controller` コンポーネントを使います。

```tsx
import { useForm, Controller } from "react-hook-form";

function ControlledForm() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <select {...field}>
            <option value="jp">日本</option>
            <option value="us">アメリカ</option>
            <option value="uk">イギリス</option>
          </select>
        )}
      />
      <button type="submit">送信</button>
    </form>
  );
}
```

`Controller` の `render` 関数には `field` オブジェクトが渡されます。これには `value`、`onChange`、`onBlur`、`name`、`ref` が含まれており、外部コンポーネントと React Hook Form を橋渡しします。

```tsx
// カスタムコンポーネントとの連携例
<<Controller
  name="username"
  control={control}
  render={({ field, fieldState }) => (
    <CustomInput
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  )}
/>
```

| `render` 引数 | 内容 |
|------|------|
| `field.value` | 現在の値 |
| `field.onChange` | 値変更時に呼ぶ関数 |
| `field.onBlur` | フォーカス解除時に呼ぶ関数 |
| `field.ref` | 要素への参照 |
| `fieldState.error` | そのフィールドのエラー情報 |

**重要**: `register`は**アンコントロールド**アプローチを基本としつつ、バリデーションやイベントを管理します。

---

## 3. Zod でスキーマを定義する

### Zod の基本

Zodは「TypeScriptファースト」のスキーマ宣言ライブラリです。型とバリデーションを同時に定義できます。

```ts
import { z } from "zod";

// スキーマ定義
const userSchema = z.object({
  name: z.string().min(1, { error: "名前は必須です" }),
  email: z.string().email({ error: "正しいメールアドレスを入力してください" }),
  age: z.number().min(0, { error: "年齢は0以上です" }).max(150, { error: "正しい年齢を入力してください" }),
  website: z.string().url().optional(), // オプショナル
});

// TypeScriptの型を自動生成
type User = z.infer<typeof userSchema>;
// 結果: { name: string; email: string; age: number; website?: string | undefined }
```

### よく使う Zod のバリデータ

```ts
z.string()                    // 文字列
  .min(5, { error: "5文字以上" })         // 最小長
  .max(100, { error: "100文字以下" })     // 最大長
  .email({ error: "メール形式" })         // メール形式
  .url({ error: "URL形式" })              // URL形式
  .regex(/^[a-z]+$/, { error: "英小文字のみ" }); // 正規表現

z.number()                    // 数値
  .min(0)                      // 最小値
  .max(100)                    // 最大値
  .int({ error: "整数のみ" });             // 整数

z.boolean();                  // 真偽値
z.date();                     // 日付
z.array(z.string());          // 文字列の配列
z.enum(["admin", "user"]);     // enum
z.literal("success");         // 特定の値のみ
```

---

## 4. React Hook Form + Zod の連携

### 基本的な連携パターン

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. スキーマ定義
const schema = z.object({
  email: z
    .string()
    .min(1, { error: "メールアドレスは必須です" })
    .email({ error: "正しいメールアドレスを入力してください" }),
  password: z
    .string()
    .min(8, { error: "パスワードは8文字以上必要です" })
    .max(100, { error: "パスワードは100文字以下にしてください" }),
});

// 2. 型の抽出
type FormData = z.infer<typeof schema>;

function LoginForm() {
  // 3. zodResolverで連携
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("送信データ:", data);
    // { email: string; password: string }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>メールアドレス</label>
        <input type="email" {...register("email")} />
        {errors.email && (
          <span className="error">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label>パスワード</label>
        <input type="password" {...register("password")} />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      <button type="submit">ログイン</button>
    </form>
  );
}
```

### エラーの表示パターン

```tsx
function FormWithErrors() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* パターン1: フィールド直下にエラー表示 */}
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}

      {/* パターン2: エラーがある場合にスタイル変更 */}
      <input
        {...register("password")}
        className={errors.password ? "input-error" : "input"}
      />

      {/* パターン3: フォーム上部に全エラーを表示 */}
      {Object.keys(errors).length > 0 && (
        <div className="error-summary">
          <p>以下のエラーを修正してください:</p>
          <ul>
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="submit">送信</button>
    </form>
  );
}
```

---

## 5. 高度なバリデーション

### カスタムバリデーション

```ts
const schema = z.object({
  password: z.string().min(8, { error: "8文字以上" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  error: "パスワードが一致しません",
  path: ["confirmPassword"], // エラーをどのフィールドに表示するか
});
```

### 変換（Transform）

```ts
const schema = z.object({
  // 文字列として受け取って数値に変換
  age: z.string().transform((val) => parseInt(val, 10)).pipe(
    z.number().min(0).max(150)
  ),
  
  // 前後の空白を削除
  username: z.string().transform((val) => val.trim()),
});
```

### 条件付きバリデーション

```ts
const schema = z.object({
  role: z.enum(["user", "admin"]),
  adminCode: z.string().optional(),
}).refine(
  (data) => {
    if (data.role === "admin") {
      return data.adminCode === "SECRET123";
    }
    return true;
  },
  {
    error: "管理者コードが正しくありません",
    path: ["adminCode"],
  }
);
```

---

## 6. フォームの状態管理

### 送信状態の管理

```tsx
function SubmitForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // API呼び出し
    await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      
      {/* 送信中はボタンを無効化 */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "送信中..." : "送信"}
      </button>
      
      {/* 送信成功メッセージ */}
      {isSubmitSuccessful && <p>送信が完了しました！</p>}
    </form>
  );
}
```

### フィールドの監視

```tsx
function WatchForm() {
  const { register, watch } = useForm<FormData>();
  
  // 特定のフィールドを監視
  const email = watch("email");
  const password = watch("password");
  
  // 複数フィールドを監視
  const allFields = watch(["email", "password"]);
  
  // 全フィールドを監視
  const entireForm = watch();

  return (
    <form>
      <input {...register("email")} />
      <p>現在の入力: {email}</p>
      
      <input {...register("password")} />
      <p>パスワード強度: {getPasswordStrength(password)}</p>
    </form>
  );
}
```

### デフォルト値の設定

```tsx
function EditForm({ user }: { user: User }) {
  const { register } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
      age: user.age,
    },
  });

  return <form>{/* ... */}</form>;
}
```

---

## 7. 実践演習：ユーザ登録フォーム

### 要件

以下のフィールドを持つユーザ登録フォームを作成してください:

1. **名前**（必須、2〜50文字）
2. **メールアドレス**（必須、メール形式）
3. **パスワード**（必須、8文字以上、大文字・小文字・数字を含む）
4. **パスワード確認**（必須、パスワードと一致）
5. **年齢**（必須、18〜120の整数）
6. **プロフィールURL**（オプション、URL形式）
7. **利用規約同意**（必須、trueであること）

### 回答例

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(2, { error: "2文字以上" }).max(50, { error: "50文字以下" }),
    email: z.string().min(1, { error: "必須" }).email({ error: "正しい形式" }),
    password: z
      .string()
      .min(8, { error: "8文字以上" })
      .regex(/[A-Z]/, { error: "大文字を含む" })
      .regex(/[a-z]/, { error: "小文字を含む" })
      .regex(/[0-9]/, { error: "数字を含む" }),
    confirmPassword: z.string(),
    age: z.number().min(18, { error: "18歳以上" }).max(120, { error: "正しい年齢" }),
    website: z.string().url({ error: "正しいURL" }).optional().or(z.literal("")),
    agreeTerms: z.literal(true, { error: "同意が必要です" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: 18,
      website: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    alert("登録が完了しました！");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="field">
        <label>名前</label>
        <input {...register("name")} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      <div className="field">
        <label>メールアドレス</label>
        <input type="email" {...register("email")} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="field">
        <label>パスワード</label>
        <input type="password" {...register("password")} />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      <div className="field">
        <label>パスワード（確認）</label>
        <input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className="field">
        <label>年齢</label>
        <input type="number" {...register("age", { valueAsNumber: true })} />
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <div className="field">
        <label>プロフィールURL（任意）</label>
        <input type="url" {...register("website")} />
        {errors.website && (
          <span className="error">{errors.website.message}</span>
        )}
      </div>

      <div className="field">
        <label>
          <input type="checkbox" {...register("agreeTerms")} />
          利用規約に同意します
        </label>
        {errors.agreeTerms && (
          <span className="error">{errors.agreeTerms.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "登録中..." : "登録する"}
      </button>
    </form>
  );
}
```

---

## まとめ

### このセッションで学んだこと

| 概念 | 説明 |
|------|------|
| `useForm` | フォーム状態を管理するコアフック |
| `register` | 入力フィールドをフォームに登録 |
| `handleSubmit` | バリデーション付きの送信ハンドラー |
| `zodResolver` | ZodスキーマをReact Hook Formに連携 |
| `formState.errors` | バリデーションエラーの取得 |
| `z.infer` | ZodスキーマからTypeScript型を生成 |

### 次のセッション

Session 2では、**実践的なフォーム構築**（動的フォーム、ファイルアップロード、非同期バリデーションなど）を学びます。
