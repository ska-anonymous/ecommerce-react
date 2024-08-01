import React, { useContext } from 'react';
import { SITE_NAME } from '../config';
import { Link } from 'react-router-dom';
import { AppContext } from '../appcontextprovider';

const Navbar = () => {

  const { user, cart } = useContext(AppContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container px-4 px-lg-5">
        <Link className="navbar-brand" to="/">{SITE_NAME}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item"><Link className="nav-link active" aria-current="page" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item">
              {user ? <Link className="nav-link" to="/dashboard">dashboard</Link> : <Link className="nav-link" to="/login">Login</Link>}
            </li>
            <li className="nav-item"><Link className="nav-link" to="/register">Sign Up</Link></li>
          </ul>
          <Link to='/checkout' className="btn btn-outline-dark">
            <i className="bi-cart-fill me-1"></i>
            Cart
            <span className="badge bg-dark text-white ms-1 rounded-pill">{cart.length}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;