import React from 'react';
import { motion } from 'framer-motion';
import { Music, MapPin, Users, Heart, Megaphone, Sparkles } from 'lucide-react';

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-gradient-to-r from-[#4A20BD] to-[#6B3FD4] rounded-3xl p-10 text-center text-white"
        >
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-3">Quer nos apoiar ou patrocinar?</h3>
          <p className="text-white/80 text-lg mb-6">Fale com a gente e faça parte desta história de superação e esperança.</p>
          <a
            href="mailto:coralvozesdavida@gmail.com"
            className="inline-block bg-[#F05D5A] hover:bg-[#d94a47] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors duration-200"
          >
            coralvozesdavida@gmail.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
