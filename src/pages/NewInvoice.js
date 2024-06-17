import React from "react";

import FormAndViewer from "../components/common/invoices/FormAndViewer";
import Navbar from "../components/common/Navbar";

const NewInvoice = ({ match }) => {
    const { type } = match.params;
    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <h1 className="title">New {type}</h1>
                <FormAndViewer type={type} />
            </main>
        </>
    );
};

export default NewInvoice;
