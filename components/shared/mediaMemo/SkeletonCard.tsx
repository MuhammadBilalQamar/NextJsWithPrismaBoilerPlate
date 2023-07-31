import React from 'react';
import styles from './styles.module.css';

type SkeletonCardProps = {
    className?: string;
    stips?: number | 4;
}

const SkeletonCard = ({ className, stips }: SkeletonCardProps) => {

    return (
        <>
            <section className={className}>
                {Array(stips).fill(0).map((_, i) => (
                    <div key={i} className={styles.skeletonPlaceholder} />
                ))}
            </section>
        </>
    );
};

export default SkeletonCard;
