import "./Landing.css";
import SearchBar from "../components/SearchBar";
import SearchIcon from "../assets/SearchIcon.png";
import EatingImage from "../assets/EatingLanding.png";
import EatingHappy from "../assets/EatingHappy.png";
import MenueBefore from "../assets/MenuBeforeTime.png";

export default function Landing() {
  const handleSearch = (searchQuery: string) => {
    console.log("Search submitted:", searchQuery);
  };

  return (
    <div className="landing-container">
      <section className="section hero">
        <h1 className="landing-title">
          Find Restaurants That Match Your Dietary Needs
        </h1>
        <SearchBar
          placeholder="Search for restaurants, cuisines, ..."
          onSearch={handleSearch}
          buttonText="Search"
          searchIconSrc={SearchIcon}
        />
      </section>

      <section className="section split-section left-image">
        <div className="left-box">
          <img src={MenueBefore} alt="Menu Before" />
        </div>
        <div className="right-text">
          <h2>Preview Menus and Nutritional Info in Advance</h2>
          <p>
            Before you even step inside, explore the menu online to check for
            allergen-free options, gluten-free dishes, or low-carb meals. Know
            what fits your dietary needs, so you can make an informed choice.
          </p>
        </div>
      </section>

      <section
        className="section image-highlight"
        style={{ backgroundImage: `url(${EatingImage})` }}
      >
        <div className="image-overlay-text">
          <h2>Make Dining Out Stress-Free with Customizable Filters</h2>
          <p>
            Filter restaurants based on your dietary restrictions, whether you
            have a gluten intolerance, vegan preferences, or need low-sodium
            options. Find the perfect spot without the worry!
          </p>
        </div>
      </section>

      <section className="section split-section right-image">
        <div className="left-text">
          <h2>Discover Places Where You Can Enjoy a Safe Meal</h2>
          <p>
            Whether you're avoiding dairy, following a keto diet, or managing a
            food allergy, our tool helps you find restaurants that prioritize
            your health and dietary needs. Enjoy your meal without compromise!
          </p>
        </div>
        <div className="right-box">
          <img src={EatingHappy} alt="Eating Happy" />
        </div>
      </section>

      <section className="section footer-section"></section>
    </div>
  );
}
