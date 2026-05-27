import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star } from 'lucide-react';

export function Gallery() {
  const events = [
    { title: "Apresentação de Natal", venue: "Shopping Vitória Boulevard", date: "2024", color: "bg-[#4A20BD]" },
    { title: "Concerto Beneficente", venue: "Casa Rosa", date: "2024", color: "bg-[#F05D5A]" },
    { title: "Espetáculo Anual", venue: "TCA (Teatro Castro Alves)", date: "2024", color: "bg-blue-600" },
    { title: "Homenagem aos Pacientes", venue: "Hospital Martagão Gesteira", date: "2024", color: "bg-[#4A20BD]" },
    { title: "Gala Solidária", venue: "Jantar do Bem", date: "2024", color: "bg-[#F05D5A]" },
    { title: "Celebração da Vida", venue: "Igreja / Evento Especial", date: "2024", color: "bg-teal-600" },
  ];

  const partners = [
    "Flávio Venturini",
    "Carla Visi",
    "Saulo"
  ];

  return (
    <section id="galeria" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Nossa Trajetória</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-8" />
          <p className="text-lg text-gray-600">Momentos inesquecíveis onde a nossa voz ecoou esperança.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              {/* Image Placeholder */}
              <div className={`h-48 ${event.color} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <MusicNotes />
              </div>
              
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-3 text-accent" />
                    <span className="font-medium">{event.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar size={18} className="mr-3 text-primary" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partners */}
        <div className="bg-primary/5 rounded-3xl p-10 text-center border border-primary/10">
          <Star className="w-12 h-12 text-accent mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-primary mb-8">Artistas Parceiros</h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {partners.map((partner, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white px-8 py-4 rounded-full shadow-sm font-bold text-gray-800 text-lg border border-gray-100"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MusicNotes() {
  return (
    <div className="flex gap-4 opacity-30">
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-4 h-4 rounded-full bg-white relative">
        <div className="absolute bottom-0 right-0 w-1 h-8 bg-white" />
      </motion.div>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="w-4 h-4 rounded-full bg-white relative">
        <div className="absolute bottom-0 right-0 w-1 h-10 bg-white" />
      </motion.div>
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="w-4 h-4 rounded-full bg-white relative">
        <div className="absolute bottom-0 right-0 w-1 h-6 bg-white" />
      </motion.div>
    </div>
  );
}
