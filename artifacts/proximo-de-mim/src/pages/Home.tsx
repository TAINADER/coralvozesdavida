import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MapComponent from "@/components/MapComponent";
import EncontreTab from "@/components/EncontreTab";
import VoceTab from "@/components/VoceTab";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin } from "lucide-react";
import { getCoordinates, getNearbyPlaces, OverpassPlace } from "@/lib/api";
import { useListProfessionals, getListProfessionalsQueryKey } from "@workspace/api-client-react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: -23.5505,
    lng: -46.6333,
  }); // Default SP
  
  const [activeTab, setActiveTab] = useState("encontre");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | number | null>(null);

  const { data: overpassPlaces = [], isLoading: isLoadingPlaces } = useQuery({
    queryKey: ["overpass", location.lat, location.lng],
    queryFn: () => getNearbyPlaces(location.lat, location.lng),
    enabled: !!location,
  });

  const { data: professionals = [], isLoading: isLoadingProfessionals } = useListProfessionals(
    { lat: location.lat, lng: location.lng, radiusKm: 1 },
    { query: { queryKey: getListProfessionalsQueryKey({ lat: location.lat, lng: location.lng, radiusKm: 1 }) } }
  );

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    try {
      const coords = await getCoordinates(address);
      if (coords) {
        setLocation(coords);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <header className="bg-primary text-primary-foreground p-6 shadow-md z-10 relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">PRÓXIMO DE MIM</h1>
          <form onSubmit={handleAddressSubmit} className="relative group">
            <label htmlFor="address-input" className="block text-sm font-semibold mb-2 opacity-90">
              ONDE VOCÊ ESTÁ?
            </label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="address-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Digite seu endereço ou bairro..."
                  className="pl-10 bg-white text-black border-none focus-visible:ring-2 focus-visible:ring-accent shadow-sm"
                />
              </div>
              <Button type="submit" variant="secondary" className="font-bold">
                Buscar
              </Button>
            </div>
          </form>
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row w-full max-w-7xl mx-auto bg-card shadow-xl overflow-hidden md:my-6 md:rounded-2xl">
        <div className="w-full md:w-1/2 h-[400px] md:h-auto min-h-[400px] relative border-b md:border-b-0 md:border-r border-border">
          <MapComponent
            location={location}
            places={overpassPlaces}
            professionals={professionals}
            selectedPlaceId={selectedPlaceId}
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col h-full bg-sidebar">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1">
              <TabsTrigger value="encontre" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm">ENCONTRE</TabsTrigger>
              <TabsTrigger value="voce" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm">VOCÊ</TabsTrigger>
            </TabsList>
            
            <div className="flex-grow overflow-y-auto p-4 md:p-6">
              <TabsContent value="encontre" className="m-0 h-full">
                <EncontreTab 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  places={overpassPlaces}
                  professionals={professionals}
                  onSelectPlace={(id) => setSelectedPlaceId(id)}
                  userLocation={location}
                />
              </TabsContent>
              <TabsContent value="voce" className="m-0 h-full">
                <VoceTab userLocation={location} onAdded={() => {}} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
