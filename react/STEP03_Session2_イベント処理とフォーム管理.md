# STEP03 Session 2: イベント処理とフォーム管理

> ⏰ **セッション時間**: 90 分
> 🎯 **目標**: React におけるイベント処理の実装方法と制御されたコンポーネントの概念を習得する
> 📋 **前提**: Session1 での useState フックの基本理解

## 📅 セッション構成

| 時間     | 内容                           | 形式 | 成果物                       |
| -------- | ------------------------------ | ---- | ---------------------------- |
| 0-15 分  | イベント処理の基礎概念         | 講義 | 概念理解                     |
| 15-45 分 | 制御されたコンポーネントの実装 | 実践 | フォーム入力管理             |
| 45-75 分 | フォームバリデーションの実装   | 実践 | 完全なフォームコンポーネント |
| 75-90 分 | まとめ・実装レビュー           | 討論 | 学習記録                     |

## 🎯 学習目標の詳細

### 💡 このセッションで身につけること

- [ ] React イベントハンドラーの実装方法をマスターする
- [ ] 制御されたコンポーネントの概念と実装方法を理解する
- [ ] フォーム入力の状態管理と更新方法を習得する
- [ ] 基本的なフォームバリデーションを実装できる

### 📝 成果物

- インタラクティブなフォームコンポーネント
- リアルタイムバリデーション機能付きフォーム
- 複数の入力要素を統合した完全なフォーム

## 📚 レクチャー 2-1: イベントの処理方法

### 🔍 なぜこの技術が重要なのか

💡 **実務での価値**:

- **ユーザーインタラクション**: クリック、入力、選択等のユーザー操作への対応
- **リアルタイム更新**: ユーザーの操作に即座に反応する UI
- **データ収集**: フォーム入力を通じたユーザーデータの収集と管理

🎯 **解決する課題**:

- 静的な UI から動的でインタラクティブな UI への変換
- ユーザー入力の適切な処理と状態への反映
- フォームデータの検証と送信処理

### 📝 イベントハンドラーの実装詳細

#### Level 1: 基本的なイベントハンドラー

```typescript
// 💡 基本的なクリックイベントの処理
import { useState } from "react";

function BasicButton() {
  const [message, setMessage] =
    useState<string>("ボタンをクリックしてください");

  // イベントハンドラー関数の定義
  const handleClick = () => {
    setMessage("ボタンがクリックされました！");
  };

  return (
    <div>
      <p>{message}</p>
      <button onClick={handleClick}>クリック</button>
    </div>
  );
}
```

**🔍 解説ポイント**:

- イベントハンドラーは通常 `handle` プレフィックスで命名する
- onClick プロップに関数を直接渡す
- イベント発生時にステートを更新して UI を変更

#### Level 2: イベントオブジェクトの活用

```typescript
// 🎯 イベントオブジェクトを使った詳細な処理
import { useState, ChangeEvent, MouseEvent } from "react";

function EventDetails() {
  const [inputValue, setInputValue] = useState<string>("");
  const [clickInfo, setClickInfo] = useState<string>("");

  // 入力イベントの処理
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  // マウスイベントの詳細処理
  const handleMouseClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY, button } = event;
    setClickInfo(`座標: (${clientX}, ${clientY}), ボタン: ${button}`);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="何か入力してください"
      />
      <p>入力値: {inputValue}</p>

      <button onClick={handleMouseClick}>クリック情報を取得</button>
      <p>{clickInfo}</p>
    </div>
  );
}
```

**⚠️ 注意点**:

- TypeScript では適切なイベント型を指定する
- `event.target.value` でフォーム要素の値にアクセス
- `event.preventDefault()` でデフォルトの動作を防ぐことができる

#### Level 3: 複雑なイベント処理とエラーハンドリング

```typescript
// 🚀 エラーハンドリングと複雑なフォーム処理
import { useState, FormEvent, ChangeEvent } from "react";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function AdvancedForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 汎用的な入力変更ハンドラー
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // リアルタイムバリデーション
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // フォーム送信の処理
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // 模擬的な非同期処理
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("登録が完了しました！");
      setFormData({ email: "", password: "", confirmPassword: "" });
    } catch (error) {
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.email) {
      errors.email = "メールアドレスは必須です";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "有効なメールアドレスを入力してください";
    }

    if (!data.password) {
      errors.password = "パスワードは必須です";
    } else if (data.password.length < 8) {
      errors.password = "パスワードは8文字以上で入力してください";
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "パスワードが一致しません";
    }

    return errors;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">メールアドレス:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="password">パスワード:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        {errors.password && (
          <span style={{ color: "red" }}>{errors.password}</span>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword">パスワード確認:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        {errors.confirmPassword && (
          <span style={{ color: "red" }}>{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "送信中..." : "登録"}
      </button>
    </form>
  );
}
```

**📝 実装のコツ**:

- `name` 属性を活用した汎用的な入力ハンドラーの実装
- リアルタイムバリデーションでユーザビリティを向上
- 非同期処理中の適切な状態管理
- TypeScript による型安全なフォーム処理

## 📚 レクチャー 2-2: 制御された要素

### 🔍 制御されたコンポーネントとは

💡 **概念の説明**:
制御されたコンポーネント（Controlled Components）とは、フォーム要素の値を React のステートで管理し、React が単一の情報源（Single Source of Truth）となるパターンです。

#### Level 1: 基本的な制御されたコンポーネント

```typescript
// 💡 基本的な制御された入力要素
import { useState } from "react";

function ControlledInput() {
  const [value, setValue] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={value} // React ステートで値を制御
        onChange={handleChange} // 変更をステートに反映
        placeholder="制御された入力"
      />
      <p>現在の値: {value}</p>
      <p>文字数: {value.length}</p>
    </div>
  );
}
```

#### Level 2: 複数の制御された要素

```typescript
// 🎯 複数の制御された要素の管理
import { useState, ChangeEvent } from "react";

interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: "male" | "female" | "other";
  bio: string;
  newsletter: boolean;
}

function UserProfileForm() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    age: 0,
    gender: "other",
    bio: "",
    newsletter: false,
  });

  // テキスト入力の処理
  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 数値入力の処理
  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  // セレクト要素の処理
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value as UserProfile["gender"],
    }));
  };

  // チェックボックスの処理
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <form>
      <div>
        <label htmlFor="name">名前:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={profile.name}
          onChange={handleTextChange}
        />
      </div>

      <div>
        <label htmlFor="email">メールアドレス:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={profile.email}
          onChange={handleTextChange}
        />
      </div>

      <div>
        <label htmlFor="age">年齢:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={profile.age}
          onChange={handleNumberChange}
          min="0"
          max="120"
        />
      </div>

      <div>
        <label htmlFor="gender">性別:</label>
        <select
          id="gender"
          name="gender"
          value={profile.gender}
          onChange={handleSelectChange}
        >
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div>
        <label htmlFor="bio">自己紹介:</label>
        <textarea
          id="bio"
          name="bio"
          value={profile.bio}
          onChange={handleTextChange}
          rows={4}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="newsletter"
            checked={profile.newsletter}
            onChange={handleCheckboxChange}
          />
          ニュースレターを受信する
        </label>
      </div>

      <div>
        <h3>プレビュー:</h3>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </form>
  );
}
```

#### Level 3: 高度な制御されたコンポーネント

```typescript
// 🚀 カスタムフックを使った制御されたコンポーネント
import { useState, ChangeEvent, useCallback } from "react";

// カスタムフック: フォーム状態の管理
function useFormState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const updateField = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setState((prev) => ({
        ...prev,
        [name]: value,
      }));

      // エラーをクリア
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    setErrors({});
  }, [initialState]);

  return {
    state,
    errors,
    updateField,
    setFieldError,
    reset,
  };
}

// 使用例
function AdvancedUserForm() {
  const {
    state: formData,
    errors,
    updateField,
    setFieldError,
    reset,
  } = useFormState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateField(name as keyof typeof formData, value);

    // リアルタイムバリデーション
    if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      setFieldError("email", "有効なメールアドレスを入力してください");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("送信データ:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="ユーザー名"
        />
        {errors.username && <span>{errors.username}</span>}
      </div>

      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="メールアドレス"
        />
        {errors.email && <span>{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="パスワード"
        />
        {errors.password && <span>{errors.password}</span>}
      </div>

      <button type="submit">送信</button>
      <button type="button" onClick={reset}>
        リセット
      </button>
    </form>
  );
}
```

### 💻 実践演習

#### 演習 2-1: 基本的な制御されたフォーム

**🎯 演習目的**: 制御されたコンポーネントの基本実装を理解する

**📋 要件**:

- 名前、メールアドレス、メッセージの入力フィールドを作成
- 各フィールドの値をステートで管理
- リアルタイムで入力内容をプレビュー表示
- 送信ボタンでアラートに内容を表示

**💡 ヒント**:

- 複数のステートを一つのオブジェクトで管理する
- `name` 属性を活用した汎用的なハンドラーを作成
- フォーム送信時は `event.preventDefault()` を忘れずに

#### 演習 2-2: バリデーション付きログインフォーム

**🎯 演習目的**: フォームバリデーションと状態管理の統合を学習する

**📋 要件**:

- メールアドレスとパスワードの入力フィールド
- リアルタイムバリデーション（メール形式、パスワード長）
- エラーメッセージの表示
- バリデーション通過時のみ送信可能

**💡 ヒント**:

- バリデーション関数を分離して作成
- エラー状態を別のステートで管理
- 条件付きでボタンの有効/無効を切り替え

### 🔍 理解度チェック

以下の質問に答えられるかチェックしてみましょう：

1. **基礎理解**: 制御されたコンポーネントと非制御コンポーネントの違いは何ですか？
2. **応用理解**: フォームの値をオブジェクト型のステートで管理する利点は何ですか？
3. **実践理解**: リアルタイムバリデーションを実装する際の注意点は何ですか？

## 🗒️ セッションまとめ

### ✅ 今回学んだこと

- **イベントハンドラー**: React でのユーザーインタラクションの処理方法
- **制御されたコンポーネント**: フォーム要素の値をステートで管理する方法
- **フォームバリデーション**: ユーザー入力の検証とエラー表示
- **TypeScript 統合**: 型安全なイベント処理とフォーム管理

### 📝 次回への準備

- 配列とオブジェクトの不変性を保った更新方法の復習
- JavaScript の配列メソッド（map、filter、sort 等）の理解
- デバッグツール（React Developer Tools）の使用方法の確認

### 🔄 復習推奨項目

- 制御されたコンポーネントの実装パターン
- イベントオブジェクトの型定義と活用方法
- フォームバリデーションのベストプラクティス

---

## 🔗 セッション ナビゲーション

### 📚 STEP03 全体の学習フロー

**[メイン ページ](STEP03_ステート、イベント、フォーム_基礎とTypeScript統合.md)**に戻る

| 前のセッション                                                                                    | 現在のセッション                             | 次のセッション                                                                                    |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 📄 [Session 1: ステートの基礎概念とその重要性](STEP03_Session1_ステートの基礎概念とその重要性.md) | 📍 **Session 2: イベント処理とフォーム管理** | 📄 [Session 3: ステート管理の高度なテクニック](STEP03_Session3_ステート管理の高度なテクニック.md) |

### 🎯 Session 1 からの継続学習ポイント

- Session 1 で学んだ useState フックを活用して、ユーザーインタラクションに応じたステート更新を実装します
- 静的なコンポーネントから、ユーザー入力に反応する動的なフォームコンポーネントへと発展します

### 🎯 Session 3 への準備

このセッションで習得するイベント処理と制御されたコンポーネントの知識は、Session 3 での高度なステート管理の基礎となります。

---
