import { Link } from 'react-router-dom';
import '../sidebar.css';
import { useContext } from 'react';
import { AppContext } from '../appcontextprovider';
const Sidebar = () => {
    const { user } = useContext(AppContext);
    return (
        <>
            {user.role == 'admin' && <div className="sidebar">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard/add-product">Add Product</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard/products">Products</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard/orders">Orders</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard/users">Users</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/logout">Logout</Link>
                    </li>
                </ul>
            </div>}

            {user.role != 'admin' && <div className="sidebar">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard/orders">Orders</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/logout">Logout</Link>
                    </li>
                </ul>
            </div>}

        </>
    )
}

export default Sidebar;