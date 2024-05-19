const Listing = require("../models/listing");
const Review = require("../models/review.js");


module.exports.createReview = async (req,res)=>{
    let listing =  await Listing.findById(req.params.id);
    req.flash("success",  "New Review Created");
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    console.log(newReview);
   //this is next commit //
    await listing.save();
    req.flash("success",  "New Review Created");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
    };

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,  {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
  }