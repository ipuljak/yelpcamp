var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
// if you require a directory but no file, index.anything is included by default
var middleware = require("../middleware");

router.get("/", function(req, res) {

	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	});
});

// CREATE ROUTE

router.post("/", middleware.isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	// redirect back to campgrounds

	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;

	var author = {
		id: req.user._id,
		username: req.user.username
	};

	var newCampground = {name: name, image: image, description: desc, author:author};

	// Create a new campground and save it to the database
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			// send the user back to the form (something can't be blank, etc)
			console.log(err)
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// NEW ROUTE

router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// SHOW ROUTE - shows more info about one campground
// this should be declared after /new otherwise it'll pick this up first!

router.get("/:id", function(req, res) {

	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			// LHS (campground) is what will be seen by show.ejs
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT ROUTE

router.get("/:id/edit", middleware.checkOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// UPDATE ROUTE

router.put("/:id", middleware.checkOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE ROUTE

router.delete("/:id", middleware.checkOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;