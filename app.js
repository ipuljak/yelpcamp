var express        = require("express"),
	bodyparser     = require("body-parser"),
	mongoose       = require("mongoose"),
	Campground     = require("./models/campground"),
	seedDB         = require("./seeds"),
	Comment        = require("./models/comment"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	User           = require("./models/user"),
	methodOverride = require("method-override"),
	flash          = require("connect-flash"),
	app            = express();

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index");


// set the view engine so we can default to ejs extensions
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

// Passport config
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// allows header file to see users everywhere
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// include the string to get rid of /campgrounds (it turns into just /)
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(4000, process.env.IP, function() {
	console.log("The YelpCamp server has started on port 4000.");
}); 