import { useForm } from "react-hook-form";
import commonStyles from "../../../../assets/css/commonStyles/CommonStyles.module.scss";
import logo from "../../../../assets/images/icons/logo.svg";
import Onboarding from "../../../../assets/images/Onboarding-img.png";
import { Link, useHistory } from "react-router-dom";
import BackIcon from "../../../../assets/images/icons/goBackIcon.svg";
import Button from "../../../../components/common/Buttons/Button";
import React from "react";
import routes from "../../routing/routes";
import { useLazySelector } from "../../../../hooks";

type LoginFormProps = {
  onSubmit: (values: any) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { result: localization } = useLazySelector(
    ({ auth }) => auth.appLocalization || {}
  );

  const onSubmitForm = (values: any) => {
    console.log("values", values);
    onSubmit(values);
  };

  // Watching the password field to validate confirm password
  const password = watch("password");

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <div className={commonStyles.centeredWrapper}>
        <div className={commonStyles.navTop}>
          <div
            onClick={() => history.goBack()}
            className={commonStyles.backBtnRelative}
          >
            <img style={{ marginRight: 9 }} src={BackIcon} alt="Back arrow" />
            {localization?.backBtn}
          </div>
          <div />
        </div>
        <div className={commonStyles.centered}>
          <div className={commonStyles.login_logo}>
            <img src={logo} alt="logo" />
          </div>
          <div className={commonStyles.logo_name}>
            {localization?.createAccount}
          </div>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div>
              <div className={commonStyles.inputWrapper}>
                <input
                  className={`${commonStyles.inputField} ${
                    errors.email ? commonStyles.errorInput : ""
                  }`}
                  type="email"
                  placeholder=""
                  autoComplete="off"
                  {...register("email", {
                    required: `${localization?.pleaseInputYourEmail}`,
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: `${localization?.errors.pleaseInputYourEmail}`,
                    },
                  })}
                />
                <label
                  className={`${commonStyles.inputLabel} ${
                    errors.email ? commonStyles.errorLabel : ""
                  }`}
                >
                  {localization?.email}
                </label>
              </div>
              {errors.email && (
                <p className={commonStyles.error}>{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className={commonStyles.inputWrapper}>
                <input
                  className={`${commonStyles.inputField} ${
                    errors.password ? commonStyles.errorInput : ""
                  }`}
                  type="password"
                  inputMode="text"
                  placeholder=""
                  {...register("password", {
                    required: `${localization?.passwordMustBeAtLeast8CharactersLong}`,
                    minLength: {
                      value: 8,
                      message: `${localization?.passwordMustBeAtLeast8CharactersLong}`,
                    },
                    pattern: {
                      value: /^(?=.*[A-Z]).+$/,
                      message: `${localization?.errors.passwordMustContainAtLeastOneUppercaseLetter}`,
                    },
                  })}
                />
                <label
                  className={`${commonStyles.inputLabel} ${
                    errors.password ? commonStyles.errorLabel : ""
                  }`}
                >
                  {localization?.password}
                </label>
              </div>
              {errors.password && (
                <p className={commonStyles.error}>{errors.password.message}</p>
              )}
            </div>
            <div>
              <div className={commonStyles.inputWrapper}>
                <input
                  className={`${commonStyles.inputField} ${
                    errors.confirmPassword ? commonStyles.errorInput : ""
                  }`}
                  type="password"
                  inputMode="text"
                  placeholder=""
                  {...register("confirmPassword", {
                    required: `${localization?.pleaseConfirmYourPassword!}`,
                    validate: (value) =>
                      value === password ||
                      `${localization?.errors.passwordsDoNotMatch}`,
                  })}
                />
                <label
                  className={`${commonStyles.inputLabel} ${
                    errors.confirmPassword ? commonStyles.errorLabel : ""
                  }`}
                >
                  {localization?.confirmPassword}
                </label>
              </div>
              {errors.confirmPassword && (
                <p className={commonStyles.error}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button variant="White" type="submit">
              {localization?.createAccount}
            </Button>
          </form>
        </div>
        <div className={commonStyles.footerCentered}>
          <div>
            <div
              className={commonStyles.login_subtitle}
              style={{ marginBottom: "15px" }}
            >
              <div style={{ textAlign: "center" }}>
                {localization?.byCreatingAnAccountYouAgreeToOur}
                <Link
                  to={routes.termsAndConditions}
                  style={{ color: "#FFEA84", marginLeft: 8 }}
                >
                  {localization?.termsAndConditions}
                </Link>
                <br />
                {localization?.and}
                <Link
                  to={routes.privacyPolicy}
                  style={{ color: "#FFEA84", marginLeft: 8 }}
                >
                  {localization?.privacyPolicy}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={commonStyles.sideOnboardingImg}>
        <img style={{ height: "100%" }} src={Onboarding} alt="Onboarding" />
      </div>
    </div>
  );
};

export default LoginForm;
