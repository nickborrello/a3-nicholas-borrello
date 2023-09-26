const express = require( "express" ),
  { MongoClient } = require("mongodb"),
  { ObjectId } = require("mongodb"),
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

  // Get the database contacts table for a specific user
  app.get("/docs", async(req, res) => {
    if (collection !== null) {
      // get the docs for a specific user id
      const docs = await collection.find({}).toArray()

      // For each contact in the database, convert the last edited date to a number of days
      const newDocs = [];
      for(let i = 0; i < docs.length; i++) {
        // create a new json object with the number of days since last edited

        const lastEdited = new Date(docs[i].lastEdited)
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - lastEdited.getTime();
        // construct a new json object with the number of days since last edited
        newDocs.push({
          _id: docs[i]._id,
          firstName: docs[i].firstName,
          lastName: docs[i].lastName,
          phone: docs[i].phone,
          email: docs[i].email,
          dateOfBirth: docs[i].dateOfBirth,
          streetAddress: docs[i].streetAddress,
          city: docs[i].city,
          state: docs[i].state,
          zipCode: docs[i].zipCode,
          lastEdited: Math.floor(differenceInTime / (1000 * 3600 * 24))
        })
    }
    res.json( newDocs )
  }
  })

  // Insert data into the table
  app.post( "/add", async (req,res) => {
    req.body.lastEdited = new Date()
    const result = await collection.insertOne( req.body )
    res.json( result )
  })

  // Remove the req.body._id from the database table
  app.post('/remove', async (req, res) => {
    const result = await collection.deleteOne({
      _id: new ObjectId(req.body._id)
    })
    res.json(result)
  })
}

// Edit the req.body._id from the database table
app.post('/edit', async (req, res) => {
  const result = await collection.updateOne({
    _id: new ObjectId(req.body._id)
  }, {
    $set: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      streetAddress: req.body.streetAddress,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      lastEdited: new Date()
    }
  })
  res.json(result)
})

// Check the login credentials
app.post('/login', async (req, res) => {
  const hashedPassword = crypto.createHash('sha256').update('THISISJUSTSOMESALTFORHASH' + req.body.password).digest('base64');
  const result = await collection.findOne({
    username: req.body.username,
    password: hashedPassword
  })
  res.json(result)
})

// Create a new user in the database
app.post('/createUser', async (req, res) => {
  // Hash the password
  const hashedPassword = crypto.createHash('sha256').update('THISISJUSTSOMESALTFORHASH' + req.body.password).digest('base64');
  const result = await collection.insertOne({
    username: req.body.username,
    password: hashedPassword
  })
  res.json(result)
})

run()

app.listen( process.env.PORT || 3000)

