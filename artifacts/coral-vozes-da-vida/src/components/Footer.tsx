import React from 'react';
import { SiInstagram, SiYoutube } from 'react-icons/si';

export function Footer() {
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

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm">
          <p>© {new Date().getFullYear()} Coral Vozes da Vida. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
