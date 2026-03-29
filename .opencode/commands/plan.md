---
description: タスク分解を含むプロジェクト計画を作成
agent: general
subtask: true
---

PLANNING MODE でプロジェクト計画を作成する。

## 🔴 CRITICAL RULES

1. **NO CODE WRITING** - このコマンドは plan + task list のみ
2. **Socratic Gate** - 計画前に質問で確認
3. **Dynamic Naming** - plan slug はタスク名から生成

## Task
$ARGUMENTS

## Process

### Phase 1: Context Check (情報不足時)

依頼が不明確なら以下を確認:

1. どのタイプのアプリ/プロジェクト?
2. コア機能は?
3. 誰が使う?
4. 制約や好みは?

`question` ツールで情報を集める。

### Phase 2: Create Plan

要件理解後:

1. 依頼から **キーワード** を抽出 (2-3語)
2. **slug 生成**: lowercase + hyphen, max 30
3. **plan folder**: `./specs/{slug}/`
4. **plan file**: `./specs/{slug}/{slug}-plan.md`
5. **task list**: `./specs/{slug}/{slug}-task.md`

### Phase 3: Plan Content Structure

plan ファイルに含める:

```markdown
# Project Plan: [Project Name]

## Overview
[Brief description]

## Tech Stack
- Framework: [detected or chosen]
- Language: [chosen]
- Database: [if applicable]
- Deployment: [if applicable]

## Features
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

## Task Breakdown

### Phase 1: Setup
- [ ] Initialize project structure
- [ ] Configure dependencies
- [ ] Set up development environment

### Phase 2: Core Features
- [ ] Implement [feature 1]
- [ ] Implement [feature 2]

### Phase 3: Polish
- [ ] Testing
- [ ] Documentation
- [ ] Deployment

## File Structure
```
[expected file structure]
```

## Verification Checklist
- [ ] All features implemented
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Ready for deployment
```

## Task List File

task list ファイルに含める:

```markdown
# Task List: [Project Name]

## Task Table
| task_id | name | agent | skills | priority | dependencies | status |

## Details
### [task_id] [name]
- INPUT:
- OUTPUT:
- VERIFY:
```

## Output

作成後は以下を報告:

```
[OK] Plan created: ./specs/{slug}/{slug}-plan.md
[OK] Task list created: ./specs/{slug}/{slug}-task.md

Next steps:
- Review the plan
- Run /create to start implementation
- Or modify plan manually
```

コードを書かずに計画を作成する。
