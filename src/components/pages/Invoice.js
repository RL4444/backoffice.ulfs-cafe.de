import React, { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { AiOutlineSave, AiOutlinePrinter, AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import FormAndViewer from "../common/invoices/FormAndViewer";

import { HiExclamation } from "react-icons/hi";
import "./styles/Invoice.css";
import Modal from "../common/Modal";
import Button from "../common/Buttons";
import NotificationContext from "../../contexts/Notification";
import Navbar from "../common/Navbar";

import { getHeaders } from "../../api";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

const UtilButtons = ({ handlePrint, handleSave, handleDelete, handleEmail }) => {
    return (
        <div className="d-flex ml-2">
            <div className="util-button" onClick={handlePrint}>
                <AiOutlinePrinter size={"28px"} />
            </div>

            <div className="util-button" onClick={handleSave}>
                <AiOutlineSave size={"28px"} />
            </div>

            <div className="util-button" onClick={handleEmail}>
                <AiOutlineMail size={"28px"} />
            </div>

            <div className="util-button" onClick={handleDelete}>
                <AiOutlineDelete size={"28px"} />
            </div>
        </div>
    );
};

const Invoice = ({ match }) => {
    const printRef = useRef();
    const history = useHistory();
    const notification = useContext(NotificationContext);

    const { invoiceNumber } = match.params;
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const emailRef = useRef({ cb: () => console.log("yeay") });
    const saveRef = useRef({ cb: () => console.log("yeay") });

    const initDelete = () => {
        setDeleteError(null);
        setShowDeleteConfirmModal(true);
    };

    const deleteInvoice = async () => {
        try {
            const res = await fetch(`${baseUrl}/api/v1/invoice/delete/${invoiceNumber}`, {
                method: "PUT",
                headers: getHeaders(),
            });

            const { success, error, message } = await res.json();

            if (!success) {
                console.log({ error }, { message });
                notification.error("Could not delete invoice");
                setDeleteError(message);
            } else {
                notification.success("Deleted Invoice");
                history.replace("/");
            }
        } catch (error) {
            notification.error("Could not delete invoice");
            setDeleteError(error);
        }
    };

    const handleEmail = () => {
        if (emailRef.current) {
            emailRef.current.cb();
        }
    };

    const handleSave = () => {
        if (saveRef.current) {
            saveRef.current.cb();
        }
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        pageStyle: `@media print {
            @page {
                size: 500mm 500mm;
                margin: 0;
            }
        }`,
    });

    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <h1 className="title">Rechnung {invoiceNumber}</h1>
                <UtilButtons handlePrint={handlePrint} handleSave={handleSave} handleDelete={initDelete} handleEmail={handleEmail} />
                <FormAndViewer invoiceId={invoiceNumber} printRef={printRef} emailRef={emailRef} saveRef={saveRef} />
                {deleteError && <p className="text-red mt-1 ta-c">{deleteError}</p>}
                {/* confirm invoice deletion */}
                {showDeleteConfirmModal && (
                    <Modal closeCb={() => setShowDeleteConfirmModal(false)}>
                        <div className="d-flex fd-col ai-c">
                            <HiExclamation size="100px" fill="#dd3939" />
                            <p className="mt-1">Diese Rechnung wird gelöscht.</p>
                            <div className="d-flex gap-large mt-2">
                                <Button text="Zuruck" onClick={() => setShowDeleteConfirmModal(false)} type="hollow" />
                                <Button text="Löschen" onClick={deleteInvoice} type="danger" />
                            </div>
                        </div>
                    </Modal>
                )}
            </main>
        </>
    );
};

export default Invoice;
