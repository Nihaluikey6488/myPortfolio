import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";


export default function ContactModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const containerRef = useRef(null);
  const formRef = useRef(null);

  // GSAP Entrance (Unfold) & Exit Animation
  useEffect(() => {
    if (!modalRef.current) return;

    if (isOpen) {
      const tl = gsap.timeline();

      gsap.set(modalRef.current, {
        display: "block",
        opacity: 0,
        scale: 0.2,
        rotateX: -45,
        rotateY: 25,
        skewX: 15,
        transformPerspective: 1000,
        transformOrigin: "center center",
      });

      tl.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        skewX: 0,
        duration: 0.7,
        ease: "power4.out",
      }).fromTo(
        formRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
        "-=0.3",
      );
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.2,
        rotateX: 35,
        rotateY: -20,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(modalRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  // 3D Cursor Tilt Detail (Mouse move par right/left tilt)
  const handleMouseMove = (e) => {
    if (!modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(modalRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: "power1.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    if (!modalRef.current) return;

    gsap.to(modalRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed  inset-0 z-50 flex items-center justify-center p-4 pointer-events-none cusrpr"
    >
      <div
        ref={modalRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseMove}
        className="pointer-events-auto  relative w-full max-w-2xl bg-[#989886d8] text-black p-8 sm:p-12 shadow-2xl overflow-hidden font-sans select-none will-change-transform"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* TOP HEADER */}
        <div className="flex justify-between items-center mb-8 pb-2">
          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight text-black/70 uppercase"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            SEND A MESSAGE
          </h2>
          <button
            onClick={onClose}
            className="relative group inline-flex flex-col items-end text-xs font-heading tracking-widest uppercase text-white cursor-pointer py-1"
          >
            <span>CLOSE</span>
            {/* Animated underline effect on hover */}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>
        </div>

        {/* FORM CONTENT */}
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
        >
          {/* INPUT ROW 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-1">
              <label className="text-md font-extrabold font-heading tracking-wide text-white">
                YOUR NAME
              </label>
              <input
              
                type="text"
                placeholder="Name"
                className="bg-transparent border-b border-white/30 py-2 text-2xl text-white/80 focus:outline-none focus:border-white placeholder-white/40 font-normal"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-md font-extrabold font-heading tracking-wide text-white">
                YOUR EMAIL
              </label>
              <input
                type="email"
                placeholder="Email address"
                className="bg-transparent border-b border-white/30 py-2 text-2xl text-white/80  focus:outline-none focus:border-white placeholder-white/40 font-normal"
              />
            </div>
          </div>

          {/* INPUT ROW 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-1">
              <label className="text-md font-extrabold font-heading tracking-wide text-white">
                COMPANY / OPTIONAL
              </label>
              <input
                type="text"
                placeholder="Company name"
                className="bg-transparent border-b border-white/30 py-2 text-2xl text-white/80  focus:outline-none focus:border-white placeholder-white/40 font-normal"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-md font-extrabold font-heading tracking-wide text-white">
                PROJECT TYPE
              </label>
              <input
                type="text"
                placeholder="Identity, motion, logo.."
                className="bg-transparent border-b border-white/30 py-2 text-2xl text-white/80  focus:outline-none focus:border-white placeholder-white/40 font-normal"
              />
            </div>
          </div>

          {/* TEXTAREA ROW */}
          <div className="flex flex-col space-y-1">
            <label className="text-md font-extrabold font-heading tracking-wide text-white">
              TELL ME ABOUT THE PROJECT
            </label>
            <textarea
              rows={3}
              placeholder="Project details, timing and budget.."
              className="bg-transparent border-b border-white/30 py-2 text-xl text-white focus:outline-none focus:border-white placeholder-white/40 font-normal resize-none"
            />
          </div>

          {/* FOOTER & SUBMIT BUTTON */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 gap-6">
            <div className="flex gap-4 text-[10px] font-nuro text-black/80 tracking-widest font-bold">
              <a href="#" className="hover:text-black/30">
                LINKEDIN
              </a>
              <a href="#" className="hover:text-black/30">
                INSTAGRAM
              </a>
              <a
                href="mailto:rustam-98@hotmail.com"
                className="hover:text-black/30 uppercase"
              >
                nihaluikey6488@gmail.com
              </a>
            </div>

            <button
              type="submit"
              className="px-8 py-4 bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer font-nura"
            >
              SUBMIT INQUIRY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
