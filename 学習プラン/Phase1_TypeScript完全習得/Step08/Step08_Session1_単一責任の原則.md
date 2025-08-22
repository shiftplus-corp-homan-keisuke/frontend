# Session1: 単一責任の原則（SRP）を TypeScript で理解する

ソフトウェア開発における重要な設計原則の一つに、**単一責任の原則（Single Responsibility Principle、SRP）**があります。これは、オブジェクト指向設計原則「SOLID」の最初の原則であり、「**一つのクラスやモジュールは、一つの責任だけを持つべきである**」という考え方です。

より具体的に言えば、「**変更するための理由が、一つのクラスに対して一つ以上あってはならない**」ということです。つまり、あるクラスを変更する理由が複数ある場合、そのクラスは複数の責任を持っている可能性があり、単一責任の原則に違反していることになります。

この原則に従うことで、コードはより理解しやすく、保守やテストが容易になります。

## なぜ単一責任の原則が重要なのか？

もし、あるクラスが複数の責任を持っていると、次のような問題が発生する可能性があります。

- **コードの複雑化:** 一つのクラスに多くの機能が詰め込まれていると、コードが複雑になり、理解するのが難しくなります。
- **変更の影響範囲の拡大:** ある機能の変更が、関係のないはずの別の機能に影響を与えてしまう「意図しない副作用」が発生しやすくなります。
- **テストの困難化:** クラスが多くのことに関与していると、テストの準備が複雑になり、テストケースの作成が難しくなります。
- **再利用性の低下:** 特定の機能だけを再利用したい場合に、不要な機能まで付いてきてしまい、再利用が困難になります。

## TypeScript での具体例

それでは、TypeScript のコード例を見ていきましょう。ここでは、ユーザー情報の管理と、ユーザー情報をデータベースに保存するという 2 つの責任を持つクラスを例に挙げます。

### 違反している例：

```typescript
class User {
  public name: string;
  public email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  // 責任1: ユーザー情報の管理
  getUserInfo() {
    return {
      name: this.name,
      email: this.email,
    };
  }

  // 責任2: データベースへの保存
  saveToDatabase() {
    // データベースにユーザー情報を保存するロジック
    console.log(`Saving ${this.name} to the database...`);
  }
}
```

この`User`クラスは、ユーザー情報を保持するという責任と、データベースに保存するという 2 つの異なる責任を持っています。これにより、例えばデータベースの仕様が変更された場合（責任 2 の変更）に、ユーザー情報の管理ロジック（責任 1）とは関係ないにもかかわらず、`User`クラスを修正する必要が出てきます。これは、単一責任の原則に違反しています。

### 準拠している例：

この問題を解決するために、それぞれの責任を別のクラスに分割します。

```typescript
// 責任1: ユーザー情報の管理に特化したクラス
class User {
  public name: string;
  public email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  getUserInfo() {
    return {
      name: this.name,
      email: this.email,
    };
  }
}

// 責任2: ユーザー情報をデータベースに保存することに特化したクラス
class UserRepository {
  save(user: User) {
    // データベースにユーザー情報を保存するロジック
    console.log(`Saving ${user.name} to the database...`);
  }
}

// 使用例
const user = new User("John Doe", "john.doe@example.com");
const userRepository = new UserRepository();

console.log(user.getUserInfo());
userRepository.save(user);
```

このようにクラスを分割することで、`User`クラスは純粋にユーザー情報を管理する責任だけを持ち、`UserRepository`クラスはデータベースとのやり取りに専念します。これにより、データベースの仕様が変更されても、修正が必要なのは`UserRepository`クラスだけであり、`User`クラスには影響がありません。

## 「変更するための理由」についての補足説明

「変更するための理由」という言葉は少し抽象的で分かりにくいかもしれません。

これを、もっと具体的な言葉に置き換えてみましょう。

「変更するための理由」とは、**「そのコードを、将来修正しなければならなくなる"きっかけ"や"動機"」**のことです。

言い換えると、**「どういう種類の仕様変更が来たら、このクラスを書き換える必要が出てくるか？」**と考えてみると分かりやすくなります。

### 具体的なシナリオで考えてみる

先ほどの、単一責任の原則（SRP）に違反している`User`クラスをもう一度見てみましょう。

```typescript
// SRP違反の例
class User {
  public name: string;
  public email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  // ユーザー情報に関する処理
  getUserInfo() {
    /* ... */
  }

  // データベースへの保存処理
  saveToDatabase() {
    // データベースにユーザー情報を保存するロジック
    console.log(`Saving ${this.name} to the database...`);
  }
}
```

この `User` クラスを**変更しなければならなくなるシナリオ**を考えてみましょう。

#### シナリオ 1：ユーザー情報の仕様変更

企画チームから「ユーザーに**電話番号**も登録できるようにしてほしい」という要求が来たとします。

この場合、あなたはこのように `User` クラスを変更する必要があります。

```typescript
class User {
  public name: string;
  public email: string;
  public phoneNumber: string; // ← 追加

  constructor(name: string, email: string, phoneNumber: string) {
    // ← 変更
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber; // ← 追加
  }
  // ...
}
```

これは**「ユーザーのデータ構造に関する変更」**という理由による修正です。

#### シナリオ 2：データ保存方法の仕様変更

インフラチームから「利用するデータベースを、現在のものから**新しい種類のデータベースに変更する**」という決定が伝えられたとします。

この場合、`saveToDatabase` メソッドの中身を、新しいデータベースの作法に合わせて書き直す必要があります。

```typescript
class User {
  // ...
  saveToDatabase() {
    // 新しいデータベースにユーザー情報を保存するロジックに全面変更
    console.log(`Saving ${this.name} to the NEW database...`);
  }
}
```

これは**「データの保存技術に関する変更」**という理由による修正です。

### 「理由」が複数あることの問題点

お気づきでしょうか？

この `User` クラスは、

1. **ユーザー情報の仕様**が変わったとき
2. **データベースの仕様**が変わったとき

という、**全く異なる 2 種類の理由**で変更される可能性があります。

これがまさに**「変更するための理由が 2 つある」**状態です。

一見問題なさそうに見えますが、例えば「ユーザー情報の管理担当者」と「データベースの管理担当者」が別々の場合、彼らは同じ `User.ts` というファイルを同時に編集することになり、混乱やバグの原因になります。

### 解決策：理由ごとにクラスを分ける

そこで、単一責任の原則に従ってクラスを分割します。

**`User` クラス：** ユーザー情報の管理にのみ責任を持つ

```typescript
class User {
  public name: string;
  public email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
  // ...
}
```

このクラスを変更する理由は、「ユーザーのデータ構造が変わったとき」**だけ**です。

**`UserRepository` クラス：** データベースへの保存にのみ責任を持つ

```typescript
class UserRepository {
  save(user: User) {
    // データベースにユーザー情報を保存するロジック
    console.log(`Saving ${user.name} to the database...`);
  }
}
```

このクラスを変更する理由は、「データの保存方法が変わったとき」**だけ**です。

## まとめ

「変更するための理由」とは、**そのコードが責任を持つ「関心事」や「役割」**と考えると分かりやすいです。

- ユーザー情報の管理という「役割」
- データベース永続化という「役割」

これらは異なる役割なので、それぞれ別のクラスが担当するべきです。そうすることで、片方の役割の仕様変更が、もう片方の役割に影響を与えなくなり、結果として非常に見通しが良く、メンテナンスしやすいコードになるのです。

単一責任の原則は、変更に強く、保守しやすいクリーンなコードを書くための基本的な指針です。クラスやモジュールを設計する際には、「このクラスを変更する理由は何か？」と自問し、その理由が一つだけになるように責務を分割することを心がけましょう。そうすることで、より堅牢でスケーラブルなアプリケーションを構築することができます。
