import { Link } from "react-router-dom";
import { CSSProperties, ReactNode, useState } from "react";

export type ButtonType = {
  htmlType?: "button" | "submit" | "reset";
  onClick?: () => void;
  to?: string;
  type?: string;
  variant?: ButtonOptions;
  style?: CSSProperties;
  icon?: ReactNode;
  id?: string;
  className?: string;
  disabled?: boolean; // Добавлен пропс disabled
};

type ButtonOptions = "Blue" | "White" | "Brown" | "Transparent" | "Error";

const Button: React.FC<ButtonType> = ({
  children,
  onClick,
  to,
  variant,
  style,
  icon,
  disabled = false,
}) => {
  const [hovered, setHovered] = useState(false);

  const commonStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "54px",
    padding: "0 20px",
    width: "100%",
    fontSize: "16px",
    borderRadius: "12px",
    cursor: disabled ? "not-allowed" : "pointer", // Меняем курсор, если кнопка отключена
    transition: "all 0.2s",
    fontWeight: 700,
    whiteSpace: "nowrap",
    opacity: hovered && !disabled ? 0.8 : 1, // Не менять opacity, если disabled
    marginBottom: "9px",
  };

  const buttonVariants: { [key in ButtonOptions]: CSSProperties } = {
    Blue: {
      ...commonStyles,
      backgroundColor: "#4284F4",
      color: "white",
      border: "none",
    },
    White: {
      ...commonStyles,
      backgroundColor: "white",
      color: "black",
      border: "none",
    },
    Brown: {
      ...commonStyles,
      backgroundColor: "#996C42",
      color: "white",
      border: "none",
    },
    Error: {
      ...commonStyles,
      backgroundColor: "rgba(213, 84, 84, 0.13)",
      color: "#D55454",
      border: "1px solid #D554541F",
    },
    Transparent: {
      ...commonStyles,
      backgroundColor: "none",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
  };

  // Дополнительный стиль для отключённой кнопки
  const disabledStyle: CSSProperties = disabled
    ? { opacity: 0.5, pointerEvents: "none" }
    : {};

  const appliedStyle = {
    ...buttonVariants[variant ?? "Transparent"],
    ...style,
    ...disabledStyle,
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setHovered(true);
    }
  };
  const handleMouseLeave = () => {
    if (!disabled) {
      setHovered(false);
    }
  };

  const renderContent = () => (
    <>
      {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
      {children}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        style={appliedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderContent()}
      </Link>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick} // Если disabled, onClick не вызывается
      disabled={disabled}
      style={{ ...appliedStyle, marginTop: 0 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
