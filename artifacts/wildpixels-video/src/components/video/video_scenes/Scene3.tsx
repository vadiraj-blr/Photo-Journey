import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden flex bg-[#0A0A0A]"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-10%', opacity: 0, transition: { duration: 1 } }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-[40%] h-full flex flex-col justify-center px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <h2 className="text-[4vw] font-display text-[#F5F3EF] leading-none uppercase tracking-wide">
            The Cheetah<br />
            <span className="text-[#C4862A] italic font-light tracking-normal lowercase text-[4.5vw]">returns</span>
          </h2>
        </motion.div>
        
        <motion.div
          className="mt-6 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-[1px] w-12 bg-[#C4862A]" />
          <p className="text-[1vw] font-body text-[#C4862A] tracking-[0.2em] uppercase">Kuno National Park</p>
        </motion.div>
      </div>

      <motion.div 
        className="w-[60%] h-full relative overflow-hidden"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 w-32" />
        <img 
          src="https://lh3.googleusercontent.com/pw/AP1GczOHFj9u4xKOfVZXe47DFjUR-fL7rvIxex-SLz9NLYLBoQrZvUH_RsNmZ5JscUGwgijztIhpsxJFqBYJrwTkyIsoSa2AqXoglKQyuiVXomrxYJYFL0Wp=w1920" 
          className="w-full h-full object-cover" 
          alt="Cheetah" 
        />
      </motion.div>
    </motion.div>
  );
}
