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
    "id": "competitionId",
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

### Get inscriptions

- `GET /inscriptions/:competitionId`
- Description: Get all inscriptions for a competition
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscriptions retrieved successfully",
    "data": [
        inscription1,
        inscription2,
        ...
    ]
}
```

### Get inscription by id

- `GET /inscriptions/:competitionId/:inscriptionId`
- Description: Get inscription by id
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscription retrieved successfully",
    "data": inscription
}
```

### Create inscription

- `POST /inscriptions/:competitionId`
- Description: Create inscription
- Request body:
```json
{
    some data
}
```
- Response: HTTP 201
```json
{
    "status": "success",
    "message": "Inscription created successfully",
    "data": inscription
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
    "message": "Inscription updated successfully",
    "data": inscription
}
```

### Delete inscription

- `DELETE /inscriptions/:competitionId/:inscriptionId`
- Description: Delete inscription
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscription deleted successfully",
    "data": null
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

