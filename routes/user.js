const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js")


router.route("/signup")
.post( wrapAsync(userController.postsignRoute))
.get( (req,res)=>{
    res.render("users/signup.ejs");
})

router.route("/login")
.get(userController.getLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login', failureFlash: true}),
userController.postLoginRoute);


router.get("/logout",userController.getLogout);

module.exports= router;