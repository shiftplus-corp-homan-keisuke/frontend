---
description: 事前チェック付きの本番デプロイ
---

本番デプロイのための DEPLOY モード。

## Task
$ARGUMENTS

## Usage

- `/deploy` - 対話型デプロイ
- `/deploy check` - 事前チェックのみ
- `/deploy preview` - preview/staging へデプロイ
- `/deploy production` - 本番デプロイ
- `/deploy rollback` - 直前に戻す

## Process

### Phase 1: Pre-Flight Checklist

デプロイ前に以下を実行:

#### Code Quality
```bash
# TypeScript check
!`npx tsc --noEmit 2>&1 || echo "No TypeScript"`

# Linting
!`npm run lint 2>&1 || echo "No lint script"`

# Tests
!`npm test 2>&1 || echo "No test script"`
```

#### Security
```bash
# Check for secrets
!`grep -r "password\|secret\|api_key\|token" --include="*.js" --include="*.ts" --include="*.json" . 2>/dev/null | grep -v node_modules | head -5 || echo "No secrets found"`

# Dependency audit
!`npm audit 2>&1 || echo "No audit script"`
```

#### Build
```bash
# Build project
!`npm run build 2>&1 || echo "No build script"`
```

チェックリスト表示:
```markdown
## 🚀 Pre-Deploy Checklist

### Code Quality
- [ ] No TypeScript errors
- [ ] ESLint passing
- [ ] All tests passing

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] Dependencies audited

### Performance
- [ ] Bundle size acceptable
- [ ] No console.log statements
- [ ] Images optimized

### Documentation
- [ ] README updated
- [ ] CHANGELOG updated

### Ready to deploy? (y/n)
```

### Phase 2: Deployment Flow

ユーザーが承認しチェックが通った場合:

1. **Build application**
   - 事前で実行済み
   - build 出力を確認

2. **Detect deployment platform**
   - Vercel (vercel.json, .vercel)
   - Railway (railway.json)
   - Fly.io (fly.toml)
   - Docker (Dockerfile, docker-compose.yml)
   - custom (nginx, apache)

3. **Deploy to platform**
   - Vercel: !`vercel --prod 2>&1 || echo "Vercel CLI not installed"`
   - Railway: !`railway up 2>&1 || echo "Railway CLI not installed"`
   - Fly.io: !`fly deploy 2>&1 || echo "Fly CLI not installed"`
   - Docker: !`docker compose up -d --build 2>&1 || echo "Docker not available"`

4. **Health check**
   - デプロイログ監視
   - 応答確認
   - エラー確認

### Phase 3: Verification

デプロイ後:

1. **Check deployment status**
   ```bash
   # Vercel
   !`vercel ls 2>&1 || echo "Not using Vercel"`

   # Generic health check
   !`curl -s -o /dev/null -w "%{http_code}" https://your-app.com 2>&1 || echo "Cannot reach app"`
   ```

2. **Display deployment summary**

### For Successful Deploy:
```markdown
## 🚀 Deployment Complete

### Summary
- **Version:** [version]
- **Environment:** [preview/production]
- **Duration:** [time]
- **Platform:** [platform]

### URLs
- 🌐 [Environment]: [url]
- 📊 Dashboard: [dashboard-url]

### What Changed
- [change 1]
- [change 2]
- [change 3]

### Health Check
✅ Application responding (200 OK)
✅ All services healthy
```

### For Failed Deploy:
```markdown
## ❌ Deployment Failed

### Error
[error message]

### Resolution
1. [fix step 1]
2. [fix step 2]
3. Try `/deploy` again

### Rollback Available
Previous version is still active.
Run `/deploy rollback` if needed.
```

## Platform Support

| Platform | Detection | Command |
|----------|-----------|---------|
| Vercel | vercel.json or .vercel | `vercel --prod` |
| Railway | railway.json | `railway up` |
| Fly.io | fly.toml | `fly deploy` |
| Docker | Dockerfile | `docker compose up -d --build` |

## Key Principles

- **Always run pre-flight checks**
- **Never skip tests for production**
- **Monitor deployment logs**
- **Have rollback plan ready**
- **Document deployments**

## Usage Examples

- `/deploy` → Full deployment wizard
- `/deploy check` → Run checks only
- `/deploy preview` → Deploy to staging
- `/deploy production` → Deploy to production
- `/deploy rollback` → Rollback deployment

安全にデプロイする。
