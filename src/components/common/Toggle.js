import React from "react";
import "./toggle.css";

const Toggle = ({ value, onChange, labelLeft, labelRight }) => {
    return (
        <div className="d-flex ai-c">
            <label className="text-white fs-12 mr-1">{labelLeft}</label>
            <label className="switch">
                <input value={value} onChange={onChange} type="checkbox" />
                <span className="slider round"></span>
            </label>
            <label className="text-white fs-12 ml-1">{labelRight}</label>
        </div>
    );
};

export default Toggle;
