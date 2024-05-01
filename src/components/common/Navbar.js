import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

import { Logout } from "../../pages/Login";
import Button from "./Buttons";

import CafeLogo from "../../images/cafelogo.png";
import { getHeaders } from "../../api";

import { HiOutlineDocumentText, HiOutlineUsers, HiOutlineCog, HiArrowRight, HiArrowLeft, HiHome } from "react-icons/hi";
import "./Navbar.css";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

const Navbar = () => {
    const [shouldLogUserOut, setShouldLogUserOut] = useState(false);

    const history = useHistory();
    const location = useLocation();

    const goBack = () => {
        history.goBack();
    };
    const goForward = () => {
        history.goForward();
    };

    const logout = async () => {
        await fetch(`${baseUrl}/api/v1/user/logout`, {
            method: "POST",
            headers: getHeaders(),
        });

        setShouldLogUserOut(true);
    };

    return (
        <>
            {shouldLogUserOut ? (
                <Logout />
            ) : (
                <nav className="nav-wrapper ">
                    <div className="d-flex jc-c ai-c">
                        <div onClick={goBack} className="bg-arrow-hover c-hover">
                            <HiArrowLeft size="40px" />
                        </div>

                        <div onClick={goForward} className="bg-arrow-hover c-hover">
                            <HiArrowRight size="40px" />
                        </div>
                    </div>
                    <div style={{ paddingTop: "5em" }}>
                        <div>
                            <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
                                <HiHome size={"22px"} />
                                <p className={`text`}>Dashboard</p>
                            </Link>
                        </div>
                        <div>
                            <Link to="/invoice" className={`nav-item ${location.pathname.includes("/invoice") ? "active" : ""}`}>
                                <HiOutlineDocumentText size={"22px"} />
                                <p className={`text`}>Rechnungen</p>
                            </Link>
                        </div>
                        <div>
                            <Link to="/customers" className={`nav-item ${location.pathname.includes("/customers") ? "active" : ""}`}>
                                <HiOutlineUsers size={"22px"} />
                                <p className={`text`}>Kunden</p>
                            </Link>
                        </div>
                        <div>
                            <Link to="/settings/edit" className={`nav-item ${location.pathname.includes("/settings") ? "active" : ""}`}>
                                <HiOutlineCog size={"22px"} />
                                <p className={`text`}>Einstellungen</p>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-auto pb-4 ml-auto mr-auto">
                        <div className="mb-3">
                            <Button text="Abmelden" type="hollow" onClick={logout} />
                        </div>
                        <img src={CafeLogo} alt="Ulfs cafe" style={{ width: 150 }} />
                    </div>
                </nav>
            )}
        </>
    );
};

export default Navbar;
