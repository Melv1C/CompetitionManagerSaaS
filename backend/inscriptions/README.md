# Inscriptions service

## Description

This service is responsible for managing inscriptions.

## API

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

### Get inscription by user

- `GET /inscriptions/user/:userId`
- Description: Get inscription by user
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscription retrieved successfully",
    "data": inscription
}
```

