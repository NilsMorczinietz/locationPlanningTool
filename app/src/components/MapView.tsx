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
        mapboxgl.accessToken = mapboxToken

        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: [6.799617926519687, 51.223350738818], // DUS
            zoom: 11.8,
        });

        mapRef.current = map;

        // **🎯 Marker hinzufügen**
        new mapboxgl.Marker({ color: "red" }) // Marker mit roter Farbe
            .setLngLat([6.88845, 51.091183]) // Koordinaten
            .setPopup(new mapboxgl.Popup().setText("Monheim am Rhein")) // Popup beim Klicken
            .addTo(map);

        return () => map.remove();
    }, [])

    return (
        <>
            <div id="map-container" ref={mapContainerRef} />
        </>
    )
}

export default MapView
