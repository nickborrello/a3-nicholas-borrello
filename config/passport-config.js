require('dotenv').config();
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");

function initialize( passport, getUserByEmail, getUserById ) {
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
    }, ( accessToken, refreshToken, profile, done ) => {
        console.log("Google strategy callback function fired")
        console.log(profile)
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