import styles from "./DietaryRestrictions.module.css";

type DietData = {
  userDietTypes: string[];
};

type DietaryRestrictionsProps = DietData & {
  updateFields: (fields: Partial<DietData>) => void;
};

const DIET_RESTRICTIONS: string[] = [
  "Allergens",
  "Dairy-Free",
  "Gluten-Free",
  "Pescatarian",
  "Vegan",
  "Vegetarian",
  "Other",
  "None",
];

export function DietaryRestrictions({
  userDietTypes,
  updateFields,
}: DietaryRestrictionsProps) {
  const updateUserDiet = (dietChoice: string) => {
    if (dietChoice === "None" && !userDietTypes.includes("None")) {
      // Selecting "None" clears all other selections
      updateFields({ userDietTypes: ["None"] });
    } else if (userDietTypes.includes(dietChoice)) {
      // Deselect current choice
      updateFields({
        userDietTypes: userDietTypes.filter((diet) => diet !== dietChoice),
      });
    } else {
      // Deselect "None" if it's selected, and add the new choice
      const updatedDiet = userDietTypes.includes("None")
        ? [dietChoice]
        : [...userDietTypes, dietChoice];

      updateFields({ userDietTypes: updatedDiet });
    }
  };

  return (
    <>
      <h1 className={styles["step-heading"]}>Step 2: Dietary Restrictions</h1>
      <p className={styles["information-text"]}>
        Please select all of your dietary restrictions. If you don’t see your
        diet select <strong>Other</strong>.
      </p>
      <div className={styles["chips-container"]}>
        {DIET_RESTRICTIONS.map((dietChoice, index) => (
          <button
            key={dietChoice}
            type="button"
            value={dietChoice}
            className={`${styles["diet-chip"]} ${
              userDietTypes.includes(dietChoice) ? styles["selected"] : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => updateUserDiet(dietChoice)}
          >
            {dietChoice}
          </button>
        ))}
      </div>
      {(userDietTypes.includes("Allergens") ||
        userDietTypes.includes("Other")) && (
        <div
          className={`${styles["extra-step-text"]} ${styles.animated}`}
          key={userDietTypes
            .filter((t) => t === "Allergens" || t === "Other")
            .join()}
        >
          <p>
            Since you selected
            <strong>
              {[
                userDietTypes.includes("Allergens") && " Allergens",
                userDietTypes.includes("Other") &&
                  (userDietTypes.includes("Allergens")
                    ? " and Other"
                    : " Other"),
              ]
                .filter(Boolean)
                .join("")}
            </strong>
            , we'll ask for more details in the next step.
          </p>
        </div>
      )}
    </>
  );
}
