# Step10 実践コード例

> 💡 **このファイルについて**: 高度な型機能の段階的な学習のためのコード例集です。

## 📋 目次
1. [条件型とテンプレートリテラル型](#条件型とテンプレートリテラル型)
2. [型レベルプログラミング](#型レベルプログラミング)
3. [実用的な高度型パターン](#実用的な高度型パターン)

---

## 条件型とテンプレートリテラル型

### ステップ1: 基本的な条件型
```typescript
// 基本的な条件型
type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<string>; // false

// より実用的な条件型
type NonNullable<T> = T extends null | undefined ? never : T;
type Flatten<T> = T extends (infer U)[] ? U : T;

type FlatString = Flatten<string[]>; // string
type FlatNumber = Flatten<number>; // number

// 関数の戻り値型を取得
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string { return ""; }
function getNumber(): number { return 0; }

type StringReturn = ReturnType<typeof getString>; // string
type NumberReturn = ReturnType<typeof getNumber>; // number
```

### ステップ2: テンプレートリテラル型の活用
```typescript
// イベント名の生成
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">; // "onClick"

// CSS変数の生成
type CSSVar<T extends string> = `--${T}`;
type PrimaryColor = CSSVar<"primary">; // "--primary"

// パスの結合
type JoinPath<T extends string, U extends string> = `${T}/${U}`;
type ApiPath = JoinPath<"api", "users">; // "api/users"

// より複雑なテンプレートリテラル型
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint<M extends HTTPMethod, P extends string> = `${M} ${P}`;

type GetUsers = Endpoint<"GET", "/users">; // "GET /users"
type CreateUser = Endpoint<"POST", "/users">; // "POST /users"

// URLパラメータの抽出
type ExtractParams<T extends string> = 
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
    ? Param
    : never;

type UserParams = ExtractParams<"/users/:id/posts/:postId">; // "id" | "postId"
```

---

## 型レベルプログラミング

### ステップ3: 再帰型とユーティリティ型
```typescript
// 深い読み取り専用型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

// 深いPartial型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object 
    ? DeepPartial<T[P]> 
    : T[P];
};

// 配列操作の型レベル実装
type Head<T extends readonly unknown[]> = 
  T extends readonly [infer H, ...unknown[]] ? H : never;

type Tail<T extends readonly unknown[]> = 
  T extends readonly [unknown, ...infer Rest] ? Rest : [];

type Last<T extends readonly unknown[]> = 
  T extends readonly [...unknown[], infer L] ? L : never;

// 使用例
type FirstElement = Head<[1, 2, 3]>; // 1
type RestElements = Tail<[1, 2, 3]>; // [2, 3]
type LastElement = Last<[1, 2, 3]>; // 3

// 配列の長さを取得
type Length<T extends readonly unknown[]> = T['length'];
type ArrayLength = Length<[1, 2, 3, 4]>; // 4

// 配列の反転
type Reverse<T extends readonly unknown[]> = 
  T extends readonly [...infer Rest, infer Last]
    ? [Last, ...Reverse<Rest>]
    : [];

type ReversedArray = Reverse<[1, 2, 3]>; // [3, 2, 1]
```

### ステップ4: 高度な型操作
```typescript
// オブジェクトのキーを変換
type PrefixKeys<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

type User = { name: string; age: number };
type PrefixedUser = PrefixKeys<User, "user_">; // { user_name: string; user_age: number }

// 関数の引数を取得
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P) => any ? P : never;

function example(a: string, b: number, c: boolean): void {}
type ExampleParams = Parameters<typeof example>; // [string, number, boolean]

// オブジェクトから関数型を生成
type FunctionFromObject<T> = {
  [K in keyof T]: (value: T[K]) => void;
};

type UserFunctions = FunctionFromObject<User>; 
// { name: (value: string) => void; age: (value: number) => void }

// 型安全なパス取得
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: T[K] extends string
        ? [K]
        : [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type NestedObject = {
  user: {
    profile: {
      name: string;
      bio: string;
    };
    settings: {
      theme: string;
    };
  };
};

type StringPaths = PathsToStringProps<NestedObject>; 
// ["user", "profile", "name"] | ["user", "profile", "bio"] | ["user", "settings", "theme"]
```

---

## 実用的な高度型パターン

### ステップ5: 型安全なAPIクライアント
```typescript
// APIエンドポイントの定義
type APIEndpoints = {
  "GET /users": { response: User[] };
  "GET /users/:id": { params: { id: string }; response: User };
  "POST /users": { body: Omit<User, "id">; response: User };
  "PUT /users/:id": { params: { id: string }; body: Partial<User>; response: User };
  "DELETE /users/:id": { params: { id: string }; response: void };
};

// パラメータ抽出
type ExtractPathParams<T extends string> = 
  T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & ExtractPathParams<`${Start}${Rest}`>
    : T extends `${infer Start}:${infer Param}`
    ? { [K in Param]: string }
    : {};

// APIクライアントの型定義
type APIClient = {
  [K in keyof APIEndpoints]: K extends `${infer Method} ${infer Path}`
    ? (
        ...args: APIEndpoints[K] extends { params: infer P }
          ? APIEndpoints[K] extends { body: infer B }
            ? [params: P, body: B]
            : [params: P]
          : APIEndpoints[K] extends { body: infer B }
          ? [body: B]
          : []
      ) => Promise<APIEndpoints[K] extends { response: infer R } ? R : void>
    : never;
};

// 実装例
const apiClient: APIClient = {
  "GET /users": () => Promise.resolve([]),
  "GET /users/:id": (params) => Promise.resolve({} as User),
  "POST /users": (body) => Promise.resolve({} as User),
  "PUT /users/:id": (params, body) => Promise.resolve({} as User),
  "DELETE /users/:id": (params) => Promise.resolve(),
};
```

### ステップ6: 型安全なイベントシステム
```typescript
// イベント定義
type EventMap = {
  "user:created": { user: User };
  "user:updated": { user: User; changes: Partial<User> };
  "user:deleted": { userId: string };
  "system:error": { error: Error; context: string };
};

// イベントエミッター
class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: {
    [K in keyof T]?: Array<(data: T[K]) => void>;
  } = {};

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
}

// 使用例
const eventEmitter = new TypedEventEmitter<EventMap>();

eventEmitter.on("user:created", (data) => {
  console.log(`User created: ${data.user.name}`);
});

eventEmitter.on("user:updated", (data) => {
  console.log(`User updated: ${data.user.name}`, data.changes);
});

eventEmitter.emit("user:created", { user: { id: "1", name: "Alice", age: 30 } });
```

### ステップ7: 型安全なステートマシン
```typescript
// ステート定義
type States = {
  idle: { type: "idle" };
  loading: { type: "loading"; progress?: number };
  success: { type: "success"; data: any };
  error: { type: "error"; message: string };
};

type StateType = keyof States;
type State = States[StateType];

// イベント定義
type Events = {
  START: { type: "START" };
  SUCCESS: { type: "SUCCESS"; data: any };
  ERROR: { type: "ERROR"; message: string };
  RESET: { type: "RESET" };
  PROGRESS: { type: "PROGRESS"; progress: number };
};

type EventType = keyof Events;
type Event = Events[EventType];

// 状態遷移の定義
type Transitions = {
  idle: {
    START: "loading";
  };
  loading: {
    SUCCESS: "success";
    ERROR: "error";
    PROGRESS: "loading";
  };
  success: {
    RESET: "idle";
  };
  error: {
    RESET: "idle";
    START: "loading";
  };
};

// ステートマシン実装
class StateMachine<S extends Record<string, any>, E extends Record<string, any>> {
  constructor(
    private state: S[keyof S],
    private transitions: Record<keyof S, Record<string, keyof S>>
  ) {}

  getCurrentState(): S[keyof S] {
    return this.state;
  }

  canTransition(eventType: keyof E): boolean {
    const currentStateType = this.state.type as keyof S;
    return eventType in this.transitions[currentStateType];
  }

  transition(event: E[keyof E]): boolean {
    const currentStateType = this.state.type as keyof S;
    const nextStateType = this.transitions[currentStateType][event.type];

    if (nextStateType) {
      this.state = this.createState(nextStateType, event);
      return true;
    }

    return false;
  }

  private createState(stateType: keyof S, event: E[keyof E]): S[keyof S] {
    switch (stateType) {
      case "loading":
        return { 
          type: "loading", 
          progress: event.type === "PROGRESS" ? (event as any).progress : undefined 
        } as S[keyof S];
      case "success":
        return { 
          type: "success", 
          data: event.type === "SUCCESS" ? (event as any).data : undefined 
        } as S[keyof S];
      case "error":
        return { 
          type: "error", 
          message: event.type === "ERROR" ? (event as any).message : "Unknown error" 
        } as S[keyof S];
      default:
        return { type: stateType } as S[keyof S];
    }
  }
}

// 使用例
const machine = new StateMachine<States, Events>(
  { type: "idle" },
  {
    idle: { START: "loading" },
    loading: { SUCCESS: "success", ERROR: "error", PROGRESS: "loading" },
    success: { RESET: "idle" },
    error: { RESET: "idle", START: "loading" }
  }
);

console.log(machine.getCurrentState()); // { type: "idle" }
machine.transition({ type: "START" });
console.log(machine.getCurrentState()); // { type: "loading" }
```

---

## 🎯 実行とテストの方法

### 基本的な実行方法
```bash
# 型チェックのみ
npx tsc --noEmit

# 型の詳細確認
npx tsc --noEmit --pretty
```

---

**📌 重要**: 高度な型機能は強力ですが、適切に使用することが重要です。可読性とパフォーマンスのバランスを考慮して活用しましょう。