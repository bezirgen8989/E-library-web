import React from "react";
import styles from "./ChatSpinner.module.scss";

const Spinner: React.FC = () => {
  return (
    <div className={styles.spinner}>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </div>
  );
};

export default Spinner;
