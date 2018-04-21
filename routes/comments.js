// define express router
var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");
// automaticall includex index.js
//var middleware = require("../middleware/index.js");

// NEW comment route
// middleware: prevent comments from someone who is not logged-in
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("comments/new", {campground: camp});
        }
    });
});

// CREATE comment route
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, newcomment) {
                if (err) {
                    req.flash("error", "Something went wrong");
                }
                else {
                    // add username and id to comment
                    // req.user is defined
                    newcomment.author.id = req.user._id;
                    newcomment.author.username = req.user.username;
                    newcomment.save();
                    // associate comment with campground
                    camp.comments.push(newcomment);
                    camp.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    });
});

// EDIT route: /campgrounds/:id/comments/:comment_id/edit, GET request
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            console.log(foundComment);
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
});

// UPDATE route: /campgrounds/:id/comments/:comment_id/, PUT request
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, 
    function(err, foundComment) {
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY route: /campgrounds/:id/comments/:comment_id/, DESTROY request
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundCamment) {
        if(err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

module.exports = router;
