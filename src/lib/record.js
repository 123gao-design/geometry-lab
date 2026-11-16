/* 画板动画录制：把当前画面逐帧栅格化进离屏 canvas，交给浏览器自带的 MediaRecorder 编码。
   优先 MP4（H.264），不支持就退 WebM（VP9 / VP8）—— 全程零依赖，不引入 ffmpeg.wasm。
   录的是「所见即所得」：板上的动画照常跑，帧的时间戳取墙钟，所以视频时长与真实播放一致；
   机器慢时只会少几帧，不会把画面拖成慢动作。
   逐帧取画面走 board._svgXML()（与导出 PNG 同一份克隆逻辑），因此公式、主题配色与屏幕一致。 */

const MIMES = [
  'video/mp4;codecs=avc1.42E01E',
  'video/mp4;codecs=avc1',
  'video/mp4',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
];

/** 当前浏览器能录的视频容器：返回 MediaRecorder 认的 mimeType，一条都不支持则返回空串 */
export function videoMime() {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
  for (const m of MIMES) {
    try { if (MediaRecorder.isTypeSupported(m)) return m; } catch (_) { /* 老实现直接抛，跳过 */ }
  }
  return '';
}

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = name;
  a.href = url;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** 一帧的 SVG 串 → 解码好的 Image（blob URL 快；个别环境认不了 foreignObject 的 blob，退回 data URL） */
function raster(xml) {
  const load = src => new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error('画面解码失败'));
    im.src = src;
  });
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
  return load(url)
    .catch(() => load('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)))
    .finally(() => URL.revokeObjectURL(url));
}

/**
 * 开始录制一块板。
 * @param board   Board 实例（需要 _svgXML / w / h）
 * @param o.scale 录制倍率（默认 2×，与导出 PNG 同口径）
 * @param o.maxSeconds 单段上限（默认 60 秒，到点自动停并下载）
 * @param o.onState 状态回调：{start} / {tick: 秒} / {done:{blob,name}} / {error: 文案}
 * @returns {stop, active} 句柄；浏览器不支持录制时返回 null 并回调 error
 */
export function recordBoard(board, o = {}) {
  const { scale = 2, maxSeconds = 60, onState = () => {} } = o;
  const mime = videoMime();
  if (!mime) { onState({ error: '这个浏览器不支持画布录制（缺 MediaRecorder）' }); return null; }
  if (!board || !board.svg || typeof board._svgXML !== 'function' || typeof board.w !== 'number') {
    onState({ error: '画板还没就绪' });
    return null;
  }

  const cv = document.createElement('canvas');
  cv.width = Math.round(board.w * scale);
  cv.height = Math.round(board.h * scale);
  const ctx = cv.getContext('2d');
  if (typeof cv.captureStream !== 'function') { onState({ error: '这个浏览器不支持画布取流' }); return null; }
  const stream = cv.captureStream(0);            // 0 = 手动打帧，由下面的 requestFrame 控制
  const track = stream.getVideoTracks()[0];
  let rec;
  try {
    rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5e6 });
  } catch (_) {
    onState({ error: '录制器启动失败' });
    return null;
  }

  const chunks = [];
  rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };

  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const t0 = now();
  let stopped = false, raf = 0, lastSec = -1;

  rec.onstop = () => {
    stream.getTracks().forEach(t => t.stop && t.stop());
    const blob = new Blob(chunks, { type: mime.split(';')[0] });
    const ext = mime.indexOf('mp4') >= 0 ? '.mp4' : '.webm';
    const base = (String(board.pagePath || 'board').replace(/^#\/?/, '').replace(/[/?&=]/g, '-') || 'board');
    const name = base + '-' + String(board.uid || 'b').replace('clip', '') + ext;
    if (blob.size) saveBlob(blob, name);
    onState(blob.size ? { done: true, blob, name } : { error: '没有录到画面' });
  };

  function stop() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    try { rec.stop(); } catch (_) { /* 已经停了 */ }
  }

  async function frame() {
    if (stopped) return;
    try {
      const img = await raster(await board._svgXML());
      if (stopped) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      track.requestFrame && track.requestFrame();
      const el = now() - t0, sec = Math.floor(el / 1000);
      if (sec !== lastSec) { lastSec = sec; onState({ tick: sec }); }
      if (el >= maxSeconds * 1000) { stop(); return; }
      raf = requestAnimationFrame(frame);
    } catch (err) {
      stop();
      onState({ error: '录制中断：' + ((err && err.message) || err) });
    }
  }

  rec.start(1000);                               // 每秒吐一块：长录制不必把整段都攒在内存里
  onState({ start: true, mime });
  raf = requestAnimationFrame(frame);
  return { stop, get active() { return !stopped; } };
}
