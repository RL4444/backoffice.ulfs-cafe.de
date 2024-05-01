import React from "react";
import CustomerForm from "../components/common/customers/CustomerForm";
import Navbar from "../components/common/Navbar";

const Customer = ({ match }) => {
    const { customerEmail } = match.params;

    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <h1 className="title">Customer {customerEmail}</h1>
                <div className="w-60 content-container pb-3 mt-3">
                    <CustomerForm customerEmail={customerEmail} />
                </div>
            </main>
        </>
    );
};

export default Customer;
