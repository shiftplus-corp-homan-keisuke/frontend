---
description: 複雑タスクのために複数エージェントを調整
agent: general
subtask: true
---

**ORCHESTRATION MODE** で複雑タスクを専門エージェントで調整する。

## Task to Orchestrate
$ARGUMENTS

---

## 🔴 CRITICAL: Minimum Agent Requirement

> ⚠️ **ORCHESTRATION = MINIMUM 3 DIFFERENT AGENTS**
>
> 3 未満ならオーケストレーションではない。
>
> **完了前の検証:**
> - 呼び出したエージェント数
> - `agent_count < 3` → STOP and invoke more agents
> - 1 エージェントのみ = 失敗

### Agent Selection Matrix

| Task Type | REQUIRED Agents (minimum) |
|-----------|---------------------------|
| **Web App** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Design** | frontend-specialist, seo-specialist, performance-optimizer |
| **Database** | database-architect, backend-specialist, security-auditor |
| **Full Stack** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **Debug** | debugger, explorer-agent, test-engineer |
| **Security** | security-auditor, penetration-tester, devops-engineer |

---

## 🔴 STRICT 2-PHASE ORCHESTRATION

### PHASE 1: PLANNING (Sequential - NO parallel agents)

**Step 1:** タスク分析
- ドメイン特定
- 複雑度判断
- plan の有無確認

**Step 2:** 必要なら計画作成
- `task` ツールで `project-planner`
- 計画を作成
- 方針を文書化

**Step 3:** ユーザー承認
```
✅ Plan created

Approve to proceed with implementation? (Y/N)
- Y: Implementation starts
- N: Plan will be revised
```

> 🔴 **承認なしに Phase 2 へ進まない**

### PHASE 2: IMPLEMENTATION (Parallel agents after approval)

**`task` ツールで複数エージェントを並列呼び出し:**

Web App:
```
Use the frontend-specialist agent to [frontend task]
Use the backend-specialist agent to [backend task]
Use the test-engineer agent to [testing task]
```

API:
```
Use the backend-specialist agent to [api task]
Use the security-auditor agent to [security review]
Use the test-engineer agent to [test coverage]
```

> ✅ 承認後は並列で呼び出す

---

## Available Agent Types

`task` ツールでは以下を指定可能:

| Agent Type | Domain | Use For |
|------------|--------|---------|
| `general` | General-purpose | Multi-step tasks, research |
| `explore` | Codebase exploration | Finding files, understanding structure |

**Note:** OpenCode の簡易エージェントに合わせて適応:
1. `general` でほとんどのタスク
2. `explore` で探索
3. 複数 `task` を並列

---

## Orchestration Protocol

### Step 1: Analyze Task Domains

タスクが触れるドメインを特定:

```
□ Security     → Security focus
□ Backend/API  → API development
□ Frontend/UI  → UI implementation
□ Database     → Data layer
□ Testing      → Quality assurance
□ DevOps       → Deployment
□ Mobile       → Mobile support
□ Performance  → Optimization
□ SEO          → Search optimization
□ Planning     → Task breakdown
```

### Step 2: Phase Detection

| If Plan Exists | Action |
|----------------|--------|
| NO plan | → Go to PHASE 1 (create plan) |
| Plan exists + not approved | → Get approval |
| Plan exists + approved | → Go to PHASE 2 (implement) |

### Step 3: Execute Based on Phase

**PHASE 1 (Planning):**
```
Use the task tool with general agent to:
1. Analyze requirements
2. Create detailed plan
3. Identify file structure
4. List dependencies
→ STOP after plan is created
→ ASK user for approval
```

**PHASE 2 (Implementation - after approval):**

複数 `task` を並列で呼び出し:

```
Use the general agent to [aspect 1 of implementation]
Use the general agent to [aspect 2 of implementation]
Use the general agent to [aspect 3 of implementation]
```

**🔴 CRITICAL: Context Passing (MANDATORY)**

各 task 呼び出しに含める:
1. **Original User Request:** ユーザー依頼全文
2. **Decisions Made:** 質疑応答の回答
3. **Previous Work:** 既存の作業内容
4. **Current Plan State:** 現状の文脈

### Step 4: Verification

全エージェント完了後:

1. `Glob` で構造確認
2. `Read` で重要ファイル確認
3. 必要ならテスト
4. 結果統合

### Step 5: Synthesize Results

結果を統合してレポート作成。

---

## Output Format

```markdown
## 🎼 Orchestration Report

### Task
[Original task summary]

### Phase
[Planning OR Implementation]

### Agents/Tasks Invoked (MINIMUM 3)
| # | Task/Agent | Focus Area | Status |
|---|------------|------------|--------|
| 1 | [task 1] | [area] | ✅ |
| 2 | [task 2] | [area] | ✅ |
| 3 | [task 3] | [area] | ✅ |

### Key Findings
1. **[Task 1]**: Finding
2. **[Task 2]**: Finding
3. **[Task 3]**: Finding

### Deliverables
- [ ] Plan created
- [ ] Code implemented
- [ ] Tests passing
- [ ] Verified

### Summary
[One paragraph synthesis of all work]
```

---

## 🔴 EXIT GATE

完了前に確認:

1. ✅ **Agent Count:** `invoked_tasks >= 3`
2. ✅ **All Tasks Complete:** 未完がない
3. ✅ **Report Generated:** レポート完成

> **いずれか不一致なら完了扱いにしない。**

---

3 つ以上のタスクを選び、戦略的に実行して統合する。
