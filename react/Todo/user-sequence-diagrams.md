# Todo アプリ ユーザー操作シーケンス図

以下は、ユーザーの主要な操作（Todo 追加・編集・削除・完了トグル・D&D 順序変更）を起点としたシーケンス図です。

---

## 1. Todo 追加

```mermaid
sequenceDiagram
    participant User
    participant TodoForm(Component)
    participant addTodoAtom(Jotai)
    participant todoService
    participant Firestore
    participant baseTodosAtom(Jotai)

    User->>TodoForm(Component): テキスト・期日等を入力し「追加」クリック
    TodoForm(Component)->>addTodoAtom(Jotai): addTodoAtomに新規データ送信
    addTodoAtom(Jotai)->>baseTodosAtom(Jotai): オプティミスティックUIで即時追加
    addTodoAtom(Jotai)->>todoService: FirestoreへaddTodoリクエスト
    todoService->>Firestore: addDoc
    Firestore-->>todoService: 追加完了
    todoService-->>addTodoAtom(Jotai): 完了通知
    Note right of addTodoAtom(Jotai): FirestoreのonSnapshotでbaseTodosAtomが自動更新
```

---

## 2. Todo 編集

```mermaid
sequenceDiagram
    participant User
    participant TodoItem(Component)
    participant updateTodoAtom(Jotai)
    participant todoService
    participant Firestore
    participant baseTodosAtom(Jotai)

    User->>TodoItem(Component): 編集ボタン→編集内容入力→保存
    TodoItem(Component)->>updateTodoAtom(Jotai): 更新内容送信
    updateTodoAtom(Jotai)->>baseTodosAtom(Jotai): オプティミスティックUIで即時反映
    updateTodoAtom(Jotai)->>todoService: FirestoreへupdateTodoリクエスト
    todoService->>Firestore: updateDoc
    Firestore-->>todoService: 更新完了
    todoService-->>updateTodoAtom(Jotai): 完了通知
    Note right of updateTodoAtom(Jotai): FirestoreのonSnapshotでbaseTodosAtomが自動更新
```

---

## 3. Todo 削除

```mermaid
sequenceDiagram
    participant User
    participant TodoItem(Component)
    participant deleteTodoAtom(Jotai)
    participant todoService
    participant Firestore
    participant baseTodosAtom(Jotai)

    User->>TodoItem(Component): 削除ボタン押下（確認ダイアログ）
    TodoItem(Component)->>deleteTodoAtom(Jotai): 削除リクエスト
    deleteTodoAtom(Jotai)->>baseTodosAtom(Jotai): オプティミスティックUIで即時削除
    deleteTodoAtom(Jotai)->>todoService: FirestoreへdeleteTodoリクエスト
    todoService->>Firestore: deleteDoc
    Firestore-->>todoService: 削除完了
    todoService-->>deleteTodoAtom(Jotai): 完了通知
    Note right of deleteTodoAtom(Jotai): FirestoreのonSnapshotでbaseTodosAtomが自動更新
```

---

## 4. Todo 完了トグル

```mermaid
sequenceDiagram
    participant User
    participant TodoItem(Component)
    participant toggleTodoCompletionAtom(Jotai)
    participant updateTodoAtom(Jotai)
    participant todoService
    participant Firestore
    participant baseTodosAtom(Jotai)

    User->>TodoItem(Component): チェックボックスON/OFF
    TodoItem(Component)->>toggleTodoCompletionAtom(Jotai): トグルリクエスト
    toggleTodoCompletionAtom(Jotai)->>updateTodoAtom(Jotai): completedフラグ反転
    updateTodoAtom(Jotai)->>baseTodosAtom(Jotai): オプティミスティックUIで即時反映
    updateTodoAtom(Jotai)->>todoService: FirestoreへupdateTodoリクエスト
    todoService->>Firestore: updateDoc
    Firestore-->>todoService: 更新完了
    todoService-->>updateTodoAtom(Jotai): 完了通知
    Note right of updateTodoAtom(Jotai): FirestoreのonSnapshotでbaseTodosAtomが自動更新
```

---

## 5. D&D による順序変更

```mermaid
sequenceDiagram
    participant User
    participant TodoList(Component)
    participant updateTodosOrderAtomAction(Jotai)
    participant todoService
    participant Firestore
    participant baseTodosAtom(Jotai)

    User->>TodoList(Component): D&Dで順序変更
    TodoList(Component)->>updateTodosOrderAtomAction(Jotai): 新しい順序ID配列送信
    updateTodosOrderAtomAction(Jotai)->>baseTodosAtom(Jotai): オプティミスティックUIで即時並べ替え
    updateTodosOrderAtomAction(Jotai)->>todoService: FirestoreへupdateTodosOrderリクエスト
    todoService->>Firestore: batch.update
    Firestore-->>todoService: 更新完了
    todoService-->>updateTodosOrderAtomAction(Jotai): 完了通知
    Note right of updateTodosOrderAtomAction(Jotai): FirestoreのonSnapshotでbaseTodosAtomが自動更新
```

---

## 備考

- Firestore のリアルタイム購読（onSnapshot）により、DB 変更は baseTodosAtom に自動反映されます。
- オプティミスティック UI により、API 応答前に UI が即時更新されます。
- エラー時はロールバック処理が行われます。
