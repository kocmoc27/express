var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;

var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://localhost:27017/timetabledb";

app.use( express.static(__dirname + "/public"));

app.get("/reservations", function(req, res){

    mongoClient.connect(url, function(err, db){
        db.collection("reservations").find({}).toArray(function(err, reserv){
            res.send(reserv);
            db.close();
        });
    });
});

app.get("/reservations/:id", function(req, res){

    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("reservations").findOne({_id: id}, function(err, reserv){

            if(err) return res.status(400).send();

            res.send(reserv);
            db.close();
        });
    });
});

app.post("/reservations",jsonParser, function(req, res){
    if(!req.body) return res.sendStatus(400);

    var Date = req.body.date;
    var Name = req.body.name;
    var Phone = req.body.phone;
    var reservation = {date: Date, name: Name, phone: Phone};

    mongoClient.connect(url,function(err,db){
        db.collection("reservations").insertOne(reservation, function(err, result) {
            if(err) return res.status(400).send();

            res.send(reservation);
            db.close;
        })
    })
});

app.put("/reservations",jsonParser, function(req, res){
    if(!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var Date = req.body.date;
    var Name = req.body.name;
    var Phone = req.body.phone;

    mongoClient.connect(url, function(err, db){
        db.collection("reservations").findOneAndUpdate({_id: id}, { $set: {date: Date, name: Name, phone: Phone}},
            {returnOriginal: false },function(err, result){

                if(err) return res.status(400).send();

                var reserv = result.value;
                res.send(reserv);
                db.close();
            });
    });
});

app.delete("/reservations/:id", function(req, res){
    var id = new objectId(req.params.id);
    mongoClient.connect(url,function(err,db){
       db.collection("reservations").findOneAndDelete({_id:id}, function(err,result){
            if(err) return res.status(400).send();

            var reserv = result.value;
            res.send(reserv);
            db.close();
       });
    });
});

app.listen(8080, function(){
    console.log("Сервер ожидает подключения...");
});
