# 个人主页设计文档

> 2026-06-03 · Astro 个人综合型主页

## 1. 定位与目标

综合型个人主页——单页面展示个人信息、技能、项目、天气、音乐、一言、时光进度条。目标受众：个人社交/职业网络，通过简洁页面快速了解「我是谁、我会什么、我在做什么」。

## 2. 视觉设计

### 2.1 设计语言来源

直接继承两个现有参考项目的设计 Token，不自行发挥：

| 来源 | 项目 | 继承内容 |
|------|------|---------|
| ZYYO666 | `homepage/` | CSS 变量系统（暗/亮主题）、`--item_bg_color` + `backdrop-filter: blur()` 卡片、`--gradient` 标题渐变动画、`--left_tag_item` 标签样式、`--fill` SVG 图标颜色 |
| 無名 | `home/` | `.cards { background: #00000040; backdrop-filter: blur(10px); border-radius: 6px; }` 卡片基础类、加载动画（fade-blur-in）、自定义光标、进度条样式 |

### 2.2 核心设计 Token

```css
/* 暗色主题 — 默认（来自 ZYYO666 Dark 主题） */
:root {
  --main_text_color: #fff;
  --gradient: linear-gradient(120deg, rgb(133, 62, 255), #f76cc6 30%, rgb(255, 255, 255) 60%);
  --purple_text_color: #747bff;
  --text_bg_color: rgb(26, 4, 48);
  --item_bg_color: rgb(19, 20, 24);
  --item_hover_color: rgb(19, 23, 27);
  --item_left_title_color: rgb(255, 255, 255);
  --item_left_text_color: rgb(142, 142, 142);
  --footer_text_color: #646464;
  --left_tag_item: linear-gradient(50deg, #1f2327, #000000);
  --card_filter: 10px;
  --back_filter: 0px;
  --back_filter_color: #000000;
  --fill: #ffffff;
}

/* 卡片基础类（来自 無名） */
.cards {
  border-radius: 6px;
  background-color: #00000040;
  backdrop-filter: blur(10px);
  transform: scale(1);
  transition: backdrop-filter 0.3s, transform 0.3s;
}
.cards:hover { transform: scale(1.01); }
.cards:active { transform: scale(0.98); }
```

### 2.3 动画

- 标题渐变位移动画 `backgroundSizeAnimation` 10s ease-in-out（来自 ZYYO666）
- 页面入口 `fade-blur-in` 模糊渐现（来自 無名）
- 加载动画：径向渐变圆 `zoom` 脉冲（来自 ZYYO666）
- Hover 微交互：`translateY(-2px)` / `scale(1.01)` + 背景颜色过渡
- 自定义光标：白色半透明圆点跟随鼠标（来自 無名）

## 3. 布局

### 3.1 桌面端（> 800px）

双栏反转布局：

```
┌──────────────────────────────────────────┐
│  左栏 30%           │  右栏 70%           │
│                     │                    │
│  ┌───────────────┐  │  ┌──────────────┐  │
│  │  天气 + 时间   │  │  │ 头像 + 简介  │  │
│  │  (Island)     │  │  │ + 社交链接   │  │
│  └───────────────┘  │  └──────────────┘  │
│  ┌───────────────┐  │  ┌──────────────┐  │
│  │  一言         │  │  │ 技能标签     │  │
│  │  (Island)     │  │  └──────────────┘  │
│  └───────────────┘  │  ┌──────────────┐  │
│  ┌───────────────┐  │  │ 项目展示     │  │
│  │  时光进度条   │  │  │              │  │
│  └───────────────┘  │  └──────────────┘  │
│  ┌───────────────┐  │                    │
│  │  音乐播放器   │  │                    │
│  │  (Island)     │  │                    │
│  └───────────────┘  │                    │
└──────────────────────────────────────────┘
│              页脚                         │
└──────────────────────────────────────────┘
```

### 3.2 移动端（≤ 800px）

两栏上下堆叠，左栏（功能区）在上，右栏（信息区）在下。卡片宽度 100%。

## 4. 技术栈

| 项目 | 选型 |
|------|------|
| 框架 | Astro |
| UI 组件 | `.astro` 静态组件 + Preact Island |
| 样式 | 纯 CSS（CSS 变量驱动主题） |
| 图标 | 内联 SVG，fill 由 `--fill` 变量控制 |
| 字体 | HarmonyOS Sans（中文）+ Pacifico-Regular（英文标题）+ Ubuntu（备选） |
| 包管理 | pnpm |
| 目标部署 | 静态导出（`astro build`），可部署到任意静态托管服务 |

## 5. 组件树

```
src/
├── pages/
│   └── index.astro              # 入口页，组装 MainLayout
├── layouts/
│   └── MainLayout.astro         # 背景层 + 加载动画 + 双栏容器 + 页脚
├── components/
│   ├── icons/                   # SVG 图标文件（按名引用）
│   ├── left/
│   │   ├── WeatherTime.island   # Island · client:visible · 时钟 + wttr.in 天气
│   │   ├── Hitokoto.island      # Island · client:visible · fetch 一言 API
│   │   ├── Progress.astro       # 纯 HTML + 内联 script 计算年进度
│   │   └── Music.island         # Island · client:visible · APlayer + Meting API
│   └── right/
│       ├── Profile.astro        # 静态 · 头像 + 简介 + 社交链接
│       ├── Skills.astro         # 静态 · 技能标签云
│       └── Projects.astro       # 静态 · 项目卡片网格
├── config/
│   ├── profile.json             # 个人基本信息
│   ├── social.json              # 社交链接列表
│   ├── skills.json              # 技能标签列表
│   └── projects.json            # 项目列表
├── styles/
│   ├── theme.css                # CSS 变量（暗/亮主题）
│   ├── cards.css                # 卡片 + blur 公用样式
│   └── global.css               # reset + 字体 + 动画 keyframes
└── public/
    ├── images/
    │   ├── avatar.webp          # 头像
    │   └── background.webp      # 背景图（可选）
    └── font/
        ├── Pacifico-Regular.ttf
        └── Ubuntu-Regular.ttf   # 备选
```

### Island 加载策略

| Island | 加载条件 | 原因 |
|--------|---------|------|
| WeatherTime | `client:visible` | 时钟 tick + API fetch，非首屏关键 |
| Hitokoto | `client:visible` | API fetch，非关键内容 |
| Music | `client:visible` | APlayer 初始化重，按需加载 |
| Progress | 不需要 Island | 年进度可纯静态计算 |

其余组件不包含任何客户端 JS，生成纯 HTML。

## 6. 数据模型

### `config/profile.json`
```json
{
  "name": "你的名字",
  "bio": "一句话简介",
  "avatar": "/images/avatar.webp"
}
```

### `config/social.json`
```json
[
  { "name": "GitHub", "url": "https://github.com/xxx", "icon": "github" },
  { "name": "Email", "url": "mailto:xxx@example.com", "icon": "email" }
]
```
- `icon` 字段对应 `src/icons/` 下的 SVG 文件名，组件自动匹配渲染

### `config/skills.json`
```json
{
  "title": "skills",
  "items": ["JavaScript", "TypeScript", "React", "Vue", "Node.js", "Docker"]
}
```

### `config/projects.json`
```json
[
  {
    "name": "项目名称",
    "desc": "简短描述",
    "url": "https://...",
    "icon": "/images/project-icon.png"
  }
]
```

### 环境变量 `.env`
```bash
# 必填
VITE_SITE_NAME=你的名字
VITE_SITE_DES=站点描述

# 音乐（Meting API）
VITE_SONG_API=https://api-meting.imsyy.top
VITE_SONG_SERVER=netease
VITE_SONG_TYPE=playlist
VITE_SONG_ID=7452421335

# 天气（wttr.in，可选）
# 默认用 wttr.in 伦敦，可设城市名
VITE_WEATHER_CITY=Shenzhen

# 一言（可选，默认用 v1.hitokoto.cn）
VITE_HITOKOTO_API=https://v1.hitokoto.cn
```

## 7. API 集成

### 7.1 天气（wttr.in）

- 端点：`https://wttr.in/{city}?format=j1`
- 免费，无需 Key，返回 JSON 含当前天气、温度、湿度
- 前端缓存：30 分钟刷新一次

### 7.2 一言（Hitokoto）

- 端点：`https://v1.hitokoto.cn`
- 免费，无需 Key
- 每次页面加载随机获取一句

### 7.3 音乐（Meting + APlayer）

- Meting API 端点：由 `.env` 中 `VITE_SONG_API` 配置
- APlayer 组件初始化，传入 Meting 返回的歌曲列表
- 服务端：网易云音乐

## 8. 主题系统

继承 ZYYO666 的 CSS 变量主题方案：

- 用 CSS 变量定义所有颜色，通过切换 `html` 上的 `data-theme` 属性在暗/亮之间切换
- 暗色主题作为默认（两个参考项目的共同选择）
- 主题切换开关放在页脚区域（小 toggle，参考 ZYYO666 的 onoffswitch）
- 用户选择存储到 `localStorage`，下次访问自动恢复

```css
/* 亮色主题（后续迭代添加，留好变量结构） */
html[data-theme="Light"] {
  --main_text_color: #000000;
  --item_bg_color: rgb(247, 247, 247);
  --item_hover_color: rgba(244, 245, 246, 0.5);
  --fill: #000000;
  /* ... */
}
```

## 9. 错误处理

| 场景 | 处理策略 |
|------|---------|
| 天气 API 不可达 | 仅显示时钟，天气区域显示"天气不可用" |
| 一言 API 不可达 | 显示预设句子作为 fallback |
| 音乐 API 不可达 | 隐藏播放器组件，不显示错误 |
| 头像图片加载失败 | 显示 CSS 渐变色占位圆 |
| JavaScript 被禁用 | 静态内容正常渲染，Island 区域显示占位 |
| 移动端 | 双栏变单栏，左右内容上下堆叠 |

## 10. 部署

- 构建命令：`pnpm build`（输出到 `dist/`）
- 目标：静态文件托管（Vercel / Cloudflare Pages / Nginx 均可）
- 无需服务端运行时

## 11. 不在范围（YAGNI）

- 博客/文章系统
- 后台管理界面（CMS）
- 评论系统
- 多语言支持
- PWA / Service Worker
- 亮色主题（预留变量结构，但首版不实现）
