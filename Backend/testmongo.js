const {MongoClient} = require('mongodb');

const url = 'mongodb+srv://angeliqueclaire22_db_user:EBWMyEHqZy9XzAim@aftrnest.n8kuxyg.mongodb.net/';

const client = new MongoClient(url);

async function testconnection() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('AFTRNEST');
        console.log('Database:', db.databaseName);      
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
    } finally {
        await client.close();
    }
}

testconnection();