import { useContext } from "react";
import { AppContext } from "../../appcontextprovider";

const DashboardHome = () => {
    const { user } = useContext(AppContext);
    
    return (
        <div className="card">
            {
                user &&
                <div className="card-body">
                    <h5 className="card-title">{user.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{user.email}</h6>
                    <p className="card-text">{user.role}</p>
                    <p className="card-text">Account created on: {new Date(user.createdat).toLocaleDateString('en-US', { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
            }

        </div>
    )
}

export default DashboardHome
