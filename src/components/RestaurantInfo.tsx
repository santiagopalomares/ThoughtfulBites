import React from 'react';
import './RestaurantInfo.css';

const RestaurantInfo: React.FC = () => {
    return (
        <div className="restaurant-info">
            <div className="rating-container">
                <div className="stars">
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star empty">★</span>
                    <span className="star empty">★</span>
                    <span className="rating-text">3.0 (58 Reviews)</span>
                </div>
                <div className="badges">
                    <div className="badge plant-based"></div>
                    <div className="badge nut-free"></div>
                    <div className="badge gluten-free"></div>
                </div>
            </div>

            <div className="info-details">
                <div className="allergies">
                    <h2>Possible Allergies On Menu</h2>
                    <ul>
                        <li>Milk</li>
                        <li>Eggs</li>
                        <li>Soy</li>
                        <li>Wheat</li>
                        <li>Mustard</li>
                    </ul>
                </div>

                <div className="offers">
                    <h2>Offers</h2>
                    <ul>
                        <li>Dairy-Free</li>
                        <li>Gluten-Free</li>
                        <li>Pescatarian</li>
                        <li>Vegetarian</li>
                        <li>Vegan</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <button className="action-button">
                        <span className="icon">📄</span> View Menu
                    </button>
                    <button className="action-button">
                        <span className="icon">📍</span> View Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantInfo;