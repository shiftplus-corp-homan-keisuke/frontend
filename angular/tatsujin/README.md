# Angular × 達人プログラマー (The Pragmatic Programmer)

このディレクトリは、名著『達人プログラマー』で紹介されている重要な概念を、Angular アプリケーション開発に適用するための実践的なコード例集です。

各フォルダに `README.md` とサンプルコードが含まれています。

## カリキュラム一覧

### 1. [直交性 (Orthogonality)](./01_orthogonality)
- **概念**: 結合度を下げる。
- **実装**: Smart/Dumb Component パターンと Service の分離。

### 2. [DRY 原則 (Don't Repeat Yourself)](./02_dry_principle)
- **概念**: 知識の二重化を防ぐ。
- **実装**: Directive, Pipe, Service による共通化。

### 3. [契約による設計 (Design by Contract)](./03_design_by_contract)
- **概念**: 期待される振る舞いを保証する。
- **実装**: Interface, Type Guards, Service内でのアサーション。

### 4. [曳光弾 (Tracer Bullets)](./04_tracer_bullets)
- **概念**: 暗闇でターゲットを見つける。
- **実装**: モックとスケルトンによるエンドツーエンドのプロトタイピング。

### 5. [偶発的プログラミングの回避 (Deliberate Programming)](./05_deliberate_programming)
- **概念**: 「なぜ動くか」を完全に理解する。
- **実装**: `OnPush` 戦略と RxJS の明示的な購読管理。

### 6. [割れ窓理論 (The Broken Window Theory)](./06_broken_windows)
- **概念**: 悪いコードを放置しない。
- **実装**: `any` の撲滅と Strict Mode (ESLint)。

### 7. [リファクタリング (Refactoring)](./07_refactoring)
- **概念**: 早めの痛み止め。
- **実装**: 肥大化したコンポーネントの分割 (Before/After)。

### 8. [冷酷なテスト (Test to Ruthlessness)](./08_ruthless_testing)
- **概念**: バグを殲滅する。
- **実装**: 境界値分析と隔離されたコンポーネントテスト。

---
> *Code created by Antigravity based on "The Pragmatic Programmer"*
