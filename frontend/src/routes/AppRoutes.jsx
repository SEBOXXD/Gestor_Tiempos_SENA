import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Registro"
import Dashboard from "../pages/Dashboard";
// import Dashboard from "../pages/Dashboard";


function AppRoutes() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Login />} />
            <Route path = "/register" element = {<Register />} />
            <Route path = '/dashboard' element = {<Dashboard />} />
        </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes