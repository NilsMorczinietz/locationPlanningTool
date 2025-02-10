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
import ViewControls from "./ViewControls";
import StyleControls from "./StyleControls";

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

    const markerIds = useRef(new Set<string>());
    const markerList = useRef<MarkerData[]>([]);

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

    // async function getIsochrone(lng: number, lat: number) {
    //     const profile = "driving"; // Fahrmodus
    //     const minutes = 8; //  Minuten Fahrzeit

    //     const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${lng},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxToken}`;

    //     const response = await fetch(url);
    //     if (!response.ok) return null;
    //     return await response.json();
    // }

    // async function addIsochroneLayer(lng: number, lat: number) {
    //     const map = mapRef.current;
    //     if (!map) return;

    //     const data = await getIsochrone(lng, lat);
    //     if (!data) return;

    //     const sourceId = `isochrone-${lng}-${lat}`;
    //     const layerId = `isochrone-layer-${lng}-${lat}`;

    //     // Falls Layer/Source existieren, vorher entfernen
    //     if (map.getLayer(layerId)) map.removeLayer(layerId);
    //     if (map.getSource(sourceId)) map.removeSource(sourceId);

    //     // Neue Quelle und Layer hinzufügen
    //     map.addSource(sourceId, {
    //         type: "geojson",
    //         data: data
    //     });

    //     map.addLayer({
    //         id: layerId,
    //         type: "fill",
    //         source: sourceId,
    //         layout: {},
    //         paint: {
    //             "fill-color": "#32CD32", // Grüne Farbe
    //             "fill-opacity": 0.4
    //         }
    //     });
    // }

    async function addMarker(location: Location) {
        if (!location.address) return;

        const coordinates = await fetchCoordinates(location.address, mapboxToken);
        if (!coordinates) return;
        const [lng, lat] = coordinates;

        // Neuen Marker mit Custom SVG erstellen
        const customMarker = document.createElement("div");
        createRoot(customMarker).render(<LocationMarker text={location.number} />);

        const newMarker = new mapboxgl.Marker({ element: customMarker, draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);

        const newMarkerData = { marker: newMarker, location: location };

        if (!newMarkerData) return null;

        markerIds.current.add(location.id);
        markerList.current.push(newMarkerData);

        // await addIsochroneLayer(lng, lat);

        return newMarkerData;
    }

    async function removeMarker(markerData: MarkerData) {
        markerData.marker.remove();
        markerIds.current.delete(markerData.location.id);
        markerList.current = markerList.current.filter((m) => m.location.id !== markerData.location.id);
    }

    async function updateMarkers() {
        for (const location of locations) {

            // Marker hinzufügen, wenn noch nicht vorhanden
            if (!markerIds.current.has(location.id)) {
                await addMarker(location);
                continue;
            }

            const markerData = markerList.current.find((m) => m.location.id === location.id);
            if (location == markerData?.location) continue;

            // Marker aktualisieren, wenn geändert
            if (markerData && markerData.location != location) {
                await removeMarker(markerData);
                await addMarker(location);
            }
        }
        for (const markerData of markerList.current) {

            // Marker entfernen, wenn Location nicht mehr existiert
            const locationExists = locations.some((l) => l.id === markerData.location.id);
            if (!locationExists) {
                await removeMarker(markerData);
            }
        }

    }

    function goToLocationAndNorth() {
        const lng = 6.799617926519687;
        const lat = 51.223350738818;
        const zoom = 11.8;

        if (!mapRef.current) return;

        mapRef.current.easeTo({
            center: [lng, lat],
            zoom: zoom,
            bearing: 0, // Richtung auf Norden ausrichten
            pitch: 0,   // Keine Neigung
            duration: 1000, // Sanfte Animation (1 Sekunde)
        });
    }

    function zoomIn() {
        if (!mapRef.current) return;
        mapRef.current.zoomIn();
    }

    function zoomOut() {
        if (!mapRef.current) return;
        mapRef.current.zoomOut();
    }

    return (
        <>
            <div id="map-container" ref={mapContainerRef} />
            <ViewControls onCenter={goToLocationAndNorth} onZoomIn={zoomIn} onZoomOut={zoomOut} />
            <StyleControls map={mapRef} />
        </>
    )
}