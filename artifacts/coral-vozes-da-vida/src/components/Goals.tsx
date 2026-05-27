import React from 'react';
import { motion } from 'framer-motion';
import { Music, MapPin, Disc3, Users, Youtube, Handshake } from 'lucide-react';

export function Goals() {
  const goals = [
    {
      icon: <Music size={24} />,
      text: "Expandir o repertório com músicas nacionais e internacionais, incluindo músicas de artistas baianos"
    },
    {
      icon: <MapPin size={24} />,
      text: "Levar o coral para apresentações em hospitais, escolas e espaços culturais, ampliando o alcance e o impacto social"
    },
    {
      icon: <Disc3 size={24} />,
      text: "Realizar a gravação do primeiro CD do coral"
    },
    {
      icon: <Users size={24} />,
      text: "Conquistar 10.000 seguidores nas redes sociais"
    },
    {
      icon: <Youtube size={24} />,
      text: "Alcançar 1 milhão de visualizações no YouTube"
    },
    {
      icon: <Handshake size={24} />,
      text: "Firmar parcerias com artistas locais e nacionais para enriquecer as apresentações e o repertório do coral"
    }
  ];

  return (
    <section id="metas" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Nossas Metas</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {goal.icon}
              </div>
              
              <p className="text-gray-700 text-lg font-medium leading-relaxed">
                {goal.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
