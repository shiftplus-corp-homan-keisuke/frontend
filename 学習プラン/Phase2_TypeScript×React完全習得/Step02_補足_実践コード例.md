# Step02_補足_実践コード例.md

# Step 2: コンポーネント型設計 - 実践コード例

> 🐰 **このファイルについて**: Generic Components、Props型設計、Component Compositionを段階的に学習できる実用的なコード例集です。

## 📖 目次

- [Level 1: 基本実装](#level-1-基本実装)
- [Level 2: 型安全な実装](#level-2-型安全な実装)
- [Level 3: 実用的な実装](#level-3-実用的な実装)
- [Level 4: 高度な実装](#level-4-高度な実装)
- [実際のプロジェクトでの活用例](#実際のプロジェクトでの活用例)

---

## Level 1: 基本実装

### 基本的なGeneric List Component

**学習目標**: Generic型の基本的な使用方法を理解する

**実装例**:
```typescript
// src/components/List/List.tsx
import React from 'react';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

function List<T>({ items, renderItem, className = '' }: ListProps<T>): JSX.Element {
  return (
    <ul className={`list ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="list-item">
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

export default List;
```

**使用例**:
```typescript
// src/pages/BasicListExample.tsx
import React from 'react';
import List from '../components/List/List';

interface User {
  id: number;
  name: string;
  email: string;
}

function BasicListExample(): JSX.Element {
  const users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  ];

  const fruits: string[] = ['Apple', 'Banana', 'Cherry'];

  return (
    <div>
      <h2>User List</h2>
      <List<User>
        items={users}
        renderItem={(user) => (
          <div>
            <strong>{user.name}</strong> - {user.email}
          </div>
        )}
      />

      <h2>Fruit List</h2>
      <List<string>
        items={fruits}
        renderItem={(fruit) => <span>{fruit}</span>}
      />
    </div>
  );
}

export default BasicListExample;
```

**解説**:
- Generic型 `<T>` により任意の型のデータを受け入れ可能
- `renderItem` 関数により表示方法をカスタマイズ
- 型安全性により `item` の型が自動推論される

**次のステップ**: Level 2で型制約とkeyExtractorを追加します

---

### 基本的な条件付きProps

**学習目標**: 条件付きProps型の基本パターンを理解する

**実装例**:
```typescript
// src/components/Button/Button.tsx
import React from 'react';

type ButtonProps = 
  | {
      variant: 'link';
      href: string;
      children: React.ReactNode;
    }
  | {
      variant: 'button';
      onClick: () => void;
      children: React.ReactNode;
    };

function Button(props: ButtonProps): JSX.Element {
  if (props.variant === 'link') {
    return (
      <a href={props.href} className="btn btn-link">
        {props.children}
      </a>
    );
  }

  return (
    <button onClick={props.onClick} className="btn btn-button">
      {props.children}
    </button>
  );
}

export default Button;
```

**使用例**:
```typescript
// src/pages/BasicButtonExample.tsx
import React from 'react';
import Button from '../components/Button/Button';

function BasicButtonExample(): JSX.Element {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div>
      <h2>Button Examples</h2>
      
      <Button variant="link" href="/about">
        About Us
      </Button>
      
      <Button variant="button" onClick={handleClick}>
        Click Me
      </Button>
    </div>
  );
}

export default BasicButtonExample;
```

**解説**:
- Union型により排他的なProps構造を実現
- TypeScriptが適切な型チェックを行う
- 不正な組み合わせはコンパイル時にエラーとなる

**次のステップ**: Level 2でnever型を使った完全な排他制御を学習します

---

## Level 2: 型安全な実装

### 型制約付きGeneric Component

**学習目標**: Generic制約による型安全性の向上

**実装例**:
```typescript
// src/components/DataTable/DataTable.tsx
import React from 'react';

interface HasId {
  id: string | number;
}

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

interface DataTableProps<T extends HasId> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (record: T) => void;
  keyExtractor?: (record: T) => string | number;
}

function DataTable<T extends HasId>({
  data,
  columns,
  onRowClick,
  keyExtractor = (record) => record.id,
}: DataTableProps<T>): JSX.Element {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((record) => {
          const key = keyExtractor(record);
          return (
            <tr
              key={key}
              onClick={() => onRowClick?.(record)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((column) => {
                const value = record[column.key];
                return (
                  <td key={String(column.key)}>
                    {column.render ? column.render(value, record) : String(value)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default DataTable;
```

**使用例**:
```typescript
// src/pages/DataTableExample.tsx
import React from 'react';
import DataTable from '../components/DataTable/DataTable';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

function DataTableExample(): JSX.Element {
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics', inStock: true },
    { id: 2, name: 'Book', price: 29, category: 'Education', inStock: false },
    { id: 3, name: 'Coffee', price: 5, category: 'Food', inStock: true },
  ];

  const columns = [
    { key: 'name' as keyof Product, title: 'Product Name' },
    {
      key: 'price' as keyof Product,
      title: 'Price',
      render: (value: Product['price']) => `$${value}`,
    },
    { key: 'category' as keyof Product, title: 'Category' },
    {
      key: 'inStock' as keyof Product,
      title: 'Status',
      render: (value: Product['inStock']) => (
        <span className={value ? 'in-stock' : 'out-of-stock'}>
          {value ? 'In Stock' : 'Out of Stock'}
        </span>
      ),
    },
  ];

  const handleRowClick = (product: Product) => {
    console.log('Selected product:', product);
  };

  return (
    <div>
      <h2>Product Table</h2>
      <DataTable
        data={products}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default DataTableExample;
```

**改善点**:
- `HasId` 制約により `id` プロパティの存在を保証
- `keyExtractor` により安全なkey生成
- カスタムレンダラーによる柔軟な表示制御
- 型推論により `value` の型が自動決定

**TypeScript の恩恵**:
- コンパイル時の型チェック
- IDEでの自動補完サポート
- リファクタリング時の安全性

---

### 完全な排他的Props型

**学習目標**: never型を使った完全な排他制御

**実装例**:
```typescript
// src/components/Input/Input.tsx
import React from 'react';

interface BaseInputProps {
  label: string;
  name: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

type InputProps = BaseInputProps & (
  | {
      type: 'text';
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
      maxLength?: number;
      minLength?: never;
      min?: never;
      max?: never;
      step?: never;
    }
  | {
      type: 'number';
      value: number;
      onChange: (value: number) => void;
      placeholder?: string;
      min?: number;
      max?: number;
      step?: number;
      maxLength?: never;
      minLength?: never;
    }
  | {
      type: 'email';
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
      maxLength?: number;
      minLength?: number;
      min?: never;
      max?: never;
      step?: never;
    }
);

function Input(props: InputProps): JSX.Element {
  const {
    label,
    name,
    disabled = false,
    error,
    className = '',
    type,
    value,
    onChange,
    placeholder,
    ...typeSpecificProps
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const numValue = parseFloat(e.target.value);
      (onChange as (value: number) => void)(isNaN(numValue) ? 0 : numValue);
    } else {
      (onChange as (value: string) => void)(e.target.value);
    }
  };

  return (
    <div className={`input-group ${className}`}>
      <label htmlFor={name} className="input-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={String(value)}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''}`}
        {...typeSpecificProps}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default Input;
```

**使用例**:
```typescript
// src/pages/InputExample.tsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';

function InputExample(): JSX.Element {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');

  return (
    <div>
      <h2>Input Examples</h2>
      
      <Input
        type="text"
        label="Name"
        name="name"
        value={name}
        onChange={setName}
        placeholder="Enter your name"
        maxLength={50}
        // minLength={2} // エラー: text型では使用不可
      />
      
      <Input
        type="number"
        label="Age"
        name="age"
        value={age}
        onChange={setAge}
        min={0}
        max={120}
        step={1}
        // maxLength={10} // エラー: number型では使用不可
      />
      
      <Input
        type="email"
        label="Email"
        name="email"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
        maxLength={100}
        minLength={5}
        // min={0} // エラー: email型では使用不可
      />
    </div>
  );
}

export default InputExample;
```

**改善点**:
- `never` 型により不要なプロパティを完全に排除
- 型別に適切なプロパティのみ使用可能
- TypeScriptが不正な組み合わせを防止

**TypeScript の恩恵**:
- 型安全なプロパティアクセス
- 不正な組み合わせの防止
- 開発時の型ヒント提供

---

## Level 3: 実用的な実装

### 高機能なGeneric Form Component

**学習目標**: 実用的なGeneric Componentの設計と実装

**実装例**:
```typescript
// src/components/Form/Form.tsx
import React, { useState, useCallback } from 'react';

type ValidationRule<T> = (value: T) => string | null;

type FormSchema<T extends Record<string, any>> = {
  [K in keyof T]: {
    type: 'text' | 'number' | 'email' | 'password' | 'select';
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: T[K] extends string ? readonly string[] : never;
    validation?: ValidationRule<T[K]>;
  };
};

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

interface FormProps<T extends Record<string, any>> {
  schema: FormSchema<T>;
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  children: (formState: FormState<T> & FormActions<T>) => React.ReactNode;
}

interface FormActions<T> {
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setError: <K extends keyof T>(key: K, error: string | null) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  validateField: <K extends keyof T>(key: K) => boolean;
}

function Form<T extends Record<string, any>>({
  schema,
  initialValues,
  onSubmit,
  children,
}: FormProps<T>): JSX.Element {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setTouched(prev => ({ ...prev, [key]: true }));
    
    // リアルタイムバリデーション
    const fieldSchema = schema[key];
    if (fieldSchema.validation) {
      const error = fieldSchema.validation(value);
      setErrors(prev => ({ ...prev, [key]: error }));
    }
  }, [schema]);

  const setError = useCallback(<K extends keyof T>(key: K, error: string | null) => {
    setErrors(prev => ({ ...prev, [key]: error || undefined }));
  }, []);

  const validateField = useCallback(<K extends keyof T>(key: K): boolean => {
    const fieldSchema = schema[key];
    const value = values[key];
    
    // 必須チェック
    if (fieldSchema.required && (!value || String(value).trim() === '')) {
      setError(key, `${fieldSchema.label} is required`);
      return false;
    }
    
    // カスタムバリデーション
    if (fieldSchema.validation) {
      const error = fieldSchema.validation(value);
      if (error) {
        setError(key, error);
        return false;
      }
    }
    
    setError(key, null);
    return true;
  }, [schema, values, setError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 全フィールドのバリデーション
    const fieldKeys = Object.keys(schema) as (keyof T)[];
    const validationResults = fieldKeys.map(key => validateField(key));
    const isValid = validationResults.every(result => result);

    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setIsSubmitting(false);
  }, [schema, values, onSubmit, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const formState: FormState<T> & FormActions<T> = {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setError,
    handleSubmit,
    reset,
    validateField,
  };

  return <form onSubmit={handleSubmit}>{children(formState)}</form>;
}

export default Form;
```

**使用例**:
```typescript
// src/pages/FormExample.tsx
import React from 'react';
import Form from '../components/Form/Form';

interface UserRegistration {
  username: string;
  email: string;
  password: string;
  age: number;
  role: 'admin' | 'user';
}

function FormExample(): JSX.Element {
  const schema = {
    username: {
      type: 'text' as const,
      label: 'Username',
      required: true,
      placeholder: 'Enter username',
      validation: (value: string) => {
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return null;
      },
    },
    email: {
      type: 'email' as const,
      label: 'Email',
      required: true,
      placeholder: 'Enter email',
      validation: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Please enter a valid email';
      },
    },
    password: {
      type: 'password' as const,
      label: 'Password',
      required: true,
      placeholder: 'Enter password',
      validation: (value: string) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        return null;
      },
    },
    age: {
      type: 'number' as const,
      label: 'Age',
      required: true,
      validation: (value: number) => {
        if (value < 18) return 'Must be 18 or older';
        if (value > 120) return 'Please enter a valid age';
        return null;
      },
    },
    role: {
      type: 'select' as const,
      label: 'Role',
      required: true,
      options: ['admin', 'user'] as const,
    },
  };

  const initialValues: UserRegistration = {
    username: '',
    email: '',
    password: '',
    age: 18,
    role: 'user',
  };

  const handleSubmit = async (values: UserRegistration) => {
    console.log('Submitting:', values);
    // API call simulation
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Registration successful!');
  };

  return (
    <div>
      <h2>User Registration</h2>
      <Form
        schema={schema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setValue, handleSubmit, reset }) => (
          <>
            <div className="form-field">
              <label>Username</label>
              <input
                type="text"
                value={values.username}
                onChange={(e) => setValue('username', e.target.value)}
                placeholder={schema.username.placeholder}
                className={errors.username ? 'error' : ''}
              />
              {touched.username && errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                placeholder={schema.email.placeholder}
                className={errors.email ? 'error' : ''}
              />
              {touched.email && errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={values.password}
                onChange={(e) => setValue('password', e.target.value)}
                placeholder={schema.password.placeholder}
                className={errors.password ? 'error' : ''}
              />
              {touched.password && errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-field">
              <label>Age</label>
              <input
                type="number"
                value={values.age}
                onChange={(e) => setValue('age', parseInt(e.target.value) || 0)}
                className={errors.age ? 'error' : ''}
              />
              {touched.age && errors.age && (
                <span className="error-message">{errors.age}</span>
              )}
            </div>

            <div className="form-field">
              <label>Role</label>
              <select
                value={values.role}
                onChange={(e) => setValue('role', e.target.value as 'admin' | 'user')}
                className={errors.role ? 'error' : ''}
              >
                {schema.role.options?.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {touched.role && errors.role && (
                <span className="error-message">{errors.role}</span>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Register'}
              </button>
              <button type="button" onClick={reset}>
                Reset
              </button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}

export default FormExample;
```

**改善点**:
- スキーマベースの動的フォーム生成
- リアルタイムバリデーション
- 型安全なフィールドアクセス
- Render Props パターンによる柔軟性

**TypeScript の恩恵**:
- スキーマと値の型整合性保証
- バリデーション関数の型安全性
- フィールド名の自動補完

---

## Level 4: 高度な実装

### 完全なCompound Components System

**学習目標**: プロダクションレベルのCompound Componentsの実装

**実装例**:
```typescript
// src/components/Modal/Modal.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  modalId: string;
}

const ModalContext = createContext<ModalContextType | null>(null);

function useModalContext(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within a Modal');
  }
  return context;
}

// メインModal コンポーネント
interface ModalProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Modal({ children, defaultOpen = false, onOpenChange }: ModalProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const modalId = React.useId();

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const value: ModalContextType = {
    isOpen,
    open,
    close,
    modalId,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

// Trigger コンポーネント
interface ModalTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function ModalTrigger({ children, asChild = false }: ModalTriggerProps): JSX.Element {
  const { open } = useModalContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        open();
      },
    });
  }

  return (
    <button onClick={open} className="modal-trigger">
      {children}
    </button>
  );
}

// Content コンポーネント
interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function ModalContent({ children, className = '', size = 'md' }: ModalContentProps): JSX.Element | null {
  const { isOpen, close, modalId } = useModalContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.classList.contains('modal-backdrop')) {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, close]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby={`${modalId}-title`}>
      <div className={`modal-content modal-${size} ${className}`}>
        {children}
      </div>
    </div>,
    document.body
  );
}

// Header コンポーネント
interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

function ModalHeader({ children, className = '' }: ModalHeaderProps): JSX.Element {
  return (
    <div className={`modal-header ${className}`}>
      {children}
    </div>
  );
}

// Title コンポーネント
interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

function ModalTitle({ children, className = '' }: ModalTitleProps): JSX.Element {
  const { modalId } = useModalContext();
  
  return (
    <h2 id={`${modalId}-title`} className={`modal-title ${className}`}>
      {children}
    </h2>
  );
}

// Body コンポーネント
interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

function ModalBody({ children, className = '' }: ModalBodyProps): JSX.Element {
  return (
    <div className={`modal-body ${className}`}>
      {children}
    </div>
  );
}

// Footer コンポーネント
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ModalFooter({ children, className = '' }: ModalFooterProps): JSX.Element {
  return (
    <div className={`modal-footer ${className}`}>
      {children}
    </div>
  );
}

// Close コンポーネント
interface ModalCloseProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

function ModalClose({ children, asChild = false, className