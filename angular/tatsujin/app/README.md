# Pragmatic Task Manager using Angular

『達人プログラマー』の概念を体現したタスク管理アプリケーションです。
以下の8つの原則がプロジェクトコードに組み込まれています。

## ファイルと原則のマッピング

| 原則 | 説明 | 該当ファイル |
|---|---|---|
| **1. 曳光弾 (Tracer Bullets)** | 動く骨格を最速で作る | `app.routes.ts`, `app/core/services/mock-auth.service.ts` |
| **2. 割れ窓理論 (Broken Windows)** | 腐敗を防ぐ厳格な設定 | `tsconfig.json` (strict: true), `src/styles.css` (Clean base) |
| **3. 契約による設計 (DbC)** | 厳格な型と事前条件 | `core/models/task.model.ts`, `core/services/task.service.ts` |
| **4. 直交性 (Orthogonality)** | 状態と通信の分離 | `core/services/task-state.service.ts` |
| **5. 意図的なプログラミング** | 明示的なRxJSフロー | `features/task-list/task-list.component.ts` (AsyncPipe, OnPush) |
| **6. DRY原則** | 知識の単一化 | `shared/directives/status-color.directive.ts` |
| **7. リファクタリング** | 責務の適切な分割 | `features/task-item/task-item.component.ts` (Dumb Component) |
| **8. 冷酷なテスト** | 境界値・異常系テスト | `core/services/task.service.spec.ts` |

## プロジェクト構造

```
src/app/
  core/      # シングルトン (Service, Guard, Model)
  shared/    # 共通部品 (Directive, Pipe)
  features/  # 機能モジュール (Home, TaskList, TaskItem)
```

このプロジェクトは、単なる機能実装ではなく「保守性」「堅牢性」を最優先したコードベースです。
各ファイルの実装詳細（コメント）を確認しながら学習してください。
