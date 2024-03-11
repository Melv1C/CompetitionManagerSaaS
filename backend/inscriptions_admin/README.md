# Inscriptions admin service

## Description

This service is responsible for managing the admin actions for the inscriptions database.

## Authors

- Claes Melvyn

## Technologies

- Node.js (Express)
- CouchDB (nano)

## Environment variables

- `PORT`: Port number for the server (Default: 3000)
- `PREFIX`: Prefix for the service (Default: /api/admin/inscriptions)
- `COUCHDB_URL`: URL of the CouchDB server
- `GATEWAY_URL`: URL of the gateway service
- `COMPETITIONS_URL`: URL of the competitions service (if no gateway url is provided)

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
docker run -d -e PORT='3000' -e COUCHDB_URL='http://xxxx:xxxx@competitionmanager.be:4003' -e GATEWAY_URL='https://competitionmanager.be/' -p 80:3000 --name inscriptions_admin-service claesweb/cm-inscriptions_admin
```

## API

### New competition

- `POST /api/admin/inscriptions?adminId=string`
- Description: Create a new database to store the inscriptions for a competition
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

- `DELETE /api/admin/inscriptions/:competitionId?adminId=string`
- Description: Delete a competition
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Competition deleted successfully"
}
```

### Update event

- `PUT /api/admin/inscriptions/:competitionId/event?adminId=string`
- Description: Update the name of a event for all inscriptions of a competition
- Request body:
```json
{
    "oldEventName": "string",
    "newEventName": "string",
    "isMulti": "boolean"
}
```
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Event name updated successfully"
}
```



