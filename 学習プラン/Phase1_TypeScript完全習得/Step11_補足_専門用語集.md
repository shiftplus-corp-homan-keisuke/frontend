# Step11 専門用語集

> 💡 **このファイルについて**: Step11で出てくるツール開発関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [ツール開発用語](#ツール開発用語)
2. [CLI開発用語](#cli開発用語)
3. [ビルドツール用語](#ビルドツール用語)
4. [パッケージング用語](#パッケージング用語)

---

## ツール開発用語

### CLI（Command Line Interface）
**定義**: コマンドライン経由で操作するインターフェース

**実装例**:
```typescript
#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('my-tool')
  .description('TypeScript開発ツール')
  .version('1.0.0');

program
  .command('build')
  .description('プロジェクトをビルド')
  .option('-w, --watch', 'ウォッチモード')
  .action((options) => {
    console.log('ビルド開始', options);
  });

program.parse();
```

### AST（Abstract Syntax Tree）
**定義**: ソースコードの構文構造を木構造で表現したもの

**実装例**:
```typescript
import * as ts from 'typescript';

function analyzeCode(sourceCode: string): void {
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node: ts.Node): void {
    console.log(ts.SyntaxKind[node.kind]);
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}
```

---

## CLI開発用語

### Commander.js
**定義**: Node.js用のCLIフレームワーク

### Inquirer.js
**定義**: インタラクティブなCLIプロンプトライブラリ

### Chalk
**定義**: ターミナル出力の色付けライブラリ

---

## ビルドツール用語

### Webpack
**定義**: モジュールバンドラー

### Rollup
**定義**: ES6モジュール用バンドラー

### esbuild
**定義**: 高速なJavaScript/TypeScriptビルドツール

---

## パッケージング用語

### npm package
**定義**: npmレジストリに公開するパッケージ

### package.json
**定義**: Node.jsプロジェクトの設定ファイル

### bin field
**定義**: 実行可能ファイルを指定するpackage.jsonのフィールド

---

**📌 重要**: ツール開発では、ユーザビリティと保守性を重視し、適切なエラーハンドリングとドキュメントを提供することが重要です。