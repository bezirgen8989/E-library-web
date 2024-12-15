import { Drawer } from "antd";
import styles from "./SideDrawer.module.scss";
import Close from "../../../assets/images/icons/Close.svg";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";
import {
  getAllNotifications,
  markAsRead,
  setDrawerOpen,
} from "../../../modules/Home/slices/home";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import ChatSpinner from "../ChatSpinner";

interface NotificationTimeProps {
  sentAt: string | Date;
}

interface Notification {
  id: string;
  imageUrl: string;
  title: string;
  notificationType: string;
  sentAt: string;
  content: string;
}

const NotificationTime = ({ sentAt }: NotificationTimeProps) => {
  return (
    <div className={styles.timeSent}>
      {formatDistanceToNow(new Date(sentAt), { addSuffix: true })}
    </div>
  );
};

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { isDrawerOpen, notifications, isLoading } = useLazySelector(
    ({ home }) => {
      const { isDrawerOpen, notifications } = home;
      const { isLoading } = notifications;
      return {
        isDrawerOpen,
        notifications,
        isLoading,
      };
    }
  );

  console.log("notifications", notifications);

  // Состояние для хранения прочитанных уведомлений
  const [readNotifications, setReadNotifications] = useState<
    Record<string, boolean>
  >({});
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  // Функция для обработки прочтения уведомлений
  const handleIsRead = (id: string) => {
    if (!readNotifications[id]) {
      setReadNotifications((prev) => ({ ...prev, [id]: true }));
      setReadNotificationIds((prev) => [...prev, id]);
    }
  };

  const onClose = () => {
    if (readNotificationIds.length > 0) {
      dispatch(markAsRead({ ids: readNotificationIds }));
    }
    dispatch(setDrawerOpen(false));
    setReadNotificationIds([]);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      dispatch(
        getAllNotifications({
          limit: "10",
          page: "1",
          order: "",
          filter: "",
        })
      );
    }
  }, [dispatch, isDrawerOpen]);

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
              <span style={{ color: "#996C42", paddingLeft: 5 }}>
                ({notifications?.result?.total || 0})
              </span>
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
        {isLoading ? (
          <ChatSpinner />
        ) : (
          <div className={styles.notificationList}>
            {notifications?.result?.data?.length > 0 ? (
              notifications.result.data.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={styles.notificationWrap}
                  onClick={() => handleIsRead(notification.id)}
                >
                  <div className={styles.notificationImage}>
                    {!readNotifications[notification.id] && (
                      <div className={styles.readMarker} />
                    )}
                    <img src={notification.imageUrl} alt={notification.title} />
                  </div>
                  <div style={{ width: "100%" }}>
                    <div className={styles.infoTitle}>
                      {notification.content}
                    </div>
                    <div className={styles.notificationsBottom}>
                      <div className={styles.notificationLink}>
                        {notification.content.includes("Continue Reading")
                          ? "Continue Reading"
                          : "Start Reading"}
                      </div>
                      <div className={styles.timeSent}>
                        <NotificationTime
                          sentAt={new Date(notification.sentAt)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No notifications available.</div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default SideDrawer;
