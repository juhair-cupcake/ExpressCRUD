# ExpressCRUD

This project is for learning Express and mongoDB. I will try to make a todo app just using api without any UI in local host.

## How to install!

In this project I used node v12.21.0 MongoDB v4.4.8.

1. Install the required application, nodejs, yarn, mongodb.
1. Download this file and install using `yarn`.
1. Run the application using `yarn start`.

## How to work With it!

Use postman to play with the api.

- Every tuple have 5 attribute.
  - title (String)
  - done (Boolean)
  - startDate (Date)
  - EndDate time (Date)
  - comment (String)
- ...

## TO-DO:

- [x] Create a noob express base.
- [x] Connect with MongoDB.
- [x] Create the DB.
- [x] Create a entry with or without comment.
- [x] Update a entry with title or end date or both.
- [x] Remove a entry by id.
- [x] Edit comment.
- [x] Mark as task complete or not completed( add extra time ).
- [x] Show as done/ not done/ all data shorted.
- [ ] Show as end date (end in a week or end in a day).
- [ ] Show status as overdue or day I have to complete.
- [ ] Add extra check for errors.
- [ ] Authenticate if user update or delete data.
- [ ] sign in api create a token
- [ ] Create api. JWT Packeg.Fn,Ln,Em
