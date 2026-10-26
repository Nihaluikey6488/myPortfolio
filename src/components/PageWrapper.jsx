'use client'


import { useState } from 'react';
import Preloader from './Preloader'; // Aapke preloader ka path
import HeroSection from './Hero3DModel';
import UrbanSection from './UrbanSection';
import Navbar from './Navbar';
import SmoothScroll from './SmoothScroll';

export default function PageWrapper() {
    const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full bg-[#cecece] overflow-x-hidden">
      {/* <SmoothScroll/> */}
      {/* Preloader - Yeh top par fixed rahega aur animation complete hone par upar slide ho jayega */}
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}

      {/* Navbar (Optional: Agar preloader ke baad ya upar dikhana ho) */}
      <Navbar />

      {/* 1. Fixed Hero Section (Background mein pre-render ho raha hai taaki model/cursor late na ho) */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
        <HeroSection />
      </div>

      {/* 2. Overlapping Urban Section (Hero section ke upar scroll hoke aayega) */}
      <div className="relative z-10 w-full mt-[100vh] min-h-screen bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <UrbanSection />
      </div>

    </div>
  );
}