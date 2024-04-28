import React from "react";
import CustomerForm from "../common/customers/CustomerForm";

import Navbar from "../common/Navbar";

const NewCustomer = () => {
    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <h1 className="title">New Customer</h1>
                <div className="w-60 content-container pb-3 mt-3">
                    <CustomerForm />
                </div>
            </main>
        </>
    );
};

export default NewCustomer;
