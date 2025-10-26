# 設計文書

## 概要

CSV可視化システムは、Next.jsベースのWebアプリケーションで、ユーザーがCSVファイルをアップロードし、インタラクティブなグラフを生成できるシステムです。shadcn/uiコンポーネント、Rechartsライブラリ、PapaParseライブラリを使用して、直感的で応答性の高いユーザーエクスペリエンスを提供します。

## アーキテクチャ

### システム構成

```
┌─────────────────────────────────────────────────────────────┐
│                    フロントエンド (Next.js)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   ファイル       │  │   軸選択        │  │   グラフタイプ   │ │
│  │   アップロード   │  │   コンポーネント │  │   選択器        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   データ解析器   │  │   グラフ生成器   │  │   複数系列      │ │
│  │   (PapaParse)   │  │   (Recharts)    │  │   ハンドラー    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    状態管理 (React State)                     │
└─────────────────────────────────────────────────────────────┘
```

### データフロー

1. ユーザーがCSVファイルをアップロード
2. PapaParseがファイルを解析してJSONデータに変換
3. 列ヘッダーが軸選択器に表示される
4. ユーザーが軸とグラフタイプを選択
5. Rechartsがグラフをレンダリング

## コンポーネントとインターフェース

### 主要コンポーネント

#### 1. CSVUploaderコンポーネント
```typescript
interface CSVUploaderProps {
  onFileUpload: (data: ParsedCSVData) => void;
  onError: (error: string) => void;
}

interface ParsedCSVData {
  headers: string[];
  data: Record<string, any>[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
  };
}
```

#### 2. AxisSelectorコンポーネント
```typescript
interface AxisSelectorProps {
  headers: string[];
  selectedXAxis: string | null;
  selectedYAxes: string[];
  onXAxisChange: (axis: string) => void;
  onYAxesChange: (axes: string[]) => void;
  maxYAxes?: number;
}
```

#### 3. ChartTypeSelectorコンポーネント
```typescript
interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  disabled?: boolean;
  multipleYAxes: boolean;
}

type ChartType = 'bar' | 'line' | 'pie';
```

#### 4. ChartRendererコンポーネント
```typescript
interface ChartRendererProps {
  data: Record<string, any>[];
  xAxis: string;
  yAxes: string[];
  chartType: ChartType;
  loading?: boolean;
}
```

### 状態管理

#### メインアプリケーション状態
```typescript
interface AppState {
  csvData: ParsedCSVData | null;
  selectedXAxis: string | null;
  selectedYAxes: string[];
  chartType: ChartType;
  loading: boolean;
  error: string | null;
}
```

## データモデル

### CSVデータ構造
```typescript
interface CSVRow {
  [columnName: string]: string | number | null;
}

interface ProcessedChartData {
  name: string; // X軸の値
  [yAxisName: string]: string | number; // Y軸の値（複数可能）
}
```

### グラフ設定
```typescript
interface ChartConfig {
  xAxis: {
    dataKey: string;
    type: 'category' | 'number';
  };
  yAxes: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  chartType: ChartType;
}
```

## エラーハンドリング

### エラータイプ
```typescript
enum ErrorType {
  FILE_PARSE_ERROR = 'FILE_PARSE_ERROR',
  INVALID_DATA_TYPE = 'INVALID_DATA_TYPE',
  NO_DATA = 'NO_DATA',
  COLUMN_NOT_FOUND = 'COLUMN_NOT_FOUND'
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
}
```

### エラーハンドリング戦略

1. **ファイル解析エラー**: PapaParseのエラーをキャッチし、ユーザーフレンドリーなメッセージを表示
2. **データ型検証**: Y軸に選択された列が数値データを含むかチェック
3. **空データ**: CSVファイルが空またはヘッダーのみの場合の処理
4. **列不存在**: 選択された列がデータに存在しない場合の処理

## テスト戦略

### 単体テスト
- CSVファイル解析機能のテスト
- データ型検証ロジックのテスト
- グラフ設定変換ロジックのテスト

### 統合テスト
- ファイルアップロードからグラフ表示までの完全なフロー
- 異なるCSVフォーマットでの動作確認
- エラーケースの処理確認

### E2Eテスト
- ユーザーの典型的な使用シナリオ
- レスポンシブデザインの確認
- ブラウザ間の互換性確認

## パフォーマンス考慮事項

### 大容量ファイル処理
- ファイルサイズ制限（推奨: 10MB以下）
- ストリーミング解析の検討（大容量ファイル用）
- 仮想化によるレンダリング最適化

### メモリ管理
- 不要なデータの適切なクリーンアップ
- グラフレンダリング時のメモリ使用量監視

## セキュリティ考慮事項

### ファイルアップロード
- ファイル形式の検証（CSVのみ許可）
- ファイルサイズ制限
- クライアントサイドでの処理（サーバーへのアップロード不要）

### データ処理
- XSS攻撃防止のためのデータサニタイゼーション
- CSVインジェクション攻撃の防止

## UI/UXデザイン

### レイアウト構成
```
┌─────────────────────────────────────────────────────────────┐
│                        ヘッダー                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────────┐ │
│  │                 │  │                                     │ │
│  │   コントロール   │  │           グラフ表示エリア           │ │
│  │   パネル        │  │                                     │ │
│  │                 │  │                                     │ │
│  │ • ファイル選択   │  │                                     │ │
│  │ • 軸選択        │  │                                     │ │
│  │ • グラフタイプ   │  │                                     │ │
│  │                 │  │                                     │ │
│  └─────────────────┘  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### レスポンシブデザイン
- デスクトップ: サイドバイサイドレイアウト
- タブレット: 縦積みレイアウト
- モバイル: 単一カラムレイアウト（将来対応）

### アクセシビリティ
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 色覚異常者への配慮（色以外の識別方法も提供）

## 技術実装詳細

### Next.jsプロジェクト構成
```
src/
├── app/
│   ├── page.tsx                 # メインページ
│   ├── layout.tsx              # レイアウト
│   └── globals.css             # グローバルスタイル
├── components/
│   ├── ui/                     # shadcn/uiコンポーネント
│   ├── CSVUploader.tsx         # ファイルアップロード
│   ├── AxisSelector.tsx        # 軸選択
│   ├── ChartTypeSelector.tsx   # グラフタイプ選択
│   ├── ChartRenderer.tsx       # グラフレンダリング
│   └── ErrorDisplay.tsx        # エラー表示
├── lib/
│   ├── csvParser.ts           # CSV解析ユーティリティ
│   ├── chartUtils.ts          # グラフユーティリティ
│   └── utils.ts               # 共通ユーティリティ
└── types/
    └── index.ts               # 型定義
```

### 依存関係
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "recharts": "^2.8.0",
    "papaparse": "^5.4.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-label": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/papaparse": "^5.3.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0"
  }
}
```