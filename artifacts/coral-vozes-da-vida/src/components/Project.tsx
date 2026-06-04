import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Eye, Instagram, Mic2 } from 'lucide-react';
import maestroImg from '@assets/4308f622-bd07-489e-aa6c-20a9812da31f_1779882739722.jpeg';

export function Project() {
  const stats = [
    { icon: <Calendar className="text-accent" size={32} />, label: 'Ensaios realizados', value: '+40' },
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
        </motion.div>

        {/* Texto principal em dois blocos */}
        <div className="max-w-4xl mx-auto space-y-6 mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            O Coral Vozes da Vida é um coral de ex-pacientes do Hospital Martagão Gesteira, com pessoas que enfrentaram — com coragem e esperança — o tratamento oncológico. Mais do que um coral, o projeto é um símbolo de superação: cada voz que ecoa no palco carrega uma história de luta, de amor à vida e de recomeço.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            O projeto existe desde 2023 com uma missão que vai além da música: ao desmistificar o câncer infantil, valorizar a vida e levar esperança a pacientes, familiares e à sociedade, cada apresentação é uma declaração de que é possível superar, recomeçar e transformar a dor em arte.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            O Vozes da Vida também carrega um papel profundamente terapêutico. Muitos dos que dele participam passam por tratamentos longos e permanecem em acompanhamento médico de remissão por 5 a 10 anos, com constante monitoramento. Para esses jovens, a música não é apenas expressão — é leveza, pertencimento e força para seguir em frente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-lg text-gray-700 leading-relaxed"
          >
            O projeto é de <strong className="text-primary">acesso gratuito</strong> e fruto da parceria do Maestro Luciano Calazans com o Hospital Martagão Gesteira. Cada membro recebe <strong className="text-primary">fardamento completo</strong>, <strong className="text-primary">transporte</strong> e <strong className="text-primary">lanche</strong> — para que nenhum obstáculo impeça a participação.
          </motion.div>

          {/* Hospital 60 anos */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-accent/10 border border-accent/20 rounded-2xl p-6 text-lg text-gray-700 leading-relaxed"
          >
            O Hospital Martagão Gesteira completa <strong className="text-primary">60 anos</strong> de existência servindo à população da Bahia de forma <strong className="text-primary">100% SUS</strong>. O Vozes da Vida é uma forma de ecoar ainda mais esta mensagem: <em>esse hospital importa, essas crianças importam, essas histórias precisam ser contadas.</em>
          </motion.div>
        </div>

        {/* Maestro Idealizador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row items-center">
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="w-full md:w-56 flex-shrink-0">
              <img
                src={maestroImg}
                alt="Maestro Luciano Calazans"
                className="w-full h-64 md:h-full object-cover object-top"
              />
            </div>

            <div className="relative z-10 p-8 text-white text-center md:text-left flex flex-col justify-center gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Nosso Maestro Idealizador</p>
              <h3 className="text-3xl md:text-4xl font-bold">Luciano Calazans</h3>
              <div className="w-12 h-0.5 bg-accent rounded-full mx-auto md:mx-0" />
            </div>
          </div>
        </motion.div>

        {/* Realizações */}
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
