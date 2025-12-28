# Angular RxJS Interop 完全ガイド

## 概要

RxJS Interopパッケージ（`@angular/core/rxjs-interop`）は、Angular SignalsとRxJS Observablesを統合するための便利なユーティリティを提供します。

> ⚠️ **重要**: RxJS Interopパッケージは現在Developer Previewです。

## 主要な機能

RxJS Interopは以下の機能を提供します：

1. **toSignal**: ObservableをSignalに変換
2. **toObservable**: SignalをObservableに変換
3. **outputFromObservable**: ObservableからOutputを作成
4. **outputToObservable**: OutputをObservableに変換

## toSignal - ObservableをSignalに変換

### 基本的な使用

`toSignal`はObservableの値を追跡するシグナルを作成します。テンプレートの`async`パイプに似ていますが、より柔軟でアプリケーションのどこでも使用できます。

```typescript
import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  template: `{{ counter() }}`
})
export class Ticker {
  counterObservable = interval(1000);
  
  // ObservableをSignalに変換
  counter = toSignal(this.counterObservable, { initialValue: 0 });
}
```

### 重要な特性

- **即座にサブスクライブ**: `toSignal`は即座にObservableにサブスクライブ（副作用が発生する可能性）
- **自動アンサブスクライブ**: コンポーネント/サービスが破棄されると自動的にアンサブスクライブ
- **再利用を推奨**: 同じObservableに対して繰り返し呼び出すのは避け、返されたシグナルを再利用

⚠️ **重要**: `toSignal`はサブスクリプションを作成します。同じObservableに対して繰り返し呼び出さず、返されたシグナルを再利用してください。

### Injection Context（注入コンテキスト）

デフォルトでは、`toSignal`は注入コンテキスト内で実行する必要があります：

```typescript
export class MyComponent {
  // ✅ OK: プロパティ初期化は注入コンテキスト内
  data = toSignal(this.dataService.getData());
  
  constructor() {
    // ✅ OK: constructorは注入コンテキスト内
    const signal = toSignal(someObservable);
  }
  
  ngOnInit() {
    // ❌ エラー: ngOnInitは注入コンテキスト外
    const signal = toSignal(someObservable);
  }
}
```

注入コンテキストが利用できない場合は、手動で`Injector`を指定できます：

```typescript
import { Injector } from '@angular/core';

export class MyComponent {
  constructor(private injector: Injector) {}
  
  someMethod() {
    const signal = toSignal(
      someObservable, 
      { injector: this.injector }
    );
  }
}
```

### 初期値の扱い

Observableは同期的に値を生成しない場合がありますが、シグナルは常に現在の値が必要です。

#### initialValueオプション

Observableが最初に発行する前にシグナルが返すべき値を指定できます：

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

const counter = toSignal(interval(1000), { initialValue: 0 });
console.log(counter());  // 0（最初の発行前）
```

#### undefinedな初期値

`initialValue`を指定しない場合、シグナルはObservableが発行するまで`undefined`を返します：

```typescript
const data = toSignal(http.get('/api/data'));
console.log(data());  // undefined（リクエスト完了前）

// 型は Signal<Data | undefined>
```

これは`async`パイプが`null`を返す動作に似ています。

#### requireSyncオプション

一部のObservable（例：`BehaviorSubject`）は同期的に発行することが保証されています。そのような場合は`requireSync: true`を指定できます：

```typescript
import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject(42);
const value = toSignal(subject, { requireSync: true });

console.log(value());  // 42
// 型は Signal<number> (undefinedなし)
```

`requireSync: true`の場合：
- Observableがサブスクリプション時に同期的に発行することを強制
- シグナルが常に値を持つことを保証
- `undefined`型や初期値が不要

### manualCleanup

デフォルトでは、`toSignal`はコンポーネント/サービスが破棄されると自動的にアンサブスクライブします。

この動作を上書きするには、`manualCleanup`オプションを使用します：

```typescript
const signal = toSignal(observable, { 
  manualCleanup: true 
});
```

自然に完了するObservableに使用できます。

### エラーと完了

#### エラー処理

Observableがエラーを生成すると、そのエラーはシグナルが読み取られたときにスローされます：

```typescript
const errorObservable = throwError(() => new Error('Error!'));
const signal = toSignal(errorObservable, { initialValue: null });

try {
  console.log(signal());  // エラーがスローされる
} catch (error) {
  console.error(error);
}
```

#### 完了処理

Observableが完了した場合、シグナルは完了前の最後の値を返し続けます：

```typescript
const observable = of(1, 2, 3);  // 1, 2, 3を発行して完了
const signal = toSignal(observable, { initialValue: 0 });

// 0 → 1 → 2 → 3 → 3（完了後も3を保持）
```

## toObservable - SignalをObservableに変換

### 基本的な使用

`toObservable`はSignalの値を監視するObservableを作成します：

```typescript
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';

@Component({...})
export class SearchResults {
  query: Signal<string> = inject(QueryService).query;
  query$ = toObservable(this.query);
  
  results$ = this.query$.pipe(
    switchMap(query => this.http.get('/search?q=' + query))
  );
}
```

`query`シグナルが変更されると、`query$` Observableが最新のクエリを発行し、新しいHTTPリクエストをトリガーします。

### Injection Context

`toObservable`も注入コンテキストが必要です：

```typescript
export class MyComponent {
  mySignal = signal(0);
  
  // ✅ OK
  myObservable$ = toObservable(this.mySignal);
  
  constructor(private injector: Injector) {}
  
  someMethod() {
    // 手動でInjectorを指定
    const obs$ = toObservable(this.mySignal, { injector: this.injector });
  }
}
```

### toObservableのタイミング

`toObservable`は`effect`を使用してシグナルの値を`ReplaySubject`で追跡します：

- **最初の値**: サブスクリプション時に同期的に発行される（利用可能な場合）
- **その後の値**: すべて非同期

シグナルとは異なり、Observableは変更の同期通知を提供しません。シグナルの値を複数回更新しても、`toObservable`はシグナルが安定した後にのみ値を発行します：

```typescript
const mySignal = signal(0);
const obs$ = toObservable(mySignal);

obs$.subscribe(value => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);

// 出力: 3 (最後の値のみ)
```

## Output関連のユーティリティ

### outputFromObservable

`outputFromObservable()`は、RxJS ObservableベースでAngular Outputを宣言します：

```typescript
class MyDir {
  nameChange$ = new Observable<string>(/* ... */);
  nameChange = outputFromObservable(this.nameChange$); // OutputRef<string>
}
```

詳細は[output() API guide](https://v18.angular.dev/guide/components/output-fn)を参照。

### outputToObservable

`outputToObservable()`は、Angular OutputをObservableに変換します。これにより、Angular OutputをRxJSストリームに統合できます：

```typescript
outputToObservable(myComp.instance.onNameChange)
  .pipe(...)
  .subscribe(...)
```

詳細は[output() API guide](https://v18.angular.dev/guide/components/output-fn)を参照。

## 実践例

### 例1: HTTPリクエストとSignal

```typescript
import { Component, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'user-profile',
  template: `
    <div *ngIf="user(); else loading">
      <h2>{{ user()!.name }}</h2>
      <p>{{ user()!.email }}</p>
    </div>
    <ng-template #loading>
      <p>Loading...</p>
    </ng-template>
  `
})
export class UserProfile {
  private userId = signal(1);
  
  // ObservableをSignalに変換
  user = toSignal(
    this.http.get<User>(`/api/users/${this.userId()}`),
    { initialValue: null }
  );
  
  constructor(private http: HttpClient) {}
  
  loadUser(id: number) {
    this.userId.set(id);
  }
}
```

### 例2: リアルタイム検索

```typescript
import { Component, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'search-box',
  template: `
    <input 
      [value]="searchTerm()" 
      (input)="onSearch($event)">
    
    <ul>
      <li *ngFor="let result of results()">
        {{ result.title }}
      </li>
    </ul>
    
    <p *ngIf="isLoading()">Searching...</p>
  `
})
export class SearchBox {
  searchTerm = signal('');
  
  // SignalをObservableに変換してRxJS操作
  private searchTerm$ = toObservable(this.searchTerm);
  
  // 検索結果をSignalとして取得
  results = toSignal(
    this.searchTerm$.pipe(
      debounceTime(300),
      switchMap(term => 
        term ? this.searchService.search(term) : of([])
      )
    ),
    { initialValue: [] }
  );
  
  isLoading = signal(false);
  
  constructor(private searchService: SearchService) {
    // ローディング状態の管理
    effect(() => {
      const term = this.searchTerm();
      this.isLoading.set(!!term);
    });
    
    effect(() => {
      this.results();  // 結果が更新されたらローディング終了
      this.isLoading.set(false);
    });
  }
  
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
```

### 例3: WebSocketとSignal

```typescript
import { Injectable, signal } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { toSignal } from '@angular/core/rxjs-interop';

interface Message {
  type: string;
  data: any;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$: WebSocketSubject<Message>;
  
  // WebSocketメッセージをSignalとして公開
  messages = toSignal(
    this.socket$.asObservable(),
    { initialValue: null }
  );
  
  connectionStatus = signal<'connected' | 'disconnected'>('disconnected');
  
  constructor() {
    this.socket$ = webSocket({
      url: 'ws://localhost:8080',
      openObserver: {
        next: () => this.connectionStatus.set('connected')
      },
      closeObserver: {
        next: () => this.connectionStatus.set('disconnected')
      }
    });
  }
  
  send(message: Message) {
    this.socket$.next(message);
  }
  
  disconnect() {
    this.socket$.complete();
  }
}

// 使用例
@Component({
  selector: 'chat-room',
  template: `
    <div [class.connected]="wsService.connectionStatus() === 'connected'">
      Status: {{ wsService.connectionStatus() }}
    </div>
    
    <div *ngIf="wsService.messages() as message">
      {{ message.type }}: {{ message.data }}
    </div>
  `
})
export class ChatRoom {
  constructor(public wsService: WebSocketService) {}
}
```

### 例4: フォーム状態の管理

```typescript
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'user-form',
  template: `
    <form [formGroup]="form">
      <input formControlName="name" placeholder="Name">
      <input formControlName="email" placeholder="Email">
    </form>
    
    <div class="validation">
      <p *ngIf="isDirty()">Form has changes</p>
      <p *ngIf="isValid()">✓ Form is valid</p>
      <p *ngIf="!isValid()">✗ Form is invalid</p>
    </div>
    
    <div class="preview">
      <h3>Live Preview:</h3>
      <p>Name: {{ formValue()?.name }}</p>
      <p>Email: {{ formValue()?.email }}</p>
    </div>
  `
})
export class UserForm {
  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('')
  });
  
  // フォームの値をSignalとして監視
  formValue = toSignal(
    this.form.valueChanges.pipe(debounceTime(300)),
    { initialValue: this.form.value }
  );
  
  // フォームのステータスをSignalとして監視
  isValid = toSignal(
    this.form.statusChanges.pipe(
      map(status => status === 'VALID')
    ),
    { initialValue: false }
  );
  
  isDirty = signal(false);
  
  constructor() {
    // フォームの変更を監視
    effect(() => {
      const value = this.formValue();
      if (value) {
        this.isDirty.set(true);
      }
    });
  }
}
```

### 例5: タイマーとカウントダウン

```typescript
import { Component, signal, computed } from '@angular/core';
import { interval, takeWhile, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'countdown-timer',
  template: `
    <div class="timer">
      <h2>{{ formattedTime() }}</h2>
      <button (click)="start()" [disabled]="isRunning()">Start</button>
      <button (click)="reset()">Reset</button>
    </div>
    
    <div *ngIf="isFinished()">
      <p>Time's up! 🎉</p>
    </div>
  `
})
export class CountdownTimer {
  private startTime = 60; // 60秒
  private timerSubject$ = new Subject<number>();
  
  remainingSeconds = toSignal(
    this.timerSubject$.pipe(
      switchMap(() => 
        interval(1000).pipe(
          map(i => this.startTime - i - 1),
          takeWhile(time => time >= 0)
        )
      )
    ),
    { initialValue: this.startTime }
  );
  
  isRunning = signal(false);
  
  isFinished = computed(() => 
    this.remainingSeconds() === 0
  );
  
  formattedTime = computed(() => {
    const seconds = this.remainingSeconds();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  });
  
  start() {
    this.isRunning.set(true);
    this.timerSubject$.next(0);
  }
  
  reset() {
    this.isRunning.set(false);
    // 新しいSubjectを作成してリセット
    this.timerSubject$.next(0);
  }
}
```

### 例6: 複数のObservableの結合

```typescript
import { Component } from '@angular/core';
import { combineLatest, merge } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dashboard',
  template: `
    <div class="stats">
      <div>Users: {{ stats()?.users }}</div>
      <div>Posts: {{ stats()?.posts }}</div>
      <div>Comments: {{ stats()?.comments }}</div>
    </div>
    
    <div class="activity">
      <p *ngFor="let event of recentActivity()">
        {{ event.type }}: {{ event.message }}
      </p>
    </div>
  `
})
export class Dashboard {
  private users$ = this.api.getUsers();
  private posts$ = this.api.getPosts();
  private comments$ = this.api.getComments();
  
  // 複数のObservableを結合
  stats = toSignal(
    combineLatest([this.users$, this.posts$, this.comments$]).pipe(
      map(([users, posts, comments]) => ({
        users: users.length,
        posts: posts.length,
        comments: comments.length
      }))
    ),
    { initialValue: { users: 0, posts: 0, comments: 0 } }
  );
  
  // イベントストリームをマージ
  recentActivity = toSignal(
    merge(
      this.users$.pipe(map(users => ({ type: 'user', message: `${users.length} users` }))),
      this.posts$.pipe(map(posts => ({ type: 'post', message: `${posts.length} posts` }))),
      this.comments$.pipe(map(comments => ({ type: 'comment', message: `${comments.length} comments` })))
    ),
    { initialValue: [] }
  );
  
  constructor(private api: ApiService) {}
}
```

## ベストプラクティス

### ✅ 推奨

1. **同じObservableには一度だけtoSignalを呼ぶ**
   ```typescript
   // ✅ 良い例
   data = toSignal(this.http.get('/api/data'));
   
   // ❌ 悪い例
   getData() {
     return toSignal(this.http.get('/api/data'));  // 呼ばれるたびサブスクライブ
   }
   ```

2. **適切な初期値を設定**
   ```typescript
   users = toSignal(this.getUsers(), { initialValue: [] });
   count = toSignal(this.getCount(), { initialValue: 0 });
   ```

3. **BehaviorSubjectにはrequireSyncを使用**
   ```typescript
   subject = new BehaviorSubject(42);
   value = toSignal(subject, { requireSync: true });
   ```

4. **エラーハンドリングを適切に実装**
   ```typescript
   data = toSignal(
     this.http.get('/api/data').pipe(
       catchError(error => {
         console.error(error);
         return of(null);
       })
     ),
     { initialValue: null }
   );
   ```

### ❌ 避けるべき

1. **不必要なtoSignal/toObservable変換**
   ```typescript
   // ❌ 悪い例
   signal = signal(0);
   observable$ = toObservable(this.signal);
   backToSignal = toSignal(observable$);
   
   // ✅ 良い例 - 必要な場合のみ変換
   signal = signal(0);
   ```

2. **manualCleanupの過度な使用**
   ```typescript
   // ❌ 通常は不要
   data = toSignal(observable, { manualCleanup: true });
   
   // ✅ 自動クリーンアップに任せる
   data = toSignal(observable);
   ```

3. **初期値なしでundefined処理を忘れる**
   ```typescript
   // ❌ 悪い例
   data = toSignal(observable);
   const value = this.data().name;  // undefinedの可能性
   
   // ✅ 良い例
   data = toSignal(observable, { initialValue: defaultValue });
   // または
   const value = this.data()?.name;
   ```

## まとめ

RxJS Interopは、SignalsとObservablesのシームレスな統合を可能にします：

- **toSignal**: ObservableをSignalに変換（リアクティブな値として使用）
- **toObservable**: SignalをObservableに変換（RxJS操作と組み合わせ）
- **自動クリーンアップ**: メモリリークを防ぐ
- **柔軟性**: 両方のパラダイムの利点を活用

### 使い分けガイド

| ユースケース | 使用する関数 |
|------------|-------------|
| HTTPレスポンスをテンプレートで表示 | `toSignal` |
| Signal値でHTTPリクエスト | `toObservable` + RxJS operators |
| フォーム状態の監視 | `toSignal` |
| WebSocketメッセージの受信 | `toSignal` |
| 複数Signalの結合後にHTTPリクエスト | `toObservable` + `combineLatest` |

Modern Angularアプリケーションでは、SignalsとObservablesを適切に組み合わせることで、よりクリーンで保守性の高いコードを実現できます。
