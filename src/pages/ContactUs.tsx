import { FormEvent, useState } from "react";
import "./ContactUs.css";

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
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { name, email, message } = data;

  function updateFields(fields: Partial<FormData>): void {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  function onSubmit(e: FormEvent): void {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
        setErrorMessage("Please provide both your name and email.")
        return;
    }

    setErrorMessage("");
    alert(`SUCCESS: Message sent by ${data.name}`); // TODO: Add endpoint here when ready
    setData(INITIAL_DATA)
    }

  return (
    <div className="landing-container">
      <section className="section hero">
        <h1 className="landing-title">
          Contact Us
        </h1>
      {/* Contact-Us Form */}
      <section className="section split-section">
        <form className="contact-form" onSubmit={onSubmit}>
          <div className="left-box">
            <input
                type="text"
                className="name-entry"
                placeholder="Name"
                value={name}
                onChange={(e) => updateFields({ name: e.target.value })}
                required
            />
            <input
                type="text"
                className="email-entry"
                placeholder="Email"
                value={email}
                onChange={(e) => updateFields({ email: e.target.value })}
                required
            />
            <textarea
                className="message-entry"
                placeholder="Message"
                value={message}
                onChange={(e) => updateFields({ message: e.target.value })}
                required
            />
            <button
              type="submit"
              className="send-button">
                Send
            </button>
            {errorMessage && <p className="error">{errorMessage}</p>}
          </div>
        </form>
        {/* Contact-Us Text */}
        <div className="right-box">
          <h2>Want to contact us?</h2>
          <p style={{ whiteSpace: "pre-line" }}>
          {
            `Have questions, feedback, or need help finding the perfect restaurant for your dietary needs?

            We're here to help!

            Whether you're looking for more information about our platform, want to suggest a restaurant, or just have something to share, feel free to reach out.
            Your experience matters to us!`
          }
          </p>
        </div>
      </section>
    </section>
    <section className="section footer-section"></section>
    </div>
  );
}
