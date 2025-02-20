import { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchAddress } from "../utils/geocodeUtils";
import { addBordersLayer, initializeMap, toggleLayerVisibility } from "../utils/mapUtils";
import LocationMarker from "./LocationMarker";
import "./MapView.css";
import ViewControls from "./ViewControls";
import StyleControls from "./StyleControls";
import { MarkerData, Location } from "../types";
import { toggleIsochronesValid, updateLocation } from "../redux/slices/mapSlice";
import tgm from "@targomo/core";
import { TargomoClient, TravelType } from "@targomo/core";

const targomoApiKey = import.meta.env.VITE_APP_TARGOMO_API_KEY;

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
    throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

export default function MapView({ isochroneRefresh }: { isochroneRefresh: boolean }) {
    const dispatch = useDispatch();

    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const locations = useSelector((state: RootState) => state.map.locations);
    const settings = useSelector((state: RootState) => state.settings);

    const markerIds = useRef(new Set<string>());
    const markerList = useRef<MarkerData[]>([]);

    useEffect(() => {
        console.log("Isochrone refresh");

        addTargomoLayer();

        dispatch(toggleIsochronesValid(true));
        locations.forEach((location) => {
            dispatch(updateLocation({
                ...location,
                modifiedFields: { ...location.modifiedFields, coordinates: false }
            }));
        });
    }, [isochroneRefresh]);

    /* Karte initialisieren */
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = initializeMap(mapContainerRef.current, mapboxToken);
        mapRef.current = map;

        map.on("load", () => addBordersLayer(map));

        return () => map.remove();
    }, []);

    useEffect(() => {
        const showDistricts = settings.showDistricts;
        const showIsochrones = settings.showIsochrones;
        toggleLayerVisibility(mapRef.current!, "duesseldorf-borders-layer", showDistricts);
    }, [settings]);

    /* Marker aktualisieren */
    useEffect(() => {
        if (!mapRef.current) return;
        updateMarkers();
    }, [locations]);

    async function addMarker(location: Location) {
        if (!location.coordinates) return;

        const [lng, lat] = location.coordinates;

        // Neuen Marker mit Custom SVG erstellen
        const customMarker = document.createElement("div");
        createRoot(customMarker).render(<LocationMarker text={location.number} />);

        const newMarker = new mapboxgl.Marker({ element: customMarker, draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);

        newMarker.on("dragend", async () => {
            const { lng, lat } = newMarker.getLngLat();
            const newAddress = await fetchAddress(lng, lat, mapboxToken);

            const newLocation: Location = {
                ...location,
                coordinates: [lng, lat],
                address: newAddress,
                modifiedFields: {
                    ...location.modifiedFields,
                    coordinates: true,
                },
            };
            dispatch(updateLocation(newLocation));
        });

        const newMarkerData = { marker: newMarker, location: location };

        if (!newMarkerData) return null;

        markerIds.current.add(location.id);
        markerList.current.push(newMarkerData);

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

    async function addTargomoLayer() {
        const coordinatesList = [];
        for (const markerData of markerList.current) {


            if (markerData.location.active == false) continue;
            const [lng, lat] = markerData.location.coordinates;
            const id = markerData.location.id;
            const data = {
                id: id,
                lng: lng,
                lat: lat,
                "tm": {
                    "car": {
                        rushHour: false,
                        trafficSignalPenalty: 0,
                        trafficLeftTurnPenalty: 0,
                        trafficRightTurnPenalty: 0,
                    }
                }
            }
            coordinatesList.push(data);
            console.log(coordinatesList);
            await getTargomoIsochrone(coordinatesList);
        }

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

    return (
        <>
            <div id="map-container" ref={mapContainerRef} />
            <ViewControls onCenter={goToLocationAndNorth} onZoomIn={zoomIn} onZoomOut={zoomOut} />
            <StyleControls map={mapRef} />
        </>
    )
}