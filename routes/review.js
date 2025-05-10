const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isReviewAuthor, validateReview} = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const reviewController = require("../controllers/review.js");


router.get("/", wrapAsync(reviewController.getReviews)); // This handles GET /listings/:id/reviews

// POST Route: Create a review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE Route: Delete a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

// GET Route: Fetch reviews for a listing
router.get("/:listingId/reviews", wrapAsync(reviewController.getReviews));

module.exports = router;
