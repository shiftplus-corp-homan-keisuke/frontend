# Level 2: Application - SQL中級練習問題 解答・解説

## 概要

このファイルには、[`practice.md`](./practice.md) の全練習問題に対する詳細な解答と解説が含まれています。各問題について、SQL文の構文説明、実行結果の予想、学習ポイント、よくある間違いとその対処法を提供しています。

## セクション1: 外部結合（OUTER JOIN）

### 問題1-1: 基本的な左外部結合

**問題:** 全従業員の情報と所属部署名を表示してください。部署未配属の従業員も含めて表示してください。

**解答:**
```sql
SELECT e.employee_id, e.first_name, e.last_name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

**解説:**
- LEFT JOINを使用することで、左側のテーブル（employees）の全ての行を保持
- 部署未配属の従業員の場合、department_nameはNULLとして表示される
- 内部結合（INNER JOIN）では部署未配属の従業員は結果に含まれない

**学習ポイント:**
- 外部結合の基本概念の理解
- NULL値の扱い方

### 問題1-2: 右外部結合の活用

**問題:** 全部署の情報と部署に所属する従業員数を表示してください。従業員がいない部署は0として表示してください。

**解答:**
```sql
SELECT d.department_id, d.department_name, COUNT(e.employee_id) as employee_count
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_id, d.department_name;
```

**解説:**
- RIGHT JOINを使用して全部署を保持
- COUNT(e.employee_id)により、従業員がいない部署は0がカウントされる
- COUNT(*)を使用すると、従業員がいない部署でも1がカウントされるので注意

**学習ポイント:**
- RIGHT JOINの使用場面
- 集約関数でのNULL値の扱い

### 問題1-3: 複数テーブルの外部結合

**問題:** 全従業員の情報（従業員ID、氏名、部署名、所在地）を表示してください。部署未配属の従業員も含めて表示してください。

**解答:**
```sql
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    d.department_name,
    d.location
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

**解説:**
- 複数のLEFT JOINを連鎖させて使用
- 最初のLEFT JOINで部署未配属の従業員を保持
- 2番目のLEFT JOINで所在地不明の部署も保持

**学習ポイント:**
- 複数テーブルの外部結合
- 結合の順序の重要性

### 問題1-4: 外部結合での条件指定

**問題:** 東京以外の所在地にある部署の従業員情報を表示してください。部署未配属の従業員も含めて表示してください。

**解答:**
```sql
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    d.department_name,
    d.location
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
WHERE d.location != '東京' OR d.location IS NULL OR d.department_id IS NULL;
```

**解説:**
- WHERE句で東京以外の条件を指定
- NULL値の従業員（部署未配属）も含めるためOR条件を使用
- IS NULLを使ってNULL値を明示的にチェック

**学習ポイント:**
- 外部結合でのWHERE句の使用
- NULL値の条件指定

### 問題1-5: 完全外部結合

**問題:** 従業員テーブルと部署テーブルの完全な対応関係を表示してください。

**解答:**
```sql
-- MySQL/SQLiteの場合（FULL OUTER JOINが未サポート）
SELECT e.first_name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
UNION
SELECT e.first_name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.department_id;

-- PostgreSQL/SQL Serverの場合
SELECT e.first_name, d.department_name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.department_id;
```

**解説:**
- FULL OUTER JOINが利用できない場合はUNIONで代替
- LEFT JOINとRIGHT JOINの結果を結合

**学習ポイント:**
- DBMS間の機能差異
- UNIONを使った代替手法

## セクション2: サブクエリと相関サブクエリ

### 問題2-1: 基本的なサブクエリ

**問題:** 全従業員の平均給与より高い給与を受け取っている従業員の情報を表示してください。

**解答:**
```sql
SELECT employee_id, first_name, last_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

**解説:**
- サブクエリで全従業員の平均給与を計算
- メインクエリでその値より大きい給与の従業員を抽出
- サブクエリは1回だけ実行される（非相関サブクエリ）

**学習ポイント:**
- 非相関サブクエリの基本構文
- 集約関数をサブクエリで使用

### 問題2-2: IN句でのサブクエリ

**問題:** 東京（Tokyo）にある部署に所属する従業員の情報を表示してください。

**解答:**
```sql
SELECT employee_id, first_name, last_name, department_id
FROM employees
WHERE department_id IN (
    SELECT d.department_id
    FROM departments d
    WHERE d.location = '東京'
);
```

**解説:**
- サブクエリで東京にある部署のIDを取得
- IN句でそれらの部署に所属する従業員を抽出
- 複数の値を返すサブクエリの例

**学習ポイント:**
- IN句でのサブクエリ使用
- 複数値を返すサブクエリ

### 問題2-3: EXISTS句でのサブクエリ

**問題:** 従業員が所属している部署のみを表示してください。

**解答:**
```sql
SELECT department_id, department_name
FROM departments d
WHERE EXISTS (
    SELECT 1
    FROM employees e
    WHERE e.department_id = d.department_id
);
```

**解説:**
- EXISTS句は存在チェックに使用
- サブクエリが1行以上返す場合にTRUEとなる
- SELECT 1は慣用的な書き方（何を選択しても結果は同じ）

**学習ポイント:**
- EXISTS句の使用方法
- 存在チェックの概念

### 問題2-4: 相関サブクエリ（基本）

**問題:** 各部署で最も給与が高い従業員の情報を表示してください。

**解答:**
```sql
SELECT e1.employee_id, e1.first_name, e1.last_name, e1.salary, e1.department_id
FROM employees e1
WHERE e1.salary = (
    SELECT MAX(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
```

**解説:**
- 外側のクエリの各行に対してサブクエリが実行される
- e1.department_idを参照することで相関が発生
- 各部署の最高給与と一致する従業員を抽出

**学習ポイント:**
- 相関サブクエリの概念
- パフォーマンスへの影響

### 問題2-5: 相関サブクエリ（応用）

**問題:** 自分の部署の平均給与より高い給与を受け取っている従業員の情報を表示してください。

**解答:**
```sql
SELECT e1.employee_id, e1.first_name, e1.last_name, e1.salary, e1.department_id
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
```

**解説:**
- 各従業員について、同じ部署の平均給与を計算
- その平均より高い給与の従業員のみを抽出
- 部署未配属の従業員は結果に含まれない

**学習ポイント:**
- 相関サブクエリでの集約関数使用
- NULL値の扱い

### 問題2-6: NOT EXISTS句の活用

**問題:** 従業員が一人もいない部署の情報を表示してください。

**解答:**
```sql
SELECT department_id, department_name
FROM departments d
WHERE NOT EXISTS (
    SELECT 1
    FROM employees e
    WHERE e.department_id = d.department_id
);
```

**解説:**
- NOT EXISTSで存在しないことをチェック
- 従業員テーブルに該当する部署IDが存在しない部署を抽出

**学習ポイント:**
- NOT EXISTSの使用方法
- 否定条件の表現

### 問題2-7: 複数列サブクエリ

**問題:** 各部署で最も給与が高い従業員と同じ給与・職種の組み合わせを持つ全従業員を表示してください。

**解答:**
```sql
SELECT employee_id, first_name, last_name, salary, job_title, department_id
FROM employees
WHERE (salary, job_title) IN (
    SELECT MAX(e2.salary), e2.job_title
    FROM employees e2
    GROUP BY e2.department_id, e2.job_title
    HAVING MAX(e2.salary) = (
        SELECT MAX(e3.salary)
        FROM employees e3
        WHERE e3.department_id = e2.department_id
    )
);
```

**解説:**
- 複数列をタプルとして比較
- 複雑な条件を満たすレコードを抽出
- ネストしたサブクエリの使用

**学習ポイント:**
- 複数列サブクエリの構文
- 複雑な条件の組み合わせ

### 問題2-8: サブクエリでの集約関数

**問題:** 各部署の従業員数が全社平均の従業員数より多い部署の情報を表示してください。

**解答:**
```sql
SELECT d.department_id, d.department_name, COUNT(e.employee_id) as employee_count
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name
HAVING COUNT(e.employee_id) > (
    SELECT AVG(dept_count.cnt)
    FROM (
        SELECT COUNT(e2.employee_id) as cnt
        FROM departments d2
        LEFT JOIN employees e2 ON d2.department_id = e2.department_id
        GROUP BY d2.department_id
    ) dept_count
);
```

**解説:**
- サブクエリで各部署の従業員数を計算し、その平均を求める
- HAVINGでグループ化後の条件を指定
- 複雑な集約条件の実装

**学習ポイント:**
- サブクエリでの複雑な集約
- HAVINGでのサブクエリ使用

## セクション3: CASE文とCOALESCE関数

### 問題3-1: 基本的なCASE文

**問題:** 従業員の給与を以下の基準で分類して表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    CASE 
        WHEN salary >= 10000 THEN '高給'
        WHEN salary >= 5000 THEN '中給'
        ELSE '低給'
    END as salary_level
FROM employees;
```

**解説:**
- CASE文で条件分岐を実装
- 上から順に条件を評価し、最初に一致した条件の値を返す
- ELSE句で全ての条件に一致しない場合の値を指定

**学習ポイント:**
- CASE文の基本構文
- 条件の評価順序

### 問題3-2: CASE文での複数条件

**問題:** 従業員の勤続年数を分類してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    hire_date,
    DATEDIFF(CURDATE(), hire_date) / 365 as years_of_service,
    CASE 
        WHEN DATEDIFF(CURDATE(), hire_date) / 365 >= 10 THEN 'ベテラン'
        WHEN DATEDIFF(CURDATE(), hire_date) / 365 >= 5 THEN '中堅'
        ELSE '新人'
    END as experience_level
FROM employees;
```

**解説:**
- DATEDIFF関数で日数差を計算し、365で割って年数を算出
- 計算結果をCASE文で分類
- 日付関数の使用例

**学習ポイント:**
- 日付計算とCASE文の組み合わせ
- 計算結果の分類

### 問題3-3: 集約関数でのCASE文

**問題:** 各部署の給与レベル別従業員数を表示してください。

**解答:**
```sql
SELECT 
    department_id,
    COUNT(*) as total_employees,
    SUM(CASE WHEN salary >= 700000 THEN 1 ELSE 0 END) as high_salary_count,
    SUM(CASE WHEN salary >= 5000 AND salary < 8000 THEN 1 ELSE 0 END) as mid_salary_count,
    SUM(CASE WHEN salary < 5000 THEN 1 ELSE 0 END) as low_salary_count
FROM employees
WHERE department_id IS NOT NULL
GROUP BY department_id;
```

**解説:**
- SUMとCASEを組み合わせて条件別カウント
- 各条件に一致する場合は1、そうでなければ0を加算
- 条件別集計の効率的な実装方法

**学習ポイント:**
- 集約関数とCASE文の組み合わせ
- 条件別集計のテクニック

### 問題3-4: CASE文での条件別集計

**問題:** 各部署の給与統計を表示してください。

**解答:**
```sql
SELECT 
    d.department_name,
    AVG(e.salary) as avg_salary,
    MAX(e.salary) as max_salary,
    MIN(e.salary) as min_salary,
    CONCAT(MIN(e.salary), ' - ', MAX(e.salary)) as salary_range
FROM employees e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_id, d.department_name;
```

**解説:**
- 基本的な集約関数（AVG、MAX、MIN）を使用
- CONCAT関数で文字列を結合して範囲を表示
- JOINで部署名を取得

**学習ポイント:**
- 複数の集約関数の同時使用
- 文字列結合関数の活用

### 問題3-5: COALESCE関数の基本

**問題:** 従業員の連絡先情報を優先順位で表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    COALESCE(phone_number, email, '連絡先なし') as contact_info
FROM employees;
```

**解説:**
- COALESCEは最初のNULL以外の値を返す
- 複数の列から優先順位に従って値を選択
- NULL値の効果的な処理方法

**学習ポイント:**
- COALESCE関数の使用方法
- NULL値の代替処理

### 問題3-6: COALESCE関数での計算

**問題:** 従業員の総収入を計算してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    commission_pct,
    salary + (salary * COALESCE(commission_pct, 0)) as total_income
FROM employees;
```

**解説:**
- COALESCEでNULLのコミッション率を0に置換
- 給与にコミッション額を加算して総収入を計算
- NULL値を含む計算の安全な実装

**学習ポイント:**
- 計算でのNULL値処理
- COALESCE関数の実用的な使用例

### 問題3-7: CASE文とCOALESCEの組み合わせ

**問題:** 従業員の給与情報を詳細に表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary as base_salary,
    CASE 
        WHEN commission_pct IS NULL THEN 'なし'
        ELSE CONCAT(commission_pct * 100, '%')
    END as commission,
    salary + (salary * COALESCE(commission_pct, 0)) as total_income,
    CASE 
        WHEN salary + (salary * COALESCE(commission_pct, 0)) >= 10000 THEN '高'
        WHEN salary + (salary * COALESCE(commission_pct, 0)) >= 5000 THEN '中'
        ELSE '低'
    END as income_level
FROM employees;
```

**解説:**
- CASE文とCOALESCEを組み合わせて複雑な条件処理
- NULL値の表示制御とデフォルト値設定
- 計算結果の分類

**学習ポイント:**
- 複数の条件処理関数の組み合わせ
- 複雑なビジネスロジックの実装

## セクション4: ウィンドウ関数の基礎

### 問題4-1: ROW_NUMBER関数

**問題:** 全従業員を給与の高い順に連番を付けて表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as salary_rank
FROM employees;
```

**解説:**
- ROW_NUMBER()で一意の連番を生成
- ORDER BYで並び順を指定
- 同じ給与でも異なる番号が付与される

**学習ポイント:**
- ウィンドウ関数の基本構文
- ROW_NUMBER関数の特徴

### 問題4-2: 部署別ROW_NUMBER

**問題:** 各部署内で給与の高い順に連番を付けて表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    department_id,
    salary,
    ROW_NUMBER() OVER (
        PARTITION BY department_id 
        ORDER BY salary DESC
    ) as dept_salary_rank
FROM employees
WHERE department_id IS NOT NULL;
```

**解説:**
- PARTITION BYで部署ごとにグループ化
- 各部署内で独立して連番を付与
- NULL値の部署は除外

**学習ポイント:**
- PARTITION BYの使用方法
- グループ内でのランキング

### 問題4-3: RANK関数

**問題:** 全従業員の給与ランキングを表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    RANK() OVER (ORDER BY salary DESC) as salary_rank
FROM employees;
```

**解説:**
- RANK()は同順位を考慮したランキング
- 同じ給与の従業員は同じ順位
- 次の順位は同順位の人数分スキップされる

**学習ポイント:**
- RANKとROW_NUMBERの違い
- 同順位の処理方法

### 問題4-4: DENSE_RANK関数

**問題:** 全従業員の給与ランキングを密なランキングで表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_salary_rank
FROM employees;
```

**解説:**
- DENSE_RANK()は密なランキング
- 同順位があっても次の順位は連続
- 順位の飛びがない

**学習ポイント:**
- DENSE_RANKの特徴
- RANKとDENSE_RANKの使い分け

### 問題4-5: 部署別ランキング

**問題:** 各部署内での給与ランキングを表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    department_id,
    salary,
    RANK() OVER (
        PARTITION BY department_id 
        ORDER BY salary DESC
    ) as dept_salary_rank
FROM employees
WHERE department_id IS NOT NULL;
```

**解説:**
- 部署ごとに独立したランキング
- 各部署で1位から開始
- 部署間での順位比較は不可

**学習ポイント:**
- パーティション内でのランキング
- グループ別分析の実装

### 問題4-6: 累積合計

**問題:** 従業員IDの昇順で給与の累積合計を表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    SUM(salary) OVER (ORDER BY employee_id) as cumulative_salary
FROM employees;
```

**解説:**
- SUM()をウィンドウ関数として使用
- ORDER BYで累積の順序を指定
- 各行までの累積合計を計算

**学習ポイント:**
- 集約関数のウィンドウ関数としての使用
- 累積計算の実装

### 問題4-7: 移動平均

**問題:** 従業員IDの昇順で、前後2人を含む5人の給与移動平均を表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    AVG(salary) OVER (
        ORDER BY employee_id 
        ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING
    ) as moving_avg_salary
FROM employees;
```

**解説:**
- ROWS BETWEENでウィンドウの範囲を指定
- PRECEDINGは前の行、FOLLOWINGは後の行
- 境界では利用可能な行のみで計算

**学習ポイント:**
- ウィンドウフレームの指定
- 移動平均の計算方法

### 問題4-8: パーセンタイル

**問題:** 各従業員の給与が全体の何パーセンタイルに位置するかを表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    PERCENT_RANK() OVER (ORDER BY salary) * 100 as salary_percentile
FROM employees;
```

**解説:**
- PERCENT_RANK()で相対的な位置を計算
- 0から1の値を返すので100を掛けてパーセント表示
- 分布内での位置を把握

**学習ポイント:**
- パーセンタイル関数の使用
- 相対的な位置の計算

### 問題4-9: 前後の値参照

**問題:** 各従業員について、給与順で前の人と次の人の給与を表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    LAG(salary) OVER (ORDER BY salary) as prev_salary,
    LEAD(salary) OVER (ORDER BY salary) as next_salary
FROM employees;
```

**解説:**
- LAG()で前の行の値を取得
- LEAD()で次の行の値を取得
- 境界では NULL が返される

**学習ポイント:**
- LAG/LEAD関数の使用
- 行間での値の比較

### 問題4-10: 部署別統計

**問題:** 各従業員について、所属部署の給与統計を併せて表示してください。

**解答:**
```sql
SELECT 
    employee_id,
    first_name,
    last_name,
    department_id,
    salary,
    AVG(salary) OVER (PARTITION BY department_id) as dept_avg_salary,
    MAX(salary) OVER (PARTITION BY department_id) as dept_max_salary,
    MIN(salary) OVER (PARTITION BY department_id) as dept_min_salary
FROM employees
WHERE department_id IS NOT NULL;
```

**解説:**
- PARTITION BYで部署ごとの統計を計算
- 各従業員の行に部署統計を併記
- GROUP BYを使わずに詳細と集約を同時表示

**学習ポイント:**
- パーティション内での集約
- 詳細データと統計の同時表示

## セクション5: ビューの作成と活用

### 問題5-1: 基本的なビュー作成

**問題:** 従業員の詳細情報を表示するビューを作成してください。

**解答:**
```sql
CREATE VIEW employee_details AS
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.email,
    e.hire_date,
    e.salary,
    d.department_name,
    l.city,
    l.country_id
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

**解説:**
- CREATE VIEW文でビューを作成
- 複数テーブルを結合した複雑なクエリを簡素化
- LEFT JOINで全従業員を保持

**学習ポイント:**
- ビューの基本的な作成方法
- 複雑なクエリの簡素化

### 問題5-2: 集約ビューの作成

**問題:** 部署別の統計情報を表示するビューを作成してください。

**解答:**
```sql
CREATE VIEW department_statistics AS
SELECT 
    d.department_id,
    d.department_name,
    COUNT(e.employee_id) as employee_count,
    AVG(e.salary) as avg_salary,
    MAX(e.salary) as max_salary,
    MIN(e.salary) as min_salary
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name;
```

**解説:**
- 集約関数を使用したビュー
- GROUP BYで部署ごとに集計
- 統計情報の再利用が可能

**学習ポイント:**
- 集約ビューの作成
- 統計情報の効率的な管理

### 問題5-3: 条件付きビューの作成

**問題:** 給与が8000以上の高給取り従業員のみを表示するビューを作成してください。

**解答:**
```sql
CREATE VIEW high_salary_employees AS
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    department_id
FROM employees
WHERE salary >= 700000;
```

**解説:**
- WHERE句で条件を指定
- 特定の条件を満たすデータのみを表示
- データのフィルタリングを自
動化

**学習ポイント:**
- 条件付きビューの作成
- データフィルタリングの自動化

### 問題5-4: 複雑なビューの作成

**問題:** 各従業員の給与ランキング情報を含むビューを作成してください。

**解答:**
```sql
CREATE VIEW employee_salary_ranking AS
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.salary,
    e.department_id,
    RANK() OVER (ORDER BY e.salary DESC) as overall_rank,
    RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) as dept_rank
FROM employees e
WHERE e.department_id IS NOT NULL;
```

**解説:**
- ウィンドウ関数を使用したビュー
- 全体ランキングと部署内ランキングを同時表示
- 複雑な分析クエリの簡素化

**学習ポイント:**
- ウィンドウ関数を含むビューの作成
- 複雑な分析の再利用

### 問題5-5: ビューの更新

**問題:** 問題5-1で作成したビューを更新して、職種情報も含むようにしてください。

**解答:**
```sql
CREATE OR REPLACE VIEW employee_details AS
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.email,
    e.hire_date,
    e.salary,
    d.department_name,
    j.job_title,
    l.city,
    l.country_id
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id

```

**解説:**
- CREATE OR REPLACEでビューを更新
- 新しい列を結合に追加
- 既存のビューを安全に更新

**学習ポイント:**
- ビューの更新方法
- 段階的なビューの改善

### 問題5-6: ビューを使った分析

**問題:** 作成したビューを使って、東京にある部署の従業員の平均給与を求めてください。

**解答:**
```sql
SELECT AVG(salary) as tokyo_avg_salary
FROM employee_details
WHERE city = 'Tokyo';
```

**解説:**
- ビューを通常のテーブルのように使用
- 複雑な結合処理が隠蔽される
- 分析クエリの簡素化

**学習ポイント:**
- ビューの実用的な活用
- 複雑性の隠蔽効果

## セクション6: 制約（Constraints）

### 問題6-1: PRIMARY KEY制約

**問題:** 新しいテーブル「projects」を作成し、適切なPRIMARY KEY制約を設定してください。

**解答:**
```sql
CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2)
);
```

**解説:**
- PRIMARY KEY制約でテーブル作成時に指定
- 一意性と非NULL制約が自動的に適用
- テーブルの主キーを明確に定義

**学習ポイント:**
- PRIMARY KEY制約の基本
- テーブル設計での主キーの重要性

### 問題6-2: FOREIGN KEY制約

**問題:** 「projects」テーブルに従業員IDの外部キー制約を追加してください。

**解答:**
```sql
ALTER TABLE projects 
ADD COLUMN manager_id INT,
ADD CONSTRAINT fk_project_manager 
FOREIGN KEY (manager_id) REFERENCES employees(employee_id);
```

**解説:**
- ALTER TABLEで既存テーブルに列と制約を追加
- FOREIGN KEY制約で参照整合性を保証
- 制約に名前を付けて管理しやすくする

**学習ポイント:**
- FOREIGN KEY制約の実装
- 参照整合性の重要性

### 問題6-3: CHECK制約

**問題:** 従業員テーブルに給与の範囲制約を追加してください。

**解答:**
```sql
ALTER TABLE employees 
ADD CONSTRAINT chk_salary_range 
CHECK (salary >= 1000 AND salary <= 100000);
```

**解説:**
- CHECK制約でデータの妥当性を保証
- 範囲チェックの実装
- ビジネスルールの強制

**学習ポイント:**
- CHECK制約の使用方法
- データ品質の保証

### 問題6-4: UNIQUE制約

**問題:** 従業員テーブルのメールアドレスに一意制約を追加してください。

**解答:**
```sql
ALTER TABLE employees 
ADD CONSTRAINT uk_employee_email 
UNIQUE (email);
```

**解説:**
- UNIQUE制約で重複を防止
- NULL値は複数許可される（DBMSによる）
- 一意性の保証

**学習ポイント:**
- UNIQUE制約の特徴
- 重複防止の実装

### 問題6-5: NOT NULL制約

**問題:** 従業員テーブルの姓にNOT NULL制約を追加してください。

**解答:**
```sql
ALTER TABLE employees 
MODIFY COLUMN last_name VARCHAR(50) NOT NULL;
```

**解説:**
- MODIFYで既存列の制約を変更
- NOT NULL制約で必須項目を指定
- データの完全性を保証

**学習ポイント:**
- NOT NULL制約の追加方法
- 必須データの保証

### 問題6-6: 複合制約

**問題:** 職歴テーブルに、同一従業員の職歴期間が重複しないようなCHECK制約を追加してください。

**解答:**
```sql
-- 複雑な制約のため、トリガーまたはアプリケーションレベルでの制御が推奨
-- 簡単な例として給与の妥当性チェック
ALTER TABLE employees
ADD CONSTRAINT chk_salary_range
CHECK (salary > 0 AND salary <= 1000000);
```

**解説:**
- 複雑な制約はCHECK制約だけでは限界がある
- 給与の妥当性など基本的なチェックは可能
- 複雑なビジネスルールはトリガーやアプリケーションで実装

**学習ポイント:**
- 制約の限界と代替手段
- 複雑なビジネスルールの実装方法

## セクション7: インデックスの基本

### 問題7-1: 単一列インデックス

**問題:** 従業員テーブルの姓にインデックスを作成してください。

**解答:**
```sql
CREATE INDEX idx_employee_last_name ON employees(last_name);
```

**解説:**
- CREATE INDEXで単一列インデックスを作成
- 検索性能の向上が期待できる
- インデックス名は分かりやすく命名

**学習ポイント:**
- インデックスの基本的な作成方法
- 命名規則の重要性

### 問題7-2: 複合インデックス

**問題:** 従業員テーブルの部署ID・給与の組み合わせにインデックスを作成してください。

**解答:**
```sql
CREATE INDEX idx_employee_dept_salary ON employees(department_id, salary);
```

**解説:**
- 複数列を組み合わせたインデックス
- 列の順序が重要（選択性の高い列を先に）
- 複合条件での検索性能向上

**学習ポイント:**
- 複合インデックスの設計
- 列順序の重要性

### 問題7-3: 一意インデックス

**問題:** 従業員テーブルのメールアドレスに一意インデックスを作成してください。

**解答:**
```sql
CREATE UNIQUE INDEX idx_employee_email_unique ON employees(email);
```

**解説:**
- UNIQUE INDEXで一意性と性能を同時に保証
- UNIQUE制約と似た効果
- NULL値の扱いに注意

**学習ポイント:**
- 一意インデックスの特徴
- 制約との使い分け

### 問題7-4: インデックスの効果確認

**問題:** 作成したインデックスが効果的に使用されるクエリを作成してください。

**解答:**
```sql
-- 姓でのインデックス使用
SELECT * FROM employees WHERE last_name = 'Smith';

-- 複合インデックス使用
SELECT * FROM employees 
WHERE department_id = 10 AND salary > 500000;

-- 一意インデックス使用
SELECT * FROM employees WHERE email = 'john.doe@company.com';

-- 実行計画の確認（MySQL例）
EXPLAIN SELECT * FROM employees WHERE last_name = 'Smith';
```

**解説:**
- インデックスが効果的に使用される条件
- EXPLAINで実行計画を確認
- インデックスの効果測定

**学習ポイント:**
- インデックスの効果的な使用方法
- 実行計画の読み方

## セクション8: 応用問題

### 問題8-1: 複合的な分析クエリ

**問題:** 各部署について、詳細な情報を1つのクエリで取得してください。

**解答:**
```sql
SELECT 
    d.department_name,
    l.city,
    COUNT(e.employee_id) as employee_count,
    AVG(e.salary) as avg_salary,
    CONCAT(max_emp.first_name, ' ', max_emp.last_name) as highest_paid_employee,
    CONCAT(min_emp.first_name, ' ', min_emp.last_name) as lowest_paid_employee
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
LEFT JOIN employees max_emp ON d.department_id = max_emp.department_id 
    AND max_emp.salary = (
        SELECT MAX(salary) FROM employees 
        WHERE department_id = d.department_id
    )
LEFT JOIN employees min_emp ON d.department_id = min_emp.department_id 
    AND min_emp.salary = (
        SELECT MIN(salary) FROM employees 
        WHERE department_id = d.department_id
    )
GROUP BY d.department_id, d.department_name, l.city, 
         max_emp.first_name, max_emp.last_name,
         min_emp.first_name, min_emp.last_name;
```

**解説:**
- 複数の結合と相関サブクエリを組み合わせ
- 集約関数と詳細情報を同時取得
- 複雑なビジネス要件の実装

**学習ポイント:**
- 複雑なクエリの構築方法
- 複数技術の組み合わせ

### 問題8-2: 階層データの処理

**問題:** 従業員の管理階層を表示してください。

**解答:**
```sql
-- 再帰CTEを使用（PostgreSQL、SQL Server等）
WITH RECURSIVE employee_hierarchy AS (
    -- ベースケース：最上位管理者
    SELECT 
        employee_id,
        first_name,
        last_name,
        manager_id,
        0 as level,
        CAST(first_name + ' ' + last_name AS VARCHAR(1000)) as hierarchy_path
    FROM employees 
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- 再帰ケース：部下
    SELECT 
        e.employee_id,
        e.first_name,
        e.last_name,
        e.manager_id,
        eh.level + 1,
        CAST(eh.hierarchy_path + ' -> ' + e.first_name + ' ' + e.last_name AS VARCHAR(1000))
    FROM employees e
    INNER JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id
)
SELECT * FROM employee_hierarchy ORDER BY level, hierarchy_path;
```

**解説:**
- 再帰CTEで階層構造を処理
- レベルと階層パスを計算
- 組織図の表現

**学習ポイント:**
- 再帰クエリの使用方法
- 階層データの処理技術

### 問題8-3: 時系列分析

**問題:** 各年の新入社員数の推移を表示してください。

**解答:**
```sql
SELECT 
    YEAR(hire_date) as hire_year,
    COUNT(*) as new_employees,
    SUM(COUNT(*)) OVER (ORDER BY YEAR(hire_date)) as cumulative_employees
FROM employees
GROUP BY YEAR(hire_date)
ORDER BY hire_year;
```

**解説:**
- YEAR関数で年を抽出
- ウィンドウ関数で累積計算
- 時系列データの分析

**学習ポイント:**
- 時系列データの集計
- 累積計算の実装

### 問題8-4: 複雑な条件での抽出

**問題:** 複数の条件を満たす従業員を抽出してください。

**解答:**
```sql
WITH salary_rankings AS (
    SELECT 
        employee_id,
        salary,
        department_id,
        hire_date,
        RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as dept_rank,
        PERCENT_RANK() OVER (ORDER BY salary DESC) as overall_percentile
    FROM employees
    WHERE department_id IS NOT NULL
)
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.salary,
    e.department_id,
    sr.dept_rank,
    sr.overall_percentile
FROM employees e
JOIN salary_rankings sr ON e.employee_id = sr.employee_id
WHERE sr.dept_rank <= 3
  AND sr.overall_percentile <= 0.5
  AND DATEDIFF(CURDATE(), e.hire_date) / 365 >= 5;
```

**解説:**
- CTEで中間結果を整理
- 複数の条件を組み合わせ
- ランキングとパーセンタイルの活用

**学習ポイント:**
- 複雑な条件の組み合わせ
- CTEの効果的な使用

### 問題8-5: データ品質チェック

**問題:** データ品質問題を検出するクエリを作成してください。

**解答:**
```sql
-- 存在しない部署に所属する従業員
SELECT 'Invalid Department' as issue_type, 
       employee_id, first_name, last_name, department_id
FROM employees e
WHERE department_id IS NOT NULL 
  AND NOT EXISTS (
      SELECT 1 FROM departments d 
      WHERE d.department_id = e.department_id
  )

UNION ALL

-- 存在しない上司を持つ従業員
SELECT 'Invalid Manager' as issue_type,
       employee_id, first_name, last_name, manager_id
FROM employees e
WHERE manager_id IS NOT NULL 
  AND NOT EXISTS (
      SELECT 1 FROM employees m 
      WHERE m.employee_id = e.manager_id
  )

UNION ALL

-- 職種の給与範囲外の従業員
SELECT 'Salary Out of Range' as issue_type,
       e.employee_id, e.first_name, e.last_name, e.salary
FROM employees e
WHERE e.salary < 0 OR e.salary > 900000;
```

**解説:**
- UNIONで複数の品質チェックを統合
- NOT EXISTSで参照整合性をチェック
- 範囲チェックでデータの妥当性を確認

**学習ポイント:**
- データ品質管理の重要性
- 複数チェックの統合方法

---

**総合学習ポイント:**

1. **外部結合の理解**: NULL値の扱いと結果の解釈が重要
2. **サブクエリの最適化**: 相関サブクエリのパフォーマンス影響を考慮
3. **ウィンドウ関数の活用**: 詳細データと集約データの同時表示
4. **ビューの設計**: 複雑なクエリの再利用と保守性向上
5. **制約の実装**: データ品質と整合性の保証
6. **インデックス設計**: 検索性能とメンテナンスコストのバランス
7. **複雑なクエリの構築**: 複数技術の組み合わせによる高度な分析

**よくある間違いと対処法:**

1. **外部結合でのWHERE句**: NULL値を考慮した条件指定
2. **相関サブクエリの性能**: 可能な限りJOINやウィンドウ関数で代替
3. **ウィンドウ関数の範囲指定**: ROWS/RANGEの違いを理解
4. **ビューの更新可能性**: 複雑なビューは読み取り専用
5. **制約の設計**: 過度な制約はパフォーマンスに影響
6. **インデックスの過剰作成**: 更新性能への影響を考慮

**次のステップ:**
- 実際のデータベースでの実行と検証
- パフォーマンス測定と最適化
- より高度なSQL技術（Level 3: Advanced）への進級準備