import { API_URL } from "../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const data = JSON.stringify({
            name: name,
            email: email,
            password: password,
        })

        const h = new Headers();
        h.append('content-type', 'application/json');

        setIsLoading(true);

        const response = await fetch(API_URL + '/register', {
            headers: h,
            method: 'POST',
            body: data,
        })

        const responseData = await response.json();

        setIsLoading(false);

        if (responseData.error) {
            alert(responseData.errorMessage);
        } else {
            setName('');
            setEmail('');
            setPassword('');
            alert('registeration successfull');
            navigate('/login');

        }


    }

    return (
        <>
            <Navbar />
            <div className="container my-5">
                <div className="row justify-content-center align-items-center" style={{ height: '90vh' }}>
                    <div className="col-6">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h2 className="text-center">Register</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleRegister}>
                                    <div className="form-group">
                                        <label htmlFor="">Name</label>
                                        <input type="text" value={name} className="form-control" onChange={e => setName(e.currentTarget.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Email</label>
                                        <input type="email" value={email} className="form-control" onChange={e => setEmail(e.currentTarget.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Password</label>
                                        <input type="password" value={password} className="form-control" onChange={e => setPassword(e.currentTarget.value)} required />
                                    </div>
                                    <div className="form-group my-4">
                                        <button type="submit" className="btn btn-primary" disabled={isLoading} >{isLoading ? 'Registering...' : 'REGISTER'}</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
