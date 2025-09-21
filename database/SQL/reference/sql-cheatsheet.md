# SQL チートシート - データベーススペシャリスト試験対応

## 🎯 概要

このチートシートは、データベーススペシャリスト試験で頻出するSQL構文と関数を体系的にまとめたクイックリファレンスです。学習中や試験直前の確認に活用してください。

## 📚 基本構文（Level 1）

### SELECT文の基本構造

```sql
SELECT [DISTINCT] 列名1, 列名2, ...
FROM テーブル名
[WHERE 条件]
[GROUP BY 列名]
[HAVING 条件]
[ORDER BY 列名 [ASC|DESC]]
[LIMIT 件数];
```

### 基本的なSELECT

```sql
-- 全列選択
SELECT * FROM employees;

-- 特定列選択
SELECT first_name, last_name, salary FROM employees;

-- 重複除去
SELECT DISTINCT department_id FROM employees;

-- 別名（エイリアス）
SELECT first_name AS 名前, salary AS 給与 FROM employees;
```

### WHERE句の条件指定

```sql
-- 比較演算子
SELECT * FROM employees WHERE salary > 500000;
SELECT * FROM employees WHERE department_id = 10;
SELECT * FROM employees WHERE hire_date >= '2020-01-01';

-- 論理演算子
SELECT * FROM employees WHERE salary > 400000 AND department_id = 10;
SELECT * FROM employees WHERE department_id = 10 OR department_id = 20;
SELECT * FROM employees WHERE NOT department_id = 30;

-- 範囲指定
SELECT * FROM employees WHERE salary BETWEEN 400000 AND 600000;

-- リスト指定
SELECT * FROM employees WHERE department_id IN (10, 20, 30);

-- パターンマッチング
SELECT * FROM employees WHERE first_name LIKE '田%';
SELECT * FROM employees WHERE email LIKE '%@company.com';

-- NULL値の判定
SELECT * FROM employees WHERE commission_pct IS NULL;
SELECT * FROM employees WHERE commission_pct IS NOT NULL;
```

### ORDER BY句

```sql
-- 昇順（デフォルト）
SELECT * FROM employees ORDER BY salary;
SELECT * FROM employees ORDER BY salary ASC;

-- 降順
SELECT * FROM employees ORDER BY salary DESC;

-- 複数列でのソート
SELECT * FROM employees ORDER BY department_id, salary DESC;
```

### 集約関数

```sql
-- 基本集約関数
SELECT COUNT(*) FROM employees;                    -- 行数
SELECT COUNT(commission_pct) FROM employees;       -- NULL以外の行数
SELECT SUM(salary) FROM employees;                 -- 合計
SELECT AVG(salary) FROM employees;                 -- 平均
SELECT MAX(salary) FROM employees;                 -- 最大値
SELECT MIN(salary) FROM employees;                 -- 最小値

-- GROUP BY句との組み合わせ
SELECT department_id, COUNT(*), AVG(salary)
FROM employees
GROUP BY department_id;

-- HAVING句（集約結果の条件指定）
SELECT department_id, COUNT(*) as emp_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) >= 3;
```

### データ操作（DML）

```sql
-- INSERT（挿入）
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date, job_title, salary, department_id)
VALUES (999, '太郎', '新入', 'shinnyu.taro@company.com', '2022-04-01', '新入社員', 300000, 10);

-- UPDATE（更新）
UPDATE employees 
SET salary = salary * 1.1 
WHERE department_id = 10;

-- DELETE（削除）
DELETE FROM employees 
WHERE employee_id = 100;
```

## 🔗 結合（Level 2）

### 内部結合（INNER JOIN）

```sql
-- 基本的な内部結合
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;

-- 複数テーブルの結合
SELECT e.first_name, d.department_name, c.category_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
INNER JOIN categories c ON d.category_id = c.category_id;
```

### 外部結合（OUTER JOIN）

```sql
-- 左外部結合（LEFT JOIN）
SELECT e.first_name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;

-- 右外部結合（RIGHT JOIN）
SELECT e.first_name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.department_id;

-- 完全外部結合（FULL OUTER JOIN）
SELECT e.first_name, d.department_name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.department_id;
```

### 自己結合

```sql
-- 従業員と上司の関係
SELECT e.first_name AS 従業員, m.first_name AS 上司
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
```

## 🔍 サブクエリ（Level 2）

### 単一行サブクエリ

```sql
-- WHERE句でのサブクエリ
SELECT * FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);

-- SELECT句でのサブクエリ
SELECT first_name, salary,
       (SELECT AVG(salary) FROM employees) AS avg_salary
FROM employees;
```

### 複数行サブクエリ

```sql
-- IN演算子
SELECT * FROM employees 
WHERE department_id IN (SELECT department_id FROM departments WHERE location = '東京');

-- ANY/ALL演算子
SELECT * FROM employees 
WHERE salary > ANY (SELECT salary FROM employees WHERE department_id = 10);

SELECT * FROM employees 
WHERE salary > ALL (SELECT salary FROM employees WHERE department_id = 10);
```

### 相関サブクエリ

```sql
-- 各部署の平均給与より高い従業員
SELECT * FROM employees e1
WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department_id = e1.department_id);

-- EXISTS演算子
SELECT * FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id);
```

## 📊 ウィンドウ関数（Level 2-3）

### 基本的なウィンドウ関数

```sql
-- ROW_NUMBER（行番号）
SELECT first_name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) as row_num
FROM employees;

-- RANK（順位、同順位あり）
SELECT first_name, salary,
       RANK() OVER (ORDER BY salary DESC) as rank_num
FROM employees;

-- DENSE_RANK（密な順位）
SELECT first_name, salary,
       DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank_num
FROM employees;
```

### PARTITION BYを使用したウィンドウ関数

```sql
-- 部署別の順位
SELECT first_name, department_id, salary,
       RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as dept_rank
FROM employees;

-- 部署別の累計
SELECT first_name, department_id, salary,
       SUM(salary) OVER (PARTITION BY department_id ORDER BY hire_date) as running_total
FROM employees;
```

### 高度なウィンドウ関数（Level 3）

```sql
-- LAG/LEAD（前後の行の値）
SELECT first_name, salary,
       LAG(salary, 1) OVER (ORDER BY hire_date) as prev_salary,
       LEAD(salary, 1) OVER (ORDER BY hire_date) as next_salary
FROM employees;

-- FIRST_VALUE/LAST_VALUE
SELECT first_name, salary,
       FIRST_VALUE(salary) OVER (PARTITION BY department_id ORDER BY salary DESC) as highest_salary,
       LAST_VALUE(salary) OVER (PARTITION BY department_id ORDER BY salary DESC 
                                ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as lowest_salary
FROM employees;

-- NTILE（分位数）
SELECT first_name, salary,
       NTILE(4) OVER (ORDER BY salary) as quartile
FROM employees;
```

## 🔄 条件分岐（Level 2）

### CASE文

```sql
-- 単純CASE文
SELECT first_name, 
       CASE department_id
           WHEN 10 THEN '営業部'
           WHEN 20 THEN '開発部'
           WHEN 30 THEN 'マーケティング部'
           ELSE 'その他'
       END as department_name
FROM employees;

-- 検索CASE文
SELECT first_name, salary,
       CASE 
           WHEN salary >= 800000 THEN '高給'
           WHEN salary >= 500000 THEN '中給'
           ELSE '低給'
       END as salary_level
FROM employees;
```

### COALESCE関数

```sql
-- NULL値の置換
SELECT first_name, COALESCE(commission_pct, 0) as commission
FROM employees;

-- 複数列からの最初の非NULL値
SELECT COALESCE(phone_number, email, '連絡先なし') as contact
FROM employees;
```

## 🏗️ DDL（データ定義言語）

### テーブル作成

```sql
CREATE TABLE sample_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT CHECK (age >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 制約

```sql
-- PRIMARY KEY制約
ALTER TABLE employees ADD CONSTRAINT pk_employees PRIMARY KEY (employee_id);

-- FOREIGN KEY制約
ALTER TABLE employees ADD CONSTRAINT fk_emp_dept 
FOREIGN KEY (department_id) REFERENCES departments(department_id);

-- CHECK制約
ALTER TABLE employees ADD CONSTRAINT chk_salary CHECK (salary > 0);

-- UNIQUE制約
ALTER TABLE employees ADD CONSTRAINT uk_email UNIQUE (email);
```

### インデックス

```sql
-- インデックス作成
CREATE INDEX idx_emp_dept ON employees(department_id);
CREATE INDEX idx_emp_name ON employees(first_name, last_name);

-- ユニークインデックス
CREATE UNIQUE INDEX uk_emp_email ON employees(email);

-- インデックス削除
DROP INDEX idx_emp_dept ON employees;
```

## 📋 ビューとCTE（Level 2-3）

### ビュー

```sql
-- ビュー作成
CREATE VIEW employee_summary AS
SELECT e.employee_id, e.first_name, e.last_name, d.department_name, e.salary
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

-- ビュー使用
SELECT * FROM employee_summary WHERE salary > 500000;

-- ビュー削除
DROP VIEW employee_summary;
```

### 共通テーブル式（CTE）

```sql
-- 基本的なCTE
WITH high_salary_emp AS (
    SELECT * FROM employees WHERE salary > 600000
)
SELECT * FROM high_salary_emp;

-- 複数のCTE
WITH 
dept_avg AS (
    SELECT department_id, AVG(salary) as avg_salary
    FROM employees GROUP BY department_id
),
high_performers AS (
    SELECT e.*, d.avg_salary
    FROM employees e
    JOIN dept_avg d ON e.department_id = d.department_id
    WHERE e.salary > d.avg_salary
)
SELECT * FROM high_performers;
```

### 再帰CTE（Level 3）

```sql
-- 階層データの処理
WITH RECURSIVE org_hierarchy AS (
    -- アンカー部分（最上位）
    SELECT employee_id, first_name, manager_id, 1 as level
    FROM employees 
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- 再帰部分
    SELECT e.employee_id, e.first_name, e.manager_id, oh.level + 1
    FROM employees e
    JOIN org_hierarchy oh ON e.manager_id = oh.employee_id
)
SELECT * FROM org_hierarchy ORDER BY level, employee_id;
```

## 🔧 高度な機能（Level 3）

### ストアドプロシージャ

```sql
DELIMITER //
CREATE PROCEDURE GetEmployeesByDept(IN dept_id INT)
BEGIN
    SELECT * FROM employees WHERE department_id = dept_id;
END //
DELIMITER ;

-- 実行
CALL GetEmployeesByDept(10);
```

### トリガー

```sql
DELIMITER //
CREATE TRIGGER update_employee_timestamp
BEFORE UPDATE ON employees
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;
```

### トランザクション制御

```sql
-- トランザクション開始
START TRANSACTION;

-- 処理実行
UPDATE employees SET salary = salary * 1.1 WHERE department_id = 10;
INSERT INTO salary_history (employee_id, old_salary, new_salary, change_date)
SELECT employee_id, salary / 1.1, salary, CURRENT_DATE
FROM employees WHERE department_id = 10;

-- コミット（確定）
COMMIT;

-- ロールバック（取り消し）
-- ROLLBACK;
```

## 📈 パフォーマンス最適化

### 実行計画の確認

```sql
-- MySQL
EXPLAIN SELECT * FROM employees WHERE department_id = 10;
EXPLAIN FORMAT=JSON SELECT * FROM employees WHERE department_id = 10;

-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM employees WHERE department_id = 10;
```

### インデックスヒント

```sql
-- MySQL
SELECT * FROM employees USE INDEX (idx_dept_salary) WHERE department_id = 10;
SELECT * FROM employees FORCE INDEX (idx_dept_salary) WHERE department_id = 10;
```

## 🔍 よく使用する関数

### 文字列関数

```sql
-- 文字列結合
SELECT CONCAT(first_name, ' ', last_name) as full_name FROM employees;

-- 文字列長
SELECT LENGTH(first_name) FROM employees;

-- 部分文字列
SELECT SUBSTRING(email, 1, POSITION('@' IN email) - 1) as username FROM employees;

-- 大文字・小文字変換
SELECT UPPER(first_name), LOWER(last_name) FROM employees;

-- 文字列置換
SELECT REPLACE(email, '@company.com', '@newcompany.com') FROM employees;
```

### 日付関数

```sql
-- 現在日時
SELECT CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP;

-- 日付計算
SELECT hire_date, DATE_ADD(hire_date, INTERVAL 1 YEAR) as anniversary FROM employees;
SELECT DATEDIFF(CURRENT_DATE, hire_date) as days_employed FROM employees;

-- 日付フォーマット
SELECT DATE_FORMAT(hire_date, '%Y年%m月%d日') FROM employees;

-- 日付部分抽出
SELECT YEAR(hire_date), MONTH(hire_date), DAY(hire_date) FROM employees;
```

### 数値関数

```sql
-- 四捨五入・切り上げ・切り捨て
SELECT ROUND(salary / 12, 0) as monthly_salary FROM employees;
SELECT CEIL(salary / 12) as monthly_salary_ceil FROM employees;
SELECT FLOOR(salary / 12) as monthly_salary_floor FROM employees;

-- 絶対値・符号
SELECT ABS(-100), SIGN(-100), SIGN(100);

-- 乱数
SELECT RAND(), FLOOR(RAND() * 100) as random_number;
```

## 🎯 試験頻出パターン

### 相関サブクエリパターン

```sql
-- 各部署の最高給与者
SELECT * FROM employees e1
WHERE salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.department_id = e1.department_id);

-- 自分より給与が高い人の数
SELECT first_name, salary,
       (SELECT COUNT(*) FROM employees e2 WHERE e2.salary > e1.salary) as higher_count
FROM employees e1;
```

### ウィンドウ関数パターン

```sql
-- 累計売上
SELECT sale_date, sales_amount,
       SUM(sales_amount) OVER (ORDER BY sale_date) as cumulative_sales
FROM sales_records;

-- 移動平均
SELECT sale_date, sales_amount,
       AVG(sales_amount) OVER (ORDER BY sale_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as moving_avg
FROM sales_records;
```

### 複雑な集計パターン

```sql
-- ピボット集計
SELECT 
    department_id,
    SUM(CASE WHEN YEAR(hire_date) = 2020 THEN 1 ELSE 0 END) as hired_2020,
    SUM(CASE WHEN YEAR(hire_date) = 2021 THEN 1 ELSE 0 END) as hired_2021,
    SUM(CASE WHEN YEAR(hire_date) = 2022 THEN 1 ELSE 0 END) as hired_2022
FROM employees
GROUP BY department_id;
```

## ⚠️ よくある間違いと注意点

### NULL値の扱い

```sql
-- ❌ 間違い
SELECT * FROM employees WHERE commission_pct = NULL;

-- ✅ 正しい
SELECT * FROM employees WHERE commission_pct IS NULL;
```

### GROUP BYの制限

```sql
-- ❌ 間違い（GROUP BYに含まれていない列をSELECT）
SELECT first_name, department_id, COUNT(*) FROM employees GROUP BY department_id;

-- ✅ 正しい
SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;
```

### 外部結合の条件

```sql
-- ❌ 間違い（WHERE句で条件指定すると内部結合と同じ結果）
SELECT * FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id
WHERE d.location = '東京';

-- ✅ 正しい（ON句で条件指定）
SELECT * FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id AND d.location = '東京';
```

---

## 📚 参考情報

- **SQL実行順序**: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
- **インデックス効果**: WHERE句、JOIN条件、ORDER BY句で使用される列
- **パフォーマンス**: サブクエリよりもJOINの方が高速な場合が多い
- **可読性**: 複雑なクエリは段階的に構築し、適切にインデントを使用

このチートシートを活用して、効率的にSQL学習を進めてください！ 🎯📚