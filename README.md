# RamTodo

built with `Express` and `Mongoose`

## Usage
Make sure you have Node.js and npm installed in your computer and then run these commands:
```console
$ npm install
$ npm start
```
For development purpose, you can run:
```console
$ npm install
$ npm run dev
```
Make sure you have set all required your .env parameters
<br>(key reference: .env.example)

Access the REST API via SERVER_URL = `http://localhost:3000/`

## REST API Routes:

### AUTHENTICATION

- **Register**
  - URL:
    - **`POST`** *`<SERVER_URL>/register`*
  - Body:
    - `name`: `String`, required
    - `email`: `String`, required
    - `password`: `String`, required
  - Expected response (status: `201`):
    ```json
      {
        "message": "account registered",
        "newUser":
        {
          "_id": "<generatedId>",
          "name": "<registeredName>",
          "email": "<registeredEmail>",
          "password": "<hashedPassword>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<detailedErrors>"
      }
      ```
      Notes:
      - ERROR `400` is caused by entering *empty name* or *empty email* or *duplicated email* or *email not valid format* or *empty password*

- **Login**
  - URL:
    - **`POST`** *`<SERVER_URL>/login`*
  - Body:
    - `email`: `String`, required
    - `password`: `String`, required
  - Expected response (status: `200`):
    ```json
      {
        "message": "login success",
        "token": "<accessToken>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "invalid username / password"
      }
      ```
      Notes:
      - ERROR `400` is caused by entering *empty email* or *empty password* or *invalid email / password*

- **Google Login**
  - URL:
    - **`POST`** *`<SERVER_URL>/oauth/google/login`*
  - Expected response (status: `200`):
    ```json
      {
        "message": "login success",
        "token": "<accessToken>"
      }
    ```
  - Error responses:
    - status: `404`:
      ```json
      {
        "message": "new account, then set password",
        "register_token": "<registeredToken>"
      }
      ```
      Notes:
      - ERROR `404` is caused by not registered yet on database of user

- **Google Register**
  - URL:
    - **`POST`** *`<SERVER_URL>/oauth/google/register`*
  - Header(s):
    - `register_token`: `String`
  - Expected response (status: `200`):
    ```json
      {
        "message": "login success",
        "token": "<accessToken>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<errorMessage>",
      }
      ```
      Notes:
      - ERROR `400` is caused by *invalid register_token* or *no token assigned*


### TODOS

- **GET LIST OF TODOS**
  - URL:
    - **`GET`** *`<SERVER_URL>/todos`*
  - URL (filtered):
    - **`GET`** *`<SERVER_URL>/todos?search=<KEYWORD>`*
  - Header(s):
    - `token`: `String`
  - Expected response (status: `200`):
    ```json
      {
        "message": "data found",
        "todos": [
          {
            "_id": "<id>",
            "name": "<name>",
            "description": "<description>",
            "status": "<status>",
            "dueDate": "<dueDate>",
            "created": "<createdAt>",
            "updated": "<updatedAt>",
            "creator": "<userObjectId-populated>"
          }, 
          {
            ...
          }, 
          ...
        ]
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
        {
          "message": "<authentication message>",
        }
      ```
      Notes:
      <br>Messages:
      - no token assigned
      - not allowed to access
      - not recognized input data

    - status: `404`:
      ```json
        {
          "message": "data empty",
        }
      ```
- **GET LIST OF AUTH USER'S TODOS**
  - URL:
    - **`GET`** *`<SERVER_URL>/user/todos`*
  - URL (filtered):
    - **`GET`** *`<SERVER_URL>/user/todos?search=<KEYWORD>`*
  - Header(s):
    - `token`: `String`
  - Expected response (status: `200`):
    ```json
      {
        "message": "data found",
        "todos": [
          {
            "_id": "<id>",
            "name": "<name>",
            "description": "<description>",
            "status": "<status>",
            "dueDate": "<dueDate>",
            "created": "<createdAt>",
            "updated": "<updatedAt>",
            "creator": "<userObjectId-populated>"
          }, 
          {
            ...
          }, 
          ...
        ]
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
        {
          "message": "<authentication message>",
        }
      ```
      Notes:
      <br>Messages:
      - no token assigned
      - not allowed to access
      - not recognized input data

    - status: `404`:
      ```json
        {
          "message": "data empty",
        }
      ```
  
- **CREATE NEW TODO**
  - URL:
    - **`POST`** *`<SERVER_URL>/todos`*
  - Header(s):
    - `token`: `String`
  - Body:
    - `name`: `String`, required
    - `description`: `String`
    - `dueDate`: `Date (yyyy-mm-dd)`,

  - Expected response (status: `201`):
    ```json
      {
        "message": "data created",
        "newTodo":
        {
          "_id": "<id>",
          "name": "<name>",
          "description": "<description>",
          "status": "<status>",
          "dueDate": "<dueDate>",
          "created": "<createdAt>",
          "updated": "<updatedAt>",
          "creator": "<userObjectId-populated>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<authentication message>",
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is caused by entering *empty title* or *empty dueDate*
    
- **GET TODO BY ID**
  - URL:
    - **`GET`** *`<SERVER_URL>/todos/:id`*
  - Header(s):
    - `token`: `String`
  - Expected response (status: `200`):
    ```json
      {
        "message": "data found",
        "todo": 
        {
          "_id": "<id>",
          "name": "<name>",
          "description": "<description>",
          "status": "<status>",
          "dueDate": "<dueDate>",
          "created": "<createdAt>",
          "updated": "<updatedAt>",
          "creator": "<userObjectId-populated>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<authentication message>",
        "err": "<detailedErrors>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
    - status: `404`:
      ```json
        {
          "message": "data not found",
        }
      ```

- **UPDATE USER BY ID**
  - Notes:
    - Authorization: only authenticated user's todo can be accessed
  - URL(s):
    - **`PUT`** *`<SERVER_URL>/todos/:id`*
    - **`PATCH`** *`<SERVER_URL>/todos/:id`*
    <br>Notes:
        - `PUT` method is used for updating all details of data
        - `PATCH` method is used for updating some details of data
  - Header(s):
    - `token`: `String`
  - Body:
    - `title`: `String`, required
    - `description`: `String`
    - `dueDate`: `Date (yyyy-mm-dd)`
  - Expected response (status: `201`):
    ```json
      {
        "message": "data updated",
        "updatedTodo":
        {
          "_id": "<id>",
          "name": "<name>",
          "description": "<description>",
          "status": "<status>",
          "dueDate": "<dueDate>",
          "created": "<createdAt>",
          "updated": "<updatedAt>",
          "creator": "<userObjectId-populated>"
        },
        "info": "<info-optional>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<authentication message>",
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
    - status: `401`:
      ```json
      {
        "message": "unauthorized to access",
      }
      ```
    - status: `404`:
      ```json
        {
          "message": "data not found",
        }
      ```

- **DELETE USER BY ID**
  - Notes:
    - Authorization: only authenticated user's todo can be accessed
  - URL(s):
    - **`DELETE`** *`<SERVER_URL>/todos/:id`*
  - Header(s):
    - `token`: `String`
  - Expected response (status: `200`):
    ```json
      {
        "message": "data deleted",
        "deletedTodo":
        {
          "_id": "<id>",
          "name": "<name>",
          "description": "<description>",
          "status": "<status>",
          "dueDate": "<dueDate>",
          "created": "<createdAt>",
          "updated": "<updatedAt>",
          "creator": "<userObjectId-populated>"
        },
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<authentication message>",
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
    - status: `401`:
      ```json
      {
        "message": "unauthorized to access",
      }
      ```
    - status: `404`:
      ```json
        {
          "message": "data not found",
        }
      ```
