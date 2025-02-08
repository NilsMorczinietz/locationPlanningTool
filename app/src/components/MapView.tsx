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

        // Düsseldorf Marker hinzufügen (verschiebbar)
        // const marker = new mapboxgl.Marker({ draggable: true })
        //     .setLngLat([6.799617926519687, 51.223350738818]) // Startposition
        //     .addTo(map);

        // // Event-Listener für das Verschieben des Markers
        // marker.on("dragend", () => {
        //     const newLngLat = marker.getLngLat();
        //     console.log("Neue Position:", newLngLat.lng, newLngLat.lat);
        // });

        // 1️⃣ Custom SVG als HTML-Element erstellen
        const customMarker = document.createElement("div");
        customMarker.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="5" fill="white"/>
            </svg>
        `;
        customMarker.style.width = "40px";
        customMarker.style.height = "40px";
        customMarker.style.cursor = "pointer";

        // 2️⃣ Marker mit dem Custom SVG setzen
        const marker = new mapboxgl.Marker({
            element: customMarker, // Hier das Custom SVG als Element setzen
            draggable: true, // Marker soll verschiebbar sein
        })
            .setLngLat([6.799617926519687, 51.223350738818]) // Startposition
            .addTo(map);

        // 3️⃣ Event-Listener für das Verschieben des Markers
        marker.on("dragend", () => {
            const newLngLat = marker.getLngLat();
            console.log("Neue Position:", newLngLat.lng, newLngLat.lat);
        });

        return () => map.remove();
    }, []);

    return <div id="map-container" ref={mapContainerRef} />;
}

export default MapView;