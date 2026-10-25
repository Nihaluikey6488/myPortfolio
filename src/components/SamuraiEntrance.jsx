import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SamuraiEntrance({ onEnterComplete }) {
  const [isSlashing, setIsSlashing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleTrigger = () => {
    if (isSlashing) return;
    setIsSlashing(true);

    setTimeout(() => {
      setIsComplete(true);
      if (onEnterComplete) onEnterComplete();
    }, 1100);
  };

  if (isComplete) return null;

  return (
    <div 
      onClick={handleTrigger}
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer bg-[#121212] flex items-center justify-center select-none"
    >
      <AnimatePresence>
        {!isComplete && (
          <>
            {/* TOP/LEFT DIAGONAL HALF */}
            <motion.div
              animate={
                isSlashing 
                  ? { x: '-100%', y: '-100%', opacity: 0 } 
                  : { x: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: 0.15 }}
              style={{
                clipPath: isSlashing ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              }}
              className="absolute inset-0 z-10 w-full h-full overflow-hidden bg-[#1a1a1a]"
            >
              {/* Background Video Player */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-90"
              >
                {/* Public folder mein samurai.mp4 rakho ya apna video src link dalo */}
                <source src="/samurai.mp4" type="video/mp4" />
                {/* Fallback image agar video na chale */}
                <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&q=80" alt="Samurai" className="w-full h-full object-cover" />
              </video>

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <div className="w-16 h-16 mb-4 border border-white/30 flex items-center justify-center rounded-full bg-black/30">
                  <span className="text-white text-2xl font-light">⚔</span>
                </div>
                <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/90 animate-pulse">
                  [ CLICK TO SLASH & ENTER ]
                </p>
              </div>
            </motion.div>

            {/* BOTTOM/RIGHT DIAGONAL HALF */}
            <motion.div
              animate={
                isSlashing 
                  ? { x: '100%', y: '100%', opacity: 0 } 
                  : { x: 0, y: 0, opacity: 0 }
              }
              transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: 0.15 }}
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
              }}
              className="absolute inset-0 z-10 w-full h-full overflow-hidden bg-[#1a1a1a]"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-90"
              >
                <source src="/samurai.mp4" type="video/mp4" />
              </video>
            </motion.div>

            {/* SLASH LIGHTNING FLASH LINE */}
            {isSlashing && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute w-[160%] h-[3px] bg-white shadow-[0_0_25px_#fff,0_0_50px_#60a5fa] z-30 transform -rotate-45 pointer-events-none"
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}