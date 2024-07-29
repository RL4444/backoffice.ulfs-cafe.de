import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePlusSm } from "react-icons/hi";
import Button from "../components/common/Buttons";
import Navbar from "../components/common/Navbar";
import { HiArrowRight } from "react-icons/hi";

import { getHeaders } from "../api";

import "../components/common/customers/customer.css";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

const Customers = () => {
    const [requestError, setRequestError] = useState(null);
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = useCallback(async () => {
        const res = await fetch(`${baseUrl}/api/v1/customer/list`, {
            headers: getHeaders(),
        });
        const { data, success, error, message } = await res.json();

        if (success) {
            setCustomers(data);
        } else {
            console.log({ error }, { message });
            setRequestError(error);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <div className="d-flex ai-c">
                    <h1 className="title">Kunden</h1>
                    <div className="ml-1 pt-1">
                        <Button
                            hrefTo={"/customers/new/create"}
                            text={"Neuer Kunde"}
                            role="link"
                            disbaled={false}
                            type="confirm"
                            icon={<HiOutlinePlusSm />}
                        />
                    </div>
                </div>

                {requestError && <p className="mt-1 mb-1 ml-3 text-red">{JSON.stringify(requestError)}</p>}
                <div className="content-container mt-3">
                    {customers.length > 0 &&
                        customers.map((customer) => {
                            return (
                                <>
                                    <div className="d-flex ai-c p-1" key={customer.email}>
                                        <Link
                                            className="d-flex ai-c grey-bg-hover "
                                            to={`customers/${encodeURIComponent(customer.email)}`}
                                            key={customer.email}
                                        >
                                            <div className="">
                                                <strong className="customer-circle">{customer.contactName.slice(0, 1)}</strong>
                                            </div>
                                            <div style={{ width: 250, minWidth: 250 }}>
                                                <p className="ml-2 ">{customer.contactName || "keine Name"}</p>
                                            </div>
                                            <div style={{ width: 250, minWidth: 250 }}>
                                                <p className="ml-2 ">{customer.companyName || "keine Firma"}</p>
                                            </div>
                                            <div className="w-20 min-w-20">
                                                <p className="ml-2 ">{customer.email || "keine email"}</p>
                                            </div>
                                        </Link>
                                        <div className="ml-auto">
                                            <Button
                                                hrefTo={`/invoice/new/invoice?customerEmail=${customer.email}`}
                                                text="neu Rechnung"
                                                iconRight={<HiArrowRight size="12px" />}
                                            ></Button>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                </div>
            </main>
        </>
    );
};

export default Customers;
