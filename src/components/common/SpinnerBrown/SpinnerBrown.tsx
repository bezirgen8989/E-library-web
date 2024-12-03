import styles from "./Spinner.module.scss";

type SpinnerProps = {
  top?: string;
  left?: string;
  position?: string;
  margin?: string;
};

const SpinnerBrown: React.FC<SpinnerProps> = ({
  top,
  left,
  position,
  margin,
}) => {
  return (
    <div
      className={styles.spinner}
      style={{
        // @ts-ignore
        position: `${position}`,
        top: `${top}`,
        left: `${left}`,
        margin: `${margin}`,
      }}
    >
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

export default SpinnerBrown;
