# 偶発的プログラミングの回避 (Deliberate Programming) in Angular

## 概念: なぜ動いているのか理解せよ
「たまたま動いたからヨシ！」とするのではなく、**なぜ動くのか、なぜ動かないのか**を完全に理解してコーディングします。

Angular において「なんとなく動いている」の代表格は変更検知（Change Detection）と非同期処理（RxJS）です。
デフォルトの設定（Zone.jsによる自動検知）は便利ですが、これに頼り切っていると、大規模化した（パフォーマンスが悪化した）際に太刀打ちできなくなります。

意図を持ってプログラミングするための2つの柱：

1. **OnPush 戦略**: 「データが変わった時」を自分でコントロールする。
2. **Explicit Subscription**: RxJS の購読と解除を明示的に、あるいは宣言的に行う（メモリリーク回避）。

---

## 学習用ファイル

1. `performance.component.ts`
   - `ChangeDetectionStrategy.OnPush` を採用し、無駄な再描画を防ぐ「意図的な」コンポーネント実装。
2. `data-stream.service.ts`
   - `takeUntil` や `AsyncPipe` の仕組みを理解し、ストリームの寿命を正しく管理する例。
