const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(()=>{
        console.log("Connection Successful!");
    })
    .catch((err)=>{console.log(err)});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/new_Wanderlust");
}   

const initDB = async() =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "6841b6b396cf3a6251f9ad27" }));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialize");
};

initDB();