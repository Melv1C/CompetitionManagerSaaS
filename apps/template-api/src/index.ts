import express from "express";
import 'dotenv/config';

import routes from './routes';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

//app.use(`${PREFIX}/CHANGEME`, routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
