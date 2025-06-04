# Session3: プロジェクト完成（60 分）

> 💡 **対象**: Session1-2 完了者（TypeScript 基礎習得済み）
> 🎯 **形式**: 講師サポート付きプロジェクト完成・発表
> ⏰ **時間**: 60 分

## 📚 関連補足資料

プロジェクト完成をサポートする補足資料をご用意しています：

- 💻 **[実践コード例](./Step01_補足_実践コード例.md)** - 完全なシステム実装例とベストプラクティス
- 🚨 **[トラブルシューティング](./Step01_補足_トラブルシューティング.md)** - デバッグとエラー解決の完全ガイド
- 📖 **[専門用語集](./Step01_補足_専門用語集.md)** - 高度な概念と用語の詳細解説
- 🌐 **[参考リソース](./Step01_補足_参考リソース.md)** - 継続学習のためのリソース集
- 🔧 **[開発環境ガイド](./Step01_補足_開発環境ガイド.md)** - 効率的な開発環境の活用

> 💡 **活用方法**: プロジェクト実装中の参考資料として、また発表準備や今後の学習計画立案にご活用ください。

## 📅 セッション概要

**学習目標**:

- [ ] 学生情報システムの完成
- [ ] TypeScript コードのデバッグ・最適化
- [ ] 学習成果の発表・共有
- [ ] Step01 全体の振り返りと次ステップの確認

**前提知識**:

- Session1-2 の内容（基本型注釈・実践演習）
- 学生情報システムの部分実装

---

## ⏰ 詳細タイムテーブル

| 時間         | 内容                       | 講師の役割                 | 学習者の活動   | 成果物       |
| ------------ | -------------------------- | -------------------------- | -------------- | ------------ |
| **0-10 分**  | 最終課題説明・目標設定     | 課題説明・期待値設定       | 理解・質問     | 実装計画     |
| **10-45 分** | プロジェクト完成・デバッグ | 個別サポート・デバッグ支援 | 開発・完成     | 完成システム |
| **45-60 分** | 成果発表・総括・次ステップ | 評価・フィードバック       | 発表・振り返り | 学習成果     |

---

## 🎯 最終課題：学生情報システム完成

> 📚 **実装サポート**: [実践コード例 - 学生管理システム完全版](./Step01_補足_実践コード例.md#ステップ4-学生管理システム) | [トラブルシューティング - デバッグガイド](./Step01_補足_トラブルシューティング.md#デバッグのコツ)

### 課題概要

Session2 で作成した学生情報システムを完成させ、以下の機能を追加実装してください。

### 必須実装機能

#### 1. 基本機能の完成（Session2 からの継続）

```typescript
// 既に実装済みの機能を確認・修正
- 学生の追加・検索
- 成績の追加・計算
- 平均点の算出
- 成績優秀者の抽出
```

#### 2. 新規追加機能

**A. 成績統計機能**

```typescript
// 実装してください：クラス全体の統計情報を取得する関数

type ClassStatistics = {
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number; // 60点以上の学生の割合
};

function getClassStatistics(): ClassStatistics {
  // ここに実装
}
```

**B. 学生ランキング機能**

```typescript
// 実装してください：成績順にソートされた学生リストを取得

type StudentRanking = {
  rank: number;
  student: Student;
  averageScore: number;
};

function getStudentRanking(): StudentRanking[] {
  // ここに実装
}
```

**C. 科目別統計機能**

```typescript
// 実装してください：科目ごとの統計情報を取得

type SubjectStatistics = {
  subject: string;
  averageScore: number;
  studentCount: number;
  highestScore: number;
  lowestScore: number;
};

function getSubjectStatistics(): SubjectStatistics[] {
  // ここに実装
}
```

#### 3. エラーハンドリングの強化

```typescript
// カスタムエラー型の定義
type StudentError = {
  type: "NOT_FOUND" | "INVALID_DATA" | "DUPLICATE";
  message: string;
  studentId?: number;
};

// エラーハンドリングを含む関数の例
function addStudentSafe(
  name: string,
  age: number,
  email: string
): Student | StudentError {
  // バリデーション処理
  if (!name || name.trim().length === 0) {
    return {
      type: "INVALID_DATA",
      message: "学生名は必須です",
    };
  }

  if (age < 0 || age > 150) {
    return {
      type: "INVALID_DATA",
      message: "年齢は0-150の範囲で入力してください",
    };
  }

  // メールアドレスの重複チェック
  const existingStudent = students.find((s) => s.email === email);
  if (existingStudent) {
    return {
      type: "DUPLICATE",
      message: "このメールアドレスは既に登録されています",
    };
  }

  // 正常な場合は学生を作成
  return createStudent(name, age, email);
}
```

### 実装のヒント

1. **段階的実装**: 一つずつ機能を追加し、動作確認を行う
2. **型安全性**: すべての関数に適切な型注釈を付ける
3. **エラーハンドリング**: 想定される例外ケースを考慮する
4. **テストデータ**: 実装した機能をテストするためのサンプルデータを用意

---

## 👨‍🏫 学習ポイント

### 🤔 よくある実装上の問題と解決法

**問題 1: 配列操作でのエラー**

```typescript
// ❌ 問題のあるコード
function findStudent(id: number) {
  return students.find((s) => s.id === id); // undefined の可能性
}

// ✅ 改善されたコード
function findStudent(id: number): Student | null {
  const student = students.find((s) => s.id === id);
  return student || null;
}
```

**問題 2: 型の不整合**

```typescript
// ❌ 問題のあるコード
function calculateAverage(grades) {
  // 型注釈なし
  return grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length;
}

// ✅ 改善されたコード
function calculateAverage(grades: Grade[]): number {
  if (grades.length === 0) return 0;
  return grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length;
}
```

**問題 3: エラーハンドリングの不備**

```typescript
// ❌ 問題のあるコード
function addGrade(studentId: number, subject: string, score: number) {
  const student = students.find((s) => s.id === studentId);
  student.grades.push({ subject, score, date: new Date() }); // studentがundefinedの可能性
}

// ✅ 改善されたコード
function addGrade(
  studentId: number,
  subject: string,
  score: number
): Grade | StudentError {
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return {
      type: "NOT_FOUND",
      message: "指定された学生が見つかりません",
      studentId,
    };
  }

  const grade: Grade = { subject, score, date: new Date() };
  student.grades.push(grade);
  return grade;
}
```

---

## 成果物

- [ ] **基本的な学生情報処理システム**: 型注釈練習に特化した初学者向けプロジェクト → [Step01 成果物](./Step01_成果物.md)で詳細確認

---

## 📊 Step01 総合評価

### 最終評価基準

#### 技術習得度（60%）

- [ ] **基本型注釈**: string, number, boolean, 配列の型注釈
- [ ] **関数型注釈**: 引数・戻り値の型定義
- [ ] **オブジェクト型**: 型エイリアス・オプショナルプロパティ
- [ ] **エラーハンドリング**: 適切な例外処理の実装

#### 実装品質（25%）

- [ ] **コードの可読性**: 変数名・関数名の適切性
- [ ] **型安全性**: TypeScript の恩恵を活用
- [ ] **保守性**: 拡張しやすい設計
- [ ] **動作確認**: 実装した機能の正常動作

#### 学習姿勢（15%）

- [ ] **積極性**: 質問・議論への参加
- [ ] **問題解決**: 自力でのデバッグ・調査
- [ ] **協調性**: 他の学習者との協力
- [ ] **振り返り**: 学習内容の整理・次ステップの計画

---

**🎉 お疲れ様でした！** Step01 を通じて TypeScript の基礎をしっかりと身につけることができました。

**🚀 次の Step02 では、より高度な型システムと実践的な開発手法を学習します！**
