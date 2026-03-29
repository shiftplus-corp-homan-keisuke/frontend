---
description: プレビューサーバーの管理
---

プレビューサーバーの start/stop/restart/status/check を管理する。

## Usage

- `/preview` - 現在のステータス
- `/preview start` - 起動
- `/preview stop` - 停止
- `/preview restart` - 再起動
- `/preview check` - ヘルスチェック

$ARGUMENTS

## Steps

### 引数が無い/"status" の場合
1. サーバー起動確認
   - Run: !`ps aux | grep -E "(npm|node|next|vite|python|uvicorn)" | grep -v grep`
2. URL を含むステータス表示

### "start" の場合
1. 既に起動していないか確認
   - Run: !`ps aux | grep -E "(npm|node|next|vite|python|uvicorn)" | grep -v grep`
2. プロジェクト種別を検出して起動
   - Next.js: `npm run dev`
   - Vite: `npm run dev`
   - Python/FastAPI: `uvicorn main:app --reload`
   - Python/Flask: `flask run`
3. URL を表示（通常 http://localhost:3000 など）

### "stop" の場合
1. 起動プロセスを特定
   - Run: !`ps aux | grep -E "(npm|node|next|vite|python|uvicorn)" | grep -v grep`
2. 安全に停止
   - Run: !`pkill -f "next dev"` or appropriate command

### "restart" の場合
1. 停止
2. 2 秒待機
3. 再起動

### "check" の場合
1. 応答確認
   - Run: !`curl -s http://localhost:3000 > /dev/null && echo "OK" || echo "Not responding"`
2. ヘルス表示

## Output Format

status:
```
=== Preview Status ===

🌐 URL: [url]
📁 Project: [path]
🏷️ Type: [type]
💚 Health: [OK/Not Running]
```

start:
```
🚀 Starting preview...
   Port: [port-number]
   Type: [server-type]

✅ Preview ready!
   URL: [url]
```

port conflict:
```
⚠️ Port [port] is in use.

Options:
1. Start on port [alternative-port]
2. Close app on [port]
3. Specify different port

Which one? (default: 1)
```

指定された引数に基づいてプレビューサーバーを管理する。
