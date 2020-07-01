// require("dotenv").config();
// require packages
var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    methodoverride = require("method-override"),
    camps4umodel = require("./models/campsite"),
    commentmodel = require("./models/comment"),
    passport = require("passport"),
    localstrategy = require("passport-local"),
    usermodel = require("./models/user"),
    seedDB = require("./seeds");
// require routes
var commentroutes = require("./routes/comments"),
    campsiteroutes = require("./routes/campsites"),
    indexroutes = require("./routes/index");
// app setup
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb+srv://abd:abd@cluster0-zvc42.mongodb.net/camps4u?retryWrites=true&w=majority");

// localdb
// mongoose.connect("mongodb://localhost/camps4udb");

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
// seedDB(); seed the database

// passport setup
app.use(require("express-session")({
    secret: "abdealisaria",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(usermodel.authenticate()));
passport.serializeUser(usermodel.serializeUser());
passport.deserializeUser(usermodel.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentuser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
// use routes
app.use(indexroutes);
app.use(commentroutes);
app.use(campsiteroutes);

// express listen for requests
app.listen(3000, function () {
    console.log("The Camps4U server has started....");
});