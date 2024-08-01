import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useContext } from "react";
import { AppContext } from "../../appcontextprovider";

const Dashboard = () => {

    const { user } = useContext(AppContext);

    if (!user) {
        return (
            <Navigate to={'/login'} />
        )
    }

    return (
        user && <>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3" style={{ borderRight: '1px solid black' }}>
                        <Sidebar />
                    </div>
                    <div className="col-9">
                        <div className="container mt-5">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Dashboard