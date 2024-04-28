import React, { useEffect, useState, useCallback } from "react";

import { HiOutlinePlusSm } from "react-icons/hi";
import Button from "../common/Buttons";
import SearchBar from "../common/search/Searchbar";
import Table from "../common/invoices/TableView";
import TableFilters from "../common/invoices/TableFilters";
import Navbar from "../common/Navbar";
import { getHeaders } from "../../api";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
// TODO: add search functionality
const Invoices = () => {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [requestError, setRequestError] = useState(null);
    const [paidStatus, setPaidStatus] = useState("Bezahlt Status");
    const [sentStatus, setSentStatus] = useState("Geschickt Status");

    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        try {
            const sentStatusBool = sentStatus === "geschickt" ? true : sentStatus === "nicht geschickt" ? false : null;
            const paidStatusBool = paidStatus === "bezahlt" ? true : paidStatus === "nicht bezahlt" ? false : null;

            const res = await fetch(`${baseUrl}/api/v1/invoice/list/all?isPaid=${paidStatusBool}&isSent=${sentStatusBool}`, {
                headers: getHeaders(),
            });
            const { data, error, message } = await res.json();

            if (error) {
                setRequestError(message);
            } else {
                setInvoices(data);
            }
        } catch (error) {
            console.log({ error });
        } finally {
            setLoading(false);
        }
    }, [paidStatus, sentStatus]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices, paidStatus, sentStatus]);

    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <div className="d-flex ai-c ">
                    <h1 className="title">Rechnungen</h1>
                    <div className="ml-1 pt-1">
                        <Button
                            hrefTo={"/invoice/new/create"}
                            text={"Neue Rechnung"}
                            role="link"
                            disbaled={false}
                            type="confirm"
                            icon={<HiOutlinePlusSm />}
                        />
                    </div>
                </div>
                <div className="card-border mt-3" style={{ maxWidth: 1100 }}>
                    {requestError && <p className="mt-1 mb-1 ml-3 text-red"></p>}
                    {/* aligned fe until search bar works */}
                    <div className="card-padding bg-primary d-flex jc-fe">
                        <div className="w-100">
                            <SearchBar />
                        </div>
                        <TableFilters
                            paidStatus={paidStatus}
                            sentStatus={sentStatus}
                            handlePaidStatusFilter={(value) => setPaidStatus(value)}
                            handleSentStatusFilter={(value) => setSentStatus(value)}
                        />
                    </div>
                    <div className="bg-white pt-2 pb-3">
                        <Table items={invoices} loading={loading} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Invoices;
