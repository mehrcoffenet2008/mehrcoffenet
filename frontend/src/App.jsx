import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Track from "./pages/Track";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Request from "./pages/Request";
import Contact from "./pages/Contact";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/request" element={<Request />} />
        <Route path="/track" element={<Track />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;