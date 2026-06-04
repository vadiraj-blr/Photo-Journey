import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/savannah.jpg`} 
          className="w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/80 to-transparent" />
      </motion.div>

      <div className="absolute left-[15%] flex flex-col justify-center h-full max-w-[40%] z-10">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: '100%' }}
            animate={phase >= 1 ? { y: 0 } : { y: '100%' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-[12vw] font-display text-primary leading-none -ml-2">20+</h2>
          </motion.div>
        </div>
        
        <div className="mt-4 pl-2 border-l border-primary/30">
          <motion.p
            className="text-[2vw] font-display text-text-primary tracking-wide mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Global Expeditions
          </motion.p>
          <motion.p
            className="text-[1vw] font-body text-text-muted leading-relaxed"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            From the untamed savannas of Africa to the deep ice fields of Patagonia. Witnessing the sublime.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
