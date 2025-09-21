# Level 2: Application - SQL中級習熟度テスト

## テスト概要

このテストは、データベーススペシャリスト試験の中級レベル（Level 2: Application）の習熟度を測定するためのものです。基礎レベルで学習した内容を前提として、より高度なSQL技術の理解度を評価します。

## テスト仕様

- **問題数**: 25問
- **制限時間**: 120分
- **配点**: 各問4点（合計100点）
- **合格基準**: 70点以上（18問以上正解）
- **出題形式**: 選択式問題（4択）
- **出題範囲**: 外部結合、サブクエリ、CASE文、ウィンドウ関数、ビュー、制約、インデックス

## 使用するテーブル構造

以下のテーブル構造を前提として問題を作成しています：

```sql
-- 従業員テーブル
employees (employee_id, first_name, last_name, email, hire_date, job_title, salary, commission_pct, manager_id, department_id)

-- 部署テーブル
departments (department_id, department_name, manager_id, location)



-- 売上テーブル
sales (sale_id, employee_id, customer_id, sale_date, amount)
```

---

## 問題

### 問題1
次のSQL文の実行結果について正しい説明はどれか。

```sql
SELECT e.first_name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

A) 部署に所属していない従業員は結果に含まれない  
B) 従業員がいない部署も結果に含まれる  
C) 部署に所属していない従業員も結果に含まれる  
D) 内部結合と同じ結果になる

### 問題2
各部署で最も給与が高い従業員を取得するSQL文として正しいものはどれか。

A) 
```sql
SELECT * FROM employees e1
WHERE salary = MAX(salary)
GROUP BY department_id;
```

B)
```sql
SELECT * FROM employees e1
WHERE salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.department_id = e1.department_id);
```

C)
```sql
SELECT * FROM employees
WHERE salary IN (SELECT MAX(salary) FROM employees);
```

D)
```sql
SELECT * FROM employees
ORDER BY salary DESC
LIMIT 1;
```

### 問題3
次のCASE文の実行結果として正しいものはどれか。（salary = 750000の場合）

```sql
SELECT
    CASE
        WHEN salary >= 800000 THEN '高給'
        WHEN salary >= 500000 THEN '中給'
        ELSE '低給'
    END as salary_level;
```

A) 高給  
B) 中給  
C) 低給  
D) NULL

### 問題4
ウィンドウ関数ROW_NUMBER()とRANK()の違いについて正しい説明はどれか。

A) ROW_NUMBER()は同順位を考慮するが、RANK()は考慮しない  
B) RANK()は同順位を考慮するが、ROW_NUMBER()は考慮しない  
C) 両方とも同順位を考慮する  
D) 両方とも同順位を考慮しない

### 問題5
次のSQL文で作成されるビューについて正しい説明はどれか。

```sql
CREATE VIEW high_salary_view AS
SELECT * FROM employees WHERE salary >= 700000;
```

A) ビューは物理的にデータを保存する  
B) 元のテーブルのデータが更新されてもビューの結果は変わらない  
C) ビューを通じてデータの更新が可能である  
D) ビューは一度作成すると変更できない

### 問題6
COALESCE関数の動作について正しい説明はどれか。

A) 全ての引数がNULLの場合、0を返す  
B) 最初のNULL以外の値を返す  
C) 最後のNULL以外の値を返す  
D) 全ての引数の平均値を返す

### 問題7
次のSQL文の実行結果として正しいものはどれか。

```sql
SELECT COUNT(*), COUNT(commission_pct)
FROM employees;
```
（従業員数10人、うち3人がcommission_pctにNULL以外の値を持つ場合）

A) 10, 10  
B) 10, 3  
C) 3, 3  
D) 7, 3

### 問題8
EXISTS句を使用したサブクエリの特徴として正しいものはどれか。

A) サブクエリの結果の値を比較に使用する  
B) サブクエリが行を返すかどうかのみを判定する  
C) サブクエリは必ず1行だけ返す必要がある  
D) 外側のクエリとは独立して実行される

### 問題9
次のウィンドウ関数の実行結果について、PARTITION BYの効果として正しいものはどれか。

```sql
SELECT department_id, salary,
    RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank
FROM employees;
```

A) 全従業員を対象とした給与ランキングが表示される  
B) 部署ごとに独立した給与ランキングが表示される  
C) 部署IDの昇順でソートされる  
D) 給与の合計が部署ごとに表示される

### 問題10
PRIMARY KEY制約の特徴として正しくないものはどれか。

A) 一意性を保証する  
B) NULL値を許可しない  
C) 1つのテーブルに複数設定できる  
D) インデックスが自動的に作成される

### 問題11
次のSQL文で、インデックスが効果的に使用される可能性が最も高いものはどれか。
（last_nameにインデックスが作成されている場合）

A) `SELECT * FROM employees WHERE UPPER(last_name) = 'SMITH';`  
B) `SELECT * FROM employees WHERE last_name LIKE '%田中%';`  
C) `SELECT * FROM employees WHERE last_name = 'Smith';`  
D) `SELECT * FROM employees WHERE last_name != 'Smith';`

### 問題12
相関サブクエリの特徴として正しいものはどれか。

A) 外側のクエリとは独立して1回だけ実行される  
B) 外側のクエリの各行に対して実行される  
C) 必ず複数の値を返す  
D) GROUP BY句でのみ使用できる

### 問題13
次のSQL文の実行結果について正しい説明はどれか。

```sql
SELECT d.department_name, COUNT(e.employee_id)
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name;
```

A) 従業員がいない部署は結果に含まれない  
B) 従業員がいない部署は0としてカウントされる  
C) 従業員がいない部署は1としてカウントされる  
D) エラーが発生する

### 問題14
DENSE_RANK()関数の特徴として正しいものはどれか。

A) 同順位があっても次の順位は連続する  
B) 同順位があると次の順位はスキップされる  
C) 同順位は考慮されない  
D) 必ず1から始まる連番を返す

### 問題15
次のCHECK制約の記述として正しいものはどれか。

```sql
ALTER TABLE employees 
ADD CONSTRAINT chk_salary CHECK (salary > 0 AND salary <= 100000);
```

A) 給与が0以下または100000より大きい値の挿入・更新を許可する  
B) 給与が0より大きく100000以下の値のみ許可する  
C) 給与が0または100000の値のみ許可する  
D) 制約は作成されるがチェックは行われない

### 問題16
次のSQL文で使用されているウィンドウ関数の機能として正しいものはどれか。

```sql
SELECT employee_id, salary,
    SUM(salary) OVER (ORDER BY employee_id) as cumulative_salary
FROM employees;
```

A) 各従業員の給与を部署別に合計する  
B) 従業員IDの順序で給与の累積合計を計算する  
C) 全従業員の給与合計を各行に表示する  
D) 給与の移動平均を計算する

### 問題17
ビューの更新可能性について正しい説明はどれか。

A) 全てのビューでデータの更新が可能である  
B) 集約関数を含むビューでも更新が可能である  
C) 単一テーブルから作成された単純なビューは更新可能である  
D) ビューを通じた更新は一切できない

### 問題18
次のSQL文の実行結果について、NULLの扱いとして正しいものはどれか。

```sql
SELECT AVG(commission_pct) FROM employees;
```

A) NULL値も0として計算に含める  
B) NULL値は計算から除外される  
C) NULL値があるとエラーになる  
D) 結果は必ずNULLになる

### 問題19
FOREIGN KEY制約の効果として正しくないものはどれか。

A) 参照整合性を保証する  
B) 存在しない値の挿入を防ぐ  
C) 参照されているレコードの削除を防ぐ  
D) 自動的にインデックスを作成する

### 問題20
次のサブクエリの種類として正しいものはどれか。

```sql
SELECT * FROM employees
WHERE department_id IN (SELECT department_id FROM departments WHERE location = '東京');
```

A) 相関サブクエリ  
B) 非相関サブクエリ  
C) スカラーサブクエリ  
D) 存在チェックサブクエリ

### 問題21
次のウィンドウ関数で、ROWS BETWEENの効果として正しいものはどれか。

```sql
SELECT salary,
    AVG(salary) OVER (ORDER BY employee_id ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) as moving_avg
FROM employees;
```

A) 全従業員の給与平均を計算する  
B) 前後1行を含む3行の給与平均を計算する  
C) 現在行から1行後までの給与平均を計算する  
D) 1行前の給与平均を計算する

### 問題22
インデックスの効果として正しくないものはどれか。

A) SELECT文の実行速度を向上させる  
B) INSERT文の実行速度を向上させる  
C) WHERE句での検索を高速化する  
D) ORDER BY句での並び替えを高速化する

### 問題23
次のSQL文の実行結果について正しい説明はどれか。

```sql
SELECT first_name, 
    CASE WHEN commission_pct IS NULL THEN 'なし' ELSE 'あり' END as commission_status
FROM employees;
```

A) commission_pctが0の場合は'なし'と表示される  
B) commission_pctがNULLの場合は'なし'と表示される  
C) commission_pctが空文字の場合は'なし'と表示される  
D) 全ての行で'あり'と表示される

### 問題24
複合インデックスの効果的な使用について正しいものはどれか。
（department_id, salaryの順序で複合インデックスが作成されている場合）

A) `WHERE salary > 500000`のクエリで効果的に使用される
B) `WHERE department_id = 10`のクエリで効果的に使用される
C) `WHERE salary > 500000 AND department_id = 10`のクエリでは使用されない
D) ORDER BY句では使用できない

### 問題25
次のSQL文で作成されるビューの特徴として正しいものはどれか。

```sql
CREATE VIEW dept_summary AS
SELECT department_id, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM employees
GROUP BY department_id;
```

A) 元のテーブルのデータが変更されてもビューの結果は変わらない  
B) このビューを通じてemployeesテーブルのデータを更新できる  
C) 集約関数を含むため読み取り専用ビューとなる  
D) GROUP BY句があるためビューの作成はできない

---

## 解答

### 解答一覧

| 問題 | 解答 | 問題 | 解答 | 問題 | 解答 | 問題 | 解答 | 問題 | 解答 |
|------|------|------|------|------|------|------|------|------|------|
| 1    | C    | 6    | B    | 11   | C    | 16   | B    | 21   | B    |
| 2    | B    | 7    | B    | 12   | B    | 17   | C    | 22   | B    |
| 3    | B    | 8    | B    | 13   | B    | 18   | B    | 23   | B    |
| 4    | B    | 9    | B    | 14   | A    | 19   | D    | 24   | B    |
| 5    | C    | 10   | C    | 15   | B    | 20   | B    | 25   | C    |

### 詳細解説

#### 問題1 - 解答: C
LEFT JOINは左側のテーブル（employees）の全ての行を保持するため、部署に所属していない従業員（department_idがNULL）も結果に含まれます。この場合、department_nameはNULLとして表示されます。

#### 問題2 - 解答: B
相関サブクエリを使用して、各従業員の給与と同じ部署の最高給与を比較しています。外側のクエリの各行に対してサブクエリが実行され、部署ごとの最高給与の従業員が抽出されます。

#### 問題3 - 解答: B
CASE文は上から順に条件を評価します。salary = 750000の場合、最初の条件（>= 800000）は偽、2番目の条件（>= 500000）は真となるため、'中給'が返されます。

#### 問題4 - 解答: B
RANK()は同順位を考慮し、同じ値には同じ順位を付けます。ROW_NUMBER()は同じ値でも一意の連番を付けます。

#### 問題5 - 解答: C
ビューは仮想的なテーブルであり、単純なビューであればINSERT、UPDATE、DELETEが可能です。ただし、集約関数や複雑な結合を含むビューは更新できません。

#### 問題6 - 解答: B
COALESCE関数は引数を左から順に評価し、最初のNULL以外の値を返します。全ての引数がNULLの場合はNULLを返します。

#### 問題7 - 解答: B
COUNT(*)は全ての行をカウント（10）、COUNT(commission_pct)はNULL以外の値のみをカウント（3）します。

#### 問題8 - 解答: B
EXISTS句はサブクエリが1行以上返すかどうかのみを判定し、実際の値は使用しません。行の存在チェックに特化した構文です。

#### 問題9 - 解答: B
PARTITION BYは指定した列でデータをグループ化し、各グループ内で独立してウィンドウ関数を実行します。この例では部署ごとに給与ランキングが計算されます。

#### 問題10 - 解答: C
PRIMARY KEY制約は1つのテーブルに1つだけ設定できます。複数の列を組み合わせた複合主キーは可能ですが、複数のPRIMARY KEY制約は設定できません。

#### 問題11 - 解答: C
等価条件（=）でのインデックス使用が最も効果的です。関数適用（UPPER）、部分一致（LIKE '%...'）、不等価条件（!=）はインデックスの効果が限定的です。

#### 問題12 - 解答: B
相関サブクエリは外側のクエリの各行に対して実行されるため、外側のクエリの行数分だけ実行されます。

#### 問題13 - 解答: B
LEFT JOINとCOUNT(e.employee_id)の組み合わせにより、従業員がいない部署は0としてカウントされます。COUNT(*)を使用すると1になってしまいます。

#### 問題14 - 解答: A
DENSE_RANK()は密なランキングを提供し、同順位があっても次の順位は連続します（1,2,2,3...）。RANK()では順位がスキップされます（1,2,2,4...）。

#### 問題15 - 解答: B
CHECK制約は指定した条件を満たすデータのみの挿入・更新を許可します。この例では給与が0より大きく100000以下の値のみが許可されます。

#### 問題16 - 解答: B
SUM() OVER (ORDER BY ...)は累積合計を計算します。ORDER BYで指定した順序で、現在行までの合計値が各行に表示されます。

#### 問題17 - 解答: C
単一テーブルから作成された単純なビュー（集約関数、DISTINCT、結合などを含まない）は更新可能です。複雑なビューは読み取り専用となります。

#### 問題18 - 解答: B
集約関数（AVG、SUM等）はNULL値を計算から除外します。COUNT(*)のみがNULL値も含めてカウントします。

#### 問題19 - 解答: D
FOREIGN KEY制約は参照整合性を保証しますが、自動的にインデックスを作成するかどうかはDBMSによって異なります。多くの場合、パフォーマンス向上のため手動でインデックスを作成する必要があります。

#### 問題20 - 解答: B
このサブクエリは外側のクエリの値を参照していないため、非相関サブクエリです。1回だけ実行され、その結果がIN句で使用されます。

#### 問題21 - 解答: B
ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWINGは、現在行の前1行、現在行、後1行の合計3行を対象とした移動平均を計算します。

#### 問題22 - 解答: B
インデックスはSELECT文の性能を向上させますが、INSERT、UPDATE、DELETE文では逆に性能が低下する場合があります。これはインデックスの維持にコストがかかるためです。

#### 問題23 - 解答: B
IS NULLでNULL値をチェックし、NULLの場合は'なし'、そうでなければ'あり'と表示されます。0や空文字はNULLではありません。

#### 問題24 - 解答: B
複合インデックス（department_id, salary）は、先頭列（department_id）での検索に効果的です。後続列（salary）のみでの検索では効果が限定的です。

#### 問題25 - 解答: C
集約関数（COUNT、AVG）を含むビューは複雑なビューとなり、通常は読み取り専用となります。元のテーブルが変更されればビューの結果も変わります。

---

## 採点基準

### 得点別評価

- **90-100点（23-25問正解）**: 優秀 - 中級レベルを完全に習得
- **80-89点（20-22問正解）**: 良好 - 中級レベルをほぼ習得、一部復習が必要
- **70-79点（18-19問正解）**: 合格 - 中級レベルの基本を習得、継続学習推奨
- **60-69点（15-17問正解）**: 不合格 - 基本的な理解不足、重点的な復習が必要
- **60点未満（14問以下正解）**: 不合格 - 基礎レベルからの復習が必要

### 分野別分析

問題を以下の分野に分類して弱点を特定してください：

- **外部結合**: 問題1, 13
- **サブクエリ**: 問題2, 8, 12, 20
- **CASE文・COALESCE**: 問題3, 6, 23
- **ウィンドウ関数**: 問題4, 9, 14, 16, 21
- **ビュー**: 問題5, 17, 25
- **集約関数・NULL処理**: 問題7, 18
- **制約**: 問題10, 15, 19
- **インデックス**: 問題11, 22, 24

### 学習アドバイス

#### 合格者（70点以上）
- Level 3: Advanced（上級レベル）への進級を推奨
- 間違えた分野の理論と練習問題を復習
- 実際のデータベースでの実践経験を積む

#### 不合格者（70点未満）
- 間違えた分野を重点的に復習
- [`theory.md`](./theory.md)の該当セクションを再読
- [`practice.md`](./practice.md)の関連問題を再実行
- 基礎レベルの内容も併せて復習

### 再テストについて

- 不合格の場合は1週間以上の復習期間を設けてから再テスト
- 同じ問題での再テストは学習効果が低いため、類似問題での確認を推奨
- 実際のデータベース環境での実習を重視

---

**テスト完了後の次のステップ:**
1. 採点と分野別分析の実施
2. 弱点分野の集中復習
3. 実践的なSQL作成経験の蓄積
4. Level 3: Advanced（上級レベル）への挑戦準備

**頑張ってください！** 🎯📚💪