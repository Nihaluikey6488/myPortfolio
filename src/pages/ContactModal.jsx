import React, { useEffect, useRef } from "react";
import { useForm } from "@formspree/react";
import { gsap } from "gsap";

export default function ContactModal({ isOpen, onClose }) {
  // Replace "YOUR_FORM_ID" with your actual Formspree form ID (e.g., "xbjnwxyz")
  const [state, handleSubmit] = useForm("xeaaabkv");

  const modalRef = useRef(null);
  const containerRef = useRef(null);
  const formRef = useRef(null);

  // Auto-close modal after successful Formspree submission
  useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded, onClose]);

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
      });

      if (formRef.current?.children) {
        tl.fromTo(
          formRef.current.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
          "-=0.3"
        );
      }
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

  // 3D Cursor Tilt Detail
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
    >
      <div
        ref={modalRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto relative w-full max-w-2xl bg-[#989886d8] text-black p-8 sm:p-12 shadow-2xl overflow-hidden font-sans select-none will-change-transform"
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
            type="button" 
            onClick={onClose}
            className="relative group inline-flex flex-col items-end text-xs font-heading tracking-widest uppercase text-white cursor-pointer py-1"
          >
            <span>CLOSE</span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>
        </div>

        {/* FORMSPEE SUCCESS STATE */}
        {state.succeeded ? (
          <div className="mb-6 p-6 bg-black text-[#D9F95F] text-xs font-heading uppercase tracking-widest text-center space-y-3">
            <p className="text-base font-bold">✓ Message sent successfully!</p>
            <p className="text-white/70 normal-case font-mono">
              Thanks for reaching out! I will get back to you soon.
            </p>
          </div>
        ) : (
          /* FORM CONTENT */
          <form
         
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* FORMSPREE ERROR ALERT */}
            {state.errors && Array.isArray(state.errors) && state.errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-900/80 text-white text-xs font-mono uppercase tracking-widest text-center">
                ✕ Something went wrong. Please check your inputs and try again.
              </div>
            )}

            {/* INPUT ROW 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-1">
                <label className="text-md font-extrabold font-heading tracking-wide text-white">
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  placeholder="Name"
                  className="bg-transparent border-b border-white/30 py-2 text-[20px] text-white focus:outline-none focus:border-white placeholder-white/40 font-normal font-domnique tracking-widest"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-md font-extrabold font-heading tracking-wide text-white">
                  YOUR EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  placeholder="Email address"
                  className="bg-transparent border-b border-white/30 py-2 text-[20px] text-white focus:outline-none focus:border-white placeholder-white/40 font-normal font-domnique tracking-widest"
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
                  name="company"
                  maxLength={100}
                  placeholder="Company name"
                  className="bg-transparent border-b border-white/30 py-2 text-[20px] text-white focus:outline-none focus:border-white placeholder-white/40 font-normal font-domnique tracking-widest"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-md font-extrabold font-heading tracking-wide text-white">
                  SUBJECT *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  maxLength={150}
                  placeholder="Project inquiry, collaboration.."
                  className="bg-transparent border-b border-white/30 py-2 text-[20px] text-white focus:outline-none focus:border-white placeholder-white/40 font-normal font-domnique tracking-widest"
                />
              </div>
            </div>

            {/* TEXTAREA ROW */}
            <div className="flex flex-col space-y-1">
              <label className="text-md font-extrabold font-heading tracking-wide text-white">
                TELL ME ABOUT THE PROJECT *
              </label>
              <textarea
                name="message"
                required
                maxLength={5000}
                rows={3}
                placeholder="Project details, timing and budget.."
                className="bg-transparent border-b border-white/30 py-2 text-[20px] text-white focus:outline-none focus:border-white placeholder-white/40 font-normal font-domnique tracking-widest"
              />
            </div>

            {/* FOOTER & SUBMIT BUTTON */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 gap-6">
              <div className="flex gap-4 text-[10px] font-nuro text-black/80 tracking-widest font-bold">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black/30">
                  LINKEDIN
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black/30">
                  INSTAGRAM
                </a>
                <a
                  href="mailto:nihaluikey6488@gmail.com"
                  className="hover:text-black/30 uppercase"
                >
                  nihaluikey6488@gmail.com
                </a>
              </div>

              <button
                type="submit"
                disabled={state.submitting}
                className="px-8 py-4 bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer font-nura disabled:opacity-50"
              >
                {state.submitting ? "SENDING..." : "SUBMIT INQUIRY"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}