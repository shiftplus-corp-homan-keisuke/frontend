# Session2: オープン・クローズドの原則（OCP）を TypeScript で理解する

オープン・クローズドの原則は、「**ソフトウェアのエンティティ（クラス、モジュール、関数など）は、拡張に対しては開いて（open）いるべきだが、修正に対しては閉じて（closed）いるべきである**」という設計原則です。

これを、もっと簡単な言葉で言うと、

- **拡張に開いている (Open for Extension):** 新しい機能を追加することが容易にできる。
- **修正に閉じている (Closed for Modification):** 既存の動いているコードを、直接書き換える必要がない。

ということです。

## なぜオープン・クローズドの原則が重要なのか？

もし、新しい機能を追加するたびに既存のコードを**修正する**と、次のような問題が起こりがちです。

- **バグの発生（デグレード）:** 安定して動いていたはずの既存の機能に、予期せぬ不具合を生んでしまうリスクが高まります。
- **影響範囲の調査コスト:** 修正による影響がどこまで及ぶのか、毎回広範囲をテスト・確認する必要が出てきます。
- **コードの複雑化:** `if`文や`switch`文がどんどん増えていき、コードが複雑で読みにくく、メンテナンスが困難になります。

この原則を守ることで、**既存コードの安定性を保ちながら**、安全かつ効率的に新機能を**追加（拡張）**できるようになります。

## TypeScript での具体例

EC サイトで、商品の割引価格を計算する機能を例に見ていきましょう。

### 違反している例：

最初は、セール割引（10%オフ）だけを考慮した価格計算クラスがありました。

```typescript
// 割引の種類をenumで定義
enum DiscountType {
  Sale,
}

class PriceCalculator {
  calculate(price: number, discountType: DiscountType): number {
    if (discountType === DiscountType.Sale) {
      return price * 0.9; // 10%オフ
    }
    return price;
  }
}
```

このコードはシンプルで問題なく動きます。しかし、ある日「新しく**クーポン割引（500 円引き）**を追加してほしい」という要求が来たとします。

従来のアプローチでは、この `PriceCalculator` クラスの**中身を直接修正する**必要があります。

```typescript
// 割引の種類を追加
enum DiscountType {
  Sale,
  Coupon, // ← 追加
}

class PriceCalculator {
  calculate(price: number, discountType: DiscountType): number {
    if (discountType === DiscountType.Sale) {
      return price * 0.9;
    }
    // 👇 新しい割引のために、既存のクラスの中身を修正した
    if (discountType === DiscountType.Coupon) {
      return price - 500;
    }
    return price;
  }
}
```

さらに「会員割引」「タイムセール割引」…と追加されるたびに、この`if`文はどんどん長くなっていきます。これは、新しい機能を追加するたびに既存の`PriceCalculator`クラスを**修正**しているので、「修正に対して閉じている」原則に違反しています。

### 準拠している例：

この問題を解決するために、**抽象化（インターフェース）**を利用します。「割引のルール」という共通の概念をインターフェースとして定義し、具体的な割引処理を別のクラスに任せます。

**ステップ 1: 割引ルールの共通インターフェースを定義する**

```typescript
// 割引戦略のインターフェース
interface IDiscountStrategy {
  apply(price: number): number;
}
```

このインターフェースは、「価格を受け取り、割引後の価格を返す」という契約（ルール）を定めています。

**ステップ 2: 具体的な割引ルールをクラスとして実装する**

```typescript
// セール割引
class SaleDiscount implements IDiscountStrategy {
  apply(price: number): number {
    return price * 0.9; // 10%オフ
  }
}

// クーポン割引
class CouponDiscount implements IDiscountStrategy {
  apply(price: number): number {
    return Math.max(0, price - 500); // 500円引き（マイナスにならないように）
  }
}
```

**ステップ 3: PriceCalculator を修正し、インターフェースに依存させる**

`PriceCalculator`は、具体的な割引方法を知る必要がなくなります。代わりに、`IDiscountStrategy`というルールに従うオブジェクト（インスタンス）を受け取るようにします。

```typescript
class PriceCalculator {
  // どんな割引ルール(戦略)が来るかは知らない。
  // IDiscountStrategyのルールを守ってさえいればOK。
  calculate(price: number, strategy: IDiscountStrategy): number {
    return strategy.apply(price);
  }
}
```

この`PriceCalculator`は、もはや割引の種類が増えても**修正する**必要がありません。「修正に対して閉じた」状態になりました。

### 新機能の追加（拡張）

さて、ここで「新しく**会員割引（20%オフ）**を追加してほしい」という要求が来たとします。

この場合、私たちは`PriceCalculator`を一切**修正する**ことなく、新しいクラスを**追加する（拡張する）**だけで対応できます。

```typescript
// ✨ 新しい会員割引クラスを追加するだけ（拡張） ✨
class MemberDiscount implements IDiscountStrategy {
  apply(price: number): number {
    return price * 0.8; // 20%オフ
  }
}

// --- 使用例 ---
const calculator = new PriceCalculator();
const price = 10000;

const saleStrategy = new SaleDiscount();
console.log(`セール価格: ${calculator.calculate(price, saleStrategy)}`); // 出力: セール価格: 9000

const couponStrategy = new CouponDiscount();
console.log(`クーポン適用価格: ${calculator.calculate(price, couponStrategy)}`); // 出力: クーポン適用価格: 9500

// 新しく追加した会員割引も、既存のコードを書き換えずに利用できる！
const memberStrategy = new MemberDiscount();
console.log(`会員価格: ${calculator.calculate(price, memberStrategy)}`); // 出力: 会員価格: 8000
```

このように、新しい割引ルールは新しいクラスとして**拡張**できます。そして、既存の`PriceCalculator`は一切**修正**する必要がありません。これこそが「拡張にはオープン、修正にはクローズ」な設計です。

## Angular での具体例

Angular アプリケーションでも、オープン・クローズドの原則は非常に重要です。特に、バリデーター機能やデータ処理パイプラインなどで威力を発揮します。

### 違反している例（Angular）：

フォームバリデーション機能を例に見てみましょう。最初はメールバリデーションのみ対応していました。

```typescript
// validators/form-validator.service.ts - 初期バージョン
import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";

export enum ValidationType {
  EMAIL = "email",
}

@Injectable({
  providedIn: "root",
})
export class FormValidatorService {
  validate(
    control: AbstractControl,
    type: ValidationType
  ): ValidationErrors | null {
    if (type === ValidationType.EMAIL) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (control.value && !emailRegex.test(control.value)) {
        return { email: { message: "有効なメールアドレスを入力してください" } };
      }
    }
    return null;
  }
}
```

しかし、新しい要求が次々と来ました：

- 「電話番号バリデーションを追加してほしい」
- 「パスワード強度チェックを追加してほしい」
- 「カスタム文字列長チェックを追加してほしい」

従来のアプローチでは、毎回`FormValidatorService`を**修正**する必要があります：

```typescript
// validators/form-validator.service.ts - 修正版（OCP違反）
import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";

// 新しい種類を追加するたびに修正が必要
export enum ValidationType {
  EMAIL = "email",
  PHONE = "phone", // ← 追加
  PASSWORD = "password", // ← 追加
  CUSTOM_LENGTH = "length", // ← 追加
}

@Injectable({
  providedIn: "root",
})
export class FormValidatorService {
  validate(
    control: AbstractControl,
    type: ValidationType,
    options?: any
  ): ValidationErrors | null {
    // 新しいバリデーションを追加するたびに、このメソッドを修正する必要がある
    if (type === ValidationType.EMAIL) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (control.value && !emailRegex.test(control.value)) {
        return { email: { message: "有効なメールアドレスを入力してください" } };
      }
    }

    // 👇 新しい機能のために既存のメソッドを修正（OCP違反）
    if (type === ValidationType.PHONE) {
      const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
      if (control.value && !phoneRegex.test(control.value)) {
        return {
          phone: { message: "電話番号は000-0000-0000の形式で入力してください" },
        };
      }
    }

    if (type === ValidationType.PASSWORD) {
      if (control.value && control.value.length < 8) {
        return {
          password: { message: "パスワードは8文字以上で入力してください" },
        };
      }
    }

    if (type === ValidationType.CUSTOM_LENGTH) {
      const minLength = options?.minLength || 0;
      const maxLength = options?.maxLength || Infinity;
      if (
        control.value &&
        (control.value.length < minLength || control.value.length > maxLength)
      ) {
        return {
          customLength: {
            message: `文字数は${minLength}文字以上${maxLength}文字以下で入力してください`,
          },
        };
      }
    }

    return null;
  }
}
```

この設計の問題点：

- 新しいバリデーションが必要になるたびに`FormValidatorService`を修正する必要がある
- `validate`メソッドがどんどん長くなり、複雑になる
- 一つのバリデーション修正が他のバリデーションに影響を与えるリスク

### 準拠している例（Angular）：

オープン・クローズドの原則に従って、バリデーション戦略を抽象化します。

**ステップ 1: バリデーション戦略のインターフェースを定義**

```typescript
// interfaces/validator.interface.ts
import { AbstractControl, ValidationErrors } from "@angular/forms";

export interface IValidator {
  validate(control: AbstractControl, options?: any): ValidationErrors | null;
  getErrorMessage(errors: ValidationErrors): string;
}
```

**ステップ 2: 具体的なバリデーション戦略を個別のクラスとして実装**

```typescript
// validators/email-validator.ts
import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { IValidator } from "../interfaces/validator.interface";

@Injectable({
  providedIn: "root",
})
export class EmailValidator implements IValidator {
  validate(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!control.value) {
      return null; // 空の場合は他のバリデーター（required）に任せる
    }

    if (!emailRegex.test(control.value)) {
      return { email: { message: "有効なメールアドレスを入力してください" } };
    }

    return null;
  }

  getErrorMessage(errors: ValidationErrors): string {
    return errors["email"]?.message || "メールアドレスが無効です";
  }
}

// validators/phone-validator.ts
@Injectable({
  providedIn: "root",
})
export class PhoneValidator implements IValidator {
  validate(
    control: AbstractControl,
    options?: { format?: string }
  ): ValidationErrors | null {
    const format = options?.format || "xxx-xxxx-xxxx";
    const phoneRegex =
      format === "xxx-xxxx-xxxx" ? /^\d{3}-\d{4}-\d{4}$/ : /^\d{11}$/;

    if (!control.value) {
      return null;
    }

    if (!phoneRegex.test(control.value)) {
      return {
        phone: {
          message: `電話番号は${format}の形式で入力してください`,
          actualFormat: format,
        },
      };
    }

    return null;
  }

  getErrorMessage(errors: ValidationErrors): string {
    return errors["phone"]?.message || "電話番号が無効です";
  }
}

// validators/password-strength-validator.ts
@Injectable({
  providedIn: "root",
})
export class PasswordStrengthValidator implements IValidator {
  validate(
    control: AbstractControl,
    options?: { minLength?: number; requireSpecial?: boolean }
  ): ValidationErrors | null {
    const minLength = options?.minLength || 8;
    const requireSpecial = options?.requireSpecial || false;

    if (!control.value) {
      return null;
    }

    const errors: any = {};

    if (control.value.length < minLength) {
      errors.minLength = {
        message: `パスワードは${minLength}文字以上で入力してください`,
        requiredLength: minLength,
      };
    }

    if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(control.value)) {
      errors.specialChar = {
        message: "パスワードには特殊文字を含めてください",
      };
    }

    if (Object.keys(errors).length > 0) {
      return { password: errors };
    }

    return null;
  }

  getErrorMessage(errors: ValidationErrors): string {
    const passwordErrors = errors["password"];
    if (passwordErrors.minLength) return passwordErrors.minLength.message;
    if (passwordErrors.specialChar) return passwordErrors.specialChar.message;
    return "パスワードが要件を満たしていません";
  }
}
```

**ステップ 3: バリデーター管理サービスを作成**

```typescript
// services/validator-manager.service.ts
import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { IValidator } from "../interfaces/validator.interface";

@Injectable({
  providedIn: "root",
})
export class ValidatorManagerService {
  // バリデーターの実行 - 新しいバリデーターが追加されても修正不要
  executeValidator(
    validator: IValidator,
    control: AbstractControl,
    options?: any
  ): ValidationErrors | null {
    return validator.validate(control, options);
  }

  // 複数のバリデーターを組み合わせる
  combineValidators(validators: { validator: IValidator; options?: any }[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      let combinedErrors: ValidationErrors = {};

      for (const { validator, options } of validators) {
        const errors = validator.validate(control, options);
        if (errors) {
          combinedErrors = { ...combinedErrors, ...errors };
        }
      }

      return Object.keys(combinedErrors).length > 0 ? combinedErrors : null;
    };
  }

  // エラーメッセージの取得
  getErrorMessages(
    errors: ValidationErrors,
    validators: IValidator[]
  ): string[] {
    const messages: string[] = [];

    for (const validator of validators) {
      try {
        const message = validator.getErrorMessage(errors);
        if (message) {
          messages.push(message);
        }
      } catch (e) {
        // このバリデーターに関連するエラーがない場合は無視
      }
    }

    return messages;
  }
}
```

**ステップ 4: Angular コンポーネントでの使用**

```typescript
// components/user-form.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidatorManagerService } from "../services/validator-manager.service";
import { EmailValidator } from "../validators/email-validator";
import { PhoneValidator } from "../validators/phone-validator";
import { PasswordStrengthValidator } from "../validators/password-strength-validator";

@Component({
  selector: "app-user-form",
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline">
        <mat-label>メールアドレス</mat-label>
        <input matInput formControlName="email" type="email" />
        <mat-error
          *ngIf="
            userForm.get('email')?.errors && userForm.get('email')?.touched
          "
        >
          {{ getErrorMessage("email") }}
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>電話番号</mat-label>
        <input matInput formControlName="phone" placeholder="000-0000-0000" />
        <mat-error
          *ngIf="
            userForm.get('phone')?.errors && userForm.get('phone')?.touched
          "
        >
          {{ getErrorMessage("phone") }}
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>パスワード</mat-label>
        <input matInput formControlName="password" type="password" />
        <mat-error
          *ngIf="
            userForm.get('password')?.errors &&
            userForm.get('password')?.touched
          "
        >
          {{ getErrorMessage("password") }}
        </mat-error>
      </mat-form-field>

      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="userForm.invalid"
      >
        登録
      </button>
    </form>
  `,
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;

  private validatorMap = new Map<string, IValidator[]>();

  constructor(
    private fb: FormBuilder,
    private validatorManager: ValidatorManagerService,
    private emailValidator: EmailValidator,
    private phoneValidator: PhoneValidator,
    private passwordValidator: PasswordStrengthValidator
  ) {}

  ngOnInit() {
    this.initForm();
    this.setupValidatorMap();
  }

  private initForm() {
    this.userForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          this.validatorManager.combineValidators([
            { validator: this.emailValidator },
          ]),
        ],
      ],
      phone: [
        "",
        [
          Validators.required,
          this.validatorManager.combineValidators([
            {
              validator: this.phoneValidator,
              options: { format: "xxx-xxxx-xxxx" },
            },
          ]),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          this.validatorManager.combineValidators([
            {
              validator: this.passwordValidator,
              options: { minLength: 10, requireSpecial: true },
            },
          ]),
        ],
      ],
    });
  }

  private setupValidatorMap() {
    this.validatorMap.set("email", [this.emailValidator]);
    this.validatorMap.set("phone", [this.phoneValidator]);
    this.validatorMap.set("password", [this.passwordValidator]);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (!control?.errors) return "";

    const validators = this.validatorMap.get(fieldName) || [];
    const messages = this.validatorManager.getErrorMessages(
      control.errors,
      validators
    );
    return messages[0] || "入力に誤りがあります";
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log("フォームデータ:", this.userForm.value);
      // API送信処理など
    } else {
      console.log("フォームにエラーがあります");
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched() {
    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.get(key)?.markAsTouched();
    });
  }
}
```

### 新機能の追加（拡張）

新しく「日本の郵便番号バリデーション」が必要になった場合、既存のコードを一切修正せずに新しいバリデーターを追加できます：

```typescript
// validators/postal-code-validator.ts - 新しいバリデーターを追加（拡張）
@Injectable({
  providedIn: "root",
})
export class PostalCodeValidator implements IValidator {
  validate(
    control: AbstractControl,
    options?: { country?: "JP" | "US" }
  ): ValidationErrors | null {
    const country = options?.country || "JP";

    if (!control.value) {
      return null;
    }

    let regex: RegExp;
    let message: string;

    switch (country) {
      case "JP":
        regex = /^\d{3}-\d{4}$/;
        message = "郵便番号は000-0000の形式で入力してください";
        break;
      case "US":
        regex = /^\d{5}(-\d{4})?$/;
        message = "郵便番号は00000または00000-0000の形式で入力してください";
        break;
      default:
        return { postalCode: { message: "サポートされていない国です" } };
    }

    if (!regex.test(control.value)) {
      return { postalCode: { message, country } };
    }

    return null;
  }

  getErrorMessage(errors: ValidationErrors): string {
    return errors["postalCode"]?.message || "郵便番号が無効です";
  }
}

// components/user-form.component.ts での使用（既存コードをほとんど修正せずに拡張）
export class UserFormComponent implements OnInit {
  constructor(
    // ... 既存のinjection
    private postalCodeValidator: PostalCodeValidator // ← 新しいバリデーターを追加
  ) {}

  private initForm() {
    this.userForm = this.fb.group({
      // ... 既存のフィールド
      postalCode: [
        "",
        [
          // ← 新しいフィールドを追加
          Validators.required,
          this.validatorManager.combineValidators([
            { validator: this.postalCodeValidator, options: { country: "JP" } },
          ]),
        ],
      ],
    });
  }

  private setupValidatorMap() {
    // ... 既存のマップ設定
    this.validatorMap.set("postalCode", [this.postalCodeValidator]); // ← 新しいマッピングを追加
  }
}
```

### 分離後のメリット（Angular）：

1. **拡張性**: 新しいバリデーターを追加しても既存コードを修正する必要がない

2. **再利用性**: 各バリデーターを他のコンポーネントでも独立して使用できる

3. **テスタビリティ**: 各バリデーターを個別にテストできる

```typescript
// email-validator.spec.ts - 単体テスト例
describe("EmailValidator", () => {
  let validator: EmailValidator;

  beforeEach(() => {
    validator = new EmailValidator();
  });

  it("有効なメールアドレスの場合はnullを返す", () => {
    const control = { value: "test@example.com" } as AbstractControl;
    expect(validator.validate(control)).toBeNull();
  });

  it("無効なメールアドレスの場合はエラーを返す", () => {
    const control = { value: "invalid-email" } as AbstractControl;
    const result = validator.validate(control);
    expect(result).toEqual({
      email: { message: "有効なメールアドレスを入力してください" },
    });
  });
});
```

4. **保守性**: 一つのバリデーションロジックの修正が他に影響しない

5. **設定の柔軟性**: 各バリデーターにオプションを渡して動作をカスタマイズできる

この設計により、Angular アプリケーションでもオープン・クローズドの原則が守られ、新機能の追加が安全かつ効率的に行えるようになります。

## まとめ

オープン・クローズドの原則は、将来の要求仕様を見越して、コードを柔軟に保つための重要な考え方です。

- **変わりやすい部分**（今回の例では「割引の計算方法」）を見つけ出す。
- その部分を**インターフェースとして抽象化**する。
- 具体的な処理は、そのインターフェースを実装した個別のクラスに担当させる。

このアプローチ（ストラテジーパターンとも呼ばれます）により、システムのコア部分の安定性を損なうことなく、**新しいクラスの追加（拡張）だけで**安全に新しい機能を追加していくことが可能になります。

### 🔑 重要なポイント

- **❌ 修正**: 既存のコードの中身を直接書き換えること
- **✅ 拡張**: 新しいクラスやモジュールを追加すること
- **目標**: 「拡張は歓迎、修正は避ける」設計を心がける
