import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ParticleBackground from "./components/ParticleBackground";
import "./App.css";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Request = lazy(() => import("./pages/Request"));
const Track = lazy(() => import("./pages/Track"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

function LoadingSpinner() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      flexDirection: "column",
      gap: "16px"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "3px solid var(--border)",
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/request" element={<Request />} />
          <Route path="/track" element={<Track />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <CustomCursor />
        <ParticleBackground />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
