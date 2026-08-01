import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      transition={{ duration: 1.5 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,134,42,0.15),transparent_70%)] opacity-50" />

      <div className="text-center z-10 flex flex-col items-center">
        <motion.h2 
          className="text-[6vw] font-display text-[#F5F3EF] tracking-[0.2em] uppercase font-light leading-none mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Wildpixels
        </motion.h2>

        <motion.p
          className="text-[1.2vw] font-body text-[#C4862A] tracking-[0.3em] uppercase mb-12"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          India's Wild Heart · Documented
        </motion.p>

        <motion.div
          className="flex gap-8 text-[#888888] font-body text-[1vw] tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <span className="hover:text-[#F5F3EF] transition-colors">Instagram @vadiraj.bk</span>
          <span className="text-[#C4862A]">·</span>
          <span className="hover:text-[#F5F3EF] transition-colors">thewildpixels.com</span>
          <span className="text-[#C4862A]">·</span>
          <span className="hover:text-[#F5F3EF] transition-colors">vadiraj.bk@gmail.com</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
