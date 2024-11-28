import styles from "../EnterCodeForm/EnterCodeForm.module.scss";
import commonStyles from "../../../../assets/css/commonStyles/CommonStyles.module.scss";
import { Link, useHistory } from "react-router-dom";
import BackIcon from "../../../../assets/images/icons/goBackIcon.svg";
import Onboarding from "../../../../assets/images/Onboarding-img.png";
import { useForm } from "react-hook-form";
import Button from "../../../../components/common/Buttons/Button";
import React from "react";

type RecoverProps = {
  onSubmit: (values: any) => void;
  currentEmail?: string | null;
};

const EnterCodeForm: React.FC<RecoverProps> = ({ onSubmit, currentEmail }) => {
  const history = useHistory();
  const { register, handleSubmit, watch, setValue } = useForm();
  const code = watch([
    "digit1",
    "digit2",
    "digit3",
    "digit4",
    "digit5",
    "digit6",
  ]);

  const onSubmitForm = () => {
    const codeValue = code.join(""); // Convert array to string
    onSubmit({ codeOrHash: codeValue }); // Pass the code as `codeOrHash`
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const nextField = document.querySelector<HTMLInputElement>(
      `input[name=digit${index + 2}]`
    );
    if ((e.target as HTMLInputElement).value && nextField) {
      nextField.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedValue = e.clipboardData.getData("Text");
    if (/^\d{6}$/.test(pastedValue)) {
      // Ensure it matches a six-digit pattern
      pastedValue.split("").forEach((digit, index) => {
        setValue(`digit${index + 1}`, digit); // Update each input value
      });
      e.preventDefault(); // Prevent default paste behavior
    }
  };

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
            Back
          </div>
          <div />
        </div>
        <div className={commonStyles.centered}>
          <div className={styles.logo_code_name}>Enter 6 Digit Code</div>
          <div className={styles.code_subtitle}>
            We’ve sent a code <br />
            to {currentEmail}.
          </div>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className={styles.formContainer}
          >
            <div className={styles.codeInputWrapper}>
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  {...register(`digit${i + 1}`, {
                    required: true,
                    pattern: /^[0-9]$/,
                  })}
                  onInput={(e) => handleInput(e, i)}
                  onPaste={i === 0 ? handlePaste : undefined} // Add onPaste handler only to the first input
                  className={styles.codeInput}
                  autoComplete="off"
                  inputMode="numeric"
                />
              ))}
            </div>
            <Button type="submit" variant="White">
              Submit
            </Button>
          </form>
        </div>
        <div className={commonStyles.footerCentered}>
          <div>
            <div className={commonStyles.login_subtitle}>
              Didn’t receive a code?
              <Link style={{ color: "#FFEA84", marginLeft: 8 }} to="">
                Resend
              </Link>
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

export default EnterCodeForm;
