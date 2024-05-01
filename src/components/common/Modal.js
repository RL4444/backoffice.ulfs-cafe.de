import React, { useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";
import "./modal.css";

const Modal = ({ children, closeCb }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div className="background-vignette">
            <div className="modal-container">
                <div className="d-flex jc-fe">
                    <HiOutlineX onClick={closeCb} />
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
