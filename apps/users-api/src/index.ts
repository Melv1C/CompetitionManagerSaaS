import express from "express";
import 'dotenv/config';

import routes from './routes';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

app.use(`${PREFIX}/users`, routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
