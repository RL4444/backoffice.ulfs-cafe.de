import React, { useState } from "react";

export const Input = ({
    handleChange,
    label,
    value,
    positioningClasses = "",
    inputType = "text",
    hideControls = false,
    isMoney = false,
    disabled = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className={positioningClasses}>
            <p className={`light-text ellipsis label ${isFocused && "focused"}`}>{label}</p>
            <div className={`input-wrapper ${disabled ? "b-none" : ""}`}>
                <input
                    onFocusCapture={() => setIsFocused(true)}
                    onBlurCapture={() => setIsFocused(false)}
                    className={`${hideControls ? "hide-controls" : ""} form-input ${disabled ? "text-bold" : ""}`}
                    onChange={handleChange}
                    value={value}
                    type={inputType}
                    autoFocus={false}
                    disabled={disabled}
                />
                {isMoney ? <p style={{ color: "grey", fontWeight: "500" }}>€</p> : null}
            </div>
        </div>
    );
};

export default Input;
