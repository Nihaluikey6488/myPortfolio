import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TECH_STACK = [
  "REACT.JS",
  "NEXT.JS",
  "NODE.JS",
  "TYPESCRIPT",
  "JAVASCRIPT",
  "EXPRESS.JS",
  "REST APIS",
  "WEBSOCKETS",
  "TAILWIND CSS",
  "GSAP",
  "MONGODB",
  "POSTGRESQL",
  "MYSQL",
  "REDIS",
  "C PROGRAMMING",
  "GIT / GITHUB",
];

const EDUCATION_DATA = [
  {
    institution: "BCA / GHRIIT Nagpur (RTMNU)",
    years: "(2019 - 2022)",
    description:
      "Specialized in Software Engineering, Computer Applications, Algorithms, and Core Database Management Systems.",
  },
  {
    institution: "Backend Support Lead / Phoenix Softworld",
    years: "(2022 - 2025)",
    description:
      "Managed production SQL databases, optimized complex relational queries, and led front-desk executive engineering teams.",
  },
  {
    institution: "Full Stack & Realtime Systems",
    years: "(2025 - PRESENT)",
    description:
      "Architected CodeRoom (collaborative editor using Socket.IO & Redis) and type-safe modular UI design systems.",
  },
];

// Snake Body Segments Count
const SNAKE_SEGMENTS = 14;

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  // Mouse & Snake Chain Positions Array
  const mousePos = useRef({ x: -100, y: -100 });
  const snakeChain = useRef(
    Array.from({ length: SNAKE_SEGMENTS }, () => ({ x: -100, y: -100 }))
  );

  const snakeRefs = useRef([]);
  const headRef = useRef(null);

  // Animation & Marquee Refs
  const pageRef = useRef(null);
  const loaderRef = useRef(null);
  const introRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const eduRef = useRef(null);

  // --- 1. PRELOADER ANIMATION ---
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 12) + 5;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        
        if (loaderRef.current) {
          gsap.to(loaderRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
            onComplete: () => setLoading(false),
          });
        }
      }
      setCounter(count);
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // --- 2. SNAKE CHAIN INVERSE KINEMATICS PHYSICS ENGINE ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId;

    const animateSnake = () => {
      // 1. Head follows the actual mouse position smoothly
      snakeChain.current[0].x += (mousePos.current.x - snakeChain.current[0].x) * 0.35;
      snakeChain.current[0].y += (mousePos.current.y - snakeChain.current[0].y) * 0.35;

      // Render Snake Head
      if (headRef.current) {
        gsap.set(headRef.current, {
          x: snakeChain.current[0].x,
          y: snakeChain.current[0].y,
        });
      }

      // 2. Body Segments follow the preceding segment (Linked Snake Effect)
      for (let i = 1; i < SNAKE_SEGMENTS; i++) {
        const prevSegment = snakeChain.current[i - 1];
        const currentSegment = snakeChain.current[i];

        // Segment distance dynamics (Snapping distance)
        const dx = prevSegment.x - currentSegment.x;
        const dy = prevSegment.y - currentSegment.y;
        const angle = Math.atan2(dy, dx);

        // Segment easing speed
        currentSegment.x += dx * 0.35;
        currentSegment.y += dy * 0.35;

        // Render segment DOM element
        if (snakeRefs.current[i]) {
          gsap.set(snakeRefs.current[i], {
            x: currentSegment.x,
            y: currentSegment.y,
            rotation: (angle * 180) / Math.PI,
          });
        }
      }

      animationFrameId = requestAnimationFrame(animateSnake);
    };

    animationFrameId = requestAnimationFrame(animateSnake);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- 3. SCROLL-TRIGGERED SLOW & STEADY MARQUEE ---
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Intro Reveal Sequence
      if (introRef.current) {
        tl.fromTo(
          introRef.current.querySelectorAll(".anim-intro"),
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }
        );
      }

      // Left-To-Right Scroll-driven Marquee
      if (marqueeTrackRef.current) {
        gsap.fromTo(
          marqueeTrackRef.current,
          { xPercent: -30 },
          {
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: marqueeTrackRef.current.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          }
        );
      }

      // Education Section ScrollTrigger
      if (eduRef.current) {
        gsap.fromTo(
          eduRef.current.querySelectorAll(".anim-edu"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: eduRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen bg-[#111111] text-[#F2EBD9] font-mono select-none overflow-x-hidden cursor-none"
    >
      {/* --- PRELOADER LOADER --- */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col justify-between p-10 font-shamgod text-[#F2EBD9]"
      >
        <div className="flex justify-between items-center text-xs tracking-widest text-neutral-400 font-mono">
        </div>
        <div className="text-[5vw] leading-none font-extrabold self-end font-nura">
          {counter}%
        </div>
      </div>

      {/* --- SNAKE CURSOR SYSTEM --- */}
      {/* Snake Head */}
      <div
        ref={headRef}
        className="fixed top-0 left-0 w-6 h-6 bg-[#F2EBD9] border border-black/40 rounded-full pointer-events-none z-[95] -translate-x-1/2 -translate-y-1/2 mix-blend-difference will-change-transform shadow-lg"
      />

      {/* Snake Body Chain Segments (Tapering Body from Head to Tail) */}
      {[...Array(SNAKE_SEGMENTS)].map((_, i) => {
        if (i === 0) return null; // Skip head
        const size = Math.max(18 - i * 1.1, 4); // Tapering diameter
        const opacity = Math.max(0.9 - i * 0.05, 0.2);

        return (
          <div
            key={i}
            ref={(el) => (snakeRefs.current[i] = el)}
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[90] -translate-x-1/2 -translate-y-1/2 bg-[#F2EBD9] mix-blend-difference will-change-transform"
            style={{
              width: `${size}px`,
              height: `${size * 0.75}px`, // Slight oval stretch for realistic snake scale look
              opacity: opacity,
            }}
          />
        );
      })}

      {/* ================= SECTION 1: ABOUT INTRO ================= */}
      <section ref={introRef} className="px-6 md:px-12 pt-10 pb-20 border-b border-neutral-800">
        <div className="anim-intro flex justify-between items-center mb-10 text-xs tracking-widest">
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="anim-intro relative aspect-[4/3] bg-neutral-900 rounded-sm overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
              alt="Nihal Uikey Workspace"
              className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          <div className="space-y-6">
            <h1 className="anim-intro font-nura font-extrabold uppercase text-[10vw] lg:text-[80px] xl:text-[95px] leading-[0.88] tracking-tight">
              HELLO, <br /> I'M NIHAL <br /> UIKEY
            </h1>

            <p className="anim-intro text-xs md:text-sm text-neutral-400 leading-relaxed max-w-xl font-heading">
              I am a Full Stack Engineer and UI/UX Specialist crafting high-performance,
              typography-driven web applications. Driven by complex micro-interactions,
              clean component architecture, and fluid motion design using GSAP and Next.js.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: SLOWER & STEADY TECH STACK MARQUEE ================= */}
      <section className="py-24 border-b border-neutral-800 bg-[#0c0c0c] overflow-hidden">
        <div className="px-6 md:px-12 mb-8 flex justify-between items-center">
        </div>

        {/* Outer Marquee Wrapper */}
        <div className="flex whitespace-nowrap overflow-hidden py-4">
          <div
            ref={marqueeTrackRef}
            className="flex items-center gap-8 text-[6vw] md:text-[60px] font-shamgod font-extrabold uppercase tracking-tight text-[#F2EBD9] will-change-transform"
          >
            {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-8 bg-neutral-900/50 border border-neutral-800 px-8 py-3 rounded-md hover:border-white transition-colors duration-300"
              >
                <span>{tech}</span>
                <span className="text-neutral-600 text-2xl font-mono">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: EDUCATION & EXPERIENCE ================= */}
      <section ref={eduRef} className="px-6 md:px-12 py-20">
        <div className="anim-edu flex justify-between items-center mb-16 text-xs tracking-widest">
          <span className="bg-neutral-200 text-black px-3 py-1 font-bold rounded-sm">
            
          </span>
          <span className="bg-neutral-200 text-black px-3 py-1 font-bold rounded-sm font-heading">
            May 09, 2026
          </span>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="anim-edu font-shamgod font-extrabold uppercase text-[12vw] md:text-[100px] leading-none tracking-tight">
            MY EDUCATION
          </h2>
          <p className="anim-edu text-xs md:text-sm text-neutral-400 leading-relaxed font-heading">
            A comprehensive overview of academic milestones and professional software engineering experience across scalable backend development and modern frontend engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 font-heading">
          {EDUCATION_DATA.map((item, idx) => (
            <div key={idx} className="anim-edu space-y-2 border-l border-neutral-800 pl-6 py-2">
              <div className="flex items-baseline space-x-3">
                <h3 className="font-bold text-sm md:text-base text-white uppercase tracking-wider">
                  {item.institution}
                </h3>
                <span className="text-xs text-neutral-500">{item.years}</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}