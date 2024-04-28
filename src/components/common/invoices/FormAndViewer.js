import React, { useEffect, useState, useCallback, useContext } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import de from "date-fns/locale/de";
import ReactPDF, { PDFViewer, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { HiOutlineTrash } from "react-icons/hi";
import { HiOutlineDocumentDownload } from "react-icons/hi"; // cool icon

import Button from "../Buttons";
import Select from "../Select";
import InvoicePDF, { PlainHTMLPDF } from "./InvoicePDF";
import AddCustomer from "./ AddCustomer";
import NotificationContext from "../../../contexts/Notification";
import Modal from "../Modal";

import { taxCategories } from "./utils";

import "react-datepicker/dist/react-datepicker.css";
import "./form.css";
import { Input as Field } from "../Input";
import { getHeaders } from "../../../api";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
registerLocale("de", de);

const Form = ({ invoiceId, printRef, emailRef, saveRef }) => {
    const history = useHistory();
    const notification = useContext(NotificationContext);

    const [documentLoaded, setDocumentLoaded] = useState(false);
    const [sendError, setSendError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Invoice status details
    const [invoiceNumber, setInvoiceNumber] = useState(invoiceId || "123456");
    const [invoiceDate, setInvoiceDate] = useState(new Date());
    const [paidStatus, setPaidStatus] = useState(false);
    const [billSent, setBillSent] = useState(false);
    const [vatCharged, setVatCharged] = useState("19% Incl. USt."); // choice of 4

    // event data
    const [peopleNumber, setPeopleNumber] = useState(1);
    const [eventDate, setEventDate] = useState(new Date());
    const [eventType, setEventType] = useState("Catering");
    const [eventKeyword, setEventKeyword] = useState("");

    // customer section
    const [customer, setCustomer] = useState({
        companyName: "Z.b. GmbH",
        contactName: "Herr Prof. Max Mustermann",
        email: "email@something.de",
        taxId: "123456677",
        address: ["Line 1", "Line 2", "PLZ Ort"],
    });

    // service items
    const [serviceItems, setServiceItems] = useState([
        {
            article: "",
            quantity: 1,
            price: 1,
        },
    ]);

    const getCurrentTotal = useCallback(() => {
        let total = 0;

        serviceItems.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
        });

        return total;
    }, [serviceItems]);

    // if the invoice has already been written then these can be changed
    const handleSubmit = useCallback(
        async (e) => {
            if (e) {
                e.preventDefault();
            }

            setSendError(null);

            const invoicePayload = {
                invoiceNumber,
                invoiceDate,
                customer,
                eventDate,
                eventType,
                eventKeyword,
                peopleNumber,
                serviceItems,
                vatCharged,
                paidStatus,
                billSent,
                archived: false,
                lastUpdated: new Date(),
            };

            const res = await fetch(`${baseUrl}/api/v1/invoice/`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({
                    invoice: invoicePayload,
                }),
            });

            const { error, message } = await res.json();

            if (error) {
                notification.error("Something went wrong - call rory");
                setSendError(message);
            } else {
                if (!invoiceId) {
                    history.replace("/");
                } else {
                    notification.success("Updated Bill successfully");
                }
            }
        },
        [
            invoiceNumber,
            invoiceDate,
            customer,
            eventDate,
            eventType,
            peopleNumber,
            serviceItems,
            vatCharged,
            paidStatus,
            billSent,
            invoiceId,
            history,
            notification,
            eventKeyword,
        ]
    );

    const fetchInvoices = useCallback(async () => {
        try {
            const res = await fetch(`${baseUrl}/api/v1/invoice/${invoiceId}`, { headers: getHeaders() });
            const { data, error, message } = await res.json();

            if (error) {
                setSendError(message);
            } else {
                setInvoiceNumber(data.invoiceNumber);
                setInvoiceDate(data.invoiceDate ? new Date(data.invoiceDate) : new Date());
                setPaidStatus(data.paidStatus);
                setBillSent(data.billSent);
                setVatCharged(data.vatCharged);
                setPeopleNumber(data.peopleNumber);
                setEventDate(new Date(data.eventDate));
                setEventKeyword(data.eventKeyword || "");
                setEventType(data.eventType);
                setCustomer(data.customer);
                setServiceItems(data.serviceItems);
            }
        } catch (error) {
            setSendError(error);
        } finally {
            setDocumentLoaded(true);
        }
    }, [invoiceId]);

    useEffect(() => {
        if (invoiceId) {
            fetchInvoices();
        }
    }, [fetchInvoices, invoiceId]);

    const downloadPDF = () => {
        console.log("downloading pdf");
    };

    const handleItemUpdate = (index, key, value) => {
        const itemsCopy = [...serviceItems];
        itemsCopy[index][key] = value;

        setServiceItems(itemsCopy);
    };

    const addServiceItem = (e) => {
        e.preventDefault();
        setServiceItems([
            ...serviceItems,
            {
                article: "",
                quantity: 1,
                price: 1,
            },
        ]);
    };

    const deleteServiceItem = (index) => {
        const copyArray = [...serviceItems];
        copyArray.splice(index, 1);
        setServiceItems(copyArray);
    };

    const addCustomerAndClose = (nextCustomer) => {
        setCustomer(nextCustomer);
        setModalOpen(false);
    };

    useEffect(() => {
        if (saveRef && saveRef.current) {
            saveRef.current.cb = handleSubmit;
        }
    }, [saveRef, handleSubmit]);

    const emailCustomer = useCallback(async () => {
        const doc = await (
            <InvoicePDF
                customerName={customer.contactName}
                companyName={customer.companyName}
                address={customer.address}
                invoiceNumber={invoiceNumber}
                peopleNumber={peopleNumber}
                eventType={eventType}
                eventKeyword={eventKeyword}
                eventDate={moment(eventDate).format("DD.MM.yyyy")}
                serviceItems={serviceItems}
                totalNet={taxCategories[vatCharged].nettoSumme(getCurrentTotal())}
                tax={`${taxCategories[vatCharged].taxPercentage}% USt.`}
                taxAmount={taxCategories[vatCharged].taxAmount(getCurrentTotal())}
                totalAfterTax={taxCategories[vatCharged].calculateFinal(getCurrentTotal())}
                invoiceDate={moment(invoiceDate).format("DD.MM.yyyy")}
            />
        );

        const pdfName = `ulfs-cafe-${eventType.toLowerCase()}-rechnung-${moment(eventDate).format("DD-MM-yyyy")}.pdf`;

        const asPdf = pdf([]); // {} is important, throws without an argument
        asPdf.updateContainer(doc);
        const pdfBlob = await asPdf.toBlob();
        const url = URL.createObjectURL(pdfBlob);

        setSendError(null);

        let reader = new FileReader();
        reader.onload = async () => {
            if (reader.readyState === 2) {
                var buffer = Buffer.from(reader.result);
                const emailPayload = {
                    customer,
                    event: {
                        date: eventDate,
                        type: eventType,
                        invoiceId: invoiceNumber,
                    },
                    fileName: pdfName,
                    fileUrl: url,
                    buffer,
                };

                const res = await fetch(`${baseUrl}/api/v1/invoice/email-customer`, {
                    body: JSON.stringify({
                        email: emailPayload,
                    }),
                    method: "POST",
                    headers: { ...getHeaders() },
                });

                const { sent, message } = await res.json();

                if (message === "success" || sent) {
                    setBillSent(true);
                    notification.success(`Email sent to ${customer.companyName}`);
                } else {
                    setSendError(message);
                    notification.error(`Failed sending to ${customer.companyName}`);
                }
            }
        };
        reader.readAsArrayBuffer(pdfBlob);
    }, [
        customer,
        eventDate,
        eventType,
        invoiceNumber,
        getCurrentTotal,
        invoiceDate,
        serviceItems,
        vatCharged,
        notification,
        peopleNumber,
        eventKeyword,
    ]);

    useEffect(() => {
        if (emailRef && emailRef.current) {
            emailRef.current.cb = emailCustomer;
        }
    }, [emailRef, emailCustomer]);

    return (
        <>
            {sendError && <p className="ml-3 text-red">Error: {JSON.stringify(sendError)}</p>}
            <div className="d-flex h-100">
                {documentLoaded && (
                    <div className="display-none">
                        <PlainHTMLPDF
                            ref={printRef}
                            customerName={customer.contactName}
                            companyName={customer.companyName}
                            address={customer.address}
                            invoiceNumber={invoiceNumber}
                            peopleNumber={peopleNumber}
                            eventType={eventType}
                            eventDate={moment(eventDate).format("DD.MM.yyyy")}
                            eventKeyword={eventKeyword}
                            serviceItems={serviceItems}
                            totalNet={taxCategories[vatCharged].nettoSumme(getCurrentTotal())}
                            tax={`${taxCategories[vatCharged].taxPercentage}% USt.`}
                            taxAmount={taxCategories[vatCharged].taxAmount(getCurrentTotal())}
                            totalAfterTax={taxCategories[vatCharged].calculateFinal(getCurrentTotal())}
                            invoiceDate={moment(invoiceDate).format("DD.MM.yyyy")}
                        />
                    </div>
                )}
                <form onSubmit={handleSubmit} className="w-60 content-container pb-3 mt-1">
                    <div className="d-flex">
                        <div>
                            <p className="light-text label">Zahlungsstatus</p>
                            <Select
                                value={paidStatus ? "bezahlt" : "nicht bezahlt"}
                                onSelect={(value) => {
                                    if (value === "bezahlt") {
                                        setPaidStatus(true);
                                    } else {
                                        setPaidStatus(false);
                                    }
                                }}
                                textClasses={paidStatus ? "text-green" : "text-red"}
                                options={[{ value: "bezahlt" }, { value: "nicht bezahlt" }]}
                            />
                        </div>
                        <div className="ml-1">
                            <p className="light-text label">Sendungsstatus</p>
                            <Select
                                value={billSent ? "gesendet" : "nicht gesendet"}
                                onSelect={(value) => {
                                    if (value === "gesendet") {
                                        setBillSent(true);
                                    } else {
                                        setBillSent(false);
                                    }
                                }}
                                textClasses={billSent ? "text-green" : "text-red"}
                                options={[{ value: "gesendet" }, { value: "nicht gesendet" }]}
                            />
                        </div>
                    </div>
                    <h2 className="subheadline mt-2">Rechnungsinformationen</h2>
                    <div className="d-flex mt-1">
                        <Field
                            label={"Rechnungsnummer"}
                            value={invoiceNumber}
                            handleChange={(e) => setInvoiceNumber(e.target.value)}
                            positioningClasses="w-20"
                        />
                        <div className="ml-1">
                            <p className="light-text label">Rechnungsdatum</p>
                            <DatePicker
                                selected={invoiceDate}
                                onChange={(date) => setInvoiceDate(date)}
                                dateFormat={"dd.MM.yyyy"}
                                locale={"de"}
                                wrapperClassName="date-picker-override"
                            />
                        </div>
                        <div className="ml-1">
                            <p className="light-text label">USt.</p>
                            <Select
                                onSelect={(value) => setVatCharged(value)}
                                value={vatCharged}
                                options={[
                                    { value: "19% Incl. USt." },
                                    { value: "7% Incl. USt." },
                                    { value: "19% Excl. USt." },
                                    { value: "7% Excl. USt." },
                                ]}
                            />
                        </div>
                    </div>
                    <h2 className="mt-2 subheadline">Event-Informationen</h2>
                    <div className="d-flex mt-1">
                        <Field
                            label={"Personenzahl"}
                            value={peopleNumber}
                            handleChange={(e) => setPeopleNumber(e.target.value)}
                            positioningClasses="w-20"
                            inputType="number"
                        />
                        <Field
                            label={"Eventtyp"}
                            value={eventType}
                            handleChange={(e) => setEventType(e.target.value)}
                            positioningClasses="w-20 ml-1"
                        />
                        <Field
                            label={"Stichwort"}
                            value={eventKeyword}
                            handleChange={(e) => setEventKeyword(e.target.value)}
                            positioningClasses="w-20 ml-1"
                        />
                        <div className="ml-1">
                            <p className="light-text label">Datum</p>
                            <DatePicker
                                selected={eventDate}
                                onChange={(date) => setEventDate(date)}
                                dateFormat={"dd.MM.yyyy"}
                                locale={"de"}
                                wrapperClassName="date-picker-override"
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="d-flex ai-c jc-sb">
                            <h2 className="subheadline">Kundeninformationen</h2>
                            <p className="text-blue ml-auto c-hover" onClick={() => setModalOpen(true)}>
                                bearbeiten
                            </p>
                        </div>
                        <div className="d-flex">
                            <div className="w-60 ">
                                <p className="text-light-grey mt-1 label">Firma:</p>
                                <p style={{ marginTop: 6 }}>{customer.companyName}</p>
                                <p className="text-light-grey mt-2 label">Name:</p>
                                <p style={{ marginTop: 6 }}>{customer.contactName}</p>
                                <p className="text-light-grey mt-2 label">Address:</p>
                                <div style={{ marginTop: 6 }}>
                                    {customer.address.map((eachLine) => {
                                        return (
                                            <p key={eachLine}>
                                                <span>{eachLine}</span>
                                                <br />
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="w-40 ml-1 mt-1">
                                <p className="text-light-grey label">Steur Id:</p>
                                <p style={{ marginTop: 6 }}>{customer.taxId}</p>
                                <p className="text-light-grey mt-2 label">Email:</p>
                                <p style={{ marginTop: 6 }}>{customer.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h2 className="subheadline">Posten</h2>
                        {serviceItems &&
                            serviceItems.length > 0 &&
                            serviceItems.map((eachItem, index) => {
                                const total = Number(eachItem.price * eachItem.quantity).toFixed(2);
                                return (
                                    <div className="d-flex ai-c mt-1" key={index}>
                                        <Field
                                            positioningClasses="w-50"
                                            label={"Artikel"}
                                            value={eachItem.article}
                                            handleChange={(e) => handleItemUpdate(index, "article", e.target.value)}
                                        />
                                        <Field
                                            positioningClasses="ml-1 w-15"
                                            label={"Anzahl"}
                                            value={eachItem.quantity}
                                            inputType="number"
                                            handleChange={(e) => handleItemUpdate(index, "quantity", e.target.value)}
                                        />
                                        <Field
                                            positioningClasses="ml-1 w-15"
                                            label={"Einzelpreis"}
                                            value={eachItem.price}
                                            inputType="number"
                                            handleChange={(e) => handleItemUpdate(index, "price", e.target.value)}
                                        />
                                        <strong style={{ width: 80 }} className="ml-1 ta-r">
                                            Gesamt
                                            <br />
                                            <p style={{ marginTop: 12, textAlign: "right", whiteSpace: "nowrap" }}>{total} €</p>
                                        </strong>
                                        <div className="ml-3">
                                            <HiOutlineTrash
                                                size={26}
                                                color="red"
                                                onClick={() => deleteServiceItem(index)}
                                                className="c-hover hover-scale"
                                                title="delete"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        <div className="w-100 d-flex">
                            <div className="mt-2">
                                <Button text={"Hinzufügen +"} onClick={addServiceItem} type={"dashed"} />
                            </div>
                        </div>
                    </div>

                    <div className="w-100 d-flex">
                        <div className="ml-auto mt-2">
                            <Button text={"Speichern"} onClick={handleSubmit} />
                        </div>
                    </div>
                </form>
                {invoiceId && (
                    <div className="ml-auto mr-auto pb-2 p-rel w-30" style={{ minWidth: 200 }}>
                        <div className="p-fix">
                            {documentLoaded && (
                                <PDFViewer
                                    scale={10.0}
                                    style={{ width: "360px", height: "460px", background: "transparent", border: "none" }}
                                >
                                    <InvoicePDF
                                        customerName={customer.contactName}
                                        companyName={customer.companyName}
                                        address={customer.address}
                                        invoiceNumber={invoiceNumber}
                                        peopleNumber={peopleNumber}
                                        eventType={eventType}
                                        eventDate={moment(eventDate).format("DD.MM.yyyy")}
                                        eventKeyword={eventKeyword}
                                        serviceItems={serviceItems}
                                        totalNet={taxCategories[vatCharged].nettoSumme(getCurrentTotal())}
                                        tax={`${taxCategories[vatCharged].taxPercentage}% USt.`}
                                        taxAmount={taxCategories[vatCharged].taxAmount(getCurrentTotal())}
                                        totalAfterTax={taxCategories[vatCharged].calculateFinal(getCurrentTotal())}
                                        invoiceDate={moment(invoiceDate).format("DD.MM.yyyy")}
                                    />
                                </PDFViewer>
                            )}
                            <div>
                                <PDFDownloadLink
                                    document={
                                        <InvoicePDF
                                            customerName={customer.contactName}
                                            companyName={customer.companyName}
                                            address={customer.address}
                                            invoiceNumber={invoiceNumber}
                                            peopleNumber={peopleNumber}
                                            eventType={eventType}
                                            eventDate={moment(eventDate).format("DD.MM.yyyy")}
                                            eventKeyword={eventKeyword}
                                            serviceItems={serviceItems}
                                            totalNet={taxCategories[vatCharged].nettoSumme(getCurrentTotal())}
                                            tax={`${taxCategories[vatCharged].taxPercentage}% USt.`}
                                            taxAmount={taxCategories[vatCharged].taxAmount(getCurrentTotal())}
                                            totalAfterTax={taxCategories[vatCharged].calculateFinal(getCurrentTotal())}
                                            invoiceDate={moment(invoiceDate).format("DD.MM.yyyy")}
                                        />
                                    }
                                    fileName={`${invoiceNumber}_${customer.companyName}.pdf`}
                                >
                                    {({ blob, url, loading, error }) =>
                                        loading ? (
                                            "Loading document..."
                                        ) : (
                                            <div className="mt-1">
                                                <Button
                                                    text={"Herunterladen"}
                                                    onClick={downloadPDF}
                                                    type={"confirm"}
                                                    fullWidth
                                                    icon={<HiOutlineDocumentDownload size={"22px"} />}
                                                />
                                            </div>
                                        )
                                    }
                                </PDFDownloadLink>
                            </div>
                        </div>
                    </div>
                )}
                {modalOpen && (
                    <Modal closeCb={() => setModalOpen(false)}>
                        <AddCustomer addCustomerAndClose={addCustomerAndClose} />
                    </Modal>
                )}
            </div>
        </>
    );
};

export default Form;
