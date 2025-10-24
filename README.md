# Supabase Keep-Alive ⏰

**自动保持 Supabase 免费项目活跃状态 · 零数据库操作 · 完全自动化**

避免 Supabase 免费项目因 7 天无活动而被暂停。

## ✨ 功能特点

- 🎯 **零数据库操作** - 无需建立任何表或执行 SQL
- 🚀 **零维护成本** - 部署后自动运行，无需人工干预
- ⏰ **每日自动触发** - 使用 Vercel Cron Jobs 每天自动执行
- 🔒 **安全可靠** - 支持 Secret Token 验证，防止未授权访问
- 📊 **详细日志** - 记录每次执行状态和执行时间
- 🆓 **完全免费** - 使用 Vercel 和 Supabase 免费计划
- ⚡ **极简设计** - 只需 2 个环境变量即可运行

## 🎯 工作原理

本项目通过直接访问 Supabase REST API 的 root 端点来触发数据库活动，无需建立任何专用表。任何对 Supabase API 的请求都会重置 7 天无活动计时器。

## 📋 前置需求

- [Supabase](https://supabase.com) 免费项目（任何项目都可以）
- [Vercel](https://vercel.com) 账号
- Node.js 18+ (仅本地开发需要)

## 🚀 快速开始

### 1. 取得 Supabase API 密钥

1. 前往 [Supabase Dashboard](https://app.supabase.com)
2. 选择您的项目
3. 点击 **Project Settings** > **API Keys**
4. 复制以下信息：
   - **anon public** key
5. 点击 **Connect** > **App Frameworks**
6. 复制 **NEXT_PUBLIC_SUPABASE_URL** 的值 (例如: `https://xxx.supabase.co`)

### 2. 部署到 Vercel

#### 方法 A: 一键部署 (推荐)

点击下方按钮直接部署到 Vercel，系统会自动引导您设置环境变量：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chun1617/supabase-keep-alive&env=SUPABASE_URL,SUPABASE_ANON_KEY&envDescription=Required%20Supabase%20credentials&envLink=https://github.com/chun1617/supabase-keep-alive#readme)

部署时需要设置以下环境变量：
- `SUPABASE_URL` = 您的 Supabase URL (例如: `https://xxx.supabase.co`)
- `SUPABASE_ANON_KEY` = 您的 anon public key

> **提示：** `CRON_SECRET` 为可选配置，如需额外安全验证可稍后在 Vercel Dashboard 中添加。

#### 方法 B: 使用 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 设置环境变量
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add CRON_SECRET  # 可选

# 5. 重新部署以应用环境变量
vercel --prod
```

#### 方法 C: 使用 Vercel Dashboard

1. 前往 [Vercel Dashboard](https://vercel.com/new)
2. 导入您的 Git 仓库
3. 设置环境变量：
   - `SUPABASE_URL` = 您的 Supabase URL
   - `SUPABASE_ANON_KEY` = 您的 anon key
   - `CRON_SECRET` = 任意随机字符串（可选）
4. 点击 **Deploy**

### 3. 验证部署

1. 前往 **Vercel Dashboard** > 您的项目 > **Settings** > **Cron Jobs**
2. 确认看到 `/api/keep-alive` 排程（每天 UTC 8:00）
3. 点击 **Trigger** 手动测试
4. 检查 **Logs** 确认执行成功

预期响应：

```json
{
  "success": true,
  "timestamp": "2024-01-01T08:00:00.000Z",
  "message": "Keep-alive ping successful - Supabase project is active",
  "executionTime": "45ms"
}
```

## ✅ 完成！

您的 Supabase 项目现在会每天自动保持活跃状态！

---

## 🧪 本地开发（可选）

如果想在本地测试：

```bash
# 1. Clone 项目
git clone https://github.com/chun1617/supabase-keep-alive.git
cd supabase-keep-alive

# 2. 安装依赖
npm install

# 3. 建立环境变量文件
cp .env.example .env.local

# 4. 编辑 .env.local，填入您的 Supabase 信息
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key

# 5. 启动开发服务器
npm run dev

# 6. 测试 API
curl http://localhost:3000/api/keep-alive
```

---

## 📖 使用说明

### Cron 排程设置

预设排程为 **每天 UTC 8:00** 执行 (`0 8 * * *`)。

如需修改排程，编辑 `vercel.json`：

```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "0 */12 * * *"  // 每 12 小时执行一次
    }
  ]
}
```

**常用 Cron 表达式：**
- `0 0 * * *` - 每天午夜 (UTC)
- `0 8 * * *` - 每天早上 8:00 (UTC)
- `0 */12 * * *` - 每 12 小时
- `0 */6 * * *` - 每 6 小时

### 监控执行状态

#### Vercel 日志

1. **Vercel Dashboard** > 您的项目 > **Deployments**
2. 点击最新的部署
3. 查看 **Functions** 标签
4. 找到 `/api/keep-alive` 的执行记录

成功执行的日志应该显示：
```
Keep-alive ping successful: {
  timestamp: '2024-01-01T08:00:00.000Z',
  executionTime: '45ms',
  supabaseUrl: 'https://xxx.supabase.co'
}
```

---

## 🔧 进阶配置

### 停用 CRON_SECRET 验证

如果您不需要额外的安全验证：

1. 从 Vercel 环境变量移除 `CRON_SECRET`
2. API 端点会自动跳过验证步骤

### 生成安全的 CRON_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🐛 故障排除

### 问题 1: "Missing environment variable"

**原因：** 环境变量未正确设置

**解决方案：**
1. 检查 Vercel Dashboard > Settings > Environment Variables
2. 确认 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 已设置
3. 重新部署项目

### 问题 2: "Unauthorized" 错误

**原因：** CRON_SECRET 不匹配或格式错误

**解决方案：**
1. 确认 Vercel 的 `CRON_SECRET` 设置正确
2. 或暂时移除 `CRON_SECRET` 停用验证
3. 确保请求 header 格式为 `Authorization: Bearer <secret>`

### 问题 3: "Supabase API returned 4xx/5xx"

**原因：** Supabase API Key 无效或项目已暂停

**解决方案：**
1. 确认 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 正确
2. 检查 Supabase 项目是否已暂停（需手动恢复）
3. 确认 API Key 未过期或被撤销

### 问题 4: Cron Job 未执行

**原因：** Vercel 免费计划的 Cron 限制

**解决方案：**
1. 确认 `vercel.json` 格式正确
2. 检查 Vercel Dashboard > Settings > Cron Jobs 是否显示排程
3. 手动点击 "Trigger" 测试
4. **注意：** Hobby 计划无法保证准时执行，可能有延迟

---

## 📚 相关资源

- [Supabase 文档](https://supabase.com/docs)
- [Supabase REST API 文档](https://supabase.com/docs/guides/api)
- [Vercel Cron Jobs 文档](https://vercel.com/docs/cron-jobs)
- [Next.js API Routes 文档](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## ⭐ 支持项目

如果这个项目对您有帮助，请给个星星 ⭐️

---

## ⚠️ 免责声明

此项目仅用于保持 Supabase 免费项目活跃，避免因长期未使用而被暂停。请确保您的使用符合 [Supabase 服务条款](https://supabase.com/terms)。
