const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async (req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview= new Review(req.body.review);
   newReview.author=req.user._id;
  listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
  console.log("review save..");
  req.flash("success","new review created !");
  res.redirect(`/listings/${req.params.id}`);


};

module.exports.deleteReview=async(req,res)=>{
  let{id,rId}=req.params;
  
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:rId}});
  await Review.findByIdAndDelete(rId);

  console.log("deleting complete");
  req.flash("success","review deleted!!");
  res.redirect(`/listings/${id}`);

};