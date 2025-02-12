export async function fetchCoordinates(address: string, mapboxToken: string) {
    address = address + ", Düsseldorf Germany";
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    return data.features.length > 0 ? data.features[0].center : null;
}

export async function fetchAddress(lng: number, lat: number, accessToken: string) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&types=address`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fehler beim Abrufen der Adresse");

        const data = await response.json();
        if (data.features.length === 0) return "Keine Adresse gefunden";

        const address = data.features[0];
        const addressParts = address.place_name.split(","); // Adresse in Teile zerlegen
        const streetAndNumber = addressParts[0]; // Erstes Element ist meistens Straße + Hausnummer

        return streetAndNumber;
    } catch (error) {
        console.error("Reverse Geocoding Fehler:", error);
        return "Fehler beim Abrufen der Adresse";
    }
}