# athletes-api

## Build
in the root directory of the whole project run the following command
./build-apps.sh athletes-api (file need to be in lf)


## .env
- `PORT` : Port to run the service (default 3000)
- `PREFIX` : Prefix for the api routes (default /api)
- `RECORDS_API` : URL for the records-api service
- `LBFA_USER` : User for the LBFA site to get the athletes list
- `LBFA_PASS` : Password for the LBFA site to get the athletes list
- `NODE_ENV` : development | production | test

See also [Template](.env.template)

## Routes
### GET /
Get a list of matching athletes with a key (the key should be either in the first or the last name or be equal to the bib)

#### Query parameters
- `key` : string min 1 caracter
#### Response
- base case :
```
Status 200
[
    {
        id: number;
        license: string;
        firstName: string;
        lastName: string;
        bib: number;
        gender: string;
        birthdate: Date;
        club: string;
        metadata: JsonValue;
        competitionId: number | null;
    },
    ...
]
```
- no matching athlete found : 
```
Status 404 ("No athlete found")
```

### POST /:license/records
Get the records of given event for an athlete

#### Parameters
- `license` : string
#### Body
- `event` : string[]
- `maxYear` : number (optional)(default 2)(min 1)
#### Response
- base case :
```
Status 200
{
    event1: {
        type: "time" | "distance" | "height" | "points";
        date: Date;
        discipline: string;
        perf: number;
    },
    ...
}
```
- no records regardless of given events :
```
Status 404 ("No records found")
```
