import React from 'react';
import styles from './RestaurantCarousel.module.css';

const RestaurantCarousel: React.FC = () => {
    return (
        <div className={styles.carouselContainer}>
            <button className={`${styles.carouselButton} ${styles.left}`}>←</button>
            <div className={styles.carouselContent}>
                {/* Placeholder for the fork and spoon icons */}
                <div className={styles.carouselItem}></div>
                <div className={styles.carouselItem}></div>
                <div className={styles.carouselItem}></div>
            </div>
            <button className={`${styles.carouselButton} ${styles.right}`}>→</button>
        </div>
    );
};

export default RestaurantCarousel;