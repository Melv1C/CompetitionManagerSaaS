console.log(process.env);
const URL = process.env.REACT_APP_GATEWAY_URL ? process.env.REACT_APP_GATEWAY_URL + "/api" : 'http://localhost/api';

const ATLHETES_URL = URL + '/athletes';
const COMPETITIONS_URL = URL + '/competitions';
const INSCRIPTIONS_URL = URL + '/inscriptions';
const INSCRIPTIONS_ADMIN_URL = URL + '/admin/inscriptions';
const EVENTS_URL = URL + '/events';
const ADMINS_URL = URL + '/admins';
const CONFIRMATIONS_URL = URL + '/confirmations';

export { URL, ATLHETES_URL, COMPETITIONS_URL, INSCRIPTIONS_URL, EVENTS_URL, ADMINS_URL, CONFIRMATIONS_URL, INSCRIPTIONS_ADMIN_URL };