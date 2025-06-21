# Step03 成果物：ミニ図書管理システム

---

## 🎯 プロジェクトの目的

**あなたが挑戦する課題**: Session1-3 で学習した内容を段階的に実践する軽量プロジェクト

**なぜ作るのか**: Step03 で学習したインターフェース、クラス設計、抽象クラスの理解を**実践的に確認**するため

**学習目標**:

- [ ] Session1 のインターフェース設計を実践する
- [ ] Session2 のクラス実装を実践する
- [ ] Session3 の抽象クラスを実践する
- [ ] 各セッションの学習内容を段階的に統合する

**⏰ 推定完了時間**: 60 分

---

## 📋 作成するシステムの要件

### 🎯 ミニ図書管理システム概要

**何を作るか**:
シンプルな書籍管理システムを段階的に構築します。

**主な機能**:
- 📚 **書籍情報の管理**: タイトル、著者、ジャンル、概要などの基本情報
- 🔍 **書籍検索**: タイトル、著者、ジャンル、貸出状況での絞り込み
- 📤 **貸出管理**: 書籍の貸出・返却状態の管理
- 📊 **システム状況確認**: 登録書籍数、利用可能書籍数の表示

**システムでできること**:
1. **書籍の登録**: 新しい書籍をシステムに追加
2. **書籍一覧表示**: 登録されている全書籍の情報を確認
3. **書籍検索**: 条件に基づいて書籍を絞り込み検索
4. **貸出処理**: 利用可能な書籍を貸出状態に変更
5. **返却処理**: 貸出中の書籍を利用可能状態に戻す
6. **状況確認**: システム全体の統計情報を表示

**利用場面**:
- 小規模な図書室や個人の蔵書管理
- TypeScriptの学習用実践プロジェクト
- オブジェクト指向設計の理解確認

**技術的特徴**:
- **型安全性**: TypeScriptの強力な型システムを活用
- **段階的構築**: インターフェース → クラス → 抽象クラスの順で実装
- **実用性**: 実際に動作する完成したシステム

---

## 📋 プロジェクト構成

### 作成ファイル

```
📁 mini-library-system/
├── book.ts         # 書籍管理（全セッション統合）
└── main.ts         # 動作確認用
```

---

## 🚀 実践課題：段階的実装

### Phase 1: インターフェース実践（Session1 の復習）⏰15 分

**ファイル**: `book.ts`

```typescript
// TODO: Session1で学習したインターフェース設計を実践してください

// 1. 型エイリアスの定義
export type BookGenre = "fiction" | "science" | "history";

// 2. 書籍インターフェースの定義
export interface Book {
  // TODO: 以下のプロパティを定義してください
  // - readonly id: number
  // - title: string
  // - author: string
  // - genre: BookGenre
  // - isAvailable: boolean
  // - description?: string (オプショナル)
}

// 3. 検索条件インターフェース
export interface BookSearchCriteria {
  // TODO: 全てオプショナルプロパティで定義してください
  // - title?, author?, genre?, isAvailable?
}
```

---

### Phase 2: クラス実践（Session2 の復習）⏰20 分

**ファイル**: `book.ts`（続き）

```typescript
// TODO: Session2で学習したクラス設計を実践してください

export class BookEntity implements Book {
  // TODO: プロパティを定義してください（アクセス修飾子に注意）
  public readonly id: number;
  // 他のプロパティも実装...

  constructor(
    id: number,
    title: string,
    author: string,
    genre: BookGenre,
    description?: string
  ) {
    // TODO: プロパティの初期化
    // ヒント: this.isAvailable = true; (初期状態は貸出可能)
  }

  // TODO: 以下のメソッドを実装してください

  /**
   * 貸出状態の変更
   */
  public setBorrowStatus(isAvailable: boolean): void {
    // 実装してください
  }

  /**
   * 書籍情報の表示用文字列
   */
  public getInfo(): string {
    // "タイトル by 著者名 (ジャンル)" の形式で返却
    return "";
  }

  /**
   * 簡単なバリデーション
   */
  public validate(): boolean {
    // タイトルと著者名が空でないことをチェック
    return false;
  }
}
```

---

### Phase 3: 抽象クラス実践（Session3 の復習）⏰20 分

**ファイル**: `book.ts`（続き）

```typescript
// TODO: Session3で学習した抽象クラス設計を実践してください

/**
 * 管理システムの基底抽象クラス
 */
export abstract class BaseManager<T> {
  protected items: T[] = [];

  // 共通メソッド
  public getAll(): T[] {
    return [...this.items];
  }

  public count(): number {
    return this.items.length;
  }

  // 抽象メソッド（継承先で実装必須）
  abstract add(item: T): boolean;
  abstract findById(id: number): T | undefined;
  abstract remove(id: number): boolean;
}

/**
 * 書籍管理クラス
 */
export class BookManager extends BaseManager<BookEntity> {
  // TODO: 抽象メソッドを実装してください

  public add(book: BookEntity): boolean {
    // バリデーションして配列に追加
    return false;
  }

  public findById(id: number): BookEntity | undefined {
    // IDで書籍を検索
    return undefined;
  }

  public remove(id: number): boolean {
    // IDで書籍を削除
    return false;
  }

  // TODO: 書籍管理独自のメソッドを実装してください

  /**
   * 貸出可能な書籍を取得
   */
  public getAvailableBooks(): BookEntity[] {
    // isAvailable = true の書籍のみ返却
    return [];
  }

  /**
   * 書籍検索
   */
  public search(criteria: BookSearchCriteria): BookEntity[] {
    // 検索条件に基づいてフィルタリング
    return [];
  }

  /**
   * 書籍の貸出
   */
  public borrowBook(id: number): boolean {
    // 書籍を見つけて貸出状態に変更
    return false;
  }

  /**
   * 書籍の返却
   */
  public returnBook(id: number): boolean {
    // 書籍を見つけて返却状態に変更
    return false;
  }
}
```

### Phase 4: 動作確認テスト ⏰5 分

**ファイル**: `main.ts`

```typescript
// TODO: 作成したシステムの動作確認を行ってください

import { BookEntity, BookManager, BookGenre } from "./book";

function testMiniLibrarySystem(): void {
  console.log("=== ミニ図書管理システム テスト ===\n");

  // BookManagerのインスタンスを作成
  const bookManager = new BookManager();

  // 1. 書籍の作成と追加
  console.log("� 書籍を追加しています...");
  const book1 = new BookEntity(
    1,
    "TypeScript入門",
    "山田太郎",
    "science",
    "初心者向けの本"
  );
  const book2 = new BookEntity(2, "推理小説傑作選", "田中花子", "fiction");
  const book3 = new BookEntity(
    3,
    "世界史概論",
    "佐藤次郎",
    "history",
    "詳細な歴史書"
  );

  bookManager.add(book1);
  bookManager.add(book2);
  bookManager.add(book3);

  console.log(`登録書籍数: ${bookManager.count()}`);
  console.log(`利用可能書籍数: ${bookManager.getAvailableBooks().length}\n`);

  // 2. 書籍情報の表示
  console.log("📖 全書籍一覧:");
  bookManager.getAll().forEach((book) => {
    console.log(`- ${book.getInfo()}`);
  });
  console.log();

  // 3. 書籍の貸出
  console.log("📤 書籍を貸出しています...");
  const borrowResult = bookManager.borrowBook(1);
  console.log(`貸出結果: ${borrowResult ? "成功" : "失敗"}`);
  console.log(`利用可能書籍数: ${bookManager.getAvailableBooks().length}\n`);

  // 4. 書籍の検索
  console.log("🔍 書籍を検索しています...");
  const searchResults = bookManager.search({ genre: "science" });
  console.log(`検索結果（ジャンル: science）:`);
  searchResults.forEach((book) => {
    console.log(`- ${book.getInfo()}`);
  });
  console.log();

  // 5. 書籍の返却
  console.log("📥 書籍を返却しています...");
  const returnResult = bookManager.returnBook(1);
  console.log(`返却結果: ${returnResult ? "成功" : "失敗"}`);
  console.log(`利用可能書籍数: ${bookManager.getAvailableBooks().length}\n`);

  console.log("=== テスト完了 ===");
}

// テスト実行
testMiniLibrarySystem();
```

---

## ✅ 完了チェックリスト

各フェーズの学習内容が実装できているかチェックしてください：

### Session1（インターフェース）の確認

- [ ] `BookGenre` 型エイリアスが定義されている
- [ ] `Book` インターフェースが適切に定義されている
- [ ] `readonly` プロパティが使用されている
- [ ] オプショナルプロパティ（`?`）が使用されている
- [ ] `BookSearchCriteria` インターフェースが定義されている

### Session2（クラス）の確認

- [ ] `BookEntity` クラスが `Book` インターフェースを実装している
- [ ] アクセス修飾子（`public`, `readonly`）が適切に使用されている
- [ ] コンストラクタが適切に実装されている
- [ ] メソッド（`setBorrowStatus`, `getInfo`, `validate`）が実装されている

### Session3（抽象クラス）の確認

- [ ] `BaseManager` 抽象クラスが定義されている
- [ ] 抽象メソッドが定義されている
- [ ] `BookManager` が `BaseManager` を継承している
- [ ] 全ての抽象メソッドが実装されている
- [ ] 書籍管理特有のメソッドが実装されている

### 動作確認

- [ ] TypeScript コンパイルエラーがない
- [ ] `main.ts` が正常に実行される
- [ ] 書籍の追加・貸出・返却・検索が動作する

---

## 📝 解答例のヒント

詰まった場合は以下のヒントを参考にしてください：

**インターフェース部分**：

```typescript
export interface Book {
  readonly id: number;
  title: string;
  author: string;
  genre: BookGenre;
  isAvailable: boolean;
  description?: string;
}
```

**クラス部分**：

```typescript
export class BookEntity implements Book {
  public readonly id: number;
  public title: string;
  // ... 他のプロパティ

  constructor(
    id: number,
    title: string,
    author: string,
    genre: BookGenre,
    description?: string
  ) {
    this.id = id;
    this.title = title;
    // ... 他の初期化
    this.isAvailable = true;
  }
}
```

**抽象クラス部分**：

```typescript
export abstract class BaseManager<T> {
  protected items: T[] = [];

  abstract add(item: T): boolean;
  abstract findById(id: number): T | undefined;
  abstract remove(id: number): boolean;

  public getAll(): T[] {
    return [...this.items];
  }
}
```
