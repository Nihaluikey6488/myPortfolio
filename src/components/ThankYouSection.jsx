import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ThankYouSection() {
  const sectionRef = useRef(null);
  const textLeftRef = useRef(null);
  const textRightRef = useRef(null);
  const titleThankRef = useRef(null);
  const titleYouRef = useRef(null);
  const underlineRef = useRef(null);
  const craneLeftRef = useRef(null);
  const craneRightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%', // Jab section screen ke 70% par aayega tab trigger hoga
          toggleActions: 'play none none reverse',
        },
      });

      // 1. Cranes slide in from sides with fade
      tl.fromTo(
        craneLeftRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 0.85, duration: 1.2, ease: 'power3.out' },
        0
      )
      .fromTo(
        craneRightRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 0.9, duration: 1.2, ease: 'power3.out' },
        0
      )
      // 2. Side paragraphs fade up
      .fromTo(
        [textLeftRef.current, textRightRef.current],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
        0.3
      )
      // 3. THANK and YOU text scale & reveal from bottom
      .fromTo(
        titleThankRef.current,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 2, ease: 'back.out(1.2)' },
        0.4
      )
      .fromTo(
        titleYouRef.current,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 2, ease: 'back.out(1.2)' },
        0.55
      )
      // 4. Underline stroke draw / scale animation
      .fromTo(
        underlineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.8
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-screen bg-[#E83C12] text-white flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none font-sans"
    >
      
      {/* 1. PAPER & CARDBOARD TEXTURE OVERLAY */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none mix-blend-multiply z-0"
        style={{
          backgroundImage: `url("https://i.pinimg.com/736x/94/e8/89/94e889e72e4d4faa0565a8b8a019fbf3.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="relative w-full max-w-7xl h-full flex flex-col justify-center items-center z-10">
        
        {/* LEFT PARAGRAPH TEXT */}
        <div ref={textLeftRef} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 max-w-[140px] sm:max-w-[180px] z-30 will-change-transform">
          <p className="text-[10px] sm:text-[11px] text-[#F2EBD9]/90 leading-tight font-sans tracking-tight">
            Presentations are tools that can be used as lectures, speeches, reports, and more. It is mostly presented like before an audience.
          </p>
        </div>

        {/* RIGHT BOTTOM PARAGRAPH TEXT */}
        <div ref={textRightRef} className="absolute right-16 sm:right-32 bottom-8 sm:bottom-12 max-w-[140px] sm:max-w-[180px] z-30 will-change-transform">
          <p className="text-[10px] sm:text-[11px] text-[#F2EBD9]/90 leading-tight font-sans tracking-tight">
            Presentations are tools that can be used as lectures, speeches, reports, and more. It is mostly presented like before an audience.
          </p>
        </div>

        {/* CENTER TYPOGRAPHY: "THANK YOU" */}
        <div className="relative z-20 flex flex-col items-center">
          <div className="flex flex-col items-center leading-[0.8] text-center">
            <h1 
              ref={titleThankRef}
              className="text-[10rem] sm:text-[15rem] md:text-[19rem] font-black uppercase text-[#F2EBD9] select-none tracking-tighter will-change-transform"
              style={{
                fontFamily: `'Impact', 'Arial Black', sans-serif`,
                textShadow: '2px 2px 0px rgba(0,0,0,0.15)',
              }}
            >
              THANK
            </h1>
            <h1 
              ref={titleYouRef}
              className="text-[10rem] sm:text-[15rem] md:text-[19rem] font-black uppercase text-[#F2EBD9] select-none tracking-tighter will-change-transform"
              style={{
                fontFamily: `'Impact', 'Arial Black', sans-serif`,
                textShadow: '2px 2px 0px rgba(0,0,0,0.15)',
              }}
            >
              YOU
            </h1>
          </div>

          {/* HAND-DRAWN BLACK UNDERLINE ACCENT */}
          <div ref={underlineRef} className="w-56 sm:w-80 md:w-96 h-6 -mt-2 sm:-mt-4 relative z-30 origin-left will-change-transform">
            <svg viewBox="0 0 300 24" fill="none" className="w-full h-full stroke-black stroke-[3.5]">
              <path d="M 5 12 Q 150 20 295 6" strokeLinecap="round" />
              <path d="M 25 18 Q 160 22 275 10" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* LEFT CRANE CUTOUT GRAPHIC */}
        <div ref={craneLeftRef} className="absolute -left-12 sm:left-0 bottom-0 w-64 sm:w-96 h-2/5 sm:h-1/2 pointer-events-none z-10 will-change-transform">
          <img
            src="https://i.pinimg.com/736x/94/e8/89/94e889e72e4d4faa0565a8b8a019fbf3.jpg"
            alt="Tower Crane Left"
            className="w-full h-full object-cover mix-blend-multiply contrast-150 sepia brightness-90"
            style={{
              clipPath: 'polygon(0% 0%, 100% 40%, 100% 100%, 0% 100%)',
            }}
          />
        </div>

        {/* RIGHT CRANE TOWER GRAPHIC */}
        <div ref={craneRightRef} className="absolute right-0 top-0 bottom-0 w-60 sm:w-80 h-full pointer-events-none z-10 flex items-end justify-end will-change-transform">
          <img
            src="https://i.pinimg.com/1200x/35/ac/f8/35acf871ae1a6f6c8defbe0b43c748a4.jpg"
            alt="Tower Crane Right"
            className="w-full h-full sm:h-4/5 object-cover mix-blend-multiply contrast-150 sepia brightness-90"
          />
        </div>

      </div>
    </section>
  );
}