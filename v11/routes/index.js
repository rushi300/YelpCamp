var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {   
        successFlash:true,
        successRedirect: "/campgrounds",
        failureFlash:true,
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

// checkout
router.get('/checkout', async (req, res) => {
   try {
    const paymentIntent = await stripe.paymentIntents.create({
        payment_method_types: ['card'],
        amount: 1000,
        currency: 'inr',
        
        
      });
      const {client_secret} = paymentIntent;
    res.render('checkout', { client_secret,amount:"1000" });
   } catch (err) {
     req.flash("error",err.message);
     console.log(err)
     res.redirect("back");  
   }           
  });

module.exports = router;