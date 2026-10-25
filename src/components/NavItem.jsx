import React from 'react';

export default function NavItem({ label, onClick, isActive = false, isUnderlined = false }) {
  return (
    <button
      onClick={onClick}
      className={`group relative cursor-pointer py-1 uppercase tracking-wider text-xl font-csrude flex items-center transition-colors duration-200 ${
        isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
      } ${isUnderlined ? 'underline' : ''}`}
    >
      {/* Container holding the split letters */}
      <span className="flex overflow-hidden">
        {label.split('').map((char, index) => (
          <span
            key={index}
            className="relative inline-block overflow-hidden h-[1.2em] leading-none"
            style={{ width: char === ' ' ? '0.4em' : 'auto' }}
          >
            {/* Sliding letter wrapper with staggered delay */}
            <span
              className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-y-1/2"
              style={{
                transitionDelay: `${index * 0.03}s`,
              }}
            >
              {/* Original Letter */}
              <span className="h-[1.2em] flex items-center justify-center">
                {char === ' ' ? '\u00A0' : char}
              </span>
              {/* Duplicate Letter coming from below */}
              <span className="h-[1.2em] flex items-center justify-center">
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          </span>
        ))}
      </span>
    </button>
  );
}