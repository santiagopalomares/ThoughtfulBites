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
        <div className={styles.accountProfileContainer}>
            <div className={styles.sidebar}>
                <nav className={styles.navbar2}>
                    <div className={styles.navbarLeft2}>
                        <Link to="/">
                            <img src={Logo} alt="Logo" className={styles.logo2} />
                        </Link>
                        <span className={styles.siteName}>ThoughtfulBites</span>
                    </div>
                </nav>

                <nav className={styles.navigation}>
                    <button
                        className={`${styles.navItem2} ${activePage === 'profile' ? styles.active : ''}`}
                        onClick={handleProfileClick}
                    >
                        <div className={`${styles.navIcon2} ${styles.profileIcon}`}></div>
                        <span>Profile</span>
                    </button>
                    <button
                        className={`${styles.navItem2} ${activePage === 'dietRestrictions' ? styles.active : ''}`}
                        onClick={handleDietRestrictionsClick}
                    >
                        <div className={`${styles.navIcon2} ${styles.dietIcon}`}></div>
                        <span>Diet Restrictions</span>
                    </button>
                </nav>

                <div className={styles.logoutContainer2}>
                    <div className={styles.logoutIcon2}></div>
                    <button className={styles.logoutButton2} onClick={handleLogout}>Log Out</button>
                </div>
            </div>

            <div className={styles.mainContent}>
                {activePage === 'profile' ? (
                    <>
                        <div className={styles.profileHeader}>
                            <div className={styles.profileAvatar}></div>
                            <div className={styles.profileInfo}>
                                <h1>{user.firstName} {user.lastName}</h1>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <div className={styles.profileDetailsCard}>
                            <div className={styles.cardHeader}>
                                <h2>My Profile</h2>
                                <div className={styles.editActions}>
                                    {isEditing && (
                                        <button className={styles.cancelButton} onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`${styles.editButton} ${isEditing ? styles.saveButton : ''}`}
                                        onClick={handleEdit}
                                    >
                                        <span className={isEditing ? styles.saveIcon : styles.editIcon}></span>
                                        {isEditing ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.profileFields}>
                                <div className={styles.fieldRow}>
                                    <div className={styles.field}>
                                        <label>Firstname</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formValues.firstName}
                                                onChange={handleInputChange}
                                                className={styles.fieldInput}
                                            />
                                        ) : (
                                            <div className={styles.fieldValue}>{user.firstName}</div>
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
                                                className={styles.fieldInput}
                                            />
                                        ) : (
                                            <div className={styles.fieldValue}>{user.lastName}</div>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.fieldRow}>
                                    <div className={styles.field}>
                                        <label>Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formValues.email}
                                                onChange={handleInputChange}
                                                className={styles.fieldInput}
                                            />
                                        ) : (
                                            <div className={styles.fieldValue}>{user.email}</div>
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
                                                className={styles.fieldInput}
                                            />
                                        ) : (
                                            <div className={styles.fieldValue}>{user.password}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.deleteAccountContainer}>
                            <button className={styles.deleteAccountButton} onClick={handleDeleteAccount}>
                                Delete Account
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.dietHeader}>
                            <h1>Diet Information</h1>
                        </div>

                        <div className={styles.dietDetailsCard}>
                            <div className={styles.cardHeader}>
                                <h2>Diet Restrictions</h2>
                                <div className={styles.editActions}>
                                    {isEditingDietRestrictions && (
                                        <button className={styles.cancelButton} onClick={handleCancelDietRestrictions}>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`${styles.editButton} ${isEditingDietRestrictions ? styles.saveButton : ''}`}
                                        onClick={handleEditDietRestrictions}
                                    >
                                        <span className={isEditingDietRestrictions ? styles.saveIcon : styles.editIcon}></span>
                                        {isEditingDietRestrictions ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.dietRestrictionsOptions}>
                                {dietaryOptions.map(option => (
                                    <div key={option.id} className={styles.checkboxItem}>
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

                        <div className={styles.dietDetailsCard}>
                            <div className={styles.cardHeader}>
                                <h2>Dietary Details</h2>
                                <div className={styles.editActions}>
                                    {isEditingDietaryDetails && (
                                        <button className={styles.cancelButton} onClick={() => setIsEditingDietaryDetails(false)}>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`${styles.editButton} ${isEditingDietaryDetails ? styles.saveButton : ''}`}
                                        onClick={handleEditDietaryDetails}
                                    >
                                        <span className={isEditingDietaryDetails ? styles.saveIcon : styles.editIcon}></span>
                                        {isEditingDietaryDetails ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.foodSearchSection}>
                                {isEditingDietaryDetails && (
                                    <div className={styles.searchContainer}>
                                        <div className={styles.searchInputContainer}>
                                            <input
                                                type="text"
                                                className={styles.searchInput}
                                                placeholder="Search for foods..."
                                            />
                                            <span className={styles.searchIcon}></span>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.selectedFoods}>
                                    <h3>Selected Foods</h3>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.deleteConfirmationModal}>
                        <h2>WARNING</h2>
                        <p>Are you sure you want to delete your account? Your data will be lost and this action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={cancelDeleteAccount}>
                                Cancel
                            </button>
                            <button className={styles.confirmDeleteButton} onClick={confirmDeleteAccount}>
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