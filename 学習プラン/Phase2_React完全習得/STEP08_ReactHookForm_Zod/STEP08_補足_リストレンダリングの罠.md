# 補足：React のリストレンダリングの罠〜 `key` の正しい使い方

## はじめに

React で「リスト（配列）を画面に表示する」際、`key` という属性を指定します。

この `key` を**配列のインデックス（何番目か）**にしていると、**要素を削除した時に入力値がずれたり、状態がおかしくなる**という罠にハマります。

この資料では、**なぜ `key={index}` が危険なのか**、**React Hook Form の `useFieldArray` ではなぜ `field.id` が必須なのか**を、初学者向けに丁寧に解説します。

---

## 💡 この「罠」とは何か

React はリストを描画する時、`key` を使って「どの要素がどの DOM に対応するか」を判断します。

`key` を正しく設定しないと、React は「中身が変わった」と思い込んで **DOM を作り直さず、既存の DOM を再利用** しようとします。

その結果、**見た目上は要素が消えたのに、入力欄の中身が残ってしまう**（または逆に、違う要素の値が表示される）というバグが起きます。

---

## 🎯 どんな時に問題が起きるか

以下のような UI で発生しやすいです：

- ✅ フォームの入力欄を動的に追加・削除する
- ✅ タブの並び替えや削除
- ✅ ToDo リストの並び替えや削除
- ✅ テーブル（表）の行の削除

特に **React Hook Form の `useFieldArray` を使った動的フォーム** では、ほぼ必ず遭遇する問題です。

---

## 📝 なぜ `key={index}` が危険なのか

### まず「インデックス」とは？

```tsx
const items = ["山田", "佐藤", "鈴木"];

// index は「何番目か」の数字
// 山田→0, 佐藤→1, 鈴木→2
items.map((item, index) => (
  <div key={index}>{item}</div>  // ← keyにindexを使っている
));
```

### 問題のシナリオ：2番目（佐藤）を削除する

まず、**何を表示しているか**を確認しましょう。

ここでは「**人の名前ラベル**」と「**メールアドレス入力欄**」がセットになったフォームを想定しています：

```tsx
<div>
  <span>山田</span>        ← 名前ラベル（Reactが管理）
  <input value="yamada@..." />  ← メール欄（ブラウザが管理）
</div>
```

#### 【Step 1】削除前の画面

```
key=0:  [山田]  [yamada@example.com]  ← 山田の行
key=1:  [佐藤]  [sato@example.com]    ← 佐藤の行
key=2:  [鈴木]  [suzuki@example.com]  ← 鈴木の行
       ↑名前    ↑inputの中身
```

#### 【Step 2】佐藤（index=1）を削除

配列から「佐藤」が消え、新しい配列は `["山田", "鈴木"]` になります。

```tsx
// 新しいデータ
["山田", "鈴木"]

// indexが振り直される
// 山田→0, 鈴木→1
```

#### 【Step 3】React が `key={index}` で再描画

React は前回の画面と今回の画面を比較し、**同じ `key` のものは「同じ要素」と判断**します。

| key | 前回のデータ | 今回のデータ | React の判断 | DOM の扱い | 結果 |
|:---:|:----------:|:----------:|:-----------|:---------|:----:|
| 0 | 山田 | 山田 | 「同じ要素だ」 | 前回の DOM をそのまま使う | ✅ 正しい |
| 1 | 佐藤 | 鈴木 | 「同じ要素が中身を変えた」 | **佐藤の DOM を再利用** | ❌ バグ！ |
| 2 | 鈴木 | （なし） | 「要素が消えた」 | DOM を破棄 | — |

#### 【Step 4】なぜバグが起きるのか？

**React は「key=1 は前回と同じ要素だ」と判断したため、佐藤の行にあった DOM（HTMLタグ）を壊さずにそのまま使い回します。**

この「DOM をそのまま使い回す」ことを **「DOM 再利用」** と呼びます。

では、各パーツがどうなるか見ていきましょう：

**名前ラベル `[佐藤]` → `[鈴木]` に変わる ✅**
- テキスト部分は React が仮想 DOM で管理しているため、データが変われば自動で更新されます。

**メール欄 `[sato@...]` → 変わらず ❌**
- `<input>` 要素はブラウザが管理する「生の DOM」です。
- React は「同じ要素だ」と判断して input タグ自体は作り直しません。
- なので、佐藤が入力していた `sato@example.com` がそのまま残ります。

#### 【最終結果】

```
key=0:  [山田]  [yamada@example.com]  ← 正しい ✅
key=1:  [鈴木]  [sato@example.com]    ← 名前は鈴木なのに、中身は佐藤のまま！💥
```

**「鈴木の欄に佐藤のメールアドレスが残っている」というバグが発生します。**

> 💡 **ポイント**：React は `key` が同じ → 「同じ要素」→ 「DOM を再利用」となります。
> 削除後も index は `0, 1, 2...` と振り直されるため、React は「中身が入れ替わっただけ」と誤認するのです。

---

## 💻 コードで比較してみよう

### ❌ 悪い例：`key={index}`

```tsx
import { useState } from "react";

function BadExample() {
  const [items, setItems] = useState([
    { id: "a", name: "山田", email: "yamada@example.com" },
    { id: "b", name: "佐藤", email: "sato@example.com" },
    { id: "c", name: "鈴木", email: "suzuki@example.com" },
  ]);

  const remove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: 8 }}>  {/* ← ここが問題！ */}
          <span>{item.name}</span>
          <input defaultValue={item.email} placeholder="メールアドレス" />
          <button onClick={() => remove(index)}>削除</button>
        </div>
      ))}
    </div>
  );
}
```

**「佐藤」を削除すると、鈴木の欄に佐藤のメールアドレスが残るバグが起きます。**

### ✅ 良い例：`key={item.id}`（ユニークなID）

```tsx
import { useState } from "react";

function GoodExample() {
  const [items, setItems] = useState([
    { id: "a", name: "山田", email: "yamada@example.com" },
    { id: "b", name: "佐藤", email: "sato@example.com" },
    { id: "c", name: "鈴木", email: "suzuki@example.com" },
  ]);

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: 8 }}>  {/* ← 一意なID！ */}
          <span>{item.name}</span>
          <input defaultValue={item.email} placeholder="メールアドレス" />
          <button onClick={() => remove(item.id)}>削除</button>
        </div>
      ))}
    </div>
  );
}
```

**「佐藤」を削除すると、佐藤の DOM ごと消え、鈴木の欄はそのまま残ります。**

---

## 🔍 React Hook Form の `useFieldArray` ではなぜ `field.id` が必須なのか

React Hook Form の `useFieldArray` は、フィールドごとに**自動で一意な `id` を生成**してくれます。

```tsx
const { fields, append, remove } = useFieldArray({
  control,
  name: "emails",
});
```

この `fields` は以下のような形になっています：

```ts
[
  { id: "a1b2", value: "yamada@example.com" },  // ← id は RHF が自動生成
  { id: "c3d4", value: "sato@example.com" },
]
```

### 必ず `key={field.id}` を使う理由

```tsx
{fields.map((field, index) => (
  <div key={field.id}>  {/* ← これが正解 */}
    <input {...register(`emails.${index}.value`)} />
    <button type="button" onClick={() => remove(index)}>削除</button>
  </div>
))}
```

| 指定方法 | 結果 |
|:--------:|:----:|
| `key={index}` | 削除時に入力値がずれる 💥 |
| `key={field.id}` | 正しい要素が正しく消える ✅ |

`register` の引数には `index` を使っても問題ありません（`emails.${index}.value`）。
**ただし `key` には絶対に `index` を使わないでください。**

### 内部的に何が違うのか

React は更新時に以下のように動作します：

1. 前回のリストと今回のリストを比較
2. `key` が同じものは「同じ要素」と判断 → DOM を再利用
3. 新しい `key` → 新規DOMを作成
4. 消えた `key` → DOMを削除

`key={index}` の場合、削除後も index は `0, 1, 2...` と振り直されるため、React は「中身が入れ替わった」と誤認します。

`key={field.id}` の場合、削除された要素の `id` がリストから消えるため、React は「その id の DOM を破棄すべき」と正しく判断します。

---

## ⚠️ よくあるミスと対処法

| ミス | 症状 | 対処法 |
|:----|:----|:------|
| `key={index}` にする | 削除・並び替え時に入力値がずれる | **必ず** 一意なIDを `key` に使う |
| `key` を省略する | コンソールに警告が出て、予期しない挙動 | すべてのリスト要素に `key` を付ける |
| `key` にランダム値（`Math.random()`）を使う | 毎回DOMが作り直され、パフォーマンスが悪い・入力中のフォーカスが失われる | データの同一性を保てる安定した値を使う |
| `key` に配列の要素そのもの（オブジェクト）を使う | ランタイムエラー（keyは文字列または数値） | `item.id` のようなプリミティブ値にする |

### 一意なIDがないデータの場合の対処法

データに `id` がない場合は、**データを作る段階で `id` を付与**します：

```ts
// データ取得時や追加時にIDを生成
const newItem = {
  id: crypto.randomUUID(),  // ブラウザ組み込みのUUID生成
  name: "",
  email: "",
};

// またはライブラリを使う
import { v4 as uuidv4 } from "uuid";
const id = uuidv4();
```

---

## ✅ 理解度チェック

以下の項目を自分の言葉で説明できるか確認しましょう：

- [ ] React がリストを更新する時、`key` は何のために使われるか説明できる
- [ ] `key={index}` で要素を削除すると、なぜ入力値がずれるのか具体例を挙げて説明できる
- [ ] React Hook Form の `useFieldArray` で `fields` の `id` が自動生成される理由を説明できる
- [ ] `register()` の引数に `index` を使っても問題ない理由、しかし `key` には使えない理由を説明できる
- [ ] データに `id` がない場合、どう対処すべきか説明できる

---

## まとめ

- `key` は React が「どの DOM がどのデータに対応するか」を識別するための「身分証明書」です
- `key={index}` は「順番で管理」しているため、削除・並び替え時に身元がずれてバグが起きます
- **必ずデータ自体に含まれる一意なID（または `field.id`）を `key` に使いましょう**
- `register()` のインデックス指定と `key` の指定は別の問題です。`register` には `index` を、`key` には `id` を使うのが正解です

> 💡 **覚えておくと良い一言**：`key` は「順番」ではなく「身分」です。
