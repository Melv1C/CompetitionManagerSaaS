import axios from 'axios';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost/api/admins' : process.env.GATEWAY_URL + '/api/admins';
console.log(process.env);
function logout(props) {
    localStorage.removeItem('userId');
    props.setUser(null);
}

function login(email, password, setUser, setError) {
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


