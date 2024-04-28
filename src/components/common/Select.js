import React, { useState, useRef } from "react";

import useOnClickOutside from "../../hooks/useOnClickOutside";

const Select = ({ onSelect = (value) => console.log({ value }), options, value, textClasses = "" }) => {
    const ref = useRef();
    const [selectOpen, setSelectOpen] = useState(false);

    const handleSelect = (value) => {
        onSelect(value);
        setSelectOpen(false);
    };

    useOnClickOutside(ref, () => setSelectOpen(false));

    return (
        <div className="select_outer_wrapper">
            <div className={"select_inner_display " + textClasses} onClick={() => setSelectOpen(!selectOpen)}>
                {value}
                <div className={`chevron ${selectOpen ? "open" : ""}`}></div>
            </div>
            <div ref={ref} className={`select_dropdown_menu_wrapper ${selectOpen ? "open" : ""}`}>
                {options &&
                    options.length > 0 &&
                    options.map((eachOption, index) => {
                        return (
                            <div className="select_dropdown_menu_each_row" key={index} onClick={() => handleSelect(eachOption.value)}>
                                <p>{eachOption.value}</p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Select;
