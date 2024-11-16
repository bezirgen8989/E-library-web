// import styles from './Loading.module.scss';
import commonStyles from '../../../../assets/css/commonStyles/CommonStyles.module.scss';
import logo from '../../../../assets/images/icons/logo.svg';
import Onboarding from "../../../../assets/images/Onboarding-img.png";

const Loading: React.FC = () => {
  return (
    <div style={{ display: "flex", width: '100%', height: '100vh', position: 'relative' }}>
      <div className={commonStyles.centeredWrapper}>
        <div className={commonStyles.centered}>
          <div className={commonStyles.login_logo}>
            <img src={logo} alt="logo" />
          </div>
          <div className={commonStyles.logo_name}>E-Library</div>
        </div>
      </div>
      <div className={commonStyles.sideOnboardingImg}>
        <img style={{ height: "100%" }} src={Onboarding} alt="Onboarding" />
      </div>
    </div>
  );
};

export default Loading;