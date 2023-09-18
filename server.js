const express = require( "express" ),
  { MongoClient } = require("mongodb"),
  app = express();

app.use( express.static( "public" ) )
app.use( express.static("views") )
app.use( express.json() )

require('dotenv').config();

const uri = "mongodb+srv://" + process.env.NAME + ":" + process.env.PASSWORD + "@a3-nicholas-borrello.drurqmd.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
console.log(uri)
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("a3-nicholas-borrello").collection("Contacts")

  // Check the connection
  app.use((req, res, next) => {
    if (collection !== null) {
      next()
    } else {
      res.status(503).send()
    }
  })

  // Get the database contacts table
  app.get("/docs", async(req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })

  // Insert data into the table
  app.post( "/add", async (req,res) => {
    const result = await collection.insertOne( req.body )
    res.json( result )
  })

  // Remove the req.body._id from the database table
  app.post('/remove', async (req, res) => {
    const result = await collection.deleteOne({
      _id: MongoClient.ObjectId(req.body._id)
    })
    res.json(result)
  })

  // Update the servers data with the servers
  app.post('/update', async (req, res) => {
    const result = await collection.updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      { $set: { name: req.body.name } }
    )

    res.json(result)
  })

}

run()

app.listen( process.env.PORT || 3000)

