const express = require("express");
const app = express();
// const dotenv = require("dotenv");
const mongoose = require("mongoose");
const {monogPass, mongoUser, port} = require('./config.js')

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${mongoUser}:${monogPass}@cluster0.o6g5t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// dotenv config();

// console.log(uri)

client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//models
const TodoTask = require("./models/TodoTask");

app.use("/static", express.static("public"));

// allows the extraction of data from the form by adding to the body property of the request 
app.use(express.urlencoded({ extended: true }));

//connection to db, server only runs after connection is made
// mongoose.set("useFindAndModify", false);

// let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(port, () => console.log("Server Up and running"));
});

// view engine configuration
app.set("view engine", "ejs");

// GET Method
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// POST Method to add task to database
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE
//find task by id then render new template. Then update task by method findByIdAndUpdate
app
.route("/edit/:id")
.get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
})
.post((req, res) => {
    const id = req.params.id;

    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//DELETE
// delete task by using method findByIdAndRemove
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

// app.listen(3000, () => console.log("Server Listening on Port 3000"));


