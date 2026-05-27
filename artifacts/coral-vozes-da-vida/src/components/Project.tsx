import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Eye, Instagram, Mic2, Music2 } from 'lucide-react';

export function Project() {
  const stats = [
    { icon: <Calendar className="text-accent" size={32} />, label: 'Ensaios realizados', value: '32' },
    { icon: <Mic2 className="text-primary" size={32} />, label: 'Apresentações', value: '+20' },
    { icon: <Users className="text-accent" size={32} />, label: 'Pessoas no público', value: '10.000+' },
    { icon: <Eye className="text-primary" size={32} />, label: 'Visualizações no YouTube', value: '100.160' },
    { icon: <Instagram className="text-accent" size={32} />, label: 'Seguidores no Instagram', value: '+3.000' },
  ];

  return (
    <section id="projeto" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">O Projeto</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8 rounded-full" />
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            O Coral Vozes da Vida tem capacidade para <strong className="text-primary">100 coralistas</strong> e é aberto a ex-pacientes do Hospital Martagão Gesteira.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed bg-primary/5 p-6 rounded-2xl border border-primary/10">
            Cada membro recebe: <strong className="text-primary">fardamento completo</strong>, <strong className="text-primary">transporte</strong> para os ensaios e apresentações, e <strong className="text-primary">lanche</strong> durante os encontros.
          </p>
        </motion.div>

        {/* Maestro Idealizador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-10 text-white text-center overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center mx-auto mb-5">
                <Music2 size={30} className="text-accent" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Nosso Maestro Idealizador</p>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">Luciano Calazans</h3>
              <div className="w-12 h-0.5 bg-accent mx-auto rounded-full" />
            </div>
          </div>
        </motion.div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">Realizações do Projeto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow hover:border-primary/20 flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
