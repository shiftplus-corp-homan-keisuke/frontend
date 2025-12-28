# Angular Signals 基礎完全ガイド

## 概要

Angular Signalsは、アプリケーション全体で状態がどのように使用されているかを細かく追跡するシステムです。これにより、フレームワークはレンダリング更新を最適化できます。

Signalは、値の変更を関心のある消費者に通知する値のラッパーです。プリミティブから複雑なデータ構造まで、あらゆる値を含むことができます。

## Signalとは？

Signalの値は、getter関数を呼び出すことで読み取ります。これにより、AngularはSignalがどこで使用されているかを追跡できます。

Signalには2つのタイプがあります：
- **Writable signals（書き込み可能シグナル）**: 値を直接更新できる
- **Read-only signals（読み取り専用シグナル）**: 他のSignalから派生する（Computed signals）

## Writable Signals（書き込み可能シグナル）

### 基本的な使用

Writable signalsは、値を直接更新するためのAPIを提供します。`signal()`関数を使って作成します：

```typescript
import { signal } from '@angular/core';

const count = signal(0);

// Signalsはgetter関数 - 呼び出すと値を読み取る
console.log('The count is: ' + count());  // 0
```

### 値の更新方法

#### 1. set()メソッド

新しい値を直接設定します：

```typescript
count.set(3);
console.log(count());  // 3
```

#### 2. update()メソッド

前の値から新しい値を計算します：

```typescript
// カウントを1増やす
count.update(value => value + 1);
console.log(count());  // 4
```

### 型定義

Writable signalsは`WritableSignal`型を持ちます：

```typescript
import { WritableSignal } from '@angular/core';

const count: WritableSignal<number> = signal(0);
```

## Computed Signals（計算シグナル）

### 基本的な使用

Computed signalsは、他のSignalから値を派生させる読み取り専用のSignalです。`computed()`関数を使用して定義します：

```typescript
import { signal, computed } from '@angular/core';

const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);

console.log(doubleCount());  // 0

count.set(3);
console.log(doubleCount());  // 6
```

### 重要な特性

#### 1. 遅延評価とメモ化

Computed signalsは以下の特性を持ちます：

```typescript
const count = signal(0);
const doubleCount = computed(() => {
  console.log('Computing...');
  return count() * 2;
});

// まだ"Computing..."は表示されない（遅延評価）
console.log('Created');

// 最初の読み取り時に計算
console.log(doubleCount());  // "Computing..." → 0

// 2回目の読み取り - キャッシュから取得（再計算しない）
console.log(doubleCount());  // 0（"Computing..."は表示されない）

// 依存関係が変更されたらキャッシュを無効化
count.set(5);
console.log(doubleCount());  // "Computing..." → 10
```

**メリット:**
- 計算コストの高い処理（配列のフィルタリングなど）を安全に実行できる
- 不要な再計算を避ける

#### 2. 書き込み不可

Computed signalsに直接値を代入することはできません：

```typescript
const doubleCount = computed(() => count() * 2);

// ❌ コンパイルエラー
doubleCount.set(3);  // WritableSignalではないためエラー
```

#### 3. 動的な依存関係追跡

実際に読み取られたSignalのみが追跡されます：

```typescript
const showCount = signal(false);
const count = signal(0);

const conditionalCount = computed(() => {
  if (showCount()) {
    return `The count is ${count()}.`;
  } else {
    return 'Nothing to see here!';
  }
});

// showCountがfalseの場合、countは読み取られない
console.log(conditionalCount());  // "Nothing to see here!"

// countを変更してもconditionalCountは再計算されない
count.set(5);
console.log(conditionalCount());  // "Nothing to see here!"（変化なし）

// showCountをtrueにするとcountが依存関係に追加される
showCount.set(true);
console.log(conditionalCount());  // "The count is 5."

// これ以降、countの変更がconditionalCountに影響する
count.set(10);
console.log(conditionalCount());  // "The count is 10."
```

## OnPushコンポーネントでのSignal読み取り

`OnPush`コンポーネントのテンプレート内でSignalを読み取ると、AngularはそのSignalをコンポーネントの依存関係として追跡します。

Signalの値が変更されると、Angularは自動的にコンポーネントを[markForCheck](https://v18.angular.dev/api/core/ChangeDetectorRef#markforcheck)してくれます：

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'counter',
  template: `
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">Increment</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  count = signal(0);
  
  increment() {
    this.count.update(v => v + 1);
    // OnPushでも自動的に更新される！
  }
}
```

## Effects（エフェクト）

### 基本的な使用

Effectは、1つ以上のSignal値が変更されたときに実行される操作です。`effect()`関数を使用して作成します：

```typescript
import { effect, signal } from '@angular/core';

const count = signal(0);

effect(() => {
  console.log(`The current count is: ${count()}`);
});

// "The current count is: 0" がすぐに表示される

count.set(1);
// 次の変更検知サイクルで "The current count is: 1" が表示される
```

### 重要な特性

1. **最低1回は実行される**: Effectは作成時に必ず実行されます
2. **動的な依存関係追跡**: 最新の実行で読み取られたSignalのみを追跡
3. **非同期実行**: 変更検知プロセス中に非同期で実行

### Effectの使用例

Effectは多くのアプリケーションコードでは不要ですが、以下のような特定の状況で有用です：

#### ✅ 適切な使用例

1. **ログ記録**
   ```typescript
   effect(() => {
     console.log('Analytics:', {
       user: currentUser(),
       timestamp: Date.now()
     });
   });
   ```

2. **localStorageとの同期**
   ```typescript
   effect(() => {
     window.localStorage.setItem('theme', theme());
   });
   ```

3. **カスタムDOM操作**
   ```typescript
   effect(() => {
     const canvas = canvasRef.nativeElement;
     drawChart(canvas, data());
   });
   ```

4. **サードパーティUIライブラリへのレンダリング**
   ```typescript
   effect(() => {
     chartLibrary.update(chartData());
   });
   ```

#### ❌ 避けるべき使用例

**状態変更の伝播にEffectを使用しない**

これは以下の問題を引き起こす可能性があります：
- `ExpressionChangedAfterItHasBeenChecked`エラー
- 無限ループ
- 不要な変更検知サイクル

```typescript
// ❌ 悪い例
effect(() => {
  const newValue = someSignal() * 2;
  anotherSignal.set(newValue);  // 危険！
});

// ✅ 良い例 - computedを使用
const derivedValue = computed(() => someSignal() * 2);
```

これらのリスクのため、Angularはデフォルトでeffect内でのSignal書き込みを防ぎます。絶対に必要な場合は、`allowSignalWrites`フラグを設定できます：

```typescript
effect(() => {
  someSignal.set(value);
}, { allowSignalWrites: true });  // ⚠️ 慎重に使用
```

### Injection Context（注入コンテキスト）

デフォルトでは、`effect()`は注入コンテキスト内でのみ作成できます：

```typescript
import { Component, effect, signal } from '@angular/core';

@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  
  constructor() {
    // ✅ OK: constructorは注入コンテキスト内
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}
```

#### フィールドへの割り当て

Effectをフィールドに割り当てることもできます（説明的な名前を付けられます）：

```typescript
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  
  // フィールドとして定義
  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()}`);
  });
}
```

#### Constructor外でのEffect作成

Constructor外でEffectを作成する場合は、`Injector`をオプションで渡します：

```typescript
import { Component, Injector, effect } from '@angular/core';

@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  
  constructor(private injector: Injector) {}
  
  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    }, { injector: this.injector });
  }
}
```

### Effectの破棄

Effectは、それを囲むコンテキストが破棄されるときに自動的に破棄されます：

```typescript
@Component({...})
export class MyComponent {
  private myEffect = effect(() => {
    // コンポーネントが破棄されると、このEffectも破棄される
  });
}
```

#### 手動での破棄

Effectは`EffectRef`を返し、手動で破棄できます：

```typescript
import { effect } from '@angular/core';

const effectRef = effect(() => {
  console.log(count());
});

// 手動で破棄
effectRef.destroy();
```

#### manualCleanupオプション

`manualCleanup`オプションを使用すると、手動で破棄するまで持続するEffectを作成できます：

```typescript
const longLivedEffect = effect(() => {
  // このEffectは手動で破棄するまで持続
}, { manualCleanup: true });

// 後で破棄
longLivedEffect.destroy();
```

⚠️ **注意**: このようなEffectは不要になったら必ずクリーンアップしてください。

## 高度なトピック

### Signal等値関数

Signal作成時に、オプションで等値関数を提供できます。これは、新しい値が実際に前の値と異なるかをチェックするために使用されます：

```typescript
import _ from 'lodash';

const data = signal(['test'], { equal: _.isEqual });

// 異なる配列インスタンスだが、深い等値関数により
// 値が等しいと判断され、Signalは更新をトリガーしない
data.set(['test']);
```

等値関数は、Writable signalsとComputed signalsの両方に提供できます。

#### デフォルトの等値性

デフォルトでは、Signalsは参照等値性（`Object.is()`比較）を使用します：

```typescript
const obj = signal({ value: 1 });

// 参照が異なるため、Signalは更新される
obj.set({ value: 1 });  // 更新される（新しいオブジェクト）

const sameRef = obj();
obj.set(sameRef);  // 更新されない（同じ参照）
```

### 依存関係を追跡せずに読み取る

まれに、リアクティブ関数（`computed`や`effect`）内でSignalを読み取りたいが、依存関係を作成したくない場合があります。

#### untracked()の使用

`untracked()`を使用すると、Signal読み取りが追跡されません：

```typescript
import { effect, signal, untracked } from '@angular/core';

const currentUser = signal('Alice');
const counter = signal(0);

effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${untracked(counter)}`);
});

// currentUserが変更されたときのみログが出力される
// counterの変更は無視される
```

#### 外部コードでの使用

Effectが外部コードを呼び出す必要があり、そのコードを依存関係として扱いたくない場合にも有用です：

```typescript
effect(() => {
  const user = currentUser();
  untracked(() => {
    // loggingServiceがSignalを読み取っても、
    // このEffectの依存関係としてカウントされない
    this.loggingService.log(`User set to ${user}`);
  });
});
```

### Effectクリーンアップ関数

Effectが長時間実行される操作を開始する場合、Effectが破棄されたり、最初の操作が完了する前に再実行される場合は、その操作をキャンセルする必要があります。

`onCleanup`関数を使用してクリーンアップコールバックを登録できます：

```typescript
import { effect, signal } from '@angular/core';

const currentUser = signal('Alice');

effect((onCleanup) => {
  const user = currentUser();
  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  }, 1000);
  
  // 次のEffect実行前、またはEffect破棄時に実行される
  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

クリーンアップ関数の使用例：
- タイマーのクリア
- HTTP リクエストのキャンセル
- WebSocket接続のクローズ
- イベントリスナーの削除

## 実践例

### 例1: カウンター with Computed

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'counter-app',
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <p>Triple: {{ tripleCount() }}</p>
      
      <button (click)="increment()">+1</button>
      <button (click)="decrement()">-1</button>
      <button (click)="reset()">Reset</button>
    </div>
  `
})
export class CounterApp {
  count = signal(0);
  
  // Computed signals
  doubleCount = computed(() => this.count() * 2);
  tripleCount = computed(() => this.count() * 3);
  
  increment() {
    this.count.update(v => v + 1);
  }
  
  decrement() {
    this.count.update(v => v - 1);
  }
  
  reset() {
    this.count.set(0);
  }
}
```

### 例2: ショッピングカート

```typescript
import { Component, signal, computed } from '@angular/core';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'shopping-cart',
  template: `
    <div>
      <h2>Shopping Cart</h2>
      
      <div *ngFor="let item of items()">
        <p>{{ item.name }} - ¥{{ item.price }} x {{ item.quantity }}</p>
        <button (click)="updateQuantity(item.id, item.quantity + 1)">+</button>
        <button (click)="updateQuantity(item.id, item.quantity - 1)">-</button>
        <button (click)="removeItem(item.id)">Remove</button>
      </div>
      
      <hr>
      <p>Total Items: {{ totalItems() }}</p>
      <p>Total Price: ¥{{ totalPrice() }}</p>
    </div>
  `
})
export class ShoppingCart {
  items = signal<CartItem[]>([
    { id: 1, name: 'Apple', price: 100, quantity: 2 },
    { id: 2, name: 'Banana', price: 80, quantity: 3 },
  ]);
  
  // Computed: 合計アイテム数
  totalItems = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  // Computed: 合計金額
  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  
  updateQuantity(id: number, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeItem(id);
      return;
    }
    
    this.items.update(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }
  
  removeItem(id: number) {
    this.items.update(items => items.filter(item => item.id !== id));
  }
}
```

### 例3: テーマ切り替え with Effect

```typescript
import { Component, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark';

@Component({
  selector: 'theme-switcher',
  template: `
    <div [attr.data-theme]="theme()">
      <h1>Current Theme: {{ theme() }}</h1>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </div>
  `
})
export class ThemeSwitcher {
  theme = signal<Theme>('light');
  
  constructor() {
    // localStorageから初期値を読み込み
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.theme.set(savedTheme);
    }
    
    // themeが変更されたらlocalStorageに保存
    effect(() => {
      localStorage.setItem('theme', this.theme());
      document.body.className = this.theme();
    });
  }
  
  toggleTheme() {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }
}
```

### 例4: フィルタリング付きリスト

```typescript
import { Component, signal, computed } from '@angular/core';

interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

@Component({
  selector: 'user-list',
  template: `
    <div>
      <input 
        [value]="searchTerm()" 
        (input)="onSearchChange($event)"
        placeholder="Search by name...">
      
      <label>
        <input 
          type="checkbox" 
          [checked]="showActiveOnly()"
          (change)="toggleActiveFilter()">
        Show active only
      </label>
      
      <p>Found {{ filteredUsers().length }} users</p>
      
      <ul>
        <li *ngFor="let user of filteredUsers()">
          {{ user.name }} ({{ user.age }}) - {{ user.active ? 'Active' : 'Inactive' }}
        </li>
      </ul>
    </div>
  `
})
export class UserList {
  users = signal<User[]>([
    { id: 1, name: 'Alice', age: 25, active: true },
    { id: 2, name: 'Bob', age: 30, active: false },
    { id: 3, name: 'Charlie', age: 35, active: true },
    { id: 4, name: 'David', age: 28, active: true },
  ]);
  
  searchTerm = signal('');
  showActiveOnly = signal(false);
  
  // Computed: フィルタリングされたユーザー
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const activeOnly = this.showActiveOnly();
    
    return this.users().filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(term);
      const matchesActive = !activeOnly || user.active;
      return matchesSearch && matchesActive;
    });
  });
  
  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
  
  toggleActiveFilter() {
    this.showActiveOnly.update(v => !v);
  }
}
```

### 例5: タイマー with Effect Cleanup

```typescript
import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'auto-save',
  template: `
    <div>
      <textarea 
        [value]="content()" 
        (input)="onContentChange($event)"
        rows="10" 
        cols="50">
      </textarea>
      
      <p *ngIf="isSaving()">Saving...</p>
      <p *ngIf="lastSaved()">Last saved: {{ lastSaved() }}</p>
    </div>
  `
})
export class AutoSave {
  content = signal('');
  isSaving = signal(false);
  lastSaved = signal<string | null>(null);
  
  constructor() {
    // contentが変更されたら3秒後に自動保存
    effect((onCleanup) => {
      const currentContent = this.content();
      
      // 3秒後に保存
      const timer = setTimeout(() => {
        this.saveContent(currentContent);
      }, 3000);
      
      // 次の変更が来たらタイマーをキャンセル
      onCleanup(() => {
        clearTimeout(timer);
      });
    });
  }
  
  onContentChange(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.content.set(textarea.value);
  }
  
  async saveContent(content: string) {
    if (!content) return;
    
    this.isSaving.set(true);
    
    // API呼び出しをシミュレート
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.isSaving.set(false);
    this.lastSaved.set(new Date().toLocaleTimeString());
  }
}
```

### 例6: カスタム等値関数

```typescript
import { Component, signal, computed } from '@angular/core';
import _ from 'lodash';

interface Config {
  theme: string;
  fontSize: number;
  features: string[];
}

@Component({
  selector: 'config-manager',
  template: `
    <div>
      <h2>Configuration</h2>
      <p>Update count: {{ updateCount() }}</p>
      <button (click)="updateConfig()">Update Config (same values)</button>
      <button (click)="changeTheme()">Change Theme</button>
    </div>
  `
})
export class ConfigManager {
  // 深い等値性チェックを使用
  config = signal<Config>(
    { theme: 'light', fontSize: 14, features: ['a', 'b'] },
    { equal: _.isEqual }
  );
  
  updateCount = signal(0);
  
  constructor() {
    effect(() => {
      console.log('Config changed:', this.config());
      this.updateCount.update(v => v + 1);
    });
  }
  
  updateConfig() {
    // 同じ値を設定してもupdateCountは増えない（equal関数による）
    this.config.set({ 
      theme: 'light', 
      fontSize: 14, 
      features: ['a', 'b'] 
    });
  }
  
  changeTheme() {
    // 実際に値が変わるのでupdateCountが増える
    this.config.update(cfg => ({
      ...cfg,
      theme: cfg.theme === 'light' ? 'dark' : 'light'
    }));
  }
}
```

## ベストプラクティス

### ✅ 推奨

1. **状態の派生にはComputedを使用**
   ```typescript
   const count = signal(0);
   const doubled = computed(() => count() * 2);  // ✅ Good
   ```

2. **副作用にはEffectを使用**
   ```typescript
   effect(() => {
     console.log('Value:', value());  // ✅ Good for logging
     localStorage.setItem('key', value());  // ✅ Good for sync
   });
   ```

3. **OnPushと組み合わせてパフォーマンス向上**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush  // ✅ Good
   })
   ```

4. **適切な等値関数の使用**
   ```typescript
   const data = signal([], { equal: _.isEqual });  // ✅ Good for deep equality
   ```

### ❌ 避けるべき

1. **Effect内での状態変更**
   ```typescript
   // ❌ Bad
   effect(() => {
     count.set(otherSignal() * 2);  // 無限ループの危険
   });
   
   // ✅ Good
   const doubled = computed(() => otherSignal() * 2);
   ```

2. **不必要なSignalの作成**
   ```typescript
   // ❌ Bad
   const temp = signal(computed(() => a() + b())());
   
   // ✅ Good
   const sum = computed(() => a() + b());
   ```

3. **ComputedをWritableとして扱う**
   ```typescript
   const doubled = computed(() => count() * 2);
   // ❌ Bad
   // doubled.set(10);  // エラー
   ```

## まとめ

Angular Signalsは、リアクティブな状態管理のための強力なシステムです：

### 主要な概念

- **Writable Signals**: `signal()` - 直接更新可能な値
- **Computed Signals**: `computed()` - 他のSignalから派生した読み取り専用の値
- **Effects**: `effect()` - Signal変更時に実行される副作用

### 重要なポイント

1. **細かい追跡**: Angularは正確にどのSignalが使用されているかを追跡
2. **最適化**: 不要な再計算やレンダリングを回避
3. **OnPush統合**: OnPush変更検知と自動的に連携
4. **動的依存関係**: 実際に読み取られたSignalのみを追跡

### 使い分けガイド

| 用途 | 使用する機能 |
|------|-------------|
| 状態の保持 | `signal()` |
| 状態の派生 | `computed()` |
| 副作用の実行 | `effect()` |
| ログ記録 | `effect()` |
| DOM操作 | `effect()` |

Modern Angularアプリケーション開発において、Signalsは中心的な役割を果たします。
