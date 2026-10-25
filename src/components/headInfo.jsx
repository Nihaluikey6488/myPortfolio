import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HeaderInfo() {
  const headerRef = useRef(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Jab user niche scroll karega toh yeh div upar ki taraf hide ho jayega
        gsap.to(headerRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        // Jab user upar scroll karega toh yeh wapas visible ho jayega
        gsap.to(headerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-30 flex justify-between items-center p-6 bg-black text-[#F2EBD9] font-mono text-xs will-change-transform"
    >
      <div>NAME / RUSTAM KERIMOV</div>
      <div>OCCUPATION / GRAPHIC DESIGNER</div>
      <div>09 / 09 PROJECTS</div>
      <div>LOCATION / OSLO, NORWAY</div>
    </div>
  );
}