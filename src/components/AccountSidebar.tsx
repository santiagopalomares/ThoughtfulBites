import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <div className="logo-container">
                <div className="logo-square"></div>
                <span className="logo-text">ThoughtfulBites</span>
            </div>

            <div className="sidebar-menu">
                <div className="menu-item active">
                    <div className="menu-icon profile-icon"></div>
                    <span>Profile</span>
                </div>

                <div className="menu-item">
                    <div className="menu-icon diet-icon"></div>
                    <span>Diet Restrictions</span>
                </div>
            </div>

            <div className="logout-container">
                <div className="logout-icon"></div>
                <button className="logout-button">Log Out</button>
            </div>
        </div>
    );
};

export default Sidebar;