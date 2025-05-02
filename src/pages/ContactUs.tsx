import { FormEvent, useState } from "react";
import "./Landing.css";
import CustomButton from "../components/Button";

type FormData = {
    name: string;
    email: string;
    message: string;
  };
  
  const INITIAL_DATA: FormData = {
    name: "",
    email: "",
    message: "",
  };

export default function ContactUs() {
  const [searchText, setSearchText] = useState("");

function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (isFirstStep) {
    if (!checkPasswordMatch()) {
        setErrorMessage("ERROR: Passwords do not match!");
        return;
    } else {
        setErrorMessage("");
        return next();
    }
    } else if (!isLastStep) {
    setErrorMessage("");
    return next();
    } else {
    setErrorMessage("");
    alert(`SUCCESS: Account created for ${data.email}`); // TODO: Add User to database
    }
}

  return (
    <div className="landing-container">
      <section className="section hero">
        <h1 className="landing-title">
          Contact Us
        </h1>
      </section>

      {/* Section 2 (Contact-Us Form) */}
      <section className="section split-section left-image">
        <div className="left-box">
            <input
                type="text"
                className="search-bar"
                placeholder="Search for restaurants, cuisines, ..."
                value={searchText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
        </div>
        <div className="right-text">
          <h3>Want to contact us?</h3>
          <p>
          Have questions, feedback, or need help finding the perfect restaurant for your dietary needs?
          We're here to help!
          Whether you're looking for more information about our platform, want to suggest a restaurant,
          or just have something to share, feel free to reach out. Your experience matters to us.
          </p>
        </div>
      </section>

      <section className="section footer-section"></section>
    </div>
  );
}
