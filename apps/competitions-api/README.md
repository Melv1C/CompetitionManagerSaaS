# competitions api
## Build
in the root directory of the whole project run the following command
./build-apps.sh competitions-api (file need to be in lf)


## .env
all the environment variables that are required

See also [Template](.env.template)




get all competitions        done
get a competition by eid    done
create a competition        done
update a competition
delete a competition

get all events of a competition -> non parce que get a competition by eid les donne déja
get an event of a competition (with participants always ?)
create an event             ongoing
update an event
delete an event

create admin
update admin
delete admin

diff route ? /results/:eid ? ou aussi dans competitions
get results of an event
create results of an event (update if already exist)
delete results of an event

diff route ? /liveResult/:eid ? ou aussi dans competitions
get liveResult 
get liveResult as a admin

diff route ? /inscriptions/:eid ? ou aussi dans competitions
create inscription
update inscription
delete inscription

diff route ? /confirmations/:eid ? ou aussi dans competitions
update inscription as confirmed

autre ?








## Routes
### GET /
Get all competitions basic info
#### Response
```
Status 200
[
    {
        eid: string,
        name: string,
        date: string (date format),
    }
]
```

## Routes
### GET /:eid
Get a competitions with it's eid
#### Params
- eid: string
#### Response
```
Status 200
[
    {
        name: string,
        date: string (date format),
        description: string,
        startInscriptionDate: string (date format),
        endInscriptionDate: string (date format),
        email: string,
        closeDate: string (date format),
        oneDayPermission: array of string ['foreing', 'all', 'bpm'],
        oneDayBibStart: int,
        event : [
            to do
        ]
    }
]
```

### POST /
Create a new competition
#### Body
- name: string
- date : string (date format)
- method: string ['free', 'online', 'onPlace']
- paymentPlanId: int
- optionsId: int[]
- userId: int
#### Response
```
Status 200
[
    {
        to do
    }
]
```







