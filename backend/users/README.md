# Users service

## Description

This service is responsible for managing users and their authentication. This service will use firebase for authentication.

## API

### Create a new user
- `POST /users`
- Description: Create a new user into firebase
- Request body:
```json
{
    "email": "string",
    "password": "string"
}
```
- Response: HTTP 201 Created
```json
{
    "status": "success",
    "message": "User created successfully",
    "data": {
        "id": "string",
        "email": "string"
    }
}
```

### Login
- `POST /users/login`
- Description: Login into firebase
- Request body:
```json
{
    "email": "string",
    "password": "string"
}
```
- Response: HTTP 200 OK
```json
{
    "status": "success",
    "message": "User logged in successfully",
    "data": {
        "id": "string",
        "email": "string"
    }
}
```

### Get user by id
- `GET /users/:id`
- Description: Get user's data by id
- Response: HTTP 200 OK
```json
{
    "status": "success",
    "message": "User retrieved successfully",
    "data": {
        "id": "string",
        "email": "string",
        // ...
    }
}
```