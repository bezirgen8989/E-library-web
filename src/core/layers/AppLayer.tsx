import { Drawer } from "antd";
import { useLazySelector } from "../../hooks";
import { setDrawerOpen } from "../../modules/Home/slices/home";
import { useDispatch } from "react-redux";
import Close from "../../assets/images/icons/Close.svg";
import Test from "../../assets/images/testBook.png";
import styles from "../../assets/css/commonStyles/CommonStyles.module.scss";

const AppLayer: React.FC = ({ children }) => {
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
    <>
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
          <div>
            <div className={styles.notificationsImg}>
              <img src={Test} alt="" />
            </div>
          </div>
        </Drawer>
      </div>
      {children}
    </>
  );
};

export default AppLayer;
