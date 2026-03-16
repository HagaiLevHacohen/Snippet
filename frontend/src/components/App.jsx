import { useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet } from "react-router-dom";


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="font-['Montserrat',sans-serif] min-h-screen flex flex-col sm:flex-col lg:flex-row text-white bg-linear-to-br from-slate-950 via-indigo-950 to-black">
      <Sidebar />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  )
}

export default App
