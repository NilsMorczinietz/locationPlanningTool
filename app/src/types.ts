export interface Location {
    id: string;
    active: boolean;
    title: string;
    identifier: string;
    number: string;
    address: string;
    coordinates: [number, number];
    modifiedFields: {
        coordinates: boolean;
    }
}

export interface MarkerData {
    marker: mapboxgl.Marker;
    location: Location;
}