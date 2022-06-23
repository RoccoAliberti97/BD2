//import { MongoClient } from "mongodb";
var MongoClient = require('mongodb').MongoClient;
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db("database2");
        const tennis = database.collection("statistics");
        // query for movies that have a runtime less than 15 minutes
        const query = {WINNER : "Novak Djokovic"};
        const cursor = tennis.find(query);
        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        // replace console.dir with your callback to access individual elements
        await cursor.forEach(console.dir);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);