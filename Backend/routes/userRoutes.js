var express = require('express');
var ALLOWED_IPS = ["127.0.0.1", "::1","123.456.7.89"];
var path = require("path");
var fs = require("fs");

var ordersFile = path.resolve(__dirname,"../orders.json");


module.exports = function(db) {
    var api = express.Router();

    api.use(function(request, response, next) {
        console.log("User IP:", request.ip);
        var userIsAllowed = ALLOWED_IPS.indexOf(request.ip) !== -1;
        if(!userIsAllowed) {
            response.status(401).send("Access denied");
        } else {
            next();
        }
    });

    var activity = [
        {id: 1001, class: 'Football', rating: 5, location: 'Dubai, Al Wasl Sports Club', price: 110, image: 'images/football.png', availableInventory: 10, quantity: 0},
        {id: 1002, class: 'Basketball', rating: 3,location: 'Dubai, JSS Private School', price: 120, image: 'images/basketball.png', availableInventory: 10, quantity: 0},
        {id: 1003, class: 'Swimming', rating: 5, location: 'Abu Dhabi, Country Club', price: 130, image: 'images/swimming.png', availableInventory: 10, quantity: 0},
        {id: 1004, class: 'Tennis', rating: 3, location: 'Dubai, Al Naayat Street', price: 140, image: 'images/tennis.png', availableInventory: 10, quantity: 0},
        {id: 1005, class: 'Cricket', rating: 4, location: 'Abu Dhabi, Zayed  City', price: 150, image: 'images/cricket.png', availableInventory: 10, quantity: 0},
        {id: 1006, class: 'Dance', rating: 3, location: 'Sharjah, Wanderers Club', price: 160, image: 'images/dance.png', availableInventory: 10, quantity: 0},
        {id: 1007, class: 'Singing', rating: 2, location: 'Dubai, Al Wasl Sports Club', price: 170, image: 'images/singing.png', availableInventory: 10, quantity: 0},
        {id: 1008, class: 'Gymnastics', rating: 4, location: 'Sharjah, Baseline Academy', price: 180, image: 'images/gymnastics.png', availableInventory: 10, quantity: 0},
        {id: 1009, class: 'Ice Hockey', rating: 3, location: 'Abu Dhabi, Zayed City', price: 190, image: 'images/ice_hockey.png', availableInventory: 10, quantity: 0},
        {id: 1010, class: 'Karate', rating: 1, location: 'Sharjah, Wanderers Club', price: 200, image: 'images/karate.png', availableInventory: 10, quantity: 0}
    ];

    api.get("/lessons", function(request, response) {
        response.json(activity);
        console.log("Activities converted to json");
    });

    api.get("/orders", function(request, response) {
        fs.readFile(ordersFile, 'utf8', function(error, data) {
            if(error) {
                response.json("No orders found.");
                return;
            }
            var orders = JSON.parse(data); 
            response.json(orders); 
        })
    })

    api.post("/lessons", async function(request, response) {
        try {
            await db.collection("lesson").insertMany(activity);
            response.json("Lessons inserted successfully")

        } catch (error) {
            console.error(error);
            response.status(500).json({
                message: "Lessons not found"
            });
        }

    });

    api.post("/orders", async function(request, response) {
        var body = request.body;

        var order = {
            Name: body.firstName + ' ' + body.lastName,
            phone: body.phone,
            postalCode: body.postalCode,
            lessonIDs: body.lessonIDs,
            numOfSpaces: body.numOfSpaces
        }   

        try {
            await db.collection("order").insertOne(order);
            fs.readFile(ordersFile, 'utf8', function(error, data){
                var orders = [];
                if (!error) {
                    orders = JSON.parse(data);
                }
                orders.push(order);
                fs.writeFile(ordersFile, JSON.stringify(orders, null, 4), function(error){
                    if(error) {
                        console.log(error);
                    }
                });
                response.json({ message: "Order received" });
            });

            console.log("Order received");
            console.log("Name:", body.firstName + " " + body.lastName);
            console.log("Phone:", body.phone);
            console.log("Postal code:", body.postalCode);
            console.log("Lesson IDs:", body.lessonIDs);
            console.log("Number of Spaces:", body.numOfSpaces);

        } catch (error) {
            console.error(error);
            response.status(500).json({
                message: "Saving order failed"
            });
        }
    });

    api.put("/lessons/:id", async function(request, response) {
        var lessonId = Number(request.params.id);
        var body = request.body;

        try {
                
            var idExist = await db.collection("lesson").findOne({id: lessonId});
            
            if(!idExist) {
                return response.status(404).json(
                    {message: "Lesson not found"}
                );
            }

            await db.collection("lesson").updateOne(
                {id: lessonId},
                {$set: body}
            );

            response.status(200).json(
                {message: "Lesson updated Successfully"}
            );

        } catch (error) {
            console.error("PUT ERROR:", error);
            response.status(500).json("Update failed");
        }
    });
    return api;
}
