import React from 'react';
import { SITE_NAME } from '../config';
const Footer = () => {
    return (
        <>
            <footer className="py-5 bg-dark">
                <div className="container"><p className="m-0 text-center text-white">Copyright &copy; {SITE_NAME} {new Date().getFullYear()}</p></div>
            </footer>
        </>
    )
}

export default Footer;