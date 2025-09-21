# データベーススペシャリスト試験 SQL学習教材
## Level 3: Mastery（上級レベル）- 理論学習

## 概要

このファイルでは、データベーススペシャリスト試験の上級レベルに対応したSQL理論を学習します。中級レベルの知識を前提として、実務レベルの高度な技術を習得することを目標とします。

## 学習目標

- 高度なウィンドウ関数の理解と実装
- 再帰クエリによる階層データ処理
- 共通テーブル式（CTE）の高度な活用
- ストアドプロシージャとファンクションの設計・実装
- トリガーとイベント処理による自動化
- トランザクション制御とACID特性の理解
- 高度なパフォーマンス最適化技術
- 実行計画の分析と最適化
- データベース設計の実践

---

## セクション1: 高度なウィンドウ関数

**高度なウィンドウ関数とは、LAG、LEAD、FIRST_VALUE、LAST_VALUE、NTILEなどの前後行参照や範囲指定を行う関数です。**

### 概要
基本的なウィンドウ関数（ROW_NUMBER、RANK、DENSE_RANK）を理解している前提で、より高度なウィンドウ関数を学習します。

### 学習目標
- LAG、LEAD関数による前後行参照
- FIRST_VALUE、LAST_VALUE関数による範囲内の値取得
- NTILE関数による分位数計算
- フレーム句（ROWS、RANGE）の理解と活用

### 理論解説

#### LAG・LEAD関数

**LAG関数とは前の行の値を取得する関数で、LEAD関数とは次の行の値を取得する関数です。**
```sql
-- LAG: 前の行の値を取得
LAG(column_name, offset, default_value) OVER (PARTITION BY ... ORDER BY ...)

-- LEAD: 次の行の値を取得
LEAD(column_name, offset, default_value) OVER (PARTITION BY ... ORDER BY ...)
```

**特徴:**
- offset: 何行前/後の値を取得するか（デフォルト: 1）
- default_value: 該当行が存在しない場合のデフォルト値
- 時系列データの前期比較、トレンド分析に有効

#### FIRST_VALUE・LAST_VALUE関数

**FIRST_VALUE関数とはウィンドウ内の最初の値を取得する関数で、LAST_VALUE関数とはウィンドウ内の最後の値を取得する関数です。**
```sql
-- FIRST_VALUE: ウィンドウ内の最初の値
FIRST_VALUE(column_name) OVER (PARTITION BY ... ORDER BY ... ROWS/RANGE ...)

-- LAST_VALUE: ウィンドウ内の最後の値
LAST_VALUE(column_name) OVER (PARTITION BY ... ORDER BY ... ROWS/RANGE ...)
```

**重要なポイント:**
- フレーム句の指定が重要（デフォルトは RANGE UNBOUNDED PRECEDING）
- LAST_VALUEは通常 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING を指定

#### NTILE関数

**NTILE関数とは、データを指定した数のグループに均等分割する関数です。**
```sql
-- NTILE: データを指定した数のグループに分割
NTILE(n) OVER (PARTITION BY ... ORDER BY ...)
```

**用途:**
- 四分位数、十分位数の計算
- データの均等分割
- パフォーマンス分析での分位数計算

#### フレーム句の詳細

**フレーム句とは、ウィンドウ関数で処理対象となる行の範囲を指定する句です。**
```sql
-- ROWS: 物理的な行数での範囲指定
ROWS BETWEEN start_point AND end_point

-- RANGE: 論理的な値での範囲指定
RANGE BETWEEN start_point AND end_point
```

**フレーム境界の指定:**
- UNBOUNDED PRECEDING: パーティションの開始
- UNBOUNDED FOLLOWING: パーティションの終了
- CURRENT ROW: 現在行
- n PRECEDING: n行前
- n FOLLOWING: n行後

### 実践例

#### 例1: 売上の前月比較
```sql
WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        SUM(total_amount) as total_sales
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT 
    month,
    total_sales,
    LAG(total_sales, 1) OVER (ORDER BY month) as prev_month_sales,
    total_sales - LAG(total_sales, 1) OVER (ORDER BY month) as sales_diff,
    ROUND(
        (total_sales - LAG(total_sales, 1) OVER (ORDER BY month)) * 100.0 / 
        LAG(total_sales, 1) OVER (ORDER BY month), 2
    ) as growth_rate_percent
FROM monthly_sales
ORDER BY month;
```

#### 例2: 移動平均の計算
```sql
SELECT 
    order_date,
    amount,
    AVG(total_amount) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7days,
    FIRST_VALUE(amount) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as first_in_window,
    LAST_VALUE(amount) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as last_in_window
FROM orders
ORDER BY order_date;
```

#### 例3: 顧客の売上分位数
```sql
SELECT 
    customer_id,
    total_sales,
    NTILE(4) OVER (ORDER BY total_sales DESC) as quartile,
    NTILE(10) OVER (ORDER BY total_sales DESC) as decile
FROM (
    SELECT 
        customer_id,
        SUM(total_amount) as total_sales
    FROM orders
    GROUP BY customer_id
) customer_sales
ORDER BY total_sales DESC;
```

### 試験ポイント
1. **LAG/LEAD関数の適切な使用場面**
2. **フレーム句の正確な理解**
3. **FIRST_VALUE/LAST_VALUEでのフレーム指定の重要性**
4. **NTILE関数による分位数計算**
5. **パフォーマンスを考慮したウィンドウ関数の使用**

### 確認問題
1. LAG関数で3行前の値を取得し、該当行がない場合は0を返すSQL文を書いてください。
2. 移動平均を計算する際のROWSとRANGEの違いを説明してください。
3. LAST_VALUE関数で正しく最後の値を取得するためのフレーム句を書いてください。

---

## セクション2: 再帰クエリ（WITH RECURSIVE）

**再帰クエリとは、WITH RECURSIVE句を使用して階層データや連続データを処理するクエリです。**

### 概要
階層データや連続データの処理に使用される再帰クエリについて学習します。

### 学習目標
- WITH RECURSIVE構文の理解
- 再帰クエリの動作原理
- 階層データの処理方法
- 無限ループの防止方法

### 理論解説

#### WITH RECURSIVE構文

**WITH RECURSIVE構文とは、再帰的にデータを処理するための共通テーブル式の構文です。**
```sql
WITH RECURSIVE cte_name (column_list) AS (
    -- アンカー部分（初期値）
    SELECT ...
    
    UNION [ALL]
    
    -- 再帰部分
    SELECT ...
    FROM cte_name
    WHERE termination_condition
)
SELECT * FROM cte_name;
```

**構成要素:**
1. **アンカー部分**: 再帰の開始点となる初期データ
2. **再帰部分**: 前回の結果を使用して次の結果を生成
3. **終了条件**: 無限ループを防ぐための条件

#### 動作原理

**再帰クエリの動作原理とは、アンカー部分で初期データを作成し、再帰部分で段階的にデータを拡張していく仕組みです。**
1. アンカー部分を実行して初期結果セットを作成
2. 再帰部分を実行して新しい行を生成
3. 新しい行がなくなるまで2を繰り返し
4. 全ての結果を結合して最終結果を返す

### 実践例

#### 例1: 組織階層の表示
```sql
-- 組織テーブル
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(100),
    parent_dept_id INT,
    manager_name VARCHAR(100)
);

-- 階層構造の取得
WITH RECURSIVE dept_hierarchy AS (
    -- アンカー部分: ルート部門（parent_dept_id IS NULL）
    SELECT 
        dept_id,
        dept_name,
        parent_dept_id,
        manager_name,
        0 as level,
        CAST(dept_name AS VARCHAR(1000)) as path
    FROM departments
    WHERE parent_dept_id IS NULL
    
    UNION ALL
    
    -- 再帰部分: 子部門を取得
    SELECT 
        d.dept_id,
        d.dept_name,
        d.parent_dept_id,
        d.manager_name,
        dh.level + 1,
        CAST(dh.path || ' > ' || d.dept_name AS VARCHAR(1000))
    FROM departments d
    INNER JOIN dept_hierarchy dh ON d.parent_dept_id = dh.dept_id
    WHERE dh.level < 10  -- 無限ループ防止
)
SELECT 
    REPEAT('  ', level) || dept_name as hierarchy_display,
    level,
    path,
    manager_name
FROM dept_hierarchy
ORDER BY path;
```

#### 例2: 連続する日付の生成
```sql
WITH RECURSIVE date_series AS (
    -- アンカー部分: 開始日
    SELECT DATE '2022-01-01' as date_value
    
    UNION ALL
    
    -- 再帰部分: 次の日を生成
    SELECT date_value + INTERVAL '1 day'
    FROM date_series
    WHERE date_value < DATE '2022-12-31'
)
SELECT 
    date_value,
    EXTRACT(DOW FROM date_value) as day_of_week,
    CASE EXTRACT(DOW FROM date_value)
        WHEN 0 THEN '日曜日'
        WHEN 1 THEN '月曜日'
        WHEN 2 THEN '火曜日'
        WHEN 3 THEN '水曜日'
        WHEN 4 THEN '木曜日'
        WHEN 5 THEN '金曜日'
        WHEN 6 THEN '土曜日'
    END as day_name
FROM date_series
ORDER BY date_value;
```

#### 例3: グラフの経路探索
```sql
-- グラフのエッジテーブル
CREATE TABLE graph_edges (
    from_node VARCHAR(10),
    to_node VARCHAR(10),
    weight INT
);

-- 特定ノードから到達可能な全ノードを探索
WITH RECURSIVE path_finder AS (
    -- アンカー部分: 開始ノード
    SELECT 
        from_node,
        to_node,
        weight,
        ARRAY[from_node, to_node] as path,
        weight as total_weight
    FROM graph_edges
    WHERE from_node = 'A'
    
    UNION ALL
    
    -- 再帰部分: 次のノードへの経路
    SELECT 
        pf.from_node,
        ge.to_node,
        ge.weight,
        pf.path || ge.to_node,
        pf.total_weight + ge.weight
    FROM path_finder pf
    INNER JOIN graph_edges ge ON pf.to_node = ge.from_node
    WHERE NOT (ge.to_node = ANY(pf.path))  -- 循環防止
      AND array_length(pf.path, 1) < 10    -- 深度制限
)
SELECT 
    from_node,
    to_node,
    array_to_string(path, ' -> ') as full_path,
    total_weight
FROM path_finder
ORDER BY total_weight;
```

### 試験ポイント
1. **WITH RECURSIVE構文の正確な記述**
2. **アンカー部分と再帰部分の役割理解**
3. **無限ループ防止の重要性**
4. **階層データの処理方法**
5. **再帰クエリのパフォーマンス考慮**

### 確認問題
1. 従業員テーブルで上司-部下関係を表現する再帰クエリを書いてください。
2. 再帰クエリで無限ループを防ぐ方法を3つ挙げてください。
3. フィボナッチ数列を生成する再帰クエリを書いてください。

---

## セクション3: 共通テーブル式（CTE）の高度な活用

**共通テーブル式（CTE）とは、WITH句を使用して一時的な結果セットを定義し、複雑なクエリを段階的に構築する方法です。**

### 概要
WITH句を使用した共通テーブル式の高度な活用方法を学習します。

### 学習目標
- 複数CTEの連鎖使用
- CTEを使用した複雑なデータ変換
- パフォーマンスを考慮したCTE設計
- CTEとサブクエリの使い分け

### 理論解説

#### 複数CTEの連鎖

**複数CTEの連鎖とは、複数の共通テーブル式を順次定義し、前のCTEの結果を次のCTEで利用する方法です。**
```sql
WITH 
cte1 AS (
    SELECT ...
),
cte2 AS (
    SELECT ...
    FROM cte1
    WHERE ...
),
cte3 AS (
    SELECT ...
    FROM cte1 c1
    INNER JOIN cte2 c2 ON ...
)
SELECT * FROM cte3;
```

#### CTEの特徴
- **可読性**: 複雑なクエリを段階的に構築
- **再利用性**: 同一クエリ内で複数回参照可能
- **保守性**: ロジックの分離により保守が容易

### 実践例

#### 例1: 売上分析の段階的処理
```sql
WITH 
-- ステップ1: 基本集計
monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        product_category,
        SUM(total_amount) as total_sales,
        COUNT(*) as order_count,
        AVG(total_amount) as avg_order_value
    FROM orders o
    INNER JOIN products p ON o.product_id = p.product_id
    GROUP BY DATE_TRUNC('month', order_date), product_category
),

-- ステップ2: 前月比計算
sales_with_comparison AS (
    SELECT 
        *,
        LAG(total_sales, 1) OVER (
            PARTITION BY product_category 
            ORDER BY month
        ) as prev_month_sales,
        LAG(order_count, 1) OVER (
            PARTITION BY product_category 
            ORDER BY month
        ) as prev_month_orders
    FROM monthly_sales
),

-- ステップ3: 成長率計算
sales_with_growth AS (
    SELECT 
        *,
        CASE 
            WHEN prev_month_sales > 0 THEN
                ROUND((total_sales - prev_month_sales) * 100.0 / prev_month_sales, 2)
            ELSE NULL
        END as sales_growth_rate,
        CASE 
            WHEN prev_month_orders > 0 THEN
                ROUND((order_count - prev_month_orders) * 100.0 / prev_month_orders, 2)
            ELSE NULL
        END as order_growth_rate
    FROM sales_with_comparison
),

-- ステップ4: カテゴリ別ランキング
final_analysis AS (
    SELECT 
        *,
        RANK() OVER (PARTITION BY month ORDER BY total_sales DESC) as sales_rank,
        RANK() OVER (PARTITION BY month ORDER BY sales_growth_rate DESC) as growth_rank
    FROM sales_with_growth
)

SELECT 
    month,
    product_category,
    total_sales,
    sales_growth_rate,
    sales_rank,
    growth_rank,
    CASE 
        WHEN sales_rank <= 3 THEN 'Top Performer'
        WHEN growth_rank <= 3 THEN 'Fast Growing'
        ELSE 'Standard'
    END as category_status
FROM final_analysis
WHERE month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
ORDER BY month DESC, sales_rank;
```

#### 例2: 顧客セグメンテーション
```sql
WITH 
-- ステップ1: 顧客別基本指標
customer_metrics AS (
    SELECT 
        customer_id,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_spent,
        AVG(total_amount) as avg_order_value,
        MAX(order_date) as last_order_date,
        MIN(order_date) as first_order_date,
        EXTRACT(DAYS FROM MAX(order_date) - MIN(order_date)) as customer_lifespan_days
    FROM orders
    WHERE order_date >= CURRENT_DATE - INTERVAL '2 years'
    GROUP BY customer_id
),

-- ステップ2: RFM分析の基準値計算
rfm_quartiles AS (
    SELECT 
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY EXTRACT(DAYS FROM CURRENT_DATE - last_order_date)) as recency_q1,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY EXTRACT(DAYS FROM CURRENT_DATE - last_order_date)) as recency_q2,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY EXTRACT(DAYS FROM CURRENT_DATE - last_order_date)) as recency_q3,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_orders) as frequency_q1,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY total_orders) as frequency_q2,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_orders) as frequency_q3,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_spent) as monetary_q1,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY total_spent) as monetary_q2,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_spent) as monetary_q3
    FROM customer_metrics
),

-- ステップ3: RFMスコア計算
customer_rfm AS (
    SELECT 
        cm.*,
        EXTRACT(DAYS FROM CURRENT_DATE - last_order_date) as recency_days,
        CASE 
            WHEN EXTRACT(DAYS FROM CURRENT_DATE - last_order_date) <= rq.recency_q1 THEN 4
            WHEN EXTRACT(DAYS FROM CURRENT_DATE - last_order_date) <= rq.recency_q2 THEN 3
            WHEN EXTRACT(DAYS FROM CURRENT_DATE - last_order_date) <= rq.recency_q3 THEN 2
            ELSE 1
        END as recency_score,
        CASE 
            WHEN total_orders >= rq.frequency_q3 THEN 4
            WHEN total_orders >= rq.frequency_q2 THEN 3
            WHEN total_orders >= rq.frequency_q1 THEN 2
            ELSE 1
        END as frequency_score,
        CASE 
            WHEN total_spent >= rq.monetary_q3 THEN 4
            WHEN total_spent >= rq.monetary_q2 THEN 3
            WHEN total_spent >= rq.monetary_q1 THEN 2
            ELSE 1
        END as monetary_score
    FROM customer_metrics cm
    CROSS JOIN rfm_quartiles rq
),

-- ステップ4: 顧客セグメント分類
customer_segments AS (
    SELECT 
        *,
        CASE 
            WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Champions'
            WHEN recency_score >= 3 AND frequency_score >= 2 AND monetary_score >= 2 THEN 'Loyal Customers'
            WHEN recency_score >= 3 AND frequency_score <= 2 AND monetary_score <= 2 THEN 'New Customers'
            WHEN recency_score >= 2 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Potential Loyalists'
            WHEN recency_score >= 2 AND frequency_score >= 2 AND monetary_score >= 2 THEN 'Promising'
            WHEN recency_score <= 2 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'At Risk'
            WHEN recency_score <= 2 AND frequency_score >= 2 AND monetary_score >= 2 THEN 'Cannot Lose Them'
            WHEN recency_score <= 1 AND frequency_score >= 2 THEN 'Hibernating'
            ELSE 'Lost'
        END as customer_segment
    FROM customer_rfm
)

SELECT 
    customer_segment,
    COUNT(*) as customer_count,
    ROUND(AVG(total_spent), 2) as avg_total_spent,
    ROUND(AVG(total_orders), 2) as avg_total_orders,
    ROUND(AVG(recency_days), 1) as avg_recency_days,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as segment_percentage
FROM customer_segments
GROUP BY customer_segment
ORDER BY customer_count DESC;
```

### 試験ポイント
1. **複数CTEの効果的な連鎖使用**
2. **CTEとサブクエリの使い分け**
3. **パフォーマンスを考慮したCTE設計**
4. **複雑なビジネスロジックのCTEによる分解**
5. **CTEの可読性向上のための命名規則**

### 確認問題
1. CTEとサブクエリの違いとそれぞれの適用場面を説明してください。
2. 複数のCTEを使用して段階的にデータを変換する利点を3つ挙げてください。
3. CTEのパフォーマンスを向上させるための注意点を説明してください。

---

## セクション4: ストアドプロシージャとファンクション

**ストアドプロシージャとは、データベース内に保存された一連のSQL文をまとめた処理単位で、ファンクションとは値を返すプロシージャです。**

### 概要
データベース内でのプログラム処理を実現するストアドプロシージャとファンクションについて学習します。

### 学習目標
- ストアドプロシージャの作成と実行
- ファンクションの作成と活用
- 例外処理とエラーハンドリング
- パラメータの使用方法
- トランザクション制御

### 理論解説

#### ストアドプロシージャ（PostgreSQL例）

**ストアドプロシージャとは、データベースサーバー上で実行される一連の処理をまとめたプログラムです。**
```sql
CREATE OR REPLACE PROCEDURE procedure_name(
    parameter1 data_type,
    parameter2 data_type DEFAULT default_value,
    INOUT parameter3 data_type
)
LANGUAGE plpgsql
AS $$
DECLARE
    variable1 data_type;
    variable2 data_type := initial_value;
BEGIN
    -- プロシージャの処理
    
EXCEPTION
    WHEN exception_type THEN
        -- 例外処理
END;
$$;
```

#### ファンクション（PostgreSQL例）

**ファンクションとは、入力パラメータを受け取り、処理を実行して値を返すプログラムです。**
```sql
CREATE OR REPLACE FUNCTION function_name(
    parameter1 data_type,
    parameter2 data_type DEFAULT default_value
)
RETURNS return_type
LANGUAGE plpgsql
AS $$
DECLARE
    variable1 data_type;
BEGIN
    -- ファンクションの処理
    RETURN result;
    
EXCEPTION
    WHEN exception_type THEN
        -- 例外処理
        RETURN default_value;
END;
$$;
```

### 実践例

#### 例1: 在庫管理プロシージャ
```sql
-- 在庫更新プロシージャ
CREATE OR REPLACE PROCEDURE update_inventory(
    p_product_id INT,
    p_quantity_change INT,
    p_operation_type VARCHAR(10), -- 'ADD' or 'SUBTRACT'
    p_reason VARCHAR(255) DEFAULT 'Manual adjustment'
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_stock INT;
    v_new_stock INT;
    v_min_stock INT;
BEGIN
    -- 現在の在庫数を取得
    SELECT stock_quantity, minimum_stock 
    INTO v_current_stock, v_min_stock
    FROM products 
    WHERE product_id = p_product_id;
    
    -- 商品が存在しない場合のエラー
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product ID % not found', p_product_id;
    END IF;
    
    -- 新しい在庫数を計算
    IF p_operation_type = 'ADD' THEN
        v_new_stock := v_current_stock + p_quantity_change;
    ELSIF p_operation_type = 'SUBTRACT' THEN
        v_new_stock := v_current_stock - p_quantity_change;
        
        -- 在庫不足チェック
        IF v_new_stock < 0 THEN
            RAISE EXCEPTION 'Insufficient stock. Current: %, Requested: %', 
                v_current_stock, p_quantity_change;
        END IF;
    ELSE
        RAISE EXCEPTION 'Invalid operation type: %', p_operation_type;
    END IF;
    
    -- 在庫を更新
    UPDATE products 
    SET stock_quantity = v_new_stock,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = p_product_id;
    
    -- 在庫履歴を記録
    INSERT INTO inventory_history (
        product_id, 
        old_quantity, 
        new_quantity, 
        change_amount, 
        operation_type, 
        reason, 
        created_at
    ) VALUES (
        p_product_id, 
        v_current_stock, 
        v_new_stock, 
        p_quantity_change, 
        p_operation_type, 
        p_reason, 
        CURRENT_TIMESTAMP
    );
    
    -- 最小在庫を下回った場合の警告
    IF v_new_stock <= v_min_stock THEN
        INSERT INTO stock_alerts (
            product_id, 
            current_stock, 
            minimum_stock, 
            alert_type, 
            created_at
        ) VALUES (
            p_product_id, 
            v_new_stock, 
            v_min_stock, 
            'LOW_STOCK', 
            CURRENT_TIMESTAMP
        );
        
        RAISE NOTICE 'Warning: Product % stock is below minimum level. Current: %, Minimum: %', 
            p_product_id, v_new_stock, v_min_stock;
    END IF;
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE EXCEPTION 'Error updating inventory: %', SQLERRM;
END;
$$;

-- プロシージャの実行例
CALL update_inventory(101, 50, 'ADD', 'New shipment received');
CALL update_inventory(102, 10, 'SUBTRACT', 'Sale transaction');
```

#### 例2: 売上計算ファンクション
```sql
-- 期間別売上計算ファンクション
CREATE OR REPLACE FUNCTION calculate_sales_summary(
    p_start_date DATE,
    p_end_date DATE,
    p_product_category VARCHAR(100) DEFAULT NULL
)
RETURNS TABLE(
    total_sales DECIMAL(15,2),
    total_orders INT,
    avg_order_value DECIMAL(10,2),
    unique_customers INT,
    top_product_id INT,
    top_product_name VARCHAR(255),
    top_product_sales DECIMAL(15,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_category_filter VARCHAR(100);
BEGIN
    v_category_filter := p_product_category;
    
    RETURN QUERY
    WITH sales_data AS (
        SELECT 
            o.order_id,
            o.customer_id,
            o.total_amount,
            p.product_id,
            p.product_name,
            p.category
        FROM orders o
        INNER JOIN products p ON o.product_id = p.product_id
        WHERE o.order_date BETWEEN p_start_date AND p_end_date
          AND (v_category_filter IS NULL OR p.category = v_category_filter)
    ),
    summary_stats AS (
        SELECT 
            SUM(total_amount) as total_sales,
            COUNT(*) as total_orders,
            AVG(total_amount) as avg_order_value,
            COUNT(DISTINCT customer_id) as unique_customers
        FROM sales_data
    ),
    top_product AS (
        SELECT 
            product_id,
            product_name,
            SUM(total_amount) as product_sales
        FROM sales_data
        GROUP BY product_id, product_name
        ORDER BY SUM(total_amount) DESC
        LIMIT 1
    )
    SELECT 
        COALESCE(ss.total_sales, 0),
        COALESCE(ss.total_orders, 0),
        COALESCE(ss.avg_order_value, 0),
        COALESCE(ss.unique_customers, 0),
        COALESCE(tp.product_id, 0),
        COALESCE(tp.product_name, 'No sales'),
        COALESCE(tp.product_sales, 0)
    FROM summary_stats ss
    FULL OUTER JOIN top_product tp ON TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error calculating sales summary: %', SQLERRM;
END;
$$;

-- ファンクションの使用例
SELECT * FROM calculate_sales_summary('2022-01-01', '2022-12-31');
SELECT * FROM calculate_sales_summary('2022-01-01', '2022-12-31', 'Electronics');
```

#### 例3: 複雑なビジネスロジック処理
```sql
-- 顧客ランク更新プロシージャ
CREATE OR REPLACE PROCEDURE update_customer
_ranks()
LANGUAGE plpgsql
AS $$
DECLARE
    v_customer_record RECORD;
    v_total_spent DECIMAL(15,2);
    v_total_orders INT;
    v_avg_order_value DECIMAL(10,2);
    v_last_order_days INT;
    v_new_rank VARCHAR(20);
    v_old_rank VARCHAR(20);
BEGIN
    -- 全顧客を処理
    FOR v_customer_record IN 
        SELECT customer_id, current_rank 
        FROM customers 
        WHERE status = 'ACTIVE'
    LOOP
        -- 顧客の統計情報を計算
        SELECT 
            COALESCE(SUM(total_amount), 0),
            COUNT(*),
            COALESCE(AVG(total_amount), 0),
            COALESCE(EXTRACT(DAYS FROM CURRENT_DATE - MAX(order_date)), 999)
        INTO v_total_spent, v_total_orders, v_avg_order_value, v_last_order_days
        FROM orders 
        WHERE customer_id = v_customer_record.customer_id
          AND order_date >= CURRENT_DATE - INTERVAL '12 months';
        
        v_old_rank := v_customer_record.current_rank;
        
        -- ランク判定ロジック
        IF v_total_spent >= 100000 AND v_total_orders >= 50 AND v_last_order_days <= 30 THEN
            v_new_rank := 'PLATINUM';
        ELSIF v_total_spent >= 50000 AND v_total_orders >= 25 AND v_last_order_days <= 60 THEN
            v_new_rank := 'GOLD';
        ELSIF v_total_spent >= 20000 AND v_total_orders >= 10 AND v_last_order_days <= 90 THEN
            v_new_rank := 'SILVER';
        ELSIF v_total_orders >= 5 AND v_last_order_days <= 180 THEN
            v_new_rank := 'BRONZE';
        ELSE
            v_new_rank := 'STANDARD';
        END IF;
        
        -- ランクが変更された場合のみ更新
        IF v_new_rank != v_old_rank THEN
            UPDATE customers 
            SET current_rank = v_new_rank,
                rank_updated_at = CURRENT_TIMESTAMP
            WHERE customer_id = v_customer_record.customer_id;
            
            -- ランク変更履歴を記録
            INSERT INTO customer_rank_history (
                customer_id, 
                old_rank, 
                new_rank, 
                total_spent, 
                total_orders, 
                avg_order_value, 
                last_order_days, 
                changed_at
            ) VALUES (
                v_customer_record.customer_id, 
                v_old_rank, 
                v_new_rank, 
                v_total_spent, 
                v_total_orders, 
                v_avg_order_value, 
                v_last_order_days, 
                CURRENT_TIMESTAMP
            );
            
            RAISE NOTICE 'Customer % rank changed from % to %', 
                v_customer_record.customer_id, v_old_rank, v_new_rank;
        END IF;
    END LOOP;
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE EXCEPTION 'Error updating customer ranks: %', SQLERRM;
END;
$$;

-- プロシージャの実行
CALL update_customer_ranks();
```

### 試験ポイント
1. **ストアドプロシージャとファンクションの違い**
2. **適切な例外処理の実装**
3. **パラメータの使用方法（IN、OUT、INOUT）**
4. **トランザクション制御の重要性**
5. **パフォーマンスを考慮した設計**

### 確認問題
1. ストアドプロシージャとファンクションの主な違いを3つ挙げてください。
2. 例外処理でROLLBACKが重要な理由を説明してください。
3. INOUTパラメータの使用場面を具体例で説明してください。

---

## セクション5: トリガーとイベント処理

**トリガーとは、データベースの特定のイベント（INSERT、UPDATE、DELETE）が発生した際に自動的に実行されるプログラムです。**

### 概要
データベースの変更に自動的に反応するトリガーについて学習します。

### 学習目標
- トリガーの種類と動作タイミング
- トリガー関数の作成方法
- 監査ログの実装
- データ整合性の自動維持
- パフォーマンスへの影響

### 理論解説

#### トリガーの種類

**トリガーの種類とは、実行タイミングによって分類されるBEFOREトリガー、AFTERトリガー、INSTEAD OFトリガーです。**
1. **BEFORE トリガー**: データ変更前に実行
2. **AFTER トリガー**: データ変更後に実行
3. **INSTEAD OF トリガー**: ビューに対する操作の代替実行

#### トリガーイベント

**トリガーイベントとは、トリガーを起動するデータベース操作（INSERT、UPDATE、DELETE）です。**
- INSERT: 新規データ挿入時
- UPDATE: データ更新時
- DELETE: データ削除時

### 実践例

#### 例1: 監査ログトリガー
```sql
-- 監査ログテーブル
CREATE TABLE audit_log (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100),
    operation VARCHAR(10),
    old_values JSONB,
    new_values JSONB,
    user_name VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 監査ログトリガー関数
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, old_values, user_name)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), current_user);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, old_values, new_values, user_name)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), current_user);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, new_values, user_name)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), current_user);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

-- トリガーの作成
CREATE TRIGGER products_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER customers_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

#### 例2: 在庫自動更新トリガー
```sql
-- 注文時の在庫自動減算トリガー
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_stock INT;
    v_product_name VARCHAR(255);
BEGIN
    -- 現在の在庫数を取得
    SELECT stock_quantity, product_name 
    INTO v_current_stock, v_product_name
    FROM products 
    WHERE product_id = NEW.product_id;
    
    -- 在庫不足チェック
    IF v_current_stock < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %', 
            v_product_name, v_current_stock, NEW.quantity;
    END IF;
    
    -- 在庫を減算
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = NEW.product_id;
    
    -- 在庫履歴を記録
    INSERT INTO inventory_history (
        product_id, 
        old_quantity, 
        new_quantity, 
        change_amount, 
        operation_type, 
        reason, 
        order_id,
        created_at
    ) VALUES (
        NEW.product_id, 
        v_current_stock, 
        v_current_stock - NEW.quantity, 
        NEW.quantity, 
        'SUBTRACT', 
        'Order placed', 
        NEW.order_id,
        CURRENT_TIMESTAMP
    );
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER order_stock_update_trigger
    AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_stock_on_order();
```

#### 例3: データ整合性維持トリガー
```sql
-- 顧客統計自動更新トリガー
CREATE OR REPLACE FUNCTION update_customer_statistics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_customer_id INT;
    v_total_orders INT;
    v_total_spent DECIMAL(15,2);
    v_avg_order_value DECIMAL(10,2);
    v_last_order_date DATE;
BEGIN
    -- 影響を受ける顧客IDを特定
    IF TG_OP = 'DELETE' THEN
        v_customer_id := OLD.customer_id;
    ELSE
        v_customer_id := NEW.customer_id;
    END IF;
    
    -- 顧客統計を再計算
    SELECT 
        COUNT(*),
        COALESCE(SUM(total_amount), 0),
        COALESCE(AVG(total_amount), 0),
        MAX(order_date)
    INTO v_total_orders, v_total_spent, v_avg_order_value, v_last_order_date
    FROM orders 
    WHERE customer_id = v_customer_id;
    
    -- 顧客統計テーブルを更新
    INSERT INTO customer_statistics (
        customer_id, 
        total_orders, 
        total_spent, 
        avg_order_value, 
        last_order_date, 
        updated_at
    ) VALUES (
        v_customer_id, 
        v_total_orders, 
        v_total_spent, 
        v_avg_order_value, 
        v_last_order_date, 
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (customer_id) 
    DO UPDATE SET
        total_orders = EXCLUDED.total_orders,
        total_spent = EXCLUDED.total_spent,
        avg_order_value = EXCLUDED.avg_order_value,
        last_order_date = EXCLUDED.last_order_date,
        updated_at = EXCLUDED.updated_at;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

CREATE TRIGGER customer_statistics_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_customer_statistics();
```

### 試験ポイント
1. **トリガーの適切な使用場面**
2. **BEFORE vs AFTER トリガーの使い分け**
3. **トリガー関数でのエラーハンドリング**
4. **パフォーマンスへの影響の理解**
5. **トリガーの依存関係管理**

### 確認問題
1. BEFOREトリガーとAFTERトリガーの使い分けを説明してください。
2. トリガーがパフォーマンスに与える影響と対策を述べてください。
3. 監査ログトリガーの実装で注意すべき点を3つ挙げてください。

---

## セクション6: トランザクション制御とACID特性

**トランザクション制御とは、データベースの整合性を保つために複数の操作を一つの単位として管理する仕組みです。**

### 概要
データベースの整合性を保つトランザクション制御について学習します。

### 学習目標
- ACID特性の理解
- トランザクション分離レベル
- デッドロックの理解と対策
- 同時実行制御
- パフォーマンスとの兼ね合い

### 理論解説

#### ACID特性
1. **Atomicity（原子性）**: トランザクションは全て実行されるか、全て実行されないか
2. **Consistency（一貫性）**: データベースの整合性制約が維持される
3. **Isolation（分離性）**: 同時実行されるトランザクションが互いに影響しない
4. **Durability（永続性）**: コミットされたデータは永続的に保存される

#### トランザクション分離レベル
```sql
-- 分離レベルの設定
SET TRANSACTION ISOLATION LEVEL level;
```

1. **READ UNCOMMITTED**: 最も低い分離レベル
2. **READ COMMITTED**: コミットされたデータのみ読み取り
3. **REPEATABLE READ**: 同一トランザクション内で一貫した読み取り
4. **SERIALIZABLE**: 最も高い分離レベル

### 実践例

#### 例1: 銀行振込トランザクション
```sql
-- 銀行振込処理
CREATE OR REPLACE PROCEDURE transfer_money(
    p_from_account INT,
    p_to_account INT,
    p_amount DECIMAL(15,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_from_balance DECIMAL(15,2);
    v_to_balance DECIMAL(15,2);
    v_from_account_exists BOOLEAN;
    v_to_account_exists BOOLEAN;
BEGIN
    -- トランザクション開始
    BEGIN
        -- 分離レベルを設定
        SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
        
        -- 送金元口座の存在確認と残高取得（行ロック）
        SELECT balance INTO v_from_balance
        FROM accounts 
        WHERE account_id = p_from_account
        FOR UPDATE;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Source account % not found', p_from_account;
        END IF;
        
        -- 送金先口座の存在確認（行ロック）
        SELECT balance INTO v_to_balance
        FROM accounts 
        WHERE account_id = p_to_account
        FOR UPDATE;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Destination account % not found', p_to_account;
        END IF;
        
        -- 残高不足チェック
        IF v_from_balance < p_amount THEN
            RAISE EXCEPTION 'Insufficient balance. Available: %, Requested: %', 
                v_from_balance, p_amount;
        END IF;
        
        -- 送金額の妥当性チェック
        IF p_amount <= 0 THEN
            RAISE EXCEPTION 'Transfer amount must be positive';
        END IF;
        
        -- 送金元口座から減額
        UPDATE accounts 
        SET balance = balance - p_amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE account_id = p_from_account;
        
        -- 送金先口座に加算
        UPDATE accounts 
        SET balance = balance + p_amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE account_id = p_to_account;
        
        -- 取引履歴を記録
        INSERT INTO transactions (
            from_account_id, 
            to_account_id, 
            amount, 
            transaction_type, 
            status, 
            created_at
        ) VALUES (
            p_from_account, 
            p_to_account, 
            p_amount, 
            'TRANSFER', 
            'COMPLETED', 
            CURRENT_TIMESTAMP
        );
        
        -- トランザクションをコミット
        COMMIT;
        
        RAISE NOTICE 'Transfer completed: % from account % to account %', 
            p_amount, p_from_account, p_to_account;
            
    EXCEPTION
        WHEN OTHERS THEN
            -- エラー時はロールバック
            ROLLBACK;
            RAISE EXCEPTION 'Transfer failed: %', SQLERRM;
    END;
END;
$$;
```

#### 例2: 在庫管理での同時実行制御
```sql
-- 在庫引当処理（楽観的ロック）
CREATE OR REPLACE FUNCTION reserve_inventory_optimistic(
    p_product_id INT,
    p_quantity INT,
    p_order_id INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_stock INT;
    v_version INT;
    v_updated_rows INT;
BEGIN
    -- 現在の在庫と版数を取得
    SELECT stock_quantity, version 
    INTO v_current_stock, v_version
    FROM products 
    WHERE product_id = p_product_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product % not found', p_product_id;
    END IF;
    
    -- 在庫不足チェック
    IF v_current_stock < p_quantity THEN
        RETURN FALSE;
    END IF;
    
    -- 楽観的ロックによる更新
    UPDATE products 
    SET stock_quantity = stock_quantity - p_quantity,
        version = version + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = p_product_id 
      AND version = v_version;
    
    GET DIAGNOSTICS v_updated_rows = ROW_COUNT;
    
    -- 更新に失敗した場合（他のトランザクションが先に更新）
    IF v_updated_rows = 0 THEN
        RAISE EXCEPTION 'Inventory reservation failed due to concurrent update';
    END IF;
    
    -- 引当履歴を記録
    INSERT INTO inventory_reservations (
        product_id, 
        order_id, 
        quantity, 
        reserved_at
    ) VALUES (
        p_product_id, 
        p_order_id, 
        p_quantity, 
        CURRENT_TIMESTAMP
    );
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Inventory reservation error: %', SQLERRM;
END;
$$;

-- 悲観的ロック版
CREATE OR REPLACE FUNCTION reserve_inventory_pessimistic(
    p_product_id INT,
    p_quantity INT,
    p_order_id INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_stock INT;
BEGIN
    -- 悲観的ロックで在庫を取得
    SELECT stock_quantity 
    INTO v_current_stock
    FROM products 
    WHERE product_id = p_product_id
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product % not found', p_product_id;
    END IF;
    
    -- 在庫不足チェック
    IF v_current_stock < p_quantity THEN
        RETURN FALSE;
    END IF;
    
    -- 在庫を減算
    UPDATE products 
    SET stock_quantity = stock_quantity - p_quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = p_product_id;
    
    -- 引当履歴を記録
    INSERT INTO inventory_reservations (
        product_id, 
        order_id, 
        quantity, 
        reserved_at
    ) VALUES (
        p_product_id, 
        p_order_id, 
        p_quantity, 
        CURRENT_TIMESTAMP
    );
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Inventory reservation error: %', SQLERRM;
END;
$$;
```

#### 例3: デッドロック対策
```sql
-- デッドロック回避のための順序付きロック
CREATE OR REPLACE PROCEDURE update_multiple_accounts(
    p_account_ids INT[],
    p_amounts DECIMAL[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_account_id INT;
    v_amount DECIMAL(15,2);
    v_i INT;
    v_sorted_accounts INT[];
BEGIN
    -- アカウントIDを昇順でソート（デッドロック回避）
    SELECT ARRAY_AGG(unnest ORDER BY unnest) 
    INTO v_sorted_accounts
    FROM unnest(p_account_ids);
    
    BEGIN
        -- ソートされた順序でロックを取得
        FOR v_i IN 1..array_length(v_sorted_accounts, 1) LOOP
            v_account_id := v_sorted_accounts[v_i];
            
            -- 該当するアカウントをロック
            PERFORM 1 FROM accounts 
            WHERE account_id = v_account_id 
            FOR UPDATE;
        END LOOP;
        
        -- 実際の更新処理
        FOR v_i IN 1..array_length(p_account_ids, 1) LOOP
            v_account_id := p_account_ids[v_i];
            v_amount := p_amounts[v_i];
            
            UPDATE accounts 
            SET balance = balance + v_amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE account_id = v_account_id;
        END LOOP;
        
        COMMIT;
        
    EXCEPTION
        WHEN deadlock_detected THEN
            ROLLBACK;
            RAISE EXCEPTION 'Deadlock detected, transaction rolled back';
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
    END;
END;
$$;
```

### 試験ポイント
1. **ACID特性の具体的な理解**
2. **分離レベルの適切な選択**
3. **デッドロックの原因と対策**
4. **楽観的ロック vs 悲観的ロック**
5. **パフォーマンスとの兼ね合い**

### 確認問題
1. 各トランザクション分離レベルで発生する可能性のある問題を説明してください。
2. デッドロックを回避するための設計原則を3つ挙げてください。
3. 楽観的ロックと悲観的ロックの使い分けを説明してください。

---

## セクション7: 高度なパフォーマンス最適化

**高度なパフォーマンス最適化とは、実行計画の分析、インデックス戦略、クエリ最適化、パーティショニングなどを駆使してデータベースの性能を向上させる技術です。**

### 概要
実務レベルのパフォーマンス最適化技術について学習します。

### 学習目標
- 実行計画の詳細分析
- インデックス戦略の高度な設計
- クエリの最適化技法
- パーティショニング
- 統計情報の活用

### 理論解説

#### 実行計画の読み方

**実行計画の読み方とは、データベースがクエリをどのように実行するかを示す計画を分析し、ボトルネックを特定する技術です。**
```sql
-- 実行計画の表示
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) 
SELECT ...;

-- 詳細な実行計画
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT JSON) 
SELECT ...;
```

**重要な指標:**
- **Cost**: 推定実行コスト
- **Rows**: 推定行数
- **Width**: 推定行幅
- **Actual Time**: 実際の実行時間
- **Buffers**: バッファ使用量

#### インデックス戦略

**インデックス戦略とは、データの特性とクエリパターンに応じて最適なインデックスを設計・選択する手法です。**
1. **B-treeインデックス**: 一般的な検索・ソート
2. **ハッシュインデックス**: 等価検索
3. **GINインデックス**: 全文検索・配列
4. **GiSTインデックス**: 地理情報・範囲検索
5. **部分インデックス**: 条件付きインデックス
6. **複合インデックス**: 複数列のインデックス

### 実践例

#### 例1: 複合インデックスの最適化
```sql
-- 売上分析クエリの最適化
-- 元のクエリ（遅い）
SELECT 
    customer_id,
    SUM(total_amount) as total_sales,
    COUNT(*) as order_count
FROM orders 
WHERE order_date BETWEEN '2022-01-01' AND '2022-12-31'
  AND status = 'COMPLETED'
  AND amount >= 1000
GROUP BY customer_id
HAVING SUM(total_amount) >= 10000
ORDER BY total_sales DESC;

-- 最適化のためのインデックス作成
CREATE INDEX idx_orders_analysis ON orders (
    status,           -- 最も選択性の高い条件
    order_date,       -- 範囲検索
    amount,           -- 範囲検索
    customer_id       -- GROUP BY対象
) WHERE status = 'COMPLETED';  -- 部分インデックス

-- さらなる最適化：カバリングインデックス
CREATE INDEX idx_orders_covering ON orders (
    status, order_date, customer_id
) INCLUDE (amount)  -- PostgreSQL 11以降
WHERE status = 'COMPLETED';

-- 統計情報の更新
ANALYZE orders;
```

#### 例2: パーティショニング
```sql
-- 日付によるパーティショニング
CREATE TABLE orders_partitioned (
    order_id SERIAL,
    customer_id INT,
    order_date DATE,
    amount DECIMAL(10,2),
    status VARCHAR(20)
) PARTITION BY RANGE (order_date);

-- 月別パーティション作成
CREATE TABLE orders_2022_01 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2022-01-01') TO ('2022-02-01');

CREATE TABLE orders_2022_02 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2022-02-01') TO ('2022-03-01');

-- 自動パーティション作成関数
CREATE OR REPLACE FUNCTION create_monthly_partition(
    p_table_name TEXT,
    p_start_date DATE
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_partition_name TEXT;
    v_end_date DATE;
BEGIN
    v_end_date := p_start_date + INTERVAL '1 month';
    v_partition_name := p_table_name || '_' || to_char(p_start_date, 'YYYY_MM');
    
    EXECUTE format('
        CREATE TABLE %I PARTITION OF %I
        FOR VALUES FROM (%L) TO (%L)',
        v_partition_name, p_table_name, p_start_date, v_end_date
    );
    
    -- パーティション固有のインデックス作成
    EXECUTE format('
        CREATE INDEX %I ON %I (customer_id, order_date)',
        'idx_' || v_partition_name || '_customer_date',
        v_partition_name
    );
END;
$$;
```

#### 例3: クエリ最適化技法
```sql
-- 非効率なクエリの最適化例

-- 【悪い例】相関サブクエリ
SELECT 
    c.customer_id,
    c.contact_name,
    (SELECT SUM(total_amount) FROM orders o WHERE o.customer_id = c.customer_id) as total_sales
FROM customers c
WHERE (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) > 5;

-- 【良い例】JOINとウィンドウ関数
WITH customer_stats AS (
    SELECT 
        customer_id,
        SUM(total_amount) as total_sales,
        COUNT(*) as order_count
    FROM orders
    GROUP BY customer_id
    HAVING COUNT(*) > 5
)
SELECT 
    c.customer_id,
    c.contact_name,
    cs.total_sales
FROM customers c
INNER JOIN customer_stats cs ON c.customer_id = cs.customer_id;

-- 【悪い例】DISTINCT with ORDER BY
SELECT DISTINCT customer_id, contact_name
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
ORDER BY contact_name;

-- 【良い例】EXISTS
SELECT customer_id, contact_name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
)
ORDER BY contact_name;

-- 【悪い例】関数をWHERE句で使用
SELECT * FROM orders 
WHERE EXTRACT(YEAR FROM order_date) = 2022;

-- 【良い例】範囲検索
SELECT * FROM orders 
WHERE order_date >= '2024-01-01'
  AND order_date < '2024-12-31';
```

#### 例4: 統計情報とヒント
```sql
-- 統計情報の確認
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation,
    most_common_vals,
    most_common_freqs
FROM pg_stats 
WHERE tablename = 'orders';

-- 統計情報の手動更新
ANALYZE orders;

-- 特定列の統計情報詳細設定
ALTER TABLE orders ALTER COLUMN customer_id SET STATISTICS 1000;

-- クエリヒント（PostgreSQL拡張）
/*+ HashJoin(o c) */
SELECT /*+ USE_HASH(o c) */ 
    c.contact_name,
    SUM(o.total_amount)
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
GROUP BY c.contact_name;
```

### 試験ポイント
1. **実行計画の正確な読み方**
2. **インデックス設計の原則**
3. **パーティショニングの効果的な活用**
4. **クエリ最適化の具体的手法**
5. **統計情報の重要性**

### 確認問題
1. 複合インデックスの列順序を決める際の考慮事項を説明してください。
2. パーティショニングが有効な場面と注意点を述べてください。
3. 実行計画でボトルネックを特定する方法を説明してください。

---

## セクション8: データベース設計の実践

**データベース設計の実践とは、正規化、非正規化、制約設計、パフォーマンス設計を総合的に考慮した実務レベルの設計技法です。**

### 概要
実務レベルのデータベース設計技法について学習します。

### 学習目標
- 正規化と非正規化の適切な判断
- パフォーマンスを考慮した設計
- スケーラビリティの確保
- セキュリティ設計
- 運用・保守性の考慮

### 理論解説

#### 正規化の段階的適用
1. **第1正規形（1NF）**: 原子値の保証
2. **第2正規形（2NF）**: 部分関数従属の排除
3. **第3正規形（3NF）**: 推移関数従属の排除
4. **ボイス・コッド正規形（BCNF）**: より厳密な3NF
5. **第4正規形（4NF）**: 多値従属の排除
6. **第5正規形（5NF）**: 結合従属の排除

#### 非正規化の戦略
- **パフォーマンス向上**: 結合の削減
- **集計データの事前計算**: サマリテーブル
- **履歴データの保持**: 監査要件

### 実践例

#### 例1: ECサイトのデータベース設計
```sql
-- 正規化されたテーブル設計

-- 顧客テーブル
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 住所テーブル（1対多関係）
CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
    address_type VARCHAR(20) CHECK (address_type IN ('BILLING', 'SHIPPING', 'OTHER')),
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- カテゴリテーブル（階層構造）
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    parent_category_id INT REFERENCES categories(category_id),
    category_name VARCHAR(100) NOT NULL,
    category_path VARCHAR(500), -- 階層パス（例：/Electronics/Computers/Laptops）
    level INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品テーブル
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id),
    sku VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    cost_price DECIMAL(10,2) CHECK (cost_price >= 0),
    weight DECIMAL(8,3),
    dimensions JSONB, -- {"length": 10, "width": 5, "height": 3}
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    minimum_stock INT DEFAULT 0,
    maximum_stock INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品属性テーブル（EAV パターン）
CREATE TABLE product_attributes (
    attribute_id SERIAL PRIMARY KEY,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_type VARCHAR(20) CHECK (attribute_type IN ('TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'JSON')),
    is_required BOOLEAN DEFAULT FALSE,
    is_filterable BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

CREATE TABLE product_attribute_values (
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    attribute_id INT REFERENCES product_attributes(attribute_id) ON DELETE CASCADE,
    attribute_value TEXT,
    PRIMARY KEY (product_id, attribute_id)
);

-- 注文テーブル
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        order_status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED')
    ),
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED')
    ),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    billing_address JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    notes TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipped_date TIMESTAMP,
    delivered_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 注文明細テーブル
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(12,2) NOT NULL CHECK (total_price >= 0),
    product_snapshot JSONB, -- 注文時の商品情報のスナップショット
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- パフォーマンス向上のための非正規化テーブル
CREATE TABLE customer_statistics (
    customer_id INT PRIMARY KEY REFERENCES customers(customer_id) ON DELETE CASCADE,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    first_order_date DATE,
    last_order_date DATE,
    favorite_category_id INT REFERENCES categories(category_id),
    customer_rank VARCHAR(20) DEFAULT 'BRONZE',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス設計
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status) WHERE status = 'ACTIVE';
CREATE INDEX idx_addresses_customer ON addresses(customer_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- 制約とトリガー
ALTER TABLE orders ADD CONSTRAINT chk_total_calculation 
CHECK (total_amount = subtotal + tax_amount + shipping_amount - discount_amount);

-- 統計情報自動更新トリガー
CREATE OR REPLACE FUNCTION update_customer_stats_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- 顧客統計を更新
    INSERT INTO customer_statistics (
        customer_id,
        total_orders,
        total_spent,
        avg_order_value,
        first_order_date,
        last_order_date
    )
    SELECT 
        NEW.customer_id,
        COUNT(*),
        SUM(total_amount),
        AVG(total_amount),
        MIN(order_date::DATE),
        MAX(order_date::DATE)
    FROM orders 
    WHERE customer_id = NEW.customer_id
    ON CONFLICT (customer_id) DO UPDATE SET
        total_orders = EXCLUDED.total_orders,
        total_spent = EXCLUDED.total_spent,
        avg_order_value = EXCLUDED.avg_order_value,
        first_order_date = EXCLUDED.first_order_date,
        last_order_date = EXCLUDED.last_order_date,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER orders_stats_trigger
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_customer_stats_trigger();
```

### 試験ポイント
1. **正規化と非正規化の適切な判断**
2. **パフォーマンスを考慮したインデックス設計**
3. **制約による整合性保証**
4. **スケーラビリティを考慮した設計**
5. **セキュリティ要件の実装**

### 確認問題
1. 第3正規形と非正規化のトレードオフを説明してください。
2. EAVパターンの利点と欠点を述べてください。
3. 大規模システムでのパーティショニング戦略を説明してください。

---

## セクション9: データベーススペシャリスト試験対策

### 概要
データベーススペシャリスト試験の上級問題に対応するための実践的な対策を学習します。

### 学習目標
- 試験の出題傾向と対策
- 実践的な問題解決アプローチ
- 時間管理と解答戦略
- 頻出パターンの理解

### 試験対策のポイント

#### 午前II問題対策
1. **データベース理論**: 正規化、関数従属、ACID特性
2. **SQL応用**: 複雑な結合、サブクエリ、ウィンドウ関数
3. **パフォーマンス**: インデックス、実行計画、最適化
4. **設計手法**: ER図、データモデリング
5. **運用管理**: バックアップ、リカバリ、セキュリティ

#### 午後I問題対策
1. **データベース設計**: 要件分析からテーブル設計まで
2. **SQL記述**: 複雑なビジネスロジックのSQL化
3. **パフォーマンス分析**: ボトルネック特定と改善策
4. **障害対応**: 原因分析と復旧手順

#### 午後II問題対策
1. **総合的な設計能力**: システム全体の設計
2. **運用設計**: 監視、バックアップ、災害対策
3. **移行計画**: 既存システムからの移行戦略
4. **プロジェクト管理**: スケジュール、リスク管理

### 頻出問題パターン

#### パターン1: 複雑な集計・分析クエリ
```sql
-- 例題: 月別売上推移と前年同月比を求める
WITH monthly_sales AS (
    SELECT 
        EXTRACT(YEAR FROM order_date) as year,
        EXTRACT(MONTH FROM order_date) as month,
        SUM(total_amount) as monthly_total
    FROM orders
    WHERE order_status = 'COMPLETED'
    GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
),
sales_with_comparison AS (
    SELECT 
        year,
        month,
        monthly_total,
        LAG(monthly_total, 12) OVER (ORDER BY year, month) as prev_year_same_month
    FROM monthly_sales
)
SELECT 
    year,
    month,
    monthly_total,
    prev_year_same_month,
    CASE 
        WHEN prev_year_same_month IS NOT NULL AND prev_year_same_month > 0 THEN
            ROUND((monthly_total - prev_year_same_month) * 100.0 / prev_year_same_month, 2)
        ELSE NULL
    END as yoy_growth_rate
FROM sales_with_comparison
WHERE year >= 2022
ORDER BY year, month;
```

#### パターン2: 階層データの処理
```sql
-- 例題: 組織階層での部下一覧と階層レベル
WITH RECURSIVE employee_hierarchy AS (
    -- 管理者（上司がいない）
    SELECT 
        employee_id,
        CONCAT(first_name, ' ', last_name) as employee_name,
        manager_id,
        0 as level,
        ARRAY[employee_id] as path,
        CONCAT(first_name, ' ', last_name) as employee_name as hierarchy_path
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- 部下
    SELECT 
        e.employee_id,
        e.CONCAT(first_name, ' ', last_name) as employee_name,
        e.manager_id,
        eh.level + 1,
        eh.path || e.employee_id,
        eh.hierarchy_path || ' > ' || e.CONCAT(first_name, ' ', last_name) as employee_name
    FROM employees e
    INNER JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id
    WHERE NOT (e.employee_id = ANY(eh.path)) -- 循環参照防止
)
SELECT 
    employee_id,
    REPEAT('  ', level) || CONCAT(first_name, ' ', last_name) as employee_name as indented_name,
    level,
    hierarchy_path,
    array_length(path, 1) as hierarchy_depth
FROM employee_hierarchy
ORDER BY path;
```

#### パターン3: パフォーマンス最適化
```sql
-- 例題: 遅いクエリの最適化

-- 【最適化前】
SELECT 
    c.contact_name,
    COUNT(o.order_id) as order_count,
    SUM(o.total_amount) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.registration_date >= '2022-01-01'
  AND (o.order_date IS NULL OR o.order_date >= '2024-01-01')
GROUP BY c.customer_id, c.contact_name
HAVING COUNT(o.order_id) >= 2
ORDER BY total_spent DESC;

-- 【最適化後】
WITH active_customers AS (
    SELECT customer_id, contact_name
    FROM customers
    WHERE registration_date >= '2022-01-01'
),
customer_orders AS (
    SELECT 
        customer_id,
        COUNT(*) as order_count,
        SUM(total_amount) as total_spent
    FROM orders
    WHERE order_date >= '2024-01-01'
    GROUP BY customer_id
    HAVING COUNT(*) >= 5
)
SELECT 
    ac.contact_name,
    COALESCE(co.order_count, 0) as order_count,
    COALESCE(co.total_spent, 0) as total_spent
FROM active_customers ac
LEFT JOIN customer_orders co ON ac.customer_id = co.customer_id
ORDER BY co.total_spent DESC NULLS LAST;

-- 必要なインデックス
CREATE INDEX idx_customers_registration ON customers(registration_date);
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
```

### 解答戦略

#### 時間配分
- **午後I（90分）**: 問題選択5分、解答80分、見直し5分
- **午後II（120分）**: 問題選択10分、解答105分、見直し5分

#### 解答手順
1. **問題の全体把握**: 要求事項の整理
2. **段階的アプローチ**: 小問から順番に解答
3. **SQL記述のコツ**: 段階的にクエリを構築
4. **検証**: 結果の妥当性確認

### 実践演習

#### 演習1: データモデリング
```
【問題】
オンライン学習システムのデータベースを設計してください。
以下の要件を満たすテーブル構造を作成し、主要なSQLクエリを記述してください。

要件:
- 学習者、コース、レッスン、進捗管理
- 学習者は複数のコースを受講可能
- コースは複数のレッスンで構成
- 学習進捗の記録と分析
- 修了証明書の発行
```

#### 演習2: パフォーマンス分析
```
【問題】
以下のクエリが遅い原因を分析し、最適化案を提示してください。

SELECT 
    p.product_name,
    c.category_name,
    AVG(r.rating) as avg_rating,
    COUNT(r.review_id) as review_count
FROM products p
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN reviews r ON p.product_id = r.product_id
WHERE p.created_at >= '2022-01-01'
  AND r.created_at >= '2022-01-01'
GROUP BY p.product_id, p.product_name, c.category_name
HAVING COUNT(r.review_id) >= 10
ORDER BY avg_rating DESC;
```

### 試験ポイント
1. **複雑なSQL文の正確な記述**
2. **データベース設計の論理的思考**
3. **パフォーマンス問題の分析能力**
4. **実務的な運用設計**
5. **時間内での完答能力**

### 確認問題
1. ウィンドウ関数を使用した売上分析クエリを記述してください。
2. 再帰クエリによる階層データ処理の実装方法を説明してください。
3. インデックス設計でパフォーマンスを向上させる方法を述べてください。

---

## 総合まとめ

### Level 3で習得した技術
1. **高度なウィンドウ関数**: LAG、LEAD、FIRST_VALUE、LAST_VALUE、NTILE
2. **再帰クエリ**: WITH RECURSIVEによる階層データ処理
3. **共通テーブル式**: 複雑なクエリの段階的構築
4. **ストアドプロシージャ**: ビジネスロジックのデータベース実装
5. **トリガー**: 自動化とデータ整合性維持
6. **トランザクション制御**: ACID特性と同時実行制御
7. **パフォーマンス最適化**: 実行計画分析とインデックス戦略
8. **データベース設計**: 実務レベルの設計手法
9. **試験対策**: データベーススペシャリスト試験の実践的対策

### 実務での応用
- **大規模システム開発**: エンタープライズレベルのデータベース設計
- **データ分析基盤**: BI・DWHシステムの構築
- **パフォーマンスチューニング**: 高負荷システムの最適化
- **データベース管理**: 運用・保守・監視の実装
- **システム移行**: レガシーシステムからの移行設計

### 次のステップ
1. **実践プロジェクト**: 学習した技術の実際の適用
2. **専門分野の深化**: DBA、データエンジニア、アーキテクトへの特化
3. **最新技術の習得**: NoSQL、クラウドデータベース、分散システム
4. **資格取得**: データベーススペシャリスト試験合格
5. **コミュニティ参加**: 技術共有と継続的な学習

---

**Level 3: Mastery 完了おめでとうございます！** 🎉

あなたは今、実務レベルのSQL技術を習得し、データベーススペシャリスト試験に合格できる実力を身につけました。この知識を活かして、より高度なデータベースシステムの設計・開発・運用に挑戦してください。

継続的な学習と実践を通じて、データベースエキスパートとしてのキャリアを築いていきましょう！ 💪🚀⚡