# STEP01 補足資料：トラブルシューティング

> 🔧 **このファイルについて**: React × TypeScript 学習中によく遭遇するエラーと解決方法をまとめています。エラーメッセージで検索して素早く解決策を見つけてください。

---

## 📚 目次

- [TypeScript関連エラー](#typescript関連エラー)
- [React関連エラー](#react関連エラー)
- [開発環境エラー](#開発環境エラー)
- [ビルドエラー](#ビルドエラー)
- [実行時エラー](#実行時エラー)
- [パフォーマンス問題](#パフォーマンス問題)
- [デバッグ手法](#デバッグ手法)
- [よくある質問](#よくある質問)

---

## TypeScript関連エラー

### 1. 型エラー: Property does not exist on type

**エラーメッセージ:**
```
Property 'name' does not exist on type '{}'.
```

**原因:**
- オブジェクトの型定義が不完全
- 型注釈が不適切

**解決方法:**
```tsx
// ❌ 間違い
const user = {};
console.log(user.name); // エラー

// ✅ 正しい方法1: インターフェースを定義
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "太郎",
  age: 25
};

// ✅ 正しい方法2: 型アサーション（注意して使用）
const user = {} as User;

// ✅ 正しい方法3: オプショナルプロパティ
interface User {
  name?: string;
  age?: number;
}
```

### 2. 型エラー: Type 'string | undefined' is not assignable

**エラーメッセージ:**
```
Type 'string | undefined' is not assignable to type 'string'.
```

**原因:**
- オプショナルプロパティやnullableな値の処理が不適切

**解決方法:**
```tsx
// ❌ 間違い
interface Props {
  name?: string;
}

function Component({ name }: Props) {
  const upperName: string = name.toUpperCase(); // エラー
  return <div>{upperName}</div>;
};

// ✅ 正しい方法1: デフォルト値
function Component({ name = "" }: Props) {
  const upperName: string = name.toUpperCase();
  return <div>{upperName}</div>;
};

// ✅ 正しい方法2: 条件分岐
function Component({ name }: Props) {
  if (!name) return <div>名前がありません</div>;
  const upperName: string = name.toUpperCase();
  return <div>{upperName}</div>;
};

// ✅ 正しい方法3: オプショナルチェーニング
function Component({ name }: Props) {
  const upperName = name?.toUpperCase() || "";
  return <div>{upperName}</div>;
};
```

### 3. 型エラー: Cannot find module

**エラーメッセージ:**
```
Cannot find module './Component' or its corresponding type declarations.
```

**原因:**
- ファイルパスが間違っている
- 拡張子が不適切
- 型定義ファイルが不足

**解決方法:**
```tsx
// ❌ 間違い
import Component from './Component'; // .tsxファイルなのに拡張子なし

// ✅ 正しい方法1: 正確なパス
import Component from './Component.tsx';
import Component from './components/Component';

// ✅ 正しい方法2: index.tsを使用
// components/index.ts
export { default as Component } from './Component';

// 使用側
import { Component } from './components';

// ✅ 正しい方法3: 型定義ファイルの作成
// types/index.d.ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

### 4. 型エラー: JSX element type does not have any construct

**エラーメッセージ:**
```
JSX element type 'Component' does not have any construct or call signatures.
```

**原因:**
- コンポーネントの型定義が不適切
- React.FCの使用方法が間違っている

**解決方法:**
```tsx
// ❌ 間違い
const Component = (props: Props) => {
  return <div>{props.children}</div>;
};

// ✅ 正しい方法1: React.FCを使用（型定義の学習用）
const Component: React.FC<Props> = (props) => {
  return <div>{props.children}</div>;
};

// ✅ 正しい方法2: 関数宣言（推奨）
function Component(props: Props) {
  return <div>{props.children}</div>;
}

// ✅ 正しい方法3: 明示的な戻り値型
const Component = (props: Props): JSX.Element => {
  return <div>{props.children}</div>;
};
```

---

## React関連エラー

### 1. Warning: Each child in a list should have a unique "key" prop

**エラーメッセージ:**
```
Warning: Each child in a list should have a unique "key" prop.
```

**原因:**
- リストレンダリング時にkey propが不足

**解決方法:**
```tsx
// ❌ 間違い
const items = ['apple', 'banana', 'orange'];
return (
  <ul>
    {items.map(item => (
      <li>{item}</li> // keyがない
    ))}
  </ul>
);

// ✅ 正しい方法1: インデックスをkeyに使用（推奨されない）
return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

// ✅ 正しい方法2: 一意のIDをkeyに使用（推奨）
const items = [
  { id: 1, name: 'apple' },
  { id: 2, name: 'banana' },
  { id: 3, name: 'orange' }
];

return (
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
);

// ✅ 正しい方法3: 文字列をkeyに使用（重複がない場合）
return (
  <ul>
    {items.map(item => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);
```

### 2. Error: Cannot read property 'setState' of undefined

**エラーメッセージ:**
```
Cannot read property 'setState' of undefined
```

**原因:**
- 関数コンポーネントでsetStateを使用
- thisのバインドが不適切（クラスコンポーネント）

**解決方法:**
```tsx
// ❌ 間違い（関数コンポーネント）
const Component = () => {
  this.setState({ count: 1 }); // エラー
  return <div>Component</div>;
};

// ✅ 正しい方法: useStateを使用
const Component: React.FC = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return <button onClick={handleClick}>{count}</button>;
};

// ✅ 関数コンポーネント（推奨）
const Component: React.FC = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <button onClick={handleClick}>{count}</button>;
};

// 参考: クラスコンポーネントの場合（非推奨）
// class Component extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { count: 0 };
//     this.handleClick = this.handleClick.bind(this);
//   }
//
//   handleClick = () => {
//     this.setState({ count: this.state.count + 1 });
//   };
//
//   render() {
//     return <button onClick={this.handleClick}>{this.state.count}</button>;
//   }
// }
```

### 3. Warning: Can't perform a React state update on an unmounted component

**エラーメッセージ:**
```
Warning: Can't perform a React state update on an unmounted component.
```

**原因:**
- コンポーネントがアンマウントされた後にsetStateが実行される

**解決方法:**
```tsx
// ❌ 問題のあるコード
const Component: React.FC = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(result => {
      setData(result); // コンポーネントがアンマウントされていても実行される
    });
  }, []);
  
  return <div>{data}</div>;
};

// ✅ 正しい方法1: クリーンアップ関数を使用
const Component: React.FC = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    fetchData().then(result => {
      if (isMounted) {
        setData(result);
      }
    });
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return <div>{data}</div>;
};

// ✅ 正しい方法2: AbortControllerを使用
const Component: React.FC = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    fetchData(controller.signal)
      .then(result => setData(result))
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });
    
    return () => {
      controller.abort();
    };
  }, []);
  
  return <div>{data}</div>;
};
```

### 4. Error: Too many re-renders

**エラーメッセージ:**
```
Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
```

**原因:**
- useEffectの依存配列が不適切
- 無限ループが発生している

**解決方法:**
```tsx
// ❌ 間違い1: 依存配列なし
const Component: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1); // 無限ループ
  });
  
  return <div>{count}</div>;
};

// ❌ 間違い2: 不適切な依存配列
const Component: React.FC = () => {
  const [user, setUser] = useState({ name: '', age: 0 });
  
  useEffect(() => {
    setUser({ ...user, name: 'Updated' }); // 無限ループ
  }, [user]);
  
  return <div>{user.name}</div>;
};

// ✅ 正しい方法1: 適切な依存配列
const Component: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // 初回のみ実行
    setCount(1);
  }, []); // 空の依存配列
  
  return <div>{count}</div>;
};

// ✅ 正しい方法2: 関数型更新
const Component: React.FC = () => {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1); // 前の値を使用
  }, []);
  
  return <button onClick={increment}>{count}</button>;
};

// ✅ 正しい方法3: useMemoを使用
const Component: React.FC = () => {
  const [user, setUser] = useState({ name: '', age: 0 });
  
  const updatedUser = useMemo(() => ({
    ...user,
    name: 'Updated'
  }), [user.age]); // nameの変更は無視
  
  useEffect(() => {
    setUser(updatedUser);
  }, [updatedUser]);
  
  return <div>{user.name}</div>;
};
```

---

## 開発環境エラー

### 1. Module not found: Can't resolve 'react'

**エラーメッセージ:**
```
Module not found: Can't resolve 'react'
```

**原因:**
- Reactがインストールされていない
- node_modulesが破損している

**解決方法:**
```bash
# 1. 依存関係を再インストール
npm install

# 2. node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install

# 3. Reactを明示的にインストール
npm install react react-dom
npm install --save-dev @types/react @types/react-dom

# 4. キャッシュをクリア
npm cache clean --force
```

### 2. TypeScript configuration error

**エラーメッセージ:**
```
TypeScript error: Cannot find type definition file for 'node'.
```

**原因:**
- TypeScript設定が不適切
- 型定義ファイルが不足

**解決方法:**
```bash
# 1. 型定義ファイルをインストール
npm install --save-dev @types/node

# 2. tsconfig.jsonを確認
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
```

### 3. ESLint configuration conflicts

**エラーメッセージ:**
```
ESLint: Parsing error: Unexpected token
```

**原因:**
- ESLint設定がTypeScript/Reactに対応していない

**解決方法:**
```bash
# 1. 必要なパッケージをインストール
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
```

```json
// .eslintrc.json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## ビルドエラー

### 1. Build failed: Module parse failed

**エラーメッセージ:**
```
Module parse failed: Unexpected token
```

**原因:**
- Webpackの設定が不適切
- ファイル拡張子の問題

**解決方法:**
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
```

### 2. TypeScript compilation errors

**エラーメッセージ:**
```
TypeScript error in /src/App.tsx: Type 'string' is not assignable to type 'number'.
```

**解決方法:**
```tsx
// ❌ 型エラーのあるコード
const Component: React.FC = () => {
  const [count, setCount] = useState<number>("0"); // エラー
  return <div>{count}</div>;
};

// ✅ 修正されたコード
const Component: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setCount(isNaN(value) ? 0 : value);
  };
  
  return (
    <div>
      <input type="number" onChange={handleInputChange} />
      <div>{count}</div>
    </div>
  );
};
```

---

## 実行時エラー

### 1. Cannot read property of null

**エラーメッセージ:**
```
Cannot read property 'addEventListener' of null
```

**原因:**
- DOM要素が存在しない時点でアクセスしている

**解決方法:**
```tsx
// ❌ 問題のあるコード
const Component: React.FC = () => {
  useEffect(() => {
    const element = document.getElementById('myElement');
    element.addEventListener('click', handleClick); // elementがnullの可能性
  }, []);
  
  return <div id="myElement">Click me</div>;
};

// ✅ 正しい方法1: null チェック
const Component: React.FC = () => {
  useEffect(() => {
    const element = document.getElementById('myElement');
    if (element) {
      element.addEventListener('click', handleClick);
      
      return () => {
        element.removeEventListener('click', handleClick);
      };
    }
  }, []);
  
  return <div id="myElement">Click me</div>;
};

// ✅ 正しい方法2: useRefを使用
const Component: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener('click', handleClick);
      
      return () => {
        element.removeEventListener('click', handleClick);
      };
    }
  }, []);
  
  return <div ref={elementRef}>Click me</div>;
};
```

### 2. Maximum update depth exceeded

**エラーメッセージ:**
```
Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
```

**原因:**
- 無限レンダリングループが発生

**解決方法:**
```tsx
// ❌ 問題のあるコード
const Component: React.FC = () => {
  const [count, setCount] = useState(0);
  
  // レンダリングのたびに実行される
  setCount(count + 1); // 無限ループ
  
  return <div>{count}</div>;
};

// ✅ 正しい方法: useEffectを使用
const Component: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1);
  }, []); // 初回のみ実行
  
  return <div>{count}</div>;
};
```

---

## パフォーマンス問題

### 1. 不要な再レンダリング

**問題:**
- コンポーネントが頻繁に再レンダリングされる

**解決方法:**
```tsx
// ❌ 問題のあるコード
const Parent: React.FC = () => {
  const [count, setCount] = useState(0);
  
  const expensiveValue = {
    data: processLargeData() // 毎回実行される
  };
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child value={expensiveValue} />
    </div>
  );
};

// ✅ 正しい方法: useMemoとReact.memoを使用
const Parent: React.FC = () => {
  const [count, setCount] = useState(0);
  
  const expensiveValue = useMemo(() => ({
    data: processLargeData()
  }), []); // 初回のみ実行
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child value={expensiveValue} />
    </div>
  );
};

const Child = React.memo<{ value: any }>(({ value }) => {
  return <div>{value.data}</div>;
});
```

### 2. メモリリーク

**問題:**
- イベントリスナーやタイマーがクリーンアップされない

**解決方法:**
```tsx
// ❌ 問題のあるコード
const Component: React.FC = () => {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
    
    // クリーンアップなし
  }, []);
  
  return <div>Component</div>;
};

// ✅ 正しい方法: クリーンアップ関数を使用
const Component: React.FC = () => {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
    
    return () => {
      clearInterval(timer); // クリーンアップ
    };
  }, []);
  
  return <div>Component</div>;
};
```

---

## デバッグ手法

### 1. React Developer Tools

```tsx
// コンポーネントにdisplayNameを設定
const MyComponent: React.FC = () => {
  return <div>My Component</div>;
};

MyComponent.displayName = 'MyComponent';

// デバッグ用のpropsを追加
function DebugComponent({ debug, children }: { debug?: boolean }) {
  if (debug) {
    console.log('Component props:', { children });
  }
  
  return <div>{children}</div>;
};
```

### 2. console.logを活用したデバッグ

```tsx
const Component: React.FC = () => {
  const [state, setState] = useState(initialState);
  
  // レンダリング時のデバッグ
  console.log('Component render:', { state });
  
  useEffect(() => {
    console.log('Effect triggered:', { state });
  }, [state]);
  
  const handleClick = () => {
    console.log('Button clicked');
    setState(newState);
  };
  
  return <button onClick={handleClick}>Click</button>;
};
```

### 3. エラーバウンダリー

```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>エラーが発生しました</h2>
          <details>
            {this.state.error?.message}
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// 使用例
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
};
```

---

## よくある質問

### Q1: useEffectの依存配列に何を入れるべきですか？

**A:** useEffect内で使用するすべての値（state、props、関数など）を依存配列に含める必要があります。

```tsx
// ✅ 正しい例
function Component({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // userIdを依存配列に含める
  
  return <div>{user?.name}</div>;
};
```

### Q2: React.FCを使うべきですか？

**A:** React.FCは必須ではありませんが、型安全性と開発体験の向上のために推奨されます。

```tsx
// 3つの方法すべて有効
// 方法1: React.FCを使用（型定義の学習用）
const Component1: React.FC<Props> = (props) => {
  return <div>{props.children}</div>;
};

// 方法2: function宣言（推奨）
function Component2(props: Props) {
  return <div>{props.children}</div>;
}

// 方法3: 明示的な戻り値型
function Component3(props: Props): JSX.Element {
  return <div>{props.children}</div>;
}
```

### Q3: いつuseCallbackやuseMemoを使うべきですか？

**A:** パフォーマンスの問題が実際に発生している場合、または子コンポーネントの不要な再レンダリングを防ぎたい場合に使用します。

```tsx
// useCallbackが有効な場合
const Parent: React.FC = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    // 重い処理
    performExpensiveOperation();
  }, []); // 依存関係がない場合
  
  return <ExpensiveChild onClick={handleClick} />;
};

const ExpensiveChild = React.memo<{ onClick: () => void }>(({ onClick }) => {
  // 重いレンダリング処理
  return <button onClick={onClick}>Click</button>;
});
```

### Q4: TypeScriptでReactのイベント型はどう書きますか？

**A:** React が提供する型を使用します。

```tsx
const Component: React.FC = () => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget);
  };
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
};
```

---

## 🔍 追加のデバッグリソース

### 開発者ツール
- **React Developer Tools**: コンポーネントツリーとstateの確認
- **TypeScript Error Reporter**: 詳細な型エラー情報
- **ESLint**: コード品質の問題を早期発見

### 有用なVSCode拡張機能
- **ES7+ React/Redux/React-Native snippets**: コード補完
- **TypeScript Importer**: 自動インポート
- **Bracket Pair Colorizer**: 括弧の対応を視覚化
- **Error Lens**: エラーをインラインで表示

### オンラインデバッグツール
- **CodeSandbox**: ブラウザ上でのReact開発
- **TypeScript Playground**: 型の動作確認
- **React DevTools Profiler**: パフォーマンス分析

---

> 💡 **ヒント**: エラーが発生したら、まずエラーメッセージを注意深く読み、このガイドで該当する解決方法を探してください。それでも解決しない場合は、エラーメッセージでGoogle検索するか、Stack Overflowで類似の問題を探してみましょう。