export async function fetchCoordinates(address: string, mapboxToken: string) {
    address = address + ", Düsseldorf Germany";
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    return data.features.length > 0 ? data.features[0].center : null;
}