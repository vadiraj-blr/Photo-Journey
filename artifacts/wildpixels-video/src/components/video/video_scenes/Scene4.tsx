import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden bg-[#0A0A0A] flex flex-col justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 1.1, filter: 'blur(10px)', opacity: 0, transition: { duration: 1 } }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 flex">
        {/* Kaziranga */}
        <motion.div 
          className="h-full relative overflow-hidden"
          style={{ width: '33.333%' }}
          initial={{ y: '100%' }}
          animate={phase >= 1 ? { y: 0 } : { y: '100%' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img 
            src="https://lh3.googleusercontent.com/pw/AP1GczOLYowST2soOmh0YEsQDumlHVMFDhptWzlTe6lh27y0qPqHBQLv9m20KyjSEq7JXlWbT_LR4z1PV7141BUce5ZEIVNruopYacYT7NOMGmnaxE3t6I-U=w1920"
            className="w-full h-full object-cover"
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'easeOut' }}
            alt="Kaziranga"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/40" />
        </motion.div>

        {/* Kabini */}
        <motion.div 
          className="h-full relative overflow-hidden border-x border-[#111]"
          style={{ width: '33.333%' }}
          initial={{ y: '-100%' }}
          animate={phase >= 2 ? { y: 0 } : { y: '-100%' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img 
            src="https://lh3.googleusercontent.com/pw/AP1GczMaUtfe0CJKYmhm681RJshtoRfI4hzcs8nWQY9wKkyewAyEQ9esShUffZl5qRrEVquocwosfRSt6tqus6bv5T_jlJjTpjnccbApExhp5B0cIBpHRZoO=w1920"
            className="w-full h-full object-cover"
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'easeOut' }}
            alt="Kabini"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/40" />
        </motion.div>

        {/* Tal Chapar */}
        <motion.div 
          className="h-full relative overflow-hidden"
          style={{ width: '33.333%' }}
          initial={{ y: '100%' }}
          animate={phase >= 3 ? { y: 0 } : { y: '100%' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img 
            src="https://lh3.googleusercontent.com/pw/AP1GczO5Sqsy7hUbRYQ3TJ4RcsIAjcDidrYsrd9OJTDftpeRHT6oTD7zo3LmpYIKplMDJHyzp5kE0spelSyh7MIpfHdas5KCHxSXCf7RSJ71ulTqHbTLLZ6D=w1920"
            className="w-full h-full object-cover"
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'easeOut' }}
            alt="Tal Chapar"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/40" />
        </motion.div>
      </div>

      <motion.div 
        className="z-10 bg-[#0A0A0A]/80 backdrop-blur-sm px-16 py-8 border border-[#C4862A]/30 rounded-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h2 className="text-[3vw] font-display text-[#F5F3EF] tracking-[0.1em] uppercase font-light">
          India's Wild Heart
        </h2>
      </motion.div>
    </motion.div>
  );
}
