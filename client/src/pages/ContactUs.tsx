import { FormEvent, useState } from "react";
import styles from "./ContactUs.module.css";

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
    setData((prev) => ({ ...prev, ...fields }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage("Please provide both your name and email.");
      return;
    }
    setErrorMessage("");

    try {
      const res = await fetch(
        "https://1j86zqq3p1.execute-api.us-west-1.amazonaws.com/ContactFormHandler",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setData(INITIAL_DATA);
      alert("Message sent — thank you!");
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Oops, something went wrong. Please try again.");
    }
  }

  return (
    <div className={styles.landingContainer}>
      <section className={`${styles.section} ${styles.hero}`}>
        <h1 className={styles.landingTitle}>Contact Us</h1>

        <section className={`${styles.section} ${styles.splitSection}`}>
          <form className={styles.contactForm} onSubmit={onSubmit}>
            <div className={styles.leftBox}>
              <input
                type="text"
                className={styles.nameEntry}
                placeholder="Name"
                value={name}
                onChange={(e) => updateFields({ name: e.target.value })}
                required
              />
              <input
                type="text"
                className={styles.emailEntry}
                placeholder="Email"
                value={email}
                onChange={(e) => updateFields({ email: e.target.value })}
                required
              />
              <textarea
                className={styles.messageEntry}
                placeholder="Message"
                value={message}
                onChange={(e) => updateFields({ message: e.target.value })}
                required
              />
              <button type="submit" className={styles.sendButton}>
                Send
              </button>
              {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            </div>
          </form>

          <div className={styles.rightBox}>
            <h2>Want to contact us?</h2>
            <p style={{ whiteSpace: "pre-line" }}>
              {`Have questions, feedback, or need help finding the perfect restaurant for your dietary needs?

We're here to help!

Whether you're looking for more information about our platform, want to suggest a restaurant, or just have something to share, feel free to reach out.
Your experience matters to us!`}
            </p>
          </div>
        </section>
      </section>
      <section className={styles.footerSection}></section>
    </div>
  );
}
