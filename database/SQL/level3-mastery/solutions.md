# データベーススペシャリスト試験 SQL学習教材
## Level 3: Mastery（上級レベル）- 解答・解説

## 概要

このファイルでは、[`practice.md`](./practice.md)の全ての練習問題に対する詳細な解答と解説を提供します。単なる正解だけでなく、思考プロセス、代替解法、パフォーマンス考慮事項、よくある間違いについても説明します。

## 使用方法

1. **問題を先に解く**: まず自分で問題に取り組んでください
2. **解答確認**: 自分の解答と比較してください
3. **解説理解**: なぜその解法が最適なのかを理解してください
4. **実行検証**: 可能であれば実際のデータベースで実行してください

---

## セクション1: 高度なウィンドウ関数 - 解答

### 問題1-1: LAG関数による前期比較

**解答:**
```sql
WITH monthly_sales AS (
    SELECT 
        customer_id,
        DATE_TRUNC('month', sale_date) as sale_month,
        SUM(amount) as monthly_amount
    FROM sales
    GROUP BY customer_id, DATE_TRUNC('month', sale_date)
)
SELECT 
    customer_id,
    sale_month,
    monthly_amount,
    LAG(monthly_amount, 1) OVER (
        PARTITION BY customer_id 
        ORDER BY sale_month
    ) as prev_month_amount,
    CASE 
        WHEN LAG(monthly_amount, 1) OVER (
            PARTITION BY customer_id 
            ORDER BY sale_month
        ) IS NOT NULL AND LAG(monthly_amount, 1) OVER (
            PARTITION BY customer_id 
            ORDER BY sale_month
        ) > 0 THEN
            ROUND(
                (monthly_amount - LAG(monthly_amount, 1) OVER (
                    PARTITION BY customer_id 
                    ORDER BY sale_month
                )) * 100.0 / LAG(monthly_amount, 1) OVER (
                    PARTITION BY customer_id 
                    ORDER BY sale_month
                ), 2
            )
        ELSE NULL
    END as growth_rate_percent
FROM monthly_sales
ORDER BY customer_id, sale_month;
```

**解説:**
- **CTE使用**: 月別集計を先に行い、メインクエリを簡潔に
- **LAG関数**: `PARTITION BY customer_id`で顧客別に前月データを取得
- **成長率計算**: ゼロ除算とNULL値を適切に処理
- **ROUND関数**: 小数点以下2桁に丸める

**学習ポイント:**
- LAG関数のoffsetパラメータ（この場合は1）
- PARTITION BYによる適切なグループ化
- NULL値とゼロ除算の処理

### 問題1-2: LEAD関数による将来予測

**解答:**
```sql
WITH daily_product_sales AS (
    SELECT 
        product_id,
        sale_date,
        SUM(amount) as daily_amount
    FROM sales
    GROUP BY product_id, sale_date
)
SELECT 
    product_id,
    sale_date,
    daily_amount,
    LEAD(daily_amount, 1) OVER (
        PARTITION BY product_id 
        ORDER BY sale_date
    ) as next_day_amount,
    CASE 
        WHEN LEAD(daily_amount, 1) OVER (
            PARTITION BY product_id 
            ORDER BY sale_date
        ) < daily_amount THEN 'DOWN'
        ELSE NULL
    END as decrease_flag
FROM daily_product_sales
WHERE LEAD(daily_amount, 1) OVER (
    PARTITION BY product_id 
    ORDER BY sale_date
) IS NOT NULL
ORDER BY product_id, sale_date;
```

**解説:**
- **LEAD関数**: 翌日の売上データを取得
- **条件判定**: CASE文で売上減少を判定
- **NULL除外**: 翌日データがない最終日を除外

**代替解法:**
```sql
-- より効率的な書き方
SELECT 
    product_id,
    sale_date,
    daily_amount,
    next_day_amount,
    CASE WHEN next_day_amount < daily_amount THEN 'DOWN' END as decrease_flag
FROM (
    SELECT 
        product_id,
        sale_date,
        SUM(amount) as daily_amount,
        LEAD(SUM(amount), 1) OVER (
            PARTITION BY product_id 
            ORDER BY sale_date
        ) as next_day_amount
    FROM sales
    GROUP BY product_id, sale_date
) t
WHERE next_day_amount IS NOT NULL
ORDER BY product_id, sale_date;
```

### 問題1-3: FIRST_VALUE/LAST_VALUE関数

**解答:**
```sql
WITH monthly_regional_sales AS (
    SELECT 
        region,
        DATE_TRUNC('month', sale_date) as sale_month,
        sale_date,
        amount
    FROM sales
)
SELECT DISTINCT
    region,
    sale_month,
    FIRST_VALUE(sale_date) OVER (
        PARTITION BY region, sale_month 
        ORDER BY sale_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as first_sale_date,
    FIRST_VALUE(amount) OVER (
        PARTITION BY region, sale_month 
        ORDER BY sale_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as first_sale_amount,
    LAST_VALUE(sale_date) OVER (
        PARTITION BY region, sale_month 
        ORDER BY sale_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as last_sale_date,
    LAST_VALUE(amount) OVER (
        PARTITION BY region, sale_month 
        ORDER BY sale_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as last_sale_amount
FROM monthly_regional_sales
ORDER BY region, sale_month;
```

**解説:**
- **重要**: LAST_VALUEには`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`が必須
- **DISTINCT**: 重複行を除去
- **フレーム句**: ウィンドウの範囲を明示的に指定

**よくある間違い:**
```sql
-- ❌ 間違い: LAST_VALUEでフレーム句を省略
LAST_VALUE(amount) OVER (
    PARTITION BY region, sale_month 
    ORDER BY sale_date
) -- デフォルトは RANGE UNBOUNDED PRECEDING で現在行まで
```

### 問題1-4: NTILE関数による分位数分析

**解答:**
```sql
WITH customer_annual_sales AS (
    SELECT 
        customer_id,
        SUM(amount) as annual_sales
    FROM sales
    WHERE EXTRACT(YEAR FROM sale_date) = 2022
    GROUP BY customer_id
),
customer_quartiles AS (
    SELECT 
        customer_id,
        annual_sales,
        NTILE(4) OVER (ORDER BY annual_sales DESC) as quartile
    FROM customer_annual_sales
)
SELECT 
    quartile,
    COUNT(*) as customer_count,
    ROUND(AVG(annual_sales), 2) as avg_sales,
    MIN(annual_sales) as min_sales,
    MAX(annual_sales) as max_sales
FROM customer_quartiles
GROUP BY quartile
ORDER BY quartile;
```

**解説:**
- **NTILE(4)**: データを4つの等しいグループに分割
- **ORDER BY DESC**: 売上の高い順でランキング
- **集計**: 各四分位数の統計を計算

**パフォーマンス考慮:**
```sql
-- インデックス推奨
CREATE INDEX idx_sales_date_customer ON sales(sale_date, customer_id, amount);
```

### 問題1-5: 移動平均の計算

**解答:**
```sql
WITH daily_product_sales AS (
    SELECT 
        product_id,
        sale_date,
        SUM(amount) as daily_sales
    FROM sales
    GROUP BY product_id, sale_date
)
SELECT 
    product_id,
    sale_date,
    daily_sales,
    ROUND(
        AVG(daily_sales) OVER (
            PARTITION BY product_id 
            ORDER BY sale_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ), 2
    ) as moving_avg_7days
FROM daily_product_sales
ORDER BY product_id, sale_date;
```

**解説:**
- **ROWS BETWEEN 6 PRECEDING AND CURRENT ROW**: 過去6日+当日=7日間
- **AVG関数**: ウィンドウ内の平均を計算
- **データ不足時**: 7日未満でも利用可能なデータで計算

**代替解法（重み付き移動平均）:**
```sql
-- 指数移動平均の例
WITH daily_sales AS (
    SELECT 
        product_id,
        sale_date,
        SUM(amount) as daily_sales,
        ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY sale_date) as rn
    FROM sales
    GROUP BY product_id, sale_date
),
ema_calculation AS (
    SELECT 
        product_id,
        sale_date,
        daily_sales,
        CASE 
            WHEN rn = 1 THEN daily_sales
            ELSE daily_sales * 0.2 + LAG(daily_sales) OVER (
                PARTITION BY product_id ORDER BY sale_date
            ) * 0.8
        END as ema
    FROM daily_sales
)
SELECT * FROM ema_calculation;
```

---

## セクション2: 再帰クエリ（WITH RECURSIVE） - 解答

### 問題2-1: 基本的な階層表示

**解答:**
```sql
WITH RECURSIVE dept_hierarchy AS (
    -- アンカー部分: ルート部門
    SELECT 
        dept_id,
        dept_name,
        parent_dept_id,
        0 as level,
        CAST(dept_name AS VARCHAR(1000)) as hierarchy_path
    FROM departments
    WHERE parent_dept_id IS NULL
    
    UNION ALL
    
    -- 再帰部分: 子部門
    SELECT 
        d.dept_id,
        d.dept_name,
        d.parent_dept_id,
        dh.level + 1,
        CAST(dh.hierarchy_path || ' > ' || d.dept_name AS VARCHAR(1000))
    FROM departments d
    INNER JOIN dept_hierarchy dh ON d.parent_dept_id = dh.dept_id
    WHERE dh.level < 10  -- 無限ループ防止
)
SELECT 
    dept_id,
    REPEAT('  ', level) || dept_name as indented_name,
    level,
    hierarchy_path
FROM dept_hierarchy
ORDER BY hierarchy_path;
```

**解説:**
- **アンカー部分**: parent_dept_id IS NULLでルート部門を特定
- **再帰部分**: 親部門と結合して子部門を取得
- **無限ループ防止**: level < 10で深度制限
- **階層表示**: REPEATでインデント、hierarchy_pathで経路表示

**重要なポイント:**
- CAST関数でVARCHAR長を明示的に指定
- ORDER BYで階層順に表示
- 循環参照がある場合の対策が必要

### 問題2-2: 特定部門の配下組織

**解答:**
```sql
WITH RECURSIVE dept_subtree AS (
    -- アンカー部分: 指定部門
    SELECT 
        dept_id,
        dept_name,
        parent_dept_id,
        0 as level
    FROM departments
    WHERE dept_id = 10  -- 指定部門ID
    
    UNION ALL
    
    -- 再帰部分: 配下部門
    SELECT 
        d.dept_id,
        d.dept_name,
        d.parent_dept_id,
        ds.level + 1
    FROM departments d
    INNER JOIN dept_subtree ds ON d.parent_dept_id = ds.dept_id
    WHERE ds.level < 10
)
SELECT 
    dept_id,
    REPEAT('  ', level) || dept_name as indented_name,
    level
FROM dept_subtree
ORDER BY level, dept_name;
```

**解説:**
- **指定部門から開始**: WHERE dept_id = 10でスタート地点を指定
- **配下のみ取得**: 上位部門は含まない
- **レベル別表示**: 同レベル内は名前順でソート

**パラメータ化版:**
```sql
-- ストアドファンクションとして実装
CREATE OR REPLACE FUNCTION get_department_subtree(p_dept_id INT)
RETURNS TABLE(dept_id INT, dept_name VARCHAR, level INT) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE dept_subtree AS (
        SELECT d.dept_id, d.dept_name, d.parent_dept_id, 0 as level
        FROM departments d
        WHERE d.dept_id = p_dept_id
        
        UNION ALL
        
        SELECT d.dept_id, d.dept_name, d.parent_dept_id, ds.level + 1
        FROM departments d
        INNER JOIN dept_subtree ds ON d.parent_dept_id = ds.dept_id
        WHERE ds.level < 10
    )
    SELECT ds.dept_id, ds.dept_name, ds.level
    FROM dept_subtree ds
    ORDER BY ds.level, ds.dept_name;
END;
$$ LANGUAGE plpgsql;
```

### 問題2-3: 従業員の上司階層

**解答:**
```sql
WITH RECURSIVE manager_hierarchy AS (
    -- アンカー部分: 指定従業員
    SELECT 
        employee_id,
        employee_name,
        manager_id,
        0 as level
    FROM employees
    WHERE employee_id = 100  -- 指定従業員ID
    
    UNION ALL
    
    -- 再帰部分: 上司を辿る
    SELECT 
        e.employee_id,
        e.employee_name,
        e.manager_id,
        mh.level + 1
    FROM employees e
    INNER JOIN manager_hierarchy mh ON e.employee_id = mh.manager_id
    WHERE mh.level < 10
)
SELECT 
    employee_id,
    employee_name,
    level,
    CASE level
        WHEN 0 THEN '本人'
        WHEN 1 THEN '直属上司'
        ELSE level || '次上司'
    END as position_description
FROM manager_hierarchy
ORDER BY level;
```

**解説:**
- **上向きの階層**: manager_idを辿って上司を取得
- **レベル0**: 本人から開始
- **position_description**: 階層レベルを分かりやすく表示

### 問題2-4: 部下の総数計算

**解答:**
```sql
WITH RECURSIVE subordinate_count AS (
    -- 各従業員の直属部下
    SELECT 
        manager_id,
        employee_id,
        1 as depth
    FROM employees
    WHERE manager_id IS NOT NULL
    
    UNION ALL
    
    -- 間接部下（部下の部下）
    SELECT 
        sc.manager_id,
        e.employee_id,
        sc.depth + 1
    FROM employees e
    INNER JOIN subordinate_count sc ON e.manager_id = sc.employee_id
    WHERE sc.depth < 10
),
manager_stats AS (
    SELECT 
        manager_id,
        COUNT(*) as total_subordinates,
        COUNT(CASE WHEN depth = 1 THEN 1 END) as direct_subordinates
    FROM subordinate_count
    GROUP BY manager_id
)
SELECT 
    e.employee_id,
    e.employee_name,
    COALESCE(ms.direct_subordinates, 0) as direct_subordinates,
    COALESCE(ms.total_subordinates, 0) as total_subordinates
FROM employees e
LEFT JOIN manager_stats ms ON e.employee_id = ms.manager_id
WHERE EXISTS (
    SELECT 1 FROM employees e2 WHERE e2.manager_id = e.employee_id
)
ORDER BY total_subordinates DESC;
```

**解説:**
- **再帰で全部下を取得**: 直属・間接を含む全ての部下
- **depth**: 階層の深さを記録
- **集計**: 直属部下数と全部下数を分けて計算
- **管理者のみ表示**: EXISTSで部下がいる従業員のみ

---

## セクション3: 共通テーブル式（CTE）の高度な活用 - 解答

### 問題3-1: 段階的な売上分析

**解答:**
```sql
WITH 
-- ステップ1: 月別売上集計
monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', order_date) as order_month,
        SUM(total_amount) as monthly_total
    FROM orders
    WHERE status = 'COMPLETED'
    GROUP BY DATE_TRUNC('month', order_date)
),

-- ステップ2: 前月比計算
sales_with_prev_month AS (
    SELECT 
        order_month,
        monthly_total,
        LAG(monthly_total, 1) OVER (ORDER BY order_month) as prev_month_total
    FROM monthly_sales
),

-- ステップ3: 成長率計算
sales_with_growth AS (
    SELECT 
        order_month,
        monthly_total,
        prev_month_total,
        CASE 
            WHEN prev_month_total > 0 THEN
                ROUND((monthly_total - prev_month_total) * 100.0 / prev_month_total, 2)
            ELSE NULL
        END as growth_rate_percent
    FROM sales_with_prev_month
),

-- ステップ4: 累積売上計算
final_analysis AS (
    SELECT 
        order_month,
        monthly_total,
        prev_month_total,
        growth_rate_percent,
        SUM(monthly_total) OVER (ORDER BY order_month) as cumulative_sales
    FROM sales_with_growth
)

SELECT 
    TO_CHAR(order_month, 'YYYY-MM') as year_month,
    monthly_total,
    growth_rate_percent,
    cumulative_sales
FROM final_analysis
ORDER BY order_month;
```

**解説:**
- **段階的処理**: 複雑な計算を4つのステップに分解
- **可読性**: 各CTEが明確な責任を持つ
- **保守性**: 各段階を独立してテスト・修正可能

**パフォーマンス最適化:**
```sql
-- インデックス推奨
CREATE INDEX idx_orders_status_date ON orders(status, order_date) 
WHERE status = 'COMPLETED';
```

### 問題3-2: 顧客セグメンテーション（RFM分析）

**解答:**
```sql
WITH 
-- ステップ1: 顧客別RFM指標計算
customer_rfm_metrics AS (
    SELECT 
        customer_id,
        MAX(order_date) as last_order_date,
        COUNT(*) as frequency,
        SUM(total_amount) as monetary,
        EXTRACT(DAYS FROM CURRENT_DATE - MAX(order_date)) as recency_days
    FROM orders
    WHERE status = 'COMPLETED'
      AND order_date >= CURRENT_DATE - INTERVAL '2 years'
    GROUP BY customer_id
),

-- ステップ2: RFMスコア算出
customer_rfm_scores AS (
    SELECT 
        customer_id,
        recency_days,
        frequency,
        monetary,
        -- Recencyスコア（日数が少ないほど高スコア）
        NTILE(5) OVER (ORDER BY recency_days) as recency_score,
        -- Frequencyスコア（回数が多いほど高スコア）
        NTILE(5) OVER (ORDER BY frequency DESC) as frequency_score,
        -- Monetaryスコア（金額が多いほど高スコア）
        NTILE(5) OVER (ORDER BY monetary DESC) as monetary_score
    FROM customer_rfm_metrics
),

-- ステップ3: セグメント分類
customer_segments AS (
    SELECT 
        customer_id,
        recency_score,
        frequency_score,
        monetary_score,
        CASE 
            WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
            WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Loyal Customers'
            WHEN recency_score >= 4 AND frequency_score <= 2 THEN 'New Customers'
            WHEN recency_score >= 3 AND frequency_score >= 4 THEN 'Potential Loyalists'
            WHEN recency_score >= 3 AND frequency_score >= 2 AND monetary_score >= 2 THEN 'Promising'
            WHEN recency_score <= 2 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'At Risk'
            WHEN recency_score <= 2 AND frequency_score >= 2 AND monetary_score >= 4 THEN 'Cannot Lose Them'
            WHEN recency_score <= 2 AND frequency_score >= 2 THEN 'Hibernating'
            ELSE 'Lost'
        END as segment
    FROM customer_rfm_scores
)

SELECT 
    customer_id,
    LPAD(recency_score::TEXT, 1, '0') || 
    LPAD(frequency_score::TEXT, 1, '0') || 
    LPAD(monetary_score::TEXT, 1, '0') as rfm_score,
    segment
FROM customer_segments
ORDER BY monetary_score DESC, frequency_score DESC, recency_score DESC;
```

**解説:**
- **RFM分析**: Recency（最新性）、Frequency（頻度）、Monetary（金額）
- **NTILE(5)**: 各指標を5段階でスコア化
- **セグメント分類**: RFMスコアの組み合わせでセグメント決定

**ビジネス活用:**
```sql
-- セグメント別統計
SELECT 
    segment,
    COUNT(*) as customer_count,
    ROUND(AVG(monetary), 2) as avg_monetary,
    ROUND(AVG(frequency), 2) as avg_frequency,
    ROUND(AVG(recency_days), 1) as avg_recency_days
FROM customer_segments cs
JOIN customer_rfm_metrics crm ON cs.customer_id = crm.customer_id
GROUP BY segment
ORDER BY customer_count DESC;
```

---

## セクション4: ストアドプロシージャとファンクション - 解答

### 問題4-1: 在庫管理プロシージャ

**解答:**
```sql
CREATE OR REPLACE PROCEDURE manage_inventory(
    p_product_id INT,
    p_quantity INT,
    p_operation VARCHAR(10), -- 'IN' or 'OUT'
    p_reason VARCHAR(255) DEFAULT 'Manual adjustment',
    p_reference_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_stock INT;
    v_new_stock INT;
    v_min_stock INT;
    v_product_name VARCHAR(255);
BEGIN
    -- 商品情報を取得（行ロック）
    SELECT stock_quantity, minimum_stock, product_name
    INTO v_current_stock, v_min_stock, v_product_name
    FROM products 
    WHERE product_id = p_product_id
    FOR UPDATE;
    
    -- 商品存在チェック
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product ID % not found', p_product_id;
    END IF;
    
    -- 数量チェック
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be positive: %', p_quantity;
    END IF;
    
    -- 新在庫数計算
    IF p_operation = 'IN' THEN
        v_new_stock := v_current_stock + p_quantity;
    ELSIF p_operation = 'OUT' THEN
        v_new_stock := v_current_stock - p_quantity;
        
        -- 在庫不足チェック
        IF v_new_stock < 0 THEN
            RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %', 
                v_product_name, v_current_stock, p_quantity;
        END IF;
    ELSE
        RAISE EXCEPTION 'Invalid operation: %. Use IN or OUT', p_operation;
    END IF;
    
    -- 在庫更新
    UPDATE products 
    SET stock_quantity = v_new_stock,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = p_product_id;
    
    -- 在庫履歴記録
    INSERT INTO inventory_history (
        product_id,
        operation_type,
        quantity_change,
        old_quantity,
        new_quantity,
        reason,
        reference_id,
        created_at
    ) VALUES (
        p_product_id,
        p_operation,
        p_quantity,
        v_current_stock,
        v_new_stock,
        p_reason,
        p_reference_id,
        CURRENT_TIMESTAMP
    );
    
    -- 低在庫アラート
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
        
        RAISE NOTICE 'LOW STOCK ALERT: Product % (%) - Current: %, Minimum: %', 
            p_product_id, v_product_name, v_new_stock, v_min_stock;
    END IF;
    
    RAISE NOTICE 'Inventory updated: Product % - % % units (% → %)', 
        p_product_id, p_operation, p_quantity, v_current_stock, v_new_stock;
        
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Inventory management error: %', SQLERRM;
END;
$$;

-- 使用例
CALL manage_inventory(101, 50, 'IN', 'Purchase order #1234', 1234);
CALL manage_inventory(101, 10, 'OUT', 'Sales order #5678', 5678);
```

**解説:**
- **FOR UPDATE**: 同時実行制御のための行ロック
- **例外処理**: 各種エラー条件の適切な処理
- **履歴記録**: 全ての在庫変動を記録
- **アラート機能**: 低在庫時の自動通知

**テストケース:**
```sql
-- 正常ケース
CALL manage_inventory(101, 100, 'IN', 'Initial stock');

-- エラーケース
CALL manage_inventory(999, 10, 'OUT', 'Test'); -- 商品不存在
CALL manage_inventory(101, 1000, 'OUT', 'Test'); -- 在庫不足
CALL manage_inventory(101, -10, 'IN', 'Test'); -- 負の数量
```

### 問題4-2: 売上集計ファンクション

**解答:**
```sql
CREATE OR REPLACE FUNCTION calculate_sales_summary(
    p_start_date DATE,
    p_end_date DATE,
    p_category VARCHAR(100) DEFAULT NULL
)
RETURNS TABLE(
    total_sales DECIMAL(15,2),
    order_count BIGINT,
    avg_order_value DECIMAL(10,2),
    unique_customers BIGINT,
    top_product_id INT,
    top_product_name VARCHAR(255),
    top_product_sales DECIMAL(15,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_category_filter VARCHAR(100);
BEGIN
    -- パラメータ検証
    IF p_start_date > p_end_date THEN
        RAISE EXCEPTION 'Start date cannot be after end date';
    END IF;
    
    IF p_end_date > CURRENT_DATE THEN
        RAISE EXCEPTION 'End date cannot be in the future';
    END IF;
    
    v_category_filter := p_category;
    
    RETURN QUERY
    WITH sales_data AS (
        SELECT 
            o.order_id,
            o.customer_id,
            o.total_amount,
            oi.product_id,
            p.product_name,
            p.category,
            oi.quantity * oi.unit_price as item_amount
        FROM orders o
        INNER JOIN order_items oi ON o.order_id = oi.order_id
        INNER JOIN products p ON oi.product_id = p.product_id
        WHERE o.order_date BETWEEN p_start_date AND p_end_date
          AND o.status = 'COMPLETED'
          AND (v_category_filter IS NULL OR p.category = v_category_filter)
    ),
    summary_stats AS (
        SELECT 
            SUM(total_amount) as total_sales,
            COUNT(DISTINCT order_id) as order_count,
            AVG(total_amount) as avg_order_value,
            COUNT(DISTINCT customer_id) as unique_customers
        FROM sales_data
    ),
    top_product AS (
        SELECT 
            product_id,
            product_name,
            SUM(item_amount) as product_sales
        FROM sales_data
        GROUP BY product
_id, product_name
        ORDER BY SUM(item_amount) DESC
        LIMIT 1
    )
    SELECT 
        COALESCE(ss.total_sales, 0),
        COALESCE(ss.order_count, 0),
        COALESCE(ss.avg_order_value, 0),
        COALESCE(ss.unique_customers, 0),
        COALESCE(tp.product_id, 0),
        COALESCE(tp.product_name, 'No sales'),
        COALESCE(tp.product_sales, 0)
    FROM summary_stats ss
    FULL OUTER JOIN top_product tp ON TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Sales summary calculation error: %', SQLERRM;
END;
$$;

-- 使用例
SELECT * FROM calculate_sales_summary('2022-01-01', '2022-12-31');
SELECT * FROM calculate_sales_summary('2022-01-01', '2022-12-31', 'Electronics');
```

**解説:**
- **RETURNS TABLE**: 複数列を返すテーブル関数
- **パラメータ検証**: 日付の妥当性チェック
- **COALESCE**: NULL値の適切な処理
- **FULL OUTER JOIN**: データがない場合も結果を返す

---

## セクション5: トリガーとイベント処理 - 解答

### 問題5-1: 監査ログトリガー

**解答:**
```sql
-- 監査ログテーブル
CREATE TABLE audit_log (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    record_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    changed_by VARCHAR(100) DEFAULT current_user,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(100),
    ip_address INET
);

-- 汎用監査トリガー関数
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
    v_record_id TEXT;
BEGIN
    -- レコードIDの取得（主キーを想定）
    IF TG_OP = 'DELETE' THEN
        v_record_id := OLD.id::TEXT;
    ELSE
        v_record_id := NEW.id::TEXT;
    END IF;
    
    -- 操作別の処理
    CASE TG_OP
        WHEN 'INSERT' THEN
            v_new_data := row_to_json(NEW)::JSONB;
            v_old_data := NULL;
            
        WHEN 'UPDATE' THEN
            v_old_data := row_to_json(OLD)::JSONB;
            v_new_data := row_to_json(NEW)::JSONB;
            
            -- 変更がない場合はログしない
            IF v_old_data = v_new_data THEN
                RETURN NEW;
            END IF;
            
        WHEN 'DELETE' THEN
            v_old_data := row_to_json(OLD)::JSONB;
            v_new_data := NULL;
    END CASE;
    
    -- 監査ログ挿入
    INSERT INTO audit_log (
        table_name,
        operation,
        record_id,
        old_values,
        new_values,
        session_id,
        ip_address
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        v_record_id,
        v_old_data,
        v_new_data,
        current_setting('application_name', true),
        inet_client_addr()
    );
    
    -- 適切な戻り値
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        -- 監査ログエラーでも元の操作は継続
        RAISE WARNING 'Audit log error: %', SQLERRM;
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        ELSE
            RETURN NEW;
        END IF;
END;
$$;

-- トリガー作成（複数テーブルに適用）
CREATE TRIGGER customers_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER products_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER orders_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

**解説:**
- **汎用設計**: 複数テーブルで使用可能
- **JSONB使用**: 柔軟なデータ構造の保存
- **セッション情報**: ユーザーとセッションの記録
- **エラーハンドリング**: 監査エラーでも元操作は継続

**監査ログ分析クエリ:**
```sql
-- 特定レコードの変更履歴
SELECT 
    changed_at,
    operation,
    changed_by,
    old_values,
    new_values
FROM audit_log
WHERE table_name = 'customers' AND record_id = '1'
ORDER BY changed_at DESC;

-- 変更頻度の高いテーブル
SELECT 
    table_name,
    COUNT(*) as change_count,
    COUNT(DISTINCT record_id) as affected_records
FROM audit_log
WHERE changed_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY table_name
ORDER BY change_count DESC;
```

### 問題5-2: 在庫自動更新トリガー

**解答:**
```sql
-- 注文ステータス変更時の在庫更新トリガー
CREATE OR REPLACE FUNCTION update_inventory_on_order_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_item RECORD;
    v_current_stock INT;
    v_product_name VARCHAR(255);
BEGIN
    -- ステータスが'PENDING'から'CONFIRMED'に変更された場合
    IF OLD.status = 'PENDING' AND NEW.status = 'CONFIRMED' THEN
        
        -- 注文明細をループ処理
        FOR v_item IN 
            SELECT oi.product_id, oi.quantity, p.product_name
            FROM order_items oi
            INNER JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = NEW.order_id
        LOOP
            -- 現在の在庫を取得（行ロック）
            SELECT stock_quantity, product_name
            INTO v_current_stock, v_product_name
            FROM products
            WHERE product_id = v_item.product_id
            FOR UPDATE;
            
            -- 在庫不足チェック
            IF v_current_stock < v_item.quantity THEN
                RAISE EXCEPTION 'Insufficient stock for product % (%): Available %, Required %',
                    v_item.product_id, v_product_name, v_current_stock, v_item.quantity;
            END IF;
            
            -- 在庫減算
            UPDATE products
            SET stock_quantity = stock_quantity - v_item.quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE product_id = v_item.product_id;
            
            -- 在庫履歴記録
            INSERT INTO inventory_history (
                product_id,
                operation_type,
                quantity_change,
                old_quantity,
                new_quantity,
                reason,
                reference_id,
                created_at
            ) VALUES (
                v_item.product_id,
                'OUT',
                v_item.quantity,
                v_current_stock,
                v_current_stock - v_item.quantity,
                'Order confirmed',
                NEW.order_id,
                CURRENT_TIMESTAMP
            );
            
        END LOOP;
        
    -- ステータスが'CONFIRMED'から'CANCELLED'に変更された場合（在庫復元）
    ELSIF OLD.status = 'CONFIRMED' AND NEW.status = 'CANCELLED' THEN
        
        FOR v_item IN 
            SELECT oi.product_id, oi.quantity
            FROM order_items oi
            WHERE oi.order_id = NEW.order_id
        LOOP
            -- 在庫復元
            UPDATE products
            SET stock_quantity = stock_quantity + v_item.quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE product_id = v_item.product_id;
            
            -- 在庫履歴記録
            INSERT INTO inventory_history (
                product_id,
                operation_type,
                quantity_change,
                old_quantity,
                new_quantity,
                reason,
                reference_id,
                created_at
            ) VALUES (
                v_item.product_id,
                'IN',
                v_item.quantity,
                (SELECT stock_quantity - v_item.quantity FROM products WHERE product_id = v_item.product_id),
                (SELECT stock_quantity FROM products WHERE product_id = v_item.product_id),
                'Order cancelled - stock restored',
                NEW.order_id,
                CURRENT_TIMESTAMP
            );
            
        END LOOP;
        
    END IF;
    
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Inventory update failed for order %: %', NEW.order_id, SQLERRM;
END;
$$;

-- トリガー作成
CREATE TRIGGER order_inventory_trigger
    AFTER UPDATE ON orders
    FOR EACH ROW 
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION update_inventory_on_order_status();
```

**解説:**
- **ステータス変更検知**: WHENで不要な実行を防止
- **ループ処理**: 注文明細の全商品を処理
- **在庫復元**: キャンセル時の在庫戻し処理
- **履歴記録**: 全ての在庫変動を記録

---

## セクション6: トランザクション制御とパフォーマンス - 解答

### 問題6-1: 分離レベル別動作確認

**解答:**
```sql
-- セッション1での実行例
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 残高確認
SELECT balance FROM accounts WHERE account_id = 1; -- 例: 1000

-- セッション2で同じアカウントを更新中...

-- 再度残高確認（READ COMMITTEDでは更新後の値が見える）
SELECT balance FROM accounts WHERE account_id = 1; -- 例: 1500

COMMIT;

-- REPEATABLE READでの例
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT balance FROM accounts WHERE account_id = 1; -- 例: 1000

-- セッション2で更新されても同じ値が見える
SELECT balance FROM accounts WHERE account_id = 1; -- 例: 1000（変わらない）

COMMIT;

-- SERIALIZABLEでの例
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SELECT SUM(balance) FROM accounts WHERE account_type = 'SAVINGS';

-- 他のセッションでSAVINGSアカウントが追加されると
-- ファントムリードを防ぐためエラーが発生する可能性

COMMIT;
```

**各分離レベルの特徴:**

| 分離レベル | ダーティリード | ノンリピータブルリード | ファントムリード |
|------------|----------------|------------------------|------------------|
| READ UNCOMMITTED | 発生する | 発生する | 発生する |
| READ COMMITTED | 防ぐ | 発生する | 発生する |
| REPEATABLE READ | 防ぐ | 防ぐ | 発生する |
| SERIALIZABLE | 防ぐ | 防ぐ | 防ぐ |

### 問題6-2: デッドロック回避設計

**解答:**
```sql
-- デッドロック回避のための資金移動プロシージャ
CREATE OR REPLACE PROCEDURE transfer_funds_safe(
    p_from_account INT,
    p_to_account INT,
    p_amount DECIMAL(15,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_account1 INT;
    v_account2 INT;
    v_balance1 DECIMAL(15,2);
    v_balance2 DECIMAL(15,2);
    v_retry_count INT := 0;
    v_max_retries INT := 3;
BEGIN
    -- デッドロック回避のためアカウントIDを昇順でソート
    IF p_from_account < p_to_account THEN
        v_account1 := p_from_account;
        v_account2 := p_to_account;
    ELSE
        v_account1 := p_to_account;
        v_account2 := p_from_account;
    END IF;
    
    -- リトライループ
    WHILE v_retry_count < v_max_retries LOOP
        BEGIN
            -- 昇順でロック取得
            SELECT balance INTO v_balance1
            FROM accounts 
            WHERE account_id = v_account1
            FOR UPDATE;
            
            SELECT balance INTO v_balance2
            FROM accounts 
            WHERE account_id = v_account2
            FOR UPDATE;
            
            -- 送金元の残高チェック
            IF p_from_account = v_account1 THEN
                IF v_balance1 < p_amount THEN
                    RAISE EXCEPTION 'Insufficient funds in account %', p_from_account;
                END IF;
            ELSE
                IF v_balance2 < p_amount THEN
                    RAISE EXCEPTION 'Insufficient funds in account %', p_from_account;
                END IF;
            END IF;
            
            -- 資金移動実行
            UPDATE accounts 
            SET balance = balance - p_amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE account_id = p_from_account;
            
            UPDATE accounts 
            SET balance = balance + p_amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE account_id = p_to_account;
            
            -- 取引履歴記録
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
            
            -- 成功時はループを抜ける
            EXIT;
            
        EXCEPTION
            WHEN deadlock_detected THEN
                v_retry_count := v_retry_count + 1;
                IF v_retry_count >= v_max_retries THEN
                    RAISE EXCEPTION 'Transfer failed after % retries due to deadlock', v_max_retries;
                END IF;
                
                -- 短時間待機してリトライ
                PERFORM pg_sleep(random() * 0.1);
                ROLLBACK;
                
            WHEN OTHERS THEN
                RAISE;
        END;
    END LOOP;
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;
```

**解説:**
- **ロック順序統一**: アカウントIDの昇順でロック取得
- **デッドロック検出**: deadlock_detected例外をキャッチ
- **リトライ機構**: 指数バックオフでリトライ
- **ランダム待機**: 同時リトライによる再デッドロック防止

### 問題6-3: 楽観的ロック実装

**解答:**
```sql
-- バージョン管理付きテーブル
ALTER TABLE products ADD COLUMN version INT DEFAULT 1;

-- 楽観的ロックによる在庫更新関数
CREATE OR REPLACE FUNCTION update_stock_optimistic(
    p_product_id INT,
    p_quantity_change INT,
    p_expected_version INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_stock INT;
    v_current_version INT;
    v_updated_rows INT;
BEGIN
    -- 現在の在庫とバージョンを確認
    SELECT stock_quantity, version
    INTO v_current_stock, v_current_version
    FROM products
    WHERE product_id = p_product_id;
    
    -- 商品存在チェック
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product % not found', p_product_id;
    END IF;
    
    -- バージョン競合チェック
    IF v_current_version != p_expected_version THEN
        RAISE EXCEPTION 'Version conflict: expected %, current %', 
            p_expected_version, v_current_version;
    END IF;
    
    -- 在庫不足チェック
    IF v_current_stock + p_quantity_change < 0 THEN
        RAISE EXCEPTION 'Insufficient stock: current %, change %', 
            v_current_stock, p_quantity_change;
    END IF;
    
    -- 楽観的ロックによる更新
    UPDATE products
    SET stock_quantity = stock_quantity + p_quantity_change,
        version = version + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = p_product_id
      AND version = p_expected_version;
    
    GET DIAGNOSTICS v_updated_rows = ROW_COUNT;
    
    -- 更新失敗（他のトランザクションが先に更新）
    IF v_updated_rows = 0 THEN
        RETURN FALSE;
    END IF;
    
    -- 在庫履歴記録
    INSERT INTO inventory_history (
        product_id,
        operation_type,
        quantity_change,
        old_quantity,
        new_quantity,
        reason,
        created_at
    ) VALUES (
        p_product_id,
        CASE WHEN p_quantity_change > 0 THEN 'IN' ELSE 'OUT' END,
        ABS(p_quantity_change),
        v_current_stock,
        v_current_stock + p_quantity_change,
        'Optimistic lock update',
        CURRENT_TIMESTAMP
    );
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

-- 使用例（リトライ機構付き）
DO $$
DECLARE
    v_product_id INT := 1;
    v_quantity_change INT := -5;
    v_version INT;
    v_success BOOLEAN := FALSE;
    v_retry_count INT := 0;
    v_max_retries INT := 5;
BEGIN
    WHILE NOT v_success AND v_retry_count < v_max_retries LOOP
        -- 現在のバージョンを取得
        SELECT version INTO v_version
        FROM products
        WHERE product_id = v_product_id;
        
        BEGIN
            v_success := update_stock_optimistic(v_product_id, v_quantity_change, v_version);
            
        EXCEPTION
            WHEN OTHERS THEN
                v_retry_count := v_retry_count + 1;
                IF v_retry_count >= v_max_retries THEN
                    RAISE;
                END IF;
                
                -- 短時間待機
                PERFORM pg_sleep(random() * 0.01);
        END;
    END LOOP;
    
    IF v_success THEN
        RAISE NOTICE 'Stock updated successfully';
    ELSE
        RAISE EXCEPTION 'Failed to update stock after % retries', v_max_retries;
    END IF;
END;
$$;
```

**解説:**
- **バージョン管理**: version列で競合検出
- **原子的更新**: WHERE条件でバージョンチェック
- **リトライ機構**: 競合時の自動再試行
- **パフォーマンス**: ロック待機なしで高速処理

---

## セクション7: データベース設計の実践 - 解答

### 問題7-1: ECサイトデータベース設計

**解答:**
```sql
-- 顧客管理
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    customer_type VARCHAR(20) DEFAULT 'STANDARD' CHECK (customer_type IN ('PREMIUM', 'STANDARD', 'BASIC')),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 住所管理（正規化）
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

-- カテゴリ管理（階層構造）
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    parent_category_id INT REFERENCES categories(category_id),
    category_name VARCHAR(100) NOT NULL,
    category_path VARCHAR(500), -- 階層パス
    level INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品管理
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
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品画像
CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 注文管理
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
    currency VARCHAR(3) DEFAULT 'JPY',
    billing_address JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method VARCHAR(50),
    shipping_method VARCHAR(50),
    notes TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipped_date TIMESTAMP,
    delivered_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 注文明細
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(12,2) NOT NULL CHECK (total_price >= 0),
    product_snapshot JSONB, -- 注文時の商品情報
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
    lifetime_value DECIMAL(15,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス設計
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status) WHERE status = 'ACTIVE';
CREATE INDEX idx_addresses_customer ON addresses(customer_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- 制約
ALTER TABLE orders ADD CONSTRAINT chk_total_calculation 
CHECK (total_amount = subtotal + tax_amount + shipping_amount - discount_amount);

ALTER TABLE order_items ADD CONSTRAINT chk_item_total 
CHECK (total_price = quantity * unit_price);

-- 統計更新トリガー
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
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
      AND order_status = 'COMPLETED'
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

CREATE TRIGGER customer_stats_trigger
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW 
    WHEN (NEW.order_status = 'COMPLETED')
    EXECUTE FUNCTION update_customer_stats();
```

**設計のポイント:**
- **正規化**: 重複を排除し、整合性を保つ
- **非正規化**: パフォーマンス向上のための統計テーブル
- **制約**: データ整合性の保証
- **インデックス**: クエリパフォーマンスの最適化
- **JSONB**: 柔軟なデータ構造（住所、商品情報等）

---

## セクション8: 試験対策問題 - 解答

### 問題8-1: 複雑な集計クエリ

**解答:**
```sql
WITH 
-- 月別カテゴリ売上
monthly_category_sales AS (
    SELECT 
        p.category,
        DATE_TRUNC('month', o.order_date) as sale_month,
        SUM(oi.total_price) as monthly_sales
    FROM orders o
    INNER JOIN order_items oi ON o.order_id = oi.order_id
    INNER JOIN products p ON oi.product_id = p.product_id
    WHERE o
.order_status = 'COMPLETED'
    GROUP BY p.category, DATE_TRUNC('month', o.order_date)
),

-- 前年同月売上
prev_year_sales AS (
    SELECT 
        category,
        sale_month,
        monthly_sales,
        LAG(monthly_sales, 12) OVER (
            PARTITION BY category 
            ORDER BY sale_month
        ) as prev_year_same_month
    FROM monthly_category_sales
),

-- 前年同月比計算
sales_with_yoy AS (
    SELECT 
        category,
        sale_month,
        monthly_sales,
        prev_year_same_month,
        CASE 
            WHEN prev_year_same_month > 0 THEN
                ROUND((monthly_sales - prev_year_same_month) * 100.0 / prev_year_same_month, 2)
            ELSE NULL
        END as yoy_growth_rate
    FROM prev_year_sales
),

-- 累積売上計算
sales_with_cumulative AS (
    SELECT 
        category,
        sale_month,
        monthly_sales,
        yoy_growth_rate,
        SUM(monthly_sales) OVER (
            PARTITION BY category 
            ORDER BY sale_month
        ) as cumulative_sales
    FROM sales_with_yoy
),

-- 全体売上計算
total_monthly_sales AS (
    SELECT 
        sale_month,
        SUM(monthly_sales) as total_monthly_sales
    FROM monthly_category_sales
    GROUP BY sale_month
)

SELECT 
    swc.category,
    TO_CHAR(swc.sale_month, 'YYYY-MM') as year_month,
    swc.monthly_sales,
    swc.yoy_growth_rate,
    swc.cumulative_sales,
    ROUND(swc.monthly_sales * 100.0 / tms.total_monthly_sales, 2) as market_share_percent
FROM sales_with_cumulative swc
INNER JOIN total_monthly_sales tms ON swc.sale_month = tms.sale_month
ORDER BY swc.sale_month DESC, swc.monthly_sales DESC;
```

**解説:**
- **段階的CTE**: 複雑な計算を6つのステップに分解
- **LAG関数**: 12ヶ月前のデータで前年同月比を計算
- **ウィンドウ関数**: 累積売上とマーケットシェアを計算
- **NULL処理**: 前年データがない場合の適切な処理

### 問題8-20: 総合問題 - ECサイト包括分析

**解答:**
```sql
-- ECサイト包括分析レポート生成システム
CREATE OR REPLACE FUNCTION generate_comprehensive_ecommerce_report(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    report_section VARCHAR(50),
    metric_name VARCHAR(100),
    metric_value DECIMAL(15,2),
    metric_unit VARCHAR(20),
    comparison_value DECIMAL(15,2),
    trend VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH 
    -- 基本売上指標
    sales_metrics AS (
        SELECT 
            'Sales Overview' as section,
            'Total Revenue' as metric,
            SUM(total_amount) as value,
            'JPY' as unit,
            LAG(SUM(total_amount)) OVER (ORDER BY DATE_TRUNC('month', order_date)) as prev_value
        FROM orders
        WHERE order_date BETWEEN p_start_date AND p_end_date
          AND order_status = 'COMPLETED'
        GROUP BY DATE_TRUNC('month', order_date)
        
        UNION ALL
        
        SELECT 
            'Sales Overview',
            'Total Orders',
            COUNT(*)::DECIMAL,
            'orders',
            LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', order_date))
        FROM orders
        WHERE order_date BETWEEN p_start_date AND p_end_date
          AND order_status = 'COMPLETED'
        GROUP BY DATE_TRUNC('month', order_date)
        
        UNION ALL
        
        SELECT 
            'Sales Overview',
            'Average Order Value',
            AVG(total_amount),
            'JPY',
            LAG(AVG(total_amount)) OVER (ORDER BY DATE_TRUNC('month', order_date))
        FROM orders
        WHERE order_date BETWEEN p_start_date AND p_end_date
          AND order_status = 'COMPLETED'
        GROUP BY DATE_TRUNC('month', order_date)
    ),
    
    -- 顧客分析指標
    customer_metrics AS (
        SELECT 
            'Customer Analysis' as section,
            'New Customers' as metric,
            COUNT(DISTINCT customer_id)::DECIMAL as value,
            'customers' as unit,
            NULL::DECIMAL as prev_value
        FROM customers
        WHERE registration_date BETWEEN p_start_date AND p_end_date
        
        UNION ALL
        
        SELECT 
            'Customer Analysis',
            'Repeat Customers',
            COUNT(DISTINCT customer_id)::DECIMAL,
            'customers',
            NULL::DECIMAL
        FROM orders
        WHERE order_date BETWEEN p_start_date AND p_end_date
          AND customer_id IN (
              SELECT customer_id 
              FROM orders 
              WHERE order_date < p_start_date 
                AND order_status = 'COMPLETED'
          )
          AND order_status = 'COMPLETED'
        
        UNION ALL
        
        SELECT 
            'Customer Analysis',
            'Customer Lifetime Value',
            AVG(total_spent),
            'JPY',
            NULL::DECIMAL
        FROM customer_statistics
        WHERE updated_at >= p_start_date
    ),
    
    -- 商品分析指標
    product_metrics AS (
        SELECT 
            'Product Analysis' as section,
            'Top Category Revenue' as metric,
            MAX(category_revenue) as value,
            'JPY' as unit,
            NULL::DECIMAL as prev_value
        FROM (
            SELECT 
                p.category,
                SUM(oi.total_price) as category_revenue
            FROM order_items oi
            INNER JOIN products p ON oi.product_id = p.product_id
            INNER JOIN orders o ON oi.order_id = o.order_id
            WHERE o.order_date BETWEEN p_start_date AND p_end_date
              AND o.order_status = 'COMPLETED'
            GROUP BY p.category
        ) cat_sales
        
        UNION ALL
        
        SELECT 
            'Product Analysis',
            'Inventory Turnover',
            AVG(CASE WHEN stock_quantity > 0 THEN sales_count::DECIMAL / stock_quantity ELSE 0 END),
            'ratio',
            NULL::DECIMAL
        FROM products
        WHERE is_active = TRUE
    ),
    
    -- 統合結果
    all_metrics AS (
        SELECT * FROM sales_metrics
        UNION ALL
        SELECT * FROM customer_metrics  
        UNION ALL
        SELECT * FROM product_metrics
    )
    
    SELECT 
        section,
        metric,
        value,
        unit,
        prev_value,
        CASE 
            WHEN prev_value IS NULL THEN 'N/A'
            WHEN value > prev_value THEN 'UP'
            WHEN value < prev_value THEN 'DOWN'
            ELSE 'STABLE'
        END as trend
    FROM all_metrics
    ORDER BY section, metric;
    
END;
$$;

-- 使用例
SELECT * FROM generate_comprehensive_ecommerce_report('2022-01-01', '2022-12-31');
```

**解説:**
- **包括的分析**: 売上・顧客・商品の全方位分析
- **動的レポート**: パラメータで期間指定可能
- **トレンド分析**: 前期比較による傾向把握
- **実用性**: 実際のビジネスで使用可能な構造

---

## 学習のまとめ

### 解答作成時の重要ポイント

1. **段階的アプローチ**
   - 複雑な問題を小さな部分に分解
   - CTEを活用した段階的な処理
   - 各段階での検証とテスト

2. **パフォーマンス考慮**
   - 適切なインデックスの設計
   - 実行計画の確認と最適化
   - 大量データでの動作検証

3. **エラーハンドリング**
   - 例外処理の適切な実装
   - NULL値の適切な処理
   - 境界値での動作確認

4. **可読性と保守性**
   - 明確な変数名とコメント
   - 論理的な構造化
   - 再利用可能な設計

### よくある間違いと対策

1. **ウィンドウ関数**
   - フレーム句の指定忘れ → 明示的に指定
   - パーティション分割の誤り → 要件を再確認
   - ORDER BYの省略 → 必要に応じて指定

2. **再帰クエリ**
   - 無限ループ → 深度制限を設定
   - 終了条件の設定ミス → 条件を慎重に設計
   - パフォーマンス劣化 → インデックスを適切に設計

3. **トランザクション**
   - デッドロック → ロック順序を統一
   - 分離レベルの選択ミス → 要件に応じて選択
   - ロック時間の長期化 → 処理を最小限に

### 実務での応用

1. **設計原則**
   - 正規化と非正規化の適切な判断
   - パフォーマンスと整合性のバランス
   - 将来の拡張性を考慮した設計

2. **運用考慮**
   - 監視とアラートの実装
   - バックアップとリカバリ戦略
   - セキュリティ対策の実装

3. **チーム開発**
   - コードレビューの実施
   - ドキュメントの整備
   - 知識共有の促進

---

## 次のステップ

これらの解答を理解したら、以下のステップに進んでください：

1. **実際の実行**: 解答を実際のデータベースで実行
2. **カスタマイズ**: 自分の環境に合わせて調整
3. **応用問題**: より複雑な問題に挑戦
4. **習熟度テスト**: [`test.md`](./test.md)で実力確認
5. **実務適用**: 実際のプロジェクトで活用

---

**解答の学習お疲れさまでした！** 🎉

これらの解答を通じて、データベーススペシャリスト試験合格レベルの実力と、実務で通用する高度なSQL技術を身につけることができます。継続的な学習と実践を通じて、さらなるスキルアップを目指してください！ 💪🚀⚡