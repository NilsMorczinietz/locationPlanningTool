import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import LocationMarker from "./LocationMarker";
import { createRoot } from "react-dom/client"; // Für React 18+

import "./MapView.css";

import { LocationsState } from "../redux/reducers/locationsReducer";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
    throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

function MapView() {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [markers, setMarkers] = useState<Map<string, mapboxgl.Marker>>(new Map());

    const locations = useSelector((state: RootState) => state.planning as LocationsState).locations;

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

    // 📍 Marker für Locations setzen oder aktualisieren
    useEffect(() => {
        if (!mapRef.current) return;

        async function updateMarkers() {
            const updatedMarkers = new Map(markers);

            for (const location of locations) {
                if (!location.address) continue;

                const address = location.address + ", Düsseldorf Germany";
                const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;

                try {
                    const response = await fetch(geocodeUrl);
                    const data = await response.json();

                    if (data.features.length > 0) {
                        const [lng, lat] = data.features[0].center;
                        console.log(`Geocode für ${address}:`, lng, lat);

                        if (updatedMarkers.has(location.id)) {
                            // Falls der Marker schon existiert, verschiebe ihn
                            updatedMarkers.get(location.id)!.setLngLat([lng, lat]);
                        } else {
                            // Neuen Marker mit Custom SVG erstellen
                            const customMarker = document.createElement("div");
                            createRoot(customMarker).render(<LocationMarker text={location.number} />);

                            // Marker zur Karte hinzufügen
                            const newMarker = new mapboxgl.Marker({ element: customMarker })
                                .setLngLat([lng, lat])
                                .addTo(mapRef.current!);

                            updatedMarkers.set(location.id, newMarker);
                        }
                    } else {
                        console.error(`Keine Koordinaten für ${location.address} gefunden.`);
                    }
                } catch (error) {
                    console.error(`Fehler beim Abrufen der Geodaten für ${location.address}:`, error);
                }
            }

            // Entferne Marker, die nicht mehr in `locations` existieren
            markers.forEach((marker, id) => {
                if (!locations.find(loc => loc.id === id)) {
                    marker.remove();
                    updatedMarkers.delete(id);
                }
            });

            setMarkers(updatedMarkers);
        }

        updateMarkers();
    }, [locations]); // 🚀 Reagiert auf Änderungen in locations

    return <div id="map-container" ref={mapContainerRef} />;
}

export default MapView;