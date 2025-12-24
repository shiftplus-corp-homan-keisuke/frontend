# リファクタリング (Refactoring) in Angular

## 概念: 早めの痛み止め
「動いているから触らない」は、遅延した技術的負債への利子を増やし続ける行為です。
達人プログラマーは、コードが少しでも「臭う」と感じたら、即座に手を動かしてリファクタリングします。

### Angular における典型的なリファクタリング対象
1. **肥大化したコンポーネント (Fat Component / God Component)**
   - 1つのファイルにView、ロジック、通信、型定義が全て詰め込まれている。
2. **ハードコードされたロジック**
   - テンプレート内に複雑な条件分岐や計算式が書かれている。

---

## 学習用ファイル
Before と After を比較して学ぶ形式です。

1. `fat-component_before.ts`
   - **[Before]**: 典型的な悪いコード。HTTP通信、データ変換、表示ロジックが全て混ざっています。
2. `refactored/` ディレクトリ
   - **[After]**: 責務ごとに適切にファイル分割された状態。
   - `user-list.component.ts` (View)
   - `user-api.service.ts` (通信)
   - `user.transform.pipe.ts` (変換)
