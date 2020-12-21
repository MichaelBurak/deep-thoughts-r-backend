const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT || 4000

require("dotenv").config();

app.use(cors())
app.use(bodyParser.json())

//db setup 
const db = require('./db')
const dbName = process.env.DB_NAME
const collectionName = process.env.COLLECTION_NAME

const quoteRoutes = express.Router()

//https://dev.to/lennythedev/rest-api-with-mongodb-atlas-cloud-node-and-express-in-10-minutes-2ii1
//db initialize

db.initialize(dbName, collectionName, function(dbCollection){
    //success callback
    //get all items
    //collection.find returns cursors, async changed to full array,
    //callback runs and logs result
    dbCollection.find().toArray(function(err,result){
        if(err) throw err;
        console.log(result)
    })
    //db crud routes
    app.post("/quotes", (request, response) => {
        const item = request.body;
        dbCollection.insertOne(item, (error, result) => { // callback of insertOne
            if (error) throw error;
            // return updated list
            dbCollection.find().toArray((_error, _result) => { // callback of find
                if (_error) throw _error;
                response.json(_result);
            });
        });
    });
    //read one 
    app.get("/quotes/:id", (request, response) => {
        const itemId = request.params.id;
    
        dbCollection.findOne({ id: itemId }, (error, result) => {
            if (error) throw error;
            // return item
            response.json(result);
        });
    });
    //read all
    app.get("/quotes", (request, response) => {
        // return updated list
        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            response.json(result);
        });
    });
}, function(err){
    //failure
    throw(err)
})

app.use("/quotes", quoteRoutes)

// quoteRoutes.route("/").get(function(req,res){
//     //Get a quote from the db 
// })

app.listen(PORT, function(){
    console.log("Server is running on Port:" + PORT)
})