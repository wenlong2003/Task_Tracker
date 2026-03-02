import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toggle } from "./components/toggle";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <div data-theme={isDark ? "dark" : "light"}>
        <Toggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;