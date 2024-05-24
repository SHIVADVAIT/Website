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



router
.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,validateListing,
wrapAsync(listingController.createLisitng)
)

//newroute
router.get("/new", isLoggedIn,listingController.renderNewForm);


//show
router.route("/:id")
.get(isLoggedIn, wrapAsync(listingController.showListing))
.delete( isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))
.put(isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing))



//show route
//create
//edit
// app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
//   let { id } = req.params;
//   console.log(req.params);
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// }));

//newcommit
//update
router;

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
  



  module.exports = router;