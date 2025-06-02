# Step12 専門用語集

> 💡 **このファイルについて**: Step12で出てくるポートフォリオ完成関連の重要な専門用語と概念の詳細解説集です。

## 📋 目次
1. [ポートフォリオ用語](#ポートフォリオ用語)
2. [デプロイメント用語](#デプロイメント用語)
3. [ドキュメント用語](#ドキュメント用語)
4. [プレゼンテーション用語](#プレゼンテーション用語)

---

## ポートフォリオ用語

### ポートフォリオ（Portfolio）
**定義**: 自分のスキルや実績を示すための作品集

**構成要素**:
- プロジェクト一覧
- 技術スタック
- 成果物のデモ
- ソースコード
- 学習履歴

### プロジェクト構成（Project Structure）
**定義**: ポートフォリオサイトの構造設計

**実装例**:
```typescript
interface Portfolio {
  profile: {
    name: string;
    title: string;
    bio: string;
    skills: string[];
    contact: ContactInfo;
  };
  projects: Project[];
  experience: Experience[];
  education: Education[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  sourceUrl?: string;
  images: string[];
  features: string[];
}
```

---

## デプロイメント用語

### CI/CD（Continuous Integration/Continuous Deployment）
**定義**: 継続的インテグレーション・継続的デプロイメント

### GitHub Actions
**定義**: GitHubが提供するCI/CDプラットフォーム

**実装例**:
```yaml
name: Deploy Portfolio
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

### Vercel
**定義**: フロントエンド向けのホスティングプラットフォーム

### Netlify
**定義**: 静的サイト向けのホスティングサービス

---

## ドキュメント用語

### README
**定義**: プロジェクトの概要と使用方法を説明するファイル

### API ドキュメント
**定義**: APIの仕様と使用方法を説明するドキュメント

### JSDoc
**定義**: JavaScriptコードのドキュメント生成ツール

**実装例**:
```typescript
/**
 * ユーザー情報を取得する
 * @param userId - ユーザーID
 * @returns ユーザー情報のPromise
 * @example
 * ```typescript
 * const user = await getUser('123');
 * console.log(user.name);
 * ```
 */
async function getUser(userId: string): Promise<User> {
  // 実装
}
```

---

## プレゼンテーション用語

### デモ（Demo）
**定義**: プロジェクトの動作を実際に見せること

### 技術スタック（Tech Stack）
**定義**: プロジェクトで使用した技術の組み合わせ

### 成果物（Deliverables）
**定義**: プロジェクトで作成した具体的な成果

---

**📌 重要**: ポートフォリオは自分のスキルを効果的にアピールするためのツールです。見やすさと使いやすさを重視し、技術的な実力を適切に伝えることが重要です。