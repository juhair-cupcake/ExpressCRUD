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
      });
  } else if (req.query.filter == "not-done") {
    DB.find({ done: false })
      .sort("endDate")
      .then((result) => {
        return res.send(result);
      });
  } else {
    DB.find()
      .sort("endDate")
      .then((result) => {
        return res.send(result);
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
  //calculate the end date
  var endDate = undefined;
  if (req.body.endIn != null) {
    endDate = new Date();
    endDate.setDate(endDate.getDate() + Math.abs(req.body.endIn));
  }

  var reply;
  //check there is title or date
  if (req.body.title != null && endDate != undefined) {
    reply = {
      title: req.body.title,
      endDate: endDate,
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
  const id = req.body.id;

  DB.findByIdAndRemove(id)
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
  DB.findByIdAndUpdate(
    req.params.id,
    {
      done: false,
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
