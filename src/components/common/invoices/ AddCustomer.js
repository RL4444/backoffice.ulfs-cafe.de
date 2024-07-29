import React, { useState, useEffect, useCallback } from "react";

import { HiUserAdd } from "react-icons/hi";
import CustomerForm from "../customers/CustomerForm";
import { getHeaders } from "../../../api";

import "./Invoice.css";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

const AddCustomer = ({ addCustomerAndClose, submitCallback = null }) => {
    const [searchMode, setSearcMode] = useState(true);
    const [requestError, setRequestError] = useState(null);
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = useCallback(async () => {
        const res = await fetch(`${baseUrl}/api/v1/customer/list`, { headers: getHeaders() });
        const { data, error, message } = await res.json();
        if (error) {
            setRequestError(message);
        } else {
            setCustomers(data);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);
    return (
        <div className="add-customer-modal-wrapper">
            <h2 className="mb-1">Kunden</h2>
            {requestError && <p className="text-red mt-1 mb-1">{requestError}</p>}
            {searchMode ? (
                <>
                    {customers.length > 0 &&
                        customers.map((eachCustomer) => {
                            return (
                                <div
                                    className="d-flex ai-c p-1 grey-bg-hover c-hover"
                                    key={`${eachCustomer.name} - ${eachCustomer.email} - ${eachCustomer.companyName}`}
                                    onClick={() => addCustomerAndClose(eachCustomer)}
                                >
                                    <HiUserAdd />
                                    <p className="ml-2 label w-50" title={eachCustomer.companyName}>
                                        {eachCustomer.companyName}
                                    </p>
                                    <p className="ml-2 label w-40" title={eachCustomer.contactName}>
                                        {eachCustomer.contactName}
                                    </p>
                                </div>
                            );
                        })}
                </>
            ) : (
                <div className="mt-2">
                    <CustomerForm submitCallback={submitCallback} />
                </div>
            )}
            <p className="mt-3 text-blue ta-r mr-4 c-hover" onClick={() => setSearcMode(!searchMode)}>
                {searchMode ? "Neu erstellen" : `← Zurück`}
            </p>
        </div>
    );
};

export default AddCustomer;
