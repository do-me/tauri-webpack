const { invoke } = window.__TAURI__.core;
import { BaseDirectory, exists } from '@tauri-apps/plugin-fs';
import { convertFileSrc } from '@tauri-apps/api/core'

import './styles.css'

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

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
                  // bei "pmtiles://" + convertFileSrc(filePath) Fehler: Cross origin requests are only supported for HTTP.
                  // bei "pmtiles://assets/munich.pmtiles" Fehler: Error: Server returned no content-length header or content-length exceeding request. Check that your storage backend supports HTTP Byte Serving.

              }
          },
          "layers": [
              {
                  "id": "background",
                  "type": "background",
                  "paint": {
                      "background-color": "#cccccc"
                  }
              },
              {
                  "id": "earth",
                  "type": "fill",
                  "filter": [
                      "==",
                      [
                          "geometry-type"
                      ],
                      "Polygon"
                  ],
                  "source": "protomaps",
                  "source-layer": "earth",
                  "paint": {
                      "fill-color": "#e2dfda"
                  }
              },
              {
                  "id": "landcover",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landcover",
                  "paint": {
                      "fill-color": [
                          "match",
                          [
                              "get",
                              "kind"
                          ],
                          "grassland",
                          "rgba(210, 239, 207, 1)",
                          "barren",
                          "rgba(255, 243, 215, 1)",
                          "urban_area",
                          "rgba(230, 230, 230, 1)",
                          "farmland",
                          "rgba(216, 239, 210, 1)",
                          "glacier",
                          "rgba(255, 255, 255, 1)",
                          "scrub",
                          "rgba(234, 239, 210, 1)",
                          "rgba(196, 231, 210, 1)"
                      ],
                      "fill-opacity": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          5,
                          1,
                          7,
                          0
                      ]
                  }
              },
              {
                  "id": "landuse_park",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "in",
                      "kind",
                      "national_park",
                      "park",
                      "cemetery",
                      "protected_area",
                      "nature_reserve",
                      "forest",
                      "golf_course",
                      "wood",
                      "nature_reserve",
                      "forest",
                      "scrub",
                      "grassland",
                      "grass",
                      "military",
                      "naval_base",
                      "airfield"
                  ],
                  "paint": {
                      "fill-opacity": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          6,
                          0,
                          11,
                          1
                      ],
                      "fill-color": [
                          "case",
                          [
                              "in",
                              [
                                  "get",
                                  "kind"
                              ],
                              [
                                  "literal",
                                  [
                                      "national_park",
                                      "park",
                                      "cemetery",
                                      "protected_area",
                                      "nature_reserve",
                                      "forest",
                                      "golf_course"
                                  ]
                              ]
                          ],
                          "#9cd3b4",
                          [
                              "in",
                              [
                                  "get",
                                  "kind"
                              ],
                              [
                                  "literal",
                                  [
                                      "wood",
                                      "nature_reserve",
                                      "forest"
                                  ]
                              ]
                          ],
                          "#a0d9a0",
                          [
                              "in",
                              [
                                  "get",
                                  "kind"
                              ],
                              [
                                  "literal",
                                  [
                                      "scrub",
                                      "grassland",
                                      "grass"
                                  ]
                              ]
                          ],
                          "#99d2bb",
                          [
                              "in",
                              [
                                  "get",
                                  "kind"
                              ],
                              [
                                  "literal",
                                  [
                                      "glacier"
                                  ]
                              ]
                          ],
                          "#e7e7e7",
                          [
                              "in",
                              [
                                  "get",
                                  "kind"
                              ],
                              [
                                  "literal",
                                  [
                                      "sand"
                                  ]
                              ]
                          ],
                          "#e2e0d7",
                          [
                              "in",
                              [
                                  "get",
                                  "kind"
                              ],
                              [
                                  "literal",
                                  [
                                      "military",
                                      "naval_base",
                                      "airfield"
                                  ]
                              ]
                          ],
                          "#c6dcdc",
                          "#e2dfda"
                      ]
                  }
              },
              {
                  "id": "landuse_urban_green",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "in",
                      "kind",
                      "allotments",
                      "village_green",
                      "playground"
                  ],
                  "paint": {
                      "fill-color": "#9cd3b4",
                      "fill-opacity": 0.7
                  }
              },
              {
                  "id": "landuse_hospital",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "==",
                      "kind",
                      "hospital"
                  ],
                  "paint": {
                      "fill-color": "#e4dad9"
                  }
              },
              {
                  "id": "landuse_industrial",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "==",
                      "kind",
                      "industrial"
                  ],
                  "paint": {
                      "fill-color": "#d1dde1"
                  }
              },
              {
                  "id": "landuse_school",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "in",
                      "kind",
                      "school",
                      "university",
                      "college"
                  ],
                  "paint": {
                      "fill-color": "#e4ded7"
                  }
              },
              {
                  "id": "landuse_beach",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "in",
                      "kind",
                      "beach"
                  ],
                  "paint": {
                      "fill-color": "#e8e4d0"
                  }
              },
              {
                  "id": "landuse_zoo",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "in",
                      "kind",
                      "zoo"
                  ],
                  "paint": {
                      "fill-color": "#c6dcdc"
                  }
              },
              {
                  "id": "landuse_aerodrome",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "in",
                      "kind",
                      "aerodrome"
                  ],
                  "paint": {
                      "fill-color": "#dadbdf"
                  }
              },
              {
                  "id": "roads_runway",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "==",
                      "kind_detail",
                      "runway"
                  ],
                  "paint": {
                      "line-color": "#e9e9ed",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          10,
                          0,
                          12,
                          4,
                          18,
                          30
                      ]
                  }
              },
              {
                  "id": "roads_taxiway",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 13,
                  "filter": [
                      "==",
                      "kind_detail",
                      "taxiway"
                  ],
                  "paint": {
                      "line-color": "#e9e9ed",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          1,
                          15,
                          6
                      ]
                  }
              },
              {
                  "id": "landuse_runway",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "any",
                      [
                          "in",
                          "kind",
                          "runway",
                          "taxiway"
                      ]
                  ],
                  "paint": {
                      "fill-color": "#e9e9ed"
                  }
              },
              {
                  "id": "water",
                  "type": "fill",
                  "filter": [
                      "==",
                      [
                          "geometry-type"
                      ],
                      "Polygon"
                  ],
                  "source": "protomaps",
                  "source-layer": "water",
                  "paint": {
                      "fill-color": "#80deea"
                  }
              },
              {
                  "id": "water_stream",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "water",
                  "minzoom": 14,
                  "filter": [
                      "in",
                      "kind",
                      "stream"
                  ],
                  "paint": {
                      "line-color": "#80deea",
                      "line-width": 0.5
                  }
              },
              {
                  "id": "water_river",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "water",
                  "minzoom": 9,
                  "filter": [
                      "in",
                      "kind",
                      "river"
                  ],
                  "paint": {
                      "line-color": "#80deea",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          9,
                          0,
                          9.5,
                          1,
                          18,
                          12
                      ]
                  }
              },
              {
                  "id": "landuse_pedestrian",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "==",
                      "kind",
                      "pedestrian"
                  ],
                  "paint": {
                      "fill-color": "#e3e0d4"
                  }
              },
              {
                  "id": "landuse_pier",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "landuse",
                  "filter": [
                      "==",
                      "kind",
                      "pier"
                  ],
                  "paint": {
                      "fill-color": "#e0e0e0"
                  }
              },
              {
                  "id": "roads_tunnels_other_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_tunnel"
                      ],
                      [
                          "in",
                          "kind",
                          "other",
                          "path"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          14,
                          0,
                          20,
                          7
                      ]
                  }
              },
              {
                  "id": "roads_tunnels_minor_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_tunnel"
                      ],
                      [
                          "==",
                          "kind",
                          "minor_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-dasharray": [
                          3,
                          2
                      ],
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          11,
                          0,
                          12.5,
                          0.5,
                          15,
                          2,
                          18,
                          11
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          12,
                          0,
                          12.5,
                          1
                      ]
                  }
              },
              {
                  "id": "roads_tunnels_link_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_tunnel"
                      ],
                      [
                          "has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-dasharray": [
                          3,
                          2
                      ],
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          1,
                          18,
                          11
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          12,
                          0,
                          12.5,
                          1
                      ]
                  }
              },
              {
                  "id": "roads_tunnels_major_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "major_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-dasharray": [
                          3,
                          2
                      ],
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          7,
                          0,
                          7.5,
                          0.5,
                          18,
                          13
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          9,
                          0,
                          9.5,
                          1
                      ]
                  }
              },
              {
                  "id": "roads_tunnels_highway_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "highway"
                      ],
                      [
                          "!has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-dasharray": [
                          6,
                          0.5
                      ],
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          0,
                          3.5,
                          0.5,
                          18,
                          15
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          7,
                          0,
                          7.5,
                          1,
                          20,
                          15
                      ]
                  }
              },
              {
                  "id": "roads_tunnels_other",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_tunnel"
                      ],
                      [
                          "in",
                          "kind",
                          "other",
                          "path"
                      ]
                  ],
                  "paint": {
                      "line-color": "#d5d5d5",
                      "line-dasharray": [
                          4.5,
                          0.5
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          14,
                          0,
                          20,
                          7
                      ]
                  }
              },
              {
                  "id": "roads_tunnels_minor",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_tunnel"
                      ],
                      [
                          "==",
                          "kind",
                          "minor_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#d5d5d5",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          11,
                          0,
                          12.5,
                          0.5,
                          15,
                          2,
                          18,
                          11
                      ]
                  }
              },
              {
                  "id": "roads_tunnels_link",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_tunnel"
                      ],
                      [
                          "has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#d5d5d5",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          1,
                          18,
                          11
                      ]
                  }
              },
              {
                  "id": "roads_tunnels_major",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_tunnel"
                      ],
                      [
                          "==",
                          "kind",
                          "major_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#d5d5d5",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          6,
                          0,
                          12,
                          1.6,
                          15,
                          3,
                          18,
                          13
                      ]
                  }
              },
              {
                  "id": "roads_tunnels_highway",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_tunnel"
                      ],
                      [
                          "==",
                          [
                              "get",
                              "kind"
                          ],
                          "highway"
                      ],
                      [
                          "!",
                          [
                              "has",
                              "is_link"
                          ]
                      ]
                  ],
                  "paint": {
                      "line-color": "#d5d5d5",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          0,
                          6,
                          1.1,
                          12,
                          1.6,
                          15,
                          5,
                          18,
                          15
                      ]
                  }
              },
              {
                  "id": "buildings",
                  "type": "fill",
                  "source": "protomaps",
                  "source-layer": "buildings",
                  "paint": {
                      "fill-color": "#cccccc",
                      "fill-opacity": 0.5
                  }
              },
              {
                  "id": "roads_pier",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "==",
                      "kind_detail",
                      "pier"
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          12,
                          0,
                          12.5,
                          0.5,
                          20,
                          16
                      ]
                  }
              },
              {
                  "id": "roads_minor_service_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 13,
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "minor_road"
                      ],
                      [
                          "==",
                          "kind_detail",
                          "service"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          18,
                          8
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          0.8
                      ]
                  }
              },
              {
                  "id": "roads_minor_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "minor_road"
                      ],
                      [
                          "!=",
                          "kind_detail",
                          "service"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          11,
                          0,
                          12.5,
                          0.5,
                          15,
                          2,
                          18,
                          11
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          12,
                          0,
                          12.5,
                          1
                      ]
                  }
              },
              {
                  "id": "roads_link_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 13,
                  "filter": [
                      "has",
                      "is_link"
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          1,
                          18,
                          11
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          1.5
                      ]
                  }
              },
              {
                  "id": "roads_major_casing_late",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "major_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          6,
                          0,
                          12,
                          1.6,
                          15,
                          3,
                          18,
                          13
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          9,
                          0,
                          9.5,
                          1
                      ]
                  }
              },
              {
                  "id": "roads_highway_casing_late",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "highway"
                      ],
                      [
                          "!has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          0,
                          3.5,
                          0.5,
                          18,
                          15
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          7,
                          0,
                          7.5,
                          1,
                          20,
                          15
                      ]
                  }
              },
              {
                  "id": "roads_other",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "in",
                          "kind",
                          "other",
                          "path"
                      ],
                      [
                          "!=",
                          "kind_detail",
                          "pier"
                      ]
                  ],
                  "paint": {
                      "line-color": "#ebebeb",
                      "line-dasharray": [
                          3,
                          1
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          14,
                          0,
                          20,
                          7
                      ]
                  }
              },
              {
                  "id": "roads_link",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "has",
                      "is_link"
                  ],
                  "paint": {
                      "line-color": "#ffffff",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          1,
                          18,
                          11
                      ]
                  }
              },
              {
                  "id": "roads_minor_service",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "minor_road"
                      ],
                      [
                          "==",
                          "kind_detail",
                          "service"
                      ]
                  ],
                  "paint": {
                      "line-color": "#ebebeb",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          18,
                          8
                      ]
                  }
              },
              {
                  "id": "roads_minor",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "minor_road"
                      ],
                      [
                          "!=",
                          "kind_detail",
                          "service"
                      ]
                  ],
                  "paint": {
                      "line-color": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          11,
                          "#ebebeb",
                          16,
                          "#ffffff"
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          11,
                          0,
                          12.5,
                          0.5,
                          15,
                          2,
                          18,
                          11
                      ]
                  }
              },
              {
                  "id": "roads_major_casing_early",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "maxzoom": 12,
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "major_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          7,
                          0,
                          7.5,
                          0.5,
                          18,
                          13
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          9,
                          0,
                          9.5,
                          1
                      ]
                  }
              },
              {
                  "id": "roads_major",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "major_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#ffffff",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          6,
                          0,
                          12,
                          1.6,
                          15,
                          3,
                          18,
                          13
                      ]
                  }
              },
              {
                  "id": "roads_highway_casing_early",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "maxzoom": 12,
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "highway"
                      ],
                      [
                          "!has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          0,
                          3.5,
                          0.5,
                          18,
                          15
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          7,
                          0,
                          7.5,
                          1
                      ]
                  }
              },
              {
                  "id": "roads_highway",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "!has",
                          "is_tunnel"
                      ],
                      [
                          "!has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "highway"
                      ],
                      [
                          "!has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#ffffff",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          0,
                          6,
                          1.1,
                          12,
                          1.6,
                          15,
                          5,
                          18,
                          15
                      ]
                  }
              },
              {
                  "id": "roads_rail",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "==",
                      "kind",
                      "rail"
                  ],
                  "paint": {
                      "line-dasharray": [
                          0.3,
                          0.75
                      ],
                      "line-opacity": 0.5,
                      "line-color": "#a7b1b3",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          0,
                          6,
                          0.15,
                          18,
                          9
                      ]
                  }
              },
              {
                  "id": "boundaries_country",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "boundaries",
                  "filter": [
                      "<=",
                      "kind_detail",
                      2
                  ],
                  "paint": {
                      "line-color": "#adadad",
                      "line-width": 1,
                      "line-dasharray": [
                          3,
                          2
                      ]
                  }
              },
              {
                  "id": "boundaries",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "boundaries",
                  "filter": [
                      ">",
                      "kind_detail",
                      2
                  ],
                  "paint": {
                      "line-color": "#adadad",
                      "line-width": 0.5,
                      "line-dasharray": [
                          3,
                          2
                      ]
                  }
              },
              {
                  "id": "roads_bridges_other_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "in",
                          "kind",
                          "other",
                          "path"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          14,
                          0,
                          20,
                          7
                      ]
                  }
              },
              {
                  "id": "roads_bridges_link_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          1,
                          18,
                          11
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          12,
                          0,
                          12.5,
                          1.5
                      ]
                  }
              },
              {
                  "id": "roads_bridges_minor_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "minor_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          11,
                          0,
                          12.5,
                          0.5,
                          15,
                          2,
                          18,
                          11
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          0.8
                      ]
                  }
              },
              {
                  "id": "roads_bridges_major_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "major_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          7,
                          0,
                          7.5,
                          0.5,
                          18,
                          10
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          9,
                          0,
                          9.5,
                          1.5
                      ]
                  }
              },
              {
                  "id": "roads_bridges_other",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "in",
                          "kind",
                          "other",
                          "path"
                      ]
                  ],
                  "paint": {
                      "line-color": "#ebebeb",
                      "line-dasharray": [
                          2,
                          1
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          14,
                          0,
                          20,
                          7
                      ]
                  }
              },
              {
                  "id": "roads_bridges_minor",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "minor_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#ffffff",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          11,
                          0,
                          12.5,
                          0.5,
                          15,
                          2,
                          18,
                          11
                      ]
                  }
              },
              {
                  "id": "roads_bridges_link",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#ffffff",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          13,
                          0,
                          13.5,
                          1,
                          18,
                          11
                      ]
                  }
              },
              {
                  "id": "roads_bridges_major",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "major_road"
                      ]
                  ],
                  "paint": {
                      "line-color": "#f5f5f5",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          6,
                          0,
                          12,
                          1.6,
                          15,
                          3,
                          18,
                          13
                      ]
                  }
              },
              {
                  "id": "roads_bridges_highway_casing",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 12,
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "highway"
                      ],
                      [
                          "!has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#e0e0e0",
                      "line-gap-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          0,
                          3.5,
                          0.5,
                          18,
                          15
                      ],
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          7,
                          0,
                          7.5,
                          1,
                          20,
                          15
                      ]
                  }
              },
              {
                  "id": "roads_bridges_highway",
                  "type": "line",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "filter": [
                      "all",
                      [
                          "has",
                          "is_bridge"
                      ],
                      [
                          "==",
                          "kind",
                          "highway"
                      ],
                      [
                          "!has",
                          "is_link"
                      ]
                  ],
                  "paint": {
                      "line-color": "#ffffff",
                      "line-width": [
                          "interpolate",
                          [
                              "exponential",
                              1.6
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          0,
                          6,
                          1.1,
                          12,
                          1.6,
                          15,
                          5,
                          18,
                          15
                      ]
                  }
              },
              {
                  "id": "water_waterway_label",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "water",
                  "minzoom": 13,
                  "filter": [
                      "in",
                      "kind",
                      "river",
                      "stream"
                  ],
                  "layout": {
                      "symbol-placement": "line",
                      "text-font": [
                          "Noto Sans Italic"
                      ],
                      "text-field": [
                          "case",
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name2"
                                      ],
                                      [
                                          "has",
                                          "pgf:name2"
                                      ]
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "has",
                                  "script"
                              ],
                              [
                                  "case",
                                  [
                                      "any",
                                      [
                                          "is-supported-script",
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "name:en"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "case",
                                          [
                                              "all",
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "name:en"
                                                  ]
                                              ],
                                              [
                                                  "has",
                                                  "name:en"
                                              ],
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "script"
                                                  ]
                                              ]
                                          ],
                                          "",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "get",
                                      "name:en"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {}
                              ]
                          ],
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "any",
                                  [
                                      "has",
                                      "name2"
                                  ],
                                  [
                                      "has",
                                      "pgf:name2"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "has",
                                      "script3"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name3"
                                      ],
                                      [
                                          "get",
                                          "name3"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script3"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script2"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ]
                      ],
                      "text-size": 12,
                      "text-letter-spacing": 0.2
                  },
                  "paint": {
                      "text-color": "#728dd4"
                  }
              },
              {
                  "id": "roads_labels_minor",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 15,
                  "filter": [
                      "in",
                      "kind",
                      "minor_road",
                      "other",
                      "path"
                  ],
                  "layout": {
                      "symbol-sort-key": [
                          "get",
                          "min_zoom"
                      ],
                      "symbol-placement": "line",
                      "text-font": [
                          "Noto Sans Regular"
                      ],
                      "text-field": [
                          "case",
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name2"
                                      ],
                                      [
                                          "has",
                                          "pgf:name2"
                                      ]
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "has",
                                  "script"
                              ],
                              [
                                  "case",
                                  [
                                      "any",
                                      [
                                          "is-supported-script",
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "name:en"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "case",
                                          [
                                              "all",
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "name:en"
                                                  ]
                                              ],
                                              [
                                                  "has",
                                                  "name:en"
                                              ],
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "script"
                                                  ]
                                              ]
                                          ],
                                          "",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "get",
                                      "name:en"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {}
                              ]
                          ],
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "any",
                                  [
                                      "has",
                                      "name2"
                                  ],
                                  [
                                      "has",
                                      "pgf:name2"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "has",
                                      "script3"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name3"
                                      ],
                                      [
                                          "get",
                                          "name3"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script3"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script2"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ]
                      ],
                      "text-size": 12
                  },
                  "paint": {
                      "text-color": "#91888b",
                      "text-halo-color": "#ffffff",
                      "text-halo-width": 1,
                      "text-halo-blur": 1
                  }
              },
              {
                  "id": "water_label_ocean",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "water",
                  "filter": [
                      "in",
                      "kind",
                      "sea",
                      "ocean",
                      "lake",
                      "water",
                      "bay",
                      "strait",
                      "fjord"
                  ],
                  "layout": {
                      "text-font": [
                          "Noto Sans Italic"
                      ],
                      "text-field": [
                          "case",
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name2"
                                      ],
                                      [
                                          "has",
                                          "pgf:name2"
                                      ]
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "has",
                                  "script"
                              ],
                              [
                                  "case",
                                  [
                                      "any",
                                      [
                                          "is-supported-script",
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "name:en"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "case",
                                          [
                                              "all",
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "name:en"
                                                  ]
                                              ],
                                              [
                                                  "has",
                                                  "name:en"
                                              ],
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "script"
                                                  ]
                                              ]
                                          ],
                                          "",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "get",
                                      "name:en"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {}
                              ]
                          ],
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "any",
                                  [
                                      "has",
                                      "name2"
                                  ],
                                  [
                                      "has",
                                      "pgf:name2"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "has",
                                      "script3"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name3"
                                      ],
                                      [
                                          "get",
                                          "name3"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script3"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script2"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ]
                      ],
                      "text-size": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          10,
                          10,
                          12
                      ],
                      "text-letter-spacing": 0.1,
                      "text-max-width": 9,
                      "text-transform": "uppercase"
                  },
                  "paint": {
                      "text-color": "#728dd4"
                  }
              },
              {
                  "id": "water_label_lakes",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "water",
                  "filter": [
                      "in",
                      "kind",
                      "lake",
                      "water"
                  ],
                  "layout": {
                      "text-font": [
                          "Noto Sans Italic"
                      ],
                      "text-field": [
                          "case",
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name2"
                                      ],
                                      [
                                          "has",
                                          "pgf:name2"
                                      ]
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "has",
                                  "script"
                              ],
                              [
                                  "case",
                                  [
                                      "any",
                                      [
                                          "is-supported-script",
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "name:en"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "case",
                                          [
                                              "all",
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "name:en"
                                                  ]
                                              ],
                                              [
                                                  "has",
                                                  "name:en"
                                              ],
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "script"
                                                  ]
                                              ]
                                          ],
                                          "",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "get",
                                      "name:en"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {}
                              ]
                          ],
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "any",
                                  [
                                      "has",
                                      "name2"
                                  ],
                                  [
                                      "has",
                                      "pgf:name2"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "has",
                                      "script3"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name3"
                                      ],
                                      [
                                          "get",
                                          "name3"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script3"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script2"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ]
                      ],
                      "text-size": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          0,
                          6,
                          12,
                          10,
                          12
                      ],
                      "text-letter-spacing": 0.1,
                      "text-max-width": 9
                  },
                  "paint": {
                      "text-color": "#728dd4"
                  }
              },
              {
                  "id": "roads_labels_major",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "roads",
                  "minzoom": 11,
                  "filter": [
                      "in",
                      "kind",
                      "highway",
                      "major_road"
                  ],
                  "layout": {
                      "symbol-sort-key": [
                          "get",
                          "min_zoom"
                      ],
                      "symbol-placement": "line",
                      "text-font": [
                          "Noto Sans Regular"
                      ],
                      "text-field": [
                          "case",
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name2"
                                      ],
                                      [
                                          "has",
                                          "pgf:name2"
                                      ]
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "has",
                                  "script"
                              ],
                              [
                                  "case",
                                  [
                                      "any",
                                      [
                                          "is-supported-script",
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "name:en"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "case",
                                          [
                                              "all",
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "name:en"
                                                  ]
                                              ],
                                              [
                                                  "has",
                                                  "name:en"
                                              ],
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "script"
                                                  ]
                                              ]
                                          ],
                                          "",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "get",
                                      "name:en"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {}
                              ]
                          ],
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "any",
                                  [
                                      "has",
                                      "name2"
                                  ],
                                  [
                                      "has",
                                      "pgf:name2"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "has",
                                      "script3"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name3"
                                      ],
                                      [
                                          "get",
                                          "name3"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script3"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script2"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ]
                      ],
                      "text-size": 12
                  },
                  "paint": {
                      "text-color": "#938a8d",
                      "text-halo-color": "#ffffff",
                      "text-halo-width": 1,
                      "text-halo-blur": 1
                  }
              },
              {
                  "id": "pois",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "pois",
                  "filter": [
                      "all",
                      [
                          "in",
                          [
                              "get",
                              "kind"
                          ],
                          [
                              "literal",
                              [
                                  "beach",
                                  "forest",
                                  "marina",
                                  "park",
                                  "peak",
                                  "zoo",
                                  "garden",
                                  "bench",
                                  "aerodrome",
                                  "station",
                                  "bus_stop",
                                  "ferry_terminal",
                                  "stadium",
                                  "university",
                                  "library",
                                  "school",
                                  "animal",
                                  "toilets",
                                  "drinking_water"
                              ]
                          ]
                      ],
                      [
                          ">=",
                          [
                              "zoom"
                          ],
                          [
                              "+",
                              [
                                  "get",
                                  "min_zoom"
                              ],
                              0
                          ]
                      ]
                  ],
                  "layout": {
                      "icon-image": [
                          "match",
                          [
                              "get",
                              "kind"
                          ],
                          "station",
                          "train_station",
                          [
                              "get",
                              "kind"
                          ]
                      ],
                      "text-font": [
                          "Noto Sans Regular"
                      ],
                      "text-justify": "auto",
                      "text-field": [
                          "case",
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name2"
                                      ],
                                      [
                                          "has",
                                          "pgf:name2"
                                      ]
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "has",
                                  "script"
                              ],
                              [
                                  "case",
                                  [
                                      "any",
                                      [
                                          "is-supported-script",
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "name:en"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "case",
                                          [
                                              "all",
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "name:en"
                                                  ]
                                              ],
                                              [
                                                  "has",
                                                  "name:en"
                                              ],
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "script"
                                                  ]
                                              ]
                                          ],
                                          "",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "get",
                                      "name:en"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {}
                              ]
                          ],
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "any",
                                  [
                                      "has",
                                      "name2"
                                  ],
                                  [
                                      "has",
                                      "pgf:name2"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "has",
                                      "script3"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name3"
                                      ],
                                      [
                                          "get",
                                          "name3"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script3"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script2"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ]
                      ],
                      "text-size": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          17,
                          10,
                          19,
                          16
                      ],
                      "text-max-width": 8,
                      "text-offset": [
                          1.1,
                          0
                      ],
                      "text-variable-anchor": [
                          "left",
                          "right"
                      ]
                  },
                  "paint": {
                      "text-color": [
                          "case",
                          [
                              "in",
                              [
                                  "get",
                                  "kind"
                              ],
                              [
                                  "literal",
                                  [
                                      "beach",
                                      "forest",
                                      "marina",
                                      "park",
                                      "peak",
                                      "zoo",
                                      "garden",
                                      "bench"
                                  ]
                              ]
                          ],
                          "#20834D",
                          [
                              "in",
                              [
                                  "get",
                                  "kind"
                              ],
                              [
                                  "literal",
                                  [
                                      "aerodrome",
                                      "station",
                                      "bus_stop",
                                      "ferry_terminal"
                                  ]
                              ]
                          ],
                          "#315BCF",
                          [
                              "in",
                              [
                                  "get",
                                  "kind"
                              ],
                              [
                                  "literal",
                                  [
                                      "stadium",
                                      "university",
                                      "library",
                                      "school",
                                      "animal",
                                      "toilets",
                                      "drinking_water"
                                  ]
                              ]
                          ],
                          "#6A5B8F",
                          "#e2dfda"
                      ]
                  }
              },
      
              {  
                  "id": "housenumbers",
                  "type": "symbol", 
                  "source": "protomaps",
                  "source-layer": "buildings",
                  "layout": {
                      "text-field": ["get", "house_number"],
                      "text-font": ["Noto Sans Regular"],
                      "text-size": 10, 
                      "text-anchor": "center", 
                      "text-offset": [0, 0.1] 
                  },
                  "paint": {
                  "text-color": "#333", 
                  "text-halo-color": "#fff", 
                  "text-halo-width": 1    
                  }
              },
      
      
              {
                  "id": "places_subplace",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "places",
                  "filter": [
                      "==",
                      "kind",
                      "neighbourhood"
                  ],
                  "layout": {
                      "symbol-sort-key": [
                          "get",
                          "min_zoom"
                      ],
                      "text-field": [
                          "case",
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name2"
                                      ],
                                      [
                                          "has",
                                          "pgf:name2"
                                      ]
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "has",
                                  "script"
                              ],
                              [
                                  "case",
                                  [
                                      "any",
                                      [
                                          "is-supported-script",
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "name:en"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "case",
                                          [
                                              "all",
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "name:en"
                                                  ]
                                              ],
                                              [
                                                  "has",
                                                  "name:en"
                                              ],
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "script"
                                                  ]
                                              ]
                                          ],
                                          "",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "get",
                                      "name:en"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {}
                              ]
                          ],
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "any",
                                  [
                                      "has",
                                      "name2"
                                  ],
                                  [
                                      "has",
                                      "pgf:name2"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "has",
                                      "script3"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name3"
                                      ],
                                      [
                                          "get",
                                          "name3"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script3"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script2"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ]
                      ],
                      "text-font": [
                          "Noto Sans Regular"
                      ],
                      "text-max-width": 7,
                      "text-letter-spacing": 0.1,
                      "text-padding": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          5,
                          2,
                          8,
                          4,
                          12,
                          18,
                          15,
                          20
                      ],
                      "text-size": [
                          "interpolate",
                          [
                              "exponential",
                              1.2
                          ],
                          [
                              "zoom"
                          ],
                          11,
                          8,
                          14,
                          14,
                          18,
                          24
                      ],
                      "text-transform": "uppercase"
                  },
                  "paint": {
                      "text-color": "#8f8f8f",
                      "text-halo-color": "#e0e0e0",
                      "text-halo-width": 1,
                      "text-halo-blur": 1
                  }
              },
              {
                  "id": "places_locality",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "places",
                  "filter": [
                      "==",
                      "kind",
                      "locality"
                  ],
                  "layout": {
                      "icon-image": [
                          "step",
                          [
                              "zoom"
                          ],
                          "townspot",
                          8,
                          ""
                      ],
                      "icon-size": 0.7,
                      "text-field": [
                          "case",
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name2"
                                      ],
                                      [
                                          "has",
                                          "pgf:name2"
                                      ]
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "has",
                                  "script"
                              ],
                              [
                                  "case",
                                  [
                                      "any",
                                      [
                                          "is-supported-script",
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "name:en"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "case",
                                          [
                                              "all",
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "name:en"
                                                  ]
                                              ],
                                              [
                                                  "has",
                                                  "name:en"
                                              ],
                                              [
                                                  "!",
                                                  [
                                                      "has",
                                                      "script"
                                                  ]
                                              ]
                                          ],
                                          "",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "get",
                                      "name:en"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {}
                              ]
                          ],
                          [
                              "all",
                              [
                                  "any",
                                  [
                                      "has",
                                      "name"
                                  ],
                                  [
                                      "has",
                                      "pgf:name"
                                  ]
                              ],
                              [
                                  "any",
                                  [
                                      "has",
                                      "name2"
                                  ],
                                  [
                                      "has",
                                      "pgf:name2"
                                  ]
                              ],
                              [
                                  "!",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name3"
                                      ],
                                      [
                                          "has",
                                          "pgf:name3"
                                      ]
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ],
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "has",
                                      "script2"
                                  ],
                                  [
                                      "has",
                                      "script3"
                                  ]
                              ],
                              [
                                  "format",
                                  [
                                      "get",
                                      "name:en"
                                  ],
                                  {},
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name"
                                      ],
                                      [
                                          "get",
                                          "name"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name2"
                                      ],
                                      [
                                          "get",
                                          "name2"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script2"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  },
                                  "\n",
                                  {},
                                  [
                                      "coalesce",
                                      [
                                          "get",
                                          "pgf:name3"
                                      ],
                                      [
                                          "get",
                                          "name3"
                                      ]
                                  ],
                                  {
                                      "text-font": [
                                          "case",
                                          [
                                              "==",
                                              [
                                                  "get",
                                                  "script3"
                                              ],
                                              "Devanagari"
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Devanagari Regular v1"
                                              ]
                                          ],
                                          [
                                              "literal",
                                              [
                                                  "Noto Sans Regular"
                                              ]
                                          ]
                                      ]
                                  }
                              ],
                              [
                                  "case",
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "!",
                                      [
                                          "has",
                                          "script2"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ]
                              ]
                          ]
                      ],
                      "text-font": [
                          "case",
                          [
                              "<=",
                              [
                                  "get",
                                  "min_zoom"
                              ],
                              5
                          ],
                          [
                              "literal",
                              [
                                  "Noto Sans Medium"
                              ]
                          ],
                          [
                              "literal",
                              [
                                  "Noto Sans Regular"
                              ]
                          ]
                      ],
                      "text-padding": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          5,
                          3,
                          8,
                          7,
                          12,
                          11
                      ],
                      "text-size": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          2,
                          [
                              "case",
                              [
                                  "<",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  13
                              ],
                              8,
                              [
                                  ">=",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  13
                              ],
                              13,
                              0
                          ],
                          4,
                          [
                              "case",
                              [
                                  "<",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  13
                              ],
                              10,
                              [
                                  ">=",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  13
                              ],
                              15,
                              0
                          ],
                          6,
                          [
                              "case",
                              [
                                  "<",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  12
                              ],
                              11,
                              [
                                  ">=",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  12
                              ],
                              17,
                              0
                          ],
                          8,
                          [
                              "case",
                              [
                                  "<",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  11
                              ],
                              11,
                              [
                                  ">=",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  11
                              ],
                              18,
                              0
                          ],
                          10,
                          [
                              "case",
                              [
                                  "<",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  9
                              ],
                              12,
                              [
                                  ">=",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  9
                              ],
                              20,
                              0
                          ],
                          15,
                          [
                              "case",
                              [
                                  "<",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  8
                              ],
                              12,
                              [
                                  ">=",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  8
                              ],
                              22,
                              0
                          ]
                      ],
                      "icon-padding": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          0,
                          0,
                          8,
                          4,
                          10,
                          8,
                          12,
                          6,
                          22,
                          2
                      ],
                      "text-justify": "auto",
                      "text-anchor": [
                          "step",
                          [
                              "zoom"
                          ],
                          "left",
                          8,
                          "center"
                      ],
                      "text-radial-offset": 0.4
                  },
                  "paint": {
                      "text-color": "#5c5c5c",
                      "text-halo-color": "#e0e0e0",
                      "text-halo-width": 1,
                      "text-halo-blur": 1
                  }
              },
              {
                  "id": "places_region",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "places",
                  "filter": [
                      "==",
                      "kind",
                      "region"
                  ],
                  "layout": {
                      "symbol-sort-key": [
                          "get",
                          "min_zoom"
                      ],
                      "text-field": [
                          "step",
                          [
                              "zoom"
                          ],
                          [
                              "get",
                              "name:short"
                          ],
                          6,
                          [
                              "case",
                              [
                                  "all",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name"
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "!",
                                      [
                                          "any",
                                          [
                                              "has",
                                              "name2"
                                          ],
                                          [
                                              "has",
                                              "pgf:name2"
                                          ]
                                      ]
                                  ],
                                  [
                                      "!",
                                      [
                                          "any",
                                          [
                                              "has",
                                              "name3"
                                          ],
                                          [
                                              "has",
                                              "pgf:name3"
                                          ]
                                      ]
                                  ]
                              ],
                              [
                                  "case",
                                  [
                                      "has",
                                      "script"
                                  ],
                                  [
                                      "case",
                                      [
                                          "any",
                                          [
                                              "is-supported-script",
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ],
                                          [
                                              "has",
                                              "pgf:name"
                                          ]
                                      ],
                                      [
                                          "format",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "name:en"
                                              ],
                                              [
                                                  "get",
                                                  "name:en"
                                              ]
                                          ],
                                          {},
                                          "\n",
                                          {},
                                          [
                                              "case",
                                              [
                                                  "all",
                                                  [
                                                      "!",
                                                      [
                                                          "has",
                                                          "name:en"
                                                      ]
                                                  ],
                                                  [
                                                      "has",
                                                      "name:en"
                                                  ],
                                                  [
                                                      "!",
                                                      [
                                                          "has",
                                                          "script"
                                                      ]
                                                  ]
                                              ],
                                              "",
                                              [
                                                  "coalesce",
                                                  [
                                                      "get",
                                                      "pgf:name"
                                                  ],
                                                  [
                                                      "get",
                                                      "name"
                                                  ]
                                              ]
                                          ],
                                          {
                                              "text-font": [
                                                  "case",
                                                  [
                                                      "==",
                                                      [
                                                          "get",
                                                          "script"
                                                      ],
                                                      "Devanagari"
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Devanagari Regular v1"
                                                      ]
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Regular"
                                                      ]
                                                  ]
                                              ]
                                          }
                                      ],
                                      [
                                          "get",
                                          "name:en"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "name:en"
                                          ],
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {}
                                  ]
                              ],
                              [
                                  "all",
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name"
                                      ],
                                      [
                                          "has",
                                          "pgf:name"
                                      ]
                                  ],
                                  [
                                      "any",
                                      [
                                          "has",
                                          "name2"
                                      ],
                                      [
                                          "has",
                                          "pgf:name2"
                                      ]
                                  ],
                                  [
                                      "!",
                                      [
                                          "any",
                                          [
                                              "has",
                                              "name3"
                                          ],
                                          [
                                              "has",
                                              "pgf:name3"
                                          ]
                                      ]
                                  ]
                              ],
                              [
                                  "case",
                                  [
                                      "all",
                                      [
                                          "has",
                                          "script"
                                      ],
                                      [
                                          "has",
                                          "script2"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "case",
                                      [
                                          "has",
                                          "script2"
                                      ],
                                      [
                                          "format",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "name:en"
                                              ],
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ],
                                          {},
                                          "\n",
                                          {},
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name2"
                                              ],
                                              [
                                                  "get",
                                                  "name2"
                                              ]
                                          ],
                                          {
                                              "text-font": [
                                                  "case",
                                                  [
                                                      "==",
                                                      [
                                                          "get",
                                                          "script2"
                                                      ],
                                                      "Devanagari"
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Devanagari Regular v1"
                                                      ]
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Regular"
                                                      ]
                                                  ]
                                              ]
                                          }
                                      ],
                                      [
                                          "format",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "name:en"
                                              ],
                                              [
                                                  "get",
                                                  "pgf:name2"
                                              ],
                                              [
                                                  "get",
                                                  "name2"
                                              ]
                                          ],
                                          {},
                                          "\n",
                                          {},
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ],
                                          {
                                              "text-font": [
                                                  "case",
                                                  [
                                                      "==",
                                                      [
                                                          "get",
                                                          "script"
                                                      ],
                                                      "Devanagari"
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Devanagari Regular v1"
                                                      ]
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Regular"
                                                      ]
                                                  ]
                                              ]
                                          }
                                      ]
                                  ]
                              ],
                              [
                                  "case",
                                  [
                                      "all",
                                      [
                                          "has",
                                          "script"
                                      ],
                                      [
                                          "has",
                                          "script2"
                                      ],
                                      [
                                          "has",
                                          "script3"
                                      ]
                                  ],
                                  [
                                      "format",
                                      [
                                          "get",
                                          "name:en"
                                      ],
                                      {},
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name"
                                          ],
                                          [
                                              "get",
                                              "name"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name2"
                                          ],
                                          [
                                              "get",
                                              "name2"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script2"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      },
                                      "\n",
                                      {},
                                      [
                                          "coalesce",
                                          [
                                              "get",
                                              "pgf:name3"
                                          ],
                                          [
                                              "get",
                                              "name3"
                                          ]
                                      ],
                                      {
                                          "text-font": [
                                              "case",
                                              [
                                                  "==",
                                                  [
                                                      "get",
                                                      "script3"
                                                  ],
                                                  "Devanagari"
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Devanagari Regular v1"
                                                  ]
                                              ],
                                              [
                                                  "literal",
                                                  [
                                                      "Noto Sans Regular"
                                                  ]
                                              ]
                                          ]
                                      }
                                  ],
                                  [
                                      "case",
                                      [
                                          "!",
                                          [
                                              "has",
                                              "script"
                                          ]
                                      ],
                                      [
                                          "format",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "name:en"
                                              ],
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ],
                                          {},
                                          "\n",
                                          {},
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name2"
                                              ],
                                              [
                                                  "get",
                                                  "name2"
                                              ]
                                          ],
                                          {
                                              "text-font": [
                                                  "case",
                                                  [
                                                      "==",
                                                      [
                                                          "get",
                                                          "script2"
                                                      ],
                                                      "Devanagari"
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Devanagari Regular v1"
                                                      ]
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Regular"
                                                      ]
                                                  ]
                                              ]
                                          },
                                          "\n",
                                          {},
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name3"
                                              ],
                                              [
                                                  "get",
                                                  "name3"
                                              ]
                                          ],
                                          {
                                              "text-font": [
                                                  "case",
                                                  [
                                                      "==",
                                                      [
                                                          "get",
                                                          "script3"
                                                      ],
                                                      "Devanagari"
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Devanagari Regular v1"
                                                      ]
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Regular"
                                                      ]
                                                  ]
                                              ]
                                          }
                                      ],
                                      [
                                          "!",
                                          [
                                              "has",
                                              "script2"
                                          ]
                                      ],
                                      [
                                          "format",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "name:en"
                                              ],
                                              [
                                                  "get",
                                                  "pgf:name2"
                                              ],
                                              [
                                                  "get",
                                                  "name2"
                                              ]
                                          ],
                                          {},
                                          "\n",
                                          {},
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ],
                                          {
                                              "text-font": [
                                                  "case",
                                                  [
                                                      "==",
                                                      [
                                                          "get",
                                                          "script"
                                                      ],
                                                      "Devanagari"
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Devanagari Regular v1"
                                                      ]
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Regular"
                                                      ]
                                                  ]
                                              ]
                                          },
                                          "\n",
                                          {},
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name3"
                                              ],
                                              [
                                                  "get",
                                                  "name3"
                                              ]
                                          ],
                                          {
                                              "text-font": [
                                                  "case",
                                                  [
                                                      "==",
                                                      [
                                                          "get",
                                                          "script3"
                                                      ],
                                                      "Devanagari"
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Devanagari Regular v1"
                                                      ]
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Regular"
                                                      ]
                                                  ]
                                              ]
                                          }
                                      ],
                                      [
                                          "format",
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "name:en"
                                              ],
                                              [
                                                  "get",
                                                  "pgf:name3"
                                              ],
                                              [
                                                  "get",
                                                  "name3"
                                              ]
                                          ],
                                          {},
                                          "\n",
                                          {},
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name"
                                              ],
                                              [
                                                  "get",
                                                  "name"
                                              ]
                                          ],
                                          {
                                              "text-font": [
                                                  "case",
                                                  [
                                                      "==",
                                                      [
                                                          "get",
                                                          "script"
                                                      ],
                                                      "Devanagari"
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Devanagari Regular v1"
                                                      ]
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Regular"
                                                      ]
                                                  ]
                                              ]
                                          },
                                          "\n",
                                          {},
                                          [
                                              "coalesce",
                                              [
                                                  "get",
                                                  "pgf:name2"
                                              ],
                                              [
                                                  "get",
                                                  "name2"
                                              ]
                                          ],
                                          {
                                              "text-font": [
                                                  "case",
                                                  [
                                                      "==",
                                                      [
                                                          "get",
                                                          "script2"
                                                      ],
                                                      "Devanagari"
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Devanagari Regular v1"
                                                      ]
                                                  ],
                                                  [
                                                      "literal",
                                                      [
                                                          "Noto Sans Regular"
                                                      ]
                                                  ]
                                              ]
                                          }
                                      ]
                                  ]
                              ]
                          ]
                      ],
                      "text-font": [
                          "Noto Sans Regular"
                      ],
                      "text-size": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          3,
                          11,
                          7,
                          16
                      ],
                      "text-radial-offset": 0.2,
                      "text-anchor": "center",
                      "text-transform": "uppercase"
                  },
                  "paint": {
                      "text-color": "#b3b3b3",
                      "text-halo-color": "#e0e0e0",
                      "text-halo-width": 1,
                      "text-halo-blur": 1
                  }
              },
              {
                  "id": "places_country",
                  "type": "symbol",
                  "source": "protomaps",
                  "source-layer": "places",
                  "filter": [
                      "==",
                      "kind",
                      "country"
                  ],
                  "layout": {
                      "symbol-sort-key": [
                          "get",
                          "min_zoom"
                      ],
                      "text-field": [
                          "format",
                          [
                              "coalesce",
                              [
                                  "get",
                                  "name:en"
                              ],
                              [
                                  "get",
                                  "name:en"
                              ]
                          ],
                          {}
                      ],
                      "text-font": [
                          "Noto Sans Medium"
                      ],
                      "text-size": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          2,
                          [
                              "case",
                              [
                                  "<",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  10
                              ],
                              8,
                              [
                                  ">=",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  10
                              ],
                              12,
                              0
                          ],
                          6,
                          [
                              "case",
                              [
                                  "<",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  8
                              ],
                              10,
                              [
                                  ">=",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  8
                              ],
                              18,
                              0
                          ],
                          8,
                          [
                              "case",
                              [
                                  "<",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  7
                              ],
                              11,
                              [
                                  ">=",
                                  [
                                      "get",
                                      "population_rank"
                                  ],
                                  7
                              ],
                              20,
                              0
                          ]
                      ],
                      "icon-padding": [
                          "interpolate",
                          [
                              "linear"
                          ],
                          [
                              "zoom"
                          ],
                          0,
                          2,
                          14,
                          2,
                          16,
                          20,
                          17,
                          2,
                          22,
                          2
                      ],
                      "text-transform": "uppercase"
                  },
                  "paint": {
                      "text-color": "#a3a3a3"
                  }
              }
          ],
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