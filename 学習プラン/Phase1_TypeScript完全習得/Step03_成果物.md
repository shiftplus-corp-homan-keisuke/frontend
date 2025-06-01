# Step03 成果物：図書管理システム

---

## 🎯 課題の目的

**あなたが作成するもの**: 既存のJavaScriptコードにTypeScriptのインターフェース定義を追加する

**なぜ作るのか**: Step03で学習したインターフェースとオブジェクト型を実際のコードに適用し、**既存コードを型安全にする力**を身につけるため

**学習目標**:
- 既存のJavaScriptコードを読んで適切なインターフェースを設計できる
- インターフェースの基本定義ができる
- 継承（extends）を使ってインターフェースを拡張できる
- オプショナルプロパティ（?）と読み取り専用プロパティ（readonly）を適切に使える

---

## 📋 必須提出物

以下の1つのファイルのみ提出してください：

```
📁 提出物/
└── library-system.ts    # インターフェース定義を追加したプログラム（必須）
```

---

## ⏰ 作成手順（推奨時間配分：合計40分）

### Phase 1: 既存コードの理解（10分）

#### ステップ1-1: 提供されたJavaScriptコードを理解する（10分）

以下のJavaScriptコードを読んで、どんなインターフェースが必要か考えてください：

```javascript
// 既存のJavaScriptコード（インターフェース定義なし）
let books = [];
let authors = [];
let borrowRecords = [];
let nextBookId = 1;
let nextAuthorId = 1;
let nextBorrowId = 1;

function addBook(title, author, category, publishedYear, isbn) {
  const book = {
    id: nextBookId++,
    title: title,
    author: author,
    category: category,
    publishedYear: publishedYear,
    isbn: isbn,
    status: "available"
  };
  
  books.push(book);
  return book;
}

function addAuthor(name, birthYear, nationality, biography) {
  const author = {
    id: nextAuthorId++,
    name: name,
    birthYear: birthYear,
    nationality: nationality,
    biography: biography
  };
  
  authors.push(author);
  return author;
}

function borrowBook(bookId, borrowerName) {
  const book = books.find(b => b.id === bookId);
  
  if (!book || book.status !== "available") {
    return null;
  }
  
  const borrowRecord = {
    id: nextBorrowId++,
    bookId: bookId,
    borrowerName: borrowerName,
    borrowDate: new Date(),
    returnDate: null
  };
  
  borrowRecords.push(borrowRecord);
  book.status = "borrowed";
  
  return borrowRecord;
}

function returnBook(borrowId) {
  const record = borrowRecords.find(r => r.id === borrowId);
  
  if (!record || record.returnDate) {
    return false;
  }
  
  record.returnDate = new Date();
  
  const book = books.find(b => b.id === record.bookId);
  if (book) {
    book.status = "available";
  }
  
  return true;
}

function findBooksByTitle(title) {
  return books.filter(book => 
    book.title.toLowerCase().includes(title.toLowerCase())
  );
}

function findBooksByAuthor(author) {
  return books.filter(book => 
    book.author.toLowerCase().includes(author.toLowerCase())
  );
}

function getAvailableBooks() {
  return books.filter(book => book.status === "available");
}

function getAllBooks() {
  return [...books];
}

function getAllAuthors() {
  return [...authors];
}

function runExample() {
  console.log("=== 図書管理システムのデモ ===");
  
  // 著者の追加
  addAuthor("夏目漱石", 1867, "日本", "明治時代の小説家");
  addAuthor("村上春樹", 1949, "日本", "現代日本文学の代表的作家");
  
  // 図書の追加
  addBook("吾輩は猫である", "夏目漱石", "fiction", 1905, "978-4-10-101001-1");
  addBook("ノルウェイの森", "村上春樹", "fiction", 1987, "978-4-06-274881-5");
  addBook("相対性理論入門", "アインシュタイン", "science", 1916);
  
  // 図書の検索
  console.log("タイトル検索（猫）:", findBooksByTitle("猫"));
  console.log("著者検索（村上）:", findBooksByAuthor("村上"));
  
  // 図書の貸出
  const borrow1 = borrowBook(1, "田中太郎");
  const borrow2 = borrowBook(2, "佐藤花子");
  
  console.log("貸出記録1:", borrow1);
  console.log("貸出記録2:", borrow2);
  
  // 利用可能な図書の確認
  console.log("利用可能な図書:", getAvailableBooks());
  
  // 図書の返却
  if (borrow1) {
    const returned = returnBook(borrow1.id);
    console.log("返却成功:", returned);
  }
  
  console.log("全図書:", getAllBooks());
  console.log("全著者:", getAllAuthors());
}

// 実行
runExample();
```

### Phase 2: インターフェース定義の追加（25分）

#### ステップ2-1: 基本インターフェースの定義（15分）

上記のコードを見て、以下のインターフェースを定義してください：

1. **図書情報を表現するインターフェース**
   - `addBook`関数が返すオブジェクトの型
   - どんなプロパティが必要でしょうか？
   - どのプロパティがオプショナル（?）でしょうか？
   - どのプロパティが読み取り専用（readonly）でしょうか？

2. **著者情報を表現するインターフェース**
   - `addAuthor`関数が返すオブジェクトの型
   - どんなプロパティが必要でしょうか？

3. **貸出記録を表現するインターフェース**
   - `borrowBook`関数が返すオブジェクトの型
   - どんなプロパティが必要でしょうか？

**🤔 考えてみましょう**:
- `isbn`は必須？オプショナル？
- `id`は変更可能？読み取り専用？
- `returnDate`は最初からある？後から追加？

#### ステップ2-2: 型エイリアスの定義（5分）

```typescript
// TODO: 以下の型エイリアスを定義してください
// 図書の状態を表現する型（"available" | "borrowed" | "reserved"）
// 図書のカテゴリを表現する型（"fiction" | "non-fiction" | "science" | "history"）
```

#### ステップ2-3: 変数と関数に型注釈を追加（5分）

```typescript
// TODO: 以下の変数と関数に適切な型注釈を追加してください
let books = [];
let authors = [];
let borrowRecords = [];

function addBook(title, author, category, publishedYear, isbn) { /* ... */ }
function addAuthor(name, birthYear, nationality, biography) { /* ... */ }
function borrowBook(bookId, borrowerName) { /* ... */ }
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
- [ ] **インターフェースを3つ以上定義している**（最重要！）
- [ ] **型エイリアスを2つ以上定義している**
- [ ] すべての変数に適切な型注釈が付いている
- [ ] すべての関数の引数と戻り値に適切な型注釈が付いている

### 🎯 機能要件
- [ ] 元のJavaScriptコードと同じ動作をする
- [ ] 図書の追加・検索ができる
- [ ] 著者の追加ができる
- [ ] 図書の貸出・返却ができる

### 💭 インターフェース要件
- [ ] 図書情報のインターフェースが正しく定義されている
- [ ] 著者情報のインターフェースが正しく定義されている
- [ ] 貸出記録のインターフェースが正しく定義されている
- [ ] オプショナルプロパティ（?）が適切に使われている
- [ ] 読み取り専用プロパティ（readonly）が適切に使われている

---

## 📊 評価基準

| 項目 | 配点 | 評価ポイント |
|------|------|-------------|
| **インターフェース設計力** | 50点 | 適切なインターフェースを自分で設計できている |
| **型注釈の正確性** | 30点 | 全ての変数・関数に適切な型注釈が付いている |
| **機能の完成度** | 20点 | 元のコードと同じ動作をする |

**合格ライン**: 70点以上

---

## 💡 インターフェース設計のヒント

### 🤔 インターフェースを考える時の質問

1. **このオブジェクトにはどんな情報が含まれる？**
   - 図書 → タイトル、著者、カテゴリ、出版年、ISBN、状態、ID
   - 著者 → 名前、生年、国籍、略歴、ID
   - 貸出記録 → 図書ID、借用者名、貸出日、返却日、ID

2. **どの情報が必須？どの情報がオプショナル？**
   - ISBN → 古い本にはないかも → オプショナル（?）
   - 生年 → 不明な場合がある → オプショナル（?）
   - 返却日 → 最初はnull → オプショナル（?）

3. **どの情報が変更不可？**
   - ID → 一度決まったら変更しない → 読み取り専用（readonly）

### 📝 インターフェースの基本例

```typescript
// 基本的なインターフェース
interface User {
  readonly id: number;    // 読み取り専用
  name: string;           // 必須
  email?: string;         // オプショナル
}

// 継承を使ったインターフェース
interface DetailedUser extends User {
  age: number;
  address: string;
}

// 型エイリアス
type Status = "active" | "inactive" | "pending";
type Role = "admin" | "user" | "guest";
```

### ⚠️ よくある間違い

1. **オプショナルプロパティの見落とし**
   ```typescript
   // ❌ 間違い：ISBNは必須ではない
   interface Book {
     id: number;
     title: string;
     isbn: string;  // 古い本にはISBNがない場合がある
   }
   
   // ✅ 正解：ISBNはオプショナル
   interface Book {
     readonly id: number;
     title: string;
     isbn?: string;  // オプショナル
   }
   ```

2. **読み取り専用プロパティの見落とし**
   ```typescript
   // ❌ 間違い：IDは変更可能にすべきではない
   interface Book {
     id: number;  // 変更可能
     title: string;
   }
   
   // ✅ 正解：IDは読み取り専用
   interface Book {
     readonly id: number;  // 読み取り専用
     title: string;
   }
   ```

3. **型エイリアスを使わない**
   ```typescript
   // ❌ 間違い：文字列リテラルを直接使用
   interface Book {
     status: "available" | "borrowed" | "reserved";
     category: "fiction" | "non-fiction" | "science";
   }
   
   // ✅ 正解：型エイリアスを使用
   type BookStatus = "available" | "borrowed" | "reserved";
   type BookCategory = "fiction" | "non-fiction" | "science";
   
   interface Book {
     status: BookStatus;
     category: BookCategory;
   }
   ```

---

## 📚 参考：完成例（インターフェース定義の答えを見たい場合）

<details>
<summary>⚠️ 注意：まず自分で考えてから見てください</summary>

```typescript
// 型エイリアス
type BookStatus = "available" | "borrowed" | "reserved";
type BookCategory = "fiction" | "non-fiction" | "science" | "history";

// インターフェース定義
interface Book {
  readonly id: number;
  title: string;
  author: string;
  category: BookCategory;
  publishedYear: number;
  isbn?: string;  // オプショナル
  status: BookStatus;
}

interface Author {
  readonly id: number;
  name: string;
  birthYear?: number;  // オプショナル
  nationality?: string;  // オプショナル
  biography?: string;  // オプショナル
}

interface BorrowRecord {
  readonly id: number;
  bookId: number;
  borrowerName: string;
  borrowDate: Date;
  returnDate?: Date;  // オプショナル
}

// 変数の型注釈
let books: Book[] = [];
let authors: Author[] = [];
let borrowRecords: BorrowRecord[] = [];
let nextBookId: number = 1;
let nextAuthorId: number = 1;
let nextBorrowId: number = 1;

// 関数の型注釈
function addBook(
  title: string, 
  author: string, 
  category: BookCategory, 
  publishedYear: number, 
  isbn?: string
): Book {
  // 実装
}

function addAuthor(
  name: string, 
  birthYear?: number, 
  nationality?: string, 
  biography?: string
): Author {
  // 実装
}

function borrowBook(bookId: number, borrowerName: string): BorrowRecord | null {
  // 実装
}
```

</details>

---

## 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- [ ] インターフェースの継承（extends）を使った拡張
- [ ] より詳細な図書情報のインターフェース
- [ ] 図書館の統計情報を表現するインターフェース

---

**📌 重要**: この課題の目的は**既存のJavaScriptコードを読んで適切なインターフェースを設計する力**を身につけることです。TypeScriptのインターフェースとオブジェクト型システムを実践的に学習しましょう。

**🌟 次のステップ**: Step04では、ユニオン型と型ガードについて学習します！
