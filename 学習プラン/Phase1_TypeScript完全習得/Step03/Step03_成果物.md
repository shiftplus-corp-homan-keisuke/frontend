# Step03 統合プロジェクト：図書管理システム開発

---

## 🎯 プロジェクトの目的

**あなたが挑戦するプロジェクト**: Session1-3で学習した内容を統合した完全な図書管理システムの開発

**なぜ作るのか**: Step03で学習したインターフェース、クラス設計、抽象クラスを**段階的に統合**し、実用的なオブジェクト指向設計力を身につけるため

**学習目標**:
- Session1-3の学習内容を1つのシステムとして統合する
- インターフェース → クラス → 抽象クラスの段階的な設計を体験する
- TypeScriptの型安全性を活用した完全なシステムを構築する
- 実際に動作する図書管理システムを完成させる

---

## 📋 統合プロジェクト構成

### 最終成果物
```
📁 integrated-library-system/
├── src/
│   ├── interfaces/          # Phase 1: インターフェース設計
│   │   ├── book.interface.ts
│   │   ├── member.interface.ts
│   │   └── borrow-record.interface.ts
│   ├── entities/            # Phase 2: クラス実装
│   │   ├── book.entity.ts
│   │   ├── member.entity.ts
│   │   └── borrow-record.entity.ts
│   ├── services/            # Phase 3: 抽象クラスと統合
│   │   ├── base.service.ts
│   │   ├── book.service.ts
│   │   ├── member.service.ts
│   │   └── library.system.ts
│   └── main.ts              # システム統合とテスト
└── README.md                # プロジェクト説明書
```

---

## 🚀 Phase 1: インターフェース設計（Session1の学習内容を活用）

### ⏰ 推定時間: 60分

### 📋 実装内容

Session1で学習したインターフェース設計の知識を活用して、図書管理システムの基盤となるインターフェースを設計します。

#### 🔧 実装ファイル: `src/interfaces/book.interface.ts`

```typescript
// TODO: Session1で学習した内容を活用してインターフェースを実装してください

// 型エイリアスの定義
export type BookGenre = "fiction" | "non-fiction" | "science" | "history" | "biography";
export type BorrowStatus = "borrowed" | "returned" | "overdue";

// 書籍情報インターフェース
export interface Book {
  // TODO: 以下の要件を満たすプロパティを定義してください
  // - id: 文字列型（読み取り専用）
  // - title: 文字列型
  // - author: 文字列型
  // - isbn: 文字列型
  // - publishedYear: 数値型
  // - genre: BookGenre型
  // - isAvailable: 真偽値型
}

// 書籍検索条件インターフェース
export interface BookSearchCriteria {
  // TODO: 全てのプロパティをオプショナルにして実装してください
  // - title?, author?, genre?, isAvailable?
}
```

#### 🔧 実装ファイル: `src/interfaces/member.interface.ts`

```typescript
// TODO: Session1で学習した内容を活用してインターフェースを実装してください

export type MembershipType = "standard" | "premium" | "student";

// 図書館利用者インターフェース
export interface Member {
  // TODO: 以下の要件を満たすプロパティを定義してください
  // - id: 文字列型（読み取り専用）
  // - name: 文字列型
  // - email: 文字列型
  // - membershipType: MembershipType型
  // - joinDate: Date型
}

// 利用者検索条件インターフェース
export interface MemberSearchCriteria {
  // TODO: オプショナルプロパティとして実装してください
  // - name?, membershipType?
}
```

#### 🔧 実装ファイル: `src/interfaces/borrow-record.interface.ts`

```typescript
// TODO: Session1で学習した内容を活用してインターフェースを実装してください

import { BorrowStatus } from './book.interface';

// 貸出記録インターフェース
export interface BorrowRecord {
  // TODO: 以下の要件を満たすプロパティを定義してください
  // - id: 文字列型（読み取り専用）
  // - bookId: 文字列型（読み取り専用）
  // - memberId: 文字列型（読み取り専用）
  // - borrowDate: Date型
  // - dueDate: Date型
  // - returnDate: Date型（オプショナル）
  // - status: BorrowStatus型
}
```

### ✅ Phase 1 完了チェック
- [ ] 全てのインターフェースが正しく定義されている
- [ ] readonly修飾子が適切に使用されている
- [ ] 型エイリアスが適切に定義されている
- [ ] オプショナルプロパティ（?）が適切に使用されている
- [ ] TypeScriptコンパイルエラーがない

---

## 🚀 Phase 2: クラス実装（Session2の学習内容を活用）

### ⏰ 推定時間: 90分

### 📋 実装内容

Session2で学習したクラス設計の知識を活用して、Phase 1で定義したインターフェースを実装するクラスを作成します。

#### 🔧 実装ファイル: `src/entities/book.entity.ts`

```typescript
// TODO: Session2で学習した内容を活用してクラスを実装してください

import { Book, BookGenre } from '../interfaces/book.interface';

export class BookEntity implements Book {
  public readonly id: string;
  public title: string;
  // TODO: 他のプロパティを実装してください

  constructor(
    id: string,
    title: string,
    author: string,
    isbn: string,
    publishedYear: number,
    genre: BookGenre
  ) {
    // TODO: プロパティの初期化を実装してください
    // ヒント: this.isAvailable = true; // 初期状態は貸出可能
  }

  /**
   * 書籍情報の検証
   * @returns 検証結果
   */
  public validate(): boolean {
    // TODO: 以下の検証ルールを実装してください
    // - タイトルが空でない
    // - 著者名が空でない
    // - ISBNが13文字
    // - 出版年が1000年以降、現在年以下
    return false;
  }

  /**
   * 貸出状態の変更
   * @param isAvailable 貸出可能状態
   */
  public setBorrowStatus(isAvailable: boolean): void {
    // TODO: 実装してください
  }

  /**
   * 表示用文字列の取得
   * @returns 表示用文字列
   */
  public getDisplayInfo(): string {
    // TODO: "タイトル by 著者名 (出版年)" の形式で返却してください
    return "";
  }
}
```

#### 🔧 実装ファイル: `src/entities/member.entity.ts`

```typescript
// TODO: Session2で学習した内容を活用してクラスを実装してください

import { Member, MembershipType } from '../interfaces/member.interface';

export class MemberEntity implements Member {
  // TODO: プロパティを実装してください

  constructor(
    id: string,
    name: string,
    email: string,
    membershipType: MembershipType,
    joinDate?: Date
  ) {
    // TODO: プロパティの初期化を実装してください
    // ヒント: this.joinDate = joinDate || new Date();
  }

  /**
   * 利用者情報の検証
   * @returns 検証結果
   */
  public validate(): boolean {
    // TODO: 名前とメールアドレスの基本検証を実装してください
    return false;
  }

  /**
   * 貸出可能冊数の取得
   * @returns 貸出可能冊数
   */
  public getMaxBorrowLimit(): number {
    // TODO: 以下の仕様で実装してください
    // - student: 3冊
    // - standard: 5冊
    // - premium: 10冊
    return 0;
  }

  /**
   * 表示用文字列の取得
   * @returns 表示用文字列
   */
  public getDisplayInfo(): string {
    // TODO: "名前 (会員種別)" の形式で返却してください
    return "";
  }
}
```

#### 🔧 実装ファイル: `src/entities/borrow-record.entity.ts`

```typescript
// TODO: Session2で学習した内容を活用してクラスを実装してください

import { BorrowRecord, BorrowStatus } from '../interfaces/borrow-record.interface';

export class BorrowRecordEntity implements BorrowRecord {
  // TODO: プロパティを実装してください

  constructor(
    id: string,
    bookId: string,
    memberId: string,
    borrowDate?: Date
  ) {
    // TODO: プロパティの初期化を実装してください
    // ヒント: 
    // - borrowDate = borrowDate || new Date()
    // - dueDate = 14日後の日付
    // - status = "borrowed"
  }

  /**
   * 返却処理
   */
  public returnBook(): void {
    // TODO: 返却日の設定と状態の更新を実装してください
  }

  /**
   * 延滞チェック
   * @returns 延滞状態
   */
  public isOverdue(): boolean {
    // TODO: 現在日時と返却期限を比較して実装してください
    return false;
  }

  /**
   * 延滞状態の更新
   */
  public updateOverdueStatus(): void {
    // TODO: 延滞チェックの結果に基づいて状態を更新してください
  }
}
```

### ✅ Phase 2 完了チェック
- [ ] 全てのクラスがインターフェースを正しく実装している
- [ ] アクセス修飾子（public, private, readonly）が適切に使用されている
- [ ] コンストラクタが適切に実装されている
- [ ] 各クラスに必要なメソッドが実装されている
- [ ] TypeScriptコンパイルエラーがない

---

## 🚀 Phase 3: 抽象クラスと統合システム（Session3の学習内容を活用）

### ⏰ 推定時間: 120分

### 📋 実装内容

Session3で学習した抽象クラスの知識を活用して、Phase 1-2の成果物を統合した完全な図書管理システムを構築します。

#### 🔧 実装ファイル: `src/services/base.service.ts`

```typescript
// TODO: Session3で学習した内容を活用して抽象クラスを実装してください

/**
 * 基底サービス抽象クラス
 * @template T エンティティの型
 */
export abstract class BaseService<T> {
  protected items: Map<string, T> = new Map();

  // 抽象メソッド（サブクラスで実装必須）
  abstract add(item: T): boolean;
  abstract update(id: string, updates: Partial<T>): boolean;
  abstract delete(id: string): boolean;

  /**
   * IDによる検索
   * @param id 検索ID
   * @returns 見つかったアイテム
   */
  public findById(id: string): T | undefined {
    // TODO: 実装してください
    return undefined;
  }

  /**
   * 全アイテムの取得
   * @returns 全アイテム
   */
  public findAll(): T[] {
    // TODO: 実装してください
    return [];
  }

  /**
   * アイテム数の取得
   * @returns アイテム数
   */
  public count(): number {
    // TODO: 実装してください
    return 0;
  }

  /**
   * ID生成
   * @returns 生成されたID
   */
  protected generateId(): string {
    // TODO: ユニークなIDを生成してください（例：タイムスタンプ + ランダム文字列）
    return "";
  }
}
```

#### 🔧 実装ファイル: `src/services/book.service.ts`

```typescript
// TODO: Session3で学習した内容を活用してサービスクラスを実装してください

import { BaseService } from './base.service';
import { BookEntity } from '../entities/book.entity';
import { BookSearchCriteria } from '../interfaces/book.interface';

export class BookService extends BaseService<BookEntity> {
  /**
   * 書籍の追加
   * @param book 書籍エンティティ
   * @returns 追加成功可否
   */
  public add(book: BookEntity): boolean {
    // TODO: バリデーション後、Mapに保存してください
    return false;
  }

  /**
   * 書籍の更新
   * @param id 書籍ID
   * @param updates 更新内容
   * @returns 更新成功可否
   */
  public update(id: string, updates: Partial<BookEntity>): boolean {
    // TODO: 実装してください
    return false;
  }

  /**
   * 書籍の削除
   * @param id 書籍ID
   * @returns 削除成功可否
   */
  public delete(id: string): boolean {
    // TODO: 実装してください
    return false;
  }

  /**
   * 書籍検索
   * @param criteria 検索条件
   * @returns 検索結果
   */
  public searchBooks(criteria: BookSearchCriteria): BookEntity[] {
    // TODO: 検索条件に基づいてフィルタリングしてください
    return [];
  }

  /**
   * 貸出可能書籍の取得
   * @returns 貸出可能書籍一覧
   */
  public getAvailableBooks(): BookEntity[] {
    // TODO: isAvailable = true の書籍を返却してください
    return [];
  }
}
```

#### 🔧 実装ファイル: `src/services/member.service.ts`

```typescript
// TODO: Session3で学習した内容を活用してサービスクラスを実装してください

import { BaseService } from './base.service';
import { MemberEntity } from '../entities/member.entity';
import { MemberSearchCriteria } from '../interfaces/member.interface';

export class MemberService extends BaseService<MemberEntity> {
  // TODO: BookServiceと同様の構造で実装してください
  // - add, update, delete メソッド
  // - searchMembers メソッド
}
```

#### 🔧 実装ファイル: `src/services/library.system.ts`

```typescript
// TODO: Session3で学習した内容を活用してシステム統合クラスを実装してください

import { BookService } from './book.service';
import { MemberService } from './member.service';
import { BookEntity } from '../entities/book.entity';
import { MemberEntity } from '../entities/member.entity';
import { BorrowRecordEntity } from '../entities/borrow-record.entity';

/**
 * システム統計情報
 */
export interface SystemStats {
  totalBooks: number;
  availableBooks: number;
  totalMembers: number;
  activeBorrows: number;
}

/**
 * 図書管理システム統合クラス
 */
export class LibrarySystem {
  private bookService: BookService;
  private memberService: MemberService;
  private borrowRecords: Map<string, BorrowRecordEntity> = new Map();

  constructor() {
    this.bookService = new BookService();
    this.memberService = new MemberService();
  }

  /**
   * 書籍の追加
   * @param title タイトル
   * @param author 著者
   * @param isbn ISBN
   * @param publishedYear 出版年
   * @param genre ジャンル
   * @returns 書籍ID
   */
  public addBook(title: string, author: string, isbn: string, publishedYear: number, genre: string): string {
    // TODO: BookEntityを作成してBookServiceに追加してください
    return "";
  }

  /**
   * 利用者の追加
   * @param name 名前
   * @param email メールアドレス
   * @param membershipType 会員種別
   * @returns 利用者ID
   */
  public addMember(name: string, email: string, membershipType: string): string {
    // TODO: MemberEntityを作成してMemberServiceに追加してください
    return "";
  }

  /**
   * 書籍の貸出
   * @param bookId 書籍ID
   * @param memberId 利用者ID
   * @returns 貸出記録ID
   */
  public borrowBook(bookId: string, memberId: string): string | null {
    // TODO: 以下の処理フローを実装してください
    // 1. 書籍と利用者の存在確認
    // 2. 書籍の貸出可能性チェック
    // 3. 貸出記録の作成
    // 4. 書籍の貸出状態更新
    // 5. 貸出記録IDを返却
    return null;
  }

  /**
   * 書籍の返却
   * @param borrowRecordId 貸出記録ID
   * @returns 返却成功可否
   */
  public returnBook(borrowRecordId: string): boolean {
    // TODO: 返却処理を実装してください
    return false;
  }

  /**
   * システム統計の取得
   * @returns システム統計
   */
  public getSystemStats(): SystemStats {
    // TODO: 以下の統計情報を返却してください
    // - totalBooks: 総書籍数
    // - availableBooks: 貸出可能書籍数
    // - totalMembers: 総利用者数
    // - activeBorrows: アクティブな貸出数
    return {
      totalBooks: 0,
      availableBooks: 0,
      totalMembers: 0,
      activeBorrows: 0
    };
  }

  // TODO: 検索メソッドも実装してください
  // - searchBooks(criteria: BookSearchCriteria): BookEntity[]
  // - searchMembers(criteria: MemberSearchCriteria): MemberEntity[]
}
```

### ✅ Phase 3 完了チェック
- [ ] 抽象クラス`BaseService`が適切に実装されている
- [ ] 具象クラスが抽象クラスを正しく継承している
- [ ] `LibrarySystem`クラスが全ての機能を統合している
- [ ] 貸出・返却機能が正常に動作する
- [ ] 検索機能が正常に動作する
- [ ] TypeScriptコンパイルエラーがない

---

## 🚀 Phase 4: システム統合とテスト

### ⏰ 推定時間: 60分

### 📋 実装内容

#### 🔧 実装ファイル: `src/main.ts`

```typescript
// TODO: 完成したシステムの動作確認を実装してください

import { LibrarySystem } from './services/library.system';

/**
 * 図書管理システムのデモンストレーション
 */
function demonstrateLibrarySystem(): void {
  console.log("=== 図書管理システム デモンストレーション ===\n");

  const library = new LibrarySystem();

  // 1. 書籍の追加
  console.log("📚 書籍を追加しています...");
  const book1Id = library.addBook("TypeScript入門", "山田太郎", "9784123456789", 2023, "science");
  const book2Id = library.addBook("JavaScript完全ガイド", "田中花子", "9784987654321", 2022, "science");
  const book3Id = library.addBook("推理小説の世界", "佐藤次郎", "9784111222333", 2021, "fiction");
  
  console.log(`書籍1 ID: ${book1Id}`);
  console.log(`書籍2 ID: ${book2Id}`);
  console.log(`書籍3 ID: ${book3Id}\n`);

  // 2. 利用者の追加
  console.log("👥 利用者を追加しています...");
  const member1Id = library.addMember("田中一郎", "tanaka@example.com", "standard");
  const member2Id = library.addMember("山田花子", "yamada@example.com", "premium");
  const member3Id = library.addMember("佐藤学生", "sato@student.example.com", "student");
  
  console.log(`利用者1 ID: ${member1Id}`);
  console.log(`利用者2 ID: ${member2Id}`);
  console.log(`利用者3 ID: ${member3Id}\n`);

  // 3. システム統計の表示
  console.log("📊 初期システム統計:");
  console.log(library.getSystemStats());
  console.log();

  // 4. 書籍の貸出
  console.log("📖 書籍を貸出しています...");
  const borrow1Id = library.borrowBook(book1Id, member1Id);
  const borrow2Id = library.borrowBook(book2Id, member2Id);
  
  console.log(`貸出記録1 ID: ${borrow1Id}`);
  console.log(`貸出記録2 ID: ${borrow2Id}\n`);

  // 5. 貸出後のシステム統計
  console.log("📊 貸出後のシステム統計:");
  console.log(library.getSystemStats());
  console.log();

  // 6. 書籍の返却
  console.log("📚 書籍を返却しています...");
  if (borrow1Id) {
    const returnResult = library.returnBook(borrow1Id);
    console.log(`返却結果: ${returnResult ? '成功' : '失敗'}`);
  }

  // 7. 最終システム統計
  console.log("\n📊 最終システム統計:");
  console.log(library.getSystemStats());

  console.log("\n=== デモンストレーション完了 ===");
}

// TODO: 個別機能のテスト関数も実装してください
function testIndividualComponents(): void {
  console.log("\n=== 個別コンポーネントテスト ===\n");

  // BookEntity のテスト
  // MemberEntity のテスト
  // BorrowRecordEntity のテスト
  // 各サービスクラスのテスト
}

// メイン実行
if (require.main === module) {
  demonstrateLibrarySystem();
  testIndividualComponents();
}
```

#### 🔧 実装ファイル: `README.md`

```markdown
# 統合図書管理システム

## 概要
Session1-3で学習したTypeScriptの概念を統合した完全な図書管理システムです。

## 学習内容の統合
- **Phase 1**: Session1で学習したインターフェース設計
- **Phase 2**: Session2で学習したクラス実装
- **Phase 3**: Session3で学習した抽象クラスと統合

## 機能
- 書籍管理（追加・更新・削除・検索）
- 利用者管理（追加・更新・削除・検索）
- 貸出・返却管理
- システム統計表示

## 実行方法
```bash
# TypeScriptのコンパイル
tsc src/main.ts --outDir dist --target ES2020 --module commonjs

# 実行
node dist/main.js
```

## 学習のポイント
1. インターフェースによる型安全な設計
2. クラスによるオブジェクト指向実装
3. 抽象クラスによる共通機能の抽象化
4. 統合システムによる実践的な設計パターン
```

### ✅ Phase 4 完了チェック
- [ ] システム全体が正常に動作する
- [ ] デモンストレーションが完全に実行される
- [ ] 全ての機能が統合されている
- [ ] README.mdが適切に作成されている

---

## 📊 総合評価基準

### 🎯 各Phaseの評価ポイント

**Phase 1（インターフェース設計）**: 30点
- Session1の学習内容の活用（15点）
- インターフェースの適切な定義（15点）

**Phase 2（クラス実装）**: 40点
- Session2の学習内容の活用（20点）
- クラスの正しい実装（20点）

**Phase 3（抽象クラスと統合）**: 50点
- Session3の学習内容の活用（25点）
- システム統合の完成度（25点）

**Phase 4（システム統合とテスト）**: 30点
- 統合システムの動作（20点）
- テストとドキュメント（10点）

**総合評価**: 150点満点

---

## 🚀 学習の流れ

### 💡 段階的統合の効果
1. **Phase 1**: Session1の知識でインターフェース設計の基盤を構築
2. **Phase 2**: Session2の知識でクラス実装により具体的な機能を実現
3. **Phase 3**: Session3の知識で抽象クラスによる高度な設計パターンを適用
4. **Phase 4**: 全てを統合した完全なシステムを完成

### 🔄 学習内容の連続性
- Phase 1の成果物がPhase 2の基盤となる
- Phase 2の成果物がPhase 3で統合される
- Phase 3の成果物がPhase 4で完全なシステムとなる
- 各Phaseで前のPhaseの学習成果を活用する

### ⚠️ 重要なポイント
- 各Phaseは前のPhaseの成果物を必ず活用する
- Session1-3の学習内容を段階的に統合していく
- 最終的に1つの完成したシステムを目指す
- 実際に動作するシステムとして完成させる

---

## 🎯 発展課題（任意）

基本統合プロジェクト完了後、さらなる学習を希望する場合：

1. **エラーハンドリングの強化**: カスタム例外クラスの実装
2. **データ永続化**: JSON/CSV形式でのデータ保存・読み込み
3. **ログ機能**: 操作履歴の記録と表示
4. **バリデーション強化**: より詳細な入力検証
5. **レポート機能**: 貸出統計レポートの生成

---

## 📝 完成時の提出物

### 必須ファイル
- `src/interfaces/` 配下の全インターフェースファイル
- `src/entities/` 配下の全エンティティファイル
- `src/services/` 配下の全サービスファイル
- `src/main.ts` システム統合とテストファイル
- `README.md` プロジェクト説明書

### 動作確認
- TypeScriptコンパイルエラーがないこと
- `main.ts` が正常に実行されること
- 全ての機能が期待通りに動作すること

この統合プロジェクトを通じて、Session1-3で学習したTypeScriptの概念を1つのシステムとして統合し、実用的なオブジェクト指向設計力を身につけてください。
