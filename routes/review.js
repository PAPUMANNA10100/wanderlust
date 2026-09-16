
const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLogin, validateReview, isReviewAuthor } = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

router.post("/", isLogin, validateReview, wrapAsync(reviewControllers.createReview));

router.delete("/:rId", isLogin, isReviewAuthor, wrapAsync(reviewControllers.deleteReview));

module.exports = router;
