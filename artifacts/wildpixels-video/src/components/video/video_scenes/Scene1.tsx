import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, transition: { duration: 1 } }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/lion-dark.jpg`} 
          className="w-full h-full object-cover grayscale mix-blend-luminosity" 
          alt="" 
        />
      </motion.div>

      {phase >= 1 && (
        <motion.div className="absolute top-[45%] left-1/2 -translate-x-1/2 h-[1px] bg-primary"
          initial={{ width: 0, opacity: 0 }} 
          animate={{ width: '30vw', opacity: 0.5 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} />
      )}

      <div className="z-10 flex flex-col items-center">
        <motion.h1 
          className="text-[6vw] font-display text-text-primary tracking-[0.2em] uppercase font-light"
          initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { y: 0, opacity: 1, filter: 'blur(0px)' } : { y: 20, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Wildpixels
        </motion.h1>
        
        <motion.p
          className="text-[1.2vw] font-body text-primary tracking-[0.4em] uppercase mt-6"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          Photography Portfolio
        </motion.p>
      </div>
    </motion.div>
  );
}
