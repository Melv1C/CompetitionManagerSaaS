# Inscriptions service

## Description

This service is responsible for managing inscriptions.

## Authors

- Claes Melvyn

## Technologies

- Node.js (Express)
- CouchDB (nano)

## Environment variables

- `PORT`: Port number for the server (Default: 3000)
- `COUCHDB_URL`: URL of the CouchDB server
- `COMPETITIONS_URL`: URL of the competitions service
- `ATHLETES_URL`: URL of the athletes service
- `STRIPE_URL`: URL of the stripe service

## Dockerization

The service is dockerized. You can build the image using the [build.sh](build.sh) script.

```bash
./build.sh $DOCKER_ID
```

To run the container:

```bash
docker run -d -e PORT='$PORT' -e COUCHDB_URL='$COUCHDB_URL' -e COMPETITIONS_URL='$COMPETITIONS_URL' -e ATHLETES_URL='$ATHLETES_URL' -e STRIPE_URL='$STRIPE_URL' -p $HOST_PORT:$PORT --name $CONTAINER_NAME $IMAGE_NAME
```

Example:

```bash
docker run -d -e PORT='3000' -e COUCHDB_URL='http://xxxx:xxxx@competitionmanager.be:4003' -e COMPETITIONS_URL='https://competitionmanager.be/' -e ATHLETES_URL='https://competitionmanager.be/' -e STRIPE_URL='https://competitionmanager.be/' -p 80:3000 --name inscriptions-service claesweb/cm-inscriptions
```

## API for the Frontend

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
            "bib": "1090",
            "club": "USTA",
            "event": "Saut en longueur",
            "record": "7.17"
        },
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
    "data": {
        "_id": "string",
        "athleteId": "melvyn",
        "athleteName": "Melvyn Claes",
        "bib": "1090",
        "club": "USTA",
        "event": "Saut en longueur",
        "record": "7.17"
    }
}
```

### Create inscription

- `POST /inscriptions/:competitionId`
- Description: Create inscriptions
- Request body:
```json
{
    "userId": "string",
    "athleteId": "string",
    "events": ["string"],
    "records": {
        "event1": "string",
    }
}
```
- Response: HTTP 201
```json
{
    "status": "success",
    "message": "Inscriptions created successfully"
}
```

### Update inscription

- `PUT /inscriptions/:competitionId/:athleteId`
- Description: Update inscriptions
- Request body:
```json
{
    "userId": "string",
    "events": ["string"],
    "records": {
        "event1": "string",
    }
}
```
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscriptions updated successfully"
}
```

### Delete inscription

- `DELETE /inscriptions/:competitionId/:athleteId`
- Description: Delete all inscriptions of an athlete
- Request body:
```json
{
    "userId": "string"
}
```
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Inscription deleted successfully"
}
```

## API for Competitions service

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

## API for Admin Panel



