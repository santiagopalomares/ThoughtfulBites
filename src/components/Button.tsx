import React from "react";
import "./Button.css";

interface CustomButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  className,
}) => {
  return (
    <button className={`custom-button ${className || ""}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default CustomButton;
