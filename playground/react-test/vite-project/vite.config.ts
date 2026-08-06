import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom = テスト用の「仮想ブラウザ」環境
    // 実際のブラウザがなくてもDOM操作ができる
    environment: "jsdom",

    // globals: true にすると describe, it, expect を
    // import しなくても使える（毎回 import する手間を省く）
    globals: true,

    // セットアップファイル: テストが始まる前に自動で読み込まれる
    // ここで「テスト用の便利機能」を有効にする
    setupFiles: "./src/test/setup.ts",
  },
});
