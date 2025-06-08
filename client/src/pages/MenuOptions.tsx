import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./MenuOptions.module.css";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
}

interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  hours: string;
  phone: string;
  website: string;
}

const MenuOptions: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!restaurantId) return;

      const decodedRestaurantName = decodeURIComponent(restaurantId);
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:8080/api/menu/${encodeURIComponent(
            decodedRestaurantName
          )}`
        );
        setMenuItems(response.data.menu);
        setActiveCategory("all");

        setRestaurant({
          name: decodedRestaurantName,
          description: `${decodedRestaurantName} offers a delicious selection of carefully crafted dishes.`,
          address: "123 Main Street, Irvine, CA 92614",
          hours: "Mon-Sun: 11:00AM-10:00PM",
          phone: "(949) 555-0123",
          website: "restaurant-website.com",
        });
      } catch (error) {
        console.error("Error fetching menu:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  const categories =
    menuItems.length > 0
      ? ["all", ...Array.from(new Set(menuItems.map((item) => item.category)))]
      : ["all"];

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles["menu-options-container"]}>
      <div className={styles["menu-header"]}>
        <button className={styles["back-button"]} onClick={handleBack}>
          &lt; Back to Results
        </button>
        <h1>{restaurant?.name || "Restaurant Menu"}</h1>
      </div>

      {loading ? (
        <div className={styles["loading"]}>
          <div className={styles["loading-spinner"]}></div>
          <p>Loading menu options...</p>
        </div>
      ) : menuItems.length > 0 ? (
        <div className={styles["restaurant-content"]}>
          {restaurant && (
            <div className={styles["restaurant-info"]}>
              <p className={styles["restaurant-description"]}>
                {restaurant.description}
              </p>
              <div className={styles["restaurant-details"]}>
                <p>
                  <strong>Address:</strong> {restaurant.address}
                </p>
                <p>
                  <strong>Hours:</strong> {restaurant.hours}
                </p>
                <p>
                  <strong>Phone:</strong> {restaurant.phone}
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={`https://${restaurant.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {restaurant.website}
                  </a>
                </p>
              </div>
            </div>
          )}

          <div className={styles["category-tabs"]}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles["category-tab"]} ${
                  activeCategory === category ? styles["active"] : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles["menu-items-grid"]}>
            {filteredItems.map((item, index) => (
              <div key={index} className={styles["menu-item-card"]}>
                <div className={styles["menu-item-image"]}>
                  <img src="https://via.placeholder.com/300" alt={item.name} />
                </div>
                <div className={styles["menu-item-info"]}>
                  <h3>{item.name}</h3>
                  <p className={styles["menu-item-description"]}>
                    {item.description}
                  </p>
                  <div className={styles["menu-item-footer"]}>
                    <span className={styles["menu-item-price"]}>
                      {item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles["not-found"]}>
          <h2>Menu not available</h2>
          <p>Sorry, we couldn't load the menu for this restaurant.</p>
          <button className={styles["back-button"]} onClick={handleBack}>
            Back to Search Results
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuOptions;
