import styles from "./Landing.module.css";
import SearchBar from "../components/SearchBar";
import SearchIcon from "../assets/SearchIcon.png";
import EatingImage from "../assets/EatingLanding.png";
import EatingHappy from "../assets/EatingHappy.png";
import MenueBefore from "../assets/MenuBeforeTime.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearch = (searchQuery: string) => {
    console.log("Search submitted:", searchQuery);
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className={styles["landing-container"]}>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />

      <section className={`${styles.section} ${styles.hero}`}>
        <h1 className={styles["landing-title"]}>
          Find Restaurants That Match Your Dietary Needs
        </h1>
        <SearchBar
          placeholder="Search for restaurants, cuisines, ..."
          onSearch={handleSearch}
          buttonText="Search"
          searchIconSrc={SearchIcon}
        />
      </section>

      <section
        className={`${styles.section} ${styles["split-section"]} ${styles["left-image"]}`}
      >
        <div className={styles["left-box"]}>
          <img
            src={MenueBefore}
            alt="Menu Before"
            className={styles.responsiveImage}
          />
        </div>
        <div className={styles["right-text"]}>
          <h2>Preview Menus and Nutritional Info in Advance</h2>
          <p>
            Before you even step inside, explore the menu online to check for
            allergen-free options, gluten-free dishes, or low-carb meals. Know
            what fits your dietary needs, so you can make an informed choice.
          </p>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles["image-highlight"]}`}
        style={{ backgroundImage: `url(${EatingImage})` }}
      >
        <div className={styles["image-overlay-text"]}>
          <h2>Make Dining Out Stress-Free with Customizable Filters</h2>
          <p>
            Filter restaurants based on your dietary restrictions, whether you
            have a gluten intolerance, vegan preferences, or need low-sodium
            options. Find the perfect spot without the worry!
          </p>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles["split-section"]} ${styles["right-image"]}`}
      >
        <div className={styles["left-text"]}>
          <h2>Discover Places Where You Can Enjoy a Safe Meal</h2>
          <p>
            Whether you're avoiding dairy, following a keto diet, or managing a
            food allergy, our tool helps you find restaurants that prioritize
            your health and dietary needs. Enjoy your meal without compromise!
          </p>
        </div>
        <div className={styles["right-box"]}>
          <img
            src={EatingHappy}
            alt="Eating Happy"
            className={styles.responsiveImage}
          />
        </div>
      </section>

      <section
        className={`${styles.section} ${styles["footer-section"]}`}
      ></section>
    </div>
  );
}
