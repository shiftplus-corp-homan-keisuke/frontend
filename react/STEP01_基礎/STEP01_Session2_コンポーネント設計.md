# Session2: コンポーネント設計（90分）

> 💡 **対象**: Session1完了者（React基礎概念理解済み）
> 🎯 **形式**: 講師サポート付き実践学習
> ⏰ **時間**: 90分

## 📚 関連補足資料

このセッションの学習をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./STEP01_補足_実践コード例.md)** - コンポーネント設計パターンと実装例
- 📖 **[専門用語集](./STEP01_補足_専門用語集.md)** - Props、再利用性、スタイリング手法の詳細解説
- 🚨 **[トラブルシューティング](./STEP01_補足_トラブルシューティング.md)** - コンポーネント設計のよくあるエラー
- 🌐 **[参考リソース](./STEP01_補足_参考リソース.md)** - コンポーネント設計のベストプラクティス
- 🔧 **[開発環境ガイド](./STEP01_補足_開発環境ガイド.md)** - 開発効率を上げる設定

> 💡 **活用方法**: 実装中に疑問が生じた際や、設計パターンを確認したい場合にご参照ください。

## 📅 セッション概要

**学習目標**:
- [ ] 再利用可能なコンポーネント設計の理解
- [ ] Props型定義とインターフェース設計の習得
- [ ] Reactコンポーネントのスタイリング手法の理解
- [ ] コンポーネント分割とコンポジションの実践

**前提知識**:
- Session1の内容（React基礎概念・JSX・TypeScript統合）
- TypeScript上級レベルの型システム理解

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割           | 学習者の活動     | 成果物         |
| ------------ | -------------------------- | -------------------- | ---------------- | -------------- |
| **0-10分**   | 前回復習・今回目標         | 復習確認・目標提示   | 振り返り・質問   | 理解確認       |
| **10-40分**  | コンポーネント設計理論     | 実演・個別指導       | ハンズオン・実践 | 設計パターン   |
| **40-70分**  | Props設計とスタイリング    | コードレビュー・助言 | 個人開発         | 再利用コンポーネント |
| **70-90分**  | 成果共有・質疑応答         | ファシリテート       | 発表・討論       | 学習成果       |

---

## 📚 学習内容

### Section 1: コンポーネントの作成と再利用（30分）

> 📚 **関連資料**: [実践コード例 - コンポーネント設計](./STEP01_補足_実践コード例.md#コンポーネント設計) | [専門用語集 - コンポーネント再利用性](./STEP01_補足_専門用語集.md#コンポーネント再利用性)

#### 🔍 再利用可能なコンポーネント設計

**💡 なぜ再利用性が重要なのか**

TypeScript上級者にとって、再利用可能なコンポーネント設計は以下の利点をもたらします：

**1. 型安全性の継承**
- 一度定義した型定義を複数箇所で安全に再利用
- ジェネリクスを活用した柔軟な型制約
- インターフェースによる契約の明確化

**2. 保守性の向上**
- 単一責任原則に基づく明確な責任分離
- 変更影響範囲の限定化
- 型システムによる破壊的変更の早期発見

**3. 開発効率の向上**
- 一度作成したコンポーネントの効率的な再利用
- 型推論による開発支援の最大化
- 統一されたUIパターンの確立

#### 🎯 基本的なコンポーネント設計

```tsx
// 基本的なButtonコンポーネント
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

function Button({
  variant,
  size,
  disabled = false,
  loading = false,
  onClick,
  children
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const className = `${baseClasses} ${variantClasses} ${sizeClasses}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (!disabled && !loading) {
      onClick(event);
    }
  };

  return (
    <button
      className={className}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

// 使用例
const App: React.FC = () => {
  const handleSave = (): void => {
    console.log('保存処理');
  };

  const handleDelete = (): void => {
    console.log('削除処理');
  };

  return (
    <div>
      <Button variant="primary" size="medium" onClick={handleSave}>
        保存
      </Button>
      <Button variant="danger" size="small" onClick={handleDelete}>
        削除
      </Button>
    </div>
  );
};
```

#### 🔧 ジェネリクスを活用した高度なコンポーネント

```tsx
// ジェネリクスを使用したListコンポーネント
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function List<T>({ 
  items, 
  renderItem, 
  keyExtractor, 
  emptyMessage = "アイテムがありません" 
}: ListProps<T>): JSX.Element {
  if (items.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }

  return (
    <ul className="list">
      {items.map((item, index) => (
        <li key={keyExtractor(item)} className="list-item">
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// 使用例
interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const users: User[] = [
    { id: 1, name: "太郎", email: "taro@example.com" },
    { id: 2, name: "花子", email: "hanako@example.com" }
  ];

  return (
    <List
      items={users}
      keyExtractor={(user) => user.id}
      renderItem={(user) => (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
    />
  );
};
```

---

### Section 2: Propsの理解と型設計（30分）

> 📚 **関連資料**: [実践コード例 - Props設計](./STEP01_補足_実践コード例.md#props設計) | [専門用語集 - Props型定義](./STEP01_補足_専門用語集.md#props型定義)

#### 🎯 Props型定義のベストプラクティス

**基本的なProps設計**

```tsx
// 基本的なProps型定義
interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  showEmail?: boolean;
  onEdit?: (userId: number) => void;
  onDelete?: (userId: number) => void;
}

function UserCard({
  user,
  showEmail = true,
  onEdit,
  onDelete
}: UserCardProps) {
  return (
    <div className="user-card">
      <div className="user-info">
        {user.avatar && (
          <img src={user.avatar} alt={`${user.name}のアバター`} />
        )}
        <h3>{user.name}</h3>
        {showEmail && <p>{user.email}</p>}
      </div>
      
      <div className="user-actions">
        {onEdit && (
          <button onClick={() => onEdit(user.id)}>編集</button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(user.id)}>削除</button>
        )}
      </div>
    </div>
  );
};
```

**高度なProps設計パターン**

```tsx
// ユニオン型を活用したProps設計
interface BaseCardProps {
  title: string;
  className?: string;
}

interface EditableCardProps extends BaseCardProps {
  mode: 'editable';
  onSave: (data: any) => void;
  onCancel: () => void;
}

interface ReadOnlyCardProps extends BaseCardProps {
  mode: 'readonly';
  content: React.ReactNode;
}

type CardProps = EditableCardProps | ReadOnlyCardProps;

function Card(props: CardProps) {
  const { title, className = '' } = props;

  return (
    <div className={`card ${className}`}>
      <h2>{title}</h2>
      
      {props.mode === 'editable' ? (
        <div>
          {/* 編集可能なコンテンツ */}
          <button onClick={props.onSave}>保存</button>
          <button onClick={props.onCancel}>キャンセル</button>
        </div>
      ) : (
        <div>
          {props.content}
        </div>
      )}
    </div>
  );
};
```

**Children Propsの活用**

```tsx
// Children Propsを活用したレイアウトコンポーネント
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// 使用例
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        モーダルを開く
      </button>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="確認"
      >
        <p>この操作を実行しますか？</p>
        <button onClick={() => setIsModalOpen(false)}>はい</button>
        <button onClick={() => setIsModalOpen(false)}>いいえ</button>
      </Modal>
    </div>
  );
};
```

---

### Section 3: Reactコンポーネントのスタイリング（30分）

> 📚 **関連資料**: [実践コード例 - スタイリング手法](./STEP01_補足_実践コード例.md#スタイリング手法)

#### 🎨 スタイリング手法の比較

**1. インラインCSS**

```tsx
interface AlertProps {
  type: 'success' | 'warning' | 'error';
  message: string;
}

function Alert({ type, message }: AlertProps) {
  const getAlertStyles = (type: string): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '16px',
      fontWeight: 'bold'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb'
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffeaa7'
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb'
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div style={getAlertStyles(type)}>
      {message}
    </div>
  );
};
```

**2. CSS Modules**

```tsx
// Alert.module.css
/*
.alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-weight: bold;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
*/

import styles from './Alert.module.css';

interface AlertProps {
  type: 'success' | 'warning' | 'error';
  message: string;
}

function Alert({ type, message }: AlertProps) {
  const className = `${styles.alert} ${styles[type]}`;

  return (
    <div className={className}>
      {message}
    </div>
  );
};
```

**3. Styled Components（TypeScript対応）**

```tsx
import styled, { css } from 'styled-components';

// 型定義
interface AlertStyledProps {
  $type: 'success' | 'warning' | 'error';
}

// Styled Component
const AlertContainer = styled.div<AlertStyledProps>`
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-weight: bold;

  ${({ $type }) => {
    switch ($type) {
      case 'success':
        return css`
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        `;
      case 'warning':
        return css`
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        `;
      case 'error':
        return css`
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        `;
      default:
        return '';
    }
  }}
`;

// コンポーネント
interface AlertProps {
  type: 'success' | 'warning' | 'error';
  message: string;
}

function Alert({ type, message }: AlertProps) {
  return (
    <AlertContainer $type={type}>
      {message}
    </AlertContainer>
  );
};
```

---

## 🎯 実践演習

### 演習1: 再利用可能なInputコンポーネント（20分）

以下の要件を満たすInputコンポーネントを作成してください：

```tsx
// 要件:
// 1. type: 'text' | 'email' | 'password' | 'number'
// 2. label?: string (ラベル表示)
// 3. placeholder?: string
// 4. required?: boolean
// 5. error?: string (エラーメッセージ表示)
// 6. onChange: (value: string) => void
// 7. 適切な型定義とスタイリング

interface InputProps {
  // ここに型定義を実装
}

function Input(props: InputProps) {
  // ここに実装
};

// 使用例
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <form>
      <Input
        type="email"
        label="メールアドレス"
        placeholder="example@email.com"
        required
        onChange={setEmail}
      />
      <Input
        type="password"
        label="パスワード"
        required
        onChange={setPassword}
      />
    </form>
  );
};
```

### 演習2: カードコンポーネントの設計（15分）

```tsx
// 要件:
// 1. title: string
// 2. image?: string
// 3. description?: string
// 4. actions?: React.ReactNode (ボタンエリア)
// 5. onClick?: () => void (カード全体のクリック)
// 6. 適切なレスポンシブ対応

// ここに実装してください
```

---

## 👨‍🏫 学習ポイント

### 🤔 よくある質問と回答

**Q: Props型定義でオプショナルプロパティはいつ使うべきですか？**
A: デフォルト値が設定できる、または機能的に必須でない場合に使用します。ただし、過度なオプショナル化は型安全性を損なうので注意が必要です。

**Q: ジェネリクスを使ったコンポーネントはいつ作るべきですか？**
A: 同じ構造で異なる型のデータを扱う場合（リスト、テーブル、フォームなど）に有効です。ただし、複雑になりすぎないよう注意しましょう。

**Q: スタイリング手法はどれを選ぶべきですか？**
A: プロジェクトの規模と要件によります。小規模ならCSS Modules、大規模でデザインシステムが必要ならStyled Components、パフォーマンス重視ならTailwind CSSが推奨されます。

---

**📌 重要**: Session2では再利用可能なコンポーネント設計の基礎を学習しました。TypeScriptの型システムを活用して、保守性の高いコンポーネントを作成することが重要です。

**🌟 次回（Session3）は、ステート管理とイベントハンドリングについて学習します！**