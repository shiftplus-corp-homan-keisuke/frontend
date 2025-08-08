# Session3: Zod フォームバリデーション実践（45 分）

> 💡 **対象**: Session1-2 完了者（Zod 基本概念・高度なスキーマ構築習得済み）
> 🎯 **形式**: 講師サポート付き実践演習
> ⏰ **時間**: 45 分（実習中心）



## 📅 セッション概要

**学習目標**:

- [ ] HTMLフォームと Zod の統合
- [ ] 実践的なフォームバリデーションの実装
- [ ] Zod の利点の実感と振り返り

**前提知識**:

- Session1-2 の内容（Zod 基本概念、カスタムバリデーション、データ変換）
- 基本的なHTML/CSS
- 簡単なJavaScript/TypeScript

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                        | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | --------------------------- | -------------------------- | -------------- | ------------ |
| **0-5 分**   | 課題説明・目標設定          | 簡潔な説明                 | 理解・質問     | 実装計画     |
| **5-35 分**  | HTMLフォーム × Zod統合 | 個別サポート・デバッグ支援 | 開発・実装     | フォーム統合 |
| **35-40 分** | 振り返り・総括              | まとめ・フィードバック     | 質問・確認     | 学習成果     |
| **40-45 分** | 次ステップ予告              | 予告・準備説明             | 理解・確認     | 学習計画     |

---

## 🎯 実習課題：Zod × フォームバリデーション基本統合

### 課題概要

Session1-2 で学習した Zod の技法を使い、シンプルなHTMLフォームでZodバリデーションを実装してください。

### 実習内容

#### 1. Zodスキーマの定義（10分）

**💡 実践でスキーマを使ってみよう**

Session1-2で学んだ**スキーマ（データのルールブック）**を、実際のWebフォームで使ってみましょう。

**💡 身近な例で理解しよう**

オンラインショッピングの会員登録フォームを想像してください：

📝 **ユーザーが入力するデータ**
- 名前：「田中太郎」
- メール：「tanaka@example.com」
- 年齢：「25」

📝 **システムが確認したいこと**
- 名前：空欄じゃない？50文字以内？
- メール：正しいメール形式？
- 年齢：13歳以上？120歳以下？

この「入力データが正しいかチェックする」作業を、Zodのスキーマが自動で行ってくれます。

**✅ フォームでのスキーマ活用**

```typescript
// ルールブック（スキーマ）を定義
const UserSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("正しいメール形式で入力してください"),
  age: z.number().min(13, "13歳以上である必要があります"),
});

// ユーザーが入力したデータをチェック
const inputData = { name: "田中太郎", email: "tanaka@example.com", age: 25 };
const result = UserSchema.safeParse(inputData);

if (result.success) {
  console.log("✅ 入力データは正しいです:", result.data);
} else {
  console.log("❌ 入力エラー:", result.error.errors);
}
```

フォームでは「ユーザーが入力したデータが正しいかチェックする」ことが重要で、Zodのスキーマを使えば**入力データを安全にチェック・変換**できます。

**🎓 学習のポイント**: Session1-2で学んだZodの技法を使って、フォーム用のスキーマを作成

```typescript
// user-form.ts
import { z } from "zod";

// Zodスキーマの定義
const UserSchema = z.object({
  name: z.string()
    .min(1, "名前は必須です")
    .max(50, "名前は50文字以内で入力してください"),
  email: z.string()
    .email("正しいメールアドレス形式で入力してください"),
  age: z.number()
    .min(13, "13歳以上である必要があります")
    .max(120, "120歳以下で入力してください"),
});

// 型の自動生成
type User = z.infer<typeof UserSchema>;

// バリデーション関数
function validateUser(data: unknown): { success: boolean; data?: User; errors?: string[] } {
  const result = UserSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.errors.map(err => err.message);
    return { success: false, errors };
  }
}

console.log("Zodスキーマが定義されました");
```

#### 2. HTMLフォームとZodの統合（20分）

**🎓 学習のポイント**: シンプルなHTMLフォームでZodバリデーションを活用

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Zod フォームバリデーション</title>
    <style>
        .user-form { max-width: 500px; margin: 20px auto; padding: 20px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 4px; font-weight: bold; }
        .form-group input { width: 100%; padding: 8px; border: 1px solid #ccc; }
        .error { color: red; font-size: 12px; margin-top: 4px; }
        .form-actions { display: flex; gap: 12px; margin-top: 20px; }
        .form-actions button { padding: 10px 20px; border: none; cursor: pointer; }
        .submit-btn { background-color: #4caf50; color: white; }
        .result { margin-top: 20px; padding: 16px; background-color: #e8f5e8; }
    </style>
</head>
<body>
    <div class="user-form">
        <h2>ユーザー登録</h2>
        
        <form id="userForm">
            <div class="form-group">
                <label for="name">名前 *</label>
                <input id="name" name="name" type="text" placeholder="山田太郎" />
                <div id="nameError" class="error" style="display: none;"></div>
            </div>

            <div class="form-group">
                <label for="email">メールアドレス *</label>
                <input id="email" name="email" type="email" placeholder="yamada@example.com" />
                <div id="emailError" class="error" style="display: none;"></div>
            </div>

            <div class="form-group">
                <label for="age">年齢 *</label>
                <input id="age" name="age" type="number" placeholder="25" />
                <div id="ageError" class="error" style="display: none;"></div>
            </div>

            <div class="form-actions">
                <button type="submit" class="submit-btn">登録</button>
                <button type="button" id="resetBtn">リセット</button>
            </div>
        </form>

        <div id="result" class="result" style="display: none;">
            <h3>登録完了</h3>
            <div id="resultContent"></div>
        </div>
    </div>

    <script type="module" src="user-form.js"></script>
</body>
</html>
```

```typescript
// user-form.ts
import { z } from "zod";

// Session1-2で学んだZodスキーマの定義
const UserSchema = z.object({
  name: z.string()
    .min(1, "名前は必須です")
    .max(50, "名前は50文字以内で入力してください"),
  email: z.string()
    .email("正しいメールアドレス形式で入力してください"),
  age: z.number()
    .min(13, "13歳以上である必要があります")
    .max(120, "120歳以下で入力してください"),
});

// 型の自動生成
type User = z.infer<typeof UserSchema>;

// エラー表示をクリア
function clearErrors() {
  const errorElements = document.querySelectorAll('.error');
  errorElements.forEach(el => {
    el.style.display = 'none';
    el.textContent = '';
  });
}

// エラー表示
function showError(fieldName: string, message: string) {
  const errorElement = document.getElementById(`${fieldName}Error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

// フォーム送信処理
function handleSubmit(event: Event) {
  event.preventDefault();
  clearErrors();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  
  // フォームデータをオブジェクトに変換
  const userData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    age: Number(formData.get('age')), // 文字列を数値に変換
  };

  // Zodでバリデーション実行
  const result = UserSchema.safeParse(userData);

  if (result.success) {
    // バリデーション成功
    console.log('✅ バリデーション成功:', result.data);
    
    // 結果表示
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    
    if (resultDiv && resultContent) {
      resultContent.innerHTML = `
        <p>名前: ${result.data.name}</p>
        <p>メール: ${result.data.email}</p>
        <p>年齢: ${result.data.age}歳</p>
      `;
      resultDiv.style.display = 'block';
    }
  } else {
    // バリデーション失敗
    console.log('❌ バリデーション失敗:', result.error.errors);
    
    // エラーメッセージを表示
    result.error.errors.forEach(error => {
      const fieldName = error.path[0] as string;
      showError(fieldName, error.message);
    });
  }
}

// リセット処理
function handleReset() {
  clearErrors();
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.style.display = 'none';
  }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  const resetBtn = document.getElementById('resetBtn');
  
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', handleReset);
  }
  
  console.log('Zodフォームバリデーションが初期化されました');
});
```

#### 3. 動作確認とテスト（5分）

**🎓 確認ポイント**:
- フォームに無効なデータを入力してエラーメッセージが表示されるか
- 有効なデータを入力して正常に登録できるか
- Zodの型推論が正しく動作しているか

---

## 📊 Step07 総合評価

### 最終評価基準

#### Zod 基礎理解（35%）

- [ ] **スキーマ定義**: 基本的なスキーマとバリデーションルールの作成
- [ ] **型推論**: z.infer を使った型の自動生成と活用
- [ ] **エラーハンドリング**: safeParse()と parse()の適切な使い分け

#### 高度なバリデーション（25%）

- [ ] **カスタムバリデーション**: refine()と superRefine()の実装
- [ ] **複雑なスキーマ**: ネストしたオブジェクトと配列の処理
- [ ] **データ変換**: transform()を使ったデータ正規化

#### フォーム統合（20%）

- [ ] **HTMLフォーム統合**: Zodバリデーションの実装と使用
- [ ] **エラー表示**: 適切なエラーメッセージの表示
- [ ] **データ変換**: フォームデータの型安全な処理

#### 実装品質（20%）

- [ ] **TypeScript 活用**: 型安全性が確保されている
- [ ] **エラーハンドリング**: 適切な例外処理が実装されている
- [ ] **コード品質**: 可読性・保守性の高いコードが書かれている

---

## 成果物

学習の集大成として、実際に動作する Zod を活用したフォームバリデーションアプリケーションを構築することで実践的なスキルを身につけます。

---

## 🔄 Step08 への準備

### 次週学習内容の予習

```typescript
// Step08で学習するライブラリ統合の基礎概念
// 以下のコードを読んで理解しておくこと

// 1. 外部ライブラリの型定義
declare module "some-library" {
  export function someFunction(param: string): number;
}

// 2. d.tsファイルの基本
interface Window {
  customProperty: string;
}

// 3. DefinitelyTypedの活用
// npm install @types/lodash
import _ from "lodash";
```

### 学習の振り返り

**今回学んだこと**:

- Zod の基本概念と実行時型安全性
- スキーマ定義とバリデーション実行
- カスタムバリデーションルールの作成
- HTMLフォームとの統合
- 実践的なフォームバリデーション

**Zod の利点を実感できたポイント**:

- **実行時型安全性**: フォーム入力の安全な処理
- **型推論**: スキーマから型の自動生成により開発効率向上
- **バリデーション**: 複雑なビジネスルールの実装が容易
- **統合性**: 既存のHTMLフォームとの親和性

**次のステップ**:

- 外部ライブラリとの統合
- 型定義ファイルの作成と活用
- より大規模なプロジェクトでの設計パターン

---

**🎉 お疲れ様でした！** Step07 を通じて Zod の活用方法をしっかりと身につけることができました。

**🚀 次の Step08 では、外部ライブラリとの統合と型定義について学習します！**

---

## 📋 Session3 & Step07 完了チェックリスト（45分版）

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 統合概念理解

- [ ] HTMLフォームと Zod の統合原理を理解している
- [ ] フォームデータの型安全な処理方法を説明できる
- [ ] フロントエンドでの実行時型安全性の価値を実感できている

### 💻 実装スキル

- [ ] Zodスキーマを使ったフォームバリデーションを実装できる
- [ ] エラーメッセージの適切な表示とハンドリングができる
- [ ] 基本的なフォームバリデーションを Zod で実装できる

### 🔧 実践能力

- [ ] シンプルなフォームアプリケーションを構築できる
- [ ] ユーザーフレンドリーなバリデーションを実装できる
- [ ] エラーハンドリングとユーザビリティを両立できる

### 🧪 実践確認

- [ ] ユーザー登録フォームを完成させた
- [ ] バリデーションが期待通りに動作することを確認した
- [ ] エラーケースでの動作をテストした

### 📚 総合的な理解

- [ ] Zod を使用する基本的な利点を説明できる
- [ ] 実際のプロジェクトでの活用方法を理解している
- [ ] 次のステップ（外部ライブラリ統合）への準備ができている

### 🎯 実務応用力

- [ ] 基本的なフォームバリデーションに Zod を活用できる
- [ ] 継続的な学習と改善の方向性を理解している

**🎉 すべてチェックできましたか？**

**✅ 完了した方へ**: おめでとうございます！Zod の基本的な活用スキルを身につけました。次の Step08 でさらなる成長を目指しましょう。

**⚠️ チェックできない項目がある方へ**: 該当する学習内容を再度確認し、実際のコーディングを通じて理解を深めてください。基本をしっかり理解してから次に進むことが重要です。

---

## 🔄 継続学習のヒント

**今後の学習方向性**:

1. **実プロジェクトでの活用**: 学んだスキルを実際のプロジェクトで活用してみましょう
2. **他のライブラリとの組み合わせ**: React Hook Form、Formik 等との統合も学習価値があります
3. **パフォーマンス最適化**: 大規模なスキーマでのパフォーマンス考慮事項を学びましょう
4. **コミュニティ参加**: Zod の最新動向やベストプラクティスを追跡しましょう
