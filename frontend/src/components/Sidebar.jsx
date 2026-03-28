import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import SidebarItem from './SidebarItem'
import houseIcon from "../assets/icons/house.png";
import searchIcon from "../assets/icons/search.png";
import settingsIcon from "../assets/icons/settings.png";
import userIcon from "../assets/icons/user.png";
import logoutIcon from "../assets/icons/logout.png";
import letter from "../assets/icons/letter.png";
import chat from "../assets/icons/chat.png";

function Sidebar() {
  const [page, setPage] = useState("feed") // feed, profile, search, explore, settings
  const { logout, user } = useAuth(); // check auth state
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className='w-72 flex flex-col justify-between bg-gray-800 text-white h-screen p-4'>

        <div className='flex flex-col gap-4 p-4'>
          <h1 className='text-4xl font-bold'>Snippet</h1>
          <SidebarItem title="Feed" icon={houseIcon} to="/feed" selected={page === "feed"} onClick={() => setPage("feed")} />
          <SidebarItem title="Profile" icon={userIcon} to={`/profile/${user?.username}`} selected={page === "profile"} onClick={() => setPage("profile")} />
          <SidebarItem title="Search" icon={searchIcon} to="/search" selected={page === "search"} onClick={() => setPage("search")} />
          <SidebarItem title="Follow Requests" icon={letter} to="/requests" selected={page === "requests"} onClick={() => setPage("requests")} />
          <SidebarItem title="Messages" icon={chat} to="/messages" selected={page === "messages"} onClick={() => setPage("messages")} />
        </div>


        <div className='flex flex-col gap-4 p-4'>
          <SidebarItem title="Settings" icon={settingsIcon} to="/settings" selected={page === "settings"} onClick={() => setPage("settings")} />
          <div className="h-px bg-gray-600 w-full"></div> {/* devider */}
          <div className='flex items-center bg-blue-700 gap-3 p-3 rounded-lg hover:bg-blue-900 cursor-pointer' onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout" className='w-5 h-5' />
            <span>Logout</span>
          </div>
        </div>
      
    </aside>
  )
}

export default Sidebar
