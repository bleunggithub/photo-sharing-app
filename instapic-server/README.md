# InstaPic (Server)

#### Table of Content

[Installation](#installation) | [How to run](#how-to-run) | [Environment Variables](#environment-variables) | [About the REST API](#about-the-rest-api) | [JWT Refresh Token](#jwt-refresh-token) | [Tests](#tests)

#### Installation

- Clone the repo

#### How to run

###### SERVER

- type `cd instapic-server` into the server directory and run `npm install` to install the dependencies
- to start the server, run `node server` or `nodemon server` if you have nodemon installed globalling on your computer
- the server will be running on port 8080

###### DATABASE

- install [PostgresQL](https://www.postgresql.org/)
- after installation of all the dependencies, run `knex migrate:latest`

#### Environment Variables

- create a .env file and add the following environment variables with your own value
  - NODE_ENV=
  - PG_DATABASE=
  - PG_USERNAME=
  - PG_PASSWORD=
  - PG_TEST_DATABASE=
  - JWT_TOKEN_SECRET=
  - JWT_REFRESH_TOKEN_SECRET=
  - CLOUDINARY_URL=
  - CLIENT_DOMAIN=

#### About the REST API

- [x] Node.js, Express.js and PostgresQL are used to created this API
- [x] Users can register by username, password
- [x] Logged In users can submit post that includes an image and short text description (varchar 300)
- [x] Logged In users can get a list of uploaded posts
- [x] Validation and error handling
- [x] Automated tests
- [x] Can sort all posts by time created, or filter posts by a specific user.
- [x] Pagination
- [x] Performance optimization - asynchronous coding, query optimisation, client-side rendering

#### JWT Refresh Token

- Instead of using an access token that will not expire and store it in the localStorage of the browser or using cookies and sessions, a (longer-term) refresh token together with an (shorter-term) access token is used to avoid CSRF (Cross Site Request Forgery) & XSS (Cross-site Scripting) attacks.

###### When the app is first loaded

1.  When the app first loads on the browser(client), it sends a GET request to the server with the httpOnly cookie (RT, refresh token, expires in 7 days), if any.
2.  Server checks if the httpOnly cookie is valid and check if it is the same version as the one in the database.
    - If the RT is valid, then an access token (AT, expires in 15 mins) and a renewed RT will be issued (namely, the period the user will stay logged in is extended)
      - AT & RT will be sent back to the client. The user will be redirected to the private area of the app
    - if the RT is not valid / no RT is sent from the client, the user will be required to log in

###### When the user makes a GET / POST request to the backend

1. When the user makes a GET / POST request to the backend while navigating in the private area of the app, the RT (as httpOnly Cookie) and the AT (in the header) are sent alongside the data.
2. For all private routes, the AT are verified before the requests are being processed.
   - If the AT is still valid, the request will be processed
   - If the AT has expired, the RT will be checked.
     - If the RT is valid, a new AT will be issued and sent back to the client with the requested data
     - If the RT is not valid, a 401 status will be sent & when such is received by the client, the user context will be cleared, the browser will be reloaded and the user will be logged out

###### Log out

- When the user clicks log out from the browser, a request is sent to the server to clear the httpOnly cookie (as httpOnly cookies is not accessible with javaScript but is cleared on server side)

#### Tests

- knex seed files are created for testing purpose
- Create a test database and fill the name in the environment variable ("PG_TEST_DATABASE")
- Change the environment variable ("NODE_ENV") to `test`
- To run tests, use `npm run test`
- Test cases (unit tests of services)
  - POST '/users/login'
    - login
      - [x] sends a 400 if there is an error
      - [x] sends a 400 with error message to user when no username/password is entered
      - [x] sends a 400 and message when username entered is not found in the DB
      - [x] sends a 400 and message when password entered is not correct
      - [x] sends a 200 & AT & renewed RT to user when successfully logged in
  - POST '/users/register'
    - register
      - [x] sends a 400 if there is an error
      - [x] sends a 400 with error message to user when no username/password is entered
      - [x] sends a 400 with error message to user when username/password entered is shorter than 4 ch
      - [x] sends a 400 with error message to user when username entered is registered
      - [x] sends a 200 & AT to user when successfully registered
  - GET '/users/refresh_token'
    - refreshToken
      - [x] sends a 204 to user if no access token present
      - [x] sends a 401 to user if both RT has expired
      - [x] sends a 401 to user if the RT version is not the same as recorded in DB
      - [x] sends a 200 & AT & renewed RT to user if the RT version is the same as recorded in DB
  - GET '/users/logout'
    - logout
      - [x] clears cookie when log out
  - GET '/api/posts'
    - getPostsFromDB
      - [x] sends a 400 if there is an error
      - [x] sends a 200 with the posts from the db + accessToken back to user
      - [x] sends a 200 with the posts from the db back to user(no accessToken)
  - GET '/api/search'
    - search
      - [x] sends a 400 if there is an error
      - [x] sends a 200 with the posts from the db + accessToken back to user
      - [x] sends a 200 with a message + accessToken back to user when no result is found
      - [x] sends a 200 with the posts from the db back to user(no accessToken)
      - [x] sends a 200 with a message back to user even when no result is found + no AT issued
  - POST '/api/upload'
    - uploadImg
      - [x] sends a 400 if upload error
      - [x] should write into the database if no error
      - [x] sends a 400 if database error
  - Middleware
    - isAuth
      - [x] sends a 401 with a message to user if no access token present
      - [x] sends a 401 with a message to user if the authorization header is only one string
      - [x] sends a 401 to user if both tokens have expired
      - [x] sends a 401 to user if the AT is not valid, but the RT is valid & the token version is not the same as the one recorded in database
      - [x] the req object will contain a "userId" key-value pair if the AT is valid
      - [x] the req object will contain a "userId" & "accessToken" if the AT is invalid but the RT is valid
