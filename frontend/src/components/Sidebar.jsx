import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import SidebarItem from "./SidebarItem";
import houseIcon from "../assets/icons/house.png";
import searchIcon from "../assets/icons/search.png";
import settingsIcon from "../assets/icons/settings.png";
import userIcon from "../assets/icons/user.png";
import logoutIcon from "../assets/icons/logout.png";
import letter from "../assets/icons/letter.png";
import chat from "../assets/icons/chat.png";

export default function Sidebar({ sidebarOpen, setSidebarOpen, buttonRef }) {
  const [page, setPage] = useState("feed");
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
    setSidebarOpen(false);
  };

  // Close sidebar when clicking outside (ignores button)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef?.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen, buttonRef]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 visible backdrop-blur-sm bg-[rgba(0,0,0,0.2)] pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      ></div>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen min-h-screen w-64 bg-gray-800 text-white p-4 z-50
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-screen
        `}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Snippet</h1>
          <SidebarItem
            title="Feed"
            icon={houseIcon}
            to="/feed"
            selected={page === "feed"}
            onClick={() => {
              setPage("feed");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            title="Profile"
            icon={userIcon}
            to={`/profile/${user?.username}`}
            selected={page === "profile"}
            onClick={() => {
              setPage("profile");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            title="Search"
            icon={searchIcon}
            to="/search"
            selected={page === "search"}
            onClick={() => {
              setPage("search");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            title="Follow Requests"
            icon={letter}
            to="/requests"
            selected={page === "requests"}
            onClick={() => {
              setPage("requests");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            title="Messages"
            icon={chat}
            to="/messages"
            selected={page === "messages"}
            onClick={() => {
              setPage("messages");
              setSidebarOpen(false);
            }}
          />
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <SidebarItem
            title="Settings"
            icon={settingsIcon}
            to="/settings"
            selected={page === "settings"}
            onClick={() => {
              setPage("settings");
              setSidebarOpen(false);
            }}
          />
          <div className="h-px bg-gray-600 w-full"></div>
          <div
            className="flex items-center bg-blue-700 gap-3 p-3 rounded-lg hover:bg-blue-900 cursor-pointer"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </aside>
    </>
  );
}