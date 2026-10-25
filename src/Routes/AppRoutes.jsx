import { Routes, Route } from "react-router-dom";

import PageWrapper from "../components/PageWrapper";
import ProjectsSection from "../pages/ProjectsSection";
import AboutPage from "../pages/AboutPage";
import ScrollToTop from "../components/ScrollToTop";

const AppRoutes = () => {
  return (
    <>
    <ScrollToTop/>
    <Routes>
      <Route path="/" element={<PageWrapper />} />
      <Route path="/projects" element={<ProjectsSection />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
    </>
  );
};

export default AppRoutes;