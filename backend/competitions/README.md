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

- `GET /competitions`
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

### Get competition by id

- `GET /competitions/:id`
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
    }
}
```

### Create a new competition

- `POST /competitions`
- Description: Create a new competition
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

### Update a competition

- `PUT /competitions/:id`
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

## Testing

### Create a new competition
```
curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"Competition 1\",\"location\":\"Location 1\",\"club\":\"Club 1\",\"date\":\"2021-01-01\",\"paid\":true,\"freeClub\":[\"Club 2\"],\"schedule\":\"http://schedule.com\",\"description\":\"Description 1\"}" http://localhost:3000/competitions
```

### Get all competitions
```
curl -X GET http://localhost:3000/competitions
```

### Get competition by id
```
curl -X GET http://localhost:3000/competitions/{ID}
```

### Update a competition
```
curl -X PUT -H "Content-Type: application/json" -d "{\"name\":\"Competition 1\",\"location\":\"Location 1\",\"club\":\"Club 1\",\"date\":\"2021-01-01\",\"paid\":true,\"freeClub\":[\"Club 2\"],\"schedule\":\"http://schedule.com\",\"description\":\"Description 2\"}" http://localhost:3000/competitions/{ID}
```

