const express = require('express');
const router=express.Router();
const Listing=require("../models/listing.js");
const review=require("../models/review.js");
const User=require("../models/user.js");
const methodOverride = require("method-override");
const wrapAsync=require("../utils/wrapAsync.js");

const {isLogin,validateListing,isOwner}=require("../middleware.js");
const flash=require("connect-flash");

const multer  = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage});

const listingController=require("../controllers/listings.js");

//main page
router.get("/", wrapAsync (listingController.index));

//new route
router.get("/new",isLogin,listingController.renderNewForm );

//create route
router.post("/", isLogin,upload.single('listing[image]'), validateListing, wrapAsync(listingController.addNewListing));


//indivisual id
//Show Route
router.get("/:id", wrapAsync(listingController.showListing));


//edit route
router.get("/:id/edit",isLogin,isOwner, wrapAsync(listingController.renderEditFrom));


//update
router.put("/:id", isLogin,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateFrom));

//delete route
router.delete("/:id", isLogin, isOwner,wrapAsync( listingController.deleteListing));

module.exports=router;