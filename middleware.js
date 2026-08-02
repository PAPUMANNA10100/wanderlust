const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLogin=(req,res,next)=>{
  if(! req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be login !");
    return res.redirect("/login")
  }
  next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
         res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing= ((req,res,next)=>{
   let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message);
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
});


module.exports.validateReview= ((req,res,next)=>{
   let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message);
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
});

module.exports.isOwner= async(req,res,next)=>{
  let{id}=req.params;
  let listing= await Listing.findById(id);
   if(!listing.owner._id.equals(req.user._id)){
      req.flash("error","you don't permission to chenge");
     return  res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor= async(req,res,next)=>{
  let{id,rId}=req.params;
  let review= await Review.findById(rId);
   if(!review.author._id.equals(req.user._id)){
      req.flash("error","you don't permission to chenge");
     return  res.redirect(`/listings/${id}`);
    }
    next();
};