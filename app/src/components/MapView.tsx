import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import LocationMarker from "./LocationMarker";
import { createRoot } from "react-dom/client"; // Für React 18+

import "./MapView.css";

import { LocationsState } from "../redux/reducers/locationsReducer";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchCoordinates } from "../utils/geocodeUtils";
import { addBordersLayer, initializeMap } from "../utils/mapUtils";

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
    throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

function MapView() {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const locations = useSelector((state: RootState) => state.planning as LocationsState).locations;

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = initializeMap(mapContainerRef.current, mapboxToken);
        mapRef.current = map;

        map.on("load", () => addBordersLayer(map));

        return () => map.remove();
    }, []);

    // 📍 Marker für Locations setzen oder aktualisieren
    useEffect(() => {
        if (!mapRef.current) return;

        async function updateMarkers() {
            for (const location of locations) {
                if (!location.address) continue;

                const coordinates = await fetchCoordinates(location.address, mapboxToken);
                if (!coordinates) continue;


                const [lng, lat] = coordinates;

                // Neuen Marker mit Custom SVG erstellen
                const customMarker = document.createElement("div");
                createRoot(customMarker).render(<LocationMarker text={location.number} />);

                // Marker zur Karte hinzufügen
                const newMarker = new mapboxgl.Marker({ element: customMarker })
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current!);


            }
        }

        updateMarkers();
    }, [locations]); // 🚀 Reagiert auf Änderungen in locations

    return <div id="map-container" ref={mapContainerRef} />;
}

export default MapView;