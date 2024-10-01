import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { checkAdmin, Competition, getAll } from 'competitionmanagerutils';

dotenv.config();

const serviceName = "competitions";
const port = process.env.PORT || 3000;
const prefix = process.env.PREFIX || '/competitions';

const app: Express = express();

app.use(express.json());

app.get(`${prefix}`, async (req: Request, res: Response) => {
    try {
        const competitions : Competition[] = await getAll("competitions", Competition);

        res.status(200).json({
            status: 'success',
            message: 'Retrieved all competitions',
            data: competitions
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving competitions',
            error: error
        });
    }
});

app.get(`${prefix}/:id`, async (req: Request, res: Response) => {
    const id : number = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
        res.status(400).json({
            status: 'error',
            message: 'Invalid ID'
        });
        return;
    }
    const competition = new Competition();
    try {
        await competition.load(id, true);
        res.status(200).json({
            status: 'success',
            message: 'Retrieved competition',
            data: competition
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving competition',
            error: error
        });
    }
});


////////////////////////////////
// ADMIN API
////////////////////////////////

app.use(checkAdmin);

app.post(`${prefix}/:name`, (req: Request, res: Response) => {
    const competition = new Competition(req.params.name);
    competition.fromJSON(req.body);
    competition.create_by = 'admin';
    competition.update_by = 'admin';

    competition.save()
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({ error });
        });

});

app.listen(port, () => {
  console.log(`${serviceName} is listening on port ${port}`);
});
