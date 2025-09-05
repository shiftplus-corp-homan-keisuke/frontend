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

## Angular での具体例

Angular アプリケーションでも、同様に SRP を適用することができます。ここでは、ユーザー管理機能を Angular で実装する例を見てみましょう。

### 違反している例（Angular）：

```typescript
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-user",
  template: `
    <div>
      <h2>ユーザー管理</h2>
      <form [formGroup]="userForm" (ngSubmit)="saveUser()">
        <input formControlName="name" placeholder="名前" />
        <input formControlName="email" placeholder="メール" />
        <button type="submit">保存</button>
      </form>
      <div *ngIf="message">{{ message }}</div>
    </div>
  `,
})
export class UserComponent {
  userForm: FormGroup;
  message = "";

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  // 責任1: ユーザー情報のバリデーション
  validateUser(): boolean {
    if (this.userForm.get("name")?.value?.length < 2) {
      this.message = "名前は2文字以上入力してください";
      return false;
    }
    if (!this.userForm.get("email")?.valid) {
      this.message = "有効なメールアドレスを入力してください";
      return false;
    }
    return true;
  }

  // 責任2: HTTP通信でのデータ保存
  saveUser() {
    if (!this.validateUser()) {
      return;
    }

    const userData = this.userForm.value;
    this.http.post("/api/users", userData).subscribe({
      next: () => {
        this.message = "ユーザーが保存されました";
        this.userForm.reset();
      },
      error: (error) => {
        this.message = "エラーが発生しました: " + error.message;
      },
    });
  }

  // 責任3: UI状態の管理
  resetForm() {
    this.userForm.reset();
    this.message = "";
  }
}
```

このコンポーネントは、以下の 3 つの責任を持っています：

1. ユーザー情報のバリデーション
2. HTTP 通信でのデータ保存
3. UI 状態の管理

### 準拠している例（Angular）：

責任を分離してより良い設計にしてみましょう。

```typescript
// models/user.model.ts - ユーザーデータの定義
export interface User {
  name: string;
  email: string;
}

// services/user-validation.service.ts - バリデーション専用サービス
import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

@Injectable({
  providedIn: "root",
})
export class UserValidationService {
  // Angular用のカスタムバリデーター関数を提供
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || value.length < 2) {
        return { nameLength: { message: "名前は2文字以上入力してください" } };
      }
      return null;
    };
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return { required: { message: "メールアドレスは必須です" } };
      }
      if (!value.includes("@") || !value.includes(".")) {
        return {
          emailFormat: { message: "有効なメールアドレスを入力してください" },
        };
      }
      return null;
    };
  }

  // ビジネスレベルのバリデーション（APIサブミット前）
  validateForSubmit(user: User): ValidationResult {
    // より複雑なビジネスルールがある場合はここで実装
    if (user.email.endsWith("@example.com")) {
      return {
        isValid: false,
        message: "テスト用のメールアドレスは使用できません",
      };
    }
    return { isValid: true };
  }
}

// services/user-api.service.ts - API通信専用サービス
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserApiService {
  constructor(private http: HttpClient) {}

  saveUser(user: User): Observable<any> {
    return this.http.post("/api/users", user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>("/api/users");
  }
}

// components/user.component.ts - UI表示・操作専用コンポーネント
import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UserValidationService } from "../services/user-validation.service";
import { UserApiService } from "../services/user-api.service";
import { User } from "../models/user.model";

@Component({
  selector: "app-user",
  template: `
    <div>
      <h2>ユーザー管理</h2>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div>
          <input formControlName="name" placeholder="名前" />
          <div
            *ngIf="userForm.get('name')?.errors?.['nameLength']"
            class="error"
          >
            {{ userForm.get('name')?.errors?.['nameLength']?.message }}
          </div>
        </div>

        <div>
          <input formControlName="email" placeholder="メール" />
          <div
            *ngIf="userForm.get('email')?.errors?.['required']"
            class="error"
          >
            {{ userForm.get('email')?.errors?.['required']?.message }}
          </div>
          <div
            *ngIf="userForm.get('email')?.errors?.['emailFormat']"
            class="error"
          >
            {{ userForm.get('email')?.errors?.['emailFormat']?.message }}
          </div>
        </div>

        <button type="submit" [disabled]="userForm.invalid">保存</button>
        <button type="button" (click)="resetForm()">リセット</button>
      </form>
      <div *ngIf="message" [class]="messageClass">{{ message }}</div>
    </div>
  `,
})
export class UserComponent {
  userForm: FormGroup;
  message = "";
  messageClass = "";

  constructor(
    private fb: FormBuilder,
    private userValidation: UserValidationService,
    private userApi: UserApiService
  ) {
    // バリデーションロジックを完全にサービスに委任
    this.userForm = this.fb.group({
      name: ["", [this.userValidation.nameValidator()]],
      email: ["", [this.userValidation.emailValidator()]],
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.showMessage("入力内容を確認してください", "error");
      return;
    }

    const userData: User = this.userForm.value;

    // ビジネスレベルのバリデーションチェック
    const validationResult = this.userValidation.validateForSubmit(userData);

    if (!validationResult.isValid) {
      this.showMessage(validationResult.message!, "error");
      return;
    }

    // API通信を専用サービスに委任
    this.userApi.saveUser(userData).subscribe({
      next: () => {
        this.showMessage("ユーザーが保存されました", "success");
        this.resetForm();
      },
      error: (error) => {
        this.showMessage("エラーが発生しました: " + error.message, "error");
      },
    });
  }

  resetForm() {
    this.userForm.reset();
    this.message = "";
  }

  private showMessage(message: string, type: "success" | "error") {
    this.message = message;
    this.messageClass = type;
  }
}
```

### 分離後のメリット：

1. **`UserValidationService`**: すべてのバリデーションロジックを一元管理

   - **Angular Validators 統合**: カスタム ValidatorFn を提供して Reactive Forms と完全統合
   - **リアルタイムバリデーション**: フォーム入力中に即座にエラー表示
   - **ビジネスルール**: より複雑な業務ルール（例：特定ドメインの禁止）を一箇所で管理
   - **再利用可能**: 他のコンポーネントでも同じバリデーションルールを使用可能
   - **テスト容易**: バリデーションロジックを独立してテスト可能

2. **`UserApiService`**: API 通信のみに集中

   - API エンドポイント変更時の影響範囲が限定される
   - 他の機能（ユーザー一覧表示など）でも再利用可能

3. **`UserComponent`**: UI 表示・操作のみに集中
   - **単純な UI 制御**: フォームの状態管理とイベントハンドリングのみ
   - **バリデーション表示**: サービスから提供されたエラーメッセージの表示のみ
   - **疎結合**: バリデーションロジック変更がコンポーネントに影響しない

### バリデーション設計のポイント：

**✅ 単一責任の原則に完全準拠:**

- **UserValidationService**: すべてのバリデーション責任を一箇所に集約
- **UserComponent**: UI 表示・操作のみに責任を限定

**✅ Angular ベストプラクティス:**

- **Reactive Forms 統合**: カスタム ValidatorFn で Angular の仕組みと完全統合
- **リアルタイムフィードバック**: ユーザー入力時に即座にバリデーション結果を表示
- **型安全性**: ValidationErrors インターフェースで型安全なエラーハンドリング

**✅ 保守性・拡張性:**

- バリデーションルール追加時は`UserValidationService`のみ変更
- 他のフォームコンポーネントでも同じバリデーターを再利用可能
- テストはサービス単位で独立して実行可能

この設計により、各部分が独立して変更・テスト・再利用できるようになり、保守性の高い Angular アプリケーションを構築することができます。

## 単一責任の原則のデメリットとトレードオフ

単一責任の原則（SRP）は、コードの保守性を高めるための強力な指針ですが、銀の弾丸ではありません。この原則を適用する際には、いくつかのデメリットやトレードオフを理解しておくことが重要です。特に、原則を「やりすぎる」と、かえってコードの品質を下げてしまう可能性があります。

### 1. クラス数の増加と管理コスト

最も直接的なデメリットは、**クラスの数が爆発的に増える**ことです。

- **ファイル数の増加**: 1 つのクラスが 1 つのファイルに対応する場合、プロジェクト内のファイル数が非常に多くなります。
- **全体像の把握が困難に**: クラスが細かく分割されすぎると、ある機能の全体像を理解するために多数のファイルやクラスを飛び回る必要が出てきます。これにより、個々のクラスは単純でも、システム全体の構造が複雑に感じられることがあります。

### 2. コードの断片化と追跡の困難さ

責任を分割すると、関連するロジックが複数のクラスに分散します。

- **処理の流れが追いづらい**: 1 つのビジネスロジックを理解するために、複数のクラス間の呼び出し関係を追跡する必要があり、デバッグや仕様変更時の調査が困難になることがあります。
- **ボイラープレートコードの増加**: クラス間の連携やデータの受け渡しのために、インターフェースの定義や DI（Dependency Injection）の設定など、本来のロジックとは直接関係ない「つなぎ」のためのコードが増える傾向があります。

> **用語解説：ボイラープレート（Boilerplate）とは？**
>
> プログラミングにおける「ボイラープレート」とは、**「様々な場所で繰り返し必要になる、定型的なコード」**を指す言葉です。
>
> この言葉は、かつて新聞業界で、定型的な記事や広告を印刷するための「ボイラープレート（鋼の圧延板）」と呼ばれる金属板を配布していたことに由来します。どの新聞でも同じように使える、まさに「お決まりの文章」でした。
>
> プログラミングでは、以下のようなものがボイラープレートに当たります。
>
> - フレームワークを使い始めるための初期設定コード
> - クラスの基本的な定義やコンストラクタ
> - データベースへの接続・切断処理
> - 今回のように、クラス間でデータを受け渡すためのインターフェース定義や DI の設定
>
> ボイラープレート自体は、プログラムを動かすために必要なものですが、多すぎると本質的なロジックが埋もれてしまい、コードの可読性を下げてしまうことがあります。単一責任の原則を過剰に適用すると、クラス間の連携が増えるため、このボイラープレートコードが増加する傾向にあります。

### 3. 過剰な抽象化（Over-engineering）

SRP を厳密に適用しようとしすぎると、**過剰な設計**に陥りがちです。

- **不必要な複雑さ**: 将来の変更を見越して細かく分割しすぎた結果、現在の要求に対して不必要に複雑な構造になってしまうことがあります。
- **「責任」の定義の難しさ**: 何を「一つの責任」と見なすかは主観的であり、明確な境界線を引くのが難しい場合があります。この判断を誤ると、不自然な分割や、逆に不十分な分割につながります。

### トレードオフの理解とバランス感覚

SRP を適用する際は、メリットとデメリットのトレードオフを意識することが重要です。

| メリット（適切に適用した場合）           | デメリット（過剰に適用した場合）                             |
| :--------------------------------------- | :----------------------------------------------------------- |
| **高い凝集度**：関連するコードがまとまる | **コードの断片化**：ロジックが分散する                       |
| **低い結合度**：クラス間の依存が減る     | **複雑な依存関係**：クラス間の連携が複雑になる               |
| **変更が容易**：影響範囲が限定される     | **変更が困難**：複数クラスの修正が必要になる                 |
| **テストが容易**：独立してテストできる   | **統合テストが複雑**：複数クラスの連携をテストする必要がある |
| **再利用性が高い**：必要な機能だけ使える | **再利用性が低い**：細かすぎて単体で役に立たない             |

### 結論：SRP は「銀の弾丸」ではない

単一責任の原則は、あくまで「原則」であり、「絶対的なルール」ではありません。

大切なのは、**「変更を容易にする」という本来の目的**を見失わないことです。クラスを分割することで、将来の変更が楽になるかどうかを常に考え、機械的に分割するのではなく、プロジェクトの規模や複雑さ、チームの開発スタイルに応じて、適切な粒度で責任を分割する**バランス感覚**が求められます。

## まとめ

「変更するための理由」とは、**そのコードが責任を持つ「関心事」や「役割」**と考えると分かりやすいです。

- ユーザー情報の管理という「役割」
- データベース永続化という「役割」

これらは異なる役割なので、それぞれ別のクラスが担当するべきです。そうすることで、片方の役割の仕様変更が、もう片方の役割に影響を与えなくなり、結果として非常に見通しが良く、メンテナンスしやすいコードになるのです。

単一責任の原則は、変更に強く、保守しやすいクリーンなコードを書くための基本的な指針です。クラスやモジュールを設計する際には、「このクラスを変更する理由は何か？」と自問し、その理由が一つだけになるように責務を分割することを心がけましょう。そうすることで、より堅牢でスケーラブルなアプリケーションを構築することができます。
