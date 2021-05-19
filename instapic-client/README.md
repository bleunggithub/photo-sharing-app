# InstaPic (Client)

#### Table of Content

[Installation](#installation) | [How to run](#how-to-run) | [Environment Variables](#environment-variables) | [About the App](#about-the-app) | [Tests](#tests)

#### Installation

- Clone the repo

#### How to run

- type `cd instapic-client` into the front end directory and run `yarn` to install the dependencies
- to start, run `yarn start`
- the app should pop up on your browser, or if it hasn't, go to `http://localhost:3000/`

#### Environment Variables

- create a .env file and add the following environment variables with your own value
  REACT_APP_API_SERVER=
  REACT_APP_CLOUDINARY_ACC_NAME=

#### About the REST API

- [x] Implement frontend
- [x] Logged In users can submit post that includes an image and short text description
- [x] Validation and error handling
- [x] Automated tests
- [x] Logged In users can view all posts
- [x] Posts sorted by time
- [x] Logged In users can view posts from a specific user (search function)
- [x] Pagination
- [x] Performance optimization (use of hooks, lazy loading, etc.)
- [ ] Integrate with Redux and React Router (since the app only has 1 global state (user), useContext hooks is used instead of Redux)

#### Tests

- To run tests, use `yarn test`

###### Test cases

- Routes

  - App
    - [x] displays Loading when app first loads
    - [x] renders login form when data is returned from server (unauthenticated)
    - [x] renders "discover" when data is returned from server (authenticated)
  - Routes & PrivateRoutes
    - [x] renders `<Login />` when component mounts ("/") (unauthenticated)
    - [x] renders `<Login />` when navigated to "/discover" (unauthenticated)
    - [x] renders `<Login />` when navigated to "/share" (unauthenticated)
    - [x] renders `<Login />` when navigated to "/search" (unauthenticated)
    - [x] renders `<Discover />` when component mounts ("/") (authenticated)
  - Router

    - Login & log out redirect
      - [x] logs user in and redirect to "/discover", logs user out and redirect to "/"
    - Layout (menu)
      - [x] all private routes should show the menu
      - [x] navigate to "/search" when search link is clicked
      - [x] navigate to "/discover" when ascending link is clicked
      - [x] navigate to "/discover" when descending link is clicked
      - [x] navigate to "/share" when share link is clicked
    - Login
      - [x] renders without crashing
      - [x] does not render `<Layout />`
      - [x] switches content when 'switch form' link is clicked
      - [x] sends an POST request when submit button is clicked
      - [x] shows error message when there is any
    - Discover
      - [x] renders children without crashing
      - [x] sends get request when Load More button is clicked
      - [x] when scrolled to bottom, renders "no more posts" text when it's the last page
    - Search
      - [x] renders children without crashing
      - [x] sends GET requests when typed, does not render pagination if the results can fit in 1 page
      - [x] displays pictures when data returns from db
      - [x] displays pagination if the results returned are greater than 1 page
    - Share
      - [x] renders children without crashing
      - [x] accepts file on drop
    - PicGrid
      - [x] renders "No posts to show. :(" text when props.status === "NO RESULTS"
      - [x] shows text div when hovered
