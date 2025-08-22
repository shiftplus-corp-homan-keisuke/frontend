````markdown
# Session4: インターフェース分離の原則（ISP）マスター（45 分）

> 💡 **対象**: Session3 完了者（リスコフの置換原則理解済み）
> 🎯 **形式**: 講師サポート付き学習
> ⏰ **時間**: 45 分（設計重視）

## 📅 セッション概要

**学習目標**:

- [ ] インターフェース分離の原則の深い理解と実践的適用
- [ ] 肥大化したインターフェースの分解技法の習得
- [ ] 型安全性を保つインターフェース設計の実践
- [ ] TypeScript の高度な型システムを活用した ISP 実装

**前提知識**:

- Session0-3 の内容（SOLID 原則全体像、SRP、OCP、LSP）
- TypeScript のインターフェース、ジェネリクス、条件型の理解
- 依存性注入とポリモーフィズムの基本概念

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                     | 講師の役割             | 学習者の活動   | 成果物                     |
| ------------ | ------------------------ | ---------------------- | -------------- | -------------------------- |
| **0-5 分**   | ISP 基本概念の深掘り     | 導入・原理説明         | 聞く・質問     | 原理理解確認               |
| **5-20 分**  | インターフェース分解実習 | 実演・個別指導         | ハンズオン     | 適切なインターフェース設計 |
| **20-35 分** | 実践的システム設計       | コードレビュー         | 問題解決・実装 | 型安全な設計               |
| **35-40 分** | 高度な ISP パターン      | 巡回サポート           | 個人作業       | ISP 最適化実践             |
| **40-45 分** | 振り返りと統合理解       | まとめ・フィードバック | 質問・確認     | 学習成果確認               |

---

## 📚 学習内容

### Section 1: インターフェース分離の原則の深い理解

> 📚 **関連資料**: [専門用語集 - ISP 詳細](./Step08_補足_専門用語集.md#ISP詳細) | [実践コード例 - ISP 設計パターン](./Step08_補足_実践コード例.md#ISP設計パターン)

#### 🔍 ISP の核心思想

**💡 身近な例から理解しよう**

スイスアーミーナイフとキッチン道具の比較：

🔪 **悪い例：多機能すぎるツール**

```
スイスアーミーナイフを料理に使用：
- ナイフ機能 → ✅ 使用
- ハサミ機能 → ❌ 使わない
- ドライバー機能 → ❌ 使わない
- コルクスクリュー → ❌ 使わない
- 爪切り機能 → ❌ 使わない

不要な機能が多すぎて、使いにくく、高価
```

🍳 **良い例：専門特化したツール**

```
料理専用道具：
- 包丁 → ✅ 切る作業に特化
- 菜箸 → ✅ つまむ・混ぜる作業に特化
- フライパン → ✅ 炒める・焼く作業に特化

各道具は必要な機能のみ提供、使いやすく効率的
```

**🔍 プログラムでの ISP の定義**

ロバート・C・マーティンによる定義：

> **「クライアントは、使用しないメソッドに依存することを強いられるべきではない」**

実用的解釈：

> **「インターフェースは、それを使用するクライアントが実際に必要とする機能のみを含むべきである」**

```typescript
// ❌ ISP違反：肥大化したインターフェース
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  program(): void; // プログラマーのみ使用
  drive(): void; // ドライバーのみ使用
  teach(): void; // 教師のみ使用
  cook(): void; // シェフのみ使用
  diagnose(): void; // 医師のみ使用
}

// ISP違反の問題：不要なメソッドの実装を強要
class Programmer implements Worker {
  work(): void {
    console.log("Programming...");
  }

  eat(): void {
    console.log("Eating...");
  }

  sleep(): void {
    console.log("Sleeping...");
  }

  program(): void {
    console.log("Writing code...");
  }

  // ❌ 使わない機能も実装を強要される
  drive(): void {
    throw new Error("Programmer doesn't need to drive");
  }

  teach(): void {
    throw new Error("Not a teacher");
  }

  cook(): void {
    throw new Error("Not a cook");
  }

  diagnose(): void {
    throw new Error("Not a doctor");
  }
}

// ✅ ISP準拠：適切に分離されたインターフェース
interface BasicWorker {
  work(): void;
  eat(): void;
  sleep(): void;
}

interface Programmable {
  program(): void;
  debug(): void;
  review(): void;
}

interface Drivable {
  drive(): void;
  navigate(): void;
}

interface Teachable {
  teach(): void;
  evaluate(): void;
}

interface Cookable {
  cook(): void;
  serve(): void;
}

interface Diagnosable {
  diagnose(): void;
  prescribe(): void;
}

// ISP準拠の実装：必要なインターフェースのみ実装
class Programmer implements BasicWorker, Programmable {
  work(): void {
    console.log("Programming...");
  }

  eat(): void {
    console.log("Eating...");
  }

  sleep(): void {
    console.log("Sleeping...");
  }

  program(): void {
    console.log("Writing code...");
  }

  debug(): void {
    console.log("Debugging code...");
  }

  review(): void {
    console.log("Reviewing code...");
  }
}

class Teacher implements BasicWorker, Teachable {
  work(): void {
    console.log("Teaching...");
  }

  eat(): void {
    console.log("Eating...");
  }

  sleep(): void {
    console.log("Sleeping...");
  }

  teach(): void {
    console.log("Teaching students...");
  }

  evaluate(): void {
    console.log("Evaluating performance...");
  }
}

// 複数の専門性を持つ場合も適切に対応
class FullStackDeveloper implements BasicWorker, Programmable, Teachable {
  work(): void {
    console.log("Full-stack development...");
  }

  eat(): void {
    console.log("Eating...");
  }

  sleep(): void {
    console.log("Sleeping...");
  }

  program(): void {
    console.log("Full-stack programming...");
  }

  debug(): void {
    console.log("Debugging full-stack issues...");
  }

  review(): void {
    console.log("Reviewing full-stack code...");
  }

  teach(): void {
    console.log("Teaching development...");
  }

  evaluate(): void {
    console.log("Evaluating student projects...");
  }
}
```

#### 1. ISP 違反の典型的問題

**🎓 学習のポイント**: ISP 違反が引き起こす実際の問題を理解しましょう

**問題 1: 不要な依存関係**

```typescript
// ❌ ISP違反：肥大化したマルチメディアインターフェース
interface MultimediaDevice {
  // 音楽機能
  playMusic(song: string): void;
  pauseMusic(): void;
  stopMusic(): void;
  setVolume(level: number): void;

  // 映像機能
  playVideo(video: string): void;
  pauseVideo(): void;
  stopVideo(): void;
  setBrightness(level: number): void;

  // ゲーム機能
  startGame(game: string): void;
  pauseGame(): void;
  saveGame(): void;
  loadGame(): void;

  // カメラ機能
  takePhoto(): void;
  recordVideo(): void;
  setFlash(on: boolean): void;

  // 電話機能
  makeCall(number: string): void;
  endCall(): void;
  sendSMS(number: string, message: string): void;
}

// ISP違反の問題：音楽プレイヤーが不要な機能に依存
class SimpleMusicPlayer implements MultimediaDevice {
  // 必要な機能
  playMusic(song: string): void {
    console.log(`Playing: ${song}`);
  }

  pauseMusic(): void {
    console.log("Music paused");
  }

  stopMusic(): void {
    console.log("Music stopped");
  }

  setVolume(level: number): void {
    console.log(`Volume set to: ${level}`);
  }

  // ❌ 不要な機能を実装せざるを得ない
  playVideo(video: string): void {
    throw new Error("Video not supported");
  }

  pauseVideo(): void {
    throw new Error("Video not supported");
  }

  stopVideo(): void {
    throw new Error("Video not supported");
  }

  setBrightness(level: number): void {
    throw new Error("Brightness not supported");
  }

  startGame(game: string): void {
    throw new Error("Games not supported");
  }

  pauseGame(): void {
    throw new Error("Games not supported");
  }

  saveGame(): void {
    throw new Error("Games not supported");
  }

  loadGame(): void {
    throw new Error("Games not supported");
  }

  takePhoto(): void {
    throw new Error("Camera not supported");
  }

  recordVideo(): void {
    throw new Error("Video recording not supported");
  }

  setFlash(on: boolean): void {
    throw new Error("Flash not supported");
  }

  makeCall(number: string): void {
    throw new Error("Phone not supported");
  }

  endCall(): void {
    throw new Error("Phone not supported");
  }

  sendSMS(number: string, message: string): void {
    throw new Error("SMS not supported");
  }
}

// ✅ ISP準拠の解決策：インターフェース分離
interface AudioPlayer {
  playMusic(song: string): void;
  pauseMusic(): void;
  stopMusic(): void;
  setVolume(level: number): void;
}

interface VideoPlayer {
  playVideo(video: string): void;
  pauseVideo(): void;
  stopVideo(): void;
  setBrightness(level: number): void;
}

interface GameConsole {
  startGame(game: string): void;
  pauseGame(): void;
  saveGame(): void;
  loadGame(): void;
}

interface Camera {
  takePhoto(): void;
  recordVideo(): void;
  setFlash(on: boolean): void;
}

interface Phone {
  makeCall(number: string): void;
  endCall(): void;
  sendSMS(number: string, message: string): void;
}

// 必要なインターフェースのみ実装
class SimpleMusicPlayer implements AudioPlayer {
  playMusic(song: string): void {
    console.log(`Playing: ${song}`);
  }

  pauseMusic(): void {
    console.log("Music paused");
  }

  stopMusic(): void {
    console.log("Music stopped");
  }

  setVolume(level: number): void {
    console.log(`Volume set to: ${level}`);
  }
}

class SmartPhone implements AudioPlayer, VideoPlayer, Camera, Phone {
  // 音楽機能
  playMusic(song: string): void {
    console.log(`Smartphone playing: ${song}`);
  }

  pauseMusic(): void {
    console.log("Music paused on smartphone");
  }

  stopMusic(): void {
    console.log("Music stopped on smartphone");
  }

  setVolume(level: number): void {
    console.log(`Smartphone volume: ${level}`);
  }

  // 映像機能
  playVideo(video: string): void {
    console.log(`Playing video: ${video}`);
  }

  pauseVideo(): void {
    console.log("Video paused");
  }

  stopVideo(): void {
    console.log("Video stopped");
  }

  setBrightness(level: number): void {
    console.log(`Screen brightness: ${level}`);
  }

  // カメラ機能
  takePhoto(): void {
    console.log("Photo taken");
  }

  recordVideo(): void {
    console.log("Recording video");
  }

  setFlash(on: boolean): void {
    console.log(`Flash ${on ? "on" : "off"}`);
  }

  // 電話機能
  makeCall(number: string): void {
    console.log(`Calling ${number}`);
  }

  endCall(): void {
    console.log("Call ended");
  }

  sendSMS(number: string, message: string): void {
    console.log(`SMS to ${number}: ${message}`);
  }
}
```

**問題 2: 結合度の増大**

```typescript
// ❌ ISP違反：肥大化したファイル処理インターフェース
interface FileHandler {
  // テキスト処理
  readText(): string;
  writeText(content: string): void;
  searchText(pattern: string): number[];

  // バイナリ処理
  readBinary(): ArrayBuffer;
  writeBinary(data: ArrayBuffer): void;

  // 圧縮機能
  compress(): void;
  decompress(): void;

  // 暗号化機能
  encrypt(key: string): void;
  decrypt(key: string): void;

  // ネットワーク機能
  uploadToCloud(): void;
  downloadFromCloud(): void;
  syncWithServer(): void;

  // メタデータ機能
  getMetadata(): FileMetadata;
  setMetadata(metadata: FileMetadata): void;
}

// ISP違反の問題：シンプルなテキストエディタが複雑な依存を持つ
class SimpleTextEditor implements FileHandler {
  private content: string = "";

  // 必要な機能
  readText(): string {
    return this.content;
  }

  writeText(content: string): void {
    this.content = content;
  }

  searchText(pattern: string): number[] {
    const matches: number[] = [];
    let index = this.content.indexOf(pattern);
    while (index !== -1) {
      matches.push(index);
      index = this.content.indexOf(pattern, index + 1);
    }
    return matches;
  }

  // ❌ 不要な機能に大きな実装コストが発生
  readBinary(): ArrayBuffer {
    throw new Error("Binary reading not supported in text editor");
  }

  writeBinary(data: ArrayBuffer): void {
    throw new Error("Binary writing not supported in text editor");
  }

  compress(): void {
    throw new Error("Compression not needed in simple text editor");
  }

  decompress(): void {
    throw new Error("Decompression not needed in simple text editor");
  }

  encrypt(key: string): void {
    throw new Error("Encryption not implemented");
  }

  decrypt(key: string): void {
    throw new Error("Decryption not implemented");
  }

  uploadToCloud(): void {
    throw new Error("Cloud features not implemented");
  }

  downloadFromCloud(): void {
    throw new Error("Cloud features not implemented");
  }

  syncWithServer(): void {
    throw new Error("Sync features not implemented");
  }

  getMetadata(): FileMetadata {
    throw new Error("Metadata not supported");
  }

  setMetadata(metadata: FileMetadata): void {
    throw new Error("Metadata not supported");
  }
}

// ✅ ISP準拠の解決策：機能別インターフェース分離
interface TextReadable {
  readText(): string;
}

interface TextWritable {
  writeText(content: string): void;
}

interface TextSearchable {
  searchText(pattern: string): number[];
}

interface BinaryReadable {
  readBinary(): ArrayBuffer;
}

interface BinaryWritable {
  writeBinary(data: ArrayBuffer): void;
}

interface Compressible {
  compress(): void;
  decompress(): void;
}

interface Encryptable {
  encrypt(key: string): void;
  decrypt(key: string): void;
}

interface CloudSyncable {
  uploadToCloud(): void;
  downloadFromCloud(): void;
  syncWithServer(): void;
}

interface MetadataAccessible {
  getMetadata(): FileMetadata;
  setMetadata(metadata: FileMetadata): void;
}

// ISP準拠の実装：必要な機能のみ
class SimpleTextEditor implements TextReadable, TextWritable, TextSearchable {
  private content: string = "";

  readText(): string {
    return this.content;
  }

  writeText(content: string): void {
    this.content = content;
  }

  searchText(pattern: string): number[] {
    const matches: number[] = [];
    let index = this.content.indexOf(pattern);
    while (index !== -1) {
      matches.push(index);
      index = this.content.indexOf(pattern, index + 1);
    }
    return matches;
  }
}

// 高機能なエディタは必要な機能を選択して実装
class AdvancedTextEditor
  implements
    TextReadable,
    TextWritable,
    TextSearchable,
    Encryptable,
    CloudSyncable,
    MetadataAccessible
{
  private content: string = "";
  private metadata: FileMetadata = {
    created: new Date(),
    modified: new Date(),
    size: 0,
  };

  readText(): string {
    return this.content;
  }

  writeText(content: string): void {
    this.content = content;
    this.metadata.modified = new Date();
    this.metadata.size = content.length;
  }

  searchText(pattern: string): number[] {
    const matches: number[] = [];
    let index = this.content.indexOf(pattern);
    while (index !== -1) {
      matches.push(index);
      index = this.content.indexOf(pattern, index + 1);
    }
    return matches;
  }

  encrypt(key: string): void {
    // 暗号化ロジック実装
    console.log(`Encrypting content with key: ${key}`);
  }

  decrypt(key: string): void {
    // 復号化ロジック実装
    console.log(`Decrypting content with key: ${key}`);
  }

  uploadToCloud(): void {
    console.log("Uploading to cloud...");
  }

  downloadFromCloud(): void {
    console.log("Downloading from cloud...");
  }

  syncWithServer(): void {
    console.log("Syncing with server...");
  }

  getMetadata(): FileMetadata {
    return { ...this.metadata };
  }

  setMetadata(metadata: FileMetadata): void {
    this.metadata = { ...metadata };
  }
}

interface FileMetadata {
  created: Date;
  modified: Date;
  size: number;
}
```

#### 2. TypeScript での高度な ISP 実装

**🎓 学習のポイント**: TypeScript の型システムを活用して ISP を効果的に実装する方法を学びましょう

**条件型とマップ型を使った動的インターフェース分離**

```typescript
// 機能フラグによる動的なインターフェース生成
type FeatureFlags = {
  readonly canRead: boolean;
  readonly canWrite: boolean;
  readonly canDelete: boolean;
  readonly canShare: boolean;
  readonly canEncrypt: boolean;
};

// 条件型による選択的インターフェース
type ConditionalFileOperations<T extends FeatureFlags> =
  (T["canRead"] extends true ? { read(): string } : {}) &
    (T["canWrite"] extends true ? { write(content: string): void } : {}) &
    (T["canDelete"] extends true ? { delete(): void } : {}) &
    (T["canShare"] extends true ? { share(userId: string): void } : {}) &
    (T["canEncrypt"] extends true
      ? { encrypt(key: string): void; decrypt(key: string): void }
      : {});

// ユーザー権限に基づいたインターフェース
type ReadOnlyUser = FeatureFlags & {
  readonly canRead: true;
  readonly canWrite: false;
  readonly canDelete: false;
  readonly canShare: false;
  readonly canEncrypt: false;
};

type EditorUser = FeatureFlags & {
  readonly canRead: true;
  readonly canWrite: true;
  readonly canDelete: false;
  readonly canShare: false;
  readonly canEncrypt: false;
};

type AdminUser = FeatureFlags & {
  readonly canRead: true;
  readonly canWrite: true;
  readonly canDelete: true;
  readonly canShare: true;
  readonly canEncrypt: true;
};

// 権限に基づいた型安全なファイル操作
class FileOperator<T extends FeatureFlags>
  implements ConditionalFileOperations<T>
{
  constructor(private permissions: T, private content: string = "") {}

  // TypeScript の条件型により、権限がある場合のみメソッドが利用可能
  read(this: T["canRead"] extends true ? this : never): string {
    return this.content;
  }

  write(
    this: T["canWrite"] extends true ? this : never,
    content: string
  ): void {
    this.content = content;
  }

  delete(this: T["canDelete"] extends true ? this : never): void {
    this.content = "";
    console.log("File deleted");
  }

  share(this: T["canShare"] extends true ? this : never, userId: string): void {
    console.log(`File shared with user: ${userId}`);
  }

  encrypt(
    this: T["canEncrypt"] extends true ? this : never,
    key: string
  ): void {
    console.log("File encrypted");
  }

  decrypt(
    this: T["canEncrypt"] extends true ? this : never,
    key: string
  ): void {
    console.log("File decrypted");
  }
}

// 使用例：コンパイル時に権限チェック
const readOnlyFile = new FileOperator({
  canRead: true,
  canWrite: false,
  canDelete: false,
  canShare: false,
  canEncrypt: false,
} as const);

readOnlyFile.read(); // ✅ OK
// readOnlyFile.write("test"); // ❌ コンパイルエラー
// readOnlyFile.delete(); // ❌ コンパイルエラー

const adminFile = new FileOperator({
  canRead: true,
  canWrite: true,
  canDelete: true,
  canShare: true,
  canEncrypt: true,
} as const);

adminFile.read(); // ✅ OK
adminFile.write("admin content"); // ✅ OK
adminFile.delete(); // ✅ OK
adminFile.share("user123"); // ✅ OK
adminFile.encrypt("secret-key"); // ✅ OK
```

**ジェネリクスと制約を使った柔軟なインターフェース設計**

```typescript
// ベース機能の定義
interface BaseOperation {
  readonly type: string;
}

interface ReadOperation extends BaseOperation {
  readonly type: "read";
  read(): string;
}

interface WriteOperation extends BaseOperation {
  readonly type: "write";
  write(content: string): void;
}

interface TransformOperation extends BaseOperation {
  readonly type: "transform";
  transform<T>(transformer: (input: string) => T): T;
}

interface ValidateOperation extends BaseOperation {
  readonly type: "validate";
  validate(rules: ValidationRule[]): ValidationResult;
}

// 操作の組み合わせを制約で制御
type DataProcessor<T extends BaseOperation> = {
  operations: T[];
  executeOperations<U extends T>(
    operations: U[],
    input: string
  ): ProcessingResult<U>;
};

// 操作固有の実装
class TextProcessor
  implements ReadOperation, WriteOperation, TransformOperation
{
  readonly type = "read" as const;
  private content: string = "";

  read(): string {
    return this.content;
  }

  write(content: string): void {
    this.content = content;
  }

  transform<T>(transformer: (input: string) => T): T {
    return transformer(this.content);
  }
}

class DataValidator implements ValidateOperation {
  readonly type = "validate" as const;

  validate(rules: ValidationRule[]): ValidationResult {
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }
}

// 型安全な操作パイプライン
class ProcessingPipeline<T extends BaseOperation> {
  constructor(private processors: Map<T["type"], T>) {}

  execute<U extends T["type"]>(
    operations: U[],
    input: string
  ): ProcessingResult<Extract<T, { type: U }>> {
    const results: any[] = [];

    for (const opType of operations) {
      const processor = this.processors.get(opType);
      if (processor) {
        // 型安全な処理実行
        results.push(this.executeOperation(processor, input));
      }
    }

    return { results, success: true } as ProcessingResult<
      Extract<T, { type: U }>
    >;
  }

  private executeOperation(processor: T, input: string): any {
    switch (processor.type) {
      case "read":
        return (processor as ReadOperation).read();
      case "write":
        (processor as WriteOperation).write(input);
        return `Written: ${input}`;
      case "transform":
        return (processor as TransformOperation).transform((x) =>
          x.toUpperCase()
        );
      case "validate":
        return (processor as ValidateOperation).validate([]);
      default:
        throw new Error(`Unknown operation type: ${processor.type}`);
    }
  }
}

// 型定義
interface ValidationRule {
  field: string;
  rule: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

type ProcessingResult<T> = {
  results: any[];
  success: boolean;
};
```

### Section 2: 実践的な ISP 設計パターン

#### 🔍 役割ベースのインターフェース設計

**🎓 学習のポイント**: 実際のシステムで使われる ISP 設計パターンを学びましょう

```typescript
// 実例：Eコマースシステムでの役割ベースインターフェース

// ユーザー役割の定義
type UserRole = "customer" | "seller" | "admin" | "support";

// 基本ユーザーインターフェース
interface BaseUser {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
  authenticate(password: string): boolean;
}

// 顧客専用機能
interface CustomerCapabilities {
  browseProducts(): Product[];
  addToCart(productId: string, quantity: number): void;
  removeFromCart(productId: string): void;
  checkout(): Order;
  trackOrder(orderId: string): OrderStatus;
  leaveReview(productId: string, review: Review): void;
}

// 販売者専用機能
interface SellerCapabilities {
  listProduct(product: ProductListing): void;
  updateProduct(productId: string, updates: Partial<Product>): void;
  removeProduct(productId: string): void;
  viewSalesAnalytics(): SalesData;
  processOrder(orderId: string): void;
  respondToReview(reviewId: string, response: string): void;
}

// 管理者専用機能
interface AdminCapabilities {
  manageUsers(): User[];
  banUser(userId: string): void;
  approveProduct(productId: string): void;
  rejectProduct(productId: string, reason: string): void;
  viewSystemAnalytics(): SystemAnalytics;
  moderateReviews(): Review[];
  configureSystem(settings: SystemSettings): void;
}

// サポート専用機能
interface SupportCapabilities {
  viewCustomerTickets(): SupportTicket[];
  respondToTicket(ticketId: string, response: string): void;
  escalateTicket(ticketId: string): void;
  viewOrderDetails(orderId: string): OrderDetails;
  issueRefund(orderId: string, amount: number): void;
}

// 役割に基づいた型安全な実装
class Customer implements BaseUser, CustomerCapabilities {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: "customer" = "customer"
  ) {}

  authenticate(password: string): boolean {
    // 認証ロジック
    return true;
  }

  browseProducts(): Product[] {
    console.log("Browsing products...");
    return [];
  }

  addToCart(productId: string, quantity: number): void {
    console.log(`Added ${quantity} of product ${productId} to cart`);
  }

  removeFromCart(productId: string): void {
    console.log(`Removed product ${productId} from cart`);
  }

  checkout(): Order {
    console.log("Processing checkout...");
    return { id: "order-123", status: "processing" } as Order;
  }

  trackOrder(orderId: string): OrderStatus {
    console.log(`Tracking order ${orderId}`);
    return "shipped";
  }

  leaveReview(productId: string, review: Review): void {
    console.log(`Review left for product ${productId}`);
  }
}

class Seller implements BaseUser, SellerCapabilities {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: "seller" = "seller"
  ) {}

  authenticate(password: string): boolean {
    return true;
  }

  listProduct(product: ProductListing): void {
    console.log(`Listed new product: ${product.title}`);
  }

  updateProduct(productId: string, updates: Partial<Product>): void {
    console.log(`Updated product ${productId}`);
  }

  removeProduct(productId: string): void {
    console.log(`Removed product ${productId}`);
  }

  viewSalesAnalytics(): SalesData {
    console.log("Viewing sales analytics...");
    return { totalSales: 10000, orders: 150 } as SalesData;
  }

  processOrder(orderId: string): void {
    console.log(`Processing order ${orderId}`);
  }

  respondToReview(reviewId: string, response: string): void {
    console.log(`Responded to review ${reviewId}: ${response}`);
  }
}

class Admin implements BaseUser, AdminCapabilities {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: "admin" = "admin"
  ) {}

  authenticate(password: string): boolean {
    return true;
  }

  manageUsers(): User[] {
    console.log("Managing all users...");
    return [];
  }

  banUser(userId: string): void {
    console.log(`Banned user ${userId}`);
  }

  approveProduct(productId: string): void {
    console.log(`Approved product ${productId}`);
  }

  rejectProduct(productId: string, reason: string): void {
    console.log(`Rejected product ${productId}: ${reason}`);
  }

  viewSystemAnalytics(): SystemAnalytics {
    console.log("Viewing system analytics...");
    return { activeUsers: 1000, dailyOrders: 50 } as SystemAnalytics;
  }

  moderateReviews(): Review[] {
    console.log("Moderating reviews...");
    return [];
  }

  configureSystem(settings: SystemSettings): void {
    console.log("System configuration updated");
  }
}

// 複数の役割を持つユーザー（ISPの柔軟性）
class SellerWithSupportRole
  implements BaseUser, SellerCapabilities, SupportCapabilities
{
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: "seller" = "seller"
  ) {}

  authenticate(password: string): boolean {
    return true;
  }

  // SellerCapabilities の実装
  listProduct(product: ProductListing): void {
    console.log(`Listed new product: ${product.title}`);
  }

  updateProduct(productId: string, updates: Partial<Product>): void {
    console.log(`Updated product ${productId}`);
  }

  removeProduct(productId: string): void {
    console.log(`Removed product ${productId}`);
  }

  viewSalesAnalytics(): SalesData {
    return { totalSales: 10000, orders: 150 } as SalesData;
  }

  processOrder(orderId: string): void {
    console.log(`Processing order ${orderId}`);
  }

  respondToReview(reviewId: string, response: string): void {
    console.log(`Responded to review ${reviewId}: ${response}`);
  }

  // SupportCapabilities の実装
  viewCustomerTickets(): SupportTicket[] {
    console.log("Viewing customer support tickets...");
    return [];
  }

  respondToTicket(ticketId: string, response: string): void {
    console.log(`Responded to ticket ${ticketId}: ${response}`);
  }

  escalateTicket(ticketId: string): void {
    console.log(`Escalated ticket ${ticketId}`);
  }

  viewOrderDetails(orderId: string): OrderDetails {
    console.log(`Viewing order details for ${orderId}`);
    return {} as OrderDetails;
  }

  issueRefund(orderId: string, amount: number): void {
    console.log(`Issued refund of $${amount} for order ${orderId}`);
  }
}

// 型安全なファクトリーパターン
class UserFactory {
  static createUser<T extends UserRole>(
    role: T,
    id: string,
    email: string
  ): T extends "customer"
    ? Customer
    : T extends "seller"
    ? Seller
    : T extends "admin"
    ? Admin
    : never {
    switch (role) {
      case "customer":
        return new Customer(id, email) as any;
      case "seller":
        return new Seller(id, email) as any;
      case "admin":
        return new Admin(id, email) as any;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  }
}

// サービス層での使用例
class EcommerceService {
  handleUserAction<T extends BaseUser>(user: T, action: UserAction): void {
    // 基本的な認証は全ユーザーで共通
    if (!user.authenticate("password")) {
      throw new Error("Authentication failed");
    }

    // 型ガードで安全に機能を使い分け
    if (this.isCustomer(user) && action.type === "browse") {
      user.browseProducts();
    }

    if (this.isSeller(user) && action.type === "list_product") {
      user.listProduct(action.product);
    }

    if (this.isAdmin(user) && action.type === "ban_user") {
      user.banUser(action.userId);
    }
  }

  private isCustomer(user: BaseUser): user is Customer {
    return "browseProducts" in user;
  }

  private isSeller(user: BaseUser): user is Seller {
    return "listProduct" in user;
  }

  private isAdmin(user: BaseUser): user is Admin {
    return "manageUsers" in user;
  }
}

// 型定義
interface Product {
  id: string;
  title: string;
  price: number;
}

interface ProductListing {
  title: string;
  description: string;
  price: number;
  category: string;
}

interface Order {
  id: string;
  status: string;
}

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

interface Review {
  id: string;
  rating: number;
  comment: string;
}

interface SalesData {
  totalSales: number;
  orders: number;
}

interface SystemAnalytics {
  activeUsers: number;
  dailyOrders: number;
}

interface SystemSettings {
  maintenanceMode: boolean;
  maxOrdersPerDay: number;
}

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: string;
}

interface OrderDetails {
  id: string;
  items: Product[];
  total: number;
}

interface UserAction {
  type: string;
  product?: ProductListing;
  userId?: string;
}
```

### Section 3: ISP と他の SOLID 原則の統合

#### 🔍 SOLID 原則の相乗効果

**🎓 学習のポイント**: ISP が他の原則とどのように連携するかを理解しましょう

```typescript
// ISP + SRP + OCP + LSP + DIP の統合例

// Step 1: ISP による適切なインターフェース分離
interface Readable<T> {
  read(): T;
}

interface Writable<T> {
  write(data: T): void;
}

interface Transformable<TInput, TOutput> {
  transform(input: TInput): TOutput;
}

interface Validatable<T> {
  validate(data: T): ValidationResult;
}

interface Cacheable<T> {
  cache(key: string, data: T): void;
  getFromCache(key: string): T | null;
}

// Step 2: SRP を適用した単一責任クラス
class FileReader implements Readable<string> {
  constructor(private filePath: string) {}

  read(): string {
    console.log(`Reading file: ${this.filePath}`);
    return "file content";
  }
}

class FileWriter implements Writable<string> {
  constructor(private filePath: string) {}

  write(data: string): void {
    console.log(`Writing to file: ${this.filePath}`);
    console.log(`Data: ${data}`);
  }
}

class DataTransformer implements Transformable<string, object> {
  transform(input: string): object {
    console.log("Transforming string to object");
    return JSON.parse(input || "{}");
  }
}

class DataValidator implements Validatable<object> {
  validate(data: object): ValidationResult {
    console.log("Validating data");
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }
}

class MemoryCache implements Cacheable<any> {
  private cache: Map<string, any> = new Map();

  cache(key: string, data: any): void {
    this.cache.set(key, data);
    console.log(`Cached data with key: ${key}`);
  }

  getFromCache(key: string): any {
    const data = this.cache.get(key);
    console.log(`Retrieved from cache with key: ${key}`);
    return data || null;
  }
}

// Step 3: OCP を適用した拡張可能な設計（Strategy パターン）
interface ProcessingStrategy<TInput, TOutput> {
  execute(input: TInput): TOutput;
}

class JsonProcessingStrategy implements ProcessingStrategy<string, object> {
  constructor(
    private transformer: Transformable<string, object>,
    private validator: Validatable<object>
  ) {}

  execute(input: string): object {
    const transformed = this.transformer.transform(input);
    const validation = this.validator.validate(transformed);

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    return transformed;
  }
}

class XmlProcessingStrategy implements ProcessingStrategy<string, object> {
  execute(input: string): object {
    console.log("Processing XML data");
    // XML parsing logic
    return { type: "xml", data: input };
  }
}

// Step 4: LSP を満たす基底クラスとサブクラス
abstract class DataProcessor<TInput, TOutput> {
  constructor(
    protected strategy: ProcessingStrategy<TInput, TOutput>,
    protected cache?: Cacheable<TOutput>
  ) {}

  // Template Method パターン：LSP を保つ一貫した処理フロー
  process(input: TInput, cacheKey?: string): TOutput {
    // キャッシュチェック（オプション）
    if (cacheKey && this.cache) {
      const cached = this.cache.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // メイン処理
    const result = this.executeProcessing(input);

    // キャッシュ保存（オプション）
    if (cacheKey && this.cache) {
      this.cache.cache(cacheKey, result);
    }

    return result;
  }

  // LSP を満たす：子クラスで拡張可能だが基本契約は維持
  protected executeProcessing(input: TInput): TOutput {
    return this.strategy.execute(input);
  }
}

class FileDataProcessor extends DataProcessor<string, object> {
  constructor(
    private reader: Readable<string>,
    strategy: ProcessingStrategy<string, object>,
    cache?: Cacheable<object>
  ) {
    super(strategy, cache);
  }

  // LSP 準拠：親クラスの契約を守りつつ機能拡張
  processFile(cacheKey?: string): object {
    const input = this.reader.read();
    return this.process(input, cacheKey);
  }

  // 追加機能：親クラスの機能は変更せず
  processFileWithLogging(cacheKey?: string): object {
    console.log("Starting file processing...");
    const result = this.processFile(cacheKey);
    console.log("File processing completed");
    return result;
  }
}

class StreamDataProcessor extends DataProcessor<string, object> {
  // LSP 準拠：同じインターフェースで異なる実装
  processStream(stream: string[], cacheKey?: string): object[] {
    return stream.map((item, index) =>
      this.process(item, `${cacheKey}_${index}`)
    );
  }
}

// Step 5: DIP を適用した依存性注入
interface DataProcessingService {
  processData(input: string): object;
}

class ApplicationService implements DataProcessingService {
  // 抽象に依存（DIP）
  constructor(
    private reader: Readable<string>,
    private writer: Writable<string>,
    private processor: DataProcessor<string, object>,
    private logger?: Writable<string>
  ) {}

  processData(input: string): object {
    try {
      // ISP により各コンポーネントは必要な機能のみ提供
      const result = this.processor.process(input);

      // 処理結果をファイルに保存
      this.writer.write(JSON.stringify(result, null, 2));

      // ログ記録（オプション）
      if (this.logger) {
        this.logger.write(`Processed data successfully: ${new Date()}`);
      }

      return result;
    } catch (error) {
      if (this.logger) {
        this.logger.write(`Processing failed: ${error}`);
      }
      throw error;
    }
  }
}

// Step 6: 依存性注入コンテナ（DIP の実現）
class DIContainer {
  private services: Map<string, any> = new Map();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  get<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service not found: ${key}`);
    }
    return factory();
  }
}

// 使用例：SOLID原則の統合による拡張可能なシステム
function setupApplication(): ApplicationService {
  const container = new DIContainer();

  // 各コンポーネントを登録
  container.register("fileReader", () => new FileReader("input.txt"));
  container.register("fileWriter", () => new FileWriter("output.txt"));
  container.register("logWriter", () => new FileWriter("app.log"));
  container.register("transformer", () => new DataTransformer());
  container.register("validator", () => new DataValidator());
  container.register("cache", () => new MemoryCache());

  container.register(
    "jsonStrategy",
    () =>
      new JsonProcessingStrategy(
        container.get("transformer"),
        container.get("validator")
      )
  );

  container.register(
    "fileProcessor",
    () =>
      new FileDataProcessor(
        container.get("fileReader"),
        container.get("jsonStrategy"),
        container.get("cache")
      )
  );

  container.register(
    "applicationService",
    () =>
      new ApplicationService(
        container.get("fileReader"),
        container.get("fileWriter"),
        container.get("fileProcessor"),
        container.get("logWriter")
      )
  );

  return container.get("applicationService");
}

// 実行例
const app = setupApplication();
const result = app.processData('{"name": "John", "age": 30}');
console.log("Processing result:", result);

// 新しい要件への拡張（OCP + ISP）
class CsvProcessingStrategy implements ProcessingStrategy<string, object> {
  execute(input: string): object {
    const lines = input.split("\n");
    const headers = lines[0].split(",");
    const values = lines[1].split(",");

    const result: any = {};
    headers.forEach((header, index) => {
      result[header.trim()] = values[index]?.trim();
    });

    return result;
  }
}

// 新しいストラテジーを追加（既存コードの変更なし）
function setupApplicationWithCsv(): ApplicationService {
  const container = new DIContainer();

  // ... 既存の登録 ...

  // 新しいストラテジーを追加
  container.register("csvStrategy", () => new CsvProcessingStrategy());

  container.register(
    "csvFileProcessor",
    () =>
      new FileDataProcessor(
        container.get("fileReader"),
        container.get("csvStrategy"),
        container.get("cache")
      )
  );

  return new ApplicationService(
    container.get("fileReader"),
    container.get("fileWriter"),
    container.get("csvFileProcessor"),
    container.get("logWriter")
  );
}
```

---

## 🎯 実践練習問題（15 分）

**🎓 学習目標**: 学んだ ISP の概念を実際のコード例で適用する

### 練習問題 1: 通知システム（初級）

以下のコードの ISP 違反を特定し、修正してください：

```typescript
interface NotificationService {
  sendEmail(to: string, subject: string, body: string): void;
  sendSMS(to: string, message: string): void;
  sendPushNotification(deviceId: string, title: string, body: string): void;
  sendSlackMessage(channel: string, message: string): void;
  sendDiscordMessage(channel: string, message: string): void;
  scheduleEmail(
    to: string,
    subject: string,
    body: string,
    scheduleTime: Date
  ): void;
  scheduleSMS(to: string, message: string, scheduleTime: Date): void;
}

class EmailOnlyService implements NotificationService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
  }

  // 使わない機能も実装を強要される
  sendSMS(to: string, message: string): void {
    throw new Error("SMS not supported");
  }

  sendPushNotification(deviceId: string, title: string, body: string): void {
    throw new Error("Push notifications not supported");
  }

  sendSlackMessage(channel: string, message: string): void {
    throw new Error("Slack not supported");
  }

  sendDiscordMessage(channel: string, message: string): void {
    throw new Error("Discord not supported");
  }

  scheduleEmail(
    to: string,
    subject: string,
    body: string,
    scheduleTime: Date
  ): void {
    console.log(`Scheduling email to ${to} for ${scheduleTime}`);
  }

  scheduleSMS(to: string, message: string, scheduleTime: Date): void {
    throw new Error("SMS scheduling not supported");
  }
}
```

**🎓 チャレンジ**: このコードを以下の観点でリファクタリングしてください：

1. 通知手段ごとにインターフェースを分離
2. スケジューリング機能を別のインターフェースに分離
3. 組み合わせ可能な設計にする

### 練習問題 2: データベース操作システム（中級）

以下のコードを ISP の原則に従って改善してください：

```typescript
interface DatabaseOperations {
  // 基本CRUD
  create(data: any): string;
  read(id: string): any;
  update(id: string, data: any): void;
  delete(id: string): void;

  // 検索・クエリ
  search(query: string): any[];
  filter(criteria: any): any[];

  // トランザクション
  beginTransaction(): void;
  commitTransaction(): void;
  rollbackTransaction(): void;

  // キャッシュ
  clearCache(): void;
  getCacheStats(): any;

  // 分析
  getAnalytics(): any;
  generateReport(): string;

  // 管理機能
  backup(): void;
  restore(backupId: string): void;
  optimize(): void;
}

class SimpleUserRepository implements DatabaseOperations {
  // 実際に使うのは基本CRUDのみ
  create(data: any): string {
    console.log("Creating user");
    return "user-123";
  }

  read(id: string): any {
    console.log(`Reading user ${id}`);
    return { id, name: "John" };
  }

  update(id: string, data: any): void {
    console.log(`Updating user ${id}`);
  }

  delete(id: string): void {
    console.log(`Deleting user ${id}`);
  }

  // 不要な機能も実装を強要される...
  search(query: string): any[] {
    throw new Error("Search not implemented");
  }

  filter(criteria: any): any[] {
    throw new Error("Filter not implemented");
  }

  beginTransaction(): void {
    throw new Error("Transactions not supported");
  }

  commitTransaction(): void {
    throw new Error("Transactions not supported");
  }

  rollbackTransaction(): void {
    throw new Error("Transactions not supported");
  }

  clearCache(): void {
    throw new Error("Cache not supported");
  }

  getCacheStats(): any {
    throw new Error("Cache not supported");
  }

  getAnalytics(): any {
    throw new Error("Analytics not supported");
  }

  generateReport(): string {
    throw new Error("Reports not supported");
  }

  backup(): void {
    throw new Error("Backup not supported");
  }

  restore(backupId: string): void {
    throw new Error("Restore not supported");
  }

  optimize(): void {
    throw new Error("Optimization not supported");
  }
}
```

---

## 👨‍🏫 学習ポイント

### 🔄 復習のための確認項目

**基本概念の理解**

- [ ] ISP の定義と「クライアント依存の最小化」を理解していますか？
- [ ] 肥大化したインターフェースの問題点を説明できますか？
- [ ] インターフェース分離の基準を理解していますか？

**設計スキル**

- [ ] 適切なインターフェース粒度を決められますか？
- [ ] 役割ベースでインターフェースを分離できますか？
- [ ] TypeScript の型システムを活用した ISP 設計ができますか？

**統合理解**

- [ ] ISP と他の SOLID 原則の関係を理解していますか？
- [ ] ISP がシステム全体の設計にどう影響するかを理解していますか？

### 🤔 よくある質問

**Q: インターフェースを細かく分けすぎると複雑になりませんか？**
A: はい。適切なバランスが重要です。クライアントの実際の使用パターンを基準に、実用的な粒度で分割しましょう。

**Q: 既存のコードで ISP 違反を見つけた場合、どう対処すべきですか？**
A: 段階的にリファクタリングします。まず新しい分離されたインターフェースを作り、既存のインターフェースは非推奨として残し、徐々に移行します。

**Q: ISP はマイクロサービス設計にも適用できますか？**
A: はい。サービス間のインターフェース設計で ISP を適用することで、サービス間の結合度を下げ、独立性を高められます。

---

**📌 重要**: Session4 では ISP の実践的理解を深めました。適切なインターフェース設計により、柔軟で保守性の高いシステムが構築できます。

**🌟 次回（Session5）は、依存性逆転の原則（DIP）について詳しく学習し、SOLID 原則を完成させます！**

---

## 📋 Session4 完了チェックリスト（45 分版）

学習を完了する前に、以下の項目をすべてチェックしてください：

### 💡 基本概念理解

- [ ] ISP の定義と重要性を説明できる
- [ ] 肥大化したインターフェースの問題を理解している
- [ ] インターフェース分離の基準を理解している

### 💻 設計スキル

- [ ] 役割ベースでインターフェースを分離できる
- [ ] TypeScript の型システムを活用した ISP 実装ができる
- [ ] 条件型とジェネリクスでの高度な設計ができる

### 🔧 実践力

- [ ] ISP 違反の識別と修正ができる
- [ ] 提供された練習問題を解答できた
- [ ] 実際のシステムで ISP を適用できる

### 📚 統合理解

- [ ] ISP と他の SOLID 原則の関係を理解している
- [ ] 次のステップ（Session5: DIP）への準備ができている

### 🧪 応用力

- [ ] 実践的なシステム設計で ISP を活用できる
- [ ] 権限ベース設計での ISP 適用を理解している
- [ ] ISP の相乗効果を他の設計原則と組み合わせて理解している

**🎉 すべてチェックできましたか？** それでは Session5 で SOLID 原則を完成させましょう！

**⚠️ チェックできない項目がある場合**: 該当する学習内容を再度確認し、不明点は講師に質問しましょう。
````
