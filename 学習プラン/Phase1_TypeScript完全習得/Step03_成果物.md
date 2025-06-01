# Step03 成果物：図書カードシステム

---

## 📝 システム概要

### 📚 基本的な図書カードシステム

**目的**: Step03で学習したインターフェースとオブジェクト型を活用して、図書カードの管理システムを実装する

**主要機能**:
1. 図書カードの作成と管理
2. 著者情報の管理
3. 貸出状況の追跡
4. 基本的な検索機能

**使用する型システム**:
- インターフェース: データ構造の定義
- 継承（extends）: インターフェースの拡張
- オプショナルプロパティ: 任意の情報の表現
- 読み取り専用プロパティ: 不変データの保護
- 型エイリアス: 複雑な型の簡潔な表現

---

## 🚀 段階的実装手順

### Phase 1: 基本インターフェースの設計 🔰

#### ステップ1-1: 基本的なインターフェース定義

```typescript
// book-card.ts

// 図書の状態（型エイリアス）
type BookStatus = "available" | "borrowed" | "reserved";

// 図書のカテゴリ（型エイリアス）
type BookCategory = "fiction" | "non-fiction" | "science" | "history" | "art";

// 基本的な図書情報のインターフェース
interface Book {
  readonly id: number;          // 図書ID（読み取り専用）
  title: string;                // タイトル
  author: string;               // 著者
  isbn?: string;                // ISBN（オプショナル）
  category: BookCategory;       // カテゴリ
  publishedYear: number;        // 出版年
  status: BookStatus;           // 状態
}

// 著者情報のインターフェース
interface Author {
  readonly id: number;          // 著者ID（読み取り専用）
  name: string;                 // 名前
  birthYear?: number;           // 生年（オプショナル）
  nationality?: string;         // 国籍（オプショナル）
  biography?: string;           // 略歴（オプショナル）
}

// 貸出記録のインターフェース
interface BorrowRecord {
  readonly id: number;          // 貸出ID（読み取り専用）
  bookId: number;               // 図書ID
  borrowerName: string;         // 借用者名
  borrowDate: Date;             // 貸出日
  returnDate?: Date;            // 返却日（オプショナル）
}

// 基本的な図書カード管理クラス
class BookCardManager {
  private books: Book[] = [];
  private authors: Author[] = [];
  private borrowRecords: BorrowRecord[] = [];
  private nextBookId: number = 1;
  private nextAuthorId: number = 1;
  private nextBorrowId: number = 1;

  // 図書の追加
  addBook(title: string, author: string, category: BookCategory, publishedYear: number, isbn?: string): Book {
    const book: Book = {
      id: this.nextBookId++,
      title,
      author,
      isbn,
      category,
      publishedYear,
      status: "available"
    };

    this.books.push(book);
    return book;
  }

  // 著者の追加
  addAuthor(name: string, birthYear?: number, nationality?: string, biography?: string): Author {
    const author: Author = {
      id: this.nextAuthorId++,
      name,
      birthYear,
      nationality,
      biography
    };

    this.authors.push(author);
    return author;
  }

  // 図書の検索（タイトルで）
  findBooksByTitle(title: string): Book[] {
    return this.books.filter(book => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  // 図書の検索（著者で）
  findBooksByAuthor(author: string): Book[] {
    return this.books.filter(book => 
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  // 図書の検索（カテゴリで）
  findBooksByCategory(category: BookCategory): Book[] {
    return this.books.filter(book => book.category === category);
  }

  // 全図書の取得
  getAllBooks(): Book[] {
    return [...this.books]; // 配列のコピーを返す
  }

  // 全著者の取得
  getAllAuthors(): Author[] {
    return [...this.authors]; // 配列のコピーを返す
  }

  // 利用可能な図書の取得
  getAvailableBooks(): Book[] {
    return this.books.filter(book => book.status === "available");
  }
}
```

### Phase 2: インターフェース継承と拡張 🔶

#### ステップ2-1: 拡張インターフェースの設計

```typescript
// 詳細な図書情報（Bookインターフェースを拡張）
interface DetailedBook extends Book {
  description?: string;         // 説明（オプショナル）
  pageCount?: number;           // ページ数（オプショナル）
  publisher?: string;           // 出版社（オプショナル）
  language: string;             // 言語
  tags: string[];               // タグ
}

// 詳細な著者情報（Authorインターフェースを拡張）
interface DetailedAuthor extends Author {
  books: string[];              // 著作リスト
  awards?: string[];            // 受賞歴（オプショナル）
  website?: string;             // ウェブサイト（オプショナル）
  isActive: boolean;            // 活動中かどうか
}

// 拡張された貸出記録（BorrowRecordインターフェースを拡張）
interface DetailedBorrowRecord extends BorrowRecord {
  dueDate: Date;                // 返却予定日
  isOverdue: boolean;           // 延滞かどうか
  renewalCount: number;         // 更新回数
  notes?: string;               // 備考（オプショナル）
}

// 図書館の統計情報
interface LibraryStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalAuthors: number;
  booksByCategory: { [category: string]: number };
}

// 拡張された図書カード管理クラス
class AdvancedBookCardManager extends BookCardManager {
  private detailedBooks: DetailedBook[] = [];
  private detailedAuthors: DetailedAuthor[] = [];
  private detailedBorrowRecords: DetailedBorrowRecord[] = [];

  // 詳細な図書の追加
  addDetailedBook(
    title: string, 
    author: string, 
    category: BookCategory, 
    publishedYear: number,
    language: string,
    tags: string[],
    isbn?: string,
    description?: string,
    pageCount?: number,
    publisher?: string
  ): DetailedBook {
    const basicBook = this.addBook(title, author, category, publishedYear, isbn);
    
    const detailedBook: DetailedBook = {
      ...basicBook,
      description,
      pageCount,
      publisher,
      language,
      tags: [...tags]
    };

    this.detailedBooks.push(detailedBook);
    return detailedBook;
  }

  // 詳細な著者の追加
  addDetailedAuthor(
    name: string,
    isActive: boolean,
    birthYear?: number,
    nationality?: string,
    biography?: string,
    books: string[] = [],
    awards?: string[],
    website?: string
  ): DetailedAuthor {
    const basicAuthor = this.addAuthor(name, birthYear, nationality, biography);
    
    const detailedAuthor: DetailedAuthor = {
      ...basicAuthor,
      books: [...books],
      awards: awards ? [...awards] : undefined,
      website,
      isActive
    };

    this.detailedAuthors.push(detailedAuthor);
    return detailedAuthor;
  }

  // 図書の貸出
  borrowBook(bookId: number, borrowerName: string): DetailedBorrowRecord | null {
    const book = this.getAllBooks().find(b => b.id === bookId);
    
    if (!book || book.status !== "available") {
      return null;
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2週間後

    const borrowRecord: DetailedBorrowRecord = {
      id: this.nextBorrowId++,
      bookId,
      borrowerName,
      borrowDate,
      dueDate,
      isOverdue: false,
      renewalCount: 0
    };

    this.detailedBorrowRecords.push(borrowRecord);
    book.status = "borrowed";

    return borrowRecord;
  }

  // 図書の返却
  returnBook(borrowId: number): boolean {
    const record = this.detailedBorrowRecords.find(r => r.id === borrowId);
    
    if (!record || record.returnDate) {
      return false;
    }

    record.returnDate = new Date();
    
    const book = this.getAllBooks().find(b => b.id === record.bookId);
    if (book) {
      book.status = "available";
    }

    return true;
  }

  // 貸出の更新
  renewBorrow(borrowId: number): boolean {
    const record = this.detailedBorrowRecords.find(r => r.id === borrowId);
    
    if (!record || record.returnDate || record.renewalCount >= 2) {
      return false;
    }

    record.dueDate.setDate(record.dueDate.getDate() + 14);
    record.renewalCount++;
    record.isOverdue = false;

    return true;
  }

  // 延滞チェック
  checkOverdueBooks(): DetailedBorrowRecord[] {
    const today = new Date();
    const overdueRecords: DetailedBorrowRecord[] = [];

    for (const record of this.detailedBorrowRecords) {
      if (!record.returnDate && record.dueDate < today) {
        record.isOverdue = true;
        overdueRecords.push(record);
      }
    }

    return overdueRecords;
  }

  // 統計情報の取得
  getLibraryStats(): LibraryStats {
    const allBooks = this.getAllBooks();
    const categoryCount: { [category: string]: number } = {};

    for (const book of allBooks) {
      categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
    }

    return {
      totalBooks: allBooks.length,
      availableBooks: allBooks.filter(b => b.status === "available").length,
      borrowedBooks: allBooks.filter(b => b.status === "borrowed").length,
      totalAuthors: this.getAllAuthors().length,
      booksByCategory: categoryCount
    };
  }

  // 詳細な図書の取得
  getDetailedBooks(): DetailedBook[] {
    return [...this.detailedBooks];
  }

  // 詳細な著者の取得
  getDetailedAuthors(): DetailedAuthor[] {
    return [...this.detailedAuthors];
  }

  // 貸出記録の取得
  getBorrowRecords(): DetailedBorrowRecord[] {
    return [...this.detailedBorrowRecords];
  }

  // 私有プロパティへのアクセス（継承のため）
  protected get nextBorrowId(): number {
    return this['nextBorrowId'] || 1;
  }

  protected set nextBorrowId(value: number) {
    this['nextBorrowId'] = value;
  }
}
```

### Phase 3: 実行例とテスト 🌟

#### ステップ3-1: システムのデモンストレーション

```typescript
// 使用例とテスト
function demonstrateBookCardSystem(): void {
  const library = new AdvancedBookCardManager();

  console.log("=== 図書カードシステムのデモ ===");

  // 著者の追加
  const author1 = library.addDetailedAuthor(
    "夏目漱石",
    false, // 故人のため非活動
    1867,
    "日本",
    "明治時代の小説家、評論家、英文学者",
    ["吾輩は猫である", "坊っちゃん", "こころ"],
    ["文学博士"]
  );

  const author2 = library.addDetailedAuthor(
    "村上春樹",
    true, // 現在も活動中
    1949,
    "日本",
    "現代日本文学の代表的作家",
    ["ノルウェイの森", "海辺のカフカ", "1Q84"],
    ["フランツ・カフカ賞", "エルサレム賞"]
  );

  console.log("追加された著者:", [author1, author2]);

  // 図書の追加
  const book1 = library.addDetailedBook(
    "吾輩は猫である",
    "夏目漱石",
    "fiction",
    1905,
    "日本語",
    ["古典", "文学", "明治時代"],
    "978-4-10-101001-1",
    "猫の視点から人間社会を描いた風刺小説",
    400,
    "新潮社"
  );

  const book2 = library.addDetailedBook(
    "ノルウェイの森",
    "村上春樹",
    "fiction",
    1987,
    "日本語",
    ["現代文学", "青春小説"],
    "978-4-06-274881-5",
    "1960年代後半の東京を舞台にした青春小説",
    296,
    "講談社"
  );

  const book3 = library.addDetailedBook(
    "相対性理論入門",
    "アインシュタイン",
    "science",
    1916,
    "日本語",
    ["物理学", "科学", "理論"],
    undefined,
    "相対性理論の基本概念を解説",
    250,
    "岩波書店"
  );

  console.log("追加された図書:", [book1, book2, book3]);

  // 図書の検索
  console.log("\n--- 図書検索 ---");
  console.log("タイトル検索（猫）:", library.findBooksByTitle("猫"));
  console.log("著者検索（村上）:", library.findBooksByAuthor("村上"));
  console.log("カテゴリ検索（fiction）:", library.findBooksByCategory("fiction"));

  // 図書の貸出
  console.log("\n--- 図書貸出 ---");
  const borrow1 = library.borrowBook(1, "田中太郎");
  const borrow2 = library.borrowBook(2, "佐藤花子");
  
  console.log("貸出記録1:", borrow1);
  console.log("貸出記録2:", borrow2);

  // 利用可能な図書の確認
  console.log("\n--- 利用可能な図書 ---");
  console.log("利用可能な図書:", library.getAvailableBooks());

  // 貸出の更新
  if (borrow1) {
    const renewed = library.renewBorrow(borrow1.id);
    console.log("貸出更新成功:", renewed);
  }

  // 統計情報
  console.log("\n--- 統計情報 ---");
  const stats = library.getLibraryStats();
  console.log("図書館統計:", stats);

  // 図書の返却
  console.log("\n--- 図書返却 ---");
  if (borrow1) {
    const returned = library.returnBook(borrow1.id);
    console.log("返却成功:", returned);
  }

  // 延滞チェック
  console.log("\n--- 延滞チェック ---");
  const overdueBooks = library.checkOverdueBooks();
  console.log("延滞図書:", overdueBooks.length, "冊");
}

// インターフェース継承のデモ
function demonstrateInterfaceInheritance(): void {
  console.log("\n=== インターフェース継承のデモ ===");

  // 基本的なBookとして扱う
  const basicBook: Book = {
    id: 1,
    title: "基本図書",
    author: "基本著者",
    category: "fiction",
    publishedYear: 2024,
    status: "available"
  };

  // DetailedBookとして拡張
  const detailedBook: DetailedBook = {
    ...basicBook,
    description: "詳細な説明",
    pageCount: 300,
    publisher: "出版社",
    language: "日本語",
    tags: ["タグ1", "タグ2"]
  };

  console.log("基本図書:", basicBook);
  console.log("詳細図書:", detailedBook);

  // 型の互換性確認
  const bookArray: Book[] = [basicBook, detailedBook];
  console.log("Book配列として扱える:", bookArray.length, "冊");

  // オプショナルプロパティの確認
  console.log("\n--- オプショナルプロパティ ---");
  const books: Book[] = [
    { id: 1, title: "本1", author: "著者1", category: "fiction", publishedYear: 2020, status: "available" },
    { id: 2, title: "本2", author: "著者2", category: "science", publishedYear: 2021, status: "borrowed", isbn: "123-456" }
  ];

  books.forEach(book => {
    const isbnInfo = book.isbn ? `ISBN: ${book.isbn}` : "ISBN未登録";
    console.log(`${book.title} - ${isbnInfo}`);
  });
}

// 型安全性のデモ
function demonstrateTypeSafety(): void {
  console.log("\n=== 型安全性のデモ ===");

  const library = new BookCardManager();

  // 正しい使用法
  const book = library.addBook("テスト本", "テスト著者", "fiction", 2024);
  console.log("正しい使用:", book);

  // TypeScriptが防ぐエラー（コメントアウト）
  // library.addBook("本", "著者", "invalid-category", 2024); // Error: 無効なカテゴリ
  // book.id = 999; // Error: readonlyプロパティは変更不可

  // 型ガードの例
  function processBookStatus(status: BookStatus): string {
    switch (status) {
      case "available":
        return "貸出可能";
      case "borrowed":
        return "貸出中";
      case "reserved":
        return "予約済み";
      default:
        // TypeScriptが全てのケースをチェック
        throw new Error("未知の状態です");
    }
  }

  console.log("状態処理の例:");
  console.log("available:", processBookStatus("available"));
  console.log("borrowed:", processBookStatus("borrowed"));
  console.log("reserved:", processBookStatus("reserved"));
}

// 実行
demonstrateBookCardSystem();
demonstrateInterfaceInheritance();
demonstrateTypeSafety();
```

---

## 🎓 学習のヒント

### 💡 実装時のポイント

1. **インターフェース設計**: 共通プロパティを基底インターフェースに定義
2. **継承の活用**: `extends`キーワードで既存インターフェースを拡張
3. **オプショナルプロパティ**: `?`を使用して任意のプロパティを定義
4. **読み取り専用プロパティ**: `readonly`でデータの不変性を保証
5. **型エイリアス**: 複雑な型に分かりやすい名前を付ける

### ⚠️ よくある間違い

- インターフェースのプロパティ名を間違える
- オプショナルプロパティの存在チェックを忘れる
- 読み取り専用プロパティに値を代入しようとする
- 継承時に基底インターフェースのプロパティを忘れる
- 型エイリアスとインターフェースの使い分けを間違える

### 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- 図書の評価システム（星評価）
- 予約システムの実装
- 図書の在庫管理機能
- 著者の詳細検索機能
- 貸出履歴の分析機能

---

**📌 重要**: この成果物はStep03の学習内容の総まとめです。インターフェースから継承、オプショナルプロパティまで、TypeScriptのオブジェクト型システムを実践的に活用しながら実装しましょう。

**🌟 次のステップ**: Step04では、ユニオン型と型ガードについて学習します！
