import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export default function NotFound() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const graphicRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry Animation for 404 text and illustration
      gsap.fromTo(
        textRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        graphicRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, delay: 0.4, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-white text-neutral-900 flex flex-col items-center justify-between px-6 py-12 select-none overflow-hidden font-sans"
    >
      {/* Top Branding / Spacer */}
      <div className="w-full max-w-4xl flex justify-center">
        <span className="font-serif tracking-widest text-lg font-semibold uppercase text-neutral-800">
          Portfolio.
        </span>
      </div>

      {/* Center Typography Content */}
      <div ref={textRef} className="text-center space-y-4 z-10 my-auto">
        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight font-medium text-neutral-900">
          404.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 font-normal">
          <strong className="text-neutral-900 font-semibold">Whoops!</strong> There’s nothing to be found here. Sorry!
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors duration-200 group underline underline-offset-4"
          >
            <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1 mr-1">
              ←
            </span>{' '}
            Back to Home
          </Link>
        </div>
      </div>

      {/* Bottom Illustration / GIF Area (Reference Dribbble Design) */}
      <div ref={graphicRef} className="w-full max-w-xl flex justify-center items-end mt-8">
        <div className="relative w-full aspect-[16/9] flex justify-center items-center">
          {/* Aap yahan apni Dribbble wali GIF ka direct path ya URL daal sakte hain */}
          <img
            src="https://cdn.dribbble.com/userupload/20420676/file/original-aac8f7f838812fa53cd92617fad5f892.gif"
            alt="Page not found illustration"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* Footer minimal info */}
      <div className="text-xs text-neutral-400 font-mono">
        <span>ERROR 404</span>
      </div>
    </div>
  );
}