import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./MenuOptions.module.css";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
  allergens?: string[];
}

interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  hours: string;
  phone: string;
  website: string;
}

// interface DietaryDetail {
//   id: string;
//   name: string;
//   type: "allergen" | "other";
// }

const MenuOptions: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const [personalizedItems, setPersonalizedItems] = useState<MenuItem[]>([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [userDataLoading, setUserDataLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserAllergies = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setIsUserLoggedIn(false);
          setUserDataLoading(false);
          return;
        }

        setIsUserLoggedIn(true);

        const response = await fetch(
          `http://localhost:8080/api/user/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        const allergies: string[] = [];

        if (userData.dietaryRestrictions) {
          userData.dietaryRestrictions.forEach((restriction: any) => {
            switch (restriction.type) {
              case "Gluten-Free":
                allergies.push("gluten", "wheat", "bread", "pasta");
                break;
              case "Dairy-Free":
                allergies.push("dairy", "milk", "cheese", "cream", "butter");
                break;
              case "Vegan":
                allergies.push(
                  "meat",
                  "dairy",
                  "egg",
                  "fish",
                  "seafood",
                  "milk",
                  "cheese",
                  "butter",
                  "cream"
                );
                break;
              case "Vegetarian":
                allergies.push(
                  "meat",
                  "fish",
                  "seafood",
                  "chicken",
                  "beef",
                  "pork"
                );
                break;
              case "Pescatarian":
                allergies.push("meat", "chicken", "beef", "pork");
                break;
              case "Allergens":
                if (restriction.customItems) {
                  restriction.customItems.forEach((item: string) => {
                    allergies.push(item.trim().toLowerCase());
                  });
                }
                break;
              case "Other":
                if (restriction.customItems) {
                  restriction.customItems.forEach((item: string) => {
                    allergies.push(item.trim().toLowerCase());
                  });
                }
                break;
            }
          });
        }

        setUserAllergies(allergies);
      } catch (error) {
        console.error("Error fetching user allergies:", error);
        setUserAllergies([]);
        setIsUserLoggedIn(!!localStorage.getItem("userId"));
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserAllergies();
  }, []);

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

  useEffect(() => {
    if (menuItems.length > 0 && isUserLoggedIn && !userDataLoading) {
      if (userAllergies.length > 0) {
        const filtered = menuItems.filter((item) => {
          const description = item.description.toLowerCase();
          const name = item.name.toLowerCase();
          const itemText = `${name} ${description}`;

          const hasAllergy = userAllergies.some((allergy) => {
            const allergyLower = allergy.toLowerCase();
            return itemText.includes(allergyLower);
          });

          return !hasAllergy;
        });

        setPersonalizedItems(filtered);
      } else {
        setPersonalizedItems(menuItems);
      }
    } else if (!isUserLoggedIn) {
      setPersonalizedItems([]);
    }
  }, [menuItems, userAllergies, isUserLoggedIn, userDataLoading]);

  const categories = React.useMemo(() => {
    const baseCategories =
      menuItems.length > 0
        ? [
            "all",
            ...Array.from(new Set(menuItems.map((item) => item.category))),
          ]
        : ["all"];

    if (isUserLoggedIn) {
      return [...baseCategories, "Personalized"];
    }

    return baseCategories;
  }, [menuItems, isUserLoggedIn]);

  const getFilteredItems = () => {
    if (activeCategory === "all") {
      return menuItems;
    } else if (activeCategory === "Personalized") {
      return personalizedItems;
    } else {
      return menuItems.filter((item) => item.category === activeCategory);
    }
  };

  const filteredItems = getFilteredItems();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCategoryChange = (category: string) => {
    if (category === "Personalized" && !isUserLoggedIn) {
      return;
    }
    setActiveCategory(category);
  };

  useEffect(() => {
    if (activeCategory === "Personalized" && !isUserLoggedIn) {
      setActiveCategory("all");
    }
  }, [isUserLoggedIn, activeCategory]);

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
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {category === "Personalized" &&
                  isUserLoggedIn &&
                  userAllergies.length > 0 &&
                  !userDataLoading && (
                    <span className={styles["allergy-count"]}>
                      ({personalizedItems.length} safe items)
                    </span>
                  )}
              </button>
            ))}
          </div>

          {activeCategory === "Personalized" &&
            isUserLoggedIn &&
            userAllergies.length === 0 &&
            !userDataLoading && (
              <div className={styles["no-allergies-message"]}>
                <p>
                  No dietary restrictions found in your profile.{" "}
                  <a href="/account">Update your profile</a> to see personalized
                  recommendations.
                </p>
              </div>
            )}

          {activeCategory === "Personalized" &&
            isUserLoggedIn &&
            userAllergies.length > 0 &&
            !userDataLoading && (
              <div className={styles["allergy-info"]}>
                <p>
                  Showing items safe for your dietary restrictions (
                  {userAllergies.length} restrictions applied)
                </p>
              </div>
            )}

          {activeCategory === "Personalized" && userDataLoading && (
            <div className={styles["loading-user-data"]}>
              <p>Loading your dietary preferences...</p>
            </div>
          )}

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
                  {activeCategory === "Personalized" &&
                    isUserLoggedIn &&
                    userAllergies.length > 0 && (
                      <div className={styles["allergy-safe-badge"]}>
                        ✓ Safe for your dietary restrictions
                      </div>
                    )}
                  <div className={styles["menu-item-footer"]}>
                    <span className={styles["menu-item-price"]}>
                      {item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 &&
            activeCategory === "Personalized" &&
            isUserLoggedIn &&
            userAllergies.length > 0 &&
            !userDataLoading && (
              <div className={styles["no-items-message"]}>
                <p>
                  No menu items found that match your dietary restrictions.
                  Please contact the restaurant for more information about
                  ingredient modifications.
                </p>
              </div>
            )}
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
