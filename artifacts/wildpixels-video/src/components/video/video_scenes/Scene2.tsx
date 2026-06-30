import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-end justify-center overflow-hidden bg-[#0A0A0A] pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)', transition: { duration: 1.2 } }}
      transition={{ duration: 1.2 }}
    >
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      >
        <img 
          src="https://lh3.googleusercontent.com/pw/AP1GczOSWkv8ygk7qOG4wCKZBDZQSQHbWA618IcemAOTYIqJbkHyNZG_nc7iTpGI1C_UWXc-ZSvPCzH9l82qHsYQFVCZA6PeztNRnBH14P9QBmK_3nnA7Cwu=w1920" 
          className="w-full h-full object-cover" 
          alt="Tigers" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
      </motion.div>

      <div className="z-10 text-center">
        <motion.p
          className="text-[1.8vw] font-display text-[#C4862A] tracking-[0.2em] uppercase font-semibold"
          style={{ textShadow: '0 0 20px rgba(196,134,42,0.5)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          F2 AND HER CUBS · Gothangaon
        </motion.p>
      </div>
    </motion.div>
  );
}
