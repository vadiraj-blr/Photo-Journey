import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.8 } }}
      transition={{ duration: 0.8 }}
    >
      {phase >= 1 && (
        <motion.div 
          className="absolute top-1/2 left-0 h-[2px] bg-[#C4862A] -translate-y-1/2 z-0"
          initial={{ width: 0, opacity: 0 }} 
          animate={{ width: '100vw', opacity: 0.6 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} 
        />
      )}

      <div className="z-10 flex flex-col items-center justify-center px-12 py-6">
        <motion.h1 
          className="text-[8vw] font-display text-[#F5F3EF] tracking-[0.15em] uppercase font-light leading-none"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 1.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          Wildpixels
        </motion.h1>
      </div>
    </motion.div>
  );
}
