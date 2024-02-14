console.log(process.env);
const URL = process.env.REACT_APP_GATEWAY_URL ? process.env.REACT_APP_GATEWAY_URL + "/api" : 'http://localhost/api';

const ATLHETES_URL = URL + '/athletes';
const COMPETITIONS_URL = URL + '/competitions';
const INSCRIPTIONS_URL = URL + '/inscriptions';
const EVENTS_URL = URL + '/events';
const ADMINS_URL = URL + '/admins';

export { URL, ATLHETES_URL, COMPETITIONS_URL, INSCRIPTIONS_URL, EVENTS_URL, ADMINS_URL };