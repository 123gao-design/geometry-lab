/* 三维弹跳小球：Rapier 3D 世界里的小球在盒子里乱撞，three.js 只负责画。
   拖动 = 转视角，滚轮 = 拉近拉远，双击 = 还原。 */
import * as THREE from 'three';
import { fmt, objScale } from './gfx.js';

const PALETTE = [0x5cadff, 0xff9e4a, 0x54d69a, 0xb98bff, 0xff7ab0, 0x4fd6e0, 0xffd166, 0x8fa3bd];

export async function create(st) {
  const RAPIER = await st.get3D();
  const p = st.params;

  // 三维档不用二维画布：留着它会盖在 three 的画布上，按下全被它吃掉
  st.hide2D && st.hide2D();

  const W = 13, D = 13, H = 9;     // 场地尺寸
  const BR0 = 0.34;                // 球半径基准值，再乘「物体」滑块的倍率
  let sc = objScale(st.ui);
  let BR = BR0 * sc;

  /* ---------- three ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(st.dpr || 1);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  st.host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  let yaw = 0.72, pitch = 0.42, dist = 22;

  const ambient = new THREE.AmbientLight(0xffffff, 0.75);
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(8, 14, 10);
  const fill = new THREE.DirectionalLight(0x88aaff, 0.5);
  fill.position.set(-9, 6, -8);
  scene.add(ambient, key, fill);

  // 场地：线框
  const boxGeo = new THREE.BoxGeometry(W, H, D);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(boxGeo),
    new THREE.LineBasicMaterial({ color: 0x8fa3bd, transparent: true, opacity: 0.55 })
  );
  edges.position.y = H / 2;
  scene.add(edges);

  const floorGeo = new THREE.PlaneGeometry(W, D);
  const floor = new THREE.Mesh(
    floorGeo,
    new THREE.MeshPhongMaterial({
      color: 0x5cadff, transparent: true, opacity: 0.10, side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.002;
  scene.add(floor);

  const grid = new THREE.GridHelper(W, W, 0x5cadff, 0x5cadff);
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  grid.position.y = 0.004;
  scene.add(grid);

  // 球
  let sphereGeo = new THREE.SphereGeometry(BR, 24, 16);
  let geoR = BR;                    // 现用几何体对应的半径，改倍率时要换一颗
  const meshes = [];

  let world = null;
  let bodies = [];

  function build() {
    if (world) world.free();
    for (const m of meshes) {
      scene.remove(m);
      m.material.dispose();
    }
    meshes.length = 0;
    if (geoR !== BR) {
      sphereGeo.dispose();
      sphereGeo = new THREE.SphereGeometry(BR, 24, 16);
      geoR = BR;
    }

    world = new RAPIER.World({ x: 0, y: -p.g, z: 0 });
    world.timestep = 1 / 60;

    const fixed = (x, y, z, hx, hy, hz) => {
      const b = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(hx, hy, hz)
          .setFriction(p.fric)
          .setRestitution(p.e),
        b
      );
    };
    fixed(0, -0.25, 0, W / 2, 0.25, D / 2);           // 地面
    fixed(-W / 2 - 0.25, H / 2, 0, 0.25, H / 2, D / 2);
    fixed(W / 2 + 0.25, H / 2, 0, 0.25, H / 2, D / 2);
    fixed(0, H / 2, -D / 2 - 0.25, W / 2, H / 2, 0.25);
    fixed(0, H / 2, D / 2 + 0.25, W / 2, H / 2, 0.25);

    bodies = [];
    const n = Math.round(p.n);
    for (let i = 0; i < n; i++) {
      const x = (Math.random() - 0.5) * (W * 0.55);
      const z = (Math.random() - 0.5) * (D * 0.55);
      const y = 2 + Math.random() * (H * 0.5);
      const body = world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(x, y, z)
          .setLinearDamping(0.05)
          .setAngularDamping(0.15)
          .setCcdEnabled(true)
      );
      world.createCollider(
        RAPIER.ColliderDesc.ball(BR).setRestitution(p.e).setFriction(p.fric).setDensity(1),
        body
      );
      body.setLinvel({
        x: (Math.random() - 0.5) * 9,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 9,
      }, true);
      bodies.push(body);

      const mat = new THREE.MeshPhongMaterial({
        color: PALETTE[i % PALETTE.length],
        shininess: 70,
        specular: 0x9fd0ff,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      scene.add(mesh);
      meshes.push(mesh);
    }
  }

  build();
  let last = { ...p };

  /* ---------- 交互：转视角 ---------- */
  let drag = null;
  const down = e => {
    drag = { x: e.clientX, y: e.clientY, yaw, pitch };
    renderer.domElement.setPointerCapture?.(e.pointerId);
  };
  const move = e => {
    if (!drag) return;
    yaw = drag.yaw + (e.clientX - drag.x) * 0.007;
    pitch = Math.max(-0.15, Math.min(1.35, drag.pitch + (e.clientY - drag.y) * 0.006));
  };
  const up = () => { drag = null; };
  const wheel = e => {
    e.preventDefault();
    dist = Math.max(10, Math.min(46, dist + e.deltaY * 0.02));
  };
  const dbl = () => { yaw = 0.72; pitch = 0.42; dist = 22; };

  const el = renderer.domElement;
  el.style.cursor = 'grab';
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('wheel', wheel, { passive: false });
  el.addEventListener('dblclick', dbl);

  const resize = (w, h) => {
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize(st.host.clientWidth, st.host.clientHeight);
  const offResize = st.onResize(resize);

  return {
    reset() { build(); last = { ...p }; },
    frame(dt) {
      // 物体倍率改了要重搭：球半径同时进碰撞体与几何
      const kk = objScale(st.ui);
      if (kk !== sc) { sc = kk; BR = BR0 * kk; build(); last = { ...p }; }
      if (p.n !== last.n || p.g !== last.g || p.e !== last.e || p.fric !== last.fric) {
        build();
        last = { ...p };
      }
      // dt = 0 只重画（暂停时照样能转视角、滚轮拉近）
      const step = dt > 0 ? Math.min(Math.max(dt, 1 / 240), 1 / 40) : 0;
      if (step) {
        world.timestep = step;
        world.step();
      }

      let vmax = 0, hmax = 0;
      for (let i = 0; i < bodies.length; i++) {
        const t = bodies[i].translation();
        const v = bodies[i].linvel();
        const m = meshes[i];
        if (m) m.position.set(t.x, t.y, t.z);
        vmax = Math.max(vmax, Math.hypot(v.x, v.y, v.z));
        hmax = Math.max(hmax, t.y);
      }
      st.readout([
        ['小球数', String(Math.round(p.n))],
        ['最快速度', `${fmt(vmax)} m/s`],
        ['最高球心', `${fmt(hmax)} m`],
        ['重力 g', `${fmt(p.g, 1)} m/s²`],
        ['弹性 e', fmt(p.e)],
      ]);

      // 相机绕原点
      const cy = Math.cos(pitch);
      camera.position.set(
        dist * cy * Math.sin(yaw),
        dist * Math.sin(pitch) + 2.4,
        dist * cy * Math.cos(yaw)
      );
      camera.lookAt(0, Math.min(H * 0.42, 3.6), 0);
      renderer.render(scene, camera);
    },
    dispose() {
      offResize();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('dblclick', dbl);
      if (world) { world.free(); world = null; }
      for (const m of meshes) m.material.dispose();
      sphereGeo.dispose(); boxGeo.dispose(); floorGeo.dispose();
      floor.material.dispose(); edges.geometry.dispose(); edges.material.dispose();
      renderer.dispose();
      if (el.parentNode) el.parentNode.removeChild(el);
    },
  };
}
