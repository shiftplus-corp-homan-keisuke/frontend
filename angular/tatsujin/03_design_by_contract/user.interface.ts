/**
 * [Interface] ユーザー情報の契約
 * 
 * TypeScriptの型システムにおける契約の例です。
 * あいまいな `any` や `object` を避け、プロパティの有無や可変性を厳格に定義します。
 */

// 基本的な型ID (Primitive Obsession を避けるための工夫として Brand Type も有効だが今回はシンプルに)
export type UserId = string;

export interface UserProfile {
  // readonly: 作成後に変更されないことを保証する契約
  readonly id: UserId;
  
  // 必須プロパティ: 必ず存在することを保証
  name: string;
  
  // オプショナルプロパティ: 存在しない可能性があることを明示 (?記法)
  // 利用側は undefined チェックを強制される
  age?: number;
  
  // Union Type: 値の範囲を制限する契約（これ以外の文字列は許容しない）
  status: 'active' | 'inactive' | 'suspended';
  
  // メタデータ: いつ作成されたか
  readonly createdAt: Date;
}

/**
 * [Type Guard] ユーザー定義の型ガード関数
 * ランタイムにおける契約の検証を行います。
 * 
 * `unknown` 型のデータを安全に `UserProfile` 型として扱うための関門として機能します。
 */
export function isUserProfile(data: unknown): data is UserProfile {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  
  const user = data as Partial<UserProfile>; // 一旦緩い型で扱う
  
  // 必須プロパティの存在確認
  return typeof user.id === 'string' &&
         typeof user.name === 'string' &&
         // Union Type の値チェック
         ['active', 'inactive', 'suspended'].includes(user.status as string) &&
         user.createdAt instanceof Date;
}
