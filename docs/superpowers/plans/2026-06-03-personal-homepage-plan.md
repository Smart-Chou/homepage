# 个人主页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Astro personal homepage with dark theme, dual-column reverse layout, and Island-based interactive widgets.

**Architecture:** Astro static site with Preact Islands for interactive widgets (weather/clock, hitokoto, music). Pure `.astro` components for static content (profile, skills, projects, progress bar). CSS variables (inherited from ZYYO666's dark theme + 無名's card system) drive all theming. Content managed via JSON config files in `src/config/`.

**Tech Stack:** Astro 5, Preact, pnpm, APlayer + MetingJS (CDN), wttr.in weather API, Hitokoto API

---

## File Structure

```
src/
├── pages/
│   └── index.astro              # Entry page
├── layouts/
│   └── MainLayout.astro         # Background + loading + dual-column + footer + cursor
├── components/
│   ├── icons/
│   │   ├── github.svg
│   │   ├── email.svg
│   │   ├── link.svg
│   │   ├── skills.svg
│   │   └── project.svg
│   ├── left/
│   │   ├── WeatherTime.jsx      # Preact Island — clock + wttr.in weather
│   │   ├── Hitokoto.jsx         # Preact Island — fetch hitokoto API
│   │   ├── Progress.astro       # Static + inline script for year progress
│   │   └── Music.jsx            # Preact Island — APlayer + Meting
│   └── right/
│       ├── Profile.astro        # Static — avatar + name + bio + social
│       ├── Skills.astro         # Static — skill tags
│       └── Projects.astro       # Static — project cards grid
├── config/
│   ├── profile.json
│   ├── social.json
│   ├── skills.json
│   └── projects.json
├── utils/
│   └── icons.ts                 # Icon name → SVG import mapping
└── styles/
    ├── theme.css                # CSS variables (dark/light tokens)
    ├── cards.css                # Shared card + blur classes
    └── global.css               # Reset + fonts + keyframe animations

public/
├── images/
│   └── avatar.webp
└── font/
    ├── Pacifico-Regular.ttf
    └── Ubuntu-Regular.ttf
```

---

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.ts`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Create pnpm workspace and install Astro + Preact**

Run from project root:
```bash
cd /Users/chowcong/Documents/WebSiteCode/homepage
pnpm init
pnpm add astro @astrojs/preact preact
```

Expected: Installs Astro, Preact integration, and Preact.

- [ ] **Step 2: Create astro.config.ts**

```typescript
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  integrations: [preact()],
  output: 'static',
  vite: {
    envPrefix: 'PUBLIC_',
  },
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

- [ ] **Step 4: Update package.json scripts**

Edit `package.json` to have:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 5: Create directories**

```bash
mkdir -p src/pages src/layouts src/components/icons src/components/left src/components/right src/config src/utils src/styles public/images public/font
```

- [ ] **Step 6: Create .gitignore**

```
dist/
node_modules/
.env
.superpowers/
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: initialize Astro + Preact project"
```

---

### Task 2: Copy Fonts from Reference Projects

**Files:**
- Copy from: `home/public/font/Pacifico-Regular.ttf`
- Copy from: `homepage/static/fonts/Ubuntu-Regular.ttf`

- [ ] **Step 1: Copy Pacifico font from 無名 project**

```bash
cp /Users/chowcong/Documents/WebSiteCode/homepage/home/public/font/Pacifico-Regular.ttf /Users/chowcong/Documents/WebSiteCode/homepage/public/font/Pacifico-Regular.ttf
```

- [ ] **Step 2: Copy Ubuntu font from ZYYO666 project**

```bash
cp /Users/chowcong/Documents/WebSiteCode/homepage/homepage/static/fonts/Ubuntu-Regular.ttf /Users/chowcong/Documents/WebSiteCode/homepage/public/font/Ubuntu-Regular.ttf
```

- [ ] **Step 3: Copy avatar placeholder image (or create empty)**

```bash
# Create a placeholder until user provides their own avatar
touch /Users/chowcong/Documents/WebSiteCode/homepage/public/images/avatar.webp
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: copy fonts from reference projects"
```

---

### Task 3: Global Styles (global.css)

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write global.css with reset, fonts, and keyframe animations**

In `src/styles/global.css`:
```css
/*
 * Reset + fonts + animations
 * Fonts: HarmonyOS Sans (CDN), Pacifico-Regular (local), Ubuntu (local)
 * Animations: from ZYYO666 + 無名
 */

/* HarmonyOS Sans — from Bilibili CDN (same as 無名) */
@import url('https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css');

/* Pacifico-Regular — English title font */
@font-face {
  font-family: "Pacifico-Regular";
  font-display: swap;
  src: url("/font/Pacifico-Regular.ttf") format("truetype");
}

/* Ubuntu-Regular — fallback English font */
@font-face {
  font-family: "Ubuntu-Regular";
  font-display: swap;
  src: url("/font/Ubuntu-Regular.ttf") format("truetype");
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: "HarmonyOS_Regular", "Ubuntu-Regular", sans-serif;
  background-color: #111;
  color: var(--main_text_color);
  transition: background-color 0.2s ease, color 0.1s ease;
}

a, a:hover, a:link, a:visited, a:active, a:focus {
  text-decoration: none;
  outline: none;
  border: none;
  color: inherit;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

/* Scrollbar (hidden, as in ZYYO666) */
::-webkit-scrollbar { width: 0px; }
::-webkit-scrollbar-thumb {
  background-color: var(--main_text_color);
  border-radius: 8px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}

/* ===== Keyframe Animations ===== */

/* Loading: ZYYO666 zoom pulse */
@keyframes zoom {
  0%   { transform: scale(0); opacity: 1; }
  50%  { opacity: 0.5; }
  100% { transform: scale(1); opacity: 0; }
}

/* Page entrance: 無名 fade-blur-in */
@keyframes fade-blur-in {
  from {
    filter: blur(20px) brightness(0.3);
    transform: scale(1.6);
  }
  to {
    filter: blur(0) brightness(1);
    transform: scale(1);
  }
}

/* Fade */
@keyframes fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Gradient title shift: ZYYO666 backgroundSizeAnimation */
@keyframes bgShift {
  0%   { background-position: 0%; }
  50%  { background-position: 100%; }
  100% { background-position: 0%; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global styles with reset, fonts, and animations"
```

---

### Task 4: Theme CSS Variables (theme.css)

**Files:**
- Create: `src/styles/theme.css`

- [ ] **Step 1: Write theme.css with ZYYO666 dark theme defaults**

In `src/styles/theme.css`:
```css
/*
 * CSS Variables — inherited from ZYYO666 dark theme
 * Switch via html[data-theme="Light"] for future light mode
 */

:root {
  /* Text */
  --main_text_color: #fff;
  --footer_text_color: #646464;

  /* Gradient title — ZYYO666 signature */
  --gradient: linear-gradient(120deg, rgb(133, 62, 255), #f76cc6 30%, rgb(255, 255, 255) 60%);

  /* Accent */
  --purple_text_color: #747bff;
  --text_bg_color: rgb(26, 4, 48);

  /* Cards */
  --item_bg_color: rgb(19, 20, 24);
  --item_hover_color: rgb(19, 23, 27);
  --item_left_title_color: rgb(255, 255, 255);
  --item_left_text_color: rgb(142, 142, 142);

  /* Tags */
  --left_tag_item: linear-gradient(50deg, #1f2327, #000000);

  /* Blur filters */
  --card_filter: 10px;
  --back_filter: 0px;
  --back_filter_color: #000000;

  /* SVG icon fill */
  --fill: #ffffff;
}

/* Future light theme switch */
html[data-theme="Light"] {
  --main_text_color: #000000;
  --gradient: linear-gradient(120deg, #bd34fe, #e0321b 30%, #41d1ff 60%);
  --purple_text_color: #747bff;
  --text_bg_color: rgb(240, 243, 247);
  --item_bg_color: rgb(247, 247, 247);
  --item_hover_color: rgba(244, 245, 246, 0.5);
  --item_left_title_color: #000000;
  --item_left_text_color: #494949;
  --footer_text_color: #222222;
  --left_tag_item: #ffffff;
  --card_filter: 0px;
  --back_filter: 0px;
  --back_filter_color: #00000000;
  --fill: #000000;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/theme.css
git commit -m "feat: add CSS variable theme system from ZYYO666"
```

---

### Task 5: Shared Card Styles (cards.css)

**Files:**
- Create: `src/styles/cards.css`

- [ ] **Step 1: Write cards.css with 無名 + ZYYO666 card patterns**

In `src/styles/cards.css`:
```css
/*
 * Card base classes — inherited from 無名
 * Component cards — inherited from ZYYO666
 */

/* Base card — 無名 .cards */
.card {
  border-radius: 6px;
  background-color: #00000040;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: scale(1);
  transition: backdrop-filter 0.3s, transform 0.3s;
}
.card:hover {
  transform: scale(1.01);
}
.card:active {
  transform: scale(0.98);
}

/* Item card — ZYYO666 .projectItem / .iconItem */
.item-card {
  background: var(--item_bg_color);
  backdrop-filter: blur(var(--card_filter));
  -webkit-backdrop-filter: blur(var(--card_filter));
  border-radius: 8px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}
.item-card:hover {
  transform: translateY(-2px);
  background: var(--item_hover_color);
}

/* Gradient text — ZYYO666 .gradientText */
.gradient-text {
  background-image: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200%;
  animation: bgShift 10s ease-in-out infinite;
  font-family: "Pacifico-Regular", cursive;
}

/* Left tag — ZYYO666 .left-tag-item */
.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  font-size: 13px;
  border-radius: 10px;
  background: var(--left_tag_item);
  color: var(--main_text_color);
}

/* Section title — ZYYO666 .title */
.section-title {
  display: flex;
  align-items: center;
  font-size: 26px;
  font-weight: 800;
  margin: 20px 0;
  transition: transform 0.4s ease;
  color: var(--main_text_color);
}
.section-title:hover {
  transform: translateY(-5px);
}
.section-title svg {
  margin-right: 8px;
  width: 26px;
  height: 26px;
  fill: var(--fill);
}

/* Project card — ZYYO666 .projectItem */
.project-card {
  display: flex;
  background: var(--item_bg_color);
  backdrop-filter: blur(var(--card_filter));
  -webkit-backdrop-filter: blur(var(--card_filter));
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}
.project-card:hover {
  transform: translateY(-2px);
}

/* Blur background layer — ZYYO666 .zyyo-filter */
.blur-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: var(--back_filter_color);
  backdrop-filter: blur(var(--back_filter));
  -webkit-backdrop-filter: blur(var(--back_filter));
  z-index: -1;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/cards.css
git commit -m "feat: add shared card styles from reference projects"
```

---

### Task 6: Config JSON Files

**Files:**
- Create: `src/config/profile.json`
- Create: `src/config/social.json`
- Create: `src/config/skills.json`
- Create: `src/config/projects.json`

- [ ] **Step 1: Write profile.json**

In `src/config/profile.json`:
```json
{
  "name": "你的名字",
  "bio": "一句话简介，描述你是谁、做什么的",
  "avatar": "/images/avatar.webp"
}
```

- [ ] **Step 2: Write social.json**

In `src/config/social.json`:
```json
[
  { "name": "GitHub", "url": "https://github.com/yourusername", "icon": "github" },
  { "name": "Email", "url": "mailto:you@example.com", "icon": "email" }
]
```

- [ ] **Step 3: Write skills.json**

In `src/config/skills.json`:
```json
{
  "title": "skills",
  "items": []
}
```

- [ ] **Step 4: Write projects.json**

In `src/config/projects.json`:
```json
[]
```

- [ ] **Step 5: Commit**

```bash
git add src/config/
git commit -m "feat: add JSON config files for content management"
```

---

### Task 7: SVG Icon Files

**Files:**
- Create: `src/components/icons/github.svg`
- Create: `src/components/icons/email.svg`
- Create: `src/components/icons/link.svg`
- Create: `src/components/icons/skills.svg`
- Create: `src/components/icons/project.svg`
- Create: `src/utils/icons.ts`

- [ ] **Step 1: Write github.svg**

In `src/components/icons/github.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"/>
</svg>
```

- [ ] **Step 2: Write email.svg**

In `src/components/icons/email.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <path d="M926.47619 355.644952V780.190476a73.142857 73.142857 0 0 1-73.142857 73.142857H170.666667a73.142857 73.142857 0 0 1-73.142857-73.142857V355.644952l304.103619 257.828572a170.666667 170.666667 0 0 0 220.745142 0L926.47619 355.644952zM853.333333 170.666667a74.044952 74.044952 0 0 1 26.087619 4.778666 72.704 72.704 0 0 1 30.622477 22.186667 73.508571 73.508571 0 0 1 10.678857 17.67619c3.169524 7.509333 5.12 15.652571 5.607619 24.210286L926.47619 243.809524v24.380952L559.469714 581.241905a73.142857 73.142857 0 0 1-91.306666 2.901333l-3.632762-2.925714L97.52381 268.190476v-24.380952a72.899048 72.899048 0 0 1 40.155428-65.292191A72.97219 72.97219 0 0 1 170.666667 170.666667h682.666666z"/>
</svg>
```

- [ ] **Step 3: Write link.svg**

In `src/components/icons/link.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <path d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z"/>
</svg>
```

- [ ] **Step 4: Write skills.svg**

In `src/components/icons/skills.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <path d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333z"/>
</svg>
```

- [ ] **Step 5: Write project.svg**

In `src/components/icons/project.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <path d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"/>
</svg>
```

- [ ] **Step 6: Write icons.ts utility**

In `src/utils/icons.ts`:
```typescript
// Icon name → SVG file mapping
// Add new icons here, then reference by name in social.json
export const iconMap: Record<string, string> = {
  github: '/src/components/icons/github.svg',
  email: '/src/components/icons/email.svg',
  link: '/src/components/icons/link.svg',
};

export function getIconPath(name: string): string {
  return iconMap[name] || iconMap['link'];
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/icons/ src/utils/icons.ts
git commit -m "feat: add SVG icons and icon utility"
```

---

### Task 8: MainLayout.astro

**Files:**
- Create: `src/layouts/MainLayout.astro`

- [ ] **Step 1: Write MainLayout.astro with background, loading, dual-column, footer, custom cursor**

In `src/layouts/MainLayout.astro`:
```astro
---
// MainLayout.astro — Background layer + Loading screen + Dual-column container + Footer + Custom cursor
import '../styles/global.css';
import '../styles/theme.css';
import '../styles/cards.css';
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/images/avatar.webp" />
    <meta name="description" content="Personal homepage" />
    <title>Home</title>
  </head>
  <body>
    <!-- Loading screen — ZYYO666 style -->
    <div id="loading">
      <div id="loading-center"></div>
    </div>

    <!-- Blur background layer — ZYYO666 .zyyo-filter -->
    <div class="blur-bg"></div>

    <!-- Main app shell -->
    <main id="app">
      <div class="container">
        <div class="columns">
          <!-- Left column: widgets -->
          <aside class="left-col">
            <slot name="left" />
          </aside>
          <!-- Right column: info -->
          <section class="right-col">
            <slot name="right" />
          </section>
        </div>
      </div>
      <!-- Footer -->
      <footer class="site-footer">
        <slot name="footer" />
      </footer>
    </main>

    <!-- Custom cursor — 無名 style -->
    <div id="cursor"></div>
  </body>
</html>

<style is:global>
  /* Loading screen */
  #loading {
    background: radial-gradient(white, #d8eaff);
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 999999;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.5s ease;
  }
  #loading.hidden {
    opacity: 0;
    pointer-events: none;
  }
  #loading-center {
    height: 150px;
    width: 150px;
    position: relative;
    border-radius: 50%;
    background: #472eff;
    animation: zoom 1s linear infinite;
  }

  /* App container */
  #app {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    animation: fade-blur-in 0.65s ease forwards;
    animation-delay: 0.5s;
    opacity: 0;
  }
  .container {
    width: 100%;
    height: calc(100% - 40px);
    margin: 0 auto;
    padding: 0;
  }
  .columns {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding: 20px;
    gap: 16px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Left column: 30% widgets */
  .left-col {
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
  }
  .left-col::-webkit-scrollbar { display: none; }

  /* Right column: 70% info */
  .right-col {
    width: 70%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
  }
  .right-col::-webkit-scrollbar { display: none; }

  /* Footer */
  .site-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 8px 20px;
    text-align: center;
    background: var(--item_bg_color);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: var(--footer_text_color);
    font-size: 12px;
    z-index: 10;
  }

  /* Custom cursor — 無名 */
  #cursor {
    position: fixed;
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 50%;
    opacity: 0.25;
    z-index: 10086;
    pointer-events: none;
    transition: background 0.2s, opacity 0.2s, transform 0.2s;
  }
  #cursor.hidden { opacity: 0; }
  #cursor.active { opacity: 0.5; transform: scale(0.5); }

  /* Mobile: stack columns */
  @media (max-width: 800px) {
    .columns {
      flex-direction: column;
      padding: 12px;
      gap: 12px;
    }
    .left-col {
      width: 100%;
      order: 1;
    }
    .right-col {
      width: 100%;
      order: 2;
    }
  }
</style>

<script>
  // Loading screen: hide after page load
  const loading = document.getElementById('loading');
  window.addEventListener('load', () => {
    setTimeout(() => loading?.classList.add('hidden'), 100);
  });

  // Custom cursor
  const cursor = document.getElementById('cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX - 9 + 'px';
      cursor.style.top = e.clientY - 9 + 'px';
    });
    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));
    document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/MainLayout.astro
git commit -m "feat: add MainLayout with loading, columns, footer, and custom cursor"
```

---

### Task 9: Profile.astro (Static Right Column)

**Files:**
- Create: `src/components/right/Profile.astro`

- [ ] **Step 1: Write Profile.astro**

In `src/components/right/Profile.astro`:
```astro
---
import profile from '../../config/profile.json';
import social from '../../config/social.json';
import { getIconPath } from '../../utils/icons';
---

<div class="profile-card item-card">
  <div class="profile-top">
    <img
      class="avatar"
      src={profile.avatar}
      alt={profile.name}
      width="72"
      height="72"
      onerror="this.style.background='linear-gradient(135deg,#6366f1,#a78bfa)';this.style.borderRadius='50%'"
    />
    <div class="profile-info">
      <h1 class="profile-name gradient-text">{profile.name}</h1>
      <p class="profile-bio">{profile.bio}</p>
      <div class="social-icons">
        {social.map((item) => (
          <a href={item.url} target="_blank" rel="noopener noreferrer" class="social-icon" title={item.name}>
            <img src={getIconPath(item.icon)} alt={item.name} width="20" height="20" />
          </a>
        ))}
      </div>
    </div>
  </div>
</div>

<style>
  .profile-card {
    padding: 24px;
  }
  .profile-top {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }
  .avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 0.5px solid rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
  }
  .profile-info {
    flex: 1;
    min-width: 0;
  }
  .profile-name {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
    display: inline-block;
  }
  .profile-bio {
    font-size: 13px;
    color: var(--item_left_text_color);
    line-height: 1.6;
    margin-bottom: 12px;
  }
  .social-icons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .social-icon {
    width: 38px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--item_bg_color);
    backdrop-filter: blur(var(--card_filter));
    -webkit-backdrop-filter: blur(var(--card_filter));
    border-radius: 7px;
    transition: width 0.3s ease, transform 0.3s ease, background 0.3s ease;
    overflow: hidden;
    white-space: nowrap;
  }
  .social-icon:hover {
    width: 80px;
    transform: translateY(-2px);
    background: var(--item_hover_color);
  }
  .social-icon img {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    filter: invert(1); /* white icons on dark bg */
  }

  @media (max-width: 800px) {
    .profile-name { font-size: 22px; }
    .profile-top { gap: 14px; }
    .avatar { width: 56px; height: 56px; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/right/Profile.astro
git commit -m "feat: add Profile component with avatar, bio, and social icons"
```

---

### Task 10: Skills.astro (Static Right Column)

**Files:**
- Create: `src/components/right/Skills.astro`

- [ ] **Step 1: Write Skills.astro**

In `src/components/right/Skills.astro`:
```astro
---
import skillsData from '../../config/skills.json';
---

<div class="skills-card item-card">
  <h2 class="section-title">
    <svg width="26" height="26" viewBox="0 0 1024 1024" style="fill:var(--fill);margin-right:8px;">
      <path d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333z"/>
    </svg>
    {skillsData.title || 'skills'}
  </h2>
  <div class="tags">
    {skillsData.items.map((skill: string) => (
      <span class="tag">{skill}</span>
    ))}
  </div>
</div>

<style>
  .skills-card {
    padding: 20px;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/right/Skills.astro
git commit -m "feat: add Skills component with tag cloud"
```

---

### Task 11: Projects.astro (Static Right Column)

**Files:**
- Create: `src/components/right/Projects.astro`

- [ ] **Step 1: Write Projects.astro**

In `src/components/right/Projects.astro`:
```astro
---
import projects from '../../config/projects.json';
---

<div class="projects-card item-card">
  <h2 class="section-title">
    <svg width="26" height="26" viewBox="0 0 1024 1024" style="fill:var(--fill);margin-right:8px;">
      <path d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"/>
    </svg>
    project
  </h2>

  {projects.length === 0 ? (
    <div class="empty-hint">添加项目到 src/config/projects.json</div>
  ) : (
    <div class="project-grid">
      {projects.map((project: { name: string; desc: string; url: string; icon?: string }) => (
        <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-card">
          <div class="project-left">
            <h3 class="project-name">{project.name}</h3>
            <p class="project-desc">{project.desc}</p>
          </div>
          {project.icon && (
            <div class="project-right">
              <img src={project.icon} alt={project.name} width="32" height="32" />
            </div>
          )}
        </a>
      ))}
    </div>
  )}
</div>

<style>
  .projects-card {
    padding: 20px;
  }
  .project-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }
  .project-card {
    width: calc(50% - 4px);
    display: flex;
    background: var(--item_bg_color);
    backdrop-filter: blur(var(--card_filter));
    -webkit-backdrop-filter: blur(var(--card_filter));
    border-radius: 8px;
    padding: 12px;
    transition: transform 0.3s ease, background-color 0.3s ease;
    text-decoration: none;
    color: inherit;
  }
  .project-card:hover {
    transform: translateY(-2px);
    background: var(--item_hover_color);
  }
  .project-left {
    flex: 1;
    min-width: 0;
  }
  .project-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--item_left_title_color);
    margin-bottom: 4px;
    transition: font-size 0.3s ease;
  }
  .project-card:hover .project-name {
    font-size: 16px;
  }
  .project-desc {
    font-size: 11px;
    color: var(--item_left_text_color);
    line-height: 1.4;
  }
  .project-right {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    overflow: hidden;
    transition: transform 0.3s ease;
  }
  .project-card:hover .project-right img {
    transform: rotate(10deg);
  }
  .project-right img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  .empty-hint {
    color: var(--item_left_text_color);
    font-size: 13px;
    padding: 12px 0;
  }

  @media (max-width: 800px) {
    .project-card {
      width: 100%;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/right/Projects.astro
git commit -m "feat: add Projects component with hover-expand cards"
```

---

### Task 12: Progress.astro (Static Left Column)

**Files:**
- Create: `src/components/left/Progress.astro`

- [ ] **Step 1: Write Progress.astro with inline script for year progress**

In `src/components/left/Progress.astro`:
```astro
---
// Year progress bar — computed client-side with inline script
const now = new Date();
const year = now.getFullYear();
const startOfYear = new Date(year, 0, 1).getTime();
const endOfYear = new Date(year + 1, 0, 1).getTime();
const elapsed = now.getTime() - startOfYear;
const total = endOfYear - startOfYear;
const initialPercent = ((elapsed / total) * 100).toFixed(1);
---

<div class="progress-card item-card">
  <div class="progress-header">
    <span>⏳ {year}</span>
    <span id="progress-percent">{initialPercent}%</span>
  </div>
  <div class="progress-bar">
    <div id="progress-fill" class="progress-fill" style={`width:${initialPercent}%`}></div>
  </div>
</div>

<style>
  .progress-card {
    padding: 14px;
  }
  .progress-header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--item_left_text_color);
    margin-bottom: 6px;
  }
  .progress-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #a78bfa);
    border-radius: 3px;
    transition: width 0.1s linear;
  }
</style>

<script>
  // Update progress client-side
  const year = new Date().getFullYear();
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year + 1, 0, 1).getTime();
  const total = end - start;

  function update() {
    const percent = ((Date.now() - start) / total * 100).toFixed(1);
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-percent');
    if (fill) fill.style.width = percent + '%';
    if (text) text.textContent = percent + '%';
  }

  update();
  setInterval(update, 60000); // update once per minute
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/left/Progress.astro
git commit -m "feat: add year progress bar component"
```

---

### Task 13: WeatherTime Island (Preact)

**Files:**
- Create: `src/components/left/WeatherTime.jsx`

- [ ] **Step 1: Install Preact dependency**

```bash
pnpm add preact
```

Expected: already installed from Task 1.

- [ ] **Step 2: Write WeatherTime.jsx**

In `src/components/left/WeatherTime.jsx`:
```jsx
import { useState, useEffect } from 'preact/hooks';

const WEATHER_CACHE_KEY = 'homepage_weather';
const CACHE_DURATION = 30 * 60 * 1000; // 30 min

function getCachedWeather() {
  try {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!cached) return null;
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_DURATION) return null;
    return data.payload;
  } catch {
    return null;
  }
}

function setCachedWeather(payload) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      payload,
    }));
  } catch { /* localStorage unavailable */ }
}

function formatDate(date) {
  const d = ['日', '一', '二', '三', '四', '五', '六'];
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} 星期${d[date.getDay()]}`;
}

// wttr.in weather code → emoji mapping
const weatherEmoji = {
  113: '☀️', 116: '⛅', 119: '☁️', 122: '☁️',
  143: '🌫️', 176: '🌦️', 179: '🌨️', 182: '🌨️',
  185: '🌨️', 200: '⛈️', 227: '🌬️', 230: '🌬️',
  248: '🌫️', 260: '🌫️', 263: '🌧️', 266: '🌧️',
  281: '🌧️', 284: '🌧️', 293: '🌧️', 296: '🌧️',
  299: '🌧️', 302: '🌧️', 305: '🌧️', 308: '🌧️',
  311: '🌧️', 314: '🌧️', 317: '🌧️', 320: '🌨️',
  323: '🌨️', 326: '🌨️', 329: '❄️', 332: '❄️',
  335: '❄️', 338: '❄️', 350: '🌧️', 353: '🌧️',
  356: '🌧️', 359: '🌧️', 362: '🌧️', 365: '🌧️',
  368: '🌨️', 371: '❄️', 374: '🌧️', 377: '🌧️',
  386: '⛈️', 389: '⛈️', 392: '⛈️', 395: '❄️',
};

export default function WeatherTime() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(() => getCachedWeather());
  const [weatherError, setWeatherError] = useState(false);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather fetch
  useEffect(() => {
    if (weather) return; // use cached

    const city = import.meta.env.PUBLIC_WEATHER_CITY || 'Shenzhen';
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
      .then((res) => {
        if (!res.ok) throw new Error('Weather unavailable');
        return res.json();
      })
      .then((data) => {
        const current = data.current_condition?.[0];
        if (!current) throw new Error('No data');
        const w = {
          temp: current.temp_C,
          desc: current.weatherDesc?.[0]?.value || '',
          code: parseInt(current.weatherCode, 10),
          city: data.nearest_area?.[0]?.areaName?.[0]?.value || city,
        };
        setWeather(w);
        setCachedWeather(w);
      })
      .catch(() => setWeatherError(true));
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());
  const emoji = weather ? (weatherEmoji[weather.code] || '🌤️') : '';

  return (
    <div class="item-card" style={{ padding: '14px', textAlign: 'center' }}>
      <div style={{ fontSize: '28px', fontWeight: 300, color: '#fff', fontFamily: 'monospace' }}>
        {h}:{m}:{s}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--item_left_text_color)', marginTop: '4px' }}>
        {formatDate(time)}
      </div>
      {weather ? (
        <div style={{ marginTop: '8px' }}>
          <span style={{ fontSize: '22px' }}>{emoji}</span>
          <span style={{ fontSize: '18px', color: '#fff', marginLeft: '6px' }}>{weather.temp}°C</span>
          <div style={{ fontSize: '11px', color: 'var(--item_left_text_color)', marginTop: '2px' }}>
            {weather.city} · {weather.desc}
          </div>
        </div>
      ) : weatherError ? (
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--item_left_text_color)' }}>
          天气不可用
        </div>
      ) : (
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--item_left_text_color)' }}>
          加载中...
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/left/WeatherTime.jsx
git commit -m "feat: add WeatherTime Preact Island with clock and wttr.in weather"
```

---

### Task 14: Hitokoto Island (Preact)

**Files:**
- Create: `src/components/left/Hitokoto.jsx`

- [ ] **Step 1: Write Hitokoto.jsx**

In `src/components/left/Hitokoto.jsx`:
```jsx
import { useState, useEffect } from 'preact/hooks';

const FALLBACK = '人生は一期一会';

export default function Hitokoto() {
  const [text, setText] = useState(null);
  const [source, setSource] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const api = import.meta.env.PUBLIC_HITOKOTO_API || 'https://v1.hitokoto.cn';
    fetch(api)
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        setText(data.hitokoto);
        setSource(data.from || '');
      })
      .catch(() => {
        setError(true);
        setText(FALLBACK);
      });
  }, []);

  return (
    <div class="item-card" style={{ padding: '12px', textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: '#eee', lineHeight: 1.6, fontStyle: 'italic' }}>
        「{text || '...'}」
      </div>
      <div style={{ fontSize: '10px', color: 'var(--item_left_text_color)', marginTop: '6px' }}>
        {error ? '' : source ? `—— ${source}` : '—— Hitokoto'}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/left/Hitokoto.jsx
git commit -m "feat: add Hitokoto Preact Island with fallback"
```

---

### Task 15: Music Island (Preact)

**Files:**
- Create: `src/components/left/Music.jsx`

- [ ] **Step 1: Write Music.jsx that loads APlayer + Meting from CDN**

In `src/components/left/Music.jsx`:
```jsx
import { useEffect, useRef, useState } from 'preact/hooks';

export default function Music() {
  const containerRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const container = containerRef.current;
    if (!container) return;

    // MetingJS config from env
    const server = import.meta.env.PUBLIC_SONG_SERVER || 'netease';
    const type = import.meta.env.PUBLIC_SONG_TYPE || 'playlist';
    const id = import.meta.env.PUBLIC_SONG_ID || '7452421335';
    const api = import.meta.env.PUBLIC_SONG_API || 'https://api-meting.imsyy.top';

    // Create MetingJS element
    const metingEl = document.createElement('meting-js');
    metingEl.setAttribute('server', server);
    metingEl.setAttribute('type', type);
    metingEl.setAttribute('id', id);
    metingEl.setAttribute('api', api);
    metingEl.setAttribute('mini', 'true');
    metingEl.setAttribute('autoplay', 'false');
    metingEl.setAttribute('theme', '#6366f1');
    metingEl.setAttribute('loop', 'all');
    metingEl.setAttribute('order', 'list');
    metingEl.setAttribute('preload', 'auto');
    metingEl.setAttribute('list-max-height', '200px');
    container.appendChild(metingEl);

    // Load MetingJS and APlayer from CDN
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => {
          setHidden(true);
          reject(new Error(`Failed to load: ${src}`));
        };
        document.head.appendChild(script);
      });

    const loadStylesheet = (href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };

    Promise.resolve()
      .then(() => loadStylesheet('https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css'))
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js'))
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js'))
      .catch(() => setHidden(true));
  }, []);

  if (hidden) return null;

  return (
    <div class="item-card" style={{ padding: '12px' }}>
      <div ref={containerRef} style={{ width: '100%' }} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/left/Music.jsx
git commit -m "feat: add Music Preact Island with APlayer + Meting CDN loading"
```

---

### Task 16: index.astro (Page Assembly)

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Write index.astro that assembles all components into MainLayout**

In `src/pages/index.astro`:
```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import WeatherTime from '../components/left/WeatherTime.jsx';
import Hitokoto from '../components/left/Hitokoto.jsx';
import Progress from '../components/left/Progress.astro';
import Music from '../components/left/Music.jsx';
import Profile from '../components/right/Profile.astro';
import Skills from '../components/right/Skills.astro';
import Projects from '../components/right/Projects.astro';
---

<MainLayout>
  <!-- Left column: widgets -->
  <Fragment slot="left">
    <WeatherTime client:visible />
    <Hitokoto client:visible />
    <Progress />
    <Music client:visible />
  </Fragment>

  <!-- Right column: info -->
  <Fragment slot="right">
    <Profile />
    <Skills />
    <Projects />
  </Fragment>

  <!-- Footer -->
  <Fragment slot="footer">
    <span>© {new Date().getFullYear()} · Powered by Astro</span>
    <button id="theme-toggle" class="theme-btn" aria-label="Toggle theme"></button>
  </Fragment>
</MainLayout>

<style>
  .theme-btn {
    display: none; /* hidden in v1, reserved for light theme */
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble index page with all components in MainLayout"
```

---

### Task 17: Environment Variables (.env.example)

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Write .env.example**

```bash
# Site info
PUBLIC_SITE_NAME=你的名字
PUBLIC_SITE_DES=个人主页

# Music (Meting API + Netease)
PUBLIC_SONG_API=https://api-meting.imsyy.top
PUBLIC_SONG_SERVER=netease
PUBLIC_SONG_TYPE=playlist
PUBLIC_SONG_ID=7452421335

# Weather (wttr.in)
PUBLIC_WEATHER_CITY=Shenzhen

# Hitokoto
PUBLIC_HITOKOTO_API=https://v1.hitokoto.cn
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: add .env.example with configuration defaults"
```

---

### Task 18: Build and Verify

**Files:**
- (none, verification only)

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/chowcong/Documents/WebSiteCode/homepage
pnpm install
```

- [ ] **Step 2: Run dev server**

```bash
pnpm dev
```

Expected: Astro dev server starts on localhost:4321. Open in browser. Verify:
- Loading animation appears then fades
- Custom cursor follows mouse
- All cards render in dual-column layout
- Clock ticks in WeatherTime
- Hitokoto loads from API
- Music player loads (may show APlayer UI after CDN scripts load)
- Skills and Projects show empty state hints
- Profile shows placeholder avatar with gradient fallback
- Page is responsive (shrink browser below 800px to see stacked layout)

- [ ] **Step 3: Run production build**

```bash
pnpm build
```

Expected: Build succeeds, outputs static files to `dist/`. Verify no errors.

- [ ] **Step 4: Preview production build**

```bash
pnpm preview
```

Expected: Preview server starts. Verify same behavior as dev.

- [ ] **Step 5: Check for common issues**

```bash
# Verify all files referenced in imports exist
ls src/layouts/MainLayout.astro
ls src/pages/index.astro
ls src/components/left/WeatherTime.jsx
ls src/components/left/Hitokoto.jsx
ls src/components/left/Progress.astro
ls src/components/left/Music.jsx
ls src/components/right/Profile.astro
ls src/components/right/Skills.astro
ls src/components/right/Projects.astro
ls src/config/profile.json
ls src/config/social.json
ls src/config/skills.json
ls src/config/projects.json
ls src/styles/global.css
ls src/styles/theme.css
ls src/styles/cards.css
ls src/utils/icons.ts
```

All paths should exist.

- [ ] **Step 6: Commit final adjustments**

```bash
git add -A
git commit -m "chore: final build verification and adjustments"
```
