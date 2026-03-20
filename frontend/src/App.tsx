import { HeroScene } from './components/HeroScene';
import MinimalNavbar from './components/MinimalNavbar';

function App() {
  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      <MinimalNavbar />
      <HeroScene />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-between pt-32 pb-16 pointer-events-none z-10">
        
        {/* Title Section */}
        <div className="flex flex-col items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-wide mb-2 uppercase">KrakAI System</h1>
          <p className="text-sm md:text-base text-gray-300 tracking-wider">
            Real-Time Surface Crack Detection (VITE)
          </p>
        </div>

        {/* Action Button Section */}
        <div className="flex flex-col sm:flex-row gap-4 px-4 w-full max-w-lg mx-auto pointer-events-auto">
          <button 
            onClick={() => alert("Membuka dialog upload gambar...")}
            className="flex-1 bg-white border border-white text-black py-2.5 rounded text-sm font-medium tracking-wide hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Upload Image
          </button>
          <button 
            onClick={() => alert("Membuka Live Stream Kamera...")}
            className="flex-1 bg-black/40 backdrop-blur-md text-white py-2.5 rounded text-sm font-medium tracking-wide hover:bg-black/60 border border-white/20 transition-colors cursor-pointer"
          >
            Live Stream
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;
