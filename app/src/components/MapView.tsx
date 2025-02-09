import { useRef, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchCoordinates } from "../utils/geocodeUtils";
import { addBordersLayer, initializeMap } from "../utils/mapUtils";
import LocationMarker from "./LocationMarker";
import "./MapView.css";

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
    throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

interface Location {
    id: string;
    active: boolean;
    title: string;
    identifier: string;
    number: string;
    address: string;
}

interface MarkerData {
    marker: mapboxgl.Marker;
    location: Location;
}

export default function MapView() {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const locations = useSelector((state: RootState) => state.planning.locations);

    const [markers, setMarkers] = useState<MarkerData[]>([]);
    function addMarkerData(markerData: MarkerData) {
        setMarkers((prev) => [...prev, markerData]);
    }
    function removeMarkerData(locationId: string) {
        setMarkers((prev) => prev.filter((m) => m.location.id !== locationId));
    }

    /* Karte initialisieren */
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = initializeMap(mapContainerRef.current, mapboxToken);
        mapRef.current = map;

        map.on("load", () => addBordersLayer(map));

        return () => map.remove();
    }, []);

    /* Marker aktualisieren */
    useEffect(() => {
        if (!mapRef.current) return;
        updateMarkers();
    }, [locations]);

    async function addMarker(location: Location) {
        if (!location.address) return;

        const coordinates = await fetchCoordinates(location.address, mapboxToken);
        if (!coordinates) return;
        const [lng, lat] = coordinates;

        // Neuen Marker mit Custom SVG erstellen
        const customMarker = document.createElement("div");
        createRoot(customMarker).render(<LocationMarker text={location.number} />);

        const newMarker = new mapboxgl.Marker({ element: customMarker })
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);

        addMarkerData({ marker: newMarker, location: location });
    }

    async function removeMarker(markerData: MarkerData) {
        markerData.marker.remove();
        removeMarkerData(markerData.location.id);
    }

    async function updateMarkers() {
        for (const location of locations) {

            // Marker hinzufügen, wenn noch nicht vorhanden
            const markerData = markers.find((m) => m.location.id === location.id);
            if (!markerData) {
                await addMarker(location);
            }
        }
        for (const markerData of markers) {

            // Marker entfernen, wenn Location nicht mehr existiert
            const locationExists = locations.some((l) => l.id === markerData.location.id);
            if (!locationExists) {
                await removeMarker(markerData);
            }
        }
    }

    return <div id="map-container" ref={mapContainerRef} />;
}