import App from "./components/App.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  {
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { path: "feed", element: <Feed /> },
      { path: "explore", element: <Explore /> },
      { path: "search", element: <Search /> },
      { path: "profile/:username", element: <Profile /> }
    ]
  },

  { path: "*", element: <ErrorPage /> }
];

export default routes;