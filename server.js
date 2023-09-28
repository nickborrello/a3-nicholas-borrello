const express = require( "express" ),
  { MongoClient } = require("mongodb"),
  { ObjectId } = require("mongodb"),
  app = express();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");
const initializePassport = require("./config/passport-config");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use( express.static( "public" ) );
app.use( express.static("views") );
app.use( express.json() );
app.use( express.urlencoded({ extended:false }));
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
const client = new MongoClient( uri );

let users = null

async function run() {
  await client.connect()
  users = await client.db("a3-nicholas-borrello").collection("Users")

  initializePassport(
    passport, 
    async userEmail => await users.findOne({ email: userEmail }), 
    async id => await users.findOne({ _id: new ObjectId(id) })
  );

  // Check the connection
  app.use((req, res, next) => {
    if (users !== null) {
      next()
    } else {
      res.status(503).send()
    }
  })

  app.get("/", (req, res) => {
    res.redirect("/login");
  });

  app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
  });

  app.get("/contacts", checkAuthenticated, (req, res) => {
    res.render("contacts.ejs", { name: req.user.email });
  });

  app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
  });

  // Get the database contacts table for a specific user
  app.get("/docs", checkAuthenticated, async(req, res) => {
    if (users !== null) {
      // get the userContacts for a specific user id
      const userInfo = await users.findOne({_id: req.user._id})
      const userContacts = userInfo.contacts;

      if(userContacts == null) {
        res.json([])
      }
      else {
        // For each contact in the database, convert the last edited date to a number of days
        const newuserContacts = [];
        for(let i = 0; i < userContacts.length; i++) {
          // create a new json object with the number of days since last edited

          const lastEdited = new Date(userContacts[i].lastEdited)
          const currentDate = new Date();
          const differenceInTime = currentDate.getTime() - lastEdited.getTime();
          // construct a new json object with the number of days since last edited
          newuserContacts.push({
            _id: userContacts[i]._id,
            firstName: userContacts[i].firstName,
            lastName: userContacts[i].lastName,
            phone: userContacts[i].phone,
            email: userContacts[i].email,
            dateOfBirth: userContacts[i].dateOfBirth,
            streetAddress: userContacts[i].streetAddress,
            city: userContacts[i].city,
            state: userContacts[i].state,
            zipCode: userContacts[i].zipCode,
            lastEdited: Math.floor(differenceInTime / (1000 * 3600 * 24))
          })
      }
      res.json( newuserContacts )
    } 
  }
  })

  // Insert data into the table
  app.post( "/add", checkAuthenticated, async (req,res) => {
    // get the userContacts for a specific user id
    req.body.lastEdited = new Date()
    req.body._id = new ObjectId()
    const result = await users.updateOne({
      _id: new ObjectId(req.user._id)
    }, {
      $push: {
        contacts: req.body
      }
    })
    res.json( result )
  })

  // Remove the req.body._id from the database table
  app.post('/remove', checkAuthenticated, async (req, res) => {
    const result = await users.updateOne({
      _id: new ObjectId(req.user._id)
    }, {
      $pull: {
        contacts: {
          _id: new ObjectId(req.body._id)
        }
      }
    })
    res.json(result)
  })

    // Edit the req.body._id from the database table
  app.post('/edit', checkAuthenticated, async (req, res) => {
    let newContacts = [];
    newContacts.push(req.body)
    const result = await users.updateOne({
      "contacts._id": new ObjectId(req.body._id)
    }, {
      $set: {
        "contacts.$.firstName": req.body.editFirstName,
        "contacts.$.lastName": req.body.editLastName,
        "contacts.$.phone": req.body.editPhone,
        "contacts.$.email": req.body.editEmail,
        "contacts.$.dateOfBirth": req.body.editDateOfBirth,
        "contacts.$.streetAddress": req.body.editStreetAddress,
        "contacts.$.city": req.body.editCity,
        "contacts.$.state": req.body.editState,
        "contacts.$.zipCode": req.body.editZipCode,
        "contacts.$.lastEdited": new Date()
      }
    })
    res.redirect("/contacts")
  })

  // Check the login credentials
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  });


  // // Check google login
  // app.post('/auth/google', passport.authenticate('google', {
  //   scope: ['profile', 'email']
  // }))

  // app.get('/auth/google/callback', passport.authenticate('google', {
  //   successRedirect: '/contacts',
  //   failureRedirect: '/login',
  //   failureFlash: true
  // }));

  // Create a new user in the database
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    // Hash the password
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.insertOne({
        email: req.body.email,
        password: hashedPassword
      })
      console.log("User created: "+req.body.email+" "+hashedPassword)
      res.redirect("/");
    } catch {
      console.log("Error creating user")
      res.redirect("/register");
    }
  })
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/contacts')
  }
  next()
}

run()

app.listen( process.env.PORT || 3000)

