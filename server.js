const express = require( "express" ),
  { MongoClient } = require("mongodb"),
  { ObjectId } = require("mongodb"),
  app = express();
const authRoutes = require("./routes/auth-routes");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const initializePassport = require("./config/passport-config");
initializePassport(
  passport, 
  email => users.find(user => user.email === email)
);

app.use( express.static( "public" ) );
app.use( express.static("views") );
app.use( express.json() );
app.use(  '/auth', authRoutes );
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.set( "view engine", "ejs" );

require('dotenv').config();

const uri = "mongodb+srv://" + process.env.NAME + ":" + process.env.PASSWORD + "@a3-nicholas-borrello.drurqmd.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
console.log(uri);
const client = new MongoClient( uri );



let collection = null
let users = null

async function run() {
  await client.connect()
  collection = await client.db("a3-nicholas-borrello").collection("Contacts")
  users = await client.db("a3-nicholas-borrello").collection("Users")

  // Check the connection
  app.use((req, res, next) => {
    if (collection !== null) {
      next()
    } else {
      res.status(503).send()
    }
  })

  app.get("/", (req, res) => {
    res.render("login.ejs");
  });

  app.get("/contacts", (req, res) => {
    res.render("contacts.ejs");
  });

  app.get("/register", (req, res) => {
    res.render("register.ejs");
  });

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
  app.post('/login/attempt', passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login',
    failureFlash: true
  }))

  // Create a new user in the database
  app.post('/register/create', async (req, res) => {
    // Hash the password
    try {
      var pwdObj = req.body.password;
      var hashObj = new jsSHA("SHA-256", "TEXT", {numRounds: 1});
      hashObj.update(pwdObj);
      var hash = hashObj.getHash("HEX");
      pwdObj = hash;
      users.insertOne({
        username: req.body.username,
        password: pwdObj
      })
      console.log("User created: "+req.body.username+" "+pwdObj)
      res.redirect("/login");
    } catch {
      console.log("Error creating user")
      res.redirect("/register");
    }
  })
}

run()

app.listen( process.env.PORT || 3000)

