# ExpressCRUD

This project is for learning Express and mongoDB. I made a todo app with a super basic authentication method, only in api without any UI, it will serve as local host.

## How to install!

In this project I used node v12.21.0 MongoDB v4.4.8.

1. Install the required application, nodejs, yarn, mongodb.
1. Download this file and install using `yarn`.
1. Run the application using `yarn start`.

## How it works?

Use postman to play with the api.

- `todo` database have 5 attribute.

  - title (String)
  - done (Boolean)
  - startDate (Date)
  - EndDate time (Date)
  - comment (String)

- `todoUser` database have 4 attribute.

  - name (String)
  - email (String)
  - password (String)
  - token (String)

- api

  - `/` (get)
  - `/show` (get)
  - `/new` (post)
  - `/edit` (put)
  - `/remove` (delete)
  - `/done/:id` (get)
  - `/undone` (put)
  - `/status/:id` (get)
