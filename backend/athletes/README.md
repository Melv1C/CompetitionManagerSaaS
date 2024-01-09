# Athletes service

## Description

This service is responsible for managing athletes. It will use beathletics api for retrieving athletes data.

## API

### Get athletes

- `GET /athletes?key=string`
- Description: Get athletes by key (first name, last name or bib)
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Athletes retrieved successfully",
    "data": [
        {
            "id": "212092339195",
            "bib": 1090,
            "firstName": "Melvyn",
            "lastName": "Claes",
            "birthDate": "2001-10-21T00:00:00.000Z",
            "gender": "Male",
            "category": "SEN M",
            "club": "USTA"
        },
        ...
    ]
}
```

### Get athlete by id

- `GET /athletes/:id`
- Description: Get athlete"s data by id
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Athlete retrieved successfully",
    "data": {
        "id": "212092339195",
        "bib": 1090,
        "firstName": "Melvyn",
        "lastName": "Claes",
        "birthDate": "2001-10-21T00:00:00.000Z",
        "gender": "Male",
        "category": null, // TODO: function to calculate category from birthDate
        "club": "USTA"
    }
}
```

### Get athlete"s results (TODO)

- `GET /athletes/:id/:event`
- Description: Get athlete"s personal bests by event
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Athlete"s personal bests retrieved successfully",
    "data": {
        ...
    }
}
```
