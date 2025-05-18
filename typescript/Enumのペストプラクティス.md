## TypeScript の Enum（列挙型）

**1. 文字列リテラル Enum の利用を優先する (String Enums)**

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

function move(direction: Direction) {
  if (direction === Direction.Up) {
    console.log("Moving UP");
  }
  // ...
}

move(Direction.Up);
// move("UP"); // これも型チェックが通る（Direction型に代入可能なため）

console.log(Direction.Up); // "UP"
```

- **メリット:**
  - **可読性の向上:** デバッグ時やログ出力時に、数値ではなく意味のある文字列が表示されるため、何が起きているか理解しやすくなります。
  - **明確な値:** 各メンバーに明示的に値を設定するため、意図しない数値の重複や変更を防ぎます。
  - **JSON シリアライズ/デシリアライズとの相性:** 文字列は JSON で扱いやすいため、API 連携などで便利です。
- **デメリット:**
  - 数値 Enum に比べて、若干コードが長くなることがあります。
  - 数値 Enum のようなリバースマッピング（値からキーを取得する機能、例: `Direction[0]`）は自動では生成されません。

**2. 数値 Enum の利用は慎重に (Numeric Enums)**

```typescript
enum Status {
  Pending, // 0
  Approved, // 1
  Rejected, // 2
}

// 明示的に値を設定する場合
enum HttpStatusCode {
  OK = 200,
  NotFound = 404,
  InternalServerError = 500,
}

console.log(Status.Pending); // 0
console.log(Status[0]); // "Pending" (リバースマッピング)
```

- **メリット:**
  - **簡潔さ:** 値を省略すると自動で `0` から始まる数値が割り当てられます。
  - **パフォーマンス:** (微々たる差ですが) 数値の方が比較や処理が速い場合があります。
  - **リバースマッピング:** `EnumName[value]` でキー名を取得できます（ただし、これが混乱の原因になることも）。
- **デメリット:**
  - **可読性の低下:** デバッグ時に `0` や `1` と表示されても、それが何を意味するのか直感的に分かりにくいです。
  - **意図しない値の変更リスク:** Enum の途中にメンバーを追加すると、それ以降のメンバーの数値がずれてしまう可能性があります（明示的に値を設定していれば防げます）。
  - **リバースマッピングの罠:** 数値キーでアクセスすると文字列キーが返ってくるため、`Object.keys()` などでイテレーションする際に数値キーと文字列キーが混在し、扱いにくくなることがあります。

**3. `const enum` の利用はパフォーマンスが重要な場合に限定する**

```typescript
const enum LogLevel {
  Info,
  Warning,
  Error,
}

function logMessage(level: LogLevel, message: string) {
  if (level === LogLevel.Error) {
    // コンパイル後: if (2 === 2) のようにインライン化される
    console.error(message);
  }
}
```

- **メリット:**
  - **パフォーマンス向上:** コンパイル時に Enum の参照が実際の値にインライン展開されるため、実行時のルックアップが不要になり、JavaScript のコード量が減ります。
- **デメリット:**
  - **ランタイムオブジェクトが生成されない:** `const enum` はコンパイル後に消滅するため、`Object.keys(LogLevel)` のような Enum 自体を操作するコードは書けません。
  - **デバッグのしにくさ:** インライン化されるため、デバッガで Enum の名前を確認できなくなることがあります。
  - **`.d.ts` ファイルでの制約:** `preserveConstEnums` コンパイラオプションが `true` でない場合、アンビエントコンテキスト（`.d.ts`）で `const enum` を使うと問題が生じることがあります。

**4. 命名規則**

- **Enum 名:** `PascalCase` (例: `OrderStatus`, `UserRole`)
- **Enum メンバー:**
  - `PascalCase` (例: `OrderStatus.PendingOrder`) が TypeScript コミュニティでは一般的です。
  - `UPPER_SNAKE_CASE` (例: `OrderStatus.PENDING_ORDER`) も伝統的な定数表現として使われます。
  - プロジェクト内で一貫性を保つことが重要です。

**5. Enum の値を網羅的に扱う (switch 文など)**

```typescript
enum Color {
  Red,
  Green,
  Blue,
}

function getColorName(color: Color): string {
  switch (color) {
    case Color.Red:
      return "赤";
    case Color.Green:
      return "緑";
    case Color.Blue:
      return "青";
    // default: // 必要に応じて網羅性チェックのために default を書く
    //   const exhaustiveCheck: never = color; // これでコンパイルエラーになる
    //   throw new Error(`Unknown color: ${exhaustiveCheck}`);
  }
}
```

`tsconfig.json` で `noImplicitReturns` や `strictNullChecks` を有効にしていると、`switch`文で全てのケースを網羅していない場合に警告やエラーが出ることがあります。`default` 句で `never` 型を使って網羅性チェックをするテクニックも有効です。

**6. Enum の代わりに文字列リテラルユニオン型を検討する**

特にシンプルなケースでは、Enum の代わりに文字列リテラルユニオン型がより軽量で便利な場合があります。

```typescript
type TrafficLight = "Red" | "Yellow" | "Green";

function changeLight(light: TrafficLight) {
  console.log(`Light is now: ${light}`);
}

changeLight("Red");
// changeLight("Purple"); // Error: Argument of type '"Purple"' is not assignable to parameter of type 'TrafficLight'.
```

- **メリット:**
  - **シンプル:** Enum のような追加の構文やランタイムオブジェクトが不要です。
  - **型安全:** 許容される文字列のセットを型で表現できます。
- **デメリット:**
  - Enum のように「関連する値のグループ」としての意味合いが薄れることがあります。
  - Enum のように `Object.keys()` や `Object.values()` で一覧を取得するような操作は直接できません（別途配列定数などを用意する必要がある）。

**7. イテレーション**

Enum のキーや値をイテレートしたい場合、注意が必要です。

- **文字列 Enum の場合:**

  ```typescript
  enum StringDirection {
    Up = "UP",
    Down = "DOWN",
  }

  // 値の配列を取得
  const stringValues = Object.values(StringDirection); // ["UP", "DOWN"]

  // キーの配列を取得
  const stringKeys = Object.keys(StringDirection); // ["Up", "Down"]

  stringValues.forEach((value) => console.log(value)); // "UP", "DOWN"
  ```

- **数値 Enum の場合 (リバースマッピングに注意):**

  ```typescript
  enum NumericStatus {
    Pending,
    Approved,
  } // Pending=0, Approved=1

  // キーを取得すると、数値キーも文字列として含まれる
  console.log(Object.keys(NumericStatus)); // ["0", "1", "Pending", "Approved"]

  // 値だけをイテレートする工夫
  for (const key in NumericStatus) {
    if (isNaN(Number(key))) {
      // 数値でないキー（つまり本来のメンバー名）のみを対象
      console.log(
        `Key: ${key}, Value: ${
          NumericStatus[key as keyof typeof NumericStatus]
        }`
      );
    }
  }
  // Key: Pending, Value: 0
  // Key: Approved, Value: 1

  // 値の配列を取得 (文字列キーのみから)
  const numericValues = Object.keys(NumericStatus)
    .filter((key) => isNaN(Number(key)))
    .map((key) => NumericStatus[key as keyof typeof NumericStatus]);
  console.log(numericValues); // [0, 1]
  ```

  数値 Enum のイテレーションは直感的でないため、文字列 Enum や文字列リテラルユニオン型＋配列定数の方が扱いやすいことが多いです。

## 現状の TypeScript での Enum のベストプラクティス

文字列リテラルユニオン型 (type MyEnum = "A" | "B" | "C";) や as const を使ったオブジェクトリテラル (const MyEnum = { A: "A", B: "B" } as const;) といった代替手段が、Enum の多くのユースケースをカバーでき、かつ上記の問題点のいくつかを回避できるため、これらを推奨する意見が多いです。これらの代替手段は、より JavaScript に近い形で型安全性を確保でき、Tree Shaking も効果的に機能しやすいです。

### オブジェクトリテラルを使った書き方

オブジェクトリテラルを Enum の代替として使う場合、特に TypeScript の `as const` アサーションと組み合わせることで、型安全性を保ちつつ、Enum が持ついくつかの問題点を回避できます。

以下に具体的な例をいくつか紹介します。

**1. 基本的な文字列定数のグループ化 (文字列 Enum の代替)**

Enum で以下のように定義する代わりに:

```typescript
// Enumの例
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

function move(direction: Direction) {
  console.log(`Moving ${direction}`);
}

move(Direction.Up); // "Moving UP"
```

オブジェクトリテラルと `as const` を使うとこうなります:

```typescript
// オブジェクトリテラルの例
const Direction = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const; // ← これが重要！

// Directionオブジェクトの値の型をユニオン型として抽出
type Direction = (typeof Direction)[keyof typeof Direction];
// Direction型は "UP" | "DOWN" | "LEFT" | "RIGHT" となる

function move(direction: Direction) {
  console.log(`Moving ${direction}`);
}

move(Direction.Up); // "Moving UP"
// move("FORWARD");   // Error: Argument of type '"FORWARD"' is not assignable to parameter of type 'Direction'.
// move("UP");        // これも型チェックが通る

console.log(Direction.Up); // "UP"
```

**解説:**

- `as const` (const アサーション): これをオブジェクトリテラルの末尾につけると、以下の効果があります。
  - すべてのプロパティが `readonly` になります。
  - プロパティの値が、より具体的なリテラル型として推論されます (例: `string` ではなく `"UP"` のように)。
- `type Direction = typeof Direction[keyof typeof Direction];`:
  - `typeof Direction`: `Direction` オブジェクトの型を取得します (例: `{ readonly Up: "UP"; readonly Down: "DOWN"; ... }`)。
  - `keyof typeof Direction`: `Direction` オブジェクトのキーのユニオン型を取得します (例: `"Up" | "Down" | "Left" | "Right"`)。
  - `typeof Direction[keyof typeof Direction]`: オブジェクトの各キーに対応する値の型をすべて集めたユニオン型を生成します。これが実質的な Enum のメンバーの集合の型となります。

**メリット:**

- **JavaScript 標準に近い:** 生成される JavaScript コードがシンプルで、Enum のような特別なランタイムオブジェクトを生成しません。
- **Tree Shaking しやすい:** 使われていないプロパティはバンドラーによって除去されやすいです。
- **型安全:** `as const` と型エイリアスにより、Enum と同等の型安全性を確保できます。
- **値のイテレーションが容易:** `Object.values(Direction)` や `Object.keys(Direction)` を直感的に使えます。

**2. 数値定数のグループ化 (数値 Enum の代替)**

Enum で以下のように定義する代わりに:

```typescript
// Enumの例
enum HttpStatus {
  Ok = 200,
  NotFound = 404,
  InternalServerError = 500,
}

function handleResponse(status: HttpStatus) {
  if (status === HttpStatus.Ok) {
    console.log("Success!");
  }
}

handleResponse(HttpStatus.NotFound);
```

オブジェクトリテラルと `as const` を使うとこうなります:

```typescript
// オブジェクトリテラルの例
const HttpStatus = {
  Ok: 200,
  NotFound: 404,
  InternalServerError: 500,
} as const;

type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
// HttpStatus型は 200 | 404 | 500 となる

function handleResponse(status: HttpStatus) {
  if (status === HttpStatus.Ok) {
    console.log("Success!");
  } else if (status === HttpStatus.NotFound) {
    console.log("Not Found!");
  }
}

handleResponse(HttpStatus.NotFound);
// handleResponse(403); // Error: Argument of type '403' is not assignable to parameter of type 'HttpStatus'.
```

**3. オブジェクトの値としてより複雑な情報を持つケース**

各定数に複数の関連情報を持たせたい場合にも有効です。

```typescript
const UserRole = {
  ADMIN: {
    id: "ADMIN",
    displayName: "管理者",
    permissions: ["create", "read", "update", "delete"],
  },
  EDITOR: {
    id: "EDITOR",
    displayName: "編集者",
    permissions: ["read", "update"],
  },
  VIEWER: {
    id: "VIEWER",
    displayName: "閲覧者",
    permissions: ["read"],
  },
} as const;

type UserRoleType = (typeof UserRole)[keyof typeof UserRole]; // 個々のロールオブジェクトの型
type UserRoleId = (typeof UserRole)[keyof typeof UserRole]["id"]; // ロールIDのユニオン型 ("ADMIN" | "EDITOR" | "VIEWER")

function showUserInfo(roleId: UserRoleId) {
  // UserRoleオブジェクトから対応するロール名で検索する (keyof UserRole は "ADMIN" | "EDITOR" | "VIEWER")
  const roleKey = Object.keys(UserRole).find(
    (key) => UserRole[key as keyof typeof UserRole].id === roleId
  ) as keyof typeof UserRole | undefined; // 型アサーションでキーの型を明示

  if (roleKey) {
    const role = UserRole[roleKey];
    console.log(
      `役割: ${role.displayName}, 権限: ${role.permissions.join(", ")}`
    );
  } else {
    console.log("不明な役割IDです。");
  }
}

showUserInfo(UserRole.ADMIN.id); // 役割: 管理者, 権限: create, read, update, delete
showUserInfo("EDITOR"); // 役割: 編集者, 権限: read, update

// 存在しないIDを渡した場合
// showUserInfo("SUPER_ADMIN"); // Error: Argument of type '"SUPER_ADMIN"' is not assignable to parameter of type 'UserRoleId'.
```

**このパターンのポイント:**

- 各「Enum メンバー」が単なる値ではなく、複数のプロパティを持つオブジェクトになります。
- `as const` を使うことで、これらのネストされたプロパティもリテラル型として扱われ、型安全性が向上します。
- `UserRoleId` のように、特定のプロパティの値だけを型として抽出することも可能です。

## まとめ

オブジェクトリテラルと `as const` を組み合わせる方法は、TypeScript で Enum の代替として非常に強力です。
Enum が持ついくつかの問題点を回避しつつ、型安全で、JavaScript 標準に近い、より直感的なコードを書くことができます。
特に文字列や数値の定数セットを扱う場合には、積極的に検討する価値のあるパターンです。
