const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./Schema.js");
const Review = require("./models/review.js");
const { wrap } = require("module");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");


main().then(()=>{console.log("connected To Db");})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/newdatabase');
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires:  Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true
  },
};


app.get("/",(req,res)=>{
  res.send("Hi, I  am root");
}
);

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
})

// app.get("/demouser", async(req,res)=>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });
//   let registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// });

const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  console.log(error);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
   throw new ExpressError(400, errMsg); 
  }else{
    next();
  }
};




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
//  //index route
// app.get("/listings", wrapAsync(async (req,res)=>{
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", {allListings});
// }));


// //newroute
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

//show route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   console.log(req.params);
//   const listing = await Listing.findById(id).populate("reviews");
//   console.log(listing);
//   res.render("listings/show.ejs", { listing });
// }));


//edit
// app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
//   let { id } = req.params;
//   console.log(req.params);
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// }));


//create
// app.post("/listings", validateListing,
// wrapAsync(async(req, res, next) => { 
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
// })
// );


//update
// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   // console.log(req.body);
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listings/${id}`);
// }));



// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
//   let {id, reviewId} = req.params;
//   await Listing.findByIdAndUpdate(id,  {$pull:{reviews: reviewId}});
//   await Review.findByIdAndDelete(reviewId);
//   res.redirect(`/listings/${id}`)
// }))
// app.get("/testlisting", async (req,res)=>{
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   })

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("Successful testing");
// });


// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   res.redirect("/listings");
// }));

// app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
// let listing =  await Listing.findById(req.params.id);
// let newReview = new Review(req.body.review);
// listing.reviews.push(newReview);
// await newReview.save();
// await listing.save();

// console.log("new review saved");
// res.redirect(`/listings/${listing._id}`);
// }))

app.all("*", (req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next)=>{
  let {statusCode= 500, message="Something Went Wrong"} = err;
res.status(statusCode).render("error.ejs", {message});
})

app.listen(8080, ()=>{
console.log("server is listening to port");
});