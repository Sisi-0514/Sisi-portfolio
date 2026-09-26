# 王镭澌 · 求职个人网站

2027届校招个人作品集，面向活动策划与项目执行、品牌活动传播、内容运营及合作沟通岗位。当前定稿使用原生 HTML、CSS、JavaScript，无 React、Vite 或第三方运行时依赖。

## 构建与检查

需要 Node.js 18 或更高版本，无需安装 npm 依赖。

```sh
npm run check
npm run build
```

构建结果为 `dist/index.html`，内嵌所有图片、样式、脚本与简历，可直接打开，也可上传到静态网站托管平台。微信、小红书等外部作品链接需要联网访问。部署配置使用构建命令 `npm run build`、发布目录 `dist`。

如需同时更新仓库外的本地预览文件，可运行：

```sh
node scripts/build-standalone.mjs --local-copy
```

## 代码结构

- `src/data.js`：项目经历、工作流程、作品链接和照片说明。
- `src/view.js`：页面结构、分层标签和图表展示。
- `src/main.js`：原生 DOM 渲染、项目切换、照片滚动与放大交互。
- `src/style.css`：桌面及手机样式、动效和无障碍偏好适配。
- `public/assets/`：网站使用的图片及简历文件。
- `scripts/build-standalone.mjs`：生成独立 HTML。
- `scripts/verify.mjs`：验证10个项目的38个流程状态、导航关系及作品链接。
- `DESIGN_REQUIREMENTS.md`：最终设计与内容要求。

旧版 React 配置、历史预览、压缩包和本机托管配置不属于定稿交付，保留在本地并排除出版本控制。

## 验证范围

已进行原生 DOM 冒烟检查、项目切换状态检查和资源引用检查。未完成上线后的真实浏览器验收。单文件包含原始照片，体积约41 MB；正式上线后可按需优化图片与拆分静态资源。
