# Level 1: Foundation - SQL基礎理論学習

## 概要

このレベルでは、SQL（Structured Query Language）の基礎を学習します。データベーススペシャリスト試験に向けて、SQL完全初心者が基本的なデータ操作を習得することを目標とします。

## 学習目標

- 基本的なSELECT文を理解し、適切に使用できる
- 集約関数を使用したデータ集計ができる
- GROUP BY、HAVING句を使用した条件付き集計ができる
- 基本的な内部結合（INNER JOIN）を理解し実装できる
- 基本的なデータ操作（INSERT、UPDATE、DELETE）ができる

## 1. 基本SELECT文

### 1.1 SELECT文の基本構文

```sql
SELECT 列名1, 列名2, ...
FROM テーブル名;
```

**例：**
```sql
-- 全ての列を取得
SELECT * FROM employees;

-- 特定の列のみを取得
SELECT employee_id, first_name, last_name FROM employees;
```

### 1.2 WHERE句による条件指定

```sql
SELECT 列名1, 列名2, ...
FROM テーブル名
WHERE 条件;
```

**例：**
```sql
-- 特定の部署の従業員を取得
SELECT * FROM employees WHERE department_id = 10;

-- 給与が5000以上の従業員を取得
SELECT * FROM employees WHERE salary >= 5000;

-- 複数条件の組み合わせ
SELECT * FROM employees 
WHERE department_id = 10 AND salary >= 5000;
```

### 1.3 ORDER BY句による並び替え

```sql
SELECT 列名1, 列名2, ...
FROM テーブル名
ORDER BY 列名 [ASC|DESC];
```

**例：**
```sql
-- 給与の昇順で並び替え
SELECT * FROM employees ORDER BY salary ASC;

-- 給与の降順で並び替え
SELECT * FROM employees ORDER BY salary DESC;

-- 複数列での並び替え
SELECT * FROM employees 
ORDER BY department_id ASC, salary DESC;
```

### 1.4 LIMIT句による取得件数制限

```sql
SELECT 列名1, 列名2, ...
FROM テーブル名
LIMIT 件数;
```

**例：**
```sql
-- 上位10件のみ取得
SELECT * FROM employees 
ORDER BY salary DESC 
LIMIT 10;
```

## 2. 集約関数

### 2.1 基本的な集約関数

| 関数 | 説明 | 例 |
|------|------|-----|
| COUNT() | 行数をカウント | COUNT(*), COUNT(列名) |
| SUM() | 合計値を計算 | SUM(salary) |
| AVG() | 平均値を計算 | AVG(salary) |
| MAX() | 最大値を取得 | MAX(salary) |
| MIN() | 最小値を取得 | MIN(salary) |

**例：**
```sql
-- 従業員数をカウント
SELECT COUNT(*) FROM employees;

-- 給与の合計
SELECT SUM(salary) FROM employees;

-- 給与の平均
SELECT AVG(salary) FROM employees;

-- 最高給与と最低給与
SELECT MAX(salary), MIN(salary) FROM employees;
```

### 2.2 NULL値の扱い

```sql
-- NULL値を除外してカウント
SELECT COUNT(commission_pct) FROM employees;

-- NULL値を含めてカウント
SELECT COUNT(*) FROM employees;
```

## 3. GROUP BY句とHAVING句

### 3.1 GROUP BY句による グループ化

```sql
SELECT 列名, 集約関数(列名)
FROM テーブル名
GROUP BY 列名;
```

**例：**
```sql
-- 部署別の従業員数
SELECT department_id, COUNT(*) 
FROM employees 
GROUP BY department_id;

-- 部署別の平均給与
SELECT department_id, AVG(salary) 
FROM employees 
GROUP BY department_id;
```

### 3.2 HAVING句による集約結果の条件指定

```sql
SELECT 列名, 集約関数(列名)
FROM テーブル名
GROUP BY 列名
HAVING 集約関数の条件;
```

**例：**
```sql
-- 従業員数が5人以上の部署
SELECT department_id, COUNT(*) 
FROM employees 
GROUP BY department_id 
HAVING COUNT(*) >= 5;

-- 平均給与が6000以上の部署
SELECT department_id, AVG(salary) 
FROM employees 
GROUP BY department_id 
HAVING AVG(salary) >= 6000;
```

### 3.3 WHEREとHAVINGの違い

- **WHERE句**: 行をフィルタリング（GROUP BY前に実行）
- **HAVING句**: グループをフィルタリング（GROUP BY後に実行）

```sql
-- WHERE句とHAVING句の組み合わせ
SELECT department_id, AVG(salary) 
FROM employees 
WHERE salary >= 3000  -- 個別の行をフィルタ
GROUP BY department_id 
HAVING AVG(salary) >= 5000;  -- グループをフィルタ
```

## 4. 基本的な内部結合（INNER JOIN）

### 4.1 INNER JOINの基本構文

```sql
SELECT テーブル1.列名, テーブル2.列名
FROM テーブル1
INNER JOIN テーブル2 ON テーブル1.結合キー = テーブル2.結合キー;
```

**例：**
```sql
-- 従業員と部署情報を結合
SELECT e.employee_id, e.first_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;
```

### 4.2 テーブルエイリアス

```sql
-- テーブルに別名を付けて記述を簡潔にする
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;
```

### 4.3 複数テーブルの結合

```sql
-- 3つのテーブルを結合
SELECT e.first_name, d.department_name, l.city
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
INNER JOIN locations l ON d.location_id = l.location_id;
```

## 5. 基本的なデータ操作

### 5.1 INSERT文（データの挿入）

```sql
-- 基本構文
INSERT INTO テーブル名 (列名1, 列名2, ...)
VALUES (値1, 値2, ...);
```

**例：**
```sql
-- 新しい従業員を追加
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date)
VALUES (1001, '太郎', '田中', 'tanaka@example.com', '2024-01-01');

-- 複数行を一度に挿入
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date)
VALUES 
    (1002, '花子', '佐藤', 'sato@example.com', '2024-01-02'),
    (1003, '次郎', '鈴木', 'suzuki@example.com', '2024-01-03');
```

### 5.2 UPDATE文（データの更新）

```sql
-- 基本構文
UPDATE テーブル名
SET 列名1 = 値1, 列名2 = 値2, ...
WHERE 条件;
```

**例：**
```sql
-- 特定の従業員の給与を更新
UPDATE employees
SET salary = 6000
WHERE employee_id = 1001;

-- 複数列を同時に更新
UPDATE employees
SET salary = 6500, department_id = 20
WHERE employee_id = 1001;
```

### 5.3 DELETE文（データの削除）

```sql
-- 基本構文
DELETE FROM テーブル名
WHERE 条件;
```

**例：**
```sql
-- 特定の従業員を削除
DELETE FROM employees
WHERE employee_id = 1001;

-- 条件に合致する複数行を削除
DELETE FROM employees
WHERE department_id = 30 AND salary < 3000;
```

## 試験ポイント

### 1. SQL文の実行順序
1. FROM句
2. WHERE句
3. GROUP BY句
4. HAVING句
5. SELECT句
6. ORDER BY句
7. LIMIT句

### 2. 集約関数の特徴
- NULL値は計算から除外される（COUNT(*)を除く）
- GROUP BY句なしで集約関数を使用すると、全体が1つのグループとして扱われる
- SELECT句に集約関数と通常の列を混在させる場合は、GROUP BY句が必要

### 3. JOINの種類と特徴
- INNER JOIN: 両方のテーブルに存在するデータのみを取得
- 結合条件は等価結合（=）が基本
- 結合キーにNULL値がある行は結果に含まれない

### 4. データ操作時の注意点
- WHERE句を忘れるとテーブル全体が対象になる
- 外部キー制約がある場合、参照整合性を保つ必要がある
- トランザクション管理が重要

## 確認問題

1. 従業員テーブル（employees）から、給与が5000以上の従業員の名前と給与を給与の降順で取得するSQL文を記述してください。

2. 部署別の従業員数と平均給与を求め、従業員数が3人以上の部署のみを表示するSQL文を記述してください。

3. 従業員テーブル（employees）と部署テーブル（departments）を結合して、従業員名と所属部署名を表示するSQL文を記述してください。

4. 新しい従業員（ID: 2001, 名前: 山田太郎, メール: yamada@example.com, 入社日: 2024-04-01）を追加するSQL文を記述してください。

5. 従業員ID 2001の給与を7000に更新するSQL文を記述してください。

---

**学習時間目安**: 2-3週間  
**合格基準**: 70点以上  
**次のレベル**: Level 2: Intermediate（中級レベル）