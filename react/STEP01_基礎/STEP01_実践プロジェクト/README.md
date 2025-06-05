# STEP01 実践プロジェクト：プロフィールカードアプリ

## 📚 プロジェクト概要

このプロジェクトは、React × TypeScript の基礎を学習するための実践的なプロフィールカードアプリケーションです。
Session1-4で学習した内容を統合し、実際に動作するアプリケーションを作成します。

## 🎯 学習目標

- [ ] React コンポーネントの作成と組み合わせ
- [ ] TypeScript の型定義と型安全性の活用
- [ ] useState を使用した状態管理
- [ ] Props を使用したコンポーネント間のデータ受け渡し
- [ ] イベントハンドリングの実装
- [ ] 条件付きレンダリングの活用
- [ ] リストレンダリングの実装
- [ ] フォーム処理とバリデーション

## 🏗️ プロジェクト構造

```
src/
├── types/           # 型定義（事前実装済み）
│   └── index.ts
├── data/            # サンプルデータ（事前実装済み）
│   └── sampleData.ts
├── styles/          # スタイル（事前実装済み）
│   └── App.css
├── components/      # コンポーネント（学習者が実装）
│   ├── ProfileCard.tsx
│   ├── SkillList.tsx
│   └── ProfileEditor.tsx
└── App.tsx          # メインアプリ（学習者が実装）
```

## 🚀 開発環境のセットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 開発サーバーの起動
```bash
npm run dev
```

3. ブラウザで http://localhost:5173 にアクセス

## 📝 実装手順

### Step 1: ProfileCard コンポーネントの実装（15分）

`src/components/ProfileCard.tsx` を実装してください。

**実装内容：**
- プロフィール情報の表示（名前、メール、自己紹介、場所）
- アバター表示（名前の最初の文字）
- 編集ボタンの実装
- 条件付きレンダリング（オプション項目の表示制御）

**使用するCSSクラス：**
- `.profile-card`
- `.profile-header`
- `.profile-avatar`
- `.profile-info`
- `.profile-bio`
- `.btn`, `.btn-primary`

**実装例：**
```tsx
return (
  <div className="profile-card">
    <div className="profile-header">
      <div className="profile-avatar">
        {profile.name.charAt(0)}
      </div>
      <div className="profile-info">
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
        {profile.location && <p>📍 {profile.location}</p>}
      </div>
    </div>
    {profile.bio && (
      <div className="profile-bio">
        {profile.bio}
      </div>
    )}
    <button className="btn btn-primary" onClick={onEdit}>
      編集
    </button>
  </div>
);
```

### Step 2: SkillList コンポーネントの実装（15分）

`src/components/SkillList.tsx` を実装してください。

**実装内容：**
- スキル配列のマップ処理
- 各スキルアイテムの表示
- スキルレベルに応じた色分け
- 適切なkey属性の設定

**使用するCSSクラス：**
- `.skills-section`
- `.skills-title`
- `.skills-grid`
- `.skill-item`
- `.skill-name`
- `.skill-level`

**実装例：**
```tsx
return (
  <div className="skills-section">
    <h3 className="skills-title">スキル</h3>
    <div className="skills-grid">
      {skills.map(skill => (
        <div key={skill.id} className={`skill-item ${skill.level}`}>
          <span className="skill-name">{skill.name}</span>
          <span className={`skill-level ${skill.level}`}>
            {skillLevelLabels[skill.level]}
          </span>
        </div>
      ))}
    </div>
  </div>
);
```

### Step 3: ProfileEditor コンポーネントの実装（20分）

`src/components/ProfileEditor.tsx` を実装してください。

**実装内容：**
- フォーム状態管理（useState）
- 入力フィールドの実装
- バリデーション機能
- 保存・キャンセル機能

**実装のポイント：**
```tsx
// 入力値変更ハンドラー
const handleInputChange = (field: keyof ProfileFormData, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
  
  // エラークリア
  if (errors[field]) {
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  }
};

// バリデーション
const validateForm = (): boolean => {
  const newErrors: FormErrors = {};
  
  if (!formData.name.trim()) {
    newErrors.name = '名前は必須です';
  }
  
  if (!formData.email.trim()) {
    newErrors.email = 'メールアドレスは必須です';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = '有効なメールアドレスを入力してください';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Step 4: App コンポーネントの統合（10分）

`src/App.tsx` を完成させてください。

**実装内容：**
- 編集モードの状態管理
- 条件付きレンダリング
- イベントハンドラーの実装

**実装例：**
```tsx
// 編集モード開始
const handleEditStart = () => {
  setIsEditing(true);
};

// 編集キャンセル
const handleEditCancel = () => {
  setIsEditing(false);
};

// プロフィール保存
const handleProfileSave = (updatedProfile: CompleteProfile) => {
  setProfile(updatedProfile);
  setIsEditing(false);
};

// 条件付きレンダリング
return (
  <div className="app">
    {/* ヘッダー */}
    <main>
      {isEditing ? (
        <ProfileEditor 
          profile={profile}
          onSave={handleProfileSave}
          onCancel={handleEditCancel}
        />
      ) : (
        <div>
          <ProfileCard profile={profile} onEdit={handleEditStart} />
          <SkillList skills={profile.skills} />
        </div>
      )}
    </main>
  </div>
);
```

## 🎉 完成後の確認事項

- [ ] プロフィール情報が正しく表示される
- [ ] スキルリストが適切に表示される
- [ ] 編集ボタンで編集モードに切り替わる
- [ ] フォームで情報を編集できる
- [ ] バリデーションが動作する
- [ ] 保存後に表示モードに戻る
- [ ] キャンセルで変更が破棄される

## 🔧 トラブルシューティング

### よくあるエラー

1. **型エラーが発生する場合**
   - `types/index.ts` の型定義を確認
   - import文が正しいかチェック

2. **スタイルが適用されない場合**
   - CSSクラス名が正しいかチェック
   - `styles/App.css` がインポートされているか確認

3. **コンポーネントが表示されない場合**
   - export/import が正しいかチェック
   - JSXの構文エラーがないか確認

## 📚 参考資料

- [React公式ドキュメント](https://ja.react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [STEP01補足資料](../STEP01_補足_実践コード例.md)

## 🎯 発展課題（時間に余裕がある場合）

- [ ] スキルの追加・削除機能
- [ ] プロフィール画像のアップロード機能
- [ ] ダークモード切り替え
- [ ] ローカルストレージでのデータ永続化
- [ ] アニメーション効果の追加

頑張って実装してください！🚀
