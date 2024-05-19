const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");




router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,  {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
  }))


  router.post("/",isLoggedIn, validateReview, wrapAsync(async (req,res)=>{
    let listing =  await Listing.findById(req.params.id);
    req.flash("success",  "New Review Created");
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
   //this is next commit //
    await listing.save();
    req.flash("success",  "New Review Created");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
    }))
    
    module.exports = router;