const express = require("express");

const router        = express.Router(),
      Campground    = require("../models/campground"),
      middlewareObj = require("../middleware");

//===================================================================================

 
 router.get("/", (req, res)=>{
	Campground.find({}, (err, campgrounds)=>{
		if(err){
			console.log(err);
		}
		else
			res.render("campgrounds/index", {campgrounds:campgrounds});
	});
});
	

router.get("/new", middlewareObj.isLoggedIn, (req, res)=>{
	res.render("campgrounds/new");
});


router.get("/:id", (req, res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, campground)=>{
		if(err){
			req.flash("error", "Campground not found!")
			res.redirect("back");
		}
		else{
			res.render("campgrounds/show", {campground: campground});
		}
	});
}); 


//================================================================


router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		res.render("campgrounds/edit", {campground: campground});
	});		
});


router.put("/:id", middlewareObj.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if(err){
			req.flash("error", "Campground could not be updated!");
			res.render("/campgrounds");
		}
		else{
			req.flash("success", "Campground updated successfully!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});


//===================================================================


router.delete("/:id", middlewareObj.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			req.flash("error", "Campground could not be removed!");
			res.redirect("/campgrounds/"+req.params.id);
		}else{
			req.flash("success", "Campground deleted successfully!");
			res.redirect("/campgrounds");
		}
		
	});
});


//======================================================================


router.post("/", middlewareObj.isLoggedIn, (req, res)=>{
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {
		name: name,
		image: image,
		description: description,
		price: price,
		author: author

	}
	Campground.create(newCampground, (err, campground)=>{
		if(err){
			req.flash("error", "Campground could not be created!");
		}
		else{
			req.flash("success", "Campground created successfully!");
		}
		res.redirect("/campgrounds");
	});		
});


//===========================================================================


module.exports = router;
