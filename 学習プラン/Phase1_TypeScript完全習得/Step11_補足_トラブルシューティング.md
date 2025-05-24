# Step11 トラブルシューティング

> 💡 **このファイルについて**: ツール開発でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [CLI開発関連エラー](#cli開発関連エラー)
2. [ビルドツール関連エラー](#ビルドツール関連エラー)
3. [パッケージング関連エラー](#パッケージング関連エラー)
4. [TypeScript Compiler API関連エラー](#typescript-compiler-api関連エラー)

---

## CLI開発関連エラー

### "command not found" エラー
**原因**: binフィールドの設定が正しくない

**解決方法**:
```json
// package.json
{
  "name": "my-cli-tool",
  "bin": {
    "my-tool": "./dist/cli.js"
  }
}
```

```typescript
// cli.ts の先頭に shebang を追加
#!/usr/bin/env node

import { Command } from 'commander';
// ...
```

### 権限エラー（Unix系）
**解決方法**:
```bash
# 実行権限を付与
chmod +x dist/cli.js

# または npm link で開発時テスト
npm link
```

---

## ビルドツール関連エラー

### TypeScript コンパイルエラー
**解決方法**:
```typescript
// 適切なエラーハンドリング
function reportDiagnostics(diagnostics: readonly ts.Diagnostic[]): void {
  diagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    }
  });
}
```

---

## パッケージング関連エラー

### npm publish エラー
**解決方法**:
```bash
# ログイン確認
npm whoami

# パッケージ名の重複確認
npm search your-package-name

# .npmignore で不要ファイルを除外
echo "src/" >> .npmignore
echo "*.ts" >> .npmignore
```

---

## TypeScript Compiler API関連エラー

### メモリ不足エラー
**解決方法**:
```bash
# Node.jsのメモリ制限を増加
node --max-old-space-size=4096 your-tool.js
```

---

**📌 重要**: ツール開発では、ユーザビリティを重視し、適切なエラーメッセージとヘルプを提供することが重要です。