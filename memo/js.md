### JavaScript のメソッドの短縮記法

```js
// 短縮記法
{
  methodName() {
    // ...
  }
}

// 通常の記法
{
  methodName: function() {
    // ...
  }
}
```

### JavaScript のオブジェクトの短縮記法

```js
// 短縮記法
const a = 1;
const b = 2;
const obj = { a, b };

// 通常の記法
const obj = {
  a: a,
  b: b,
};
```

### JavaScript のアロー関数の戻り値の短縮記法

```js
// 短縮記法
const add = (a, b) => a + b;

// 通常の記法
const add = (a, b) => {
  return a + b;
};
```

### JavaScript の論理演算子での短縮記法

```js
// OR演算子での初期値設定
const value = userInput || "default value";

// AND演算子での条件実行
user && user.sayHello();

// Nullish coalescing operator（?? ES2020）
const value = userInput ?? "default value"; // null/undefinedの場合のみデフォルト値

// Optional chaining（?. ES2020）
const street = user?.address?.street;
```
