import { atom } from "jotai";
import { createEntityStore, createEntityHook, type WithId } from "./entity-store";

/**
 * ユーザーエンティティの型定義
 * WithIdインターフェースを実装し、IDを持つ
 */
export interface User extends WithId {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active?: boolean; // オプショナルなアクティブ状態
}

/**
 * ユーザー固有のアクション型定義
 * 共通のEntityActionに加えて、ユーザー特有の操作を定義
 */
export type UserSpecificAction = 
  | { type: 'updateEmail'; payload: { id: string; email: string } }
  | { type: 'toggleActive'; payload: string }
  | { type: 'updateFullName'; payload: { id: string; firstName: string; lastName: string } };

/**
 * ユーザーエンティティストアの作成
 * 共通のCRUD操作と派生Atomを提供
 */
export const userStore = createEntityStore<User>();

/**
 * ユーザー固有のアクションを処理するAtom
 * 共通操作では対応できないユーザー特有の操作を実装
 */
export const userSpecificActionsAtom = atom(
  null,
  (get, set, action: UserSpecificAction) => {
    const currentUsers = get(userStore.entitiesAtom);
    
    switch (action.type) {
      case 'updateEmail':
        // 共通のupdateアクションを使用してメール更新
        set(userStore.actionsAtom, {
          type: 'update',
          payload: { id: action.payload.id, data: { email: action.payload.email } }
        });
        break;
        
      case 'toggleActive':
        // ユーザーのアクティブ状態を切り替え
        const user = currentUsers.find(u => u.id === action.payload);
        if (user) {
          set(userStore.actionsAtom, {
            type: 'update',
            payload: { id: action.payload, data: { active: !user.active } }
          });
        }
        break;
        
      case 'updateFullName':
        // 姓名を同時に更新
        set(userStore.actionsAtom, {
          type: 'update',
          payload: { 
            id: action.payload.id, 
            data: { 
              firstName: action.payload.firstName, 
              lastName: action.payload.lastName 
            } 
          }
        });
        break;
    }
  }
);

/**
 * ユーザー固有の派生Atom
 * アクティブなユーザーのみを取得
 */
export const activeUsersAtom = atom(get => 
  get(userStore.entitiesAtom).filter(user => user.active !== false)
);

/**
 * ユーザー固有の派生Atom
 * メールドメイン別にユーザーをグループ化
 */
export const usersByDomainAtom = atom(get => {
  const users = get(userStore.entitiesAtom);
  return users.reduce((acc, user) => {
    const domain = user.email.split('@')[1];
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(user);
    return acc;
  }, {} as Record<string, User[]>);
});

/**
 * ユーザー固有の派生Atom
 * フルネームを計算して返す
 */
export const usersWithFullNameAtom = atom(get => 
  get(userStore.entitiesAtom).map(user => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`.trim()
  }))
);

/**
 * ユーザー操作用の統一されたHook
 * 共通操作とユーザー固有操作の両方を提供
 */
export const useUsers = createEntityHook(userStore, userSpecificActionsAtom);

/**
 * ユーザー作成用のヘルパー関数
 * @param firstName - 名前
 * @param lastName - 姓
 * @param email - メールアドレス
 * @param active - アクティブ状態（デフォルト: true）
 * @returns 新しいUserオブジェクト
 */
export function createUser(
  firstName: string, 
  lastName: string, 
  email: string, 
  active: boolean = true
): User {
  return {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
    active
  };
}

// 後方互換性のため、従来のUserクラスも提供
export class UserClass implements User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active?: boolean;

  constructor(id: string, firstName: string, lastName: string, email: string, active: boolean = true) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.active = active;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
