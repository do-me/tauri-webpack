use std::path::Path;
use tauri::{command, AppHandle, Manager, Runtime};
use tauri_plugin_http::reqwest;
use std::fs;


#[command]
async fn download_static_file<R: Runtime>(app: AppHandle<R>) -> Result<String, String> {
    let url = "https://github.com/do-me/protomaps-example/raw/refs/heads/main/munich.pmtiles";

    // 1. Determine Local AppData Path
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    let file_path = app_data_dir.join("munich.pmtiles");
    let parent_dir = file_path.parent().ok_or("Failed to get parent directory")?;

    // 2. Create the directory if it doesn't exist
    if !parent_dir.exists() {
        fs::create_dir_all(parent_dir)
            .map_err(|e| format!("Failed to create parent directory: {}", e))?;
    }

    // 3. Check if the file already exists
    if Path::new(&file_path).exists() {
        return Ok(file_path.display().to_string());
    }


    // 4. Download the file from internet using reqwest
    let response = reqwest::get(url)
        .await
        .map_err(|e| format!("HTTP request error: {}", e))?;

    // Check that download succeeded
    if !response.status().is_success() {
        return Err(format!("HTTP error: {}", response.status()));
    }
    let file_content = response
        .bytes()
        .await
        .map_err(|e| format!("HTTP body error: {}", e))?;

    // 5. Save the file
    std::fs::write(&file_path, file_content).map_err(|e| format!("File write error: {}", e))?;

    Ok(file_path.display().to_string())
}


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![greet, download_static_file])
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data dir");
            println!("Using appdata folder {:?}", app_data_dir);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}