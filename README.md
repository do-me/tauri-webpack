This branch is a thought for testing protomaps with tauri. It is not working at the moment. 

As tauri2 offers two potential ways where the pmtiles file could be stored, either in assets or on $AppData, only accessible through the Rust backend, the range requests that he frontend main.js fires need to be served by a compatible server. Apparently the pmtiles:// protocol is not supported yet, neither for assets nor by default through the Rust backend. 

![image](https://github.com/user-attachments/assets/7b54e3ef-c854-4bfa-91b6-b76352766d2f)

See the main.js file under src/. This is the crucial part: 

```js
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
            // when using "pmtiles://" + convertFileSrc(filePath) Error: Cross origin requests are only supported for HTTP.
            // when using "pmtiles://assets/munich.pmtiles" Error: Server returned no content-length header or content-length exceeding request. Check that your storage backend supports HTTP Byte Serving.

```

When using the path to the user's AppData, with `"pmtiles://" + convertFileSrc(filePath) ` it's complaining about `Error: Cross origin requests are only supported for HTTP.`.

Instead, when copying the pmtiles file to the assets folder: `Server returned no content-length header or content-length exceeding request. Check that your storage backend supports HTTP Byte Serving.`
