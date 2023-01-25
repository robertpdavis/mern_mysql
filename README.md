# mern_mysql

## Description
MERN stack using MySQL database, Apollo Server/GraphQL for API management with pages, forms and table components.
The MERN stack has been configured with the following:
### Client Side
* React Web App - with typescript support
* Normalise and Bootstap for styling
* Apollo client and GraphQL for API management
* JWT Decode for token authentication
* Error Boundaries at page and app level with default functions for custom error handling
* React Table for tables
* Form and table pages with client side form validation
* Several queries and mutations set up
* Pages - Home, Login, Signup, Profile, User and Users
* Components - Header, Footer, Forms, Table, Alert (shows alert bar at top of screen), Modal (for showing messgages with customized response buttons) and Button tool bar.

### Server Side
* Node / Expess server
* WIth Apollo Server and GraphQL for API management
* MySQL database support with Sequalize as ORM (User model configured)
* Jsonwebtoken for token authentication
* Bcrypt for password encryption

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [Licence](#Licence)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation

Several scripts are set up in the root package.json to manage distribution build and running the app as follows:
* start: node server/server.js,
* develop: concurrently \cd server && npm run watch\ \cd client && npm start\,
* install: cd server && npm i && cd ../client && npm i,
* seed: cd server && npm run seed,
* build: cd client && npm run build

Running install will install all the required client and server dependancies. This is a React web app.

The seeding data has been set up to create several users to start off with.

Note: Four env vars are required to hold secret for token authentication and sql database
* JWT_SECRET
* DB_NAME
* DB_PASSWORD
* DB_USER

### File structure of the application:
```md
.
├── client/public          // contains public standard folders and files with default base html page
├── client/src             // contains src standard folders and files with the addition of React pages and components folders
├── client/src/utils       // contains the Auth for JWT Decode and Apollo/graphQL queries and mutations and a helper for form validation
├── server/config & db     // MySQL config and schema
├── server/models          // Sequalise database models
├── server/schemas         // API typedefs and resolvers
├── server/utils           // contains the Auth for JWT and helper for server side form validation
├── server/seeders         // contains seed files to get started
├── .gitignore             // indicates which folders and files Git should ignore 
├── LICENCE                // licence file      
```
Note: The root, client and server folders each have seperate package.json files that setup required app and dev dependencies.

## Usage

* Root route presents a login page. Signing in with one of the seed users will then route to the Home page.
* Clicking on the Users in the Nav bar will route to a users page showing a table of users and option to select a user and tool bar buttons to show details or delete user.
* User page with form and option to update and save.
* Profile page (accessed by person icon in header) with form and option to update and also change password

## Credits
Rob Davis Github: [robertpdavis](https://github.com/robertpdavis)

## Licence
MIT License

## Contributing
Please contact me at: robertpdavis@optusnet.com.au

## Tests
No tests are currently included.

## Questions
* Github: [robertpdavis](https://github.com/robertpdavis)
* Email: robertpdavis@optusnet.com.au

## Screenshots
![Webpage screenshot](https://github.com/robertpdavis/mern_mysql/blob/main/screenshots/login.png "Screenshot of Login page")
![Webpage screenshot](https://github.com/robertpdavis/mern_mysql/blob/main/screenshots/profile.png "Screenshot of Profile page")
![Webpage screenshot](https://github.com/robertpdavis/mern_mysql/blob/main/screenshots/users.png "Screenshot of Users page")
![Webpage screenshot](https://github.com/robertpdavis/mern_mysql/blob/main/screenshots/user.png "Screenshot of User page")
![Webpage screenshot](https://github.com/robertpdavis/mern_mysql/blob/main/screenshots/alertbar.png "Screenshot of page with alert bar")
![Webpage screenshot](https://github.com/robertpdavis/mern_mysql/blob/main/screenshots/modal.png "Screenshot of page with modal message")