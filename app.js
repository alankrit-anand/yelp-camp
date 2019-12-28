const express               = require("express"),
      app                   = express(),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      flash                 = require("connect-flash"),          
      methodOverride        = require("method-override"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
	  Campground            = require("./models/campground"),
      Comment               = require("./models/comment"),
      User                  = require("./models/user");
      
const commentRoutes         = require("./routes/comments"),
	  campgroundRoutes      = require("./routes/campground"),
	  indexRoutes           = require("./routes/index");

//=================================================================


mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true, 
	useUnifiedTopology: true
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//======================================================================


app.use(require("express-session")({
	secret: "This is a secret",
	resave: false,
	saveUninitialized: false
})); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


//==================================================================
app.listen(process.env.PORT, process.env.IP, ()=>{
	console.log("yelpcamp has started at port "+ process.env.PORT);
});