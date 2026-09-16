const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(dbUrl, { dbName: "test" });
}

main()
  .then(async () => {
    console.log("Connected to DB successfully");
    await initDB();
    await mongoose.disconnect();
    console.log("Database initialized and connection closed.");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

const initDB = async () => {
  const existingCount = await Listing.countDocuments();
  console.log(`Current listings in test: ${existingCount}`);

  const firstUser = await User.findOne();
  const ownerId = firstUser ? firstUser._id : "6a6f0daedb6b291fa76701b1";

  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: ownerId,
    geometry: obj.geometry || { type: "Point", coordinates: [77.2090, 28.6139] },
    category: obj.category || "Trending"
  }));
  const inserted = await Listing.insertMany(initdata.data);
  console.log(`Data was initialized successfully! Inserted ${inserted.length} listings.`);
};