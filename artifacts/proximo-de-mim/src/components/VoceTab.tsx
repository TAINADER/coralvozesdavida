import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProfessional } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListProfessionalsQueryKey } from "@workspace/api-client-react";
import { ProfessionalInputLevel } from "@workspace/api-client-react";
import { MapPin, Loader2, X, LocateFixed, Check } from "lucide-react";
import { getCoordinates, getAddressFromCoords, searchAddressSuggestions, AddressSuggestion } from "@/lib/api";

const professions = [
  // Música & Artes
  "Acordeonista", "Ator", "Atriz", "Bailarina", "Bailarino", "Baixista", "Baterista",
  "Cantor", "Cantor lírico", "Cantor de MPB", "Cantor de samba", "Cantor de forró", "Cantor de gospel",
  "Cantor de pagode", "Cantor de funk", "Cantor de rock", "Cantor de sertanejo",
  "Cavaquinhista", "Celista", "Clarinetista", "Contrabaixista", "Compositor",
  "Dançarino", "DJ", "Dublador", "Flautista", "Fotógrafo", "Guitarrista",
  "Instrumentista", "Maestro", "Músico", "Percussionista", "Pianista",
  "Produtor musical", "Saxofonista", "Sonoplasta", "Trombonista", "Trompetista",
  "Vídeo maker", "Violinista", "Violoncelista", "Violonista",

  // Saúde & Bem-estar
  "Acupunturista", "Assistente social", "Auxiliar de enfermagem", "Biomédico",
  "Cirurgião dentista", "Dentista", "Dermatologista", "Enfermeira", "Enfermeiro",
  "Esteticista", "Farmacêutico", "Fisioterapeuta", "Fonoaudiólogo",
  "Massoterapeuta", "Massagista", "Médico", "Médico clínico geral",
  "Nutricionista", "Oftalmologista", "Ortopedista", "Pediatra",
  "Personal trainer", "Psicólogo", "Psicopedagogo", "Psiquiatra",
  "Quiroprata", "Terapeuta ABA", "Terapeuta holístico", "Terapeuta ocupacional",
  "Veterinário",

  // Educação
  "Professor", "Professor de artes", "Professor de canto", "Professor de dança",
  "Professor de educação física", "Professor de idiomas", "Professor de informática",
  "Professor de instrumentos musicais", "Professor de matemática", "Professor de música",
  "Professor de yoga", "Tutor", "Pedagogo",

  // Tecnologia
  "Analista de dados", "Analista de sistemas", "Consultor de TI",
  "Conserto de computador", "Conserto de celular", "Conserto de eletrônicos",
  "Designer gráfico", "Designer de interiores", "Designer UX/UI",
  "Desenvolvedor de software", "Desenvolvedor web", "Especialista em redes",
  "Instalação de câmeras", "Suporte técnico", "Técnico de informática",

  // Casa & Reforma
  "Azulejista", "Bombeiro hidráulico", "Carpinteiro", "Eletricista",
  "Encanador", "Faxineira", "Gesseiro", "Instalação de ar-condicionado",
  "Instalação de energia solar", "Jardineiro", "Limpeza pós-obra",
  "Marceneiro", "Pedreiro", "Pequenos reparos domésticos", "Pintor",
  "Piscineiro", "Serralheiro", "Vidraceiro",

  // Beleza
  "Barbeiro", "Cabeleireiro", "Depiladora", "Esteticista facial",
  "Manicure", "Maquiadora", "Micropigmentador", "Pedicure", "Sobrancelhista",

  // Alimentação
  "Barista", "Bartender", "Chef de cozinha", "Confeiteiro",
  "Cozinheira de brigadeiro", "Cozinheira de congelados", "Cozinheira de marmita",
  "Cozinheira de pãozinho", "Cozinheiro", "Doceira", "Boleira", "Padeiro", "Sushiman",

  // Serviços & Outros
  "Advogado", "Arquiteto", "Assistente virtual", "Baby sitter",
  "Chaveiro", "Contador", "Corretor de imóveis", "Costureira",
  "Cuidador de idosos", "Datilógrafo", "Decorador", "Detetive particular",
  "Digitador", "Editor de vídeo", "Escritor", "Fotógrafo de eventos",
  "Guia turístico", "Mecânico", "Motoboy", "Músico para eventos",
  "Nutricionista esportiva", "Passeador de cachorro", "Piloto de drone",
  "Redator", "Revisor ortográfico", "Segurança", "Tatuador",
  "Tradutor", "Vigilante",
].sort((a, b) => a.localeCompare(b, "pt-BR"));

const subjects = [
  "Alemão", "Árabe", "Arte plástica", "Banca", "Canto", "Ciências", "Crochê", "Educação física", 
  "Espanhol", "Filosofia", "Física", "Francês", "História", "Inglês", "Instrumento musical", 
  "Japonês", "Mandarim", "Matemática", "Musculação", "Música", "Português", "Química", "Tricô", "Outro"
];

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  address: z.string().min(5, "Endereço é obrigatório"),
  phone: z.string().optional(),
  photoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  linkUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  skills: z.array(z.string()).min(1, "Adicione pelo menos uma habilidade"),
  professionDetail: z.string().optional(),
  lessonType: z.string().optional(),
  level: z.enum(["amador", "profissional"]),
});


function SkillsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = professions.filter(
    p => p.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(p)
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const add = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInputValue("");
    setOpen(false);
  };

  const remove = (skill: string) => onChange(value.filter(s => s !== skill));

  return (
    <div ref={containerRef} className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(s => (
            <span key={s} className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
              {s}
              <button type="button" onClick={() => remove(s)} className="hover:opacity-70 transition-opacity ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Input
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); setOpen(e.target.value.trim().length > 0); }}
          onKeyDown={e => {
            if (e.key === "Enter" && inputValue.trim()) { e.preventDefault(); add(inputValue); }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={value.length === 0 ? "Digite uma habilidade e pressione Enter..." : "Adicionar mais..."}
          className="bg-background"
          autoComplete="off"
        />
        {open && filtered.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {filtered.slice(0, 8).map(p => (
              <button
                key={p}
                type="button"
                onMouseDown={e => { e.preventDefault(); add(p); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 transition-colors"
              >
                {p}
              </button>
            ))}
            {inputValue.trim() && !professions.some(p => p.toLowerCase() === inputValue.toLowerCase()) && (
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); add(inputValue.trim()); }}
                className="w-full text-left px-4 py-2.5 text-sm border-t border-border text-primary font-semibold hover:bg-primary/10 transition-colors"
              >
                + Adicionar "<strong>{inputValue.trim()}</strong>"
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AddressAutocomplete({
  value,
  onChange,
  onSelectCoords,
  onGps,
  locating,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelectCoords: (coords: { lat: number; lng: number }) => void;
  onGps: () => void;
  locating: boolean;
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (v: string) => {
    onChange(v);
    setConfirmed(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.trim().length < 4) { setSuggestions([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await searchAddressSuggestions(v);
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    }, 500);
  };

  const handleSelect = (s: AddressSuggestion) => {
    onChange(s.displayName);
    onSelectCoords({ lat: s.lat, lng: s.lng });
    setSuggestions([]);
    setOpen(false);
    setConfirmed(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Rua, número, bairro, cidade — ou CEP"
            className={`bg-background pr-8 ${confirmed ? "border-green-500 ring-1 ring-green-400" : ""}`}
            autoComplete="off"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              : confirmed
              ? <Check className="w-4 h-4 text-green-600" />
              : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onGps}
          disabled={locating}
          title="Usar minha localização"
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-xl overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={e => { e.preventDefault(); handleSelect(s); }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-colors flex items-start gap-2 border-b border-border/50 last:border-0"
            >
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{s.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VoceTab({ userLocation, onAdded }: { userLocation: { lat: number; lng: number }, onAdded: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createProfessional = useCreateProfessional();
  
  const [geocoding, setGeocoding] = useState(false);
  const [locating, setLocating] = useState(false);
  const [preCoords, setPreCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const addr = await getAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
        if (addr) {
          form.setValue("address", addr, { shouldValidate: true });
          setPreCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
        setLocating(false);
      },
      () => {
        toast({ variant: "destructive", title: "GPS indisponível", description: "Permita o acesso à localização ou digite o endereço manualmente." });
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      photoUrl: "",
      linkUrl: "",
      skills: [],
      professionDetail: "",
      lessonType: "",
      level: "profissional",
    },
  });

  const selectedSkills = form.watch("skills") ?? [];
  const isProfessor = selectedSkills.some(s => s.toLowerCase().startsWith("professor"));
  const isMusico = selectedSkills.some(s => ["músico", "musico", "cantor", "guitarrista", "violonista", "baixista", "baterista", "pianista", "saxofonista", "instrumentista"].some(k => s.toLowerCase().includes(k)));
  const isMedico = selectedSkills.some(s => s.toLowerCase() === "médico" || s.toLowerCase() === "medico");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    let coords = preCoords;
    if (!coords) {
      setGeocoding(true);
      coords = await getCoordinates(data.address);
      setGeocoding(false);
    }

    if (!coords) {
      toast({
        variant: "destructive",
        title: "Endereço não encontrado",
        description: "Selecione uma das sugestões que aparecem ao digitar, ou tente um endereço mais completo.",
      });
      return;
    }

    createProfessional.mutate({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone || undefined,
        photoUrl: data.photoUrl || undefined,
        linkUrl: data.linkUrl || undefined,
        profession: data.skills[0] ?? "",
        skills: data.skills,
        professionDetail: data.professionDetail || undefined,
        lessonType: data.lessonType || undefined,
        level: data.level as ProfessionalInputLevel,
        lat: coords.lat,
        lng: coords.lng,
      } as any
    }, {
      onSuccess: () => {
        toast({
          title: "Cadastro realizado!",
          description: "Você agora aparece no mapa para pessoas próximas.",
        });
        queryClient.invalidateQueries({ queryKey: getListProfessionalsQueryKey() });
        form.reset();
        onAdded();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Erro ao cadastrar",
          description: "Tente novamente mais tarde.",
        });
      }
    });
  };

  return (
    <div className="h-full overflow-y-auto pr-2 pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Junte-se à vizinhança</h2>
        <p className="text-muted-foreground text-sm">Cadastre-se para que as pessoas perto de você possam encontrar seus serviços.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" className="bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  Endereço
                </FormLabel>
                <p className="text-xs text-muted-foreground -mt-1">
                  Digite rua, bairro ou CEP e selecione uma das sugestões.
                </p>
                <FormControl>
                  <AddressAutocomplete
                    value={field.value}
                    onChange={v => { field.onChange(v); setPreCoords(null); }}
                    onSelectCoords={coords => { setPreCoords(coords); }}
                    onGps={handleUseMyLocation}
                    locating={locating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Telefone / WhatsApp <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" className="bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="photoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Foto (URL) <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="Link para sua foto" className="bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Link profissional</FormLabel>
                <FormControl>
                  <Input placeholder="Instagram, LinkedIn, site (opcional)" className="bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Suas habilidades</FormLabel>
                <p className="text-xs text-muted-foreground -mt-1">Adicione quantas quiser — ajuda as pessoas a te encontrarem!</p>
                <FormControl>
                  <SkillsInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isProfessor && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-xl border">
              <FormField
                control={form.control}
                name="lessonType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Tipo de aula</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Aula avulsa">Aula avulsa</SelectItem>
                        <SelectItem value="Aula periódica">Aula periódica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="professionDetail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Matéria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecione a matéria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {isMusico && (
            <FormField
              control={form.control}
              name="professionDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Qual modalidade?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Violão, Canto, Banda..." className="bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isMedico && (
            <FormField
              control={form.control}
              name="professionDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Qual especialidade?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pediatria, Cardiologia..." className="bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="pt-2">
                <FormLabel className="font-bold block mb-3">Nível</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => field.onChange("amador")}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                        field.value === "amador" 
                          ? "border-primary bg-primary text-primary-foreground shadow-md" 
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Amador
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("profissional")}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                        field.value === "profissional" 
                          ? "border-primary bg-primary text-primary-foreground shadow-md" 
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Profissional
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold mt-6 shadow-lg hover:shadow-xl transition-all" 
            disabled={geocoding || createProfessional.isPending}
          >
            {geocoding ? (
              <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Localizando endereço...</span>
            ) : createProfessional.isPending ? (
              "Cadastrando..."
            ) : (
              "Aparecer no Mapa"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
