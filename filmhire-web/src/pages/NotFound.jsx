import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export const NotFoundPage = () => {
  // Capture mouse coordinates for the dynamic background glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 overflow-hidden px-4 group/container"
    >
      {/* 1. Dynamic Mouse-Tracking Ambient Glow */}
      <motion.div
        className="absolute pointer-events-none rounded-full opacity-0 group-hover/container:opacity-100 transition-opacity duration-500 blur-[140px] w-[500px] h-[500px] bg-zinc-800/20"
        style={{
          background: useMotionTemplate`
            radial-gradient(circle, rgba(63,63,70,0.15) 0%, transparent 70%)
          `,
          left: useMotionTemplate`${mouseX}px`,
          top: useMotionTemplate`${mouseY}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Static deep center glow fallback */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 select-none pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        
        {/* 2. Enhanced Interactive 404 Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative group select-none cursor-default"
        >
          <h1 className="text-[12rem] font-extrabold tracking-tighter text-zinc-900 leading-none transition-all duration-500 group-hover:text-zinc-800 group-hover:scale-[1.02]">
            404
          </h1>
          {/* Subtle glitch accent layer visible on hover */}
          <h1 className="absolute inset-0 text-[12rem] font-extrabold tracking-tighter text-zinc-100 opacity-0 group-hover:opacity-5 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 leading-none pointer-events-none">
            404
          </h1>
        </motion.div>

        {/* Message Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 -mt-2"
        >
          <h2 className="text-xl font-medium tracking-tight text-zinc-100">
            Lost in the digital void
          </h2>
          <p className="text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or lives in another dimension.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3 w-full mt-8 justify-center"
        >
          {/* Go Back Button (Magnetic Hover Simulation) */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/80 hover:border-zinc-700 text-zinc-300 font-medium text-sm transition-all duration-200 backdrop-blur-sm"
          >
            Go Back
          </motion.button>

          {/* Return Home Button */}
          <motion.a 
            href="/"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-sm transition-all duration-200 shadow-lg shadow-zinc-950/10 hover:shadow-zinc-50/5"
          >
            Return Home
          </motion.a>
        </motion.div>
      </div>
      
      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-8 text-[10px] tracking-[0.2em] uppercase text-zinc-600 font-mono select-none"
      >
        System Status: Page Unresolved
      </motion.div>
    </div>
  );
};