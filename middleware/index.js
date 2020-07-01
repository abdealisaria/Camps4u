var camps4umodel = require("../models/campsite");
var commentmodel = require("../models/comment");
var middlewareobj = {};

middlewareobj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash("error", "You need to login for that");
        res.redirect("/login");
    }
}
middlewareobj.checkcampsiteownership = function (req, res, next) {
    if (req.isAuthenticated()) {
        camps4umodel.findById(req.params.id, function (err, data) {
            if (err) {
                console.log(err);
                req.flash("error", "Campsite not found");
                res.redirect("back");
            }
            else {
                if (data.author.id.equals(req.user._id) || req.user.isadmin) {
                    next();
                }
                else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to login for that");
        res.redirect("back");
    }
}

middlewareobj.checkcommentownership = function (req, res, next) {
    if (req.isAuthenticated()) {
        commentmodel.findById(req.params.comment_id, function (err, data) {
            if (err) {
                console.log(err);
                req.flash("error", "review not found");
                res.redirect("back");
            }
            else {
                if (data.author.id.equals(req.user._id) || req.user.isadmin) {
                    next();
                }
                else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in for that");
        res.redirect("/login");
    }
}


module.exports = middlewareobj;