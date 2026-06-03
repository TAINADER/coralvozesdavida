import { useState } from "react";
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
import { ProfessionalInputLevel } from "@workspace/api-client-react/src/generated/api.schemas";

const professions = [
  "Auxiliar de enfermagem", "Baby sitter", "Barista", "Cantor", "Carpinteiro", "Chef de cozinha", 
  "Compositor", "Conserto de computador", "Conserto de eletrônicos", "Datógrafo", "Designer", 
  "Eletricista", "Enfermeira", "Engenheiro elétrico", "Escritor", "Faxina", "Fisioterapeuta", 
  "Fotógrafo", "Jardineiro", "Marceneiro", "Massagista", "Médico", "Mecânico", "Músico profissional", 
  "Nutricionista", "Passeio com cachorro", "Pequenos reparos domésticos", "Personal trainer", "Pintor", 
  "Professor", "Psicólogo", "Revisor ortográfico", "Segurança", "Sushi man", "Terapeuta ABA", 
  "Terapeuta ocupacional", "Veterinário", "e qualquer outra profissão de serviço"
];

const subjects = [
  "Alemão", "Árabe", "Arte plástica", "Banca", "Canto", "Ciências", "Crochê", "Educação física", 
  "Espanhol", "Filosofia", "Física", "Francês", "História", "Inglês", "Instrumento musical", 
  "Japonês", "Mandarim", "Matemática", "Musculação", "Música", "Português", "Química", "Tricô", "Outro"
];

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  photoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  linkUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  profession: z.string().min(1, "Selecione uma profissão"),
  professionDetail: z.string().optional(),
  lessonType: z.string().optional(),
  level: z.enum(["amador", "profissional"]),
});

export default function VoceTab({ userLocation, onAdded }: { userLocation: { lat: number; lng: number }, onAdded: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createProfessional = useCreateProfessional();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
            name="photoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Foto (URL)</FormLabel>
                <FormControl>
                  <Input placeholder="Link para sua foto (opcional)" className="bg-background" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecione sua profissão" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {professions.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
