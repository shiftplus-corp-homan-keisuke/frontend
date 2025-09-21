-- ============================================================================
-- データベーススペシャリスト試験 SQL学習教材
-- サンプルデータベース作成スクリプト（SQLite用）
-- ============================================================================

-- ============================================================================
-- 【重要】実行前の確認事項
-- ============================================================================
-- このスクリプトはSQLite用に最適化されています。
-- 以下の特徴があります：
-- - 権限管理は不要（ファイルベースのデータベース）
-- - インストール不要で軽量
-- - 学習に最適
-- 
-- 実行方法：
-- sqlite3 learning.db < sample-database-sqlite.sql
-- 
-- または、SQLiteコマンドラインで：
-- sqlite3 learning.db
-- .read sample-database-sqlite.sql
-- ============================================================================

-- SQLite固有の設定
PRAGMA foreign_keys = ON;  -- 外部キー制約を有効化
PRAGMA journal_mode = WAL; -- パフォーマンス向上

-- 既存のテーブルがある場合は削除（学習用データのリセット）
-- 外部キー制約の関係で削除順序に注意
DROP TABLE IF EXISTS sales_records;
DROP TABLE IF EXISTS order_details;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

-- ビューが存在する場合は削除
DROP VIEW IF EXISTS product_sales_ranking;
DROP VIEW IF EXISTS sales_summary;
DROP VIEW IF EXISTS employee_details;

-- ============================================================================
-- テーブル作成
-- ============================================================================

-- 部署テーブル
CREATE TABLE departments (
    department_id INTEGER PRIMARY KEY,
    department_name TEXT NOT NULL,
    location TEXT,
    manager_id INTEGER,
    budget REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 従業員テーブル
CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    hire_date DATE NOT NULL,
    job_title TEXT NOT NULL,
    salary REAL NOT NULL,
    commission_pct REAL,
    manager_id INTEGER,
    department_id INTEGER,
    status TEXT DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

-- 従業員テーブルのupdated_atを自動更新するトリガー
CREATE TRIGGER update_employees_updated_at
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    UPDATE employees SET updated_at = CURRENT_TIMESTAMP WHERE employee_id = NEW.employee_id;
END;

-- 顧客テーブル
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    contact_title TEXT,
    address TEXT,
    city TEXT,
    region TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Japan',
    phone TEXT,
    email TEXT,
    credit_limit REAL,
    registration_date DATE DEFAULT (DATE('now')),
    status TEXT DEFAULT 'ACTIVE'
);

-- 商品カテゴリテーブル
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY,
    category_name TEXT NOT NULL,
    description TEXT,
    parent_category_id INTEGER,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,  -- SQLiteではBOOLEANの代わりにINTEGERを使用
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);

-- 商品テーブル
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    units_in_stock INTEGER DEFAULT 0,
    units_on_order INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    discontinued INTEGER DEFAULT 0,  -- SQLiteではBOOLEANの代わりにINTEGERを使用
    supplier_id INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 商品テーブルのupdated_atを自動更新するトリガー
CREATE TRIGGER update_products_updated_at
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE product_id = NEW.product_id;
END;

-- 注文テーブル
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    employee_id INTEGER,
    order_date DATE NOT NULL,
    required_date DATE,
    shipped_date DATE,
    ship_via INTEGER,
    freight REAL DEFAULT 0,
    ship_name TEXT,
    ship_address TEXT,
    ship_city TEXT,
    ship_region TEXT,
    ship_postal_code TEXT,
    ship_country TEXT,
    status TEXT DEFAULT 'PENDING',
    total_amount REAL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- 注文詳細テーブル
CREATE TABLE order_details (
    order_id INTEGER,
    product_id INTEGER,
    unit_price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    discount REAL DEFAULT 0,
    line_total REAL,  -- SQLiteでは計算列をトリガーで実装
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 注文詳細のline_totalを自動計算するトリガー
CREATE TRIGGER calculate_line_total_insert
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE order_details 
    SET line_total = NEW.unit_price * NEW.quantity * (1 - NEW.discount)
    WHERE order_id = NEW.order_id AND product_id = NEW.product_id;
END;

CREATE TRIGGER calculate_line_total_update
AFTER UPDATE ON order_details
FOR EACH ROW
BEGIN
    UPDATE order_details 
    SET line_total = NEW.unit_price * NEW.quantity * (1 - NEW.discount)
    WHERE order_id = NEW.order_id AND product_id = NEW.product_id;
END;

-- 売上実績テーブル（Level 3用の大量データ）
CREATE TABLE sales_records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_date DATE NOT NULL,
    employee_id INTEGER,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    discount_rate REAL DEFAULT 0,
    sales_amount REAL NOT NULL,
    cost_amount REAL,
    profit_amount REAL,
    region TEXT,
    sales_channel TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
-- 大量データ生成（Level 3用）- SQLite版
-- ============================================================================

-- SQLiteでは複雑なRAND()関数が制限されるため、シンプルなデータ生成を行う
-- 売上実績データ（サンプルデータ）
INSERT INTO sales_records (sale_date, employee_id, customer_id, product_id, quantity, unit_price, discount_rate, sales_amount, cost_amount, profit_amount, region, sales_channel) VALUES
-- 2022年のデータ
('2022-01-15', 100, 1, 1, 2, 180000, 0.05, 342000, 216000, 126000, '関東', '直販'),
('2022-01-20', 101, 2, 2, 1, 250000, 0.00, 250000, 150000, 100000, '関西', 'オンライン'),
('2022-02-10', 102, 3, 3, 1, 120000, 0.10, 108000, 72000, 36000, '中部', '代理店'),
('2022-02-15', 103, 4, 4, 2, 110000, 0.00, 220000, 132000, 88000, '九州', '直販'),
('2022-03-05', 100, 5, 5, 5, 12000, 0.05, 57000, 36000, 21000, '北海道', 'オンライン'),
('2022-03-20', 101, 1, 6, 1, 25000, 0.00, 25000, 15000, 10000, '関東', '直販'),
('2022-04-10', 102, 2, 7, 1, 80000, 0.10, 72000, 48000, 24000, '関西', '代理店'),
('2022-04-25', 103, 3, 8, 3, 15000, 0.00, 45000, 27000, 18000, '中部', 'オンライン'),
('2022-05-15', 100, 4, 9, 10, 3500, 0.05, 33250, 21000, 12250, '九州', '直販'),
('2022-05-30', 101, 5, 10, 5, 2800, 0.00, 14000, 8400, 5600, '北海道', 'オンライン'),
-- 2023年のデータ
('2023-01-10', 102, 1, 1, 1, 185000, 0.00, 185000, 111000, 74000, '関東', '直販'),
('2023-01-25', 103, 2, 2, 1, 255000, 0.05, 242250, 153000, 89250, '関西', 'オンライン'),
('2023-02-14', 100, 3, 3, 2, 125000, 0.10, 225000, 150000, 75000, '中部', '代理店'),
('2023-02-28', 101, 4, 4, 1, 115000, 0.00, 115000, 69000, 46000, '九州', '直販'),
('2023-03-15', 102, 5, 5, 3, 12500, 0.05, 35625, 22500, 13125, '北海道', 'オンライン'),
-- 2024年のデータ
('2024-01-05', 103, 1, 6, 2, 26000, 0.00, 52000, 31200, 20800, '関東', '直販'),
('2024-01-18', 100, 2, 7, 1, 82000, 0.10, 73800, 49200, 24600, '関西', '代理店'),
('2024-02-08', 101, 3, 8, 2, 16000, 0.00, 32000, 19200, 12800, '中部', 'オンライン'),
('2024-02-22', 102, 4, 9, 8, 3600, 0.05, 27360, 17280, 10080, '九州', '直販'),
('2024-03-10', 103, 5, 10, 4, 2900, 0.00, 11600, 6960, 4640, '北海道', 'オンライン');

-- ============================================================================
-- ビュー作成（Level 2-3用）
-- ============================================================================

-- 従業員詳細ビュー
CREATE VIEW employee_details AS
SELECT 
    e.employee_id,
    e.first_name || ' ' || e.last_name as full_name,  -- SQLiteでは||で文字列結合
    e.email,
    e.job_title,
    e.salary,
    d.department_name,
    d.location,
    m.first_name || ' ' || m.last_name as manager_name,
    julianday('now') - julianday(e.hire_date) as days_employed  -- SQLiteの日付計算
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
LEFT JOIN employees m ON e.manager_id = m.employee_id;

-- 売上サマリビュー
CREATE VIEW sales_summary AS
SELECT 
    strftime('%Y-%m', sale_date) as sales_month,  -- SQLiteの日付フォーマット
    region,
    sales_channel,
    COUNT(*) as transaction_count,
    SUM(quantity) as total_quantity,
    SUM(sales_amount) as total_sales,
    SUM(profit_amount) as total_profit,
    AVG(sales_amount) as avg_sales_per_transaction
FROM sales_records
GROUP BY strftime('%Y-%m', sale_date), region, sales_channel;

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
-- トリガー作成（Level 3用）
-- ============================================================================

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
END;

-- 商品在庫の自動更新
CREATE TRIGGER update_product_stock
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE products 
    SET units_in_stock = units_in_stock - NEW.quantity
    WHERE product_id = NEW.product_id;
END;

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

SELECT 'サンプルデータベースの作成が完了しました！（SQLite版）' as message;
SELECT 'Level 1-3の学習に必要なテーブル、データ、ビューが準備されています。' as info;
SELECT 'SQLiteは軽量で学習に最適です。権限管理は不要です。' as note;

-- ============================================================================
-- SQLite固有の便利なコマンド（参考）
-- ============================================================================

-- テーブル一覧表示: .tables
-- テーブル構造確認: .schema table_name
-- データベース情報: .databases
-- CSV出力: .mode csv / .output filename.csv / SELECT * FROM table_name;
-- ヘルプ: .help