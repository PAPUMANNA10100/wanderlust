const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router=express.Router();
const passport=require("passport");
const User=require("../models/user.js");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");


router.route("/signup")
.get(userController.renderSignUp)
.post( wrapAsync(userController.signUp));

// router.get("/signup",userController.renderSignUp);
// routerpost.("/signup", wrapAsync(userController.signUp));

router.route("/login")
.get(userController.renderLogin)
.post( saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}) ,userController.login);

// router.get("/login",userController.renderLogin);

// router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}) ,userController.login);

//logout
router.get("/logout",userController.logout);

module.exports=router;