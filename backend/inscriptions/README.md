# Inscriptions service

## Description

This service is responsible for managing inscriptions.

## API

### New competition

- `POST /inscriptions`
- Description: Create a new competition
- Request body:
```json
{
    "competitionId": "string",
}
```
- Response: HTTP 201
```json
{
    "status": "success",
    "message": "Competition created successfully"
}
```

### Delete competition

- `DELETE /inscriptions/:competitionId`
- Description: Delete a competition
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Competition deleted successfully"
}
```


### Get info of a competition

- `GET /inscriptions/:competitionId/info`
- Description: Get info of a competition
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Competition info retrieved successfully",
    "data": {
        "id": "competitionId",
        "numberOfInscriptions": 20,
        "numberOfParticipants": 10
    }
}
```

### Get inscriptions

- `GET /inscriptions/:competitionId`
- Description: Get all inscriptions for a competition
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscriptions retrieved successfully",
    "data": [
        {
            "_id": "string",
            "athleteId": "melvyn",
            "athleteName": "Melvyn Claes",
            "event": "Saut en longueur",
            "record": "7m17"
        },
        ...
    ]
}
```

### Get inscription by id

- `GET /inscriptions/:competitionId/:inscriptionId?userId=userId`  (Optional query parameter)
- Description: Get inscription by id
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscription retrieved successfully",
    "data": {
        "_id": "string",
        "_rev": "string", // if userId is provided and the user is the owner of the inscription
        "athleteId": "melvyn",
        "athleteName": "Melvyn Claes",
        "event": "Saut en longueur",
        "record": "7m17"
    }
}
```

### Create inscription

- `POST /inscriptions/:competitionId`
- Description: Create inscription
- Request body:
```json
{
    "userId": "string",
    "athleteId": "string",
    "athleteName": "string",
    "event": "string",
    "record": "string"          // Optional
}
```
- Response: HTTP 201
```json
{
    "status": "success",
    "message": "Inscription created successfully"
}
```

### Update inscription

- `PUT /inscriptions/:competitionId/:inscriptionId`
- Description: Update inscription
- Request body:
```json
{
    some data
}
```
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscription updated successfully"
}
```

### Delete inscription

- `DELETE /inscriptions/:competitionId/:inscriptionId`
- Description: Delete inscription
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscription deleted successfully"
}
```

## Admin API

### Create inscription

- `POST /inscriptions/:competitionId?admin=adminId`
- Description: Create inscription as admin
- Request body:
```json
{
    "athleteId": "string",
    "athleteName": "string",
    "event": "string",
    "record": "string"          // Optional
}
```
- Response: HTTP 201
```json
{
    "status": "success",
    "message": "Inscription created successfully"
}
```

### Update inscription

- `PUT /inscriptions/:competitionId/:inscriptionId?admin=adminId`
- Description: Update inscription as admin
- Request body:
```json
{
    "athleteId": "string",
    "athleteName": "string",
    "event": "string",
    "record": "string"          // Optional
}
```
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscription updated successfully"
}
```

### Delete inscription

- `DELETE /inscriptions/:competitionId/:inscriptionId?admin=adminId`
- Description: Delete inscription as admin
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscription deleted successfully"
}
```




