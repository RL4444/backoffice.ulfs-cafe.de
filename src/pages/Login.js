import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";

import Button from "../components/common/Buttons";
import Input from "../components/common/Input";

import CafeLogo from "../images/cafelogo.png";

const cookies = new Cookies();
const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

export const Logout = () => {
    console.log("logging out");
    cookies.remove("TOKEN", { path: "/" });
    localStorage.clear();
    return <Redirect to="/login" />;
};

const Login = () => {
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formError, setFormError] = useState(null);

    const getLoginAndRedirect = async () => {
        cookies.remove("TOKEN", { path: "/" });

        const res = await fetch(`${baseUrl}/api/v1/user/login`, {
            method: "POST",
            body: JSON.stringify({ password: password }),
            headers: { "Content-Type": "application/json" },
        });
        const { token, error, message } = await res.json();

        if (error) {
            setFormError(message);
            return;
        }
        localStorage.setItem("jwtUlf", token);
        cookies.set("TOKEN", token, {
            path: "/",
        });
        setIsLoggedIn(true);
    };

    return (
        <div className="d-flex fd-col ai-c w-100" style={{ height: "100dvh" }}>
            {!isLoggedIn ? (
                <>
                    <div
                        onKeyDown={(e) => {
                            console.log("e", e.keyCode);
                            if (e.keyCode === 13) {
                                e.preventDefault(); // Ensure it is only this code that runs
                                getLoginAndRedirect();
                            }
                        }}
                        className="p-4 bg-white br-12 nice-shadow"
                        style={{ marginTop: "10%" }}
                    >
                        <div className="w-100">
                            <img src={CafeLogo} alt="Ulfs cafe" style={{ maxWidth: 300 }} />
                        </div>
                        <h1 className="mt-1">Moin!</h1>
                        <div className="mt-2">
                            <Input
                                label="Password"
                                value={password}
                                handleChange={(e) => {
                                    setFormError("");
                                    setPassword(e.target.value);
                                }}
                                inputType="password"
                            />
                            {formError && <p className="fs-12 text-red mt-1">{formError}</p>}
                        </div>
                        <div className="mt-1">
                            <Button type="hollow" text="Einloggen" onClick={getLoginAndRedirect} fullWidth role="submit"></Button>
                        </div>
                    </div>
                </>
            ) : (
                <Redirect to="/" />
            )}
        </div>
    );
};

export default Login;
