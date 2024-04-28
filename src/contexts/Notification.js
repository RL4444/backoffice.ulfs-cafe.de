import React, { useState, createContext } from "react";
const NotificationContext = createContext(null);

// normal || error || success
const NotificationProvider = ({ children }) => {
    const [showNotificaiton, setShowNotification] = useState(false);
    const [notificationText, setNotificationText] = useState(null);
    const [notificationType, setNotificationType] = useState("normal");
    return (
        <NotificationContext.Provider
            value={{
                show: showNotificaiton,
                type: notificationType,
                text: notificationText,
                normal: (text) => {
                    setNotificationType("normal");
                    setNotificationText(text);
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 3000);
                },
                error: (text) => {
                    setNotificationType("error");
                    setNotificationText(text);
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 3000);
                },
                success: (text) => {
                    setNotificationType("success");
                    setNotificationText(text);
                    setShowNotification(true);
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 3000);
                },
                close: () => setShowNotification(false),
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export { NotificationProvider };
export default NotificationContext;
