import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UrbanSection() {
  const projects = [
    {
      id: 1,
      title: 'CODEROOM',
      subtitle: 'Real-time Code Editor',
      tags: ['FULL-STACK', 'NODE & REDIS', 'DOCKER'],
      desc: 'Real-time collaborative code editor with Socket.IO and isolated Docker environment execution.',
      images: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      ],
    },
    {
      id: 2,
      title: 'FLOEMA 3D STUDIO',
      subtitle: 'WebGL Interactive Portfolio',
      tags: ['3D & CANVAS', 'THREE.JS', 'NEXT.JS'],
      desc: 'Interactive WebGL portfolio featuring custom shader particles and dynamic image tunnels.',
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80',
      ],
    },
    {
      id: 3,
      title: 'DEV FEED PLATFORM',
      subtitle: 'Community Platform',
      tags: ['REACT & NEXT', 'MONGO DB', 'EXPRESS'],
      desc: 'Full-featured social feed platform built with server-side caching and dynamic feed aggregation.',
      images: [
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
        'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80',
      ],
    },
    {
      id: 4,
      title: 'FOSTUI LIBRARY',
      subtitle: 'Accessible UI Kit',
      tags: ['REACT & NEXT', 'TAILWIND CSS', 'TYPESCRIPT'],
      desc: 'Custom headless component library engineered for high performance and strict accessibility standards.',
      images: [
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
      ],
    },
    {
      id: 5,
      title: 'BACKEND SCALER',
      subtitle: 'Distributed Microservices',
      tags: ['NODE & REDIS', 'KAFKA', 'GO'],
      desc: 'High throughput distributed API Gateway utilizing Redis caching layer and background job workers.',
      images: [
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      ],
    },
    {
      id: 6,
      title: 'AURA AI SEARCH Engine',
      subtitle: 'Semantic Vector Search Engine',
      tags: ['PYTHON', 'PINECONE', 'OPENAI'],
      desc: 'AI-powered document indexing engine with instant semantic search and query contextualization.',
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
      ],
    },
    {
      id: 7,
      title: 'NEBULA CLOUD DASHBOARD',
      subtitle: 'Serverless Deployment Dashboard',
      tags: ['AWS', 'KUBERNETES', 'NEXT.JS'],
      desc: 'Unified developer platform for automated cloud container deployments and monitoring metrics.',
      images: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
      ],
    },
    {
      id: 8,
      title: 'PULSE ANALYTICS',
      subtitle: 'Real-time Event Tracker',
      tags: ['CLICKHOUSE', 'NODE.JS', 'REACT'],
      desc: 'Ultra-low latency web telemetry and event streaming system processing millions of hits daily.',
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
      ],
    },
    {
      id: 9,
      title: 'KINETIC SOUND',
      subtitle: 'Spatial Audio Web Synthesizer',
      tags: ['WEB AUDIO API', 'CANVAS', 'REACT'],
      desc: 'Browser-based generative audio synthesizer with real-time waveform particle visualization.',
      images: [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      ],
    },
    {
      id: 10,
      title: 'CYPHER WALLET',
      subtitle: 'Non-Custodial Crypto Platform',
      tags: ['WEB3.JS', 'SOLANA', 'TAILWIND'],
      desc: 'DeFi asset management dashboard providing secure multi-chain swap operations and NFT gallery.',
      images: [
        'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=800&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80',
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const currentProject = projects[activeIndex];
  const sectionRef = useRef(null);

  // Wheel listener with strict boundary locking
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let isCooldown = false;

    const onWheel = (e) => {
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      const isAtTopBoundary = activeIndex === 0 && isScrollingUp;
      const isAtBottomBoundary = activeIndex === projects.length - 1 && isScrollingDown;

      if (!isAtTopBoundary && !isAtBottomBoundary) {
        e.preventDefault();
        e.stopPropagation();

        if (isCooldown) return;
        isCooldown = true;

        if (isScrollingDown) {
          setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1));
        } else if (isScrollingUp) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        }

        setTimeout(() => {
          isCooldown = false;
        }, 180);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [activeIndex, projects.length]);

  return (
    <section 
      ref={sectionRef}
      className="w-full h-screen bg-[#181C14] text-white flex items-center   md:p-12 overflow-hidden select-none font-sans"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
        
        {/* LEFT SIDE: Fixed VIEW Badge + Indented Titles Wheel */}
        <div className="lg:col-span-7 flex items-center h-full relative overflow-hidden pl-2">
          
          {/* FIXED VIEW BADGE (Extreme Left Position) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <span className="border border-neutral-400 text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded text-neutral-200 bg-neutral-900 uppercase">
              VIEW
            </span>
          </div>

          {/* TITLES WHEEL LIST */}
          <div className="w-full relative h-[520px] flex items-center">
            {projects.map((proj, idx) => {
              const isActive = activeIndex === idx;
              const offset = idx - activeIndex;

              // Vertical Offset Calculation
              const translateY = offset * 100;

              return (
                <motion.div
                  key={proj.id}
                  onClick={() => setActiveIndex(idx)}
                  animate={{
                    y: translateY,
                    // Active project pushes right (x: 65px) to accommodate [VIEW] badge
                    x: isActive ? 65 : 0,
                    opacity: isActive ? 1 : Math.abs(offset) === 1 ? 0.35 : Math.abs(offset) === 2 ? 0.12 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                  className="absolute left-0 cursor-pointer origin-left "
                >
                  <h2
                    className={`text-3xl sm:text-5xl md:text-9xl font-black tracking-light uppercase leading-none transition-all duration-300 ${
                      isActive
                        ? 'text-[#F2EFE0] blur-none font-light font-shamgod '
                        : 'text-neutral-500 blur-[10px] hover:text-neutral-300 font-light font-shamgod '
                    }`}
                  >
                    {proj.title}
                  </h2>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: Active Project Media & Meta Details */}
        <div className="lg:col-span-5 h-full flex flex-col justify-center items-start pl-0 lg:pl-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full space-y-6"
            >
              {/* Media Cards Preview */}
              <div className="grid grid-cols-2 gap-4">
                {currentProject.images.map((imgUrl, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                    className="h-48 sm:h-56 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl relative group"
                  >
                    <img
                      src={imgUrl}
                      alt={currentProject.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Meta Content */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap gap-2">
                  {currentProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono bg-neutral-800/80 text-neutral-300 px-2.5 py-1 rounded border border-neutral-700/50 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-bold text-white tracking-wide">
                  {currentProject.subtitle}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {currentProject.desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}