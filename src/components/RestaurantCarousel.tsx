import React from 'react';
import './RestaurantCarousel.css';

const RestaurantCarousel: React.FC = () => {
    return (
        <div className="carousel-container">
            <button className="carousel-button left">←</button>
            <div className="carousel-content">
                {/* Placeholder for the fork and spoon icons */}
                <div className="carousel-item"></div>
                <div className="carousel-item"></div>
                <div className="carousel-item"></div>
            </div>
            <button className="carousel-button right">→</button>
        </div>
    );
};

export default RestaurantCarousel;