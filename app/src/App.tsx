import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import "./App.css";

// Mapbox Access Token aus der .env laden
const mapboxToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
  throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

function App() {

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = mapboxToken
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [6.88845, 51.091183],
        zoom: 13,
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    }
  }, [])
  
  return (
    <>
      <div id="map-container" ref={mapContainerRef}/>
    </>
  )
}

export default App
