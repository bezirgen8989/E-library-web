import styles from './ErrorComponent.module.scss';
import commonStyles from '../../../../assets/css/commonStyles/CommonStyles.module.scss';
import logo from '../../../../assets/images/ErrorImg_1.png'
import TopLogo from '../../../../assets/images/icons/logo.svg'
import Button from "../../../../components/common/Buttons/Button";
import React from "react";


const Error404Component: React.FC = () => {

  return (
    <div style={{ display: "flex", width: '100%', height: '100vh' }}>
      <div className={commonStyles.centeredWrapper}>
        <div className={styles.navTopError}>
          <div style={{display: "flex"}}>
            <div className={styles.topLogo}>
              <img src={TopLogo} alt="Top Logo"/>
            </div>
            <div style={{color: "#fff", fontSize: "28px", fontWeight: 700}}>E-Library</div>
          </div>
        </div>
        <div className={commonStyles.centered}>
          <div className={styles.error_logo}>
            <img src={logo} alt="logo"/>
          </div>
          <div className={styles.logo_name}>Oops, error 404!</div>
          <div className={styles.error_subtitle}>This page can't be found</div>

          <Button variant="White" to="/auth/">Back to Home Page</Button>
        </div>
        <div style={{height: '58px', width: '100%'}}/>
      </div>
    </div>

  )
}

export default Error404Component
