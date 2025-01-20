const { invoke } = window.__TAURI__.core;
import { readTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';

import './styles.css'

let greetInputEl;
let greetMsgEl;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});

async function checkFileAndLoad() {
  console.log("start THIS FUNCTION")
  try {
      const filePath = await invoke('download_static_file');
      console.log("File downloaded to or exists at:", filePath);
      const fileExists = await exists('munich.pmtiles', { baseDir: BaseDirectory.AppData });

     if (fileExists) {
       console.log('file can be accessed');
     } else {
      console.log('file can not be accessed');
     }
    } catch (error) {
      console.error('File download/check error:', error);
    }
}

checkFileAndLoad();