export interface Location {
    id: string;
    active: boolean;
    title: string;
    identifier: string;
    number: string;
    address: string;
}

export interface MarkerData {
    marker: mapboxgl.Marker;
    location: Location;
}