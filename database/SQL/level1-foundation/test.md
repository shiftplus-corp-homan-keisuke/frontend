# Level 1: Foundation - SQL基礎習熟度テスト

## テスト概要

このテストは、SQL基礎レベル（Level 1: Foundation）の習熟度を測定するためのものです。データベーススペシャリスト試験の出題傾向に合わせて作成されており、合格基準は70点以上です。

**テスト時間:** 90分  
**問題数:** 20問  
**合格基準:** 70点以上（14問以上正解）  
**配点:** 各問5点（合計100点）

## 使用するテーブル構造

### employees（従業員テーブル）
```sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    hire_date DATE,
    job_title VARCHAR(50),
    salary DECIMAL(8,2),
    commission_pct DECIMAL(2,2),
    manager_id INT,
    department_id INT
);
```

### departments（部署テーブル）
```sql
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(50),
    manager_id INT,
    location VARCHAR(50)
);
```

---

## 問題

### 問題1（基本SELECT文）
従業員テーブル（employees）から、従業員ID、名前（first_name）、姓（last_name）、給与（salary）を取得し、給与の降順で並び替えるSQL文を記述してください。

**選択肢:**
A) `SELECT employee_id, first_name, last_name, salary FROM employees ORDER BY salary;`
B) `SELECT employee_id, first_name, last_name, salary FROM employees ORDER BY salary DESC;`
C) `SELECT employee_id, first_name, last_name, salary FROM employees SORT BY salary DESC;`
D) `SELECT employee_id, first_name, last_name, salary FROM employees ORDER salary DESC;`

### 問題2（WHERE句）
従業員テーブルから、部署ID（department_id）が10で、かつ給与が500000以上の従業員の情報を取得するSQL文として正しいものはどれですか。

**選択肢:**
A) `SELECT * FROM employees WHERE department_id = 10 OR salary >= 500000;`
B) `SELECT * FROM employees WHERE department_id = 10 AND salary >= 500000;`
C) `SELECT * FROM employees WHERE department_id == 10 AND salary >= 500000;`
D) `SELECT * FROM employees WHERE department_id = 10 & salary >= 500000;`

### 問題3（集約関数）
従業員テーブルの全従業員の平均給与を求めるSQL文として正しいものはどれですか。

**選択肢:**
A) `SELECT AVERAGE(salary) FROM employees;`
B) `SELECT AVG(salary) FROM employees;`
C) `SELECT MEAN(salary) FROM employees;`
D) `SELECT SUM(salary)/COUNT(salary) FROM employees;`

### 問題4（COUNT関数）
従業員テーブルでcommission_pctがNULLでない従業員数を求めるSQL文として正しいものはどれですか。

**選択肢:**
A) `SELECT COUNT(*) FROM employees WHERE commission_pct IS NOT NULL;`
B) `SELECT COUNT(commission_pct) FROM employees;`
C) `SELECT COUNT(*) FROM employees WHERE commission_pct != NULL;`
D) AとBの両方が正しい

### 問題5（GROUP BY句）
従業員テーブルを部署ID でグループ化し、各部署の従業員数を求めるSQL文として正しいものはどれですか。

**選択肢:**
A) `SELECT department_id, COUNT(*) FROM employees;`
B) `SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;`
C) `SELECT department_id, COUNT(*) FROM employees ORDER BY department_id;`
D) `SELECT COUNT(*) FROM employees GROUP BY department_id;`

### 問題6（HAVING句）
従業員テーブルを部署ID でグループ化し、従業員数が3人以上の部署のみを表示するSQL文として正しいものはどれですか。

**選択肢:**
A) `SELECT department_id, COUNT(*) FROM employees GROUP BY department_id WHERE COUNT(*) >= 3;`
B) `SELECT department_id, COUNT(*) FROM employees WHERE COUNT(*) >= 3 GROUP BY department_id;`
C) `SELECT department_id, COUNT(*) FROM employees GROUP BY department_id HAVING COUNT(*) >= 3;`
D) `SELECT department_id, COUNT(*) FROM employees HAVING COUNT(*) >= 3 GROUP BY department_id;`

### 問題7（INNER JOIN）
従業員テーブル（employees）と部署テーブル（departments）を結合し、従業員の名前と部署名を取得するSQL文として正しいものはどれですか。

**選択肢:**
A) `SELECT e.first_name, d.department_name FROM employees e, departments d WHERE e.department_id = d.department_id;`
B) `SELECT e.first_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;`
C) `SELECT e.first_name, d.department_name FROM employees e JOIN departments d USING (department_id);`
D) 上記すべて正しい

### 問題8（INSERT文）
従業員テーブルに新しい従業員を追加するSQL文として正しいものはどれですか。

**選択肢:**
A) `INSERT employees VALUES (300, 'John', 'Doe', 'jdoe@company.com', '2022-01-01', 'IT_PROG', 500000, 10);`
B) `INSERT INTO employees (employee_id, first_name, last_name, email, hire_date, job_title, salary, department_id) VALUES (300, 'John', 'Doe', 'jdoe@company.com', '2022-01-01', 'エンジニア', 500000, 10);`
C) `INSERT employees SET employee_id=300, first_name='John', last_name='Doe';`
D) `ADD TO employees VALUES (300, 'John', 'Doe', 'jdoe@company.com');`

### 問題9（UPDATE文）
従業員ID が300の従業員の給与を600000に更新するSQL文として正しいものはどれですか。

**選択肢:**
A) `UPDATE employees SET salary = 600000 WHERE employee_id = 300;`
B) `MODIFY employees SET salary = 600000 WHERE employee_id = 300;`
C) `CHANGE employees SET salary = 600000 WHERE employee_id = 300;`
D) `ALTER employees SET salary = 600000 WHERE employee_id = 300;`

### 問題10（DELETE文）
従業員テーブルから従業員ID が300の従業員を削除するSQL文として正しいものはどれですか。

**選択肢:**
A) `REMOVE FROM employees WHERE employee_id = 100;`
B) `DELETE employees WHERE employee_id = 100;`
C) `DELETE FROM employees WHERE employee_id = 100;`
D) `DROP FROM employees WHERE employee_id = 100;`

### 問題11（SQL実行順序）
以下のSQL文の実行順序として正しいものはどれですか。
```sql
SELECT department_id, AVG(salary)
FROM employees
WHERE salary >= 450000
GROUP BY department_id
HAVING AVG(salary) >= 500000
ORDER BY AVG(salary) DESC;
```

**選択肢:**
A) SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY
B) FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
C) FROM → SELECT → WHERE → GROUP BY → HAVING → ORDER BY
D) WHERE → FROM → GROUP BY → SELECT → HAVING → ORDER BY

### 問題12（NULL値の扱い）
以下のSQL文の実行結果について正しい説明はどれですか。
```sql
SELECT COUNT(*), COUNT(commission_pct) FROM employees;
```

**選択肢:**
A) 両方とも同じ値が返される
B) COUNT(*)の方が大きい値が返される可能性がある
C) COUNT(commission_pct)の方が大きい値が返される可能性がある
D) エラーが発生する

### 問題13（複合問題）
各部署の平均給与を求め、平均給与が高い順に並べて表示するSQL文を記述してください。部署名も含めて表示する必要があります。

**選択肢:**
A) 
```sql
SELECT d.department_name, AVG(e.salary)
FROM employees e, departments d
WHERE e.department_id = d.department_id
GROUP BY d.department_name
ORDER BY AVG(e.salary) DESC;
```

B)
```sql
SELECT d.department_name, AVG(e.salary)
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name
ORDER BY AVG(e.salary) DESC;
```

C) AとBの両方が正しい

D) どちらも間違っている

### 問題14（LIKE演算子）
従業員テーブルから、名前（first_name）が「A」で始まり、かつ「n」で終わる従業員を取得するSQL文として正しいものはどれですか。

**選択肢:**
A) `SELECT * FROM employees WHERE first_name LIKE '太%';`
B) `SELECT * FROM employees WHERE first_name LIKE 'A*n';`
C) `SELECT * FROM employees WHERE first_name MATCH 'A%n';`
D) `SELECT * FROM employees WHERE first_name CONTAINS 'A%n';`

### 問題15（BETWEEN演算子）
従業員テーブルから、給与が450000以上700000以下の従業員を取得するSQL文として正しいものはどれですか。

**選択肢:**
A) `SELECT * FROM employees WHERE salary BETWEEN 450000 AND 700000;`
B) `SELECT * FROM employees WHERE salary >= 450000 AND salary <= 700000;`
C) `SELECT * FROM employees WHERE salary FROM 450000 TO 700000;`
D) AとBの両方が正しい

### 問題16（複数テーブル結合）
従業員、部署、所在地の3つのテーブルを結合し、従業員名、部署名、都市名を取得するSQL文として正しいものはどれですか。

**選択肢:**
A)
```sql
SELECT e.first_name, d.department_name, l.city
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;
```

B)
```sql
SELECT e.first_name, d.department_name, d.location
FROM employees e, departments d
WHERE e.department_id = d.department_id;
```

C) AとBの両方が正しい

D) どちらも間違っている

### 問題17（サブクエリ）
全従業員の平均給与以上の給与を受け取っている従業員の名前と給与を取得するSQL文として正しいものはどれですか。

**選択肢:**
A) `SELECT first_name, salary FROM employees WHERE salary >= AVG(salary);`
B) `SELECT first_name, salary FROM employees WHERE salary >= (SELECT AVG(salary) FROM employees);`
C) `SELECT first_name, salary FROM employees HAVING salary >= AVG(salary);`
D) `SELECT first_name, salary FROM employees WHERE salary >= SELECT AVG(salary) FROM employees;`

### 問題18（データ型と制約）
以下のCREATE TABLE文について、正しい説明はどれですか。
```sql
CREATE TABLE test_table (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    salary DECIMAL(8,2) DEFAULT 0
);
```

**選択肢:**
A) idは重複した値を持つことができる
B) nameにはNULL値を設定できる
C) salaryに値を指定しない場合、0が設定される
D) DECIMALは文字列型である

### 問題19（トランザクション）
以下のSQL文の実行について正しい説明はどれですか。
```sql
BEGIN;
UPDATE employees SET salary = salary * 1.1 WHERE department_id = 10;
DELETE FROM employees WHERE salary < 45000000;
COMMIT;
```

**選択肢:**
A) UPDATEとDELETEは個別に実行され、一方が失敗しても他方は実行される
B) UPDATEとDELETEは一つの単位として実行され、どちらかが失敗すると両方とも取り消される
C) COMMITは必要ない
D) BEGINは使用できない

### 問題20（パフォーマンス）
大量のデータを持つテーブルに対して以下のクエリを実行する場合、最もパフォーマンスが良いと考えられるものはどれですか。

**選択肢:**
A) `SELECT * FROM employees WHERE salary > 500000;`
B) `SELECT employee_id, first_name, last_name FROM employees WHERE salary > 500000;`
C) `SELECT * FROM employees;`（アプリケーション側で給与500000以上をフィルタ）
D) パフォーマンスに差はない

---

## 解答用紙

| 問題 | 解答 | 問題 | 解答 |
|------|------|------|------|
| 1 | [ ] | 11 | [ ] |
| 2 | [ ] | 12 | [ ] |
| 3 | [ ] | 13 | [ ] |
| 4 | [ ] | 14 | [ ] |
| 5 | [ ] | 15 | [ ] |
| 6 | [ ] | 16 | [ ] |
| 7 | [ ] | 17 | [ ] |
| 8 | [ ] | 18 | [ ] |
| 9 | [ ] | 19 | [ ] |
| 10 | [ ] | 20 | [ ] |

---

## 正解と解説

### 問題1: B
ORDER BY句で降順にするにはDESCを指定する必要があります。

### 問題2: B
複数条件をすべて満たす場合はAND演算子を使用します。

### 問題3: B
平均値を求める関数はAVG()です。

### 問題4: D
COUNT(*)はNULL値を含む全行数、COUNT(列名)はNULL値を除いた行数をカウントします。

### 問題5: B
GROUP BY句を使用してグループ化する必要があります。

### 問題6: C
集約結果に対する条件指定にはHAVING句を使用します。

### 問題7: D
すべて正しい結合の記述方法です。

### 問題8: B
INSERT INTO文の正しい構文です。

### 問題9: A
UPDATE文の正しい構文です。

### 問題10: C
DELETE FROM文の正しい構文です。

### 問題11: B
SQL文の標準的な実行順序です。

### 問題12: B
COUNT(*)はNULL値も含むため、COUNT(commission_pct)以上の値になります。

### 問題13: C
どちらも正しい結合の記述方法です。

### 問題14: A
LIKE演算子で%は任意の文字列を表します。

### 問題15: D
BETWEENと比較演算子の組み合わせは同じ結果になります。

### 問題16: C
どちらも正しい3テーブル結合の記述方法です。

### 問題17: B
サブクエリは括弧で囲む必要があります。

### 問題18: C
DEFAULT句により、値を指定しない場合のデフォルト値が設定されます。

### 問題19: B
トランザクション内の処理は一つの単位として扱われます。

### 問題20: B
必要な列のみを選択することでデータ転送量を削減できます。

---

## 採点基準

- **90点以上（18問以上正解）**: 優秀 - Level 2への進級推奨
- **80-89点（16-17問正解）**: 良好 - 一部復習後にLevel 2へ進級可能
- **70-79点（14-15問正解）**: 合格 - 基礎を固めてからLevel 2へ進級
- **60-69点（12-13問正解）**: 不合格 - 理論学習と練習問題の復習が必要
- **60点未満（11問以下正解）**: 不合格 - 基礎から学習し直すことを推奨

## 学習アドバイス

### 合格した場合
- Level 2: Intermediate（中級レベル）への進級を検討
- 弱点分野があれば重点的に復習
- 実際のデータベース環境での実習を推奨

### 不合格の場合
- theory.mdで理論を再学習
- practice.mdで実践問題を繰り返し練習
- solutions.mdで解法パターンを理解
- 1週間後に再テストを実施

### 共通アドバイス
- SQL文の実行順序を正確に理解する
- NULL値の扱いに注意する
- 集約関数とGROUP BY句の関係を理解する
- 結合の種類と使い分けを習得する
- データ操作時の安全性を常に意識する

---

**重要:** このテストは学習の進捗確認のためのものです。実際のデータベーススペシャリスト試験では、より複雑で実践的な問題が出題されます。継続的な学習と実践が重要です。