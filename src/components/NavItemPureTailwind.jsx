import React from 'react';

export default function NavItemPureTailwind({ label = 'MY WORK', onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden font-black text-sm uppercase tracking-wider text-[#F2EBD9] cursor-pointer py-1"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Top Text */}
        <span className="block transform transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-y-full">
          {label}
        </span>
        
        {/* Bottom Duplicate Text */}
        <span className="absolute inset-0 flex items-center justify-center transform translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-y-0">
          {label}
        </span>
      </div>
    </button>
  );
}