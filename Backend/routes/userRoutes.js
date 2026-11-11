var express = require('express');
var ALLOWED_IPS = ["127.0.0.1", "::1","123.456.7.89"];
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

api.get("/activities", function(request, response) {
    response.json(activity);
    console.log("Activities converted to json");
});

api.get("/users", function(request, response) {
    response.json([
        { name: "John Doe", email: "john.doe@example.com" }
    ]);
});

api.post("/orders",function(request, response) {
    var newOrder = {
        id: order.length + 1,
        name: request.body.name,
        phone: request.body.phone,
        country: request.body.country,
        address: request.body.address,
        city: request.body.city,
        postalCode: request.body.postalCode

    }
});

module.exports = api;