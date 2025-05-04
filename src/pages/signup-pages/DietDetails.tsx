import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import SearchIcon from "../../assets/SearchIcon.png";
import XWhite from "../../assets/X-white.png";
import XBlack from "../../assets/X-black.png";
import "./DietDetails.css";

type DietDetailsData = {
  userDietDetails: string[];
};

type DietDetailsProps = DietDetailsData & {
  updateFields: (fields: Partial<DietDetailsData>) => void;
};

export function DietDetails({
  userDietDetails,
  updateFields,
}: DietDetailsProps) {
  const [lastSearched, setLastSearched] = useState<string>("");

  const removeFood = (foodToRemove: string) => {
    const updatedDetails = userDietDetails.filter(
      (food) => food !== foodToRemove
    );
    updateFields({ userDietDetails: updatedDetails });
  };

  const handleSearch = (searchQuery: string) => {
    console.log("Search query:", searchQuery);
    setLastSearched(searchQuery);

    // Add the searched food to the userDietDetails array if it's not already there
    if (searchQuery && !userDietDetails.includes(searchQuery)) {
      const updatedDetails = [...userDietDetails, searchQuery];
      updateFields({ userDietDetails: updatedDetails });
    }
  };

  return (
    <>
      <h1 className="step-heading">Step 3: Diet Details</h1>
      <p className="information-text">
        Please provide further details on your diet restrictions by searching
        for your food in the search bar.
      </p>
      <div className="diet-details-container">
        <div className="searchbar-wrapper">
          <SearchBar
            placeholder="Search for foods, ingredients, ..."
            onSearch={handleSearch}
            buttonText="Search"
            searchIconSrc={SearchIcon}
          />
        </div>
        <div className="food-chips-container">
          {userDietDetails.map((food) => (
            <div className="diet-chip" key={food}>
              <button
                className="chip"
                type="button"
                onClick={() => removeFood(food)}
              ></button>
              {food}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
