// 桌面壳入口：界面是 Vite 产物（frontendDist 指向 ../dist，开发时走 devUrl :5173），
// 这里只挂插件、不写业务。dialog / fs 是给后续统一保存入口（src/lib/save.js 计划）留的桥：
// 浏览器里走 fsdir.js 的 File System Access，壳里走这两个插件，界面同一套。
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("geometry-lab 桌面壳启动失败");
}
