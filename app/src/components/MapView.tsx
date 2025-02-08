import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import "./MapView.css";

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
    throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

function MapView() {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        mapboxgl.accessToken = mapboxToken;

        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: [6.799617926519687, 51.223350738818], // Düsseldorf
            zoom: 11.8,
        });

        mapRef.current = map;

        map.on("load", () => {
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
        });

        return () => map.remove();
    }, []);

    return <div id="map-container" ref={mapContainerRef} />;
}

export default MapView;