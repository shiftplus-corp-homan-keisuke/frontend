# テンプレート穴埋めシステム 仕様書

## 📋 プロジェクト概要

Angular を使用したテンプレート作成・実行システム。ユーザーが特定の構文でプレースホルダーを含むテンプレートを作成し、後でそのプレースホルダーに値を入力して完成したテキストを生成できる機能を提供します。

---

## 🎯 機能要件

### 1. プレースホルダーの種類

#### 1.1 テキスト入力型

- **構文**: `#{プレースホルダー名}`
- **例**: `#{名前}`, `#{会社名}`, `#{日付}`
- **実行時の動作**: テキスト入力フィールドを生成

#### 1.2 選択型

- **構文**: `#select{選択肢1|選択肢2|選択肢3|...}`
- **例**: `#select{赤|青|緑|黄}`, `#select{晴れ|曇り|雨|雪}`
- **実行時の動作**: ドロップダウンリスト（select 要素）を生成
- **選択肢の区切り**: パイプ文字 `|`

### 2. テンプレート作成モード

#### 2.1 UI 構成

- **テキストエリア**: テンプレート本文を入力
- **プレビューエリア**: リアルタイムでプレースホルダーを視覚化
- **保存ボタン**: テンプレートを保存
- **テンプレート名入力**: テンプレートに名前を付ける

#### 2.2 プレビュー表示仕様

- プレースホルダー部分をバッジ風に表示
- **テキスト型**: 青色背景（例: `background: #3b82f6`, `color: white`）
- **選択型**: 緑色背景（例: `background: #10b981`, `color: white`）
- バッジスタイル: 角丸、パディング、インラインブロック表示

#### 2.3 入力例

```
こんにちは、#{名前}さん。
あなたの好きな色は#select{赤|青|緑|黄}ですね。
今日の天気は#select{晴れ|曇り|雨|雪}です。
#{メッセージ}
```

#### 2.4 プレビュー表示例

```
こんにちは、[名前]さん。
あなたの好きな色は[赤|青|緑|黄]ですね。
今日の天気は[晴れ|曇り|雨|雪]です。
[メッセージ]
```

※ `[名前]`は青色バッジ、`[赤|青|緑|黄]`は緑色バッジで表示

### 3. テンプレート一覧モード

#### 3.1 表示内容

- 保存済みテンプレートのリスト
- 各テンプレートの情報:
  - テンプレート名
  - 作成日時
  - プレースホルダー数
  - プレビュー（最初の 50 文字程度）

#### 3.2 操作

- **実行**: テンプレートを選択して実行モードへ遷移
- **編集**: テンプレートを編集モードで開く
- **削除**: テンプレートを削除（確認ダイアログ表示）

### 4. テンプレート実行モード

#### 4.1 UI 構成

- **テンプレート情報表示**: 選択したテンプレート名
- **入力フォームエリア**: プレースホルダーごとの入力フィールド
- **リアルタイムプレビューエリア**: 入力内容を反映した完成テキストをリアルタイム表示
- **コピーボタン**: プレビュー内容をクリップボードにコピー

#### 4.2 入力フィールド生成ルール

- 各プレースホルダーに対して:
  - **ラベル**: プレースホルダー名または選択肢の説明
  - **テキスト型**: `<input type="text">` を生成
  - **選択型**: `<select>` を生成し、各選択肢を `<option>` として追加
  - **リアルタイム更新**: 入力値の変更を検知し、即座にプレビューを更新

#### 4.3 入力フィールドとプレビュー表示例

```
テンプレート: 「こんにちは、#{名前}さん。好きな色は#select{赤|青|緑}です。」

【入力フォーム】
┌─────────────────────┐
│ 名前                │
│ [テキスト入力欄]    │
└─────────────────────┘

┌─────────────────────┐
│ 好きな色            │
│ [▼ 選択してください]│
│   - 赤              │
│   - 青              │
│   - 緑              │
└─────────────────────┘

【リアルタイムプレビュー】
┌─────────────────────────────────┐
│ こんにちは、太郎さん。          │
│ 好きな色は青です。              │
└─────────────────────────────────┘

[コピー]
```

※ 入力フィールドに「太郎」、選択ボックスで「青」を選択した状態

#### 4.4 リアルタイムプレビュー更新ロジック

1. テンプレート文字列を取得
2. 各入力フィールドの変更を監視（input イベント、change イベント）
3. 入力値が変更されるたびに、即座にプレースホルダーを対応する入力値で置換
4. 完成したテキストをリアルタイムでプレビューエリアに表示
5. 未入力のプレースホルダーは空文字または「（未入力）」として表示

---

## 🏗️ 技術仕様

### 1. データモデル

#### 1.1 Template インターフェース

```typescript
interface Template {
  id: string; // UUID
  name: string; // テンプレート名
  content: string; // テンプレート本文
  placeholders: Placeholder[]; // プレースホルダーリスト
  createdAt: Date; // 作成日時
  updatedAt: Date; // 更新日時
}
```

#### 1.2 Placeholder インターフェース

```typescript
interface Placeholder {
  id: string; // プレースホルダーID
  type: PlaceholderType; // プレースホルダータイプ
  name: string; // プレースホルダー名（テキスト型の場合）
  options?: string[]; // 選択肢（選択型の場合）
  position: number; // テンプレート内の出現位置
  originalText: string; // 元のテキスト（例: "#{名前}" または "#select{赤|青|緑}"）
}
```

#### 1.3 PlaceholderType Enum

```typescript
enum PlaceholderType {
  TEXT = 'text',
  SELECT = 'select',
}
```

### 2. 正規表現パターン

#### 2.1 テキスト型プレースホルダー

```typescript
const TEXT_PLACEHOLDER_REGEX = /#{([^}]+)}/g;
```

- マッチ例: `#{名前}`, `#{会社名}`
- キャプチャグループ 1: プレースホルダー名

#### 2.2 選択型プレースホルダー

```typescript
const SELECT_PLACEHOLDER_REGEX = /#select{([^}]+)}/g;
```

- マッチ例: `#select{赤|青|緑}`
- キャプチャグループ 1: 選択肢文字列（パイプ区切り）

### 3. サービス構成

#### 3.1 TemplateParserService

**責務**: テンプレート文字列の解析とプレースホルダー抽出

**主要メソッド**:

```typescript
class TemplateParserService {
  // テンプレートからプレースホルダーを抽出
  extractPlaceholders(content: string): Placeholder[];

  // プレースホルダーを値で置換
  replacePlaceholders(content: string, values: Map<string, string>): string;

  // プレビュー用HTML生成
  generatePreviewHtml(content: string): string;
}
```

#### 3.2 TemplateStorageService

**責務**: テンプレートの永続化（LocalStorage）

**主要メソッド**:

```typescript
class TemplateStorageService {
  // テンプレート保存
  saveTemplate(template: Template): void;

  // 全テンプレート取得
  getAllTemplates(): Template[];

  // ID指定でテンプレート取得
  getTemplateById(id: string): Template | null;

  // テンプレート更新
  updateTemplate(id: string, template: Partial<Template>): void;

  // テンプレート削除
  deleteTemplate(id: string): void;
}
```

**LocalStorage キー**: `template-system-templates`

### 4. コンポーネント構成

#### 4.1 TemplateCreatorComponent

- **パス**: `/create` または `/edit/:id`
- **機能**: テンプレート作成・編集
- **状態管理**: Angular Signals 使用

**主要プロパティ**:

```typescript
templateName = signal<string>('');
templateContent = signal<string>('');
previewHtml = computed(() => this.parser.generatePreviewHtml(this.templateContent()));
```

#### 4.2 TemplateListComponent

- **パス**: `/templates`
- **機能**: テンプレート一覧表示

**主要プロパティ**:

```typescript
templates = signal<Template[]>([]);
```

#### 4.3 TemplateExecutorComponent

- **パス**: `/execute/:id`
- **機能**: テンプレート実行

**主要プロパティ**:

```typescript
template = signal<Template | null>(null);
placeholderValues = signal<Map<string, string>>(new Map());
previewText = computed(() => {
  if (!this.template()) return '';
  return this.parser.replacePlaceholders(this.template()!.content, this.placeholderValues());
});
```

**リアルタイム更新の実装**:

- `placeholderValues` の変更を `computed` で監視
- 入力値が変更されるたびに自動的に `previewText` が再計算される
- Angular の変更検知により、プレビューエリアが自動更新される

#### 4.4 HomeComponent

- **パス**: `/` (ルート)
- **機能**: ホーム画面、各モードへのナビゲーション

### 5. ルーティング設定

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: TemplateCreatorComponent },
  { path: 'edit/:id', component: TemplateCreatorComponent },
  { path: 'templates', component: TemplateListComponent },
  { path: 'execute/:id', component: TemplateExecutorComponent },
  { path: '**', redirectTo: '' },
];
```

---

## 🎨 UI/UX デザイン仕様

### 1. カラーパレット

```css
/* プライマリカラー */
--primary: #3b82f6;
--primary-dark: #2563eb;

/* セカンダリカラー */
--secondary: #10b981;
--secondary-dark: #059669;

/* 背景色 */
--bg-primary: #ffffff;
--bg-secondary: #f3f4f6;

/* テキスト色 */
--text-primary: #111827;
--text-secondary: #6b7280;

/* ボーダー */
--border: #e5e7eb;
```

### 2. バッジスタイル

#### テキスト型プレースホルダー

```css
.placeholder-badge-text {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 2px;
}
```

#### 選択型プレースホルダー

```css
.placeholder-badge-select {
  display: inline-block;
  background-color: #10b981;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 2px;
}
```

### 3. フォームスタイル

```css
/* 入力フィールド */
.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* ラベル */
.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}
```

---

## 📦 実装タスク一覧

### Phase 1: 基盤構築

- [ ] データモデルとインターフェースを定義する
- [ ] TemplateParserService を実装する
- [ ] TemplateStorageService を実装する

### Phase 2: テンプレート作成機能

- [ ] TemplateCreatorComponent を作成する
- [ ] プレビュー機能を実装する（バッジ表示）
- [ ] テンプレート保存機能を実装する

### Phase 3: テンプレート管理機能

- [ ] TemplateListComponent を作成する
- [ ] テンプレート編集機能を実装する
- [ ] テンプレート削除機能を実装する

### Phase 4: テンプレート実行機能

- [ ] TemplateExecutorComponent を作成する
- [ ] 動的フォーム生成機能を実装する
- [ ] リアルタイムプレビュー機能を実装する（computed signals 使用）
- [ ] 入力値変更の監視とプレビュー自動更新を実装する
- [ ] クリップボードコピー機能を実装する

### Phase 5: ナビゲーションとスタイリング

- [ ] HomeComponent を作成する
- [ ] ルーティングを設定する
- [ ] 全体の UI スタイリングを適用する

---

## 🧪 テストケース

### 1. パーサーのテスト

#### テキスト型プレースホルダー

```typescript
// 入力: "こんにちは、#{名前}さん"
// 期待される出力: [{ type: 'text', name: '名前', ... }]
```

#### 選択型プレースホルダー

```typescript
// 入力: "色は#select{赤|青|緑}です"
// 期待される出力: [{ type: 'select', options: ['赤', '青', '緑'], ... }]
```

#### 混在パターン

```typescript
// 入力: "#{名前}さんの好きな色は#select{赤|青}です"
// 期待される出力: 2つのプレースホルダー
```

### 2. リアルタイムプレビューのテスト

```typescript
// テンプレート: "こんにちは、#{名前}さん。色は#select{赤|青|緑}です。"
// 入力値: { "名前": "太郎", "色選択": "青" }
// 期待される出力: "こんにちは、太郎さん。色は青です。"

// 未入力時のテスト
// 入力値: { "名前": "", "色選択": "" }
// 期待される出力: "こんにちは、さん。色はです。" または "こんにちは、（未入力）さん。色は（未入力）です。"

// 部分入力時のテスト
// 入力値: { "名前": "太郎", "色選択": "" }
// 期待される出力: "こんにちは、太郎さん。色はです。"
```

---

## 🚀 今後の拡張可能性

### 優先度: 中

- [ ] テンプレートのインポート・エクスポート機能（JSON 形式）
- [ ] プレースホルダーのデフォルト値設定（例: `#{名前:太郎}`）
- [ ] テンプレートのカテゴリ分け・タグ付け

### 優先度: 低

- [ ] テンプレートの検索機能
- [ ] 使用履歴の記録
- [ ] テンプレートの共有機能（URL 生成）
- [ ] マークダウン対応
- [ ] 複数言語対応

---

## 📝 備考

- LocalStorage の容量制限（約 5MB）に注意
- 大量のテンプレートを扱う場合は IndexedDB への移行を検討
- プレースホルダー名に特殊文字（`{`, `}`, `|`）は使用不可
- 同じプレースホルダー名が複数回出現する場合、すべて同じ値で置換される

---

**作成日**: 2025-11-28  
**バージョン**: 1.0.0
