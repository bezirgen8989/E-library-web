import { useForm } from 'react-hook-form';
// import styles from './ChangePasswordForm.module.scss';
import commonStyles from '../../../../assets/css/commonStyles/CommonStyles.module.scss';
import logo from '../../../../assets/images/icons/logo.svg';
import Onboarding from "../../../../assets/images/Onboarding-img.png";
import BackIcon from "../../../../assets/images/icons/goBackIcon.svg";
import { Link, useHistory } from "react-router-dom";
import Button from "../../../../components/common/Buttons/Button";
import React from "react";

type LoginFormProps = {
  onSubmit: (values: any) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitForm = (values: any) => {
    onSubmit(values);
  };

  return (
    <div style={{ display: "flex", width: '100%', height: '100vh', position: 'relative' }}>
      <div className={commonStyles.centeredWrapper}>
        <div className={commonStyles.navTop}>
          <div onClick={() => history.goBack()} className={commonStyles.backBtnRelative}>
            <img style={{marginRight: 9}} src={BackIcon} alt="Back arrow"/>
            Back
          </div>
          <div/>
        </div>
        <div className={commonStyles.centered}>
          <div className={commonStyles.login_logo}>
            <img src={logo} alt="logo"/>
          </div>
          <div className={commonStyles.logo_name}>Log In</div>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div>
              <div className={commonStyles.inputWrapper}>
                <input
                    className={`${commonStyles.inputField} ${errors.email ? commonStyles.errorInput : ''}`}
                    type="email"
                    placeholder=""
                    autoComplete="off"
                    {...register("email", {
                      required: "Please input your Email!",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "The input is not valid E-mail!"
                      }
                    })}
                />
                <label
                    className={`${commonStyles.inputLabel} ${errors.email ? commonStyles.errorLabel : ""}`}>Email</label>
              </div>
              {errors.email && <p className={commonStyles.error}>{errors.email.message}</p>}
            </div>
            <div>
              <div className={commonStyles.inputWrapper}>
                <input
                    className={`${commonStyles.inputField} ${errors.email ? commonStyles.errorInput : ""}`}
                    type="password"
                    placeholder=""
                    autoComplete="off"
                    inputMode="numeric"
                    {...register("password", {
                      required: "Password must be at least 8 characters long!",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long!"
                      },
                      pattern: {
                        value: /^(?=.*[A-Z]).+$/,
                        message: "Password must contain at least one uppercase letter!"
                      }
                    })}
                />
                <label
                    className={`${commonStyles.inputLabel} ${errors.email ? commonStyles.errorLabel : ""}`}>Password</label>
              </div>
              {errors.password && <p className={commonStyles.error}>{errors.password.message}</p>}
            </div>
            <Button variant="White" type="submit">Log In</Button>
          </form>
        </div>
        <div className={commonStyles.footerCentered}>
          <div>
            <div className={commonStyles.login_subtitle} style={{marginBottom: "15px"}}>
              Don’t have an account?
              <Link style={{color: "#FFEA84", marginLeft: 8}} to="/auth/registration">
                Sign Up
              </Link>
            </div>
            <div className={commonStyles.login_subtitle}>
              Forgot your password?
              <Link style={{color: "#FFEA84", marginLeft: 8}} to="/auth/recover_password">
                Recover
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={commonStyles.sideOnboardingImg}>
        <img style={{height: "100%"}} src={Onboarding} alt="Onboarding"/>
      </div>
    </div>
  );
};

export default LoginForm;