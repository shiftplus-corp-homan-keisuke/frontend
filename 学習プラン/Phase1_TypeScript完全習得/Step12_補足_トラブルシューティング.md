# Step12 トラブルシューティング

> 💡 **このファイルについて**: ポートフォリオ完成でよくあるエラーと解決方法をまとめたガイドです。

## 📋 目次
1. [ポートフォリオサイト関連エラー](#ポートフォリオサイト関連エラー)
2. [デプロイメント関連エラー](#デプロイメント関連エラー)
3. [ドキュメント生成関連エラー](#ドキュメント生成関連エラー)
4. [SEO・パフォーマンス問題](#seoパフォーマンス問題)

---

## ポートフォリオサイト関連エラー

### 画像が表示されない
**原因**: パスの設定が正しくない

**解決方法**:
```typescript
// 相対パスではなく絶対パスを使用
const imagePath = `/images/projects/${project.id}/screenshot.png`;

// または環境変数を使用
const baseUrl = process.env.PUBLIC_URL || '';
const imagePath = `${baseUrl}/images/projects/${project.id}/screenshot.png`;
```

### レスポンシブデザインの問題
**解決方法**:
```css
/* モバイルファーストアプローチ */
.project-card {
  width: 100%;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .project-card {
    width: calc(50% - 1rem);
  }
}

@media (min-width: 1024px) {
  .project-card {
    width: calc(33.333% - 1rem);
  }
}
```

---

## デプロイメント関連エラー

### Vercel デプロイエラー
**解決方法**:
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### GitHub Actions エラー
**解決方法**:
```yaml
# 権限の設定
permissions:
  contents: read
  pages: write
  id-token: write

# Node.js バージョンの固定
- uses: actions/setup-node@v3
  with:
    node-version: '18.x'
    cache: 'npm'
```

---

## ドキュメント生成関連エラー

### TypeDoc 生成エラー
**解決方法**:
```typescript
// tsconfig.json でincludeを明確に指定
{
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
```

---

## SEO・パフォーマンス問題

### メタタグの設定
**解決方法**:
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="TypeScript開発者のポートフォリオ">
  <meta property="og:title" content="ポートフォリオ">
  <meta property="og:description" content="TypeScript開発者のポートフォリオ">
  <meta property="og:image" content="/images/og-image.png">
</head>
```

### 画像最適化
**解決方法**:
```typescript
// 画像の遅延読み込み
const img = document.createElement('img');
img.loading = 'lazy';
img.src = imagePath;

// WebP形式の使用
const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('webp') > -1;
};

const imageFormat = supportsWebP() ? 'webp' : 'jpg';
const imagePath = `/images/project.${imageFormat}`;
```

---

**📌 重要**: ポートフォリオサイトは第一印象が重要です。エラーがないことを確認し、ユーザビリティとパフォーマンスを重視しましょう。