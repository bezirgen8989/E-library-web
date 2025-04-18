import commonStyles from "../../../../../assets/css/commonStyles/CommonStyles.module.scss";
import Close from "../../../../../assets/images/icons/Close.svg";
import { Modal, Rate } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import Button from "../../../../../components/common/Buttons/Button";
// @ts-ignore
import Rating from "react-rating-stars-component";
import { UserContext } from "../../../../../core/contexts";
import { BookType } from "../../Book/Book";
import { useDispatch } from "react-redux";
import { getLocalization } from "../../../../Auth/slices/auth";
import { useTranslation } from "react-i18next";

interface ReviewModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  book: BookType | null;
  reviewSubmit: any;
  customClass: any;
}

const ReviewModal: FC<ReviewModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  book,
  reviewSubmit,
  customClass,
}) => {
  const { t } = useTranslation();
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const value = useContext(UserContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (value?.language?.isoCode2char) {
      dispatch(getLocalization(value?.language?.isoCode2char));
    }
  }, [dispatch, value?.language?.isoCode2char]);

  const hideModal = () => {
    setIsModalOpen(false);
    setError(null); // Reset error on modal close
  };

  const handleReviewSubmit = () => {
    if (reviewText.length < 6) {
      setError("Minimum 6 characters required for the review.");
      return;
    }
    reviewSubmit({
      rating: rating,
      text: reviewText,
      user: {
        id: value?.id || "",
      },
      coreBook: {
        id: book?.id,
      },
    });
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={<div className="custom-modal-title">{t("writeReviewBtn")}</div>}
      visible={isModalOpen}
      onCancel={hideModal}
      className="custom-modal"
      footer={null}
      closeIcon={
        <img
          className={commonStyles.modalCloseIcon}
          src={Close}
          alt="close-icon"
        />
      }
    >
      <textarea
        placeholder={t("placeholderYourReview")}
        value={reviewText}
        onChange={(e) => {
          setReviewText(e.target.value);
          if (error) setError(null); // Clear error when text changes
        }}
        style={{
          width: "100%",
          height: "100px",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          resize: "none",
          marginBottom: "8px",
          outline: "none",
        }}
      />
      {error && (
        <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>
      )}

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
      >
        {/*<span style={{ marginRight: "8px", fontWeight: 600 }}>{t("rating").toLowerCase()}:</span>*/}
        <span style={{ marginRight: "8px", fontWeight: 600 }}>
          {t("rating").charAt(0).toUpperCase() + t("rating").slice(1)}:
        </span>
        <Rate
          defaultValue={5}
          value={rating}
          onChange={(newRating: number) => setRating(newRating)}
          className={customClass}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Button
          variant="Brown"
          onClick={() => {
            handleReviewSubmit();
            setReviewText("");
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          {t("submit")}
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewModal;
