import { io } from 'socket.io-client';

const URL = "https://competitionmanager.be";
//const URL = "http://localhost:3001";

//console.log('Connecting to socket server at', URL);
const socket = io(URL, { 
    autoConnect: false, 
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 5000,
    reconnectionDelayMax: 10000,
    timeout: 5000,
    upgrade: false
});

socket.connect();

socket.on('connect', () => {
    console.log('Connected to socket server for live results');
    // console.log(socket);

}).on('connect_error', (error) => {
    console.log('Connection error:', error);
})

socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
    // console.log(socket);
});

export default socket;