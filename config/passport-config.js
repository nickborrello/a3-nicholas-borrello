require('dotenv').config();
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");

function initialize( passport, getUserByEmail, getUserById, users ) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        console.log(user);
        if (user == null) {
            return done(null, false, { message: "No user with that email" })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (e) {
            return done(e)
        }
    }

    // Local Strategy
    passport.use(new LocalStrategy({ usernameField: "email" }, 
    authenticateUser))

    // Google Strategy
    passport.use(new GoogleStrategy({
        callbackURL: "/auth/google/redirect",
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET
    }, async ( accessToken, refreshToken, profile, done ) => {
        const user = await getUserByEmail(profile.email)
        // If a user with this email does not exist, create one
        if(user == null) {
            const hashedPassword = await bcrypt.hash("password", 10)
            const newUser = {
                email: profile.email,
                password: hashedPassword,
                contacts: []
            }
            users.insertOne(newUser)
            console.log("User created: "+profile.email+" "+hashedPassword)
            return done(null, newUser)
        }
        // Otherwise, return the user
        else {
            console.log("User found: "+profile.email)
            return done(null, user)
        }
    })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        return done(null, user)
    })
}

module.exports = initialize;