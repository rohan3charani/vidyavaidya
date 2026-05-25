// CHANGED: R9 — Topbar hidden on mobile viewports < 768px
import { MapPin, Mail, Phone } from "lucide-react";
import { Search, Home, Settings, Share2 } from "lucide-react";

export default function Topbar() {
  return (
    // hidden on screens < md (768px), shown as block on md and above
    <div className="hidden md:block w-full bg-[#145c43] text-white text-sm">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-yellow-400" />
            <span>Nellore Andhra Pradesh</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail size={16} className="text-yellow-400" />
            <span>VidyaVaidyanlr@gmail.com</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} className="text-yellow-400" />
            <span>+9199 *** ***</span>
          </div>

        </div>

        {/* RIGHT SIDE SOCIAL */}
        <div className="flex items-center gap-3">

          <div className="w-9 h-9 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition">
            <Search size={16} />
          </div>

          <div className="w-9 h-9 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition">
            <Home size={16} />
          </div>

          <div className="w-9 h-9 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition">
            <Settings size={16} />
          </div>

          <div className="w-9 h-9 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition">
            <Share2 size={16} />
          </div>

        </div>

      </div>

      {/* Bottom yellow line */}
      <div className="h-[3px] w-32 bg-yellow-400"></div>
    </div>
  );
}

