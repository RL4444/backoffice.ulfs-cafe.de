import React from "react";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import { Link } from "react-router-dom";

import "react-loading-skeleton/dist/skeleton.css";

const Table = ({ items = [], loading = false }) => {
    const getServiceItemsTotal = (items) => {
        let total = 0;

        items.forEach((item) => {
            total += item.price * item.quantity;
        });

        return total.toFixed(2);
    };

    return (
        <div>
            <div className="d-flex ai-c mb-1 ">
                <div style={{ maxWidth: 120, minWidth: 120 }}></div>
                <div style={{ maxWidth: 150, minWidth: 150 }}>
                    <strong className="text-light-grey label" style={{ fontSize: 12 }}>
                        Rechnung Nr
                    </strong>
                </div>
                <div style={{ maxWidth: 120, minWidth: 120 }}>
                    <strong className="text-light-grey" style={{ fontSize: 12 }}>
                        Firma
                    </strong>
                </div>
                <div style={{ maxWidth: 150, minWidth: 150 }}>
                    <strong className="text-light-grey" style={{ fontSize: 12 }}>
                        Name
                    </strong>
                </div>
                <div style={{ maxWidth: 160, minWidth: 160 }}>
                    <strong className="text-light-grey" style={{ fontSize: 12 }}>
                        Datum
                    </strong>
                </div>
                <div style={{ maxWidth: 120, minWidth: 120 }}>
                    <strong className="text-light-grey" style={{ fontSize: 12 }}>
                        Bezahlt
                    </strong>
                </div>
                <div style={{ maxWidth: 120, minWidth: 120 }}>
                    <strong className="text-light-grey " style={{ fontSize: 12 }}>
                        E-Mail gesendet
                    </strong>
                </div>
                <div style={{ maxWidth: 120, minWidth: 120, textAlign: "right" }}>
                    <strong className="text-light-grey" style={{ fontSize: 12 }}>
                        Rechnungswert
                    </strong>
                </div>
            </div>
            {loading && <Skeleton count={12} />}
            {!loading && items && items.length > 0 ? (
                items.map((eachInvoice) => {
                    return (
                        <Link to={`/invoice/${eachInvoice.invoiceNumber}`} key={eachInvoice.invoiceNumber}>
                            <div className="d-flex grey-bg-hover ai-c border-bottom-grey pt-1 pb-1">
                                <div style={{ maxWidth: 120, minWidth: 120, margin: "0" }}>
                                    <p className="invoice-circle" style={{ margin: "0 auto" }}>
                                        {eachInvoice.customer.contactName.slice(0, 1)}
                                    </p>
                                </div>
                                <div style={{ maxWidth: 150, minWidth: 150 }}>
                                    <p className="label">{eachInvoice.invoiceNumber}</p>
                                </div>
                                <div style={{ maxWidth: 120, minWidth: 120 }}>
                                    <p className="label" title={eachInvoice.customer.companyName}>
                                        {eachInvoice.customer.companyName}
                                    </p>
                                </div>
                                <div style={{ maxWidth: 150, minWidth: 150 }}>
                                    <p className="label" title={eachInvoice.customer.contactName}>
                                        {eachInvoice.customer.contactName}
                                    </p>
                                </div>
                                <div style={{ maxWidth: 160, minWidth: 160 }}>
                                    <p className="label">{moment(eachInvoice.eventDate).format("DD.MM.YYYY")}</p>
                                </div>
                                <div style={{ maxWidth: 120, minWidth: 120 }}>
                                    <p className={`label  ${eachInvoice.paidStatus ? "text-green" : "text-red"}`}>
                                        {eachInvoice.paidStatus ? "Ja" : "Nicht"}
                                    </p>
                                </div>
                                <div style={{ maxWidth: 120, minWidth: 120 }}>
                                    <p className={`label ${eachInvoice.billSent ? "text-green" : "text-red"}`}>
                                        {eachInvoice.billSent ? "Ja" : "Nicht"}
                                    </p>
                                </div>
                                <div style={{ maxWidth: 120, minWidth: 120 }}>
                                    <p className="ta-r">{getServiceItemsTotal(eachInvoice.serviceItems)} €</p>
                                </div>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <p className="light-text ta-c">No Invoices Found</p>
            )}
        </div>
    );
};

// incl excl

export default Table;
