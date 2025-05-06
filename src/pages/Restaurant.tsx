import React from "react";
import "./Restaurant.css";
import RestaurantCarousel from "../components/RestaurantCarousel";
import RestaurantInfo from "../components/RestaurantInfo";

const Restaurant: React.FC = () => {
    return (
        <div className="restaurant">
            <h1 className="restaurant-title">McDonald's</h1>
            <RestaurantCarousel />
            <RestaurantInfo />
            <div className="restaurant-sections">
                <div className="section">
                    <h3>Section</h3>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                </div>
                <div className="section">
                    <h3>Section</h3>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                </div>
                <div className="section">
                    <h3>Section</h3>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                </div>
                <div className="section">
                    <h3>Section</h3>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                    <p>Text</p>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;