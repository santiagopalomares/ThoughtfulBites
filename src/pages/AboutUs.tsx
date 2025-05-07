import styles from "./AboutUs.module.css";
import React, { useEffect, useState } from "react";
import sillyguy from "../assets/sillyguy.png";
import happyCustomers from "../assets/PeopleEating.png";

interface TeamMember {
  name: string;
  bio: string;
  image: string;
}

export default function AboutUs(): React.ReactElement {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const teamMembers: TeamMember[] = [
    {
      name: "Julian Apraicio",
      bio: "Text",
      image: sillyguy,
    },
    {
      name: "Queensley Lim",
      bio: "Text",
      image: sillyguy,
    },
    {
      name: "Geric Norman",
      bio: "Text",
      image: sillyguy,
    },
    {
      name: "Santiago Palomares",
      bio: "Text",
      image: sillyguy,
    },
  ];

  return (
    <div className={styles["about-container"]}>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />

      <section className={`${styles.section} ${styles["about-section"]}`}>
        <h1 className={styles["section-title"]}>About</h1>
        <div className={styles["about-content"]}>
          <div className={styles["mission-box"]}>
            <p>
              We believe everyone deserves to enjoy dining out without worry.
              Our mission is to connect people with dietary restrictions to
              restaurants that cater to their specific needs. Whether you have
              allergies, follow a specific diet, or have other food preferences,
              we're here to make finding the right restaurant easier.
            </p>
          </div>
        </div>
        <div className={styles["image-container"]}>
          <img
            src={happyCustomers}
            className={styles["full-width-image"]}
            alt="Happy customers enjoying their meal"
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles["team-section"]}`}>
        <h2 className={styles["section-subtitle"]}>Our Team</h2>
        <div className={styles["team-grid"]}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles["team-member"]}>
              <div className={styles["member-image-container"]}>
                <div
                  className={styles["member-image"]}
                  style={{ backgroundImage: `url(${member.image})` }}
                ></div>
              </div>
              <div className={styles["member-info"]}>
                <h3 className={styles["member-name"]}>{member.name}</h3>
                <p className={styles["member-bio"]}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles["footer-section"]}`}
      ></section>
    </div>
  );
}
