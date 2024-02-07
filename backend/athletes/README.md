# Athletes service

## Table of contents

- [TODO](#todo)
- [Description](#description)
- [API](#api)
  - [Get athletes](#get-athletes)
  - [Get athlete by id](#get-athlete-by-id)
  - [Get athlete"s results](#get-athletes-results)
- [Testing](#testing)


## TODO

- Check categories for [Get athletes by id](#get-athletes-by-id)

## Description

This service is responsible for managing athletes. It will use beathletics api for retrieving athletes data.

## API

### Get athletes

- `GET /api/athletes?key=string`
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

- `GET /api/athletes/:id`
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
        "category": "SEN M", 
        "club": "USTA"
    }
}
```

### Get athlete"s results

- `GET /athletes/:id/:event?maxYears=number`
- Description: Get athlete"s personal bests by event
- Query parameters:
  - `maxYears`: number of years to retrieve personal bests (Optional)
- Response: HTTP 200
```json
{
    "status": "success",
    "message": "Athlete's personal bests retrieved successfully",
    "data": {
        "discipline":"Saut en longueur",
        "date":"2024-01-27T10:00:00.000Z",
        "perf":"7.17",
        "type":"distance" // "time", "distance", "points"
    }
}
```

```json
{
    "status":"success",
    "message":"Results retrieved successfully",
    "data":{
        "discipline":"60 mètres",
        "date":"2022-03-04T00:00:00.000Z",
        "perf":"7400", // milliseconds => 7.40s
        "type":"time"
    }
}
```

## Testing

Some curl examples for testing the API:

### Get athletes

```bash
curl -X GET "http://localhost/api/athletes?key=Melvyn"
```

### Get athlete by id

```bash
curl -X GET "http://localhost/api/athletes/212092339195"
```

### Get athlete"s results

```bash
curl -X GET "http://localhost/api/athletes/212092339195/60%20mètres"
```

