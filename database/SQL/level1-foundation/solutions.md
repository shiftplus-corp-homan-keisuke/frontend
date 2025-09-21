# Level 1: Foundation - SQL基礎練習問題 解答・解説

## 概要

このファイルでは、practice.mdの全ての練習問題に対する解答と詳細な解説を提供します。各解答には、SQL文の構文説明、実行結果の予想、および学習ポイントが含まれています。

---

## セクション1: 基本SELECT文 - 解答

### 問題1-1: 全データの取得

**解答:**
```sql
SELECT * FROM employees;
```

**解説:**
- `*`は全ての列を意味する
- FROM句でテーブル名を指定
- 最もシンプルなSELECT文の形

### 問題1-2: 特定列の取得

**解答:**
```sql
SELECT employee_id, first_name, last_name FROM employees;
```

**解説:**
- 必要な列のみを指定することで、データ転送量を削減
- 列名はカンマで区切る
- 列の順序は指定した順番で表示される

### 問題1-3: WHERE句による条件指定

**解答:**
```sql
SELECT * FROM employees WHERE department_id = 10;
```

**解説:**
- WHERE句で条件を指定
- 等価条件は`=`を使用
- 数値の場合はクォートは不要

### 問題1-4: 複数条件の指定

**解答:**
```sql
SELECT * FROM employees
WHERE department_id = 10 AND salary >= 500000;
```

**解説:**
- AND演算子で複数条件を結合
- `>=`は「以上」を意味する比較演算子
- 両方の条件を満たす行のみが抽出される

### 問題1-5: 範囲指定

**解答:**
```sql
SELECT first_name, last_name, salary 
FROM employees 
WHERE salary >= 500000 AND salary <= 800000;
```

**別解（BETWEEN使用）:**
```sql
SELECT first_name, last_name, salary 
FROM employees 
WHERE salary BETWEEN 500000 AND 800000;
```

**解説:**
- BETWEEN演算子は範囲指定に便利
- BETWEENは境界値を含む（500000と800000も含まれる）

### 問題1-6: パターンマッチング

**解答:**
```sql
SELECT * FROM employees WHERE first_name LIKE '太%';
```

**解説:**
- LIKE演算子でパターンマッチング
- `%`は0文字以上の任意の文字列を表すワイルドカード
- `_`は1文字の任意の文字を表すワイルドカード

### 問題1-7: NULL値の検索

**解答:**
```sql
SELECT first_name, last_name, commission_pct 
FROM employees 
WHERE commission_pct IS NULL;
```

**解説:**
- NULL値の検索には`IS NULL`を使用
- `= NULL`は正しく動作しない
- `IS NOT NULL`でNULL以外を検索可能

### 問題1-8: ORDER BY句による並び替え

**解答:**
```sql
SELECT * FROM employees ORDER BY salary DESC;
```

**解説:**
- ORDER BY句で並び替え
- DESC（降順）、ASC（昇順、デフォルト）
- 給与の高い順に表示される

### 問題1-9: 複数列での並び替え

**解答:**
```sql
SELECT * FROM employees 
ORDER BY department_id ASC, salary DESC;
```

**解説:**
- 複数の列で並び替え可能
- 最初の列で並び替え後、同じ値の場合に次の列で並び替え
- 部署ID昇順、同じ部署内では給与降順

### 問題1-10: LIMIT句による件数制限

**解答:**
```sql
SELECT * FROM employees 
ORDER BY salary DESC 
LIMIT 5;
```

**解説:**
- LIMIT句で取得件数を制限
- ORDER BYと組み合わせて「上位N件」を取得
- パフォーマンス向上にも効果的

---

## セクション2: 集約関数 - 解答

### 問題2-1: COUNT関数

**解答:**
```sql
SELECT COUNT(*) FROM employees;
```

**解説:**
- COUNT(*)は全行数をカウント
- NULL値も含めてカウント
- 結果は1つの数値

### 問題2-2: COUNT関数（NULL値の扱い）

**解答:**
```sql
SELECT COUNT(commission_pct) FROM employees;
```

**解説:**
- COUNT(列名)はNULL値を除外してカウント
- COUNT(*)との違いを理解することが重要
- NULL値がある列では結果が異なる

### 問題2-3: SUM関数

**解答:**
```sql
SELECT SUM(salary) FROM employees;
```

**解説:**
- SUM関数で合計値を計算
- NULL値は計算から除外される
- 数値型の列にのみ使用可能

### 問題2-4: AVG関数

**解答:**
```sql
SELECT AVG(salary) FROM employees;
```

**解説:**
- AVG関数で平均値を計算
- NULL値は計算から除外される
- 結果は小数点を含む場合がある

### 問題2-5: MAX・MIN関数

**解答:**
```sql
SELECT MAX(salary), MIN(salary) FROM employees;
```

**解説:**
- 複数の集約関数を同時に使用可能
- MAX/MINは数値だけでなく文字列や日付にも使用可能
- NULL値は無視される

### 問題2-6: 条件付き集約

**解答:**
```sql
SELECT AVG(salary) FROM employees WHERE department_id = 10;
```

**解説:**
- WHERE句で条件を指定してから集約
- 特定の条件を満たすデータのみが集約対象
- 集約前にフィルタリングが実行される

### 問題2-7: 複数の集約関数

**解答:**
```sql
SELECT 
    COUNT(*) as employee_count,
    SUM(salary) as total_salary,
    AVG(salary) as avg_salary,
    MAX(salary) as max_salary,
    MIN(salary) as min_salary
FROM employees 
WHERE department_id = 20;
```

**解説:**
- 複数の集約関数を組み合わせて使用
- AS句で列に別名を付けることで可読性向上
- 1つのクエリで多角的な分析が可能

---

## セクション3: GROUP BY句とHAVING句 - 解答

### 問題3-1: 基本的なGROUP BY

**解答:**
```sql
SELECT department_id, COUNT(*) 
FROM employees 
GROUP BY department_id;
```

**解説:**
- GROUP BY句でグループ化
- SELECT句には集約関数またはGROUP BY句の列のみ指定可能
- 各部署の従業員数が表示される

### 問題3-2: GROUP BYと集約関数

**解答:**
```sql
SELECT department_id, AVG(salary) 
FROM employees 
GROUP BY department_id;
```

**解説:**
- 各グループ内で集約関数が実行される
- 部署ごとの平均給与が計算される
- NULL値は平均計算から除外される

### 問題3-3: 複数の集約関数とGROUP BY

**解答:**
```sql
SELECT 
    department_id,
    COUNT(*) as employee_count,
    SUM(salary) as total_salary,
    AVG(salary) as avg_salary
FROM employees 
GROUP BY department_id;
```

**解説:**
- 1つのクエリで複数の集約を実行
- 各部署の詳細な統計情報を取得
- 別名を使用して結果を分かりやすく表示

### 問題3-4: HAVING句による条件指定

**解答:**
```sql
SELECT department_id, COUNT(*) 
FROM employees 
GROUP BY department_id 
HAVING COUNT(*) >= 3;
```

**解説:**
- HAVING句は集約結果に対する条件指定
- WHERE句は行のフィルタ、HAVING句はグループのフィルタ
- 従業員数が3人以上の部署のみ表示

### 問題3-5: HAVING句と集約関数

**解答:**
```sql
SELECT department_id, AVG(salary) 
FROM employees 
GROUP BY department_id 
HAVING AVG(salary) >= 7000;
```

**解説:**
- 集約関数の結果に対する条件指定
- 平均給与が7000以上の部署のみ抽出
- 集約関数は2回計算される（SELECT句とHAVING句）

### 問題3-6: WHEREとHAVINGの組み合わせ

**解答:**
```sql
SELECT department_id, COUNT(*) 
FROM employees 
WHERE salary >= 500000 
GROUP BY department_id 
HAVING COUNT(*) >= 2;
```

**解説:**
- WHERE句で個別行をフィルタ後、GROUP BYでグループ化
- HAVING句でグループをフィルタ
- 実行順序：WHERE → GROUP BY → HAVING → SELECT

### 問題3-7: 複数列でのGROUP BY

**解答:**
```sql
SELECT job_title, COUNT(*), AVG(salary)
FROM employees
GROUP BY job_title;
```

**解説:**
- job_titleでグループ化
- 各職種の従業員数と平均給与を表示
- 職種別の分析が可能

---

## セクション4: 基本的な内部結合（INNER JOIN） - 解答

### 問題4-1: 基本的な結合

**解答:**
```sql
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;
```

**解説:**
- INNER JOINで2つのテーブルを結合
- ON句で結合条件を指定
- テーブルエイリアス（e, d）で記述を簡潔化

### 問題4-2: 結合と条件指定

**解答:**
```sql
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
WHERE d.department_name = 'IT';
```

**解説:**
- 結合後にWHERE句で条件指定
- 結合条件（ON句）と抽出条件（WHERE句）は別々に指定
- 営業部の従業員のみ抽出

### 問題4-3: 結合と並び替え

**解答:**
```sql
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
ORDER BY d.department_name;
```

**解説:**
- 結合結果をORDER BY句で並び替え
- 結合後の列を並び替えキーに使用可能
- 部署名のアルファベット順で表示

### 問題4-4: 3つのテーブルの結合

**解答:**
```sql
SELECT e.first_name, e.last_name, d.department_name, l.city
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;
```

**解説:**
- 複数のINNER JOINで3つのテーブルを結合
- 結合は段階的に実行される
- 従業員 → 部署 → 所在地の順で結合

### 問題4-5: 結合と集約

**解答:**
```sql
SELECT d.department_name, COUNT(*) as employee_count
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name;
```

**解説:**
- 結合後にGROUP BYで集約
- 部署名でグループ化して従業員数をカウント
- 結合により部署名を表示可能

### 問題4-6: 結合と条件付き集約

**解答:**
```sql
SELECT d.department_name, AVG(e.salary) as avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name
HAVING AVG(e.salary) >= 8000;
```

**解説:**
- 結合、集約、条件指定を組み合わせ
- 平均給与が8000以上の部署のみ表示
- 複合的なデータ分析の例

---

## セクション5: 基本的なデータ操作 - 解答

### 問題5-1: INSERT文（単一行）

**解答:**
```sql
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date, job_title, salary, department_id)
VALUES (200, 'Taro', 'Yamada', 'tyamada@company.com', '2022-04-01', 'エンジニア', 5500, 60);
```

**解説:**
- INSERT INTO句でテーブル名と列名を指定
- VALUES句で挿入する値を指定
- 列の順序と値の順序は一致させる必要がある
- 文字列と日付はシングルクォートで囲む

### 問題5-2: INSERT文（複数行）

**解答:**
```sql
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date, job_title, salary, department_id)
VALUES
    (201, 'Hanako', 'Sato', 'hsato@company.com', '2022-04-02', 'FI_ACCOUNT', 4500, 100),
    (202, 'Jiro', 'Suzuki', 'jsuzuki@company.com', '2022-04-03', 'IT_PROG', 500000, 60);
```

**解説:**
- 複数のVALUES句をカンマで区切って指定
- 1回のINSERT文で複数行を挿入可能
- パフォーマンス向上とトランザクション管理に有効

### 問題5-3: UPDATE文（単一行）

**解答:**
```sql
UPDATE employees 
SET salary = 6000 
WHERE employee_id = 200;
```

**解説:**
- UPDATE句でテーブル名を指定
- SET句で更新する列と値を指定
- WHERE句で更新対象の行を限定
- WHERE句を忘れると全行が更新されるので注意

### 問題5-4: UPDATE文（複数列）

**解答:**
```sql
UPDATE employees 
SET salary = 500000, department_id = 30 
WHERE employee_id = 201;
```

**解説:**
- SET句で複数の列を同時に更新
- 列名=値の組み合わせをカンマで区切る
- 1つのUPDATE文で複数列の更新が可能

### 問題5-5: UPDATE文（条件付き）

**解答:**
```sql
UPDATE employees 
SET salary = salary * 1.1
WHERE department_id = 10;
```

**解説:**
- 既存の値を使用した計算による更新
- WHERE句で複数行を同時に更新
- 部署ID 60の全従業員の給与を10%増加

### 問題5-6: DELETE文（単一行）

**解答:**
```sql
DELETE FROM employees 
WHERE employee_id = 202;
```

**解説:**
- DELETE FROM句でテーブル名を指定
- WHERE句で削除対象の行を限定
- 指定した条件に合致する行が削除される

### 問題5-7: DELETE文（条件付き）

**解答:**
```sql
DELETE FROM employees 
WHERE department_id = 30 AND salary < 500000;
```

**解説:**
- 複数条件での削除
- AND演算子で条件を組み合わせ
- 条件に合致する全ての行が削除される

---

## セクション6: 応用問題 - 解答

### 問題6-1: 複合クエリ1

**解答:**
```sql
SELECT 
    d.department_name,
    COUNT(*) as employee_count,
    AVG(e.salary) as avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name
ORDER BY employee_count DESC;
```

**解説:**
- 結合、集約、並び替えを組み合わせ
- 従業員数の多い順に部署を表示
- 部署名、従業員数、平均給与を同時に表示

### 問題6-2: 複合クエリ2

**解答:**
```sql
SELECT e.first_name, e.last_name, e.salary, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
WHERE e.salary >= (SELECT AVG(salary) FROM employees);
```

**解説:**
- サブクエリを使用して全従業員の平均給与を計算
- メインクエリで平均以上の給与の従業員を抽出
- 結合により部署名も表示

### 問題6-3: 複合クエリ3

**解答:**
```sql
SELECT e.first_name, e.last_name, e.salary, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
WHERE (e.department_id, e.salary) IN (
    SELECT department_id, MAX(salary)
    FROM employees
    GROUP BY department_id
);
```

**解説:**
- サブクエリで各部署の最高給与を取得
- メインクエリで部署IDと給与の組み合わせで検索
- 各部署で最も給与が高い従業員を抽出

### 問題6-4: 複合クエリ4

**解答:**
```sql
SELECT e.first_name, e.last_name, e.salary
FROM employees e
WHERE e.department_id = 10
AND e.salary >= (
    SELECT AVG(salary)
    FROM employees
    WHERE department_id = 10
);
```

**解説:**
- 営業部（department_id = 10）の従業員に限定
- サブクエリでIT部署内の平均給与を計算
- 部署内平均以上の給与の従業員を抽出

### 問題6-5: 複合クエリ5

**解答:**
```sql
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id IN (
    SELECT department_id
    FROM employees
    GROUP BY department_id
    HAVING COUNT(*) >= 3
);
```

**解説:**
- サブクエリで従業員数が3人以上の部署を特定
- メインクエリでその部署に所属する従業員を抽出
- IN演算子でサブクエリの結果と照合

### 問題6-6: データ操作の組み合わせ

**解答:**
```sql
-- 1. 新しい部署を追加
INSERT INTO departments (department_id, department_name, location)
VALUES (120, 'Research', '東京');

-- 2. 新しい従業員を追加
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date, job_title, salary, department_id)
VALUES (203, 'Saburo', 'Tanaka', 'stanaka@company.com', '2022-04-04', 'エンジニア', 5800, 120);

-- 3. 従業員の給与を更新
UPDATE employees 
SET salary = 6200 
WHERE employee_id = 203;

-- 4. Research部署の統計を確認
SELECT 
    d.department_name,
    COUNT(*) as employee_count,
    AVG(e.salary) as avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
WHERE d.department_name = 'Research'
GROUP BY d.department_name;
```

**解説:**
- 複数のSQL文を順次実行
- INSERT、UPDATE、SELECTを組み合わせ
- データの追加から分析まで一連の流れを実行

---

## 学習ポイントまとめ

### 1. SQL文の基本構造
- SELECT文の基本構文と実行順序の理解
- WHERE句による条件指定の重要性
- ORDER BY句とLIMIT句の効果的な使用

### 2. 集約関数の特徴
- NULL値の扱いに注意（COUNT(*)とCOUNT(列名)の違い）
- GROUP BY句との組み合わせによるグループ別集計
- HAVING句による集約結果のフィルタリング

### 3. テーブル結合の理解
- INNER JOINの基本的な使用方法
- 結合条件（ON句）の正確な指定
- 複数テーブルの結合における順序の考慮

### 4. データ操作の注意点
- WHERE句を忘れた場合の影響範囲
- トランザクションの概念（複数の操作をまとめて実行）
- 外部キー制約による参照整合性の維持

### 5. パフォーマンスの考慮
- 必要な列のみを選択することの重要性
- インデックスを活用した効率的な検索
- 適切な結合順序による処理速度の向上

### 6. エラーの対処法
- 構文エラーの一般的なパターンと対処法
- 論理エラー（期待した結果が得られない）の分析方法
- デバッグのためのステップバイステップ実行

---

**次のステップ:**
1. test.mdで習熟度を確認
2. 実際のデータベース環境での実習
3. Level 2: Intermediate（中級レベル）への進級

**重要な注意事項:**
- 本番環境でのデータ操作は十分注意して実行する
- バックアップの取得を忘れずに行う
- 権限管理とセキュリティを常に意識する