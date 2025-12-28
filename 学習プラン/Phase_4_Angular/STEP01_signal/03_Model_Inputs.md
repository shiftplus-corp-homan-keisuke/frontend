# Angular Model Inputs 完全ガイド

## 概要

Model Inputsは、コンポーネントが新しい値を別のコンポーネントに伝播できるようにする特別なタイプの入力です。双方向バインディング（Two-way binding）を実現するための仕組みです。

> ⚠️ **重要**: Model InputsはDeveloper Previewの段階です。

## Model Inputsの基本

### 宣言方法

```typescript
import { Component, model, input } from '@angular/core';

@Component({...})
export class CustomCheckbox {
  // これはModel Input
  checked = model(false);
  
  // これは標準Input
  disabled = input(false);
}
```

両方のタイプの入力はプロパティに値をバインドできますが、**Model Inputsはコンポーネント作成者がプロパティに値を書き込むことができます**。

### Model Inputsの使用

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'custom-checkbox',
  template: '<div (click)="toggle()"> ... </div>'
})
export class CustomCheckbox {
  checked = model(false);
  disabled = input(false);
  
  toggle() {
    // 標準inputsは読み取り専用だが、Model Inputsには直接書き込める
    this.checked.set(!this.checked());
  }
}
```

## 双方向バインディング

### Signalとの双方向バインディング

Writable Signalをmodel inputにバインドできます：

```typescript
@Component({
  selector: 'user-profile',
  // checkedはmodel input
  // バナナインボックス構文で双方向バインディング
  template: '<custom-checkbox [(checked)]="isAdmin" />'
})
export class UserProfile {
  protected isAdmin = signal(false);
}
```

この例では：
- `CustomCheckbox`が`checked` model inputに新しい値を書き込む
- その値が`UserProfile`の`isAdmin`シグナルに伝播される
- `checked`と`isAdmin`の値が同期される

**注意**: バインディングはシグナルの値ではなく、**シグナル自体**を渡します。

### プレーンプロパティとの双方向バインディング

通常のJavaScriptプロパティもmodel inputにバインドできます：

```typescript
@Component({
  selector: 'user-profile',
  template: '<custom-checkbox [(checked)]="isAdmin" />'
})
export class UserProfile {
  protected isAdmin = false;  // シグナルではなくプレーンプロパティ
}
```

## 暗黙的なChangeイベント

Model Inputを宣言すると、Angularは自動的に対応する**Output**を作成します：

```typescript
@Directive({...})
export class CustomCheckbox {
  // これは自動的に"checkedChange"という名前のOutputを作成
  // テンプレートで(checkedChange)="handler()"として購読可能
  checked = model(false);
}
```

### イベントの発火タイミング

Angularは、`set`または`update`メソッドで新しい値を書き込むたびにこのchangeイベントを発行します：

```typescript
class CustomCheckbox {
  checked = model(false);
  
  toggle() {
    // setを呼ぶと"checkedChange"イベントが発火
    this.checked.set(!this.checked());
  }
  
  reset() {
    // updateを呼んでも"checkedChange"イベントが発火
    this.checked.update(v => false);
  }
}
```

## Model Inputのカスタマイズ

### Required指定とAlias

標準inputと同様に、requiredやaliasを指定できます：

```typescript
class MyComponent {
  // 必須のmodel input
  value = model.required<string>();
  
  // エイリアスを持つmodel input
  count = model(0, { alias: 'itemCount' });
}
```

### Transformは未サポート

⚠️ **重要**: Model InputsはInput Transformをサポートしていません。

## model()とinput()の違い

### 1. InputとOutputの定義

`model()`は入力と出力の両方を定義します：

```typescript
class Component {
  // inputとoutputの両方を定義
  value = model(0);  
  // → valueとvalueChangeが作成される
}
```

使用する側は選択できます：
```html
<!-- inputのみ使用 -->
<my-comp [value]="10"></my-comp>

<!-- outputのみ使用 -->
<my-comp (valueChange)="handleChange($event)"></my-comp>

<!-- 双方向バインディング -->
<my-comp [(value)]="myValue"></my-comp>
```

### 2. 書き込み可能性

`ModelSignal`は`WritableSignal`であり、どこからでも値を変更できます：

```typescript
class Component {
  // ModelSignalは書き込み可能
  modelValue = model(0);
  
  // InputSignalは読み取り専用
  inputValue = input(0);
  
  updateValues() {
    this.modelValue.set(10);     // ✅ OK
    this.modelValue.update(v => v + 1);  // ✅ OK
    
    // this.inputValue.set(10);  // ❌ エラー: setメソッドがない
  }
}
```

新しい値が代入されると、`ModelSignal`は自動的にOutputに発行します。

### 3. Transformのサポート

- `input()`: Transformをサポート ✅
- `model()`: Transformをサポートしない ❌

### 比較表

| 特徴 | `input()` | `model()` |
|------|-----------|-----------|
| 入力を定義 | ✅ | ✅ |
| 出力を定義 | ❌ | ✅ (自動的に`Change`イベント) |
| 書き込み可能 | ❌ (読み取り専用) | ✅ (`WritableSignal`) |
| Transformサポート | ✅ | ❌ |
| 双方向バインディング | ❌ | ✅ |
| 使用場面 | データの受け取りのみ | ユーザー操作による値の変更 |

## Model Inputsを使用すべきとき

以下の場合にModel Inputsを使用します：

1. **コンポーネントが双方向バインディングをサポートする必要がある場合**
2. **ユーザーインタラクションに基づいて値を変更するコンポーネント**

### 典型的な使用例

#### カスタムフォームコントロール

```typescript
// 日付ピッカー
@Component({
  selector: 'date-picker',
  template: `
    <input 
      type="date" 
      [value]="selectedDate()" 
      (change)="onDateChange($event)">
  `
})
export class DatePicker {
  selectedDate = model<string>();
  
  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedDate.set(input.value);
  }
}
```

使用：
```html
<date-picker [(selectedDate)]="userBirthday"></date-picker>
```

#### コンボボックス

```typescript
@Component({
  selector: 'combo-box',
  template: `
    <select [value]="value()" (change)="onChange($event)">
      <option *ngFor="let opt of options()" [value]="opt.id">
        {{ opt.label }}
      </option>
    </select>
  `
})
export class ComboBox {
  value = model<string>();
  options = input.required<Array<{id: string, label: string}>>();
  
  onChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.value.set(select.value);
  }
}
```

使用：
```html
<combo-box 
  [(value)]="selectedCountry" 
  [options]="countries">
</combo-box>
```

## 実践例

### 例1: カスタムトグルスイッチ

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'toggle-switch',
  template: `
    <div 
      class="toggle" 
      [class.active]="enabled()"
      (click)="toggle()">
      <div class="toggle-slider"></div>
    </div>
  `,
  styles: [`
    .toggle {
      width: 50px;
      height: 24px;
      background: #ccc;
      border-radius: 12px;
      cursor: pointer;
      position: relative;
    }
    .toggle.active {
      background: #4CAF50;
    }
    .toggle-slider {
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 10px;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: 0.3s;
    }
    .toggle.active .toggle-slider {
      left: 28px;
    }
  `]
})
export class ToggleSwitch {
  enabled = model(false);
  
  toggle() {
    this.enabled.update(v => !v);
  }
}
```

使用：
```typescript
@Component({
  template: `
    <toggle-switch [(enabled)]="notifications"></toggle-switch>
    <p>Notifications: {{ notifications() ? 'ON' : 'OFF' }}</p>
  `
})
export class Settings {
  notifications = signal(true);
}
```

### 例2: 数値入力コンポーネント

```typescript
import { Component, model, input } from '@angular/core';

@Component({
  selector: 'number-input',
  template: `
    <div class="number-input">
      <button (click)="decrement()" [disabled]="isMinReached()">-</button>
      <input 
        type="number" 
        [value]="value()" 
        (input)="onInput($event)"
        [min]="min()"
        [max]="max()">
      <button (click)="increment()" [disabled]="isMaxReached()">+</button>
    </div>
  `
})
export class NumberInput {
  value = model(0);
  min = input(0);
  max = input(100);
  step = input(1);
  
  isMinReached = computed(() => this.value() <= this.min());
  isMaxReached = computed(() => this.value() >= this.max());
  
  increment() {
    if (!this.isMaxReached()) {
      this.value.update(v => Math.min(v + this.step(), this.max()));
    }
  }
  
  decrement() {
    if (!this.isMinReached()) {
      this.value.update(v => Math.max(v - this.step(), this.min()));
    }
  }
  
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = parseInt(input.value, 10);
    if (!isNaN(newValue)) {
      this.value.set(Math.max(this.min(), Math.min(newValue, this.max())));
    }
  }
}
```

使用：
```html
<number-input 
  [(value)]="quantity" 
  [min]="1" 
  [max]="99" 
  [step]="1">
</number-input>
<p>Quantity: {{ quantity() }}</p>
```

### 例3: 検索コンポーネント

```typescript
import { Component, model, output, effect } from '@angular/core';

@Component({
  selector: 'search-box',
  template: `
    <div class="search-box">
      <input 
        type="search"
        [value]="query()"
        (input)="onInput($event)"
        placeholder="Search...">
      <button *ngIf="query()" (click)="clear()">×</button>
    </div>
  `
})
export class SearchBox {
  query = model('');
  
  // カスタムイベントも追加可能
  search = output<string>();
  
  constructor() {
    // queryが変更されたら検索を実行
    effect(() => {
      const q = this.query();
      if (q.length >= 3) {
        this.search.emit(q);
      }
    });
  }
  
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }
  
  clear() {
    this.query.set('');
  }
}
```

使用：
```typescript
@Component({
  template: `
    <search-box 
      [(query)]="searchQuery"
      (search)="performSearch($event)">
    </search-box>
    <p>Current query: {{ searchQuery() }}</p>
  `
})
export class ProductList {
  searchQuery = signal('');
  
  performSearch(query: string) {
    console.log('Searching for:', query);
    // 検索ロジック
  }
}
```

## ベストプラクティス

### ✅ 推奨

1. **フォームコントロールにはModel Inputsを使用**
   ```typescript
   value = model<string>();
   ```

2. **ユーザーインタラクションで値が変わる場合に使用**
   ```typescript
   isOpen = model(false);
   selectedItem = model<Item | null>(null);
   ```

3. **適切なデフォルト値を設定**
   ```typescript
   count = model(0);
   isEnabled = model(true);
   ```

4. **Computedで派生値を作成**
   ```typescript
   value = model(0);
   isValid = computed(() => this.value() > 0);
   ```

### ❌ 避けるべき

1. **単なる表示用データにModel Inputsを使用しない**
   ```typescript
   // ❌ 悪い例
   userName = model('');  // 表示のみ
   
   // ✅ 良い例
   userName = input('');  // 標準inputで十分
   ```

2. **双方向バインディングが不要な場合に使用しない**
   ```typescript
   // ❌ 悪い例
   title = model('');  // 親から渡されるだけ
   
   // ✅ 良い例
   title = input('');
   ```

## まとめ

Model Inputsは双方向バインディングを実現するための強力な機能です：

- **自動的にOutputを作成**
- **WritableSignalとして動作**
- **フォームコントロールに最適**

### 使い分け

| 状況 | 使用するべき |
|------|-------------|
| 親から値を受け取るだけ | `input()` |
| 値を変更して親に通知する | `model()` |
| フォーム要素の値 | `model()` |
| 設定値・表示データ | `input()` |

Modern Angularのフォームコンポーネント開発において、Model Inputsは不可欠な機能です。
