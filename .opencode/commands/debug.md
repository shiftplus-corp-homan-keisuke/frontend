---
description: 体系的な問題調査とデバッグ
---

体系的な問題調査のための DEBUG モード。

## Task
$ARGUMENTS

## Process

### Phase 1: 情報収集

1. **症状を理解**
   - エラーメッセージは?
   - ユーザーは何をしていた?
   - 期待値と実際の差は?

2. **最近の変更確認**
   - Run: !`git log --oneline -10`
   - Run: !`git diff HEAD~1`
   - 直近で何が変わったか把握

3. **コード確認**
   - `Grep` でエラーメッセージ検索
   - `Read` で関連ファイル確認
   - よくある問題の確認

### Phase 2: 仮説化

原因の可能性を高い順に列挙:

1. **Most likely cause** - [explanation]
2. **Second possibility** - [explanation]
3. **Less likely cause** - [explanation]

### Phase 3: 体系的調査

仮説ごとに検証:

1. **ログ確認**
   - Run: !`tail -f logs/*.log 2>/dev/null || echo "No logs found"`
   - Run: !`journalctl -u service-name -n 50 2>/dev/null || echo "No journal logs"`

2. **データフロー検証**
   - コードパスを追跡
   - 入出力を各段階で確認
   - `Read` で中間状態を確認

3. **ローカルで修正テスト**
   - `Edit` で暫定修正を適用
   - 修正ごとに独立検証
   - 消去法で切り分け

### Phase 4: 修正と予防

1. **正しい修正を適用**
   - `Edit` で修正
   - 修正が有効か確認
   - 副作用を確認

2. **根本原因の説明**
   - なぜ起きた?
   - 実際の原因は?

3. **再発防止策**
   - バリデーション追加
   - テスト追加
   - ドキュメント更新
   - コード改善提案

## Output Format

```markdown
## 🔍 Debug: [Issue]

### 1. Symptom
[What's happening]

### 2. Information Gathered
- Error: `[error message]`
- File: `[filepath]`
- Line: [line number]
- Recent changes: [summary]

### 3. Hypotheses
1. ❓ [Most likely cause]
2. ❓ [Second possibility]
3. ❓ [Less likely cause]

### 4. Investigation

**Testing hypothesis 1:**
[What I checked] → [Result]

**Testing hypothesis 2:**
[What I checked] → [Result]

### 5. Root Cause
🎯 **[Explanation of why this happened]**

### 6. Fix
[Code changes made]

### 7. Prevention
🛡️ [How to prevent this in the future]
```

## Key Principles

- **Ask before assuming** - 完全な状況を先に取得
- **Test hypotheses** - 推測で進めない
- **Explain why** - 何を直すかだけでなく理由も
- **Prevent recurrence** - テスト/バリデーション追加
- **Document** - 明確なコメントを残す

## Usage Examples

- `/debug login not working`
- `/debug API returns 500 error`
- `/debug form doesn't submit`
- `/debug data not saving to database`

体系的に調査し、再発しない解決策を提供する。
