// 发布版在 Windows 上不另开控制台窗口（调试版保留，方便看日志）
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    geometry_lab_lib::run()
}
