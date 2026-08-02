const initdata=require("./data.js");
const Listing=require("../models/listing.js");

const mongoose = require('mongoose');
main()
.then((data)=>{
    console.log("connection successful");
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async()=>{
 await   Listing.deleteMany({});
 initdata.data=initdata.data.map((obj)=>({...obj,owner:"6a674c0a482971bc34777379"}));
await Listing.insertMany(initdata.data);
}
initDB();