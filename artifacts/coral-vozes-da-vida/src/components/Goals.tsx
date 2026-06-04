import React from 'react';
import { motion } from 'framer-motion';
import { Music, MapPin, Users, Heart, Megaphone, Sparkles, Mic2 } from 'lucide-react';

export function Goals() {
  const goals = [
    {
      icon: <Music size={24} />,
      title: "20 ensaios no novo ciclo",
      text: "Realizar 20 ensaios no novo ciclo anual de atividades, com dedicação, leveza e muita música."
    },
    {
      icon: <MapPin size={24} />,
      title: "Apresentações públicas",
      text: "Levar o coral a diversas apresentações públicas — hospitais, escolas, espaços culturais — ampliando o impacto social."
    },
    {
      icon: <Users size={24} />,
      title: "Novos coristas",
      text: "Ampliar o grupo, conquistando o espaço que é deles: convocar ex-pacientes do Martagão que queiram fazer parte."
    },
    {
      icon: <Heart size={24} />,
      title: "Terapia pela música",
      text: "Proporcionar leveza, pertencimento e força a quem ainda vive sob acompanhamento médico e pressão emocional intensa."
    },
    {
      icon: <Megaphone size={24} />,
      title: "Conscientização",
      text: "Desmistificar o câncer infantil e valorizar a vida — levando esperança a pacientes, familiares e à sociedade."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Ecoar a mensagem",
      text: "Mostrar à sociedade: esse hospital importa, essas crianças importam, essas histórias precisam ser contadas."
    }
  ];

  return (
    <section id="metas" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Nossas Metas</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {goals.map((goal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
              
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {goal.icon}
              </div>

              <h3 className="text-primary font-bold text-lg mb-2">{goal.title}</h3>
              
              <p className="text-gray-600 text-base leading-relaxed">
                {goal.text}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contratação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#F05D5A] to-[#d94a47] rounded-3xl p-8 text-center text-white flex flex-col items-center gap-4"
          >
            <Mic2 className="w-10 h-10 opacity-90" />
            <h3 className="text-xl font-bold">Contrate a nossa apresentação</h3>
            <p className="text-white/80 text-sm leading-relaxed">Leve o Vozes da Vida para o seu evento, escola, empresa ou espaço cultural.</p>
            <a
              href="mailto:coralvozesdavida@gmail.com?subject=Contratação de apresentação – Coral Vozes da Vida"
              className="mt-auto inline-block bg-white text-[#F05D5A] hover:bg-white/90 font-bold px-8 py-3 rounded-full text-base transition-colors duration-200 shadow"
            >
              Falar sobre contratação
            </a>
          </motion.div>

          {/* Patrocínio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-[#4A20BD] to-[#6B3FD4] rounded-3xl p-8 text-center text-white flex flex-col items-center gap-4"
          >
            <Heart className="w-10 h-10 opacity-90" />
            <h3 className="text-xl font-bold">Venha ser patrocinador do projeto</h3>
            <p className="text-white/80 text-sm leading-relaxed">Associe sua marca a uma história de superação, esperança e impacto social real.</p>
            <a
              href="mailto:coralvozesdavida@gmail.com?subject=Patrocínio – Coral Vozes da Vida"
              className="mt-auto inline-block bg-white text-[#4A20BD] hover:bg-white/90 font-bold px-8 py-3 rounded-full text-base transition-colors duration-200 shadow"
            >
              Quero ser patrocinador
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
