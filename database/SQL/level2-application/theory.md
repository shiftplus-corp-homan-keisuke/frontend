# Level 2: Application - SQL中級理論学習

## 概要

このレベルでは、SQL（Structured Query Language）の中級技術を学習します。データベーススペシャリスト試験に向けて、基本SQL理解者がより高度なデータ操作と分析技術を習得することを目標とします。

## 学習目標

- 外部結合（LEFT JOIN、RIGHT JOIN、FULL OUTER JOIN）を理解し、適切に使い分けできる
- サブクエリと相関サブクエリを効果的に活用できる
- CASE文とCOALESCE関数による条件分岐処理ができる
- ウィンドウ関数の基礎（ROW_NUMBER、RANK、DENSE_RANK）を習得する
- ビューの作成と活用による効率的なデータアクセスができる
- 制約（PRIMARY KEY、FOREIGN KEY、CHECK制約）を理解し実装できる
- インデックスの基本概念とパフォーマンス最適化を理解する

## 1. 外部結合（OUTER JOIN）

**外部結合とは、結合条件に一致しない行も結果に含める結合方法です。**

### 1.1 外部結合の概念

外部結合は、結合条件に一致しない行も結果に含める結合方法です。内部結合では取得できない「存在しないデータ」も分析対象にできます。

### 1.2 LEFT JOIN（左外部結合）

**LEFT JOINとは、左側のテーブルの全ての行を保持し、右側のテーブルから一致する行を結合する方法です。**

```sql
SELECT テーブル1.列名, テーブル2.列名
FROM テーブル1
LEFT JOIN テーブル2 ON テーブル1.結合キー = テーブル2.結合キー;
```

**例：**
```sql
-- 全従業員と所属部署を表示（部署未配属の従業員も含む）
SELECT e.employee_id, e.first_name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;

-- 部署別従業員数（従業員がいない部署も0として表示）
SELECT d.department_name, COUNT(e.employee_id) as employee_count
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name;
```

### 1.3 RIGHT JOIN（右外部結合）

**RIGHT JOINとは、右側のテーブルの全ての行を保持し、左側のテーブルから一致する行を結合する方法です。**

```sql
SELECT テーブル1.列名, テーブル2.列名
FROM テーブル1
RIGHT JOIN テーブル2 ON テーブル1.結合キー = テーブル2.結合キー;
```

**例：**
```sql
-- 全部署と所属従業員を表示（従業員がいない部署も含む）
SELECT e.first_name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.department_id;
```

### 1.4 FULL OUTER JOIN（完全外部結合）

**FULL OUTER JOINとは、両方のテーブルの全ての行を保持し、一致する行は結合し、一致しない行はNULLで補完する方法です。**

```sql
SELECT テーブル1.列名, テーブル2.列名
FROM テーブル1
FULL OUTER JOIN テーブル2 ON テーブル1.結合キー = テーブル2.結合キー;
```

**例：**
```sql
-- 従業員と部署の完全な対応関係を表示
SELECT e.first_name, d.department_name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.department_id;
```

## 2. サブクエリと相関サブクエリ

**サブクエリとは、SQL文の中に埋め込まれた別のSELECT文です。**

### 2.1 サブクエリの基本

サブクエリは、SQL文の中に埋め込まれた別のSELECT文です。

```sql
-- 基本構文
SELECT 列名
FROM テーブル名
WHERE 列名 演算子 (SELECT 列名 FROM テーブル名 WHERE 条件);
```

**例：**
```sql
-- 平均給与より高い給与の従業員を取得
SELECT employee_id, first_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- 最高給与の従業員を取得
SELECT employee_id, first_name, salary
FROM employees
WHERE salary = (SELECT MAX(salary) FROM employees);
```

### 2.2 IN句でのサブクエリ

**IN句でのサブクエリとは、複数の値の中から一致するものを検索する際に使用する方法です。**

```sql
-- 特定の部署に所属する従業員を取得
SELECT employee_id, first_name
FROM employees
WHERE department_id IN (
    SELECT department_id
    FROM departments
    WHERE location = '東京'
);
```

### 2.3 EXISTS句でのサブクエリ

**EXISTS句でのサブクエリとは、サブクエリの結果が存在するかどうかを判定する方法です。**

```sql
-- 従業員が存在する部署のみを取得
SELECT department_id, department_name
FROM departments d
WHERE EXISTS (
    SELECT 1 
    FROM employees e 
    WHERE e.department_id = d.department_id
);
```

### 2.4 相関サブクエリ

**相関サブクエリとは、外側のクエリの値を参照するサブクエリです。**

相関サブクエリは、外側のクエリの値を参照するサブクエリです。

```sql
-- 各部署で最高給与の従業員を取得
SELECT e1.employee_id, e1.first_name, e1.salary, e1.department_id
FROM employees e1
WHERE e1.salary = (
    SELECT MAX(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);

-- 部署平均より高い給与の従業員を取得
SELECT e1.employee_id, e1.first_name, e1.salary
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
```

## 3. CASE文とCOALESCE関数

**CASE文とは、条件に応じて異なる値を返す条件分岐処理を行う構文です。**

### 3.1 CASE文による条件分岐

**CASE文とは、条件に応じて異なる値を返す条件分岐処理を行う構文です。**

```sql
-- 基本構文
CASE 
    WHEN 条件1 THEN 値1
    WHEN 条件2 THEN 値2
    ELSE 値3
END
```

**例：**
```sql
-- 給与レベルの分類
SELECT employee_id, first_name, salary,
    CASE 
        WHEN salary >= 800000 THEN '高給'
        WHEN salary >= 500000 THEN '中給'
        ELSE '低給'
    END as salary_level
FROM employees;

-- 部署名の日本語表示
SELECT employee_id, first_name,
    CASE department_id
        WHEN 10 THEN '総務部'
        WHEN 20 THEN '営業部'
        WHEN 30 THEN '開発部'
        ELSE '未配属'
    END as department_name_jp
FROM employees;
```

### 3.2 集約関数でのCASE文活用

**集約関数でのCASE文活用とは、条件に応じた集計処理を行う方法です。**

```sql
-- 条件別集計
SELECT 
    COUNT(*) as total_employees,
    COUNT(CASE WHEN salary >= 500000 THEN 1 END) as high_salary_count,
    COUNT(CASE WHEN salary < 500000 THEN 1 END) as low_salary_count
FROM employees;

-- 部署別給与レベル集計
SELECT department_id,
    SUM(CASE WHEN salary >= 800000 THEN 1 ELSE 0 END) as high_salary,
    SUM(CASE WHEN salary BETWEEN 500000 AND 799999 THEN 1 ELSE 0 END) as mid_salary,
    SUM(CASE WHEN salary < 500000 THEN 1 ELSE 0 END) as low_salary
FROM employees
GROUP BY department_id;
```

### 3.3 COALESCE関数

**COALESCE関数とは、NULL値を他の値で置き換える関数です。**

COALESCE関数は、NULL値を他の値で置き換える関数です。

```sql
-- 基本構文
COALESCE(値1, 値2, 値3, ...)

-- 例：コミッション率がNULLの場合は0で表示
SELECT employee_id, first_name, 
    COALESCE(commission_pct, 0) as commission_rate
FROM employees;

-- 複数列からの値選択
SELECT employee_id,
    COALESCE(phone_number, email, '連絡先なし') as contact_info
FROM employees;
```

## 4. ウィンドウ関数の基礎

**ウィンドウ関数とは、行のグループ（ウィンドウ）に対して計算を行う関数です。**

### 4.1 ウィンドウ関数の概念

ウィンドウ関数は、行のグループ（ウィンドウ）に対して計算を行う関数です。GROUP BYとは異なり、元の行数を保持します。

```sql
-- 基本構文
関数名() OVER (
    [PARTITION BY 列名]
    [ORDER BY 列名]
    [ROWS/RANGE 範囲指定]
)
```

### 4.2 ROW_NUMBER関数

**ROW_NUMBER関数とは、各行に一意の連番を付与する関数です。**

各行に一意の連番を付与します。

```sql
-- 全従業員に連番を付与
SELECT employee_id, first_name, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as row_num
FROM employees;

-- 部署別に給与順で連番を付与
SELECT employee_id, first_name, department_id, salary,
    ROW_NUMBER() OVER (
        PARTITION BY department_id 
        ORDER BY salary DESC
    ) as dept_rank
FROM employees;
```

### 4.3 RANK関数

**RANK関数とは、同順位を考慮したランキングを付与する関数です（同順位の次は順位が飛ぶ）。**

同順位を考慮したランキングを付与します（同順位の次は順位が飛ぶ）。

```sql
-- 給与ランキング（同順位あり）
SELECT employee_id, first_name, salary,
    RANK() OVER (ORDER BY salary DESC) as salary_rank
FROM employees;

-- 部署別給与ランキング
SELECT employee_id, first_name, department_id, salary,
    RANK() OVER (
        PARTITION BY department_id 
        ORDER BY salary DESC
    ) as dept_salary_rank
FROM employees;
```

### 4.4 DENSE_RANK関数

**DENSE_RANK関数とは、同順位を考慮したランキングを付与する関数です（同順位の次は連続した順位）。**

同順位を考慮したランキングを付与します（同順位の次は連続した順位）。

```sql
-- 密なランキング
SELECT employee_id, first_name, salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank
FROM employees;
```

### 4.5 集約ウィンドウ関数

**集約ウィンドウ関数とは、ウィンドウ内でSUM、AVG、COUNTなどの集約処理を行う関数です。**

```sql
-- 累積合計
SELECT employee_id, first_name, salary,
    SUM(salary) OVER (ORDER BY employee_id) as cumulative_salary
FROM employees;

-- 移動平均
SELECT employee_id, first_name, salary,
    AVG(salary) OVER (
        ORDER BY employee_id 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as moving_avg
FROM employees;
```

## 5. ビューの作成と活用

**ビューとは、1つ以上のテーブルから作成される仮想的なテーブルです。**

### 5.1 ビューの基本概念

ビューは、1つ以上のテーブルから作成される仮想的なテーブルです。

### 5.2 ビューの作成

**ビューの作成とは、CREATE VIEW文を使用して仮想的なテーブルを定義することです。**

```sql
-- 基本構文
CREATE VIEW ビュー名 AS
SELECT 列名1, 列名2, ...
FROM テーブル名
WHERE 条件;
```

**例：**
```sql
-- 従業員詳細ビュー
CREATE VIEW employee_details AS
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.salary,
    d.department_name,
    d.location
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;

-- 高給取り従業員ビュー
CREATE VIEW high_salary_employees AS
SELECT employee_id, first_name, last_name, salary
FROM employees
WHERE salary >= 700000;
```

### 5.3 ビューの活用

**ビューの活用とは、作成したビューを通常のテーブルと同様に使用してデータを取得することです。**

```sql
-- ビューからのデータ取得
SELECT * FROM employee_details
WHERE city = '東京';

-- ビューを使った集計
SELECT department_name, AVG(salary) as avg_salary
FROM employee_details
GROUP BY department_name;
```

### 5.4 ビューの更新と削除

**ビューの更新と削除とは、既存のビューの定義を変更したり、不要になったビューを削除することです。**

```sql
-- ビューの更新
CREATE OR REPLACE VIEW employee_summary AS
SELECT 
    employee_id,
    CONCAT(first_name, ' ', last_name) as CONCAT(first_name, ' ', last_name) as full_name,
    salary
FROM employees;

-- ビューの削除
DROP VIEW employee_summary;
```

## 6. 制約（Constraints）

**制約とは、テーブルのデータの整合性を保つためのルールです。**

### 6.1 PRIMARY KEY制約

**PRIMARY KEY制約とは、テーブルの各行を一意に識別するための制約です。**

```sql
-- テーブル作成時に指定
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL
);

-- 既存テーブルに追加
ALTER TABLE departments 
ADD CONSTRAINT pk_departments PRIMARY KEY (department_id);
```

### 6.2 FOREIGN KEY制約

**FOREIGN KEY制約とは、他のテーブルとの参照整合性を保つための制約です。**

```sql
-- テーブル作成時に指定
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- 既存テーブルに追加
ALTER TABLE employees 
ADD CONSTRAINT fk_emp_dept 
FOREIGN KEY (department_id) REFERENCES departments(department_id);
```

### 6.3 CHECK制約

**CHECK制約とは、列の値が特定の条件を満たすことを保証する制約です。**

```sql
-- 給与の範囲制限
ALTER TABLE employees 
ADD CONSTRAINT chk_salary CHECK (salary > 0 AND salary <= 100000);

-- 性別の値制限
ALTER TABLE employees 
ADD CONSTRAINT chk_gender CHECK (gender IN ('M', 'F'));
```

### 6.4 UNIQUE制約

**UNIQUE制約とは、列の値が一意であることを保証する制約です。**

```sql
-- メールアドレスの一意性
ALTER TABLE employees 
ADD CONSTRAINT uk_email UNIQUE (email);
```

### 6.5 NOT NULL制約

**NOT NULL制約とは、列にNULL値の格納を禁止する制約です。**

```sql
-- 必須項目の指定
ALTER TABLE employees 
MODIFY first_name VARCHAR(50) NOT NULL;
```

## 7. インデックスの基本概念

**インデックスとは、データベースの検索性能を向上させるためのデータ構造です。**

### 7.1 インデックスとは

インデックスは、データベースの検索性能を向上させるためのデータ構造です。

### 7.2 インデックスの作成

**インデックスの作成とは、CREATE INDEX文を使用してテーブルの列に検索用のインデックスを作成することです。**

```sql
-- 単一列インデックス
CREATE INDEX idx_employee_last_name ON employees(last_name);

-- 複合インデックス
CREATE INDEX idx_emp_dept_salary ON employees(department_id, salary);

-- 一意インデックス
CREATE UNIQUE INDEX idx_employee_email ON employees(email);
```

### 7.3 インデックスの効果

**インデックスの効果とは、検索処理の高速化やソート処理の最適化などの性能向上効果です。**

```sql
-- インデックスが効果的なクエリ
SELECT * FROM employees WHERE last_name = 'Smith';

-- 複合インデックスが効果的なクエリ
SELECT * FROM employees 
WHERE department_id = 10 AND salary > 500000;
```

### 7.4 インデックスの削除

**インデックスの削除とは、DROP INDEX文を使用して不要になったインデックスを削除することです。**

```sql
DROP INDEX idx_employee_last_name;
```

## 試験ポイント

### 1. 外部結合の理解
- LEFT JOIN、RIGHT JOIN、FULL OUTER JOINの違いと使い分け
- NULL値の扱いと結果の解釈
- 内部結合との結果の違い

### 2. サブクエリの最適化
- 相関サブクエリと非相関サブクエリの違い
- EXISTS vs IN の使い分け
- サブクエリのパフォーマンス考慮

### 3. ウィンドウ関数の活用
- PARTITION BYとORDER BYの役割
- RANK、DENSE_RANK、ROW_NUMBERの違い
- 集約ウィンドウ関数の範囲指定

### 4. ビューの設計
- ビューの更新可能性
- パフォーマンスへの影響
- セキュリティ面での活用

### 5. 制約の設計
- 参照整合性の維持
- CHECK制約による業務ルールの実装
- 制約違反時の動作

### 6. インデックス設計
- 適切なインデックスの選択
- 複合インデックスの列順序
- インデックスのメンテナンスコスト

## 確認問題

1. 従業員テーブル（employees）と部署テーブル（departments）を左外部結合して、部署未配属の従業員も含めて全従業員の情報を取得するSQL文を記述してください。

2. 各部署で給与が最も高い従業員を相関サブクエリを使って取得するSQL文を記述してください。

3. 従業員の給与を「高給（700000以上）」「中給（500000以上700000未満）」「低給（500000未満）」に分類するCASE文を使ったSQL文を記述してください。

4. 部署別に給与の高い順でランキングを付けるウィンドウ関数を使ったSQL文を記述してください。

5. 従業員の詳細情報（従業員情報＋部署情報＋所在地情報）を表示するビューを作成するSQL文を記述してください。

6. 従業員テーブルに給与の範囲（1000以上100000以下）をチェックする制約を追加するSQL文を記述してください。

7. 従業員テーブルの姓（last_name）列にインデックスを作成するSQL文を記述してください。

8. 部署に所属する従業員が存在するかどうかをEXISTS句を使って確認するSQL文を記述してください。

---

**学習時間目安**: 3-4週間  
**合格基準**: 70点以上  
**次のレベル**: Level 3: Advanced（上級レベル）