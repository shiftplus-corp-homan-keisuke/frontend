# Week 12: ポートフォリオ完成

## 📅 学習期間・目標

**期間**: Week 12（7日間）  
**総学習時間**: 15時間（平日2時間、週末2.5時間）  
**学習スタイル**: 理論10% + 実践コード60% + ドキュメント30%

### 🎯 Week 12 到達目標

- [ ] 12週間の学習成果の統合
- [ ] 包括的なポートフォリオサイトの完成
- [ ] 技術ドキュメントの整備
- [ ] プロジェクトのデプロイと公開
- [ ] 継続学習計画の策定

## 📚 プロジェクト統合

### Day 1-2: ポートフォリオサイト構築

#### 🔍 ポートフォリオ設計

```typescript
// portfolio/types/index.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: Technology[];
  features: string[];
  challenges: string[];
  solutions: string[];
  demoUrl?: string;
  sourceUrl: string;
  imageUrl: string;
  category: ProjectCategory;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
}

export interface Technology {
  name: string;
  category: 'language' | 'framework' | 'library' | 'tool' | 'database';
  proficiency: 'beginner' | 'intermediate' | 'advanced';
  icon?: string;
}

export type ProjectCategory = 
  | 'web-application' 
  | 'library' 
  | 'tool' 
  | 'api' 
  | 'mobile';

export type ProjectStatus = 
  | 'completed' 
  | 'in-progress' 
  | 'planned' 
  | 'archived';

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    github: string;
    linkedin?: string;
    avatar: string;
  };
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
}
```

#### 🎯 メインポートフォリオアプリ

```typescript
// portfolio/src/PortfolioApp.ts
export class PortfolioApp {
  private container: HTMLElement;
  private data: PortfolioData;

  constructor(containerId: string, data: PortfolioData) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
    this.data = data;
    this.init();
  }

  private init(): void {
    this.setupHTML();
    this.renderProjects();
    this.renderSkills();
    this.setupEventListeners();
  }

  private setupHTML(): void {
    this.container.innerHTML = `
      <header class="portfolio-header">
        <div class="hero-section">
          <img src="${this.data.personal.avatar}" alt="${this.data.personal.name}" class="avatar" />
          <h1>${this.data.personal.name}</h1>
          <h2>${this.data.personal.title}</h2>
          <p>${this.data.personal.bio}</p>
          <div class="social-links">
            <a href="${this.data.personal.github}" target="_blank">GitHub</a>
            ${this.data.personal.linkedin ? `<a href="${this.data.personal.linkedin}" target="_blank">LinkedIn</a>` : ''}
          </div>
        </div>
      </header>

      <main class="portfolio-main">
        <section id="projects" class="projects-section">
          <h2>プロジェクト</h2>
          <div class="project-filters">
            <button class="filter-btn active" data-filter="all">すべて</button>
            <button class="filter-btn" data-filter="web-application">Webアプリ</button>
            <button class="filter-btn" data-filter="library">ライブラリ</button>
            <button class="filter-btn" data-filter="tool">ツール</button>
          </div>
          <div class="projects-grid" id="projects-grid"></div>
        </section>

        <section id="skills" class="skills-section">
          <h2>スキル</h2>
          <div class="skills-container" id="skills-container"></div>
        </section>

        <section id="experience" class="experience-section">
          <h2>学習経験</h2>
          <div class="timeline" id="timeline"></div>
        </section>
      </main>
    `;
  }

  private renderProjects(): void {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    this.data.projects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      grid.appendChild(projectCard);
    });
  }

  private createProjectCard(project: Project): HTMLElement {
    const card = document.createElement('div');
    card.className = `project-card ${project.category}`;
    card.innerHTML = `
      <div class="project-image">
        <img src="${project.imageUrl}" alt="${project.title}" />
        <div class="project-overlay">
          <div class="project-links">
            ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="btn btn-demo">Demo</a>` : ''}
            <a href="${project.sourceUrl}" target="_blank" class="btn btn-source">Source</a>
          </div>
        </div>
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-technologies">
          ${project.technologies.map(tech => 
            `<span class="tech-tag">${tech.name}</span>`
          ).join('')}
        </div>
        <div class="project-meta">
          <span class="project-status status-${project.status}">${project.status}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      this.showProjectModal(project);
    });

    return card;
  }

  private showProjectModal(project: Project): void {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${project.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <img src="${project.imageUrl}" alt="${project.title}" />
          <div class="project-details">
            <h3>概要</h3>
            <p>${project.longDescription}</p>
            
            <h3>主な機能</h3>
            <ul>${project.features.map(f => `<li>${f}</li>`).join('')}</ul>
            
            <h3>技術的課題</h3>
            <ul>${project.challenges.map(c => `<li>${c}</li>`).join('')}</ul>
            
            <h3>解決方法</h3>
            <ul>${project.solutions.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="modal-footer">
          ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="btn btn-primary">デモを見る</a>` : ''}
          <a href="${project.sourceUrl}" target="_blank" class="btn btn-secondary">ソースコード</a>
        </div>
      </div>
    `;

    modal.addEventListener('click', (e) => {
      if (e.target === modal || (e.target as HTMLElement).classList.contains('modal-close')) {
        document.body.removeChild(modal);
      }
    });

    document.body.appendChild(modal);
  }

  private renderSkills(): void {
    const container = document.getElementById('skills-container');
    if (!container) return;

    const skillsByCategory = this.groupSkillsByCategory();
    
    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'skill-category';
      categoryDiv.innerHTML = `
        <h3>${category}</h3>
        <div class="skills-list">
          ${skills.map(skill => `
            <div class="skill-item">
              <span class="skill-name">${skill.name}</span>
              <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.level * 10}%"></div>
              </div>
              <span class="skill-level">${skill.level}/10</span>
            </div>
          `).join('')}
        </div>
      `;
      container.appendChild(categoryDiv);
    });
  }

  private groupSkillsByCategory(): Record<string, Skill[]> {
    return this.data.skills.reduce((groups, skill) => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }
      groups[skill.category].push(skill);
      return groups;
    }, {} as Record<string, Skill[]>);
  }

  private setupEventListeners(): void {
    // プロジェクトフィルター
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const filter = target.dataset.filter;
        
        // アクティブボタンの切り替え
        filterBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        
        // プロジェクトのフィルタリング
        this.filterProjects(filter || 'all');
      });
    });
  }

  private filterProjects(filter: string): void {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      const cardElement = card as HTMLElement;
      if (filter === 'all' || cardElement.classList.contains(filter)) {
        cardElement.style.display = 'block';
      } else {
        cardElement.style.display = 'none';
      }
    });
  }
}
```

### Day 3-4: プロジェクトデータの統合

#### 🔧 学習成果データ

```typescript
// portfolio/data/portfolio-data.ts
export const portfolioData: PortfolioData = {
  personal: {
    name: "あなたの名前",
    title: "TypeScript Developer",
    bio: "12週間でTypeScriptを基礎から実践まで習得し、型安全で保守性の高いアプリケーション開発ができるようになりました。",
    location: "日本",
    email: "your.email@example.com",
    github: "https://github.com/yourusername",
    avatar: "/images/avatar.jpg"
  },

  projects: [
    {
      id: "todo-app",
      title: "TypeScript Todo アプリケーション",
      description: "型安全な状態管理を実装したTodoアプリケーション",
      longDescription: "TypeScriptの型システムを活用して、型安全な状態管理システムを構築したTodoアプリケーションです。",
      technologies: [
        { name: "TypeScript", category: "language", proficiency: "intermediate" },
        { name: "HTML5", category: "language", proficiency: "intermediate" },
        { name: "CSS3", category: "language", proficiency: "intermediate" }
      ],
      features: [
        "型安全な状態管理システム",
        "CRUD操作の完全実装",
        "フィルタリング・ソート機能",
        "レスポンシブデザイン"
      ],
      challenges: [
        "複雑な状態の型安全な管理",
        "ジェネリクスを使った再利用可能なコンポーネント設計"
      ],
      solutions: [
        "判別可能なユニオン型による状態管理",
        "制約付きジェネリクスによる型安全なコンポーネント"
      ],
      demoUrl: "https://yourusername.github.io/typescript-todo",
      sourceUrl: "https://github.com/yourusername/typescript-todo",
      imageUrl: "/images/todo-app.png",
      category: "web-application",
      startDate: new Date("2025-02-15"),
      endDate: new Date("2025-02-28"),
      status: "completed"
    },
    {
      id: "type-generator",
      title: "API型定義生成ツール",
      description: "OpenAPI仕様からTypeScript型定義を自動生成するツール",
      longDescription: "OpenAPI仕様書を解析して、TypeScript型定義を自動生成するCLIツールです。",
      technologies: [
        { name: "TypeScript", category: "language", proficiency: "advanced" },
        { name: "Node.js", category: "framework", proficiency: "intermediate" }
      ],
      features: [
        "OpenAPI 3.0対応",
        "ネストしたオブジェクト型の生成",
        "カスタムテンプレート対応"
      ],
      challenges: [
        "複雑なAPI仕様の型変換",
        "AST操作による動的な型生成"
      ],
      solutions: [
        "再帰的型定義による複雑な構造の表現",
        "Compiler APIを使った精密なコード生成"
      ],
      sourceUrl: "https://github.com/yourusername/ts-type-generator",
      imageUrl: "/images/type-generator.png",
      category: "tool",
      startDate: new Date("2025-03-15"),
      endDate: new Date("2025-03-22"),
      status: "completed"
    }
  ],

  skills: [
    { name: "TypeScript", category: "言語", level: 8, yearsOfExperience: 0.25, projects: ["todo-app", "type-generator"] },
    { name: "JavaScript", category: "言語", level: 7, yearsOfExperience: 1, projects: ["todo-app"] },
    { name: "HTML/CSS", category: "言語", level: 6, yearsOfExperience: 1, projects: ["todo-app"] },
    { name: "Node.js", category: "ランタイム", level: 6, yearsOfExperience: 0.5, projects: ["type-generator"] },
    { name: "Jest", category: "テスト", level: 5, yearsOfExperience: 0.25, projects: ["todo-app"] },
    { name: "Git", category: "ツール", level: 7, yearsOfExperience: 1, projects: ["todo-app", "type-generator"] }
  ],

  experience: [
    {
      title: "TypeScript 12週間集中学習",
      type: "education",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-03-31"),
      description: "TypeScriptの基礎から高度な型機能まで体系的に学習",
      achievements: [
        "型安全なアプリケーション開発の習得",
        "高度な型機能の実践的活用",
        "開発ツールの自作",
        "実用的なライブラリの開発"
      ],
      technologies: ["TypeScript", "JavaScript", "Node.js", "Jest", "ESLint"]
    }
  ]
};
```

### Day 5-7: ドキュメント整備とデプロイ

#### 🔧 学習の軌跡ドキュメント

```typescript
// portfolio/docs/learning-journey.md
export const learningJourneyMarkdown = `
# TypeScript学習の軌跡

## 学習概要
12週間でTypeScriptを基礎から実践まで体系的に学習しました。

## 週別学習内容

### Week 1-2: 基礎固め
- JavaScript復習とTypeScript環境構築
- 基本型システムとインターフェース

### Week 3-4: 中級機能
- ユニオン型と型ガード
- ジェネリクス基礎

### Week 5-6: 高度な型機能
- ユーティリティ型入門
- 条件付き型とinfer

### Week 7-8: 実践開発
- 実践プロジェクト開始
- ライブラリ統合と型定義

### Week 9-10: 品質向上
- エラーハンドリングとデバッグ
- 高度な型機能の実践

### Week 11-12: ツール開発
- 開発ツールの作成
- ポートフォリオ完成

## 主な成果物
1. Todo アプリケーション - 型安全な状態管理
2. 型定義生成ツール - Compiler API活用
3. HTTPクライアントライブラリ - 完全型安全

## 習得したスキル
- TypeScriptの型システムの深い理解
- ジェネリクスと高度な型機能の実践活用
- 型安全なアプリケーション設計
- 開発ツールの自作能力
`;
```

#### 🎯 デプロイメント

```typescript
// portfolio/scripts/deploy.ts
export class PortfolioDeployer {
  async deploy(): Promise<void> {
    console.log('🚀 ポートフォリオのデプロイを開始...');

    try {
      // ビルド実行
      await this.runCommand('npm run build');
      
      // GitHub Pagesにデプロイ
      await this.runCommand('npx gh-pages -d dist');
      
      console.log('✅ デプロイが完了しました！');
      console.log('🌐 サイトURL: https://yourusername.github.io/portfolio');
    } catch (error) {
      console.error('❌ デプロイに失敗しました:', error);
      throw error;
    }
  }

  private async runCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const { exec } = require('child_process');
      exec(command, (error: any, stdout: string) => {
        if (error) {
          reject(error);
          return;
        }
        console.log(stdout);
        resolve();
      });
    });
  }
}

// メイン実行
async function main(): Promise<void> {
  const deployer = new PortfolioDeployer();
  await deployer.deploy();
}

if (require.main === module) {
  main().catch(console.error);
}
```

## 📊 Week 12 評価基準

### 完成度チェックリスト

#### ポートフォリオサイト (40%)
- [ ] レスポンシブデザインの実装
- [ ] プロジェクト詳細の表示機能
- [ ] スキル可視化の実装
- [ ] ユーザビリティの確保

#### プロジェクト統合 (30%)
- [ ] 12週間の成果物の整理
- [ ] 技術的課題と解決方法の文書化
- [ ] コードの品質確保
- [ ] 実用性の証明

#### ドキュメント (20%)
- [ ] 包括的なREADME作成
- [ ] 学習の軌跡の記録
- [ ] 技術ドキュメントの整備
- [ ] 継続学習計画の策定

#### デプロイ・公開 (10%)
- [ ] 正常なデプロイの完了
- [ ] アクセス可能なURL
- [ ] パフォーマンスの確保
- [ ] SEO対策の実装

## 🎯 継続学習計画

### 短期目標（3ヶ月）
- [ ] React + TypeScriptでのSPA開発
- [ ] Express + TypeScriptでのAPI開発
- [ ] データベース連携（Prisma + TypeScript）
- [ ] テスト駆動開発の実践

### 中期目標（6ヶ月）
- [ ] Next.js でのフルスタック開発
- [ ] GraphQL + TypeScript
- [ ] マイクロサービス設計
- [ ] CI/CD パイプラインの構築

### 長期目標（1年）
- [ ] 大規模プロジェクトでの実践経験
- [ ] TypeScriptエコシステムへの貢献
- [ ] 技術ブログでの知識共有
- [ ] コミュニティでの活動

## 🏆 学習完了の証明

### 成果物一覧
1. **Todo アプリケーション** - 型安全な状態管理の実装
2. **型定義生成ツール** - Compiler APIを使った開発ツール  
3. **HTTPクライアントライブラリ** - 完全に型安全なライブラリ
4. **ポートフォリオサイト** - 学習成果の統合展示

### 技術習得レベル
- **TypeScript基礎**: 完全習得 ✅
- **高度な型機能**: 実践レベル ✅  
- **実践開発**: プロジェクト完成 ✅
- **ツール開発**: 自作ツール完成 ✅

---

**🎉 おめでとうございます！12週間のTypeScript学習プログラムが完了しました！**

**📈 これからも継続的な学習と実践を通じて、さらなるスキルアップを目指しましょう！**