import React, { useContext, useState } from "react";
import styles from "./Review.module.scss";
import { Popconfirm } from "antd";
import DeleteIcon from "../../../../../assets/images/icons/delete_icon.svg";
import { UserContext } from "../../../../../core/contexts";

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

  return (
    <div className={styles.review}>
      <div>
        <div className={styles.review_star}>
          ★<span>{rating}</span>
        </div>
      </div>
      <span style={{ fontSize: "18px" }}>{text}</span>
      <div className={styles.reviewer}>
        <div>{reviewer}</div>
        {reviewerId === value?.id && (
          <div className={styles.deleteBtn}>
            <Popconfirm
              title={
                <span style={{ paddingLeft: "0" }}>
                  Are you sure you want to delete this review?
                </span>
              }
              onConfirm={() => deleteReview(id)}
              okText="Delete"
              cancelText="Cancel"
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
