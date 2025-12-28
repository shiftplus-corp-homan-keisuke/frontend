# Angular Signal Queries 完全ガイド

## 概要

Signal Queriesは、子要素を検索してそのインジェクターから値を読み取るための新しいリアクティブな方法です。従来のデコレータベースのクエリ（`@ViewChild`、`@ContentChild`など）の代替となります。

> ⚠️ **重要**: Signal QueriesはDeveloper Previewの段階です。

## クエリの種類

Angularには2つのカテゴリーのクエリがあります：

1. **View Queries**: コンポーネント自身のテンプレート（ビュー）内の要素を取得
2. **Content Queries**: コンポーネントのコンテンツ（投影されたコンテンツ）内の要素を取得

## View Queries

### viewChild - 単一要素の取得

単一の結果を取得する場合は`viewChild`を使用します：

```typescript
import { Component, viewChild, ElementRef } from '@angular/core';

@Component({
  template: `
    <div #el></div>
    <my-component />
  `
})
export class TestComponent {
  // 文字列で検索
  divEl = viewChild<ElementRef>('el');  // Signal<ElementRef|undefined>
  
  // 型で検索
  cmp = viewChild(MyComponent);         // Signal<MyComponent|undefined>
}
```

### viewChildren - 複数要素の取得

複数の結果を取得する場合は`viewChildren`を使用します：

```typescript
@Component({
  template: `
    <div #el></div>
    @if (show) {
      <div #el></div>
    }
  `
})
export class TestComponent {
  show = true;
  
  // 複数の結果を取得
  divEls = viewChildren<ElementRef>('el');  // Signal<ReadonlyArray<ElementRef>>
}
```

### View Queryのオプション

`viewChild`と`viewChildren`は2つの引数を受け取ります：

1. **ロケータ**: クエリターゲットを指定（文字列またはインジェクタブルトークン）
2. **オプション**: クエリの動作を調整

#### readオプション

`read`オプションは、マッチしたノードから注入する結果の型を指定します：

```typescript
@Component({
  template: `<my-component/>`
})
export class TestComponent {
  // ElementRefとして読み取り
  cmp = viewChild(MyComponent, { read: ElementRef });  
  // Signal<ElementRef|undefined>
}
```

## Content Queries

### contentChild - 単一コンテンツの取得

単一の結果を取得する場合は`contentChild`を使用します：

```typescript
@Component({...})
export class TestComponent {
  // 文字列で検索
  headerEl = contentChild<ElementRef>('h');   // Signal<ElementRef|undefined>
  
  // 型で検索
  header = contentChild(MyHeader);            // Signal<MyHeader|undefined>
}
```

### contentChildren - 複数コンテンツの取得

複数の結果を取得する場合は`contentChildren`を使用します：

```typescript
@Component({...})
export class TestComponent {
  // 複数の結果を取得
  divEls = contentChildren<ElementRef>('h');  
  // Signal<ReadonlyArray<ElementRef>>
}
```

### Content Queryのオプション

Content Queriesは以下のオプションを受け入れます：

#### descendantsオプション

デフォルトでは、Content Queriesは直接の子要素のみを検索します：

```typescript
@Component({
  selector: 'parent-comp',
  template: `<ng-content></ng-content>`
})
export class ParentComp {
  // 直接の子のみ (descendants: false がデフォルト)
  directChildren = contentChildren(ChildComp);
  
  // すべての子孫を含む
  allDescendants = contentChildren(ChildComp, { descendants: true });
}
```

⚠️ **注意**: `descendants: true`でも、クエリは他のコンポーネント内には入り込みません。

#### readオプション

View Queriesと同様に使用できます：

```typescript
@Component({...})
export class TestComponent {
  headers = contentChildren(MyHeader, { read: ElementRef });
  // Signal<ReadonlyArray<ElementRef>>
}
```

## 必須クエリ（Required Queries）

### 基本的な使い方

子クエリ（`viewChild`または`contentChild`）が結果を見つけられない場合、値は`undefined`になります。

ほとんどの場合、開発者は以下を想定します：
- 少なくとも1つのマッチング結果が存在する
- テンプレートが処理された時点でクエリ結果が利用可能

このような場合、`required`を使用して`undefined`を型から除外できます：

```typescript
@Component({
  selector: 'app-root',
  template: `
    <div #requiredEl></div>
  `
})
export class App {
  // 必須で存在する要素
  existingEl = viewChild.required('requiredEl');  
  // Signal<ElementRef> (undefinedなし)
  
  // 必須だが存在しない要素
  missingEl = viewChild.required('notInATemplate');  
  // ランタイムエラーが発生
  
  ngAfterViewInit() {
    console.log(this.existingEl());  // ✅ OK
    console.log(this.missingEl());   // ❌ ランタイムエラー
  }
}
```

### Required使用時の注意点

⚠️ **重要**: 
- `required`クエリが結果を見つけられない場合、Angularはエラーをスローします
- テンプレートのレンダリングが完了するまでアクセスしないこと

## クエリ結果の可用性タイミング

### 基本的な動作

1. **クエリ関数は早期に実行される**: ディレクティブインスタンス構築時に実行
2. **初期値**: 結果が収集される前は`undefined`（子クエリ）または空配列（子供クエリ）
3. **遅延計算**: クエリ結果はシグナルが読み取られるまで収集されない
4. **動的更新**: ビューの操作（`@if`、`@for`、`ViewContainerRef`など）により結果は変化

```typescript
@Component({
  template: `
    @if (show) {
      <div #dynamicEl></div>
    }
  `
})
export class DynamicComponent {
  show = signal(false);
  element = viewChild<ElementRef>('dynamicEl');
  
  ngAfterViewInit() {
    console.log(this.element());  // undefined (showがfalse)
    
    this.show.set(true);
    // 次の変更検知サイクル後
    setTimeout(() => {
      console.log(this.element());  // ElementRef (showがtrue)
    });
  }
}
```

### 遅延解決

⚠️ **注意**: 不完全なクエリ結果を返さないように、Angularはテンプレートのレンダリングが完了するまでクエリ解決を遅延させます。

## クエリ宣言の規則

### 使用できる場所

クエリ関数は**コンポーネントまたはディレクティブのプロパティ初期化時のみ**使用できます：

```typescript
@Component({
  selector: 'app-root',
  template: `<div #el></div>`
})
export class App {
  el = viewChild('el');  // ✅ OK
  
  constructor() {
    const myConst = viewChild('el');  // ❌ サポートされていない
  }
}
```

## デコレータベースクエリとの比較

### Signal-based Queriesの利点

1. **より予測可能なタイミング**: 結果が利用可能になり次第アクセス可能
2. **シンプルなAPI**: すべてのクエリがシグナルを返し、複数結果は標準配列
3. **型安全性の向上**: より少ない場合で`undefined`が含まれる
4. **正確な型推論**: 型述語や明示的な`read`オプション使用時により正確
5. **遅延更新**: 明示的に読み取らない限り、フレームワークは作業を行わない

### 比較表

| 特徴 | デコレータベース | Signal-based |
|------|-----------------|--------------|
| 宣言方法 | `@ViewChild()` | `viewChild()` |
| 戻り値 | プロパティ | `Signal` |
| 複数結果 | `QueryList` | `ReadonlyArray` |
| リアクティブ性 | `QueryList.changes` | Signalの性質 |
| 型安全性 | 低い | 高い |
| タイミング | ライフサイクルフック | 即座にアクセス可能 |

## 実践例

### 例1: フォーカス管理

```typescript
import { Component, viewChild, ElementRef, effect } from '@angular/core';

@Component({
  selector: 'search-form',
  template: `
    <input #searchInput type="text" placeholder="Search...">
    <button (click)="clearSearch()">Clear</button>
  `
})
export class SearchForm {
  searchInput = viewChild.required<ElementRef>('searchInput');
  
  ngAfterViewInit() {
    // コンポーネント表示時に自動フォーカス
    this.searchInput().nativeElement.focus();
  }
  
  clearSearch() {
    const input = this.searchInput().nativeElement;
    input.value = '';
    input.focus();
  }
}
```

### 例2: 複数要素の監視

```typescript
import { Component, viewChildren, ElementRef, effect } from '@angular/core';

@Component({
  selector: 'image-gallery',
  template: `
    @for (image of images(); track image.id) {
      <img #galleryImage [src]="image.url" [alt]="image.alt">
    }
  `
})
export class ImageGallery {
  images = signal([
    { id: 1, url: '/img1.jpg', alt: 'Image 1' },
    { id: 2, url: '/img2.jpg', alt: 'Image 2' },
  ]);
  
  galleryImages = viewChildren<ElementRef>('galleryImage');
  
  constructor() {
    effect(() => {
      const imageElements = this.galleryImages();
      console.log(`Gallery has ${imageElements.length} images`);
      
      // 各画像にイベントリスナーを追加
      imageElements.forEach((ref, index) => {
        ref.nativeElement.addEventListener('click', () => {
          console.log(`Image ${index + 1} clicked`);
        });
      });
    });
  }
}
```

### 例3: 子コンポーネントへのアクセス

```typescript
// 子コンポーネント
@Component({
  selector: 'video-player',
  template: `<video #video></video>`
})
export class VideoPlayer {
  private videoEl = viewChild.required<ElementRef>('video');
  
  play() {
    this.videoEl().nativeElement.play();
  }
  
  pause() {
    this.videoEl().nativeElement.pause();
  }
  
  getCurrentTime(): number {
    return this.videoEl().nativeElement.currentTime;
  }
}

// 親コンポーネント
@Component({
  selector: 'video-controls',
  template: `
    <video-player />
    <button (click)="togglePlayPause()">
      {{ isPlaying() ? 'Pause' : 'Play' }}
    </button>
  `
})
export class VideoControls {
  player = viewChild.required(VideoPlayer);
  isPlaying = signal(false);
  
  togglePlayPause() {
    const playerComponent = this.player();
    if (this.isPlaying()) {
      playerComponent.pause();
    } else {
      playerComponent.play();
    }
    this.isPlaying.update(v => !v);
  }
}
```

### 例4: Content Queriesの使用

```typescript
// タブコンポーネント
@Component({
  selector: 'tab',
  template: `
    <div class="tab-content" [hidden]="!active()">
      <ng-content></ng-content>
    </div>
  `
})
export class Tab {
  title = input.required<string>();
  active = signal(false);
  
  activate() {
    this.active.set(true);
  }
  
  deactivate() {
    this.active.set(false);
  }
}

// タブコンテナコンポーネント
@Component({
  selector: 'tabs',
  template: `
    <div class="tab-headers">
      @for (tab of tabs(); track tab; let i = $index) {
        <button 
          (click)="selectTab(i)"
          [class.active]="i === activeIndex()">
          {{ tab.title() }}
        </button>
      }
    </div>
    <div class="tab-container">
      <ng-content></ng-content>
    </div>
  `
})
export class Tabs {
  tabs = contentChildren(Tab);
  activeIndex = signal(0);
  
  constructor() {
    effect(() => {
      const allTabs = this.tabs();
      const currentIndex = this.activeIndex();
      
      // すべてのタブを非アクティブにして、選択されたタブをアクティブに
      allTabs.forEach((tab, index) => {
        if (index === currentIndex) {
          tab.activate();
        } else {
          tab.deactivate();
        }
      });
    });
  }
  
  selectTab(index: number) {
    this.activeIndex.set(index);
  }
}

// 使用例
@Component({
  template: `
    <tabs>
      <tab [title]="'Profile'">
        <p>Profile content</p>
      </tab>
      <tab [title]="'Settings'">
        <p>Settings content</p>
      </tab>
      <tab [title]="'Messages'">
        <p>Messages content</p>
      </tab>
    </tabs>
  `
})
export class UserDashboard {}
```

### 例5: 動的クエリとComputed

```typescript
import { Component, viewChildren, ElementRef, computed, signal } from '@angular/core';

@Component({
  selector: 'task-list',
  template: `
    <div>
      <input 
        type="checkbox" 
        [checked]="allCompleted()"
        (change)="toggleAll()">
      Select All
    </div>
    @for (task of tasks(); track task.id) {
      <div>
        <input 
          #taskCheckbox
          type="checkbox" 
          [checked]="task.completed"
          (change)="toggleTask(task.id)">
        {{ task.title }}
      </div>
    }
    <p>Completed: {{ completedCount() }} / {{ totalCount() }}</p>
  `
})
export class TaskList {
  tasks = signal([
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
    { id: 3, title: 'Task 3', completed: false },
  ]);
  
  checkboxes = viewChildren<ElementRef>('taskCheckbox');
  
  // 完了タスク数
  completedCount = computed(() => 
    this.tasks().filter(t => t.completed).length
  );
  
  // 総タスク数
  totalCount = computed(() => 
    this.tasks().length
  );
  
  // すべて完了しているか
  allCompleted = computed(() => 
    this.completedCount() === this.totalCount() && this.totalCount() > 0
  );
  
  toggleTask(id: number) {
    this.tasks.update(tasks => 
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }
  
  toggleAll() {
    const newState = !this.allCompleted();
    this.tasks.update(tasks => 
      tasks.map(t => ({ ...t, completed: newState }))
    );
  }
}
```

## ベストプラクティス

### ✅ 推奨

1. **存在が保証される要素には`required`を使用**
   ```typescript
   submitButton = viewChild.required<ElementRef>('submit');
   ```

2. **複数要素の処理にはeffectを活用**
   ```typescript
   constructor() {
     effect(() => {
       const elements = this.viewChildren();
       elements.forEach(el => /* 処理 */);
     });
   }
   ```

3. **適切なクエリタイプを選択**
   - ビュー内の要素 → `viewChild` / `viewChildren`
   - 投影コンテンツ → `contentChild` / `contentChildren`

4. **Computedで派生値を作成**
   ```typescript
   items = viewChildren(ItemComponent);
   itemCount = computed(() => this.items().length);
   ```

### ❌ 避けるべき

1. **コンストラクタでクエリ結果にアクセスしない**
   ```typescript
   // ❌ 悪い例
   constructor() {
     const el = this.element();  // まだ利用不可
   }
   
   // ✅ 良い例
   ngAfterViewInit() {
     const el = this.element();  // 利用可能
   }
   ```

2. **不必要にrequiredを使用しない**
   ```typescript
   // ❌ 条件付きレンダリングでrequired
   @if (show) { <div #el></div> }
   element = viewChild.required('el');  // showがfalseでエラー
   
   // ✅ オプショナルクエリ
   element = viewChild('el');  // undefined安全
   ```

3. **プロパティ初期化以外でクエリ関数を呼ばない**
   ```typescript
   // ❌ 悪い例
   ngOnInit() {
     this.element = viewChild('el');  // エラー
   }
   
   // ✅ 良い例
   element = viewChild('el');  // プロパティ初期化
   ```

## まとめ

Signal Queriesは従来のデコレータベースクエリよりも：

- **より型安全**
- **よりシンプルなAPI**
- **よりリアクティブ**
- **より予測可能**

Modern Angularアプリケーション開発において、Signal Queriesの使用が推奨されます。

### クイックリファレンス

| クエリタイプ | 対象 | 結果数 | 戻り値型 |
|------------|------|--------|---------|
| `viewChild` | ビュー | 単一 | `Signal<T\|undefined>` |
| `viewChildren` | ビュー | 複数 | `Signal<ReadonlyArray<T>>` |
| `contentChild` | コンテンツ | 単一 | `Signal<T\|undefined>` |
| `contentChildren` | コンテンツ | 複数 | `Signal<ReadonlyArray<T>>` |
| `*.required` | - | 単一 | `Signal<T>` (undefinedなし) |
