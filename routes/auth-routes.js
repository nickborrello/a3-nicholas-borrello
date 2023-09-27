const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
    res.render("login.html");
});

// auth logout
router.get("/logout", (req, res) => {
    // handle with passport
    res.send("logging out");
});

module.exports = router;