import axios from 'axios';

console.log(process.env);
const url = process.env.REACT_APP_GATEWAY_URL ? process.env.REACT_APP_GATEWAY_URL + '/api/admins' : 'http://localhost/api/admins';

function logout(props) {
    localStorage.removeItem('userId');
    props.setUser(null);
}

function login(email, password, setUser, setError) {
    console.log(url);
    axios.get(`${url}?email=${email}&password=${password}`).then((response) => {
        console.log(response.data);
        setUser(response.data.data);
        localStorage.setItem('userId', response.data.data.id);
    }).catch((error) => {
        console.log(error);
    });
}

function getUser(userId, setUser) {
    axios.get(`${url}/${userId}`).then((response) => {
        setUser(response.data.data);
    }).catch((error) => {
        console.log(error);
    });
}

export { logout, login, getUser };


