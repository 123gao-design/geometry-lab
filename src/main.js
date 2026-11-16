import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import routes from './router.js';
import { initTheme, initAnim } from './lib/board.js';
import { loadDefaultLabels, defaultUrl } from './lib/labelstore.js';
import { PREFS } from './lib/settings.js';
import './styles/global.css';
import 'katex/dist/katex.min.css';

initTheme(); // 须在任何画板构造前
initAnim();  // 背景光影开关偏好（默认开；挂 html.no-anim 类）

const router = createRouter({
  history: createWebHashHistory(), // hash 路由：构建产物支持 file:// 离线打开
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// 默认文字位置（public/ 下那份 JSON）先读到再挂载，画板构造时才拿得到默认档；
// 文件缺失、构建后没带、file:// 下取不到都按空档继续，不阻塞页面
loadDefaultLabels(defaultUrl(PREFS.lblPath)).finally(() => {
  createApp(App).use(router).mount('#app');
});
