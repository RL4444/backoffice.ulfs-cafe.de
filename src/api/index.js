import Cookies from "universal-cookie";

const cookies = new Cookies();
const baseUrl = process.env.REACT_APP_API_BASE_URL || "";

export const getHeaders = () => {
    return { mode: "same-origin", redirect: "follow", credentials: "include", token: cookies.get("TOKEN") };
};

const api = async (path, { method = "GET", body = {}, headers }) => {
    const url = `${baseUrl}${path}`;
    const totalHeaders = { ...headers, ...getHeaders() };

    const newOptions = {
        body: JSON.stringify(body),
        headers: totalHeaders,
        method: method,
    };

    try {
        const res = await fetch(url, newOptions);
        const response = await res.json();
        return response;
    } catch (error) {
        console.log("catch block in AUTH middleware", error);
    }
};

export default api;
