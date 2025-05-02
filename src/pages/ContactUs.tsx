import { FormEvent, useState } from "react";
import "./Landing.css";

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
  const [data, setData] = useState(INITIAL_DATA);
  const [errorMessage, setErrorMessage] = useState("");

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !name) {
        setErrorMessage("No input was given for user or email. Try again.")
    
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
        <form onSubmit={onSubmit}>
            <div className="left-box">
                <input
                    type="text"
                    className="name-entry"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => updateFields({ name: e.target.value })}
                    required
                    autoFocus
                />
                <input
                    type="text"
                    className="email-entry"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => updateFields({ email: e.target.value })}
                    required
                    autoFocus
                />
                <textarea
                    className="message-entry"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => updateFields({ name: e.target.value })}
                    required
                    autoFocus
                />
                <button
          type="button"
          className="eye"
          onClick={submitContactUsMessage}
        >Send</button>
            </div>
        </form>
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
