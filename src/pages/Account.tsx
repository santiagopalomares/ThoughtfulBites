import React, { useState } from 'react';
import styles from './Account.module.css';
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";

const Account: React.FC = () => {
    const [user, setUser] = useState({
        firstName: 'John',
        lastName: 'Smith',
        email: 'example@gmail.com',
        password: '••••••••••••'
    });

    const dietaryOptions = [
        { id: 'gluten', label: 'Gluten' },
        { id: 'dairy', label: 'Dairy' },
        { id: 'nuts', label: 'Nuts' },
        { id: 'eggs', label: 'Eggs' },
        { id: 'soy', label: 'Soy' },
        { id: 'shellfish', label: 'Shellfish' },
        { id: 'fish', label: 'Fish' },
        { id: 'redMeat', label: 'Red Meat' },
        { id: 'pork', label: 'Pork' },
        { id: 'vegan', label: 'Vegan' },
        { id: 'vegetarian', label: 'Vegetarian' }
    ];

    const [dietRestrictions, setDietRestrictions] = useState(
        dietaryOptions.reduce((acc, option) => ({ ...acc, [option.id]: true }), {})
    );

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingDietRestrictions, setIsEditingDietRestrictions] = useState(false);
    const [isEditingDietaryDetails, setIsEditingDietaryDetails] = useState(false);

    const [formValues, setFormValues] = useState({...user});
    const [dietRestrictionsForm, setDietRestrictionsForm] = useState({...dietRestrictions});

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [activePage, setActivePage] = useState('profile');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleEdit = () => {
        if (isEditing) {
            setUser({...formValues});
        }
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setFormValues({...user});
        setIsEditing(false);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setDietRestrictionsForm({
            ...dietRestrictionsForm,
            [name]: checked
        });
    };

    const handleEditDietRestrictions = () => {
        if (isEditingDietRestrictions) {
            setDietRestrictions({...dietRestrictionsForm});
        }
        setIsEditingDietRestrictions(!isEditingDietRestrictions);
    };

    const handleCancelDietRestrictions = () => {
        setDietRestrictionsForm({...dietRestrictions});
        setIsEditingDietRestrictions(false);
    };

    const handleEditDietaryDetails = () => {
        setIsEditingDietaryDetails(!isEditingDietaryDetails);
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = () => {
        console.log('Account deletion confirmed');
        setShowDeleteModal(false);
    };

    const cancelDeleteAccount = () => {
        setShowDeleteModal(false);
    };

    const handleProfileClick = () => {
        setActivePage('profile');
    };

    const handleDietRestrictionsClick = () => {
        setActivePage('dietRestrictions');
    };

    const handleLogout = () => {
        console.log('Log Out button clicked');
    };

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
                        className={`${styles["nav-item2"]} ${activePage === 'profile' ? styles.active : ''}`}
                        onClick={handleProfileClick}
                    >
                        <div className={`${styles["nav-icon2"]} ${styles["profile-icon"]}`}></div>
                        <span>Profile</span>
                    </button>
                    <button
                        className={`${styles["nav-item2"]} ${activePage === 'dietRestrictions' ? styles.active : ''}`}
                        onClick={handleDietRestrictionsClick}
                    >
                        <div className={`${styles["nav-icon2"]} ${styles["diet-icon"]}`}></div>
                        <span>Diet Restrictions</span>
                    </button>
                </nav>

                <div className={styles["logout-container2"]}>
                    <div className={styles["logout-icon2"]}></div>
                    <button className={styles["logout-button2"]} onClick={handleLogout}>Log Out</button>
                </div>
            </div>

            <div className={styles["main-content"]}>
                {activePage === 'profile' ? (
                    <>
                        <div className={styles["profile-header"]}>
                            <div className={styles["profile-avatar"]}></div>
                            <div className={styles["profile-info"]}>
                                <h1>{user.firstName} {user.lastName}</h1>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <div className={styles["profile-details-card"]}>
                            <div className={styles["card-header"]}>
                                <h2>My Profile</h2>
                                <div className={styles["edit-actions"]}>
                                    {isEditing && (
                                        <button className={styles["cancel-button"]} onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`${styles["edit-button"]} ${isEditing ? styles["save-button"] : ''}`}
                                        onClick={handleEdit}
                                    >
                                        <span className={isEditing ? styles["save-icon"] : styles["edit-icon"]}></span>
                                        {isEditing ? 'Save' : 'Edit'}
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
                                            <div className={styles["field-value"]}>{user.firstName}</div>
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
                                            <div className={styles["field-value"]}>{user.lastName}</div>
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
                                            />
                                        ) : (
                                            <div className={styles["field-value"]}>{user.password}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["delete-account-container"]}>
                            <button className={styles["delete-account-button"]} onClick={handleDeleteAccount}>
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
                                        <button className={styles["cancel-button"]} onClick={handleCancelDietRestrictions}>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`${styles["edit-button"]} ${isEditingDietRestrictions ? styles["save-button"] : ''}`}
                                        onClick={handleEditDietRestrictions}
                                    >
                                        <span className={isEditingDietRestrictions ? styles["save-icon"] : styles["edit-icon"]}></span>
                                        {isEditingDietRestrictions ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles["diet-restrictions-options"]}>
                                {dietaryOptions.map(option => (
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
                                        <button className={styles["cancel-button"]} onClick={() => setIsEditingDietaryDetails(false)}>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`${styles["edit-button"]} ${isEditingDietaryDetails ? styles["save-button"] : ''}`}
                                        onClick={handleEditDietaryDetails}
                                    >
                                        <span className={isEditingDietaryDetails ? styles["save-icon"] : styles["edit-icon"]}></span>
                                        {isEditingDietaryDetails ? 'Save' : 'Edit'}
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
                                            />
                                            <span className={styles["search-icon"]}></span>
                                        </div>
                                    </div>
                                )}

                                <div className={styles["selected-foods"]}>
                                    <h3>Selected Foods</h3>
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
                        <p>Are you sure you want to delete your account? Your data will be lost and this action cannot be undone.</p>
                        <div className={styles["modal-actions"]}>
                            <button className={styles["cancel-button"]} onClick={cancelDeleteAccount}>
                                Cancel
                            </button>
                            <button className={styles["confirm-delete-button"]} onClick={confirmDeleteAccount}>
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