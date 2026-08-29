# 落雁 · 阴阳寮运维网站

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7-purple?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind-3.4-cyan?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/tRPC-11-orange" alt="tRPC">
  <img src="https://img.shields.io/badge/Hono-4-red" alt="Hono">
</p>

> **落雁**（luoyan）—— 专为《阴阳师》阴阳寮打造的一站式运维门户，集公告管理、黑话词典、攻略中心、活动日历、成员管理于一体。

---

## 📖 项目简介

阴阳师的「阴阳寮」（玩家公会）是游戏社交与资源获取的核心单元，但日常运维高度依赖人工：会长/副会长需要按时开启道馆突破、狩猎战等活动，维护成员活跃度，发布通知，还要承担萌新教学工作。

**落雁** 将「管理工具 + 知识库 + 攻略中心」集中到一个平台，解决信息分散、新人上手成本高的问题：

- 📢 **公告中心** — 管理端发布/置顶/定时发布公告，富文本编辑
- 📚 **黑话词典** — 萌新第一站，覆盖资源货币、副本简称、御魂属性、玩家文化等分类
- ⚔️ **攻略中心** — PVP/PVE 指导、副本攻略、寮运维 SOP，按版本持续更新
- 📅 **活动日历** — 狩猎战、阴界之门、狭间暗域等固定活动时刻表 + 自定义活动
- 👥 **成员管理** — 花名册、活跃度与功勋看板、招新申请审批
- ✅ **课表打卡** — 日常/周常清单勾选，进度按账号持久化

---

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | React 19 · TypeScript · Vite 7 · Tailwind CSS v3 · shadcn/ui (40+ 组件) |
| **状态/请求** | tRPC 11 · TanStack Query 5 · Zod |
| **后端** | Hono (Node.js) · tRPC 集成 |
| **数据库** | MySQL 8 · Drizzle ORM · Drizzle Kit |
| **存储** | AWS S3 (兼容) |
| **工具链** | ESLint 9 · Prettier · Vitest · esbuild |

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 20
- MySQL 8

### 安装与启动

```bash
# 进入应用目录
cd app

# 安装依赖
npm install

# 配置环境变量（复制后按需修改）
cp .env.example .env

# 执行数据库迁移
npm run db:migrate

# 开发模式启动
npm run dev
```

开发服务器启动后，访问 `http://localhost:5173`。

### 构建与部署

```bash
# 构建生产包
npm run build

# 启动生产服务器
npm run start
```

---

## 📁 项目结构

```
luoyan/
├── app/                          # 主应用目录
│   ├── api/                      # Hono 后端路由与中间件
│   │   ├── router.ts             # tRPC 路由总入口
│   │   ├── auth-router.ts        # 认证相关路由
│   │   ├── admin-router.ts       # 管理后台路由
│   │   ├── content-router.ts     # 内容管理路由
│   │   ├── middleware.ts         # 请求中间件
│   │   ├── context.ts            # tRPC 上下文
│   │   ├── boot.ts               # 服务端启动入口
│   │   └── init-db.ts            # 数据库初始化
│   ├── db/                       # Drizzle ORM 定义
│   │   ├── schema.ts             # 数据库表结构
│   │   ├── relations.ts          # 表关系定义
│   │   ├── seed.ts               # 种子数据脚本
│   │   └── seed-data.ts          # 种子数据内容
│   ├── src/                      # React 前端源码
│   │   ├── App.tsx               # 根组件
│   │   ├── main.tsx              # 渲染入口
│   │   ├── config.ts             # 应用配置
│   │   ├── const.ts              # 常量定义
│   │   ├── index.css             # 全局样式
│   │   └── App.css               # 组件样式
│   ├── drizzle.config.ts         # Drizzle 配置文件
│   ├── vite.config.ts            # Vite 构建配置
│   ├── tailwind.config.js        # Tailwind 主题配置
│   └── package.json
│
└── 阴阳师寮运维网站需求说明书.md   # 详细需求文档
```

---

## 🗺 功能规划

| 阶段 | 范围 | 状态 |
|------|------|------|
| **V1.0 MVP** | 首页、公告、黑话词典、攻略中心、用户权限、后台管理 | 🚧 开发中 |
| **V1.1** | 活动日历、成员花名册、活跃度看板、招新申请、全站搜索 | 📋 待启动 |
| **V2.0** | 黑话联动、课表打卡、留言讨论、群机器人同步、多寮扩展 | 📋 规划中 |

---

## 🤝 参与贡献

落雁的攻略内容需要寮内攻略组持续维护更新。如果你：

- 熟悉阴阳师各类玩法，愿意整理攻略
- 有前端/后端开发经验，想一起完善功能
- 有 UI/UX 设计能力，想优化和风视觉体验

欢迎通过 Issue 或 PR 参与！

---

## 📄 许可

本项目采用 [MIT License](LICENSE) 开源。

---

<p align="center">
  <sub>Made with ❤️ for 阴阳师阴阳寮</sub>
</p>
