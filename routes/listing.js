const express = require("express");
const router = express.Router();
const wrapAsync =  require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image][url]"), wrapAsync(listingController.createListing))
    
//Index Route
//router.get("/",wrapAsync(listingController.index));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//Show Route
    // app.get("/listings/:id",async(req,res)=>{
    //     let {id} = req.params;
    //     const listing = await Listing.findById(id);
    //     res.render("listings/show.ejs",{listing});
    // });
//router.get("/:id", wrapAsync(listingController.showListing));
  

//Create Route
// router.post("/",validateListing,
//     wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Update Route
//router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//Delete Route
//router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;