import { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchAddress } from "../utils/geocodeUtils";
import { addBordersLayer, initializeMap } from "../utils/mapUtils";
import LocationMarker from "./LocationMarker";
import "./MapView.css";
import ViewControls from "./ViewControls";
import StyleControls from "./StyleControls";
import { MarkerData, Location } from "../types";
import { updateLocation } from "../redux/slices/mapSlice";
import tgm from "@targomo/core";
import { TargomoClient, TravelType } from "@targomo/core";

const targomoApiKey = import.meta.env.VITE_APP_TARGOMO_API_KEY;

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
    throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

export default function MapView() {
    const dispatch = useDispatch();

    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const locations = useSelector((state: RootState) => state.map.locations);

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

    async function getTargomoIsochrone(coordinatesList: any) {
        const client = new TargomoClient("westcentraleurope", targomoApiKey);
        const sources = coordinatesList;

        const options = {
            travelType: 'car' as TravelType,
            travelEdgeWeights: [60 * 8],
            srid: 4326,
            buffer: 0.0005,
            serializer: "geojson" as "geojson",
            maxEdgeWeight: 1800,
            useClientCache: true,
            simplify: 200,
            strokeWidth: 1,
            // intersectionMode: 'union' as any, 
            roadNetworkWeightRules: { 
                trafficLights: 10,   // Erhöhe Gewichtung, um Unterschied zu sehen
                stopSigns: 10,       // Erhöhe Gewichtung für Stoppschilder
                turnRestrictions: 10, // Erhöhe Gewichtung für Abbiegeregeln
            },
        };

        console.log("Targomo API Key:", targomoApiKey);
        console.log("Targomo Client:", client);
        console.log("Targomo Options:", options);
        console.log("Targomo Sources:", sources);

        const result = await client.polygons.fetch(sources, options);
        console.log(result);

        return result
    }

    async function addTargomoLayer(coordinatesList:any) {
        const map = mapRef.current;
        if (!map || coordinatesList.length === 0) return;

        const data = await getTargomoIsochrone(coordinatesList);
        if (!data) return;

        const sourceId = "targomo-isochrone-layer";
        const layerId = "targomo-layer";

        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);

        map.addSource(sourceId, {
            type: "geojson",
            data: data,
        });

        map.addLayer({
            id: layerId,
            type: "fill",
            source: sourceId,
            layout: {},
            paint: {
                "fill-color": "#008000",  // Grün
                "fill-opacity": 0.2,
            },
        });
    }

    async function highlightCoveredRoads() {
        const map = mapRef.current;
        if (!map) return;
    
        const roadLayerId = "highlighted-roads";
        const roadSourceId = "road-source";
    
        // Falls der Layer bereits existiert, lösche ihn zuerst
        if (map.getLayer(roadLayerId)) map.removeLayer(roadLayerId);
        if (map.getSource(roadSourceId)) map.removeSource(roadSourceId);
    
        // Verwende Mapbox's Standard-Straßendaten (Falls sie nicht existieren, muss man ggf. eine andere Quelle wählen)
        map.addSource(roadSourceId, {
            type: "vector",
            url: "mapbox://mapbox.mapbox-streets-v8" // Standard Mapbox Straßenlayer
        });
    
        map.addLayer({
            id: roadLayerId,
            type: "line",
            source: roadSourceId,
            "source-layer": "road",
            paint: {
                "line-color": "#ffffff",  // Weiße Linien
                "line-width": 1.0,        // Dickere Linien für bessere Sichtbarkeit
                "line-opacity": 1         // Vollständig sichtbar
            }
        });
    }
    


    async function addMarker(location: Location) {
        if (!location.coordinates) return;

        const [lng, lat] = location.coordinates;

        // Neuen Marker mit Custom SVG erstellen
        const customMarker = document.createElement("div");
        createRoot(customMarker).render(<LocationMarker text={location.number} />);

        const newMarker = new mapboxgl.Marker({ element: customMarker, draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);

        // newMarker.on("dragstart", () => {
        //     console.log(`Marker für ${location.title} (${location.id}) wird bewegt.`);
        // });

        // newMarker.on("drag", () => {
        //     const { lng, lat } = newMarker.getLngLat();
        //     console.log(`Marker Position: Lng: ${lng}, Lat: ${lat}`);
        // });

        newMarker.on("dragend", async () => {
            const { lng, lat } = newMarker.getLngLat();
            const newAddress = await fetchAddress(lng, lat, mapboxToken);

            const newLocation: Location = { ...location, coordinates: [lng, lat], address: newAddress };
            dispatch(updateLocation(newLocation));
        });

        const newMarkerData = { marker: newMarker, location: location };

        if (!newMarkerData) return null;

        markerIds.current.add(location.id);
        markerList.current.push(newMarkerData);

        // await addIsochroneLayer(lng, lat);
        // await addTargomoLayer(lng, lat);

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
                if (!location.active) continue; // Marker nur hinzufügen, wenn Location aktiv

                await addMarker(location);
                continue;
            }

            const markerData = markerList.current.find((m) => m.location.id === location.id);
            if (location == markerData?.location) continue;

            if (!markerData) continue;

            // Marker entfernen, wenn Location inaktiv
            if (location.active == false) {
                await removeMarker(markerData);
                continue;
            }

            // Marker aktualisieren, wenn geändert
            if (markerData.location != location) {
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
        const coordinatesList = [];
        for (const markerData of markerList.current) {


            if (markerData.location.active == false) continue;
            const [lng, lat] = markerData.location.coordinates;
            const id = markerData.location.id;
            const data = {
                id: id,
                lng: lng,
                lat: lat,
            }
            coordinatesList.push(data);
            console.log(coordinatesList);
            await getTargomoIsochrone(coordinatesList);
        }
        // Falls Koordinaten vorhanden sind, rufe die Targomo-API auf
        if (coordinatesList.length > 0) {
            console.log("Koordinatenliste für Targomo API:", coordinatesList);
            await addTargomoLayer(coordinatesList);
            // await highlightCoveredRoads();
            // addBordersLayer(mapRef.current!);
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