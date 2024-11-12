# users-api

## Build
in the root directory of the whole project run the following command
./build-apps.sh user-api (file need to be in lf)


## .env
- `PORT` : Port to run the service (default 3000)
- `PREFIX` : Prefix for the api routes (default /api)
- `ACCESS_TOKEN_SECRET` : Secret use to generate the access token
- `REFRESH_TOKEN_SECRET` : Secret use to generate the refresh token

See also [Template](.env.template)

## Routes
### GET /refresh-token
use the refresh token to get a new access token and refresh token

#### Cookie
- `refreshToken` : string

#### Response
if the refresh token is invalid
Status 401
{
    message: "Invalid refresh token"
}
else
Status 200 (accessToken)
and coockie 
{
    refreshToken: string;
}

### POST /register
Create a new user

#### Body
- `email` : string (unique)(email format)
- `password` : string (min 8)

#### Response
- Base case :
Status 200
```
{
    accessToken: string;
}
```
and coockie 
```
{
    refreshToken: string;
}
```
- email already exist
Status 409 
```
{
    message: "Email already in use"
}
```

else

### POST /login
Login a user

#### Body
- `email` : string
- `password` : string
#### Response
- base case :
```
Status 200
{
    accessToken: string;
} 
```
and coockie 
```
{
    refreshToken: string;
}
```
- email not found
flemme de le mettre maintenant vu que tu l'as changé
...

### POST /logout
Logout the user

#### Response
- Base case :
Status 200
```
coockie 
{
    clear refreshToken
}
```
