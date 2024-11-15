const express = require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require('express-session');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionOptions));

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log("Error connecting to database");
    console.log(err);
});

app.get("/",(req,res)=>{
    res.send("I am root");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log('Server is running on port 8080');
});