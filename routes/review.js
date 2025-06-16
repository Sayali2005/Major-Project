const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const wrapAsync =  require("../utils/wrapAsync.js")
const ExpressError =  require("../utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isOwner, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews
// Post Route of Reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;