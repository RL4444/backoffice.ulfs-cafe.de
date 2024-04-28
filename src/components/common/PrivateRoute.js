import { Redirect, Route } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function PrivateRoute({ component: Component, ...rest }) {
    const isAuthenticated = () => {
        // here we check
        const token = cookies.get("TOKEN");
        // returns route if there is a valid token set in the cookie
        if (token) return true;
        return false;
    };

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated() ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            }
        />
    );
}

export default PrivateRoute;
