const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm =  (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
  }

module.exports.kjl = (async (req, res) => {
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
  })