import { HashRouter, BrowserRouter, Switch, Route } from "react-router-dom";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import Customer from "./pages/Customer";
import NewCustomer from "./pages/NewCustomer";
import Invoices from "./pages/Invoices";
import Invoice from "./pages/Invoice";
import NewInvoice from "./pages/NewInvoice";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import PrivateRoute from "./common/PrivateRoute";

function App() {
    const getRoutes = () => {
        return (
            <div>
                <Switch>
                    <PrivateRoute exact path="/settings/edit" component={Settings} />
                    <PrivateRoute exact path="/customers/:customerEmail" component={Customer} />
                    <PrivateRoute exact path="/customers/new/create" component={NewCustomer} />
                    <PrivateRoute exact path="/customers" component={Customers} />
                    <PrivateRoute exact path="/invoice/:invoiceNumber/" component={Invoice} />
                    <PrivateRoute exact path="/invoice/new/create" component={NewInvoice} />
                    <PrivateRoute exact path="/invoice/" component={Invoices} />
                    <PrivateRoute exact path="/" component={Dashboard} />
                    <Route exact path="/login" component={Login} />
                </Switch>
            </div>
        );
    };

    if (process.env.NODE_ENV === "production") {
        return <HashRouter>{getRoutes()}</HashRouter>;
    } else {
        return <BrowserRouter>{getRoutes()}</BrowserRouter>;
    }
}

export default App;
