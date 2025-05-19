import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MenuOptions.css";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  dietary?: string[];
}

interface RestaurantData {
  id: string;
  name: string;
  description: string;
  address: string;
  hours: string;
  phone: string;
  website: string;
  menuItems: MenuItem[];
}

const MenuOptions: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const restaurantsData: { [key: string]: RestaurantData } = {
        nobu: {
          id: "nobu",
          name: "Nobu: Japanese Fusion",
          description:
            "World-renowned Japanese restaurant known for innovative new-style cuisine.",
          address: "903 N La Cienega Blvd, Los Angeles, CA 90069",
          hours: "Mon-Sun: 5:30PM-10:00PM",
          phone: "(310) 659-9899",
          website: "noburestaurants.com",
          menuItems: [
            {
              id: "nobu-1",
              name: "Black Cod with Miso",
              description:
                "Broiled black cod with sweet miso marinade, a signature dish.",
              price: "$36",
              image: "https://via.placeholder.com/300",
              category: "Signature",
              dietary: ["Gluten-Free"],
            },
            {
              id: "nobu-2",
              name: "Yellowtail Sashimi with Jalapeño",
              description:
                "Thinly sliced yellowtail with jalapeño and yuzu soy sauce.",
              price: "$28",
              image: "https://via.placeholder.com/300",
              category: "Signature",
              dietary: ["Gluten-Free"],
            },
            {
              id: "nobu-3",
              name: "Rock Shrimp Tempura",
              description:
                "Crispy rock shrimp tempura with spicy sauce or creamy sauce.",
              price: "$32",
              image: "https://via.placeholder.com/300",
              category: "Hot",
            },
            {
              id: "nobu-4",
              name: "Sushi Selection",
              description: "Chef's selection of premium sushi pieces.",
              price: "$45",
              image: "https://via.placeholder.com/300",
              category: "Sushi",
            },
            {
              id: "nobu-5",
              name: "Wagyu Beef",
              description:
                "Premium grade Japanese Wagyu beef with truffle sauce.",
              price: "$58",
              image: "https://via.placeholder.com/300",
              category: "Hot",
            },
          ],
        },
        "shake-shack": {
          id: "shake-shack",
          name: "Shake Shack: Gourmet Fast Food",
          description:
            'Modern-day "roadside" burger stand serving delicious burgers, fries, and shakes.',
          address: "252 S Brand Blvd, Glendale, CA 91204",
          hours: "Mon-Sun: 11:00AM-10:00PM",
          phone: "(818) 858-5772",
          website: "shakeshack.com",
          menuItems: [
            {
              id: "ss-1",
              name: "ShackBurger",
              description:
                "Cheeseburger topped with lettuce, tomato, and ShackSauce.",
              price: "$6.89",
              image: "https://via.placeholder.com/300",
              category: "Burgers",
            },
            {
              id: "ss-2",
              name: "Cheese Fries",
              description:
                "Crispy crinkle cut fries topped with a blend of melted cheese sauce.",
              price: "$4.79",
              image: "https://via.placeholder.com/300",
              category: "Sides",
            },
            {
              id: "ss-3",
              name: "Chocolate Shake",
              description: "Hand-spun chocolate frozen custard shake.",
              price: "$5.89",
              image: "https://via.placeholder.com/300",
              category: "Shakes",
            },
            {
              id: "ss-4",
              name: "Chicken Shack",
              description:
                "Crispy chicken breast with lettuce, pickles, and buttermilk herb mayo.",
              price: "$7.89",
              image: "https://via.placeholder.com/300",
              category: "Chicken",
            },
            {
              id: "ss-5",
              name: "Hot Dog",
              description:
                "100% beef, no hormones or antibiotics ever, split and griddled crisp.",
              price: "$5.29",
              image: "https://via.placeholder.com/300",
              category: "Hot Dogs",
            },
          ],
        },
        "french-laundry": {
          id: "french-laundry",
          name: "The French Laundry: Fine Dining",
          description:
            "Award-winning restaurant offering French cuisine and spectacular wine pairings in an elegant setting.",
          address: "6640 Washington St, Yountville, CA 94599",
          hours: "Wed-Sun: 5:00PM-9:00PM",
          phone: "(707) 944-2380",
          website: "frenchlaundry.com",
          menuItems: [
            {
              id: "fl-1",
              name: "Oysters and Pearls",
              description:
                "Sabayon of pearl tapioca with Island Creek oysters and white sturgeon caviar.",
              price: "Tasting Menu",
              image: "https://via.placeholder.com/300",
              category: "Signature",
            },
            {
              id: "fl-2",
              name: "Butter-Poached Lobster",
              description:
                "Maine lobster tail with garden vegetables and lobster emulsion.",
              price: "Tasting Menu",
              image: "https://via.placeholder.com/300",
              category: "Seafood",
            },
            {
              id: "fl-3",
              name: "Seasonal Tasting Menu",
              description:
                "9-course chef's tasting menu featuring the finest seasonal ingredients.",
              price: "$350 per person",
              image: "https://via.placeholder.com/300",
              category: "Tasting Menu",
            },
            {
              id: "fl-4",
              name: "Wagyu Beef",
              description: "Japanese Wagyu A5 with seasonal accompaniments.",
              price: "Tasting Menu",
              image: "https://via.placeholder.com/300",
              category: "Meat",
            },
            {
              id: "fl-5",
              name: "Wine Pairing",
              description:
                "Expert wine pairings selected to complement each course.",
              price: "$200 per person",
              image: "https://via.placeholder.com/300",
              category: "Beverages",
            },
          ],
        },
      };

      const foundRestaurant = restaurantsData[restaurantId || ""] || null;
      setRestaurant(foundRestaurant);
      setLoading(false);

      if (foundRestaurant && foundRestaurant.menuItems.length > 0) {
        const categories = [
          ...new Set(foundRestaurant.menuItems.map((item) => item.category)),
        ];
        if (categories.length > 0) {
          setActiveCategory("all");
        }
      }
    }, 800);
  }, [restaurantId]);

  const categories = restaurant?.menuItems
    ? [
        "all",
        ...Array.from(
          new Set(restaurant.menuItems.map((item) => item.category))
        ),
      ]
    : ["all"];

  const filteredItems = restaurant?.menuItems
    ? activeCategory === "all"
      ? restaurant.menuItems
      : restaurant.menuItems.filter((item) => item.category === activeCategory)
    : [];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="menu-options-container">
      <div className="menu-header">
        <button className="back-button" onClick={handleBack}>
          &lt; Back to Results
        </button>
        <h1>{restaurant?.name || "Restaurant Menu"}</h1>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading menu options...</p>
        </div>
      ) : restaurant ? (
        <div className="restaurant-content">
          <div className="restaurant-info">
            <p className="restaurant-description">{restaurant.description}</p>
            <div className="restaurant-details">
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

          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="menu-items-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-item-card">
                <div className="menu-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="menu-item-info">
                  <h3>{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-footer">
                    <span className="menu-item-price">{item.price}</span>
                    {item.dietary && item.dietary.length > 0 && (
                      <div className="menu-item-dietary">
                        {item.dietary.map((diet) => (
                          <span key={diet} className="dietary-tag">
                            {diet}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="not-found">
          <h2>Restaurant not found</h2>
          <p>Sorry, we couldn't find the restaurant you're looking for.</p>
          <button className="back-button" onClick={handleBack}>
            Back to Search Results
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuOptions;
