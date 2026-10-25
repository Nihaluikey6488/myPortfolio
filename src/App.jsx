
import { useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Preloader from "./components/Preloader.jsx";
import AppRoutes from "./Routes/AppRoutes.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
    <SmoothScroll/>
    <main className="relative min-h-screen w-full bg-[#080808] text-white">
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <Navbar />
          <AppRoutes />
        </>
      )}
    </main>
    </>
  );
};

export default App;
