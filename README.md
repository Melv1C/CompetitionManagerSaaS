# Competition ManagerSaaS

!!! Not up to date

## Introduction

This is a SaaS application for managing athletic competitions.

## Authors

- Claes Melvyn
- Claes Riwan

## Architecture

The application is built using a microservice architecture. Each service is a separate project with its own database. The services communicate with each other using RESTful APIs.

we divide the project into 3 main parts:
- Frontend (the user interface)
- Backend

### Frontend

...

### Backend

The backend is composed of several services. Here you can find the list of services and their documentation.

- [Athletes](backend/athletes/README.md)
- [Competitions](backend/competitions/README.md)
- [Inscriptions](backend/inscriptions/README.md)
- [Stripe](backend/stripe/README.md)
- ...


## Dockerization

The application is dockerized. You can build the images using the [build.sh](build.sh) script.

```bash	
./build.sh $SERVICE_NAME $DOCKER_ID
```





