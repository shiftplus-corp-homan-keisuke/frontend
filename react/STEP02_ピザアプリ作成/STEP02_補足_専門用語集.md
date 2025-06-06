# STEP02 補足資料：専門用語集

## 📚 目次

- [React コンポーネント (React Component)](#react-コンポーネント-react-component)
- [プロップス (Props)](#プロップス-props)
- [一方向データフロー (Unidirectional Data Flow)](#一方向データフロー-unidirectional-data-flow)
- [条件付きレンダリング (Conditional Rendering)](#条件付きレンダリング-conditional-rendering)
- [分割代入 (Destructuring Assignment)](#分割代入-destructuring-assignment)
- [TypeScript (型スクリプト)](#typescript-型スクリプト)
- [インターフェース (Interface)](#インターフェース-interface)
- [型エイリアス (Type Alias)](#型エイリアス-type-alias)
- [Vite (ヴィート)](#vite-ヴィート)
- [CSS Modules (CSS モジュールズ)](#css-modules-css-モジュールズ)
- [JSX (JavaScript XML)](#jsx-javascript-xml)
- [仮想 DOM (Virtual DOM)](#仮想dom-virtual-dom)
- [関数コンポーネント (Functional Component)](#関数コンポーネント-functional-component)
- [React.FC (Functional Component Type)](#reactfc-functional-component-type)
- [キー (Key)](#キー-key)
- [フラグメント (Fragment)](#フラグメント-fragment)

---

### React コンポーネント (React Component)

- **説明**: UI を構成する独立した再利用可能な部品。JavaScript の関数またはクラスとして定義され、`props` を受け取り、React 要素を返す。
- **関連概念**: 関数コンポーネント、クラスコンポーネント、Props

### プロップス (Props)

- **説明**: 親コンポーネントから子コンポーネントへデータを渡すための仕組み。`props` は "properties" の略で、読み取り専用（イミュータブル）である。
- **関連概念**: 一方向データフロー、分割代入、TypeScript

### 一方向データフロー (Unidirectional Data Flow)

- **説明**: React におけるデータの流れの原則。データは常に親コンポーネントから子コンポーネントへ一方向に流れる。これにより、アプリケーションの状態変化が予測しやすくなり、デバッグが容易になる。
- **関連概念**: Props、ステート

### 条件付きレンダリング (Conditional Rendering)

- **説明**: 特定の条件に基づいて、コンポーネントや要素をレンダリングするかどうかを決定する手法。JavaScript の `if` 文、三項演算子、論理 AND 演算子などが使われる。
- **関連概念**: 論理演算子、三項演算子

### 分割代入 (Destructuring Assignment)

- **説明**: 配列やオブジェクトから値を取り出し、個別の変数に代入するための JavaScript の構文。React の `props` を受け取る際によく使われる。
- **関連概念**: Props、JavaScript

### TypeScript (型スクリプト)

- **説明**: JavaScript に静的型付けを追加したプログラミング言語。大規模なアプリケーション開発において、コードの品質と保守性を向上させる。
- **関連概念**: 型定義、インターフェース、型エイリアス

### インターフェース (Interface)

- **説明**: TypeScript において、オブジェクトの構造やクラスが実装すべき契約を定義するための機能。`props` の型定義によく使われる。
- **関連概念**: TypeScript、型定義

### 型エイリアス (Type Alias)

- **説明**: 既存の型に新しい名前を付けるための TypeScript の機能。複雑な型定義を簡潔に表現したり、型に意味のある名前を付けたりするのに役立つ。
- **関連概念**: TypeScript、型定義

### Vite (ヴィート)

- **説明**: 高速な開発サーバーとビルドツールを提供するフロントエンド開発ツール。ES Modules を活用したオンデマンドコンパイルにより、開発時の起動速度とホットリロードが非常に速い。
- **関連概念**: ビルドツール、開発サーバー

### CSS Modules (CSS モジュールズ)

- **説明**: CSS をモジュール化し、各コンポーネントにスコープされたスタイルを適用するための仕組み。クラス名の衝突を防ぎ、スタイルの保守性を高める。
- **関連概念**: スタイリング、コンポーネント

### JSX (JavaScript XML)

- **説明**: React で UI を記述するために使用される JavaScript の構文拡張。HTML のような構造を JavaScript コード内に直接記述できる。
- **関連概念**: React、レンダリング

### 仮想 DOM (Virtual DOM)

- **説明**: React がパフォーマンス最適化のために使用する概念。実際の DOM の軽量なコピーであり、UI の変更を効率的に計算し、最小限の DOM 操作で実際の UI を更新する。
- **関連概念**: DOM、レンダリング、パフォーマンス

### 関数コンポーネント (Functional Component)

- **説明**: JavaScript の関数として定義される React コンポーネント。React 16.8 以降の Hooks の導入により、ステートやライフサイクル機能も利用できるようになった。
- **関連概念**: React コンポーネント、Hooks

### React.FC (Functional Component Type)

- **説明**: React の関数コンポーネントの型を定義するための TypeScript のユーティリティ型。`props` の型をジェネリクスとして渡すことで、型安全な関数コンポーネントを記述できる。
- **関連概念**: TypeScript、関数コンポーネント、Props

### キー (Key)

- **説明**: React でリストをレンダリングする際に、各リストアイテムに一意に割り当てる特別な `props`。React がリスト内の要素の変更（追加、削除、並べ替え）を効率的に追跡するために必要。
- **関連概念**: リストレンダリング、パフォーマンス

### フラグメント (Fragment)

- **説明**: 複数の要素をグループ化する際に、余分な DOM ノードを追加せずにコンポーネントを返すことができる React の機能。`<></>` の短縮構文も利用できる。
- **関連概念**: DOM、レンダリング
