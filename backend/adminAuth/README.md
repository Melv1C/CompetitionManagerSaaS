# Admin Authentification Service

## Description

This service is responsible for managing admin account and authentication.

## Technologies

- Node.js (Express)
- MongoDB (Mongoose)

## API

### Get status of connection

- `GET /adminAuth`
- Description: Get the satuts of connection of the user
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Logged in"/"Not logged in",
    "email": "string",                      //(null if not logged in)
    "club": "string"                        //(null if not logged in)
}
```

### Post create admin account

- `GET /adminAuth/createAccount`
- Description: Create an admin account (need an already created admin account to be able to create another one)
- Request: HTTP 200
```json
{
    "email": "string",
    "password": "string",
    "club": "string"        //(if the user as not all acces the club will be the same as the one of the user creating the account)
}
```

- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Account created successfully",
}
```

### Login

- `Post /adminAuth/login`
- Description: Get categories by id
- Request: HTTP 200
```json
{
    "email": "string",
    "password": "string"
}
```
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Logged in successfully",
}
```

### Logout
- `Post /adminAuth/logout`
- Description: Set the status of the user to not logged in
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Logged out successfully",
}
```

### Create competitions
- `Post /adminAuth/competitions`
- Description: Check if the user has the right to create competitions if yes create the competition using competitions service
- Request: HTTP 200
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
}
```


