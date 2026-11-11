var express = require("express");
const { MongoClient, ObjectId } = require('mongodb');
var path = require("path");
var fs = require("fs");

const port = process.env.PORT || 3000;
var app = express();
var apiRouter = require("./routes/userRoutes");
var homeRoutes = require("./routes/homeRoutes");

var staticPath = path.resolve(__dirname,"../Frontend");

const url = 'mongodb+srv://angeliqueclaire22_db_user:EBWMyEHqZy9XzAim@aftrnest.n8kuxyg.mongodb.net/';
const client= new MongoClient(url);
let db;

async function startServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        db= client.db('AFTRNEST');
        app.get('/', (req, res) => {
            res.send('Select a collection, e.g., /products or /users');
        });
        app.listen(app.get('port'), () => {
            console.log(`Server listening on port ${app.get('port')}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

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

app.set('port', port);

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
startServer();


