import React from "react";

import FormAndViewer from "../components/common/invoices/FormAndViewer";
import Navbar from "../components/common/Navbar";

const NewInvoice = () => {
    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <h1 className="title">New Invoice</h1>
                <FormAndViewer />
            </main>
        </>
    );
};

export default NewInvoice;
