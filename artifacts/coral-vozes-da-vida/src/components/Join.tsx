import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { SiInstagram, SiYoutube } from 'react-icons/si';

export function Join() {
  return (
    <section id="inscricoes" className="py-32 bg-primary text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-6 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Faça Parte do Coral</h2>
          
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12">
            Quer fazer parte desta história? O Coral Vozes da Vida está com inscrições abertas para ex-pacientes do Hospital Martagão Gesteira. Venha cantar, se inspirar e inspirar outras pessoas!
          </p>

          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-12 py-8 text-2xl font-bold shadow-[0_0_40px_rgba(240,93,90,0.4)] transition-all hover:shadow-[0_0_60px_rgba(240,93,90,0.6)] hover:-translate-y-1 mb-16" asChild>
            <a href="https://forms.gle/CRcYqrMZq8gy3U6q7" target="_blank" rel="noopener noreferrer">
              Inscreva-se Agora
            </a>
          </Button>

          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-white/60 mb-6 uppercase tracking-widest">Siga nossas redes</h3>
            <div className="flex gap-6">
              <a 
                href="https://instagram.com/coralvozesdavida" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-300 border border-white/20"
              >
                <SiInstagram size={28} />
              </a>
              <a 
                href="https://youtube.com/@VozesdaVida" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-300 border border-white/20"
              >
                <SiYoutube size={28} />
              </a>
            </div>
            <div className="flex gap-8 mt-6 text-white/80 font-medium">
              <span>@coralvozesdavida</span>
              <span>@VozesdaVida</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
