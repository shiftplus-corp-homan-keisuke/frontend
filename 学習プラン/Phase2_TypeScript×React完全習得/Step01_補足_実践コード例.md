# Step01_補足_実践コード例.md

# Step 1: React 基礎と TypeScript 統合 - 実践コード例

> 🐰 **このファイルについて**: 段階的に学習できる実践的なコンポーネント作成例集です。初心者から上級者まで、実際に動くコードを通じて React + TypeScript を学習できます。

## 📖 目次

- [Level 1: Button コンポーネント](#level-1-button-コンポーネント)
- [Level 2: Card コンポーネント](#level-2-card-コンポーネント)
- [Level 3: Form コンポーネント](#level-3-form-コンポーネント)
- [Level 4: Modal コンポーネント](#level-4-modal-コンポーネント)
- [実用的なカスタムHooks例](#実用的なカスタムhooks例)
- [型安全なイベントハンドリング例](#型安全なイベントハンドリング例)

---

## Level 1: Button コンポーネント

### 基本的なProps型定義

```typescript
// src/components/Button/Button.tsx
import React from 'react';

// 基本的なProps型定義
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
}: ButtonProps): JSX.Element {
  // クラス名の動的生成
  const getClassName = (): string => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const loadingClass = loading ? 'btn-loading' : '';
    
    return [baseClass, variantClass, sizeClass, loadingClass]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <button
      className={getClassName()}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

export default Button;
```

### HTMLAttributes の継承

```typescript
// src/components/Button/ButtonAdvanced.tsx
import React from 'react';

// HTMLButtonElement の属性を継承
interface ButtonAdvancedProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function ButtonAdvanced({
  children,
  variant,
  size,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonAdvancedProps): JSX.Element {
  const buttonClassName = `btn btn-${variant} btn-${size} ${
    loading ? 'loading' : ''
  } ${className}`;

  return (
    <button
      className={buttonClassName}
      disabled={disabled || loading}
      {...props}
    >
      {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
      {loading ? 'Loading...' : children}
      {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
    </button>
  );
}

export default ButtonAdvanced;
```

---

## Level 2: Card コンポーネント

### 複雑なProps構造

```typescript
// src/components/Card/Card.tsx
import React from 'react';

// 複雑なProps型定義
interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  clickable?: boolean;
  onClick?: () => void;
  image?: {
    src: string;
    alt: string;
    position?: 'top' | 'bottom';
  };
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  };
}

function Card({
  title,
  subtitle,
  children,
  actions,
  variant = 'default',
  clickable = false,
  onClick,
  image,
  badge,
}: CardProps): JSX.Element {
  const cardClassName = `card card-${variant} ${
    clickable ? 'card-clickable' : ''
  }`;

  const handleClick = (): void => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (clickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cardClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
    >
      {/* 画像表示 */}
      {image && image.position !== 'bottom' && (
        <div className="card-image">
          <img src={image.src} alt={image.alt} />
        </div>
      )}

      {/* ヘッダー */}
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        
        {/* バッジ */}
        {badge && (
          <span className={`card-badge badge-${badge.variant}`}>
            {badge.text}
          </span>
        )}
      </div>

      {/* コンテンツ */}
      <div className="card-content">
        {children}
      </div>

      {/* 下部画像 */}
      {image && image.position === 'bottom' && (
        <div className="card-image">
          <img src={image.src} alt={image.alt} />
        </div>
      )}

      {/* アクション */}
      {actions && (
        <div className="card-actions">
          {actions}
        </div>
      )}
    </div>
  );
}

export default Card;
```

---

## Level 3: Form コンポーネント

### フォーム状態の管理

```typescript
// src/components/Form/FormField.tsx
import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactElement;
}

function FormField({
  label,
  required = false,
  error,
  helperText,
  children,
}: FormFieldProps): JSX.Element {
  const fieldId = React.useId();

  // 子要素にpropsを追加
  const childWithProps = React.cloneElement(children, {
    id: fieldId,
    'aria-describedby': error ? `${fieldId}-error` : helperText ? `${fieldId}-help` : undefined,
    'aria-invalid': error ? 'true' : 'false',
  });

  return (
    <div className={`form-field ${error ? 'form-field-error' : ''}`}>
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      
      {childWithProps}
      
      {error && (
        <div id={`${fieldId}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={`${fieldId}-help`} className="form-help">
          {helperText}
        </div>
      )}
    </div>
  );
}

export default FormField;
```

---

## Level 4: Modal コンポーネント

### Portal を使用した型安全な実装

```typescript
// src/components/Modal/Modal.tsx
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}: ModalProps): JSX.Element | null {
  // Escapeキーでの閉じる処理
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent): void => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // 背景クリックでの閉じる処理
  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // エフェクト
  useEffect(() => {
    if (isOpen) {
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
      
      // Escapeキーリスナーを追加
      if (closeOnEscape) {
        document.addEventListener('keydown', handleEscapeKey);
      }

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, closeOnEscape, handleEscapeKey]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={`modal modal-${size}`}>
        {/* ヘッダー */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="モーダルを閉じる"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* コンテンツ */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );

  // Portalを使用してbody直下にレンダリング
  return createPortal(modalContent, document.body);
}

export default Modal;
```

---

## 実用的なカスタムHooks例

### useLocalStorage

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 初期値の取得
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 値の設定
  const setValue = (value: T | ((val: T) => T)): void => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
```

### useFetch

```typescript
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: T = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    fetchData();
  }, [url]);

  return state;
}

export default useFetch;
```

---

## 型安全なイベントハンドリング例

### 包括的なイベントハンドリング

```typescript
// src/components/EventExample/EventExample.tsx
import React, { useState } from 'react';

interface EventExampleState {
  inputValue: string;
  selectedOption: string;
  mousePosition: { x: number; y: number };
  keyPressed: string;
}

function EventExample(): JSX.Element {
  const [state, setState] = useState<EventExampleState>({
    inputValue: '',
    selectedOption: '',
    mousePosition: { x: 0, y: 0 },
    keyPressed: '',
  });

  // 入力イベント
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState(prev => ({
      ...prev,
      inputValue: event.target.value,
    }));
  };

  // セレクトイベント
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setState(prev => ({
      ...prev,
      selectedOption: event.target.value,
    }));
  };

  // マウスイベント
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    setState(prev => ({
      ...prev,
      mousePosition: {
        x: event.clientX,
        y: event.clientY,
      },
    }));
  };

  // キーボードイベント
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    setState(prev => ({
      ...prev,
      keyPressed: event.key,
    }));

    // Enterキーでの特別な処理
    if (event.key === 'Enter') {
      console.log('Enter pressed with value:', state.inputValue);
    }
  };

  return (
    <div className="event-example">
      <h2>イベントハンドリング例</h2>

      <div>
        <label>
          テキスト入力:
          <input
            type="text"
            value={state.inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </label>
      </div>

      <div>
        <label>
          選択:
          <select value={state.selectedOption} onChange={handleSelectChange}>
            <option value="">選択してください</option>
            <option value="option1">オプション1</option>
            <option value="option2">オプション2</option>
          </select>
        </label>
      </div>

      <div
        className="mouse-area"
        onMouseMove={handleMouseMove}
        style={{
          width: '300px',
          height: '200px',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        マウスを動かしてください
        <p>マウス位置: ({state.mousePosition.x}, {state.mousePosition.y})</p>
        <p>最後に押されたキー: {state.keyPressed}</p>
      </div>
    </div>
  );
}

export default EventExample;
```

---

**📌 重要**: これらの実践コード例は段階的に学習できるよう設計されています。Level 1から順番に学習し、各レベルで型安全性とReactのベストプラクティスを身につけましょう。