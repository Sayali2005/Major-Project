const Listing = require("../models/listing.js");


module.exports.index = async(req,res)=>{
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs",{alllisting});
};

module.exports.renderNewForm = (req,res)=>{
    //console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).send("Invalid listing ID");
    // }
      const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"},}).populate("owner");
      if(!listing){
        req.flash("error","Listing you are requested for does not exist!");
        res.redirect("/listings");
      }
      console.log(listing);
     // if (!listing) return res.status(404).send("Listing not found");
      res.render("listings/show.ejs", { listing });
  };

// module.exports.createListing = async(req,res,next)=>{
    //let {title,decsription,....}=req.body;
    //Above method is normal method, we can also do the same using key value pair, by creating objects in new.ejs name value.
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid data for listing!");
    // }
    // let response = fetch(`https://nominatim.openstreetmap.org/search?q=NewDelhi&format=json`)
    //     .then(res => res.json())
    //     .then(data => {
    //         const [lon, lat] = [data[0].lon, data[0].lat];
    //         map.flyTo({ center: [lon, lat], zoom: 12 });
    //     });
    
    // console.log(response);
    // res.send("done!")

    // let url = req.file.path;
    // let filename = req.file.filename;
    
    //console.log(url,"..",filename);

    //const newListing = new Listing(req.body.listing);

    // if(!newListing.description){
    //     throw new ExpressError(400,"Description is missing");
    // }

//     console.log(req.user);
//     newListing.owner = req.user._id;
//     newListing.image = {url,filename};
//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");     

// };  

module.exports.createListing = async (req, res, next) => {
    
    try {
    // const { location } = req.body.listing;

    // 🗺️ Use actual location input, not hardcoded "NewDelhi"
    // const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${req.body.listing.location}&format=json`);
    // if (!response.ok) {
    //     req.flash("error", "Error fetching location data from OpenStreetMap!");
    //     return res.redirect("/listings/new");
    // }
    // const data = await response.json();

    // if (!data.length) {
    //   req.flash("error", "Location not found!");
    //   return res.redirect("/listings/new");
    // }

    //const [lon, lat] = [data[0].lon, data[0].lat];
    // const [lon, lat] = [parseFloat(data[0].lon), parseFloat(data[0].lat)];

    
    // Print the coordinates to the console (server side)
    // console.log("Latitude:", lat);
    // console.log("Longitude:", lon);


    const newListing = new Listing(req.body.listing);
    // newListing.geometry = { type: "Point", coordinates: [lon, lat] };

    // 💾 Optional image upload handling
    const url = req.file?.path || "";
    const filename = req.file?.filename || "";
    newListing.image = { url, filename };

    newListing.owner = req.user._id;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error in createListing:", err);
    next(err); // Send to global error handler
  }
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are requested for does not exist!");
        return res.redirect("/listings");
      }
    
    let originalImageUrl = listing.image.url ;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_20");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    };
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};