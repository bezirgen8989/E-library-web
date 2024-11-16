import styles from './OnboardingForm.module.scss';
import commonStyles from '../../../../assets/css/commonStyles/CommonStyles.module.scss';
import logo from '../../../../assets/images/icons/logo.svg';
import Button from "../../../../components/common/Buttons/Button";
import Social_1 from '../../../../assets/images/icons/facebook.svg';
import Social_2 from '../../../../assets/images/icons/twitter.svg';
import Onboarding from '../../../../assets/images/Onboarding-img.png';
import GoogleIcon from '../../../../assets/images/icons/google.png';
import {Link} from "react-router-dom";
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';

type LoginFormProps = {
    onSubmit: (values: any) => void;
};

const OnboardingForm: React.FC<LoginFormProps> = ({onSubmit}) => {

    const handleGoogleSuccess = (credentialResponse: any) => {
        console.log("Google User Token:", credentialResponse.credential);
        onSubmit({idToken: credentialResponse.credential});
    };

    const handleGoogleFailure = () => {
        console.error("Google login failed");
    };

    return (
        <GoogleOAuthProvider clientId="739797713062-bos5gumeckgjdsi5v3hhviiih5ttjrjn.apps.googleusercontent.com">
            <div style={{display: "flex", width: '100%', height: '100vh'}}>
                <div className={commonStyles.centeredWrapper}>
                    <div style={{ height: '58px', width: '100%' }}/>
                    <div className={commonStyles.centered}>
                        <div className={commonStyles.login_logo}>
                            <img src={logo} alt="logo"/>
                        </div>
                        <div className={commonStyles.logo_name}>E-Library</div>
                        <Button variant="White" to="/auth/registration">Sign Up with Email</Button>
                        <div className={styles.googleButton}>
                            <div className={styles.googleButtonAbsolute}>
                                <img style={{ marginRight: '12px', marginTop: '-3px' }} src={GoogleIcon} alt="icon"/>
                                <div style={{ display: 'inline-block', paddingTop: '3px' }}>Continue with Google</div>
                            </div>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                            />
                        </div>
                        <div
                            style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "30px 0"}}>
                            <div className={styles.subtitle_line}></div>
                            <div className={commonStyles.login_subtitle}>
                                Or continue with
                            </div>
                            <div className={styles.subtitle_line}></div>
                        </div>

                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Link to="#" className={styles.soc_fb}>
                                <img src={Social_1} alt="Facebook logo"/>
                            </Link>
                            <Link to="#" className={styles.soc_tw}>
                                <img src={Social_2} alt="Twitter logo"/>
                            </Link>
                        </div>
                    </div>
                    <div className={commonStyles.footerCentered}>
                        <div className={commonStyles.login_subtitle}>
                            Already have an account?
                        </div>
                        <Button variant="Transparent" to="/auth/login">Log In with Email</Button>
                    </div>
                </div>
                <div className={commonStyles.sideOnboardingImg}>
                    <img style={{height: '100%'}} src={Onboarding} alt="Onboarding"/>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default OnboardingForm;