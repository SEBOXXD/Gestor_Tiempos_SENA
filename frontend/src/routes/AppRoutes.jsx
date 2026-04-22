import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Registro";
import Dashboard from "../pages/Dashboard";
import Reportes from "../pages/Reportes";
import Inicio from "../pages/Inicio";


function AppRoutes() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Login />} />
            <Route path = "/register" element = {<Register />} />
            <Route path = '/dashboard' element = {<Dashboard />} />
            <Route path = '/reportes'  element = {<Reportes />}  />
            <Route path = '/inicio'    element = {<Inicio />}    />
        </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes