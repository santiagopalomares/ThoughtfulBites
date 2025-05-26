import { FormEvent, useState, useMemo } from "react";
import styles from "./SignUp.module.css";
import logo from "../assets/Logo.png";
import arrow from "../assets/ArrowButton.png";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  async function addUserToDatabase() {
    try {
      const response = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(`${result.message}`);
        return;
      }
      return null;
    } catch (error) {
      setErrorMessage("Cannot connect to server");
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (isFirstStep) {
      // Checks for matching passwords
      if (!checkPasswordMatch()) {
        setErrorMessage("ERROR: Passwords do not match!");
        return;
      } else {
        setErrorMessage("");
        return next();
      }
    } else if (!isLastStep) {
      // Proceeds through all the pages
      setErrorMessage("");
      return next();
    } else {
      // Adds account to database after user clicks Finish
      setErrorMessage("");
      const error = await addUserToDatabase();

      if (error) {
        setErrorMessage(`ERROR: ${error}`);
        return;
      }

      alert(`SUCCESS: Account created for ${data.email}`);
      navigate("/login");
    }
  }

  return (
    <div className={styles["signup-container"]}>
      <div className={styles["signup-header"]}>
        <Link to="/" className={styles["signup-link-no-underline"]}>
          <img src={logo} alt="Logo" className="logo" />
          <span className={styles["signup-site-name"]}>ThoughtfulBites</span>
        </Link>
      </div>
      <form onSubmit={onSubmit}>
        <div className={styles["signup-form-content"]}>
          {step}
          <p className={styles["signup-error-message"]}>{errorMessage}</p>
          <div className={styles["signup-navigation"]}>
            {/* <div className="pagination-dots"></div> */}
            {!isFirstStep && (
              <button
                type="button"
                className={styles["signup-back-button"]}
                onClick={back}
              >
                <img
                  src={arrow}
                  alt="left arrow"
                  className={styles["left-arrow"]}
                />
                Back
              </button>
            )}

            {isLastStep ? (
              <button type="submit" className={styles["signup-finish-button"]}>
                Finish
              </button>
            ) : (
              <button type="submit" className={styles["signup-next-button"]}>
                Next
                <img
                  src={arrow}
                  alt="right arrow"
                  className={styles["right-arrow"]}
                />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
