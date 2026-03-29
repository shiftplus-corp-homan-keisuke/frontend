---
description: テスト生成と実行
---

テストを生成・実行する TEST モード。

## Task
$ARGUMENTS

## Usage

- `/test` - すべてのテストを実行
- `/test [file/feature]` - 特定ターゲットのテスト生成
- `/test coverage` - カバレッジ表示
- `/test watch` - ウォッチモード

## Process

### Phase 1: Intent 判定

`$ARGUMENTS` が空 or "all" の場合:
- すべてのテストを実行

`$ARGUMENTS` がファイルパス/機能名の場合:
- そのターゲットのテストを生成

`$ARGUMENTS` が "coverage" の場合:
- カバレッジ表示

`$ARGUMENTS` が "watch" の場合:
- watch モードで実行

### Phase 2: 既存テスト実行

1. **テストフレームワーク検出**
   - Jest (package.json scripts に "jest")
   - Vitest (devDependencies に "vitest")
   - pytest (requirements.txt or pyproject.toml)
   - その他

2. **実行**
   - Run: !`npm test 2>&1 || python -m pytest 2>&1 || go test ./... 2>&1`
   - 出力を取得
   - 結果をパース

3. **結果表示**
   ```
   🧪 Running tests...

   ✅ auth.test.ts (5 passed)
   ✅ user.test.ts (8 passed)
   ❌ order.test.ts (2 passed, 1 failed)

   Failed:
     ✗ should calculate total with discount
       Expected: 90
       Received: 100

   Total: 15 tests (14 passed, 1 failed)
   ```

### Phase 3: テスト生成

1. **コード分析**
   - `Read` で対象ファイルを確認
   - 関数/メソッドを特定
   - エッジケースを抽出
   - モック対象を特定

2. **テストケース作成**
   - 正常系
   - エラーケース
   - エッジケース
   - 結合テスト（必要時）

3. **テスト作成**
   - `Glob` で既存テストを探す
   - プロジェクトのフレームワークに合わせる
   - 既存パターンに合わせる
   - `Write` で作成

4. **テスト構造** (Jest/Vitest 例):
   ```typescript
   describe('[Feature]', () => {
     describe('[Function]', () => {
       it('should [expected behavior]', async () => {
         // Arrange
         const input = [test data];

         // Act
         const result = await function(input);

         // Assert
         expect(result).toBe([expected]);
       });

       it('should handle [error case]', async () => {
         // Arrange
         const input = [invalid data];

         // Act & Assert
         await expect(function(input)).rejects.toThrow('[error]');
       });
     });
   });
   ```

### Phase 4: カバレッジ

1. **実行**
   - Run: !`npm test -- --coverage 2>&1 || python -m pytest --cov=. 2>&1`
   - % をパース

2. **表示**
   ```
   📊 Test Coverage

   Overall: 78%

   By File:
   ✅ src/utils/helpers.ts    95%
   ⚠️  src/services/auth.ts    72%
   ❌ src/components/Button.ts 45%

   Recommendation: Improve Button.ts coverage
   ```

## Output Format

テスト生成時:
```markdown
## 🧪 Tests: [Target]

### Test Plan
| Test Case | Type | Coverage |
|-----------|------|----------|
| Should create user | Unit | Happy path |
| Should reject invalid email | Unit | Validation |
| Should handle db error | Unit | Error case |

### Generated Tests

[Code block with tests]

---

Run with: `npm test`
```

## Key Principles

- **Test behavior not implementation**
- **One assertion per test** (実用上可能なら)
- **Descriptive test names**
- **Arrange-Act-Assert pattern**
- **Mock external dependencies**
- **Follow project conventions**

## Usage Examples

- `/test` → Run all tests
- `/test src/services/auth.service.ts` → Generate tests for auth service
- `/test user registration flow` → Generate integration tests
- `/test coverage` → Show coverage report
- `/test fix failed tests` → Fix failing tests

包括的なテストを生成し、品質を担保する。
