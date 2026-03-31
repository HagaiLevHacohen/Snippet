import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { motion } from "framer-motion";
import DisplaySnippet from "./DisplaySnippet";
import profile1 from "../assets/display/fake_profile_1.jpg";
import profile2 from "../assets/display/fake_profile_2.jpg";
import profile3 from "../assets/display/fake_profile_3.jpg";
import profile4 from "../assets/display/fake_profile_4.jpg";

function Home() {
  const { isLoggedIn } = useAuth(); // check auth state

  if (isLoggedIn) {
    return <Navigate to="/feed" />; // redirect if logged in
  }

  const centerVariants = {
    hidden: { opacity: 0, y: -150 }, // starts higher for more visible motion
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,   // slower entrance
        ease: "easeOut", // smooth deceleration
      },
    },
  };


  return (
    <div className="font-['Montserrat',sans-serif] min-h-screen flex flex-col sm:flex-col lg:flex-row text-white bg-linear-to-br from-slate-950 via-indigo-950 to-black">

      {/* Left column */}
      <div className="hidden flex-1 lg:flex lg:flex-col justify-center items-center text-center px-10 space-y-30">
        <DisplaySnippet profilePic={profile1} name="Alice Johnson" username="alicej17" text="The best way to learn programming is still: build something slightly too hard for you." likes={189} comments={29} />
        <DisplaySnippet profilePic={profile2} name="Bob Smith" username="bobsmith" text="Most people underestimate how much progress they can make in one year." likes={5} comments={15} />
      </div>

      {/* Center column */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-center text-center px-10 space-y-6"
        variants={centerVariants}
        initial="hidden"
        animate="visible"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        <h1 className="text-5xl font-bold">Welcome to Snippet</h1>
        <h2 className="text-2xl text-purple-400 font-semibold">
          Share thoughts. Spark conversations.
        </h2>
        <p className="text-gray-300 max-w-md">
          Post short snippets, follow interesting people, and explore trending conversations from around the world.
        </p>
        <div className="flex gap-8 mt-4">

        <Link to="/signup" className="px-6 py-3 rounded-lg font-medium text-white bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 hover:scale-110 transition">
          Sign Up
        </Link>
        <Link to="/login" className="px-6 py-3 border border-gray-400 hover:bg-white hover:text-black rounded-lg font-medium hover:scale-110 transition">
          Log In
        </Link>

        </div>
      </motion.div>

      {/* Right column */}
      <div className=" hidden flex-1 md:flex lg:flex-col justify-center items-center text-center px-10 gap-5 lg:space-y-30">
        <DisplaySnippet profilePic={profile3} name="Charlie Brown" username="charlieb9" text="What's a game you wish you could experience for the first time again?" likes={39} comments={5} />
        <DisplaySnippet profilePic={profile4} name="Diana Prince" username="dianap" text="Why do I open the fridge 10 times like something new will appear" likes={15} comments={8} />
      </div>
    </div>
  )
}

export default Home