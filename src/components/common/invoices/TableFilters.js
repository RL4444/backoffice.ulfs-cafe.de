import React from "react";
import Select from "../Select";

const TableFilters = ({ paidStatus, handlePaidStatusFilter, sentStatus, handleSentStatusFilter }) => {
    return (
        <div className="d-flex ml-2">
            <div>
                <Select
                    options={[{ value: "-" }, { value: "bezahlt" }, { value: "nicht bezahlt" }]}
                    value={paidStatus}
                    onSelect={handlePaidStatusFilter}
                />
            </div>

            <div className="ml-1">
                <Select
                    options={[{ value: "-" }, { value: "geschickt" }, { value: "nicht geschickt" }]}
                    value={sentStatus}
                    onSelect={handleSentStatusFilter}
                />
            </div>
        </div>
    );
};

export default TableFilters;
