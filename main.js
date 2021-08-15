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
    default: "Hentai",
  },
});

const DB = mongoose.model("todo", todoSchema);

//...
//Routes
//...

app.get("/", (req, res) => {
  res.send("https://github.com/Error6251/ExpressCRUD");
});

//Show not completed result
app.get("/show", (req, res) => {
  DB.find({ done: false }).then((result) => {
    res.send(result);
  });
});

//show all results
app.get("/show/all", (req, res) => {
  DB.find().then((result) => {
    res.send(result);
  });
});

//show completed results
app.get("/show/done", (req, res) => {
  DB.find({ done: true }).then((result) => {
    res.send(result);
  });
});

//insert a value
app.post("/new", (req, res) => {
  //calculate the end date
  let endDate = new Date();
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
      res.send({
        message: "New Task added",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ohhh... something is wrong",
      });
    });
});

//update or edit a value
app.put("/edit", (req, res) => {
  //calculate the end date
  let endDate = new Date();
  endDate.setDate(endDate.getDate() + Math.abs(req.body.endIn));

  // //check there is title or date
  // if (req.body.title != null) {
  //   title: req.body.title;
  // }

  //update It
  DB.findByIdAndUpdate(
    req.body.id,
    {
      title: req.body.title || "I forget the title",
      endDate: endDate,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Error with id " + req.body.id,
        });
      } else {
        res.send({
          message: "updated " + req.body.id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error with id " + req.body.id,
      });
    });
});

//delete a value
app.delete("/remove", (req, res) => {
  const id = req.body.id;

  DB.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Error on id=${id}.`,
        });
      } else {
        res.send({
          message: "That task is gone!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error on id=" + id,
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
        res.status(404).send({
          message: "Error with id " + req.params.id,
        });
      } else {
        res.send({
          message: "Super cO0oL, " + req.params.id + " is Done!!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error with id " + req.params.id,
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
        res.status(404).send({
          message: "Error with id " + req.params.id,
        });
      } else {
        res.send({
          message: "S()ooo SAaD, " + req.params.id + " is Undone",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error with id " + req.params.id,
      });
    });
});

//...
//Turn on the system
//...
//If database is connected
//Then open server port
db.once("open", function () {
  app.listen(port, () => {
    console.log(`Fire in the hole!!! @ http://localhost:${port}`);
  });
});
//send Error msg for Database
db.on("error", console.error.bind(console, "connection error:"));
