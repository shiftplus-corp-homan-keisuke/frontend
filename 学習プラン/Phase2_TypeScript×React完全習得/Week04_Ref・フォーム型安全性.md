# Week 4: Ref・フォーム型安全性

## 📅 学習期間・目標

**期間**: Week 4（7日間）
**総学習時間**: 12時間（平日1.5時間、週末3時間）
**学習スタイル**: 理論20% + 実践コード50% + 演習30%

### 🎯 Week 4 到達目標

- [ ] useRefの型安全な活用
- [ ] フォーム処理の型管理
- [ ] バリデーションシステムの実装
- [ ] Controlled/Uncontrolled Componentsの理解
- [ ] フォームライブラリとの統合

## 📚 理論学習内容

### Day 22-24: useRefの型安全な活用

#### 🎯 useRefの基本パターン

```typescript
// 1. DOM要素への参照
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// 基本的なDOM参照
function FocusableInput(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // null チェックが必要
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClear = (): void => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type here..." />
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}

// 2. 複数のDOM要素管理
function MultipleRefs(): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (nameRef.current && emailRef.current) {
      const formData = {
        name: nameRef.current.value,
        email: emailRef.current.value,
      };
      console.log('Form data:', formData);
    }
  };

  const focusNextField = (currentRef: React.RefObject<HTMLInputElement>): void => {
    if (currentRef === nameRef && emailRef.current) {
      emailRef.current.focus();
    } else if (currentRef === emailRef && submitRef.current) {
      submitRef.current.focus();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input
        ref={nameRef}
        type="text"
        placeholder="Name"
        onKeyDown={(e) => e.key === 'Tab' && focusNextField(nameRef)}
      />
      <input
        ref={emailRef}
        type="email"
        placeholder="Email"
        onKeyDown={(e) => e.key === 'Tab' && focusNextField(emailRef)}
      />
      <button ref={submitRef} type="submit">Submit</button>
    </form>
  );
}

// 3. 値の保持（レンダリング間で保持）
function Timer(): JSX.Element {
  const [count, setCount] = React.useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countRef = useRef<number>(0);

  // 最新のcountを常に参照
  countRef.current = count;

  const startTimer = (): void => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setCount(countRef.current + 1);
    }, 1000);
  };

  const stopTimer = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopTimer(); // クリーンアップ
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

#### 🔗 forwardRefの高度な活用

```typescript
// 4. forwardRefの型安全な実装
interface CustomInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  helperText?: string;
  size: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'standard';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({
    label,
    error,
    helperText,
    size,
    variant = 'outlined',
    startAdornment,
    endAdornment,
    className = '',
    ...props
  }, ref) => {
    const inputClassName = `
      input 
      input-${size} 
      input-${variant}
      ${error ? 'error' : ''}
      ${startAdornment ? 'has-start-adornment' : ''}
      ${endAdornment ? 'has-end-adornment' : ''}
      ${className}
    `.trim();

    return (
      <div className="form-field">
        <label className="form-label">{label}</label>
        <div className="input-wrapper">
          {startAdornment && (
            <div className="input-adornment start">{startAdornment}</div>
          )}
          <input
            ref={ref}
            className={inputClassName}
            {...props}
          />
          {endAdornment && (
            <div className="input-adornment end">{endAdornment}</div>
          )}
        </div>
        {error && <span className="error-message">{error}</span>}
        {helperText && !error && (
          <span className="helper-text">{helperText}</span>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

// 5. useImperativeHandleの活用
interface FormHandle {
  submit: () => void;
  reset: () => void;
  focus: (field: string) => void;
  validate: () => boolean;
  getValues: () => Record<string, any>;
}

interface FormProps {
  onSubmit: (data: Record<string, any>) => void;
  children: React.ReactNode;
}

const Form = forwardRef<FormHandle, FormProps>(
  ({ onSubmit, children }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const fieldsRef = useRef<Map<string, HTMLInputElement>>(new Map());

    useImperativeHandle(ref, () => ({
      submit: () => {
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      },
      reset: () => {
        if (formRef.current) {
          formRef.current.reset();
        }
      },
      focus: (field: string) => {
        const input = fieldsRef.current.get(field);
        if (input) {
          input.focus();
        }
      },
      validate: () => {
        if (formRef.current) {
          return formRef.current.checkValidity();
        }
        return false;
      },
      getValues: () => {
        const values: Record<string, any> = {};
        fieldsRef.current.forEach((input, name) => {
          values[name] = input.value;
        });
        return values;
      },
    }));

    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      const formData = new FormData(formRef.current!);
      const data = Object.fromEntries(formData.entries());
      onSubmit(data);
    };

    return (
      <form ref={formRef} onSubmit={handleSubmit}>
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';
```

### Day 25-26: フォーム処理の型管理

#### 🎯 型安全なフォーム実装

```typescript
// 6. 型安全なフォーム状態管理
interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  required: boolean;
}

interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
}

type ValidationRule<T> = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
};

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>
) {
  const [formState, setFormState] = React.useState<FormState<T>>(() => {
    const fields = {} as { [K in keyof T]: FormField<T[K]> };
    
    for (const key in initialValues) {
      fields[key] = {
        value: initialValues[key],
        error: undefined,
        touched: false,
        required: validationSchema?.[key]?.required || false,
      };
    }

    return {
      fields,
      isValid: true,
      isSubmitting: false,
    };
  });

  const validateField = <K extends keyof T>(
    name: K,
    value: T[K]
  ): string | null => {
    const rules = validationSchema?.[name];
    if (!rules) return null;

    if (rules.required && (!value || value === '')) {
      return 'This field is required';
    }

    if (rules.min && typeof value === 'string' && value.length < rules.min) {
      return `Minimum length is ${rules.min}`;
    }

    if (rules.max && typeof value === 'string' && value.length > rules.max) {
      return `Maximum length is ${rules.max}`;
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  };

  const setValue = <K extends keyof T>(name: K, value: T[K]): void => {
    const error = validateField(name, value);
    
    setFormState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: {
          ...prev.fields[name],
          value,
          error,
          touched: true,
        },
      },
    }));
  };

  const setError = <K extends keyof T>(name: K, error: string): void => {
    setFormState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: {
          ...prev.fields[name],
          error,
        },
      },
    }));
  };

  const validateAll = (): boolean => {
    let isValid = true;
    const newFields = { ...formState.fields };

    for (const name in formState.fields) {
      const field = formState.fields[name];
      const error = validateField(name, field.value);
      
      newFields[name] = {
        ...field,
        error,
        touched: true,
      };

      if (error) {
        isValid = false;
      }
    }

    setFormState(prev => ({
      ...prev,
      fields: newFields,
      isValid,
    }));

    return isValid;
  };

  const reset = (): void => {
    const fields = {} as { [K in keyof T]: FormField<T[K]> };
    
    for (const key in initialValues) {
      fields[key] = {
        value: initialValues[key],
        error: undefined,
        touched: false,
        required: validationSchema?.[key]?.required || false,
      };
    }

    setFormState({
      fields,
      isValid: true,
      isSubmitting: false,
    });
  };

  const getValues = (): T => {
    const values = {} as T;
    for (const name in formState.fields) {
      values[name] = formState.fields[name].value;
    }
    return values;
  };

  return {
    fields: formState.fields,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
    setValue,
    setError,
    validateAll,
    reset,
    getValues,
    setSubmitting: (submitting: boolean) => 
      setFormState(prev => ({ ...prev, isSubmitting: submitting })),
  };
}

// 使用例
interface UserFormData {
  name: string;
  email: string;
  age: number;
  password: string;
}

const validationSchema: ValidationSchema<UserFormData> = {
  name: {
    required: true,
    min: 2,
    max: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  age: {
    required: true,
    custom: (value) => value < 18 ? 'Must be 18 or older' : null,
  },
  password: {
    required: true,
    min: 8,
    custom: (value) => 
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) 
        ? 'Password must contain uppercase, lowercase, and number' 
        : null,
  },
};

function UserRegistrationForm(): JSX.Element {
  const form = useForm<UserFormData>(
    {
      name: '',
      email: '',
      age: 0,
      password: '',
    },
    validationSchema
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!form.validateAll()) {
      return;
    }

    form.setSubmitting(true);
    
    try {
      const values = form.getValues();
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      form.reset();
    } catch (error) {
      form.setError('email', 'Registration failed. Please try again.');
    } finally {
      form.setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CustomInput
        label="Name"
        value={form.fields.name.value}
        onChange={(e) => form.setValue('name', e.target.value)}
        error={form.fields.name.touched ? form.fields.name.error : undefined}
        size="md"
        required={form.fields.name.required}
      />

      <CustomInput
        label="Email"
        type="email"
        value={form.fields.email.value}
        onChange={(e) => form.setValue('email', e.target.value)}
        error={form.fields.email.touched ? form.fields.email.error : undefined}
        size="md"
        required={form.fields.email.required}
      />

      <CustomInput
        label="Age"
        type="number"
        value={form.fields.age.value.toString()}
        onChange={(e) => form.setValue('age', Number(e.target.value))}
        error={form.fields.age.touched ? form.fields.age.error : undefined}
        size="md"
        required={form.fields.age.required}
      />

      <CustomInput
        label="Password"
        type="password"
        value={form.fields.password.value}
        onChange={(e) => form.setValue('password', e.target.value)}
        error={form.fields.password.touched ? form.fields.password.error : undefined}
        size="md"
        required={form.fields.password.required}
      />

      <button 
        type="submit" 
        disabled={form.isSubmitting || !form.isValid}
      >
        {form.isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

### Day 27-28: バリデーションシステムとライブラリ統合

#### 🎯 React Hook Form + Zod統合

```typescript
// 7. React Hook Form + Zodの型安全な統合
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zodスキーマ定義
const userSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Invalid email format'),
  age: z.number()
    .min(18, 'Must be 18 or older')
    .max(120, 'Invalid age'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
  confirmPassword: z.string(),
  terms: z.boolean()
    .refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

function AdvancedUserForm(): JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 18,
      password: '',
      confirmPassword: '',
      terms: false,
    },
    mode: 'onChange',
  });

  const watchedPassword = watch('password');

  const onSubmit = async (data: UserFormData): Promise<void> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      reset();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <CustomInput
            {...field}
            label="Name"
            error={fieldState.error?.message}
            size="md"
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <CustomInput
            {...field}
            type="email"
            label="Email"
            error={fieldState.error?.message}
            size="md"
          />
        )}
      />

      <Controller
        name="age"
        control={control}
        render={({ field, fieldState }) => (
          <CustomInput
            {...field}
            type="number"
            label="Age"
            error={fieldState.error?.message}
            size="md"
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <CustomInput
            {...field}
            type="password"
            label="Password"
            error={fieldState.error?.message}
            size="md"
            endAdornment={
              <PasswordStrengthIndicator password={watchedPassword} />
            }
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <CustomInput
            {...field}
            type="password"
            label="Confirm Password"
            error={fieldState.error?.message}
            size="md"
          />
        )}
      />

      <Controller
        name="terms"
        control={control}
        render={({ field, fieldState }) => (
          <label>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
            />
            I accept the terms and conditions
            {fieldState.error && (
              <span className="error">{fieldState.error.message}</span>
            )}
          </label>
        )}
      />

      <button 
        type="submit" 
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}

// パスワード強度インジケーター
interface PasswordStrengthIndicatorProps {
  password: string;
}

function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps): JSX.Element {
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;

    const levels = [
      { score: 0, label: 'Very Weak', color: '#ff4444' },
      { score: 1, label: 'Weak', color: '#ff8800' },
      { score: 2, label: 'Fair', color: '#ffaa00' },
      { score: 3, label: 'Good', color: '#88cc00' },
      { score: 4, label: 'Strong', color: '#44aa00' },
      { score: 5, label: 'Very Strong', color: '#00aa44' },
    ];

    return levels[score] || levels[0];
  };

  const strength = getStrength(password);

  return (
    <div className="password-strength">
      <div 
        className="strength-bar"
        style={{
          width: `${(strength.score / 5) * 100}%`,
          backgroundColor: strength.color,
        }}
      />
      <span style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  );
}
```

## 🎯 実践演習

### 演習 4-1: フォームライブラリ構築 🔰

```typescript
// 以下の要件を満たすフォームライブラリを実装せよ

// 1. 動的フォームビルダー
interface FormFieldConfig {
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea';
  label: string;
  required?: boolean;
  options?: string[]; // select用
  validation?: ValidationRule<any>;
}

interface DynamicFormProps {
  fields: FormFieldConfig[];
  onSubmit: (data: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

// 要件:
// - 設定ベースでフォーム生成
// - 型安全なバリデーション
// - 条件付きフィールド表示
// - カスタムコンポーネント対応

// 2. ファイルアップロードフォーム
interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => Promise<void>;
}

// 要件:
// - ドラッグ&ドロップ対応
// - プレビュー機能
// - 進捗表示
// - エラーハンドリング
```

### 演習 4-2: 高度なフォーム機能 🔶

```typescript
// 以下の要件を満たす高度なフォーム機能を実装せよ

// 1. ステップフォーム（ウィザード）
interface StepFormProps<T> {
  steps: StepConfig<T>[];
  onComplete: (data: T) => void;
  onStepChange?: (step: number) => void;
}

interface StepConfig<T> {
  title: string;
  fields: (keyof T)[];
  validation?: ValidationSchema<Partial<T>>;
  component?: React.ComponentType<any>;
}

// 要件:
// - ステップ間のデータ保持
// - 各ステップでのバリデーション
// - 進捗表示
// - 戻る・次へナビゲーション

// 2. 自動保存フォーム
interface AutoSaveFormProps<T> {
  data: T;
  onSave: (data: Partial<T>) => Promise<void>;
  saveInterval?: number;
  storageKey?: string;
}

// 要件:
// - 定期的な自動保存
// - ローカルストレージバックアップ
// - 保存状態の表示
// - 競合解決機能
```

### 演習 4-3: 実用的なフォームアプリケーション 🔥

```typescript
// 以下の要件を満たすフォームアプリケーションを実装せよ

// プロフィール編集フォーム
interface UserProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: Date;
    avatar?: File;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  security: {
    currentPassword: string;
    newPassword?: string;
    confirmPassword?: string;
    twoFactorEnabled: boolean;
  };
}

// 要件:
// - セクション別フォーム
// - リアルタイムバリデーション
// - 画像アップロード
// - パスワード変更
// - 設定の即座反映
// - 変更の差分検出
// - 保存前確認
```

## 📊 Week 4 評価基準

### 理解度チェックリスト

#### Ref管理 (30%)
- [ ] useRefを型安全に使用できる
- [ ] forwardRefを適切に実装できる
- [ ] useImperativeHandleを活用できる
- [ ] DOM操作を型安全に実行できる

#### フォーム処理 (40%)
- [ ] 型安全なフォーム状態管理ができる
- [ ] バリデーションシステムを実装できる
- [ ] Controlled/Uncontrolledコンポーネントを理解している
- [ ] フォームライブラリを統合できる

#### 実践応用 (20%)
- [ ] 複雑なフォームを設計・実装できる
- [ ] ユーザビリティを考慮した実装ができる
- [ ] パフォーマンスを最適化できる
- [ ] アクセシビリティを考慮できる

#### 問題解決力 (10%)
- [ ] フォーム関連の問題を解決できる
- [ ] 適切なライブラリを選択できる
- [ ] 保守性の高い設計ができる
- [ ] テスタブルなコードを書ける

### 成果物チェックリスト

- [ ] **フォームライブラリ**: 再利用可能なフォームコンポーネント群
- [ ] **バリデーションシステム**: 型安全なバリデーション機能
- [ ] **高度なフォーム**: ステップフォーム・自動保存等
- [ ] **実用アプリケーション**: プロフィール編集等の完全なフォーム

## 🔄 Week 5 への準備

### 次週学習内容の予習

```typescript
// Week 5で学習するContext API・カスタムフックの基礎概念

// 1. Context APIの型安全な実装
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

// 2. カスタムフックの設計
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 実装
}

// 3. Provider パターン
function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 実装
}
```

---

**📌 重要**: Week 4 は React のRef管理とフォーム処理の型安全性を習得する重要な期間です。実用的なフォームシステムの構築により、後の状態管理学習がスムーズに進みます。