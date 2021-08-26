//initialization
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 6969;

//read the json type input as post
app.use(express.json());

//...
//Database
//...

//connect to database
mongoose
  .connect("mongodb://localhost/todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => handleError(error));
const db = mongoose.connection;

//Create a schema
const Schema = mongoose.Schema;
const todoSchema = new Schema({
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
});

const DB = mongoose.model("todo", todoSchema);

//...
//Routes
//...

app.get("/", (req, res) => {
  return res.send("https://github.com/Error6251/ExpressCRUD");
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
app.delete("/remove", (req, res) => {
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
app.put("/undone/:id", (req, res) => {
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
//send Error msg for Database
db.on("error", console.error.bind(console, "connection error:"));
//If database is connected
//Then open server port
db.once("open", function () {
  app.listen(port, () => {
    console.log(`Fire in the hole!!! @ http://localhost:${port}`);
  });
});
