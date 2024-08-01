import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../appcontextprovider";

const Logout = () => {
    const { setUser } = useContext(AppContext);

    const navigate = useNavigate();
    useEffect(() => {
        sessionStorage.removeItem('shoppingToken');
        setUser(null);
        navigate('/login');
    }, [])
}

export default Logout
