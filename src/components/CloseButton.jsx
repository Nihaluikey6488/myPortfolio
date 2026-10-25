import React from 'react';

export default function CloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      className="relative group inline-flex flex-col items-end text-xs font-mono tracking-widest uppercase text-white cursor-pointer py-1"
    >
      <span>CLOSE</span>
      {/* Animated underline effect on hover */}
      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </button>
  );
}