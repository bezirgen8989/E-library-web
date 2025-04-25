import { Skeleton } from "antd";
import styles from "./ProfileUserComponent.module.scss";
import { ProfileFormSkeleton } from "../ProfileUserForm/Skeleton";

export const ProfileUserComponentSkeleton = () => {
  return (
    <div className={styles.profile_page_wrap}>
      <div className={styles.profile_page}>
        <div className={styles.profile_page_content}>
          <div className={styles.profile_header}>
            <div style={{ padding: 0 }} className={styles.profile_logo}>
              <Skeleton.Avatar
                active={true}
                shape={"circle"}
                style={{
                  width: 94,
                  height: 94,
                }}
              />
            </div>
            <div className={styles.profile_info}>
              <div
                className={styles.profile_mainInfo}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  width: "100%",
                  flex: 1,
                }}
              >
                <Skeleton.Input
                  active={true}
                  className={styles.profile_userName}
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "14px",
                    background: "#EEE0D4",
                  }}
                />
                <Skeleton.Avatar
                  active={true}
                  size={"small"}
                  shape={"circle"}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
              }}
            >
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton.Input
                  key={index}
                  active={true}
                  style={{
                    width: "100%",
                    height: "22px",
                    borderRadius: "14px",
                    background: "#EEE0D4",
                  }}
                />
              ))}
            </div>

            <ProfileFormSkeleton inputCounts={5} />
          </div>
        </div>
      </div>
    </div>
  );
};
