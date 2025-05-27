import React from 'react';
import styles from './RestaurantCarousel.module.css';

const RestaurantCarousel: React.FC = () => {
    return (
        <div className={styles["carousel-container"]}>
            <button className={`${styles["carousel-button"]} ${styles["left"]}`}>←</button>
            <div className={styles["carousel-content"]}>
                <div className={styles["carousel-item"]}></div>
                <div className={styles["carousel-item"]}></div>
                <div className={styles["carousel-item"]}></div>
            </div>
            <button className={`${styles["carousel-button"]} ${styles["right"]}`}>→</button>
        </div>
    );
};

export default RestaurantCarousel;