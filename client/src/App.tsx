import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import About from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Search from "./pages/SearchResults";
import Navbar from "./components/Navbar";
import MenuOptions from "./pages/MenuOptions";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu-options/:restaurantId" element={<MenuOptions />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
