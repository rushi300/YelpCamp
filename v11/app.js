require('dotenv').config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash=require("connect-flash");
var passport = require("passport");
var LocalStrategy  = require("passport-local");
var methodOverride = require("method-override");

var Comment=require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb+srv://rushi:rushi@01@cluster0.0zckj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology:true ,useFindAndModify: false})

   .then(()=>{
console.log('Connected To Database');
   })
.catch(()=>{
    console.log('Connection Failed');
})
const Campground=require("./models/campground");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

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

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success")
   next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT||3000, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started!");
 });