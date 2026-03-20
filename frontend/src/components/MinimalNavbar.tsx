import { useState, useEffect } from "react";

export default function MinimalNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/50 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="text-white text-xl font-bold tracking-widest no-underline">
          KRAK.AI
        </a>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wider">
          <a href="#features" className="text-white/80 hover:text-white transition-colors no-underline">
            FEATURES
          </a>
          <a href="#technology" className="text-white/80 hover:text-white transition-colors no-underline">
            TECHNOLOGY
          </a>
          <a href="#demo" className="text-white/80 hover:text-white transition-colors no-underline">
            LIVE DEMO
          </a>
        </div>
        <button className="text-sm font-medium text-white tracking-widest px-4 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full backdrop-blur-sm cursor-pointer border-none outline-none">
          SIGN IN
        </button>
      </div>
    </nav>
  );
}
