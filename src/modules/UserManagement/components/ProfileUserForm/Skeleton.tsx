import { Skeleton } from "antd";
import styles from "./ProfileUserForm.module.scss";

type Props = {
  inputCounts: number;
};

export const ProfileFormSkeleton = ({ inputCounts }: Props) => {
  return (
    <div className={styles.profileForm}>
      {Array.from({ length: inputCounts }).map((_, index) => (
        <Skeleton.Input
          key={index}
          active={true}
          style={{
            width: "100%",
            height: "68px",
            borderRadius: "14px",
            background: "#EEE0D4",
          }}
        />
      ))}
    </div>
  );
};
