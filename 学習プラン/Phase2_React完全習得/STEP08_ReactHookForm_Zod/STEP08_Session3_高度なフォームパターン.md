# Session 3: 高度なフォームパターン（詳細解説版）

## はじめに：実務で必要になる高度なテクニック

Session 1・2 までで、React Hook Form + Zod の基礎と実践パターンを学びました。

しかし、実際のプロジェクトでは以下のような状況に必ず遭遇します：

| 実務の課題 | Session 1・2 だけでは対応しきれない理由 |
|-----------|--------------------------------------|
| デザインシステム（shadcn/ui, MUI など）のコンポーネントを使いたい | `register` を直接渡せないことが多い |
| フォームが50項目以上ある | 1つの入力で全体が再レンダリングし、重くなる |
| ユーザーが途中でブラウザを閉じる | 入力内容が失われ、ユーザーが激怒する |
| サーバーから「メールアドレスが重複」などのエラーが返ってくる | フォームのエラー表示とサーバー側の判定を統合したい |
| 同じフォーム構成を何度も書く | スキーマ定義〜エラー表示まで毎回同じコードが増える |

このセッションでは、**実務で避けて通れない5つの高度なテクニック**を、基礎から丁寧に解説します。

**前提知識**: Session 1・2 の内容（`register`, `handleSubmit`, `zodResolver`, `useFieldArray`, `FormProvider`）を理解していることを前提とします。

---

## 0. 学習の進め方（重要）

この資料では、各パターンを以下の構成で解説します。

```
1. 💡 このテクニックとは何か（概念）
2. 🎯 どんな時に使うか（ユースケース）
3. 📝 実装のステップ
4. 💻 完成コード（詳細コメント付き）
5. 🔍 コード解説（なぜそう書くのか）
6. ⚠️ よくあるミスと対処法
7. ✅ 理解度チェック
```

---

## 1. Controller: 外部UIライブラリとの連携

### 💡 このテクニックとは何か

React Hook Form は「**非制御コンポーネント（uncontrolled）**」というアプローチを基本としています。

```
非制御（uncontrolled）: Reactのstateを使わず、DOMが値を保持する
  → <input {...register("name")} /> （DOMが値を覚えている）

制御（controlled）: Reactのstateが値を保持し、それをpropsで渡す
  → <input value={name} onChange={setName} /> （Reactが値を覚えている）
```

`register` は「DOMの `ref` を取得して、DOMの値を直接読み取る」仕組みなので、**純粋なHTML要素**（`<input>`, `<select>`, `<textarea>`）にはそのまま使えます。

しかし、**shadcn/ui, MUI, Chakra UI, React Select** などの外部UIライブラリのコンポーネントは、内部で値を「制御（controlled）」方式で管理しています。これらには `value` と `onChange` をpropsとして渡す必要があり、`register` の `ref` ベースのアプローチが通用しません。

```tsx
// ❌ これは動かない（Select コンポーネントは ref で値を教えてくれない）
<Select {...register("category")} options={options} />

// ✅ Controller が橋渡しをしてくれる
//    「React Hook Form の世界」と「外部ライブラリの世界」を繋ぐアダプタ
<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <Select value={field.value} onChange={field.onChange} options={options} />
  )}
/>
```

**Controllerの役割を一言で言うと**: 「React Hook Form が管理している値を、外部コンポーネントの `value` / `onChange` 形式に翻訳して渡すアダプタ」です。

### 🎯 どんな時に使うか

- **shadcn/ui** の Select, Switch, Calendar, Checkbox など
- **MUI (Material UI)** の TextField, Select, DatePicker, Autocomplete など
- **Chakra UI** の Input, Select, Switch など
- **React Select** などのサードパーティ製セレクトボックス
- **自作の複雑な入力コンポーネント**（タグ入力、リッチテキストエディタなど）

### 📝 実装のステップ

1. `useForm` から `control` を取得する
2. 使いたい外部コンポーネントを特定し、そのAPI（`value` / `onChange` の名前）を確認する
3. `<Controller name="..." control={control} render={...}>` でラップする
4. `render` 内で `field.value`（現在値）と `field.onChange`（変更ハンドラ）を渡す
5. エラー表示も同様に `errors.フィールド名` で行う

### 💻 完成コード

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// shadcn/ui のコンポーネント（プロジェクトに応じて読み替えてください）
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";

// ============================================================
// ステップ1: Zodスキーマ
// ============================================================
const schema = z.object({
  username: z.string().min(3, { error: "3文字以上で入力してください" }),
  role: z.enum(["admin", "user", "guest"]),
  isActive: z.boolean(),
  birthDate: z.date({ required_error: "生年月日を選択してください" }),
});

type FormData = z.infer<typeof schema>;

// ============================================================
// ステップ2: コンポーネント
// ============================================================
function ShadcnForm() {
  const {
    register,
    control, // ← Controller に必須
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      role: "user",
      isActive: true,
      birthDate: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("送信データ:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ------------------------------------------------------
        パターンA: register がそのまま使える（標準HTML互換）
        shadcn/ui の Input は内部で <input> を使っているためOK
      ------------------------------------------------------ */}
      <div>
        <Label htmlFor="username">ユーザー名</Label>
        <Input id="username" {...register("username")} />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* ------------------------------------------------------
        パターンB: Controller が必要（Select）
        shadcn/ui の Select は value / onValueChange を使う
      ------------------------------------------------------ */}
      <div>
        <Label>権限</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            // field.value: 現在選択されている値
            // field.onChange: 値が変わった時に呼ぶ関数
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="権限を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">管理者</SelectItem>
                <SelectItem value="user">一般</SelectItem>
                <SelectItem value="guest">ゲスト</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-red-500">{errors.role.message}</p>
        )}
      </div>

      {/* ------------------------------------------------------
        パターンB: Controller が必要（Switch）
        Switch は checked / onCheckedChange を使う
      ------------------------------------------------------ */}
      <div className="flex items-center space-x-2">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label>アクティブ</Label>
      </div>
      {errors.isActive && (
        <p className="text-red-500">{errors.isActive.message}</p>
      )}

      {/* ------------------------------------------------------
        パターンB: Controller が必要（Calendar）
        Calendar は selected / onSelect を使う
      ------------------------------------------------------ */}
      <div>
        <Label>生年月日</Label>
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
            />
          )}
        />
        {errors.birthDate && (
          <p className="text-red-500">{errors.birthDate.message}</p>
        )}
      </div>

      <button type="submit">送信</button>
    </form>
  );
}
```

### 🔍 コード解説

#### `field` オブジェクトの中身

`Controller` の `render` 関数に渡される `field` は、外部コンポーネントと接続するための「翻訳セット」です。

```tsx
render={({ field, fieldState, formState }) => {
  // field: 入出力を繋ぐための基本セット
  console.log(field.name);     // "role"（フィールド名）
  console.log(field.value);    // "user"（現在の値）
  console.log(field.onChange); // (newValue) => void（変更をRHFに通知する関数）
  console.log(field.onBlur);   // () => void（フォーカスアウトをRHFに通知）
  console.log(field.ref);      // ref（フォーカス制御用、使わないことも多い）

  // fieldState: このフィールドの状態
  console.log(fieldState.error);     // エラーオブジェクト
  console.log(fieldState.isDirty);   // 初期値から変更されたか
  console.log(fieldState.isTouched); // 一度でも触られたか

  // formState: フォーム全体の状態
  console.log(formState.isSubmitting); // 送信中か
}}
```

#### 外部コンポーネントごとの接続パターン

| コンポーネント | 値のprop | 変更のprop | Controller側の書き方 |
|--------------|---------|-----------|---------------------|
| shadcn/ui Select | `value` | `onValueChange` | `<Select onValueChange={field.onChange} value={field.value}>` |
| shadcn/ui Switch | `checked` | `onCheckedChange` | `<Switch checked={field.value} onCheckedChange={field.onChange}>` |
| shadcn/ui Calendar | `selected` | `onSelect` | `<Calendar selected={field.value} onSelect={field.onChange}>` |
| MUI TextField | `value` | `onChange` | `<TextField value={field.value} onChange={field.onChange}>` |
| React Select | `value` | `onChange` | `<Select value={...} onChange={field.onChange}>` |

**重要**: 外部ライブラリのドキュメントで「値をどう受け取るか」「変更をどう通知するか」を必ず確認してください。`onChange` の名前が `onValueChange` だったり、値の型がオブジェクトだったりと、ライブラリごとに異なります。

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `control` を渡し忘れる | エラーが出る | `useForm` から `control` を取得し、`control={control}` を必ず書く |
| `field` を全部スプレッドして渡す | 不要な `name`, `ref` まで渡り、警告が出る | `field` の中から必要なものだけ選んで渡す（`value`, `onChange`） |
| `defaultValue` を設定しない | 初期値が空になったり予期しない動作をする | `useForm` の `defaultValues` で初期値を設定する |
| 変更イベントの型が違う | 値が反映されない | ライブラリのドキュメントで `onChange` の型を確認（イベントオブジェクトか生値か） |
| `Controller` をネストしすぎる | コードが読みにくくなる | 繰り返し使うコンポーネントは `useController` でカスタムコンポーネント化する |

### ✅ 理解度チェック

- [ ] `register` が使えるのは「非制御（uncontrolled）」コンポーネントだけである理由を説明できる
- [ ] `Controller` の3つのprops（`name`, `control`, `render`）がそれぞれ何のためにあるか説明できる
- [ ] `field.value` と `field.onChange` が、どうやってReact Hook Formと外部コンポーネントを繋いでいるか説明できる
- [ ] shadcn/ui の Select と Switch で、なぜ `onChange` ではなく `onValueChange` / `onCheckedChange` を使うのか

---

## 2. フォームのパフォーマンス最適化

### 💡 このテクニックとは何か

フォームの入力欄が増えると、**1文字打つたびに大量の再レンダリング**が発生し、画面がもたつきます。

```
悪い例（50項目のフォーム）:
  field1 に1文字入力 → BigForm 全体が再レンダリング
  field2 に1文字入力 → BigForm 全体が再レンダリング
  ...（50項目すべてで同じ）

良い例（分割後）:
  field1 に1文字入力 → PersonalInfo だけ再レンダリング
  field2（AddressInfo内）→ AddressInfo は影響を受けない
```

React Hook Form は `register` を使うことで、**その入力欄だけ**の再レンダリングに抑える仕組みを持っています。しかし、親コンポーネントが大きすぎると、親の再レンダリングが子コンポーネントも巻き込みます。

**解決策は「小さなコンポーネントに分割する」こと**です。

### 🎯 どんな時に使うか

- 入力項目が20個以上ある長いフォーム
- フォームの一部に重い処理（地図表示、リッチテキストエディタなど）が含まれる
- スマートフォンなど低スペック端末での動作が重いと報告がある
- 入力のたびにカクついてしまう

### 📝 実装のステップ

1. フォームを意味のあるブロック（個人情報・住所・支払い情報など）に分割する
2. 各ブロックを独立したコンポーネントにする
3. `FormProvider` でフォームのstateを共有する
4. 各サブコンポーネントは `useFormContext` で `register` などを取得する
5. さらに細かくしたい場合は `useController` でカスタム入力コンポーネントを作る

### 💻 完成コード（コンポーネント分割）

```tsx
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ============================================================
// スキーマ
// ============================================================
const schema = z.object({
  firstName: z.string().min(1, { error: "姓を入力してください" }),
  lastName: z.string().min(1, { error: "名を入力してください" }),
  email: z.string().email(),
  address: z.string().min(1),
  city: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

// ============================================================
// ❌ 悪い例: 1つの巨大コンポーネント
//    どのフィールドを入力しても、BigForm 全体が再レンダリングされる
// ============================================================
function BigForm() {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <h2>個人情報</h2>
      <input {...register("firstName")} placeholder="姓" />
      <input {...register("lastName")} placeholder="名" />
      <input {...register("email")} placeholder="メール" />

      <h2>住所</h2>
      <input {...register("address")} placeholder="住所" />
      <input {...register("city")} placeholder="市区町村" />

      <button type="submit">送信</button>
    </form>
  );
}

// ============================================================
// ✅ 良い例: 小さなコンポーネントに分割
//    React.memo 相当の効果: 他のセクションの入力では再レンダリングされない
// ============================================================

// --- 個人情報セクション ---
function PersonalInfo() {
  // FormProvider から useFormContext で register を取得
  const { register, formState: { errors } } = useFormContext();

  return (
    <section style={{ border: "1px solid #ddd", padding: 16, marginBottom: 16 }}>
      <h2>個人情報</h2>
      <div>
        <input {...register("firstName")} placeholder="姓" />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>
      <div>
        <input {...register("lastName")} placeholder="名" />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>
      <div>
        <input {...register("email")} placeholder="メール" type="email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
    </section>
  );
}

// --- 住所セクション ---
function AddressInfo() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <section style={{ border: "1px solid #ddd", padding: 16 }}>
      <h2>住所</h2>
      <div>
        <input {...register("address")} placeholder="住所" />
        {errors.address && <span>{errors.address.message}</span>}
      </div>
      <div>
        <input {...register("city")} placeholder="市区町村" />
        {errors.city && <span>{errors.city.message}</span>}
      </div>
    </section>
  );
}

// --- 親コンポーネント ---
function OptimizedForm() {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("送信:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <PersonalInfo />
        <AddressInfo />
        <button type="submit">送信</button>
      </form>
    </FormProvider>
  );
}
```

### 💻 完成コード（useController でさらに細分化）

```tsx
import { useController, useForm, Control } from "react-hook-form";

// ============================================================
// カスタム入力コンポーネント
// ============================================================
// useController: 1つのフィールドだけを切り出して管理するフック
// これを使うと、エラーや値の変更がこのコンポーネントの範囲で完結する

interface TextFieldProps {
  name: string;      // RHFのフィールド名
  label: string;     // 画面に表示するラベル
  control: Control<any>; // 親フォームの control
  type?: string;
}

function TextField({ name, label, control, type = "text" }: TextFieldProps) {
  const {
    field,        // { value, onChange, onBlur, ref, name }
    fieldState: { error },
  } = useController({
    name,         // 管理するフィールド名
    control,      // 親から渡された control（必須）
  });

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontWeight: "bold" }}>{label}</label>
      <input
        {...field}          // value, onChange, onBlur, ref を一括で渡す
        type={type}
        style={{
          padding: 8,
          border: error ? "2px solid red" : "1px solid #ccc",
        }}
      />
      {error && (
        <span style={{ color: "red", fontSize: 14 }}>
          {error.message}
        </span>
      )}
    </div>
  );
}

// ============================================================
// 使用側
// ============================================================
function FormWithCustomFields() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      name: "",
      age: "",
    },
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 各TextFieldは独立して動作。1つが更新されても他は再レンダリングされない */}
      <TextField name="email" label="メールアドレス" control={control} type="email" />
      <TextField name="name" label="名前" control={control} />
      <TextField name="age" label="年齢" control={control} type="number" />
      <button type="submit">送信</button>
    </form>
  );
}
```

### 🔍 コード解説

#### なぜ分割すると速くなるのか

React は「親が再レンダリングされると、原則として子も再レンダリングされる」仕組みです。

```
BigForm（親）
  ├─ input firstName
  ├─ input lastName
  ├─ input email
  ├─ input address
  └─ input city

→ firstName を入力 → BigForm が再レンダリング
  → 5つの input 全部が再レンダリングされる

OptimizedForm（親）
  ├─ PersonalInfo（子コンポーネント）
  │    ├─ input firstName
  │    ├─ input lastName
  │    └─ input email
  └─ AddressInfo（子コンポーネント）
       ├─ input address
       └─ input city

→ firstName を入力 → OptimizedForm は再レンダリングしない
  → PersonalInfo だけが再レンダリング
  → AddressInfo は全く再レンダリングされない（速い！）
```

`useController` はこれをさらに極限まで細分化し、**1つの入力欄 = 1つのコンポーネント**という単位で独立させます。

#### `useController` vs `Controller`

| 方法 | 書き方 | 向いている場面 |
|------|--------|-------------|
| `Controller` | JSXで囲む | 1回だけ使う外部コンポーネント |
| `useController` | カスタムコンポーネントの中で呼ぶ | 繰り返し使う自作コンポーネント |

```tsx
// Controller: 使用する側で毎度書く
<Controller name="email" control={control} render={...} />

// useController: コンポーネントの内部に隠蔽できる
function TextField({ name, control }) {
  const { field, fieldState } = useController({ name, control });
  return <input {...field} />;
}
// 使用側はシンプル
<TextField name="email" control={control} />
```

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| 分割せずに巨大なコンポーネントを書く | 入力がカクつく | 意味のある単位（セクション）で分割する |
| `FormProvider` なしで `useFormContext` を呼ぶ | エラー | 必ず `FormProvider` で囲む |
| `useController` に `control` を渡さない | エラー | `control` は `useForm` から取得して必ず渡す |
| `field` をスプレッドして全部渡す | 不要なpropsまで渡る | 必要なものだけ選んで渡す |

### ✅ 理解度チェック

- [ ] 「親が再レンダリングされると子も再レンダリングされる」というReactの仕組みを説明できる
- [ ] `FormProvider` + `useFormContext` を使った分割が、パフォーマンスを改善する理由を図解できる
- [ ] `useController` と `Controller` の使い分けができる
- [ ] 自分のプロジェクトのフォームを、どのように分割すれば良いか考えられる

---

## 3. フォーム状態の永続化

### 💡 このテクニックとは何か

ユーザーがフォームに15分かけて入力したのに、**誤ってブラウザを閉じてしまった**──。
この絶望的な体験を防ぐため、「入力内容をブラウザ内に自動保存し、次回訪問時に復元する」機能を実装します。

```
通常のフォーム:  入力 → ブラウザを閉じる → 再訪問 → 最初から入力し直し
自動保存フォーム: 入力 → 自動保存（localStorage）→ 再訪問 → 前回の入力が復元される
```

### 🎯 どんな時に使うか

- 長文の投稿フォーム（ブログ記事、レビュー）
- 複雑な申請フォーム（履歴書、各種届出）
- 管理画面でのデータ編集
- ユーザーにとって「入力し直しが苦痛」になる長いフォーム全般

### 📝 実装のステップ

1. `watch()` でフォーム全体の値を監視する
2. `useEffect` + `debounce` で、変更が止まってから保存する
3. `localStorage.setItem` でブラウザに保存する
4. 初期化時（`useEffect`）に `localStorage.getItem` で復元し、`reset()` で反映する
5. 送信成功時に `localStorage.removeItem` で下書きを削除する

### 💻 完成コード

```tsx
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { debounce } from "lodash-es"; // または 'lodash'

const STORAGE_KEY = "form-draft"; // localStorage のキー名

function AutoSaveForm() {
  const { register, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // ==========================================================
  // ステップ1: 初期化時に localStorage から復元
  // ==========================================================
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // reset: フォームの値を一括で上書きする
        reset(parsed);
      } catch (e) {
        // JSON.parse に失敗した場合（壊れたデータ）
        console.error("保存データの復元に失敗しました", e);
      }
    }
  }, [reset]); // reset は useForm から取得した参照安定な関数

  // ==========================================================
  // ステップ2: 変更を監視して自動保存（debounce）
  // ==========================================================
  const values = watch(); // フォーム全体の現在値を取得

  // 🔴 重要: debounce は useMemo で固定する
  // 毎レンダリングで新しい debounce 関数を作ると、
  // 「前回のタイマーがクリアされずにどんどん増殖」するバグになる
  const debouncedSave = useMemo(
    () =>
      debounce((data: any) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log("自動保存しました:", data);
      }, 1000), // 1秒間入力が止まったら保存
    []
  );

  useEffect(() => {
    // values が変わるたびに debouncedSave を呼ぶ
    debouncedSave(values);

    // クリーンアップ: コンポーネントが破棄された時、待機中の保存をキャンセル
    return () => {
      debouncedSave.flush(); // 保留中の保存を即実行
      debouncedSave.cancel(); // タイマーを破棄
    };
  }, [values, debouncedSave]);

  // ==========================================================
  // ステップ3: 送信成功時にクリア
  // ==========================================================
  const onSubmit = async (data: any) => {
    console.log("送信:", data);
    // API送信処理...

    // 送信が成功したら、下書きを削除してフォームをリセット
    localStorage.removeItem(STORAGE_KEY);
    reset({ title: "", content: "" });
    alert("送信が完了しました！");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>タイトル</label>
        <input {...register("title")} placeholder="タイトルを入力" />
      </div>
      <div>
        <label>本文</label>
        <textarea
          {...register("content")}
          placeholder="本文を入力"
          rows={6}
          style={{ width: "100%" }}
        />
      </div>
      <button type="submit">送信</button>
    </form>
  );
}
```

### 🔍 コード解説

#### `debounce` を `useMemo` で固定する理由

```tsx
// ❌ 毎レンダリングで新しい関数が作られる
useEffect(() => {
  const save = debounce((data) => { ... }, 1000);
  save(values);
}, [values]);
// → save() を呼ぶたびに「新しいdebounce関数」なので、
//   前回のタイマーがクリアされず、複数の保存が並列実行される

// ✅ useMemo で1つに固定
const debouncedSave = useMemo(() => debounce(...), []);
useEffect(() => {
  debouncedSave(values);
}, [values, debouncedSave]);
// → 同じdebounce関数が使われるので、
//   「前回のタイマーをキャンセル → 新しいタイマーを開始」が正しく動作する
```

#### `reset()` の役割

```tsx
// reset: フォームの値と内部状態を一括で変更する
reset({ title: "復元したタイトル", content: "復元した本文" });
// これを使わずに state で管理しようとすると、
// RHFの内部状態とDOMの表示がズレて整合性が崩れる
```

#### なぜ `localStorage` なのか

| 保存先 | 特徴 | 向いているデータ |
|--------|------|---------------|
| `localStorage` | ブラウザを閉じても残る、容量5MB程度 | フォーム下書き、設定 |
| `sessionStorage` | タブを閉じたら消える | 一時的な入力補助 |
| `IndexedDB` | 大容量、構造化データ向き | 画像、大量のデータ |
| サーバーDB | どの端末からでもアクセス | アカウント情報、本番データ |

フォーム下書きは `localStorage` が最も手軽で十分です。ただし**センシティブな情報**（パスワード、クレジットカード番号など）は保存すべきではありません。

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `debounce` を `useMemo` なしで毎回作る | 保存が何度も実行され、古いデータで上書きされる | `useMemo(() => debounce(...), [])` で固定 |
| `localStorage` に機密情報を保存する | XSS攻撃で情報漏洩のリスク | パスワードなどは保存しない。または暗号化する |
| `reset` を `useEffect` の依存配列に入れ忘れる | ESLint警告 | `reset` は参照安定なので入れてOK |
| 送信後に `localStorage` を削除しない | 次回訪問時に古いデータが復元される | `localStorage.removeItem(KEY)` を忘れずに |

### ✅ 理解度チェック

- [ ] `debounce` を `useMemo` で固定する理由を、タイマーの仕組みを含めて説明できる
- [ ] `reset()` を使わずに値を復元しようとすると何が起きるか説明できる
- [ ] `localStorage` と `sessionStorage` の違いを、使用場面を含めて説明できる
- [ ] 自動保存機能に「パスワード」などを含めてはいけない理由を説明できる

---

## 4. エラーハンドリングと表示パターン

### 💡 このテクニックとは何か

フォームのエラーは大きく2種類あります：

1. **クライアント側エラー**: 文字数不足、メール形式不正など（Zodで検出）
2. **サーバー側エラー**: 「メールアドレスが既に登録されています」など（APIレスポンスで検出）

Session 1・2 では「クライアント側エラー」の表示方法を学びました。このセッションでは、**サーバーから返ってきたエラーをフォームに統合して表示する**方法を学びます。

```
サーバーエラーをそのまま表示:  "エラーが発生しました"
→ ユーザーは「何をどう直せばいいか」分からない

サーバーエラーをフォームに統合: メール欄の下に「このメールは既に登録されています」
→ ユーザーはすぐに修正できる
```

React Hook Form は `setError` というAPIで、プログラムから任意のフィールドにエラーを設定できます。

### 🎯 どんな時に使うか

- ユーザー登録時の「メールアドレス重複」エラー
- 商品購入時の「在庫不足」エラー
- 管理画面での「権限不足」エラー
- バックエンドの複雑なビジネスルール違反（「予約時間が被っています」など）

### 📝 実装のステップ

1. `setError` を `useForm` から取得する
2. API送信を `try/catch` で囲む
3. サーバーからのエラーレスポンスを解析する
4. `setError("フィールド名", { message: "..." })` で該当フィールドにエラーを設定する
5. フィールドに紐づかない「グローバルエラー」は、Reactの `useState` で別管理する

### 💻 完成コード

```tsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ============================================================
// スキーマ
// ============================================================
const schema = z.object({
  email: z.string().email({ error: "正しいメールアドレスを入力してください" }),
  password: z.string().min(8, { error: "8文字以上で入力してください" }),
});

type FormData = z.infer<typeof schema>;

// ============================================================
// モックAPI（実務では fetch / axios など）
// ============================================================
async function apiLogin(data: FormData): Promise<void> {
  // サーバー側の重複チェックをシミュレート
  if (data.email === "used@example.com") {
    const error: any = new Error("登録に失敗しました");
    // サーバーは通常、フィールドごとのエラーをJSONで返す
    error.fieldErrors = {
      email: "このメールアドレスは既に登録されています",
    };
    throw error;
  }
  // 成功...
}

// ============================================================
// フォームコンポーネント
// ============================================================
function FormWithServerError() {
  // setError: プログラムからエラーを設定する関数
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // フィールドに紐付かない「全体エラー」を管理
  const [globalError, setGlobalError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setGlobalError(null); // 送信時に前回のエラーをクリア

    try {
      await apiLogin(data);
      alert("ログイン成功！");
    } catch (error: any) {
      // ------------------------------------------------------
      // サーバーからのフィールドエラーをフォームに反映
      // ------------------------------------------------------
      if (error.fieldErrors) {
        // Object.entries: { email: "メッセージ" } → [["email", "メッセージ"], ...]
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof FormData, {
            type: "server",        // エラーの種類（任意）
            message: message as string,
          });
        });
      } else {
        // フィールドに紐付かないエラー（例: サーバー障害）
        setGlobalError(error.message || "予期しないエラーが発生しました");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* --- グローバルエラー --- */}
      {globalError && (
        <div
          style={{
            background: "#fee",
            border: "1px solid red",
            padding: 12,
            marginBottom: 16,
            borderRadius: 4,
          }}
        >
          {globalError}
        </div>
      )}

      {/* --- メール --- */}
      <div>
        <label>メールアドレス</label>
        <input type="email" {...register("email")} />
        {/* errors.email は Zod のエラーと setError のエラーが両方入る */}
        {errors.email && (
          <span style={{ color: "red", display: "block" }}>
            {errors.email.message}
          </span>
        )}
      </div>

      {/* --- パスワード --- */}
      <div style={{ marginTop: 8 }}>
        <label>パスワード</label>
        <input type="password" {...register("password")} />
        {errors.password && (
          <span style={{ color: "red", display: "block" }}>
            {errors.password.message}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} style={{ marginTop: 16 }}>
        {isSubmitting ? "送信中..." : "ログイン"}
      </button>
    </form>
  );
}
```

### 💻 応用：エラーサマリーコンポーネント

複数のエラーが散らばっていると、ユーザーが見落としがちです。画面上部に「エラーの一覧」を表示するコンポーネントを作ります。

```tsx
import { useFormContext } from "react-hook-form";

function ErrorSummary() {
  const {
    formState: { errors },
  } = useFormContext();

  // errors はオブジェクト: { email: {...}, password: {...} }
  // Object.values でエラーの配列にし、message だけ抜き出す
  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean); // null/undefined を除外

  if (errorMessages.length === 0) return null;

  return (
    <div
      style={{
        background: "#fee",
        border: "1px solid red",
        padding: 12,
        marginBottom: 16,
        borderRadius: 4,
      }}
    >
      <h3 style={{ margin: "0 0 8px 0" }}>
        以下の{errorMessages.length}件のエラーを修正してください:
      </h3>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {errorMessages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

// 使用例
function SomeForm() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form>
        <ErrorSummary /> {/* 画面上部に配置 */}
        {/* ...各入力欄... */}
      </form>
    </FormProvider>
  );
}
```

### 🔍 コード解説

#### `setError` の構文

```tsx
setError("フィールド名", {
  type: "server",           // エラーの識別子（任意）
  message: "エラーメッセージ",
});
```

`setError` で設定したエラーは、`formState.errors` に統合されます。つまり `errors.email` は「Zodのクライアント検証エラー」と「`setError` で設定したサーバーエラー」の**両方が見える場所**になります。

#### サーバーエラーのレスポンス形式

実務では、バックエンドのAPI設計に合わせてパース方法を変えます。一般的なパターンは以下の通りです。

```json
// パターンA: フィールドごとのエラー
{
  "fieldErrors": {
    "email": "既に使用されています",
    "password": "簡単すぎます"
  }
}

// パターンB: 配列形式
{
  "errors": [
    { "field": "email", "message": "既に使用されています" }
  ]
}

// パターンC: グローバルエラーのみ
{
  "message": "メンテナンス中です"
}
```

#### なぜ「グローバルエラー」と「フィールドエラー」を分けるのか

| エラーの種類 | 表示場所 | 例 |
|------------|---------|-----|
| フィールドエラー | 該当入力欄の直下 | 「メール形式が不正」「パスワードが短い」 |
| グローバルエラー | フォームの上部 | 「サーバーが混雑しています」「認証に失敗しました」 |

フィールドに紐付かないエラーは、どの入力欄の下に表示すればいいか分からないため、フォーム上部に出します。

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `setError` の型を間違える | 型エラー | `field as keyof FormData` で型を絞る |
| サーバーエラーが残ったまま再送信 | 前回のエラーが消えない | `onSubmit` 内で `setGlobalError(null)` や `clearErrors()` を呼ぶ |
| `isSubmitting` を使わない | 連打で同じリクエストが飛ぶ | `<button disabled={isSubmitting}>` を必ず設定 |
| `try/catch` なしでAPI呼び出し | エラー時にアプリがクラッシュ | 必ず `try/catch` で囲む |

### ✅ 理解度チェック

- [ ] `setError` が解決する課題（サーバーエラーの統合）を具体例を挙げて説明できる
- [ ] `setError` で設定したエラーが `errors.フィールド名` と同じ場所に見える理由を説明できる
- [ ] グローバルエラーとフィールドエラーの使い分けができる
- [ ] サーバーエラーの3つのレスポンスパターン（A/B/C）を自分の言葉で説明できる

---

## 5. カスタムフックの作成

### 💡 このテクニックとは何か

同じフォーム構造を何度も書くと、コードが冗長になります。

```tsx
// フォームA
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schemaA),
});

// フォームB
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schemaB),
});

// ...毎回 resolver: zodResolver(...) を書くのが面倒
```

**カスタムフック**を使うと、「スキーマからフォームを作る」という定型処理を共通化できます。

また、繰り返し出てくる「エラーメッセージを取得する」処理もフック化することで、コンポーネントの見通しが良くなります。

### 🎯 どんな時に使うか

- 同じようなフォームがプロジェクト内に10個以上ある
- 毎回 `resolver: zodResolver(schema)` と書くのが面倒
- `errors.hoge?.message` の型キャストが繰り返し出てくる
- チーム全体で統一したフォーム実装パターンを定めたい

### 📝 実装のステップ

1. `useFormWithSchema` を作り、`schema` と `defaultValues` を受け取って設定済みの `useForm` を返す
2. `useFieldError` を作り、`errors.フィールド名?.message` を1関数で取得できるようにする
3. プロジェクトの規約に応じて、共通の送信処理・ローディング管理も含める

### 💻 完成コード

```tsx
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ============================================================
// カスタムフック1: useFormWithSchema
// ============================================================
// Zodスキーマから、resolver を設定済みの useForm を作る

function useFormWithSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  defaultValues?: Partial<z.infer<TSchema>>
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
}

// --- 使用例 ---
const schema = z.object({
  name: z.string().min(1, { error: "名前は必須です" }),
  email: z.string().email({ error: "正しいメールアドレスを入力してください" }),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  // いちいち resolver を書かなくて済む！
  const { register, handleSubmit, formState: { errors } } =
    useFormWithSchema(schema, { name: "" });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="名前" />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register("email")} placeholder="メール" type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">送信</button>
    </form>
  );
}

// ============================================================
// カスタムフック2: useFieldError
// ============================================================
// FormProvider 配下で、特定フィールドのエラーメッセージを取得する

import { useFormContext } from "react-hook-form";

function useFieldError(fieldName: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext();

  // errors[fieldName] は FieldError | undefined
  // ?.message で安全にメッセージを取得
  return errors[fieldName]?.message as string | undefined;
}

// --- 使用例 ---
function EmailField() {
  const error = useFieldError("email");
  const { register } = useFormContext();

  return (
    <div>
      <input {...register("email")} placeholder="メール" type="email" />
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}
```

### 🔍 コード解説

#### `useFormWithSchema` で何が楽になるのか

| 項目 | 通常 | カスタムフック使用時 |
|------|------|---------------------|
| resolver設定 | `resolver: zodResolver(schema)` | 省略（フック内で自動設定） |
| 型推論 | `useForm<FormData>` | `useFormWithSchema(schema)` で自動 |
| 記述量 | 長い | 短い |
| チーム統一 | バラバラになりやすい | 同じフックを使うので統一しやすい |

#### 過度な抽象化に注意

カスタムフックは便利ですが、**すべてを共通化しようとすると逆に読みにくくなります**。

```
◎ 共通化すべき: 
  - resolver の設定
  - エラーメッセージの取得
  - 送信成功/失敗時の共通処理（トースト表示など）

△ 共通化しすぎると混乱する:
  - フォームの構造（UIレイアウト）
  - バリデーションルールそのもの（スキーマは各フォームで定義すべき）
  - API通信の詳細
```

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| スキーマまで共通化して1つにする | 全フォームが同じバリデーションになる | `useFormWithSchema` は「設定の定型処理」だけ。スキーマは各フォームで定義 |
| `useFieldError` を `FormProvider` 外で使う | エラー | `FormProvider` 配下のコンポーネントでしか使えない |
| 型パラメータを間違える | `any` 型になって型安全が失われる | `extends z.ZodType` を使い、戻り値の型を `z.infer<TSchema>` にする |

### ✅ 理解度チェック

- [ ] `useFormWithSchema` が解決する課題（定型コードの削減）を説明できる
- [ ] 何を共通化すべきで、何は共通化しない方が良いか判断できる
- [ ] `useFieldError` が `FormProvider` と組み合わさって動く仕組みを説明できる
- [ ] 自分のプロジェクトで、どんなカスタムフックを作ると便利か考えられる

---

## 6. 実践演習：管理画面のユーザ編集フォーム

### 💡 この演習で学ぶこと

Session 1〜3 で学んだ**すべての知識**を総合して、実務レベルの複雑なフォームを構築します。

### 🎯 要件

以下の機能を持つ「ユーザー編集フォーム」を作成してください。

#### 1. 基本情報

| 項目 | 仕様 |
|------|------|
| プロフィール画像 | プレビュー付き、最大2MB、jpg/png/webp |
| ユーザー名 | 非同期重複チェック（Session 2を参照） |
| 表示名 | 必須、2〜50文字 |
| メールアドレス | 必須、メール形式 |

#### 2. 詳細設定

| 項目 | 仕様 |
|------|------|
| 役割 | Select（admin / moderator / user） |
| 部署 | Select（APIから動的取得） |
| 入社日 | DatePicker（shadcn/ui Calendar） |
| 状態 | Switch（アクティブ / 停止） |

#### 3. 権限設定

| 項目 | 仕様 |
|------|------|
| 権限チェックボックス | 動的リスト（読取 / 書込 / 削除 / 管理） |
| 全選択 / 全解除 | ボタンで一括切り替え |

#### 4. 追加連絡先

| 項目 | 仕様 |
|------|------|
| 電話番号リスト | 動的追加・削除（useFieldArray） |
| 種別 | Select（携帯 / 自宅 / 勤務先） |
| 番号 | 電話番号形式 |

#### 5. その他仕様

| 機能 | 仕様 |
|------|------|
| 自動保存 | localStorage、3秒debounce |
| 送信成功時 | localStorageクリア + 成功トースト |
| エラー表示 | サーバーエラーは該当フィールドに表示 + グローバルエラー表示 |
| パフォーマンス | セクションごとにコンポーネント分割 |

### 📝 実装の順序の提案

```
フェーズ1: 基本情報（Input + 画像アップロード + 非同期バリデーション）
  ↓ 動作確認
フェーズ2: 詳細設定（Select + DatePicker(Calendar) + Switch）
  ↓ 動作確認
フェーズ3: 権限設定（チェックボックス + 全選択/解除）
  ↓ 動作確認
フェーズ4: 追加連絡先（useFieldArray）
  ↓ 動作確認
フェーズ5: 自動保存（localStorage + debounce）
  ↓ 動作確認
フェーズ6: エラーハンドリング（setError + グローバルエラー）
  ↓ 動作確認
フェーズ7: コンポーネント分割（FormProvider + useFormContext）
  ↓ 動作確認
フェーズ8: カスタムフック化（useFormWithSchema など）
```

### 🔍 重要ポイントの解説

#### この演習で使うSession 1〜3の知識

| 要件 | 使う技術 | 該当セッション |
|------|---------|--------------|
| 画像アップロード | `z.custom<FileList>()` + `FormData` | Session 2, 第2章 |
| 非同期重複チェック | `z.refine(async)` または手動管理 | Session 2, 第3章 |
| DatePicker / Switch / Select | `Controller` | Session 3, 第1章 |
| 動的電話番号 | `useFieldArray` | Session 2, 第1章 |
| パフォーマンス最適化 | `FormProvider` + コンポーネント分割 | Session 3, 第2章 |
| 自動保存 | `watch` + `localStorage` + `debounce` | Session 3, 第3章 |
| サーバーエラー統合 | `setError` + グローバルエラー | Session 3, 第4章 |
| コード共通化 | `useFormWithSchema` | Session 3, 第5章 |

#### 全選択/全解除の実装ヒント

```tsx
const { setValue, getValues } = useFormContext();

const toggleAllPermissions = (checked: boolean) => {
  // setValue: プログラムから特定フィールドの値を変更する
  const allPermissions = ["read", "write", "delete", "admin"];
  setValue("permissions", checked ? allPermissions : []);
};
```

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `Controller` の `control` を渡さない | エラー | `useForm` から `control` を取得して必ず渡す |
| `useFieldArray` の `name` を間違える | フィールドが追加できない | `name` はスキーマのキー名と一致させる |
| `debounce` を `useMemo` なしで作る | 自動保存が暴走する | `useMemo(() => debounce(...), [])` |
| `setError` の後に `isSubmitting` を解除しない | ボタンがdisabledのまま | `finally` で `isSubmitting` は自動で解除されるが、エラーハンドリングは `try/catch` で囲む |

### ✅ 理解度チェック（演習後に確認）

- [ ] この演習の要件が、Session 1〜3 のどの章の知識と対応するか全て説明できる
- [ ] `Controller` を使うコンポーネントと `register` を使うコンポーネントの使い分けができる
- [ ] 「全選択」ボタンを `setValue` で実装する際の注意点（RHFの内部状態と整合性）を説明できる
- [ ] 自動保存と手動送信のデータ競合が起きない理由を説明できる

---

## まとめ

### 高度なパターン一覧

| パターン | 使用フック・機能 | 解決する課題 |
|----------|-----------------|-------------|
| **外部UI連携** | `Controller` / `useController` | shadcn/ui などのライブラリコンポーネントとRHFを繋ぐ |
| **パフォーマンス最適化** | `FormProvider` + `useFormContext` | 大きなフォームの再レンダリングを抑制する |
| **フォーム永続化** | `watch` + `localStorage` + `debounce` | ブラウザを閉じても入力内容を復元する |
| **サーバーエラー統合** | `setError` + `useState` | サーバー側のエラーをフォーム表示に統合する |
| **カスタムフック** | `useFormWithSchema` / `useFieldError` | 定型コードを減らし、チームで統一する |

### 実務での判断基準

```
「shadcn/ui, MUI などのコンポーネントを使う」→ Controller
「フォームが20項目以上で重い」→ コンポーネント分割 + FormProvider
「長文入力でブラウザを閉じられる可能性がある」→ localStorage自動保存
「サーバーからのエラーを入力欄に表示したい」→ setError
「同じ設定を毎回書いている」→ カスタムフック化
```

### Session 1〜3 を通じた全体像

```
【Session 1】基礎
  register / handleSubmit / resolver: zodResolver(schema)
  ↓
【Session 2】実践パターン
  useFieldArray / FileList / async refine / FormProvider + trigger / useWatch + debounce
  ↓
【Session 3】高度テクニック
  Controller / コンポーネント分割 / localStorage永続化 / setError / カスタムフック
```

この3セッションで、React Hook Form + Zod を使った**実務レベルのフォーム開発**に必要な知識は網羅できました。

次のステップとしては、実際のプロジェクトで小さなフォームから実装を始め、段階的にこれらのテクニックを導入していくことをおすすめします。

---

## 付録: よく使う型・API クイックリファレンス（Session 3版）

```tsx
// ============================================================
// Controller
// ============================================================
<Controller
  name="fieldName"
  control={control}
  render={({ field, fieldState, formState }) => (
    <Component
      value={field.value}        // 現在の値
      onChange={field.onChange}  // 変更ハンドラ
      // ...その他のprops
    />
  )}
/>

// ============================================================
// useController
// ============================================================
const { field, fieldState } = useController({ name, control });
// field: { name, value, onChange, onBlur, ref }
// fieldState: { error, isDirty, isTouched }

// ============================================================
// エラー操作
// ============================================================
setError("fieldName", { type: "server", message: "..." }); // エラーを設定
clearErrors("fieldName");                                // エラーを消去
clearErrors();                                          // 全エラーを消去

// ============================================================
// 値の操作
// ============================================================
setValue("fieldName", "newValue"); // 値を強制的に変更
reset({ fieldName: "value" });      // フォームをリセット（値も初期化）
reset();                           // defaultValues に戻す

// ============================================================
// 状態の監視
// ============================================================
const values = watch();           // 全フィールドを監視
const name = watch("fieldName");  // 特定フィールドを監視
const isValid = formState.isValid; // 全フィールドが有効か
const isSubmitting = formState.isSubmitting; // 送信中か
```

---

*この資料は基礎から、概念・背景・実装・注意点の4つをバランスよく解説することを目指しています。*
*不明点があれば、各セクションの「理解度チェック」に戻り、自分の言葉で説明できるか試してみてください。*
