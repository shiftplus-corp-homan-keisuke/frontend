-- ============================================================================
-- データベーススペシャリスト試験 SQL学習教材
-- サンプルデータベース作成スクリプト（管理者権限用）
-- ============================================================================

-- ============================================================================
-- 【重要】実行前の確認事項
-- ============================================================================
-- このスクリプトは管理者権限（root、postgres等）で実行してください。
-- 以下の権限が必要です：
-- - データベース作成権限 (CREATE DATABASE)
-- - ユーザー作成権限 (CREATE USER)
-- - 権限付与権限 (GRANT)
-- 
-- 実行方法：
-- MySQL: mysql -u root -p < sample-database-admin.sql
-- PostgreSQL: psql -U postgres -f sample-database-admin.sql
-- ============================================================================

-- データベース作成（MySQL/PostgreSQL用）
-- 既存のデータベースがある場合は削除して再作成
DROP DATABASE IF EXISTS learning_db;
CREATE DATABASE learning_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 学習用ユーザーの作成（オプション）
-- パスワードは学習用なので簡単に設定（本番環境では複雑なパスワードを使用）
DROP USER IF EXISTS 'learning_user'@'localhost';
CREATE USER 'learning_user'@'localhost' IDENTIFIED BY 'learning123';

-- 学習用ユーザーに必要な権限を付与
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON learning_db.* TO 'learning_user'@'localhost';
FLUSH PRIVILEGES;

-- 作成したデータベースを使用
USE learning_db;

-- ============================================================================
-- テーブル作成
-- ============================================================================

-- 部署テーブル
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL,
    location VARCHAR(50),
    manager_id INT,
    budget DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 従業員テーブル
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    hire_date DATE NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    commission_pct DECIMAL(3,2),
    manager_id INT,
    department_id INT,
    status VARCHAR(10) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

-- 顧客テーブル
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(50),
    contact_title VARCHAR(50),
    address VARCHAR(100),
    city VARCHAR(50),
    region VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'Japan',
    phone VARCHAR(20),
    email VARCHAR(100),
    credit_limit DECIMAL(10,2),
    registration_date DATE DEFAULT (CURRENT_DATE),
    status VARCHAR(10) DEFAULT 'ACTIVE'
);

-- 商品カテゴリテーブル
CREATE TABLE categories (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    parent_category_id INT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);

-- 商品テーブル
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    unit_price DECIMAL(8,2) NOT NULL,
    units_in_stock INT DEFAULT 0,
    units_on_order INT DEFAULT 0,
    reorder_level INT DEFAULT 0,
    discontinued BOOLEAN DEFAULT FALSE,
    supplier_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 注文テーブル
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    employee_id INT,
    order_date DATE NOT NULL,
    required_date DATE,
    shipped_date DATE,
    ship_via INT,
    freight DECIMAL(8,2) DEFAULT 0,
    ship_name VARCHAR(100),
    ship_address VARCHAR(100),
    ship_city VARCHAR(50),
    ship_region VARCHAR(50),
    ship_postal_code VARCHAR(20),
    ship_country VARCHAR(50),
    status VARCHAR(20) DEFAULT 'PENDING',
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- 注文詳細テーブル
CREATE TABLE order_details (
    order_id INT,
    product_id INT,
    unit_price DECIMAL(8,2) NOT NULL,
    quantity INT NOT NULL,
    discount DECIMAL(3,2) DEFAULT 0,
    line_total DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity * (1 - discount)) STORED,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 売上実績テーブル（Level 3用の大量データ）
CREATE TABLE sales_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    sale_date DATE NOT NULL,
    employee_id INT,
    customer_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(8,2) NOT NULL,
    discount_rate DECIMAL(3,2) DEFAULT 0,
    sales_amount DECIMAL(10,2) NOT NULL,
    cost_amount DECIMAL(10,2),
    profit_amount DECIMAL(10,2),
    region VARCHAR(50),
    sales_channel VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ============================================================================
-- インデックス作成（パフォーマンス学習用）
-- ============================================================================

-- 基本インデックス
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_hire_date ON employees(hire_date);
CREATE INDEX idx_employees_salary ON employees(salary);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_employee ON orders(employee_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(unit_price);

-- 複合インデックス（Level 2-3用）
CREATE INDEX idx_sales_date_employee ON sales_records(sale_date, employee_id);
CREATE INDEX idx_sales_customer_product ON sales_records(customer_id, product_id);
CREATE INDEX idx_employees_dept_salary ON employees(department_id, salary);

-- ============================================================================
-- サンプルデータ投入
-- ============================================================================

-- 部署データ
INSERT INTO departments (department_id, department_name, location, manager_id, budget) VALUES
(10, '営業部', '東京', NULL, 5000000.00),
(20, '開発部', '大阪', NULL, 8000000.00),
(30, 'マーケティング部', '東京', NULL, 3000000.00),
(40, '人事部', '東京', NULL, 2000000.00),
(50, '経理部', '東京', NULL, 1500000.00),
(60, '総務部', '名古屋', NULL, 1000000.00);

-- 従業員データ
INSERT INTO employees (employee_id, first_name, last_name, email, phone_number, hire_date, job_title, salary, commission_pct, manager_id, department_id) VALUES
(100, '太郎', '田中', 'tanaka.taro@company.com', '03-1234-5678', '2020-01-15', '営業部長', 800000, 0.10, NULL, 10),
(101, '花子', '佐藤', 'sato.hanako@company.com', '03-1234-5679', '2020-03-01', '営業主任', 600000, 0.08, 100, 10),
(102, '次郎', '鈴木', 'suzuki.jiro@company.com', '03-1234-5680', '2021-04-01', '営業担当', 450000, 0.05, 101, 10),
(103, '美咲', '高橋', 'takahashi.misaki@company.com', '03-1234-5681', '2021-06-15', '営業担当', 420000, 0.05, 101, 10),
(200, '健一', '山田', 'yamada.kenichi@company.com', '06-2345-6789', '2019-05-01', '開発部長', 900000, NULL, NULL, 20),
(201, '由美', '渡辺', 'watanabe.yumi@company.com', '06-2345-6790', '2020-02-15', 'シニアエンジニア', 700000, NULL, 200, 20),
(202, '大輔', '伊藤', 'ito.daisuke@company.com', '06-2345-6791', '2021-01-10', 'エンジニア', 550000, NULL, 201, 20),
(203, '麻衣', '中村', 'nakamura.mai@company.com', '06-2345-6792', '2021-08-01', 'エンジニア', 520000, NULL, 201, 20),
(300, '博', '小林', 'kobayashi.hiroshi@company.com', '03-3456-7890', '2020-07-01', 'マーケティング部長', 750000, NULL, NULL, 30),
(301, '恵子', '加藤', 'kato.keiko@company.com', '03-3456-7891', '2021-03-15', 'マーケティング主任', 580000, NULL, 300, 30),
(400, '正雄', '吉田', 'yoshida.masao@company.com', '03-4567-8901', '2018-04-01', '人事部長', 720000, NULL, NULL, 40),
(500, '智子', '松本', 'matsumoto.tomoko@company.com', '03-5678-9012', '2019-10-01', '経理部長', 680000, NULL, NULL, 50);

-- 部署のmanager_idを更新
UPDATE departments SET manager_id = 100 WHERE department_id = 10;
UPDATE departments SET manager_id = 200 WHERE department_id = 20;
UPDATE departments SET manager_id = 300 WHERE department_id = 30;
UPDATE departments SET manager_id = 400 WHERE department_id = 40;
UPDATE departments SET manager_id = 500 WHERE department_id = 50;

-- 顧客データ
INSERT INTO customers (customer_id, company_name, contact_name, contact_title, address, city, region, postal_code, country, phone, email, credit_limit) VALUES
(1, '株式会社アルファ', '田中一郎', '代表取締役', '東京都千代田区丸の内1-1-1', '東京', '関東', '100-0005', 'Japan', '03-1111-1111', 'tanaka@alpha.co.jp', 5000000),
(2, '株式会社ベータ', '佐藤花子', '購買部長', '大阪府大阪市北区梅田2-2-2', '大阪', '関西', '530-0001', 'Japan', '06-2222-2222', 'sato@beta.co.jp', 3000000),
(3, '株式会社ガンマ', '鈴木太郎', '営業部長', '愛知県名古屋市中区栄3-3-3', '名古屋', '中部', '460-0008', 'Japan', '052-3333-3333', 'suzuki@gamma.co.jp', 2000000),
(4, '株式会社デルタ', '高橋美咲', '総務部長', '福岡県福岡市博多区博多駅前4-4-4', '福岡', '九州', '812-0011', 'Japan', '092-4444-4444', 'takahashi@delta.co.jp', 1500000),
(5, '株式会社イプシロン', '山田健一', '企画部長', '北海道札幌市中央区大通西5-5-5', '札幌', '北海道', '060-0042', 'Japan', '011-5555-5555', 'yamada@epsilon.co.jp', 2500000);

-- カテゴリデータ（階層構造）
INSERT INTO categories (category_id, category_name, description, parent_category_id, display_order) VALUES
(1, 'コンピュータ', 'コンピュータ関連製品', NULL, 1),
(2, 'ソフトウェア', 'ソフトウェア製品', NULL, 2),
(3, '書籍', '技術書籍', NULL, 3),
(11, 'ノートPC', 'ノートパソコン', 1, 1),
(12, 'デスクトップPC', 'デスクトップパソコン', 1, 2),
(13, '周辺機器', 'PC周辺機器', 1, 3),
(21, '開発ツール', '開発用ソフトウェア', 2, 1),
(22, 'オフィスソフト', 'オフィス用ソフトウェア', 2, 2),
(31, 'プログラミング', 'プログラミング関連書籍', 3, 1),
(32, 'データベース', 'データベース関連書籍', 3, 2);

-- 商品データ
INSERT INTO products (product_id, product_name, category_id, unit_price, units_in_stock, units_on_order, reorder_level, supplier_id, description) VALUES
(1, 'ThinkPad X1 Carbon', 11, 180000, 50, 10, 5, 1, '軽量ビジネスノートPC'),
(2, 'MacBook Pro 14inch', 11, 250000, 30, 5, 3, 2, 'Apple製ノートPC'),
(3, 'Dell OptiPlex 7090', 12, 120000, 25, 0, 5, 3, 'ビジネス向けデスクトップPC'),
(4, 'HP EliteDesk 800', 12, 110000, 20, 5, 3, 4, 'コンパクトデスクトップPC'),
(5, 'ロジクール MX Master 3', 13, 12000, 100, 20, 10, 5, '高性能ワイヤレスマウス'),
(6, 'HHKB Professional', 13, 25000, 40, 0, 5, 6, '高級キーボード'),
(7, 'Visual Studio Professional', 21, 80000, 999, 0, 10, 7, '統合開発環境'),
(8, 'Microsoft Office 365', 22, 15000, 999, 0, 20, 8, 'オフィススイート'),
(9, 'SQL実践入門', 32, 3500, 200, 50, 20, 9, 'データベース学習書'),
(10, 'Python入門書', 31, 2800, 150, 30, 15, 9, 'プログラミング学習書');

-- 注文データ
INSERT INTO orders (order_id, customer_id, employee_id, order_date, required_date, shipped_date, freight, ship_name, ship_city, status, total_amount) VALUES
(1001, 1, 102, '2024-01-15', '2024-01-25', '2024-01-20', 1500, '株式会社アルファ', '東京', 'SHIPPED', 540000),
(1002, 2, 103, '2024-01-20', '2024-01-30', NULL, 2000, '株式会社ベータ', '大阪', 'PROCESSING', 250000),
(1003, 3, 102, '2024-02-01', '2024-02-10', '2024-02-05', 1200, '株式会社ガンマ', '名古屋', 'SHIPPED', 180000),
(1004, 1, 101, '2024-02-10', '2024-02-20', NULL, 1800, '株式会社アルファ', '東京', 'PENDING', 320000),
(1005, 4, 103, '2024-02-15', '2024-02-25', '2024-02-18', 800, '株式会社デルタ', '福岡', 'SHIPPED', 95000);

-- 注文詳細データ
INSERT INTO order_details (order_id, product_id, unit_price, quantity, discount) VALUES
(1001, 1, 180000, 2, 0.05),
(1001, 5, 12000, 5, 0.00),
(1001, 9, 3500, 10, 0.10),
(1002, 2, 250000, 1, 0.00),
(1003, 3, 120000, 1, 0.00),
(1003, 6, 25000, 2, 0.05),
(1003, 8, 15000, 2, 0.00),
(1004, 4, 110000, 2, 0.00),
(1004, 7, 80000, 1, 0.05),
(1004, 10, 2800, 5, 0.00),
(1005, 5, 12000, 3, 0.00),
(1005, 6, 25000, 2, 0.10),
(1005, 9, 3500, 5, 0.00);

-- ============================================================================
-- 大量データ生成（Level 3用）
-- ============================================================================

-- 売上実績データ（過去2年分のサンプルデータ）
INSERT INTO sales_records (sale_date, employee_id, customer_id, product_id, quantity, unit_price, discount_rate, sales_amount, cost_amount, profit_amount, region, sales_channel)
SELECT 
    DATE_ADD('2022-01-01', INTERVAL FLOOR(RAND() * 730) DAY) as sale_date,
    100 + FLOOR(RAND() * 4) as employee_id,
    1 + FLOOR(RAND() * 5) as customer_id,
    1 + FLOOR(RAND() * 10) as product_id,
    1 + FLOOR(RAND() * 10) as quantity,
    CASE 
        WHEN FLOOR(RAND() * 10) + 1 <= 2 THEN 180000 + (RAND() * 70000)
        WHEN FLOOR(RAND() * 10) + 1 <= 4 THEN 120000 + (RAND() * 30000)
        ELSE 3000 + (RAND() * 22000)
    END as unit_price,
    CASE WHEN RAND() < 0.3 THEN ROUND(RAND() * 0.15, 2) ELSE 0 END as discount_rate,
    0 as sales_amount, -- 後で計算
    0 as cost_amount,   -- 後で計算
    0 as profit_amount, -- 後で計算
    CASE 
        WHEN RAND() < 0.4 THEN '関東'
        WHEN RAND() < 0.7 THEN '関西'
        WHEN RAND() < 0.85 THEN '中部'
        ELSE '九州'
    END as region,
    CASE 
        WHEN RAND() < 0.6 THEN '直販'
        WHEN RAND() < 0.85 THEN 'オンライン'
        ELSE '代理店'
    END as sales_channel
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t2,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t3,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t4
LIMIT 1000;

-- 売上金額の計算
UPDATE sales_records 
SET 
    sales_amount = ROUND(unit_price * quantity * (1 - discount_rate), 2),
    cost_amount = ROUND(unit_price * quantity * 0.6, 2);

UPDATE sales_records 
SET profit_amount = sales_amount - cost_amount;

-- ============================================================================
-- ビュー作成（Level 2-3用）
-- ============================================================================

-- 従業員詳細ビュー
CREATE VIEW employee_details AS
SELECT 
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) as full_name,
    e.email,
    e.job_title,
    e.salary,
    d.department_name,
    d.location,
    CONCAT(m.first_name, ' ', m.last_name) as manager_name,
    DATEDIFF(CURRENT_DATE, e.hire_date) as days_employed
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
LEFT JOIN employees m ON e.manager_id = m.employee_id;

-- 売上サマリビュー
CREATE VIEW sales_summary AS
SELECT 
    DATE_FORMAT(sale_date, '%Y-%m') as sales_month,
    region,
    sales_channel,
    COUNT(*) as transaction_count,
    SUM(quantity) as total_quantity,
    SUM(sales_amount) as total_sales,
    SUM(profit_amount) as total_profit,
    AVG(sales_amount) as avg_sales_per_transaction
FROM sales_records
GROUP BY DATE_FORMAT(sale_date, '%Y-%m'), region, sales_channel;

-- 商品売上ランキングビュー
CREATE VIEW product_sales_ranking AS
SELECT 
    p.product_id,
    p.product_name,
    c.category_name,
    SUM(sr.quantity) as total_quantity_sold,
    SUM(sr.sales_amount) as total_sales_amount,
    COUNT(DISTINCT sr.customer_id) as unique_customers,
    AVG(sr.unit_price) as avg_unit_price
FROM products p
JOIN sales_records sr ON p.product_id = sr.product_id
JOIN categories c ON p.category_id = c.category_id
GROUP BY p.product_id, p.product_name, c.category_name
ORDER BY total_sales_amount DESC;

-- ============================================================================
-- ストアドプロシージャ作成（Level 3用）
-- ============================================================================

DELIMITER //

-- 従業員の昇給処理
CREATE PROCEDURE raise_salary(
    IN emp_id INT,
    IN raise_percentage DECIMAL(5,2)
)
BEGIN
    DECLARE current_salary DECIMAL(10,2);
    DECLARE new_salary DECIMAL(10,2);
    
    -- 現在の給与を取得
    SELECT salary INTO current_salary 
    FROM employees 
    WHERE employee_id = emp_id;
    
    -- 新しい給与を計算
    SET new_salary = current_salary * (1 + raise_percentage / 100);
    
    -- 給与を更新
    UPDATE employees 
    SET salary = new_salary, updated_at = CURRENT_TIMESTAMP
    WHERE employee_id = emp_id;
    
    -- 結果を返す
    SELECT 
        emp_id as employee_id,
        current_salary as old_salary,
        new_salary as new_salary,
        raise_percentage as raise_percentage;
END //

-- 月次売上レポート生成
CREATE PROCEDURE monthly_sales_report(
    IN report_year INT,
    IN report_month INT
)
BEGIN
    SELECT 
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.department_name,
        COUNT(sr.record_id) as sales_count,
        SUM(sr.sales_amount) as total_sales,
        SUM(sr.profit_amount) as total_profit,
        AVG(sr.sales_amount) as avg_sales_per_transaction
    FROM employees e
    LEFT JOIN sales_records sr ON e.employee_id = sr.employee_id 
        AND YEAR(sr.sale_date) = report_year 
        AND MONTH(sr.sale_date) = report_month
    JOIN departments d ON e.department_id = d.department_id
    WHERE e.department_id = 10  -- 営業部のみ
    GROUP BY e.employee_id, e.first_name, e.last_name, d.department_name
    ORDER BY total_sales DESC;
END //

DELIMITER ;

-- ============================================================================
-- トリガー作成（Level 3用）
-- ============================================================================

DELIMITER //

-- 注文詳細の合計金額を注文テーブルに自動更新
CREATE TRIGGER update_order_total
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT SUM(unit_price * quantity * (1 - discount))
        FROM order_details 
        WHERE order_id = NEW.order_id
    )
    WHERE order_id = NEW.order_id;
END //

-- 商品在庫の自動更新
CREATE TRIGGER update_product_stock
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE products 
    SET units_in_stock = units_in_stock - NEW.quantity
    WHERE product_id = NEW.product_id;
END //

DELIMITER ;

-- ============================================================================
-- 学習用データ確認クエリ
-- ============================================================================

-- データ件数確認
SELECT 'departments' as table_name, COUNT(*) as record_count FROM departments
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_details', COUNT(*) FROM order_details
UNION ALL
SELECT 'sales_records', COUNT(*) FROM sales_records;

-- ============================================================================
-- 完了メッセージ
-- ============================================================================

SELECT 'サンプルデータベースの作成が完了しました！（管理者権限版）' as message;
SELECT 'Level 1-3の学習に必要なテーブル、データ、ビュー、プロシージャが準備されています。' as info;
SELECT '学習用ユーザー learning_user も作成されました。パスワード: learning123' as user_info;