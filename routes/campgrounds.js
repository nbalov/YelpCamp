// define express router
var express = require("express");
var router  = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");
// automaticall includex index.js
//var middleware = require("../middleware/index.js");

// INDEX route
router.get("/", function(req, res) {
    // user data is in req.user
    console.log(req.user);
    Campground.find({}, function(err, allcamps) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allcamps});
        }
    });
});

// CREATE route
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name   = req.body.name;
    var price  = req.body.price;
    var image  = req.body.image;
    var desc   = req.body.description;
    var author = {id: req.user._id, username:req.user.username};
    Campground.create({name, price:price, image:image, author:author, description:desc}, 
        function(err, newcamp) {
            if (err) {
                req.flash("error", "Failed to create campground");
            }
            else {
                res.redirect("/campgrounds");
            }
    });
});

// NEW route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW route
router.get("/:id", function(req, res) {
    // find camp with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if (err) {
            req.flash("error", "Campground not found");
        }
        else {
            res.render("campgrounds/show", {campground: foundCamp});
        }
    });
});

// EDIT route: /campgrounds/:id/edit, GET request
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else {
            res.render("campgrounds/edit", {campground: foundCamp});
        }
    })
});

// UPDATE route: /campgrounds/:id, PUT request
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, 
    function(err, foundCamp) {
        if(err) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY route: /campgrounds/:id, DESTROY request
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, foundCamp) {
        if(err) {
            req.flash("error", "Campground not found");
        }
        res.redirect("/campgrounds");
    })
});

module.exports = router;