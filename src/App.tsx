import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import AboutUs from "./pages/AboutUs";
import Restaurant from "./pages/Restaurant";
import Account from "./pages/Account";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
