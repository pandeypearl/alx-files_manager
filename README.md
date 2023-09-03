# alx-files_manager
This project is a summary of this back-end trimester: authentication, NodeJS, MongoDB, Redis, pagination and background processing.

The objective is to build a simple platform to upload and view files:

+ User authentication via a token
+ List all files
+ Upload a new file
+ Change permission of a file
+ View a file
+ Generate thumbnails for images

## Applications
+ Node.js
+ npm

## Dependencies
+ babel
+ redis
+ mongodb
+ crypto
+ bull
+ uuid
+ express
+ mime-type

## Environment Variables
| Name | Default | Description |
| ---  |:--------|:------------|
| PORT | <code>5000</code>    | The port the server should listen to |
| DB_HOST | <code>localhost</code> | The database host |
| DB_PORT | <code>27017</code> | The database port |
| DB_DATABASE | <code>files_manager</code> | The database name |
| FOLDER_PATH | <code>/tmp/files_manager</code> (Linux, Mac OS X) & <code>%TEMP%/files_manager</code> (Windows)) | The local folder where files are saved |


## Files
| File | Folder | Description | 
|------|:-------|:------------|
| [redis.js](utils/redis.js) | utils | Redis client utility that connects to redis |
| [db.js](utils/db.js) | utils | mongodb client utility that connects to MongoDB |
| [server.js](server.js) | N/A | Express Server |
| [index.js](routes/index.js) | routes | Contains the endpoints of the API | 
| [AppController.js](controllers/AppController.js) | controllers | Redis and MongoDB status check & collections count |
| [UsersController.js](controllers/UsersController.js) | controllers | Defines handler for users routes |
| [AuthController.js](controllers/AuthController.js) | controllers | User Authentication | 
| [FilesController.js](controllers/FilesController.js) | controllers | Defines handlers for files routes | 
| [worker.js](worker.js) | N/A | Processes UserQue and FileQue. Creates Thumbnails |
| [hash.js](utils/hash.js) | utils | Creates hash for password |
| [transform.js](utils/transform.js) | utils | Transforms data from database in presentable outputs |

## Tests

| File | Folder | Description |
|------|:-------|:------------|
| [redis.test.js](tests/redis.test.js) | tests | Unit tests for redis client |
| [db.test.js](tests/db.test.js) | tests | Unit tests for db client |
| [init.test.js](tests/init.test.js) | tests | Global descriptions for chai testing functions |
| [AppController.test.js](tests/AppController.test.js) | tests | Unit tests for endpoints: <code>GET /status</code> , <code>GET /stats</code> |
| [UsersController.test.js](tests/UsersController.test.js) | tests | Unit tests for endpoints: <code>POST /users</code> ,  <code>GET /users/me</code> |
| [AuthController.test.js](tests/AuthController.test.js) | tests | Unit tests for endpoints: <code>GET /connect</code> , <code>GET /disconnect</code> |
| [FilesController.test.js](tests/FilesController.test.js) | tests | Unit tests for endpoints: <code>POST /files</code> , <code>GET /files/:id</code> , <code>GET /files</code> , <code>PUT /files/:id/publish</code> , <code>PUT /files/:id/unpublish</code> , <code>GET /files/:id/data</code> |

Test using  <code>npm run test</code> to execute the E2E tests.

## Installation
1. Clone this repository and switch to the repository's  directory.
2. Install dependency packages using <code>npm install</code>

## Usage
Start Redis and MongoDB services on your system. Use <code> npm start-server</code> or <code>npm run start-server</code> to start the application.

