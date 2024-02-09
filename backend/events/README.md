# Events Service

## Description

This service is responsible for managing events.

## Technologies

- Node.js (Express)
- MongoDB (Mongoose)

## API

### Get events

- `GET /api/events`
- Description: Get all events
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Events retrieved successfully",
    "data": [
        {
            "id": "string",
            "name": "string",
            "grouping": "string"
        },
        ...
    ]
}
```

### Get event by id

- `GET /api/events/:id`
- Description: Get event's data by id
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Event retrieved successfully",
    "data": {
        "id": "string",
        "name": "string",
        "grouping": "string",
        "validCat": [
            {
                "id": "string",
                "name": "string",
                "abbr": "string"
            }
        ]
    }
}
```

### Get categories by id

- `GET /api/categories/:id`
- Description: Get categories by id
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Category retrieved successfully",
    "data": {
        "id": "string",
        "name": "string",
        "abbr": "string",
        ...
    }
}
```



