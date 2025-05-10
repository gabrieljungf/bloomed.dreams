"use client";

import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { DreamClock } from './icons/dream-clock';
import { DreamEye } from './icons/dream-eye';
import { DreamGrowth } from './icons/dream-growth';

const benefits = [
  {
    icon: DreamClock,
    title: "Instant Dream Insights",
    description: "Unlock the meaning of your dreams in real time with personalized guidance"
  },
  {
    icon: DreamEye,
    title: "Decode the Hidden Language",
    description: "Discover the secret messages your subconscious sends while you sleep"
  },
  {
    icon: DreamGrowth,
    title: "Bloom Through Your Dreams",
    description: "Let your dreams guide you toward the person you're meant to become"
  }
];

export function Benefits() {
  const containerRef = useRef<HTMLDivElement>(null); // containerRef não está sendo usado, mas não causa erro.

  const animateIcon = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const iconElement = e.currentTarget.querySelector('.benefit-icon');

    // Verifique se iconElement existe E se é uma instância de HTMLElement
    if (iconElement instanceof HTMLElement) {
      // Dentro deste bloco, o TypeScript agora sabe que iconElement é um HTMLElement
      iconElement.classList.remove('animate-float');
      void iconElement.offsetWidth; // Isso agora é seguro
      iconElement.classList.add('animate-float');
    } else if (iconElement) {
      // Opcional: Se for um Element mas não HTMLElement, você pode logar um aviso
      // ou lidar com isso de outra forma, mas para offsetWidth, precisa ser HTMLElement.
      console.warn("Benefit icon found, but it's not an HTMLElement:", iconElement);
    }
  }, []);

  return (
    <div
      ref={containerRef} // containerRef não parece ser usado para nada neste trecho
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 max-w-[1200px] mx-auto"
    >
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{
            y: -3,
            transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
          }}
          className="relative flex flex-col items-center p-6 md:p-8
            backdrop-blur-[2px] rounded-2xl
            bg-gradient-to-b from-purple-100/[0.05] to-transparent
            hover:from-purple-100/[0.1] hover:to-transparent
            transition-all duration-400 group
            border border-purple-300/5 hover:border-purple-300/10
            shadow-[0_8px_24px_-8px_rgba(139,92,246,0.15)]
            hover:shadow-[0_16px_32px_-8px_rgba(139,92,246,0.25)]
            max-w-[320px] mx-auto w-full min-h-[240px] md:min-h-[280px]"
          onMouseEnter={animateIcon} // A função animateIcon é chamada aqui
        >
          {/* O elemento com a classe 'benefit-icon' é este div abaixo */}
          <div className="text-purple-400 mb-4 md:mb-6 benefit-icon transition-all duration-700
            group-hover:scale-105 group-hover:rotate-[4deg]
            [filter:drop-shadow(0_0_12px_rgba(167,139,250,0.2))]
            group-hover:[filter:drop-shadow(0_0_16px_rgba(167,139,250,0.3))]
            animate-pulse-subtle">
            <benefit.icon /> {/* Seus componentes de ícone SVG */}
          </div>

          <div className="text-center space-y-2 md:space-y-5 relative">
            <h3 className="text-base md:text-[18px] font-semibold tracking-tight
              bg-gradient-to-r from-purple-200/95 via-purple-300 to-purple-200/95
              bg-clip-text text-transparent
              [text-shadow:0_0_30px_rgba(233,213,255,0.15)]
              group-hover:from-purple-100 group-hover:to-purple-400
              transition-all duration-500">
              {benefit.title}
            </h3>

            <p className="text-[#E9D5FF]/70 text-[14px] leading-relaxed tracking-wide font-light
              max-w-[260px] group-hover:text-[#E9D5FF]/80 transition-colors duration-500
              [text-shadow:0_0_20px_rgba(233,213,255,0.1)]">
              {benefit.description}
            </p>
          </div>

          {/* Subtle star pattern */}
          <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05]
            transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 20%),
                                radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 20%)`,
                backgroundSize: '100% 100%, 50% 50%, 50% 50%',
                backgroundPosition: 'center, top right, bottom left',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>

          {/* Glow border */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b
            from-purple-300/5 to-transparent opacity-0 group-hover:opacity-100
            transition-opacity duration-500 pointer-events-none blur-[1px]" />
        </motion.div>
      ))}
    </div>
  );
}