// require dependencies
var request = require("request");
var express = require("express");
var router = express.Router();
var camps4umodel = require("../models/campsite");
var middleware = require("../middleware/index");
// campsites route
router.get("/campsites", function (req, res) {
    // get camps from db
    camps4umodel.find({}, function (err, camps) {
        if (err) {
            console.log(err);
        }
        else {

            res.render("campsites/campsites", { campsites: camps, page: "campsites" });
        }
    });
});
//Add new camp route
router.post("/campsites", middleware.isLoggedIn, function (req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcampsite = { name: req.body.name, price: req.body.price, image: req.body.image, location: req.body.location, desc: req.body.desc, author: author };
    camps4umodel.create(newcampsite, function (err, newcamp) {
        if (err) {
            console.log(err);
        }
        else {
            req.flash("success", "Added new campsite");
            res.redirect("/campsites");
        }
    });
    // campsites.push(newcampsite);
});
// new camp form route
router.get("/campsites/new", middleware.isLoggedIn, function (req, res) {
    res.render("campsites/addcamp.ejs");
});
// camp info route
router.get("/campsites/:id", function (req, res) {
    camps4umodel.findById(req.params.id).populate("comments").exec(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            // fix if location not found
            request('https://api.mapbox.com/geocoding/v5/mapbox.places/' + data.location + '.json?country=IN&fuzzyMatch=true&access_token=pk.eyJ1Ijoic2FyaWFhYmRlYWxpIiwiYSI6ImNrOGxzbjVseTA4c2czbHMxeTVicnYzYWUifQ.tzeMt7BEuXox1-MXJyu0pw', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var parsed = JSON.parse(body);
                    if (parsed.features.length != 0) {
                        var lng = parsed.features[0].center[0];
                        var lat = parsed.features[0].center[1];
                    }
                    else {
                        var lng = 78.9629;
                        var lat = 20.5937;
                    }
                    res.render("campsites/show", { campdesc: data, lng: lng, lat: lat });
                }
                else {
                    console.log("Error " + response.statusCode);
                    req.flash("error", "Enter a valid location");
                    res.redirect("/campsites/" + req.params.id + "/edit");
                }
            });
        }
    });
});
// edit camp route
router.get("/campsites/:id/edit", middleware.checkcampsiteownership, function (req, res) {
    camps4umodel.findById(req.params.id, function (err, data) {
        res.render("campsites/edit", { campsitedata: data });
    });
});
// update new values to camp route
router.put("/campsites/:id", middleware.checkcampsiteownership, function (req, res) {
    camps4umodel.findByIdAndUpdate(req.params.id, req.body.campsite, function (err, campdata) {
        if (err) {
            console.log(err);
            req.flash("error", "camp not found");
            res.redirect("/campsites");
        }
        else {
            req.flash("success", "camp info updated");
            res.redirect("/campsites/" + campdata.id);
        }
    });
});
// dstroy camp route
router.delete("/campsites/:id/delete", middleware.checkcampsiteownership, function (req, res) {
    camps4umodel.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            req.flash("error", "Not allowed since you're not the owner");
            res.redirect("/campsites");
        }
        else {
            req.flash("success", "Campsite has been removed");
            res.redirect("/campsites");
        }
    });
});

module.exports = router;