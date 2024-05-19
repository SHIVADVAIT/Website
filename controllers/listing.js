const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm =  (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
  }

module.exports.showListing= async (req, res) => {
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
  }

module.exports.createLisitng = async(req, res, next) => {
    const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success","New Listing Created");
      res.redirect("/listings");
    }
module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params;
    console.log(req.params);
    const listing = await Listing.findById(id); 
     if(!listing){
      req.flash("error","NO is present which you have searched Listing");
     res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing }); 
  }


module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }


  module.exports.edit =  async (req, res) => {
    let { id } = req.params;
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","New Listing Updated");
    res.redirect(`/listings/${id}`);
    }