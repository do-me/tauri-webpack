const { invoke } = window.__TAURI__.core;
import { BaseDirectory, exists } from '@tauri-apps/plugin-fs';
import { convertFileSrc } from '@tauri-apps/api/core'
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css'
import { Protocol } from "pmtiles";
import style from './assets/style.json';

let protocol = new Protocol();
maplibregl.addProtocol("pmtiles",protocol.tile);

async function checkFileAndLoad() {
  try {
      const filePath = await invoke('download_static_file');
      console.log("File downloaded to or exists at:", filePath);

      const pmtilesLocation = "munich"
      const fileExists = await exists(pmtilesLocation + '.pmtiles', { baseDir: BaseDirectory.AppData });

      console.log("File exists:", BaseDirectory.AppData, pmtilesLocation);
      console.log("Converted file:", convertFileSrc(filePath));

     if (fileExists) {
       console.log('file can be accessed');
       const map = new maplibregl.Map({
        container: 'map',
        zoom: 14,
        center: [11.57598042341610,48.13710230029825],
        style: {
          "version": 8,
          "sources": {
              "protomaps": {
                  "type": "vector",
                  "attribution": "<a href=\"https://github.com/protomaps/basemaps\">Protomaps</a> © <a href=\"https://openstreetmap.org\">OpenStreetMap</a>",
                  "url": "pmtiles://" + convertFileSrc(filePath)
                  // works: "pmtiles://" + "https://raw.githubusercontent.com/do-me/protomaps-example/refs/heads/main/munich.pmtiles" (Attention, don't use links that redirect with a 302. Works only with direct links)
                  // using fully remote works, as there is a byte range compatible server: "pmtiles://" + "https://github.com/do-me/protomaps-example/raw/refs/heads/main/munich.pmtiles"
                  // when using "pmtiles://" + convertFileSrc(filePath) Error: Cross origin requests are only supported for HTTP.
                  // when using "pmtiles://assets/munich.pmtiles" Error: Server returned no content-length header or content-length exceeding request. Check that your storage backend supports HTTP Byte Serving.
      
              }
          },
          "layers": style.layers,
          "sprite": "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
          "glyphs": "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf"
      },
      
        hash: 'map'
    });
     } else {
      console.log('file can not be accessed');
     }
    } catch (error) {
      console.error('File download/check error:', error);
    }
}

checkFileAndLoad();