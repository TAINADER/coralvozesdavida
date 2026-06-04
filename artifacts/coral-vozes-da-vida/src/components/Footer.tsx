import React, { useState } from 'react';

export function Footer() {
  const [showPix, setShowPix] = useState(false);
  const [copied, setCopied] = useState(false);

  const pixKey = "doeagora@martagaogesteira.org.br";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <footer className="bg-[#2B1075] text-white/70 py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-white font-bold text-xl mb-1">Vozes da Vida</div>
            <div className="text-sm">Coral de Ex-Pacientes do Martagão</div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <a href="https://martagaogesteira.com.br/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Hospital Martagão Gesteira
            </a>
            <a href="https://instagram.com/coralvozesdavida" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="https://youtube.com/@VozesdaVida" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              YouTube
            </a>
          </div>
        </div>

        {/* DOE PARA O MARTAGÃO */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={() => setShowPix(v => !v)}
            className="flex items-center gap-2 bg-[#FF6B47] hover:bg-[#ff7d5e] text-white font-extrabold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            ❤️ DOE PARA O MARTAGÃO
          </button>

          {showPix && (
            <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-5 max-w-md w-full text-center space-y-3">
              <p className="text-white font-semibold text-sm">
                Faça sua doação via <span className="text-[#FF6B47] font-bold">Pix</span> ao Hospital Martagão Gesteira
              </p>
              <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-white text-sm font-mono break-all">{pixKey}</span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 bg-[#FF6B47] hover:bg-[#ff7d5e] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? "Copiado ✓" : "Copiar"}
                </button>
              </div>
              <p className="text-white/50 text-xs">
                Abra o app do seu banco, vá em Pix → Pagar, e cole a chave acima.
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm">
          <p>© {new Date().getFullYear()} Coral Vozes da Vida. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
