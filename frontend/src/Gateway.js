console.log(process.env);
const url = process.env.REACT_APP_GATEWAY_URL ? process.env.REACT_APP_GATEWAY_URL + "/api" : 'http://localhost/api';
console.log(url);

const ATLHETES_URL = url + '/athletes';
const COMPETITIONS_URL = url + '/competitions';
const INSCRIPTIONS_URL = url + '/inscriptions';
const EVENTS_URL = url + '/events';

export { url };