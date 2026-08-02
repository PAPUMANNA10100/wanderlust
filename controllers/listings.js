const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index=async(req,res)=>{
    const alldata=await Listing.find({});
    res.render("listings/index.ejs",{alldata});
};

module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new.ejs");
};

module.exports.addNewListing=async (req,res ,next)=>{
 let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
.send();

  let url=req.file.path;
  let filename=req.file.filename;
  const newlisting=new Listing(req.body.listing);
  newlisting.owner=req.user._id;
  newlisting.image={url,filename};
  newlisting.geometry=response.body.features[0].geometry;
   await newlisting.save();
   req.flash("success","new listing created");
   res.redirect("/listings");
  
}

module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{path:"author"},
  })
    .populate("owner");
  if(!listing){
    req.flash("error","listing you request doesn't exist");
     return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing,mapToken: process.env.MAP_TOKEN, });
};

module.exports.renderEditFrom=async (req,res)=>{
  let{id}=req.params;
  const listing=await Listing.findById(id);
  let originalImg=listing.image.url;
  if(!listing){
    req.flash("error","listing you request doesn't exist");
   return  res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing,originalImg});
};

module.exports.updateFrom=async(req,res)=>{
  let{id}=req.params;

  await Listing.findByIdAndUpdate(id,req.body.listing);
    
    if(typeof req.file !== "undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
       await listing.save();
    }
  
    req.flash("success","listing updated successfully....");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success"," listing deleted!");
  res.redirect("/listings");
};