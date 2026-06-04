import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden"
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      exit={{ scale: 1.1, opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className="absolute inset-0"
        initial={{ y: '-5%' }}
        animate={{ y: '5%' }}
        transition={{ duration: 5, ease: 'linear' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/patagonia.jpg`} 
          className="w-full h-full object-cover" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/90 via-bg-dark/20 to-transparent" />
      </motion.div>

      <div className="absolute top-[20%] left-[10%]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <h2 className="text-[4.5vw] font-display text-text-primary leading-tight">
            Sweeping<br />
            <span className="italic text-primary font-light">Landscapes</span>
          </h2>
        </motion.div>
        
        <motion.div
          className="w-12 h-[2px] bg-primary mt-6"
          initial={{ scaleX: 0 }}
          animate={phase >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
