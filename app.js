var express = require("express");
var app = express();
var port = 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/create", (req, res) => {
    res.sendFile(__dirname + "/create.html");
});

app.get("/edit", (req, res) => {
    res.sendFile(__dirname + "/edit.html");
});

app.get("/delete", (req, res) => {
    res.sendFile(__dirname + "/delete.html");
});

app.get("/add-comment", (req, res) => {
    res.sendFile(__dirname + "/add-comment.html");
});

app.get("/fetch-comment", (req, res) => {
    res.sendFile(__dirname + "/fetch-comment.html");
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/admin");

var nameSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: Number,
    designation: String,
    address: String,
    interest: Array
});

var User = mongoose.model("User", nameSchema);

app.post("/CreateUser", (req, res) => {
    var myData = new User(req.body);
    app.use(bodyParser.urlencoded({extended: true}));
    myData.save()
        .then(item => {
            res.send("New user " + myData.name + " created successfully.");
        })
        .catch(err => {
            res.status(400).send("Unsuccessfull");
        });
});

app.post("/EditUser", (req, res) => {
    var myData = new User(req.body);
    app.use(bodyParser.urlencoded({extended: true}));
    myData.collection.findOneAndUpdate({ email: myData.email }, { $set: { name: myData.name } })
        .then(item => {
            res.send("Users details has been updated successfully.");
        })
        .catch(err => {
            res.status(400).send("Unsuccessfull");
        });
});

app.post("/DeleteUser", (req, res) => {
    var myData = new User(req.body);
    myData.collection.deleteOne({ email: myData.email }).then(item => {
        res.send(myData.email + " has been deleted successfully.");
    })
        .catch(err => {
            res.status(400).send("Unsuccessfull");
        });
});

var commentSchema = new mongoose.Schema({
    email: String,
    comment: String
});

var Comment = mongoose.model("Comment", commentSchema);

app.post("/AddComment", (req, res) => {
    var myData = new Comment(req.body);
    myData.save()
        .then(item => {
            res.send("Comment addded successfully.");
        })
        .catch(err => {
            res.status(400).send("Unsuccessfull");
        });
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
app.post("/FetchComment", (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("admin");
        dbo.collection("comments").find({}, {projection: {_id: 0, email: 0, __v: 0}}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
        });
    });
});

app.get("/interest", (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("admin");
        dbo.collection("users").find({interest: "coding"}, {projection: {_id: 0, name: 1}}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
        });
    }); 
});