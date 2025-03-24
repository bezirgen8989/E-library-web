import styles from "./SpinnerButton.module.scss";

type SpinnerProps = {
  top?: string;
  left?: string;
  position?: string;
  margin?: string;
};

const SpinnerButton: React.FC<SpinnerProps> = ({
  top,
  left,
  position,
  margin,
}) => {
  return (
    <div className={styles.spinner}>
      <svg className="spinner" viewBox="0 0 50 50">
        <circle
          className={styles.path}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        ></circle>
      </svg>
    </div>
  );
};

export default SpinnerButton;
