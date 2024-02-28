# Competitions service

## TODO

- date end inscriptions
- add var payment boolean
- add list club gratuit
- lien vers horaire pdf optionnel
- list des epreuves
    - nom(id)
    - heure
    - list des categories
    - nb participants max
    - cout



## Description

This service is responsible for managing competitions. 

## Technologies

- Node.js (Express)
- MongoDB (Mongoose)

## API

### Get competitions

- `GET /api/competitions`
- Description: Get all competitions
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Competitions retrieved successfully",
    "data": [
        competition1,
        competition2,
        ...
    ]
}
```

### Get competitions filtered by adminId
- `GET /api/competitions/admin/:adminId`
- Description: Get all competitions filtered by adminId
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Competitions retrieved successfully",
    "data": [
        competition1,
        competition2,
        ...
    ]
}
```


### Get competition by id

- `GET /api/competitions/:id`
- Description: Get competition's data by id
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Competition retrieved successfully",
    "data": {
        "name": "string",
        "location": "string",
        "club": "string",
        "date": "string",
        "paid": "boolean",          //true if athletes have to pay to participate
        "freeClub": ["string"],     //list of clubs that don't have to pay
        "schedule": "string",       //link to the schedule pdf 
        "description": "string",
        "events": [
            event1,
            event2,
            ...
        ] 
    }
}
```

### Get events of a competition filtered by a category (TODO)

- `GET /api/competitions/:id/events?category=category`
- Description: Get events of a competition filtered by a category
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Events retrieved successfully",
    "data": [
        event1,
        event2,
        ...
    ]
}
```

### Create a new competition

- `POST /api/competitions`
- Description: Create a new competition
- Request body:
```json
{
    "name": "string",
    "location": "string",
    "club": "string",
    "date": "string",
    "paid": "boolean",          //true if athletes have to pay to participate
    "freeClub": "boolean",      //true if the club doesn't have to pay (optional)
    "schedule": "string",       //link to the schedule pdf (optional)
    "description": "string",    //(optional)
}
```
- Response: HTTP 201 Created
```json
{
    "status": "success",
    "message": "Competition created successfully",
    "data": {
        "id": "string"
    }
}
```

### Add an event to a competition

- `POST /api/competitions/:id/events`
- Description: Add an event to a competition
- Request body:
```json
{
    "name": "string",
    "pseudoName" : "string",     //optional default name
    "time": "date",
    "categories": ["string"],
    "maxParticipants": "number", //optional
    "cost": "number",            //optional default 0
    "subevents": [               //optional default empty
        {
            "name": "string",
            "time": "date",
        }
    ]
}
```

- Response: HTTP 201 Created
```json
{
    "status": "success",
    "message": "Event added successfully",
    "data": {
        "id": "string",
        "events": [
            event1,
            event2,
            ...
        ]
    }
}
```

### Delete an event from a competition (TODO)

- `DELETE /api/competitions/:id/events/:eventId`
- Description: Delete an event from a competition
- Response: HTTP 200 OK
```json
{
    "status": "success",
    "message": "Event deleted successfully",
}
```

### Update an event from a competition (TODO)

- `PUT /api/competitions/:id/events/:eventId`
- Description: Update an event from a competition
- Request body:
```json
{
    "name": "string",
    "pseudoName" : "string",     //optional default name
    "time": "date",
    "categories": ["string"],
    "maxParticipants": "number", //optional
    "cost": "number",            //optional
}
```
- Response: HTTP 200 OK
```json
{
    "status": "success",
    "message": "Event updated successfully",
    "data": {
        "id": "string",
        "events": [
            event1,
            event2,
            ...
        ]
    }
}
```

### Update a competition

- `PUT /api/competitions/:id`
- Description: Update a competition
- Request body:
```json
{
    "name": "string",
    "location": "string",
    "club": "string",
    "date": "string",
    "paid": "boolean",          //true if athletes have to pay to participate
    "freeClub": ["string"],     //list of clubs that don't have to pay (optional)
    "schedule": "string",       //link to the schedule pdf (optional)
    "description": "string",    //(optional)
}
```
- Response: HTTP 200 OK
```json
{
    "status": "success",
    "message": "Competition updated successfully",
    "data": {
        "id": "string"
    }
}
```

### Delete a competition (TODO)

- `DELETE /api/competitions/:id`
- Description: Delete a competition
- Response: HTTP 200 OK
```json
{
    "status": "success",
    "message": "Competition deleted successfully",
}
```


## Testing

### Create a new competition
```
curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"Competition 1\",\"location\":\"Location 1\",\"club\":\"USTA\",\"date\":\"2024-05-05\",\"paid\":true,\"freeClub\":[\"USTA\"],\"schedule\":\"http://schedule.com\",\"description\":\"Description 1\"}" http://localhost/api/competitions
```

### Get all competitions
```
curl -X GET http://localhost/api/competitions
```

### Get competition by id
```
curl -X GET http://localhost/api/competitions/{ID}
```

### Add an event to a competition
```
curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"Saut en longueur\",\"time\":\"9h00\",\"categories\":[\"SEN M\"],\"maxParticipants\":10,\"cost\":3}" http://localhost/api/competitions/{ID}/events
```

### Update a competition
```
curl -X PUT -H "Content-Type: application/json" -d "{\"name\":\"Competition 1\",\"location\":\"Location 1\",\"club\":\"Club 1\",\"date\":\"2021-01-01\",\"paid\":true,\"freeClub\":[\"Club 2\"],\"schedule\":\"http://schedule.com\",\"description\":\"Description 2\"}" http://localhost/api/competitions/{ID}
```


