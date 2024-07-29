import React, { useState, useEffect, useCallback } from "react";

import FormAndViewer from "../components/common/invoices/FormAndViewer";
import Navbar from "../components/common/Navbar";

import { getHeaders } from "../api";
const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

const NewInvoice = ({ match }) => {
    const { type } = match.params;
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCustomer = useCallback(async (customerEmail) => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/v1/customer/?customerEmail=${customerEmail}`, {
                headers: getHeaders(),
            });
            const { data, error } = await res.json();

            if (error) {
                console.log(error);
            } else {
                setCustomer(data);
            }
        } catch (error) {
            console.log({ error });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const { customerEmail } = Object.fromEntries(new URLSearchParams(window.location.search));
        if (customerEmail) {
            fetchCustomer(customerEmail);
        }
        return () => {};
    }, [fetchCustomer]);

    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <h1 className="title">New {type}</h1>
                {!loading && <FormAndViewer type={type} customer={customer} />}
            </main>
        </>
    );
};

export default NewInvoice;
