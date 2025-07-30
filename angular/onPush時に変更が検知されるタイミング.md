### 1. 前提: 2 つの変更検知戦略

Angular には、コンポーネントがいつ再レンダリングされるかを決定する 2 つの戦略があります。

| 戦略     | `ChangeDetectionStrategy.Default` (デフォルト)                                                                                                                        | `ChangeDetectionStrategy.OnPush`                                               |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **挙動** | **「念のため全部チェック」**                                                                                                                                          | **「理由がなければチェックしない」**                                           |
| **説明** | アプリケーションで**何か**（クリック、タイマー、HTTP リクエストなど）が発生するたびに、コンポーネントツリーの**すべて**のコンポーネントを上から下までチェックします。 | コンポーネントは、特定の条件が満たされた場合にのみ、変更検知の対象となります。 |
| **性能** | 小規模アプリでは問題になりにくいですが、大規模になると不要なチェックが増え、パフォーマンスが低下する可能性があります。                                                | 変更検知の実行回数が劇的に減るため、**パフォーマンスが大幅に向上します**。     |

`OnPush`を設定するには、コンポーネントのデコレーターに以下のように追加します。

```typescript
import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush, // ここで設定
})
export class UserProfileComponent {
  // ...
}
```

---

### 2. `OnPush`コンポーネントで変更が検知される「4 つの条件」

`OnPush`を設定したコンポーネントは、以下のいずれかの条件が満たされたときに**のみ**、変更検知が実行され、ビューが更新されます。

#### ① `@Input()`プロパティへの参照が新しくなった時

これが `OnPush`の最も基本となるルールです。

- **検知されるケース**: `@Input`に渡されるオブジェクトや配列の**参照（リファレンス）そのもの**が新しいものに置き換わった場合。
- **検知されないケース**: 渡されたオブジェクトや配列の**内部のプロパティだけ**を変更（ミューテーション）した場合。

**例：**

**親コンポーネントの TypeScript (`parent.component.ts`)**

```typescript
import { Component } from "@angular/core";
import { User } from "./user.model";

@Component({
  selector: "app-parent",
  template: `
    <h2>Parent Component</h2>
    <button (click)="changeUserName()">Change User Name (❌ Won't work)</button>
    <button (click)="createNewUser()">Create New User (✅ Will work)</button>
    <app-user-profile [user]="currentUser"></app-user-profile>
  `,
})
export class ParentComponent {
  currentUser: User = { id: 1, name: "Alice" };

  // ❌ これはOnPushでは検知されない
  changeUserName() {
    // オブジェクトの参照は変えずに、内部のプロパティだけ変更
    this.currentUser.name = "Bob";
  }

  // ✅ これはOnPushで検知される
  createNewUser() {
    // スプレッド構文(...)で新しいオブジェクトを作成し、参照を新しくする
    this.currentUser = { ...this.currentUser, name: "Charlie" };
  }
}
```

**子コンポーネント (`user-profile.component.ts`)**

```typescript
@Component({
  selector: "app-user-profile",
  template: `
    <h3>Child Component (OnPush)</h3>
    <p>User ID: {{ user.id }}</p>
    <p>User Name: {{ user.name }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  @Input() user!: User;
}
```

`changeUserName()`ボタンを押しても、`app-user-profile`から見ると `currentUser`の参照（メモリ上の住所）は変わっていないため、変更が検知されず、画面は「Alice」のままです。
一方、`createNewUser()`ボタンを押すと、新しいオブジェクトが作成されて渡されるため、参照が変わり、変更が検知されて画面が「Charlie」に更新されます。これは**イミュータブル（不変）なデータ操作**と呼ばれ、`OnPush`戦略の基本です。

#### ② そのコンポーネント自身（またはその子）で DOM イベントが発生した時

`OnPush`コンポーネントのテンプレート内で `(click)`や `(submit)`などのイベントが発生した場合、Angular はそのコンポーネントと親に向かって変更検知を自動的に実行します。

**例：**

```typescript
@Component({
  selector: "app-on-push-counter",
  template: `
    <p>Count: {{ count }}</p>
    <!-- このボタンをクリックすると、このコンポーネントは自動で変更検知される -->
    <button (click)="increment()">Increment</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnPushCounterComponent {
  count = 0;

  increment() {
    this.count++;
  }
}
```

`increment()`メソッドで `count`プロパティが変更されても、それが画面に反映されるのは、`(click)`イベントが Angular に変更検知の実行を伝えたからです。

#### ③ `async`パイプが新しい値を受け取った時

`Observable`や `Promise`をテンプレートで扱う場合、`async`パイプは `OnPush`戦略と非常に相性が良いです。`async`パイプは、非同期ソースから新しい値を受け取るたびに、**自動的に変更検知をスケジュールします**。

**例：**

```typescript
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable, interval } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-clock",
  template: `
    <!-- asyncパイプが新しい値を受け取るたびに、ビューが更新される -->
    <p>Current Time: {{ time$ | async }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent {
  time$: Observable<string>;

  constructor() {
    this.time$ = interval(1000).pipe(
      map(() => new Date().toLocaleTimeString())
    );
  }
}
```

このコンポーネントは、`interval`が 1 秒ごとに新しい値を放出するたびに、`async`パイプのおかげで正しく時刻を更新します。自分で `subscribe`して値を更新するよりも、はるかにクリーンで安全です。

#### ④ 手動で変更検知を要求した時

上記の条件に当てはまらないが、どうしても変更をビューに反映させたい場合があります。例えば、`setTimeout`や `WebSocket`のイベントなど、Angular が直接関知しない非同期処理の結果を反映させたい時です。

その場合は `ChangeDetectorRef`を注入して、手動で変更検知をトリガーします。

- **`cdr.markForCheck()` (推奨)**

  - このコンポーネントと、ルートコンポーネントまでのすべての親コンポーネントに**「要チェック」のマークを付けます**。
  - 実際の変更検知は、**次の検知サイクル**で実行されます。
  - 安全で、ほとんどのケースでこのメソッドを使います。

- **`cdr.detectChanges()`**

  - このコンポーネントとその子コンポーネントの変更検知を**即座に、同期的**に実行します。
  - `markForCheck()`よりも強力ですが、ライフサイクルフックの途中で呼び出すと予期せぬ動作をすることがあるため、注意が必要です。

**例：**

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";

@Component({
  selector: "app-manual-check",
  template: ` <p>Message: {{ message }}</p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualCheckComponent {
  message = "Initial message";

  constructor(private cdr: ChangeDetectorRef) {
    // Angularが関知しない非同期処理
    setTimeout(() => {
      this.message = "Updated after 2 seconds";

      // このままではビューは更新されない！
      // 手動で変更検知をスケジュールする
      this.cdr.markForCheck();
    }, 2000);
  }
}
```

---

### まとめ

`ChangeDetectionStrategy.OnPush`をマスターすることは、Angular アプリケーションのパフォーマンスを向上させる上で非常に効果的です。

- **基本はイミュータブルなデータ操作**: `@Input`は常に新しい参照を渡す。
- **`async`パイプを積極的に活用する**: `Observable`との組み合わせでコードがシンプルかつ安全になる。
- **イベントは自動で検知される**ので心配不要。
- どうしてもの時は**`cdr.markForCheck()`**で手動トリガーする。

この戦略をコンポーネントに適用していくことで、Angular の変更検知の仕組みをより深く理解し、効率的でスケーラブルなアプリケーションを構築できるようになります。
