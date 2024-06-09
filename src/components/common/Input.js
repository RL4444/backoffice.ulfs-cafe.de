import React, { useState } from "react";

export const Input = ({ handleChange, label, value, positioningClasses = "", inputType = "text", disabled = false }) => {
    console.log(disabled);
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className={positioningClasses}>
            <p className={`light-text ellipsis label ${isFocused && "focused"}`}>{label}</p>
            <div className={`input-wrapper ${disabled ? "b-none" : ""}`}>
                <input
                    onFocusCapture={() => setIsFocused(true)}
                    onBlurCapture={() => setIsFocused(false)}
                    className={`form-input ${disabled ? "text-bold" : ""}`}
                    onChange={handleChange}
                    value={value}
                    type={inputType}
                    autoFocus={false}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default Input;
