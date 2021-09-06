//initialization
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//start server
const app = express();
const port = process.env.PORT || 6969;

//read the json type input as post
app.use(express.json());

//...
//Database
//...

//Set the options for database
let option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

//Connect to database
const db = mongoose.createConnection("mongodb://localhost/todo", option);
const user = mongoose.createConnection("mongodb://localhost/todoUser", option);

//Create a schema
let DB = db.model(
  "todo",
  new mongoose.Schema({
    title: {
      type: String,
      require: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      require: true,
    },
    comment: {
      type: String,
      default: "Just Do It!",
    },
  })
);

//Create a schema
let User = user.model(
  "todoUser",
  new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String, require: true },
    token: { type: String },
  })
);

//...
//JWT auth
//...
const verifyToken = (req, res, next) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(403).send("You need a JWT token for this request");
  }
  jwt.verify(token, "shhh", (deconde, err) => {
    if (err) {
      return res.status(401).send("Invalid Token");
    }
  });
  return next();
};

//...
//Routes
//...

app.get("/", (req, res) => {
  return res.send("https://github.com/Error6251/ExpressCRUD");
});

//Register new user
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.status(400).send("All input are required");
  }

  //Check that email is new
  User.findOne({ email: req.body.email })
    .then((emailFound) => {
      return res.status(409).send("User Already Exist. Please Login");
    })
    .catch((err) => {
      //Encrypt password
      bcrypt.hash(req.body.password).then((hash) => {
        // Create token
        const token = jwt.sign({ email: req.body.email }, "shhh", {
          expiresIn: 2 * 60,
        });

        //Create user
        const inp = new User({
          name: req.body.name,
          email: req.body.email.toLowerCase(),
          password: hash,
          token: token,
        });

        //save it on DB
        inp
          .save()
          .then((data) => {
            return res.send({
              message: "New user added",
            });
          })
          .catch((err) => {
            return res
              .status(500)
              .send(err.message + "Ohhh... something is wrong");
          });
      });
    });
});

//Login
app.post("/login", (req, res) => {
  //check input
  if (!req.body.email || !req.body.password) {
    res.status(400).send("send with email & password");
  }
  //check email
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt.compare(req.body.password, user.password, (err, ok) => {
        if (err) {
          return res.status(400).send(err + "Wrong Email or Password");
        } else if (ok) {
          // Create token
          const token = jwt.sign({ email: req.body.email }, "shhh", {
            expiresIn: 2 * 60,
          });

          // save user token
          User.findByIdAndUpdate(
            user._id,
            { token: token },
            { useFindAndModify: false }
          )
            .then((data) => {
              if (!data) {
                return res.status(404).send({
                  message: "Error you are wrong",
                });
              } else {
                return res.send(data);
              }
            })
            .catch((err) => {
              return res.status(500).send({
                message: err.message || "Error you are wrong",
              });
            });
        } else {
          return res.status(400).send("Wrong Email or Password");
        }
      });
    })
    .catch((err) => {
      return res.status(400).send("Wrong Email or Password");
    });
});

//Show result
app.get("/show", (req, res) => {
  if (req.query.filter == "done") {
    DB.find({ done: true })
      .sort([["endDate", -1]])
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message || "Ohhh... something is wrong",
        });
      });
  } else if (req.query.filter == "not-done") {
    DB.find({ done: false })
      .sort("endDate")
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message || "Ohhh... something is wrong",
        });
      });
  } else if (req.query.filter == "today") {
    //calculate the date
    let today = new Date();
    let endDate = new Date();
    endDate.setDate(today.getDate() + 1);

    DB.find({
      endDate: {
        $gte: today,
        $lt: endDate,
      },
    })
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message || "Ohhh... something is wrong",
        });
      });
  } else if (req.query.filter == "week") {
    //calculate the date
    let today = new Date();
    let endDate = new Date();
    endDate.setDate(today.getDate() + 7);

    DB.find({
      endDate: {
        $gte: today,
        $lt: endDate,
      },
    })
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message || "Ohhh... something is wrong",
        });
      });
  } else {
    DB.find()
      .sort("endDate")
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message || "Ohhh... something is wrong",
        });
      });
  }
});

//insert a value
app.post("/new", (req, res) => {
  //check the input is not empty
  if (req.body.title == null && req.body.endIn == null) {
    return res.status(400).send({
      message: "Pls send with title & endIn",
    });
  } else if (req.body.title == null) {
    return res.status(400).send({
      message: "Pls send with a title",
    });
  } else if (req.body.endIn == null) {
    return res.status(400).send({
      message: "Pls send with a endIn",
    });
  }
  //calculate the end date
  endDate = new Date();
  endDate.setDate(endDate.getDate() + Math.abs(req.body.endIn));

  //take the input
  const inp = new DB({
    title: req.body.title,
    endDate: endDate,
    comment:
      req.body.comment || `This task will take ${Math.abs(req.body.endIn)} day`,
  });

  //save it on DB
  inp
    .save()
    .then((data) => {
      return res.send({
        message: "New Task added",
      });
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Ohhh... something is wrong",
      });
    });
});

//update or edit a value
app.put("/edit", (req, res) => {
  //check is there Id with the input
  if (req.body.id == null) {
    return res.status(400).send({
      message: "Pls send with an id",
    });
  }

  //calculate the end date
  var endDate = undefined;
  if (req.body.endIn != null) {
    endDate = new Date();
    endDate.setDate(endDate.getDate() + Math.abs(req.body.endIn));
  }

  var reply;
  //check there is title or date or comment
  if (
    req.body.title != null &&
    endDate != undefined &&
    req.body.comment != null
  ) {
    reply = {
      title: req.body.title,
      endDate: endDate,
      comment: req.body.comment,
    };
  } else if (req.body.title != null && enddate != undefined) {
    reply = {
      title: req.body.title,
      enddate: enddate,
    };
  } else if (req.body.comment != null && enddate != undefined) {
    reply = {
      enddate: enddate,
      comment: req.body.comment,
    };
  } else if (req.body.title != null && req.body.comment != null) {
    reply = {
      title: req.body.title,
      comment: req.body.comment,
    };
  } else if (req.body.comment != null) {
    reply = {
      comment: req.body.comment,
    };
  } else if (req.body.titel != null) {
    reply = {
      title: req.body.title,
    };
  } else if (endDate != undefined) {
    reply = {
      endDate: endDate,
    };
  } else {
    return res.status(400).send({
      message: "Pls send with a title or endIn or both",
    });
  }

  //update It
  DB.findByIdAndUpdate(req.body.id, reply, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Error with id=" + req.body.id,
        });
      } else {
        return res.send({
          message: "updated " + req.body.id,
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error with id=" + req.body.id,
      });
    });
});

//delete a value
app.delete("/remove", verifyToken, (req, res) => {
  //check is there Id with the input
  if (req.body.id == null) {
    return res.status(400).send({
      message: "Pls send with an id",
    });
  }

  DB.findByIdAndRemove(req.body.id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Error there is no id=${id}.`,
        });
      } else {
        return res.send({
          message: "That task is gone!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error with id=" + id,
      });
    });
});

//mark as done
app.get("/done/:id", (req, res) => {
  //check is there Id with the input
  if (req.params.id == null) {
    return res.status(400).send({
      message: "Pls send with an id",
    });
  }

  DB.findByIdAndUpdate(
    req.params.id,
    {
      done: true,
      endDate: Date.now(),
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Error there is no id " + req.params.id,
        });
      } else {
        return res.send({
          message: "Super cO0oL, " + req.params.id + " is Done!!!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error with id " + req.params.id,
      });
    });
});

//mark as undone
app.put("/undone", (req, res) => {
  //check is there Id with the input
  if (req.body.id == null) {
    return res.status(400).send({
      message: "Pls send with an id",
    });
  }

  //calculate the end date
  var endDate = undefined;
  if (req.body.endIn != null) {
    endDate = new Date();
    endDate.setDate(endDate.getDate() + Math.abs(req.body.endIn));
  } else {
    return res.status(400).send({
      message: "Pls send with the day to complete",
    });
  }

  DB.findByIdAndUpdate(
    req.body.id,
    {
      done: false,
      endDate: endDate,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Error there is no id=" + req.params.id,
        });
      } else {
        return res.send({
          message: "S()ooo SAaD, " + req.params.id + " is Undone",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error with id=" + req.params.id,
      });
    });
});

//Show Status
app.get("/status/:id", (req, res) => {
  //check is there Id with the input
  if (req.params.id == null) {
    return res.status(400).send({
      message: "Pls send with an id",
    });
  }

  DB.findById(req.params.id)
    .then((result) => {
      //calculate the date and show the status
      let endDate = result.endDate;
      let today = new Date();

      if (result.done) {
        return res.send(`You Task is completed on ${endDate} :)`);
      } else {
        if (endDate < today) {
          return res.send(`You Task is Overdue ${endDate} :(`);
        } else {
          return res.send(
            `You have ${
              endDate.getDate() - today.getDate()
            } days to complete the task`
          );
        }
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Ohhh... something is wrong",
      });
    });
});

//...
//Turn on the system
//...
//Check for error
mongoose.connection.on("error", (err) => {
  logError(err);
});
//Then open server port
app.listen(port, () => {
  console.log(`Fire in the hole!!! @ http://localhost:${port}`);
});
