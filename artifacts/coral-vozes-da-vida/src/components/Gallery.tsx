import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, PlayCircle } from 'lucide-react';


import casaRosaImg from '@assets/gallery_casa_rosa.jpg';
import tcaImg from '@assets/gallery_tca.jpg';
import hospitalImg from '@assets/gallery_hospital.jpg';
import jantarImg from '@assets/gallery_jantar_bem.jpg';
import eventoImg from '@assets/gallery_evento_especial.jpg';
import natalBemImg from '@assets/2570fb98-4a08-45c5-b379-c702b57b1c8c_1780538575050.jpeg';

export function Gallery() {
  const events = [
    { title: "Natal do Bem", venue: "Concha Acústica", date: "2025", img: natalBemImg, link: "https://www.youtube.com/live/B0n2i5H91NQ?si=LuPh4SMSMY4WX3jS" },
    { title: "Pipoca de Saulo na Concha Acústica", venue: "TCA (Teatro Castro Alves)", date: "2024", img: tcaImg, link: "https://www.youtube.com/live/bRflVlsyHdU?si=mqO18X4_ok_zPM-L" },

    { title: "Concerto Beneficente", venue: "Casa Rosa", date: "2024", img: casaRosaImg },
    { title: "Homenagem aos Pacientes", venue: "Hospital Martagão Gesteira", date: "2024", img: hospitalImg },
    { title: "Jantar do Bem", venue: "Pupileira", date: "2024", img: jantarImg },
    { title: "Celebração da Vida", venue: "Evento Especial", date: "2024", img: eventoImg },
  ];

  const partners = [
    "Carla Visi",
    "Flávio Venturini",
    "Gerônimo",
    "Gilberto Gil",
    "Jota Quest",
    "Marinez",
    "Ricardo Chaves",
    "Saulo Fernandes",
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
              <div className="h-52 relative overflow-hidden">
                <img
                  src={event.img}
                  alt={`${event.title} — ${event.venue}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h3>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-3 text-accent flex-shrink-0" />
                    <span className="font-medium">{event.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar size={18} className="mr-3 text-primary flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                </div>

                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors duration-200"
                  >
                    <PlayCircle size={16} />
                    Assistir apresentação
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary/5 rounded-3xl p-10 text-center border border-primary/10">
          <Star className="w-12 h-12 text-accent mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-primary mb-8">Artistas Parceiros e Inspiradores</h3>
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
