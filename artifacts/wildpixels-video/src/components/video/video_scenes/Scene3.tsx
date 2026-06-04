import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden"
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      exit={{ x: '-10%', opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className="absolute inset-0"
        animate={{ scale: [1.1, 1] }}
        transition={{ duration: 5, ease: 'easeOut' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/jaguar.jpg`} 
          className="w-full h-full object-cover" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-transparent to-bg-dark/40" />
      </motion.div>

      <div className="absolute bottom-[15%] right-[10%] text-right">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h2 className="text-[4vw] font-display text-text-primary italic font-light">The untamed</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[1vw] font-body text-primary tracking-[0.2em] uppercase mt-2">Close Encounters</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
