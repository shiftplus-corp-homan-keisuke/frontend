# Angular Signal が Function 型である事実

## 📚 概要

Angular の Signal は**実際に関数として実装されています**。この文書では、Signal が関数であることを実証します。

## 🔍 Signal が関数である証拠

### 1. **実行できる = 関数である**

```typescript
import { signal } from '@angular/core';

const count = signal(0);

// これが動作するということは、count は関数である証拠
console.log(count()); // 0

// 関数でなければ () で呼び出すことはできない
// もしオブジェクトなら count.value のようなアクセスが必要になる
```

**重要なポイント**: JavaScript では `()` で実行できるものは関数だけです。

### 2. **typeof で確認**

```typescript
const count = signal(42);

console.log(typeof count); // "function"
console.log(count instanceof Function); // true

// 比較: 通常のオブジェクト
const obj = { value: 42 };
console.log(typeof obj); // "object"
console.log(obj instanceof Function); // false
```

### 3. **Function のプロパティとメソッドを持つ**

```typescript
const count = signal(10);

// 関数として持つべきプロパティ
console.log(count.name); // 関数名
console.log(count.length); // 引数の数（0）

// call, apply, bind メソッドも使用可能
console.log(count.call()); // 10
console.log(count.apply()); // 10

const boundCount = count.bind();
console.log(boundCount()); // 10
```

### 4. **プロトタイプチェーンの確認**

```typescript
const count = signal(5);

// プロトタイプチェーンで Function を継承している
console.log(Object.getPrototypeOf(count) === Function.prototype); // true
console.log(count.constructor === Function); // true

// toString() の結果も関数であることを示す
console.log(count.toString()); // "function() { [native code] }" または類似
```

### 5. **内部実装の仕組み**

```typescript
// Signal の内部実装イメージ（簡略化）
function createSignal<T>(initialValue: T) {
  let value = initialValue;
  
  // 関数を作成（これが Signal の本体）
  const signalFn = () => {
    return value;
  };
  
  // 関数にメソッドを追加
  signalFn.set = (newValue: T) => {
    value = newValue;
  };
  
  signalFn.update = (updateFn: (current: T) => T) => {
    value = updateFn(value);
  };
  
  return signalFn; // 関数を返す
}
```

## � まとgめ

Angular の Signal が関数として実装されている事実：

1. **`count()` で実行できる** - JavaScript では関数だけが `()` で実行可能
2. **`typeof count` → `"function"`** - 型チェックで関数と判定される
3. **Function のプロパティを持つ** - `name`, `length`, `call`, `apply`, `bind` が使用可能
4. **Function.prototype を継承** - プロトタイプチェーンで Function を継承

**なぜ関数なのか**: Signal を関数として呼び出す瞬間に、Angular が「今この Signal が読み取られた」ことを記録でき、これが依存関係の自動追跡を可能にする核心的な仕組みです。