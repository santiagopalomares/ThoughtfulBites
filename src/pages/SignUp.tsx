import { FormEvent, useState } from "react";
import "./SignUp.css";
import logo from "../assets/Logo.png";
import arrow from "../assets/ArrowButton.png";
import { Link } from "react-router-dom";
import { useMultistepForm } from "../components/useMultistepForm";
import { UserInformation } from "./signup-pages/UserInformation";
import { DietaryRestrictions } from "./signup-pages/DietaryRestrictions";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  userDiet: string[];
};

const INITIAL_DATA: FormData = {
  email: "",
  password: "",
  confirmPassword: "",
  userDiet: [],
};

export default function SignUp() {
  const [data, setData] = useState(INITIAL_DATA);
  const [errorMessage, setErrorMessage] = useState("");

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const { step, isFirstStep, back, next, isLastStep } = useMultistepForm([
    <UserInformation {...data} updateFields={updateFields} />,
    <DietaryRestrictions {...data} updateFields={updateFields} />,
  ]);

  function checkPasswordMatch() {
    return data.confirmPassword === data.password;
  }

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
    <div className="signup-container">
      <div className="header">
        <Link to="/" className="link-no-underline">
          <img src={logo} alt="Logo" className="logo" />
          <span className="site-name">ThoughtfulBites</span>
        </Link>
      </div>
      <form onSubmit={onSubmit}>
        {step}
        <p className="error-message">{errorMessage}</p>
        <div className="navigation">
          <div className="pagination-dots"></div>
          {!isFirstStep && (
            <button type="button" className="backButton" onClick={back}>
              <img src={arrow} alt="left arrow" className="left-arrow" />
              Back
            </button>
          )}
          <button type="submit" className="nextButton">
            {isLastStep ? (
              "Finish"
            ) : (
              <>
                Next
                <img src={arrow} alt="right arrow" className="right-arrow" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
