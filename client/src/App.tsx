import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import About from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Search from "./pages/SearchResults";
import Navbar from "./components/Navbar";
import MenuOptions from "./pages/MenuOptions";
import Account from "./pages/Account";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/account" element={<Account />} />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/menu-options/:restaurantId"
                    element={<MenuOptions />}
                  />
                </Routes>
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
