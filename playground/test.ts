import { z } from "zod";

// ユーザー情報を検証するスキーマ
const UserSchema = z.object({
  // `id`プロパティは、UUID形式の文字列であるべき
  id: z.uuid(),

  // `username`プロパティは、3文字以上の文字列であるべき
  username: z.string().min(3, "ユーザー名は3文字以上で入力してください"),

  // `email`プロパティは、メールアドレス形式の文字列であるべき
  email: z.email(),

  // `isAdmin`プロパティは、真偽値であるべき
  isAdmin: z.boolean(),
});

type User = z.infer<typeof UserSchema>;
