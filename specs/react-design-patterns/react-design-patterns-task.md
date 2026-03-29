# STEP07: React設計パターンとTypeScript実践 - タスクリスト

## Task一覧

| task_id | name | agent | priority | dependencies | status |
|---------|------|-------|----------|-------------|--------|
| T1 | Session1: TypeScript × React 基礎 | frontend-specialist | P1 | なし | completed |
| T2 | Session2: コンポーネント設計パターン | frontend-specialist | P1 | T1 | completed |
| T3 | Session3: 高度なコンポーネントパターン | frontend-specialist | P1 | T2 | completed |
| T4 | Session4: Generics と汎用コンポーネント | frontend-specialist | P1 | T1, T2, T3 | completed |
| T5 | Session5: プロダクション設計実践 | frontend-specialist | P1 | T1-T4 | completed |

## 各タスクの詳細

### T1: Session1 - TypeScript × React 基礎
- **INPUT**: STEP06までの学習知識
- **OUTPUT**: `STEP07_Session1_TypeScript_React基礎.md`
- **VERIFY**: Props/State/Event/children の型定義パターンが解説されている
- **カバー内容**: type vs interface、オプショナルProps、リテラル型、useState型、イベント型、Record

### T2: Session2 - コンポーネント設計パターン
- **INPUT**: Session1 の知識
- **OUTPUT**: `STEP07_Session2_コンポーネント設計パターン.md`
- **VERIFY**: Container/Presentational、Compound Components の Before/After 実例がある
- **カバー内容**: ロジックとUIの分離、Context による暗黙的状態共有、カスタムフックとの組み合わせ

### T3: Session3 - 高度なコンポーネントパターン
- **INPUT**: Session2 の知識
- **OUTPUT**: `STEP07_Session3_高度なコンポーネントパターン.md`
- **VERIFY**: HOC、Render Props、Headless の実例と比較がある
- **カバー内容**: パターンの歴史的変遷、各パターンの長所短所、useToggle/useForm の実装

### T4: Session4 - Generics と汎用コンポーネント
- **INPUT**: Session1 + Session2-3 の知識
- **OUTPUT**: `STEP07_Session4_Genericsと汎用コンポーネント.md`
- **VERIFY**: Generics を使った汎用 List/Select コンポーネントが構築されている
- **カバー内容**: 型パラメータ、extends 制約、Discriminated Union、ユーティリティ型

### T5: Session5 - プロダクション設計実践
- **INPUT**: Session1-4 の全知識
- **OUTPUT**: `STEP07_Session5_プロダクション設計実践.md`
- **VERIFY**: Feature-based フォルダ構成、バレルエクスポート、総合演習が含まれている
- **カバー内容**: フォルダ構成原則、バレルエクスポート、型ファイル設計、タスク管理機能の設計演習
