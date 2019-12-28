const express = require("express");

const router        = express.Router({mergeParams: true}),
      Campground    = require("../models/campground"),
      Comment       = require("../models/comment"),
      middlewareObj = require("../middleware");

//=========================================================================


router.get("/new", middlewareObj.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			req.flash("error", "Something went wrong!");
		}
		else
			res.render("comments/new", {campground:campground});
	});
	
});


router.post("/", middlewareObj.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			req.flash("error", "Campground could not be found!");
			res.redirect("/campgrounds");
		} else{
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					req.flash("error", "Something went wrong");
					res.redirect("/campgrounds/"+req.params.id);
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save(); 
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment!")
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
	});
});

//========================================================================

router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		}
		else{
			Comment.findById(req.params.comment_id, (err, comment)=>{
				if(err){
					req.flash("error", "comment not fund!");
					res.redirect("back");
				}
				else{
					res.render("comments/edit", {campground: campground, comment: comment});
				}
			});
		}
	});
	
});

router.put("/:comment_id", middlewareObj.checkCommentOwnership, (req, res)=>{

	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
		if(err){
			req.flash("error", "Something wrong happened!");
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment edited successfully!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

router.delete("/:comment_id", middlewareObj.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			req.flash("error", "Something wrong happened!");
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment deleted successfully!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//========================================================================

module.exports = router;
