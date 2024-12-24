import styles from "./SpinMic.module.scss";

const SpinMic = ({ small = false }) => (
  <div className={small ? styles.loaderMicSmall : styles.loaderMic}></div>
);

export default SpinMic;
