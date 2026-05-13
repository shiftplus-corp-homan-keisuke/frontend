# Session 3: 高度なフォームパターン

## はじめに：実務で必要になる高度なテクニック

Session 1と2で基礎から実践的なフォーム構築を学びました。このセッションでは、外部UIライブラリとの連携、パフォーマンス最適化、フォームの永続化など、より高度なパターンを扱います。

---

## 1. Controller: 外部UIライブラリとの連携

### なぜControllerが必要か

React Hook Formは標準のHTML入力要素（`input`, `select`, `textarea`）と相性が良いですが、**カスタムコンポーネント**や**外部UIライブラリ**（shadcn/ui, MUI, Chakra UI, React Selectなど）では、直接`register`を使えない場合があります。

```tsx
// ❌ これは動かない
<Select {...register("category")} options={options} />

// ✅ Controllerを使う
<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <Select {...field} options={options} />
  )}
/>
```

### shadcn/uiとの連携

```tsx
import { useForm, Controller } from "react-hook-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3),
  role: z.enum(["admin", "user", "guest"]),
  isActive: z.boolean(),
  birthDate: z.date(),
});

type FormData = z.infer<typeof schema>;

function ShadcnForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(console.log)} className="space-y-4">
      {/* Input - registerが使える */}
      <div>
        <Label htmlFor="username">ユーザー名</Label>
        <Input id="username" {...register("username")} />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* Select - Controllerが必要 */}
      <div>
        <Label>権限</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
      </div>

      {/* Switch - Controllerが必要 */}
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

      {/* Calendar - Controllerが必要 */}
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

### Controllerのfieldオブジェクト

```tsx
<Controller
  name="fieldName"
  control={control}
  render={({ field, fieldState, formState }) => (
    <CustomComponent
      // fieldオブジェクト
      name={field.name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      ref={field.ref}
      
      // fieldState（エラー情報）
      error={fieldState.error}
      isDirty={fieldState.isDirty}
      isTouched={fieldState.isTouched}
      
      // formState（フォーム全体の状態）
      isSubmitting={formState.isSubmitting}
    />
  )}
/>
```

| プロパティ | 説明 |
|-----------|------|
| `field.name` | フィールド名 |
| `field.value` | 現在の値 |
| `field.onChange` | 値変更ハンドラー |
| `field.onBlur` | フォーカスアウトハンドラー |
| `field.ref` | ref（フォーカス管理用） |
| `fieldState.error` | フィールドのエラー |
| `fieldState.isDirty` | 変更されたか |
| `fieldState.isTouched` | 触られたか |

---

## 2. フォームのパフォーマンス最適化

### 問題：大きなフォームの再レンダリング

フォームが大きくなると、1つのフィールドの変更が全体を再レンダリングし、パフォーマンスが低下します。

### 解決策1: コンポーネント分割

```tsx
// ❌ 1つの大きなコンポーネント
function BigForm() {
  const { register } = useForm();
  return (
    <form>
      <input {...register("field1")} />
      <input {...register("field2")} />
      {/* ... 50個のフィールド */}
    </form>
  );
}

// ✅ 小さなコンポーネントに分割
function PersonalInfo() {
  const { register } = useFormContext();
  return (
    <section>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
    </section>
  );
}

function AddressInfo() {
  const { register } = useFormContext();
  return (
    <section>
      <input {...register("address")} />
      <input {...register("city")} />
    </section>
  );
}

function OptimizedForm() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form>
        <PersonalInfo />
        <AddressInfo />
      </form>
    </FormProvider>
  );
}
```

### 解決策2: useController

カスタムコンポーネント内でControllerの機能を使う:

```tsx
import { useController } from "react-hook-form";

function TextField({ name, label }: { name: string; label: string }) {
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  return (
    <div>
      <label>{label}</label>
      <input {...field} />
      {error && <span>{error.message}</span>}
    </div>
  );
}

// 使用側
function Form() {
  const { control } = useForm();
  return (
    <form>
      <TextField name="email" label="メール" control={control} />
      <TextField name="name" label="名前" control={control} />
    </form>
  );
}
```

### 解決策3: shouldUseNativeValidation

ブラウザネイティブのバリデーションを使う（軽量）:

```tsx
const { register } = useForm({
  shouldUseNativeValidation: true,
});

<input
  {...register("email", {
    required: "必須です",
  })}
/>
```

---

## 3. フォーム状態の永続化

### localStorageへの自動保存

```tsx
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { debounce } from "lodash-es";

const STORAGE_KEY = "form-draft";

function AutoSaveForm() {
  const { register, watch, reset } = useForm();
  
  // 初期値をlocalStorageから復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      reset(JSON.parse(saved));
    }
  }, [reset]);
  
  // 変更を監視して自動保存
  const values = watch();
  
  useEffect(() => {
    const save = debounce((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 1000);
    
    save(values);
  }, [values]);

  return (
    <form>
      <input {...register("title")} />
      <textarea {...register("content")} />
    </form>
  );
}
```

### 送信成功時にクリア

```tsx
const onSubmit = async (data: FormData) => {
  await api.submit(data);
  localStorage.removeItem(STORAGE_KEY);
  reset();
};
```

---

## 4. エラーハンドリングと表示パターン

### グローバルエラー表示

```tsx
function FormWithGlobalError() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await api.submit(data);
    } catch (error: any) {
      // サーバーエラーをフォームに反映
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          setError(field as any, { message: message as string });
        });
      } else {
        setServerError(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div className="global-error">{serverError}</div>
      )}
      
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">送信</button>
    </form>
  );
}
```

### エラーサマリーコンポーネント

```tsx
function ErrorSummary() {
  const { formState: { errors } } = useFormContext();
  const errorMessages = Object.values(errors)
    .map((error) => error.message)
    .filter(Boolean);

  if (errorMessages.length === 0) return null;

  return (
    <div className="error-summary">
      <h3>以下のエラーを修正してください:</h3>
      <ul>
        {errorMessages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 5. カスタムフックの作成

### useFormWithSchema

```tsx
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function useFormWithSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  defaultValues?: Partial<z.infer<TSchema>>
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
}

// 使用例
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

function MyForm() {
  const { register, handleSubmit } = useFormWithSchema(schema);
  return <form>...</form>;
}
```

### useFieldError

```tsx
import { useFormContext } from "react-hook-form";

function useFieldError(fieldName: string) {
  const { formState: { errors } } = useFormContext();
  return errors[fieldName]?.message as string | undefined;
}

// 使用例
function EmailField() {
  const error = useFieldError("email");
  const { register } = useFormContext();
  
  return (
    <div>
      <input {...register("email")} />
      {error && <span>{error}</span>}
    </div>
  );
}
```

---

## 6. 実践演習：管理画面のユーザ編集フォーム

### 要件

1. **基本情報**
   - プロフィール画像（プレビュー付き、最大2MB）
   - ユーザー名（非同期重複チェック）
   - 表示名
   - メールアドレス

2. **詳細設定**
   - 役割（Select: admin/moderator/user）
   - 部署（Select: 動的にAPIから取得）
   - 入社日（DatePicker）
   - 状態（Switch: アクティブ/停止）

3. **権限設定**
   - 権限チェックボックスグループ（動的）
   - 例: 読取、書込、削除、管理

4. **追加連絡先**
   - 動的追加可能な電話番号リスト
   - 種別（Select: 携帯/自宅/勤務先）
   - 番号

5. **その他**
   - 自動保存（localStorage、3秒debounce）
   - 送信成功時にlocalStorageクリア
   - サーバーエラー表示
   - フィールド単位のエラー表示

### 技術スタック

- React Hook Form + Zod
- shadcn/ui（Controller必須）
- TanStack Query（部署データ取得）
- lodash-es（debounce）

---

## まとめ

### 高度なパターン一覧

| パターン | 実装方法 |
|----------|----------|
| 外部UI連携 | `Controller`または`useController` |
| パフォーマンス最適化 | コンポーネント分割、`useController` |
| フォーム永続化 | `watch` + `localStorage` + `debounce` |
| サーバーエラー | `setError` |
| カスタムフック | `useFormWithSchema`, `useFieldError` |

### ベストプラクティス

1. **小さなコンポーネントに分割する** - パフォーマンスと保守性の両方に効果的
2. **カスタムフックで共通化する** - `useFormWithSchema`のようなフックを作る
3. **エラー表示は一元管理する** - ErrorSummary + フィールド単位の両方で表示
4. **自動保存を実装する** - ユーザーの入力を守る
5. **サーバーエラーをフォームに統合する** - `setError`でシームレスに
