import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = ({
    type = "",
    role = "",
    text = "Click Me",
    onClick = () => {},
    hrefTo,
    disabled = false,
    icon = null,
    fullWidth = false,
    onKeyPress = () => {},
}) => {
    if (hrefTo) {
        return (
            <Link to={hrefTo}>
                <button
                    onKeyDown={onKeyPress}
                    className={`button ${type} ${fullWidth ? "w-100" : ""} jc-c`}
                    title={text}
                    disabled={disabled}
                    role={role}
                >
                    {icon && icon}
                    <span>{text}</span>
                </button>
            </Link>
        );
    }

    return (
        <button
            onKeyDown={onKeyPress}
            onClick={onClick}
            className={`button ${type} ${fullWidth ? "w-100" : ""}  jc-c`}
            disabled={disabled}
            role={role}
        >
            {icon && icon}
            <span className={`${icon ? "ml-1" : ""}`}>{text}</span>
        </button>
    );
};

export default Button;
