import React, { useState, useEffect } from "react";
import styles from "./Account.module.css";
import Logo from "../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

type DietRestrictions = {
  allergen: boolean;
  dairyfree: boolean;
  glutenfree: boolean;
  pescatarian: boolean;
  vegan: boolean;
  vegetarian: boolean;
  other: boolean;
  none: boolean;
};

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type DietaryDetail = {
  id: string;
  name: string;
  type: "allergen" | "other";
};

const Account: React.FC = () => {
  const [userId] = useState<string>(localStorage.getItem("userId") || "");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "••••••••••••",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const dietaryOptions = [
    { id: "allergen" as keyof DietRestrictions, label: "Allergen" },
    { id: "dairyfree" as keyof DietRestrictions, label: "Dairy-Free" },
    { id: "glutenfree" as keyof DietRestrictions, label: "Gluten-Free" },
    { id: "pescatarian" as keyof DietRestrictions, label: "Pescatarian" },
    { id: "vegan" as keyof DietRestrictions, label: "Vegan" },
    { id: "vegetarian" as keyof DietRestrictions, label: "Vegetarian" },
    { id: "other" as keyof DietRestrictions, label: "Other" },
    { id: "none" as keyof DietRestrictions, label: "None" },
  ];

  const [dietRestrictions, setDietRestrictions] = useState<DietRestrictions>(
    dietaryOptions.reduce(
      (acc, option) => ({ ...acc, [option.id]: false }),
      {} as DietRestrictions
    )
  );

  // New state for dietary details (custom items)
  const [dietaryDetails, setDietaryDetails] = useState<DietaryDetail[]>([]);
  const [dietaryDetailsForm, setDietaryDetailsForm] = useState<DietaryDetail[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDietRestrictions, setIsEditingDietRestrictions] =
    useState(false);
  const [isEditingDietaryDetails, setIsEditingDietaryDetails] = useState(false);

  const [formValues, setFormValues] = useState<UserData>({ ...user });
  const [dietRestrictionsForm, setDietRestrictionsForm] =
    useState<DietRestrictions>({
      ...dietRestrictions,
    });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activePage, setActivePage] = useState("profile");

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("No user ID found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/user/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        const emailPrefix = userData.email.split("@")[0];
        const nameParts = emailPrefix.split(".");
        const firstName = nameParts[0] || "User";
        const lastName = nameParts[1] || "";

        const userInfo: UserData = {
          firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
          lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
          email: userData.email,
          password: "••••••••••••",
        };

        setUser(userInfo);
        setFormValues(userInfo);

        const restrictionMap: DietRestrictions = dietaryOptions.reduce(
          (acc, option) => ({ ...acc, [option.id]: false }),
          {} as DietRestrictions
        );

        // Process dietary details (custom items)
        const details: DietaryDetail[] = [];

        userData.dietaryRestrictions.forEach((restriction: any) => {
          switch (restriction.type) {
            case "Gluten-Free":
              restrictionMap.glutenfree = true;
              break;
            case "Dairy-Free":
              restrictionMap.dairyfree = true;
              break;
            case "Vegan":
              restrictionMap.vegan = true;
              break;
            case "Vegetarian":
              restrictionMap.vegetarian = true;
              break;
            case "Pescatarian":
              restrictionMap.pescatarian = true;
              break;
            case "Allergens":
              restrictionMap.allergen = true;
              // Add custom allergen items to dietary details
              if (restriction.customItems) {
                restriction.customItems.forEach((item: string) => {
                  details.push({
                    id: `allergen-${item}-${Date.now()}`,
                    name: item.trim(),
                    type: "allergen",
                  });
                });
              }
              break;
            case "Other":
              restrictionMap.other = true;
              // Add custom other items to dietary details
              if (restriction.customItems) {
                restriction.customItems.forEach((item: string) => {
                  details.push({
                    id: `other-${item}-${Date.now()}`,
                    name: item.trim(),
                    type: "other",
                  });
                });
              }
              break;
          }
        });

        setDietRestrictions(restrictionMap);
        setDietRestrictionsForm(restrictionMap);
        setDietaryDetails(details);
        setDietaryDetailsForm([...details]);
      } catch (err) {
        setError("Failed to load user data");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleEdit = async () => {
    if (isEditing) {
      // Save changes to database
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formValues.email,
              password:
                formValues.password !== "••••••••••••"
                  ? formValues.password
                  : null,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        setUser({ ...formValues });
        alert("Profile updated successfully!");
      } catch (err) {
        alert("Failed to update profile");
        console.error("Error updating user:", err);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setFormValues({ ...user });
    setIsEditing(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDietRestrictionsForm({
      ...dietRestrictionsForm,
      [name]: checked,
    });
  };

  const handleEditDietRestrictions = async () => {
    if (isEditingDietRestrictions) {
      // Save dietary restrictions to database
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/${userId}/dietary-restrictions`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dietRestrictions: dietRestrictionsForm,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update dietary restrictions");
        }

        setDietRestrictions({ ...dietRestrictionsForm });
        alert("Dietary restrictions updated successfully!");
      } catch (err) {
        alert("Failed to update dietary restrictions");
        console.error("Error updating dietary restrictions:", err);
      }
    }
    setIsEditingDietRestrictions(!isEditingDietRestrictions);
  };

  const handleCancelDietRestrictions = () => {
    setDietRestrictionsForm({ ...dietRestrictions });
    setIsEditingDietRestrictions(false);
  };

  const handleEditDietaryDetails = async () => {
    if (isEditingDietaryDetails) {
      // Save dietary details to database
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/${userId}/dietary-details`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dietaryDetails: dietaryDetailsForm,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update dietary details");
        }

        setDietaryDetails([...dietaryDetailsForm]);
        alert("Dietary details updated successfully!");
      } catch (err) {
        alert("Failed to update dietary details");
        console.error("Error updating dietary details:", err);
      }
    }
    setIsEditingDietaryDetails(!isEditingDietaryDetails);
    setSearchTerm("");
  };

  const handleCancelDietaryDetails = () => {
    setDietaryDetailsForm([...dietaryDetails]);
    setIsEditingDietaryDetails(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      addFoodItem();
    }
  };

  const addFoodItem = () => {
    if (!searchTerm.trim()) return;

    // Determine type based on current dietary restrictions
    let itemType: "allergen" | "other" = "other";
    if (dietRestrictionsForm.allergen) {
      itemType = "allergen";
    }

    const newItem: DietaryDetail = {
      id: `${itemType}-${searchTerm.trim()}-${Date.now()}`,
      name: searchTerm.trim(),
      type: itemType,
    };

    // Check if item already exists
    const exists = dietaryDetailsForm.some(
      (item) => item.name.toLowerCase() === searchTerm.trim().toLowerCase()
    );

    if (!exists) {
      setDietaryDetailsForm([...dietaryDetailsForm, newItem]);
    }

    setSearchTerm("");
  };

  const removeFoodItem = (itemId: string) => {
    setDietaryDetailsForm(
      dietaryDetailsForm.filter((item) => item.id !== itemId)
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      // Clear localStorage and logout
      logout();
      localStorage.removeItem("userId");

      // Show success message
      alert("Account deleted successfully!");

      navigate("/");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
  };

  const handleProfileClick = () => {
    setActivePage("profile");
  };

  const handleDietRestrictionsClick = () => {
    setActivePage("dietRestrictions");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    // Redirect to login page or home
    console.log("Log Out button clicked");
  };

  if (loading) {
    return <div className={styles["loading"]}>Loading...</div>;
  }

  if (error) {
    return <div className={styles["error"]}>Error: {error}</div>;
  }

  return (
    <div className={styles["account-profile-container"]}>
      <div className={styles.sidebar}>
        <nav className={styles.navbar2}>
          <div className={styles["navbar-left2"]}>
            <Link to="/">
              <img src={Logo} alt="Logo" className={styles.logo2} />
            </Link>
            <span className={styles["site-name"]}>ThoughtfulBites</span>
          </div>
        </nav>

        <nav className={styles.navigation}>
          <button
            className={`${styles["nav-item2"]} ${
              activePage === "profile" ? styles.active : ""
            }`}
            onClick={handleProfileClick}
          >
            <div
              className={`${styles["nav-icon2"]} ${styles["profile-icon"]}`}
            ></div>
            <span>Profile</span>
          </button>
          <button
            className={`${styles["nav-item2"]} ${
              activePage === "dietRestrictions" ? styles.active : ""
            }`}
            onClick={handleDietRestrictionsClick}
          >
            <div
              className={`${styles["nav-icon2"]} ${styles["diet-icon"]}`}
            ></div>
            <span>Diet Restrictions</span>
          </button>
        </nav>

        <div className={styles["logout-container2"]}>
          <div className={styles["logout-icon2"]}></div>
          <button className={styles["logout-button2"]} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      <div className={styles["main-content"]}>
        {activePage === "profile" ? (
          <>
            <div className={styles["profile-header"]}>
              <div className={styles["profile-avatar"]}></div>
              <div className={styles["profile-info"]}>
                <h1>
                  {user.firstName} {user.lastName}
                </h1>
                <p>{user.email}</p>
              </div>
            </div>

            <div className={styles["profile-details-card"]}>
              <div className={styles["card-header"]}>
                <h2>My Profile</h2>
                <div className={styles["edit-actions"]}>
                  {isEditing && (
                    <button
                      className={styles["cancel-button"]}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className={`${styles["edit-button"]} ${
                      isEditing ? styles["save-button"] : ""
                    }`}
                    onClick={handleEdit}
                  >
                    <span
                      className={
                        isEditing ? styles["save-icon"] : styles["edit-icon"]
                      }
                    ></span>
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>
              </div>

              <div className={styles["profile-fields"]}>
                <div className={styles["field-row"]}>
                  <div className={styles.field}>
                    <label>Firstname</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={handleInputChange}
                        className={styles["field-input"]}
                      />
                    ) : (
                      <div className={styles["field-value"]}>
                        {user.firstName}
                      </div>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label>Lastname</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formValues.lastName}
                        onChange={handleInputChange}
                        className={styles["field-input"]}
                      />
                    ) : (
                      <div className={styles["field-value"]}>
                        {user.lastName}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles["field-row"]}>
                  <div className={styles.field}>
                    <label>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                        className={styles["field-input"]}
                      />
                    ) : (
                      <div className={styles["field-value"]}>{user.email}</div>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label>Password</label>
                    {isEditing ? (
                      <input
                        type="password"
                        name="password"
                        value={formValues.password}
                        onChange={handleInputChange}
                        className={styles["field-input"]}
                        placeholder="Enter new password"
                      />
                    ) : (
                      <div className={styles["field-value"]}>
                        {user.password}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles["delete-account-container"]}>
              <button
                className={styles["delete-account-button"]}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles["diet-header"]}>
              <h1>Diet Information</h1>
            </div>

            <div className={styles["diet-details-card"]}>
              <div className={styles["card-header"]}>
                <h2>Diet Restrictions</h2>
                <div className={styles["edit-actions"]}>
                  {isEditingDietRestrictions && (
                    <button
                      className={styles["cancel-button"]}
                      onClick={handleCancelDietRestrictions}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className={`${styles["edit-button"]} ${
                      isEditingDietRestrictions ? styles["save-button"] : ""
                    }`}
                    onClick={handleEditDietRestrictions}
                  >
                    <span
                      className={
                        isEditingDietRestrictions
                          ? styles["save-icon"]
                          : styles["edit-icon"]
                      }
                    ></span>
                    {isEditingDietRestrictions ? "Save" : "Edit"}
                  </button>
                </div>
              </div>

              <div className={styles["diet-restrictions-options"]}>
                {dietaryOptions.map((option) => (
                  <div key={option.id} className={styles["checkbox-item"]}>
                    <input
                      type="checkbox"
                      id={option.id}
                      name={option.id}
                      checked={dietRestrictionsForm[option.id]}
                      onChange={handleCheckboxChange}
                      disabled={!isEditingDietRestrictions}
                    />
                    <label htmlFor={option.id}>{option.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["diet-details-card"]}>
              <div className={styles["card-header"]}>
                <h2>Dietary Details</h2>
                <div className={styles["edit-actions"]}>
                  {isEditingDietaryDetails && (
                    <button
                      className={styles["cancel-button"]}
                      onClick={handleCancelDietaryDetails}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className={`${styles["edit-button"]} ${
                      isEditingDietaryDetails ? styles["save-button"] : ""
                    }`}
                    onClick={handleEditDietaryDetails}
                  >
                    <span
                      className={
                        isEditingDietaryDetails
                          ? styles["save-icon"]
                          : styles["edit-icon"]
                      }
                    ></span>
                    {isEditingDietaryDetails ? "Save" : "Edit"}
                  </button>
                </div>
              </div>

              <div className={styles["food-search-section"]}>
                {isEditingDietaryDetails && (
                  <div className={styles["search-container"]}>
                    <div className={styles["search-input-container"]}>
                      <input
                        type="text"
                        className={styles["search-input"]}
                        placeholder="Search for foods..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchKeyPress}
                      />
                      <span className={styles["search-icon"]}></span>
                      {searchTerm.trim() && (
                        <button
                          className={styles["add-button"]}
                          onClick={addFoodItem}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles["dietary-details-list"]}>
                  {(isEditingDietaryDetails
                    ? dietaryDetailsForm
                    : dietaryDetails
                  ).length > 0 ? (
                    <>
                      <div className={styles["food-items-container"]}>
                        {(isEditingDietaryDetails
                          ? dietaryDetailsForm
                          : dietaryDetails
                        ).map((item) => (
                          <div key={item.id} className={styles["food-item"]}>
                            <span className={styles["food-name"]}>
                              {item.name}
                            </span>
                            <span className={styles["food-type"]}>
                              ({item.type})
                            </span>
                            {isEditingDietaryDetails && (
                              <button
                                className={styles["remove-button"]}
                                onClick={() => removeFoodItem(item.id)}
                                title="Remove item"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className={styles["no-items-message"]}>
                      {dietRestrictionsForm.allergen ||
                      dietRestrictionsForm.other
                        ? "No specific foods added yet. Use the search bar above to add foods."
                        : "Enable 'Allergen' or 'Other' restrictions to add specific foods."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["delete-confirmation-modal"]}>
            <h2>WARNING</h2>
            <p>
              Are you sure you want to delete your account? Your data will be
              lost and this action cannot be undone.
            </p>
            <div className={styles["modal-actions"]}>
              <button
                className={styles["cancel-button"]}
                onClick={cancelDeleteAccount}
              >
                Cancel
              </button>
              <button
                className={styles["confirm-delete-button"]}
                onClick={confirmDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
