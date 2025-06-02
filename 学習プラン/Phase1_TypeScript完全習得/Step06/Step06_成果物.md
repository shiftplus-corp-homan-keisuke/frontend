# Step06 成果物：フォーム管理システム

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存のJavaScriptコードにTypeScriptのユーティリティ型を追加する

**なぜ作るのか**: Step06で学習したユーティリティ型入門を実際のコードに適用し、**既存コードを型安全で柔軟にする力**を身につけるため

**学習目標**:
- 既存のJavaScriptコードを読んで適切なユーティリティ型を設計できる
- 組み込みユーティリティ型（Partial、Pick、Omit等）を正しく使える
- 関数関連ユーティリティ型（ReturnType、Parameters等）を活用できる
- カスタムユーティリティ型の基礎を理解して実装できる

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── form-manager.ts    # ユーティリティ型を追加したプログラム（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計50分）

### Phase 1: 既存コードの理解（15分）

#### ステップ1-1: 提供されたJavaScriptコードを理解する（15分）

以下のJavaScriptコードを読んで、どんなユーティリティ型が必要か考えてください：

```javascript
// 既存のJavaScriptコード（ユーティリティ型なし）
let formData = {};
let validationErrors = {};
let formConfig = {};

function createUser(userData) {
  return {
    id: generateId(),
    name: userData.name,
    email: userData.email,
    age: userData.age,
    address: userData.address,
    phone: userData.phone,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function updateUser(id, updates) {
  const existingUser = getUserById(id);
  return {
    ...existingUser,
    ...updates,
    updatedAt: new Date()
  };
}

function getUserPublicInfo(user) {
  return {
    id: user.id,
    name: user.name,
    age: user.age
  };
}

function getUserContactInfo(user) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone
  };
}

function validateField(fieldName, value, rules) {
  const errors = [];
  
  if (rules.required && (!value || value.trim() === "")) {
    errors.push(`${fieldName}は必須です`);
  }
  
  if (rules.minLength && value && value.length < rules.minLength) {
    errors.push(`${fieldName}は${rules.minLength}文字以上で入力してください`);
  }
  
  if (rules.maxLength && value && value.length > rules.maxLength) {
    errors.push(`${fieldName}は${rules.maxLength}文字以下で入力してください`);
  }
  
  if (rules.pattern && value && !rules.pattern.test(value)) {
    errors.push(`${fieldName}の形式が正しくありません`);
  }
  
  return errors;
}

function validateForm(data, validationRules) {
  const errors = {};
  
  for (const fieldName in validationRules) {
    const fieldValue = data[fieldName];
    const fieldRules = validationRules[fieldName];
    const fieldErrors = validateField(fieldName, fieldValue, fieldRules);
    
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  }
  
  return errors;
}

function updateFormField(fieldName, value) {
  formData[fieldName] = value;
  
  // バリデーション実行
  if (formConfig[fieldName]) {
    const fieldErrors = validateField(fieldName, value, formConfig[fieldName]);
    if (fieldErrors.length > 0) {
      validationErrors[fieldName] = fieldErrors;
    } else {
      delete validationErrors[fieldName];
    }
  }
}

function getFormData() {
  return { ...formData };
}

function getValidationErrors() {
  return { ...validationErrors };
}

function resetForm() {
  formData = {};
  validationErrors = {};
}

function isFormValid() {
  return Object.keys(validationErrors).length === 0;
}

function getRequiredFields(config) {
  const requiredFields = [];
  for (const fieldName in config) {
    if (config[fieldName].required) {
      requiredFields.push(fieldName);
    }
  }
  return requiredFields;
}

function getFieldsOfType(config, type) {
  const fields = [];
  for (const fieldName in config) {
    if (config[fieldName].type === type) {
      fields.push(fieldName);
    }
  }
  return fields;
}

function createFormConfig(fields) {
  const config = {};
  fields.forEach(field => {
    config[field.name] = {
      type: field.type,
      required: field.required || false,
      minLength: field.minLength,
      maxLength: field.maxLength,
      pattern: field.pattern
    };
  });
  return config;
}

function getFormSummary() {
  return {
    totalFields: Object.keys(formConfig).length,
    filledFields: Object.keys(formData).length,
    errorCount: Object.keys(validationErrors).length,
    isValid: isFormValid(),
    completionRate: Object.keys(formData).length / Object.keys(formConfig).length
  };
}

function runExample() {
  console.log("=== フォーム管理システムのデモ ===");
  
  // フォーム設定の作成
  const fieldConfigs = [
    {
      name: "name",
      type: "text",
      required: true,
      minLength: 2,
      maxLength: 50
    },
    {
      name: "email",
      type: "email",
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    {
      name: "age",
      type: "number",
      required: true
    },
    {
      name: "phone",
      type: "tel",
      required: false,
      pattern: /^\d{3}-\d{4}-\d{4}$/
    },
    {
      name: "address",
      type: "text",
      required: false,
      maxLength: 200
    }
  ];
  
  formConfig = createFormConfig(fieldConfigs);
  console.log("フォーム設定:", formConfig);
  
  // フォーム入力のシミュレーション
  updateFormField("name", "田中太郎");
  updateFormField("email", "tanaka@example.com");
  updateFormField("age", "30");
  updateFormField("phone", "090-1234-5678");
  
  console.log("フォームデータ:", getFormData());
  console.log("バリデーションエラー:", getValidationErrors());
  console.log("フォーム概要:", getFormSummary());
  
  // ユーザー作成
  if (isFormValid()) {
    const userData = getFormData();
    const newUser = createUser(userData);
    console.log("作成されたユーザー:", newUser);
    
    // 公開情報の取得
    const publicInfo = getUserPublicInfo(newUser);
    console.log("公開情報:", publicInfo);
    
    // 連絡先情報の取得
    const contactInfo = getUserContactInfo(newUser);
    console.log("連絡先情報:", contactInfo);
    
    // ユーザー更新
    const updatedUser = updateUser(newUser.id, { age: "31" });
    console.log("更新されたユーザー:", updatedUser);
  }
  
  // 必須フィールドの確認
  const requiredFields = getRequiredFields(formConfig);
  console.log("必須フィールド:", requiredFields);
  
  // 特定タイプのフィールド取得
  const textFields = getFieldsOfType(formConfig, "text");
  console.log("テキストフィールド:", textFields);
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getUserById(id) {
  // 実際の実装ではデータベースから取得
  return {
    id: id,
    name: "既存ユーザー",
    email: "existing@example.com",
    age: "25",
    address: "東京都",
    phone: "090-0000-0000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  };
}

// 実行
runExample();
```

### Phase 2: ユーティリティ型の追加（30分）

#### ステップ2-1: 組み込みユーティリティ型の実装（15分）

上記のコードを見て、以下のユーティリティ型を実装してください：

1. **基本的なユーザー型の定義**
   - `User`インターフェースを定義
   - `createUser`関数が返すオブジェクトの型

2. **Partial型の活用**
   - `updateUser`関数で部分更新を型安全に
   - フォームデータの段階的入力

3. **Pick型の活用**
   - `getUserPublicInfo`で特定のプロパティのみ選択
   - `getUserContactInfo`で連絡先情報のみ選択

4. **Omit型の活用**
   - ユーザー作成時に自動生成フィールドを除外

**🤔 考えてみましょう**:
```typescript
// TODO: 以下の型を定義してください

// ユーザーの基本型
interface User {
  // どんなプロパティが必要？
}

// ユーザー作成用の型（自動生成フィールドを除外）
type CreateUserRequest = Omit<User, ?>;

// 公開情報用の型（特定のプロパティのみ）
type PublicUserInfo = Pick<User, ?>;

// 連絡先情報用の型
type ContactInfo = Pick<User, ?>;

// 部分更新用の型
type UpdateUserRequest = Partial<?>;
```

#### ステップ2-2: Record型とその他のユーティリティ型（10分）

```typescript
// TODO: 以下のユーティリティ型を実装してください

// バリデーションルールの型
interface ValidationRule {
  // どんなプロパティが必要？
}

// フィールド設定の型
interface FieldConfig {
  // どんなプロパティが必要？
}

// Record型を使った型定義
type FormConfig = Record<string, ValidationRule>;
type FormData = Record<string, any>;
type ValidationErrors = Record<string, string[]>;

// 関数の戻り値型を取得
type FormSummaryType = ReturnType<typeof getFormSummary>;

// 関数のパラメータ型を取得
type ValidateFieldParams = Parameters<typeof validateField>;
```

#### ステップ2-3: 変数と関数に型注釈を追加（5分）

```typescript
// TODO: 以下の変数と関数に適切な型注釈を追加してください
let formData = {};
let validationErrors = {};
let formConfig = {};

function createUser(userData) { /* ... */ }
function updateUser(id, updates) { /* ... */ }
function validateField(fieldName, value, rules) { /* ... */ }
// その他の関数...
```

### Phase 3: 動作確認（5分）

#### ステップ3-1: 動作確認
TypeScript Playgroundまたはローカル環境で実行して動作を確認

---

## ✅ 最低合格要件

以下の要件を**すべて満たす**ことで合格とします：

### 🔧 技術要件
- [ ] TypeScriptでコンパイルエラーが発生しない
- [ ] **組み込みユーティリティ型を5つ以上使用している**（最重要！）
- [ ] **Record型を適切に使用している**（最重要！）
- [ ] すべての変数に適切な型注釈が付いている
- [ ] すべての関数の引数と戻り値に適切な型注釈が付いている

### 🎯 機能要件
- [ ] 元のJavaScriptコードと同じ動作をする
- [ ] フォームデータの管理ができる
- [ ] バリデーション機能が動作する
- [ ] ユーザーの作成・更新ができる

### 💭 ユーティリティ型要件
- [ ] Partial型が適切に使われている
- [ ] Pick型が適切に使われている
- [ ] Omit型が適切に使われている
- [ ] Record型が適切に使われている
- [ ] ReturnType、Parametersが使われている

---

## 📊 評価基準

| 項目 | 配点 | 評価ポイント |
|------|------|-------------|
| **ユーティリティ型活用力** | 40点 | 組み込みユーティリティ型を適切に使用できている |
| **型設計力** | 30点 | 適切なインターフェースと型エイリアスを設計できている |
| **型注釈の正確性** | 20点 | 全ての変数・関数に適切な型注釈が付いている |
| **機能の完成度** | 10点 | 元のコードと同じ動作をする |

**合格ライン**: 70点以上

---

## 💡 ユーティリティ型のヒント

### 🤔 ユーティリティ型を考える時の質問

1. **部分的な更新が必要？**
   - フォームの段階的入力 → `Partial<T>`
   - ユーザー情報の部分更新 → `Partial<User>`

2. **特定のプロパティのみ必要？**
   - 公開情報のみ表示 → `Pick<User, "id" | "name">`
   - 連絡先情報のみ → `Pick<User, "name" | "email" | "phone">`

3. **特定のプロパティを除外したい？**
   - 作成時に自動生成フィールドを除外 → `Omit<User, "id" | "createdAt">`

4. **キーと値の型を指定したい？**
   - 設定オブジェクト → `Record<string, ValidationRule>`
   - エラーオブジェクト → `Record<string, string[]>`

### 📝 ユーティリティ型の基本例

```typescript
// 基本的なユーティリティ型の使用例
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  address?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Partial - 全プロパティをオプショナルに
type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; ... }

// Pick - 特定のプロパティのみ選択
type PublicInfo = Pick<User, "id" | "name" | "age">;
// { id: string; name: string; age: number; }

// Omit - 特定のプロパティを除外
type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">;
// { name: string; email: string; age: number; address?: string; phone?: string; }

// Record - キーと値の型を指定
type FormErrors = Record<keyof User, string[]>;
// { id: string[]; name: string[]; email: string[]; ... }

// Required - 全プロパティを必須に
type RequiredUser = Required<User>;
// { id: string; name: string; email: string; age: number; address: string; phone: string; ... }
```

### 🔍 関数関連ユーティリティ型

```typescript
// 関数の戻り値型を取得
function getUser(): User {
  return {} as User;
}
type UserType = ReturnType<typeof getUser>; // User

// 関数のパラメータ型を取得
function updateUser(id: string, data: Partial<User>): User {
  return {} as User;
}
type UpdateParams = Parameters<typeof updateUser>; // [string, Partial<User>]

// 特定のパラメータの型を取得
type UserId = Parameters<typeof updateUser>[0]; // string
type UpdateData = Parameters<typeof updateUser>[1]; // Partial<User>
```

### ⚠️ よくある間違い

1. **Partialを使わずに部分更新を実装**
   ```typescript
   // ❌ 間違い：全プロパティが必要になる
   function updateUser(id: string, updates: User): User {
     // 部分更新なのに全プロパティを要求
   }
   
   // ✅ 正解：Partialを使用
   function updateUser(id: string, updates: Partial<User>): User {
     // 部分更新で型安全
   }
   ```

2. **Pickを使わずに手動で型を定義**
   ```typescript
   // ❌ 間違い：手動で型を定義（重複・保守性の問題）
   interface PublicUserInfo {
     id: string;
     name: string;
     age: number;
   }
   
   // ✅ 正解：Pickを使用
   type PublicUserInfo = Pick<User, "id" | "name" | "age">;
   ```

3. **Recordを使わずにanyを使用**
   ```typescript
   // ❌ 間違い：型安全性を失う
   let formData: any = {};
   
   // ✅ 正解：Recordを使用
   let formData: Record<string, any> = {};
   // さらに良い：具体的な型を指定
   let formData: Record<keyof User, string> = {};
   ```

---

## 📚 参考：完成例（ユーティリティ型の答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// 基本的な型定義
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  address?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ValidationRule {
  type: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

interface FieldConfig {
  name: string;
  type: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

// ユーティリティ型の活用
type CreateUserRequest = Omit<User, "id" | "createdAt" | "updatedAt">;
type UpdateUserRequest = Partial<Omit<User, "id" | "createdAt">>;
type PublicUserInfo = Pick<User, "id" | "name" | "age">;
type ContactInfo = Pick<User, "name" | "email" | "phone">;

// Record型の活用
type FormConfig = Record<string, ValidationRule>;
type FormData = Record<string, any>;
type ValidationErrors = Record<string, string[]>;

// 関数関連ユーティリティ型
type FormSummaryType = ReturnType<typeof getFormSummary>;
type ValidateFieldParams = Parameters<typeof validateField>;

// 変数の型注釈
let formData: FormData = {};
let validationErrors: ValidationErrors = {};
let formConfig: FormConfig = {};

// 関数の型注釈
function createUser(userData: CreateUserRequest): User {
  return {
    id: generateId(),
    name: userData.name,
    email: userData.email,
    age: userData.age,
    address: userData.address,
    phone: userData.phone,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function updateUser(id: string, updates: UpdateUserRequest): User {
  const existingUser = getUserById(id);
  return {
    ...existingUser,
    ...updates,
    updatedAt: new Date()
  };
}

function getUserPublicInfo(user: User): PublicUserInfo {
  return {
    id: user.id,
    name: user.name,
    age: user.age
  };
}

function getUserContactInfo(user: User): ContactInfo {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone
  };
}
```

</details>

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] カスタムユーティリティ型の作成（DeepPartial等）
- [ ] 条件付き型の基礎的な使用
- [ ] より複雑なRecord型の活用
- [ ] 型レベルプログラミングの基礎

---

**📌 重要**: この課題の目的は**既存のJavaScriptコードを読んで適切なユーティリティ型を実装する力**を身につけることです。TypeScriptのユーティリティ型システムを実践的に学習しましょう。

**🌟 次のステップ**: Step07では、実践プロジェクト開始について学習します！