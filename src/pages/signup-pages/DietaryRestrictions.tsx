import "./DietaryRestrictions.css";

type DietData = {
  userDiet: string[];
};

type DietaryRestrictionsProps = DietData & {
  updateFields: (fields: Partial<DietData>) => void;
};

const DIET_RESTRICTIONS: string[] = [
  "Allergens",
  "Dairy-Free",
  "Gluten-Free",
  "Pescatarian",
  "Vegetarian",
  "Vegan",
  "Other",
  "None",
];

export function DietaryRestrictions({
  userDiet,
  updateFields,
}: DietaryRestrictionsProps) {
  const updateUserDiet = (dietChoice: string) => {
    if (dietChoice === "None" && !userDiet.includes("None")) {
      // Selecting "None" clears all other selections
      updateFields({ userDiet: ["None"] });
    } else if (userDiet.includes(dietChoice)) {
      // Deselect current choice
      updateFields({
        userDiet: userDiet.filter((diet) => diet !== dietChoice),
      });
    } else {
      // Deselect "None" if it's selected, and add the new choice
      const updatedDiet = userDiet.includes("None")
        ? [dietChoice]
        : [...userDiet, dietChoice];

      updateFields({ userDiet: updatedDiet });
    }
    console.log(userDiet);
  };

  return (
    <>
      <h1 className="step-heading">Step 2: Dietary Restrictions</h1>
      <p className="information-text">
        Please select all of your dietary restrictions. If you don’t see your
        diet select <strong>Other</strong>.
      </p>
      <div className="chips-container">
        {DIET_RESTRICTIONS.map((dietChoice) => (
          <button
            key={dietChoice}
            type="button"
            value={dietChoice}
            className={`diet-chip ${
              userDiet.includes(dietChoice) ? "selected" : ""
            }`}
            onClick={() => updateUserDiet(dietChoice)}
          >
            {dietChoice}
          </button>
        ))}
      </div>
    </>
  );
}
