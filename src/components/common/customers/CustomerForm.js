import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

import Button from "../Buttons";
import { Input as Field } from "../Input";
import { getHeaders } from "../../../api";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

const CustomerForm = ({ customerEmail, submitCallback }) => {
    const history = useHistory();
    const [sendError, setSendError] = useState(null);

    const [contactName, setContactName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [addressLineOne, setAddressLineOne] = useState("");
    const [addressLineTwo, setAddressLineTwo] = useState("");
    const [addressLineThree, setAddressLineThree] = useState("");
    const [addressLineFour, setAddressLineFour] = useState("");
    const [email, setEmail] = useState("");
    const [taxId, setTaxId] = useState("");

    const sendForm = async (e) => {
        const address = [];
        if (addressLineOne) address.push(addressLineOne);
        if (addressLineTwo) address.push(addressLineTwo);
        if (addressLineThree) address.push(addressLineThree);
        if (addressLineFour) address.push(addressLineFour);

        try {
            e.preventDefault();
            const customerPayload = {
                contactName,
                companyName,
                email,
                taxId,
                address: address,
            };
            const res = await fetch(`${baseUrl}/api/v1/customer/upsert`, {
                body: JSON.stringify({
                    customer: customerPayload,
                }),
                method: "POST",
                headers: { ...getHeaders(), "Content-type": "application/json" },
            });

            const { success, error } = await res.json();

            if (success && submitCallback) {
                submitCallback(customerPayload);
                return;
            }

            if (success) {
                history.replace("/customers");
            } else {
                setSendError({ error });
            }
        } catch (err) {
            console.log({ err });
            setSendError({ err });
        }
    };
    const fetchCustomer = useCallback(async () => {
        const res = await fetch(`${baseUrl}/api/v1/customer?customerEmail=${customerEmail}`, { headers: getHeaders() });
        const { data, error, message } = await res.json();
        if (error || !data) {
            setSendError(message);
        } else {
            setContactName(data.contactName);
            setCompanyName(data.companyName);
            setEmail(data.email);
            setTaxId(data.taxId);
            if (data.address.length >= 1) {
                setAddressLineOne(data.address[0]);
            }
            if (data.address.length >= 2) {
                setAddressLineTwo(data.address[1]);
            }
            if (data.address.length >= 3) {
                setAddressLineThree(data.address[2]);
            }
            if (data.address.length >= 4) {
                setAddressLineFour(data.address[3]);
            }
        }
    }, [customerEmail]);

    useEffect(() => {
        if (customerEmail) {
            fetchCustomer();
        }
    }, [fetchCustomer, customerEmail]);

    return (
        <form>
            {sendError && <p className="text-red ml-3 mt-1 mb-1">{JSON.stringify(sendError)}</p>}
            <div className="d-flex">
                <div className="w-40">
                    <Field value={contactName} handleChange={(e) => setContactName(e.target.value)} label="Name" />
                    <Field
                        value={companyName}
                        handleChange={(e) => setCompanyName(e.target.value)}
                        label="Firma"
                        positioningClasses="mt-1"
                    />

                    {/* address fields  */}
                    <Field
                        value={addressLineOne}
                        handleChange={(e) => setAddressLineOne(e.target.value)}
                        label="Addresse"
                        positioningClasses="mt-1"
                    />
                    <Field value={addressLineTwo} handleChange={(e) => setAddressLineTwo(e.target.value)} />
                    <Field value={addressLineThree} handleChange={(e) => setAddressLineThree(e.target.value)} />
                    <Field value={addressLineFour} handleChange={(e) => setAddressLineFour(e.target.value)} />
                </div>

                <div className="w-40 ml-2">
                    <Field value={email} handleChange={(e) => setEmail(e.target.value)} label="Email" />
                    <Field value={taxId} handleChange={(e) => setTaxId(e.target.value)} label="Steuer Id" positioningClasses="mt-1" />
                </div>
            </div>

            <div className="mt-3">
                <Button text={customerEmail ? "Speichern" : "Speichern"} onClick={sendForm} fullWidth />
            </div>
        </form>
    );
};

export default CustomerForm;
