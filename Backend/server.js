var express = require("express");
const { MongoClient } = require('mongodb');
var path = require("path");

const port = process.env.PORT || 3000;
var app = express();

var homeRoutes = require("./routes/homeRoutes");

var staticPath = path.resolve(__dirname,"../Frontend");

const url = 'mongodb+srv://angeliqueclaire22_db_user:EBWMyEHqZy9XzAim@aftrnest.n8kuxyg.mongodb.net/';
const client= new MongoClient(url);

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    response.setHeader('Access-Control-Allow-Headers',
        'Origin, Accept, X-Requested-With, Content-Type');
 
    if (request.method === 'OPTIONS') {
        return response.sendStatus(200);
    }
 
    next();
});    

app.use(function(request, response, next) {
    console.log("Incoming request....");
    console.log("Request method: " + request.method);
    console.log("Request URL: " + request.url);
    console.log("Request date: " + new Date().toString());
    next();
});

app.use(express.json());

app.use('/', homeRoutes);

app.set('port', port);

async function startServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        var db = client.db('AFTRNEST');
        
        var userRoutes = require("./routes/userRoutes");
        var apiRouter = userRoutes(db);

        app.use("/api", apiRouter);

        app.use(express.static(staticPath));

        app.listen(app.get('port'), () => {
            console.log(`Server listening on port ${app.get('port')}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();


