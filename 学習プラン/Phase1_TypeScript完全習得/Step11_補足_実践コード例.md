# Step11 実践コード例

> 💡 **このファイルについて**: ツール開発入門の段階的な学習のためのコード例集です。

## 📋 目次
1. [CLIツール開発](#cliツール開発)
2. [ビルドツール作成](#ビルドツール作成)
3. [コード生成ツール](#コード生成ツール)

---

## CLIツール開発

### ステップ1: 基本的なCLIツール
```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('my-cli-tool')
  .description('TypeScript開発支援ツール')
  .version('1.0.0');

program
  .command('init')
  .description('新しいプロジェクトを初期化')
  .option('-t, --template <type>', 'テンプレートタイプ', 'basic')
  .action(async (options) => {
    console.log(chalk.blue('プロジェクト初期化中...'));
    console.log(`テンプレート: ${options.template}`);
    
    // プロジェクト初期化ロジック
    await initProject(options.template);
    
    console.log(chalk.green('✅ プロジェクトが正常に初期化されました！'));
  });

async function initProject(template: string): Promise<void> {
  // 実装例
  console.log(`${template}テンプレートでプロジェクトを作成中...`);
}

program.parse();
```

### ステップ2: インタラクティブなCLI
```typescript
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

interface ProjectConfig {
  name: string;
  template: string;
  features: string[];
  packageManager: string;
}

async function createInteractiveCLI(): Promise<void> {
  console.log(chalk.cyan('🚀 TypeScript プロジェクト作成ウィザード'));
  
  const answers = await inquirer.prompt<ProjectConfig>([
    {
      type: 'input',
      name: 'name',
      message: 'プロジェクト名を入力してください:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'プロジェクト名は必須です';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'template',
      message: 'テンプレートを選択してください:',
      choices: [
        { name: '基本テンプレート', value: 'basic' },
        { name: 'Express API', value: 'express' },
        { name: 'React アプリ', value: 'react' },
        { name: 'CLI ツール', value: 'cli' }
      ]
    },
    {
      type: 'checkbox',
      name: 'features',
      message: '追加機能を選択してください:',
      choices: [
        { name: 'ESLint', value: 'eslint' },
        { name: 'Prettier', value: 'prettier' },
        { name: 'Jest', value: 'jest' },
        { name: 'Husky', value: 'husky' }
      ]
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'パッケージマネージャーを選択してください:',
      choices: ['npm', 'yarn', 'pnpm']
    }
  ]);

  await generateProject(answers);
}

async function generateProject(config: ProjectConfig): Promise<void> {
  const projectPath = path.join(process.cwd(), config.name);
  
  // プロジェクトディレクトリ作成
  await fs.ensureDir(projectPath);
  
  // package.json生成
  const packageJson = {
    name: config.name,
    version: '1.0.0',
    description: '',
    main: 'dist/index.js',
    scripts: {
      build: 'tsc',
      start: 'node dist/index.js',
      dev: 'ts-node src/index.ts'
    },
    devDependencies: {
      typescript: '^5.0.0',
      '@types/node': '^20.0.0',
      'ts-node': '^10.9.0'
    }
  };

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  
  // tsconfig.json生成
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist']
  };

  await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });
  
  // ソースファイル生成
  await generateSourceFiles(projectPath, config);
  
  console.log(chalk.green(`✅ プロジェクト "${config.name}" が作成されました！`));
  console.log(chalk.yellow(`📁 ${projectPath}`));
}

async function generateSourceFiles(projectPath: string, config: ProjectConfig): Promise<void> {
  const srcPath = path.join(projectPath, 'src');
  await fs.ensureDir(srcPath);
  
  let indexContent = '';
  
  switch (config.template) {
    case 'basic':
      indexContent = `console.log('Hello, TypeScript!');`;
      break;
    case 'express':
      indexContent = `import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello, TypeScript Express!' });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`;
      break;
    case 'cli':
      indexContent = `#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('${config.name}')
  .description('CLI tool built with TypeScript')
  .version('1.0.0');

program
  .command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello from ${config.name}!');
  });

program.parse();`;
      break;
  }
  
  await fs.writeFile(path.join(srcPath, 'index.ts'), indexContent);
}
```

---

## ビルドツール作成

### ステップ3: 簡単なビルドツール
```typescript
import * as ts from 'typescript';
import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';

interface BuildOptions {
  srcDir: string;
  outDir: string;
  watch: boolean;
  minify: boolean;
}

class TypeScriptBuilder {
  private options: BuildOptions;
  private program: ts.Program | null = null;

  constructor(options: BuildOptions) {
    this.options = options;
  }

  async build(): Promise<void> {
    console.log(chalk.blue('🔨 ビルド開始...'));
    
    const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) {
      throw new Error('tsconfig.json が見つかりません');
    }

    const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
    const { options, fileNames, errors } = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      path.dirname(configPath)
    );

    if (errors.length > 0) {
      this.reportDiagnostics(errors);
      return;
    }

    // 出力ディレクトリをクリア
    await fs.emptyDir(this.options.outDir);

    this.program = ts.createProgram(fileNames, options);
    const emitResult = this.program.emit();

    const allDiagnostics = ts.getPreEmitDiagnostics(this.program).concat(emitResult.diagnostics);

    if (allDiagnostics.length > 0) {
      this.reportDiagnostics(allDiagnostics);
    }

    if (emitResult.emitSkipped) {
      console.log(chalk.red('❌ ビルドに失敗しました'));
      return;
    }

    console.log(chalk.green('✅ ビルドが完了しました'));

    if (this.options.watch) {
      this.startWatchMode();
    }
  }

  private startWatchMode(): void {
    console.log(chalk.yellow('👀 ウォッチモードを開始...'));
    
    const watcher = chokidar.watch(this.options.srcDir, {
      ignored: /node_modules/,
      persistent: true
    });

    watcher.on('change', async (filePath) => {
      console.log(chalk.cyan(`📝 ${filePath} が変更されました`));
      await this.build();
    });
  }

  private reportDiagnostics(diagnostics: readonly ts.Diagnostic[]): void {
    diagnostics.forEach(diagnostic => {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(
          diagnostic.file,
          diagnostic.start!
        );
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(
          chalk.red(
            `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
          )
        );
      } else {
        console.log(chalk.red(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')));
      }
    });
  }
}

// 使用例
const builder = new TypeScriptBuilder({
  srcDir: './src',
  outDir: './dist',
  watch: false,
  minify: false
});

builder.build().catch(console.error);
```

---

## コード生成ツール

### ステップ4: TypeScript コード生成ツール
```typescript
import * as ts from 'typescript';
import fs from 'fs-extra';
import path from 'path';

interface ModelField {
  name: string;
  type: string;
  optional?: boolean;
  description?: string;
}

interface ModelDefinition {
  name: string;
  fields: ModelField[];
  description?: string;
}

class CodeGenerator {
  async generateModel(definition: ModelDefinition, outputPath: string): Promise<void> {
    const sourceFile = ts.createSourceFile(
      'model.ts',
      '',
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TS
    );

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    // インターフェース生成
    const interfaceDeclaration = this.createInterface(definition);
    
    // クラス生成
    const classDeclaration = this.createClass(definition);

    // ファクトリ関数生成
    const factoryFunction = this.createFactory(definition);

    const statements = [interfaceDeclaration, classDeclaration, factoryFunction];
    
    const resultFile = ts.updateSourceFileNode(sourceFile, statements);
    const result = printer.printFile(resultFile);

    await fs.writeFile(outputPath, result);
    console.log(chalk.green(`✅ ${definition.name} モデルを生成しました: ${outputPath}`));
  }

  private createInterface(definition: ModelDefinition): ts.InterfaceDeclaration {
    const properties = definition.fields.map(field => {
      const property = ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier(field.name),
        field.optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        ts.factory.createTypeReferenceNode(field.type)
      );

      if (field.description) {
        ts.addSyntheticLeadingComment(
          property,
          ts.SyntaxKind.MultiLineCommentTrivia,
          `* ${field.description} `,
          true
        );
      }

      return property;
    });

    return ts.factory.createInterfaceDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(definition.name),
      undefined,
      undefined,
      properties
    );
  }

  private createClass(definition: ModelDefinition): ts.ClassDeclaration {
    const constructor = this.createConstructor(definition);
    const methods = this.createMethods(definition);

    return ts.factory.createClassDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(`${definition.name}Class`),
      undefined,
      undefined,
      [constructor, ...methods]
    );
  }

  private createConstructor(definition: ModelDefinition): ts.ConstructorDeclaration {
    const parameters = definition.fields.map(field =>
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        ts.factory.createIdentifier(field.name),
        field.optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        ts.factory.createTypeReferenceNode(field.type)
      )
    );

    const assignments = definition.fields.map(field =>
      ts.factory.createExpressionStatement(
        ts.factory.createBinaryExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createThis(),
            ts.factory.createIdentifier(field.name)
          ),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createIdentifier(field.name)
        )
      )
    );

    return ts.factory.createConstructorDeclaration(
      undefined,
      undefined,
      parameters,
      ts.factory.createBlock(assignments, true)
    );
  }

  private createMethods(definition: ModelDefinition): ts.MethodDeclaration[] {
    // toJSON メソッド
    const toJsonMethod = ts.factory.createMethodDeclaration(
      undefined,
      undefined,
      undefined,
      ts.factory.createIdentifier('toJSON'),
      undefined,
      undefined,
      [],
      ts.factory.createTypeReferenceNode(definition.name),
      ts.factory.createBlock([
        ts.factory.createReturnStatement(
          ts.factory.createObjectLiteralExpression(
            definition.fields.map(field =>
              ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier(field.name),
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createThis(),
                  ts.factory.createIdentifier(field.name)
                )
              )
            ),
            true
          )
        )
      ], true)
    );

    return [toJsonMethod];
  }

  private createFactory(definition: ModelDefinition): ts.FunctionDeclaration {
    const parameters = definition.fields.map(field =>
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        ts.factory.createIdentifier(field.name),
        field.optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        ts.factory.createTypeReferenceNode(field.type)
      )
    );

    return ts.factory.createFunctionDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      undefined,
      ts.factory.createIdentifier(`create${definition.name}`),
      undefined,
      parameters,
      ts.factory.createTypeReferenceNode(`${definition.name}Class`),
      ts.factory.createBlock([
        ts.factory.createReturnStatement(
          ts.factory.createNewExpression(
            ts.factory.createIdentifier(`${definition.name}Class`),
            undefined,
            definition.fields.map(field => ts.factory.createIdentifier(field.name))
          )
        )
      ], true)
    );
  }
}

// 使用例
const generator = new CodeGenerator();

const userModel: ModelDefinition = {
  name: 'User',
  description: 'ユーザー情報を表すモデル',
  fields: [
    { name: 'id', type: 'string', description: 'ユーザーID' },
    { name: 'name', type: 'string', description: 'ユーザー名' },
    { name: 'email', type: 'string', description: 'メールアドレス' },
    { name: 'age', type: 'number', optional: true, description: '年齢' }
  ]
};

generator.generateModel(userModel, './generated/User.ts');
```

---

**📌 重要**: ツール開発では、ユーザビリティと保守性を重視し、適切なエラーハンドリングとドキュメントを提供することが重要です。