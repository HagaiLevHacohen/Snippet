import App from "./components/App.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Feed from "./components/Feed.jsx";
import Search from "./components/Search.jsx";
import Profile from "./components/Profile.jsx";
import Post from "./components/Post.jsx";
import FollowRequestsPage from "./components/FollowRequestsPage.jsx";
import Settings from "./components/Settings.jsx";
import MessagePage from "./components/MessagePage.jsx";
import AuthCallback from "./components/AuthCallback.jsx";
import VerifyEmail from "./components/VerifyEmail.jsx";
import EmailVerified from "./components/EmailVerified.jsx";


const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/auth/callback", element: <AuthCallback /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/email-verified", element: <EmailVerified /> },

  {
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { path: "feed", element: <Feed /> },
      { path: "search", element: <Search /> },
      { path: "profile/:username", element: <Profile /> },
      { path: "posts/:postId", element: <Post /> },
      { path: "requests", element: <FollowRequestsPage /> },
      { path: "messages", element: <MessagePage /> },
      { path: "settings", element: <Settings /> },
    ]
  },

  { path: "*", element: <ErrorPage /> }
];

export default routes;