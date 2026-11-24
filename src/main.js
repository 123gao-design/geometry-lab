import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import routes from './router.js';
import { initTheme, initAnim } from './lib/theme.js';
import { loadDefaultLabels, defaultUrl } from './lib/labelstore.js';
import { PREFS } from './lib/settings.js';
import './styles/global.css';
import './styles/xref.css';   // 章间内链 .xref（正文跨章引用写成那一节的标题 + 可点跳转）
import 'katex/dist/katex.min.css';

initTheme(); // 须在任何画板构造前
initAnim();  // 背景光影开关偏好（默认开；挂 html.no-anim 类）

const router = createRouter({
  history: createWebHashHistory(), // hash 路由：构建产物支持 file:// 离线打开
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// 默认文字位置（public/ 下那份 JSON）先读到再挂载，画板构造时才拿得到默认档；
// 文件缺失、构建后没带、file:// 下取不到都按空档继续，不阻塞页面。
// 网络慢或请求挂住时最多等 1.2 秒——骨架屏一直转下去比少一份默认档糟得多。
let late = false;
const bootTimer = setTimeout(() => { late = true; }, 1200);
Promise.race([
  loadDefaultLabels(defaultUrl(PREFS.lblPath)),
  new Promise(r => setTimeout(r, 1200)),
]).catch(() => { /* 取不到就按空档，别把挂载卡住 */ }).finally(() => {
  clearTimeout(bootTimer);
  createApp(App).use(router).mount('#app');
  if (late) console.info('[gl] 默认文字位置档超时，按空档继续');
});
