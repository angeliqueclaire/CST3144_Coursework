var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");

var apiRouter = require("./routes/userRoutes");
var homeRoutes = require("./routes/homeRoutes");

var staticPath = path.resolve(__dirname,"../Frontend");

app.use(function(request, response, next) {
    console.log("Incoming request....");
    console.log("Request method: " + request.method);
    console.log("Request URL: " + request.url);
    console.log("Request date: " + new Date().toString());
    next();
});

app.use(express.json());

app.use('/', homeRoutes);

app.use("/api", apiRouter);

app.use(function(request, response, next) {
    var filePath = path.join(staticPath, request.path);
    
    fs.stat(filePath, function(err, fileInfo) {
        if (err) {
            response.status(404).send("File not found");
            console.log("Request access: invalid");
            return;
        }
        if (fileInfo.isFile()) {
            console.log("Request access: valid");
            response.sendFile(filePath);
        }
        else {
            console.log("Request access: valid");
            next();
        } 
    });
});

app.use(express.static(staticPath));

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});

