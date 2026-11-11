const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
app.set('port', port);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, Accept, X-Requested-With, Content-Type');
 
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
 
    next();
});

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

    app.param('collectionName', (req, res, next, collectionName) => {
        req.collection = db.collection(collectionName);
        return next();
    });

    app.get('/collections/:collectionName', async (req, res) => {
        try {
            const documents = await req.collection.find({}).toArray();
            res.send(documents);
        } catch (error) {
            next(error);
        }
    });

    
    app.post('/collections/:collectionName', async (req,res,next)=>
    {
        try {
            const result = await req.collection.insertOne(req.body);
            res.status(201).send({
                msg:"success",
                insertedId:result.insertedId
            })
        } catch (error) {
            next(error);
        }
    })

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('error: server error!');
    });
}

startServer();