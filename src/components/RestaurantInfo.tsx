import React from 'react';
import styles from './RestaurantInfo.module.css';

const RestaurantInfo: React.FC = () => {
    return (
        <div className={styles.stars}>
            <span className={`${styles.star} ${styles.filled}`}>★</span>
            <span className={`${styles.star} ${styles.filled}`}>★</span>
            <span className={`${styles.star} ${styles.filled}`}>★</span>
            <span className={`${styles.star} ${styles.empty}`}>★</span>
            <span className={`${styles.star} ${styles.empty}`}>★</span>
            <span className={styles.ratingText}>3.0 (58 Reviews)</span>
        </div>
    );
};

export default RestaurantInfo;