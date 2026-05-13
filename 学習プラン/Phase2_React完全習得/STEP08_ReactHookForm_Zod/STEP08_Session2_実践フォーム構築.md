# Session 2: 実践フォーム構築

## はじめに：実務で直面するフォームパターン

Session 1で基礎を学んだReact Hook Form + Zodを使い、実務で頻出するフォームパターンを実装していきます。

### このセッションで構築するフォーム

- **動的フォーム**（フィールドの追加・削除）
- **ファイルアップロード**
- **非同期バリデーション**（サーバー側チェック）
- **ステップフォーム**（Wizard形式）
- **検索・フィルタフォーム**

---

## 1. 動的フォーム：フィールドの追加・削除

### ユースケース

- 複数の電話番号を登録
- スキル・資格の複数入力
- 複数の住所

### 実装

```tsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "名前は必須です"),
  emails: z
    .array(
      z.object({
        value: z.string().email("正しいメールアドレス"),
        label: z.string().min(1, "ラベルは必須"),
      })
    )
    .min(1, "1つ以上のメールが必要です"),
});

type FormData = z.infer<typeof schema>;

function DynamicEmailForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      emails: [{ value: "", label: "メイン" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>名前</label>
        <input {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <h3>メールアドレス</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="email-row">
          <input
            {...register(`emails.${index}.label`)}
            placeholder="ラベル（例: 仕事）"
          />
          <input
            {...register(`emails.${index}.value`)}
            placeholder="メールアドレス"
            type="email"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            disabled={fields.length <= 1}
          >
            削除
          </button>
          
          {errors.emails?.[index]?.value && (
            <span>{errors.emails[index].value.message}</span>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ value: "", label: "" })}
      >
        + メールを追加
      </button>

      <button type="submit">送信</button>
    </form>
  );
}
```

### `useFieldArray` の重要ポイント

| プロパティ | 説明 |
|-----------|------|
| `fields` | 現在のフィールド配列（`id`を含む） |
| `append(obj)` | 末尾に追加 |
| `prepend(obj)` | 先頭に追加 |
| `remove(index)` | 指定インデックスを削除 |
| `insert(index, obj)` | 指定位置に挿入 |
| `swap(indexA, indexB)` | 2つの要素を入れ替え |
| `move(from, to)` | 要素を移動 |

**重要**: `key`には`field.id`を使う（Reactのリストレンダリングと同じ理由）

---

## 2. ファイルアップロード

### 単一ファイルアップロード

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const schema = z.object({
  name: z.string().min(1, "必須"),
  avatar: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "ファイルを選択してください")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `ファイルサイズは5MB以下にしてください`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "jpg, png, webp形式のみ対応しています"
    ),
});

type FormData = z.infer<typeof schema>;

function AvatarUploadForm() {
  const [preview, setPreview] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // ファイル選択時にプレビュー表示
  const avatarFiles = watch("avatar");
  
  useState(() => {
    if (avatarFiles?.[0]) {
      const url = URL.createObjectURL(avatarFiles[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("avatar", data.avatar[0]);
    
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>名前</label>
        <input {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label>プロフィール画像</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          {...register("avatar")}
        />
        {errors.avatar && (
          <span>{errors.avatar.message}</span>
        )}
      </div>

      {preview && (
        <img src={preview} alt="プレビュー" width={100} />
      )}

      <button type="submit">アップロード</button>
    </form>
  );
}
```

### 複数ファイルアップロード

```tsx
const schema = z.object({
  documents: z
    .custom<FileList>()
    .refine((files) => files?.length >= 1, "1つ以上選択してください")
    .refine(
      (files) => Array.from(files).every((f) => f.size <= MAX_FILE_SIZE),
      "各ファイルは5MB以下にしてください"
    ),
});

function MultiFileUpload() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    Array.from(data.documents).forEach((file: File, i: number) => {
      formData.append(`file${i}`, file);
    });
    // API送信
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        multiple
        {...register("documents")}
      />
      <button type="submit">アップロード</button>
    </form>
  );
}
```

---

## 3. 非同期バリデーション

### サーバー側での重複チェック

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ユーザー名の重複をチェックする関数
async function checkUsernameAvailability(username: string): Promise<boolean> {
  const response = await fetch(`/api/check-username?username=${username}`);
  const data = await response.json();
  return data.available;
}

const schema = z.object({
  username: z
    .string()
    .min(3, "3文字以上")
    .max(20, "20文字以下")
    .regex(/^[a-zA-Z0-9_]+$/, "英数字とアンダースコアのみ")
    .refine(
      async (value) => {
        const available = await checkUsernameAvailability(value);
        return available;
      },
      { message: "このユーザー名は既に使用されています" }
    ),
  email: z.string().email(),
});

function AsyncValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur", // フォーカスが外れた時にバリデーション
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <div>
        <label>ユーザー名</label>
        <input {...register("username")} />
        {isValidating && <span>確認中...</span>}
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <button type="submit">登録</button>
    </form>
  );
}
```

### より実用的な非同期バリデーション

```tsx
import { useForm } from "react-hook-form";
import { useState } from "react";

function SignupForm() {
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  // 手動で非同期チェック
  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) return;
    
    setUsernameStatus("checking");
    const available = await checkUsernameAvailability(username);
    setUsernameStatus(available ? "available" : "taken");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("username", {
          required: "必須",
          minLength: { value: 3, message: "3文字以上" },
        })}
        onBlur={(e) => checkUsername(e.target.value)}
      />
      {usernameStatus === "checking" && <span>確認中...</span>}
      {usernameStatus === "available" && <span>使用可能</span>}
      {usernameStatus === "taken" && <span>使用不可</span>}
    </form>
  );
}
```

---

## 4. ステップフォーム（Wizard）

### 実装

```tsx
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// 各ステップのスキーマ
const step1Schema = z.object({
  firstName: z.string().min(1, "必須"),
  lastName: z.string().min(1, "必須"),
});

const step2Schema = z.object({
  email: z.string().email(),
  phone: z.string().min(10, "正しい電話番号"),
});

const step3Schema = z.object({
  address: z.string().min(1, "必須"),
  city: z.string().min(1, "必須"),
});

const schemas = [step1Schema, step2Schema, step3Schema];

type FormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema>;

function StepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const methods = useForm<FormData>({
    resolver: zodResolver(schemas[currentStep]),
    mode: "onChange",
  });

  const { handleSubmit, trigger } = methods;

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid && currentStep < schemas.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("最終データ:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="progress">
          ステップ {currentStep + 1} / {schemas.length}
        </div>

        {currentStep === 0 && <Step1 />}
        {currentStep === 1 && <Step2 />}
        {currentStep === 2 && <Step3 />}

        <div className="buttons">
          {currentStep > 0 && (
            <button type="button" onClick={prevStep}>
              戻る
            </button>
          )}
          
          {currentStep < schemas.length - 1 ? (
            <button type="button" onClick={nextStep}>
              次へ
            </button>
          ) : (
            <button type="submit">送信</button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

// 各ステップコンポーネント
function Step1() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <h2>基本情報</h2>
      <input {...register("firstName")} placeholder="姓" />
      {errors.firstName && <span>{errors.firstName.message}</span>}
      
      <input {...register("lastName")} placeholder="名" />
      {errors.lastName && <span>{errors.lastName.message}</span>}
    </div>
  );
}

function Step2() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <h2>連絡先</h2>
      <input {...register("email")} placeholder="メール" type="email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register("phone")} placeholder="電話番号" />
      {errors.phone && <span>{errors.phone.message}</span>}
    </div>
  );
}

function Step3() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <h2>住所</h2>
      <input {...register("address")} placeholder="住所" />
      {errors.address && <span>{errors.address.message}</span>}
      
      <input {...register("city")} placeholder="市区町村" />
      {errors.city && <span>{errors.city.message}</span>}
    </div>
  );
}
```

---

## 5. 検索・フィルタフォーム

### デバウンス（Debounced）検索

```tsx
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";

function SearchFilterForm() {
  const { register, control } = useForm({
    defaultValues: {
      query: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    },
  });

  // 値の変更を監視
  const filters = useWatch({ control });
  const [results, setResults] = useState([]);

  // デバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults(filters);
    }, 300); // 300ms待ってからAPI呼び出し

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchResults = async (params: any) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`/api/products?${queryString}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div>
      <form>
        <input {...register("query")} placeholder="検索..." />
        
        <select {...register("category")}>
          <option value="all">すべて</option>
          <option value="electronics">電子機器</option>
          <option value="clothing">衣類</option>
        </select>
        
        <input {...register("minPrice")} placeholder="最低価格" type="number" />
        <input {...register("maxPrice")} placeholder="最高価格" type="number" />
        
        <label>
          <input type="checkbox" {...register("inStock")} />
          在庫ありのみ
        </label>
      </form>

      <div className="results">
        {results.map((item: any) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. 実践演習：商品登録フォーム

### 要件

以下の機能を持つ商品登録フォームを作成してください:

1. **基本情報**
   - 商品名（必須、3〜100文字）
   - 説明（必須、10〜1000文字）
   - 価格（必須、1円以上）
   - 在庫数（必須、0以上）

2. **カテゴリ**
   - カテゴリ選択（必須、セレクトボックス）
   - タグ（複数選択、チェックボックス）

3. **画像**
   - サムネイル画像（必須、1枚、最大2MB）
   - 追加画像（任意、最大4枚）

4. **バリエーション**
   - サイズ・カラーごとの在庫（動的追加・削除）
   - 例: S/赤: 10個、M/青: 5個

5. **オプション**
   - 公開設定（ラジオボタン: 公開/下書き/予約公開）
   - 予約公開日時（予約公開選択時のみ必須）

### ヒント

```tsx
// バリエーションのスキーマ例
const variationSchema = z.object({
  size: z.string().min(1),
  color: z.string().min(1),
  stock: z.number().min(0),
});

const schema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().min(1),
  stock: z.number().min(0),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1),
  thumbnail: z.custom<FileList>().refine(...),
  additionalImages: z.custom<FileList>().optional(),
  variations: z.array(variationSchema).min(1),
  publishStatus: z.enum(["public", "draft", "scheduled"]),
  scheduledAt: z.string().datetime().optional(),
}).refine((data) => {
  if (data.publishStatus === "scheduled") {
    return !!data.scheduledAt;
  }
  return true;
}, { message: "予約公開日時を指定してください", path: ["scheduledAt"] });
```

---

## まとめ

### 実践パターン一覧

| パターン | 使用フック・機能 |
|----------|-----------------|
| 動的フォーム | `useFieldArray` |
| ファイルアップロード | `z.custom<FileList>()` |
| 非同期バリデーション | `z.refine(async)` |
| ステップフォーム | `FormProvider`, `useFormContext` |
| リアルタイム検索 | `useWatch` + `useEffect` (debounce) |
| 条件付きバリデーション | `.refine()` |

### 次のセッション

Session 3では、さらに高度なパターン（`Controller`による外部UIライブラリ連携、パフォーマンス最適化、フォームの永続化など）を学びます。
