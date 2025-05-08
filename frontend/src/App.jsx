import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
import { authStore } from "./store/authStore.js";
import { useEffect } from "react";
import {Toaster} from "react-hot-toast";
import { themeStore } from "./store/themeStore.js";

function App() {
  const {authUser, checkAuth} = authStore();
  const {theme} = themeStore();
  useEffect(() => {
    checkAuth();
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <div>
      <Toaster />
      {authUser ? <Navbar /> : <></>}
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <Settings /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App