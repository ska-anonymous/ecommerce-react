import React from 'react'
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


import { AppContext } from './appcontextprovider';

import Home from './Home.jsx';
import About from './components/About.jsx';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Dashboard from './components/Dashboard/Dashboard';
import DashboardHome from './components/Dashboard/DashboardHome';
import Orders from './components/Dashboard/Orders';
import Products from './components/Dashboard/Products';
import EditProduct from './components/Dashboard/EditProduct';
import AddProduct from './components/Dashboard/AddProduct';
import Users from './components/Dashboard/Users';


const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/about', element: <About /> },
    { path: '/checkout', element: <Checkout /> },
    { path: '/login', element: <Login /> },
    { path: '/logout', element: <Logout /> },
    { path: '/register', element: <Register /> },
    {
        path: '/dashboard', element: <Dashboard />, children: [
            { path: '', element: <DashboardHome /> },
            { path: 'products', element: <Products /> },
            { path: 'orders', element: <Orders /> },
            { path: 'edit-product', element: <EditProduct /> },
            { path: 'add-product', element: <AddProduct /> },
            { path: 'users', element: <Users /> },
        ]
    },
])

const App = () => {
    // check if the token is available then set the user
    let userObj = null;
    const token = sessionStorage.getItem('shoppingToken');
    if (token) {
        userObj = JSON.parse(atob(sessionStorage.getItem('shoppingToken').split('.')[1]));
    }

    const [user, setUser] = useState(userObj);
    const [cart, setCart] = useState([]);

    return (
        <AppContext.Provider value={{ user, setUser, cart, setCart }}>
            <RouterProvider router={router} />
        </AppContext.Provider>
    )
}

export default App
