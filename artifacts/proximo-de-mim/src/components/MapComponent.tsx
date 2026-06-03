import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { OverpassPlace } from "@/lib/api";
import { Professional } from "@workspace/api-client-react";

// Teal for places
const placeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-teal.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Orange for professionals
const profIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Red for user location
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


function MapFlyTo({ location, selectedPlaceId, places, professionals }: { location: { lat: number; lng: number }, selectedPlaceId: string | number | null, places: OverpassPlace[], professionals: Professional[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedPlaceId) {
      const place = places.find(p => p.id === selectedPlaceId);
      if (place) {
        map.flyTo([place.lat, place.lon], 16);
        return;
      }
      const prof = professionals.find(p => p.id === selectedPlaceId);
      if (prof && prof.lat && prof.lng) {
        map.flyTo([prof.lat, prof.lng], 16);
        return;
      }
    }
    map.flyTo([location.lat, location.lng], map.getZoom());
  }, [location, selectedPlaceId, map, places, professionals]);

  return null;
}

export default function MapComponent({ location, places, professionals, selectedPlaceId }: {
  location: { lat: number, lng: number },
  places: OverpassPlace[],
  professionals: Professional[],
  selectedPlaceId: string | number | null
}) {
  return (
    <MapContainer center={[location.lat, location.lng]} zoom={14} className="w-full h-full min-h-[400px] z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFlyTo location={location} selectedPlaceId={selectedPlaceId} places={places} professionals={professionals} />
      
      <Marker position={[location.lat, location.lng]} icon={userIcon}>
        <Popup>Você está aqui</Popup>
      </Marker>

      {places.map((place) => (
        <Marker key={`place-${place.id}`} position={[place.lat, place.lon]} icon={placeIcon}>
          <Popup>
            <div className="font-sans">
              <strong className="block text-primary text-base mb-1">{place.tags.name || "Local"}</strong>
              <span className="text-sm text-muted-foreground capitalize">{place.tags.amenity || place.tags.shop || place.tags.tourism || place.tags.leisure || "Estabelecimento"}</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {professionals.map((prof) => (
        prof.lat && prof.lng ? (
          <Marker key={`prof-${prof.id}`} position={[prof.lat, prof.lng]} icon={profIcon}>
            <Popup>
              <div className="font-sans">
                <strong className="block text-secondary text-base mb-1">{prof.name}</strong>
                <span className="text-sm text-muted-foreground block">{prof.profession}</span>
                {prof.professionDetail && <span className="text-xs text-muted-foreground block">{prof.professionDetail}</span>}
                <span className="inline-block mt-2 px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs font-bold rounded">{prof.level}</span>
                {prof.linkUrl && (
                  <a href={prof.linkUrl} target="_blank" rel="noreferrer" className="block mt-2 text-primary hover:underline text-sm font-semibold">Ver link</a>
                )}
              </div>
            </Popup>
          </Marker>
        ) : null
      ))}
    </MapContainer>
  );
}
