import { API_URL } from "../config";
export const checkLogin = async () => {

    const shoppingToken = sessionStorage.getItem('shoppingToken');

    // if there is no token in storage
    if (!shoppingToken) {
        return { login: false, user: null };
    }

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${shoppingToken}`);

    const response = await fetch(API_URL + '/getuser', {
        headers: headers,
        method: 'GET',
    });
    let data = await response.json();

    if (data.error) {
        return { login: false, user: null }
    } else {
        return { login: true, user: data.data }
    }

}