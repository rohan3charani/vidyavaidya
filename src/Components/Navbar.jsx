import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [eventsDropdown, setEventsDropdown] = useState(false);
  const [storiesDropdown, setStoriesDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="src/assets/Vidya.png" alt="VIDYA VAIDYA LOGO" style={{width: "60px", height: "60px", borderRadius: "50%"}}/>
          <h1 className="text-2xl font-bold text-gray-800 font-serif">
            VidyaVaidya
          </h1>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-gray-700 font-medium relative">
          <a href="#" className="text-red-500">
            Home
          </a>
          <a href="#">Our Mission</a>
          <a href="#">Partners</a>
          <div className="relative">
            <button
              onMouseEnter={() => setEventsDropdown(true)}
              onMouseLeave={() => setEventsDropdown(false)}
              className="flex items-center gap-1 hover:text-red-500 transition"
            >
              Events ▾
            </button>
            {eventsDropdown && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                onMouseEnter={() => setEventsDropdown(true)}
                onMouseLeave={() => setEventsDropdown(false)}
              >
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 transition">
                  Photo Gallery
                </a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 transition">
                  Video Gallery
                </a>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onMouseEnter={() => setStoriesDropdown(true)}
              onMouseLeave={() => setStoriesDropdown(false)}
              className="flex items-center gap-1 hover:text-red-500 transition"
            >
              Stories & News ▾
            </button>
            {storiesDropdown && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                onMouseEnter={() => setStoriesDropdown(true)}
                onMouseLeave={() => setStoriesDropdown(false)}
              >
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 transition">
                  News
                </a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 transition">
                  Publishings
                </a>
              </div>
            )}
          </div>
          <a href="#">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full border flex items-center justify-center">
            <Search size={18} />
          </button>

          <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-red-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
            DONATE NOW ✋
          </button>

          <button
            onClick={() => navigate("/auth")}
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
