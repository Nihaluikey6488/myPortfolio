import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";

import NavItem from "./NavItem";
import ContactModal from "../pages/ContactModal";

const navItems = [
  { label: "HOME", path: "/" },
  { label: "ABOUT", path: "/about" },
  { label: "MY WORK", path: "/projects" },
];

// Simple mail icon (inline SVG, no extra package)
function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

// Phone icon (inline SVG, no extra package)
function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// Profile icon (inline SVG, no extra package)
function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export default function Navbar() {
  const infoLeftRef = useRef(null);
  const infoRightRef = useRef(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const hide = currentScrollY > lastScrollY && currentScrollY > 50;

      gsap.to([infoLeftRef.current, infoRightRef.current], {
        y: hide ? -50 : 0,
        opacity: hide ? 0 : 1,
        duration: 0.4,
        ease: "power1.out",
        overwrite: "auto",
      });

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      gsap.killTweensOf([infoLeftRef.current, infoRightRef.current]);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full px-4 md:px-8 py-5 z-40 grid grid-cols-[1fr_auto_1fr] items-center gap-4 pointer-events-none">
        {/* Left: profile icon, details card shows on hover / keyboard focus */}
        <div
          ref={infoLeftRef}
          className="group relative hidden md:block justify-self-start pointer-events-auto will-change-transform"
        >
          <button
            type="button"
            aria-label="About Nihal"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/95 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <UserIcon />
          </button>

          {/* Details card (pt-3 keeps the hover area unbroken between icon and card) */}
          <div className="absolute left-0 top-full pt-3 w-72 translate-y-2 opacity-0 pointer-events-none transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
            <div className="rounded-2xl bg-black/95 p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-nura text-sm font-bold text-black">
                  NU
                </div>
                <div>
                  <p className="font-nura text-sm font-bold uppercase tracking-widest">
                    Nihal Uikey
                  </p>
                  <p className="text-[11px] text-white/55">Software Engineer</p>
                </div>
              </div>

              <dl className="mt-3 space-y-2 font-nura text-[11px] uppercase tracking-widest">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Occupation</dt>
                  <dd className="text-right">Software Engineer</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Location</dt>
                  <dd className="text-right">Nagpur, Maharashtra</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Email</dt>
                  <dd className="text-right normal-case tracking-normal">
                    nihaluikey6488@gmail.com
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="md:hidden" />

        {/* Center: black pill, links keep the original NavItem effect */}
        <div className="pointer-events-auto flex items-center gap-4 md:gap-5 rounded-full bg-black/95 pl-5 md:pl-7 pr-2 py-2 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-md">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === "/"}>
              {({ isActive }) => (
                <NavItem label={item.label} isActive={isActive} />
              )}
            </NavLink>
          ))}

          {/* Contact icon */}
          <button
            type="button"
            aria-label="Contact"
            onClick={() => setIsContactOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white cursor-pointer text-black transition-transform duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <PhoneIcon />
          </button>
        </div>

        {/* Right: mail button */}
        <a
          ref={infoRightRef}
          href="mailto:nihaluikey6488@gmail.com?subject=Hello%20Nihal"
          aria-label="Email Nihal"
          title="nihaluikey6488@gmail.com"
          className="hidden md:flex justify-self-end pointer-events-auto h-11 w-11 items-center justify-center rounded-full bg-black/95 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white will-change-transform"
        >
          <MailIcon />
        </a>
        <div className="md:hidden" />
      </nav>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}