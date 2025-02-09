import mapboxgl from "mapbox-gl";

export function initializeMap(container: HTMLDivElement, mapboxToken : string): mapboxgl.Map {
    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
        container: container,
        style: "mapbox://styles/mapbox/light-v11",
        center: [6.799617926519687, 51.223350738818], // Düsseldorf
        zoom: 11.8,
    });
    return map;
}

export function addBordersLayer(map: mapboxgl.Map) {
    map.addSource("duesseldorf-borders", {
        type: "geojson",
        data: "/dus.json", // Direkt aus dem public-Ordner
    });

    map.addLayer({
        id: "duesseldorf-borders-layer",
        type: "line",
        source: "duesseldorf-borders",
        paint: {
            "line-color": "red",
            "line-width": 1.0,
        },
    });
}