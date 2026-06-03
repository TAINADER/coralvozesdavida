import { useState, useRef, useEffect } from "react";
import { useListReviews, useCreateReview, useUpdateProfessional, Professional, getListReviewsQueryKey, getListProfessionalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Star, MapPin, ExternalLink, User, Loader2, MessageSquare, Send, Phone, Pencil, Check, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getCoordinates, getAddressFromCoords } from "@/lib/api";

type Platform = { label: string; bg: string; text: string; border: string };

function detectPlatform(url: string): Platform {
  const u = url.toLowerCase();
  if (u.includes("instagram.com"))
    return { label: "Instagram", bg: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400", text: "text-white", border: "border-pink-300" };
  if (u.includes("youtube.com") || u.includes("youtu.be"))
    return { label: "YouTube", bg: "bg-red-600", text: "text-white", border: "border-red-400" };
  if (u.includes("whatsapp.com") || u.includes("wa.me"))
    return { label: "WhatsApp", bg: "bg-green-500", text: "text-white", border: "border-green-300" };
  if (u.includes("linkedin.com"))
    return { label: "LinkedIn", bg: "bg-blue-700", text: "text-white", border: "border-blue-400" };
  if (u.includes("facebook.com") || u.includes("fb.com"))
    return { label: "Facebook", bg: "bg-blue-600", text: "text-white", border: "border-blue-300" };
  if (u.includes("tiktok.com"))
    return { label: "TikTok", bg: "bg-black", text: "text-white", border: "border-gray-600" };
  if (u.includes("twitter.com") || u.includes("x.com"))
    return { label: "X / Twitter", bg: "bg-black", text: "text-white", border: "border-gray-500" };
  return { label: "Site", bg: "bg-teal-700", text: "text-white", border: "border-teal-400" };
}

function LinkPreviewCard({ url }: { url: string }) {
  const platform = detectPlatform(url);
  const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "").split("/")[0];
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  const displayPath = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block group">
      <div className={`rounded-xl border ${platform.border} ${platform.bg} ${platform.text} px-4 py-3 flex items-center gap-3 shadow-sm hover:opacity-90 transition-opacity`}>
        <img src={favicon} alt="" className="w-8 h-8 rounded-lg bg-white/20 p-0.5 object-contain shrink-0"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm">{platform.label}</div>
          <div className="text-xs opacity-80 truncate">{displayPath}</div>
        </div>
        <ExternalLink className="w-4 h-4 opacity-60 shrink-0" />
      </div>
    </a>
  );
}

function StarRow({ value, onChange, size = 6 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s}
          className={`w-${size} h-${size} transition-colors ${s <= active ? "fill-amber-400 text-amber-400" : "text-gray-300"} ${onChange ? "cursor-pointer" : ""}`}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
        />
      ))}
    </div>
  );
}

function SkillTagsEdit({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput("");
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map(s => (
          <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {s}
            <button type="button" onClick={() => onChange(value.filter(x => x !== s))} className="hover:opacity-70">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Adicionar habilidade..." className="bg-background text-sm h-8" />
        <Button type="button" size="sm" variant="outline" onClick={add} className="h-8 px-3 text-xs">+ Add</Button>
      </div>
    </div>
  );
}

const LEVEL_LABEL: Record<string, string> = { amador: "Amador", profissional: "Profissional" };

export default function ProfessionalProfile({
  professional,
  onClose,
  onUpdated,
}: {
  professional: Professional;
  onClose: () => void;
  onUpdated?: (updated: Professional) => void;
}) {
  const { data: reviews = [], isLoading: loadingReviews } = useListReviews(professional.id);
  const { mutate: submitReview, isPending: reviewPending } = useCreateReview();
  const { mutate: updateProf, isPending: updatePending } = useUpdateProfessional();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const skills: string[] = (professional as any).skills?.length
    ? (professional as any).skills
    : [professional.profession];

  const [editName, setEditName] = useState(professional.name);
  const [editAddress, setEditAddress] = useState(professional.address ?? "");
  const [editPhone, setEditPhone] = useState(professional.phone ?? "");
  const [editPhoto, setEditPhoto] = useState(professional.photoUrl ?? "");
  const [editLink, setEditLink] = useState(professional.linkUrl ?? "");
  const [editSkills, setEditSkills] = useState<string[]>(skills);
  const [editLevel, setEditLevel] = useState(professional.level);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const handleGps = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const addr = await getAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
        if (addr) setEditAddress(addr);
        setLocating(false);
      },
      () => { toast({ variant: "destructive", title: "GPS indisponível" }); setLocating(false); },
      { timeout: 10000 }
    );
  };

  const handleSave = async () => {
    if (!editName.trim() || editSkills.length === 0 || !editAddress.trim()) {
      toast({ variant: "destructive", title: "Preencha nome, endereço e ao menos uma habilidade." });
      return;
    }
    setGeocoding(true);
    const coords = await getCoordinates(editAddress);
    setGeocoding(false);
    if (!coords) {
      toast({ variant: "destructive", title: "Endereço não encontrado", description: "Tente um endereço mais completo, com rua, número e cidade." });
      return;
    }
    updateProf(
      {
        id: professional.id,
        data: {
          name: editName,
          address: editAddress,
          phone: editPhone || undefined,
          photoUrl: editPhoto || undefined,
          linkUrl: editLink || undefined,
          profession: editSkills[0],
          skills: editSkills,
          level: editLevel as any,
          lat: coords.lat,
          lng: coords.lng,
          professionDetail: professional.professionDetail ?? undefined,
          lessonType: professional.lessonType ?? undefined,
        } as any,
      },
      {
        onSuccess: updated => {
          toast({ title: "Perfil atualizado!" });
          queryClient.invalidateQueries({ queryKey: getListProfessionalsQueryKey() });
          onUpdated?.(updated);
          setEditing(false);
        },
        onError: () => toast({ variant: "destructive", title: "Erro ao salvar. Tente novamente." }),
      }
    );
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast({ title: "Selecione uma nota de 1 a 5 estrelas.", variant: "destructive" }); return; }
    submitReview(
      { id: professional.id, data: { reviewerName: reviewerName.trim() || "Anônimo", rating, comment: comment.trim() || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey(professional.id) });
          setSubmitted(true); setRating(0); setComment(""); setReviewerName("");
          toast({ title: "Avaliação enviada! Obrigado." });
        },
        onError: () => toast({ title: "Erro ao enviar avaliação.", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground p-5 flex items-start justify-between rounded-t-2xl">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                {professional.photoUrl
                  ? <img src={professional.photoUrl} alt={professional.name} className="w-10 h-10 rounded-full object-cover" />
                  : <User className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-extrabold leading-tight">{professional.name}</h2>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {skills.map(s => (
                    <span key={s} className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold capitalize">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setEditing(e => !e)}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              title={editing ? "Ver perfil" : "Editar perfil"}
            >
              {editing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {editing ? (
            /* ── EDIT FORM ── */
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ✏️ Você está editando este perfil. Salve ao terminar.
              </p>

              <div>
                <label className="text-sm font-bold block mb-1">Nome</label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-background" />
              </div>

              <div>
                <label className="text-sm font-bold block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Endereço
                </label>
                <p className="text-xs text-muted-foreground mb-1">Aceita endereço completo ou CEP.</p>
                <div className="flex gap-2">
                  <Input value={editAddress} onChange={e => setEditAddress(e.target.value)}
                    placeholder="Rua, número, bairro, cidade — ou CEP" className="bg-background" />
                  <button type="button" onClick={handleGps} disabled={locating}
                    className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors">
                    {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold block mb-1">Telefone / WhatsApp <span className="font-normal text-muted-foreground">(opcional)</span></label>
                <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="(11) 99999-9999" className="bg-background" />
              </div>

              <div>
                <label className="text-sm font-bold block mb-1">Habilidades</label>
                <SkillTagsEdit value={editSkills} onChange={setEditSkills} />
              </div>

              <div>
                <label className="text-sm font-bold block mb-1">Foto (URL) <span className="font-normal text-muted-foreground">(opcional)</span></label>
                <Input value={editPhoto} onChange={e => setEditPhoto(e.target.value)} placeholder="Link para sua foto" className="bg-background" />
              </div>

              <div>
                <label className="text-sm font-bold block mb-1">Link profissional <span className="font-normal text-muted-foreground">(opcional)</span></label>
                <Input value={editLink} onChange={e => setEditLink(e.target.value)} placeholder="Instagram, LinkedIn, site..." className="bg-background" />
              </div>

              <div>
                <label className="text-sm font-bold block mb-2">Nível</label>
                <div className="flex gap-3">
                  {["amador", "profissional"].map(l => (
                    <button key={l} type="button" onClick={() => setEditLevel(l)}
                      className={`flex-1 py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all capitalize ${editLevel === l ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}>
                      {LEVEL_LABEL[l]}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full font-bold" onClick={handleSave} disabled={updatePending || geocoding}>
                {geocoding ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Localizando endereço...</>
                  : updatePending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Salvando...</>
                  : <><Check className="w-4 h-4 mr-2" />Salvar alterações</>}
              </Button>
            </div>
          ) : (
            /* ── VIEW MODE ── */
            <>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
                  {LEVEL_LABEL[professional.level] || professional.level}
                </span>
                {professional.lessonType && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">{professional.lessonType}</span>
                )}
                {avgRating !== null && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {avgRating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
                  </span>
                )}
              </div>

              {professional.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <span>{professional.address}</span>
                </div>
              )}
              {!professional.address && (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-sm text-amber-700 font-semibold bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-full hover:bg-amber-100 transition-colors">
                  <MapPin className="w-4 h-4" /> Endereço não cadastrado — clique para editar
                </button>
              )}
              {professional.phone && (
                <a href={`tel:${professional.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-sm text-green-700 font-semibold hover:underline">
                  <Phone className="w-4 h-4" />{professional.phone}
                </a>
              )}
              {professional.linkUrl && <LinkPreviewCard url={professional.linkUrl} />}

              <div className="border-t border-border" />

              <div>
                <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Avaliações da comunidade
                </h3>
                {loadingReviews ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                ) : reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Ainda sem avaliações. Seja o primeiro!</p>
                ) : (
                  <div className="space-y-3">
                    {[...reviews].reverse().map(r => (
                      <div key={r.id} className="bg-muted/40 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{r.reviewerName}</span>
                          <StarRow value={r.rating} size={4} />
                        </div>
                        {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(r.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-bold text-sm mb-3">Deixe sua avaliação</h3>
                {submitted ? (
                  <div className="text-center py-3 text-teal-700 font-semibold text-sm bg-teal-50 rounded-xl">
                    ✓ Avaliação enviada! Obrigado pelo feedback.
                  </div>
                ) : (
                  <form onSubmit={handleReview} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Sua nota</label>
                      <StarRow value={rating} onChange={setRating} size={7} />
                    </div>
                    <Input placeholder="Seu nome (opcional)" value={reviewerName}
                      onChange={e => setReviewerName(e.target.value)} maxLength={80} />
                    <Textarea placeholder="Conte sua experiência com esse profissional..."
                      value={comment} onChange={e => setComment(e.target.value)}
                      rows={3} maxLength={1000} className="resize-none" />
                    <Button type="submit" className="w-full font-bold" disabled={reviewPending || !rating}>
                      {reviewPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                      Enviar avaliação
                    </Button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
