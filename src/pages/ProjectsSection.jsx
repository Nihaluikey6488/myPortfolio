import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/Footer";

// Register ScrollTrigger plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Sample Project Data
const PROJECTS_DATA = [
  {
    id: "01",
    title: "KISTEFOS MUSEUM",
    category: "CLIENT WORK",
    tags: ["PERSONAL PROJECT", "POSTERS", "+2"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    cursorBg: "bg-black text-white",
  },
  {
    id: "02",
    title: "AURELIS CAPITAL",
    category: "LOGO DESIGN",
    tags: ["PERSONAL PROJECT", "VISUAL IDENTITY"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    cursorBg: "bg-white text-black",
  },
  {
    id: "03",
    title: "POSTERS BUNDLE #1",
    category: "ANIMATIONS",
    tags: ["PERSONAL PROJECT", "POSTERS"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
    cursorBg: "bg-[#E83C12] text-white",
  },
  {
    id: "04",
    title: "ART EXHIBITION",
    category: "EXAM PROJECT",
    tags: ["VISUAL IDENTITY", "ANIMATIONS"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=600&q=80",
    cursorBg: "bg-black text-white",
  },
  {
    id: "05",
    title: "DRØMMENES MELODI",
    category: "ANIMATIONS",
    tags: ["ANIMATIONS", "VISUAL IDENTITY"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    cursorBg: "bg-white text-black",
  },
  {
    id: "06",
    title: "ECHO FESTIVAL",
    category: "CLIENT WORK",
    tags: ["VISUAL IDENTITY", "LOGO DESIGN"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
    cursorBg: "bg-[#E83C12] text-white",
  },
  {
    id: "07",
    title: "BREEN BYGG & SERVICE",
    category: "LOGO DESIGN",
    tags: ["VISUAL IDENTITY", "LOGO DESIGN"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    cursorBg: "bg-black text-white",
  },
  {
    id: "08",
    title: "I-D MAGAZINE",
    category: "MAGAZINE DESIGN",
    tags: ["MAGAZINE DESIGN", "SCHOOL PROJECT"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    cursorBg: "bg-white text-black",
  },
  {
    id: "09",
    title: "MALTESERS PACKAGE",
    category: "CLIENT WORK",
    tags: ["PACKAGING", "SCHOOL PROJECT"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
    cursorBg: "bg-[#E83C12] text-white",
  },
];

const FILTERS = [
  "ALL WORK",
  "CLIENT WORK",
  "ANIMATIONS",
  "EXAM PROJECT",
  "LOGO DESIGN",
  "MAGAZINE DESIGN",
];

export default function ProjectsSection() {
  const [selectedFilter, setSelectedFilter] = useState("ALL WORK");

  // Custom cursor states
  const [hoveredProject, setHoveredProject] = useState(null);

  // Refs for Animation & Physics
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorpos = useRef({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const reqId = useRef(null);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const sidebarRef = useRef(null);

  // Filter logic
  const filteredProjects = PROJECTS_DATA.filter((project) => {
    if (selectedFilter === "ALL WORK") return true;
    return project.category === selectedFilter;
  });

  // Master Entry ScrollTrigger Animation Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Sidebar Intro
      tl.fromTo(
        sidebarRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // 2. Grid Items Staggered Reveal
      if (gridRef.current) {
        tl.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" },
          "-=0.4"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP animation on filter change with stable layout handling
  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          stagger: 0.05, 
          ease: "power2.out",
          clearProps: "transform" 
        }
      );
    }
  }, [selectedFilter]);

  // Smooth Interpolation Loop (Lerp) for Global Cursor across Section
  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      cursorpos.current.x = lerp(cursorpos.current.x, mousePos.current.x, 0.15);
      cursorpos.current.y = lerp(cursorpos.current.y, mousePos.current.y, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorpos.current.x}px, ${cursorpos.current.y}px, 0) translate(-50%, -50%)`;
      }

      reqId.current = requestAnimationFrame(animate);
    };

    reqId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqId.current);
  }, []);

  const handleSectionMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const activeProjectData = PROJECTS_DATA.find((p) => p.id === hoveredProject);

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="relative min-h-screen bg-[#111111] text-[#F2EBD9] px-6 py-24 select-none font-heading overflow-hidden"
    >
      {/* GLOBAL SINGLE FLOATING "VIEW CASE" MOUSE CURSOR */}
      <div
        ref={cursorRef}
        className={`absolute top-0 left-0 pointer-events-none z-50 px-2 py-2 text-[1.8vw] tracking-wide shadow-2xl will-change-transform font-shamgod transition-opacity duration-300 ${
          hoveredProject ? "opacity-100" : "opacity-0 duration-150"
        } ${activeProjectData?.cursorBg || "bg-black text-white"}`}
      >
        VIEW CASE
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* LEFT STICKY SIDEBAR: Info & Filters */}
        <div ref={sidebarRef} className="lg:sticky lg:top-28 space-y-10 lg:col-span-1">
          <p className="text-[3.5vw] uppercase leading-[0.88] text-neutral-300 font-shamgod font-extrabold">
            Selected projects across identity, print, digital and experimental
            work.
          </p>

          <div className="space-y-4 mt-25">
            <h4 className="text-xs font-bold text-neutral-500 tracking-widest">
              FILTER
            </h4>
            <div className="flex flex-col space-y-2 items-start">
              {FILTERS.map((filter) => {
                const isActive = selectedFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`text-left text-sm uppercase tracking-wider font-heading transition-all duration-300 ease-out hover:translate-x-1 cursor-pointer py-1 ${
                      isActive
                        ? "text-white font-bold"
                        : "text-neutral-500 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PROJECTS GRID */}
        <div className="lg:col-span-3 mt-2">
          {/* Top Section Counter */}
          <div className="text-xs tracking-widest text-neutral-400 mb-12 font-extrabold">
            {String(filteredProjects.length).padStart(2, "0")} /{" "}
            {String(PROJECTS_DATA.length).padStart(2, "0")} PROJECTS
          </div>

          {filteredProjects.length > 0 ? (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 min-h-[600px]"
            >
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative flex flex-col space-y-3"
                >
                  {/* Project Image Card with Hover Triggers */}
                  <div
                    className="relative bg-neutral-900 aspect-[4/3] overflow-hidden flex items-center justify-center cursor-pointer"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    />
                  </div>

                  {/* Project Details */}
                  <div className="flex items-baseline space-x-3 text-xs tracking-wider">
                    <span className="text-neutral-500 font-mono">
                      {project.id}
                    </span>
                    <h3 className="uppercase text-[#F2EBD9] cursor-pointer tracking-tighter transition-all hover:text-[#f2ebd999] text-xl font-satoshilight">
                      {project.title}
                    </h3>
                  </div>

                  {/* Tags Row */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 uppercase tracking-widest font-mono">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-2">
                        <span>{tag}</span>
                        {idx < project.tags.length - 1 && (
                          <span className="text-neutral-600">/</span>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Year */}
                  <div className="text-[11px] text-neutral-500 font-mono tracking-widest pt-0.5">
                    {project.year}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* NO MATCH STATE */
            <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center min-h-[400px]">
              <h2 className="text-4xl font-black uppercase tracking-widest text-white">
                NO MATCH
              </h2>
              <p className="text-xs text-neutral-400 max-w-sm uppercase tracking-wider">
                No projects match this combination. Try another filter or view
                all work.
              </p>
              <button
                onClick={() => setSelectedFilter("ALL WORK")}
                className="mt-4 px-6 py-2 border border-neutral-700 text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                VIEW ALL WORK —
              </button>
            </div>
          )}
        </div>
      </div>

    <Footer/>
    </section>
  );
}