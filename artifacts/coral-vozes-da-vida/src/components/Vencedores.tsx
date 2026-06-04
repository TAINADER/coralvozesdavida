import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

import joaoTratamento from '@assets/IMG_4619_1780536320603.jpeg';
import joaoCoral from '@assets/IMG_4620_1780536320603.jpeg';
import joaoFotos from '@assets/IMG_4621_1780536320603.jpeg';
import joaoFamilia from '@assets/IMG_4622_1780536320603.jpeg';

import esterFlores from '@assets/IMG_4623_1780536438451.jpeg';
import esterHoje from '@assets/IMG_4624_1780536438451.jpeg';
import esterApresentacao from '@assets/IMG_4625_1780536438451.jpeg';
import esterSelfie from '@assets/IMG_4626_1780536438451.jpeg';

const members = [
  {
    nome: "João Vitor Santiago de Santana",
    idade: "13 anos",
    diagnostico: "LLA — Leucemia Linfoide Aguda",
    historia: [
      "Aos 3 anos de João foi descoberta uma LLA — Leucemia Linfoide Aguda. Ele fez tratamento por 3 longos anos, até 2017.",
      "Há 7 anos de alta, João faz acompanhamento periódico — necessário até completar 10 anos sem novas intercorrências — mas ele tem uma vida totalmente normal.",
      "João ama os animais e sonha se tornar veterinário ou biólogo. Frequentador assíduo do coral desde o primeiro encontro, sempre sorridente, adora cantar, conversar, interagir. Um menino encantador.",
    ],
    frase: "Para mim o CORAL VOZES DA VIDA é motivação e esperança em um futuro mais alegre.",
    inspiracao: "João é uma inspiração em nosso CORAL VOZES DA VIDA. Quem vê João nem imagina os desafios que ele venceu. A sua leveza e luz são muito contagiantes e ele ensina a todos que convivem com ele. VIVA JOÃO!",
    fotos: [
      { src: joaoCoral, legenda: "João sempre sorridente" },
      { src: joaoTratamento, legenda: "Durante o tratamento — sorrindo sempre" },
      { src: joaoFotos, legenda: "Com o coral e sua mãe Samantha, fundamental em sua cura" },
      { src: joaoFamilia, legenda: "Com o Coral Vozes da Vida" },
    ],
  },
  {
    nome: "Ester Faria Falcão Maia",
    idade: "24 anos",
    diagnostico: "Linfoma de Hodgkin",
    historia: [
      "Ester foi diagnosticada com Linfoma de Hodgkin e iniciou seu tratamento em 2019, tendo alta no final do mesmo ano — sem a necessidade de transplante. Hoje vive uma vida normal, fazendo apenas acompanhamento periódico no hospital.",
      "Com 24 anos, cursa licenciatura em Letras e Pedagogia e trabalha como professora de crianças. Tudo iniciado após o tratamento. Ela também é poetiza e escreve lindamente.",
      "Seu maior sonho está bem próximo: se tornar uma professora de referência na sua área e viver em uma chácara cercada de bichinhos.",
    ],
    frase: "Quando conheci o Coral Vozes da Vida, não imaginei que conseguiria transformar tantos sentimentos guardados em mim, através da música, através do canto. Hoje não canto no Coral apenas por mim, mas por Sabrina, Emily, Beatriz, e todas as crianças que conheci, e que hoje não estão aqui para terem suas vozes ouvidas. Contudo, em memória e homenagem, carrego todas comigo. Cantar a vida, é essa força que nos une.",
    inspiracao: "Ester nos ensina muitas coisas e o seu olhar terno sobre a sua vida e as vidas que formam a sua vida dá um toque todo especial a nosso CORAL VOZES DA VIDA. TODOS NÓS SOMOS VENCEDORES DE CADA DIA!",
    fotos: [
      { src: esterFlores, legenda: "Ester durante o tratamento — linda e sorridente" },
      { src: esterHoje, legenda: "Ester hoje" },
      { src: esterApresentacao, legenda: "Cantando com Carla Visi na Concha Acústica do TCA | fev/2024" },
      { src: esterSelfie, legenda: "Ester canta sua história no Coral Vozes da Vida" },
    ],
  },
];

function PhotoCarousel({ fotos }: { fotos: { src: string; legenda: string }[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + fotos.length) % fotos.length);
  const next = () => setIdx(i => (i + 1) % fotos.length);
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl shadow-lg aspect-[4/3] bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={fotos[idx].src}
            alt={fotos[idx].legenda}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
      {fotos[idx].legenda && (
        <p className="text-center text-sm text-gray-500 mt-2 italic">{fotos[idx].legenda}</p>
      )}
      {fotos.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-3">
          <button onClick={prev} className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {fotos.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-primary w-4" : "bg-primary/30"}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export function Vencedores() {
  return (
    <section id="vencedores" className="py-24 bg-white">
      <div className="container mx-auto px-6">

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F05D5A]/10 border border-[#F05D5A]/20 mb-6">
            <span className="text-[#F05D5A] font-bold text-sm tracking-wide">♥ ♪ VENCEDORES QUE CANTAM</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Conheça nossas histórias</h2>
          <div className="w-24 h-1 bg-[#F05D5A] mx-auto rounded-full mb-6" />
          <p className="text-gray-600 text-lg leading-relaxed">
            Por trás de cada voz há uma história de luta, superação e recomeço. Estas são algumas das pessoas que fazem o Vozes da Vida ser muito mais do que um coral.
          </p>
        </motion.div>

        {/* Cards dos membros */}
        <div className="space-y-20">
          {members.map((m, i) => (
            <motion.div
              key={m.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
            >
              {/* Fotos */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <PhotoCarousel fotos={m.fotos} />
              </div>

              {/* Conteúdo */}
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#F05D5A] mb-1">Vencedor que canta</p>
                  <h3 className="text-3xl font-bold text-primary">{m.nome}</h3>
                  <p className="text-gray-500 font-medium mt-0.5">{m.idade}</p>
                </div>

                <div className="inline-block bg-[#F05D5A]/10 text-[#F05D5A] text-sm font-bold px-4 py-1.5 rounded-full">
                  {m.diagnostico}
                </div>

                <div className="space-y-3">
                  {m.historia.map((p, j) => (
                    <p key={j} className="text-gray-700 leading-relaxed">{p}</p>
                  ))}
                </div>

                {/* Frase do membro */}
                <div className="relative bg-primary/5 border-l-4 border-primary rounded-r-2xl px-5 py-4">
                  <Quote className="w-6 h-6 text-primary/30 absolute top-3 right-4" />
                  <p className="text-primary font-medium italic leading-relaxed">"{m.frase}"</p>
                  <p className="text-sm text-gray-500 mt-2 font-semibold">— {m.nome.split(" ")[0]}, {m.idade}</p>
                </div>

                {/* Mensagem do coral */}
                <div className="bg-gradient-to-br from-[#F05D5A] to-[#d94a47] rounded-2xl px-5 py-4 text-white">
                  <p className="text-sm leading-relaxed">{m.inspiracao}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA para mais histórias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center bg-gray-50 rounded-3xl p-10 border border-gray-100"
        >
          <p className="text-2xl font-bold text-primary mb-2">Mais histórias em breve</p>
          <p className="text-gray-500">Cada membro do coral tem uma história única de superação. Volte sempre para conhecer mais vencedores.</p>
        </motion.div>

      </div>
    </section>
  );
}
