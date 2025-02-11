export interface Location {
    id: string;
    active: boolean;
    title: string;
    identifier: string;
    number: string;
    address: string;
    coordinates: [number, number];
}

export interface MarkerData {
    marker: mapboxgl.Marker;
    location: Location;
}