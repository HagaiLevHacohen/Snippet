import { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const buttonRef = useRef(null); // NEW

  return (
    <div className="font-['Montserrat',sans-serif] min-h-screen flex flex-col lg:flex-row text-white bg-linear-to-br from-slate-950 via-indigo-950 to-black">
      
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} buttonRef={buttonRef} />

      <main className="flex-1 relative">
        {/* Mobile button */}
        <button
          ref={buttonRef}
          className={`
            lg:hidden fixed top-2 left-2 z-50 bg-blue-700 p-2 rounded-full hover:bg-blue-900
            ${sidebarOpen ? "hidden" : ""}
          `}
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <Outlet />
      </main>
    </div>
  );
}

export default App;
