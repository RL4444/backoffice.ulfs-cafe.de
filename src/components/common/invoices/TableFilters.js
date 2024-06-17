import React from "react";
import Select from "../Select";
import Toggle from "../Toggle";

const TableFilters = ({ paidStatus, handlePaidStatusFilter, sentStatus, handleSentStatusFilter, isInvoice, toggleInvoiceType }) => {
    return (
        <div className="ml-1">
            <div className="d-flex jc-fe">
                <div>
                    <Toggle labelLeft={"Rechnungen"} labelRight={"Angeboten"} value={isInvoice} onChange={toggleInvoiceType} />
                </div>
            </div>
            <div className="d-flex mt-1">
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
        </div>
    );
};

export default TableFilters;
