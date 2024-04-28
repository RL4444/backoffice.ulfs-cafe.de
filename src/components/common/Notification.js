import React, { useContext } from "react";
import { HiOutlineX, HiBadgeCheck, HiExclamationCircle, HiSpeakerphone } from "react-icons/hi";

import NotificationContext from "../../contexts/Notification";

import "./styles/Notification.css";

const Notification = () => {
    const notification = useContext(NotificationContext);

    if (notification) {
        return (
            <div className={`notification ${notification.type} ${notification.show ? "onscreen" : ""}`}>
                {notification.type === "success" ? (
                    <HiBadgeCheck fill="#1cc947" size="30px" />
                ) : notification.type === "error" ? (
                    <HiExclamationCircle fill="#ed2e2e" size="30px" />
                ) : (
                    <HiSpeakerphone fill="#515151" size="30px" />
                )}

                <p className="notification-text ml-1">{notification.text}</p>
                <span className="notification-close-btn ml-auto" onClick={() => notification.close()}>
                    <HiOutlineX size="30px" />
                </span>
            </div>
        );
    }

    return null;
};

export default Notification;
