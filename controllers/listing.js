const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
  // geocoding in structured input mode
 let response = await geocodingClient.forwardGeocode({
  query: "New Delhi, India",
  limit: 1,
})
  .send();

console.log(response);
  


  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url,filename);
    const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url,filename};
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
   let original  = listing.image.url;
    original =original.replace("/upload","/upload/h_300,w_250");
    res.render("./listings/edit.ejs", { listing, original }); 
  }


module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }


  module.exports.updateListing=  async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if( typeof req.file !== "undefined"){
    let url = req.file.path;
    console.log(req.file); 
    let filename = req.file.filename;
    listing.image = {url, filename}; 
    await listing.save();
    }
    req.flash("success","New Listing Updated");
    res.redirect(`/listings/${id}`);
    }