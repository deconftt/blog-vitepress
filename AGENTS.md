# Repository Guidelines

## 项目结构与模块组织
- `docs/.vitepress/config.mts`：站点与主题主配置（TS/ESM）。
- `docs/.vitepress/theme/{index.ts, custom.css}`：主题扩展与全局样式。
- `docs/.vitepress/components/`：通用组件（.vue）。
- `docs/blog/`：博文与资源（建议每篇配套 `assets/` 子目录）。
- `docs/public/`：静态资源（以 `/` 路径引用，无需包含 `public`）。
- `.github/workflows/main.yml`：CI 构建与部署（SSH 上传）。
- 产物：`docs/.vitepress/dist/`（请勿提交到仓库）。

## 构建、测试与开发命令
- `npm run docs:dev`：启动本地开发服务。
- `npm run docs:build`：生成静态站点到 `docs/.vitepress/dist`。
- `npm run docs:preview`：本地预览构建结果。
- Node 版本：通过 Volta 固定为 `18.17.1`（示例：`volta install node@18.17.1`）。

## 代码风格与命名约定
- 缩进 2 空格，UTF-8，Unix 换行，行宽 ≤ 100。
- Markdown：文件名用中文或 kebab-case；首行为一级标题；图片相对路径 `./assets/`。
- 组件与配置：TypeScript + ESM；样式集中在 `theme/custom.css`，优先使用 CSS 变量。
- 本仓库未启用 ESLint/Prettier，请保持与现有风格一致；可本地使用 Prettier 进行 2 空格格式化。

## 测试指南
- 无自动化测试；提交前须完成手动验收：
  - 构建无错误与明显告警；侧边栏/内链可达。
  - 亮/暗色模式、移动端视图检查。
  - 若改动主题/脚本，至少在 `docs` 下随机抽样 2 篇文章自测。

## Commit 与 Pull Request 规范
- 建议遵循 Conventional Commits：
  - `feat(blog): 新增「xxx」`
  - `fix(theme): 修复暗黑模式对比度`
  - `docs: 更新 README/指南`
- PR 必需：变更说明、受影响路径、截图（首页与文章页）、关联 Issue、回滚方案。
- 提交前确认：已更新 `themeConfig.sidebar`、资源路径正确、未提交 `dist/` 或密钥。

## 安全与配置提示
- 部署使用 GitHub Secrets（`REMOTE_HOST`、`USER_NAME`、`SSH_KEY`）；严禁提交私钥/机密。
- 第三方统计脚本仅在需要时启用，不暴露 `clientSecret` 等敏感信息。
- 图片与内容请注意版权与授权。

