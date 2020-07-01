// require dependencies
var express = require("express");
var router = express.Router();
var camps4umodel = require("../models/campsite");
var commentmodel = require("../models/comment");
var middleware = require("../middleware/index");
// new comment form route
router.get("/campsites/:id/comments/new", middleware.isLoggedIn, function (req, res) {
    camps4umodel.findById(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campsites: data });
        }
    });
});
// add new comment route
router.post("/campsites/:id/comments", middleware.isLoggedIn, function (req, res) {
    camps4umodel.findById(req.params.id, function (err, campdata) {
        if (err) {
            console.log(err);
        }
        else {
            commentmodel.create(req.body.comment, function (err, commentdata) {
                if (err) {
                    console.log(err);
                }
                else {
                    // add user nad id to comment
                    commentdata.author.id = req.user._id;
                    commentdata.author.username = req.user.username;
                    commentdata.save();
                    // save comment
                    campdata.comments.push(commentdata);
                    campdata.save();
                    req.flash("success", "Your review for " + campdata.name + " has been posted");
                    res.redirect("/campsites/" + campdata._id);
                }
            });
        }
    });
});
// edit comment route
router.get("/campsites/:id/comments/:comment_id/edit", middleware.checkcommentownership, function (req, res) {
    commentmodel.findById(req.params.comment_id, function (err, data) {
        if (err) {
            res.redirect("/campsites/" + req.params.id);
        }
        else {
            res.render("comments/edit", { commentdata: data, campsiteid: req.params.id });
        }
    });
});
// comment update
router.put("/campsites/:id/comments/:comment_id", middleware.checkcommentownership, function (req, res) {
    commentmodel.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, data) {
        if (err) {
            console.log(err);
            req.flash("error", "review not found");
            res.redirect("back");
        }
        else {
            req.flash("success", "Review added");
            res.redirect("/campsites/" + req.params.id);
        }
    });
});
// destroy comment
router.delete("/campsites/:id/comments/:comment_id/", middleware.checkcommentownership, function (req, res) {
    commentmodel.findByIdAndRemove(req.params.comment_id, function (err, data) {
        if (err) {
            req.flash("error", "Not allowed since you're not the owner");
            res.redirect("back");
        }
        else {
            req.flash("success", "Your review has been removed");
            res.redirect("/campsites/" + req.params.id);
        }
    });
});

module.exports = router;