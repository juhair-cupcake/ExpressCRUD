# ExpressCRUD

This project is for learning Express and mongoDB. I will try to make a todo app just using api without any UI in local host.

## How to install!

In this project I used Ubuntu 21.04 x86_64 node v12.21.0 MongoDB v4.4.8.

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
- [ ] Update a entry with title or end date or both.
- [x] Remove a entry by id.
- [ ] add comment.
- [x] Mark as task complete or not completed( add extra time ).
- [x] Show as done/ not done/ all data.
- [ ] Show only one entry.
- [ ] Show as end date shorted.
- [ ] Show as end date (end in a week or end in a month or...).
- [ ] Show due date for certain entry.
- [ ] Show the time it took or will take.
- [ ] Show overdue Task.
