import React, { useState } from "react";

export const Input = ({ handleChange, label, value, positioningClasses = "", inputType = "text" }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className={positioningClasses}>
            <p className={`light-text ellipsis label ${isFocused && "focused"}`}>{label}</p>
            <div className="input-wrapper">
                <input
                    onFocusCapture={() => setIsFocused(true)}
                    onBlurCapture={() => setIsFocused(false)}
                    className="form-input"
                    onChange={handleChange}
                    value={value}
                    type={inputType}
                    autoFocus={false}
                />
            </div>
        </div>
    );
};

export default Input;
