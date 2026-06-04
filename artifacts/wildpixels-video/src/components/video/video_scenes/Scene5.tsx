import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,134,42,0.1),transparent_70%)]" />

      <div className="text-center z-10 flex flex-col items-center">
        <motion.p
          className="text-[1.2vw] font-body text-primary tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 1 }}
        >
          Captured by
        </motion.p>

        <motion.h2 
          className="text-[4vw] font-display text-text-primary"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Vadiraj <span className="text-primary italic">—</span> Wildpixels.co
        </motion.h2>
      </div>
    </motion.div>
  );
}
