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
        "id": "string",
        "name": "string",
        "date": "string",
        "location": "string",
        "club": "string",
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
    "date": "string",
    "location": "string",
    "club": "string",
    ...
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
    "date": "string",
    "location": "string",
    ...
}
```
- Response: HTTP 200 OK
```json
{
    "status": "success",
    "message": "Competition updated successfully",
    "data": {
        "id": "string",
        ...
    }
}
```

