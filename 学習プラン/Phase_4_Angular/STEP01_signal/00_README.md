# Angular Signal 完全学習ガイド

このフォルダには、Angular v18のSignal機能に関する包括的な学習資料が含まれています。

## 📚 学習資料一覧

### 1. [Signal Basics](./01_Signal_Basics.md) ⭐ **最初に読むべき**
Angular Signalsの基礎を学習します。すべての機能の土台となる重要な概念です。

**主なトピック:**
- Writable Signals（signal()）の基本
- Computed Signals（computed()）の使い方
- Effects（effect()）の実践
- OnPush変更検知との統合
- 高度なトピック（等値関数、untracked、クリーンアップ）

### 2. [Signal Inputs](./02_Signal_Inputs.md)
親コンポーネントから値をバインドするための新しいリアクティブな方法を学習します。

**主なトピック:**
- Signal Inputsの基本（オプショナル/必須入力）
- エイリアス、Transform、Computed、Effect
- @Input()デコレータとの比較
- 実践的な使用例とベストプラクティス

### 3. [Model Inputs](./03_Model_Inputs.md)
双方向バインディングを実現するための特別なタイプの入力を学習します。

**主なトピック:**
- Model Inputsの基本と宣言方法
- 双方向バインディング（Signals/プレーンプロパティ）
- 暗黙的なChangeイベント
- input()との違いと使い分け
- フォームコントロールの実装例

### 4. [Signal Queries](./04_Signal_Queries.md)
子要素を検索してリアクティブにアクセスする方法を学習します。

**主なトピック:**
- View Queries（viewChild/viewChildren）
- Content Queries（contentChild/contentChildren）
- 必須クエリ（required）
- クエリ結果の可用性とタイミング
- デコレータベースクエリとの比較

### 5. [RxJS Interop](./05_RxJS_Interop.md)
SignalsとRxJS Observablesを統合する方法を学習します。

**主なトピック:**
- toSignal（ObservableをSignalに変換）
- toObservable（SignalをObservableに変換）
- 初期値の扱いとエラー処理
- Injection Context
- 実践的な統合パターン

## 🎯 学習の進め方

### ステップ0: 基礎の理解（01）⭐ **必須**
まず`01_Signal_Basics.md`でAngular Signalsの基礎を学びます。この知識がすべての土台になります。

### ステップ1: Input機能の理解（02 → 03）
`02_Signal_Inputs.md`で基本的なSignal Inputsを学び、次に`03_Model_Inputs.md`で双方向バインディングを理解します。

### ステップ2: 高度な機能（04）
`04_Signal_Queries.md`で子要素へのアクセスとクエリシステムをマスターします。

### ステップ3: 統合技術（05）
`05_RxJS_Interop.md`でSignalsとObservablesの統合方法を学び、既存のRxJSコードとの連携を理解します。

## 💡 各資料の特徴

### 構成
各学習資料は以下の構成になっています：

1. **概要**: 機能の全体像と目的
2. **基本**: 基本的な使い方と構文
3. **主要機能**: 詳細な機能解説
4. **実践例**: 実際のコード例（5-6個）
5. **ベストプラクティス**: 推奨される使い方と避けるべきパターン
6. **まとめ**: 重要ポイントのおさらい

### コード例の特徴
- ✅ 実用的なシナリオベース
- 💻 すぐに試せる完全なコード
- 📝 詳細なコメント付き
- ⚠️ 注意点やWarningの明示

## 🔍 クイックリファレンス

### Signal Inputs vs Model Inputs

| 特徴 | Signal Inputs | Model Inputs |
|------|--------------|--------------|
| 用途 | データの受け取り | 双方向バインディング |
| 書き込み | 不可（読み取り専用） | 可能（WritableSignal） |
| Output | なし | 自動生成（`*Change`） |
| Transform | サポート | 未サポート |
| 使用例 | 表示データ、設定値 | フォーム入力、トグル |

### View Queries vs Content Queries

| 特徴 | View Queries | Content Queries |
|------|-------------|-----------------|
| 対象 | コンポーネントのテンプレート | 投影コンテンツ（ng-content） |
| 関数 | viewChild/viewChildren | contentChild/contentChildren |
| タイミング | ngAfterViewInit以降 | ngAfterContentInit以降 |

### toSignal vs toObservable

| 特徴 | toSignal | toObservable |
|------|----------|--------------|
| 変換方向 | Observable → Signal | Signal → Observable |
| 初期値 | 必要（または undefined） | 不要 |
| 同期発行 | requireSyncオプション | 非同期 |
| 主な用途 | テンプレート表示 | RxJS操作との統合 |

## 📖 補足資料

### 公式ドキュメント
- [Angular Signals Overview](https://v18.angular.dev/guide/signals) ⭐ **基礎**
- [Signal Inputs](https://v18.angular.dev/guide/signals/inputs)
- [Model Inputs](https://v18.angular.dev/guide/signals/model)
- [Signal Queries](https://v18.angular.dev/guide/signals/queries)
- [RxJS Interop](https://v18.angular.dev/guide/signals/rxjs-interop)

### 関連トピック
- Angular基礎のSignals（signal(), computed(), effect()）← これが一番重要
- OnPush変更検知戦略
- Reactive Forms
- RxJS基礎

## ⚠️ 重要な注意事項

### Developer Preview機能
以下の機能は現在Developer Preview段階です：
- Signal Inputs
- Model Inputs
- Signal Queries
- RxJS Interop

本番環境での使用前に、Angular公式のリリースステータスを確認してください。

### バージョン
この学習資料はAngular v18に基づいています。新しいバージョンではAPIが変更される可能性があります。

## 🚀 実践プロジェクト例

これらの機能を組み合わせた実践プロジェクトのアイデア：

### 1. タスク管理アプリ
- Signal Inputs: タスクデータの受け渡し
- Model Inputs: チェックボックス、入力フィールド
- Signal Queries: タスクリストの子要素アクセス
- RxJS Interop: API通信とリアルタイム更新

### 2. ショッピングカート
- Signal Inputs: 商品情報の表示
- Model Inputs: 数量入力、オプション選択
- Signal Queries: カートアイテムの管理
- RxJS Interop: 在庫確認API、価格計算

### 3. チャットアプリケーション
- Signal Inputs: メッセージ表示
- Model Inputs: テキスト入力フィールド
- Signal Queries: メッセージリストの管理
- RxJS Interop: WebSocket通信

## 📝 学習チェックリスト

### Signal Basics ⭐ **必須**
- [ ] signal()の基本的な使い方を理解
- [ ] set()とupdate()の違いを理解
- [ ] computed()の仕組みと遅延評価を理解
- [ ] effect()の適切な使用場面を把握
- [ ] OnPushとの統合を理解
- [ ] untracked()とクリーンアップ関数を使える

### Signal Inputs
- [ ] オプショナルと必須入力の違いを理解
- [ ] Transformの適切な使用場面を把握
- [ ] ComputedとEffectの使い分けができる
- [ ] @Input()との違いを説明できる

### Model Inputs
- [ ] 双方向バインディングの仕組みを理解
- [ ] SignalとPlainプロパティの両方で使用できる
- [ ] 暗黙的Changeイベントを説明できる
- [ ] input()との使い分けができる

### Signal Queries
- [ ] viewChildとcontentChildの違いを理解
- [ ] requiredクエリの適切な使用
- [ ] クエリ結果のタイミングを把握
- [ ] デコレータベースクエリとの違いを説明できる

### RxJS Interop
- [ ] toSignalの適切な初期値設定ができる
- [ ] toObservableのタイミングを理解
- [ ] Injection Contextの概念を把握
- [ ] エラー処理と完了処理を実装できる

## 🎓 次のステップ

この学習資料を完了したら、以下のトピックに進むことをお勧めします：

1. **Advanced Signals**: より高度なSignalパターン
2. **State Management**: Signal-based状態管理
3. **Performance Optimization**: Signalを使用した最適化
4. **Testing**: Signal機能のテスト方法

---

## 📞 サポート

質問や問題がある場合：
- Angular公式ドキュメントを確認
- Angular Discordコミュニティに参加
- Stack Overflowで質問（`angular` `signals`タグ）

Happy Learning! 🚀
