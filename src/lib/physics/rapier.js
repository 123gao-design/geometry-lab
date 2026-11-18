/* Rapier 的装载器。两个引擎包都是「wasm 内嵌成 base64」的 compat 版本，
   放在 src/vendor/ 里直接 import，不经过 npm（构建时各成一块懒加载 chunk）。
   首次进入物理页才下载；同一会话内只 init 一次。 */

let p2 = null;
let p3 = null;

export function getRapier2D() {
  if (!p2) {
    p2 = import('../../vendor/rapier2d.mjs').then(async m => {
      await m.init();
      return m;
    });
    p2.catch(() => { p2 = null; });
  }
  return p2;
}

export function getRapier3D() {
  if (!p3) {
    p3 = import('../../vendor/rapier3d.mjs').then(async m => {
      await m.init();
      return m;
    });
    p3.catch(() => { p3 = null; });
  }
  return p3;
}
