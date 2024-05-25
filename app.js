if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}
console.log(process.env.SECRET)

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
const {listingSchema} = require("./Schema.js");
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
  res.locals.currUser = req.user;
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