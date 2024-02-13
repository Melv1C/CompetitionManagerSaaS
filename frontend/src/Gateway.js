console.log(process.env);
const URL = process.env.REACT_APP_GATEWAY_URL ? process.env.REACT_APP_GATEWAY_URL + "/api" : 'http://localhost/api';
console.log(URL);

const ATLHETES_URL = URL + '/athletes';
const COMPETITIONS_URL = URL + '/competitions';
const INSCRIPTIONS_URL = URL + '/inscriptions';
const EVENTS_URL = URL + '/events';

export { URL, ATLHETES_URL, COMPETITIONS_URL, INSCRIPTIONS_URL, EVENTS_URL };