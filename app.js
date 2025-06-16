if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
//console.log(process.env.secret);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Review = require("./models/review.js");
const wrapAsync =  require("./utils/wrapAsync.js")
const ExpressError =  require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash =  require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//const MONGO_URl = "mongodb://127.0.0.1:27017/new_Wanderlust";
const dbUrl = process.env.ATLAS_DB_URL;

main()
    .then(()=>{
        console.log("Connection Successful!");
    })
    .catch((err)=>{console.log(err)});


async function main() {
    await mongoose.connect(dbUrl);
} 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));//to access css and html files
app.use(express.urlencoded({extended:true})); //access to url body 
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("Error is MONGO SESSION STORE ",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true ,
    cookie:{
        expires :Date.now() + 7*24*60*60*1000,//7 days hrs,minutes,seconds,milisecs
        maxAge : 7*24*60*60*1000,
        httpOnly:true,
    }
};
//Root Route
// app.get("/",(req,res)=>{
//     res.send("Root is Working Well!");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    //console.log(res.locals.success);
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registerUser = await User.register(fakeUser,"hello");
//     res.send(registerUser);
// });


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get("/testList",async(req,res)=>{
//     let sampleList = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price : 2500,
//         location : "Calangute,Goa",
//         country : "India",
//     });

//     await sampleList
//         .save()
//         .then((res)=>{
//             console.log(res)
//         })
//         .catch((err)=>{
//             console.log(err);
//         });
//     console.log("Sample was saved!");    
//     res.send("Successful");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"))
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message,err});
    // res.status(statusCode).send(message);
});
app.listen(port,()=>{
    console.log(`App is listening to port ${port}`);
});