const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const userScheme = new Schema({name: String, age: Number}, {versionKey: false});
const User = mongoose.model("User", userScheme);

app.use(express.static(__dirname + "/public"));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);
    app.listen(3001, function(){
        console.log("Сервер ожидает подключения...");
    });
});

app.get("/api/users", function(req, res){

    User.find({}, function(err, users){

        if(err) return console.log(err);
        res.send(users)
    });
});

app.get("/api/users/:id", function(req, res){

    const id = req.params.id;
    User.findOne({_id: id}, function(err, user){

        if(err) return console.log(err);
        res.send(user);
    });
});

app.post("/api/users", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const userName = req.body.name;
    const userAge = req.body.age;
    const user = new User({name: userName, age: userAge});

    user.save(function(err){
        if(err) return console.log(err);
        res.send(user);
    });
});

app.delete("/api/users/:id", function(req, res){
    const  {id}  = req.params;
    User.findOneAndDelete ({_id: id}, err => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
});

app.put("/api/users", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
    const newUser = {age: userAge, name: userName};

    User.findOneAndUpdate({_id: id } , newUser, {new: true}, function(err, user){
        if(err) return console.log(err);
        res.send(user);
    });
});