var express = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    connect       = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");

// use the public directory as resourse
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(connect());

//PASSPORT configuratio
app.use(require("express-session")({
    secret: "Once again",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware: this function is going to be called for all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    // currentUser will be available in all routes
    // important to call next or the execution stops
    res.locals.error   = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// REST convention
//       name    url        verb   desc.
//       ============================================
// e.g.  
//       INDEX   /campgrounds      GET    Displays a list of campgrounds
//       NEW     /campgrounds/new  GET    Displays form to make a new campground
//       CREATE  /campgrounds      POST   Adds a new campground
//       SHOW    /campgrounds/:id  GET    Shows info about one campground

// we want these two new routes - nested routes
// NEW          /campgrounds/:id/comments/new      GET
// CREATE       /campgrounds/:id/comments          POST

// full CRUD for campgrounds: Create/Read/Update/Delete
// full CRUD for comments:    Create/Read/Update/Delete

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//app.listen(process.env.PORT, process.env.IP, function() {
app.listen(3000, function() {
    console.log("YelpCamp Server Started ...");
});
