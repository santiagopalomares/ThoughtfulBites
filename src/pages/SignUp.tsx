import { FormEvent, useState, useMemo } from "react";
import "./SignUp.css";
import logo from "../assets/Logo.png";
import arrow from "../assets/ArrowButton.png";
import { Link } from "react-router-dom";
import { useMultistepForm } from "../components/useMultistepForm";
import { UserInformation } from "./signup-pages/UserInformation";
import { DietaryRestrictions } from "./signup-pages/DietaryRestrictions";
import { DietDetails } from "./signup-pages/DietDetails";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  userDietTypes: string[];
  userDietDetails: string[];
};

const INITIAL_DATA: FormData = {
  email: "",
  password: "",
  confirmPassword: "",
  userDietTypes: [],
  userDietDetails: [],
};

export default function SignUp() {
  const [data, setData] = useState(INITIAL_DATA);
  const [errorMessage, setErrorMessage] = useState("");

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  // DietDetails page only appears if Allergens or Other is selected
  const steps = useMemo(() => {
    const baseSteps = [
      <UserInformation {...data} updateFields={updateFields} />,
      <DietaryRestrictions {...data} updateFields={updateFields} />,
    ];

    if (
      data.userDietTypes.includes("Allergens") ||
      data.userDietTypes.includes("Other")
    ) {
      baseSteps.push(<DietDetails {...data} updateFields={updateFields} />);
    }

    return baseSteps;
  }, [data]);

  const { step, isFirstStep, back, next, isLastStep } = useMultistepForm(steps);

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
