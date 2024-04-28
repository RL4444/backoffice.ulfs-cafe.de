import React from "react";

import { HiSearch } from "react-icons/hi";

import "./search.css";

const SearchBar = ({ handleChange, value }) => {
    return (
        <div className="search-input-wrapper">
            <input
                className="form-input"
                onChange={handleChange}
                value={value}
                type={"text"}
                placeholder="Suche Name, Email und Firmename"
            />
            <HiSearch color={"#999999"} />
        </div>
    );
};

export default SearchBar;
