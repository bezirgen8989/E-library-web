import React, { useContext, useState } from "react";
import styles from "./Review.module.scss";
import { Popconfirm, Rate } from "antd";
import DeleteIcon from "../../../../../assets/images/icons/delete_icon.svg";
import { UserContext } from "../../../../../core/contexts";
import { useTranslation } from "react-i18next";

type UserType = {
  userName: string;
};

type ReviewType = {
  id?: number;
  rating: number;
  text: string;
  reviewer: string;
  deleteReview: (id: number | undefined) => void;
  user?: UserType;
  reviewerId?: string;
};

const Review: React.FC<ReviewType> = ({
  reviewerId,
  rating,
  text,
  reviewer,
  id,
  deleteReview,
}) => {
  const [okButtonOpacity, setOkButtonOpacity] = useState(1);
  const [cancelButtonOpacity, setCancelButtonOpacity] = useState(1);
  const value = useContext(UserContext);
  const { t } = useTranslation();

  return (
    <div className={styles.review}>
      <div>
        <div className={styles.review_star}>
          <Rate disabled count={1} defaultValue={1} />
          <span>{rating}</span>
        </div>
      </div>
      <span style={{ fontSize: "18px" }}>{text}</span>
      <div className={styles.reviewer}>
        <div>{reviewer}</div>
        {reviewerId === value?.id && (
          <div className={styles.deleteBtn}>
            <Popconfirm
              title={
                <span style={{ paddingLeft: "0" }}>{t("deleteReview")}</span>
              }
              onConfirm={() => deleteReview(id)}
              okText={t("deleteBtn")}
              cancelText={t("cancelBtn")}
              icon={null}
              okButtonProps={{
                style: {
                  width: "100%",
                  background: "transparent",
                  borderRadius: "6px",
                  border: "1px solid #929292",
                  color: "#CF1B1B",
                  height: "35px",
                  marginLeft: "0",
                  opacity: okButtonOpacity,
                },
                onMouseEnter: () => setOkButtonOpacity(0.7),
                onMouseLeave: () => setOkButtonOpacity(1),
              }}
              cancelButtonProps={{
                style: {
                  width: "100%",
                  background: "transparent",
                  borderRadius: "6px",
                  border: "1px solid #929292",
                  color: "#198216",
                  marginBottom: "10px",
                  height: "35px",
                  marginLeft: "0",
                  opacity: cancelButtonOpacity,
                },
                onMouseEnter: () => setCancelButtonOpacity(0.7),
                onMouseLeave: () => setCancelButtonOpacity(1),
              }}
            >
              <img
                src={DeleteIcon}
                alt="delete"
                style={{ cursor: "pointer" }}
              />
            </Popconfirm>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
