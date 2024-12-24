import { Button } from "antd";
import { BaseButtonProps } from "antd/es/button/button";
import { CSSProperties, ReactNode } from "react";
import cn from "classnames";

// import ButtonSpin from '@components/Spin';

import styles from "./styles.module.scss";
import ButtonSpin from "../Spin";

export enum CUSTOM_BUTTONS_TYPES {
  LIGHT = "light",
  DARK = "dark",
  RED = "red",
  LINK = "link",
  LINK_ERROR = "linkError",
  GRAY = "gray",
}

type CustomButtonProps = {
  title: string;
  isLoading?: boolean;
  isSubmit?: boolean;
  onClick?: (event?: any) => void;
  icon?: ReactNode;
  type?: BaseButtonProps["type"];
  style?: CSSProperties;
  iconPosition?: "before" | "after";
  color?: CUSTOM_BUTTONS_TYPES;
  width?: number | string;
  disabled?: boolean;
  size?: string;
  className?: string;
  href?: string;
  target?: string;
  id?: string;
};
export const CustomButton = ({
  title,
  id,
  isLoading,
  isSubmit,
  className,
  onClick,
  color = CUSTOM_BUTTONS_TYPES.DARK,
  type = "primary",
  iconPosition = "before",
  style,
  icon,
  width = "fit-content",
  disabled,
  href,
  target,
  size = "medium",
}: CustomButtonProps) => {
  const stylesColor = () => {
    switch (color) {
      case "light": {
        return styles.custom_buttonLight;
      }
      case "dark": {
        return styles.custom_buttonDark;
      }
      case "red": {
        return styles.custom_buttonRed;
      }
      case "gray": {
        return styles.custom_buttonGray;
      }
      case "link": {
        return styles.custom_buttonLink;
      }
      case "linkError": {
        return styles.custom_buttonLink_error;
      }
      default:
        return styles.custom_buttonDark;
    }
  };

  return (
    <Button
      type={type}
      id={id}
      htmlType={isSubmit ? "submit" : "button"}
      disabled={disabled}
      className={cn("custom_button", stylesColor(), className)}
      onClick={onClick}
      href={href}
      target={target}
      style={{
        ...style,
        width: typeof width === "number" ? `${width}px` : width,
        fontSize: size === "small" ? "0.875rem" : "1rem",
      }}

      // disabled={disabled}
    >
      <div
        className={cn(
          styles.custom_button_children,
          title
            ? iconPosition === "after"
              ? styles.icon_after
              : styles.icon_before
            : null
        )}
      >
        {iconPosition !== "after" && icon && (
          <div className={styles.icon}>{icon}</div>
        )}
        {title}
        {isLoading && <ButtonSpin />}
        {iconPosition === "after" && !isLoading && (
          <div className={styles.icon}>{icon}</div>
        )}
      </div>
    </Button>
  );
};
