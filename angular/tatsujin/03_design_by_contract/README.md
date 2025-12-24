# 契約による設計 (Design by Contract: DbC) in Angular

## 概念: 信頼するな、契約せよ
『達人プログラマー』では、関数やモジュールが正しく動作するための条件を「契約」と見なします。

1. **事前条件 (Preconditions)**: 関数を呼ぶ前に満たされていなければならない条件（例: 引数はnullであってはならない）。
2. **事後条件 (Postconditions)**: 関数が完了した後に保証されるべき条件（例: 戻り値は必ず正の整数である）。
3. **不変条件 (Invariants)**: 処理の最初から最後まで常に真であるべき条件（例: 口座残高は常に0以上）。

## Angular/TypeScript における実践

TypeScript の静的型システムは、この「契約」の多くをコンパイル時に強制する強力なツールです。

### 1. 厳格な型定義 (Strong Typing)
`any` を避け、`interface` や `Generics` を使うことで、データ構造の契約を明確にします。
Nullable (`string | null`) や Readonly (`readonly string[]`) も契約の一部です。

### 2. Runtime Validation
型は実行時には消えるため、APIからの入力やフォーム入力など、外部からのデータに対しては実行時の検証（Assertion/Guard）が必要です。

### 3. Assertion Functions
「ここを通る時、この変数は絶対にこの型である」ということをコンパイラに教えつつ、ランタイムエラーで不正状態を早期発見します。

---

## 学習用ファイル

1. `user.interface.ts`
   - `readonly` や `optional` を適切に使った、堅牢なデータ契約の例。
2. `account.service.ts`
   - 入金の事前条件（金額は正の数）や不変条件（残高不足にならない）をチェックするメソッド実装例。
