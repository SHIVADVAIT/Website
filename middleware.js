const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema}= require("./Schema.js");


module.exports.isLoggedIn= (req,res,next)=>{if(!req.isAuthenticated()){
    console.log(req);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
let listing = await Listing.findById(id);
if(!listing.owner._id.equals(res.locals.currUser._id)){
req.flash("error", "You don't have permission to edit ");
 return res.redirect(`/listings/${id}`);
}
next();
}

module.exports.validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  console.log(error);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
   throw new ExpressError(400, errMsg); 
  }else{
    next();
  }
};
module.exports.validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  console.log(error);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
   throw new ExpressError(400, errMsg); 
  }else{
    next();
  }
};


module.exports.isReviewAuthor = async (req,res,next)=>{
  let { id, reviewId } = req.params;
let review = await Review.findById(reviewId);
console.log(review);
if(!review.author.equals(res.locals.currUser._id)){
req.flash("error", " You can't do this  ");
 return res.redirect(`/listings/${id}`);
}
next();
}