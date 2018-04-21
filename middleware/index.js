var Campground = require("../models/campground");
var Comment    = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCamp) {
            if(err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else {
                if(foundCamp.author.id && foundCamp.author.id.equals(req.user._id)) {
                    // use equals() mongoose method to compara id's
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else {
                if(foundComment.author.id && foundComment.author.id.equals(req.user._id)) {
                    // use equals() mongoose method to compara id's
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


module.exports = middlewareObj;
