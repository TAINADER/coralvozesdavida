import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    text: "Entrar para o coral foi a minha segunda cura. A música me devolveu a alegria de viver depois de tudo que passei no tratamento.",
    name: "Maria das Graças",
    role: "Sobrevivente de câncer de mama · 3 anos no coral",
  },
  {
    text: "Quando canto junto com meus companheiros, lembro que não estou sozinha. É uma família que nasceu da dor e virou força.",
    name: "Rosângela Souza",
    role: "Sobrevivente de câncer de colo do útero · 2 anos no coral",
  },
  {
    text: "O coral me ensinou que a voz que fica depois do câncer é mais bonita ainda. Cada nota que canto é uma celebração de estar vivo.",
    name: "José Antônio",
    role: "Sobrevivente de câncer de garganta · 2 anos no coral",
  },
  {
    text: "Nunca pensei que um dia subiria a um palco. O Vozes da Vida me mostrou que a superação não tem limite e que a arte salva.",
    name: "Conceição Lima",
    role: "Sobrevivente de câncer de pulmão · 1 ano no coral",
  },
  {
    text: "Cada ensaio é um abraço coletivo. Chegamos como pacientes e viramos artistas. Isso é o milagre que o coral faz.",
    name: "Edilson Rocha",
    role: "Sobrevivente de linfoma · 2 anos no coral",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="py-24 bg-primary overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4 tracking-wide uppercase">
            Vozes que inspiram
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Depoimentos dos Coralistas
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Quem canta junto no Vozes da Vida tem uma história de coragem e transformação para contar.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-10 md:p-14 text-center"
            >
              <Quote size={40} className="text-accent mx-auto mb-6 opacity-80" />
              <p className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-8 italic">
                "{testimonials[current].text}"
              </p>
              <div>
                <p className="text-white font-bold text-lg">{testimonials[current].name}</p>
                <p className="text-white/60 text-sm mt-1">{testimonials[current].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 h-2.5 bg-accent'
                      : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Depoimento ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all"
              aria-label="Próximo"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
