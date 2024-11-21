import styles from "./SearchBooksComponent.module.scss";
import commonStyles from "../../../../../assets/css/commonStyles/CommonStyles.module.scss";
import { useHistory } from "react-router-dom";
import BackIcon from "../../../../../assets/images/icons/backPage.svg";

const SearchBooksComponent = () => {
  const history = useHistory();

  return (
    <div className={styles.home_page}>
      <div
        onClick={() => history.goBack()}
        className={commonStyles.backBtnRelativePage}
      >
        <img style={{ marginRight: 9 }} src={BackIcon} alt="Back arrow" />
        Back
      </div>
      <div className={styles.page_title}>
        <h1>New Books </h1>
      </div>
      <div className={styles.booksList}></div>
    </div>
  );
};

export default SearchBooksComponent;
