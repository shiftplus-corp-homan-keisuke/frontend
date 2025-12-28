# Angular Signal Inputs 完全ガイド

## 概要

Signal Inputsは、親コンポーネントから値をバインドするための新しいリアクティブな方法です。従来の`@Input()`デコレータの代わりとなる、よりタイプセーフで使いやすいAPIです。

> ⚠️ **重要**: Signal InputsはDeveloper Previewの段階です。

## Signal Inputsの基本

### 宣言方法

Angularは2つのタイプのSignal Inputsをサポートしています：

```typescript
import { Component, input } from '@angular/core';

@Component({...})
export class MyComp {
  // オプショナル入力
  firstName = input<string>();           // InputSignal<string|undefined>
  age = input(0);                        // InputSignal<number>
  
  // 必須入力
  lastName = input.required<string>();   // InputSignal<string>
}
```

#### オプショナル入力
- デフォルトではオプション
- 明示的な初期値を指定するか、Angularが暗黙的に`undefined`を使用

#### 必須入力
- `input.required()`で宣言
- 常に指定された型の値を持つ

## 主要な機能

### 1. エイリアスの設定

クラスメンバー名とは異なる公開名を設定できます：

```typescript
class StudentDirective {
  age = input(0, { alias: 'studentAge' });
}
```

テンプレートでの使用：
```html
<student-directive [studentAge]="25"></student-directive>
```

コンポーネント内では`this.age()`でアクセス可能。

### 2. テンプレートでの使用

Signal Inputsは読み取り専用のシグナルです：

```html
<p>First name: {{firstName()}}</p>
<p>Last name: {{lastName()}}</p>
```

関数として呼び出すことで現在の値にアクセスします。

### 3. 値の派生（Computed）

`computed`を使用して入力から値を派生させることができます：

```typescript
import { Component, input, computed } from '@angular/core';

@Component({...})
export class MyComp {
  age = input(0);
  
  // ageの2倍を計算
  ageMultiplied = computed(() => this.age() * 2);
}
```

Computedシグナルは値をメモ化するため、効率的です。

### 4. 変更の監視（Effect）

`effect`関数を使用して入力の変化を監視できます：

```typescript
import { input, effect } from '@angular/core';

class MyComp {
  firstName = input.required<string>();
  
  constructor() {
    effect(() => {
      console.log(this.firstName());
    });
  }
}
```

`firstName`が変更されるたびに、新しい値がコンソールに出力されます。

### 5. 値の変換（Transform）

入力値を強制変換したり解析したりできます：

```typescript
class MyComp {
  disabled = input(false, {
    transform: (value: boolean | string) => 
      typeof value === 'string' ? value === '' : value,
  });
}
```

使用例：
```html
<!-- どちらもdisabled = trueになる -->
<my-custom-comp disabled></my-custom-comp>
<my-custom-comp [disabled]="true"></my-custom-comp>
```

#### Transform使用時の注意点

⚠️ **重要**: 以下の場合はTransformを使用しないでください：
- 入力の意味を変更する場合 → `computed`を使用
- 純粋関数でない場合（副作用がある） → `effect`を使用

Transformは**純粋関数**である必要があります。

## @Input()との比較

Signal Inputsを使用すべき理由：

### 1. より高いタイプセーフ性
- 必須入力に初期値やTypeScriptのトリックが不要
- Transformが受け入れ可能な入力値と自動的にチェックされる

### 2. OnPushコンポーネントとの統合
- テンプレートで使用すると、OnPushコンポーネントを自動的にダーティマークする

### 3. 簡単な値の派生
- `computed`を使用して入力の変更時に値を簡単に派生できる

### 4. 変更監視の改善
- `ngOnChanges`やsetterの代わりに`effect`を使用してローカルに監視可能

## 実践例

### 例1: 基本的な使用

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'user-profile',
  template: `
    <div class="profile">
      <h2>{{ fullName() }}</h2>
      <p>Age: {{ age() }}</p>
      <p>Email: {{ email() }}</p>
    </div>
  `
})
export class UserProfile {
  firstName = input.required<string>();
  lastName = input.required<string>();
  age = input(0);
  email = input<string>();
  
  fullName = computed(() => 
    `${this.firstName()} ${this.lastName()}`
  );
}
```

使用：
```html
<user-profile 
  [firstName]="'John'" 
  [lastName]="'Doe'" 
  [age]="30"
  [email]="'john@example.com'">
</user-profile>
```

### 例2: Transformの活用

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'custom-button',
  template: `
    <button [disabled]="disabled()" [class.loading]="loading()">
      <ng-content></ng-content>
    </button>
  `
})
export class CustomButton {
  // booleanまたは空文字列を受け入れ
  disabled = input(false, {
    transform: (value: boolean | string) => 
      typeof value === 'string' ? value === '' : value
  });
  
  loading = input(false, {
    transform: (value: boolean | string) => 
      typeof value === 'string' ? value === '' : value
  });
}
```

使用：
```html
<!-- どちらも有効 -->
<custom-button disabled>Click me</custom-button>
<custom-button [disabled]="true">Click me</custom-button>
<custom-button loading>Processing...</custom-button>
```

### 例3: EffectとComputedの組み合わせ

```typescript
import { Component, input, computed, effect } from '@angular/core';

@Component({
  selector: 'product-card',
  template: `
    <div class="product">
      <h3>{{ name() }}</h3>
      <p class="price">{{ formattedPrice() }}</p>
      <p class="discount" *ngIf="discountPercentage() > 0">
        {{ discountPercentage() }}% OFF
      </p>
    </div>
  `
})
export class ProductCard {
  name = input.required<string>();
  price = input.required<number>();
  discount = input(0);
  
  // 割引率を計算
  discountPercentage = computed(() => 
    Math.round((this.discount() / this.price()) * 100)
  );
  
  // フォーマットされた価格
  formattedPrice = computed(() => 
    `¥${(this.price() - this.discount()).toLocaleString()}`
  );
  
  constructor() {
    // 価格変更をログに記録
    effect(() => {
      console.log(`Price updated: ${this.formattedPrice()}`);
    });
  }
}
```

## ベストプラクティス

### ✅ 推奨

1. **必須の値には`input.required()`を使用**
   ```typescript
   userId = input.required<string>();
   ```

2. **デフォルト値を持つオプショナル入力には初期値を設定**
   ```typescript
   count = input(0);
   isActive = input(true);
   ```

3. **派生値には`computed`を使用**
   ```typescript
   fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
   ```

4. **変更監視には`effect`を使用**
   ```typescript
   constructor() {
     effect(() => {
       console.log('Value changed:', this.value());
     });
   }
   ```

### ❌ 避けるべき

1. **Transformで意味を変更しない**
   ```typescript
   // ❌ 悪い例
   value = input(0, {
     transform: (v) => v * 2  // 意味が変わる
   });
   
   // ✅ 良い例
   value = input(0);
   doubledValue = computed(() => this.value() * 2);
   ```

2. **Transformで副作用を起こさない**
   ```typescript
   // ❌ 悪い例
   value = input(0, {
     transform: (v) => {
       console.log(v);  // 副作用
       return v;
     }
   });
   
   // ✅ 良い例
   value = input(0);
   constructor() {
     effect(() => console.log(this.value()));
   }
   ```

## まとめ

Signal Inputsは、従来の`@Input()`デコレータよりも：

- **タイプセーフ**
- **リアクティブ**
- **使いやすい**

Modern Angularアプリケーション開発において、Signal Inputsの使用が推奨されます。
