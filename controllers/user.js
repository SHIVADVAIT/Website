const User = require("../models/user");

module.exports.postsignRoute = async(req,res)=>{
    try{
    let {username, email, password}= req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
     next(err); 
    }
    req.flash("success","user was registered");
    res.redirect("/listings");
    });
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.postLoginRoute = async(req,res)=>{req.flash( "success","welcome to wanderlust! You are logged in ");
let redirectUrl  = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);

}

module.exports.getLogout = (req,res)=>{
    req.logout((err)=>{
        if(err){
    return next(err);
        }
    req.flash("success","You  are logged Out");
    res.redirect("/listings");
    });
}

module.exports.getLogin = (req,res)=>{
    res.render("users/login.ejs");
}