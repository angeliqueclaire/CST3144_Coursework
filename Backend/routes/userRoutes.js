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

api.get("/users", function(request, response) {
    response.json([
        { name: "John Doe", email: "john.doe@example.com" }
    ]);
});

module.exports = api;