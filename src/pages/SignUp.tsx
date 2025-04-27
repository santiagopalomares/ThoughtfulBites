import { FormEvent, useState } from "react";
import "./SignUp.css";
import logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import { useMultistepForm } from "../components/useMultistepForm";
import { UserInformation } from "./signup-pages/UserInformation";

type FormData = {
  email: string;
  password: string;
};

const INITIAL_DATA: FormData = {
  email: "",
  password: "",
};

export default function SignUp() {
  const [data, setData] = useState(INITIAL_DATA);

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const { step, isFirstStep, back, next, isLastStep } = useMultistepForm([
    <UserInformation {...data} updateFields={updateFields} />,
    <h1 className="step-heading">Step 2: Dietary Restrictions</h1>,
  ]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep) return next();
    alert(`SUCCESS: Account created for ${data.email}`); // TODO: Add User to database
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
        <div className="navigation">
          <div className="pagination-dots"></div>
          {!isFirstStep && (
            <button type="button" onClick={back}>
              Back
            </button>
          )}
          <button type="submit">{isLastStep ? "Finish" : "Next"}</button>
        </div>
      </form>
    </div>
  );
}
