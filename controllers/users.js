const User=require("../models/user");

module.exports.renderSignUp=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signUp=async(req,res)=>{
    try{
       let{username,email,password}=req.body;
    let newuser= new User({username,email});
    let regisUser= await User.register(newuser,password);
    // console.log(regisUser);
    req.login(regisUser,((err)=>{
       if(err){
       return next(err);
       }
       req.flash("success","wellcome to wanderlust");
       res.redirect("/listings");
    }))
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    };
   
};

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req,res)=>{
    
    req.flash("success","wellcome Back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
       if(err){
       return next(err);
       }
       req.flash("success","you are logged out!");
       res.redirect("/listings");
    })
};