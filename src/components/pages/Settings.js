import React from "react";
import Navbar from "../common/Navbar";

const Settings = () => {
    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                <h1 className="title">Einstellungen</h1>
                <div className="content-container mt-3">
                    <h3>Ihre Einstellungen</h3>
                </div>
            </main>
        </>
    );
};

export default Settings;
