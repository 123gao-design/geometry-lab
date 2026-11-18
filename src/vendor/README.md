# 第三方件：Rapier

- `rapier2d.mjs` / `rapier3d.mjs` 来自 **@dimforge/rapier2d-compat@0.15.0** 与 **@dimforge/rapier3d-compat@0.15.0**
  （npm 包里的 ESM 构建，wasm 以 base64 内联在同一文件里，所以单文件即可离线跑，不需要再发 `.wasm`）。
- 两份文件只做了一件事：删掉末尾的 `//# sourceMappingURL=…` 注释，避免浏览器去请求不存在的 `.map`。
- 加载入口在 `src/lib/physics/rapier.js`（`getRapier2D()` / `getRapier3D()`），动态 import，`await m.init()` 只做一次；
  物理实验本体再由 `src/physics/index.js` 的 `load()` 各自动态 import，首页不会把这些块拉下来。

授权：Rapier 以 **Apache License 2.0** 发布，版权归 Dimforge 及其贡献者所有。
许可证全文见 <https://www.apache.org/licenses/LICENSE-2.0>，源码见 <https://github.com/dimforge/rapier>。
分发本站构建产物时请保留本说明与上述链接。

换版本：`npm i @dimforge/rapier2d-compat@<版本> @dimforge/rapier3d-compat@<版本>` 后用包里的 `rapier.es.js`
覆盖同名文件，再删掉 sourceMappingURL 注释即可（compat 版命名可能随版本变化，以包内 `package.json` 的 `module` 字段为准）。
