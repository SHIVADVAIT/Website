const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner, validateListing}= require("../middleware.js");
const review = require("../models/review.js")



//show
router.get("/", wrapAsync(async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
}));


//newroute
router.get("/new", isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
});

//show route
router.get("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  console.log(req.params);
  const listing = await Listing.findById(id).populate({path: "reviews",populate: {
    path: "author",
  },}).populate("owner");
  if(!listing){
    req.flash("error","NO is present which you have searched Listing");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", {listing});
}));

//create
router.post("/", isLoggedIn,validateListing,
wrapAsync(async(req, res, next) => {
const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success","New Listing Created");
  res.redirect("/listings");
})
);
//edit
// app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
//   let { id } = req.params;
//   console.log(req.params);
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// }));

//update
router.put("/:id", isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
let { id } = req.params;

await Listing.findByIdAndUpdate(id, { ...req.body.listing });
req.flash("success","New Listing Updated");
res.redirect(`/listings/${id}`);
}));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req, res) => {
  let { id } = req.params;
  console.log(req.params);
  const listing = await Listing.findById(id); 
   if(!listing){
    req.flash("error","NO is present which you have searched Listing");
   res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing }); 
}));
  
  //delete
  router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }));


  module.exports = router;