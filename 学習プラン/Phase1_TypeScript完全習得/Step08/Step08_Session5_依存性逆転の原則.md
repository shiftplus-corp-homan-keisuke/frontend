# Session5: 依存性逆転の原則（DIP）をTypeScriptで理解する

依存性逆転の原則は、2つのルールから構成されています。

1. **上位モジュールは、下位モジュールに依存してはならない。両者とも、抽象に依存すべきである。**
2. **抽象は、詳細に依存してはならない。詳細は、抽象に依存すべきである。**

この言葉は少し難解ですが、要点は非常にシンプルです。

**「具体的な実装（詳細）に直接依存するのではなく、抽象的なインターフェース（抽象）に依存しよう」**

ということです。

ここで言う「上位モジュール」とは、ビジネスロジックなど、システムの核となる部分を指し、「下位モジュール」とは、データベース操作や外部APIとの通信など、具体的な実装の詳細を指します。

通常、私たちは「上位モジュールが下位モジュールを呼び出す」という依存関係を考えがちです。しかし、この原則は、その**依存性の方向を「逆転」させなさい**、と教えています。

## なぜ依存性逆転の原則が重要なのか？

もし、上位モジュールが下位モジュール（具体的な実装）に直接依存していると、次のような問題が起こります。

- **変更に弱い:** 下位モジュールの仕様変更（例：利用するデータベースをMySQLからPostgreSQLに変更する）が、上位モジュールに直接影響し、修正を強いることになります。
- **テストが困難:** 上位モジュールをテストする際に、下位モジュール（例：実際のデータベース）も一緒に動かす必要があり、テストの準備が大変になったり、テストが不安定になったりします。
- **再利用性の低下:** 上位モジュールが特定の下位モジュールと固く結びついているため、他の場所で再利用することが難しくなります。

この原則を守ることで、モジュール間の結合度を下げ、柔軟で交換可能、かつテストしやすいシステムを構築することができます。

## TypeScriptでの具体例

ユーザーのデータを取得し、レポートを作成する機能を考えてみましょう。

### 違反している例：

`ReportGenerator`（上位モジュール）が、具体的なデータベース実装である`MySQLDatabase`（下位モジュール）を直接利用しています。

```typescript
// 下位モジュール: 具体的なデータベース実装
class MySQLDatabase {
    fetchData(userId: string): string {
        // MySQLからデータを取得する具体的なロジック
        console.log("Fetching data from MySQL...");
        return `User data for ${userId} from MySQL`;
    }
}

// 上位モジュール: レポート生成ロジック
class ReportGenerator {
    private database: MySQLDatabase;

    constructor() {
        // ❌ 上位モジュールが下位モジュールを直接インスタンス化している（密結合）
        this.database = new MySQLDatabase();
    }

    generateReport(userId: string): void {
        const data = this.database.fetchData(userId);
        console.log(`Generating report with: ${data}`);
    }
}

// --- 使用例 ---
const reportGenerator = new ReportGenerator();
reportGenerator.generateReport("user-123");
```

このコードでは、`ReportGenerator`は`MySQLDatabase`の存在を完全に知ってしまっています。もし将来、「データベースを**PostgreSQL**に変えよう」となった場合、`ReportGenerator`クラスのコンストラクタを直接修正する必要があります。これは「オープン・クローズドの原則」にも違反します。

### 準拠している例：

この問題を解決するために、上位モジュールと下位モジュールの間に**抽象（インターフェース）**を挟みます。

**ステップ1: 抽象（インターフェース）を定義する**
まず、上位モジュール（`ReportGenerator`）が「必要とする機能」をインターフェースとして定義します。

```typescript
// 抽象: データソースの振る舞いを定義するインターフェース
interface IDataSource {
    fetchData(userId: string): string;
}
```

**ステップ2: 下位モジュールが抽象を実装する**
次に、具体的なデータベースクラスが、この`IDataSource`インターフェースを実装します。

```typescript
// 詳細: IDataSourceを実装したMySQLクラス
class MySQLDatabase implements IDataSource {
    fetchData(userId: string): string {
        console.log("Fetching data from MySQL...");
        return `User data for ${userId} from MySQL`;
    }
}

// 詳細: IDataSourceを実装したPostgreSQLクラス（将来の拡張）
class PostgreSQLDatabase implements IDataSource {
    fetchData(userId: string): string {
        console.log("Fetching data from PostgreSQL...");
        return `User data for ${userId} from PostgreSQL`;
    }
}
```

**ステップ3: 上位モジュールが抽象に依存する**
最後に、`ReportGenerator`が具体的なクラスではなく、`IDataSource`インターフェースに依存するように変更します。このとき、外部から依存オブジェクトを注入する**依存性の注入（Dependency Injection, DI）**というテクニックを使います。

```typescript
// 上位モジュール: IDataSourceインターフェースに依存
class ReportGenerator {
    // 具体的なクラスではなく、インターフェースに依存
    private dataSource: IDataSource;

    // ✅ コンストラクタで外部から依存性を注入（DI）
    constructor(dataSource: IDataSource) {
        this.dataSource = dataSource;
    }

    generateReport(userId: string): void {
        const data = this.dataSource.fetchData(userId);
        console.log(`Generating report with: ${data}`);
    }
}
```
この`ReportGenerator`は、もはや`MySQLDatabase`や`PostgreSQLDatabase`の存在を全く知りません。ただ`IDataSource`という「契約」を満たすオブジェクトが渡されることだけを知っています。

**ステップ4: 依存性を組み立てて注入する**
アプリケーションの起動時など、どこか一箇所で具体的なオブジェクトを生成し、上位モジュールに注入します。

```typescript
// --- 使用例 ---

// 1. MySQLを使いたい場合
const mySQL = new MySQLDatabase();
const reportGeneratorForMySQL = new ReportGenerator(mySQL);
reportGeneratorForMySQL.generateReport("user-123");

console.log("\n--- データベースを変更 --- \n");

// 2. PostgreSQLを使いたい場合
const postgreSQL = new PostgreSQLDatabase();
const reportGeneratorForPostgreSQL = new ReportGenerator(postgreSQL);
// ReportGeneratorクラスを一切変更することなく、データソースを差し替えられた！
reportGeneratorForPostgreSQL.generateReport("user-456");
```

**実行結果:**

```
Fetching data from MySQL...
Generating report with: User data for user-123 from MySQL

--- データベースを変更 ---

Fetching data from PostgreSQL...
Generating report with: User data for user-456 from PostgreSQL
```

### テストの例

この設計の大きなメリットの一つは、テストが非常に簡単になることです。

```typescript
// テスト用のモックデータソース
class MockDataSource implements IDataSource {
    fetchData(userId: string): string {
        return `Mock data for ${userId}`;
    }
}

// テストコード
function testReportGenerator() {
    console.log("--- テスト実行 ---");
    
    // モックデータソースを注入
    const mockDataSource = new MockDataSource();
    const reportGenerator = new ReportGenerator(mockDataSource);
    
    // 実際のデータベースに接続せずにテストできる！
    reportGenerator.generateReport("test-user");
}

testReportGenerator();
```

**実行結果:**

```
--- テスト実行 ---
Generating report with: Mock data for test-user
```

## まとめ

依存性逆転の原則を適用することで、依存関係が以下のようになりました。

- **違反例:** `ReportGenerator` → `MySQLDatabase` （上位 → 詳細）
- **準拠例:** `ReportGenerator` → `IDataSource` ← `MySQLDatabase` （上位 → 抽象 ← 詳細）

このように、具体的な実装（詳細）への依存の方向が「逆転」し、両者とも抽象（インターフェース）に依存するようになりました。

この原則はSOLID原則の集大成とも言え、他の原則（特にオープン・クローズドの原則）を支える重要な考え方です。これにより、システムは柔軟で、部品の交換が容易になり、非常にテストしやすい構造になるのです。
