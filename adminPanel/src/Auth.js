import axios from 'axios';

import { ADMINS_URL } from './Gateway';

function logout(props) {
    localStorage.removeItem('userId');
    props.setUser(null);
}

function login(email, password, setUser, setError) {
    console.log(ADMINS_URL);
    axios.get(`${ADMINS_URL}?email=${email}&password=${password}`).then((response) => {
        console.log(response.data);
        setUser(response.data.data);
        localStorage.setItem('userId', response.data.data.id);
    }).catch((error) => {
        console.log(error);
    });
}

function getUser(userId, setUser) {
    axios.get(`${ADMINS_URL}/${userId}`).then((response) => {
        setUser(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

export { logout, login, getUser };


