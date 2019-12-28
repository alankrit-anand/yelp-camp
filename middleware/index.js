const Campground = require("../models/campground"),
      Comment    = require("../models/comment");

var middilewareObj = {};

middilewareObj.checkCampgroundOwnership = (req, res, next)=>{
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			res.flash("error", "Campground not found!")
			res.redirect("back");
		}
		else{
			if(campground.author.id.equals(req.user._id))
				next();
			else{
				req.flash("error", "you don't have permissions to do that!");
				res.redirect("back");
			}
		}
		});
	} else{
		res.redirect("back");
	}
}

 middilewareObj.isLoggedIn = (req, res, next)=>{
	if(req.isAuthenticated())
		return next();
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}

 middilewareObj.checkCommentOwnership = (req, res, next)=>{
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, campground)=>{
			if(err)
				res.redirect("back");
			else{
				Comment.findById(req.params.comment_id, (err, comment)=>{
					if(comment.author.id.equals(req.user._id))
						next();
					else{
						req.flash("error", "You don't have permissions to do that!");
						res.redirect("back");
					}
				});
				
			}
		});
	} else{
		req.flash("error", "Please Login First!");
		res.redirect("/login");
	}
}

module.exports = middilewareObj;