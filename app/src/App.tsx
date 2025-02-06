import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import "./App.css";

const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
if (!mapboxToken) {
  throw new Error("Mapbox Access Token fehlt. Setze ihn in der .env Datei.");
}

mapboxgl.accessToken = mapboxToken;

function App() {

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
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
