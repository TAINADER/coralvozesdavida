import { useState, useRef, useEffect } from "react";
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
import { ChevronDown, X } from "lucide-react";

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
  "Cozinheiro", "Doceira", "Padeiro", "Sushiman",

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
  phone: z.string().optional(),
  photoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  linkUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  profession: z.string().min(1, "Selecione uma profissão"),
  professionDetail: z.string().optional(),
  lessonType: z.string().optional(),
  level: z.enum(["amador", "profissional"]),
});

function ProfessionCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = professions.filter(p => p.toLowerCase().includes(inputValue.toLowerCase()));

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (inputValue.trim()) onChange(inputValue.trim());
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [inputValue, onChange]);

  const select = (p: string) => {
    setInputValue(p);
    onChange(p);
    setOpen(false);
  };

  const clear = () => {
    setInputValue("");
    onChange("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <Input
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); onChange(e.target.value); setOpen(e.target.value.trim().length > 0); }}
          onFocus={() => { if (inputValue.trim().length > 0) setOpen(true); }}
          onKeyDown={e => {
            if (e.key === "Escape") { setOpen(false); (e.target as HTMLInputElement).blur(); }
            if (e.key === "Enter" && inputValue.trim()) { e.preventDefault(); onChange(inputValue.trim()); setOpen(false); }
          }}
          placeholder="Digite ou escolha uma profissão..."
          className="bg-background pr-14"
          autoComplete="off"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {inputValue && (
            <button type="button" onClick={clear} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button type="button" onClick={() => setOpen(o => !o)} className="p-1 text-muted-foreground hover:text-foreground">
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-xl max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              Não encontrado — pressione Enter para usar <strong>"{inputValue}"</strong>
            </div>
          ) : (
            filtered.map(p => (
              <button
                key={p}
                type="button"
                onMouseDown={e => { e.preventDefault(); select(p); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 transition-colors ${p === value ? "font-bold text-primary bg-primary/5" : ""}`}
              >
                {p}
              </button>
            ))
          )}
          {inputValue.trim() && !professions.some(p => p.toLowerCase() === inputValue.toLowerCase()) && (
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); select(inputValue.trim()); }}
              className="w-full text-left px-4 py-2.5 text-sm border-t border-border text-primary font-semibold hover:bg-primary/10 transition-colors"
            >
              + Usar "<strong>{inputValue.trim()}</strong>"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function VoceTab({ userLocation, onAdded }: { userLocation: { lat: number; lng: number }, onAdded: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createProfessional = useCreateProfessional();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      photoUrl: "",
      linkUrl: "",
      profession: "",
      professionDetail: "",
      lessonType: "",
      level: "profissional",
    },
  });

  const selectedProfession = form.watch("profession");

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createProfessional.mutate({
      data: {
        name: data.name,
        phone: data.phone || undefined,
        photoUrl: data.photoUrl || undefined,
        linkUrl: data.linkUrl || undefined,
        profession: data.profession,
        professionDetail: data.professionDetail || undefined,
        lessonType: data.lessonType || undefined,
        level: data.level as ProfessionalInputLevel,
        lat: userLocation.lat,
        lng: userLocation.lng,
      }
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
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">O que você pode fazer?</FormLabel>
                <FormControl>
                  <ProfessionCombobox value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedProfession === "Professor" && (
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

          {selectedProfession === "Músico profissional" && (
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

          {selectedProfession === "Médico" && (
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
            disabled={createProfessional.isPending}
          >
            {createProfessional.isPending ? "Cadastrando..." : "Aparecer no Mapa"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
