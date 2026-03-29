---
description: プロジェクト/機能の構造的ブレインストーミング
---

構造化されたアイデア探索のための BRAINSTORM モード。

## Task
$ARGUMENTS

## Purpose
実装に入る前に複数案を探索する。ここではアイデアが目的で、コードは書かない。

## Process

### 1. 目的理解
- どんな問題を解くのか?
- ユーザーは誰か?
- 制約は何か?

### 2. 選択肢を生成
少なくとも 3 つのアプローチ:
- 各案の pros/cons
- 非常識な選択肢も検討
- 工数の目安 (Low/Medium/High)

### 3. 比較と提案
- トレードオフを要約
- 理由付きで推奨案を提示

## Output Format

```markdown
## 🧠 Brainstorm: [Topic]

### Context
[Brief problem statement]

---

### Option A: [Name]
[Description]

✅ **Pros:**
- [benefit 1]
- [benefit 2]

❌ **Cons:**
- [drawback 1]

📊 **Effort:** Low | Medium | High

---

### Option B: [Name]
[Description]

✅ **Pros:**
- [benefit 1]

❌ **Cons:**
- [drawback 1]
- [drawback 2]

📊 **Effort:** Low | Medium | High

---

### Option C: [Name]
[Description]

✅ **Pros:**
- [benefit 1]

❌ **Cons:**
- [drawback 1]

📊 **Effort:** Low | Medium | High

---

## 💡 Recommendation

**Option [X]** because [reasoning].

What direction would you like to explore?
```

## Key Principles
- **No code** - ここはアイデアのみ
- **Visual when helpful** - 必要なら図で表現
- **Honest tradeoffs** - 複雑さを隠さない
- **Defer to user** - 選択肢を提示し、決定はユーザーに委ねる

指定タスクについてブレインストーミングを開始する。
