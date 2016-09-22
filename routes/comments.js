var express = require("express");
// need this line to access /campgrounds/:id the :id part because it's in app.js right now
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// isLoggedIn checks to see if logged in before displaying this page!!!!


router.get("/new", middleware.isLoggedIn, function(req, res) {
	// find campground by id and send it to the render
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err)
		} else {
			// THIS SEND CAMPGROUND TO NEW.EJS FILE
			res.render("comments/new", {campground: foundCampground});
		}
	});
});


router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			// can't find the campground
			res.redirect("/campgrounds");
		} else {
			// we can do it through req.body.comment because on new.ejs we have
			// comment[title] and comment[author]
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash("error", "Something went wrong.");
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();

					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added a new comment!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});

		}
	});
});

// EDIT COMMENT 

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATE COMMENT

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE COMMENT

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;