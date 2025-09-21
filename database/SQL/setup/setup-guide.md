# データベーススペシャリスト試験 SQL学習教材 - 環境構築ガイド

## 🎯 概要

このガイドでは、SQL学習教材を効果的に活用するための学習環境の構築方法を説明します。複数のデータベース管理システム（DBMS）に対応しており、お好みの環境を選択して構築できます。

## 📋 前提条件

- **OS**: Windows 10/11、macOS 10.15以上、Ubuntu 18.04以上
- **メモリ**: 最低4GB（推奨8GB以上）
- **ストレージ**: 最低2GB の空き容量
- **ネットワーク**: インターネット接続（ソフトウェアダウンロード用）

## 🛠️ 推奨データベース管理システム

### 1. MySQL（推奨）
**特徴**: 最も広く使用されているオープンソースRDBMS  
**推奨理由**: 豊富な学習リソース、優れたパフォーマンス、ウィンドウ関数サポート

#### インストール手順

##### Windows
1. [MySQL公式サイト](https://dev.mysql.com/downloads/mysql/)からMySQL Community Serverをダウンロード
2. MySQL Installerを実行し、以下を選択：
   - **Setup Type**: Developer Default
   - **MySQL Server**: 8.0.x（最新版）
   - **MySQL Workbench**: 8.0.x（最新版）
3. rootパスワードを設定（学習用なので簡単なものでOK）
4. インストール完了後、MySQL Workbenchを起動して接続確認

##### macOS
```bash
# Homebrewを使用（推奨）
brew install mysql
brew install --cask mysql-workbench

# MySQLサービス開始
brew services start mysql

# rootパスワード設定
mysql_secure_installation
```

##### Ubuntu/Linux
```bash
# パッケージ更新
sudo apt update

# MySQL Server インストール
sudo apt install mysql-server mysql-client

# MySQL Workbench インストール
sudo apt install mysql-workbench-community

# セキュリティ設定
sudo mysql_secure_installation
```

#### 接続確認
```bash
# コマンドラインから接続
mysql -u root -p

# 接続成功時の表示例
mysql> SELECT VERSION();
+-------------------------+
| VERSION()               |
+-------------------------+
| 8.0.35-0ubuntu0.22.04.1 |
+-------------------------+
```

### 2. PostgreSQL
**特徴**: 高機能なオープンソースRDBMS  
**推奨理由**: 標準SQL準拠、高度な機能サポート、優れた拡張性

#### インストール手順

##### Windows
1. [PostgreSQL公式サイト](https://www.postgresql.org/download/windows/)からインストーラーをダウンロード
2. インストーラーを実行し、以下を選択：
   - **PostgreSQL Server**: 13.x以上
   - **pgAdmin 4**: 最新版
   - **Command Line Tools**: チェック
3. superuserパスワードを設定
4. ポート番号: 5432（デフォルト）

##### macOS
```bash
# Homebrewを使用
brew install postgresql
brew install --cask pgadmin4

# PostgreSQLサービス開始
brew services start postgresql

# データベース作成
createdb $USER
```

##### Ubuntu/Linux
```bash
# PostgreSQL インストール
sudo apt install postgresql postgresql-contrib

# pgAdmin インストール
sudo apt install pgadmin4

# PostgreSQLユーザー設定
sudo -u postgres createuser --interactive
sudo -u postgres createdb your_username
```

#### 接続確認
```bash
# コマンドラインから接続
psql -U postgres

# 接続成功時の表示例
postgres=# SELECT version();
                                                 version
---------------------------------------------------------------------------------------------------------
 PostgreSQL 13.12 (Ubuntu 13.12-1.pgdg22.04.1) on x86_64-pc-linux-gnu, compiled by gcc (GCC) 11.3.0
```

### 3. SQLite（軽量学習用）
**特徴**: ファイルベースの軽量RDBMS  
**推奨理由**: インストール不要、学習に最適、ポータブル

#### インストール手順

##### Windows
1. [SQLite公式サイト](https://www.sqlite.org/download.html)からsqlite-tools-win32をダウンロード
2. ZIPファイルを展開し、PATHに追加
3. [DB Browser for SQLite](https://sqlitebrowser.org/)をダウンロード・インストール

##### macOS
```bash
# SQLiteは標準でインストール済み
sqlite3 --version

# GUIツールのインストール
brew install --cask db-browser-for-sqlite
```

##### Ubuntu/Linux
```bash
# SQLite インストール
sudo apt install sqlite3

# GUIツールのインストール
sudo apt install sqlitebrowser
```

#### 接続確認
```bash
# データベースファイル作成・接続
sqlite3 test.db

# 接続成功時の表示例
SQLite version 3.37.2 2022-01-06 13:25:41
sqlite> .databases
main: /path/to/test.db r/w
```

## 🗄️ サンプルデータベースのセットアップ

### 🚨 重要：権限レベル別セットアップ

**権限エラー「Access denied for user 'user'@'%' to database 'learning_db'」が発生した場合は、以下の権限レベル別セットアップを使用してください。**

#### 📋 権限レベルの確認方法

まず、あなたの権限レベルを確認してください：

```sql
-- MySQL権限確認
SHOW GRANTS FOR CURRENT_USER();

-- PostgreSQL権限確認
\du
```

### 1. 管理者権限でのセットアップ（推奨）

**対象者**: root、postgres、管理者権限を持つユーザー
**ファイル**: [`sample-database-admin.sql`](sample-database-admin.sql)

**特徴**:
- データベース作成から全て実行
- 学習用ユーザー `learning_user` を自動作成
- 完全な学習環境を一括構築

```bash
# MySQLの場合（管理者権限）
mysql -u root -p < sample-database-admin.sql

# PostgreSQLの場合（管理者権限）
psql -U postgres -f sample-database-admin.sql
```

**実行後の確認**:
```sql
-- 作成されたデータベースとユーザーを確認
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'learning_user';
```

### 2. 一般ユーザー権限でのセットアップ

**対象者**: データベース作成権限がないユーザー
**ファイル**: [`sample-database-user.sql`](sample-database-user.sql)

**前提条件**:
- データベース `learning_db` が既に作成されていること
- 以下の権限が付与されていること：
  - SELECT, INSERT, UPDATE, DELETE
  - CREATE, DROP, INDEX, ALTER

**事前準備**（管理者に依頼）:
```sql
-- 管理者が実行する必要がある準備コマンド
CREATE DATABASE learning_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'learning_user'@'localhost' IDENTIFIED BY 'learning123';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON learning_db.* TO 'learning_user'@'localhost';
FLUSH PRIVILEGES;
```

**実行方法**:
```bash
# MySQLの場合（一般ユーザー）
mysql -u learning_user -p learning_db < sample-database-user.sql

# PostgreSQLの場合（一般ユーザー）
psql -U learning_user -d learning_db -f sample-database-user.sql
```

### 3. SQLiteでのセットアップ（権限不要）

**対象者**: 権限管理が不要な軽量学習環境を希望する方
**ファイル**: [`sample-database-sqlite.sql`](sample-database-sqlite.sql)

**特徴**:
- インストール不要
- 権限管理不要
- ファイルベースで軽量
- 学習に最適

```bash
# SQLiteの場合（権限不要）
sqlite3 learning.db < sample-database-sqlite.sql

# または、SQLiteコマンドライン内で
sqlite3 learning.db
.read sample-database-sqlite.sql
```

### 4. 従来のセットアップ（互換性維持）

**ファイル**: [`sample-database.sql`](sample-database.sql)

```bash
# MySQLの場合
mysql -u root -p < sample-database.sql

# PostgreSQLの場合
psql -U postgres -f sample-database.sql

# SQLiteの場合
sqlite3 learning.db < sample-database.sql
```

### 2. データベース構造の確認

作成されたテーブルを確認します。

#### MySQL/PostgreSQL
```sql
-- データベース一覧表示
SHOW DATABASES;  -- MySQL
\l               -- PostgreSQL

-- テーブル一覧表示
USE learning_db; -- MySQL
\c learning_db   -- PostgreSQL
SHOW TABLES;     -- MySQL
\dt              -- PostgreSQL

-- テーブル構造確認
DESCRIBE employees;     -- MySQL
\d employees           -- PostgreSQL
```

#### SQLite
```sql
-- テーブル一覧表示
.tables

-- テーブル構造確認
.schema employees

-- データ確認
SELECT * FROM employees LIMIT 5;
```

## 🔧 開発ツールの設定

### 1. MySQL Workbench（MySQL用）

#### 接続設定
1. MySQL Workbenchを起動
2. 「+」ボタンをクリックして新しい接続を作成
3. 接続情報を入力：
   - **Connection Name**: Learning DB
   - **Hostname**: localhost
   - **Port**: 3306
   - **Username**: root
   - **Password**: （設定したパスワード）
4. 「Test Connection」で接続確認

#### 便利な設定
- **SQL Editor** → **Query** → **Limit Rows**: 1000に設定
- **Edit** → **Preferences** → **SQL Editor** → **Safe Updates**: チェックを外す（学習用）

### 2. pgAdmin（PostgreSQL用）

#### 接続設定
1. pgAdmin 4を起動
2. 左パネルで「Servers」を右クリック → 「Create」 → 「Server」
3. 接続情報を入力：
   - **General** → **Name**: Learning DB
   - **Connection** → **Host**: localhost
   - **Port**: 5432
   - **Username**: postgres
   - **Password**: （設定したパスワード）
4. 「Save」で接続作成

### 3. DBeaver（汎用ツール）

#### インストール
- [DBeaver公式サイト](https://dbeaver.io/download/)からCommunity Editionをダウンロード・インストール

#### 接続設定
1. DBeaver起動後、「New Database Connection」をクリック
2. 使用するDBMSを選択（MySQL、PostgreSQL、SQLite等）
3. 接続情報を入力
4. 「Test Connection」で確認後、「Finish」

## 📊 学習データの準備

### 1. サンプルデータの投入

```sql
-- 学習用データベースの作成
CREATE DATABASE learning_db;
USE learning_db;  -- MySQL
-- \c learning_db  -- PostgreSQL

-- サンプルデータの投入は sample-database.sql を参照
```

### 2. データ量の調整

学習レベルに応じてデータ量を調整できます：

```sql
-- 小規模データセット（Level 1用）
SELECT * FROM employees LIMIT 100;

-- 中規模データセット（Level 2用）
SELECT * FROM employees LIMIT 10000;

-- 大規模データセット（Level 3用）
SELECT * FROM employees;  -- 全データ
```

## 🚀 パフォーマンス最適化設定

### MySQL設定

#### my.cnf（設定ファイル）の調整
```ini
[mysqld]
# 学習用の基本設定
innodb_buffer_pool_size = 1G
query_cache_size = 256M
max_connections = 100

# ログ設定（学習用）
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

### PostgreSQL設定

#### postgresql.conf の調整
```ini
# 学習用の基本設定
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB

# ログ設定（学習用）
log_statement = 'all'
log_min_duration_statement = 1000
```

## 🔍 トラブルシューティング

### 🚨 権限エラーの解決方法

#### エラー: Access denied for user 'user'@'%' to database 'learning_db'

このエラーは、データベース作成権限がないユーザーで管理者用スクリプトを実行しようとした場合に発生します。

**解決方法1: 管理者権限で実行**
```bash
# rootユーザーで実行
mysql -u root -p < sample-database-admin.sql
```

**解決方法2: 一般ユーザー用スクリプトを使用**
```bash
# 事前に管理者がデータベースを作成
mysql -u root -p -e "CREATE DATABASE learning_db; CREATE USER 'learning_user'@'localhost' IDENTIFIED BY 'learning123'; GRANT ALL PRIVILEGES ON learning_db.* TO 'learning_user'@'localhost'; FLUSH PRIVILEGES;"

# 一般ユーザーでスクリプト実行
mysql -u learning_user -p learning_db < sample-database-user.sql
```

**解決方法3: SQLiteを使用（権限不要）**
```bash
sqlite3 learning.db < sample-database-sqlite.sql
```

#### エラー: Unknown database 'learning_db'

**原因**: データベースが作成されていない
**解決方法**:
```sql
-- 管理者権限で実行
CREATE DATABASE learning_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### エラー: Table 'learning_db.xxx' doesn't exist

**原因**: テーブルが正しく作成されていない
**解決方法**:
```sql
-- データベースとテーブルの確認
USE learning_db;
SHOW TABLES;

-- テーブルが存在しない場合は、適切なスクリプトを再実行
```

#### エラー: User 'learning_user'@'localhost' already exists

**原因**: ユーザーが既に存在している
**解決方法**:
```sql
-- MySQL: 既存ユーザーを削除して再作成
DROP USER IF EXISTS 'learning_user'@'localhost';
CREATE USER 'learning_user'@'localhost' IDENTIFIED BY 'learning123';
GRANT ALL PRIVILEGES ON learning_db.* TO 'learning_user'@'localhost';
FLUSH PRIVILEGES;

-- PostgreSQL: 既存ユーザーを削除して再作成
DROP USER IF EXISTS learning_user;
CREATE USER learning_user WITH PASSWORD 'learning123';
GRANT ALL PRIVILEGES ON DATABASE learning_db TO learning_user;
```

### よくある問題と解決方法

#### 1. 接続エラー
```bash
# MySQLサービス状態確認
sudo systemctl status mysql    # Linux
brew services list | grep mysql # macOS

# PostgreSQLサービス状態確認
sudo systemctl status postgresql    # Linux
brew services list | grep postgresql # macOS

# サービス再起動
sudo systemctl restart mysql        # Linux MySQL
sudo systemctl restart postgresql   # Linux PostgreSQL
brew services restart mysql         # macOS MySQL
brew services restart postgresql    # macOS PostgreSQL
```

#### 2. 権限エラー
```sql
-- MySQL権限確認・付与
SHOW GRANTS FOR 'root'@'localhost';
GRANT ALL PRIVILEGES ON learning_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- PostgreSQL権限確認・付与
\du  -- ユーザー一覧
GRANT ALL PRIVILEGES ON DATABASE learning_db TO postgres;
```

#### 3. 文字化け問題
```sql
-- MySQL文字セット確認・設定
SHOW VARIABLES LIKE 'character_set%';
ALTER DATABASE learning_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- PostgreSQL文字セット確認
\l  -- データベース一覧で文字セット確認
```

#### 4. メモリ不足エラー
```sql
-- MySQL設定確認
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';

-- PostgreSQL設定確認
SHOW shared_buffers;
SHOW work_mem;
```

## 📝 学習環境の確認チェックリスト

### 基本環境
- [ ] DBMS（MySQL/PostgreSQL/SQLite）のインストール完了
- [ ] GUIツール（Workbench/pgAdmin/DBeaver）のインストール完了
- [ ] データベースへの接続確認完了
- [ ] サンプルデータベースの作成完了

### 学習準備
- [ ] 学習用データの投入完了
- [ ] 基本的なSQLクエリの実行確認
- [ ] 実行計画の表示確認（Level 3用）
- [ ] ログ出力の設定確認（デバッグ用）

### パフォーマンス
- [ ] メモリ設定の最適化完了
- [ ] インデックス作成の確認
- [ ] クエリ実行時間の測定確認

## 🎓 次のステップ

環境構築が完了したら、以下の順序で学習を開始してください：

1. **Level 1: Foundation** - [`../level1-foundation/README.md`](../level1-foundation/README.md)
2. **Level 2: Application** - [`../level2-application/README.md`](../level2-application/README.md)
3. **Level 3: Mastery** - [`../level3-mastery/README.md`](../level3-mastery/README.md)

## 🤝 サポート

環境構築で問題が発生した場合：

1. このガイドのトラブルシューティングセクションを確認
2. 各DBMSの公式ドキュメントを参照
3. オンラインコミュニティで情報収集
4. 段階的に問題を切り分けて解決

---

**学習環境の構築、お疲れさまでした！** 🎉  
これで効果的なSQL学習を始める準備が整いました。頑張ってください！ 💪📚