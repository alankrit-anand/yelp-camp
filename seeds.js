var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
{
	name: "Cloud's Rest",
	image: "https://images.unsplash.com/photo-1572443490709-e57345f45939?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
	description: "blah blah blah"
},
{
	name: "Cloud's Rest",
	image: "https://images.unsplash.com/photo-1572443490709-e57345f45939?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
	description: "blah blah blah"
},
{
	name: "Cloud's Rest",
	image: "https://images.unsplash.com/photo-1572443490709-e57345f45939?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
	description: "blah blah blah"
}
];



function seedDB(){

	Campground.remove({}, (err)=>{
		console.log("removed campgrounds");
		data.forEach((seed)=>{
			Campground.create(seed, (err, campground)=>{
				if(err)
					console.log(err);
				else{
					console.log("added a new campground");

					Comment.create(
						{
							text:"Great Place",
							author: "Homer"
						}, (err, comment)=>{
						if(err)
							console.log(err);
						else{
							campground.comments.push(comment);
							campground.save();
							console.log("added a comment");
						}
						
					});
				}
			});
		});
	});

	
	
}

module.exports = seedDB;