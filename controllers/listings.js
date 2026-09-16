const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { category, q } = req.query;
    let filter = {};

    if (category && category.trim() !== "") {
        filter.category = category.trim();
    }

    if (q && q.trim() !== "") {
        const searchQuery = q.trim();
        const searchRegex = new RegExp(searchQuery, "i");
        const searchFilter = {
            $or: [
                { title: searchRegex },
                { location: searchRegex },
                { country: searchRegex },
            ]
        };

        if (filter.category) {
            filter = { $and: [{ category: filter.category }, searchFilter] };
        } else {
            filter = searchFilter;
        }
    }

    const alldata = await Listing.find(filter);
    res.render("listings/index.ejs", {
        alldata,
        selectedCategory: category || "",
        searchQuery: q || ""
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.addNewListing = async (req, res, next) => {
    let geometry = { type: "Point", coordinates: [77.2090, 28.6139] };
    try {
        let response = await geocodingClient.forwardGeocode({
            query: `${req.body.listing.location}, ${req.body.listing.country || ""}`,
            limit: 1
        }).send();
        if (response.body && response.body.features && response.body.features.length > 0) {
            geometry = response.body.features[0].geometry;
        }
    } catch (e) {
        console.log("Geocoding failed, using default coordinates:", e.message);
    }

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    if (req.file) {
        newlisting.image = { url: req.file.path, filename: req.file.filename };
    }
    newlisting.geometry = geometry;
    await newlisting.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing, mapToken: process.env.MAP_TOKEN });
};

module.exports.renderEditFrom = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let originalImg = listing.image ? listing.image.url : "";
    res.render("listings/edit.ejs", { listing, originalImg });
};

module.exports.updateFrom = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};