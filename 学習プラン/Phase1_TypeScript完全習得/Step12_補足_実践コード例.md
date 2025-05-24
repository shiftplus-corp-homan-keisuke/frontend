# Step12 実践コード例

> 💡 **このファイルについて**: ポートフォリオ完成の段階的な学習のためのコード例集です。

## 📋 目次
1. [ポートフォリオサイト構築](#ポートフォリオサイト構築)
2. [CI/CDパイプライン](#cicdパイプライン)
3. [ドキュメント自動生成](#ドキュメント自動生成)

---

## ポートフォリオサイト構築

### ステップ1: 基本構造
```typescript
// types/portfolio.ts
export interface Portfolio {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  contact: ContactInfo;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  sourceUrl?: string;
  images: string[];
  features: string[];
  startDate: Date;
  endDate?: Date;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Skill {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database';
  level: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
}

export interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  technologies: string[];
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}
```

### ステップ2: プロジェクト一覧
```typescript
// components/ProjectList.ts
import { Project } from '../types/portfolio';

export class ProjectList {
  private projects: Project[];
  private container: HTMLElement;

  constructor(projects: Project[], containerId: string) {
    this.projects = projects;
    this.container = document.getElementById(containerId)!;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="projects-grid">
        ${this.projects.map(project => this.renderProject(project)).join('')}
      </div>
    `;

    this.attachEventListeners();
  }

  private renderProject(project: Project): string {
    return `
      <div class="project-card" data-project-id="${project.id}">
        <div class="project-image">
          <img src="${project.images[0]}" alt="${project.title}" />
        </div>
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-technologies">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank">Demo</a>` : ''}
            ${project.sourceUrl ? `<a href="${project.sourceUrl}" target="_blank">Source</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    this.container.addEventListener('click', (event) => {
      const projectCard = (event.target as HTMLElement).closest('.project-card');
      if (projectCard) {
        const projectId = projectCard.getAttribute('data-project-id');
        if (projectId) {
          this.showProjectDetails(projectId);
        }
      }
    });
  }

  private showProjectDetails(projectId: string): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      // プロジェクト詳細モーダルを表示
      const modal = new ProjectModal(project);
      modal.show();
    }
  }
}

// components/ProjectModal.ts
export class ProjectModal {
  private project: Project;
  private modal: HTMLElement;

  constructor(project: Project) {
    this.project = project;
    this.createModal();
  }

  private createModal(): void {
    this.modal = document.createElement('div');
    this.modal.className = 'project-modal';
    this.modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <h2>${this.project.title}</h2>
          <div class="project-images">
            ${this.project.images.map(img => `<img src="${img}" alt="${this.project.title}" />`).join('')}
          </div>
          <p>${this.project.description}</p>
          <div class="project-features">
            <h3>主な機能</h3>
            <ul>
              ${this.project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
          <div class="project-technologies">
            <h3>使用技術</h3>
            ${this.project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const closeBtn = this.modal.querySelector('.modal-close');
    const overlay = this.modal.querySelector('.modal-overlay');

    closeBtn?.addEventListener('click', () => this.hide());
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.hide();
    });
  }

  show(): void {
    document.body.appendChild(this.modal);
    document.body.style.overflow = 'hidden';
  }

  hide(): void {
    document.body.removeChild(this.modal);
    document.body.style.overflow = 'auto';
  }
}
```

### ステップ3: 詳細ページ
```typescript
// pages/ProjectDetailPage.ts
export class ProjectDetailPage {
  private project: Project;

  constructor(projectId: string) {
    this.loadProject(projectId);
  }

  private async loadProject(projectId: string): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      this.project = await response.json();
      this.render();
    } catch (error) {
      console.error('プロジェクトの読み込みに失敗しました:', error);
      this.renderError();
    }
  }

  private render(): void {
    const container = document.getElementById('project-detail')!;
    container.innerHTML = `
      <article class="project-detail">
        <header class="project-header">
          <h1>${this.project.title}</h1>
          <div class="project-meta">
            <span class="project-status status-${this.project.status}">${this.getStatusText()}</span>
            <span class="project-date">${this.formatDateRange()}</span>
          </div>
        </header>

        <div class="project-gallery">
          ${this.renderGallery()}
        </div>

        <div class="project-content">
          <section class="project-overview">
            <h2>概要</h2>
            <p>${this.project.description}</p>
          </section>

          <section class="project-features">
            <h2>主な機能</h2>
            <ul>
              ${this.project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </section>

          <section class="project-technologies">
            <h2>使用技術</h2>
            <div class="tech-grid">
              ${this.project.technologies.map(tech => `
                <div class="tech-item">
                  <span class="tech-name">${tech}</span>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="project-links">
            <h2>リンク</h2>
            <div class="link-buttons">
              ${this.project.demoUrl ? `
                <a href="${this.project.demoUrl}" target="_blank" class="btn btn-primary">
                  デモを見る
                </a>
              ` : ''}
              ${this.project.sourceUrl ? `
                <a href="${this.project.sourceUrl}" target="_blank" class="btn btn-secondary">
                  ソースコード
                </a>
              ` : ''}
            </div>
          </section>
        </div>
      </article>
    `;
  }

  private renderGallery(): string {
    if (this.project.images.length === 0) return '';

    return `
      <div class="gallery">
        <div class="gallery-main">
          <img src="${this.project.images[0]}" alt="${this.project.title}" id="main-image" />
        </div>
        ${this.project.images.length > 1 ? `
          <div class="gallery-thumbnails">
            ${this.project.images.map((img, index) => `
              <img src="${img}" alt="${this.project.title} ${index + 1}" 
                   class="thumbnail ${index === 0 ? 'active' : ''}"
                   data-index="${index}" />
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  private getStatusText(): string {
    switch (this.project.status) {
      case 'completed': return '完了';
      case 'in-progress': return '進行中';
      case 'planned': return '計画中';
      default: return '';
    }
  }

  private formatDateRange(): string {
    const start = this.project.startDate.toLocaleDateString('ja-JP');
    const end = this.project.endDate?.toLocaleDateString('ja-JP') || '現在';
    return `${start} - ${end}`;
  }

  private renderError(): void {
    const container = document.getElementById('project-detail')!;
    container.innerHTML = `
      <div class="error-message">
        <h2>プロジェクトが見つかりません</h2>
        <p>指定されたプロジェクトは存在しないか、削除された可能性があります。</p>
        <a href="/projects" class="btn btn-primary">プロジェクト一覧に戻る</a>
      </div>
    `;
  }
}
```

---

## CI/CDパイプライン

### ステップ4: GitHub Actions設定
```yaml
# .github/workflows/deploy.yml
name: Deploy Portfolio

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test

      - name: Run linting
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### ステップ5: 自動デプロイ
```typescript
// scripts/deploy.ts
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

interface DeployConfig {
  buildDir: string;
  outputDir: string;
  environment: 'development' | 'staging' | 'production';
}

class Deployer {
  private config: DeployConfig;

  constructor(config: DeployConfig) {
    this.config = config;
  }

  async deploy(): Promise<void> {
    console.log(`🚀 ${this.config.environment}環境へのデプロイを開始...`);

    try {
      await this.prebuild();
      await this.build();
      await this.postbuild();
      await this.uploadFiles();
      
      console.log('✅ デプロイが完了しました！');
    } catch (error) {
      console.error('❌ デプロイに失敗しました:', error);
      process.exit(1);
    }
  }

  private async prebuild(): Promise<void> {
    console.log('📋 ビルド前の準備...');
    
    // 出力ディレクトリをクリア
    await fs.emptyDir(this.config.outputDir);
    
    // 環境変数の設定
    process.env.NODE_ENV = this.config.environment;
  }

  private async build(): Promise<void> {
    console.log('🔨 プロジェクトをビルド中...');
    
    execSync('npm run build', { stdio: 'inherit' });
  }

  private async postbuild(): Promise<void> {
    console.log('📦 ビルド後の処理...');
    
    // 必要なファイルをコピー
    await fs.copy(this.config.buildDir, this.config.outputDir);
    
    // メタファイルの生成
    await this.generateMetaFiles();
  }

  private async generateMetaFiles(): Promise<void> {
    const buildInfo = {
      buildTime: new Date().toISOString(),
      environment: this.config.environment,
      version: process.env.npm_package_version || '1.0.0',
      commit: process.env.GITHUB_SHA || 'unknown'
    };

    await fs.writeJSON(
      path.join(this.config.outputDir, 'build-info.json'),
      buildInfo,
      { spaces: 2 }
    );
  }

  private async uploadFiles(): Promise<void> {
    console.log('📤 ファイルをアップロード中...');
    
    switch (this.config.environment) {
      case 'production':
        await this.deployToProduction();
        break;
      case 'staging':
        await this.deployToStaging();
        break;
      default:
        console.log('開発環境のため、アップロードをスキップします');
    }
  }

  private async deployToProduction(): Promise<void> {
    execSync('vercel --prod', { stdio: 'inherit' });
  }

  private async deployToStaging(): Promise<void> {
    execSync('vercel', { stdio: 'inherit' });
  }
}

// 使用例
const deployer = new Deployer({
  buildDir: './dist',
  outputDir: './deploy',
  environment: (process.env.NODE_ENV as any) || 'development'
});

deployer.deploy();
```

---

## ドキュメント自動生成

### ステップ6: TypeDoc設定
```typescript
// scripts/generate-docs.ts
import { Application, TSConfigReader } from 'typedoc';
import path from 'path';

async function generateDocumentation(): Promise<void> {
  const app = new Application();

  // TypeDocの設定
  app.options.addReader(new TSConfigReader());
  app.bootstrap({
    entryPoints: ['src/index.ts'],
    out: 'docs/api',
    theme: 'default',
    includeVersion: true,
    excludeExternals: true,
    categorizeByGroup: true,
    defaultCategory: 'Other',
    categoryOrder: [
      'Components',
      'Types',
      'Utils',
      'Other'
    ]
  });

  const project = app.convert();

  if (project) {
    // ドキュメント生成
    await app.generateDocs(project, 'docs/api');
    console.log('✅ APIドキュメントが生成されました');
  } else {
    console.error('❌ プロジェクトの変換に失敗しました');
    process.exit(1);
  }
}

generateDocumentation();
```

### ステップ7: API ドキュメント生成
```typescript
// scripts/generate-api-docs.ts
import fs from 'fs-extra';
import path from 'path';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: Parameter[];
  responses: Response[];
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Response {
  status: number;
  description: string;
  schema?: any;
}

class APIDocGenerator {
  private endpoints: APIEndpoint[] = [];

  addEndpoint(endpoint: APIEndpoint): void {
    this.endpoints.push(endpoint);
  }

  async generateMarkdown(outputPath: string): Promise<void> {
    const markdown = this.generateMarkdownContent();
    await fs.writeFile(outputPath, markdown);
    console.log(`✅ APIドキュメントを生成しました: ${outputPath}`);
  }

  private generateMarkdownContent(): string {
    let content = '# API ドキュメント\n\n';
    content += '## エンドポイント一覧\n\n';

    for (const endpoint of this.endpoints) {
      content += this.generateEndpointMarkdown(endpoint);
    }

    return content;
  }

  private generateEndpointMarkdown(endpoint: APIEndpoint): string {
    let content = `### ${endpoint.method} ${endpoint.path}\n\n`;
    content += `${endpoint.description}\n\n`;

    if (endpoint.parameters && endpoint.parameters.length > 0) {
      content += '#### パラメータ\n\n';
      content += '| 名前 | 型 | 必須 | 説明 |\n';
      content += '|------|----|----|------|\n';
      
      for (const param of endpoint.parameters) {
        content += `| ${param.name} | ${param.type} | ${param.required ? '✓' : ''} | ${param.description} |\n`;
      }
      content += '\n';
    }

    content += '#### レスポンス\n\n';
    for (const response of endpoint.responses) {
      content += `**${response.status}**: ${response.description}\n\n`;
      if (response.schema) {
        content += '```json\n';
        content += JSON.stringify(response.schema, null, 2);
        content += '\n```\n\n';
      }
    }

    return content;
  }
}

// 使用例
const generator = new APIDocGenerator();

generator.addEndpoint({
  method: 'GET',
  path: '/api/projects',
  description: 'プロジェクト一覧を取得',
  responses: [
    {
      status: 200,
      description: 'プロジェクト一覧',
      schema: {
        projects: [
          {
            id: 'string',
            title: 'string',
            description: 'string'
          }
        ]
      }
    }
  ]
});

generator.generateMarkdown('docs/api.md');
```

---

**📌 重要**: ポートフォリオは自分のスキルを効果的にアピールするためのツールです。見やすさと使いやすさを重視し、技術的な実力を適切に伝えることが重要です。