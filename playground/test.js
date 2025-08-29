"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
// ユーザー情報を検証するスキーマ
var UserSchema = zod_1.z.object({
    // `id`プロパティは、UUID形式の文字列であるべき
    id: zod_1.z.uuid(),
    // `username`プロパティは、3文字以上の文字列であるべき
    username: zod_1.z.string().min(3, "ユーザー名は3文字以上で入力してください"),
    // `email`プロパティは、メールアドレス形式の文字列であるべき
    email: zod_1.z.email(),
    // `isAdmin`プロパティは、真偽値であるべき
    isAdmin: zod_1.z.boolean(),
});
