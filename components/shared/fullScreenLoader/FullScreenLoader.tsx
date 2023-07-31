import React from 'react';
import styles from './styles.module.css';

const FullScreenLoader = () => {

  return (
    <>
      <div style={{ height: "62vh", width: "100%", zIndex: 999, backgroundColor: 'black' }}>
        <div className={styles.loading}>
          {/* Loading&#8230; */}
          <h4 className={styles.text}>{"Loading....."}</h4>
        </div>

      </div>
    </>
  );
};

export default FullScreenLoader;
