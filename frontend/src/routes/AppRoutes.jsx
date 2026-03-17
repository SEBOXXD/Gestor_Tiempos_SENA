import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
// import Dashboard from "../pages/Dashboard";


function AppRoutes() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Login />} />
        </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes