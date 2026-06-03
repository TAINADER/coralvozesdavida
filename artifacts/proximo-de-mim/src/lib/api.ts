export interface OverpassPlace {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    shop?: string;
    tourism?: string;
    leisure?: string;
    [key: string]: string | undefined;
  };
}

export async function getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
  } catch (err) {
    console.error("Geocoding error:", err);
  }
  return null;
}

export async function getNearbyPlaces(lat: number, lng: number): Promise<OverpassPlace[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"](around:1000,${lat},${lng});
      node["shop"](around:1000,${lat},${lng});
      node["tourism"](around:1000,${lat},${lng});
      node["leisure"](around:1000,${lat},${lng});
    );
    out body;
  `;
  
  try {
    const res = await fetch(`https://overpass-api.de/api/interpreter`, {
      method: "POST",
      body: query
    });
    const data = await res.json();
    return data.elements || [];
  } catch (err) {
    console.error("Overpass error:", err);
    return [];
  }
}
