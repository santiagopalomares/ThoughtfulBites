import React, { useState } from 'react';
import './Account.css';

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
        <div className="account-profile-container">
            <div className="sidebar">
                <nav className="navigation">
                    <button
                        className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}
                        onClick={handleProfileClick}
                    >
                        <div className="nav-icon profile-icon"></div>
                        <span>Profile</span>
                    </button>
                    <button
                        className={`nav-item ${activePage === 'dietRestrictions' ? 'active' : ''}`}
                        onClick={handleDietRestrictionsClick}
                    >
                        <div className="nav-icon diet-icon"></div>
                        <span>Diet Restrictions</span>
                    </button>
                </nav>
            </div>

            <div className="main-content">
                {activePage === 'profile' ? (
                    <>
                        <div className="profile-header">
                            <div className="profile-avatar"></div>
                            <div className="profile-info">
                                <h1>{user.firstName} {user.lastName}</h1>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <div className="profile-details-card">
                            <div className="card-header">
                                <h2>My Profile</h2>
                                <div className="edit-actions">
                                    {isEditing && (
                                        <button className="cancel-button" onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`edit-button ${isEditing ? 'save-button' : ''}`}
                                        onClick={handleEdit}
                                    >
                                        <span className={isEditing ? 'save-icon' : 'edit-icon'}></span>
                                        {isEditing ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                            </div>

                            <div className="profile-fields">
                                <div className="field-row">
                                    <div className="field">
                                        <label>Firstname</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formValues.firstName}
                                                onChange={handleInputChange}
                                                className="field-input"
                                            />
                                        ) : (
                                            <div className="field-value">{user.firstName}</div>
                                        )}
                                    </div>
                                    <div className="field">
                                        <label>Lastname</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formValues.lastName}
                                                onChange={handleInputChange}
                                                className="field-input"
                                            />
                                        ) : (
                                            <div className="field-value">{user.lastName}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="field-row">
                                    <div className="field">
                                        <label>Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formValues.email}
                                                onChange={handleInputChange}
                                                className="field-input"
                                            />
                                        ) : (
                                            <div className="field-value">{user.email}</div>
                                        )}
                                    </div>
                                    <div className="field">
                                        <label>Password</label>
                                        {isEditing ? (
                                            <input
                                                type="password"
                                                name="password"
                                                value={formValues.password}
                                                onChange={handleInputChange}
                                                className="field-input"
                                            />
                                        ) : (
                                            <div className="field-value">{user.password}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="delete-account-container">
                            <button className="delete-account-button" onClick={handleDeleteAccount}>
                                Delete Account
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="diet-header">
                            <h1>Diet Information</h1>
                        </div>

                        <div className="diet-details-card">
                            <div className="card-header">
                                <h2>Diet Restrictions</h2>
                                <div className="edit-actions">
                                    {isEditingDietRestrictions && (
                                        <button className="cancel-button" onClick={handleCancelDietRestrictions}>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`edit-button ${isEditingDietRestrictions ? 'save-button' : ''}`}
                                        onClick={handleEditDietRestrictions}
                                    >
                                        <span className={isEditingDietRestrictions ? 'save-icon' : 'edit-icon'}></span>
                                        {isEditingDietRestrictions ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                            </div>

                            <div className="diet-restrictions-options">
                                {dietaryOptions.map(option => (
                                    <div key={option.id} className="checkbox-item">
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

                        <div className="diet-details-card">
                            <div className="card-header">
                                <h2>Dietary Details</h2>
                                <div className="edit-actions">
                                    {isEditingDietaryDetails && (
                                        <button className="cancel-button" onClick={() => setIsEditingDietaryDetails(false)}>
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className={`edit-button ${isEditingDietaryDetails ? 'save-button' : ''}`}
                                        onClick={handleEditDietaryDetails}
                                    >
                                        <span className={isEditingDietaryDetails ? 'save-icon' : 'edit-icon'}></span>
                                        {isEditingDietaryDetails ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                            </div>

                            <div className="food-search-section">
                                {isEditingDietaryDetails && (
                                    <div className="search-container">
                                        <div className="search-input-container">
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder="Search for foods..."
                                            />
                                            <span className="search-icon"></span>
                                        </div>
                                    </div>
                                )}

                                <div className="selected-foods">
                                    <h3>Selected Foods</h3>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="delete-confirmation-modal">
                        <h2>WARNING</h2>
                        <p>Are you sure you want to delete your account? Your data will be lost and this action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={cancelDeleteAccount}>
                                Cancel
                            </button>
                            <button className="confirm-delete-button" onClick={confirmDeleteAccount}>
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