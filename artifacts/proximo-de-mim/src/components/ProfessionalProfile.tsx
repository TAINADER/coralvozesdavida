import { useState } from "react";
import { useListReviews, useCreateReview, Professional, getListReviewsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Star, MapPin, ExternalLink, User, Loader2, MessageSquare, Send, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Platform = { label: string; bg: string; text: string; border: string; logo: string };

function detectPlatform(url: string): Platform {
  const u = url.toLowerCase();
  if (u.includes("instagram.com"))
    return { label: "Instagram", bg: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400", text: "text-white", border: "border-pink-300", logo: "📸" };
  if (u.includes("youtube.com") || u.includes("youtu.be"))
    return { label: "YouTube", bg: "bg-red-600", text: "text-white", border: "border-red-400", logo: "▶️" };
  if (u.includes("whatsapp.com") || u.includes("wa.me"))
    return { label: "WhatsApp", bg: "bg-green-500", text: "text-white", border: "border-green-300", logo: "💬" };
  if (u.includes("linkedin.com"))
    return { label: "LinkedIn", bg: "bg-blue-700", text: "text-white", border: "border-blue-400", logo: "💼" };
  if (u.includes("facebook.com") || u.includes("fb.com"))
    return { label: "Facebook", bg: "bg-blue-600", text: "text-white", border: "border-blue-300", logo: "👥" };
  if (u.includes("tiktok.com"))
    return { label: "TikTok", bg: "bg-black", text: "text-white", border: "border-gray-600", logo: "🎵" };
  if (u.includes("twitter.com") || u.includes("x.com"))
    return { label: "X / Twitter", bg: "bg-black", text: "text-white", border: "border-gray-500", logo: "✖" };
  return { label: "Site", bg: "bg-teal-700", text: "text-white", border: "border-teal-400", logo: "🌐" };
}

function LinkPreviewCard({ url }: { url: string }) {
  const platform = detectPlatform(url);
  const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "").split("/")[0];
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  const displayPath = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <a href={url} target="_blank" rel="noreferrer" className="block group">
      <div className={`rounded-xl border ${platform.border} ${platform.bg} ${platform.text} px-4 py-3 flex items-center gap-3 shadow-sm hover:opacity-90 transition-opacity`}>
        <img
          src={favicon}
          alt=""
          className="w-8 h-8 rounded-lg bg-white/20 p-0.5 object-contain shrink-0"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm">{platform.label}</div>
          <div className="text-xs opacity-80 truncate">{displayPath}</div>
        </div>
        <ExternalLink className="w-4 h-4 opacity-60 shrink-0" />
      </div>
    </a>
  );
}

const LEVEL_LABEL: Record<string, string> = {
  amador: "Amador",
  profissional: "Profissional",
};

function StarRow({ value, onChange, size = 6 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-${size} h-${size} transition-colors ${s <= active ? "fill-amber-400 text-amber-400" : "text-gray-300"} ${onChange ? "cursor-pointer" : ""}`}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
        />
      ))}
    </div>
  );
}

export default function ProfessionalProfile({ professional, onClose }: { professional: Professional; onClose: () => void }) {
  const { data: reviews = [], isLoading: loadingReviews } = useListReviews(professional.id);
  const { mutate: submitReview, isPending } = useCreateReview();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast({ title: "Selecione uma nota de 1 a 5 estrelas.", variant: "destructive" }); return; }
    submitReview(
      { id: professional.id, data: { reviewerName: reviewerName.trim() || "Anônimo", rating, comment: comment.trim() || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey(professional.id) });
          setSubmitted(true);
          setRating(0);
          setComment("");
          setReviewerName("");
          toast({ title: "Avaliação enviada! Obrigado." });
        },
        onError: () => toast({ title: "Erro ao enviar avaliação.", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground p-5 flex items-start justify-between rounded-t-2xl">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                {professional.photoUrl
                  ? <img src={professional.photoUrl} alt={professional.name} className="w-10 h-10 rounded-full object-cover" />
                  : <User className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-extrabold leading-tight">{professional.name}</h2>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {((professional as any).skills?.length ? (professional as any).skills : [professional.profession]).map((s: string) => (
                    <span key={s} className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold capitalize">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors ml-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Info chips */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
              {LEVEL_LABEL[professional.level] || professional.level}
            </span>
            {professional.lessonType && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                {professional.lessonType}
              </span>
            )}
            {avgRating !== null && (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {avgRating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
              </span>
            )}
          </div>

          {/* Address, phone & link */}
          {professional.address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <span>{professional.address}</span>
            </div>
          )}
          {professional.phone && (
            <a
              href={`tel:${professional.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-2 text-sm text-green-700 font-semibold hover:underline"
            >
              <Phone className="w-4 h-4" />
              {professional.phone}
            </a>
          )}
          {professional.linkUrl && (
            <LinkPreviewCard url={professional.linkUrl} />
          )}

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Reviews section */}
          <div>
            <h3 className="font-bold text-base mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Avaliações da comunidade
            </h3>

            {loadingReviews ? (
              <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Ainda sem avaliações. Seja o primeiro!</p>
            ) : (
              <div className="space-y-3">
                {[...reviews].reverse().map((r) => (
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

          {/* Review form */}
          <div className="border-t border-border pt-4">
            <h3 className="font-bold text-sm mb-3">Deixe sua avaliação</h3>
            {submitted ? (
              <div className="text-center py-3 text-teal-700 font-semibold text-sm bg-teal-50 rounded-xl">
                ✓ Avaliação enviada! Obrigado pelo feedback.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Sua nota</label>
                  <StarRow value={rating} onChange={setRating} size={7} />
                </div>
                <Input
                  placeholder="Seu nome (opcional)"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  maxLength={80}
                />
                <Textarea
                  placeholder="Conte sua experiência com esse profissional..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  className="resize-none"
                />
                <Button type="submit" className="w-full font-bold" disabled={isPending || !rating}>
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Enviar avaliação
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
