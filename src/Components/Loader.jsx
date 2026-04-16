import logo from "../assets/Vidya1.png";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#f8fafc] flex flex-col items-center justify-center z-50">
      
      {/* Logo Container with Pulse */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-4">
        {/* Animated outer ring */}
        <span className="absolute inset-0 rounded-full border-[3px] border-[#00a651] animate-pulse-ring"></span>
        <span className="absolute inset-2 rounded-full border-[2px] border-[#0b3c5d] opacity-50 animate-pulse-ring delay-200"></span>
        
        {/* Logo */}
        <img 
          src={logo} 
          alt="VidyaVaidya Logo" 
          className="w-24 h-24 object-contain animate-zoom-in relative z-10" 
        />
      </div>

      {/* Loading Text */}
      <h1 className="mt-4 text-[#0b3c5d] text-3xl font-bold tracking-[8px] uppercase animate-slide-up">
        VidyaVaidya
      </h1>
      
      <p className="mt-3 text-sm text-[#00a651] font-semibold tracking-wider animate-fade-in delay-300">
        LOADING EXPERIENCE...
      </p>

    </div>
  );
}