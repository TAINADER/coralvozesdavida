import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { OverpassPlace } from "@/lib/api";
import { Professional } from "@workspace/api-client-react";
import { Search, MapPin, Store, User } from "lucide-react";

interface EncontreTabProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  places: OverpassPlace[];
  professionals: Professional[];
  onSelectPlace: (id: string | number) => void;
  userLocation: { lat: number; lng: number };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function EncontreTab({ searchQuery, setSearchQuery, places, professionals, onSelectPlace, userLocation }: EncontreTabProps) {
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredPlaces = places.filter(p => {
    if (!debouncedSearch) return true;
    const name = (p.tags.name || "").toLowerCase();
    const type = (p.tags.amenity || p.tags.shop || p.tags.tourism || p.tags.leisure || "").toLowerCase();
    const query = debouncedSearch.toLowerCase();
    return name.includes(query) || type.includes(query);
  });

  const filteredProfessionals = professionals.filter(p => {
    if (!debouncedSearch) return true;
    const name = p.name.toLowerCase();
    const prof = p.profession.toLowerCase();
    const detail = (p.professionDetail || "").toLowerCase();
    const query = debouncedSearch.toLowerCase();
    return name.includes(query) || prof.includes(query) || detail.includes(query);
  });

  type ListItem = {
    id: string | number;
    name: string;
    type: string;
    distance: number;
    kind: "place" | "professional";
  };

  const listItems: ListItem[] = [
    ...filteredPlaces.map(p => ({
      id: p.id,
      name: p.tags.name || "Local",
      type: p.tags.amenity || p.tags.shop || p.tags.tourism || p.tags.leisure || "Estabelecimento",
      distance: calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lon),
      kind: "place" as const
    })),
    ...filteredProfessionals.map(p => ({
      id: p.id,
      name: p.name,
      type: p.profession + (p.professionDetail ? ` - ${p.professionDetail}` : ""),
      distance: p.lat && p.lng ? calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng) : 0,
      kind: "professional" as const
    }))
  ].sort((a, b) => a.distance - b.distance);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="O que você está procurando?"
          className="pl-10 h-12 bg-background border-border shadow-sm text-base"
        />
      </div>

      <div className="flex-grow overflow-y-auto pr-2 space-y-3">
        {listItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum resultado encontrado para a busca.</p>
          </div>
        ) : (
          listItems.map(item => (
            <button
              key={`${item.kind}-${item.id}`}
              onClick={() => onSelectPlace(item.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md flex items-start gap-4 ${
                item.kind === 'professional' 
                  ? 'bg-secondary/5 hover:bg-secondary/10 border-secondary/20' 
                  : 'bg-background hover:bg-muted/50 border-border'
              }`}
            >
              <div className={`p-3 rounded-full ${item.kind === 'professional' ? 'bg-secondary/20 text-secondary-foreground' : 'bg-primary/10 text-primary'}`}>
                {item.kind === 'professional' ? <User className="w-5 h-5" /> : <Store className="w-5 h-5" />}
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-lg leading-tight text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground capitalize mt-1">{item.type}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                <MapPin className="w-3 h-3" />
                <span>
                  {item.distance < 1 ? `${Math.round(item.distance * 1000)}m` : `${item.distance.toFixed(1)}km`}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
