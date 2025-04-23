import styles from "./ErrorComponent.module.scss";
import commonStyles from "../../../../assets/css/commonStyles/CommonStyles.module.scss";
import logo from "../../../../assets/images/ErrorImg_1.png";
import TopLogo from "../../../../assets/images/icons/logo.svg";
import Button from "../../../../components/common/Buttons/Button";
import React from "react";
import { t } from "i18next";
import { routes } from "../../routing";

const Error404Component: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        background: "linear-gradient(to bottom, #d3a271, #a46542)",
      }}
    >
      <div className={commonStyles.centeredWrapper}>
        <div className={styles.navTopError}>
          <div style={{ display: "flex" }}>
            <div className={styles.topLogo}>
              <img src={TopLogo} alt="Top Logo" />
            </div>
          </div>
        </div>
        <div className={commonStyles.centered}>
          <div className={styles.error_logo}>
            <img src={logo} alt="logo" />
          </div>
          <div className={styles.logo_name}> {t("error404")}</div>
          <div className={styles.error_subtitle}>{t("thisPageNotfound")}</div>

          <Button
            variant="White"
            onClick={() => (window.location.href = routes.root)}
          >
            {t("backToHomePage")}
          </Button>
        </div>
        <div style={{ height: "58px", width: "100%" }} />
      </div>
    </div>
  );
};

export default Error404Component;
