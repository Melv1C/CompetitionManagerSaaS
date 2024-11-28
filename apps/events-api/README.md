# events-api
## Build
in the root directory of the whole project run the following command
./build-apps.sh events-api (file need to be in lf)


## .env
- `PORT` : Port to run the service (default 3000)
- `PREFIX` : Prefix for the api routes (default /api)
- `NODE_ENV` : development | production | test

See also [Template](.env.template)

## Routes
### GET /
Get all events
#### Response
Status 200
[
    {
        id: number;
        name: string;
        abbr: string;
        type: string;
        group: number;
    },
    ...
]

