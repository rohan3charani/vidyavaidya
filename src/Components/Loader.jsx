export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#e34133] flex flex-col items-center justify-center z-50">
      
      {/* Close Button */}
      <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white text-xl">
        ×
      </button>

      {/* Circle Animation */}
      <div className="relative w-20 h-20">
  <span className="absolute inset-0 rounded-full border-2 border-white animate-pulse-ring"></span>
</div>

      {/* Text */}
      <h1 className="mt-8 text-white text-4xl tracking-[10px] font-light">
        VidyaVaidya
      </h1>

    </div>
  );
}