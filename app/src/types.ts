export interface Location {
    id: string;
    active: boolean;
    title: string;
    identifier: string;
    number: string;
    address: string;
    coordinates: [number, number];
}

export interface LocationMetaData {
    needsIsochroneRecalculation: boolean;
}

export interface LocationRecord  {
    location: Location;
    metaData: LocationMetaData;
}

export interface MarkerData {
    marker: mapboxgl.Marker;
    locationRecord: LocationRecord;
}