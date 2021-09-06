# ExpressCRUD

This project is for learning ExpressJS and mongoDB. I made a todo app with a super basic authentication method, only in api without any UI, it will serve as local host.

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

- Api

  - `/` (get)
    - purpose: it will show the git repo link
  - `/show` (get)
    - purpose: show the task data with or without filter
    - query: `?filter=` `done` / `not-done` / `today` / `week`
  - `/new` (post)
    - purpose: create new post
    - body:
      - important: `title`, `endIn`
      - optional: `comment`
  - `/edit` (put)
    - purpose: edit some task info
    - body:
      - important: `id`
      - optional: `title`, `endIn`, `comment` (at least one)
  - `/remove` (delete)
    - purpose: remove a task from DB
    - body: `id`
    - headers: `token` = JWT Token
  - `/done/:id` (get)
    - purpose: mark task as done
    - query: `id`
  - `/undone` (put)
    - purpose: when task isn't completed yet
    - body: `id`, `endIn`
  - `/status/:id` (get)
    - purpose: show some info about that task
    - query: `id`
  - `/register` (post)
    - purpose: create new user
    - body: `email`, `password`, `name`
  - `/login` (post)
    - purpose: get the jwt token
    - body: `email`, `password`

- Data type

  - `title` String
  - `endIn` Number (how many day it will take to complete)
  - `comment` String
  - `id` String
  - `email` String (unique)
  - `password` String
  - `token` String

- Auth
  - first register with email password and name.
  - then login with the email & password.
  - you will get JWT token.
  - everytime you want to remove data you need to send the jwt with `token` on `Headers`.
  - token secret is `shhh`
