import { useState } from "react"

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="font-['Montserrat',sans-serif] h-screen flex text-white bg-linear-to-br from-slate-950 via-indigo-950 to-black">

      {/* Left column */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-10 space-y-6">
        <p className="text-lg text-gray-300">
          The best way to learn programming is still: build something slightly too hard for you.
        </p>
        <p className="text-lg text-gray-300">
          Every successful startup started with someone saying “this might be stupid but…”
        </p>
      </div>

      {/* Center column */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-10 space-y-6">
        <h1 className="text-5xl font-bold">Welcome to snippet</h1>
        <h2 className="text-2xl text-purple-400 font-semibold">
          Share thoughts. Spark conversations.
        </h2>
        <p className="text-gray-300 max-w-md">
          Post short snippets, follow interesting people, and explore trending conversations from around the world.
        </p>
        <div className="flex gap-8 mt-4">
          <button className="px-6 py-3 rounded-lg font-medium text-white bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 hover:scale-110 transition">
            Sign Up
          </button>
          <button className="px-6 py-3 border border-gray-400 hover:bg-white hover:text-black rounded-lg font-medium hover:scale-110 transition">
            Log In
          </button>
        </div>
      </div>

      {/* Right column */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-10 space-y-6">
        <p className="text-lg text-gray-300">
          The best way to learn programming is still: build something slightly too hard for you.
        </p>
        <p className="text-lg text-gray-300">
          Every successful startup started with someone saying “this might be stupid but…”
        </p>
      </div>

    </div>
  )
}

export default Home