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
      className="absolute inset-0 overflow-hidden bg-[#0A0A0A]"
      initial={{ clipPath: 'circle(0% at center)' }}
      animate={{ clipPath: 'circle(150% at center)' }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 flex flex-row">
        {/* Monal — Himalayan Birds, left panel */}
        <motion.div
          className="w-1/2 h-full relative overflow-hidden"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img 
            src="https://lh3.googleusercontent.com/pw/AP1GczOuhNFdUODfz4zADEoGPpnoCr6RQW2Z3PchNFm8wXW0sxrMPAK0livXZa5igzcLufamu3tzlOpn7W4niQaCn1xQYD3zYtXljPpHQJln5WjtPbdi3Y3X=w1920"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 5, ease: 'easeOut' }}
            alt="Himalayan Monal"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]/60" />
        </motion.div>
        
        {/* Coastal Bird — Rameshwaram, right panel */}
        <motion.div
          className="w-1/2 h-full relative overflow-hidden"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img 
            src="https://lh3.googleusercontent.com/pw/AP1GczM5u5Xus0YkM9uTsn8pvIs_-yiHooBuh_goZTi0VLp_J87fGaQgESnfAu9_9lYGYXHG7of4PehQ-PwFPw-Ml8bKKarDsUycGN0599bqydcwF8Cek-yV=w1920"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 5, ease: 'easeOut' }}
            alt="Rameshwaram Coastal Bird"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0A0A]/60" />
        </motion.div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-full h-32 bg-gradient-to-b from-transparent via-[#0A0A0A]/90 to-transparent flex items-center justify-center"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={phase >= 1 ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.p
            className="text-[2.5vw] font-display text-[#C4862A] tracking-[0.15em] uppercase font-light"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
          >
            From the Himalayas to the Shore
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
