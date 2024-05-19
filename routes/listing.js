const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner, validateListing}= require("../middleware.js");
const review = require("../models/review.js")
const listingController = require("../controllers/listing.js");


//show
router.get("/", wrapAsync(listingController.index));


//newroute
router.get("/new", isLoggedIn,listingController.renderNewForm);

//show route
router.get("/:id",isLoggedIn, wrapAsync(listingController.showListing));

//create
router.post("/", isLoggedIn,validateListing,
wrapAsync(listingController.createLisitng)
);
//edit
// app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
//   let { id } = req.params;
//   console.log(req.params);
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// }));

//update
router.put("/:id", isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
  
  //delete
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


  module.exports = router;