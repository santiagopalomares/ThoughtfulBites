import React from 'react';
import './RestaurantInfo.css';

const RestaurantInfo: React.FC = () => {
    return (
        <div className="stars">
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star empty">★</span>
            <span className="star empty">★</span>
            <span className="rating-text">3.0 (58 Reviews)</span>
        </div>
    );
};

export default RestaurantInfo;