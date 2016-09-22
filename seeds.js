var mongoose   = require("mongoose"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment");


var data = [
	{
		name: "Clouds Rest",
		image: "https://farm4.staticflickr.com/3282/2770447094_2c64348643.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Beach Camping",
		image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Mountainside Tent Sleepover",
		image: "https://farm9.staticflickr.com/8572/16034357695_5ca6214f59.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
];


function seedDB() {
	// Remove all campgrounds
	Campground.remove({}, function(err) {
		if (err) {
			console.log(err);
		} else {
			// Remove all comments
			Comment.remove({}, function(err) {
				if (err) {
					console.log(err);
				}
			})
			console.log("Removed campgrounds.");
		}

		// Add a few campgrounds
		// this is inside first callback because we want the top to be done first!
		data.forEach(function(seed) {
			Campground.create(seed, function(err, campground) {
				if (err) {
					console.log(err);
				} else {
					console.log("Added a campground.");

					// create a comment
					Comment.create(
						{
							text: "This place is great, but I wish there was internet.",
							author: "Homer"
						}, 

						function(err, comment) {
							if (err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment.");
							}
						});
				}
			});
		});
	});

	
}

module.exports = seedDB;