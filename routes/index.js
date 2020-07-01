// require dependencies
var express = require("express");
var router = express.Router();
var passport = require("passport");
var usermodel = require("../models/user");
var middleware = require("../middleware/index");

// register form route
router.get("/register", function (req, res) {
    res.render("register", { page: "register" });
});
// add new user route
router.post("/register", function (req, res) {
    var newuser = new usermodel({ username: req.body.username });
    if (req.body.admincode == "secretcode123") {
        newuser.isadmin = true;
    }
    usermodel.register(newuser, req.body.password, function (err, data) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Logged in as, " + data.username.toUpperCase());
            res.redirect("/campsites");
        });
    });
});
// landing page route
router.get("/", function (req, res) {
    res.render("landing");
});
// login page route 
router.get("/login", function (req, res) {
    res.render("login", { page: "login" });
});
// check credentials route
router.post("/login", passport.authenticate("local", { successRedirect: "/campsites", failureRedirect: "/login", failureFlash: true }), function (req, res) {
});
// logout route
router.get("/logout", function (req, res) {
    req.logOut();
    req.flash("success", "Logged out...");
    res.redirect("/campsites");
});

module.exports = router;