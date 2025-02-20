import mapboxgl from "mapbox-gl";

export const mapboxToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
    throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

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
    addSource(map, "duesseldorf-borders", "/dus.json");
    addLayer(map, "duesseldorf-borders-layer", "duesseldorf-borders", "line", {
        "line-color": "red",
        "line-width": 1.0,
    });
}

export function addSource(map: mapboxgl.Map, sourceId: string, data: any) {
    if (!map.getSource(sourceId)) {
        map.addSource(sourceId, { type: "geojson", data });
    }
}

export function removeSource(map: mapboxgl.Map, sourceId: string) {
    if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
    }
}

export function addLayer(map: mapboxgl.Map, layerId: string, sourceId: string, type: "line" | "fill" | "circle", paint: any) {
    if (!map.getLayer(layerId)) {
        map.addLayer({
            id: layerId,
            type,
            source: sourceId,
            paint,
        });
    }
}

export function removeLayer(map: mapboxgl.Map, layerId: string) {
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
    }
}

export function toggleLayerVisibility(map: mapboxgl.Map, layerId: string, visible: boolean) {
    if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
    }
}
