# Session 2: 実践フォーム構築（詳細解説版）

## はじめに：実務で直面するフォームパターン

Session 1で、React Hook Form + Zod の**基礎的な使い方**を学びました。
- `register` で入力を登録する
- `handleSubmit` で送信処理を行う
- `z.object()` でバリデーションルールを定義する

これらは「1つのフォームに、固定の入力欄がいくつかある」という**単純なケース**では十分です。

しかし、実際の業務で開発するフォームはもっと複雑です：

| 実務のシーン | 難しさ |
|------------|--------|
| 複数の電話番号を登録したい | 入力欄を動的に増減させる必要がある |
| プロフィール画像をアップロード | ファイル入力は通常のテキスト入力と扱いが異なる |
| ユーザー名の重複チェック | サーバーに問い合わせてから判定したい |
| 会員登録を3ステップで入力 | 同じフォームの状態を複数画面で共有したい |
| 商品のリアルタイム検索 | 入力するたびにAPIを叩きたいが、毎回叩くと重い |

このセッションでは、**実務で頻出する5つのパターン**を、基礎から丁寧に解説します。

---

## 0. 学習の進め方（重要）

この資料では、各パターンを以下の構成で解説します。

```
1. 💡 このパターンとは何か（概念）
2. 🎯 どんな時に使うか（ユースケース）
3. 📝 実装のステップ
4. 💻 完成コード（詳細コメント付き）
5. 🔍 コード解説（なぜそう書くのか）
6. ⚠️ よくあるミスと対処法
7. ✅ 理解度チェック
```

**学習のコツ**: コードを写すのではなく、「なぜこの順序・このAPIなのか」を理解してから手を動かしてください。

---

## 1. 動的フォーム：フィールドの追加・削除

### 💡 このパターンとは何か

フォームの入力欄が**最初から決まっていない**ケースです。

たとえば「連絡先メールアドレス」は、人によっては1つ、会社員なら2つ（仕事用・個人用）、フリーランスなら3つかもしれません。

```
通常のフォーム:  名前 [______]  メール [______]  （決まった数）
動的フォーム:    名前 [______]  メール① [______] [+追加] [×削除]
                                    メール② [______] [×削除]
```

**Reactで配列のstateを管理する場合の問題点**:
- インデックスを `key` に使うと、削除時に入力値がずれる（Reactのリストレンダリングの罠）
- バリデーションエラーも配列の要素ごとに管理する必要がある

React Hook Form は `useFieldArray` という専用フックで、この問題を**安全かつ簡潔に**解決します。

### 🎯 どんな時に使うか

- 複数の電話番号・メールアドレスの登録
- スキル・資格・職歴の複数入力（履歴書フォームなど）
- 商品のバリエーション（色・サイズごとの在庫）
- 設問の選択肢を動的に増やす（アンケート作成画面）

### 📝 実装のステップ

1. Zodスキーマで「配列」のバリデーションを定義する
2. `useForm` に配列の初期値（`defaultValues`）を設定する
3. `useFieldArray` で配列を管理する
4. `fields.map()` で入力欄を描画する（**必ず `field.id` を `key` に使う**）
5. `append()` / `remove()` で増減ボタンを実装する

### 💻 完成コード

```tsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ============================================================
// ステップ1: Zodスキーマの定義
// ============================================================
const schema = z.object({
  // 通常の文字列フィールド
  name: z.string().min(1, { error: "名前は必須です" }),

  // 配列のバリデーション: z.array(要素の型)
  // 各要素は「ラベル（表示名）」と「値（メールアドレス）」を持つオブジェクト
  emails: z
    .array(
      z.object({
        value: z.string().email({ error: "正しいメールアドレスを入力してください" }),
        label: z.string().min(1, { error: "ラベルは必須です（例: 仕事, 個人）" }),
      })
    )
    .min(1, { error: "メールアドレスは1つ以上登録してください" }),
});

// ZodのスキーマからTypeScriptの型を自動生成
// FormData = { name: string; emails: { value: string; label: string }[] }
type FormData = z.infer<typeof schema>;

// ============================================================
// ステップ2: コンポーネントの実装
// ============================================================
function DynamicEmailForm() {
  const {
    register,
    control,      // useFieldArrayに必須：フォームの制御オブジェクト
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    // 配列フィールドには必ず初期値を設定する
    // 空配列 [] だけだと、ユーザーが初めて見た時に入力欄が何も表示されない
    defaultValues: {
      name: "",
      emails: [{ value: "", label: "メイン" }],
    },
  });

  // ==========================================================
  // ステップ3: useFieldArray で配列を管理
  // ==========================================================
  const { fields, append, remove } = useFieldArray({
    control,      // useForm から取得した control を渡す
    name: "emails", // 管理するフィールドのパス（スキーマのキー名）
  });

  const onSubmit = (data: FormData) => {
    console.log("送信データ:", data);
    // 出力例: { name: "山田", emails: [{label: "メイン", value: "yamada@example.com"}, ...] }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* --- 通常の入力欄 --- */}
      <div>
        <label htmlFor="name">名前</label>
        <input id="name" {...register("name")} />
        {errors.name && (
          <span style={{ color: "red" }}>{errors.name.message}</span>
        )}
      </div>

      {/* --- 動的フィールド群 --- */}
      <h3>メールアドレス</h3>

      {fields.map((field, index) => (
        // 🔴 重要: key には必ず field.id を使う
        // index を key に使うと、削除時に入力値がずれるバグが発生する
        <div key={field.id} className="email-row" style={{ marginBottom: 8 }}>
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
            disabled={fields.length <= 1} // 最後の1つは削除させない
          >
            削除
          </button>

          {/* 配列要素ごとのエラー表示 */}
          {errors.emails?.[index]?.value && (
            <span style={{ color: "red", display: "block" }}>
              {errors.emails[index].value.message}
            </span>
          )}
          {errors.emails?.[index]?.label && (
            <span style={{ color: "red", display: "block" }}>
              {errors.emails[index].label.message}
            </span>
          )}
        </div>
      ))}

      {/* --- 追加ボタン --- */}
      <button
        type="button"
        onClick={() => append({ value: "", label: "" })}
        style={{ marginTop: 8 }}
      >
        + メールを追加
      </button>

      <hr />
      <button type="submit">送信</button>
    </form>
  );
}
```

### 🔍 コード解説

#### `useFieldArray` の戻り値

| プロパティ/関数 | 型 | 役割 |
|--------------|-----|------|
| `fields` | `{ id: string, ... }[]` | 現在のフィールド配列。`id` は React Hook Form が自動生成する一意なID |
| `append(obj)` | `(obj: T) => void` | **末尾**に新しい要素を追加 |
| `prepend(obj)` | `(obj: T) => void` | **先頭**に新しい要素を追加 |
| `remove(index)` | `(index: number) => void` | 指定したインデックスの要素を削除 |
| `insert(index, obj)` | `(i: number, obj: T) => void` | 指定した位置に要素を挿入 |
| `swap(indexA, indexB)` | `(a: number, b: number) => void` | 2つの要素を入れ替え（並び替えUIなど） |
| `move(from, to)` | `(from: number, to: number) => void` | 要素を別の位置に移動 |

#### `register("emails.${index}.value")` の仕組み

`register` に渡す文字列は「**入力値をどこに保存するか**」を示す**住所（パス）**です。
入力値そのものではなく、**データの入れ物の場所**を指定します。

##### ステップ1: 通常のフィールド（固定文字列）

```tsx
// 保存先: { username: "山田" }
<input {...register("username")} />
//            ↑
//            固定の文字列
```

##### ステップ2: オブジェクトの中身（ドット記法）

```tsx
// 保存先: { user: { name: "山田" } }
<input {...register("user.name")} />
//            ↑
//            「userオブジェクトのnameプロパティ」という意味
```

##### ステップ3: 配列の中身（今回のケース）

```tsx
// 保存先: { emails: [ { value: "..." }, { value: "..." } ] }
<input {...register("emails.0.value")} />
//            ↑
//            「emails配列の0番目のvalueプロパティ」という意味
```

> **重要**: `register` の仕組み自体は**全く同じ**です。違うのは「文字列を固定で書くか、動的に組み立てるか」だけです。

##### 住所の分解図

```
registerに書く住所:  "emails.0.value"
                           │   │   │
                           │   │   └─→ オブジェクトのプロパティ名
                           │   └─────→ 配列のインデックス（0番目、1番目…）
                           └─────────→ 配列のフィールド名

実際のデータ構造:
{
  emails: [
    { value: "（ここに入力値が入る）", label: "..." },  ← 0番目
    { value: "（ここに入力値が入る）", label: "..." }   ← 1番目
  ]
}
```

##### テンプレートリテラルで動的に指定

`fields.map((field, index) => ...)` の中では、インデックスが変わるため、テンプレートリテラルで文字列を組み立てます：

```tsx
// index が 0 のとき → "emails.0.value"
// index が 1 のとき → "emails.1.value"
<input {...register(`emails.${index}.value`)} />
```

##### 対比表

| 場面 | registerの書き方 | 理由 |
|------|-----------------|------|
| **通常の1つの入力欄** | `register("username")` | 保存先が決まっている |
| **オブジェクトの中身** | `register("user.name")` | 階層が深いだけ |
| **配列の中身（固定）** | `register("emails.0.value")` | インデックスが決まっている |
| **配列の中身（動的）** | ``register(`emails.${index}.value`)`` | `map` で回すのでインデックスが変わる |

**結論**: `register()` の中身は「**どこに保存するかの住所**」で、これは常に**文字列**です。配列の場合も同じ仕組みで、ただインデックスが毎回変わるので、文字列を `` `emails.${index}.value` `` という形で**動的に作っている**だけです。

#### `key={field.id}` が必須な理由

React のリストレンダリングでは `key` を正しく指定しないと、DOMの更新がおかしくなります。

```
悪い例: key={index}
  インデックス0: [yamada@...]  →  山田の入力を削除
  インデックス1: [sato@...]   →  佐藤の入力が山田の欄に表示されてしまう！

良い例: key={field.id}
  id="a1b2": [yamada@...]  →  このDOMごと消える
  id="c3d4": [sato@...]   →  佐藤の欄はそのまま残る
```

> 📄 より詳しい解説は「[補足：React のリストレンダリングの罠](STEP08_補足_リストレンダリングの罠.md)」を参照してください。

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `fields` を `useState` で別管理する | 二重管理になり同期が乱れる | `fields` は `useFieldArray` から使うだけ |
| `key={index}` にする | 削除時に入力値がずれる | **必ず** `key={field.id}` |
| `defaultValues` で配列を空にする | 初回表示で入力欄がない | 最低1つは初期値を入れるか、空の場合は空状態UIを作る |
| `type="submit"` を追加ボタンに使う | フォームが送信されてしまう | 追加/削除ボタンは **`type="button"`** を明示 |

### ✅ 理解度チェック

- [ ] `useFieldArray` を使わず `useState` で配列を管理すると、何が面倒になるか説明できる
- [ ] `append()` と `remove()` の違いが言える
- [ ] なぜ `key` に `index` ではなく `field.id` を使うのか、具体例を挙げて説明できる

---

## 2. ファイルアップロード

### 💡 このパターンとは何か

フォームでテキストだけでなく**画像・PDFなどのファイル**を送信するケースです。

HTMLの `<input type="file">` は通常のテキスト入力と大きく異なります：
- `value` 属性に文字列を入れられない（セキュリティ上の制限）
- 選択されたファイルは `FileList` という特殊なオブジェクトで取得される
- サーバーへ送る際も `FormData` という特殊な形式が必要

React Hook Form では `register` にそのまま渡せますが、Zodでのバリデーションには工夫が必要です。

### 🎯 どんな時に使うか

- プロフィール画像のアップロード
- 身分証明書の提出
- 添付ファイル付き問い合わせフォーム
- 商品画像の複数アップロード

### 📝 実装のステップ

1. ファイルサイズ・形式の定数を定義する
2. Zodスキーマで `FileList` のバリデーションを `z.custom()` + `.refine()` で定義
3. `watch` で選択されたファイルを監視し、プレビュー用のURLを生成
4. `URL.createObjectURL` で画像プレビューを表示
5. `FormData` を使ってサーバーに送信

### 💻 完成コード

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";

// ============================================================
// ステップ1: ファイル制約の定数化
// ============================================================
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB（バイト単位）
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ============================================================
// ステップ2: Zodスキーマ（FileListのバリデーション）
// ============================================================
const schema = z.object({
  name: z.string().min(1, { error: "名前は必須です" }),

  // FileList は zod に標準でない型なので、z.custom() で定義する
  avatar: z
    .custom<FileList>()
    // refine: 追加の条件を書くメソッド
    // 引数1: 判定関数（trueを返すとOK、falseでNG）
    // 引数2: NGの時のメッセージ
    .refine((files) => files?.length > 0, {
      error: "ファイルを選択してください",
    })
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      error: `ファイルサイズは${MAX_FILE_SIZE / 1024 / 1024}MB以下にしてください`,
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      error: "jpg, png, webp形式のみ対応しています",
    }),
});

type FormData = z.infer<typeof schema>;

// ============================================================
// ステップ3: コンポーネント実装
// ============================================================
function AvatarUploadForm() {
  // プレビュー画像のURLを保持（string | null）
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // ==========================================================
  // ステップ4: ファイル選択を監視してプレビューを生成
  // ==========================================================
  // watch("avatar") で、ユーザーが選択した FileList を取得
  const avatarFiles = watch("avatar");

  // useEffect で副作用（プレビューURL生成）を処理
  // ※元資料の useState(() => {...}) は誤り。useEffect が正しい
  useEffect(() => {
    if (avatarFiles?.[0]) {
      // 選択されたファイルから一時的なURLを生成
      const url = URL.createObjectURL(avatarFiles[0]);
      setPreview(url);

      // クリーンアップ: コンポーネント再レンダー時に古いURLを解放
      // これを忘れるとメモリリーク（ブラウザが重くなる）の原因になる
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [avatarFiles]); // avatarFiles が変わるたびに実行

  // ==========================================================
  // ステップ5: サーバー送信
  // ==========================================================
  const onSubmit = async (data: FormData) => {
    // ファイル付きのHTTP送信には FormData を使う
    // JSON（application/json）ではファイルを送れないため
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("avatar", data.avatar[0]); // FileListの0番目が実際のファイル

    await fetch("/api/upload", {
      method: "POST",
      body: formData, // Content-Type は自動で multipart/form-data になる
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* --- テキスト入力 --- */}
      <div>
        <label htmlFor="name">名前</label>
        <input id="name" {...register("name")} />
        {errors.name && <span style={{ color: "red" }}>{errors.name.message}</span>}
      </div>

      {/* --- ファイル入力 --- */}
      <div style={{ marginTop: 16 }}>
        <label htmlFor="avatar">プロフィール画像</label>
        <input
          id="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          // file input も register で登録できる
          {...register("avatar")}
        />
        {errors.avatar && (
          <span style={{ color: "red", display: "block" }}>
            {errors.avatar.message}
          </span>
        )}
      </div>

      {/* --- プレビュー表示 --- */}
      {preview && (
        <div style={{ marginTop: 8 }}>
          <img
            src={preview}
            alt="選択された画像のプレビュー"
            width={100}
            height={100}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        </div>
      )}

      <button type="submit" style={{ marginTop: 16 }}>
        アップロード
      </button>
    </form>
  );
}
```

### 🔍 コード解説

#### `z.custom<FileList>()` とは

Zod は TypeScript の型安全なバリデーションライブラリですが、**ブラウザ独自の型**（`FileList`, `File`, `Blob` など）については予め知りません。

```ts
// FileList とは？
// <input type="file"> の files プロパティから取得できるオブジェクト
// 配列のようなものだが、純粋な配列ではない（File[] ではない）
// { 0: File, 1: File, length: 2 }
```

`z.custom<T>()` は「この値は型Tであることを前提に、以降の `.refine()` で判定する」という意味です。

#### `.refine()` の構文

```ts
.refine(
  (値) => boolean,           // true = OK, false = エラー
  { error: "エラーメッセージ" } // false の時に表示するメッセージ
)
```

複数の `.refine()` をチェーンできるのが強みです。上から順に判定され、**最初に失敗した箇所のメッセージ**が表示されます。

#### `FormData` の必要性

```
JSONでの送信:  { "name": "山田", "avatar": ??? }
              → ファイルはJSONに入らない

FormDataでの送信:
  ------WebKitFormBoundary
  Content-Disposition: form-data; name="name"

  山田
  ------WebKitFormBoundary
  Content-Disposition: form-data; name="avatar"; filename="icon.png"
  Content-Type: image/png

  [バイナリデータ]
  ------WebKitFormBoundary--
```

ファイルのバイナリデータを送るには `multipart/form-data` 形式が必要で、これが `FormData` です。

#### `URL.createObjectURL` のメモリ管理

```ts
const url = URL.createObjectURL(file); // メモリに一時URLを作る
// ... 使う ...
URL.revokeObjectURL(url); // 使い終わったら必ず解放
```

`useEffect` の `return`（クリーンアップ関数）で `revokeObjectURL` を呼ぶことで、ユーザーが別のファイルを選び直した時に古いURLがメモリに残るのを防ぎます。

### 複数ファイルアップロード

単一ファイルと同じ考え方です。`<input type="file" multiple>` に `multiple` 属性を付けるだけで、`FileList` に複数のファイルが入ります。

```tsx
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const schema = z.object({
  documents: z
    .custom<FileList>()
    .refine((files) => files?.length >= 1, { error: "1つ以上選択してください" })
    .refine(
      (files) => Array.from(files).every((f) => f.size <= MAX_FILE_SIZE),
      { error: "各ファイルは5MB以下にしてください" }
    ),
});

function MultiFileUpload() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: { documents: FileList }) => {
    const formData = new FormData();
    // FileList は forEach で iterate できる
    Array.from(data.documents).forEach((file, i) => {
      formData.append(`file${i}`, file);
    });
    // API送信...
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" multiple {...register("documents")} />
      <button type="submit">アップロード</button>
    </form>
  );
}
```

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `z.string()` でファイルを定義 | 型エラー | `z.custom<FileList>()` を使う |
| `URL.createObjectURL` の解放を忘れる | メモリリークでブラウザが重くなる | `useEffect` の cleanup で `revokeObjectURL` |
| JSON でファイルを送信しようとする | サーバーが受け取れない | `FormData` + `fetch(..., { body: formData })` を使う |
| `accept` 属性を付けない | 全ファイルを選べてしまい、バリデーションが後回し | `accept="image/png,image/jpeg"` で選択時に絞り込む |

### ✅ 理解度チェック

- [ ] なぜ `FileList` は `z.string()` ではなく `z.custom()` で定義するのか説明できる
- [ ] `.refine()` の第1引数、第2引数がそれぞれ何を表すか言える
- [ ] `FormData` を使う理由を、JSON との違いを含めて説明できる
- [ ] `URL.createObjectURL` で生成したURLは、なぜ解放（revoke）する必要があるのか

---

## 3. 非同期バリデーション

### 💡 このパターンとは何か

通常のバリデーション（文字数チェック、メール形式など）は**ブラウザ内だけで完結**します。

しかし、「このユーザー名はすでに使われていますか？」という判定は、**サーバーのDBに問い合わせないと分かりません**。このように**非同期的（async）にサーバーと通信して行うバリデーション**が非同期バリデーションです。

```
通常バリデーション:  入力 → (即座に判定) → OK/NG
非同期バリデーション: 入力 → サーバー問い合わせ → (待機) → OK/NG
```

### 🎯 どんな時に使うか

- ユーザー名・メールアドレスの重複チェック
- クーポンコードの有効性確認
- 郵便番号から住所の自動補完（バリデーションというより補完だが、同じ非同期通信）
- 会社コードの存在確認

### 📝 実装のステップ

**方法A: Zodの `refine(async)` を使う方法**
1. サーバー通信関数を定義する
2. Zodスキーマで `.refine(async (value) => {...})` と書く
3. `mode: "onBlur"` でフォーカスが外れた時に検証を実行
4. `isValidating` で「確認中...」のUIを表示

**方法B: 手動で管理する方法**
1. Reactのstateで「確認中 / 使用可能 / 使用不可」の状態を管理
2. `onBlur` で手動APIコールを実行
3. 結果に応じてメッセージを出し分ける

### 💻 完成コード（方法A: Zodの refine）

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ============================================================
// ステップ1: サーバー通信関数
// ============================================================
// 実際のAPIは存在しないため、モックで代用
// 実務では fetch(`/api/check-username?username=${username}`) など
async function checkUsernameAvailability(
  username: string
): Promise<boolean> {
  const response = await fetch(
    `/api/check-username?username=${encodeURIComponent(username)}`
  );
  const data = await response.json();
  return data.available; // true = 使用可能, false = 既に存在
}

// ============================================================
// ステップ2: Zodスキーマ（非同期refine）
// ============================================================
const schema = z.object({
  username: z
    .string()
    .min(3, { error: "3文字以上で入力してください" })
    .max(20, { error: "20文字以下で入力してください" })
    .regex(/^[a-zA-Z0-9_]+$/, { error: "英数字とアンダースコア(_)のみ使用可能です" })
    // 🔴 async refine: サーバー通信を含む判定
    .refine(
      async (value) => {
        const available = await checkUsernameAvailability(value);
        return available; // true で通過、false でエラー
      },
      { error: "このユーザー名は既に使用されています" }
    ),
  email: z.string().email({ error: "正しいメールアドレスを入力してください" }),
});

type FormData = z.infer<typeof schema>;

// ============================================================
// ステップ3: フォーム実装
// ============================================================
function AsyncValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    // onBlur: 入力欄からフォーカスが外れた時にバリデーション実行
    // 入力中（onChange）だと、文字を打つたびにAPIが飛び重くなる
    mode: "onBlur",
  });

  const onSubmit = (data: FormData) => {
    console.log("送信:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username">ユーザー名</label>
        <input
          id="username"
          {...register("username")}
          placeholder="3〜20文字の英数字"
        />

        {/* isValidating: 非同期バリデーション実行中は true になる */}
        {isValidating && (
          <span style={{ color: "blue", display: "block" }}>
            ⌛ ユーザー名を確認中...
          </span>
        )}

        {errors.username && !isValidating && (
          <span style={{ color: "red", display: "block" }}>
            {errors.username.message}
          </span>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <label htmlFor="email">メールアドレス</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && (
          <span style={{ color: "red" }}>{errors.email.message}</span>
        )}
      </div>

      <button type="submit" style={{ marginTop: 16 }}>
        登録
      </button>
    </form>
  );
}
```

### 💻 完成コード（方法B: 手動での管理）

方法A（Zodのasync refine）では、エラーメッセージの出し分けや「使用可能です」という青文字の表示が難しいです。
方法Bでは、自分で状態管理することで柔軟なUIが作れます。

```tsx
import { useForm } from "react-hook-form";
import { useState } from "react";

function SignupForm() {
  // "idle" = 未入力/未確認, "checking" = 確認中, "available" = OK, "taken" = NG
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const {
    register,
    handleSubmit,
    trigger, // 手動でバリデーションを発火させる関数
    formState: { errors },
  } = useForm();

  // 手動で非同期チェックを行う関数
  const checkUsername = async (username: string) => {
    // 空文字や短すぎる場合はチェックしない
    if (!username || username.length < 3) return;

    setUsernameStatus("checking");

    // 本来は fetch だが、ここではモック
    await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms待機（通信の代わり）
    const isAvailable = username !== "admin" && username !== "test"; // 例: admin, test は使用不可

    setUsernameStatus(isAvailable ? "available" : "taken");
  };

  const onSubmit = (data: any) => {
    if (usernameStatus !== "available") {
      alert("ユーザー名の確認が完了していません");
      return;
    }
    console.log("送信:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username">ユーザー名</label>
        <input
          id="username"
          {...register("username", {
            required: "必須項目です",
            minLength: { value: 3, message: "3文字以上必要です" },
          })}
          // onBlur: フォーカスが外れた時に手動チェック
          onBlur={(e) => checkUsername(e.target.value)}
        />

        {/* 状態に応じたメッセージ表示 */}
        {usernameStatus === "checking" && (
          <span style={{ color: "blue" }}>⌛ 確認中...</span>
        )}
        {usernameStatus === "available" && (
          <span style={{ color: "green" }}>✅ 使用できます</span>
        )}
        {usernameStatus === "taken" && (
          <span style={{ color: "red" }}>❌ 既に使用されています</span>
        )}

        {/* RHFの同期バリデーションエラー（required, minLengthなど） */}
        {errors.username && (
          <span style={{ color: "red", display: "block" }}>
            {errors.username.message}
          </span>
        )}
      </div>

      <button type="submit">登録</button>
    </form>
  );
}
```

### 🔍 コード解説

#### `mode: "onBlur"` の重要性

| mode | 動作 | 非同期API向き？ |
|------|------|---------------|
| `onChange` | 入力するたびに検証 | × 打鍵ごとにAPI飛び重くなる |
| `onBlur` | フォーカスが外れた時 | ○ 入力完了後に1回だけ実行 |
| `onSubmit` | 送信時のみ | △ 重複に気づくのが遅い |

非同期バリデーションでは**必ず `onBlur`（または `onSubmit`）**を使いましょう。

#### 方法Aと方法Bの使い分け

| 観点 | 方法A（Zod async refine） | 方法B（手動管理） |
|------|--------------------------|------------------|
| 実装の簡潔さ | ◎ スキーマに書くだけ | △ state管理が必要 |
| UIの自由度 | △ エラー表示のみ | ◎ 「使用可能」の緑表示など自在 |
| スロットリング | △ 自動では難しい | ◎ 手動で実装しやすい |
| フォーム全体のバリデーション統一 | ◎ Zod一本化 | △ 同期・非同期が分断される |

**推奨**: まずは方法Aで実装し、「使用可能です」のような肯定的フィードバックが必要になったら方法Bに移行すると学びやすいです。

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `mode: "onChange"` で非同期 | APIが連打され、サーバー・ブラウザ双方が重くなる | `onBlur` または手動で制御 |
| async refine でエラーメッセージが出ない | Zodのバージョンが古い | zod v3.20以上を使う（早期バージョンはasync refine未対応） |
| 確認中に送信ボタンを押せる | バリデーション結果が返る前に送信される | `isValidating` でボタンを `disabled` にする |
| 同じ値で何度もAPI通信 | 無駄な通信が増える | 前回の値を記憶し、同じならスキップ |

### ✅ 理解度チェック

- [ ] `mode: "onBlur"` を使う理由を、ユーザー体験（UX）の観点から説明できる
- [ ] `isValidating` はどのタイミングで `true` / `false` になるか説明できる
- [ ] 方法Aと方法Bの違いを、自分の言葉で2つ以上挙げられる
- [ ] 「スロットリング（連打防止）」がなぜ非同期バリデーションで重要か説明できる

---

## 4. ステップフォーム（Wizard）

### 💡 このパターンとは何か

1つの長いフォームを、**複数の画面（ステップ）に分割**して入力するUIです。

```
[ステップ1: 基本情報] → [ステップ2: 連絡先] → [ステップ3: 住所] → [確認]
   姓・名              メール・電話           住所・市区町村
```

**なぜ分割するのか？**
- 入力項目が多いと、ユーザーが圧倒されて「後で入力しよう」と放棄する（離脱率上昇）
- ステップごとに区切ることで「あと少し」の達成感を与え、最後まで入力させやすい
- ステップ1で必須情報を先に取得し、途中離脱しても最小限の価値を得られる（リード獲得）

**技術的な課題**:
- ステップ1で入力した値を、ステップ2の画面でも保持したい
- 戻るボタンで前の画面に戻った時、入力値が残っているべき
- 最後にまとめて送信したい

React Hook Form の `FormProvider` を使うと、**Propsを逐次渡さなくても**子コンポーネントで同じフォーム状態にアクセスできます。

### 🎯 どんな時に使うか

- 会員登録（基本情報 → 詳細情報 → 確認）
- 商品注文（カート → 配送先 → 支払い → 確認）
- アンケート（複数のセクションに分かれた長い設問）
- 設定ウィザード（初期設定のガイド）

### 📝 実装のステップ

1. ステップごとにZodスキーマを分けて定義する
2. `FormProvider` でフォームの状態を共有できるようにする
3. 各ステップを別コンポーネント（`Step1`, `Step2`, ...）に分ける
4. 現在のステップに応じたスキーマで `trigger()` を使い、次へ進む前に検証する
5. 最後のステップで `handleSubmit` を実行

### 💻 完成コード

```tsx
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// ============================================================
// ステップ1: 各ステップのスキーマを定義
// ============================================================
const step1Schema = z.object({
  firstName: z.string().min(1, { error: "姓を入力してください" }),
  lastName: z.string().min(1, { error: "名を入力してください" }),
});

const step2Schema = z.object({
  email: z.string().email({ error: "正しいメールアドレスを入力してください" }),
  phone: z.string().min(10, { error: "正しい電話番号を入力してください" }),
});

const step3Schema = z.object({
  address: z.string().min(1, { error: "住所を入力してください" }),
  city: z.string().min(1, { error: "市区町村を入力してください" }),
});

// ステップごとのスキーマを配列にまとめる
const schemas = [step1Schema, step2Schema, step3Schema];

// ============================================================
// ステップ2: 全ステップを統合した型
// ============================================================
// &（Intersection Type）: 全てのスキーマのプロパティを合成した型
// FormData = { firstName, lastName, email, phone, address, city }
type FormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema>;

// ============================================================
// ステップ3: 親コンポーネント（ステップ管理）
// ============================================================
function StepForm() {
  const [currentStep, setCurrentStep] = useState(0); // 0, 1, 2

  // FormProvider に渡す methods
  // resolver は現在のステップのスキーマを使う
  // 注意: resolverを動的に切り替える実装は複雑なため、
  // ここでは全フィールドを含む統合スキーマを作る方が実務では推奨されます
  // （以下は教育用のシンプルな実装です）
  const methods = useForm<FormData>({
    // 実務ではここに全ステップを統合したスキーマを1つ入れるのが確実です
    // 例: resolver: zodResolver(step1Schema.merge(step2Schema).merge(step3Schema))
    mode: "onChange",
  });

  const { handleSubmit, trigger } = methods;

  // 「次へ」ボタンの処理
  const nextStep = async () => {
    // trigger(): 手動でバリデーションを実行。結果は boolean で返る
    // どのフィールドを検証するか？ → 現在のステップに含まれるフィールド名を指定
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid && currentStep < schemas.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // 「戻る」ボタンの処理
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("最終データ:", data);
    alert("登録が完了しました！");
  };

  // ステップに応じたフィールド名を返す補助関数
  function getFieldsForStep(step: number): string[] {
    switch (step) {
      case 0: return ["firstName", "lastName"];
      case 1: return ["email", "phone"];
      case 2: return ["address", "city"];
      default: return [];
    }
  }

  return (
    // FormProvider: 配下のコンポーネントで useFormContext() を使えるようにする
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* プログレス表示 */}
        <div style={{ marginBottom: 16, fontWeight: "bold" }}>
          ステップ {currentStep + 1} / {schemas.length}
        </div>

        {/* 現在のステップに応じたコンポーネントを表示 */}
        {currentStep === 0 && <Step1 />}
        {currentStep === 1 && <Step2 />}
        {currentStep === 2 && <Step3 />}

        {/* ナビゲーションボタン */}
        <div style={{ marginTop: 24 }}>
          {currentStep > 0 && (
            <button type="button" onClick={prevStep} style={{ marginRight: 8 }}>
              ← 戻る
            </button>
          )}

          {currentStep < schemas.length - 1 ? (
            <button type="button" onClick={nextStep}>
              次へ →
            </button>
          ) : (
            <button type="submit">送信</button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

// ============================================================
// ステップ4: 各ステップコンポーネント
// ============================================================
// useFormContext: FormProvider から提供されたフォーム状態にアクセス
// register, errors などを props で渡さずに使えるのがメリット

function Step1() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <h2>基本情報</h2>
      <div>
        <label>姓</label>
        <input {...register("firstName")} placeholder="山田" />
        {errors.firstName && (
          <span style={{ color: "red" }}>{errors.firstName.message}</span>
        )}
      </div>
      <div style={{ marginTop: 8 }}>
        <label>名</label>
        <input {...register("lastName")} placeholder="太郎" />
        {errors.lastName && (
          <span style={{ color: "red" }}>{errors.lastName.message}</span>
        )}
      </div>
    </div>
  );
}

function Step2() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <h2>連絡先</h2>
      <div>
        <label>メールアドレス</label>
        <input {...register("email")} placeholder="example@mail.com" type="email" />
        {errors.email && (
          <span style={{ color: "red" }}>{errors.email.message}</span>
        )}
      </div>
      <div style={{ marginTop: 8 }}>
        <label>電話番号</label>
        <input {...register("phone")} placeholder="09012345678" />
        {errors.phone && (
          <span style={{ color: "red" }}>{errors.phone.message}</span>
        )}
      </div>
    </div>
  );
}

function Step3() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <h2>住所</h2>
      <div>
        <label>住所</label>
        <input {...register("address")} placeholder="◯◯町1-2-3" />
        {errors.address && (
          <span style={{ color: "red" }}>{errors.address.message}</span>
        )}
      </div>
      <div style={{ marginTop: 8 }}>
        <label>市区町村</label>
        <input {...register("city")} placeholder="東京都新宿区" />
        {errors.city && (
          <span style={{ color: "red" }}>{errors.city.message}</span>
        )}
      </div>
    </div>
  );
}
```

### 🔍 コード解説

#### `FormProvider` と `useFormContext` の関係

通常のReactでは、子コンポーネントにstateを渡すために **Props** を使います（Props drilling）。
ステップフォームのように深くネストすると、同じ `register` を何層も渡すのが面倒です。

```
従来の方法:  StepForm → register → Step1 → register → input
            StepForm → register → Step2 → register → input

FormProvider: StepForm ── FormProvider ──→ Step1 が useFormContext() で直接取得
                                    └──→ Step2 が useFormContext() で直接取得
```

`FormProvider` は React の **Context API** を内部で使っており、配下のどのコンポーネントからでも `useFormContext()` で同じフォーム状態にアクセスできます。

#### `trigger()` の役割

```ts
const isValid = await trigger();           // 全フィールドを検証
const isValid = await trigger("email");      // 特定フィールドのみ
const isValid = await trigger(["email", "phone"]); // 複数フィールド
```

「次へ」ボタンを押した時に、**現在のステップの入力だけを検証**して、OKなら画面を進めます。

#### スキーマの管理について

実務では、ステップごとにスキーマを分けるより、**1つの大きなスキーマ**を作り、`trigger([...])` で部分検証する方が推奨されます。

```ts
const fullSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(1),
  city: z.string().min(1),
});
```

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `FormProvider` の外で `useFormContext()` を呼ぶ | エラー | `FormProvider` の子要素内でしか使えない |
| ステップ間の値がリセットされる | 戻ると入力が消える | `useForm` の `defaultValues` で初期値を設定 |
| 「次へ」ボタンを `type="submit"` にする | 最後のステップ以外でも送信される | ナビゲーションボタンは全て `type="button"` |
| `trigger()` の戻り値を await しない | バリデーション結果が反映される前に進む | `const isValid = await trigger();` と必ず await |

### ✅ 理解度チェック

- [ ] `FormProvider` を使うことで解決できる問題（Props drilling）を説明できる
- [ ] `trigger()` は何をする関数か、どういう戻り値を返すか説明できる
- [ ] なぜ「次へ」ボタンは `type="button"` にすべきか説明できる
- [ ] `FormProvider` を使わずに実装する場合、どのようなコードになるか想像できる

---

## 5. 検索・フィルタフォーム

### 💡 このパターンとは何か

ECサイトの「絞り込み検索」のような、**入力するたびに結果が変わる**フォームです。

```
[検索ワード: コーヒー___]  [カテゴリ: 飲料▼]  [在庫ありのみ ☑]
          ↓ 入力するたびに API 呼び出し
[☕ コーヒー豆 A  ¥1,200]
[🥤 コーヒーゼリー ¥800]
```

**問題点**: 文字を1つ打つたびにAPIを叩くと、サーバーに負荷がかかりすぎます。

**解決策**: **デバウンス（Debounce）** という手法を使います。

```
通常:     入力: コ → コー → コーヒ → コーヒー
          API:   呼ぶ  呼ぶ   呼ぶ    呼ぶ     （4回通信）

デバウンス: 入力: コ → コー → コーヒ → コーヒー [300ms待機] → コーヒー
            API:   －    －     －      －                    呼ぶ（1回のみ）
```

「入力が止まってから一定時間（例: 300ms）待って、初めてAPIを叩く」という仕組みです。

### 🎯 どんな時に使うか

- ECサイトの商品絞り込み
- 管理画面のユーザー検索
- ドキュメント管理の全文検索
- 地図アプリのエリア検索

### 📝 実装のステップ

1. `defaultValues` で検索条件の初期値を設定
2. `useWatch` で入力値の変化を監視（レンダリングを最適化）
3. `useEffect` + `setTimeout` でデバウンス処理
4. クリーンアップで古いタイマーを削除（入力途中の古いAPI呼び出しをキャンセル）
5. クエリ文字列を組み立ててAPI通信

### 💻 完成コード

```tsx
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

// ============================================================
// ステップ1: 検索条件の型定義
// ============================================================
interface SearchFilters {
  query: string;
  category: string;
  minPrice: string; // number ではなく string（空文字を許容するため）
  maxPrice: string;
  inStock: boolean;
}

function SearchFilterForm() {
  const { register, control } = useForm<SearchFilters>({
    defaultValues: {
      query: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    },
  });

  // ==========================================================
  // ステップ2: 入力値の監視
  // ==========================================================
  // useWatch: 指定したフィールドの変化を監視する
  // 配下の全値を一度に取得する場合は control だけ渡す
  const filters = useWatch({ control });

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================================
  // ステップ3: デバウンス処理
  // ==========================================================
  useEffect(() => {
    // タイマーをセット（300ms後に実行）
    const timer = setTimeout(() => {
      fetchResults(filters);
    }, 300);

    // クリーンアップ: 次の入力が来た時、前のタイマーを消す
    // これにより、「入力中の古いAPI呼び出し」が実行されなくなる
    return () => clearTimeout(timer);
  }, [filters]); // filters が変わるたびに effect が再実行

  // ==========================================================
  // ステップ4: API通信
  // ==========================================================
  const fetchResults = async (params: SearchFilters) => {
    setIsLoading(true);

    // URLSearchParams: オブジェクトをクエリ文字列に変換
    // { query: "コーヒー", category: "drink" } → "query=コーヒー&category=drink"
    const queryString = new URLSearchParams({
      ...params,
      // boolean/number は string に変換する必要がある
      inStock: String(params.inStock),
    }).toString();

    try {
      const response = await fetch(`/api/products?${queryString}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("検索エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* --- 検索フォーム --- */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            {...register("query")}
            placeholder="商品名で検索..."
            style={{ padding: 8, minWidth: 200 }}
          />

          <select {...register("category")} style={{ padding: 8 }}>
            <option value="all">すべてのカテゴリ</option>
            <option value="electronics">電子機器</option>
            <option value="clothing">衣類</option>
            <option value="food">食品</option>
          </select>

          <input
            {...register("minPrice")}
            placeholder="最低価格"
            type="number"
            style={{ padding: 8, width: 100 }}
          />
          <span>〜</span>
          <input
            {...register("maxPrice")}
            placeholder="最高価格"
            type="number"
            style={{ padding: 8, width: 100 }}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input type="checkbox" {...register("inStock")} />
            在庫ありのみ
          </label>
        </div>
      </form>

      {/* --- ローディング表示 --- */}
      {isLoading && (
        <p style={{ color: "blue", marginTop: 16 }}>検索中...</p>
      )}

      {/* --- 結果表示 --- */}
      <div style={{ marginTop: 16 }}>
        {results.length === 0 && !isLoading ? (
          <p>該当する商品がありません</p>
        ) : (
          results.map((item) => (
            <div
              key={item.id}
              style={{
                padding: 12,
                borderBottom: "1px solid #eee",
              }}
            >
              <strong>{item.name}</strong> — ¥{item.price}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

### 🔍 コード解説

#### `useWatch` vs `watch`

React Hook Form には値を監視する2つの方法があります。

| 関数 | 使い方 | 再レンダリング | 用途 |
|------|--------|--------------|------|
| `watch("name")` | `const name = watch("name")` | **親コンポーネント全体**が再レンダリング | 単発的な監視 |
| `useWatch({ control })` | `const values = useWatch({ control })` | **useWatchを使ったコンポーネントのみ** | 頻繁な監視向き |

検索フォームのように「高頻度で値が変わる」場合は、`useWatch` を使う方がパフォーマンスが良いです。

#### デバウンスの仕組み

```
時間軸:  0ms    100ms   200ms   300ms   400ms   500ms
入力:    「コ」  「コー」         「コーヒ」
タイマー: 開始    消去→再開始      消去→再開始
実行:                          「コーヒ」の検索が実行（最後のタイマーのみ生き残る）
```

`useEffect` のクリーンアップ関数で `clearTimeout(timer)` を呼ぶことで、**最後の入力から300ms後に1回だけ** APIが実行されます。

#### `URLSearchParams`

```ts
const params = { query: "コーヒー", category: "food", inStock: true };

// オブジェクト → クエリ文字列
new URLSearchParams(params).toString();
// "query=%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC&category=food&inStock=true"
```

日本語は自動でURLエンコードされます。`fetch(`/api?${queryString}`)` とすると、正しくGETリクエストが送れます。

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `useEffect` のクリーンアップを忘れる | 入力中に古い検索結果が上書き表示される | `return () => clearTimeout(timer)` を必ず書く |
| `watch()` を使う | フォーム以外の表示も無駄に再レンダリングされる | `useWatch` に切り替える |
| `type="submit"` なフォーム | Enterキーでページがリロードされる | `onSubmit={(e) => e.preventDefault()}` で無効化 |
| `filters` 変更時に毎回API通信 | サーバー負荷が高い | デバウンス時間を調整（300ms〜500msが一般的） |

### ✅ 理解度チェック

- [ ] デバウンスとは何か、「なぜ必要か」を図を描いて説明できる
- [ ] `useWatch` と `watch` の違いを、再レンダリングの観点から説明できる
- [ ] `URLSearchParams` は何をするクラスか説明できる
- [ ] `useEffect` のクリーンアップが、デバウンスでどのような役割を果たすか

---

## 6. 実践演習：商品登録フォーム

### 💡 この演習で学ぶこと

Session 1 と Session 2 で学んだ知識を**総合的に活用**して、実務レベルの複雑なフォームを1から構築します。

### 🎯 要件

以下の機能を持つ商品登録フォームを作成してください。

#### 1. 基本情報

| 項目 | 仕様 |
|------|------|
| 商品名 | 必須、3〜100文字 |
| 説明 | 必須、10〜1000文字 |
| 価格 | 必須、1円以上 |
| 在庫数 | 必須、0以上 |

#### 2. カテゴリ

| 項目 | 仕様 |
|------|------|
| カテゴリ | 必須、セレクトボックス（衣類/食品/電子機器/家具） |
| タグ | 複数選択、チェックボックス（おすすめ/新品/セール/送料無料） |

#### 3. 画像

| 項目 | 仕様 |
|------|------|
| サムネイル画像 | 必須、1枚、最大2MB、jpg/png/webpのみ |
| 追加画像 | 任意、最大4枚、同じ形式制限 |

#### 4. バリエーション

| 項目 | 仕様 |
|------|------|
| サイズ・カラーごとの在庫 | 動的に追加・削除可能 |
| 例 | S/赤: 10個、M/青: 5個 |

#### 5. 公開設定

| 項目 | 仕様 |
|------|------|
| 公開設定 | ラジオボタン（公開 / 下書き / 予約公開） |
| 予約公開日時 | **予約公開を選んだ時のみ**必須 |

### 📝 実装のヒント

#### スキーマの組み立て方

```tsx
// -------------------------------------------------
// ヒント1: バリエーションの部分スキーマ
// -------------------------------------------------
const variationSchema = z.object({
  size: z.string().min(1, { error: "サイズを入力してください" }),
  color: z.string().min(1, { error: "カラーを入力してください" }),
  stock: z.number().min(0, { error: "0以上の数値を入力してください" }),
});

// -------------------------------------------------
// ヒント2: メインのスキーマ
// -------------------------------------------------
const schema = z.object({
  name: z.string().min(3, { error: "3文字以上で入力してください" }).max(100),
  description: z.string().min(10, { error: "10文字以上で入力してください" }).max(1000),
  price: z.number().min(1, { error: "1円以上を入力してください" }),
  stock: z.number().min(0, { error: "0以上を入力してください" }),
  category: z.string().min(1, { error: "カテゴリを選択してください" }),
  tags: z.array(z.string()).min(1, { error: "1つ以上選択してください" }),
  thumbnail: z.custom<FileList>().refine(
    (files) => files?.length > 0, { error: "サムネイル画像は必須です" }
  ),
  additionalImages: z.custom<FileList>().optional(),
  // useFieldArray で使う配列
  variations: z.array(variationSchema).min(1, { error: "1つ以上のバリエーションを登録してください" }),
  publishStatus: z.enum(["public", "draft", "scheduled"]),
  scheduledAt: z.iso.datetime().optional(),
});

// -------------------------------------------------
// ヒント3: 条件付きバリデーション（予約公開日時）
// -------------------------------------------------
// .refine() はオブジェクト全体に対して追加の条件を課せる
// 第1引数: (data) => boolean  第2引数: { error, path }
const schemaWithConditional = schema.refine(
  (data) => {
    // 「予約公開」を選んだ時のみ、scheduledAt が必須
    if (data.publishStatus === "scheduled") {
      return !!data.scheduledAt; // 空文字・undefined・null なら false
    }
    // それ以外（公開/下書き）は scheduledAt は関係なくOK
    return true;
  },
  {
    error: "予約公開を選んだ場合は、公開日時を指定してください",
    path: ["scheduledAt"], // エラーを scheduledAt フィールドに紐付ける
  }
);
```

#### 実装の順序の提案

一度に全てを実装しようとすると混乱しがちです。以下の順序で段階的に進めることをおすすめします。

```
フェーズ1: 基本情報（name, description, price, stock）
  ↓ 動作確認
フェーズ2: カテゴリ（select）とタグ（checkbox）を追加
  ↓ 動作確認
フェーズ3: 画像アップロード（thumbnail, additionalImages）
  ↓ 動作確認
フェーズ4: バリエーション（useFieldArray）
  ↓ 動作確認
フェーズ5: 公開設定（radio）と条件付きバリデーション（scheduledAt）
  ↓ 動作確認
フェーズ6: デザイン調整・エラーメッセージの見た目整備
```

### 🔍 重要ポイントの解説

#### `z.enum()` とは

文字列を「決まった値の中から選ぶ」という制約です。

```ts
// publishStatus は "public" / "draft" / "scheduled" のいずれかでなければならない
publishStatus: z.enum(["public", "draft", "scheduled"])

// これ以外（例: "published"）を渡すとバリデーションエラーになる
```

React のラジオボタンでは、同じ `name` 属性に異なる `value` を持つ `<input type="radio">` を並べます。

```tsx
<label>
  <input type="radio" value="public" {...register("publishStatus")} />
  公開
</label>
<label>
  <input type="radio" value="draft" {...register("publishStatus")} />
  下書き
</label>
<label>
  <input type="radio" value="scheduled" {...register("publishStatus")} />
  予約公開
</label>
```

#### `.refine()` の `path` オプション

`.refine()` は「オブジェクト全体に対する条件」なので、デフォルトではどのフィールドにエラーを表示すればいいか分かりません。

```ts
.refine(
  (data) => /* 条件 */,
  {
    error: "...",
    path: ["scheduledAt"], // ← エラーを scheduledAt 欄に表示する
  }
)
```

これを指定しないと、`errors["scheduledAt"]` でエラーを取得できません。

### ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|------|------|--------|
| `z.number()` に文字列を渡す | 型エラーまたはNaN | `<input type="number" {...register("price", { valueAsNumber: true })} />` を使う |
| `checkbox` の値が文字列になる | tags が `string` ではなく `boolean` になったり `on` になったり | `value` 属性を明示: `<input type="checkbox" value="sale" {...register("tags")} />` |
| `useFieldArray` の `name` を間違える | フィールドが追加できない | `name` はスキーマのキー名と一致させる |
| `refine` の条件が反映されない | 予約公開を選んでも日時が不要になる | `path` を正しく指定しているか確認 |

### ✅ 理解度チェック（演習後に確認）

- [ ] `z.number()` に対して `valueAsNumber: true` が必要な理由を説明できる
- [ ] checkbox の `register` で `value` 属性を明示する理由を説明できる
- [ ] `.refine()` の `path` オプションがないと何が起きるか説明できる
- [ ] このフォームを、Session 2で学んだパターンのどれに当てはまるか分類できる

---

## まとめ

### 実践パターン一覧

| パターン | 使用フック・機能 | 解決する課題 |
|----------|-----------------|-------------|
| **動的フォーム** | `useFieldArray` | 入力欄をユーザーが自由に増減したい |
| **ファイルアップロード** | `z.custom<FileList>()` + `FormData` | 画像・PDFを送信し、サイズ・形式を検証したい |
| **非同期バリデーション** | `z.refine(async)` / 手動API + `isValidating` | サーバーに問い合わせてから判定したい |
| **ステップフォーム** | `FormProvider` + `useFormContext` + `trigger()` | 長いフォームを分岐・分割して入力したい |
| **リアルタイム検索** | `useWatch` + `useEffect` (debounce) | 入力に応じてAPI検索したいが、連打を防ぎたい |
| **条件付きバリデーション** | `.refine()` + `path` | Aを選んだ時だけBが必須になる、などの条件分岐 |

### 次に進む前のチェックポイント

このセッションで最も重要なのは「**パターンの選択基準**」です。

```
「入力欄が増える」→ useFieldArray
「ファイルを送る」→ z.custom<FileList>() + FormData
「サーバーと通信して判定」→ async refine or 手動管理
「画面を分ける」→ FormProvider + trigger
「入力しながら検索」→ useWatch + debounce
「Aを選んだらBが必須」→ .refine() with path
```

コードを暗記するのではなく、**「この課題にはこの道具が適している」という直感**を養うことが、実務での成長に繋がります。

### 次のセッション（Session 3）で学ぶこと

- `Controller` を使った外部UIライブラリ連携（MUI, Chakra UI, React Select など）
- パフォーマンス最適化（`shouldUnregister`, `useForm` のオプション）
- フォーム状態の永続化（ブラウザバックしても入力が残る）
- 配列・ネストの高度なバリデーションパターン

---

## 付録: よく使う型・API クイックリファレンス

```tsx
// useForm の主な戻り値
const {
  register,       // 入力をフォームに登録
  handleSubmit,   // 送信時のラッパー
  watch,          // 値を監視（レンダリングあり）
  control,        // 制御オブジェクト（useFieldArray, useWatch に必須）
  formState: {
    errors,       // バリデーションエラー
    isValid,      // 全フィールドが有効か
    isValidating, // 非同期バリデーション実行中か
    isSubmitting, // 送信中か
  },
  trigger,        // 手動でバリデーション実行
} = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... },
  mode: "onChange" | "onBlur" | "onSubmit" | "all",
});

// useFieldArray
const { fields, append, prepend, remove, insert, swap, move } = useFieldArray({
  control,
  name: "フィールド名",
});

// useWatch（パフォーマンス重視）
const value = useWatch({ control, name: "fieldName" });
const allValues = useWatch({ control }); // 全値を監視

// useFormContext（FormProvider 配下で使用）
const { register, formState } = useFormContext();
```

---

*この資料は基礎から、概念・背景・実装・注意点の4つをバランスよく解説することを目指しています。*
*不明点があれば、各セクションの「理解度チェック」に戻り、自分の言葉で説明できるか試してみてください。*
