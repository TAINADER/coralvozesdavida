import React from 'react';
import { motion } from 'framer-motion';
import { Music, MapPin, Users, Heart, Megaphone, Sparkles, Mic2 } from 'lucide-react';

const WA_NUMBER = "5571999123302";

const EMAIL = "coralvozesdavida@gmail.com";

function ContactCard({ color, icon, title, description, message, emailSubject, textColor }: {
  color: string; icon: React.ReactNode; title: string; description: string;
  message: string; emailSubject: string; textColor: string;
}) {
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  const mailUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(emailSubject)}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`${color} rounded-3xl p-8 text-center text-white flex flex-col items-center gap-4`}
    >
      <div className="w-10 h-10 opacity-90">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed">{description}</p>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto inline-flex items-center gap-2 bg-white ${textColor} hover:bg-white/90 font-bold px-8 py-3 rounded-full text-base transition-colors duration-200 shadow`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.524 5.855L.057 23.57a.5.5 0 0 0 .614.612l5.857-1.53A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.866 9.866 0 0 1-5.03-1.378l-.36-.214-3.733.976.999-3.645-.235-.374A9.867 9.867 0 0 1 2.1 12C2.1 6.534 6.534 2.1 12 2.1c5.466 0 9.9 4.434 9.9 9.9 0 5.466-4.434 9.9-9.9 9.9z"/>
        </svg>
        Falar no WhatsApp
      </a>

      <a
        href={mailUrl}
        className="text-white/70 hover:text-white text-sm underline underline-offset-2 transition-colors"
      >
        ou enviar um e-mail
      </a>
    </motion.div>
  );
}

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
          <ContactCard
            color="bg-gradient-to-br from-[#F05D5A] to-[#d94a47]"
            icon={<Mic2 size={40} />}
            title="Contrate a nossa apresentação"
            description="Leve o Vozes da Vida para o seu evento, escola, empresa ou espaço cultural."
            message="Olá! Assunto: quero contratar uma apresentação do Coral Vozes da Vida."
            emailSubject="Contratação de apresentação – Coral Vozes da Vida"
            textColor="text-[#F05D5A]"
          />
          <ContactCard
            color="bg-gradient-to-br from-[#4A20BD] to-[#6B3FD4]"
            icon={<Heart size={40} />}
            title="Venha ser patrocinador do projeto"
            description="Associe sua marca a uma história de superação, esperança e impacto social real."
            message="Olá! Assunto: quero patrocinar o Coral Vozes da Vida."
            emailSubject="Patrocínio – Coral Vozes da Vida"
            textColor="text-[#4A20BD]"
          />
        </div>
      </div>
    </section>
  );
}
