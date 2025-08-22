# Session1: 単一責任の原則（SRP）マスター（45 分）

> 💡 **対象**: Session0 完了者（SOLID 原則の全体像理解済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 45 分（実習中心）

## 📅 セッション概要

**学習目標**:

- [ ] 単一責任の原則の深い理解と実践的適用
- [ ] 責任の分離方法とリファクタリング技法の習得
- [ ] TypeScript における SRP のベストプラクティス
- [ ] 複雑なクラスの責任分離実践

**前提知識**:

- Session0 の内容（SOLID 原則の全体像）
- TypeScript のクラス、インターフェース、継承の理解
- オブジェクト指向プログラミングの基本概念

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                    | 講師の役割             | 学習者の活動   | 成果物             |
| ------------ | ----------------------- | ---------------------- | -------------- | ------------------ |
| **0-5 分**   | SRP 基本概念の復習      | 導入・概要説明         | 聞く・質問     | 基礎理解確認       |
| **5-20 分**  | 責任の識別と分離実習    | 実演・個別指導         | ハンズオン     | リファクタリング例 |
| **20-35 分** | 複雑な例題での SRP 実践 | コードレビュー         | 問題解決・実装 | 実践的 SRP 適用    |
| **35-40 分** | 挑戦的練習問題          | 巡回サポート           | 個人作業       | 応用力確認         |
| **40-45 分** | 振り返りと次回予告      | まとめ・フィードバック | 質問・確認     | 学習成果確認       |

---

## 📚 学習内容

### Section 1: 単一責任の原則の深い理解

> 📚 **関連資料**: [専門用語集 - SRP 詳細](./Step08_補足_専門用語集.md#SRP詳細) | [実践コード例 - SRP リファクタリング](./Step08_補足_実践コード例.md#SRPリファクタリング)

#### 🔍 「責任」とは何か？

**💡 身近な例で深く理解しよう**

コンビニの店員の仕事を考えてみましょう：

👤 **悪い例：スーパー店員さん（すべてを 1 人で）**

```
- レジ打ち ⚡
- 商品陳列 📦
- 掃除 🧹
- 店舗の経営判断 📊
- システム開発 💻
- 会計処理 💰
- マーケティング戦略 📈
```

👥 **良い例：役割分担されたチーム**

```
- レジ担当：支払い処理のみ ⚡
- 商品担当：陳列・在庫管理のみ 📦
- 清掃担当：店内清掃のみ 🧹
- マネージャー：経営判断のみ 📊
- IT部門：システム開発のみ 💻
```

**🔍 プログラムでの「責任」の定義**

ロバート・C・マーティンの定義：

> **「クラスが変更される理由は 1 つだけであるべき」**

```typescript
// ❌ 複数の変更理由を持つクラス
class Employee {
  name: string;
  salary: number;

  // 理由1: 給与計算ロジックの変更
  calculatePay(): number {
    return this.salary * 1.1; // ボーナス計算
  }

  // 理由2: データベースアクセス方法の変更
  save(): void {
    database.save(this);
  }

  // 理由3: レポート形式の変更
  generateReport(): string {
    return `${this.name}: ${this.salary}円`;
  }
}

// 😱 問題：データベースの変更で給与計算に影響が出る可能性
// 😱 問題：レポート形式の変更で他の機能が壊れる可能性
```

#### 1. 責任の識別方法

**🎓 学習のポイント**: クラスが持つ責任を正確に識別する技法を身につけましょう

**📊 責任識別の 5 つの質問**

```typescript
// 例題クラス
class UserAccount {
  username: string;
  email: string;
  password: string;

  validateEmail(): boolean {
    /* メール形式チェック */
  }
  hashPassword(): string {
    /* パスワードハッシュ化 */
  }
  saveToDatabase(): void {
    /* DB保存 */
  }
  sendWelcomeEmail(): void {
    /* ウェルカムメール送信 */
  }
  generateReport(): string {
    /* ユーザーレポート生成 */
  }
}

// 質問1: このクラスを説明するのに「と」を使いますか？
// → "ユーザーアカウント管理 と バリデーション と DB操作 と メール送信 と レポート生成"
// ✅ 「と」が多い = 複数責任の証拠

// 質問2: このクラスが変更される理由はいくつありますか？
// → 1. バリデーションルール変更
// → 2. DB構造変更
// → 3. メール送信方法変更
// → 4. レポート形式変更
// ✅ 4つの理由 = SRP違反

// 質問3: 他の開発者がこのクラスを見て、すぐに目的を理解できますか？
// → "このクラスは何をするクラス？" → 説明が長くなる
// ✅ 説明が長い = 責任が多すぎる証拠

// 質問4: このクラスをテストするのに何個のテストケースが必要ですか？
// → バリデーションテスト + DBテスト + メールテスト + レポートテスト
// ✅ テストが複雑 = 責任が多すぎる証拠

// 質問5: このクラスの変更で他の機能が壊れる心配がありますか？
// → DBの変更でメール機能が影響を受ける可能性
// ✅ 影響範囲が広い = 責任が絡み合っている証拠
```

**🔍 実践的責任識別テクニック**

```typescript
// テクニック1: メソッドをグループ化してみる
class OrderService {
  // グループA: 注文情報の管理
  setCustomerInfo(customer: Customer): void {}
  addProduct(product: Product): void {}
  removeProduct(productId: string): void {}

  // グループB: 在庫チェック
  checkInventory(productId: string): boolean {}
  reserveStock(productId: string, quantity: number): void {}

  // グループC: 価格計算
  calculateSubtotal(): number {}
  calculateTax(): number {}
  calculateShipping(): number {}

  // グループD: 支払い処理
  processPayment(amount: number): void {}
  sendReceipt(): void {}

  // グループE: 通知
  sendOrderConfirmation(): void {}
  notifyWarehouse(): void {}
}

// ✅ 5つのグループ = 5つの責任 = 分離が必要
```

#### 2. 段階的リファクタリング手法

**🎓 学習のポイント**: 複雑なクラスを段階的に安全にリファクタリングする方法を学びましょう

**STEP1: 現状分析**

```typescript
// 👀 分析対象：ユーザー管理システム
class UserManager {
  // データ
  users: User[] = [];

  // 機能群1: ユーザーデータ操作
  addUser(user: User): void {
    this.users.push(user);
  }

  removeUser(userId: string): void {
    this.users = this.users.filter((u) => u.id !== userId);
  }

  findUser(userId: string): User | null {
    return this.users.find((u) => u.id === userId) || null;
  }

  // 機能群2: バリデーション
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= 8;
  }

  // 機能群3: データ永続化
  saveUsers(): void {
    localStorage.setItem("users", JSON.stringify(this.users));
  }

  loadUsers(): void {
    const data = localStorage.getItem("users");
    this.users = data ? JSON.parse(data) : [];
  }

  // 機能群4: 通知
  sendWelcomeEmail(user: User): void {
    console.log(`Welcome email sent to ${user.email}`);
  }

  sendPasswordResetEmail(email: string): void {
    console.log(`Password reset email sent to ${email}`);
  }

  // 機能群5: レポート
  getUserCount(): number {
    return this.users.length;
  }

  generateUserReport(): string {
    return `Total users: ${this.users.length}`;
  }
}
```

**STEP2: 責任の分離計画**

```typescript
// 📋 分離計画
/*
1. UserRepository: データの永続化とCRUD操作
2. UserValidator: バリデーション処理
3. EmailService: メール送信処理
4. UserReportService: レポート生成
5. UserService: 全体の調整（高レベル処理）
*/
```

**STEP3: 段階的実装**

```typescript
// Phase 1: バリデーションの分離
class UserValidator {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= 8;
  }

  validateUser(user: User): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateEmail(user.email)) {
      errors.push("Invalid email format");
    }

    if (!this.validatePassword(user.password)) {
      errors.push("Password must be at least 8 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Phase 2: データアクセスの分離
interface UserRepository {
  save(users: User[]): void;
  load(): User[];
  addUser(user: User): void;
  removeUser(userId: string): void;
  findUser(userId: string): User | null;
}

class LocalStorageUserRepository implements UserRepository {
  private users: User[] = [];

  save(users: User[]): void {
    localStorage.setItem("users", JSON.stringify(users));
  }

  load(): User[] {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  }

  addUser(user: User): void {
    this.users = this.load();
    this.users.push(user);
    this.save(this.users);
  }

  removeUser(userId: string): void {
    this.users = this.load();
    this.users = this.users.filter((u) => u.id !== userId);
    this.save(this.users);
  }

  findUser(userId: string): User | null {
    this.users = this.load();
    return this.users.find((u) => u.id === userId) || null;
  }
}

// Phase 3: メール送信の分離
interface EmailService {
  sendWelcomeEmail(user: User): void;
  sendPasswordResetEmail(email: string): void;
}

class ConsoleEmailService implements EmailService {
  sendWelcomeEmail(user: User): void {
    console.log(`Welcome email sent to ${user.email}`);
  }

  sendPasswordResetEmail(email: string): void {
    console.log(`Password reset email sent to ${email}`);
  }
}

// Phase 4: レポート機能の分離
class UserReportService {
  constructor(private userRepository: UserRepository) {}

  getUserCount(): number {
    return this.userRepository.load().length;
  }

  generateUserReport(): string {
    const users = this.userRepository.load();
    return `Total users: ${users.length}`;
  }

  generateDetailedReport(): string {
    const users = this.userRepository.load();
    return users.map((user) => `${user.name} (${user.email})`).join("\n");
  }
}

// Phase 5: 統合サービス（単一責任：ユーザー管理の調整）
class UserService {
  constructor(
    private userRepository: UserRepository,
    private userValidator: UserValidator,
    private emailService: EmailService,
    private reportService: UserReportService
  ) {}

  async createUser(
    userData: Omit<User, "id">
  ): Promise<{ success: boolean; message: string }> {
    // 1. バリデーション
    const user = { ...userData, id: crypto.randomUUID() } as User;
    const validation = this.userValidator.validateUser(user);

    if (!validation.isValid) {
      return { success: false, message: validation.errors.join(", ") };
    }

    // 2. 保存
    this.userRepository.addUser(user);

    // 3. ウェルカムメール
    this.emailService.sendWelcomeEmail(user);

    return { success: true, message: "User created successfully" };
  }

  deleteUser(userId: string): boolean {
    const user = this.userRepository.findUser(userId);
    if (user) {
      this.userRepository.removeUser(userId);
      return true;
    }
    return false;
  }
}
```

### Section 2: 高度な SRP パターン

#### 🔍 コマンドパターンと SRP

**🎓 学習のポイント**: コマンドパターンを使用してアクションごとに責任を分離する方法を学びましょう

```typescript
// ❌ SRP違反：1つのクラスに複数の操作
class FileManager {
  createFile(name: string): void {
    /* ファイル作成 */
  }
  deleteFile(name: string): void {
    /* ファイル削除 */
  }
  copyFile(from: string, to: string): void {
    /* ファイルコピー */
  }
  moveFile(from: string, to: string): void {
    /* ファイル移動 */
  }
  compressFile(name: string): void {
    /* ファイル圧縮 */
  }

  // 問題：新しい操作を追加するたびにこのクラスを変更
  // 問題：操作のundoが困難
}

// ✅ SRP準拠：各操作を個別のコマンドクラスに
interface FileCommand {
  execute(): void;
  undo(): void;
}

class CreateFileCommand implements FileCommand {
  constructor(private fileName: string, private fileSystem: FileSystem) {}

  execute(): void {
    this.fileSystem.create(this.fileName);
  }

  undo(): void {
    this.fileSystem.delete(this.fileName);
  }
}

class DeleteFileCommand implements FileCommand {
  private deletedContent: string | null = null;

  constructor(private fileName: string, private fileSystem: FileSystem) {}

  execute(): void {
    this.deletedContent = this.fileSystem.read(this.fileName);
    this.fileSystem.delete(this.fileName);
  }

  undo(): void {
    if (this.deletedContent !== null) {
      this.fileSystem.create(this.fileName, this.deletedContent);
    }
  }
}

class CopyFileCommand implements FileCommand {
  constructor(
    private source: string,
    private destination: string,
    private fileSystem: FileSystem
  ) {}

  execute(): void {
    const content = this.fileSystem.read(this.source);
    this.fileSystem.create(this.destination, content);
  }

  undo(): void {
    this.fileSystem.delete(this.destination);
  }
}

// ファイル操作の調整のみを担当
class FileOperationManager {
  private history: FileCommand[] = [];

  executeCommand(command: FileCommand): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }
}
```

#### 🔍 ファクトリーパターンと SRP

```typescript
// ❌ SRP違反：1つのクラスで複数種類のオブジェクト生成
class ShapeManager {
  createCircle(radius: number): Circle {
    // 複雑な Circle 初期化ロジック
    const circle = new Circle();
    circle.setRadius(radius);
    circle.calculateArea();
    return circle;
  }

  createRectangle(width: number, height: number): Rectangle {
    // 複雑な Rectangle 初期化ロジック
    const rectangle = new Rectangle();
    rectangle.setDimensions(width, height);
    rectangle.calculateArea();
    return rectangle;
  }

  createTriangle(base: number, height: number): Triangle {
    // 複雑な Triangle 初期化ロジック
    const triangle = new Triangle();
    triangle.setBase(base);
    triangle.setHeight(height);
    triangle.calculateArea();
    return triangle;
  }

  // 問題：新しい図形を追加するたびにこのクラスを変更
}

// ✅ SRP準拠：図形ごとに専用ファクトリー
abstract class ShapeFactory {
  abstract createShape(): Shape;
}

class CircleFactory extends ShapeFactory {
  constructor(private radius: number) {
    super();
  }

  createShape(): Circle {
    const circle = new Circle();
    circle.setRadius(this.radius);
    circle.calculateArea();

    // Circle特有の初期化処理
    circle.setDefaultColor("blue");
    circle.validateRadius();

    return circle;
  }
}

class RectangleFactory extends ShapeFactory {
  constructor(private width: number, private height: number) {
    super();
  }

  createShape(): Rectangle {
    const rectangle = new Rectangle();
    rectangle.setDimensions(this.width, this.height);
    rectangle.calculateArea();

    // Rectangle特有の初期化処理
    rectangle.setDefaultBorderStyle("solid");
    rectangle.validateDimensions();

    return rectangle;
  }
}

class TriangleFactory extends ShapeFactory {
  constructor(private base: number, private height: number) {
    super();
  }

  createShape(): Triangle {
    const triangle = new Triangle();
    triangle.setBase(this.base);
    triangle.setHeight(this.height);
    triangle.calculateArea();

    // Triangle特有の初期化処理
    triangle.setDefaultAngleType("right");
    triangle.validateTriangle();

    return triangle;
  }
}

// ファクトリーの管理のみを担当
class ShapeFactoryManager {
  createShape(type: string, ...args: number[]): Shape {
    switch (type) {
      case "circle":
        return new CircleFactory(args[0]).createShape();
      case "rectangle":
        return new RectangleFactory(args[0], args[1]).createShape();
      case "triangle":
        return new TriangleFactory(args[0], args[1]).createShape();
      default:
        throw new Error(`Unknown shape type: ${type}`);
    }
  }
}
```

### Section 3: SRP の実践的応用

#### 🔍 Web アプリケーションでの実践例

**🎓 学習のポイント**: 実際の Web アプリケーション開発での SRP 適用方法を学びましょう

```typescript
// 実例：ブログ管理システム

// ❌ SRP違反の典型例
class BlogManager {
  posts: BlogPost[] = [];

  // 投稿管理
  createPost(title: string, content: string, authorId: string): void {}
  updatePost(postId: string, title: string, content: string): void {}
  deletePost(postId: string): void {}

  // バリデーション
  validateTitle(title: string): boolean {}
  validateContent(content: string): boolean {}

  // データベース操作
  saveToDB(): void {}
  loadFromDB(): void {}

  // メール通知
  notifySubscribers(post: BlogPost): void {}

  // SEO処理
  generateMetaTags(post: BlogPost): string {}
  generateSitemap(): string {}

  // 統計
  getPostCount(): number {}
  getPopularPosts(): BlogPost[] {}

  // コメント管理
  addComment(postId: string, comment: string): void {}
  moderateComments(): void {}
}

// ✅ SRP準拠の設計

// 1. ブログ投稿の基本情報のみを管理
class BlogPost {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public authorId: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  updateContent(title: string, content: string): void {
    this.title = title;
    this.content = content;
    this.updatedAt = new Date();
  }
}

// 2. バリデーション専用
class BlogPostValidator {
  private readonly MIN_TITLE_LENGTH = 5;
  private readonly MAX_TITLE_LENGTH = 100;
  private readonly MIN_CONTENT_LENGTH = 50;

  validateTitle(title: string): ValidationResult {
    if (title.length < this.MIN_TITLE_LENGTH) {
      return { isValid: false, error: "Title too short" };
    }
    if (title.length > this.MAX_TITLE_LENGTH) {
      return { isValid: false, error: "Title too long" };
    }
    return { isValid: true };
  }

  validateContent(content: string): ValidationResult {
    if (content.length < this.MIN_CONTENT_LENGTH) {
      return { isValid: false, error: "Content too short" };
    }
    return { isValid: true };
  }

  validatePost(post: BlogPost): ValidationResult {
    const titleResult = this.validateTitle(post.title);
    if (!titleResult.isValid) return titleResult;

    const contentResult = this.validateContent(post.content);
    if (!contentResult.isValid) return contentResult;

    return { isValid: true };
  }
}

// 3. データ永続化専用
interface BlogPostRepository {
  save(post: BlogPost): Promise<void>;
  findById(id: string): Promise<BlogPost | null>;
  findAll(): Promise<BlogPost[]>;
  delete(id: string): Promise<void>;
}

class DatabaseBlogPostRepository implements BlogPostRepository {
  async save(post: BlogPost): Promise<void> {
    // データベースに保存
  }

  async findById(id: string): Promise<BlogPost | null> {
    // IDで検索
    return null;
  }

  async findAll(): Promise<BlogPost[]> {
    // 全件取得
    return [];
  }

  async delete(id: string): Promise<void> {
    // 削除
  }
}

// 4. 通知専用
interface NotificationService {
  notifyNewPost(post: BlogPost): Promise<void>;
  notifyPostUpdate(post: BlogPost): Promise<void>;
}

class EmailNotificationService implements NotificationService {
  async notifyNewPost(post: BlogPost): Promise<void> {
    // 新規投稿の通知メール送信
  }

  async notifyPostUpdate(post: BlogPost): Promise<void> {
    // 投稿更新の通知メール送信
  }
}

// 5. SEO処理専用
class SEOService {
  generateMetaTags(post: BlogPost): string {
    return `
      <meta name="title" content="${post.title}">
      <meta name="description" content="${post.content.substring(0, 150)}">
      <meta name="keywords" content="blog, ${post.title}">
    `;
  }

  generateSitemap(posts: BlogPost[]): string {
    return posts
      .map((post) => `<url><loc>/posts/${post.id}</loc></url>`)
      .join("");
  }
}

// 6. 統計処理専用
class BlogAnalyticsService {
  constructor(private repository: BlogPostRepository) {}

  async getPostCount(): Promise<number> {
    const posts = await this.repository.findAll();
    return posts.length;
  }

  async getPostsThisMonth(): Promise<BlogPost[]> {
    const posts = await this.repository.findAll();
    const thisMonth = new Date().getMonth();
    return posts.filter((post) => post.createdAt.getMonth() === thisMonth);
  }
}

// 7. 全体の調整（単一責任：ブログ投稿管理の調整）
class BlogPostService {
  constructor(
    private repository: BlogPostRepository,
    private validator: BlogPostValidator,
    private notificationService: NotificationService,
    private seoService: SEOService,
    private analyticsService: BlogAnalyticsService
  ) {}

  async createPost(
    title: string,
    content: string,
    authorId: string
  ): Promise<Result<BlogPost>> {
    const post = new BlogPost(crypto.randomUUID(), title, content, authorId);

    // バリデーション
    const validation = this.validator.validatePost(post);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // 保存
    await this.repository.save(post);

    // 通知
    await this.notificationService.notifyNewPost(post);

    return { success: true, data: post };
  }

  async updatePost(
    postId: string,
    title: string,
    content: string
  ): Promise<Result<BlogPost>> {
    const post = await this.repository.findById(postId);
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    post.updateContent(title, content);

    // バリデーション
    const validation = this.validator.validatePost(post);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // 保存
    await this.repository.save(post);

    // 通知
    await this.notificationService.notifyPostUpdate(post);

    return { success: true, data: post };
  }
}
```

---

## 🎯 実践練習問題（15 分）

**🎓 学習目標**: 学んだ SRP の概念を実際のコード例で適用する

### 練習問題 1: ユーザー登録システム（初級）

以下のコードを SRP に従ってリファクタリングしてください：

```typescript
class UserRegistration {
  users: User[] = [];

  registerUser(username: string, email: string, password: string): boolean {
    // バリデーション
    if (username.length < 3) return false;
    if (!email.includes("@")) return false;
    if (password.length < 8) return false;

    // パスワードハッシュ化
    const hashedPassword = this.hashPassword(password);

    // ユーザー作成
    const user = {
      id: Math.random().toString(36),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // 保存
    this.users.push(user);
    localStorage.setItem("users", JSON.stringify(this.users));

    // メール送信
    console.log(`Welcome email sent to ${email}`);

    // ログ記録
    console.log(`User ${username} registered at ${new Date()}`);

    return true;
  }

  private hashPassword(password: string): string {
    // 簡単なハッシュ化（実際はbcryptなどを使用）
    return btoa(password);
  }
}
```

**解答例**:

```typescript
// 1. バリデーション専用
class UserValidator {
  validateUsername(username: string): ValidationResult {
    if (username.length < 3) {
      return {
        isValid: false,
        error: "Username must be at least 3 characters",
      };
    }
    return { isValid: true };
  }

  validateEmail(email: string): ValidationResult {
    if (!email.includes("@")) {
      return { isValid: false, error: "Invalid email format" };
    }
    return { isValid: true };
  }

  validatePassword(password: string): ValidationResult {
    if (password.length < 8) {
      return {
        isValid: false,
        error: "Password must be at least 8 characters",
      };
    }
    return { isValid: true };
  }
}

// 2. パスワード処理専用
class PasswordService {
  hashPassword(password: string): string {
    return btoa(password); // 実際はbcryptなど
  }

  verifyPassword(password: string, hash: string): boolean {
    return btoa(password) === hash;
  }
}

// 3. ユーザー永続化専用
class UserRepository {
  private users: User[] = this.loadUsers();

  save(user: User): void {
    this.users.push(user);
    localStorage.setItem("users", JSON.stringify(this.users));
  }

  findByEmail(email: string): User | null {
    return this.users.find((u) => u.email === email) || null;
  }

  private loadUsers(): User[] {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  }
}

// 4. 通知専用
class NotificationService {
  sendWelcomeEmail(email: string): void {
    console.log(`Welcome email sent to ${email}`);
  }
}

// 5. ログ専用
class Logger {
  log(message: string): void {
    console.log(`${new Date().toISOString()}: ${message}`);
  }
}

// 6. 統合サービス
class UserRegistrationService {
  constructor(
    private validator: UserValidator,
    private passwordService: PasswordService,
    private userRepository: UserRepository,
    private notificationService: NotificationService,
    private logger: Logger
  ) {}

  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<Result<User>> {
    // バリデーション
    const usernameValidation = this.validator.validateUsername(username);
    if (!usernameValidation.isValid) {
      return { success: false, error: usernameValidation.error };
    }

    const emailValidation = this.validator.validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    const passwordValidation = this.validator.validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.error };
    }

    // 重複チェック
    if (this.userRepository.findByEmail(email)) {
      return { success: false, error: "Email already exists" };
    }

    // ユーザー作成
    const hashedPassword = this.passwordService.hashPassword(password);
    const user: User = {
      id: crypto.randomUUID(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // 保存
    this.userRepository.save(user);

    // 通知
    this.notificationService.sendWelcomeEmail(email);

    // ログ
    this.logger.log(`User ${username} registered`);

    return { success: true, data: user };
  }
}
```

### 練習問題 2: EC サイトの商品管理（中級）

以下の複雑なクラスを適切に分離してください：

```typescript
class ProductManager {
  products: Product[] = [];
  categories: Category[] = [];

  // 商品管理
  addProduct(name: string, price: number, category: string): Product {
    // バリデーション
    if (name.length < 2) throw new Error("Name too short");
    if (price <= 0) throw new Error("Invalid price");

    // カテゴリチェック
    let categoryObj = this.categories.find((c) => c.name === category);
    if (!categoryObj) {
      categoryObj = { id: Math.random().toString(), name: category };
      this.categories.push(categoryObj);
    }

    // 商品作成
    const product: Product = {
      id: Math.random().toString(),
      name,
      price,
      categoryId: categoryObj.id,
      stock: 0,
      createdAt: new Date(),
    };

    this.products.push(product);

    // インデックス更新（検索用）
    this.updateSearchIndex(product);

    // キャッシュ更新
    this.clearCache();

    return product;
  }

  // 在庫管理
  updateStock(productId: string, quantity: number): void {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.stock = quantity;
      if (quantity < 5) {
        this.sendLowStockAlert(product);
      }
    }
  }

  // 価格管理
  updatePrice(productId: string, newPrice: number): void {
    if (newPrice <= 0) throw new Error("Invalid price");
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.price = newPrice;
      this.logPriceChange(product.id, product.price, newPrice);
    }
  }

  // 検索機能
  searchProducts(query: string): Product[] {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  private updateSearchIndex(product: Product): void {
    // 検索インデックス更新
  }

  private clearCache(): void {
    // キャッシュクリア
  }

  private sendLowStockAlert(product: Product): void {
    console.log(`Low stock alert: ${product.name}`);
  }

  private logPriceChange(
    productId: string,
    oldPrice: number,
    newPrice: number
  ): void {
    console.log(`Price changed for ${productId}: ${oldPrice} -> ${newPrice}`);
  }
}
```

**🎓 チャレンジ**: このクラスを以下の責任に分離してください：

1. 商品バリデーション
2. カテゴリ管理
3. 商品リポジトリ
4. 在庫管理
5. 価格管理
6. 検索サービス
7. 通知サービス
8. 商品サービス（統合）

---

## 👨‍🏫 学習ポイント

### 🔄 復習のための確認項目

**基本概念の理解**

- [ ] 「責任」の定義と識別方法は理解できましたか？
- [ ] SRP が解決する問題は明確になりましたか？
- [ ] 段階的リファクタリングの手順は理解できましたか？

**実践的スキル**

- [ ] 複雑なクラスから責任を正確に識別できますか？
- [ ] 適切な分離単位でクラスを設計できますか？
- [ ] 分離後のクラス間の協調方法を設計できますか？

**応用力**

- [ ] 実際のプロジェクトで SRP を適用できる自信がありますか？
- [ ] パターン（コマンド、ファクトリーなど）と SRP を組み合わせて使えますか？
- [ ] リファクタリング時のリスクを最小化できますか？

### 🤔 よくある質問

**Q: クラスが小さくなりすぎる心配はありませんか？**
A: 小さすぎるクラスは大きすぎるクラスより管理しやすいです。必要に応じて関連するクラスをパッケージやモジュールでグループ化できます。

**Q: どの程度まで責任を分離すればよいですか？**
A: 「変更の理由が 1 つだけ」になるまでです。また、テストのしやすさも判断基準になります。

**Q: 既存のコードをリファクタリングする際の注意点は？**
A: 段階的に行い、各ステップでテストを実行することが重要です。一度にすべてを変更するのは危険です。

**Q: SRP とパフォーマンスのトレードオフはありますか？**
A: 初期のパフォーマンスは若干低下する可能性がありますが、保守性の向上により長期的にはパフォーマンスも改善されることが多いです。

---

**📌 重要**: Session1 では単一責任の原則の実践的理解を深めました。この基礎があることで、次のセッションでの学習がより効果的になります。

**🌟 次回（Session2）は、オープン・クローズドの原則（OCP）について詳しく学習します！**

---

## 📋 Session1 完了チェックリスト（45 分版）

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 基本概念理解

- [ ] 「責任」とは何かを具体例で説明できる
- [ ] 責任の識別方法（5 つの質問）を理解している
- [ ] SRP の利点と適用効果を説明できる

### 💻 実装スキル

- [ ] 複雑なクラスから責任を分離できる
- [ ] 段階的リファクタリングの手順を実行できる
- [ ] 分離後のクラス設計が適切にできる

### 🔧 実践能力

- [ ] コマンドパターンと SRP の組み合わせを理解している
- [ ] ファクトリーパターンと SRP の組み合わせを理解している
- [ ] Web アプリケーションでの実践例を理解している

### 🧪 問題解決力

- [ ] 提供された練習問題を解答できた
- [ ] 自分なりのリファクタリング戦略を説明できる
- [ ] SRP 適用時の注意点を理解している

### 📚 知識の定着

- [ ] SRP が他の SOLID 原則とどう関連するか理解している
- [ ] 次のステップ（Session2: OCP）への準備ができている

**🎉 すべてチェックできましたか？** それでは Session2 でお会いしましょう！

**⚠️ チェックできない項目がある場合**: 該当する学習内容を再度確認し、不明点は講師に質問しましょう。
