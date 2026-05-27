import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Heart, Music } from 'lucide-react';
import logoImg from '@assets/logo_coral_vozes.png';

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden bg-primary text-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-accent/30 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[120px]" />
        
        {/* Abstract waves */}
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,50 Q250,150 500,50 T1000,50" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.1" className="animate-pulse" />
          <path d="M0,150 Q250,50 500,150 T1000,150" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" className="animate-pulse" style={{ animationDelay: '1s' }} />
          <path d="M0,250 Q250,350 500,250 T1000,250" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.05" className="animate-pulse" style={{ animationDelay: '2s' }} />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/95 shadow-[0_0_40px_rgba(255,255,255,0.3)] mx-auto mb-6 flex items-center justify-center p-3"
          >
            <img
              src={logoImg}
              alt="Marca Coral Vozes da Vida"
              className="w-full h-full object-contain"
            />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Music size={16} className="text-accent" />
            <span className="text-sm font-medium tracking-wide">Música que transforma vidas</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            Vozes da Vida <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#ff8c8a]">
              Coral de Ex-Pacientes do Martagão
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-6 max-w-3xl mx-auto">
            O Coral Vozes da Vida nasce com um propósito que vai além da música: é uma celebração da vida, da esperança e da superação. Formado por ex-pacientes do Hospital Martagão Gesteira, este grupo une pessoas que enfrentaram o câncer e decidiram transformar sua jornada em canto, emoção e inspiração.
          </p>

          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-12 max-w-3xl mx-auto">
            Cantar junto é afirmar que a vida continua, que a beleza existe mesmo nos momentos mais difíceis, e que a música tem o poder de curar, unir e transformar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-[0_0_40px_rgba(240,93,90,0.4)] transition-all hover:shadow-[0_0_60px_rgba(240,93,90,0.6)]" asChild>
              <a href="https://forms.gle/CRcYqrMZq8gy3U6q7" target="_blank" rel="noopener noreferrer">
                Quero me Inscrever
              </a>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full px-8 py-6 text-lg font-bold backdrop-blur-sm transition-all" asChild>
              <a href="https://martagaogesteira.com.br/" target="_blank" rel="noopener noreferrer">
                <Heart size={20} className="mr-2" />
                Conhecer o Martagão
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-[30px] h-[50px] border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
