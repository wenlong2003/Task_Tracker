import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./components/CalendarView";
import Home from "./pages/Home";
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
        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
          isDark={isDark} 
          toggleDark={() => setIsDark(!isDark)} 
        />

        <Routes>
          <Route path="/" element={<Home />} />
          {/* Dashboard redirect to home temporarily */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
  
}

export default App;