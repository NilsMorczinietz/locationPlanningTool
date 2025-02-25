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
import { MarkerData, LocationRecord } from "../types";
import { setIsochrones, toggleIsochronesValid, updateLocation } from "../redux/slices/mapSlice";
import { TargomoClient, TravelType } from "@targomo/core";
import { IsochroneState } from "../screens/Planning";

const targomoApiKey = import.meta.env.VITE_APP_TARGOMO_API_KEY;

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
    throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

export default function MapView({ isochroneRefresh, setIsochroneRefresh}: { isochroneRefresh: IsochroneState, setIsochroneRefresh: (value : IsochroneState) => void}) {
    const dispatch = useDispatch();

    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const locations: LocationRecord[] = useSelector((state: RootState) => state.map.locations);
    const settings = useSelector((state: RootState) => state.settings);

    const markerIds = useRef(new Set<string>());
    const markerList = useRef<MarkerData[]>([]);

    const isFirstRender = useRef(true);
    useEffect(() => {
        const fetchData = async () => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            if( isochroneRefresh === "neutral") return;

            await addTargomoLayer();

            dispatch(toggleIsochronesValid(true));
            locations.forEach((location) => {
                dispatch(updateLocation({
                    ...location,
                    metaData: { ...location.metaData, needsIsochroneRecalculation: false }
                }));
            });
            setIsochroneRefresh("neutral");
        };

        fetchData();
    }, [isochroneRefresh]);


    /* Karte initialisieren */
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = initializeMap(mapContainerRef.current, mapboxToken);
        mapRef.current = map;

        map.on("load", () => addBordersLayer(map));

        dispatch(toggleIsochronesValid(false));

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

    async function addMarker(locationRecord: LocationRecord) {
        if (!locationRecord.location.coordinates) return;

        const [lng, lat] = locationRecord.location.coordinates;

        // Neuen Marker mit Custom SVG erstellen
        const customMarker = document.createElement("div");
        createRoot(customMarker).render(<LocationMarker text={locationRecord.location.number} />);

        const newMarker = new mapboxgl.Marker({ element: customMarker, draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);

        newMarker.on("dragend", async () => {
            const { lng, lat } = newMarker.getLngLat();
            const newAddress = await fetchAddress(lng, lat, mapboxToken);

            const newLocation: LocationRecord = {
                ...locationRecord,
                location: {
                    ...locationRecord.location,
                    coordinates: [lng, lat],
                    address: newAddress,
                },
                metaData: {
                    ...locationRecord.metaData,
                    needsIsochroneRecalculation: true,
                },
            };

            dispatch(updateLocation(newLocation));
        });

        const newMarkerData = {
            marker: newMarker,
            locationRecord: locationRecord
        };

        if (!newMarkerData) return null;

        markerIds.current.add(locationRecord.location.id);
        markerList.current.push(newMarkerData);

        return newMarkerData;
    }

    async function removeMarker(markerData: MarkerData) {
        markerData.marker.remove();
        markerIds.current.delete(markerData.locationRecord.location.id);
        markerList.current = markerList.current.filter((m) => m.locationRecord.location.id !== markerData.locationRecord.location.id);
    }

    async function updateMarkers() {
        for (const locationRecord of locations) {

            // Marker hinzufügen, wenn noch nicht vorhanden
            if (!markerIds.current.has(locationRecord.location.id)) {
                if (!locationRecord.location.active) continue; // Marker nur hinzufügen, wenn Location aktiv

                await addMarker(locationRecord);
                continue;
            }

            // Suche Marker aus Liste zur aktuellen Location
            const markerData = markerList.current.find((m) => m.locationRecord.location.id === locationRecord.location.id);
            if (!markerData) continue;
            if (locationRecord.location == markerData?.locationRecord.location) continue;

            // Marker entfernen, wenn Location inaktiv
            if (locationRecord.location.active == false) {
                await removeMarker(markerData);
                continue;
            }

            // Marker aktualisieren, wenn sich Koordinaten geändert haben geändert
            if (markerData.locationRecord.location.coordinates != locationRecord.location.coordinates) {
                await removeMarker(markerData);
                await addMarker(locationRecord);
            }
        }
        for (const markerData of markerList.current) {

            // Marker entfernen, wenn Location nicht mehr existiert
            const locationExists = locations.some((locEntry) => locEntry.location.id === markerData.locationRecord.location.id);
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
            buffer: 0.0003, // 300 Meter
            serializer: "geojson" as "geojson",
            useClientCache: true,
            simplify: 2,
            intersectionMode: 'union' as any
        };

        const result = await client.polygons.fetch(sources, options);

        return result
    }

    async function addTargomoLayer() {
        const coordinatesList = [];
        for (const markerData of markerList.current) {


            if (markerData.locationRecord.location.active == false) continue;
            const [lng, lat] = markerData.locationRecord.location.coordinates;
            const id = markerData.locationRecord.location.id;
            const data = {
                id: id,
                lng: lng,
                lat: lat,
                "tm": {
                    "car": {
                        rushHour: false,
                        trafficSignalPenalty: 1,
                        trafficLeftTurnPenalty: 2,
                        trafficRightTurnPenalty: 1,
                    }
                }
            }
            coordinatesList.push(data);
        }

        const map = mapRef.current;
        if (!map || coordinatesList.length === 0) return;

        const data = await getTargomoIsochrone(coordinatesList);
        dispatch(setIsochrones(data));
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