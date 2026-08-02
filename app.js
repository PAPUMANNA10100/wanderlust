if(process.env.NODE_ENV != "production"){
require('dotenv').config()
};

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const { MongoStore } = require("connect-mongo");
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");



const path=require("path");
const app=express();
const port="8080";

const dbUrl=process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error",(err)=>{
  console.log("error on mongo session store",err);
});

const sessionOption={
  store,
     secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
       expires:Date.now()+7*24*60*60*1000,
       maxAge:7*24*60*60*1000,
       httpOnly:true,
    }
};


async function main() {
  await mongoose.connect(dbUrl);
}
main()
.then((data)=>{
    console.log("connection successful");
})
.catch((err) => {
    console.log(err);
});




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


// app.get("/",(req,res)=>{
//     res.send("wellcome");
// });


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("/*splat",(req,res,next)=>{
  throw(new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
  let{status=500,message="SOMETHING WENT WRONG!!!"}=err;
  res.status(status).render("listings/error.ejs",{message});
});


app.listen(port,()=>{
  console.log("app is listining");
})