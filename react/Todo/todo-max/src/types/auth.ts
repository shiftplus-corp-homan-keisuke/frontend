export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  // 他に必要なユーザー情報があれば追加
}
