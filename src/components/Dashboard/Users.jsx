import React, { useEffect, useState } from 'react'
import { API_URL } from '../../config';

const Users = () => {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {

            const response = await fetch(API_URL + '/getuser/all', {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('shoppingToken'),
                }
            })

            const result = await response.json();

            if (result.error)
                throw new Error(result.errorMessage);

            setUsers(result.users);

        } catch (err) {
            alert('Failed to fetch users ' + err.message);
            alert('Failed to fetch users ', err);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Date Registered</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                        return (
                            <tr key={'user-row-' + index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {new Date(user.createdat).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Users
