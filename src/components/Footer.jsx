import React, { useRef, useEffect } from 'react';
import {Link} from "react-router-dom"
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Footer = () => {
  const footerRef = useRef(null);
  const headlineRef = useRef(null);
  const navRef = useRef(null);
  const lineRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Headline characters stagger entry with transform cleanup for hover
      if (headlineRef.current) {
        const chars = headlineRef.current.querySelectorAll('.char-item');
        tl.fromTo(
          chars,
          { opacity: 0, y: 40 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            stagger: 0.02, 
            ease: "power3.out",
            clearProps: "transform,opacity" // <--- Important: Clears inline styles so Tailwind hover works!
          }
        );
      }

      // 2. Navigation & Socials entry
      if (navRef.current) {
        tl.fromTo(
          navRef.current.children,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            stagger: 0.1, 
            ease: "power2.out",
            clearProps: "transform,opacity"
          },
          "-=0.4"
        );
      }

      // 3. Divider line expansion reveal
      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
          "-=0.3"
        );
      }

      // 4. Bottom details fade-in
      if (bottomRef.current) {
        tl.fromTo(
          bottomRef.current.children,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            stagger: 0.08, 
            ease: "power2.out",
            clearProps: "transform,opacity"
          },
          "-=0.4"
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-farm-dark text-farm-tan font-mono px-6 md:px-12 pt-24 pb-12 overflow-hidden">
      <div className="max-w-[1920px] mx-auto">
        
        {/* --- TOP SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 mb-24 items-start">
          
          {/* Main Headline (Cols 1-3) */}
          <div className="md:col-span-3">
            <h4 className="text-[15px] uppercase tracking-wider font-medium text-farm-muted mb-6 font-heading">
              CONTACT / AVAILABILITY
            </h4>
            
            {/* Interactive Character Hover (Piano Key Effect) */}
            <div 
              ref={headlineRef}
              className="font-shamgod font-extrabold uppercase text-[10vw] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] leading-[0.95] tracking-tight max-w-[600px] select-none"
            >
              
              {/* LINE 1: LET'S */}
              <div className="flex flex-wrap overflow-hidden py-1 items-baseline">
                {"LET".split("").map((char, charIdx) => (
                  <span
                    key={charIdx}
                    className="char-item inline-block transition-transform duration-300 ease-out origin-bottom hover:scale-y-[0.65] hover:opacity-80 cursor-pointer"
                  >
                    {char}
                  </span>
                ))}
                
                {/* Apostrophe */}
                <span className="char-item inline-block font-sans font-normal transition-transform duration-300 ease-out origin-bottom hover:scale-y-[0.65] hover:opacity-80 cursor-pointer px-0.5">
                  ’
                </span>

                <span className="char-item inline-block transition-transform duration-300 ease-out origin-bottom hover:scale-y-[0.65] hover:opacity-80 cursor-pointer">
                  S
                </span>
              </div>

              {/* LINE 2 & 3 */}
              {["TURN IDEAS", "INTO VISUALS."].map((line, lineIdx) => (
                <div key={lineIdx} className="flex flex-wrap overflow-hidden py-1 items-baseline">
                  {line.split("").map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="char-item inline-block transition-transform duration-300 ease-out origin-bottom hover:scale-y-[0.65] hover:opacity-80 cursor-pointer"
                      style={{ width: char === " " ? "0.3em" : "auto" }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </div>
              ))}

            </div>
          </div>

          {/* Navigation/Socials Links (Col 4) */}
          <div ref={navRef} className="md:col-span-1 space-y-24 md:space-y-36 mt-16 md:mt-0">
            <div className="flex flex-col items-start">
              <h5 className="text-[15px] uppercase tracking-wider font-medium text-farm-muted mb-8 self-start md:self-end font-heading">
                NAVIGATION
              </h5>
              <nav className="flex flex-col space-y-2 items-start md:items-end w-full">
                {[{ name: "HOME", path: "/" },
      { name: "ABOUT", path: "/about" },
      { name: "PROJECTS", path: "/projects" }].map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                  
                    className="font-shamgod font-bold uppercase text-[28px] md:text-[36px] tracking-wide hover:opacity-70 transition-opacity"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <h5 className="text-[11px] uppercase tracking-[0.3em] font-medium text-farm-muted mb-8 self-start md:self-end font-heading">
                SOCIALS
              </h5>
              <div className="flex flex-col space-y-2 items-start md:items-end w-full font-shamgod font-bold uppercase text-[28px] md:text-[36px] tracking-wide">
                <a href="https://www.instagram.com/codenihal" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">INSTAGRAM</a>
                <a href="https://www.linkedin.com/in/nihal-uikey-3aa627354" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">LINKEDIN</a>
              </div>
            </div>
          </div>

        </div>

        {/* --- GUARANTEED VISIBLE DIVIDER LINE --- */}
        <div ref={lineRef} className="w-full h-[1px] bg-[#DCC7A4] opacity-30 mb-12"></div>

        {/* --- BOTTOM SECTION --- */}
        <div ref={bottomRef} className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 text-[11px] uppercase tracking-[0.3em] font-heading">
          <div className="flex flex-col justify-between">
            <span className="text-farm-muted mb-1 font-medium">DESIGN / CODE</span>
            <span className="font-semibold">NIHAL UIKEY</span>
          </div>

          <div className="flex flex-col justify-between">
            <span className="text-farm-muted mb-1 font-medium">COPYRIGHT</span>
            <span className="font-semibold">© 2026 RIGHTS RESERVED</span>
          </div>

          <div className="flex flex-col justify-between">
            <span className="text-farm-muted mb-1 font-medium">LOCAL TIME</span>
            <span className="font-semibold">IST (8:38 PM) 🇮🇳</span>
          </div>

          <div className="flex flex-col justify-between md:items-end">
            <span className="text-farm-muted mb-1 font-medium">LOCATION</span>
            <span className="font-semibold">NAGPUR</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;