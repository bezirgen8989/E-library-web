import { Drawer } from "antd";
import styles from "./SideDrawer.module.scss";
import Close from "../../../assets/images/icons/Close.svg";
import Test from "../../../assets/images/testBook.png";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";
import { setDrawerOpen } from "../../../modules/Home/slices/home";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { isDrawerOpen } = useLazySelector(({ home }) => {
    const { isDrawerOpen } = home;
    return {
      isDrawerOpen,
    };
  });
  const onClose = () => {
    dispatch(setDrawerOpen(false));
  };

  return (
    <div className="site-drawer-render-in-current-wrapper">
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className={styles.notificationsTitle}>
              Notifications
              <span style={{ color: "#996C42", paddingLeft: 5 }}>(1)</span>
            </span>
            <span style={{ cursor: "pointer" }} onClick={onClose}>
              <img src={Close} alt="X" />
            </span>
          </div>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={isDrawerOpen}
        getContainer={false}
        style={{ position: "absolute" }}
        width={486}
      >
        <div className={styles.notificationWrap}>
          <div className={styles.notificationImage}>
            <img src={Test} alt="" />
          </div>
          <div>
            <div className={styles.infoTitle}>
              Continue reading Khaled Hosseini -Sea Eagle
            </div>
            <div className={styles.notificationsBottom}>
              <div className={styles.notificationLink}>Continue Reading</div>
              <div className={styles.timeSent}>10 min ago</div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default SideDrawer;
